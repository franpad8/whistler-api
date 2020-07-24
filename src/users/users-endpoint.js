const makeHttpError = require('../utils/http-error')

module.exports = function makeUserEndpointHandler(controllers) {

    return async function handle(httpRequest) {
        switch(httpRequest.method) {
            case 'POST':
                if(httpRequest.path.includes('login')){
                    return controllers.loginUserController(httpRequest)
                }
                return controllers.postUser(httpRequest)

            case 'DELETE':
                return controllers.deleteUserController(httpRequest)

            default:
                return makeHttpError({
                    statusCode: 405,
                    errorMessage: `${httpRequest.method} method not allowed`
                })
        }

    }

}