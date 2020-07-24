const ObjectId = require('mongoose').Types.ObjectId

module.exports = id => { return ObjectId.isValid(id) }