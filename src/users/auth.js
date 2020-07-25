const jwt = require('jsonwebtoken');
const User = require('../db/models/user');
const { ObjectId } = require('mongodb');
const { AuthenticationError, AuthorizationError } = require('../utils/errors')

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
             error = new AuthenticationError('authenticated user not found');
             
        } else {
            error = new AuthenticationError('bad format for authorization header')
        }
    } else {

        error = new AuthenticationError('missing Authorization header');
    }
    
    req.isAuthenticated = false;
    req.authError = error;
    return next();
}

module.exports.requireAuthentication = (req, res, next) => {
    if (req.isAuthenticated) {
        return next()
    }
    return next(new AuthenticationError('User must be Logged in'))
}

module.exports.requireToBeAdmin = (req, res, next) => {
    if (req.isAuthenticated && req.user.isAdmin) {
        return next()
    }
    return next(new AuthorizationError('User must be Admin'))
}
