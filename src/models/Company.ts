import mongoose from "mongoose";
import { ICompany } from "../types";

const CompanySchema = new mongoose.Schema({
  companyName:{
      type: String,
      required: true
  }
});

export const Company = mongoose.model<ICompany & mongoose.Document>("Company", CompanySchema);
export default Company;
