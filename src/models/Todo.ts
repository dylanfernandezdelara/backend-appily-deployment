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
  deadline:{
    type: Date,
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

export const Todo = mongoose.model<ITodo & mongoose.Document>("Todo", TodoSchema);
export default Todo;
