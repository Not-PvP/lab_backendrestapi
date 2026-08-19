import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM customer");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" })
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM customer WHERE customer_id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Customer not found"});
    }

    res.status(200).json(result.rows[0]); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { customer_id, customer_name, city, membership_level } = req.body;

  if (!customer_id || !customer_name) {
    return res
      .status(400)
      .json({ error: "customer_id and customer_name are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO customer (customer_id, customer_name, city, membership_level)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [customer_id, customer_name, city, membership_level]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "customer_id already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { city, membership_level } = req.body;

  try {
    const result = await pool.query(
      `UPDATE customer
       SET city = COALESCE($1, city),
           membership_level = COALESCE($2, membership_level)
       WHERE customer_id = $3
       RETURNING *`,
      [city, membership_level, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Customer not found"});
    }

    res.status(200).json(result.rows[0]); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM customer WHERE customer_id = $1 RETURNING customer_id",
      [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Customer not found"});
    }

    res.status(200).json({ message: "Customer deleted"}); 

  } catch (error: any) {
    console.error(error);
    if (error.code === "23503") {
      return res.status(400).json({ error: "Cannot delete: customer has related orders" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;