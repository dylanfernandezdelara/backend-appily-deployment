import request from "supertest";
import app from "../app";
import { connectMongoose, disconnectMongoose } from "../testUtils/mongoose";
import { Job, Todo, User } from "../models";
import mongoose from "mongoose";

describe("Todo Tests", () => {
  beforeEach(async () => {
    await connectMongoose();
  });

  afterEach(async () => {
    await disconnectMongoose();
  });

  describe("Todo Manipulation", () => {
    let newTodoID: mongoose.Types.ObjectId;
    test("POST Request and create Todo", async () => { 
      const existingUser = (await User.findOne());
      if (!existingUser) {
        const res = await request(app).post("/todo").send("");
        expect(res.status).toEqual(500);
        return;
      }
      const existingUserID = existingUser._id;
      const existingJobID = (await Job.findOne({"userID":existingUserID}))._id;
      const newTodo = {
        "userID" : existingUserID,
        "jobID": existingJobID,
        "deadline" : "2024-12-12T00:00:00.000+00:00",
        "description" : "TEST FINISH TODO TEST",
        "done" : "false",
      };
      const res = await request(app).post("/todo").send(newTodo);
      expect(res.status).toEqual(200);
      newTodoID = res.body._id;
    });

    test("POST Request and with invalid Todo object", async () => { 
      const invalidTodo = {
        "invalid" : "invalid"
      };
      const res = await request(app).post("/todo").send(invalidTodo);
      expect(res.status).toEqual(500);
    });

    test("PATCH Request on created Todo", async () => {
      if (!newTodoID) {
        const res = await request(app).patch("/todo/" + newTodoID).set("done", "true").send();
        expect(res.status).toEqual(404);
        return;
      }
      const res = await request(app).patch("/todo/" + newTodoID).set("done", "true").send();
      expect(res.status).toEqual(200);
    });

    test("PATCH Bad Request on created Todo", async () => { 
      if (!newTodoID) {
        const res = await request(app).patch("/todo/" + newTodoID).set("done", "true").send();
        expect(res.status).toEqual(404);
        return;
      }
      const res = await request(app).patch("/todo/" + newTodoID).set("invalid", "true").send();
      expect(res.status).toEqual(200);
    });

    test("DELETE Request on created Todo", async () => { 
      const createdTodo = (await Todo.findOne({"_id":newTodoID}));
      if (!createdTodo) {
        const res = await request(app).delete("/todo/" + newTodoID);
        expect(res.status).toEqual(404);
        return;
      }

      const createdtoID = createdTodo._id;
      const res = await request(app).delete("/todo/" + newTodoID);
      expect(res.status).toEqual(200);
    });

    test("DELETE Request on invalid Todo ID", async () => { 
      const invalidTodoID = "12377d83f1c05be17ceea25d";
      const res = await request(app).delete("/todo/" + invalidTodoID);
      expect(res.status).toEqual(404);
    });
  });

});