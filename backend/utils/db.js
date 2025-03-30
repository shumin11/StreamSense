import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open SQLite connection
const dbPromise = open({
  filename: "./streaming.db", // Name of the database
  driver: sqlite3.Database,
});

export default dbPromise;
