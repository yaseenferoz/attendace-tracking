const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: { type: String }, // No longer required for students
        role: {
            type: String,
            enum: ["superuser", "admin", "teacher", "student"],
            required: true
        },
        isApproved: { type: Boolean, default: false },
        assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
        assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }]
    },
    { timestamps: true }
);


const User = mongoose.model("User", userSchema);
module.exports = User;
