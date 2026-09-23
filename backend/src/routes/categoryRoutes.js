const express = require("express");

const requireAuth = require("../middleware/authMiddleware");
const { create, list, getOne, update, remove } = require("../controllers/categoryController");

const router = express.Router();

router.use(requireAuth);
router.post("/", create);
router.get("/", list);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;