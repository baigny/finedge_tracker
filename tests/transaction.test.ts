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
    name: "Test User",
    email: "test@example.com",
    password: "Test@123",
  });
  const loginRes = await request(app).post("/login").send({
    email: "test@example.com",
    password: "Test@123",
  });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.collection("transactions").deleteMany({});
});

const validTransaction = {
  type: "income",
  category: "salary",
  amount: 5000,
  date: "2024-01-15",
};

// ── AUTH REQUIRED ───────────────────────────────────────────────────────────

describe("Transaction routes require authentication", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/transactions");
    expect(res.status).toBe(401);
  });

  it("returns 401 with an invalid token", async () => {
    const res = await request(app)
      .get("/transactions")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(401);
  });
});

// ── CREATE ──────────────────────────────────────────────────────────────────

describe("POST /transactions", () => {
  it("creates a transaction and returns 201", async () => {
    const res = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send(validTransaction);
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
    const res = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it("returns all transactions for the user", async () => {
    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send(validTransaction);
    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validTransaction, type: "expense", amount: 200 });
    const res = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });
});

// ── READ ONE ────────────────────────────────────────────────────────────────

describe("GET /transactions/:id", () => {
  it("returns a transaction by id", async () => {
    const created = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send(validTransaction);
    const id = created.body.data._id;
    const res = await request(app)
      .get(`/transactions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(id);
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/transactions/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── UPDATE ──────────────────────────────────────────────────────────────────

describe("PATCH /transactions/:id", () => {
  it("updates a transaction and returns the updated document", async () => {
    const created = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send(validTransaction);
    const id = created.body.data._id;
    const res = await request(app)
      .patch(`/transactions/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 9999 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.amount).toBe(9999);
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .patch(`/transactions/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 100 });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── DELETE ──────────────────────────────────────────────────────────────────

describe("DELETE /transactions/:id", () => {
  it("deletes a transaction and returns 200", async () => {
    const created = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send(validTransaction);
    const id = created.body.data._id;
    const res = await request(app)
      .delete(`/transactions/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/transactions/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── FILTER ──────────────────────────────────────────────────────────────────

describe("GET /transactions/filter", () => {
  beforeEach(async () => {
    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "income", category: "salary", amount: 5000, date: "2024-01-15" });
    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "expense", category: "food", amount: 300, date: "2024-02-10" });
  });

  it("filters by category", async () => {
    const res = await request(app)
      .get("/transactions/filter?category=salary")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe("salary");
  });

  it("filters by date range", async () => {
    const res = await request(app)
      .get("/transactions/filter?startDate=2024-01-01&endDate=2024-01-31")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe("salary");
  });

  it("returns 400 for invalid date", async () => {
    const res = await request(app)
      .get("/transactions/filter?startDate=not-a-date")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ── TRENDS ──────────────────────────────────────────────────────────────────

describe("GET /transactions/trends", () => {
  it("returns empty array when no transactions exist", async () => {
    const res = await request(app)
      .get("/transactions/trends")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("returns monthly trend data", async () => {
    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "income", category: "salary", amount: 5000, date: "2024-01-15" });
    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "expense", category: "food", amount: 1000, date: "2024-01-20" });
    const res = await request(app)
      .get("/transactions/trends")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].income).toBe(5000);
    expect(res.body.data[0].expense).toBe(1000);
    expect(res.body.data[0].balance).toBe(4000);
  });
});

// ── VALIDATION ──────────────────────────────────────────────────────────────

describe("POST /transactions - validation failures", () => {
  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ category: "salary" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for invalid type", async () => {
    const res = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "transfer", category: "salary", amount: 500, date: "2024-01-15" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for zero amount", async () => {
    const res = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "income", category: "salary", amount: 0, date: "2024-01-15" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
