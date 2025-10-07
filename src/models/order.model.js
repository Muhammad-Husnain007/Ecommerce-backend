import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId : {
    type : mongoose.Schema.ObjectId,
    ref : 'User'
  },
  orderId : {
    type : String,
    required : [true, "Provide orderId"],
    unique : true
  },
  productid : {
    type : mongoose.Schema.ObjectId,
    ref : 'product'
  },
  product_details : {
    name : String,
    image : Array,
  },
  paymentId : {
    type : String,
    default : ""
  },
   payment_status : {
    default : "" // or some string value
  },

  delivery_address : {
    type : mongoose.Schema.ObjectId,
    ref : 'address'
  },

  subTotalAmt : {
    type : Number,
    default : 0
  },

  totalAmt : {
    type : Number,
    default : 0
  },

  invoice_receipt : {
    type : String,
    default : ""
  },

}, { timestamps: true });


export const Order = mongoose.model('Order', orderSchema);