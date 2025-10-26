import { Router } from "express";
import { addWhishlist, deleteWhishlist, getAllWhishlist, getSingleWhishlist } from "../controllers/whishlist.controller.js";


const whishlistRouter = Router()

whishlistRouter.route("/")
.post(addWhishlist)
.get(getAllWhishlist)

whishlistRouter.route("/:whishlistId")
.get(getAllWhishlist)
.put(getSingleWhishlist)
.delete(deleteWhishlist)

export default whishlistRouter;