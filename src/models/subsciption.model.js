import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId, //one who is subscibing
      ref: "User",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId, //one to whom the 'subscriber' is subscribing to
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
