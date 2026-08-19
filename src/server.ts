import express from "express";
import dotenv from "dotenv";
import customerRouter from "./routes/customer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/customer", customerRouter);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});