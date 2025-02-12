const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();

// Student Management Routes (Admin only)
router.post("/", protect, authorize("admin"), createStudent);
router.get("/", protect, authorize("admin"), getStudents);
router.put("/:id", protect, authorize("admin"), updateStudent);
router.delete("/:id", protect, authorize("admin"), deleteStudent);

module.exports = router;
