const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    getAttendanceSummary,
    filterAttendanceByDate,
    generateAttendanceReport
} = require("../controllers/attendanceController");

const router = express.Router();

// Get attendance summary for a class
router.get("/summary/:classId", protect, authorize("admin", "teacher"), getAttendanceSummary);

// Filter attendance by date range
router.get("/filter", protect, authorize("admin", "teacher"), filterAttendanceByDate);

// Generate attendance report as CSV
router.get("/report/:classId", protect, authorize("admin", "teacher"), generateAttendanceReport);

module.exports = router;
