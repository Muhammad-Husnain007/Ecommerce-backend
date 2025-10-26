import { Order } from "../models/order.model.js";

const createOrder = async(req, res) => {
try {
         const { orderProducts, shippingAddress, paymentDetails, totalPrice} = req.body;
         console.log({...req.body})
         
          if (!orderProducts || orderProducts.length === 0 || !shippingAddress || !paymentDetails) {
          return res.status(400).json({
            success: false,
            message: "all fields are required",
          });
        }
         const order = await Order.create({
          userId: req.user._id,
          orderProducts,
          shippingAddress,
          paymentDetails,
          totalPrice,
        });
    
         return res.status(201).json({
          success: true,
          message: "Order created successfully",
          data: order,
        });
    
} catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: error.message,
    });
}
};

const getAllOrders = async(req, res) => {
   try {
     const order = await Order.find({userId: req.user._id})
       if (!order) {
           return res.status(404).json({
             success: false,
             message: "Orders not found",
           });
         }
      return res.status(201).json({
           success: true,
           message: "Order fetched successfully",
           data: order,
         });
   } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: error.message,
    });
   }

};

const getOrderById = async(req, res) => {
 try {
    const {orderId} = req.params;
    const order = await Order.findById(orderId)
     if (!order) {
              return res.status(404).json({
                success: false,
                message: "Order not found",
              });
            }
        return res.status(201).json({
              success: true,
              message: "Order fetched successfully",
              data: order,
            });  
 } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: error.message,
    });
 }   
} ;

const editOrder = async(req, res) => {
try {
    const {orderId} = req.params;
    const order = await Order.findByIdAndUpdate(orderId, 
        {...req.body},
        {new: true, runValidators: true},
    )


    if (!order) {
                  return res.status(404).json({
                    success: false,
                    message: "Order not found",
                  });
                }

 return res.status(201).json({
              success: true,
              message: "Order fetched successfully",
              data: order,
            });  

} catch (error) {
     return res.status(500).json({
              success: false,
              message: "Server error",
              data: error?.message,
            });  
}
} 

const deleteOrder = async(req, res) => {
try {
    const {orderId} = req.params;
    const order = await Order.findByIdAndDelete(orderId)
     if (!order) {
                      return res.status(404).json({
                        success: false,
                        message: "Order not found",
                      });
                    }
    
     return res.status(201).json({
                  success: true,
                  message: "Order deleted successfully",
                  data: {},
                });  
} catch (error) {
      return res.status(500).json({
              success: false,
              message: "Server error",
              data: error?.message,
            });  
}
} 

export{
    createOrder,
    getAllOrders,
    getOrderById,
    editOrder,
    deleteOrder
}
