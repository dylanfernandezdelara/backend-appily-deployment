import request from "supertest";
import app from "../app";
import { connectMongoose, disconnectMongoose } from "../testUtils/mongoose";
import { Job, Todo, User } from "../models";

describe("User Tests", () => {
    let testJobs: typeof Job[] = [];
    let testTodos: typeof Todo[] = [];
    let jobCount = 0;
    let todoCount = 0;
    beforeEach(async () => {
      await connectMongoose();
    });

afterEach(async () => {
    await Promise.all(testJobs.map((job) => job.remove()));
    await Promise.all(testTodos.map((todo) => todo.remove()));
    await disconnectMongoose();
    });

describe("Get Jobs for a User", () => {
    test("GET Request for valid UserID's Jobs", async () => {  
        const existingJob = (await User.findOne());
        if (!existingJob) {
            const res = await request(app).get("/user" + "/jobs");
            expect(res.status).toEqual(404);
            return;
        }
        const existingJobID = existingJob._id;
        const res = await request(app).get("/user/" + existingJobID + "/jobs");
        expect(res.status).toEqual(200);
        expect(res.body).toBeInstanceOf(Array)
        jobCount = res.body.length;
        expect(jobCount).toBeGreaterThanOrEqual(0);
    });
    test("GET Request for invalid UserID's Jobs", async () => {
        const invalidID = "12377d83f1c05be17ceea25d";
        const res = await request(app).get("/user/" + invalidID + "/jobs");
        expect(res.status).toEqual(500);
    });

    });

describe("Get Todos for a User", () => {
    test("GET Request for valid UserID's Todos", async () => {
        const existingJob = (await User.findOne());
        if (!existingJob) {
            const res = await request(app).get("/user" + "/todos");
            expect(res.status).toEqual(404);
            return;
        }
        const existingJobID = existingJob._id;

        const res = await request(app).get("/user/" + existingJobID + "/todos");
        expect(res.status).toEqual(200);
        expect(res.body).toBeInstanceOf(Array)
        jobCount = res.body.length;
        expect(jobCount).toBeGreaterThanOrEqual(0);
    });

    test("GET Request for invalid UserID's Jobs", async () => {  
        const invalidID = "12377d83f1c05be17ceea25d";
        const res = await request(app).get("/user/" + invalidID + "/todos");
        expect(res.status).toEqual(500);
    });

    });

});