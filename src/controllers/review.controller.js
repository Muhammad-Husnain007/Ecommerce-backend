import Product from "../models/product.model.js";
import ReviewModel from "../models/review.model.js";
import { User } from "../models/user.model.js";

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const review = await ReviewModel.create({
      rating,
      comment,
      userId: user._id,
      productId,
    });

     product.numOfReviews = (product.numOfReviews || 0) + 1;
    product.reviews = product.reviews ? [...product.reviews, review._id] : [review._id];
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllReviews = async (req, res) => {
  try {
    // const {productId} = req.params
    const reviews = await ReviewModel.find();
    if (!reviews) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this product",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Review get successfully",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    console.log(req.user);
    if (review.userId.toString() !== req?.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this review",
      });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this review",
      });
    }

    await review.deleteOne();
     await Product.findByIdAndUpdate(
      review.productId,
      {
        $pull: { reviews: review._id }, 
        $inc: { numOfReviews: -1 },     
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
  getReviewById,
};
