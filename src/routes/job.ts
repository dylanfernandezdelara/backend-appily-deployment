import { Request, Response, Router } from "express";
import { CallbackError, NativeError } from "mongoose";
import mongoose from "mongoose";
import { Job } from "../models";
import { IJob } from "../types";

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const job = req.body;
  const newJob = new Job(job);
  newJob.save((err: CallbackError, savedJob: IJob) => {
    if(err) return res.status(500).send("A database error occurred.");
    return res.json(savedJob);
  });
});

router.patch('/:jobID', (req: Request, res: Response) => {
  const patchJob = req.body;
  const filter = { _id: req.params.jobID };
  const opts = { new: true, runValidators: true }
  Job.findOneAndUpdate(filter, patchJob, opts, (err: CallbackError, savedJob: IJob) => {
    if(err) return res.status(500).send("A database error occurred.");
    return res.json(savedJob);
  });
});

router.delete('/:jobID', (req: Request, res: Response) => {
  Job.findByIdAndDelete({ _id: req.params.jobID }, (err: CallbackError, deletedJob: IJob) => {
    if (!deletedJob) return res.status(404).send("Job not found.");
    else if (err) return res.status(500).send("A database error occurred.");
    return res.status(200).send("Job deleted.");
  });
});

router.get('/:jobID/todos', async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.jobID)) return res.status(400).send("Invalid job ID.");
  const filter = { _id: req.params.jobID };
  try{
    const job = await Job.findOne(filter);
    if(job){
      job.populate("todos", (err: CallbackError) => {
        if(err) return res.status(500).send("A database error occurred.");
        res.json(job.todos);
      });
    }
    else{
      res.status(500).send("Job not found.");
    }
  } catch(err){
    res.status(500).send("A database error occurred.");
  }
});

export default router;
