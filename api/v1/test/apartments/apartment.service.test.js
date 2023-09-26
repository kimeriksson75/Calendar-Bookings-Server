const ApartmentService = require('../../apartments/apartment.service');
const mongoose = require('mongoose');

const { Apartment } = require('../../_helpers/db');

const mockApartment = require('../mock-data/apartment.json')
const mockApartments = require('../mock-data/apartments.json')
const mockApartmentWithoutId = { ...mockApartment };
delete mockApartmentWithoutId._id;

let {isValidObjectId} = require('../../_helpers/db.document.validation');
Apartment.create = jest.fn();
Apartment.find = jest.fn();
Apartment.findOne = jest.fn();
Apartment.findById = jest.fn();
Apartment.findOneAndUpdate = jest.fn();
Apartment.findByIdAndRemove = jest.fn();
isValidObjectId = jest.fn().mockReturnValue(true);

describe('ApartmentService.create', () => {
    
    it('should have a create method', () => {
        expect(typeof ApartmentService.create).toBe('function');
    });

    it('should call Apartment.create', async () => {
        Apartment.create.mockReturnValue(mockApartmentWithoutId);
        await ApartmentService.create(mockApartmentWithoutId);
        expect(Apartment.create).toBeCalledWith(mockApartmentWithoutId);
    });

    it('should return the created apartment', async () => {
        Apartment.create.mockReturnValue(mockApartmentWithoutId);
        const result = await ApartmentService.create(mockApartmentWithoutId);
        expect(result).toEqual(mockApartmentWithoutId);
    });

    it('should catch errors', async () => {
        Apartment.create.mockImplementation(() => {
            throw new Error('Error creating apartment');
        });
        await expect(ApartmentService.create(mockApartmentWithoutId)).rejects.toThrow('Error creating apartment');
    });

    it('should throw an error if the apartment already exists', async () => {
        await expect(ApartmentService.create(mockApartmentWithoutId)).rejects.toThrow(`Error creating apartment`);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('ApartmentService.getAll', () => {
    it('should have a getAll method', () => {
        expect(typeof ApartmentService.getAll).toBe('function');
    });

    it('should call Apartment.find()', async () => {
        Apartment.find.mockReturnValue(mockApartments);
        await ApartmentService.getAll();
        expect(Apartment.find).toBeCalled();
    });

    it('should return all apartments', async () => {
        Apartment.find.mockReturnValue(mockApartments);
        const result = await ApartmentService.getAll();
        expect(result).toEqual(mockApartments);
    });

    it('should catch errors', async () => {
        Apartment.find.mockImplementation(() => {
            throw new Error('Error requesting apartments');
        });
        await expect(ApartmentService.getAll()).rejects.toThrow('Error requesting apartments');
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
        Apartment.find.mockReturnValue(mockApartments);
        await ApartmentService.getByResidence();
        expect(Apartment.find).toBeCalled();
    });

    it('should return all apartments', async () => {
        Apartment.find.mockReturnValue(mockApartments);
        const result = await ApartmentService.getByResidence();
        expect(result).toEqual(mockApartments);
    });

    it('should catch errors', async () => {
        Apartment.find.mockImplementation(() => {
            throw new Error('Error requesting apartments');
        });
        await expect(ApartmentService.getByResidence()).rejects.toThrow('Error requesting apartments');
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
        
        Apartment.findById.mockReturnValue(mockApartment);

        await ApartmentService.getById(mockApartment._id);
        expect(Apartment.findById).toBeCalledWith(mockApartment._id);
    });

    it('should return the apartment', async () => {
        Apartment.findById.mockReturnValue(mockApartment);
        const result = await ApartmentService.getById(mockApartment._id);
        expect(result).toEqual(mockApartment);
    });

    it('should catch errors', async () => {
        Apartment.findById.mockImplementation(() => {
            throw new Error(`Error requesting apartment with id ${mockApartment._id}`);
        });
        await expect(ApartmentService.getById(mockApartment._id)).rejects.toThrow(`Error requesting apartment with id ${mockApartment._id}`);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('ApartmentService.update', () => {
    const mockId = '650991a92ad13cb743a28e92';
    it('should have a update method', () => {
        expect(typeof ApartmentService.update).toBe('function');
    });

    it('should call Apartment.findOneAndUpdate', async () => {
        Apartment.findOneAndUpdate.mockReturnValue(mockApartment);
        await ApartmentService.update(mockId, mockApartmentWithoutId);
        expect(Apartment.findOneAndUpdate).toBeCalledWith({ _id: mockId}, { $set: mockApartmentWithoutId }, { new: true });
    });

    it('should return the apartment', async () => {
        Apartment.findOneAndUpdate.mockReturnValue(mockApartment);
        const result = await ApartmentService.update(mockId, mockApartmentWithoutId);
        expect(result).toEqual(mockApartment);
    });

    it('should catch errors', async () => {
        Apartment.findOneAndUpdate.mockImplementation(() => {
            throw new Error('Error updating apartment');
        })
        await expect(ApartmentService.update(mockId, mockApartmentWithoutId)).rejects.toThrow('Error updating apartment');
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
        Apartment.findByIdAndRemove.mockReturnValue(mockApartment);
        await ApartmentService.delete(mockApartment._id);
        expect(Apartment.findByIdAndRemove).toBeCalledWith(mockApartment._id);
    });

    it('should return the apartment', async () => {
        Apartment.findByIdAndRemove.mockReturnValue(mockApartment);
        const result = await ApartmentService.delete(mockApartment._id);
        expect(result).toEqual(mockApartment);
    });

    it('should catch errors', async () => {
        Apartment.findByIdAndRemove.mockImplementation(() => {
            throw new Error('Error deleting apartment');
        });
        await expect(ApartmentService.delete(mockApartment._id)).rejects.toThrow('Error deleting apartment');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});