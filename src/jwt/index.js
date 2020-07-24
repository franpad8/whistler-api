const jwt = require('jsonwebtoken')

const KEY = process.env.JWT_KEY

module.exports.generateToken = async function(payload) {
    const token = await jwt.sign(payload, KEY)
    return token
}

module.exports.verifyToken = async function(token) {
    return jwt.verify(token, KEY)
}