const makeHttpError = require('../../utils/http-error')

module.exports = function makeUnfollowUserController(unfollowUserUseCase) {

    return async function unfollowUserController(httpRequest) {
        try{
            if (!httpRequest.pathParams) {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: 'Bad Request. Path params cannot be undefined'
                })
            }
            const input = {
                id: httpRequest.currentUser.id,
                userToUnfollowId: httpRequest.pathParams.id
            }
            const result = await unfollowUserUseCase(input)

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
