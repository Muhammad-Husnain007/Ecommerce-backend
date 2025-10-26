import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    //   required: true,
    // },
    category: {
      type: String,
      required: true,
    },
    productQuantity: {
      type: Number,
      // required: true,
    },
    
    brand: {
      type: String,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],

    ratings: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      // how many review on your product
      type: Number,
      default: 0,
    },

    reviews:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      }],

    isFeatured: {
      // if true menans kah home screen pa dikhana hai
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "out-of-stock"],
      default: "active",
    },
    size: {
      type: String,
      enum: ["S", "M", "L", "XL"],
      default: "S",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
