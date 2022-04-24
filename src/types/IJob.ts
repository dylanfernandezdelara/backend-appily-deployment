import { ITodo } from "./ITodo";
import { ICompany } from "./ICompany";

export interface IJob {
  _id?: string;
  userID: string;
  companyID: string;
  jobTitle: string;
  stage: string;
  url?: string;
  details?: string;
  todos: ITodo[];
  company?: ICompany;
};
