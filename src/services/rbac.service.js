"use strict";
const ResourceModel = require("../models/resource.model");
const RoleModel = require("../models/role.model");

/**
 * new resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */
const createResource = async ({
  name = "profile",
  slug = "p0001",
  description = "",
}) => {
  try {
    // 1. Check name or slug exist

    // 2. new resource
    const resource = await ResourceModel.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return resource;
  } catch (error) {}
};

const listResource = async ({
  userId = 0, //admin
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    // 1. check admin ? middleware function

    // 2. get list of resource
    const resources = await ResourceModel.aggregate([
      {
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createdAt: 1,
        },
      },
    ]);

    return resources;
  } catch (error) {
    return [];
  }
};

const createRole = async ({
  name = "shop",
  slug = "s0001",
  description = "extend from shop or user",
  grants = [],
}) => {
  try {
    // 1. check role exists

    // 2. new role
    const role = await RoleModel.create({
      role_name: name,
      role_slug: slug,
      role_description: description,
      role_grants: grants,
    });

    return role;
  } catch (error) {
    return error;
  }
};

const listRole = async ({
  userId = 0, //admin
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    // 1. userId

    // 2. List roles
    const roles = await RoleModel.aggregate([
      {
        $unwind: '$role_grants'
      },
      {
        $lookup: {
          from: "Resources",
          localField: "role_grants.resource",
          foreignField: "_id",
          as: 'resource'
        }
      },
      {
        $unwind: '$resource'
      },
      {
        $project: {
          role: '$role_name',
          resource: '$resource.src_name',
          actions: '$role_grants.actions',
          attributes: '$role_grants.attributes',
        }
      },
      {
        $unwind: '$actions'
      },
      {
        $project: {
          role: 1,
          resource: 1,
          action: '$actions',
          attributes: 1,
          _id: 0
        }
      }
    ])
    return roles;
  } catch (error) {

  }
};

module.exports = {
  createResource,
  listResource,
  createRole,
  listRole,
};
