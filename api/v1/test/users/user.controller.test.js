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

describe('UserController.authenticate', () => {
    it('should have a authenticate method', () => {
        expect(typeof UserController.authenticate).toBe('function');
    });

    it('should call UserService.authenticate', () => {
        UserService.authenticate = jest.fn(() => Promise.resolve(mockUser));
        UserController.authenticate(req, res, next);
        expect(UserService.authenticate).toBeCalled();
    });

    it('should return response with status 200 and user', async () => {
        UserService.authenticate = jest.fn(() => Promise.resolve(mockUser));
        await UserController.authenticate(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockUser);
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while authenticating user' };
        const rejectedPromise = Promise.reject(errorMessage);
        UserService.authenticate = jest.fn(() => rejectedPromise);
        await UserController.authenticate(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

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

describe('UserController.getAll', () => {
    it('should have a getAll method', () => {
        expect(typeof UserController.getAll).toBe('function');
    });

    it('should call UserService.getAll', () => {
        UserService.getAll = jest.fn(() => Promise.resolve(mockUser));
        UserController.getAll(req, res, next);
        expect(UserService.getAll).toBeCalled();
    });

    it('should return response with status 200 and all users', async () => {
        UserService.getAll = jest.fn(() => Promise.resolve(mockUser));
        await UserController.getAll(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockUser);
    });

    it('should handle errors', async () => {
        const errorMessage = 'Error while getting all users';
        const rejectedPromise = Promise.reject(errorMessage);
        UserService.getAll = jest.fn(() => rejectedPromise);
        await UserController.getAll(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('UserController.getById', () => {
    it('should have a getById method', () => {
        expect(typeof UserController.getById).toBe('function');
    });

    it('should call UserService.getById', () => {
        req.params.id = mockUser._id;
        UserService.getById = jest.fn(() => Promise.resolve(mockUser));
        UserController.getById(req, res, next);
        expect(UserService.getById).toBeCalledWith(req.params.id);
    });

    it('should return 200 response and user', async () => {
        UserService.getById = jest.fn(() => Promise.resolve(mockUser));
        await UserController.getById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockUser);
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while getting user' };
        const rejectedPromise = Promise.reject(errorMessage);
        UserService.getById = jest.fn(() => rejectedPromise);
        await UserController.getById(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('UserController.update', () => {
    it('should have a update method', () => {
        expect(typeof UserController.update).toBe('function');
    });

    it('should call UserService.update', () => {
        UserService.update = jest.fn(() => Promise.resolve(mockUser));
        req.params.id = mockUser._id;
        req.body = mockUser;
        UserController.update(req, res, next);
        expect(UserService.update).toBeCalledWith(req.params.id, req.body);
    });

    it('should return response with status 200 and updated user', async () => {
        UserService.update = jest.fn(() => Promise.resolve(mockUser));
        await UserController.update(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockUser);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while updating user' };
        const rejectedPromise = Promise.reject(errorMessage);
        UserService.update = jest.fn(() => rejectedPromise);
        await UserController.update(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('UserController._delete', () => {
    it('should have a _delete method', () => {
        expect(typeof UserController._delete).toBe('function');
    });

    it('should call UserService.delete', () => {
        UserService.delete = jest.fn(() => Promise.resolve(mockUser));
        req.params.id = mockUser._id;
        UserController._delete(req, res, next);
        expect(UserService.delete).toBeCalledWith(req.params.id);
    });

    it('should return 200 response and deleted user', async () => {
        UserService.delete = jest.fn(() => Promise.resolve(mockUser));
        await UserController._delete(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockUser);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { status: 400, message: 'Error while deleting user' };
        const rejectedPromise = Promise.reject(errorMessage);
        UserService.delete = jest.fn(() => rejectedPromise);
        await UserController._delete(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});