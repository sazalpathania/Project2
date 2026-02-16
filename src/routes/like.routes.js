import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const likeRouter = express();

likeRouter.post("/toggle/v/:videoId", verifyJWT, toggleVideoLike);
likeRouter.post("/toggle/c/:commentId", verifyJWT, toggleCommentLike);
likeRouter.get("/likedVideos", verifyJWT, getLikedVideos);

export default likeRouter;
