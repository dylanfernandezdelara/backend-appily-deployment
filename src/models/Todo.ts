import mongoose, { Schema } from "mongoose";
import { ITodo } from "../types";

const TodoSchema = new Schema({
  userID:{
    type: Schema.Types.ObjectId,
    required: true
  },
  jobID:{
    type: Schema.Types.ObjectId,
    required: true
  },
  companyID:{
    type: Schema.Types.ObjectId
  },
  deadline:{
    type: Date,
  },
  startDate:{
    type: Date
  },
  description:{
    type: String
  },
  done:{
    type: Boolean,
    required: true,
    default: false
  }
});

TodoSchema.set("toJSON", {
  virtuals: true
});

TodoSchema.set("toObject", {
  virtuals: true
});

TodoSchema.virtual("company", {
  ref: "Company",
  localField: "companyID",
  foreignField: "_id",
  justOne: true
});

export const Todo = mongoose.model<ITodo & mongoose.Document>("Todo", TodoSchema);
export default Todo;
