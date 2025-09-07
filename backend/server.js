const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config(); // ✅ load .env

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// ✅ MySQL connection using .env variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});

// ✅ Ensure DB + Table exist
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL server");

  // Create DB if not exists
  db.query("CREATE DATABASE IF NOT EXISTS myapp", (err) => {
    if (err) throw err;
    console.log("✅ Database checked/created");

    // Switch to database
    db.changeUser({ database: "myapp" }, (err) => {
      if (err) throw err;

      // Create table if not exists
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          phone VARCHAR(20) NOT NULL,
          password VARCHAR(255) NOT NULL,
          dob DATE NOT NULL
        )
      `;
      db.query(createTableQuery, (err) => {
        if (err) throw err;
        console.log("✅ Users table checked/created");
      });
    });
  });
});

// ================== SIGNUP ==================
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, contact, password, dob } = req.body;

  if (!firstName || !lastName || !email || !contact || !password || !dob) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (first_name, last_name, email, phone, password, dob) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [firstName, lastName, email, contact, hashedPassword, dob],
      (err) => {
        if (err) {
          console.error("❌ MySQL insert error:", err);
          return res.status(500).json({ error: "User already exists or DB error" });
        }
        res.json({ message: "Signup successful" });
      }
    );
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================== LOGIN ==================
app.post("/login", (req, res) => {
  const { identifier, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1";
  db.query(sql, [identifier, identifier], async (err, results) => {
    if (err) {
      console.error("❌ MySQL select error:", err);
      return res.status(500).json({ error: "DB error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful", user });
  });
});

// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
