const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const jwt = require("jsonwebtoken");
const Code = require("../models/Code");
const Post = require("../models/Post");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      username,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: "First name must be between 3 to 30 characters.",
      });
    }
    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        message: "Last name must be between 3 to 30 characters.",
      });
    }
    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message:
          "This email already exists. Try with a different email address.",
      });
    }
    const cryptedPassword = await bcrypt.hash(password, 12);

    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(
      tempUsername.toLowerCase().split(" ").join("")
    );

    const user = await new User({
      first_name,
      last_name,
      email,
      password: cryptedPassword,
      username: newUsername,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();

    await new Admin({
      user: user._id,
      logs: [
        {
          log: `${user.first_name} ${user.last_name} created account.`,
          createdAt: new Date(Date.now() + 18000000),
        },
      ],
    }).save();

    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: "Registered successfully! Please activate your email to start.",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const validUser = req.user.id;
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);

    if (validUser !== user.id) {
      return res.status(400).json({
        message: "You don't have the authorization to complete this operation.",
      });
    }

    if (check.verified == true) {
      return res
        .status(400)
        .json({ message: "This account is already activated." });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      await Admin.findOneAndUpdate(
        { user: user.id },
        {
          $push: {
            logs: {
              log: `Activated account`,
              createdAt: new Date(Date.now() + 18000000),
            },
          },
        }
      );
      return res
        .status(200)
        .json({ message: "Account has been activated successfully." });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "The email you entered doesn't exist." });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials. Please try again." });
    }
    if (user.verified === false) {
      if (new Date() - user.createdAt > 2592000000) {
        await User.findByIdAndRemove(user._id);
        return res
          .status(400)
          .json({ message: "Account deleted due to not getting activated" });
      }
    }
    const token = generateToken({ id: user._id.toString() }, "7d");

    await Admin.findOneAndUpdate(
      { user: user.id },
      {
        $push: {
          logs: {
            log: `Login`,
            createdAt: new Date(Date.now() + 18000000),
          },
        },
      }
    );

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.logoutLog = async (req, res) => {
  try {
    await Admin.findOneAndUpdate(
      { user: req.params.id },
      {
        $push: {
          logs: {
            log: `Logout`,
            createdAt: new Date(Date.now() + 18000000),
          },
        },
      }
    );
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.sendVerification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true) {
      return res
        .status(400)
        .json({ message: "This account is already activated." });
    }
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    return res.status(200).json({
      message: "Email verification link has been sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "Account does not exist." });
    }
    return res.status(200).json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = Math.floor(Math.random() * (99999 - 10000)) + 10000;

    const savedCode = await new Code({
      code,
      user: user._id,
    }).save();

    sendResetCode(user.email, user.first_name, code);

    return res
      .status(200)
      .json({ message: "Reset code has been sent to your email." });
  } catch (error) {
    res.status(500).message({ message: error.message });
  }
};

exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const DBcode = await Code.findOne({ user: user._id });
    if (DBcode.code !== code) {
      return res.status(400).json({ message: "Verification code is wrong." });
    }
    return res
      .status(200)
      .json({ message: "Successfully verified Reset Code" });
  } catch (error) {
    res.status(500).message({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { email, password } = req.body;

  const cryptedPassword = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate({ email }, { password: cryptedPassword });

  return res.status(200).json({ message: "Password changed successfully" });
};

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findById(req.user.id);
    const profile = await User.findOne({ username }).select("-password");
    const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    };
    if (!profile) {
      return res.json({ message: false });
    }
    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user._id)
    ) {
      friendship.friends = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }
    const posts = await Post.find({ user: profile._id })
      .populate("user")
      .populate(
        "comments.commentBy",
        "first_name last_name picture username commentAt"
      )
      .sort({ createdAt: -1 });
    await profile.populate("friends", "first_name last_name username picture");
    res.json({ ...profile.toObject(), posts, friendship });
  } catch (error) {
    res.status(500).json({ message: "error.message" });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });

    await Admin.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          logs: {
            log: `Updated Profile Picture`,
            createdAt: new Date(Date.now() + 18000000),
          },
        },
      }
    );

    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCover = async (req, res) => {
  try {
    const { url } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      cover: url,
    });

    await Admin.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          logs: {
            log: `Updated Cover Picture`,
            createdAt: new Date(Date.now() + 18000000),
          },
        },
      }
    );

    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const { infos } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $push: { requests: sender._id },
        });
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
        await Admin.findOneAndUpdate(
          { user: req.user.id },
          {
            $push: {
              logs: {
                log: `${sender.first_name} ${sender.last_name} sent friend request to ${receiver.first_name} ${receiver.last_name}`,
                createdAt: new Date(Date.now() + 18000000),
              },
            },
          }
        );
        res.json({ message: "Friend request has been sent" });
      } else {
        res.status(400).json({ message: "Already Sent" });
      }
    } else {
      res
        .status(400)
        .json({ message: "You can't send a friend request to yourself." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: receiver._id },
        });

        await Admin.findOneAndUpdate(
          { user: req.user.id },
          {
            $push: {
              logs: {
                log: `${sender.first_name} ${sender.last_name} cancelled friend request which he sent to ${receiver.first_name} ${receiver.last_name}`,
                createdAt: new Date(Date.now() + 18000000),
              },
            },
          }
        );

        res.json({ message: "Friend request has been Deleted" });
      } else {
        res.status(400).json({ message: "Friend request couldn't Deleted" });
      }
    } else {
      res.status(400).json({ message: "Friend request couldn't Deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });

        await Admin.findOneAndUpdate(
          { user: req.user.id },
          {
            $push: {
              logs: {
                log: `${sender.first_name} ${sender.last_name} followed ${receiver.first_name} ${receiver.last_name}`,
                createdAt: new Date(Date.now() + 18000000),
              },
            },
          }
        );

        res.json({ message: "Followed Successfully" });
      } else {
        res.status(400).json({ message: "Followed unsuccessfully" });
      }
    } else {
      res.status(400).json({ message: "Followed unsuccessfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.unfollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.followers.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: receiver._id },
        });

        await Admin.findOneAndUpdate(
          { user: req.user.id },
          {
            $push: {
              logs: {
                log: `${sender.first_name} ${sender.last_name} unfollowed ${receiver.first_name} ${receiver.last_name}`,
                createdAt: new Date(Date.now() + 18000000),
              },
            },
          }
        );

        res.json({ message: "unfollowed Successfully" });
      } else {
        res.status(400).json({ message: "unfollowed unsuccessfully" });
      }
    } else {
      res.status(400).json({ message: "unfollowed unsuccessfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.update({
          $push: { friends: sender._id, following: sender._id },
        });
        await sender.update({
          $push: { friends: receiver._id, followers: receiver._id },
        });
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });

        await Admin.findOneAndUpdate(
          { user: req.user.id },
          {
            $push: {
              logs: {
                log: `${receiver.first_name} ${receiver.last_name} accepted friend request of ${sender.first_name} ${sender.last_name}`,
                createdAt: new Date(Date.now() + 18000000),
              },
            },
          }
        );

        res.json({ message: "Friend Request accepted Successfully" });
      } else {
        res
          .status(400)
          .json({ message: "Friend Request not accepted Successfully" });
      }
    } else {
      res
        .status(400)
        .json({ message: "Friend Request not accepted Successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        sender.friends.includes(receiver._id) &&
        receiver.friends.includes(sender._id)
      ) {
        await receiver.update({
          $pull: {
            friends: sender._id,
            following: sender._id,
            followers: sender._id,
          },
        });
        await sender.update({
          $pull: {
            friends: receiver._id,
            followers: receiver._id,
            following: receiver._id,
          },
        });

        await Admin.findOneAndUpdate(
          { user: req.user.id },
          {
            $push: {
              logs: {
                log: `${sender.first_name} ${sender.last_name} unfriend ${receiver.first_name} ${receiver.last_name}`,
                createdAt: new Date(Date.now() + 18000000),
              },
            },
          }
        );

        res.json({ message: "Unfriend Successfully" });
      } else {
        res.status(400).json({ message: "Unfriend Unsuccessfull" });
      }
    } else {
      res.status(400).json({ message: "Unfriend Unsuccessfull" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.update({
          $pull: {
            requests: sender._id,
            followers: sender._id,
          },
        });
        await sender.update({
          $pull: {
            following: receiver._id,
          },
        });

        await Admin.findOneAndUpdate(
          { user: req.user.id },
          {
            $push: {
              logs: {
                log: `${receiver.first_name} ${receiver.last_name} deleted friend request of ${sender.first_name} ${sender.last_name}`,
                createdAt: new Date(Date.now() + 18000000),
              },
            },
          }
        );

        res.json({ message: "Friend Request deleted Successfully" });
      } else {
        res
          .status(400)
          .json({ message: "Friend Request deleted Unsuccessfully" });
      }
    } else {
      res
        .status(400)
        .json({ message: "Friend Request deleted Unsuccessfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const results = await User.find({
      $text: { $search: searchTerm },
    }).select("first_name last_name username picture");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToSearchHistory = async (req, res) => {
  try {
    const { searchUser } = req.body;
    const search = {
      user: searchUser,
      createdAt: new Date(),
    };
    const user = await User.findById(req.user.id);
    const check = user.search.find((x) => x.user.toString() === searchUser);
    if (check) {
      await User.updateOne(
        { _id: req.user.id, "search._id": check._id },
        {
          $set: {
            "search.$.createdAt": new Date(),
          },
        }
      );
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          search,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSearchHistory = async (req, res) => {
  try {
    const results = await User.findById(req.user.id)
      .select("search")
      .populate("search.user", "first_name last_name username picture");
    res.json(results.search);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromSearchHistory = async (req, res) => {
  try {
    const { searchUser } = req.body;
    await User.updateOne(
      {
        _id: req.user.id,
      },
      {
        $pull: { search: { user: searchUser } },
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFriendsPageInfos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends requests")
      .populate("friends", "first_name last_name picture username")
      .populate("requests", "first_name last_name picture username");

    const sentRequests = await User.find({
      requests: mongoose.Types.ObjectId(req.user.id),
    }).select("first_name last_name picture username");
    res.json({
      friends: user.friends,
      requests: user.requests,
      sentRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
