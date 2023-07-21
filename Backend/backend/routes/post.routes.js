const express = require("express");
const { setPosts, getPosts, editPost, deletePost, likePost, dislikePost } = require("../controllers/post.controllers");
const authorize = require("../middleware/middleware");
const router = express.Router();

//CRUD
router.get("/", getPosts);
router.post("/", authorize, setPosts);
router.put("/:id", editPost);
router.delete("/:id", deletePost);

//additional
router.patch("/like-post/:id", likePost);
router.patch("/dislike-post/:id", dislikePost);

module.exports = router