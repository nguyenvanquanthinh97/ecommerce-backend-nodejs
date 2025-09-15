'use strict'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}
const { findByKey } = require('../services/apiKey.service');

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  // check objKey
  const objKey = await findByKey(key);
  if (!objKey) {
    return res.status(404).json({ message: 'Forbidden' });
  }
  req.objKey = objKey;
  return next()
}

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    console.log('permissions::', req.objKey.permissions)
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    return next()
  }
}

const asyncHandler = fn => (req, res, next) => {
  return fn(req, res, next).catch(next);
}

module.exports = {
  apiKey,
  permission,
  asyncHandler
}
