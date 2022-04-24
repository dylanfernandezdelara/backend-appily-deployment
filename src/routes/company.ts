import { Request, Response, Router } from "express";
import { Company } from "../models";

const router = Router();

router.get('/', async(req: Request, res: Response) => {
  try {
    const companies = await Company.find();
    res.send(companies)
  } catch (err) {
    res.status(500).send("A database error occurred.");
  }
})

export default router;
