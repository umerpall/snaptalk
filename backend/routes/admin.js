const express = require("express");
const { adminLogin, feedback, viewFeedback } = require("../controllers/admin");
const router = express.Router();
const { authUser } = require("../middlewares/auth");

router.post("/admin/login", adminLogin);
router.put("/feedback", authUser, feedback);
router.get("/viewFeedback", authUser, viewFeedback);

module.exports = router;
