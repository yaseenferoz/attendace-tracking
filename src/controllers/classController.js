const Class = require("../models/Class");
const Subject = require("../models/Subject");
const User = require("../models/User");

// @desc Create a new class
// @route POST /api/classes
// @access Admin only
const createClass = async (req, res) => {
    try {
        const { name, subjects, students, teachers } = req.body;

        const classExists = await Class.findOne({ name });
        if (classExists) {
            return res.status(400).json({ message: "Class already exists" });
        }

        const newClass = await Class.create({
            name,
            subjects,
            students,
            teachers,
        });

        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all classes
// @route GET /api/classes
// @access Admin only
const getClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate("subjects").populate("students").populate("teachers");
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update a class
// @route PUT /api/classes/:id
// @access Admin only
const updateClass = async (req, res) => {
    try {
        const { name, subjects, students, teachers } = req.body;
        const classObj = await Class.findById(req.params.id);

        if (!classObj) {
            return res.status(404).json({ message: "Class not found" });
        }

        classObj.name = name || classObj.name;
        classObj.subjects = subjects || classObj.subjects;
        classObj.students = students || classObj.students;
        classObj.teachers = teachers || classObj.teachers;
        await classObj.save();

        res.json(classObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete a class
// @route DELETE /api/classes/:id
// @access Admin only
const deleteClass = async (req, res) => {
    try {
        const classObj = await Class.findById(req.params.id);

        if (!classObj) {
            return res.status(404).json({ message: "Class not found" });
        }

        await classObj.remove();
        res.json({ message: "Class removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createClass, getClasses, updateClass, deleteClass };
