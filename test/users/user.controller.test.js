const UserController = require('../../users/user.controller');
const UserService = require('../../users/user.service');
const httpMocks = require('node-mocks-http');

const mongoose = require('mongoose');

const mockUser = require('../mock-data/user.json');
const { User } = require('../../_helpers/db');

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})


describe('UserController.register', () => {
    it('should have a register method', () => {
        expect(typeof UserController.register).toBe('function');
    });

    it('should call UserService.register', () => {
        UserService.register = jest.fn(() => Promise.resolve(mockUser));

        UserController.register(req, res, next);
        expect(UserService.register).toBeCalledWith(req.body);
    });

    it('should return 200 response and registered user data', async () => {
        UserService.register = jest.fn(() => Promise.resolve(mockUser));

        req.body = mockUser;
        await UserController.register(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockUser);
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while registering user' };
        const rejectedPromise = Promise.reject(errorMessage);
        UserService.register = jest.fn(() => rejectedPromise);
        await UserController.register(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    it('should return 400 when user already exists', async () => {
        UserService.register = jest.fn(() => Promise.resolve(null));
        await UserController.register(req, res, next);
        expect(res.statusCode).toBe(400);
    });

    it('should return 400 when apartment is not found', async () => {
        const errorMessage = { status: 400, message: 'Apartment is not found' };
        const rejectedPromise = Promise.reject(errorMessage);
        UserService.register = jest.fn(() => rejectedPromise);
        await UserController.register(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
    });
});