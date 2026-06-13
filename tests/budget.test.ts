import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";

let mongoServer: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Register and login to get a token
  await request(app).post("/users").send({
    name: "Budget Tester",
    email: "budget@example.com",
    password: "Test@123",
  });
  const loginRes = await request(app).post("/login").send({
    email: "budget@example.com",
    password: "Test@123",
  });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.collection("budgets").deleteMany({});
});

const validBudget = {
  month: 1,
  year: 2024,
  monthlyGoal: 3000,
  savingsTarget: 1000,
};

// ── AUTH REQUIRED ───────────────────────────────────────────────────────────

describe("Budget routes require authentication", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/budgets");
    expect(res.status).toBe(401);
  });
});

// ── CREATE ──────────────────────────────────────────────────────────────────

describe("POST /budgets", () => {
  it("creates a budget and returns 201", async () => {
    const res = await request(app)
      .post("/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send(validBudget);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.monthlyGoal).toBe(3000);
    expect(res.body.data.savingsTarget).toBe(1000);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({ month: 1 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ── READ ALL ────────────────────────────────────────────────────────────────

describe("GET /budgets", () => {
  it("returns empty array when no budgets exist", async () => {
    const res = await request(app)
      .get("/budgets")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it("returns all budgets", async () => {
    await request(app)
      .post("/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send(validBudget);
    const res = await request(app)
      .get("/budgets")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

// ── READ ONE ────────────────────────────────────────────────────────────────

describe("GET /budgets/:id", () => {
  it("returns a budget by id", async () => {
    const created = await request(app)
      .post("/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send(validBudget);
    const id = created.body.data._id;
    const res = await request(app)
      .get(`/budgets/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(id);
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/budgets/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── UPDATE ──────────────────────────────────────────────────────────────────

describe("PATCH /budgets/:id", () => {
  it("updates a budget and returns the updated document", async () => {
    const created = await request(app)
      .post("/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send(validBudget);
    const id = created.body.data._id;
    const res = await request(app)
      .patch(`/budgets/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ monthlyGoal: 5000 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.monthlyGoal).toBe(5000);
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .patch(`/budgets/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ monthlyGoal: 100 });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── DELETE ──────────────────────────────────────────────────────────────────

describe("DELETE /budgets/:id", () => {
  it("deletes a budget and returns 200", async () => {
    const created = await request(app)
      .post("/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send(validBudget);
    const id = created.body.data._id;
    const res = await request(app)
      .delete(`/budgets/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Budget deleted");
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/budgets/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
