const Subject = require("../models/Subject");

// @desc Create a new subject
// @route POST /api/subjects
// @access Admin only
const createSubject = async (req, res) => {
    try {
        const { name, code } = req.body;

        // Check if subject already exists
        const subjectExists = await Subject.findOne({ code });
        if (subjectExists) {
            return res.status(400).json({ message: "Subject code already exists" });
        }

        const subject = await Subject.create({ name, code });

        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all subjects
// @route GET /api/subjects
// @access Admin only
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update a subject
// @route PUT /api/subjects/:id
// @access Admin only
const updateSubject = async (req, res) => {
    try {
        const { name, code } = req.body;
        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        subject.name = name || subject.name;
        subject.code = code || subject.code;
        await subject.save();

        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete a subject
// @route DELETE /api/subjects/:id
// @access Admin only
const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        await subject.remove();
        res.json({ message: "Subject removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSubject, getSubjects, updateSubject, deleteSubject };
