const UserService = require("../../users/user.service");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User, Apartment, Residence, Token } = require("../../_helpers/db");
User.create = jest.fn();
User.find = jest.fn();
User.findOne = jest.fn();
User.findById = jest.fn();
User.findByIdAndUpdate = jest.fn();
User.findByIdAndRemove = jest.fn();
Residence.findById = jest.fn();
Apartment.findById = jest.fn();
Token.findOne = jest.fn();

const mockUser = require("../mock-data/user.json");

const mockUsers = require("../mock-data/users.json");
const mockUserWithoutIdAndHash = { ...mockUser };
delete mockUserWithoutIdAndHash._id;
delete mockUserWithoutIdAndHash.hash;

const mockUserUpdate = {
  ...mockUserWithoutIdAndHash,
  username: "updated username",
  firstname: "updated firstname",
  lastname: "updated lastname",
};
const mockApartment = require("../mock-data/apartment.json");
const mockResidence = require("../mock-data/residence.json");

jest.mock("bcryptjs", () => ({
  compareSync: jest.fn(),
  hashSync: jest.fn(() => "hashed password"),
}));

const user = new User(mockUser);
user.save = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});
describe.skip("UserService.create", () => {
  it("should have a create method", () => {
    expect(typeof UserService.create).toBe("function");
  });

  it("should call User.create", async () => {
    User.create.mockReturnValue(mockUser);
    User.findOne.mockReturnValue(null);
    Residence.findById.mockReturnValueOnce(mockResidence);
    Apartment.findById.mockReturnValueOnce(mockApartment);

    await UserService.create(mockUserWithoutIdAndHash);
    expect(User.findOne).toBeCalledWith({ username: mockUser.username, email: mockUser.email });
    expect(User.findOne).toBeCalledWith({ apartment: mockUser.apartment });
    expect(Residence.findById).toBeCalledWith(mockUser.residence);
    expect(Apartment.findById).toBeCalledWith(mockUser.apartment);
  });

  it("should call User.create", async () => {
    User.create.mockReturnValue(mockUser);
    User.findOne.mockReturnValue(null);
    Residence.findById.mockReturnValueOnce(mockResidence);
    Apartment.findById.mockReturnValueOnce(mockApartment);

    await UserService.create(mockUserWithoutIdAndHash);
    const returnedUser = {
      ...mockUserWithoutIdAndHash,
      hash: "hashed password",
    };
    delete returnedUser.password;
    expect(User.create).toBeCalledWith(returnedUser);
  });

  it("should return the created user", async () => {
    const createUserMock = User.create.mockReturnValue({
      ...mockUserWithoutIdAndHash,
      password: "1234",
    });
    User.findOne.mockReturnValue(null);
    Residence.findById.mockReturnValueOnce(mockResidence);
    Apartment.findById.mockReturnValueOnce(mockApartment);

    const result = await UserService.create(mockUserWithoutIdAndHash);
    expect(createUserMock).toHaveBeenCalledTimes(1);
    const calledUser = {
      ...mockUserWithoutIdAndHash,
    }
    delete calledUser.password;
    expect(createUserMock).toHaveBeenCalledWith({
      ...calledUser,
      hash: "hashed password",
    });
    expect(result).toEqual({
      ...mockUserWithoutIdAndHash,
    });
  });

  it("should catch errors", async () => {
    User.create.mockReturnValue(mockUser);
    User.findOne.mockReturnValue(null);
    Residence.findById.mockReturnValueOnce(mockResidence);
    Apartment.findById.mockReturnValueOnce(mockApartment);
    User.create.mockImplementation(() => {
      throw new Error("Error creating user");
    });
    await expect(UserService.create(mockUserWithoutIdAndHash)).rejects.toThrow(
      "Error creating user",
    );
  });

  it("should throw an error if the user already exists", async () => {
    User.create.mockReturnValue(mockUser);
    User.findOne.mockReturnValue(mockUser);
    await expect(UserService.create(mockUserWithoutIdAndHash)).rejects.toThrow(
      `User ${mockUser.username}, ${mockUser.email} already exists`,
    );
  });

  it("should throw an error if the residence does not exist", async () => {
    User.create.mockReturnValue(mockUser);
    User.findOne.mockReturnValue(null);
    Residence.findById.mockReturnValueOnce(null);
    await expect(UserService.create(mockUserWithoutIdAndHash)).rejects.toThrow(
      `Residence ${mockUser.residence} does not exist`,
    );
  });

  it("should throw an error if the apartment does not exist", async () => {
    User.create.mockReturnValue(mockUser);
    User.findOne.mockReturnValue(null);
    Residence.findById.mockReturnValueOnce(mockResidence);
    Apartment.findById.mockReturnValueOnce(null);
    await expect(UserService.create(mockUserWithoutIdAndHash)).rejects.toThrow(
      `Apartment ${mockUser.apartment} does not exist`,
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe.skip("UserService.authenticate", () => {
  it("should have a authenticate method", () => {
    expect(typeof UserService.authenticate).toBe("function");
  });

  it("should call User.findOne", async () => {
    User.findOne.mockReturnValue(mockUser);
    bcryptjs.compareSync = jest.fn().mockReturnValue(true);
    jwt.sign = jest.fn().mockResolvedValue("token");
    await UserService.authenticate(mockUser);
    expect(User.findOne).toBeCalledWith({ username: mockUser.username });
  });

  it("should return user data", async () => {
    User.findOne.mockReturnValue(mockUser);
    bcryptjs.compareSync = jest.fn().mockReturnValue(true);
    jwt.sign = jest.fn().mockResolvedValue("token");
    const result = await UserService.authenticate(mockUser);
    expect(result).toEqual({
      ...mockUser,
      token: "token",
    });
  });

  it("should return user without hash", async () => {
    User.findOne.mockReturnValue(mockUser);
    bcryptjs.compareSync = jest.fn().mockReturnValue(true);
    jwt.sign = jest.fn().mockResolvedValue("token");
    const result = await UserService.authenticate(mockUser);
    expect(result.token).toEqual("token");
  });

  it("should throw an error if user is not found", async () => {
    User.findOne.mockReturnValue(null);
    await expect(UserService.authenticate(mockUser)).rejects.toThrow(
      `Username ${mockUser.username} is not found`,
    );
  });

  it("should throw an error if password is incorrect", async () => {
    const invalidmockUser = {
      ...mockUser,
      password: "invalid password",
    };
    User.findOne.mockReturnValue(invalidmockUser);
    bcryptjs.compareSync = jest.fn().mockReturnValue(false);
    jwt.sign = jest.fn().mockResolvedValue("token");
    await expect(UserService.authenticate(invalidmockUser)).rejects.toThrow(
      "Password is incorrect",
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("UserService.update", () => {
  it("should have a update method", () => {
    expect(typeof UserService.update).toBe("function");
  });
  it("should call User.findByIdAndUpdate", async () => {
    User.findByIdAndUpdate.mockReturnValue(mockUserUpdate);
    bcryptjs.ashSync = jest.fn().mockReturnValue("hashed password");
    await UserService.update(mockUser._id, mockUserUpdate);
    expect(User.findByIdAndUpdate).toBeCalledWith(
      mockUser._id,
      { $set: mockUserUpdate },
      { new: true },
    );
  });

  it("should return user data", async () => {
    User.findByIdAndUpdate.mockReturnValue({
      ...mockUser,
      ...mockUserUpdate,
    });
    const result = await UserService.update(mockUser._id, mockUserUpdate);
    expect(result).toEqual({
      ...mockUser,
      ...mockUserUpdate,
    });
  });

  it("should throw an error if user is not found", async () => {
    User.findByIdAndUpdate.mockReturnValue(null);
    await expect(
      UserService.update(mockUser._id, mockUserUpdate),
    ).rejects.toThrow(`User id ${mockUser._id} does not exist`);
  });

  it("should catch errors", async () => {
    User.findByIdAndUpdate.mockImplementation(() => {
      throw new Error("Error updating user");
    });
    await expect(
      UserService.update(mockUser._id, mockUserUpdate),
    ).rejects.toThrow("Error updating user");
  });
});

describe("UserService.getAll", () => {
  it("should have a getAll method", () => {
    expect(typeof UserService.getAll).toBe("function");
  });

  it("should call User.find", async () => {
    User.find.mockReturnValue(mockUsers);
    await UserService.getAll();
    expect(User.find).toBeCalled();
  });

  it("should return all users", async () => {
    User.find.mockReturnValue(mockUsers);
    const result = await UserService.getAll();
    expect(result).toEqual(mockUsers);
  });

  it("should catch errors", async () => {
    User.find.mockImplementation(() => {
      throw new Error("Error getting users");
    });
    await expect(UserService.getAll()).rejects.toThrow("Error getting users");
  });
});

describe("UserService.getById", () => {
  it("should have a getById method", () => {
    expect(typeof UserService.getById).toBe("function");
  });

  it("should call User.findById", async () => {
    User.findById.mockReturnValue(mockUser);
    await UserService.getById(mockUser._id);
    expect(User.findById).toBeCalledWith(mockUser._id);
  });

  it("should return the user", async () => {
    User.findById.mockReturnValue(mockUser);
    const result = await UserService.getById(mockUser._id);
    expect(result).toEqual(mockUser);
  });

  it("should throw an error if the user does not exist", async () => {
    User.findById.mockReturnValue(null);
    await expect(UserService.getById(mockUser._id)).rejects.toThrow(
      `User id ${mockUser._id} does not exist`,
    );
  });

  it("should catch errors", async () => {
    User.findById.mockImplementation(() => {
      throw new Error("Error getting user");
    });
    await expect(UserService.getById(mockUser._id)).rejects.toThrow(
      "Error getting user",
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("UserService.delete", () => {
  it("should have a delete method", () => {
    expect(typeof UserService.delete).toBe("function");
  });

  it("should call User.findByIdAndRemove", async () => {
    User.findByIdAndRemove.mockReturnValue(mockUser);
    await UserService.delete(mockUser._id);
    expect(User.findByIdAndRemove).toBeCalledWith(mockUser._id);
  });

  it("should throw an error if the user does not exist", async () => {
    User.findByIdAndRemove.mockReturnValue(null);
    await expect(UserService.delete(mockUser._id)).rejects.toThrow(
      `User id ${mockUser._id} does not exist`,
    );
  });

  it("should catch errors", async () => {
    User.findByIdAndRemove.mockImplementation(() => {
      throw new Error("Error deleting user");
    });
    await expect(UserService.delete(mockUser._id)).rejects.toThrow(
      "Error deleting user",
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
