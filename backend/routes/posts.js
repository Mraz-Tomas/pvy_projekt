import express from "express";
import {
  getPosts,
  createPost,
  likePost,
  getComments,
  addComment,
    deletePost,
    updatePost
} from "../controllers/postController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getPosts);
router.post("/", auth, createPost);
router.post("/like", auth, likePost);
router.get("/comments/:postId", auth, getComments);
router.post("/comments", auth, addComment);
router.delete("/:id", auth, deletePost);
router.put("/:id", auth, updatePost);

export default router;