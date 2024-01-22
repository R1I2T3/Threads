import { Router } from "express";
import {
  signup,
  login,
  logout,
  toggleFollowUser,
  updateUser,
  getUserProfile,
  getFeed,
  getUserPost,
} from "../controllers/user.controller.js";
import protectRoute from "../middleware/ProtectRoute.js";
const router = Router();

router.get("/profile/:query", getUserProfile);
router.post("/signup", signup);
router.post("/login", login);
router.get("/posts/:username", getUserPost);
router.post("/logout", protectRoute, logout);
router.post("/follow/:id", protectRoute, toggleFollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.get("/feed", protectRoute, getFeed);
export default router;
