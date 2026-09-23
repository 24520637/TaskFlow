const { registerUser, loginUser, findUserById } = require("../services/authService");

function validateCredentials(body, includeName) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (includeName && !name) {
        const error = new Error("Name is required");
        error.statusCode = 400;
        throw error;
    }

    if (includeName && name.length > 120) {
        const error = new Error("Name must be 120 characters or fewer");
        error.statusCode = 400;
        throw error;
    }

    if (!email || email.length > 255 || !/^\S+@\S+\.\S+$/.test(email)) {
        const error = new Error("A valid email is required");
        error.statusCode = 400;
        throw error;
    }

    if (password.length < 8) {
        const error = new Error("Password must be at least 8 characters long");
        error.statusCode = 400;
        throw error;
    }

    if (password.length > 72) {
        const error = new Error("Password must be 72 characters or fewer");
        error.statusCode = 400;
        throw error;
    }

    return { name, email, password };
}

async function register(req, res, next) {
    try {
        const credentials = validateCredentials(req.body || {}, true);
        const result = await registerUser(credentials);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const credentials = validateCredentials(req.body || {}, false);
        const result = await loginUser(credentials);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

async function me(req, res, next) {
    try {
        const user = await findUserById(req.user.id);

        if (!user) {
            const error = new Error("Authenticated user no longer exists");
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    me
};