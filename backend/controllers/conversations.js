const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

exports.newConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConverse = await new Conversation({
      members: [senderId, receiverId],
    }).save();
    res.status(200).json(newConverse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const converse = await Conversation.find({
      members: { $in: [req.params.id] },
    });
    res.status(200).json(converse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.newMessage = async (req, res) => {
  try {
    const newMessage = await new Message(req.body).save();
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBasicUserInfo = async (req, res) => {
  try {
    const otherUser = await User.findById(req.params.id).select(
      "first_name last_name picture username"
    );
    res.json(otherUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
