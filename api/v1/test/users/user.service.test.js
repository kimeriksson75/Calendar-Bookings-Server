const UserService = require('../../users/user.service');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Apartment } = require('../../_helpers/db');
User.find = jest.fn();
User.findOne = jest.fn();
User.findById = jest.fn();
User.findOneAndUpdate = jest.fn();
User.findOneAndRemove = jest.fn();
Apartment.findOne = jest.fn();


const mockUser = require('../mock-data/user.json');
const mockUserUpdate = {
    ...mockUser,
    username: 'updated username',
    firstname: 'updated firstname',
    lastname: 'updated lastname'
}
const mockUsers = require('../mock-data/users.json');
const mockApartment = require('../mock-data/apartment.json')

const user = new User(mockUser);
user.save = jest.fn();

beforeEach(() => {
    jest.useFakeTimers();
});
describe('UserService.register', () => { 
    it('should have a register method', () => {
        expect(typeof UserService.register).toBe('function');
    });

    /*
    it('should call User.findOne', async () => {
        User.findOne.mockReturnValueOnce(null)
            .mockReturnValueOnce(null);
        Apartment.findOne.mockReturnValueOnce(mockApartment);
        
        user.save.mockReturnValue(mockUser);
        await UserService.register(mockUser);
        expect(User.findOne).toBeCalledWith({ username: mockUser.username });    
        expect(User.findOne).toBeCalledWith({ apartment: mockUser.apartment });
        expect(Apartment.findOne).toBeCalledWith({ _id: mockUser.apartment });
    });

    */
    
    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe.skip('UserService.authenticate', () => {
    it('should have a authenticate method', () => {
        expect(typeof UserService.authenticate).toBe('function');
    });

    it('should call User.findOne', async () => {
        User.findOne.mockReturnValue(mockUser);
        bcrypt.compareSync = jest.fn().mockReturnValue(true);
        jwt.sign = jest.fn().mockResolvedValue('token');
        await UserService.authenticate(mockUser);
        expect(User.findOne).toBeCalledWith({ username: mockUser.username });
    });

    it('should return user data', async () => {
        User.findOne.mockReturnValue(mockUser);
        bcrypt.compareSync = jest.fn().mockReturnValue(true);
        jwt.sign = jest.fn().mockResolvedValue('token');
        const result = await UserService.authenticate(mockUser);
        expect(result).toEqual({
            ...mockUser,
            token: 'token'
        });
    });

    it('should return user without hash', async () => {
        User.findOne.mockReturnValue(mockUser);
        bcrypt.compareSync = jest.fn().mockReturnValue(true);
        jwt.sign = jest.fn().mockResolvedValue('token');
        const result = await UserService.authenticate(mockUser);
        expect(result.token).toEqual('token');
        
    })

    it('should throw an error if user is not found', async () => {
        User.findOne.mockReturnValue(null);
        await expect(UserService.authenticate(mockUser)).rejects.toThrow(`Username ${mockUser.username} is not found`);
    });

    it('should throw an error if password is incorrect', async () => {
        const invalidmockUser = {
            ...mockUser,
            password: 'invalid password'
        }
        User.findOne.mockReturnValue(invalidmockUser);
        bcrypt.compareSync = jest.fn().mockReturnValue(false);
        jwt.sign = jest.fn().mockResolvedValue('token');
        await expect(UserService.authenticate(invalidmockUser)).rejects.toThrow('Password is incorrect');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('UserService.update', () => {
    it('should have a update method', () => {
        expect(typeof UserService.update).toBe('function');
    });

    it('should call User.findOneAndUpdate', async () => {
        User.findOneAndUpdate.mockReturnValue(mockUser);
        bcrypt.hashSync = jest.fn().mockReturnValue('hashed password');
        await UserService.update(mockUserUpdate.id, mockUserUpdate);
        expect(User.findOneAndUpdate).toBeCalledWith({ _id: mockUserUpdate.id }, { $set: mockUserUpdate }, { new: true });
    });

    it('should return user data', async () => {

        User.findOneAndUpdate.mockReturnValue({
            ...mockUser,
            ...mockUserUpdate
        });
        bcrypt.hashSync = jest.fn().mockResolvedValueOnce('hashed password');

        const result = await UserService.update(mockUserUpdate.id, mockUserUpdate);
        expect(result).toEqual(mockUserUpdate);
    });

    it('should throw an error if user is not found', async () => {
        User.findOneAndUpdate.mockReturnValue(null);
        await expect(UserService.update(mockUserUpdate.id, mockUserUpdate)).rejects.toThrow(`User with id ${mockUserUpdate.id} does not exist`);
    });

    it('should catch errors', async () => {
        User.findOneAndUpdate.mockRejectedValue('Error updating user');
        await expect(UserService.update(mockUserUpdate.id, mockUserUpdate)).rejects.toThrow('Error updating user');
    });
});

describe('UserService.getAll', () => {
    it('should have a getAll method', () => {
        expect(typeof UserService.getAll).toBe('function');
    });

    it('should call User.find', async () => {
        User.find.mockReturnValue(mockUsers);
        await UserService.getAll();
        expect(User.find).toBeCalled();
    });

    it('should return all users', async () => {
        User.find.mockReturnValue(mockUsers);
        const result = await UserService.getAll();
        expect(result).toEqual(mockUsers);
    });

    it('should catch errors', async () => {
        User.find.mockRejectedValue('Error getting users');
        await expect(UserService.getAll()).rejects.toThrow('Error getting users');
    });
});

describe('UserService.getById', () => {
    it('should have a getById method', () => {
        expect(typeof UserService.getById).toBe('function');
    });

    it('should call User.findById', async () => {
        User.findById.mockReturnValue(mockUser);
        await UserService.getById(mockUser.id);
        expect(User.findById).toBeCalledWith(mockUser.id);
    });

    it('should return the user', async () => {
        User.findById.mockReturnValue(mockUser);
        const result = await UserService.getById(mockUser.id);
        expect(result).toEqual(mockUser);
    });

    it('should throw an error if the user does not exist', async () => {
        User.findById.mockReturnValue(null);
        await expect(UserService.getById(mockUser.id)).rejects.toThrow(`User with id ${mockUser.id} does not exist`);
    });

    it('should catch errors', async () => {
        User.findById.mockRejectedValue('Error deleting user');
        await expect(UserService.getById(mockUser.id)).rejects.toThrow('Error deleting user');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('UserService.delete', () => {
    it('should have a delete method', () => {
        expect(typeof UserService.delete).toBe('function');
    });

    it('should call User.findOneAndRemove', async () => {
        User.findOneAndRemove.mockReturnValue(mockUser);
        await UserService.delete(mockUser.id);
        expect(User.findOneAndRemove).toBeCalledWith(mockUser.id);
    });

    it('should throw an error if the user does not exist', async () => {
        User.findOneAndRemove.mockReturnValue(null);
        await expect(UserService.delete(mockUser.id)).rejects.toThrow(`User with id ${mockUser.id} does not exist`);
    });

    it('should catch errors', async () => {
        User.findOneAndRemove.mockRejectedValue('Error deleting user');
        await expect(UserService.delete(mockUser.id)).rejects.toThrow('Error deleting user');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
        

        
