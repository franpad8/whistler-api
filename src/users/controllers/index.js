const { 
    registerUser,
    loginUserUseCase,
    deleteUserUseCase,
    followUserUseCase,
    unfollowUserUseCase } = require('../use-cases')

const makePostUser = require('../controllers/post-user')
const makeLoginUserController = require('../controllers/login-user')
const makeDeleteUserController = require('../controllers/delete-user')
const makeFollowUserController = require('../controllers/follow-user')
const makeUnfollowUserController = require('../controllers/unfollow-user')

const controllers = Object.freeze({
    postUser: makePostUser(registerUser),
    loginUserController: makeLoginUserController(loginUserUseCase),
    deleteUserController: makeDeleteUserController(deleteUserUseCase),
    followUserController: makeFollowUserController(followUserUseCase),
    unfollowUserController: makeUnfollowUserController(unfollowUserUseCase)
})

module.exports = controllers
