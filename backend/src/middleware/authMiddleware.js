const jwt = require("jsonwebtoken");

const env = require("../config/env");

function requireAuth(req, res, next) {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        const error = new Error("Authentication required");
        error.statusCode = 401;
        return next(error);
    }

    try {
        const payload = jwt.verify(token, env.jwt.secret, { algorithms: ["HS256"] });
        const userId = Number(payload.sub);

        if (!Number.isInteger(userId) || userId < 1) {
            throw new Error("Invalid token subject");
        }

        req.user = { id: userId };
        return next();
    } catch (error) {
        const authenticationError = new Error("Invalid or expired token");
        authenticationError.statusCode = 401;
        return next(authenticationError);
    }
}

module.exports = requireAuth;