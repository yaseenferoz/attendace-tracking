 
const User = require("../models/User");
const Class = require("../models/Class");

// @desc Create a Student
// @route POST /api/students
// @access Admin only
const createStudent = async (req, res) => {
    try {
        const { name, email, phone, assignedClasses } = req.body;

        const studentExists = await User.findOne({ email });
        if (studentExists) {
            return res.status(400).json({ message: "Student already exists" });
        }

        const student = await User.create({
            name,
            email,
            phone,
            role: "student",
            isApproved: true,
            assignedClasses
        });

        // Add student to assigned classes
        await Class.updateMany(
            { _id: { $in: assignedClasses } },
            { $addToSet: { students: student._id } }
        );

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc Get All Students
// @route GET /api/students
// @access Admin only
const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "student" }).populate("assignedClasses");
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update Student Information
// @route PUT /api/students/:id
// @access Admin only
const updateStudent = async (req, res) => {
    try {
        const { name, email, phone, assignedClasses } = req.body;
        const student = await User.findById(req.params.id);

        if (!student || student.role !== "student") {
            return res.status(404).json({ message: "Student not found" });
        }

        student.name = name || student.name;
        student.email = email || student.email;
        student.phone = phone || student.phone;
        student.assignedClasses = assignedClasses || student.assignedClasses;

        await student.save();

        // Update class records to include student
        await Class.updateMany(
            { _id: { $in: assignedClasses } },
            { $addToSet: { students: student._id } }
        );

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete a Student
// @route DELETE /api/students/:id
// @access Admin only
const deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student || student.role !== "student") {
            return res.status(404).json({ message: "Student not found" });
        }

        await Class.updateMany(
            { students: student._id },
            { $pull: { students: student._id } }
        );

        await student.remove();
        res.json({ message: "Student removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createStudent, getStudents, updateStudent, deleteStudent };
