const router = require("express").Router();
const {
  newConversation,
  getConversation,
  newMessage,
  getMessages,
  getBasicUserInfo,
} = require("../controllers/conversations");
const { authUser } = require("../middlewares/auth");

router.post("/newConversation", authUser, newConversation);
router.get("/getConversation/:id", authUser, getConversation);
router.post("/newMessage", authUser, newMessage);
router.get("/getMessages/:id", authUser, getMessages);
router.get("/getBasicUserInfo/:id", authUser, getBasicUserInfo);

module.exports = router;
