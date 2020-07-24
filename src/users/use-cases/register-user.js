const { makeUser } = require('../domain/user')

const makeRegisterUser = ( userDb, jwt, md5 ) => {

    return async function registerUser (userInfo) {

        userInfo.hash = await md5.encrypt(userInfo.password)

        const user = makeUser(userInfo)
        const createdUser = await userDb.insert(
            {
                id: user.getId(),
                email: user.getEmail(),
                username: user.getUsername(),
                isAdmin: user.isAdmin(),
                hash: user.getHash()
            }
        )

        const token = await jwt.generateToken({ isAuthenticated: true, userId: createdUser.id })

        return { token }

    }
}

module.exports = makeRegisterUser