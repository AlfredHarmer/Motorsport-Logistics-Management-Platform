import express from "express";
import { pool } from "./database.js";
import { locationRouter } from "./locations/location.routes.js";
import { championshipsRouter } from "./championships/championship.routes.js";
import { championshipSeasonsRouter } from "./championship-seasons/championship-seasons.routes.js";

const app = express();

app.use(express.json());

const PORT = 3000;

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database health check failed", error);
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

app.use("/api/locations", locationRouter);
app.use("/api/championships", championshipsRouter);
app.use("/api/championship-seasons", championshipSeasonsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
