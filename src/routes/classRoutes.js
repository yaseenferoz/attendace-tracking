const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    createClass,
    getClasses,
    updateClass,
    deleteClass,
} = require("../controllers/classController");

const router = express.Router();

// Class Management Routes (Admin only)
router.post("/", protect, authorize("admin"), createClass);
router.get("/", protect, authorize("admin"), getClasses);
router.put("/:id", protect, authorize("admin"), updateClass);
router.delete("/:id", protect, authorize("admin"), deleteClass);

module.exports = router;
