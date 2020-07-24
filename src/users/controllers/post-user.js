const makeHttpError = require('../../utils/http-error')


const makePostUser = registerUser => {
    return async function postUser(httpRequest) {
        try{

            if (!httpRequest.body) {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: 'Bad Request. POST Request body must be a valid JSON.'
                })
            }
            const userInfo = {
                id: httpRequest.body.id,
                email: httpRequest.body.email,
                password: httpRequest.body.password
            }
            const result = await registerUser(userInfo)

            return {
                headers: {
                    "Content-Type": "application/json"
                },
                statusCode: 201,
                data: result
            }

        } catch (error) {

            return makeHttpError({
                errorMessage: error.message,
                statusCode: error.statusCode || 500
            })
            

        }

    }
}

module.exports = makePostUser