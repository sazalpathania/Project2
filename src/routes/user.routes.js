import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  userUpdateAvatar,
  userUpdateCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

userRouter.post("/login", loginUser);

//secured routes
userRouter.post("/logout", verifyJWT, logoutUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.post("/change-password", verifyJWT, changeCurrentPassword);
userRouter.post("/get-user", verifyJWT, getCurrentUser);
userRouter.patch("/upadate-account", verifyJWT, updateAccountDetails);

userRouter.patch(
  "/avatar",
  verifyJWT,
  upload.single("avatar"),
  userUpdateAvatar
);

userRouter.patch(
  "/coverImage",
  verifyJWT,
  upload.single("coverImage"),
  userUpdateCoverImage
);

userRouter.get("/c/:username", verifyJWT, getUserChannelProfile);
userRouter.get("/watch-history", verifyJWT, getWatchHistory);

export default userRouter;
