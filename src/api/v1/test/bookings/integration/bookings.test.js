const request = require("supertest");
const app = require("../../../../../app");
const {
  createDocument,
  authCreateDocument,
  deleteDocument,
  authDeleteDocument,
  authenticate,
} = require("../../../_helpers/db.integration");

let mockUser = {
  username: "User 1",
  password: "password",
  email: "user1@mail.com",
  firstname: "John",
  lastname: "Doe",
  residence: "",
  apartment: "",
};

let mockTimeSlots = [
  {
    timeslot: "07.00 - 10.00",
    userid: null,
    username: "",
  },
  {
    timeslot: "10.00 - 14.00",
    userid: null,
    username: "",
  },
  {
    timeslot: "14.00 - 18.00",
    userid: null,
    username: "",
  },
  {
    timeslot: "18.00 - 22.00",
    userid: null,
    username: "",
  },
];
let mockBooking = {
  service: "",
  date: "2023-09-12T17:21:47.228Z",
  timeslots: [...mockTimeSlots],
};
let mockService = {
  type: "laundry",
  timeslots: [...mockTimeSlots],
  name: "Laundry Service 1",
  residence: "",
  limit: 2,
};

let createdUserId;
let createdResidenceId;
let createdApartmentId;
let createdServiceId;
let accessToken;
let createdBooking;

beforeAll(async () => {
  createdResidenceId = await createDocument("residences", {
    name: "Residence 1",
    address: "Address 1",
  });
  createdApartmentId = await createDocument("apartments", {
    name: "Apartment 1",
    residence: createdResidenceId,
  });
  createdServiceId = await createDocument("services", {
    ...mockService,
    residence: createdResidenceId,
  });
  createdUserId = await createDocument("users", {
    ...mockUser,
    residence: createdResidenceId,
    apartment: createdApartmentId,
  });

  const tokens = await authenticate(mockUser);
  accessToken = tokens.accessToken;
  mockBooking.service = createdServiceId;
  mockBooking.timeslots[0].userid = createdUserId;
  mockBooking.timeslots[0].username = mockUser.username;
});

afterAll(async () => {
  await deleteDocument("apartments", createdApartmentId);
  await deleteDocument("residences", createdResidenceId);
  await deleteDocument("services", createdServiceId);
  await deleteDocument("users", createdUserId);
});

describe("POST /api/v1/bookings", () => {
  afterAll(async () => {
    await authDeleteDocument("bookings", createdBooking._id, accessToken);
  });
  it("should return 400 Bad Request while invalid booking param", async () => {
    return request(app)
      .post("/api/v1/bookings")
      .auth(accessToken, { type: "bearer" })
      .send({ ...mockBooking, date: "invalid date" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual('"date" must be a valid date');
      });
  });

  it("should return 404 Not Found while service does not exist", async () => {
    const invalidServiceId = "6512e2046e6a3c3d399cff6e";
    return request(app)
      .post("/api/v1/bookings")
      .auth(accessToken, { type: "bearer" })
      .send({ ...mockBooking, service: invalidServiceId })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Service with id ${invalidServiceId} does not exists`,
        );
      });
  });
  it("should return 400 Bad Request while invalid service id", async () => {
    const invalidServiceId = "invalid id";
    return request(app)
      .post("/api/v1/bookings")
      .auth(accessToken, { type: "bearer" })
      .send({ ...mockBooking, service: invalidServiceId })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          '"service" must only contain hexadecimal characters',
        );
      });
  });

  it("should return 400 Bad Request while invalid booking param", async () => {
    return request(app)
      .post("/api/v1/bookings")
      .auth(accessToken, { type: "bearer" })
      .send({
        ...mockBooking,
        timeslots: [{ ...mockTimeSlots[0], userid: "invalid id" }],
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          '"timeslots[0].userid" must only contain hexadecimal characters',
        );
      });
  });

  it("should return 201 and created booking", async () => {
    return request(app)
      .post("/api/v1/bookings")
      .auth(accessToken, { type: "bearer" })
      .send(mockBooking)
      .expect(201)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.service).toEqual(mockBooking.service);
        expect(res.body.date).toEqual(mockBooking.date);
        expect(res.body.timeslots[0].userid).toEqual(
          mockBooking.timeslots[0].userid,
        );
        expect(res.body.timeslots[0].username).toEqual(
          mockBooking.timeslots[0].username,
        );
        createdBooking = res.body;
      });
  });
});

describe("PATCH /api/v1/bookings", () => {
  let createdMockBooking;
  beforeAll(async () => {
    createdMockBooking = await authCreateDocument(
      "bookings",
      mockBooking,
      accessToken,
      false,
    );
  });

  afterAll(async () => {
    await authDeleteDocument("bookings", createdMockBooking._id, accessToken);
  });

  it("should return 400 Bad Request while invalid booking param", async () => {
    return request(app)
      .patch(`/api/v1/bookings/${createdMockBooking._id}`)
      .auth(accessToken, { type: "bearer" })
      .send({ ...mockBooking, date: "invalid date" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual('"date" must be a valid date');
      });
  });

  it("should return 404 Not Found if booking does not exist", async () => {
    const invalidBookingId = "6512e2046e6a3c3d399cff6e";
    return request(app)
      .patch(`/api/v1/bookings/${invalidBookingId}`)
      .auth(accessToken, { type: "bearer" })
      .send(mockBooking)
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Booking with id ${invalidBookingId} does not exists`,
        );
      });
  });

  it("should return 400 Bad Request while invalid booking id", async () => {
    const invalidBookingId = "invalid id";
    return request(app)
      .patch(`/api/v1/bookings/${invalidBookingId}`)
      .auth(accessToken, { type: "bearer" })
      .send(mockBooking)
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual("Invalid id invalid id");
      });
  });

  it("should return 400 Bad Request while invalid service id", async () => {
    const invalidServiceId = "invalid id";
    return request(app)
      .patch(`/api/v1/bookings/${createdMockBooking._id}`)
      .auth(accessToken, { type: "bearer" })
      .send({ ...mockBooking, service: invalidServiceId })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          '"service" must only contain hexadecimal characters',
        );
      });
  });

  it("should return 404 Not Found while service does not exist", async () => {
    const invalidServiceId = "6512e2046e6a3c3d399cff6e";
    return request(app)
      .patch(`/api/v1/bookings/${createdMockBooking._id}`)
      .auth(accessToken, { type: "bearer" })
      .send({ ...mockBooking, service: invalidServiceId })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Service with id ${invalidServiceId} does not exists`,
        );
      });
  });

  it("should return 200 and updated booking", async () => {
    return request(app)
      .patch(`/api/v1/bookings/${createdMockBooking._id}`)
      .auth(accessToken, { type: "bearer" })
      .send({ ...mockBooking, date: "2023-09-12T17:21:47.228Z" })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.service).toEqual(mockBooking.service);
        expect(res.body.date).toEqual("2023-09-12T17:21:47.228Z");
        expect(res.body.timeslots[0].userid).toEqual(
          mockBooking.timeslots[0].userid,
        );
        expect(res.body.timeslots[0].username).toEqual(
          mockBooking.timeslots[0].username,
        );
      });
  });
});

describe("GET /api/v1/bookings", () => {
  let createdMockBooking;
  beforeAll(async () => {
    createdMockBooking = await authCreateDocument(
      "bookings",
      mockBooking,
      accessToken,
      false,
    );
  });

  afterAll(async () => {
    await authDeleteDocument("bookings", createdMockBooking._id, accessToken);
  });
  it("should return 200 and all bookings in the database", async () => {
    return request(app)
      .get("/api/v1/bookings")
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body).toEqual(
          expect.arrayContaining([expect.objectContaining(createdMockBooking)]),
        );
      });
  });
});

describe("GET /api/v1/bookings/:id", () => {
  let createdMockBooking;
  beforeAll(async () => {
    createdMockBooking = await authCreateDocument(
      "bookings",
      mockBooking,
      accessToken,
      false,
    );
  });

  afterAll(async () => {
    await authDeleteDocument("bookings", createdMockBooking._id, accessToken);
  });
  it("should return 200 and booking with id", async () => {
    return request(app)
      .get(`/api/v1/bookings/${createdMockBooking._id}`)
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(expect.objectContaining(createdMockBooking));
      });
  });

  it("should return 400 Bad Request while invalid booking id", async () => {
    const invalidBookingId = "invalid id";
    return request(app)
      .get(`/api/v1/bookings/${invalidBookingId}`)
      .auth(accessToken, { type: "bearer" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual("Invalid id invalid id");
      });
  });

  it("should return 404 Not Found if booking does not exist", async () => {
    const invalidBookingId = "6512e2046e6a3c3d399cff6e";
    return request(app)
      .get(`/api/v1/bookings/${invalidBookingId}`)
      .auth(accessToken, { type: "bearer" })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Booking with id ${invalidBookingId} does not exists`,
        );
      });
  });
});

describe("GET /api/v1/bookings/service/:service", () => {
  let createdMockBooking;
  beforeAll(async () => {
    createdMockBooking = await authCreateDocument(
      "bookings",
      mockBooking,
      accessToken,
      false,
    );
  });

  it("should return 200 and bookings related to service", async () => {
    return request(app)
      .get(`/api/v1/bookings/service/${createdMockBooking.service}`)
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([expect.objectContaining(createdMockBooking)]),
        );
      });
  });

  it("should return 404 Not Found if service does not exist", async () => {
    const invalidServiceId = "6513e49f9d90819b61ef5bbf";
    return request(app)
      .get(`/api/v1/bookings/service/${invalidServiceId}`)
      .auth(accessToken, { type: "bearer" })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Service with id ${invalidServiceId} does not exists`,
        );
      });
  });

  it("should return 400 Bad Request while invalid service id", async () => {
    const invalidServiceId = "invalid id";
    return request(app)
      .get(`/api/v1/bookings/service/${invalidServiceId}`)
      .auth(accessToken, { type: "bearer" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual("Invalid id invalid id");
      });
  });

  it("should return 200 and empty bookings array if bookings related to service does not exist", async () => {
    await authDeleteDocument("bookings", createdMockBooking._id, accessToken);

    return request(app)
      .get(`/api/v1/bookings/service/${createdMockBooking.service}`)
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.length).toEqual(0);
      });
  });
});

describe("GET /api/v1/bookings/service/:service/date/:date", () => {
  let createdMockBooking;
  beforeAll(async () => {
    createdMockBooking = await authCreateDocument(
      "bookings",
      mockBooking,
      accessToken,
      false,
    );
  });

  it("should return 200 and booking related to service and date", async () => {
    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/date/${createdMockBooking.date}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(expect.objectContaining(createdMockBooking));
      });
  });

  it("should return 404 Not Found if service does not exist", async () => {
    const invalidServiceId = "6512e2046e6a3c3d399cff6e";
    return request(app)
      .get(
        `/api/v1/bookings/service/${invalidServiceId}/date/${createdMockBooking.date}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Service with id ${invalidServiceId} does not exists`,
        );
      });
  });

  it("should return 400 Bad Request while invalid service id", async () => {
    const invalidServiceId = "invalid id";
    return request(app)
      .get(
        `/api/v1/bookings/service/${invalidServiceId}/date/${createdMockBooking.date}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual("Invalid id invalid id");
      });
  });

  it("should return 200 and empty booking if booking related to issued date does not exist", async () => {
    const invalidDate = "2000-09-12T17:21:47.228Z";
    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/date/${invalidDate}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).toEqual({});
      });
  });

  it("should return 400 Bad Request while invalid date", async () => {
    const invalidDate = "invalid date";
    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/date/${invalidDate}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual("Invalid date invalid date");
      });
  });

  it("should return 200 and empty booking if booking related to service and date does not exist", async () => {
    await authDeleteDocument("bookings", createdMockBooking._id, accessToken);

    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/date/${createdMockBooking.date}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).toEqual({});
      });
  });
});

describe("GET /api/v1/bookings/service/:service/month/:date", () => {
  let createdMockBooking;
  beforeAll(async () => {
    createdMockBooking = await authCreateDocument(
      "bookings",
      mockBooking,
      accessToken,
      false,
    );
  });

  afterAll(async () => {
    await authDeleteDocument("bookings", createdMockBooking._id, accessToken);
  });

  it("should return 200 and bookings related to service and month", async () => {
    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/month/${createdMockBooking.date}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([expect.objectContaining(createdMockBooking)]),
        );
      });
  });

  it("should return 404 Not Found if service does not exist", async () => {
    const invalidServiceId = "6512e2046e6a3c3d399cff6e";
    return request(app)
      .get(
        `/api/v1/bookings/service/${invalidServiceId}/month/${createdMockBooking.date}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Service with id ${invalidServiceId} does not exists`,
        );
      });
  });

  it("should return 400 Bad Request while invalid service id", async () => {
    const invalidServiceId = "invalid id";
    return request(app)
      .get(
        `/api/v1/bookings/service/${invalidServiceId}/month/${createdMockBooking.date}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual("Invalid id invalid id");
      });
  });

  it("should return 200 and empty bookings array if bookings related to issued month does not exist", async () => {
    const invalidDate = "2000-09-12T17:21:47.228Z";
    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/month/${invalidDate}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).toEqual([]);
      });
  });

  it("should return 400 Bad Request while invalid date", async () => {
    const invalidDate = "invalid date";
    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/month/${invalidDate}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual("Invalid date invalid date");
      });
  });
});

describe("GET /api/v1/bookings/service/:service/user/:id", () => {
  let createdMockBooking;
  beforeAll(async () => {
    createdMockBooking = await authCreateDocument(
      "bookings",
      mockBooking,
      accessToken,
      false,
    );
  });

  it("should return 200 and bookings related to service and user", async () => {
    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/user/${createdMockBooking.timeslots[0].userid}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([expect.objectContaining(createdMockBooking)]),
        );
      });
  });

  it("should return 404 Not Found if service does not exist", async () => {
    const invalidServiceId = "6512e2046e6a3c3d399cff6e";
    return request(app)
      .get(
        `/api/v1/bookings/service/${invalidServiceId}/user/${createdMockBooking.timeslots[0].userid}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Service with id ${invalidServiceId} does not exists`,
        );
      });
  });

  it("should return 400 Bad Request while invalid service id", async () => {
    const invalidServiceId = "invalid id";
    return request(app)
      .get(
        `/api/v1/bookings/service/${invalidServiceId}/user/${createdMockBooking.timeslots[0].userid}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual("Invalid id invalid id");
      });
  });

  it("should return 404 Not Found if user does not exist", async () => {
    const invalidUserId = "6512e2046e6a3c3d399cff6e";
    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/user/${invalidUserId}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `User with id ${invalidUserId} does not exists`,
        );
      });
  });

  it("should return 400 Bad Request while invalid user id", async () => {
    const invalidUserId = "invalid id";
    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/user/${invalidUserId}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual("Invalid id invalid id");
      });
  });

  it("should return 200 and empty bookings array if bookings related to service and user does not exist", async () => {
    await authDeleteDocument("bookings", createdMockBooking._id, accessToken);

    return request(app)
      .get(
        `/api/v1/bookings/service/${createdMockBooking.service}/user/${createdMockBooking.timeslots[0].userid}`,
      )
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).toEqual([]);
      });
  });
});

describe("DELETE /api/v1/bookings/:id", () => {
  let createdMockBooking;
  beforeAll(async () => {
    createdMockBooking = await authCreateDocument(
      "bookings",
      mockBooking,
      accessToken,
      false,
    );
  });

  it("should return 404 Not Found if booking does not exist", async () => {
    const invalidBookingId = "6512e2046e6a3c3d399cff6e";
    return request(app)
      .delete(`/api/v1/bookings/${invalidBookingId}`)
      .auth(accessToken, { type: "bearer" })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Booking with id ${invalidBookingId} does not exists`,
        );
      });
  });

  it("should return 200 No Content if booking deleted successfully", async () => {
    return request(app)
      .delete(`/api/v1/bookings/${createdMockBooking._id}`)
      .auth(accessToken, { type: "bearer" })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(createdMockBooking);
      });
  });

  it("should return 404 Not Found if booking does not exist", async () => {
    return request(app)
      .delete(`/api/v1/bookings/${createdMockBooking._id}`)
      .auth(accessToken, { type: "bearer" })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Booking with id ${createdMockBooking._id} does not exists`,
        );
      });
  });
});
