import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger";
import healthRouter from "./src/routes/health.routes";
import authRouter from "./src/routes/auth.routes";
import transactionRouter from "./src/routes/transaction.routes";
import errorHandler from "./src/middlewares/error.middleware";
import logger from "./src/middlewares/logger.middleware";

const app = express();

app.use(express.json());
app.use(logger);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/health", healthRouter);
app.use("/", authRouter);
app.use("/transactions", transactionRouter);

// Global error handler — must be LAST
app.use(errorHandler);

export default app;
