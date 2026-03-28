import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import verdictRouter from './routes/verdict.js';
import decisionRouter from './routes/decision.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Root route hit");
  res.send("Server is alive");
});

app.get("/api/health", (req, res) => {
  console.log("Health route hit");
  res.json({ status: "ok" });
});

app.use('/api/verdict', verdictRouter);
app.use('/api/decision', decisionRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});