const requiredParam = require("../../utils/required-param");
const isValidEmail = require('../../utils/is-valid-email')
const isValidId = require('../../utils/is-valid-id')
const { InvalidPropertyError } = require('../../utils/errors');
const makeId = require("../../utils/make-id");

module.exports.makeUser = (
    userInfo=requiredParam('userInfo')
) => {

    validatedUser = validate(userInfo)
    cleanedUser = clean(validatedUser)

    return Object.freeze({
        getId: () => cleanedUser.id,
        getEmail: () => cleanedUser.email,
        getUsername: () => cleanedUser.username,
        isAdmin: () => cleanedUser.isAdmin,
        getHash: () => cleanedUser.hash,
        getFollowing: () => cleanedUser.following,
        getFollowers: () => cleanedUser.followers
    })


    function validate({
        id = makeId(),
        email = requiredParam('email'),
        username,
        isAdmin = false,
        hash = requiredParam('hash'),
        following = [],
        followers = []
    }) {
        
        validateId(id)
        validateEmail(email)

        return {
            id,
            email,
            username,
            isAdmin,
            hash,
            following,
            followers
        }
    }

    function validateId(id) {
        if (!isValidId(id)) {
            throw new InvalidPropertyError('User must have a valid id')
        }
        return true
    }

    function validateEmail(email) {
        if (!isValidEmail(email)) {
            throw new InvalidPropertyError('User must have a valid email')
        }
        return true
    }

    function clean({ email, username, ...otherInfo }) {
        const cleanedEmail = email.trim()
        const cleanedUsername = username || cleanedEmail.split('@')[0]

        return { email: cleanedEmail, username: cleanedUsername, ...otherInfo }
    }


}