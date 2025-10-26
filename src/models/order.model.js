import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          // required: true,
        },
      },
    ],

    shippingAddress: {
         type: mongoose.Schema.Types.ObjectId,
          ref: "Address",
          required: true,
    },

    paymentDetails: {
      type: mongoose.Schema.Types.ObjectId,
       ref: "Payment",
       required: true,
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    deliveredAt: {
      type: Date,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },
    totalPrice: {
      type: String,
      
    },
    totalItems: {
      type: Number,
      
    },

  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

