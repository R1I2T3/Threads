import { Router } from "express";
import {
  createPost,
  getPost,
  deletePost,
  toggleLike,
  reply,
} from "../controllers/post.controller.js";
import protectRoute from "../middleware/ProtectRoute.js";
const router = Router();

router.post("/create", protectRoute, createPost);
router.get("/:id", getPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/toggleLike/:id", protectRoute, toggleLike);
router.put("/reply/:id", protectRoute, reply);
export default router;
