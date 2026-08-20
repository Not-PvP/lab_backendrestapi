import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/vendor/:vendorId", async (req: Request, res: Response) => {
  const { vendorId } = req.params;
  try {
    const result = await pool.query (
      "SELECT * FROM supplies WHERE vendor_id = $1",
      [vendorId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:vendorId/:productId", async (req: Request, res: Response) => { 
  const { vendorId, productId } = req.params;
  const { stock_quantity } = req.body;
  try {
    const result = await pool.query (
      "UPDATE supplies SET stock_quantity = $1 WHERE vendor_id = $2 AND product_id = $3 RETURNING *",
      [stock_quantity, vendorId, productId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Supply not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;