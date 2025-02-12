 
const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { approveUser } = require("../controllers/adminController");

const router = express.Router();

// Approve users (Superuser only)
router.put("/approve/:id", protect, authorize("superuser"), approveUser);

module.exports = router;
