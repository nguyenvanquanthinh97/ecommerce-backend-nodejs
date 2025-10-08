'use strict';
const express = require('express');

const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const profileController = require('../../controllers/profile.controller');
const { grantAccess } = require('../../middlewares/rbac');

const router = express.Router();

// admin
router.get('/viewAny', grantAccess('readAny', 'profile'), profileController.profiles)

// shop
router.get('/viewOwn', grantAccess('readOwn', 'profile'), profileController.profile)

module.exports = router;
