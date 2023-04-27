const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  feedbacks: [
    {
      feedback: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
    },
  ],
  logs: [
    {
      log: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
