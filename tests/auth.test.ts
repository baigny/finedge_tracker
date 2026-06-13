import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

const validUser = {
  name: "Test User",
  email: "testuser@example.com",
  password: "Test@123",
  age: 25,
  gender: "M",
};

// ── REGISTER ─────────────────────────────────────────────────────────────────

describe("POST /users - Register User", () => {
  it("registers a new user and returns 201", async () => {
    const res = await request(app).post("/users").send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User Registered Successfully");
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.email).toBe(validUser.email);
  });

  it("returns 409 for duplicate email", async () => {
    await request(app).post("/users").send(validUser);
    const res = await request(app).post("/users").send(validUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("returns non-200 when required fields are missing", async () => {
    const res = await request(app).post("/users").send({ name: "No Email" });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });
});

// ── LOGIN ────────────────────────────────────────────────────────────────────

describe("POST /login - Login User", () => {
  beforeEach(async () => {
    await request(app).post("/users").send(validUser);
  });

  it("logs in successfully with correct credentials", async () => {
    const res = await request(app).post("/login").send({
      email: validUser.email,
      password: validUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });

  it("returns 401 for wrong password", async () => {
    const res = await request(app).post("/login").send({
      email: validUser.email,
      password: "WrongPassword",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid User Credentials");
  });

  it("returns 401 for non-existent email", async () => {
    const res = await request(app).post("/login").send({
      email: "nobody@example.com",
      password: "anything",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid User Credentials");
  });
});
