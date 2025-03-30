import express from "express";
import client from "../utils/azureClient.js";
import dbPromise from "../utils/db.js"; // your sqlite DB

const router = express.Router();

/**
 * POST /api/ai/query
 * Body: { messages: [{ role: string, content: string }] }
 */
router.post("/query", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "No messages provided." });
  }

  // Get the last user message from the messages array
  const lastUserMessage = messages
    .filter((msg) => msg.role === "user")
    .pop()?.content;

  if (!lastUserMessage) {
    return res
      .status(400)
      .json({ error: "No user message found in the conversation." });
  }

  try {
    // First, determine if this is a database query or general conversation
    const intentPrompt = [
      {
        role: "system",
        content: `
          You are an intent classifier. Determine if the user's message requires database access or is a general conversation.
          Return ONLY "database" or "conversation" as your response.
          
          Database queries are questions about future shows, subscriptions, or streaming services that would require looking up data.
          General conversation includes greetings, small talk, or questions not related to the database content.
        `,
      },
      {
        role: "user",
        content: lastUserMessage,
      },
    ];

    const intentResponse = await client.path("chat/completions").post({
      body: {
        messages: intentPrompt,
        max_tokens: 50,
        model: process.env.DEPLOYMENT_NAME,
        temperature: 0,
      },
    });

    if (intentResponse.status !== "200") {
      throw new Error(
        `Azure AI intent classification error: ${intentResponse.body}`
      );
    }

    const intent = intentResponse.body.choices[0]?.message?.content
      ?.trim()
      .toLowerCase();
    console.log("🎯 Detected intent:", intent);

    if (intent === "conversation") {
      // Handle general conversation
      const conversationPrompt = [
        {
          role: "system",
          content: `
            You are a helpful AI assistant for StreamWise, a streaming service recommendation platform.
            Be friendly and concise in your responses.
            If the user is asking about your capabilities, mention that you can help with:
            - Finding shows and movies
            - Comparing streaming service prices
            - Getting recommendations based on preferences
            - Answering questions about streaming platforms
          `,
        },
        ...messages.slice(-5), // Include last 5 messages for context
      ];

      const conversationResponse = await client.path("chat/completions").post({
        body: {
          messages: conversationPrompt,
          max_tokens: 300,
          model: process.env.DEPLOYMENT_NAME,
        },
      });

      if (conversationResponse.status !== "200") {
        throw new Error(
          `Azure AI conversation error: ${conversationResponse.body}`
        );
      }

      const conversationAnswer =
        conversationResponse.body.choices[0]?.message?.content;
      return res.json({
        answer: conversationAnswer,
        data: null,
      });
    }

    // If intent is "database", proceed with the existing database query logic
    const queryGenerationPrompt = [
      {
        role: "system",
        content: `
          You are a SQL expert. The user wants data from my SQLite database.
          We have two tables:

          1) shows(id, platform, title, releaseDate, genre, synopsis, cast, imageUrl, resourceLink)
          2) subscriptions(id, platform, planName, priceUSD, priceCAD, features, subscriptionLink)

          The user query is: "${lastUserMessage}"
          
          IMPORTANT RULES:
          1. Return ONLY a SELECT query
          2. Do not include any DROP, INSERT, UPDATE, DELETE, or other modifying statements
          3. Use simple SELECT statements with WHERE clauses if needed
          4. Do not use subqueries or complex joins unless absolutely necessary
          5. If the query cannot be safely generated, return "NO_QUERY"
          6. Format the response as: "QUERY: your_sql_query_here"
        `,
      },
      {
        role: "user",
        content: lastUserMessage,
      },
    ];

    console.log("🔎 Generating SQL query for user input:", lastUserMessage);

    const sqlResponse = await client.path("chat/completions").post({
      body: {
        messages: queryGenerationPrompt,
        max_tokens: 400,
        model: process.env.DEPLOYMENT_NAME,
        temperature: 0,
      },
    });

    if (sqlResponse.status !== "200") {
      throw new Error(`Azure AI SQL generation error: ${sqlResponse.body}`);
    }

    const sqlResponseText =
      sqlResponse.body.choices[0]?.message?.content?.trim();
    console.log("📝 Raw SQL response:", sqlResponseText);

    // Check if the response indicates no query should be generated
    if (sqlResponseText === "NO_QUERY") {
      const noQueryPrompt = [
        {
          role: "system",
          content: `
            The user's question cannot be answered with a database query.
            Provide a helpful response explaining what information you can help with instead.
            Mention that you can help with:
            - Finding shows and movies
            - Comparing streaming service prices
            - Getting recommendations based on preferences
            - Answering questions about streaming platforms
          `,
        },
        {
          role: "user",
          content: lastUserMessage,
        },
      ];

      const noQueryResponse = await client.path("chat/completions").post({
        body: {
          messages: noQueryPrompt,
          max_tokens: 300,
          model: process.env.DEPLOYMENT_NAME,
        },
      });

      if (noQueryResponse.status !== "200") {
        throw new Error(
          `Azure AI no-query response error: ${noQueryResponse.body}`
        );
      }

      return res.json({
        answer: noQueryResponse.body.choices[0]?.message?.content,
        data: null,
      });
    }

    // Extract the SQL query from the response
    const sqlQuery = sqlResponseText.replace(/^QUERY:\s*/i, "").trim();
    console.log("📝 Proposed SQL query from AI:", sqlQuery);

    // Validate the SQL query
    if (!sqlQuery.toLowerCase().startsWith("select")) {
      throw new Error("Generated SQL is not a SELECT query");
    }

    // Additional safety checks
    const unsafeKeywords = [
      "drop",
      "delete",
      "update",
      "insert",
      "alter",
      "create",
      "replace",
      "attach",
      "detach",
      "vacuum",
      "pragma",
    ];
    if (
      unsafeKeywords.some((keyword) => sqlQuery.toLowerCase().includes(keyword))
    ) {
      throw new Error("Generated SQL contains potentially unsafe keywords");
    }

    const db = await dbPromise;
    let queryResult;
    try {
      queryResult = await db.all(sqlQuery);
      console.log("✅ Query executed successfully. Results:", queryResult);
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      throw new Error("Error executing database query: " + dbError.message);
    }

    const answerPrompt = [
      {
        role: "system",
        content: `
          You are a helpful assistant that takes database results and formats them in a clear, organized way.
          
          The user originally asked: "${lastUserMessage}"
          
          If the results contain show information, present each show's details in a clear and easy-to-read format.
          Format each show's information in the following style:
          
          <div class="show-card">
            <h3>🎬 Title: The Example Show</h3>
            <p>📺 Platform: Netflix</p>
            <p>📅 Release Date: 2023-10-01</p>
            <p>🎭 Genre: Comedy</p>
            <p>📚 Synopsis: A witty show about daily life.</p>
            <p>👥 Cast: John Doe, Jane Smith</p>
            <img src="https://example.com/show-image.jpg" alt="The Example Show" width="300" />
          </div>
          
          Important:
          - Use HTML tags for better formatting
          - Do NOT use markdown syntax (**) in the HTML output
          - For each show, display the image using the <img> tag
          - If no image is available, display "No image available"
          - If no results are found, say: "No matching shows found"
          - Use proper HTML structure with divs and paragraphs
        `,
      },
      {
        role: "user",
        content: JSON.stringify(queryResult),
      },
    ];

    const finalResponse = await client.path("chat/completions").post({
      body: {
        messages: answerPrompt,
        max_tokens: 800,
        model: process.env.DEPLOYMENT_NAME,
      },
    });

    if (finalResponse.status !== "200") {
      throw new Error(`Azure AI final answer error: ${finalResponse.body}`);
    }

    const finalAnswer = finalResponse.body.choices[0]?.message?.content;
    console.log("🤖 AI final answer:", finalAnswer);

    // 4. Return final answer (plus the raw data if desired)
    res.json({
      answer: finalAnswer,
      data: queryResult,
    });
  } catch (err) {
    console.error("❌ Error in /api/ai/query route:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
