 
const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { approveOrRejectTeacher, assignTeacherToClasses } = require("../controllers/adminController");

const router = express.Router();

// Approve/Reject Teacher
router.put("/teacher/:id", protect, authorize("admin"), approveOrRejectTeacher);

// Assign Teacher to Classes
router.put("/assign-teacher/:id", protect, authorize("admin"), assignTeacherToClasses);

module.exports = router;
