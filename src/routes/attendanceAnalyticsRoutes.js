const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    getAttendanceTrends,
    getAbsenteeHeatmap,
    getAttendanceStats
} = require("../controllers/attendanceController");

const router = express.Router();

// Get attendance trends for a class
router.get("/trends/:classId", protect, authorize("admin", "teacher"), getAttendanceTrends);

// Get absentee heatmap data
router.get("/heatmap/:classId", protect, authorize("admin", "teacher"), getAbsenteeHeatmap);

// Get attendance statistics for pie chart
router.get("/stats/:classId", protect, authorize("admin", "teacher"), getAttendanceStats);

module.exports = router;
