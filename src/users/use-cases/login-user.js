const { makeLoginUserEntity } = require('../domain/login-user-entity')
const { AuthenticationError } = require('../../utils/errors')

const makeLoginUserUseCase = ( userDb, jwt, md5 ) => {

    return async function loginUser (credentials) {
        
        const loginCredentials = makeLoginUserEntity(credentials)

        const userFound = await userDb.findByEmail(loginCredentials.getEmail())

        if(!userFound) {
          throw new AuthenticationError('wrong email or password')
        }

        const areEqual = await md5.compare(loginCredentials.getPassword(), userFound.hash)

        if (!areEqual) {
          throw new AuthenticationError('wrong email or password')
        }

        const token = await jwt.generateToken({ isAuthenticated: true, userId: userFound.id })

        return { token }
    }
}

module.exports = makeLoginUserUseCase