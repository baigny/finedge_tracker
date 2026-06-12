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

// ── HEALTH ──────────────────────────────────────────────────────────────────

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.message).toBe("FinEdge API is running");
    expect(res.body.timestamp).toBeDefined();
  });
});

// ── SUMMARY ─────────────────────────────────────────────────────────────────

describe("GET /summary", () => {
  it("returns zeros when no transactions exist", async () => {
    const res = await request(app).get("/summary");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.income).toBe(0);
    expect(res.body.data.expense).toBe(0);
    expect(res.body.data.balance).toBe(0);
  });

  it("calculates correct income, expense, and balance", async () => {
    await request(app)
      .post("/transactions")
      .send({ type: "income", category: "salary", amount: 5000, date: "2024-01-15" });
    await request(app)
      .post("/transactions")
      .send({ type: "expense", category: "rent", amount: 1500, date: "2024-01-16" });
    await request(app)
      .post("/transactions")
      .send({ type: "expense", category: "food", amount: 300, date: "2024-01-17" });

    const res = await request(app).get("/summary");
    expect(res.status).toBe(200);
    expect(res.body.data.income).toBe(5000);
    expect(res.body.data.expense).toBe(1800);
    expect(res.body.data.balance).toBe(3200);
  });
});
