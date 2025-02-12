const User = require("../models/User");
const Class = require("../models/Class");

// @desc Approve or Reject a Teacher
// @route PUT /api/admin/teacher/:id
// @access Admin only
const approveOrRejectTeacher = async (req, res) => {
    try {
        const { isApproved } = req.body;
        const teacher = await User.findById(req.params.id);

        if (!teacher || teacher.role !== "teacher") {
            return res.status(404).json({ message: "Teacher not found" });
        }

        teacher.isApproved = isApproved;
        await teacher.save();

        res.json({ message: `Teacher ${teacher.name} has been ${isApproved ? "approved" : "rejected"}.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Assign Teacher to Classes & Subjects
// @route PUT /api/admin/assign-teacher/:id
// @access Admin only
const assignTeacherToClasses = async (req, res) => {
    try {
        const { assignedSubjects, assignedClasses } = req.body;
        const teacher = await User.findById(req.params.id);

        if (!teacher || teacher.role !== "teacher") {
            return res.status(404).json({ message: "Teacher not found" });
        }

        teacher.assignedSubjects = assignedSubjects;
        teacher.assignedClasses = assignedClasses;
        await teacher.save();

        // Update class records to include teacher
        await Class.updateMany(
            { _id: { $in: assignedClasses } },
            { $addToSet: { teachers: teacher._id } }
        );

        res.json({ message: `Teacher ${teacher.name} assigned to selected classes and subjects.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { approveOrRejectTeacher, assignTeacherToClasses };
