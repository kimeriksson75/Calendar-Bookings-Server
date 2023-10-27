const { verifyToken } = require("../../_helpers/token.validation");
const mongoose = require("mongoose");
const { Token } = require("../../_helpers/db");

Token.findOne = jest.fn();
Token.create = jest.fn();

const mockToken = {
  _id: "6537fdbbe332b4579adae0a9",
  userId: "6537fdbbe332b4579adae0a6",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTM3ZmRiYmUzMzJiNDU3OWFkYWUwYTYiLCJpYXQiOjE2OTgxNjgyNTF9.zkMGwYhuQ7RgfZ0DYJKSjfqdhQqvNnxH8bsCrNETfcE",
  createdAt: "2023-10-24T17:24:11.380Z",
  __v: 0,
};
describe("Token validation", () => {
  let token;
  const { userId } = mockToken;
  it("should return a token", async () => {
    Token.findOne.mockReturnValue(mockToken);
    token = await verifyToken(userId);
    expect(Token.findOne).toHaveBeenCalledWith({ userId });
    expect(Token.findOne).toHaveBeenCalledWith({ userId });
    expect(token).toBeDefined();
    expect(token.userId).toEqual(userId);
  });

  it("should create a token if it does not exist", async () => {
    Token.findOne.mockReturnValue(null);
    token = await verifyToken(userId);
    Token.create.mockReturnValue(mockToken);
    expect(Token.findOne).toHaveBeenCalledWith({ userId });
    expect(Token.create).toHaveBeenCalledWith({
      userId,
      token: expect.any(String),
    });
    expect(token).toBeDefined();
    expect(token.userId).toEqual(userId);
  });

  it("should throw an error if token is expired", async () => {
    Token.findOne.mockReturnValue({
      ...mockToken,
      expiresAt: new Date("2021-10-24T17:24:11.380Z"),
    });
    expect(Token.findOne).toHaveBeenCalledWith({ userId });
    await expect(verifyToken(userId)).rejects.toThrow("Token expired");
  });

  it("should throw an error while invalid userId", async () => {
    Token.findOne.mockReturnValue(mockToken);
    await expect(verifyToken("invalid-userId")).rejects.toThrow(
      "Invalid id invalid-userId",
    );
  });
});
