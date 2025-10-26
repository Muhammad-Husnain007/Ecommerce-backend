import { fileUploadCloudinary } from "../config/FileUpload.js";
import Product from "../models/product.model.js";

const uploadPrduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock,
      isFeatured,
      status,
    } = req.body;

    const productLocalPath = req?.files?.images;
    // console.log('productLocalPath: ', productLocalPath)
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !brand ||
      !stock ||
      !productLocalPath
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const retrivePath = productLocalPath.map((img) => img.path);
    console.log("controller in path: ", retrivePath);
    const uploadImages = await fileUploadCloudinary(retrivePath);

    const createProduct = await Product.create({
      name,
      description,
      price,
      discountPrice,
      category,
      images: uploadImages,
      brand,
      stock,
      isFeatured,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Product Upload Successfully.",
      data: createProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Products fetched successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Product delete success",
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {productId} = req.params;

 if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
      });
    }
    
    let uploadedImages = [];
    if (req.files?.images?.length) {
      uploadedImages = await fileUploadCloudinary(
        req.files.images.map(img => img.path)
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        ...req.body,
        ...(uploadedImages.length && { images: uploadedImages }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

export {
  uploadPrduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
