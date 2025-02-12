const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const User = require("../models/User");
const moment = require("moment");
// @desc Get Assigned Classes & Subjects for a Teacher
// @route GET /api/attendance/assigned
// @access Teacher only
const getAssignedClasses = async (req, res) => {
    try {
        const teacher = req.user;
        const classes = await Class.find({ teachers: teacher._id }).populate("subjects students");
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Mark Attendance for a Class
// @route POST /api/attendance/mark
// @access Teacher only
const markAttendance = async (req, res) => {
    try {
        const { date, classId, subjectId, records } = req.body;
        const teacherId = req.user._id;

        // Check if attendance already exists for this date
        let attendance = await Attendance.findOne({ date, classId, subjectId });

        if (attendance) {
            return res.status(400).json({ message: "Attendance already marked for this class on this date." });
        }

        // Create attendance record
        attendance = new Attendance({
            date,
            classId,
            subjectId,
            teacherId,
            records
        });

        await attendance.save();
        res.status(201).json({ message: "Attendance marked successfully.", attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update Attendance (Edit past records)
// @route PUT /api/attendance/update/:id
// @access Teacher only
const updateAttendance = async (req, res) => {
    try {
        const { records } = req.body;
        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found." });
        }

        attendance.records = records;
        await attendance.save();

        res.json({ message: "Attendance updated successfully.", attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get Attendance History for a Class
// @route GET /api/attendance/history/:classId
// @access Teacher only
const getAttendanceHistory = async (req, res) => {
    try {
        const { classId } = req.params;
        const attendanceRecords = await Attendance.find({ classId }).populate("subjectId teacherId records.studentId");
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Export Attendance to Excel
// @route GET /api/attendance/export/:classId
// @access Teacher only
const exportAttendance = async (req, res) => {
    try {
        const { classId } = req.params;
        const attendanceRecords = await Attendance.find({ classId }).populate("records.studentId");

        // Convert data to CSV format
        let csv = "Date,Student Name,Status,Reason\n";
        attendanceRecords.forEach(record => {
            record.records.forEach(entry => {
                csv += `${record.date},${entry.studentId.name},${entry.status},${entry.reason}\n`;
            });
        });

        res.header("Content-Type", "text/csv");
        res.attachment("attendance_records.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc Get Attendance Summary for a Class
// @route GET /api/attendance/summary/:classId
// @access Admin & Teacher
const getAttendanceSummary = async (req, res) => {
    try {
        const { classId } = req.params;

        const attendanceRecords = await Attendance.find({ classId }).populate("records.studentId");

        const summary = {};

        attendanceRecords.forEach(record => {
            record.records.forEach(entry => {
                const studentId = entry.studentId._id.toString();
                if (!summary[studentId]) {
                    summary[studentId] = {
                        name: entry.studentId.name,
                        present: 0,
                        absent: 0
                    };
                }
                if (entry.status === "Present") {
                    summary[studentId].present += 1;
                } else {
                    summary[studentId].absent += 1;
                }
            });
        });

        res.json(Object.values(summary));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Filter Attendance by Date Range
// @route GET /api/attendance/filter
// @access Admin & Teacher
const filterAttendanceByDate = async (req, res) => {
    try {
        const { startDate, endDate, classId } = req.query;

        const records = await Attendance.find({
            classId,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).populate("records.studentId");

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Generate Attendance Report as CSV
// @route GET /api/attendance/report/:classId
// @access Admin & Teacher
const generateAttendanceReport = async (req, res) => {
    try {
        const { classId } = req.params;
        const attendanceRecords = await Attendance.find({ classId }).populate("records.studentId");

        let csv = "Date,Student Name,Status,Reason\n";
        attendanceRecords.forEach(record => {
            record.records.forEach(entry => {
                csv += `${record.date},${entry.studentId.name},${entry.status},${entry.reason}\n`;
            });
        });

        res.header("Content-Type", "text/csv");
        res.attachment("attendance_report.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get Attendance Trends (for Chart)
// @route GET /api/attendance/trends/:classId
// @access Admin & Teacher
const getAttendanceTrends = async (req, res) => {
    try {
        const { classId } = req.params;
        const attendanceRecords = await Attendance.find({ classId });

        const trends = {};

        attendanceRecords.forEach(record => {
            const date = moment(record.date).format("YYYY-MM-DD");
            if (!trends[date]) {
                trends[date] = { present: 0, absent: 0 };
            }
            record.records.forEach(entry => {
                if (entry.status === "Present") {
                    trends[date].present += 1;
                } else {
                    trends[date].absent += 1;
                }
            });
        });

        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get Absentee Heatmap Data
// @route GET /api/attendance/heatmap/:classId
// @access Admin & Teacher
const getAbsenteeHeatmap = async (req, res) => {
    try {
        const { classId } = req.params;
        const attendanceRecords = await Attendance.find({ classId });

        const heatmap = [];

        attendanceRecords.forEach(record => {
            record.records.forEach(entry => {
                if (entry.status === "Absent") {
                    heatmap.push({
                        date: moment(record.date).format("YYYY-MM-DD"),
                        student: entry.studentId,
                        reason: entry.reason
                    });
                }
            });
        });

        res.json(heatmap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get Attendance Statistics for Pie Chart
// @route GET /api/attendance/stats/:classId
// @access Admin & Teacher
const getAttendanceStats = async (req, res) => {
    try {
        const { classId } = req.params;
        const attendanceRecords = await Attendance.find({ classId });

        let totalPresent = 0;
        let totalAbsent = 0;

        attendanceRecords.forEach(record => {
            record.records.forEach(entry => {
                if (entry.status === "Present") {
                    totalPresent += 1;
                } else {
                    totalAbsent += 1;
                }
            });
        });

        res.json({ totalPresent, totalAbsent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getAssignedClasses, markAttendance, updateAttendance, getAttendanceHistory, exportAttendance, getAttendanceSummary, filterAttendanceByDate, generateAttendanceReport,getAttendanceTrends, getAbsenteeHeatmap, getAttendanceStats};
