const request = require("supertest");
const app = require("../../../../../app");
const {
  createDocument,
  deleteDocument,
} = require("../../../_helpers/db.integration");

describe("POST /api/v1/users", () => {
  let mockUser = {
    username: "User 1",
    password: "password",
    email: "user1@mail.com",
    firstname: "John",
    lastname: "Doe",
    residence: "",
    apartment: "",
  };

  let createdUserId;
  let createdResidenceId;
  let createdApartmentId;

  beforeAll(async () => {
    createdResidenceId = await createDocument("residences", {
      name: "Residence 1",
      address: "Address 1",
    });
    createdApartmentId = await createDocument("apartments", {
      name: "Apartment 1",
      residence: createdResidenceId,
    });
    mockUser.residence = createdResidenceId;
    mockUser.apartment = createdApartmentId;
  });

  afterAll(async () => {
    await deleteDocument("apartments", createdApartmentId);
    await deleteDocument("residences", createdResidenceId);
  });
  it("should return 400 Bad request while missing username param", async () => {
    return request(app)
      .post("/api/v1/users")
      .send({
        ...mockUser,
        username: "",
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          '"username" is not allowed to be empty',
        );
      });
  });

  it("should return 404 Not found if apartment does not exist", async () => {
    const invalidApartmentId = "6511e643d6263f60d7e4544c";
    return request(app)
      .post("/api/v1/users")
      .send({
        ...mockUser,
        apartment: invalidApartmentId,
      })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Apartment ${invalidApartmentId} does not exist`,
        );
      });
  });

  it("should return 404 Not found if residence does not exist", async () => {
    const invalidResidenceId = "6511e6a749198ba652faa984";
    return request(app)
      .post("/api/v1/users")
      .send({
        ...mockUser,
        residence: invalidResidenceId,
      })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Residence ${invalidResidenceId} does not exist`,
        );
      });
  });

  it("should return 201 Created", async () => {
    return request(app)
      .post("/api/v1/users")
      .send(mockUser)
      .expect(201)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.username).toEqual(mockUser.username);
        expect(res.body.email).toEqual(mockUser.email);
        expect(res.body.firstname).toEqual(mockUser.firstname);
        expect(res.body.lastname).toEqual(mockUser.lastname);
        expect(res.body.residence).toEqual(mockUser.residence);
        expect(res.body.apartment).toEqual(mockUser.apartment);
        createdUserId = res.body._id;
      });
  });

  it("should return 400 Bad request if username is already taken", async () => {
    return request(app)
      .post("/api/v1/users")
      .send(mockUser)
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual("User User 1, user1@mail.com already exists");
      });
  });

  it("should return 400 Bad request if apartment is already taken", async () => {
    return request(app)
      .post("/api/v1/users")
      .send({
        ...mockUser,
        username: "User 2",
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `Apartment ${mockUser.apartment} is already taken`,
        );
      });
  });

  it("should return 200 and deleted user document", async () => {
    return request(app)
      .delete(`/api/v1/users/${createdUserId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.username).toEqual(mockUser.username);
      });
  });
});

describe("GET /api/v1/users", () => {
  let mockUser = {
    username: "User 1",
    password: "password",
    email: "user1@mail.com",
    firstname: "John",
    lastname: "Doe",
    residence: "",
    apartment: "",
  };
  let createdUserId;
  let createdResidenceId;
  let createdApartmentId;
  let usersLength;

  beforeAll(async () => {
    createdResidenceId = await createDocument("residences", {
      name: "Residence 1",
      address: "Address 1",
    });
    createdApartmentId = await createDocument("apartments", {
      name: "Apartment 1",
      residence: createdResidenceId,
    });
    mockUser.residence = createdResidenceId;
    mockUser.apartment = createdApartmentId;
    createdUserId = await createDocument("users", mockUser);
  });

  afterAll(async () => {
    await deleteDocument("apartments", createdApartmentId);
    await deleteDocument("residences", createdResidenceId);
  });

  it("should return all users in the database", async () => {
    return request(app)
      .get("/api/v1/users")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        usersLength = res.body.length;
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it("should return an empty array if no users could be found", async () => {
    await deleteDocument("users", createdUserId);
    return request(app)
      .get("/api/v1/users")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.length).toEqual(usersLength - 1);
      });
  });
});

describe("GET /api/v1/users/:id", () => {
  let mockUser = {
    username: "User 1",
    password: "password",
    email: "user1@mail.com",
    firstname: "John",
    lastname: "Doe",
    residence: "",
    apartment: "",
  };
  let createdUserId;
  let createdResidenceId;
  let createdApartmentId;

  beforeAll(async () => {
    createdResidenceId = await createDocument("residences", {
      name: "Residence 1",
      address: "Address 1",
    });
    createdApartmentId = await createDocument("apartments", {
      name: "Apartment 1",
      residence: createdResidenceId,
    });
    mockUser.residence = createdResidenceId;
    mockUser.apartment = createdApartmentId;
    createdUserId = await createDocument("users", mockUser);
  });

  afterAll(async () => {
    await deleteDocument("apartments", createdApartmentId);
    await deleteDocument("residences", createdResidenceId);
  });

  it("should return 404 Not found if user could not be found", async () => {
    return request(app)
      .get("/api/v1/users/650af1f106a2c9518e367693")
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `User id 650af1f106a2c9518e367693 does not exist`,
        );
      });
  });

  it("should return 400 Bad request while invalid user id", async () => {
    return request(app)
      .get("/api/v1/users/invalid")
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(`Invalid id invalid`);
      });
  });

  it("should return 200 and user document", async () => {
    return request(app)
      .get(`/api/v1/users/${createdUserId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.username).toEqual(mockUser.username);
        expect(res.body.email).toEqual(mockUser.email);
        expect(res.body.firstname).toEqual(mockUser.firstname);
        expect(res.body.lastname).toEqual(mockUser.lastname);
        expect(res.body.residence).toEqual(mockUser.residence);
        expect(res.body.apartment).toEqual(mockUser.apartment);
      });
  });

  it("should return 200 and deleted user document", async () => {
    return request(app)
      .delete(`/api/v1/users/${createdUserId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.username).toEqual(mockUser.username);
      });
  });
});

describe("PUT /api/v1/users/:id", () => {
  let mockUser = {
    username: "User 1",
    password: "password",
    email: "user1@mail.com",
    firstname: "John",
    lastname: "Doe",
    residence: "",
    apartment: "",
  };
  let createdUserId;
  let createdResidenceId;
  let createdApartmentId;

  beforeAll(async () => {
    createdResidenceId = await createDocument("residences", {
      name: "Residence 1",
      address: "Address 1",
    });
    createdApartmentId = await createDocument("apartments", {
      name: "Apartment 1",
      residence: createdResidenceId,
    });
    mockUser.residence = createdResidenceId;
    mockUser.apartment = createdApartmentId;
    createdUserId = await createDocument("users", mockUser);
  });

  afterAll(async () => {
    await deleteDocument("apartments", createdApartmentId);
    await deleteDocument("residences", createdResidenceId);
  });

  it("should return 400 Not found while missing username param", async () => {
    return request(app)
      .put(`/api/v1/users/${createdUserId}`)
      .send({
        ...mockUser,
        username: "",
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          '"username" is not allowed to be empty',
        );
      });
  });

  it("should return 404 Not found if user could not be found", async () => {
    return request(app)
      .put("/api/v1/users/650af1f106a2c9518e367693")
      .send({
        ...mockUser,
        username: "User 2",
      })
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `User id 650af1f106a2c9518e367693 does not exist`,
        );
      });
  });

  it("should return 400 Bad request while invalid user id", async () => {
    return request(app)
      .put("/api/v1/users/invalid")
      .expect(400)
      .send({
        ...mockUser,
        username: "User 2",
      })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(`Invalid id invalid`);
      });
  });

  it("should return 200 and updated users document", async () => {
    return request(app)
      .put(`/api/v1/users/${createdUserId}`)
      .send({
        ...mockUser,
        username: "User 2",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.username).toEqual("User 2");
        mockUser.username = res.body.username;
      });
  });

  it("should return 200 and deleted user document", async () => {
    return request(app)
      .delete(`/api/v1/users/${createdUserId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.username).toEqual(mockUser.username);
      });
  });
});

describe("DELETE /api/v1/users/:id", () => {
  let mockUser = {
    username: "User 1",
    password: "password",
    email: "user1@mail.com",
    firstname: "John",
    lastname: "Doe",
    residence: "",
    apartment: "",
  };
  let createdUserId;
  let createdResidenceId;
  let createdApartmentId;

  beforeAll(async () => {
    createdResidenceId = await createDocument("residences", {
      name: "Residence 1",
      address: "Address 1",
    });
    createdApartmentId = await createDocument("apartments", {
      name: "Apartment 1",
      residence: createdResidenceId,
    });
    mockUser.residence = createdResidenceId;
    mockUser.apartment = createdApartmentId;
  });

  afterAll(async () => {
    await deleteDocument("apartments", createdApartmentId);
    await deleteDocument("residences", createdResidenceId);
  });

  it("should return 404 Not found if user could not be found", async () => {
    return request(app)
      .delete("/api/v1/users/650af1f106a2c9518e367693")
      .expect(404)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(
          `User id 650af1f106a2c9518e367693 does not exist`,
        );
      });
  });

  it("should return 400 Bad request while invalid user id", async () => {
    return request(app)
      .delete("/api/v1/users/invalid")
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).toEqual(`Invalid id invalid`);
      });
  });

  it("should return 200 and deleted user document", async () => {
    createdUserId = await createDocument("users", mockUser);
    return request(app)
      .delete(`/api/v1/users/${createdUserId}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.username).toEqual(mockUser.username);
      });
  });
});
