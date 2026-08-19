import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get ("/", async(req: Request, res: Response) => {
    try {
        const result = await pool.query(
            "SELECT * FROM vendors",
        );

    res.status(200).json(result.rows);
     
    } catch (error) {
    console.error(error),
    res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;