const ServiceController = require("../../services/service.controller");
const ServiceService = require("../../services/service.service");
const httpMocks = require("node-mocks-http");

const mongoose = require("mongoose");

const mockService = require("../mock-data/service.json");

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("ServiceController.create", () => {
  it("should have a create method", () => {
    expect(typeof ServiceController.create).toBe("function");
  });

  it("should call ServiceService.create", () => {
    ServiceService.create = jest.fn(() => Promise.resolve(mockService));

    ServiceController.create(req, res, next);
    expect(ServiceService.create).toBeCalledWith(req.body);
  });

  it("should return 201 response and created service data", async () => {
    ServiceService.create = jest.fn(() => Promise.resolve(mockService));

    req.body = mockService;
    await ServiceController.create(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(mockService);
  });

  it("should handle errors", async () => {
    const errorMessage = "Error while creating service";
    const rejectedPromise = Promise.reject(errorMessage);
    ServiceService.create = jest.fn(() => rejectedPromise);
    await ServiceController.create(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("ServiceController.getAll", () => {
  it("should have a getAll method", () => {
    expect(typeof ServiceController.getAll).toBe("function");
  });

  it("should call ServiceService.getAll", () => {
    ServiceService.getAll = jest.fn(() => Promise.resolve(mockService));
    ServiceController.getAll(req, res, next);
    expect(ServiceService.getAll).toBeCalledWith();
  });

  it("should return all services", async () => {
    ServiceService.getAll = jest.fn(() => Promise.resolve(mockService));
    await ServiceController.getAll(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockService);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = "Error getting services";
    const rejectedPromise = Promise.reject(errorMessage);
    ServiceService.getAll = jest.fn(() => rejectedPromise);
    await ServiceController.getAll(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("ServiceController.getById", () => {
  it("should have a getById method", () => {
    expect(typeof ServiceController.getById).toBe("function");
  });

  it("should call ServiceService.getById", async () => {
    req.params.id = "5f7f0d6b7f6c1f1bdcf5f8f1";
    ServiceService.getById = jest.fn(() => Promise.resolve(mockService));

    await ServiceController.getById(req, res, next);
    expect(ServiceService.getById).toBeCalledWith("5f7f0d6b7f6c1f1bdcf5f8f1");
  });

  it("should return json body and response code 200", async () => {
    ServiceService.getById = jest.fn(() => Promise.resolve(mockService));
    await ServiceController.getById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockService);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should do error handling", async () => {
    const errorMessage = "Error finding service";
    const rejectedPromise = Promise.reject(errorMessage);
    ServiceService.getById = jest.fn(() => rejectedPromise);
    await ServiceController.getById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("should return 404 when item doesnt exist", async () => {
    ServiceService.getById = jest.fn(() => Promise.resolve(null));
    await ServiceController.getById(req, res, next);
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("ServiceController.getByResidence", () => {
  it("should have a getByResidence method", () => {
    expect(typeof ServiceController.getByResidence).toBe("function");
  });

  it("should call ServiceService.getByResidence", async () => {
    req.params.residence = "5f7f0d6b7f6c1f1bdcf5f8f1";
    ServiceService.getByResidence = jest.fn(() => Promise.resolve(mockService));

    await ServiceController.getByResidence(req, res, next);
    expect(ServiceService.getByResidence).toBeCalledWith(
      "5f7f0d6b7f6c1f1bdcf5f8f1",
    );
  });

  it("should return json body and response code 200", async () => {
    ServiceService.getByResidence = jest.fn(() => Promise.resolve(mockService));
    await ServiceController.getByResidence(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockService);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should do error handling", async () => {
    const errorMessage = "Error finding service";
    const rejectedPromise = Promise.reject(errorMessage);
    ServiceService.getByResidence = jest.fn(() => rejectedPromise);
    await ServiceController.getByResidence(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("should return 404 when item doesnt exist", async () => {
    ServiceService.getByResidence = jest.fn(() => Promise.resolve(null));
    await ServiceController.getByResidence(req, res, next);
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("ServiceController._delete", () => {
  it("should have a delete method", () => {
    expect(typeof ServiceController._delete).toBe("function");
  });

  it("should call ServiceService.delete", async () => {
    req.params.id = "5f7f0d6b7f6c1f1bdcf5f8f1";
    ServiceService.delete = jest.fn(() => Promise.resolve());

    await ServiceController._delete(req, res, next);
    expect(ServiceService.delete).toBeCalledWith("5f7f0d6b7f6c1f1bdcf5f8f1");
  });

  it("should return 200 response", async () => {
    ServiceService.delete = jest.fn(() => Promise.resolve());
    await ServiceController._delete(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = "Error deleting service";
    const rejectedPromise = Promise.reject(errorMessage);
    ServiceService.delete = jest.fn(() => rejectedPromise);
    await ServiceController._delete(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
