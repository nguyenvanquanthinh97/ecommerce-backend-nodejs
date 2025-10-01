"use strict";

const { NotFoundError } = require("../core/error.response");
const CommentModel = require("../models/comment.model");
const ProductService = require("./product.service");

/*
  key features: Comment service
  + add comment [User, Shop]
  + get a list of comments [User, Shop]
  + delete a comment [User | Shop | Admin]
*/
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new CommentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      // reply comment
      const parentComment = await CommentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");

      rightValue = parentComment.comment_right;
      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_right: { $gte: rightValue },
        },
        { $inc: { comment_right: 2 } }
      );

      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_left: { $gt: rightValue },
        },
        { $inc: { comment_left: 2 } }
      );
    } else {
      const maxRightValue = await CommentModel.findOne({
        comment_productId: productId,
      })
        .select("comment_right")
        .sort({ comment_right: -1 });

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // insert comment to left
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parent = await CommentModel.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Parent comment not found");

      const comments = await CommentModel.find({
        comment_productId: productId,
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lt: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 })
        .skip(offset)
        .limit(limit);

      return comments;
    }

    const comments = await CommentModel.find({
      comment_productId: productId,
      comment_parentId: null,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 })
      .skip(offset)
      .limit(limit);

    return comments;
  }

  static async deleteComment({ commentId, productId }) {
    // check the product exists in database
    const foundProduct = await ProductService.findProduct({
      product_id: productId
    })

    if (!foundProduct) throw new NotFoundError("Product not found");
    // 1. Find the left and right values of the comment to be deleted
    const comment = await CommentModel.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    // 2. calculate the width of the subtree
    const width = rightValue - leftValue + 1;
    // 3. Delete the comment and its descendants
    await CommentModel.deleteMany({
      comment_productId: productId,
      comment_left: { $gte: leftValue, $lte: rightValue },
    });
    // 4. update left and right values of remaining comments
    await CommentModel.updateMany(
      { comment_productId: productId, comment_right: { $gt: rightValue } },
      { $inc: { comment_right: -width } }
    );

    await CommentModel.updateMany(
      { comment_productId: productId, comment_left: { $gt: rightValue } },
      { $inc: { comment_left: -width } }
    );

    return true
  }
}

module.exports = CommentService;
