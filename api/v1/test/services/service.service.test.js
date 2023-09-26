const ServiceService = require('../../services/service.service');
const mongoose = require('mongoose');

const { Service } = require('../../_helpers/db');

const mockService = require('../mock-data/service.json')
const mockServices = require('../mock-data/services.json')


Service.create = jest.fn();
Service.find = jest.fn();
Service.findById = jest.fn();
Service.findByIdAndRemove = jest.fn();

describe('ServiceService.create', () => {
    it('should have a create method', () => {
        expect(typeof ServiceService.create).toBe('function');
    });

    it('should call Service.create', async () => {
        await ServiceService.create(mockService);
        expect(Service.create).toBeCalledWith(mockService);
    });

    it('should return the created service', async () => {
        Service.create.mockReturnValue(mockService);
        const result = await ServiceService.create(mockService);
        expect(result).toEqual(mockService);
    });

    it('should catch errors', async () => {
        Service.create.mockRejectedValue('Error creating service');
        await expect(ServiceService.create(mockService)).rejects.toThrow('Error creating service');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('ServiceService.getAll', () => {
    it('should have a getAll method', () => {
        expect(typeof ServiceService.getAll).toBe('function');
    });

    it('should call Service.find', async () => {
        await ServiceService.getAll();
        expect(Service.find).toBeCalled();
    });

    it('should return all services', async () => {
        Service.find.mockReturnValue(mockServices);
        const result = await ServiceService.getAll();
        expect(result).toEqual(mockServices);
    });

    it('should catch errors', async () => {
        Service.find.mockRejectedValue('Error getting services');
        await expect(ServiceService.getAll()).rejects.toThrow('Error getting services');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('ServiceService.getById', () => {
    it('should have a getById method', () => {
        expect(typeof ServiceService.getById).toBe('function');
    });

    it('should call Service.findById', async () => {
        await ServiceService.getById(mockService.id);
        expect(Service.findById).toBeCalledWith(mockService.id);
    });

    it('should return the service', async () => {
        Service.findById.mockReturnValue(mockService);
        const result = await ServiceService.getById(mockService.id);
        expect(result).toEqual(mockService);
    });

    it('should catch errors', async () => {
        Service.findById.mockRejectedValue('Error getting service');
        expect(ServiceService.getById(mockService.id)).rejects.toThrow('Error getting service');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

describe('ServiceService.getByResidence', () => {
    it('should have a getByResidence method', () => {
        expect(typeof ServiceService.getByResidence).toBe('function');
    });

    it('should call Service.find', async () => {
        Service.find.mockReturnValue(mockServices);
        await ServiceService.getByResidence(mockService.residence);
        expect(Service.find).toBeCalledWith({ residence: mockService.residence });
    });

    it('should return the services', async () => {
        Service.find.mockReturnValue(mockServices);
        const result = await ServiceService.getByResidence(mockService.residence);
        expect(result).toEqual(mockServices);
    });

    it('should catch errors', async () => {
        Service.find.mockRejectedValue('Error getting services');
        expect(ServiceService.getByResidence(mockService.residence)).rejects.toThrow('Error getting services');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});