const { registerUser, loginUserUseCase, deleteUserUseCase, followUserUseCase } = require('../use-cases')

const makePostUser = require('../controllers/post-user')
const makeLoginUserController = require('../controllers/login-user')
const makeDeleteUserController = require('../controllers/delete-user')
const makeFollowUserController = require('../controllers/follow-user')


const controllers = {
    postUser: makePostUser(registerUser),
    loginUserController: makeLoginUserController(loginUserUseCase),
    deleteUserController: makeDeleteUserController(deleteUserUseCase),
    followUserController: makeFollowUserController(followUserUseCase)
}

module.exports = controllers
