import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  sender: {
    userId: String,
    username: String,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.index({ roomId: 1, createdAt: -1 });
// roomId: 1 -> roomId 기준 오름차순
// createdAt: -1 -> createdAt 기준 내림차순

export const Message = mongoose.model("Message", messageSchema);
