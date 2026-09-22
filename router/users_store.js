// Shared in-memory user store
// Exported as a plain array so it is mutated in-place by both routers.
// Structure of each element: { username: string, password: string (bcrypt hash) }
const users = [];

module.exports = users;
