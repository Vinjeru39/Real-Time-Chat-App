const mongoose = require("mongoose");
// const { MessageSchema } = require("./Message");

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    trim: true,
  },
  // messages: [MessageSchema],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("Room", RoomSchema);
