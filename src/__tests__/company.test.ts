import request from "supertest";
import app from "../app";
import { connectMongoose, disconnectMongoose } from "../testUtils/mongoose";
import { Company } from "../models";
// import axios from "axios";
// import Mongoose from "mongoose";

describe("Company Tests", () => {
  const testCompanies: typeof Company[] = [];
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
      expect(res.body).toBeInstanceOf(Array);
      companyCount = res.body.length;
      expect(companyCount).toBeGreaterThanOrEqual(0);        
    });
        
    test("GET Request for invalid Company URL", async () => {  
      const res = await request(app).get("/company/apple");
      expect(res.status).toEqual(404);
    });
    
  //   //***** USED TO UPLOAD COMPANIES TO DB *****//
  //   test("SET VALUES FOR ALL COMPANIES", async () => {
  //     const response = await axios.get("https://www.levels.fyi/js/internshipData.json");
  //     let jsonOb = response.data;
  //     let jsonObj = JSON.parse(JSON.stringify(jsonOb));

  //     console.log(jsonObj.length);
  //     for (let i = 0; i < jsonObj.length; i++) {
  //       let Cname = jsonObj[i].company;
  //       let Cicon = jsonObj[i].icon;
  //       let Clink = jsonObj[i].link;
  //       let cID;
  //         const existingCompany = (await Company.findOne({ "companyName":Cname }));
  //         if (!existingCompany) {
  //           cID = new Mongoose.Types.ObjectId();
  //           const newCompany = {
  //             "companyName": Cname,
  //             "iconURL": Cicon,
  //             "companyURL": Clink,
  //             "_id": cID
  //           };
  //           let res = await axios.post("http://localhost:4000/company/" + cID, newCompany);
  //           expect(res.status).toEqual(200);
  //           }
  //       }
  //   }, 60000000);
  });
});
