import express from "express";
import { upload } from "../middlewares/multer.middleware";
import { publishVideo } from "../controllers/video.controller";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const videoRouter = express();

videoRouter.post(
  "/publishVideo",
  verifyJWT,
  upload.fields([
    {
      name: videoFile,
      maxCount: 1,
    },
    {
      name: thumbnail,
      maxCount: 1,
    },
  ]),
  publishVideo
);
