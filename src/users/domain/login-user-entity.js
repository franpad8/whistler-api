const requiredParam = require("../../utils/required-param");
const isValidEmail = require('../../utils/is-valid-email')
const { InvalidPropertyError } = require('../../utils/errors');

module.exports.makeLoginUserEntity = (
    credentials=requiredParam('credentials')
) => {

    validatedCredentials = validate(credentials)
    cleanedCredentials = clean(validatedCredentials)

    return Object.freeze({
        getEmail: () => cleanedCredentials.email,
        getPassword: () => cleanedCredentials.password,
    })

    function validate(
        {
            email = requiredParam('email'),
            password = requiredParam('password')
        }
    ) {
        
        validateEmail(email)

        return {
            email,
            password
        }
    }

    function validateEmail(email) {
        if (!isValidEmail(email)) {
            throw new InvalidPropertyError('User must have a valid email')
        }
        return true
    }

    function clean({ email, ...otherInfo }) {
        const cleanedEmail = email.trim()

        return { email: cleanedEmail, ...otherInfo }
    }


}