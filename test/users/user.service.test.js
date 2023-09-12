const UserService = require('../../users/user.service');
const mongoose = require('mongoose');

const { User, Apartment } = require('../../_helpers/db');
User.findOne = jest.fn();
Apartment.findOne = jest.fn();


const mockUser = require('../mock-data/user.json');
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
