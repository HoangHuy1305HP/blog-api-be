import { Router } from "express";
import { createPost, getAllPosts,getPostById,updatePost,deletePostById,getRecentPosts, getRecentPostsByUser, getPostsBySearch} from "../controllers/post.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { likePost, unlikePost } from "../controllers/like.controller.js";
import { optionalAuthenticate } from "../middlewares/optionalAuthenticate.js";
const router = Router();

router.post("/",authenticate,createPost)
router.get("/",getAllPosts)
router.get("/recent",getRecentPosts)
router.get("/recent/:id",getRecentPostsByUser)
router.get("/search",getPostsBySearch)
router.get("/:id",optionalAuthenticate, getPostById)


router.put("/:id",authenticate,updatePost)
router.delete("/:id",authenticate,deletePostById)

router.post("/:id/like",authenticate, likePost)
router.delete("/:id/like",authenticate,unlikePost)
export default router;
