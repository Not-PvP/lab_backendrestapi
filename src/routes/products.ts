import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { category } = req.query;
  try {
    if (category) {
      const result = await pool.query(
        "SELECT * FROM product WHERE category = $1",
        [category]
      );
      return res.status(200).json(result.rows);
    }
    const result = await pool.query("SELECT * FROM product");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM product WHERE product_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { product_id, product_name, category, unit_price } = req.body;

  if (!product_id || !product_name) {
    return res
      .status(400)
      .json({ error: "product_id and product_name are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO product (product_id, product_name, category, unit_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [product_id, product_name, category, unit_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(400).json({ error: "product_id already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:id/price", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { unit_price } = req.body;

  if (unit_price === undefined) {
    return res.status(400).json({ error: "unit_price is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE product SET unit_price = $1 WHERE product_id = $2 RETURNING *`,
      [unit_price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;