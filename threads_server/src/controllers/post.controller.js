import { User } from "../model/user.model.js";
import { Post } from "../model/post.model.js";
import { v2 as cloudinary } from "cloudinary";
const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Posted by and text fields are requited" });
    }
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized to create a post" });
    }
    const maxLength = 500;
    if (text.maxLength > 500) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength}` });
    }
    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error while creating post", error: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).json({ message: "Post fetched successfully", post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params?.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete the post" });
    }
    if (post?.img) {
      await cloudinary.uploader.destroy(
        post.img?.split("/").pop().split(".")[0]
      );
    }
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    const isLikedPost = post.likes.includes(userId);
    if (isLikedPost) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
    } else {
      await Post.findByIdAndUpdate(id, { $push: { likes: userId } });
    }
    return res.status(200).json({
      message: isLikedPost
        ? "post disliked successfully"
        : "post liked successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const reply = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const username = req.user.username;
    const userProfilePic = req.user?.profilePicture;
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);
    await post.save({ validateModifiedOnly: true });
    return res.status(201).json({ message: "reply added successfully", reply });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error while sending reply to the post" });
  }
};

export { createPost, getPost, deletePost, toggleLike, reply };
