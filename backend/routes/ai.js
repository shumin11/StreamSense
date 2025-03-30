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
          
          <table class="show-table">
            <tr>
              <th>Title</th>
              <th>Platform</th>
              <th>Release Date</th>
              <th>Genre</th>
              <th>Cast</th>
            </tr>
            <tr>
              <td>
                <div class="show-title">🎬 The Example Show</div>
                <div class="show-synopsis">A witty show about daily life.</div>
                <img src="https://example.com/show-image.jpg" alt="The Example Show" width="200" />
              </td>
              <td>📺 Netflix</td>
              <td>📅 2023-10-01</td>
              <td>🎭 Comedy</td>
              <td>👥 John Doe, Jane Smith</td>
            </tr>
          </table>
          
          If the results contain subscription information, format each subscription in the following style:
          
          <table class="subscription-table">
            <tr>
              <th>Netflix</th>
              <th>Amazon Prime Video</th>
              <th>Disney+</th>
            </tr>
            <tr>
              <td>
                <div class="plan-name">Basic Plan</div>
                <div class="price">$6.99 USD / $7.99 CAD</div>
                <div class="features">Features: Ad-supported, Single device, HD quality</div>
                <div class="plan-name">Standard Plan</div>
                <div class="price">$15.49 USD / $16.49 CAD</div>
                <div class="features">Features: Ad-free, 2 devices, HD quality</div>
                <div class="plan-name">Premium Plan</div>
                <div class="price">$22.99 USD / $23.99 CAD</div>
                <div class="features">Features: Ad-free, 4 devices, 4K quality</div>
                <a href="https://netflix.com/signup" class="subscribe-btn" target="_blank">Subscribe Now</a>
              </td>
              <td>
                <div class="plan-name">Basic Plan</div>
                <div class="price">$8.99 USD / $9.99 CAD</div>
                <div class="features">Features: Ad-supported, Single device, HD quality</div>
                <div class="plan-name">Premium Plan</div>
                <div class="price">$14.99 USD / $16.99 CAD</div>
                <div class="features">Features: Ad-free, Unlimited devices, 4K quality, Free shipping</div>
                <a href="https://amazon.com/prime" class="subscribe-btn" target="_blank">Subscribe Now</a>
              </td>
              <td>
                <div class="plan-name">Basic Plan</div>
                <div class="price">$7.99 USD / $8.99 CAD</div>
                <div class="features">Features: Ad-supported, 4 devices, HD quality</div>
                <div class="plan-name">Standard Plan</div>
                <div class="price">$13.99 USD / $14.99 CAD</div>
                <div class="features">Features: Ad-free, 4 devices, 4K quality, HDR</div>
                <div class="plan-name">Premium Plan</div>
                <div class="price">$19.99 USD / $21.99 CAD</div>
                <div class="features">Features: Ad-free, 4 devices, 4K quality, HDR, Exclusive content</div>
                <a href="https://disneyplus.com" class="subscribe-btn" target="_blank">Subscribe Now</a>
              </td>
            </tr>
          </table>
          
          Important:
          - Use HTML tags for better formatting
          - Do NOT use markdown syntax (**) in the HTML output
          - For shows, display the image using the <img> tag
          - For subscriptions:
            * Show the platform name as the header
            * List each plan with its price in both USD and CAD
            * Include the features for each plan
            * Add a subscription link if available
          - If no image is available for shows, display "No image available"
          - If no results are found, say: "No matching results found"
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
