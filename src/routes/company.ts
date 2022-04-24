import { Request, Response, Router } from "express";
import { Company } from "../models";
import { CallbackError, NativeError } from "mongoose";
import { ICompany } from "../types";

const router = Router();

router.get("/", async(req: Request, res: Response) => {
  try {
    const companies = await Company.find();
    res.send(companies);
  } catch (err) {
    res.status(500).send("A database error occurred.");
  }
});

// router.post("/:companyID", (req: Request, res: Response) => {
//   const company = req.body;
//   company.count = new Map<string, number>();
//   company.count.set("Wishlist", 0);
//   company.count.set("Submitted", 0);
//   company.count.set("OA", 0);
//   company.count.set("Interview", 0);
//   company.count.set("Offer", 0);
//   company.count.set("Rejected", 0);
//   const newCompany = new Company(company);
//   newCompany.save((err: CallbackError, savedCompany: ICompany) => {
//     if (err) return res.status(500).send("A database error occurred.");
//     return res.json(savedCompany);
//   });
// });

export default router;
