// backend/server.js
import express from "express";
import aiRoutes from "./routes/ai.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/ai", aiRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
