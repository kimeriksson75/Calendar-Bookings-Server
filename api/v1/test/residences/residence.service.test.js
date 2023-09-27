const ResidenceService = require("../../residences/residence.service");
const mongoose = require("mongoose");

const { Residence } = require("../../_helpers/db");

const mockResidence = require("../mock-data/residence.json");
const mockResidences = require("../mock-data/residences.json");

Residence.create = jest.fn();
Residence.find = jest.fn();
Residence.findById = jest.fn();
Residence.findByIdAndRemove = jest.fn();

describe("ResidenceService.create", () => {
  it("should have a create method", () => {
    expect(typeof ResidenceService.create).toBe("function");
  });

  it("should call Residence.create", async () => {
    Residence.create.mockReturnValue(mockResidence);
    await ResidenceService.create(mockResidence);
    expect(Residence.create).toBeCalledWith(mockResidence);
  });

  it("should return the created residence", async () => {
    Residence.create.mockReturnValue(mockResidence);
    const result = await ResidenceService.create(mockResidence);
    expect(result).toEqual(mockResidence);
  });

  it("should catch errors", async () => {
    Residence.create.mockImplementation(() => {
      throw new Error("Error creating residence");
    });
    await expect(ResidenceService.create(mockResidence)).rejects.toThrow(
      "Error creating residence",
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("ResidenceService.getAll", () => {
  it("should have a getAll method", () => {
    expect(typeof ResidenceService.getAll).toBe("function");
  });

  it("should call Residence.find()", async () => {
    Residence.find.mockReturnValue(mockResidences);
    await ResidenceService.getAll();
    expect(Residence.find).toBeCalled();
  });

  it("should return all residences", async () => {
    Residence.find.mockReturnValue(mockResidences);
    const result = await ResidenceService.getAll();
    expect(result).toEqual(mockResidences);
  });

  it("should catch errors", async () => {
    Residence.find.mockImplementation(() => {
      throw new Error("Error getting residences");
    });
    await expect(ResidenceService.getAll()).rejects.toThrow(
      "Error getting residences",
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("ResidenceService.getById", () => {
  it("should have a getById method", () => {
    expect(typeof ResidenceService.getById).toBe("function");
  });

  it("should call Residence.findById()", async () => {
    Residence.findById.mockReturnValue(mockResidence);
    await ResidenceService.getById(mockResidence.id);
    expect(Residence.findById).toBeCalledWith(mockResidence.id);
  });

  it("should return the residence", async () => {
    Residence.findById.mockReturnValue(mockResidence);
    const result = await ResidenceService.getById(mockResidence.id);
    expect(result).toEqual(mockResidence);
  });

  it("should catch errors", async () => {
    Residence.findById.mockImplementation(() => {
      throw new Error("Error getting residence");
    });
    await expect(ResidenceService.getById(mockResidence._id)).rejects.toThrow(
      "Error getting residence",
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("ResidenceService.delete", () => {
  it("should have a delete method", () => {
    expect(typeof ResidenceService.delete).toBe("function");
  });

  it("should call Residence.findByIdAndRemove()", async () => {
    Residence.findByIdAndRemove.mockReturnValue(mockResidence);
    await ResidenceService.delete(mockResidence.id);
    expect(Residence.findByIdAndRemove).toBeCalledWith(mockResidence.id);
  });

  it("should return the deleted residence", async () => {
    Residence.findByIdAndRemove.mockReturnValue(mockResidence);
    const result = await ResidenceService.delete(mockResidence.id);
    expect(result).toEqual(mockResidence);
  });

  it("should catch errors", async () => {
    Residence.findByIdAndRemove.mockImplementation(() => {
      throw new Error("Error deleting residence");
    });
    await expect(ResidenceService.delete(mockResidence.id)).rejects.toThrow(
      "Error deleting residence",
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
