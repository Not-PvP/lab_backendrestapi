import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM order_item WHERE order_id = $1", [orderId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { order_id, product_id, quantity, discount } = req.body;

  if (!order_id || !product_id) {
    return res.status(400).json({ error: "order_id and product_id are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO order_item (order_id, product_id, quantity, discount) VALUES ($1, $2, $3, $4) RETURNING *",
      [order_id, product_id, quantity, discount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "This order_id/product_id combination already exists" });
    }
    if (error.code === "23503") {
      return res.status(400).json({ error: "order_id or product_id does not exist" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;