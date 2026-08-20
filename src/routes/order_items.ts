import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [orderId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { order_id, product_id, quantity, discount } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO order_items (order_id, product_id, quantity, discount) VALUES ($1, $2, $3, $4) RETURNING *",
      [order_id, product_id, quantity, discount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;