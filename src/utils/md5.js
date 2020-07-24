const { hash, compare } = require('bcrypt')

module.exports.encrypt = async (pass) => hash(pass, 12)
module.exports.compare = async (pass, hash) => compare(pass, hash)
