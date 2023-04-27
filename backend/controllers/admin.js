const { generateToken } = require("../helpers/tokens");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      const token = generateToken({ username }, "7d");
      res.json(token);
    } else {
      return res
        .status(400)
        .json({ message: "Username or password is wrong." });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "There is some error on admin side" });
  }
};

exports.feedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const check = await Admin.findOne({ user: req.user.id });
    if (!check) {
      const newFeedback = new Admin({
        user: req.user.id,
        feedbacks: [
          {
            feedback,
            createdAt: new Date(),
          },
        ],
      }).save();
      res.json(newFeedback);
    } else {
      const newFeedback = await Admin.findOneAndUpdate(
        { user: req.user.id },
        {
          $push: {
            feedbacks: {
              feedback,
              createdAt: new Date(),
            },
          },
        }
      );
      res.json(newFeedback);
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "There is some error on admin side" });
  }
};

exports.viewFeedback = async (req, res) => {
  try {
    const check = await Admin.find(
      {},
      { feedbacks: 1, user: 1, logs: 1, _id: 0 }
    ).populate("user", "first_name last_name username picture");
    res.json(check);
  } catch (error) {
    res.status(400).json({ message: "There is some error on admin side" });
  }
};
