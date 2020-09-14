const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  sender: {
    type: String,
    required: true,
    trim: true,
  },
  senderName: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// module.exports.Message = mongoose.model("Message", MessageSchema);
// module.exports.MessageSchema = MessageSchema;

module.exports = mongoose.model("Message", MessageSchema);
