/*
 * IBM Coursera – Express Book Reviews
 * Final Project Entry Point (index.js)
 *
 * Routing structure
 * ──────────────────────────────────────────────────────────────────────────
 *  Public (no auth)         →  router/general.js   mounted at "/"
 *  Authenticated (JWT)      →  router/auth_users.js mounted at "/customer"
 *
 * Authentication middleware verifies the JWT stored in req.session.authorization
 * and attaches the decoded payload to req.user before passing control to any
 * route under /customer/auth/...
 */

const express = require("express");
const session = require("express-session");
const jwt = require("jsonwebtoken");

const { general }       = require("./router/general.js");
const { authenticated } = require("./router/auth_users.js");

const app  = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "access";

// ─── Middleware ──────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (stores the JWT after login)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
  })
);

// ─── JWT Authentication Middleware ──────────────────────────────────────────
// Applied only to routes under /customer/auth/*
app.use("/customer/auth", (req, res, next) => {
  const auth = req.session.authorization;

  if (!auth || !auth.accessToken) {
    return res
      .status(401)
      .json({ message: "User not logged in. Please login first." });
  }

  try {
    const decoded = jwt.verify(auth.accessToken, JWT_SECRET);
    req.user = decoded; // { username, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    }
    return res.status(403).json({ message: "Invalid token." });
  }
});

// ─── Routes ─────────────────────────────────────────────────────────────────

// Public routes  →  GET /, /isbn/:isbn, /author/:author, /title/:title,
//                   /review/:isbn, POST /register,
//                   GET /async/books, /async/isbn/:isbn, ...
app.use("/", general);

// Authenticated  →  POST /customer/login,
//                   PUT  /customer/auth/review/:isbn,
//                   DELETE /customer/auth/review/:isbn
app.use("/customer", authenticated);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[Error]", err.stack || err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n📚  Express Book Reviews API is running on port ${PORT}`);
  console.log(`   ➜  http://localhost:${PORT}/\n`);
});

module.exports = app; // export for testing
