import Product from "../models/product.model.js";
import { whishlistModel } from "../models/whishlist.model.js";

const addWhishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    const whishlist = await whishlistModel.create({ productId });
    res.status(201).json({
      success: true,
      message: "Added to wishlist successfully.",
      data: whishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

const getAllWhishlist = async (req, res) => {
  try {
    const whishlist = await whishlistModel.find().populate("productId");

    if (!whishlist || whishlist.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No wishlist items found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully.",
      data: whishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

const getSingleWhishlist = async (req, res) => {
  try {
    const { whishlistId } = req.params;

    const whishlist = await whishlistModel.findById(whishlistId).populate("productId");
    if (!whishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist item fetched successfully.",
      data: whishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

const updateWhishlist = async (req, res) => {
  try {
    const { whishlistId } = req.params;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    const whishlist = await whishlistModel.findByIdAndUpdate(
      whishlistId,
      { productId },
      { new: true }
    );

    if (!whishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist updated successfully.",
      data: whishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

const deleteWhishlist = async (req, res) => {
  try {
    const { whishlistId } = req.params;

    const whishlist = await whishlistModel.findByIdAndDelete(whishlistId);

    if (!whishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

export {
  addWhishlist,
  getAllWhishlist,
  getSingleWhishlist,
  updateWhishlist,
  deleteWhishlist,
};
