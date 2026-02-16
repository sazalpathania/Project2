import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: { createdAt: -1 },
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
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $facet: {
        content: [
          { $skip: (Number(page) - 1) * Number(limit) }, //facet as we had to do two db calls without it
          { $limit: Number(limit) },
        ],
        totalCount: [{ $count: "count" }], //to count all the documants that reached this page
      },
    },
  ]);

  if (!comments.length) {
    throw new ApiError(400, "Comments not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      comments: comments[0].content,
      totalCount: comments[0].totalCount[0]?.count,
    })
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content field is required");
  }

  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: userId,
  });

  await comment.populate("owner", "username avatar");

  if (!comment) {
    throw new ApiError(500, "There was an error in adding the comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;
  const { newContent } = req.body;

  if (!newContent) {
    throw new ApiError(400, "This field is necessary to update a comment");
  }

  const existingComment = await Comment.findOne({
    _id: commentId,
    owner: userId,
  });

  if (!existingComment) {
    throw new ApiError(403, "Comment by the user on this video does not exist");
  }

  const newComment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { content: newContent } },
    { new: true }
  );

  await newComment.populate("owner", "username avatar");

  if (!newComment) {
    throw new ApiError(500, "There was an error in updating the comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const deletedComment = await Comment.findOneAndDelete(
    {
      _id: commentId,
      owner: userId,
    },
    { new: true }
  );

  if (!deletedComment) {
    throw new ApiError(
      404,
      "Comment not found or you are not allowed to delete this comment"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
