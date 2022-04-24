import { Request, Response, Router } from "express";
import { Callback, CallbackError, NativeError } from "mongoose";
import { Job, User } from "../models";

const router = Router();

router.get('/:userID/jobs', async (req: Request, res: Response) => {
  const filter = { _id: req.params.userID };
  try{
    const user = await User.findOne(filter);
    if(user){
      await user.populate({
        path: "jobs",
        populate: {
          path: "company"
        }
      })
      res.send(user.jobs);
    }
    else{
      res.status(500).send("User not found.");
    }
  } catch(err){
    res.status(500).send("A database error occurred.");
  }
});

router.get('/:userID/todos', async (req: Request, res: Response) => {
  const filter = { _id: req.params.userID };
  try{
    const user = await User.findOne(filter);
    if(user){
      user.populate("todos", (err: CallbackError) => {
        if(err) return res.status(500).send("A database error occurred.");
        res.json(user.todos);
      });
    }
    else{
      res.status(500).send("User not found.");
    }
  } catch(err){
    res.status(500).send("A database error occurred.");
  }
});

export default router;
