const express = require("express");

const healthRoutes = require("./healthRoutes");
const authRoutes = require("./authRoutes");
const taskRoutes = require("./taskRoutes");
const categoryRoutes = require("./categoryRoutes");

const router = express.Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;