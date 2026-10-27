const express = require("express");

const app = express();

app.get("/users", async (req, res) => {
    const result = await pool.query("SELECT * FROM users");
    res.json({users: result.rows});
});

app.listen(3000);


const pool = require("./db");

app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ databaseTime: result.rows[0].now });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        res.status(500).json({ error: "Database connection failed" });
    }
});