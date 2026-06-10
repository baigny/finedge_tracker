import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger";
import healthRouter from "./src/routes/health.routes";
import authRouter from "./src/routes/auth.routes";
import transactionRouter from "./src/routes/transaction.routes";

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/health", healthRouter);
app.use("/", authRouter);
app.use("/transactions", transactionRouter);

export default app;
