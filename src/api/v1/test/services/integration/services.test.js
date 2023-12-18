const request = require("supertest");
const app = require("../../../../../app");

let mockService = {
  type: "laundry",
  timeslots: [
    {
      userid: null,
      username: "",
      start: "2023-12-02T16:00:00.000Z",
      end: "2023-12-02T18:30:00.000Z",
      _id: "656b75c56c0a78cef01c9cf1"
    },
    {
      userid: "65429760add7c81260092b33",
      username: "Eriksson",
      start: "2023-12-27T18:30:00.000Z",
      end: "2023-12-27T21:00:00.000Z",
      _id: "656b75c56c0a78cef01c9cf2"
    }
  ],
  alternateTimeslots: [
    {
      userid: null,
      username: "",
      start: "2023-12-02T06:00:00.000Z",
      end: "2023-12-02T09:00:00.000Z",
      _id: "656b75c56c0a78cef01c9cf3"
    },
    {
      userid: null,
      username: "",
      start: "2023-12-02T09:00:00.000Z",
      end: "2023-12-02T13:00:00.000Z",
      _id: "656b75c56c0a78cef01c9cf4"
    },
    {
      userid: null,
      username: "",
      start: "2023-12-02T13:00:00.000Z",
      end: "2023-12-02T17:00:00.000Z",
      _id: "656b75c56c0a78cef01c9cf5"
    },
    {
      userid: null,
      username: "",
      start: "2023-12-02T17:00:00.000Z",
      end: "2023-12-02T21:00:00.000Z",
      _id: "656b75c56c0a78cef01c9cf6"
    }
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

  it("should return 400 Bad Request while invalid service data", async () => {
    return request(app)
      .post("/api/v1/services")
      .send({
        ...mockService,
        type: "",
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual('"type" is not allowed to be empty');
      });
  });

  it("should return 404 Not Found if the residence id is not found", async () => {
    const invalidResidenceId = "65107e73aa73a5f383574a05";
    return request(app)
      .post("/api/v1/services")
      .send({
        ...mockService,
        residence: invalidResidenceId,
      })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Residence with id ${invalidResidenceId} does not exists`,
        );
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

  it("should return 404 Not Found if the service id is not found", async () => {
    const invalidServiceId = "65107e73aa73a5f383574a05";
    return request(app)
      .get(`/api/v1/services/${invalidServiceId}`)
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Service with id ${invalidServiceId} does not exists`,
        );
      });
  });

  it("should return 400 Bad Request if the service id is not valid", async () => {
    const invalidServiceId = "invalidId";
    return request(app)
      .get(`/api/v1/services/${invalidServiceId}`)
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(`Invalid id ${invalidServiceId}`);
      });
  });
});

describe("PATCH /api/v1/services/:id", () => {
  it("should return 200 OK", async () => {
    return request(app)
      .patch(`/api/v1/services/${createdServiceId}`)
      .send({
        ...mockService,
        name: "Laundry Service 2",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.name).toEqual("Laundry Service 2");
      });
  });

  it("should return 400 Bad Request while invalid service data", async () => {
    return request(app)
      .patch(`/api/v1/services/${createdServiceId}`)
      .send({
        ...mockService,
        type: "",
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual('"type" is not allowed to be empty');
      });
  });

  it("should return 404 Not Found if the service id is not found", async () => {
    const invalidServiceId = "65107e73aa73a5f383574a05";
    return request(app)
      .patch(`/api/v1/services/${invalidServiceId}`)
      .send({
        ...mockService,
        name: "Laundry Service 2",
      })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Service with id ${invalidServiceId} does not exists`,
        );
      });
  });

  it("should return 400 Bad Request if the service id is not valid", async () => {
    const invalidServiceId = "invalidId";
    return request(app)
      .patch(`/api/v1/services/${invalidServiceId}`)
      .send({
        ...mockService,
        name: "Laundry Service 2",
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(`Invalid id ${invalidServiceId}`);
      });
  });
});

describe("DELETE /api/v1/services/:id", () => {
  it("should return 200 OK", async () => {
    return request(app)
      .delete(`/api/v1/services/${createdServiceId}`)
      .expect(200);
  });

  it("should return 404 Not Found if the service id is not found", async () => {
    const invalidServiceId = "65107e73aa73a5f383574a05";
    return request(app)
      .delete(`/api/v1/services/${invalidServiceId}`)
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Service with id ${invalidServiceId} does not exists`,
        );
      });
  });

  it("should return 400 Bad Request if the service id is not valid", async () => {
    const invalidServiceId = "invalidId";
    return request(app)
      .delete(`/api/v1/services/${invalidServiceId}`)
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(`Invalid id ${invalidServiceId}`);
      });
  });
});
