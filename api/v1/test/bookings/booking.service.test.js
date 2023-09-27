const BookingService = require("../../bookings/booking.service");
const mongoose = require("mongoose");
const moment = require("moment");

const { Booking, Service, User } = require("../../_helpers/db");

const mockBooking = require("../mock-data/booking.json");
const mockBookings = require("../mock-data/bookings.json");

const mockService = require("../mock-data/service.json");
const mockUser = require("../mock-data/user.json");

Booking.create = jest.fn();
Booking.find = jest.fn();
Booking.findOne = jest.fn();
Booking.findById = jest.fn();
Booking.findByIdAndUpdate = jest.fn();
Booking.findByIdAndRemove = jest.fn();

Service.findById = jest.fn();
User.findById = jest.fn();

afterAll(async () => {
  await mongoose.connection.close();
});
describe("BookingService.create", () => {
  it("should have a create method", () => {
    expect(typeof BookingService.create).toBe("function");
  });

  it("should call Booking.create", async () => {
    Booking.findById.mockReturnValue(null);
    Booking.create.mockReturnValue(mockBooking);
    await BookingService.create(mockBooking);
    expect(Booking.create).toBeCalledWith(mockBooking);
  });

  it("should return the created booking", async () => {
    Booking.findById.mockReturnValue(null);
    Booking.create.mockReturnValue(mockBooking);
    const result = await BookingService.create(mockBooking);
    expect(result).toEqual(mockBooking);
  });

  it("should catch errors", async () => {
    Booking.findById.mockReturnValue(null);
    Booking.create.mockImplementation(() => {
      throw new Error("Error creating booking");
    });
    await expect(BookingService.create(mockBooking)).rejects.toThrow(
      "Error creating booking",
    );
  });
});

describe("BookingService.getByService", () => {
  it("should have a getByService method", () => {
    expect(typeof BookingService.getByService).toBe("function");
  });

  it("should call Booking.find()", async () => {
    Booking.find.mockReturnValue(mockBookings);
    Service.findById.mockReturnValue(mockService);
    await BookingService.getByService(mockBooking.service);
    expect(Booking.find).toBeCalled();
    expect(Booking.find).toBeCalledWith({ service: mockBooking.service });
  });

  it("should return all bookings for issued service", async () => {
    Booking.find.mockReturnValue(mockBookings);
    Service.findById.mockReturnValue(mockService);
    const result = await BookingService.getByService(mockBooking.service);
    expect(result).toEqual(mockBookings);
  });

  it("should throw an error if service does not exist", async () => {
    Service.findById.mockImplementation(() => {
      throw new Error("Service does not exist");
    });
    await expect(
      BookingService.getByService(mockBooking.service),
    ).rejects.toThrow("Service does not exist");
  });
});

describe("BookingService.getByServiceDate", () => {
  it("should have a getByServiceDate method", () => {
    expect(typeof BookingService.getByServiceDate).toBe("function");
  });

  it("should call Booking.findOne()", async () => {
    const start = moment(mockBooking.date).startOf("day");
    const end = moment(mockBooking.date).endOf("day");
    Service.findById.mockReturnValue(mockService);
    Booking.findOne.mockReturnValue(mockBooking);
    await BookingService.getByServiceDate(
      mockBooking.service,
      mockBooking.date,
    );
    expect(Booking.findOne).toBeCalled();
    expect(Booking.findOne).toBeCalledWith({
      service: mockBooking.service,
      date: { $gte: start, $lte: end },
    });
  });

  it("should return the booking for issued service and date", async () => {
    Service.findById.mockReturnValue(mockService);
    Booking.findOne.mockReturnValue(mockBooking);
    const result = await BookingService.getByServiceDate(
      mockBooking.service,
      mockBooking.date,
    );
    expect(result).toEqual(mockBooking);
  });

  it("should throw an error if service does not exist", async () => {
    Service.findById.mockImplementation(() => {
      throw new Error("Service does not exist");
    });
    await expect(
      BookingService.getByServiceDate(mockBooking.service, mockBooking.date),
    ).rejects.toThrow("Service does not exist");
  });

  it("should catch errors", async () => {
    Service.findById.mockReturnValue(mockService);
    Booking.findOne.mockImplementation(() => {
      throw new Error("Error getting booking");
    });
    await expect(
      BookingService.getByServiceDate(mockBooking.service, mockBooking.date),
    ).rejects.toThrow("Error getting booking");
  });
});

describe("BookingService.getByServiceMonth", () => {
  it("should have a getByServiceMonth method", () => {
    expect(typeof BookingService.getByServiceMonth).toBe("function");
  });

  it("should call Booking.find()", async () => {
    const start = moment(mockBooking.date).startOf("month");
    const end = moment(mockBooking.date).endOf("month");
    Service.findById.mockReturnValue(mockService);
    Booking.find.mockReturnValue(mockBookings);
    await BookingService.getByServiceMonth(
      mockBooking.service,
      mockBooking.date,
    );
    expect(Booking.find).toBeCalled();
    expect(Booking.find).toBeCalledWith({
      service: mockBooking.service,
      date: { $gte: start, $lte: end },
    });
  });

  it("should return all bookings for issued service and month", async () => {
    Service.findById.mockReturnValue(mockService);
    Booking.find.mockReturnValue(mockBookings);
    const result = await BookingService.getByServiceMonth(
      mockBooking.service,
      mockBooking.date,
    );
    expect(result).toEqual(mockBookings);
  });

  it("should throw an error if service does not exist", async () => {
    Service.findById.mockImplementation(() => {
      throw new Error("Service does not exist");
    });
    await expect(
      BookingService.getByServiceMonth(mockBooking.service, mockBooking.date),
    ).rejects.toThrow("Service does not exist");
  });

  it("should catch errors", async () => {
    Service.findById.mockReturnValue(mockService);
    Booking.find.mockImplementation(() => {
      throw new Error("Error getting bookings");
    });
    await expect(
      BookingService.getByServiceMonth(mockBooking.service, mockBooking.date),
    ).rejects.toThrow("Error getting bookings");
  });
});

describe("BookingService.getByServiceUser", () => {
  it("should have a getByServiceUser method", () => {
    expect(typeof BookingService.getByServiceUser).toBe("function");
  });

  it("should call Booking.find()", async () => {
    Service.findById.mockReturnValue(mockService);
    User.findById.mockReturnValue(mockUser);
    Booking.find.mockReturnValue(mockBookings);
    await BookingService.getByServiceUser(
      mockBooking.service,
      mockBooking.timeslots[0].userid,
    );
    expect(Booking.find).toBeCalled();
    expect(Booking.find).toBeCalledWith({
      service: mockBooking.service,
      "timeslots.userid": mockBooking.timeslots[0].userid,
    });
  });

  it("should return all bookings for issued service and user", async () => {
    Service.findById.mockReturnValue(mockService);
    User.findById.mockReturnValue(mockUser);
    Booking.find.mockReturnValue(mockBookings);
    const result = await BookingService.getByServiceUser(
      mockBooking.service,
      mockBooking.timeslots[0].userid,
    );
    expect(result).toEqual(mockBookings);
  });

  it("should catch errors", async () => {
    Service.findById.mockReturnValue(mockService);
    User.findById.mockReturnValue(mockUser);
    Booking.find.mockImplementation(() => {
      throw new Error("Error getting bookings");
    });
    await expect(
      BookingService.getByServiceUser(
        mockBooking.service,
        mockBooking.timeslots[0].userid,
      ),
    ).rejects.toThrow("Error getting bookings");
  });
});

describe("BookingService.update", () => {
  const mockBookingId = "6513209a435bc80cc05154772";
  it("should have a update method", () => {
    expect(typeof BookingService.update).toBe("function");
  });

  it("should call Booking.update", async () => {
    Booking.findById.mockReturnValue(mockBooking);
    Booking.findByIdAndUpdate.mockReturnValue(mockBooking);
    await BookingService.update(mockBookingId, mockBooking);
    expect(Booking.findByIdAndUpdate).toBeCalledWith(
      mockBookingId,
      { $set: mockBooking },
      { new: true },
    );
  });

  it("should return the updated booking", async () => {
    Booking.findById.mockReturnValue(mockBooking);
    Booking.findByIdAndUpdate.mockReturnValue(mockBooking);
    const result = await BookingService.update(mockBookingId, mockBooking);
    expect(result).toEqual(mockBooking);
  });

  it("should catch errors", async () => {
    Booking.findById.mockReturnValue(mockBooking);
    Booking.findByIdAndUpdate.mockImplementation(() => {
      throw new Error("Error updating booking");
    });
    await expect(
      BookingService.update(mockBookingId, mockBooking),
    ).rejects.toThrow("Error updating booking");
  });

  it("should throw an error if the booking does not exist", async () => {
    Booking.findById.mockReturnValue(null);
    Booking.findByIdAndUpdate.mockReturnValue(mockBooking);
    await expect(
      BookingService.update(mockBookingId, mockBooking),
    ).rejects.toThrow(`Booking with id ${mockBookingId} does not exist`);
  });
});

describe("BookingService.delete", () => {
  const mockBookingId = "6513209a435bc80cc0515477";

  it("should have a delete method", () => {
    Booking.findByIdAndRemove.mockReturnValue(mockBooking);
    expect(typeof BookingService.delete).toBe("function");
  });

  it("should call Booking.findByIdAndRemove", async () => {
    Booking.findByIdAndRemove.mockReturnValue(mockBooking);
    await BookingService.delete(mockBookingId);
    expect(Booking.findByIdAndRemove).toBeCalledWith(mockBookingId);
  });

  it("should catch errors", async () => {
    Booking.findByIdAndRemove.mockImplementation(() => {
      throw new Error("Error deleting booking");
    });
    await expect(BookingService.delete(mockBookingId)).rejects.toThrow(
      "Error deleting booking",
    );
  });
});
