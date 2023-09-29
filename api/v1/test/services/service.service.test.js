const ServiceService = require("../../services/service.service");
const { Service, Residence } = require("../../_helpers/db");
const { isValidObjectId } = require("../../_helpers/db.document.validation");
const { validate } = require("../../_helpers/db.schema.validation");
const mockService = require("../mock-data/service.json");
const mockServices = require("../mock-data/services.json");
const mockResidence = require("../mock-data/residence.json");

Service.create = jest.fn();
Service.find = jest.fn();
Service.findById = jest.fn();
Service.findOneAndUpdate = jest.fn();
Service.findByIdAndRemove = jest.fn();
Residence.findById = jest.fn();
jest.mock('../../_helpers/db.document.validation', () => ({
  isValidObjectId: jest.fn().mockImplementation(() => true),
}));
jest.mock("../../_helpers/db.schema.validation", () => ({
  validate: jest.fn().mockImplementation(() => null),
}));
afterEach(() => {
  jest.clearAllMocks();
});

const validServiceId = "6513e49f9d90819b61ef5bbf"
describe("ServiceService.create", () => {
  it("should have a create method", () => {
    expect(typeof ServiceService.create).toBe("function");
  });

  it("should call Service.create", async () => {
    Service.create.mockReturnValue(mockService);
    Residence.findById.mockReturnValue(mockResidence);
    await ServiceService.create(mockService);
    expect(Service.create).toBeCalledWith(mockService);
  });

  it("should return the created service", async () => {
    Service.create.mockReturnValue(mockService);
    Residence.findById.mockReturnValue(mockResidence);
    const result = await ServiceService.create(mockService);
    expect(result).toEqual(mockService);
  });

  it("should catch errors", async () => {
    Service.create.mockImplementation(() => {
      throw new Error("Error creating service");
    });
    await expect(ServiceService.create(mockService)).rejects.toThrow(
      "Error creating service",
    );
  });

  it("should throw an error if the service is not valid", async () => {
    validate.mockImplementationOnce(() => {
      throw new Error("Error validating service");
    });
    await expect(ServiceService.create({
      ...mockService,
      name: "",
    })).rejects.toThrow(
      "Error validating service"
    );
  });

  it("should throw an error if the residence id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating residence id");
    });
    await expect(ServiceService.create({
      ...mockService,
      residence: "invalidId",
    })).rejects.toThrow(
      "Error validating residence id",
    );
  });

  it("should throw an error if the residence does not exist", async () => {
    Residence.findById.mockReturnValue(null);
    await expect(ServiceService.create(mockService)).rejects.toThrow(
      `Residence with id ${mockService.residence} does not exists`,
    );
  });
});

describe("ServiceService.update", () => {
  it("should have a update method", () => {
    expect(typeof ServiceService.update).toBe("function");
  });

  it("should call Service.findOneAndUpdate", async () => {
    Service.findOneAndUpdate.mockReturnValue(mockService);
    await ServiceService.update(validServiceId, mockService);
    expect(Service.findOneAndUpdate).toBeCalledWith(
      { _id: validServiceId },
      { $set: mockService },
      { new: true },
    );
  });

  it("should return the updated service", async () => {
    Service.findOneAndUpdate.mockReturnValue(mockService);
    const result = await ServiceService.update(validServiceId, mockService);
    expect(result).toEqual(mockService);
  });

  it("should catch errors", async () => {
    Service.findOneAndUpdate.mockImplementation(() => {
      throw new Error("Error updating service");
    });
    expect(ServiceService.update(validServiceId, mockService)).rejects.toThrow(
      "Error updating service",
    );
  });

  it("should throw an error if the service is not valid", async () => {
    validate.mockImplementationOnce(() => {
      throw new Error("Error validating service");
    });
    await expect(ServiceService.update(validServiceId, {
      ...mockService,
      name: "",
    })).rejects.toThrow(
      "Error validating service"
    );
  });

  it("should throw an error if the service id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating service id");
    });
    await expect(ServiceService.update("invalidId", mockService)).rejects.toThrow(
      "Error validating service id",
    );
  });
});
describe("ServiceService.getAll", () => {
  it("should have a getAll method", () => {
    expect(typeof ServiceService.getAll).toBe("function");
  });

  it("should call Service.find", async () => {
    Service.find.mockReturnValue(mockServices);
    await ServiceService.getAll();
    expect(Service.find).toBeCalled();
  });

  it("should return all services", async () => {
    Service.find.mockReturnValue(mockServices);
    const result = await ServiceService.getAll();
    expect(result).toEqual(mockServices);
  });

  it("should catch errors", async () => {
    Service.find.mockImplementation(() => {
      throw new Error("Error getting services");
    });
    await expect(ServiceService.getAll()).rejects.toThrow(
      "Error getting services",
    );
  });
});

describe("ServiceService.getById", () => {
  it("should have a getById method", () => {
    expect(typeof ServiceService.getById).toBe("function");
  });

  it("should call Service.findById", async () => {
    Service.findById.mockReturnValue(mockService);
    await ServiceService.getById(validServiceId);
    expect(Service.findById).toBeCalledWith(validServiceId);
  });

  it("should return the service", async () => {
    Service.findById.mockReturnValue(mockService);
    const result = await ServiceService.getById(validServiceId);
    expect(result).toEqual(mockService);
  });

  it("should catch errors", async () => {
    Service.findById.mockImplementation(() => {
      throw new Error("Error getting service");
    });
    expect(ServiceService.getById(validServiceId)).rejects.toThrow(
      "Error getting service",
    );
  });

  it("should throw an error if the service id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating service id");
    });
    await expect(ServiceService.getById("invalidId")).rejects.toThrow(
      "Error validating service id",
    );
  });
});

describe("ServiceService.getByResidence", () => {
  it("should have a getByResidence method", () => {
    expect(typeof ServiceService.getByResidence).toBe("function");
  });

  it("should call Service.find", async () => {
    Service.find.mockReturnValue(mockServices);
    await ServiceService.getByResidence(mockService.residence);
    expect(Service.find).toBeCalledWith({ residence: mockService.residence });
  });

  it("should return the services", async () => {
    Service.find.mockReturnValue(mockServices);
    const result = await ServiceService.getByResidence(mockService.residence);
    expect(result).toEqual(mockServices);
  });

  it("should catch errors", async () => {
    Service.find.mockImplementation(() => {
      throw new Error("Error getting services");
    });
    expect(
      ServiceService.getByResidence(mockService.residence),
    ).rejects.toThrow("Error getting services");
  });

  it("should throw an error if the residence id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating residence id");
    });
    await expect(
      ServiceService.getByResidence("invalidId"),
    ).rejects.toThrowError("Error validating residence id");
  });
});

describe("ServiceService.delete", () => {
  it("should have a delete method", () => {
    expect(typeof ServiceService.delete).toBe("function");
  });

  it("should call Service.findByIdAndRemove", async () => {
    Service.findByIdAndRemove.mockReturnValue(mockService);
    await ServiceService.delete(validServiceId);
    expect(Service.findByIdAndRemove).toBeCalledWith(validServiceId);
  });

  it("should return the deleted service", async () => {
    Service.findByIdAndRemove.mockReturnValue(mockService);
    const result = await ServiceService.delete(validServiceId);
    expect(result).toEqual(mockService);
  });

  it("should catch errors", async () => {
    Service.findByIdAndRemove.mockImplementation(() => {
      throw new Error("Error deleting service");
    });
    expect(ServiceService.delete(validServiceId)).rejects.toThrow(
      "Error deleting service",
    );
  });

  it("should throw an error if the service id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating service id");
    });
    await expect(ServiceService.delete("invalidId")).rejects.toThrow(
      "Error validating service id",
    );
  });
});
