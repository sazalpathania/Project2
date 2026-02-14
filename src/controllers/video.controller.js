import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/uploadCloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType,
    userId,
  } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId.toString())) {
    throw new ApiError(400, "Invalid userId");
  }

  const aggregate = Video.aggregate([
    {
      $match: {
        isPublished: true,
      },
    },
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
  ]);

  const fetchVideos = await Video.aggregatePaginate(aggregate, {
    limit: Math.min(Number(limit), 50),
    page: Number(page),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, fetchVideos, "Videos fetched successfully"));
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Both title and description are required");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(404, "Video path does not exist");
  }

  if (
    req.file &&
    Array.isArray(req.files.thumbnail) &&
    req.file.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    owner: req.user?._id,
    duration: videoFile.duration,
  });

  await video.save();

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "VideoId is not available");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(401, "Invalid video Id");
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "liked",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        likesCount: {
          $size: "$liked",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [new mongoose.Type.ObjectId(req.user._id), "$liked.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        liked: 0,
      },
    },
  ]);

  if (!video.length) {
    throw new ApiError(400, "There is no such video in the database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId) {
    throw new ApiError(404, "Video id not found");
  }

  if ([title, description].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "Both title and description are required");
  }

  const videoDetails = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { title: title, description: description },
    },
    { new: true }
  ).select("title description ");

  if (!videoDetails) {
    throw new ApiError(
      400,
      "There was an error while updating the video details"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoDetails, "Details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId || !userId) {
    throw new ApiError(404, "Video or user id not found");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(401, "Invalid video id");
  }

  const video = await Video.findOne({
    _id: videoId,
    owner: userId,
  });

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await video.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(404, "Video not found");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findOne({
    //authentication for checking that only the owner of video can make changes in that particular video
    _id: videoId,
    owner: req.user?._id,
  });

  if (!video) {
    throw new ApiError(400, "Video with this id not found in the database"); //bad request
  }

  video.isPublished = !video.isPublished;

  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Video publish status toggled successfully", {})
    );
});

export {
  publishVideo,
  getVideoById,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
  getAllVideos,
};
