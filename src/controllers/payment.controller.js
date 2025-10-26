import {Payment} from "../models/payment.model.js";
import { Order } from "../models/order.model.js";

const createPayment = async (req, res) => {
  try {
    const { orderId, method, amount, transactionId, currency, response } = req.body;

    if (!orderId || !method || !amount || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const payment = await Payment.create({
      orderId,
      userId: req.user._id,
      method,
      amount,
      transactionId,
      currency: currency || "PKR",
      paymentResponse: response || {},
    });

    await Order.findByIdAndUpdate(orderId, { paymentId: payment._id });

    return res.status(201).json({
      success: true,
      message: "Payment record created successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while creating payment",
      error: error.message,
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({userId: req.user._id}).populate("userId orderId")
    return res.status(200).json({
      success: true,
      message: "All payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching payments",
      error: error.message,
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId).populate("userId orderId");
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Payment fetched successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching payment",
      error: error.message,
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, response } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (status) payment.status = status;
    if (response) payment.paymentResponse = response;

    await payment.save();
    return res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating payment",
      error: error.message,
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    await payment.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting payment",
      error: error.message,
    });
  }
};

export { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment };
