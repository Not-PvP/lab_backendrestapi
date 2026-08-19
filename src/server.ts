import express from "express";
import dotenv from "dotenv";
import customersRouter from "./routes/customers";
import productsRouter from "./routes/products";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/products", productsRouter);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});