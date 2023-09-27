const request = require("supertest");
const app = require("../../../../../app");

let mockService = {
  type: "laundry",
  timeslots: [
    {
      timeslot: "07.00 - 10.00",
      userid: null,
      username: null,
    },
    {
      timeslot: "10.00 - 14.00",
      userid: null,
      username: null,
    },
    {
      timeslot: "14.00 - 18.00",
      userid: null,
      username: null,
    },
    {
      timeslot: "18.00 - 22.00",
      userid: null,
      username: null,
    },
  ],
  name: "Laundry Service 1",
  residence: "",
  limit: 2,
};

let createdResidenceId;
let createdServiceId;
beforeAll(async () => {
  await request(app)
    .post("/api/v1/residences")
    .send({ name: "Residence 1", address: "Address 1" })
    .expect(201)
    .expect("Content-Type", /json/)
    .expect((res) => {
      expect(res.body.name).toEqual("Residence 1");
      expect(res.body.address).toEqual("Address 1");
      mockService.residence = createdResidenceId = res.body._id;
    });
});

afterAll(async () => {
  await request(app)
    .delete(`/api/v1/residences/${createdResidenceId}`)
    .expect(200);
});

describe("POST /api/v1/services", () => {
  it("should return 201 Created", async () => {
    return request(app)
      .post("/api/v1/services")
      .send(mockService)
      .expect(201)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.type).toEqual(mockService.type);
        expect(res.body.name).toEqual(mockService.name);
        expect(res.body.residence).toEqual(mockService.residence);
        createdServiceId = res.body._id;
      });
  });
});

describe("GET /api/v1/services", () => {
  it("should return all services in the database", async () => {
    return request(app)
      .get("/api/v1/services")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body.length).toBeGreaterThan(0);
      });
  });
});

describe("GET /api/v1/services/:id", () => {
  it("should return a service if valid id is provided", async () => {
    return request(app)
      .get(`/api/v1/services/${createdServiceId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.name).toEqual("Laundry Service 1");
        expect(res.body.residence).toEqual(createdResidenceId);
      });
  });
});

describe("PATCH /api/v1/services/:id", () => {
  it("should return 200 OK", async () => {
    return request(app)
      .patch(`/api/v1/services/${createdServiceId}`)
      .send({ name: "Laundry Service 2" })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.name).toEqual("Laundry Service 2");
      });
  });
});

describe("DELETE /api/v1/services/:id", () => {
  it("should return 200 OK", async () => {
    return request(app)
      .delete(`/api/v1/services/${createdServiceId}`)
      .expect(200);
  });
});
