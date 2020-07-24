const makeHttpError = require('../../utils/http-error')

module.exports = function makeDeleteUserController(deleteUserUseCase) {

    return async function deleteUserController(httpRequest) {
        try{
            if (!httpRequest.pathParams) {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: 'Bad Request. Path params cannot be undefined'
                })
            }
            const input = {
                id: httpRequest.pathParams.id
            }
            const result = await deleteUserUseCase(input)

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
