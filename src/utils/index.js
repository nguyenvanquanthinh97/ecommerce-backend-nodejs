'use strict'
const _ = require('lodash')
const {Types} = require('mongoose')

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(field => [field, 1]))
}

const getUnselectData = (select = []) => {
  return Object.fromEntries(select.map(field => [field, 0]))
}

const removeUndefinedShallowObject = (obj = {}) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != undefined));
}

const removeUndefinedDeepObject = obj => {
  const final = {}

  const cleanedObj = removeUndefinedShallowObject(obj)
  Object.keys(cleanedObj).forEach(key => {
    const isMongoObjecId = Types.ObjectId.isValid(cleanedObj[key])
    const isJSObject = typeof cleanedObj[key] === 'object' && !Array.isArray(cleanedObj[key]) && !isMongoObjecId
    if (isJSObject) {
      const nested = removeUndefinedDeepObject(cleanedObj[key])
      Object.keys(nested).forEach(nestedKey => {
        final[`${key}.${nestedKey}`] = nested[nestedKey]
      })
    } else {
      final[key] = cleanedObj[key]
    }
  })

  return final
}

module.exports = {
  getInfoData,
  getSelectData,
  getUnselectData,
  removeUndefinedShallowObject,
  removeUndefinedDeepObject,
  convertToObjectIdMongodb
}
