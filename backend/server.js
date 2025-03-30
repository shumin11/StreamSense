import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to StreamWise AI Backend with Node.js!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use(
    cors({
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"],
    })
);
