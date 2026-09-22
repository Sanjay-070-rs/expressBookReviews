const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
const { isValid } = require("./auth_users.js");
const users = require("./users_store.js");
const bcrypt = require("bcryptjs");

const public_users = express.Router();

// Base URL for Axios calls to self (Tasks 10-13)
const BASE_URL = "http://localhost:5001";

// ════════════════════════════════════════════════════════════════════════════
// Task 1 – GET /  →  Get the book list available in the shop
// ════════════════════════════════════════════════════════════════════════════
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// ════════════════════════════════════════════════════════════════════════════
// Task 2 – GET /isbn/:isbn  →  Get book details based on ISBN
// ════════════════════════════════════════════════════════════════════════════
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res
      .status(404)
      .json({ message: `No book found with ISBN ${isbn}.` });
  }
  return res.status(200).json(book);
});

// ════════════════════════════════════════════════════════════════════════════
// Task 3 – GET /author/:author  →  Get all books by an author
// ════════════════════════════════════════════════════════════════════════════
public_users.get("/author/:author", (req, res) => {
  const authorQuery = req.params.author.toLowerCase();
  const results = [];

  Object.entries(books).forEach(([isbn, book]) => {
    if (book.author.toLowerCase().includes(authorQuery)) {
      results.push({ isbn, ...book });
    }
  });

  if (results.length === 0) {
    return res
      .status(404)
      .json({ message: `No books found by author "${req.params.author}".` });
  }
  return res.status(200).json(results);
});

// ════════════════════════════════════════════════════════════════════════════
// Task 4 – GET /title/:title  →  Get all books based on title
// ════════════════════════════════════════════════════════════════════════════
public_users.get("/title/:title", (req, res) => {
  const titleQuery = req.params.title.toLowerCase();
  const results = [];

  Object.entries(books).forEach(([isbn, book]) => {
    if (book.title.toLowerCase().includes(titleQuery)) {
      results.push({ isbn, ...book });
    }
  });

  if (results.length === 0) {
    return res
      .status(404)
      .json({ message: `No books found with title "${req.params.title}".` });
  }
  return res.status(200).json(results);
});

// ════════════════════════════════════════════════════════════════════════════
// Task 5 – GET /review/:isbn  →  Get book review
// ════════════════════════════════════════════════════════════════════════════
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res
      .status(404)
      .json({ message: `No book found with ISBN ${isbn}.` });
  }
  return res.status(200).json(book.reviews);
});

// ════════════════════════════════════════════════════════════════════════════
// Task 6 – POST /register  →  Register a new user
// ════════════════════════════════════════════════════════════════════════════
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res
      .status(409)
      .json({ message: `Username "${username}" is already taken.` });
  }

  // Hash the password before storing
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });

  return res.status(201).json({
    message: `User "${username}" successfully registered.`,
  });
});

// ════════════════════════════════════════════════════════════════════════════
// Tasks 10-13 – Axios-based async routes (Promise callbacks & async/await)
// These mirror Tasks 1-4 but use Axios to call the local server.
// ════════════════════════════════════════════════════════════════════════════

// ── Task 10 – Get all books (Axios + Promise callback) ──────────────────────
public_users.get("/async/books", (req, res) => {
  axios
    .get(`${BASE_URL}/`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Failed to fetch books.", error: err.message });
    });
});

// ── Task 11 – Get book by ISBN (Axios + async/await) ────────────────────────
public_users.get("/async/isbn/:isbn", (req, res) => {
  axios
    .get(`${BASE_URL}/isbn/${req.params.isbn}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});

// ── Task 12 – Get books by author (Axios + async/await) ─────────────────────
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const { author } = req.params;
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    return res.status(200).json(response.data);
  } catch (err) {
    const status = err.response ? err.response.status : 500;
    const message = err.response
      ? err.response.data.message
      : "Failed to fetch books by author.";
    return res.status(status).json({ message });
  }
});

// ── Task 13 – Get books by title (Axios + async/await) ──────────────────────
public_users.get("/async/title/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    return res.status(200).json(response.data);
  } catch (err) {
    const status = err.response ? err.response.status : 500;
    const message = err.response
      ? err.response.data.message
      : "Failed to fetch books by title.";
    return res.status(status).json({ message });
  }
});

module.exports.general = public_users;
