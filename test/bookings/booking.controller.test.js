const BookingController = require('../../bookings/booking.controller');
const BookingService = require('../../bookings/booking.service');
const httpMocks = require('node-mocks-http');

const mongoose = require('mongoose');

const mockBooking = require('../mock-data/booking.json');
const mockBookings = require('../mock-data/bookings.json');

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('BookingController.create', () => {
    it('should have a create method', () => {
        expect(typeof BookingController.create).toBe('function');
    });

    it('should call BookingService.create', () => {
        BookingService.create = jest.fn(() => Promise.resolve(mockBooking));

        BookingController.create(req, res, next);
        expect(BookingService.create).toBeCalledWith(req.body);
    });

    it('should return 200 response and created booking data', async () => {
        BookingService.create = jest.fn(() => Promise.resolve(mockBooking));

        req.body = mockBooking;
        await BookingController.create(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockBooking);
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while creating booking' };
        const rejectedPromise = Promise.reject(errorMessage);
        BookingService.create = jest.fn(() => rejectedPromise);
        await BookingController.create(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingController.getByService', () => {
    it('should have a getByService method', () => {
        expect(typeof BookingController.getByService).toBe('function');
    });

    it('should call BookingService.getByService', () => {
        BookingService.getByService = jest.fn(() => Promise.resolve(mockBookings));
        req.params.service = mockBooking.service;
        BookingController.getByService(req, res, next);
        expect(BookingService.getByService).toBeCalledWith(req.params.service);
    });

    it('should return response with status 200 and all bookings', async () => {
        BookingService.getByService = jest.fn(() => Promise.resolve(mockBookings));
        await BookingController.getByService(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockBookings);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while getting all bookings' };
        const rejectedPromise = Promise.reject(errorMessage);
        BookingService.getByService = jest.fn(() => rejectedPromise);
        await BookingController.getByService(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingController.getByDate', () => {
    it('should have a getByDate method', () => {
        expect(typeof BookingController.getByDate).toBe('function');
    });

    it('should call BookingService.getByDate', () => {
        BookingService.getByDate = jest.fn(() => Promise.resolve(mockBooking));
        req.params.service = mockBooking.service;
        req.params.date = mockBooking.date;
        BookingController.getByDate(req, res, next);
        expect(BookingService.getByDate).toBeCalledWith(req.params.service, req.params.date);
    });

    it('should return response with status 200 and booking', async () => {
        BookingService.getByDate = jest.fn(() => Promise.resolve(mockBooking));
        await BookingController.getByDate(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockBooking);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while getting booking' };
        const rejectedPromise = Promise.reject(errorMessage);
        BookingService.getByDate = jest.fn(() => rejectedPromise);
        await BookingController.getByDate(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingController.getByMonth', () => {
    it('should have a getByMonth method', () => {
        expect(typeof BookingController.getByMonth).toBe('function');
    });

    it('should call BookingService.getByMonth', () => {
        BookingService.getByMonth = jest.fn(() => Promise.resolve(mockBookings));
        req.params.service = mockBooking.service;
        req.params.date = mockBooking.date;
        BookingController.getByMonth(req, res, next);
        expect(BookingService.getByMonth).toBeCalledWith(req.params.service, req.params.date);
    });

    it('should return response with status 200 and booking', async () => {
        BookingService.getByMonth = jest.fn(() => Promise.resolve(mockBookings));
        await BookingController.getByMonth(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockBookings);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while getting booking' };
        const rejectedPromise = Promise.reject(errorMessage);
        BookingService.getByMonth = jest.fn(() => rejectedPromise);
        await BookingController.getByMonth(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingController.getByUser', () => {
    it('should have a getByUser method', () => {
        expect(typeof BookingController.getByUser).toBe('function');
    });

    it('should call BookingService.getByUser', () => {
        BookingService.getByUser = jest.fn(() => Promise.resolve(mockBookings));
        req.params.service = mockBooking.service;
        req.params.id = mockBooking.timeslots[0].userId;
        BookingController.getByUser(req, res, next);
        expect(BookingService.getByUser).toBeCalledWith(req.params.service, req.params.id);
    });

    it('should return response with status 200 and booking', async () => {
        BookingService.getByUser = jest.fn(() => Promise.resolve(mockBookings));
        await BookingController.getByUser(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockBookings);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while getting booking' };
        const rejectedPromise = Promise.reject(errorMessage);
        BookingService.getByUser = jest.fn(() => rejectedPromise);
        await BookingController.getByUser(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingController.update', () => {
    it('should have a update method', () => {
        expect(typeof BookingController.update).toBe('function');
    });

    it('should call BookingService.update', () => {
        BookingService.update = jest.fn(() => Promise.resolve(mockBooking));
        req.params.id = mockBooking._id;
        req.body = mockBooking;
        BookingController.update(req, res, next);
        expect(BookingService.update).toBeCalledWith(req.params.id, req.body);
    });

    it('should return response with status 200 and updated booking', async () => {
        BookingService.update = jest.fn(() => Promise.resolve(mockBooking));
        await BookingController.update(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockBooking);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while updating booking' };
        const rejectedPromise = Promise.reject(errorMessage);
        BookingService.update = jest.fn(() => rejectedPromise);
        await BookingController.update(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingController.delete', () => {
    it('should have a delete method', () => {
        expect(typeof BookingController._delete).toBe('function');
    });

    it('should call BookingService.delete', () => {
        BookingService.delete = jest.fn(() => Promise.resolve(mockBooking));
        req.params.id = mockBooking._id;
        BookingController._delete(req, res, next);
        expect(BookingService.delete).toBeCalledWith(req.params.id);
    });

    it('should return response with status 200 and deleted booking', async () => {
        BookingService.delete = jest.fn(() => Promise.resolve(mockBooking));
        await BookingController._delete(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockBooking);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while deleting booking' };
        const rejectedPromise = Promise.reject(errorMessage);
        BookingService.delete = jest.fn(() => rejectedPromise);
        await BookingController._delete(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});