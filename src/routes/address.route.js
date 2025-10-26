import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addAddress, deleteAddress, getAddressById, getUserAddresses, updateAddress } from "../controllers/address.controller.js";

const addressRouter = Router();
// addressRouter.use(verifyJwt)

addressRouter.route('/add-address').post(addAddress)
addressRouter.route('/').get(getUserAddresses)
addressRouter.route('/:addressId')
.get(getAddressById)
.put(updateAddress)
.delete(deleteAddress)

export default addressRouter;
