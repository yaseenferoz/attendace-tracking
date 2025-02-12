const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    getAssignedClasses,
    markAttendance,
    updateAttendance,
    getAttendanceHistory,
    exportAttendance,
    getAttendanceSummary,
    filterAttendanceByDate,
    generateAttendanceReport
} = require("../controllers/attendanceController");

const router = express.Router();

// Get assigned classes for the logged-in teacher
router.get("/assigned", protect, authorize("teacher"), getAssignedClasses);

// Mark attendance for a class
router.post("/mark", protect, authorize("teacher"), markAttendance);

// Update attendance for a class
router.put("/update/:id", protect, authorize("teacher"), updateAttendance);

// Get attendance history for a class
router.get("/history/:classId", protect, authorize("teacher"), getAttendanceHistory);

// Export attendance records to CSV
router.get("/export/:classId", protect, authorize("teacher"), exportAttendance);

// Get attendance summary for a class
router.get("/summary/:classId", protect, authorize("admin", "teacher"), getAttendanceSummary);

// Filter attendance by date range
router.get("/filter", protect, authorize("admin", "teacher"), filterAttendanceByDate);

// Generate attendance report as CSV
router.get("/report/:classId", protect, authorize("admin", "teacher"), generateAttendanceReport);


module.exports = router;
