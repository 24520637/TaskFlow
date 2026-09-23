const { testConnection } = require("../config/database");

async function getHealthStatus() {
    await testConnection();

    return {
        status: "ok",
        database: "connected"
    };
}

module.exports = {
    getHealthStatus
};