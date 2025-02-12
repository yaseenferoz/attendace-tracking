const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject,
} = require("../controllers/subjectController");

const router = express.Router();

// Subject Management Routes (Admin only)
router.post("/", protect, authorize("admin"), createSubject);
router.get("/", protect, authorize("admin"), getSubjects);
router.put("/:id", protect, authorize("admin"), updateSubject);
router.delete("/:id", protect, authorize("admin"), deleteSubject);

module.exports = router;
