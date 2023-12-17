const BookingController = require("../../bookings/booking.controller");
const BookingService = require("../../bookings/booking.service");
const httpMocks = require("node-mocks-http");

const mongoose = require("mongoose");

const mockBooking = require("../mock-data/booking.json");
const mockBookings = require("../mock-data/bookings.json");

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("BookingController.create", () => {
  it("should have a create method", () => {
    expect(typeof BookingController.create).toBe("function");
  });

  it("should call BookingService.create", async () => {
    BookingService.create = jest.fn(() => Promise.resolve(mockBooking));
    req.body = mockBooking;
    req.params.user = mockBooking.timeslots[0].userid;
    await BookingController.create(req, res, next);
    expect(BookingService.create).toBeCalledWith(req.params.user, req.body);
  });

  it("should return 201 response and created booking data", async () => {
    BookingService.create = jest.fn(() => Promise.resolve(mockBooking));
    req.body = mockBooking;
    await BookingController.create(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(mockBooking);
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while creating booking",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    BookingService.create = jest.fn(() => rejectedPromise);
    await BookingController.create(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("BookingController.getByService", () => {
  it("should have a getByService method", () => {
    expect(typeof BookingController.getByService).toBe("function");
  });

  it("should call BookingService.getByService", () => {
    BookingService.getByService = jest.fn(() => Promise.resolve(mockBookings));
    req.params.service = mockBooking.service;
    BookingController.getByService(req, res, next);
    expect(BookingService.getByService).toBeCalledWith(req.params.service);
  });

  it("should return response with status 200 and all bookings", async () => {
    BookingService.getByService = jest.fn(() => Promise.resolve(mockBookings));
    await BookingController.getByService(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockBookings);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while getting all bookings",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    BookingService.getByService = jest.fn(() => rejectedPromise);
    await BookingController.getByService(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("BookingController.getByServiceDate", () => {
  it("should have a getByServiceDate method", () => {
    expect(typeof BookingController.getByServiceDate).toBe("function");
  });

  it("should call BookingService.getByServiceDate", () => {
    BookingService.getByServiceDate = jest.fn(() =>
      Promise.resolve(mockBooking),
    );
    req.params.service = mockBooking.service;
    req.params.date = mockBooking.date;
    BookingController.getByServiceDate(req, res, next);
    expect(BookingService.getByServiceDate).toBeCalledWith(
      req.params.service,
      req.params.date,
    );
  });

  it("should return response with status 200 and booking", async () => {
    BookingService.getByServiceDate = jest.fn(() =>
      Promise.resolve(mockBooking),
    );
    await BookingController.getByServiceDate(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockBooking);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while getting booking",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    BookingService.getByServiceDate = jest.fn(() => rejectedPromise);
    await BookingController.getByServiceDate(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("BookingController.getByServiceMonth", () => {
  it("should have a getByServiceMonth method", () => {
    expect(typeof BookingController.getByServiceMonth).toBe("function");
  });

  it("should call BookingService.getByServiceMonth", () => {
    BookingService.getByServiceMonth = jest.fn(() =>
      Promise.resolve(mockBookings),
    );
    req.params.service = mockBooking.service;
    req.params.date = mockBooking.date;
    BookingController.getByServiceMonth(req, res, next);
    expect(BookingService.getByServiceMonth).toBeCalledWith(
      req.params.service,
      req.params.date,
    );
  });

  it("should return response with status 200 and booking", async () => {
    BookingService.getByServiceMonth = jest.fn(() =>
      Promise.resolve(mockBookings),
    );
    await BookingController.getByServiceMonth(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockBookings);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while getting booking",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    BookingService.getByServiceMonth = jest.fn(() => rejectedPromise);
    await BookingController.getByServiceMonth(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("BookingController.getByServiceUser", () => {
  it("should have a getByServiceUser method", () => {
    expect(typeof BookingController.getByServiceUser).toBe("function");
  });

  it("should call BookingService.getByServiceUser", () => {
    BookingService.getByServiceUser = jest.fn(() =>
      Promise.resolve(mockBookings),
    );
    req.params.service = mockBooking.service;
    req.params.id = mockBooking.timeslots[0].userId;
    BookingController.getByServiceUser(req, res, next);
    expect(BookingService.getByServiceUser).toBeCalledWith(
      req.params.service,
      req.params.id,
    );
  });

  it("should return response with status 200 and booking", async () => {
    BookingService.getByServiceUser = jest.fn(() =>
      Promise.resolve(mockBookings),
    );
    await BookingController.getByServiceUser(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockBookings);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while getting booking",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    BookingService.getByServiceUser = jest.fn(() => rejectedPromise);
    await BookingController.getByServiceUser(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("BookingController.update", () => {
  it("should have a update method", () => {
    expect(typeof BookingController.update).toBe("function");
  });

  it("should call BookingService.update", () => {
    BookingService.update = jest.fn(() => Promise.resolve(mockBooking));
    req.params.id = mockBooking._id;
    req.params.user = mockBooking.timeslots[1].userid;
    req.body = mockBooking;
    BookingController.update(req, res, next);
    expect(BookingService.update).toBeCalledWith(req.params.user, req.params.id, req.body);
  });

  it("should return response with status 200 and updated booking", async () => {
    BookingService.update = jest.fn(() => Promise.resolve(mockBooking));
    await BookingController.update(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockBooking);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while updating booking",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    BookingService.update = jest.fn(() => rejectedPromise);
    await BookingController.update(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("BookingController.delete", () => {
  it("should have a delete method", () => {
    expect(typeof BookingController._delete).toBe("function");
  });

  it("should call BookingService.delete", () => {
    BookingService.delete = jest.fn(() => Promise.resolve(mockBooking));
    req.params.id = mockBooking._id;
    BookingController._delete(req, res, next);
    expect(BookingService.delete).toBeCalledWith(req.params.id);
  });

  it("should return response with status 200 and deleted booking", async () => {
    BookingService.delete = jest.fn(() => Promise.resolve(mockBooking));
    await BookingController._delete(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockBooking);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = {
      status: 400,
      message: "Error while deleting booking",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    BookingService.delete = jest.fn(() => rejectedPromise);
    await BookingController._delete(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
