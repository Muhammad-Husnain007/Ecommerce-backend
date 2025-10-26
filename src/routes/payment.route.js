import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deletePayment, getPaymentById, updatePayment, createPayment, getAllPayments,
 } from "../controllers/payment.controller.js";

const paymentRouter = Router();
// paymentRouter.use(verifyJwt)

paymentRouter.route('/create-payment').post(createPayment)
paymentRouter.route('/').get(getAllPayments)
paymentRouter.route('/:paymentId')
.get(getPaymentById)
.put(updatePayment)
.delete(deletePayment)

export default paymentRouter;
