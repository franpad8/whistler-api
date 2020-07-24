process.env.JWT_KEY = 'testkey'

const dbHandler = require('../../db-handler')
const { registerUser } = require('../../../users/use-cases')
const makePostUser = require('../../../users/controllers/post-user')

const makeHttpError = require('../../../utils/http-error')

describe('postUser controller', function(){
    let postUser
    /**
     * Connect to a new in-memory database before running any tests.
     */
    beforeAll(async () => {
        await dbHandler.connect()
        postUser = makePostUser(registerUser)
    
    });

    /**
     * Clear all test data after every test.
     */
    afterEach(async () => await dbHandler.clearDatabase());

    /**
     * Remove and close the db and server.
     */
    afterAll(async () => await dbHandler.closeDatabase());

    it('SHOULD return object with header, status code 201 and data with the token, ', async function() {

        const httpRequest = {
            body: {
                email: "test@email.com",
                password: "letmein"
            }
        }
        
        const httpResponse = await postUser(httpRequest)

        expect(httpResponse.headers).toBeDefined
        expect(httpResponse.statusCode).toEqual(201)
        expect(httpResponse.data).toBeDefined
        expect(httpResponse.data.token).toBeDefined

    })

    it('SHOULD handle errors and issue response depending of the type of the error', async function() {
        let httpRequest = {
            body: {
                email: "invalidemail",
                password: "letmein"
            }
        }

        let expected = makeHttpError({
            statusCode: 422,
            errorMessage: "User must have a valid email"
        })

        let httpResponse = await postUser(httpRequest)

        expect(httpResponse).toEqual(expected)


        httpRequest = {
            body: {
                email: undefined,
                password: "letmein"
            }
        }

        expected = makeHttpError({
            statusCode: 400,
            errorMessage: "email cannot be null nor undefined"
        })

        httpResponse = await postUser(httpRequest)

        expect(httpResponse).toEqual(expected)


        httpRequest = {
        }
        expected = makeHttpError(
            {
                statusCode: 400,
                errorMessage: 'Bad Request. POST Request body must be a valid JSON.'
            }
        )

        result = await postUser(httpRequest)
 
        expect(result).toEqual(expected)

    })

});