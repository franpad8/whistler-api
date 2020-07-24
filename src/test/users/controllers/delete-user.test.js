process.env.JWT_KEY = 'testkey'

const dbHandler = require('../../db-handler')
const controllers = require('../../../users/controllers')

const makeHttpError = require('../../../utils/http-error')
const makeId = require('../../../utils/make-id')

describe('delete User controller', function(){
    /**
     * Connect to a new in-memory database before running any tests.
     */
    beforeAll(async () => {
        await dbHandler.connect()
    
    });

    /**
     * Clear all test data after every test.
     */
    afterEach(async () => await dbHandler.clearDatabase());

    /**
     * Remove and close the db and server.
     */
    afterAll(async () => await dbHandler.closeDatabase());

    it('SHOULD return object with header, status code 200 and data', async function() {

        const userId = makeId()
        const httpRequestForRegisterUser = {
            body: {
                id: userId,
                email: "test@email.com",
                password: "letmein"
            }
        }
        
        await controllers.postUser(httpRequestForRegisterUser)

        const httpRequestForDeleteUser = {
            pathParams: {
                id: userId
            }
        }


        const httpResponse = await controllers.deleteUserController(httpRequestForDeleteUser)

        expect(httpResponse.headers).toBeDefined()
        expect(httpResponse.statusCode).toEqual(200)
        expect(httpResponse.data).toEqual({
            ok: true,
            deletedCount: 1
        })
    })

    it('SHOULD respond with a 400 response, IF request path param is not valid', async function() {
        httpRequest = {
        }
        expected = makeHttpError(
            {
                statusCode: 400,
                errorMessage: 'Bad Request. Path params cannot be undefined'
            }
        )
 
        const httpResponse = await controllers.deleteUserController(httpRequest)

        expect(httpResponse).toEqual(expected)

    })

})
