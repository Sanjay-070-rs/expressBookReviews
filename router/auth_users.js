const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const books = require("./booksdb.js");

// Shared in-memory user store (array of { username, password })
const users = require("./users_store.js");

const regd_users = express.Router();

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns true if the username already exists in the store.
 */
const isValid = (username) => {
  return users.some((u) => u.username === username);
};

/**
 * Returns true if username + password match a stored user.
 */
const authenticatedUser = (username, password) => {
  const user = users.find((u) => u.username === username);
  if (!user) return false;
  // Support both bcrypt-hashed and plain-text (for tests) passwords
  try {
    return bcrypt.compareSync(password, user.password);
  } catch {
    return user.password === password;
  }
};

// ─── POST /customer/login ────────────────────────────────────────────────────
// Login with username + password, receive a JWT stored in session.
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res
      .status(401)
      .json({ message: "Invalid credentials. Please check username and password." });
  }

  // Sign a JWT valid for 1 hour
  const accessToken = jwt.sign(
    { username },
    process.env.JWT_SECRET || "access",
    { expiresIn: "1h" }
  );

  // Store token & username in session
  req.session.authorization = { accessToken, username };

  return res.status(200).json({
    message: `User ${username} successfully logged in.`,
    token: accessToken,
  });
});

// ─── PUT /customer/auth/review/:isbn ────────────────────────────────────────
// Authenticated route – Add or update a review for a book by ISBN.
// The review text is passed as a query parameter: ?review=<text>
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username; // set by JWT middleware in index.js

  if (!review) {
    return res
      .status(400)
      .json({ message: "Review text is required as a query parameter (?review=...)." });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `No book found with ISBN ${isbn}.` });
  }

  // One review per user per book (add or overwrite)
  book.reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} by ${username} has been added/updated.`,
    reviews: book.reviews,
  });
});

// ─── DELETE /customer/auth/review/:isbn ─────────────────────────────────────
// Authenticated route – Delete the logged-in user's review for a book.
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `No book found with ISBN ${isbn}.` });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({
      message: `No review by ${username} found for ISBN ${isbn}.`,
    });
  }

  delete book.reviews[username];

  return res.status(200).json({
    message: `Review by ${username} for ISBN ${isbn} has been deleted.`,
    reviews: book.reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
