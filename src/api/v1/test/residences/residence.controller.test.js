const ResidenceController = require("../../residences/residence.controller");
const ResidenceService = require("../../residences/residence.service");
const httpMocks = require("node-mocks-http");

const mongoose = require("mongoose");

const mockResidence = require("../mock-data/residence.json");

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("ResidenceController.create", () => {
  it("should have a create method", () => {
    expect(typeof ResidenceController.create).toBe("function");
  });

  it("should call ResidenceService.create", () => {
    ResidenceService.create = jest.fn(() => Promise.resolve(mockResidence));

    ResidenceController.create(req, res, next);
    expect(ResidenceService.create).toBeCalledWith(req.body);
  });

  it("should return 201 response and created residence data", async () => {
    ResidenceService.create = jest.fn(() => Promise.resolve(mockResidence));

    req.body = mockResidence;
    await ResidenceController.create(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(mockResidence);
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while creating residence",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    ResidenceService.create = jest.fn(() => rejectedPromise);
    await ResidenceController.create(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("ResidenceController.getAll", () => {
  it("should have a getAll method", () => {
    expect(typeof ResidenceController.getAll).toBe("function");
  });

  it("should call ResidenceService.getAll", () => {
    ResidenceService.getAll = jest.fn(() => Promise.resolve(mockResidence));
    ResidenceController.getAll(req, res, next);
    expect(ResidenceService.getAll).toBeCalledWith();
  });

  it("should return 200 response and all residences", async () => {
    ResidenceService.getAll = jest.fn(() => Promise.resolve(mockResidence));

    await ResidenceController.getAll(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockResidence);
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while getting residences",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    ResidenceService.getAll = jest.fn(() => rejectedPromise);
    await ResidenceController.getAll(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("ResidenceController.getById", () => {
  it("should have a getById method", () => {
    expect(typeof ResidenceController.getById).toBe("function");
  });

  it("should call ResidenceService.getById", () => {
    ResidenceService.getById = jest.fn(() => Promise.resolve(mockResidence));
    req.params.id = mockResidence.id;
    ResidenceController.getById(req, res, next);
    expect(ResidenceService.getById).toBeCalledWith(req.params.id);
  });

  it("should return 200 response and residence", async () => {
    ResidenceService.getById = jest.fn(() => Promise.resolve(mockResidence));

    await ResidenceController.getById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockResidence);
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while getting residence",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    ResidenceService.getById = jest.fn(() => rejectedPromise);
    await ResidenceController.getById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("ResidenceController._delete", () => {
  it("should have a delete method", () => {
    expect(typeof ResidenceController._delete).toBe("function");
  });

  it("should call ResidenceService.delete", () => {
    ResidenceService.delete = jest.fn(() => Promise.resolve());
    req.params.id = mockResidence.id;
    ResidenceController._delete(req, res, next);
    expect(ResidenceService.delete).toBeCalledWith(req.params.id);
  });

  it("should return 200 response and residence", async () => {
    ResidenceService.delete = jest.fn(() => Promise.resolve());

    await ResidenceController._delete(req, res, next);
    expect(res.statusCode).toBe(200);
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while deleting residence",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    ResidenceService.delete = jest.fn(() => rejectedPromise);
    await ResidenceController._delete(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
