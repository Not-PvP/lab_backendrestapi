import express from "express";
import dotenv from "dotenv";
import customersRouter from "./routes/customers";
import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import orderItemsRouter from "./routes/order_items";
import vendorsRouter from "./routes/vendors";
import suppliesRouter from "./routes/supplies";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/order-items", orderItemsRouter);
app.use("/api/v1/vendors", vendorsRouter);
app.use("/api/v1/supplies", suppliesRouter);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});