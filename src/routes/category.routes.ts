import { Router } from "express";
import { category, getAllCategory,getCategoryById,updateCategory, deleteCategory } from "../controllers/category.controller.js";

const router = Router();
router.post("/",category);
router.get("/allCategories",getAllCategory)
router.get("/:id",getCategoryById)
router.patch("/:id",updateCategory)
router.delete("/:id",deleteCategory)
export default router;