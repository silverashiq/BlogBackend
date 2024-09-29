const Post = require("../models/Post");
const { cloudinary } = require("../config/cloudinaryConfig");

// _____________Create Post______________

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content && !req.file) {
      return res.send({ message: "Content or Image is required" });
    }

    let imageUrl = "";

    if (req.file) {
      const uploadImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_images",
      });
      imageUrl = uploadImage.secure_url;
    }

    const newPost = new Post({
      content,
      userId: req.user.id,
      imageUrl: imageUrl,
    });

    await newPost.save();

    res.send({ message: "Post Created Successfully", newPost });
  } catch (error) {
    res.send({ message: error.message });
  }
};

// _____________all post from 1 user______________

const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userPosts = await Post.find({ userId }).populate(
      "userId",
      "firstName lastName profileImage"
    );

    if (Post.length === 0) {
      return res.send({ message: "No Posts Found" });
    }

    return res.send({ userPosts });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};




// _____________Like Post______________

const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.send({ message: "Post not found" });
    }
    if (post.likes.includes(req.user.id)) {
      return res.send({ message: "Post already liked" });
    }

    post.likes.push(req.user.id);
    await post.save();
    res.send({ message: "Post liked successfully" });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};



// _____________Unlike Post______________

const unLikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.send({ message: "Post not found" });
    }

    if (!post.likes.includes(req.user.id)) {
      return res.send({ message: "Post not liked" });
    }

    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user.id
    );

    await post.save();

    res.send({ message: "Post unLiked successfully" });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
};



// _____________Get single post by ID______________

const getSinglePost = async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId).populate(
        "userId",
        "firstName lastName profileImage"
      );
  
      if (!post) {
        return res.send({ message: "Post not found" });
      }
  
      res.send({ post });
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  };


  




// _____________Update post with PATCH______________

const updatePost = async (req, res) => {
    try {
      const postId = req.params.postId;
      const { content } = req.body;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.send({ message: "Post not found" });
      }
  
      if (post.userId.toString() !== req.user.id) {
        return res.send({ message: "You are not authorized to update this post" });
      }
  
      let imageUrl = post.imageUrl;
  
      if (req.file) {
        const uploadImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "user_images",
        });
        imageUrl = uploadImage.secure_url;
      }
  
      post.content = content || post.content;
      post.imageUrl = imageUrl;
  
      await post.save();
  
      res.send({ message: "Post updated successfully", post });
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  };



// _____________Delete Post______________

const deletePost = async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.send({ message: "Post not found" });
      }
  
      if (post.userId !== req.user.id) {
        return res.send({ message: "not authorized to delete this post" });
      }
  
      // Delete all comments associated with this post
      await Comment.deleteMany({ postId });
  
      // Delete the post itself
      await post.deleteOne();
  
      res.send({ message: "Post and it's comments/likes deleted successfully" });
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  };
  



module.exports = { createPost, getUserPosts, likePost, unLikePost, getSinglePost, updatePost, deletePost };

