import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getVideoById,
  publishVideo,
  updateVideoDetails,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const videoRouter = express();

videoRouter.post(
  "/publishVideo",
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);

videoRouter.get("/:videoId", verifyJWT, getVideoById);
videoRouter.patch("/:videoId", verifyJWT, updateVideoDetails);

export default videoRouter;
