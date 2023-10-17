const {
  existingDocumentById,
  isValidObjectId,
} = require("../../_helpers/db.document.validation");
const validId = "5f9d88e9d7f8e3e7e8e8e8e8";

describe("existingDocumentById()", () => {
  it("should return the document if it exists", async () => {
    const mockDoc = { findById: jest.fn().mockResolvedValue("mock doc") };
    const result = await existingDocumentById(mockDoc, validId);
    expect(result).toEqual("mock doc");
  });

  it("should throw an error if the document does not exists", async () => {
    const mockDoc = { findById: jest.fn().mockResolvedValue(null) };
    await expect(existingDocumentById(mockDoc, validId)).rejects.toThrow(
      `Document with id ${validId} does not exists`,
    );
  });

  it("should throw an error if the document id is not valid", async () => {
    const mockDoc = {
      findById: jest.fn().mockRejectedValue(new Error("invalid id")),
    };
    await expect(existingDocumentById(mockDoc, "mock id")).rejects.toThrow(
      "Invalid id mock id",
    );
  });
});

describe("isValidObjectId()", () => {
  it("should return true if the id is valid", () => {
    const result = isValidObjectId(validId);
    expect(result).toBe(true);
  });

  it("should throw an error if the id is not valid", () => {
    expect(() => isValidObjectId("invalid id")).toThrow(
      "Invalid id invalid id",
    );
  });
});
