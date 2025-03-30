// backend/routes/ai.js
import express from "express";
import client from "../utils/azureClient.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    console.error("❌ Invalid messages format.");
    return res.status("400").json({ error: "Invalid messages format." });
  }

  try {
    console.log(
      "📡 Sending request to Azure AI with payload:",
      JSON.stringify(messages, null, 2)
    );
    const response = await client.path("chat/completions").post({
      body: {
        messages: messages,
        max_tokens: 1000,
        model: process.env.DEPLOYMENT_NAME,
      },
    });

    // Check the actual response status from Azure API
    if (response.status !== "200") {
      console.log(response.status);
      console.error("❌ Error from Azure AI:", response.body);
      return res
        .status("500")
        .json({ error: "Failed to get AI response.", details: response.body });
    }

    console.log(
      "✅ AI response received successfully:",
      JSON.stringify(response.body, null, 2)
    );
    res.status("200").json(response.body);
  } catch (error) {
    console.error("❌ Error while calling Azure AI:", error.message || error);
    res
      .status("500")
      .json({ error: "Internal server error.", details: error.message });
  }
});

export default router;
