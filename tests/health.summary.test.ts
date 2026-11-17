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
    email: "summary@example.com",
    password: "Test@123",
  });
  const loginRes = await request(app).post("/login").send({
    email: "summary@example.com",
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

// ── HEALTH (public) ─────────────────────────────────────────────────────────

describe("GET /health", () => {
  it("returns 200 with status ok (no token needed)", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.message).toBe("FinEdge API is running");
    expect(res.body.timestamp).toBeDefined();
  });
});

// ── SUMMARY (protected) ─────────────────────────────────────────────────────

describe("GET /summary", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/summary");
    expect(res.status).toBe(401);
  });

  it("returns zeros when no transactions exist", async () => {
    const res = await request(app)
      .get("/summary")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.income).toBe(0);
    expect(res.body.data.expense).toBe(0);
    expect(res.body.data.balance).toBe(0);
  });

  it("calculates correct income, expense, and balance", async () => {
    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "income", category: "salary", amount: 5000, date: "2024-01-15" });
    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "expense", category: "utilities", amount: 1500, date: "2024-01-16" });
    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "expense", category: "food", amount: 300, date: "2024-01-17" });

    const res = await request(app)
      .get("/summary")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.income).toBe(5000);
    expect(res.body.data.expense).toBe(1800);
    expect(res.body.data.balance).toBe(3200);
  });
});
