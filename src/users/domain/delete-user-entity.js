const requiredParam = require("../../utils/required-param");
const isValidId = require('../../utils/is-valid-id')
const { InvalidPropertyError } = require('../../utils/errors');

module.exports.makeDeleteUserEntity = (
    data=requiredParam('user id')
) => {

    const validatedData = validate(data)

    return Object.freeze({
        getId: () => validatedData.id
    })

    function validate(
        {
            id = requiredParam('id'),
        }
    ) {
        
        validateId(id)

        return {
            id
        }
    }

    function validateId(id) {
        if (!isValidId(id)) {
            throw new InvalidPropertyError('Invalid id')
        }
        return true
    }

}