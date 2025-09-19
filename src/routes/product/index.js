'use strict';

const express = require('express');
const router = express.Router();

const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// PROTECTED ROUTES - SHOP
router.post('/', authentication, asyncHandler(productController.createProduct));
router.patch('/:id', authentication, asyncHandler(productController.updateProduct));
router.post('/publish/:id', authentication, asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', authentication, asyncHandler(productController.unpublishProductByShop));

// QUERY //
router.get('/drafts', authentication, asyncHandler(productController.getAllDraftsForShop));
router.get('/publish', authentication, asyncHandler(productController.getAllPublishForShop));
// public routes
router.get('/search', asyncHandler(productController.getListSearchProducts));
router.get('/:id', asyncHandler(productController.findProduct));
router.get('/', asyncHandler(productController.findAllProducts))

module.exports = router;
