# Express Book Reviews — IBM Coursera Final Project

A REST API built with **Node.js + Express** that implements all tasks from the IBM Coursera *"Developing Back-End Apps with Node.js and Express"* course final project.

---

## 📂 Folder Structure

```
expressBookReviews/
├── index.js               # App entry point, middleware, route mounting
├── package.json
├── .gitignore
└── router/
    ├── booksdb.js         # Provided book database (10 classic books)
    ├── general.js         # Public routes + Axios async variants (Tasks 1–6, 10–13)
    └── auth_users.js      # Authenticated routes: login, add/update/delete review (Tasks 7–9)
```

---

## 🚀 Installation & Running

```bash
# 1. Clone or navigate to the project folder
cd expressBookReviews

# 2. Install dependencies
npm install

# 3. Start the server
npm start
# → Running on http://localhost:5000
```

> Use `npm run dev` for hot-reload with nodemon during development.

---

## 🔗 API Endpoints

### Public (No Authentication)

| Method | Endpoint              | Description                                |
|--------|-----------------------|--------------------------------------------|
| GET    | `/`                   | Task 1 – Get all books                     |
| GET    | `/isbn/:isbn`         | Task 2 – Search by ISBN                    |
| GET    | `/author/:author`     | Task 3 – Search by author                  |
| GET    | `/title/:title`       | Task 4 – Search by title                   |
| GET    | `/review/:isbn`       | Task 5 – Get reviews for a book            |
| POST   | `/register`           | Task 6 – Register a new user               |

### Authenticated (Requires Login)

| Method | Endpoint                        | Description                            |
|--------|---------------------------------|----------------------------------------|
| POST   | `/customer/login`               | Task 7 – Login, receive JWT            |
| PUT    | `/customer/auth/review/:isbn`   | Task 8 – Add/update review             |
| DELETE | `/customer/auth/review/:isbn`   | Task 9 – Delete review                 |

### Axios Async (Tasks 10–13)

| Method | Endpoint                  | Description                              |
|--------|---------------------------|------------------------------------------|
| GET    | `/async/books`            | Task 10 – All books via Axios (Promise)  |
| GET    | `/async/isbn/:isbn`       | Task 11 – By ISBN via Axios (async/await)|
| GET    | `/async/author/:author`   | Task 12 – By author via Axios            |
| GET    | `/async/title/:title`     | Task 13 – By title via Axios             |

---

## 🧪 cURL Commands

### 1. Get All Books
```bash
curl -X GET http://localhost:5000/
```

### 2. Get Book by ISBN
```bash
curl -X GET http://localhost:5000/isbn/1
```

### 3. Get Books by Author
```bash
curl -X GET http://localhost:5000/author/Chinua
```

### 4. Get Books by Title
```bash
curl -X GET http://localhost:5000/title/Things
```

### 5. Get Book Reviews
```bash
curl -X GET http://localhost:5000/review/1
```

### 6. Register a New User
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### 7. Login
```bash
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  -c cookies.txt
```

### 8. Add/Update a Review (requires login session)
```bash
curl -X PUT "http://localhost:5000/customer/auth/review/1?review=Great+book!" \
  -b cookies.txt
```

### 9. Delete a Review (requires login session)
```bash
curl -X DELETE http://localhost:5000/customer/auth/review/1 \
  -b cookies.txt
```

### Task 10 – Async All Books
```bash
curl -X GET http://localhost:5000/async/books
```

### Task 11 – Async by ISBN
```bash
curl -X GET http://localhost:5000/async/isbn/1
```

### Task 12 – Async by Author
```bash
curl -X GET http://localhost:5000/async/author/Austen
```

### Task 13 – Async by Title
```bash
curl -X GET http://localhost:5000/async/title/Pride
```

---

## 📋 IBM Grading Tasks Covered

| Task | Description | Status |
|------|-------------|--------|
| Task 1  | Get all books | ✅ |
| Task 2  | Get by ISBN | ✅ |
| Task 3  | Get by Author | ✅ |
| Task 4  | Get by Title | ✅ |
| Task 5  | Get reviews | ✅ |
| Task 6  | Register user | ✅ |
| Task 7  | Login with JWT | ✅ |
| Task 8  | Add/Update review | ✅ |
| Task 9  | Delete review | ✅ |
| Task 10 | Async get all books (Promise) | ✅ |
| Task 11 | Async get by ISBN (async/await) | ✅ |
| Task 12 | Async get by author (async/await) | ✅ |
| Task 13 | Async get by title (async/await) | ✅ |

---

## 🛠 Tech Stack

- **Node.js** – Runtime
- **Express.js** – Web framework
- **express-session** – Session management
- **jsonwebtoken** – JWT authentication
- **bcryptjs** – Password hashing
- **Axios** – HTTP client for async tasks

---

*IBM Coursera – Developing Back-End Apps with Node.js and Express*
