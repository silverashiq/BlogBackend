const express = require("express");
const { upload } = require("../auth/authController");
const { VerifyToken } = require("../auth/authMiddleware");
const {
  createPost,
  getUserPosts,
  likePost,
  unLikePost,
  updatePost,
  getSinglePost,
  deletePost,
} = require("./postController");
const { addComment, deleteComment } = require("./commentController");
const router = express.Router();

// Post Routes
router.post("/create-post", VerifyToken, upload.single("image"), createPost);
router.get("/user/:userId", VerifyToken, getUserPosts);

// Like/Unlike Routes
router.post("/:postId/like", VerifyToken, likePost);
router.post("/:postId/unlike", VerifyToken, unLikePost);

// Comment Routes
router.post("/:postId/comment", VerifyToken, addComment);
router.post("/:postId/deleteComment", VerifyToken, deleteComment);


// Single Post
router.get("/:postId", VerifyToken, getSinglePost);

// Edit Post
router.patch("/:postId", VerifyToken, upload.single("image"), updatePost);


// Delete Post
router.delete("/:postId", VerifyToken, deletePost);

module.exports = router;
