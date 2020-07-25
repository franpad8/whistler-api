const makeHttpError = require('../../utils/http-error')

module.exports = function makeFollowUserController(deleteUserUseCase) {

    return async function followUserController(httpRequest) {
        try{
            if (!httpRequest.pathParams) {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: 'Bad Request. Path params cannot be undefined'
                })
            }
            const input = {
                id: httpRequest.currentUser.id,
                userToFollowId: httpRequest.pathParams.id
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
