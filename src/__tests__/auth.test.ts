import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import User from "../models/user.model";

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/fin_edge_test";
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("POST /users - Register User", () => {
  const validUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "Test@123",
    age: 25,
    gender: "M",
  };

  it("should register a new user successfully", async () => {
    const res = await request(app).post("/users").send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe("true");
    expect(res.body.message).toBe("User Registered Successfully");
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.email).toBe(validUser.email);
    expect(res.body.data.name).toBe(validUser.name);
  });

  it("should fail when required fields are missing", async () => {
    const res = await request(app).post("/users").send({ name: "No Email" });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe("false");
  });

  it("should fail when registering duplicate email", async () => {
    await request(app).post("/users").send(validUser);
    const res = await request(app).post("/users").send(validUser);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe("false");
  });
});

describe("POST /login - Login User", () => {
  const testUser = {
    name: "Login Test",
    email: "logintest@example.com",
    password: "Login@123",
    age: 22,
    gender: "F",
  };

  beforeEach(async () => {
    await request(app).post("/users").send(testUser);
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app).post("/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe("true");
    expect(res.body.message).toBe("login successful");
    expect(res.body.token).toBeDefined();
  });

  it("should fail with wrong password", async () => {
    const res = await request(app).post("/login").send({
      email: testUser.email,
      password: "WrongPassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe("false");
    expect(res.body.message).toBe("Invalid User Credentials");
  });

  it("should fail with non-existent email", async () => {
    const res = await request(app).post("/login").send({
      email: "nobody@example.com",
      password: "anything",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe("false");
    expect(res.body.message).toBe("Invalid User Credentials");
  });
});
