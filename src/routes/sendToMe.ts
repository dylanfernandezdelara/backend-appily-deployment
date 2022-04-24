import { Request, Response, Router } from "express";
import { CallbackError, NativeError } from "mongoose";
import { Todo } from "../models";
import { ITodo } from "../types";

import { sendTestMail, sendDigestToUser } from "../mailer";

const router = Router();


router.post("/testmail", async (req: Request, res: Response) => {
  //make mailable object
  const info = await sendTestMail();
  console.log("Message sent: %s", info.messageId);
  return res.status(200).send({message:"All Good! Message Sent"});
});

router.post("/testdiject", async (req: Request, res: Response) => {
  //make mailable object
  const info = await sendDigestToUser(" sfdsfd");
  console.log("Message sent: %s", info.messageId);
  return res.status(200).send({message:"All Good! Message Sent"});
});

export default router;
