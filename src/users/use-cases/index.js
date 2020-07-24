const userDB = require('../data-access')
const jwt = require('../../jwt');
const makeRegisterUser = require('./register-user')
const makeLoginUserUseCase = require('./login-user')
const makeDeleteUserUseCase = require('./delete-user')
const md5 = require('../../utils/md5')

const registerUser = makeRegisterUser(userDB, jwt, md5)
const loginUserUseCase = makeLoginUserUseCase(userDB, jwt, md5)
const deleteUserUseCase = makeDeleteUserUseCase(userDB, jwt, md5)

module.exports = Object.freeze(
    {
        registerUser,
        loginUserUseCase,
        deleteUserUseCase
    }
)
