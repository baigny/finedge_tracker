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

const validTransaction = {
  type: "income",
  category: "salary",
  amount: 5000,
  date: "2024-01-15",
};

// ── CREATE ──────────────────────────────────────────────────────────────────

describe("POST /transactions", () => {
  it("creates a transaction and returns 201", async () => {
    const res = await request(app).post("/transactions").send(validTransaction);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.type).toBe("income");
    expect(res.body.data.amount).toBe(5000);
    expect(res.body.data.category).toBe("salary");
  });
});

// ── READ ALL ────────────────────────────────────────────────────────────────

describe("GET /transactions", () => {
  it("returns empty array when no transactions exist", async () => {
    const res = await request(app).get("/transactions");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it("returns all transactions", async () => {
    await request(app).post("/transactions").send(validTransaction);
    await request(app).post("/transactions").send({ ...validTransaction, type: "expense", amount: 200 });
    const res = await request(app).get("/transactions");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });
});

// ── READ ONE ────────────────────────────────────────────────────────────────

describe("GET /transactions/:id", () => {
  it("returns a transaction by id", async () => {
    const created = await request(app).post("/transactions").send(validTransaction);
    const id = created.body.data._id;
    const res = await request(app).get(`/transactions/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(id);
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/transactions/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── UPDATE ──────────────────────────────────────────────────────────────────

describe("PATCH /transactions/:id", () => {
  it("updates a transaction and returns the updated document", async () => {
    const created = await request(app).post("/transactions").send(validTransaction);
    const id = created.body.data._id;
    const res = await request(app).patch(`/transactions/${id}`).send({ amount: 9999 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.amount).toBe(9999);
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).patch(`/transactions/${fakeId}`).send({ amount: 100 });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── DELETE ──────────────────────────────────────────────────────────────────

describe("DELETE /transactions/:id", () => {
  it("deletes a transaction and returns 200", async () => {
    const created = await request(app).post("/transactions").send(validTransaction);
    const id = created.body.data._id;
    const res = await request(app).delete(`/transactions/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/transactions/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── VALIDATION (400s) ───────────────────────────────────────────────────────

describe("POST /transactions - validation failures", () => {
  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/transactions").send({ category: "salary" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when type is an invalid enum value", async () => {
    const res = await request(app)
      .post("/transactions")
      .send({ type: "transfer", category: "salary", amount: 500, date: "2024-01-15" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when amount is below minimum (0.01)", async () => {
    const res = await request(app)
      .post("/transactions")
      .send({ type: "income", category: "salary", amount: 0, date: "2024-01-15" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
