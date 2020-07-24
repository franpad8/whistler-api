const { registerUser, loginUserUseCase, deleteUserUseCase } = require('../use-cases')

const makePostUser = require('../controllers/post-user')
const makeLoginUserController = require('../controllers/login-user')
const makeDeleteUserController = require('../controllers/delete-user')


const controllers = {
    postUser: makePostUser(registerUser),
    loginUserController: makeLoginUserController(loginUserUseCase),
    deleteUserController: makeDeleteUserController(deleteUserUseCase)
}

module.exports = controllers
