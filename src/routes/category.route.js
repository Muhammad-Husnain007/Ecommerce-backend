import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/category.controller.js";

const categoryRouter = Router();
// categoryRouter.use(verifyJwt)

categoryRouter.route('/create-category').post(createCategory)
categoryRouter.route('/').get(getAllCategories)
categoryRouter.route('/:categoryId')
.get(getCategoryById)
.put(updateCategory)
.delete(deleteCategory)

export default categoryRouter;
