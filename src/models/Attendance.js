const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        records: [
            {
                studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                status: { type: String, enum: ["Present", "Absent"], required: true },
                reason: { type: String, default: "" }
            }
        ]
    },
    { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
