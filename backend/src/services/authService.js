const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const env = require("../config/env");
const { pool } = require("../config/database");

const SALT_ROUNDS = 12;

function createToken(user) {
    return jwt.sign(
        { sub: String(user.id) },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn }
    );
}

function toPublicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at
    };
}

async function registerUser({ name, email, password }) {
    const [existingUsers] = await pool.execute(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (existingUsers.length > 0) {
        const error = new Error("Email is already registered");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await pool.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, passwordHash]
    );
    const user = {
        id: result.insertId,
        name,
        email,
        created_at: null,
        updated_at: null
    };

    return {
        user: toPublicUser(user),
        token: createToken(user)
    };
}

async function loginUser({ email, password }) {
    const [users] = await pool.execute(
        "SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
        [email]
    );
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    return {
        user: toPublicUser(user),
        token: createToken(user)
    };
}

async function findUserById(id) {
    const [users] = await pool.execute(
        "SELECT id, name, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
        [id]
    );

    return users[0] ? toPublicUser(users[0]) : null;
}

module.exports = {
    registerUser,
    loginUser,
    findUserById
};