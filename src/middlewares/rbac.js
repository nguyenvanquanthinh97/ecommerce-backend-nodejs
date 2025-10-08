"use strict";

const { AuthFailureError } = require("../core/error.response");
const rbac = require("./role.middleware");
const roleService = require("../services/rbac.service");
/**
 *
 * @param {string} action // read, delete or update
 * @param {*} resource  // profile, balance,...
 */
const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(await roleService.listRole({}))
      const role_name = req.query.role;
      const permission = rbac.can(role_name)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError("You don't have enough permission...")
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess
}
