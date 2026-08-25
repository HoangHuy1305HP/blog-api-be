import { Router } from "express";
import { profile, updateProfile, deleteProfile, usersProfile  } from "../controllers/user.controller.js";
import { getPostsByUser } from "../controllers/post.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
const router = Router();

router.get("/",authenticate,profile);
router.get("/:id",usersProfile);
router.get("/:id/posts",getPostsByUser)
router.patch("/profile",authenticate,updateProfile)
router.delete("/delete",authenticate,deleteProfile)
export default router;