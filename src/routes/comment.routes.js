import express from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const commentRouter = express();

commentRouter.get("/getComment", verifyJWT, getVideoComments);
commentRouter.post("/addComment", verifyJWT, addComment);
commentRouter.patch("/:commentId", verifyJWT, updateComment);
commentRouter.delete("/:commentId", verifyJWT, deleteComment);

export default commentRouter;
