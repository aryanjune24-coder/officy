import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema(
  {
    product: {
      type: String,
      required: true,
    },

    customer: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Processing", "Delivered"],
      default: "Processing",
    },
  },
  {
    timestamps: true,
  }
);

const Order =
  models.Order ||
  mongoose.model("Order", OrderSchema);

export default Order;