const makeHttpError = require('../../utils/http-error')

const makeLoginUserController = loginUserUseCase => {
    return async function loginUser(httpRequest) {
        try{

            if (!httpRequest.body) {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: 'Bad Request. POST Request body must be a valid JSON.'
                })
            }
            const userCredentials = {
                email: httpRequest.body.email,
                password: httpRequest.body.password
            }
            const result = await loginUserUseCase(userCredentials)

            return {
                headers: {
                    "Content-Type": "application/json"
                },
                statusCode: 200,
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

module.exports = makeLoginUserController