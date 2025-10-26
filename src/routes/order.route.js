import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createOrder, deleteOrder, editOrder, getAllOrders, getOrderById } from "../controllers/order.controller.js";

const orderRouter = Router();
// orderRouter.use(verifyJwt)

orderRouter.route('/create-order').post(createOrder)
orderRouter.route('/').get(getAllOrders)
orderRouter.route('/:orderId')
.get(getOrderById)
.put(editOrder)
.delete(deleteOrder)

export default orderRouter;
