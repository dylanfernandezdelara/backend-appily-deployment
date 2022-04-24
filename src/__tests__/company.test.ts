import request from "supertest";
import app from "../app";
import { connectMongoose, disconnectMongoose } from "../testUtils/mongoose";
import { Company } from "../models";

describe("Company Tests", () => {
    let testCompanies: typeof Company[] = [];
    let companyCount = 0;
    beforeEach(async () => {
      await connectMongoose();
    });

afterEach(async () => {
    await Promise.all(testCompanies.map((job) => job.remove()));
    await disconnectMongoose();
    });

describe("Get Companies in DB", () => {
    test("GET Request for list of Companies", async () => {
        const res = await request(app).get("/company");
        expect(res.status).toEqual(200);
        expect(res.body).toBeInstanceOf(Array)
        companyCount = res.body.length;
        expect(companyCount).toBeGreaterThanOrEqual(0);        
        });
        
    test("GET Request for invalid Company URL", async () => {  
        const res = await request(app).get("/company/apple");
        expect(res.status).toEqual(404);
        });

    });

});