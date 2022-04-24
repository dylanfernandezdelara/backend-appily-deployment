import {  IUser, IJob, ICompany } from "../types";
import { User, Job, Company } from "../models";
import { CallbackError, NativeError } from "mongoose";

const nodemailer = require("nodemailer");

//email account credentials, TODO: make private
const email="appilyreminders@gmail.com"
const password="appilyRemind101"

const transport = {
  //all of the configuration for sending email
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass: password
  }
};

const transporter = nodemailer.createTransport(transport);

async function sendTestMail(){
    const mail = {
        from: '"Appily Mailer" '+email,
        to: email,
        subject: "Testing email.",
        text: "Hello world?",
        html: "<b> Hello world??? </b>"
      }
      
    let info = await transporter.sendMail(mail);
    return info;
}

async function sendMail(to: string, subject: string, text: string, html:string){
    const mail = {
        from: '"Appily Mailer" '+email,
        to: to,
        subject: subject,
        text: text,
        html: html
      }
      
    let info = await transporter.sendMail(mail);
    return info;
}

async function sendDigestToUser(userId:string){
    const filter = { _id: userId };
    //const user = await User.findOne(filter);
    const user = await User.findOne({});
    if(user){
        let jobs = await (await user.populate("jobs")).jobs;
        let to = user.email;
        to = email;
        let html:string  = await generateDigestHTML(user.email, jobs);
        let text = await generateDigestText(user.email, jobs);
        let subject = "Your Appily Digest";

        return await sendMail(to, subject, text, html);
    }
}

async function generateDigestText(name:string, jobs:any){
  return await generateDigestHTML(name, jobs);
}

async function generateDigestHTML(name:string, jobs:any){
  let header = `<h1>Appily Digest Email</h1> <p>Hello ${name},\n Here is your Appily daily digest:</p>`;

  let body = "";

  for(let job of jobs){
    let company = await job.getCompanyName();
    body += `<p><b>Company</b>: ${company}   <b>Title</b>: ${job.jobTitle}<p>` ;
  }

  let footer = `<p>You received this email because you are opted in for notifications. To turn off notifications, please visit <a href="appily.com">appily.com</a></p>`;

  return header + body + footer;
}

async function sendAllDigestEmails(){

}

export {sendTestMail, sendDigestToUser}
export default sendTestMail