"use strict";

const express = require("express");
const CommentController = require("../../controllers/comment.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post('', authentication, asyncHandler(CommentController.createComment));
router.get('', authentication, asyncHandler(CommentController.getCommentsByParentId));
router.delete('', authentication, asyncHandler(CommentController.deleteComment));

module.exports = router;
