import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  if (content.trim() == "") {
    throw new ApiError(400, "Content field is required");
  }

  const tweet = Tweet.create({
    content: content,
    owner: userId,
  });

  if (!tweet) {
    throw new ApiError(404, "Error occurred while creating the tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userTweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        tweetDetails: {
          $first: "$ownerDetails",
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (!userTweets.length) {
    throw new ApiError(404, "Tweet not found or does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() == "") {
    throw new ApiError(400, "Content field cannot be empty");
  }

  if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const newTweet = await Tweet.findOneAndUpdate(
    {
      _id: tweetId,
      owner: userId,
    },
    {
      $set: { content: content.trim() },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!newTweet) {
    throw new ApiError(
      403,
      "Your are not allowed to update this or there was an error in updating"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newTweet, "Tweet updated successfully"));
});

export { createTweet, getUserTweets, updateTweet };
