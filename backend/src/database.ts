import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool();

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL connection error", error);
});
