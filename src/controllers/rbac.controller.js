'use strict';

const roleService = require("../services/rbac.service");
const { SuccessResponse } = require("../core/success.response");

class RBACController {
  /**
   * @desc Create a new role
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  newRole = async(req, res, next) => {
    new SuccessResponse({
      message: "Create new role successfully",
      metadata: await roleService.createRole(req.body)
    }).send(res)
  }

  newResource = async(req, res, next) => {
    new SuccessResponse({
      message: "Create new resource successfully",
      metadata: await roleService.createResource(req.body)
    }).send(res)
  }

  listRole = async(req, res, next) => {
    new SuccessResponse({
      message: "Get list role successfully",
      metadata: await roleService.listRole(req.query)
    }).send(res)
  }

  listResource = async(req, res, next) => {
    new SuccessResponse({
      message: "Get list resource successfully",
      metadata: await roleService.listResource(req.query)
    }).send(res)
  }
}

module.exports = new RBACController();
