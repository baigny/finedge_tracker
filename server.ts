import "dotenv/config";
import app from "./app";
import connectDB from "./src/config/db";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`FinEdge API running on http://localhost:${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
  }
};

startServer();
