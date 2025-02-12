require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const classRoutes = require("./routes/classRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const attendanceReportRoutes = require("./routes/attendanceReportRoutes");
const attendanceAnalyticsRoutes = require("./routes/attendanceAnalyticsRoutes");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // Logger

// Connect to Database
connectDB();

// Default Route
app.get("/", (req, res) => {
    res.send("Attendance Tracking API is Running...");
});

// Corrected Route Paths
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/admin", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendance-reports", attendanceReportRoutes);
app.use("/api/attendance-analytics", attendanceAnalyticsRoutes);

// Fix Port Issue for Elastic Beanstalk
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server runnings on port ${PORT}`));
