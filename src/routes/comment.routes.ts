import { Router } from "express";
import { createNewComment,getAllComment, updateComment, deleteComment } from "../controllers/comment.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
const router = Router();

router.post("/posts/:postId/comments",authenticate,createNewComment);
router.get("/posts/:postId/comments",getAllComment);
router.put("/comments/:id",authenticate,updateComment);
router.delete("/comments/:id",authenticate,deleteComment)

export default router;