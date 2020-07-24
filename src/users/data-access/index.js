const db = require('../../db/models/user')
const makeUserDb = require('./users-db')

module.exports = makeUserDb(db)