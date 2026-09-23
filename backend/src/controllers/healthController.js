const { getHealthStatus } = require("../services/healthService");

async function getHealth(req, res, next) {
    try {
        const health = await getHealthStatus();

        res.status(200).json({
            message: "TaskFlow API is running",
            ...health
        });
    } catch (error) {
        error.statusCode = 503;
        error.publicMessage = "TaskFlow API is running, but the database is unavailable";
        next(error);
    }
}

module.exports = {
    getHealth
};