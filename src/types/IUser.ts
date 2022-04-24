import { IJob } from "./IJob";
import { ITodo } from "./ITodo";

export interface IUser {
  _id?: string;
  email: string; 
  password: string;
  jobs?: IJob[];
  todos?: ITodo[];
  checkPassword?: (password: string) => boolean;
}
