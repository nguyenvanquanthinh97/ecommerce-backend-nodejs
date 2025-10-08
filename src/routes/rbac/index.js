'use strict';
const express = require('express');

const rbacController = require('../../controllers/rbac.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

router.post('/role', authentication, asyncHandler(rbacController.newRole));
router.get('/roles', authentication, asyncHandler(rbacController.listRole));

router.post('/resource', authentication, asyncHandler(rbacController.newResource));
router.get('/resources', authentication, asyncHandler(rbacController.listResource));

module.exports = router;