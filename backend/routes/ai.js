// backend/routes/ai.js
import express from "express";
import client from "../utils/azureClient.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await client.path("chat/completions").post({
      body: {
        messages: messages,
        max_tokens: 1000,
        model: process.env.DEPLOYMENT_NAME,
      },
    });

    res.status(200).json(response.body);
  } catch (error) {
    console.error("Error calling Azure AI:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

export default router;
