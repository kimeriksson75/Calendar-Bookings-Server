const ApartmentService = require('../../apartments/apartment.service');
const mongoose = require('mongoose');

const { Apartment } = require('../../_helpers/db');

const mockApartment = require('../mock-data/apartment.json')
const mockApartments = require('../mock-data/apartments.json')

Apartment.create = jest.fn();
Apartment.find = jest.fn();
Apartment.findOne = jest.fn();
Apartment.findById = jest.fn();
Apartment.findByIdAndRemove = jest.fn();

describe('ApartmentService.create', () => {
    it('should have a create method', () => {
        expect(typeof ApartmentService.create).toBe('function');
    });

    it('should call Apartment.create', async () => {
        Apartment.findOne.mockReturnValue(null);
        await ApartmentService.create(mockApartment);
        expect(Apartment.create).toBeCalledWith(mockApartment);
    });

    it('should return the created apartment', async () => {
        Apartment.findOne.mockReturnValue(null);
        Apartment.create.mockReturnValue(mockApartment);
        const result = await ApartmentService.create(mockApartment);
        expect(result).toEqual(mockApartment);
    });

    it('should catch errors', async () => {
        Apartment.findOne.mockReturnValue(null);
        Apartment.create.mockRejectedValue('Error creating apartment');
        await expect(ApartmentService.create(mockApartment)).rejects.toThrow('Error creating apartment');
    });

    it('should throw an error if the apartment already exists', async () => {
        Apartment.findOne.mockReturnValue(mockApartment);
        await expect(ApartmentService.create(mockApartment)).rejects.toThrow(`Apartment with name ${mockApartment.name} already exists`);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('ApartmentService.getByResidence', () => {
    it('should have a getByResidence method', () => {
        expect(typeof ApartmentService.getByResidence).toBe('function');
    });

    it('should call Apartment.find()', async () => {
        await ApartmentService.getByResidence();
        expect(Apartment.find).toBeCalled();
    });

    it('should return all apartments', async () => {
        Apartment.find.mockReturnValue(mockApartments);
        const result = await ApartmentService.getByResidence();
        expect(result).toEqual(mockApartments);
    });

    it('should catch errors', async () => {
        Apartment.find.mockRejectedValue('Error getting apartments');
        await expect(ApartmentService.getByResidence()).rejects.toThrow('Error getting apartments');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('ApartmentService.getById', () => {
    it('should have a getById method', () => {
        expect(typeof ApartmentService.getById).toBe('function');
    });

    it('should call Apartment.findById()', async () => {
        await ApartmentService.getById(mockApartment.id);
        expect(Apartment.findById).toBeCalledWith(mockApartment.id);
    });

    it('should return the apartment', async () => {
        Apartment.findById.mockReturnValue(mockApartment);
        const result = await ApartmentService.getById(mockApartment.id);
        expect(result).toEqual(mockApartment);
    });

    it('should catch errors', async () => {
        Apartment.findById.mockRejectedValue('Error getting apartment');
        await expect(ApartmentService.getById(mockApartment.id)).rejects.toThrow('Error getting apartment');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('ApartmentService.delete', () => {
    it('should have a delete method', () => {
        expect(typeof ApartmentService.delete).toBe('function');
    });

    it('should call Apartment.findByIdAndRemove', async () => {
        await ApartmentService.delete(mockApartment.id);
        expect(Apartment.findByIdAndRemove).toBeCalledWith(mockApartment.id);
    });

    it('should catch errors', async () => {
        Apartment.findByIdAndRemove.mockRejectedValue('Error deleting apartment');
        await expect(ApartmentService.delete(mockApartment.id)).rejects.toThrow('Error deleting apartment');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});