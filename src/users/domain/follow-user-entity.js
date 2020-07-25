const makeId = require("../../utils/make-id");
const requiredParam = require("../../utils/required-param");
const isValidId = require('../../utils/is-valid-id')
const { InvalidPropertyError } = require('../../utils/errors');

module.exports.makeFollowUserEntity = (
    data=requiredParam('user id')
) => {

    const validatedData = validate(data)
    const cleanedData = clean(validatedData)

    return Object.freeze({
        getId: () => cleanedData.id,
        getUserToFollowId: () => cleanedData.userToFollowId
    })

    function validate(
        {
            id = requiredParam('id'),
            userToFollowId = requiredParam('id')
        }
    ) {
        
        validateId(id)
        validateId(userToFollowId)

        return {
            id,
            userToFollowId
        }
    }

    function clean({
        id,
        userToFollowId
    }) {
        const cleanedId = typeof id === 'string' ? makeId(id) : id
        const cleanedUserToFollowId = typeof  userToFollowId === 'string' 
                                        ? makeId(userToFollowId) 
                                        : userToFollowId

        return {
            id: cleanedId,
            userToFollowId: cleanedUserToFollowId
        }
    }

    function validateId(id) {
        if (!isValidId(id)) {
            throw new InvalidPropertyError('Invalid id')
        }
        return true
    }

}