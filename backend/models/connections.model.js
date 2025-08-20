import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    // the user who sends the request
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // the user who receives the request
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // null = pending, true = accepted, false = rejected
    status_accepted: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true }
);

// prevent duplicate pending/outgoing in same direction
connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);
export default ConnectionRequest;