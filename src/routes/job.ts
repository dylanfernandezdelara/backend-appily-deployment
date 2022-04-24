import { Request, Response, Router } from "express";
import { CallbackError } from "mongoose";
import mongoose from "mongoose";
import { Job, Company } from "../models";
import { IJob } from "../types";

const router = Router();
mongoose.Promise= global.Promise;

const addCount = async (companyID: string, stage: string, diff: number) => {
  console.log(companyID);
  try{
    const company = await Company.findOne({ _id: companyID });
    let val = company.count.get(stage);
    if(val == undefined) val = 0;
    await company.count.set(stage, val + diff);
    await company.save();
  } catch(error){
    console.log(error);
  }
};

router.post("/", (req: Request, res: Response) => {
  try{
    const job = req.body;
    const newJob = new Job(job);
    newJob.save(async (err: CallbackError, savedJob: IJob) => {
      if(err) return res.status(500).send("A database error occurred.");
      if(savedJob.companyID){
        await addCount(savedJob.companyID, savedJob.stage, 1);
      }
      return res.json(savedJob);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("A database error occurred.");
  }
});

router.patch("/:jobID", async (req: Request, res: Response) => {
  try{
    const patchJob: IJob = req.body;
    const filter = { _id: req.params.jobID };
    const job = await Job.findOne(filter);
    if(job){
      const oldStage = job.stage;
      const oldCompany = job.companyID;
      if(!patchJob.companyID){
        patchJob.companyID = undefined;
      }
      await job.set(patchJob);
      await job.save();
      if(oldCompany){
        await addCount(oldCompany, oldStage, -1);
      }
      if(job.companyID){
        await addCount(job.companyID, job.stage, 1);
      }
    }
    else{
      return res.status(404).send("Job not found.");
    }
    const opts = { new: true, runValidators: true };
    Job.findOneAndUpdate(filter, patchJob, opts, async (err: CallbackError, savedJob: IJob) => {
      if(err) return res.status(500).send("A database error occurred.");
      return res.json(savedJob);
    });
  } catch(error){
    return res.status(500).send("A database error occurred.");
  }
});

router.delete("/:jobID", (req: Request, res: Response) => {
  try{
    Job.findByIdAndDelete({ _id: req.params.jobID }, async (err: CallbackError, deletedJob: IJob) => {
      if (!deletedJob) return res.status(404).send("Job not found.");
      else if (err) return res.status(500).send("A database error occurred.");
      if(deletedJob.companyID){
        await addCount(deletedJob.companyID, deletedJob.stage, -1);
      }
      return res.status(200).send("Job deleted.");
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("A database error occurred.");
  }
});

router.get("/:jobID/todos", async (req: Request, res: Response) => {
  try{
    if (!mongoose.isValidObjectId(req.params.jobID)) return res.status(400).send("Invalid job ID.");
    const filter = { _id: req.params.jobID };
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
  } catch(error){
    console.log(error);
    res.status(500).send("A database error occurred.");
  }
});

export default router;
