import mongoose, { Schema } from "mongoose";
import { IJob } from "../types";
import {Company} from "../models";

const STAGES = ["Wishlist", "Submitted", "OA", "Interview", "Offer", "Rejected"];

const JobSchema = new mongoose.Schema({
  userID:{
    type: Schema.Types.ObjectId,
    required: true
  },
  companyID:{
    type: Schema.Types.ObjectId
  },
  customCompany:{
    type: String
  },
  jobTitle:{
    type: String,
    required: true
  },
  stage:{
    type: String,
    enum: {
      values: STAGES,
      message: "Invalid stage"
    },
    required: true
  },
  url:{
    type: String
  },
  details:{
    type: String
  },
  location:{
    type: String
  },
  contacts:{
    type: String
  }
});

JobSchema.set("toJSON", {
  virtuals: true
});

JobSchema.set("toObject", {
  virtuals: true
});

JobSchema.virtual("todos", {
  ref: "Todo",
  localField: "_id",
  foreignField: "jobID"
});

JobSchema.virtual("company", {
  ref: "Company",
  localField: "companyID",
  foreignField: "_id",
  justOne: true
});

JobSchema.methods.getCompanyName = async function(){
  const company = await Company.findById(this.companyID);
  if(company){
    return company.companyName;
  }else{
    return "";
  }
};


export const Job = mongoose.model<IJob & mongoose.Document>("Job", JobSchema);
export default Job;
