import mongoose from "mongoose";
import { ICompany } from "../types";

const CompanySchema = new mongoose.Schema({
  companyName:{
    type: String,
    required: true
  },
  companyURL:{
    type: String
  },
  iconURL:{
    type: String
  },
  count:{
    type: Map,
    of: Number,
    default: new Map<string, number>()
  }
});

export const Company = mongoose.model<ICompany & mongoose.Document>("Company", CompanySchema);
export default Company;
