
import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createReview, deleteReview, getAllReviews, getReviewById, updateReview } from "../controllers/review.controller.js";

const reviewRouter = Router();
reviewRouter.use(verifyJwt)

reviewRouter.route("/create-review/:productId").post(createReview);
reviewRouter.route("/").get(getAllReviews)
reviewRouter.route("/:reviewId")
.get(getReviewById)
.delete(deleteReview)
.put(updateReview)


export default reviewRouter;