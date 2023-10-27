const ResidenceService = require("../../residences/residence.service");
const { Residence } = require("../../_helpers/db");
const mockResidence = require("../mock-data/residence.json");
const mockResidences = require("../mock-data/residences.json");
const { isValidObjectId } = require("../../_helpers/db.document.validation");
const { validate } = require("../../_helpers/db.schema.validation");
Residence.create = jest.fn();
Residence.find = jest.fn();
Residence.findById = jest.fn();
Residence.findByIdAndUpdate = jest.fn();
Residence.findByIdAndRemove = jest.fn();
jest.mock("../../_helpers/db.document.validation", () => ({
  isValidObjectId: jest.fn().mockImplementation(() => true),
}));
jest.mock("../../_helpers/db.schema.validation", () => ({
  validate: jest.fn().mockImplementation(() => null),
}));
afterEach(() => {
  jest.clearAllMocks();
});

const validResidenceId = "6513e49f9d90819b61ef5bbf";
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
    Residence.create.mockImplementationOnce(() => {
      throw new Error("Error creating residence");
    });
    await expect(ResidenceService.create(mockResidence)).rejects.toThrow(
      "Error creating residence",
    );
  });

  it("should throw an error if the residence is not valid", async () => {
    validate.mockImplementationOnce(() => {
      throw new Error("Error validating residence");
    });
    await expect(
      ResidenceService.create({
        ...mockResidence,
        name: "",
      }),
    ).rejects.toThrow("Error validating residence");
  });
});

describe("ResidenceService.update", () => {
  it("should have a update method", () => {
    expect(typeof ResidenceService.update).toBe("function");
  });

  it("should call Residence.findByIdAndUpdate()", async () => {
    Residence.findByIdAndUpdate.mockReturnValue(mockResidence);
    await ResidenceService.update(validResidenceId, mockResidence);
    expect(Residence.findByIdAndUpdate).toBeCalledWith(
      validResidenceId,
      { $set: mockResidence },
      { new: true },
    );
  });

  it("should return the updated residence", async () => {
    Residence.findByIdAndUpdate.mockReturnValue(mockResidence);
    const result = await ResidenceService.update(
      validResidenceId,
      mockResidence,
    );
    expect(result).toEqual(mockResidence);
  });

  it("should catch errors", async () => {
    Residence.findByIdAndUpdate.mockImplementation(() => {
      throw new Error("Error updating residence");
    });
    await expect(
      ResidenceService.update(validResidenceId, mockResidence),
    ).rejects.toThrow("Error updating residence");
  });

  it("should throw an error if the residence id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating residence id");
    });
    await expect(
      ResidenceService.update("invalid-residence-id", mockResidence),
    ).rejects.toThrow("Error validating residence id");
  });

  it("should throw an error if the residence is not valid", async () => {
    validate.mockImplementationOnce(() => {
      throw new Error("Error validating residence");
    });
    await expect(
      ResidenceService.update(validResidenceId, mockResidence),
    ).rejects.toThrowError();
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
});

describe("ResidenceService.getById", () => {
  it("should have a getById method", () => {
    expect(typeof ResidenceService.getById).toBe("function");
  });

  it("should call Residence.findById()", async () => {
    Residence.findById.mockReturnValue(mockResidence);
    await ResidenceService.getById(validResidenceId);
    expect(Residence.findById).toBeCalledWith(validResidenceId);
  });

  it("should return the residence", async () => {
    Residence.findById.mockReturnValue(mockResidence);
    const result = await ResidenceService.getById(validResidenceId);
    expect(result).toEqual(mockResidence);
  });

  it("should catch errors", async () => {
    Residence.findById.mockImplementation(() => {
      throw new Error("Error getting residence");
    });
    await expect(ResidenceService.getById(validResidenceId)).rejects.toThrow(
      "Error getting residence",
    );
  });
  it("should throw an error if the residence id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating id");
    });
    await expect(
      ResidenceService.getById("invalid-residence-id"),
    ).rejects.toThrow("Error validating id");
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

  it("should throw an error if the id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating id");
    });
    await expect(ResidenceService.delete(mockResidence.id)).rejects.toThrow(
      "Error validating id",
    );
  });
});
