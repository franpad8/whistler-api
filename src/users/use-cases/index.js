const userDB = require('../data-access')
const jwt = require('../../jwt');
const md5 = require('../../utils/md5')

const makeRegisterUser = require('./register-user')
const makeLoginUserUseCase = require('./login-user')
const makeDeleteUserUseCase = require('./delete-user')
const makeFollowUserUseCase = require('./follow-user')
const makeUnfollowUserUseCase = require('./unfollow-user')

const registerUser = makeRegisterUser(userDB, jwt, md5)
const loginUserUseCase = makeLoginUserUseCase(userDB, jwt, md5)
const deleteUserUseCase = makeDeleteUserUseCase(userDB)
const followUserUseCase = makeFollowUserUseCase(userDB)
const unfollowUserUseCase = makeUnfollowUserUseCase(userDB)

module.exports = Object.freeze(
    {
        registerUser,
        loginUserUseCase,
        deleteUserUseCase,
        followUserUseCase,
        unfollowUserUseCase
    }
)
