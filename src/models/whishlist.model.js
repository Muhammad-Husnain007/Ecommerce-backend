import mongoose, { Schema } from "mongoose";

const whishlistSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true
  }
}, { timestamps: true });

export const whishlistModel = mongoose.model("whishlistModel", whishlistSchema);
