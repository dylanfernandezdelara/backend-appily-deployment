import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types"

const UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  }
});

UserSchema.set('toJSON', {
  virtuals: true
});

UserSchema.set('toObject', {
  virtuals: true
});

UserSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.checkPassword = function(password: string) {
  return bcrypt.compareSync(password, this.password)
};

UserSchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "userID"
});

UserSchema.virtual("todos", {
  ref: "Todo",
  localField: "_id",
  foreignField: "userID"
})

export const User = mongoose.model<IUser & mongoose.Document>("User", UserSchema);
export default User;
