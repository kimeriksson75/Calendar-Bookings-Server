const ApartmentController = require('../../apartments/apartment.controller');
const ApartmentService = require('../../apartments/apartment.service');
const httpMocks = require('node-mocks-http');

const mongoose = require('mongoose');

const mockApartment = require('../mock-data/apartment.json');
const mockApartments = require('../mock-data/apartments.json');

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})

describe('ApartmentController.create', () => {
    it('should have a create method', () => {
        expect(typeof ApartmentController.create).toBe('function');
    });

    it('should call ApartmentService.create', () => {
        ApartmentService.create = jest.fn(() => Promise.resolve(mockApartment));

        ApartmentController.create(req, res, next);
        expect(ApartmentService.create).toBeCalledWith(req.body);
    });

    it('should return 200 response and created apartment data', async () => {
        ApartmentService.create = jest.fn(() => Promise.resolve(mockApartment));

        req.body = mockApartment;
        await ApartmentController.create(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockApartment);
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while creating apartment' };
        const rejectedPromise = Promise.reject(errorMessage);
        ApartmentService.create = jest.fn(() => rejectedPromise);
        await ApartmentController.create(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('ApartmentController.getByResidence by residence', () => {
    it('should have a getByResidence method', () => {
        expect(typeof ApartmentController.getByResidence).toBe('function');
    });

    it('should call ApartmentService.getByResidence', () => {
        ApartmentService.getByResidence = jest.fn(() => Promise.resolve(mockApartments));
        req.params.residence = mockApartment.residence;
        ApartmentController.getByResidence(req, res, next);
        expect(ApartmentService.getByResidence).toBeCalledWith(req.params.residence);
    });

    it('should return 200 response and all apartments for issued residence', async () => {
        ApartmentService.getByResidence = jest.fn(() => Promise.resolve(mockApartments));
        await ApartmentController.getByResidence(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockApartments);
    });
});

describe('ApartmentController.getById', () => {
    it('should have a getById method', () => {
        expect(typeof ApartmentController.getById).toBe('function');
    });

    it('should call ApartmentService.getById', () => {
        req.params.id = mockApartment._id;
        ApartmentService.getById = jest.fn(() => Promise.resolve(mockApartment));
        ApartmentController.getById(req, res, next);
        expect(ApartmentService.getById).toBeCalledWith(req.params.id);
    });

    it('should return 200 response and apartment', async () => {
        ApartmentService.getById = jest.fn(() => Promise.resolve(mockApartment));
        await ApartmentController.getById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockApartment);
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while getting apartment' };
        const rejectedPromise = Promise.reject(errorMessage);
        ApartmentService.getById = jest.fn(() => rejectedPromise);
        await ApartmentController.getById(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('ApartmentController._delete', () => {
    it('should have a delete method', () => {
        expect(typeof ApartmentController._delete).toBe('function');
    });

    it('should call ApartmentService._delete', () => {
        req.params.id = mockApartment._id;
        ApartmentService.delete = jest.fn(() => Promise.resolve());
        ApartmentController._delete(req, res, next);
        expect(ApartmentService.delete).toBeCalledWith(req.params.id);
    });

    it('should return 200 response', async () => {
        ApartmentService.delete = jest.fn(() => Promise.resolve());
        await ApartmentController._delete(req, res, next);
        expect(res.statusCode).toBe(200);
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while deleting apartment' };
        const rejectedPromise = Promise.reject(errorMessage);
        ApartmentService.delete = jest.fn(() => rejectedPromise);
        await ApartmentController._delete(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});
