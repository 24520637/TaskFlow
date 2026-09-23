const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requiredVariables = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];

for (const variable of requiredVariables) {
    if (process.env[variable] === undefined) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}

const port = Number(process.env.PORT || 5000);
const databasePort = Number(process.env.DB_PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
}

if (!Number.isInteger(databasePort) || databasePort < 1 || databasePort > 65535) {
    throw new Error("DB_PORT must be an integer between 1 and 65535");
}

module.exports = {
    nodeEnv: process.env.NODE_ENV || "development",
    port,
    database: {
        host: process.env.DB_HOST,
        port: databasePort,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
};