import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "방 이름은 필수입니다."],
    trim: true,
  },
  participants: [
    {
      userId: String,
      username: String,
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 업데이트 시 updatedAt 자동 갱신
roomSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Room = mongoose.model("Room", roomSchema);
