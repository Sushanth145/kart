require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const cors = require("cors");



const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"], // Allow both variations
    credentials: true, // Allow cookies/session sharing
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization"
}));




// Middleware
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// 🔹 User Registration
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", [username, email, hashedPassword]);
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: "User already exists or database error!" });
    }
});

// 🔹 User Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        // 🔹 If email not found, send "Email not found!" message
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Email not found!" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        // 🔹 If password does not match, send "Incorrect password!"
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password!" });
        }

        // ✅ If login is successful, store session
        req.session.user = { id: user.id, username: user.username };
        res.json({ message: "Login successful!", user: req.session.user });
    } catch (error) {
        res.status(500).json({ error: "Database error!" });
    }
});

// 🔹 Logout
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Logout failed!" });
        res.json({ message: "Logged out successfully!" });
    });
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
