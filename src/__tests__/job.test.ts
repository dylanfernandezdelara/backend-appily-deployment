import request from "supertest";
import app from "../app";
import { connectMongoose, disconnectMongoose } from "../testUtils/mongoose";
import { Job, User } from "../models";
import mongoose from "mongoose";

describe("Job Tests", () => {
  const testJobs: typeof Job[] = [];
  let count = 0;
  beforeEach(async () => {
    await connectMongoose();
  });

  afterEach(async () => {
    await Promise.all(testJobs.map((job) => job.remove()));
    await disconnectMongoose();
  });

  describe("Get Todos for a Job", () => {
    test("GET Request on existing JobID", async () => {
      const existingJob = (await Job.findOne());
      if (!existingJob) {
        const res = await request(app).get("/job/todos");
        expect(res.status).toEqual(404);
        return;
      }
      const existingJobID = existingJob._id;
      const res = await request(app).get("/job/" + existingJobID + "/todos");
      expect(res.status).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      count = res.body.length;
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test("GET Request on invalid bit length ObjectID", async () => {
      const invalidObjectID = "123";
      const ret = await request(app).get("/job/" + invalidObjectID + "/todos");
      expect(ret.status).toEqual(400);
    });

    test("GET Request on nonexisting JobID", async () => {
      const nonExistingJobID = "72377d83f1c05be17ceea25d"; // valid 12 bit string
      const retu = await request(app).get("/job/" + nonExistingJobID + "/todos");
      expect(retu.status).toEqual(500);
    });

  });

  // describe("Job Manipulation", () => {
  //   const newCompanyID = new mongoose.Types.ObjectId();
  //   let foundID: mongoose.Types.ObjectId;
  //   test("POST Request and create job", async () => { 
  //     const existingUser = (await User.findOne());
  //     if (!existingUser) {
  //       const res = await request(app).post("/job/").send("");
  //       expect(res.status).toEqual(500);
  //       return;
  //     }
  //     const existingUserID = existingUser._id;
  //     foundID = existingUserID;
  //     const jobDetails = {
  //       "userID" : existingUserID,
  //       "companyID": newCompanyID,
  //       "jobTitle" : "Intern",
  //       "stage" : "Wishlist",
  //       "url" : "TESTING POST REQ JOB",
  //       "details" : "TESTING POST REQ JOB",
  //     };
  //     const res = await request(app).post("/job/").send(jobDetails);
  //     //expect(res.status).toEqual(200);
  //   });

  //   test("POST Request and with invalid Job object", async () => { 
  //     const jobDetails = {
  //       "userID" : "72377d83f1c05be17ceea25d",
  //       "companyID": newCompanyID,
  //       "jobTitle" : "CEO",
  //       "stage" : "Which stage?",
  //       "url" : "",
  //       "details" : "",
  //     };
  //     const res = await request(app).post("/job/").send(jobDetails);
  //     expect(res.status).toEqual(500);
  //   });

  //   test("PATCH Request on created job", async () => {
  //     if (!foundID) {
  //       const res = await request(app).patch("/job/" + foundID).set("url", "TESTING PATCH REQ JOB").send();
  //       expect(res.status).toEqual(500);
  //       return;
  //     }
  //     const res = await request(app).patch("/job/" + foundID).set("url", "TESTING PATCH REQ JOB").send();
  //     expect(res.status).toEqual(200);
  //   });

  //   test("DELETE Request on created job", async () => { 
  //     const createdJob = (await Job.findOne({"companyID":newCompanyID}));
  //     if (!createdJob) {
  //       const res = await request(app).delete("/job/");
  //       expect(res.status).toEqual(404);
  //       return;
  //     }
  //     const createdJobID = createdJob._id;
  //     const res = await request(app).delete("/job/" + createdJobID);
  //     expect(res.status).toEqual(200);
  //   });

  //   test("DELETE Request on invalid job ID", async () => { 
  //     const createdJobID = "12377d83f1c05be17ceea25d";
  //     const res = await request(app).delete("/job/" + createdJobID);
  //     expect(res.status).toEqual(404);
  //   });

  // });

});