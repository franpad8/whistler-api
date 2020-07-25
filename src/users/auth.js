const jwt = require('jsonwebtoken');
const User = require('../db/models/user');
const { ObjectId } = require('mongodb');

module.exports.authenticate = async (req, res, next) => {
    const header = req.header('Authorization');
    let error;
    if (header) {
        const [_, token] = header.split(' ');
        if (token) {
             const decoded = jwt.verify(token, process.env.JWT_KEY);
             const loggedInUserId = ObjectId(decoded.userId);
             const user = await User.findById(loggedInUserId);
             if (user) {
                req.isAuthenticated = true;
                req.user = user;
                req.user.id = user._id
                return next();
             }
             error = new Error('authenticated user not found');
             
        } else {
            error = new Error('bad format for authorization header')
        }
    } else {

        error = new Error('missing Authorization header');
    }
    
    error.code = 401;
    req.isAuthenticated = false;
    req.authError = error;
    next();
}