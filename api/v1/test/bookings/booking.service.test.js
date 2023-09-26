const BookingService = require('../../bookings/booking.service');
const mongoose = require('mongoose');
const moment = require('moment');

const { Booking } = require('../../_helpers/db');

const mockBooking = require('../mock-data/booking.json')
const mockBookings = require('../mock-data/bookings.json')

Booking.create = jest.fn();
Booking.find = jest.fn();
Booking.findOne = jest.fn();
Booking.findById = jest.fn();
Booking.findOneAndUpdate = jest.fn();
Booking.findOneAndRemove = jest.fn();

describe('BookingService.create', () => {
    it('should have a create method', () => {
        expect(typeof BookingService.create).toBe('function');
    });

    it('should call Booking.create', async () => {
        Booking.findById.mockReturnValue(null);
        await BookingService.create(mockBooking);
        expect(Booking.create).toBeCalledWith(mockBooking);
    });

    it('should return the created booking', async () => {
        Booking.findById.mockReturnValue(null);
        Booking.create.mockReturnValue(mockBooking);
        const result = await BookingService.create(mockBooking);
        expect(result).toEqual(mockBooking);
    });

    it('should catch errors', async () => {
        Booking.findById.mockReturnValue(null);
        Booking.create.mockRejectedValue('Error creating booking');
        await expect(BookingService.create(mockBooking)).rejects.toThrow('Error creating booking');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingService.getByService', () => {
    it('should have a getByService method', () => {
        expect(typeof BookingService.getByService).toBe('function');
    });

    it('should call Booking.find()', async () => {
        await BookingService.getByService(mockBooking.service);
        expect(Booking.find).toBeCalled();
        expect(Booking.find).toBeCalledWith({ service: mockBooking.service });
    });

    it('should return all bookings for issued service', async () => {
        Booking.find.mockReturnValue(mockBookings);
        const result = await BookingService.getByService(mockBooking.service);
        expect(result).toEqual(mockBookings);
    });

    it('should catch errors', async () => {
        Booking.find.mockRejectedValue('Error getting bookings');
        await expect(BookingService.getByService(mockBooking.service)).rejects.toThrow('Error getting bookings');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingService.getByServiceDate', () => {
    it('should have a getByServiceDate method', () => {
        expect(typeof BookingService.getByServiceDate).toBe('function');
    });

    it('should call Booking.findOne()', async () => {
        const start = moment(mockBooking.date).startOf('day');
        const end = moment(mockBooking.date).endOf('day');
        await BookingService.getByServiceDate(mockBooking.service, mockBooking.date);
        expect(Booking.findOne).toBeCalled();
        expect(Booking.findOne).toBeCalledWith({ service: mockBooking.service, date: { '$gte': start, '$lte': end } });
    });

    it('should return the booking for issued service and date', async () => {
        Booking.findOne.mockReturnValue(mockBooking);
        const result = await BookingService.getByServiceDate(mockBooking.service, mockBooking.date);
        expect(result).toEqual(mockBooking);
    });

    it('should catch errors', async () => {
        Booking.findOne.mockRejectedValue('Error getting booking');
        await expect(BookingService.getByServiceDate(mockBooking.service, mockBooking.date)).rejects.toThrow('Error getting booking');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingService.getByServiceMonth', () => {
    it('should have a getByServiceMonth method', () => {
        expect(typeof BookingService.getByServiceMonth).toBe('function');
    });

    it('should call Booking.find()', async () => {
        const start = moment(mockBooking.date).startOf('month');
        const end = moment(mockBooking.date).endOf('month');
        Booking.find.mockReturnValue(mockBookings);
        await BookingService.getByServiceMonth(mockBooking.service, mockBooking.date);
        expect(Booking.find).toBeCalled();
        expect(Booking.find).toBeCalledWith({ service: mockBooking.service, date: { '$gte': start, '$lte': end } });
    });

    it('should return all bookings for issued service and month', async () => {
        Booking.find.mockReturnValue(mockBookings);
        const result = await BookingService.getByServiceMonth(mockBooking.service, mockBooking.date);
        expect(result).toEqual(mockBookings);
    });

    it('should catch errors', async () => {
        Booking.find.mockRejectedValue('Error getting bookings');
        await expect(BookingService.getByServiceMonth(mockBooking.service, mockBooking.date)).rejects.toThrow('Error getting bookings');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingService.getByServiceUser', () => {
    it('should have a getByServiceUser method', () => {
        expect(typeof BookingService.getByServiceUser).toBe('function');
    });

    it('should call Booking.find()', async () => {
        Booking.find.mockReturnValue(mockBookings);
        await BookingService.getByServiceUser(mockBooking.service, mockBooking.timeslots[0].userId);
        expect(Booking.find).toBeCalled();
        expect(Booking.find).toBeCalledWith({ service: mockBooking.service, 'timeslots.userid': mockBooking.timeslots[0].userId });
    });

    it('should return all bookings for issued service and user', async () => {
        Booking.find.mockReturnValue(mockBookings);
        const result = await BookingService.getByServiceUser(mockBooking.service, mockBooking.timeslots[0].userId);
        expect(result).toEqual(mockBookings);
    });

    it('should catch errors', async () => {
        Booking.find.mockRejectedValue('Error getting bookings');
        await expect(BookingService.getByServiceUser(mockBooking.service, mockBooking.timeslots[0].userId)).rejects.toThrow('Error getting bookings');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});


describe('BookingService.update', () => {
    it('should have a update method', () => {
        expect(typeof BookingService.update).toBe('function');
    });

    it('should call Booking.update', async () => {
        Booking.findById.mockReturnValue(mockBooking);
        Booking.findOneAndUpdate.mockReturnValue(mockBooking);
        await BookingService.update(mockBooking.id, mockBooking);
        expect(Booking.findOneAndUpdate).toBeCalledWith({ _id: mockBooking.id }, { $set: mockBooking }, { new: true });
    });

    it('should return the updated booking', async () => {
        Booking.findById.mockReturnValue(mockBooking);
        Booking.findOneAndUpdate.mockReturnValue(mockBooking);
        const result = await BookingService.update(mockBooking.id, mockBooking);
        expect(result).toEqual(mockBooking);
    });

    it('should catch errors', async () => {
        Booking.findById.mockReturnValue(mockBooking);
        Booking.findOneAndUpdate.mockRejectedValue('Error updating booking');
        await expect(BookingService.update(mockBooking.id, mockBooking)).rejects.toThrow('Error updating booking');
    });

    it('should throw an error if the booking does not exist', async () => {
        Booking.findById.mockReturnValue(null);
        await expect(BookingService.update(mockBooking.id, mockBooking)).rejects.toThrow(`Booking with id ${mockBooking.id} does not exist`);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('BookingService.delete', () => {
    it('should have a delete method', () => {
        expect(typeof BookingService.delete).toBe('function');
    });

    it('should call Booking.findOneAndRemove', async () => {
        await BookingService.delete(mockBooking.id);
        expect(Booking.findOneAndRemove).toBeCalledWith(mockBooking.id);
    });

    it('should catch errors', async () => {
        Booking.findOneAndRemove.mockRejectedValue('Error deleting booking');
        await expect(BookingService.delete(mockBooking.id)).rejects.toThrow('Error deleting booking');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});


