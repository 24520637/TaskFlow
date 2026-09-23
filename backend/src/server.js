const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { pool } = require("./config/database");

const app = express();

app.use(cors({
    origin(origin, callback) {
        if (!origin || env.corsOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    }
}));
app.use(express.json());
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
    const server = app.listen(env.port, () => {
        console.log(`TaskFlow API running at http://localhost:${env.port}`);
    });

    function shutdown() {
        server.close(async () => {
            await pool.end();
            process.exit(0);
        });
    }

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

module.exports = app;