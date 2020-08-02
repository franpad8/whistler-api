const { makeWhistle } = require('./whistle')
const makeHttpError = require('../utils/http-error')
const isValidId = require('../utils/is-valid-id')
const { InvalidPropertyError } = require('../utils/errors')

const makeWhistlesEndpointHandler = whistleList => {

    return async function handle(httpRequest) {
        switch(httpRequest.method) {

            case 'POST':
                return postWhistle(httpRequest)
                
            case 'GET':
                if (httpRequest.path.includes('search')) {
                    return getWhistlesByText(httpRequest)
                }
                return getWhistles(httpRequest)

            case 'DELETE':
                return deleteWhistle(httpRequest)

            default:
                return makeHttpError({
                    statusCode: 405,
                    errorMessage: `${httpRequest.method} method not allowed`
                })
        }
    }

    async function deleteWhistle(httpRequest) {
        try{
            let whistleId = httpRequest.pathParams.whistleId
            // VERIFY IF IT IS A VALID ID ?
            const whistle = await whistleList.findById(whistleId)

            if (!whistle) {
                return makeHttpError({
                    statusCode: 404,
                    errorMessage: `Whistle not found.`
                })
            }
            const currentLoggedInUserId = httpRequest.currentUser._id

            if (whistle.creatorId.toString() !== currentLoggedInUserId.toString()) {
                return makeHttpError({
                    statusCode: 403,
                    errorMessage: 'Unauthorized. Whistles can only be deleted by its creator.'
                })
            }

            const result = await whistleList.remove({ whistleId })

            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 200,
                data: JSON.stringify(result)
            }

        } catch(error) {
            return makeHttpError({
                errorMessage: error.message,
                statusCode: error.statusCode || 500
            })
        }


    }

    async function getWhistles(httpRequest) {
        const user = httpRequest.currentUser
        const { limit, afterId, untilId } = httpRequest.queryParams

        try {
            if (afterId && !isValidId(afterId)) {
                throw new InvalidPropertyError('Query param \'afterId\' is not a valid id')
            }

            if (untilId && !isValidId(untilId)) {
                throw new InvalidPropertyError('Query param \'untilId\' is not a valid id')
            }
            
            const result = await whistleList.getTimeline({ user, limit, afterId, untilId })
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 200,
                data: JSON.stringify(result)
            }
        } catch (error) {
            return makeHttpError({
                errorMessage: error.message,
                statusCode: error.statusCode || 500
            })
        }

    }

    async function getWhistlesByText(httpRequest) {
        const { text: searchText } = httpRequest.queryParams

        try {
            const result = await whistleList.findByText(searchText)
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 200,
                data: JSON.stringify(result)
            }
        } catch (error) {
            return makeHttpError({
                errorMessage: error.message,
                statusCode: error.statusCode || 500
            })
        }

    }

    async function postWhistle(httpRequest) {
        let whistleInfo = httpRequest.body
        if (!whistleInfo) {
            return makeHttpError({
                statusCode: 400,
                errorMessage: 'Bad Request. POST Request body must be a valid JSON.' 
            })
        }

        if (typeof httpRequest.body === 'string') {
            try {
              whistleInfo = JSON.parse(contactInfo)
            } catch {
              return makeHttpError({
                statusCode: 400,
                errorMessage: 'Bad request. POST body must be valid JSON.'
              })
            }
        }
        
        try {
            const creatorId = httpRequest.currentUser._id // TODO: decouple this by saving user in request with makeUser in authenticate middleware 
            whistleInfo = {...whistleInfo, creatorId}
            const whistle = makeWhistle(whistleInfo)
            const result = await whistleList.add(whistle)
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 201,
                data: JSON.stringify(result)
            }
        } catch (error) {
            return makeHttpError({
                errorMessage: error.message,
                statusCode: error.statusCode || 500
            })
        }


    }

}

module.exports = makeWhistlesEndpointHandler;