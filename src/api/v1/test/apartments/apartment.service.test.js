const ApartmentService = require("../../apartments/apartment.service");
const { Apartment, Residence } = require("../../_helpers/db");
const { isValidObjectId } = require("../../_helpers/db.document.validation");
const { validate } = require("../../_helpers/db.schema.validation");
const mockApartment = require("../mock-data/apartment.json");
const mockApartments = require("../mock-data/apartments.json");
const mockResidence = require("../mock-data/residences.json");
Apartment.create = jest.fn();
Apartment.find = jest.fn();
Apartment.findOne = jest.fn();
Apartment.findById = jest.fn();
Apartment.findByIdAndUpdate = jest.fn();
Apartment.findByIdAndRemove = jest.fn();
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
const validApartmentId = "650991a92ad13cb743a28e92";
const validResidenceId = "650991a92ad13cb743a28e91";

describe("ApartmentService.create", () => {
  it("should have a create method", () => {
    expect(typeof ApartmentService.create).toBe("function");
  });

  it("should call Apartment.create", async () => {
    Apartment.create.mockReturnValue(mockApartment);
    Residence.findById.mockReturnValue(mockResidence);
    await ApartmentService.create(mockApartment);
    expect(Apartment.create).toBeCalledWith(mockApartment);
  });

  it("should return the created apartment", async () => {
    Apartment.create.mockReturnValue(mockApartment);
    Residence.findById.mockReturnValue(mockResidence);
    const result = await ApartmentService.create(mockApartment);
    expect(result).toEqual(mockApartment);
  });

  it("should catch errors", async () => {
    Apartment.create.mockImplementation(() => {
      throw new Error("Error creating apartment");
    });
    await expect(
      ApartmentService.create(mockApartment),
    ).rejects.toThrow("Error creating apartment");
  });

  it("should throw an error while invalid apartment params", async () => {
    validate.mockImplementationOnce(() => {
      throw new Error("Error validating apartment");
    });
    await expect(
      ApartmentService.create({
        ...mockApartment,
        name: "",
      }),
    ).rejects.toThrow("Error validating apartment");
  });

  it("should throw an error if the residence id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating residence id");
    });
    await expect(
      ApartmentService.create(mockApartment),
    ).rejects.toThrowError("Error validating residence id");
  });

  it("should throw an error if the residence does not exists", async () => {
    Residence.findById.mockReturnValue(null);
    await expect(
      ApartmentService.create(mockApartment),
    ).rejects.toThrowError(
      `Residence with id ${mockApartment.residence} does not exists`,
    );
  });
});

describe("ApartmentService.update", () => {
  it("should have a update method", () => {
    validate.mockImplementation(() => null);
    expect(typeof ApartmentService.update).toBe("function");
  });

  it("should call Apartment.findByIdAndUpdate", async () => {
    Apartment.findByIdAndUpdate.mockReturnValue(mockApartment);
    Residence.findById.mockReturnValue(mockResidence);
    await ApartmentService.update(validApartmentId, mockApartment);
    expect(Apartment.findByIdAndUpdate).toBeCalledWith(
      validApartmentId,
      { $set: mockApartment },
      { new: true },
    );
  });

  it("should return the apartment", async () => {
    Apartment.findByIdAndUpdate.mockReturnValue(mockApartment);
    Residence.findById.mockReturnValue(mockResidence);
    const result = await ApartmentService.update(
      validApartmentId,
      mockApartment,
    );
    expect(result).toEqual(mockApartment);
  });

  it("should catch errors", async () => {
    Apartment.findByIdAndUpdate.mockImplementation(() => {
      throw new Error("Error updating apartment");
    });
    await expect(
      ApartmentService.update(validApartmentId, mockApartment),
    ).rejects.toThrowError("Error updating apartment");
  });

  it("should throw an error while invalid apartment params", async () => {
    validate.mockImplementationOnce(() => {
      throw new Error("Error validating apartment");
    });
    await expect(
      ApartmentService.update(validApartmentId, mockApartment),
    ).rejects.toThrowError("Error validating apartment");
  });
  it("should throw an error while invalid apartment id", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating apartment id");
    });
    await expect(
      ApartmentService.update(validApartmentId, mockApartment),
    ).rejects.toThrowError("Error validating apartment id");
  });

  it("should throw an error if apartment does not exists", async () => {
    Apartment.findByIdAndUpdate.mockReturnValue(null);
    await expect(
      ApartmentService.update(validApartmentId, mockApartment),
    ).rejects.toThrowError(
      `Apartment with id ${validApartmentId} does not exists`,
    );
  });

  it("should throw an error if the residence id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating residence id");
    });
    await expect(
      ApartmentService.update(validApartmentId, mockApartment),
    ).rejects.toThrowError("Error validating residence id");
  });

  it("should throw an error if the residence does not exists", async () => {
    Residence.findById.mockReturnValue(null);
    await expect(
      ApartmentService.update(validApartmentId, mockApartment),
    ).rejects.toThrowError(
      `Residence with id ${mockApartment.residence} does not exists`,
    );
  });
});

describe("ApartmentService.getAll", () => {
  it("should have a getAll method", () => {
    expect(typeof ApartmentService.getAll).toBe("function");
  });

  it("should call Apartment.find()", async () => {
    Apartment.find.mockReturnValue(mockApartments);
    await ApartmentService.getAll();
    expect(Apartment.find).toBeCalled();
  });

  it("should return all apartments", async () => {
    Apartment.find.mockReturnValue(mockApartments);
    const result = await ApartmentService.getAll();
    expect(result).toEqual(mockApartments);
  });

  it("should catch errors", async () => {
    Apartment.find.mockImplementation(() => {
      throw new Error("Error requesting apartments");
    });
    await expect(ApartmentService.getAll()).rejects.toThrow(
      "Error requesting apartments",
    );
  })
});

describe("ApartmentService.getByResidence", () => {
  it("should have a getByResidence method", () => {
    expect(typeof ApartmentService.getByResidence).toBe("function");
  });

  it("should call Apartment.find()", async () => {
    Apartment.find.mockReturnValue(mockApartments);
    await ApartmentService.getByResidence(validResidenceId);
    expect(Apartment.find).toBeCalled();
  });

  it("should return all apartments", async () => {
    Apartment.find.mockReturnValue(mockApartments);
    const result = await ApartmentService.getByResidence(validResidenceId);
    expect(result).toEqual(mockApartments);
  });

  it("should catch errors", async () => {
    Apartment.find.mockImplementation(() => {
      throw new Error("Error requesting apartments");
    });
    await expect(ApartmentService.getByResidence(validResidenceId)).rejects.toThrow(
      "Error requesting apartments",
    );
  });

  it("should throw an error if the residence id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating residence id");
    });
    await expect(
      ApartmentService.getByResidence(validResidenceId),
    ).rejects.toThrowError("Error validating residence id");
  });
});

describe("ApartmentService.getById", () => {
  it("should have a getById method", () => {
    expect(typeof ApartmentService.getById).toBe("function");
  });

  it("should call Apartment.findById()", async () => {
    Apartment.findById.mockReturnValue(mockApartment);

    await ApartmentService.getById(validApartmentId);
    expect(Apartment.findById).toBeCalledWith(validApartmentId);
  });

  it("should return the apartment", async () => {
    Apartment.findById.mockReturnValue(mockApartment);
    const result = await ApartmentService.getById(validApartmentId);
    expect(result).toEqual(mockApartment);
  });

  it("should catch errors", async () => {
    Apartment.findById.mockImplementation(() => {
      throw new Error(
        `Error requesting apartment with id ${validApartmentId}`,
      );
    });
    await expect(ApartmentService.getById(validApartmentId)).rejects.toThrow(
      `Error requesting apartment with id ${validApartmentId}`,
    );
  });

  it("should throw an error if the apartment id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating apartment id");
    });
    await expect(
      ApartmentService.getById(validApartmentId),
    ).rejects.toThrowError("Error validating apartment id");
  });
});

describe("ApartmentService.delete", () => {
  it("should have a delete method", () => {
    expect(typeof ApartmentService.delete).toBe("function");
  });

  it("should call Apartment.findByIdAndRemove", async () => {
    Apartment.findByIdAndRemove.mockReturnValue(mockApartment);
    await ApartmentService.delete(validApartmentId);
    expect(Apartment.findByIdAndRemove).toBeCalledWith(validApartmentId);
  });

  it("should return the apartment", async () => {
    Apartment.findByIdAndRemove.mockReturnValue(mockApartment);
    const result = await ApartmentService.delete(validApartmentId);
    expect(result).toEqual(mockApartment);
  });

  it("should catch errors", async () => {
    Apartment.findByIdAndRemove.mockImplementation(() => {
      throw new Error("Error deleting apartment");
    });
    await expect(ApartmentService.delete(validApartmentId)).rejects.toThrow(
      "Error deleting apartment",
    );
  });

  it("should throw an error if the apartment id is not valid", async () => {
    isValidObjectId.mockImplementationOnce(() => {
      throw new Error("Error validating apartment id");
    });
    await expect(
      ApartmentService.delete(validApartmentId),
    ).rejects.toThrowError("Error validating apartment id");
  });
});
