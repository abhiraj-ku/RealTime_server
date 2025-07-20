const express = require("express");
const router = express.Router();
const {
  getSummary,
  getSessions,
} = require("../controllers/analyticsController");

router.get("/summary", getSummary);
router.get("/sessions", getSessions);

module.exports = router;
