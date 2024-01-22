import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndCookie from "../utils/generateToken.js";
import { Post } from "../model/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
const signup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    if (!newUser) {
      return res.status(400).json({ error: "Invalid User data" });
    }
    generateTokenAndCookie(newUser._id, res);
    res.status(201).json({
      message: "user registered successfully",
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      Bio: newUser.Bio,
      profilePicture: newUser.profilePicture,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error in registering user",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "wrong username or password" });
    }
    const comparePassword = bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(404).json({ error: "Wrong username or password" });
    }
    generateTokenAndCookie(user._id, res);
    res.status(200).json({
      message: "User logged in successfully",
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      Bio: user.Bio,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error was taken place while login user",
      error: err.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logout successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error in log out user", error: error.message });
  }
};

const toggleFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModified = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow and unFollow yourself" });
    }
    if (!userToModified || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
    }
    return res.status(201).json({
      message: isFollowing
        ? "User unfollow successfully"
        : "User followed successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, username, profilePicture, Bio } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (id !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot update other user profile" });
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (profilePicture) {
      if (user.profilePicture) {
        await cloudinary.uploader.destroy(
          user.profilePicture.split("/").pop().split(".")[0]
        );
      }
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      user.profilePicture = uploadResponse.secure_url;
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.Bio = Bio || user.Bio;
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error in updating user info" });
  }
};

const getUserProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query }).select("-password -updatedAt");
    } else {
      user = await User.findOne({ username: query }).select(
        "-password -updatedAt"
      );
    }
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const following = user.following;
    const feeds = await Post.find({ postedBy: { $in: following } });
    return res.status(200).json(feeds);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const getUserPost = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    if (!posts) {
      res.status(404).json({ error: "There is no post created by user" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export {
  signup,
  login,
  logout,
  toggleFollowUser,
  updateUser,
  getUserProfile,
  getFeed,
  getUserPost,
};
