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

const validBudget = {
  month: 1,
  year: 2024,
  monthlyGoal: 3000,
  savingsTarget: 1000,
};

// ── CREATE ──────────────────────────────────────────────────────────────────

describe("POST /budgets", () => {
  it("creates a budget and returns 201", async () => {
    const res = await request(app).post("/budgets").send(validBudget);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.monthlyGoal).toBe(3000);
    expect(res.body.data.savingsTarget).toBe(1000);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/budgets").send({ month: 1 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ── READ ALL ────────────────────────────────────────────────────────────────

describe("GET /budgets", () => {
  it("returns empty array when no budgets exist", async () => {
    const res = await request(app).get("/budgets");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it("returns all budgets", async () => {
    await request(app).post("/budgets").send(validBudget);
    const res = await request(app).get("/budgets");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

// ── READ ONE ────────────────────────────────────────────────────────────────

describe("GET /budgets/:id", () => {
  it("returns a budget by id", async () => {
    const created = await request(app).post("/budgets").send(validBudget);
    const id = created.body.data._id;
    const res = await request(app).get(`/budgets/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(id);
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/budgets/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── UPDATE ──────────────────────────────────────────────────────────────────

describe("PATCH /budgets/:id", () => {
  it("updates a budget and returns the updated document", async () => {
    const created = await request(app).post("/budgets").send(validBudget);
    const id = created.body.data._id;
    const res = await request(app).patch(`/budgets/${id}`).send({ monthlyGoal: 5000 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.monthlyGoal).toBe(5000);
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).patch(`/budgets/${fakeId}`).send({ monthlyGoal: 100 });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── DELETE ──────────────────────────────────────────────────────────────────

describe("DELETE /budgets/:id", () => {
  it("deletes a budget and returns 200", async () => {
    const created = await request(app).post("/budgets").send(validBudget);
    const id = created.body.data._id;
    const res = await request(app).delete(`/budgets/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Budget deleted");
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/budgets/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
