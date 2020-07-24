process.env.JWT_KEY = 'testkey'

const dbHandler = require('../../db-handler')
const controllers = require('../../../users/controllers')

const makeHttpError = require('../../../utils/http-error')

describe('login User controller', function(){
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

    it('SHOULD return object with header, status code 200 and data with the token IF credentials are correct', async function() {

        const httpRequest = {
            body: {
                email: "test@email.com",
                password: "letmein"
            }
        }
        
        await controllers.postUser(httpRequest)

        const httpResponse = await controllers.loginUserController(httpRequest)

        expect(httpResponse.headers).toBeDefined
        expect(httpResponse.statusCode).toEqual(200)
        expect(httpResponse.data).toBeDefined
        expect(httpResponse.data.token).toBeDefined
    })


    it('SHOULD respond with a 401 response, IF credentials are not valid (unexisting email)', async function() {
        let httpRequest = {
            body: {
                email: "unexistingemail@email.com",
                password: "letmein"
            }
        }

        let expected = makeHttpError({
            statusCode: 401,
            errorMessage: "wrong email or password"
        })

        const httpResponse = await controllers.loginUserController(httpRequest)

        expect(httpResponse).toEqual(expected)

    })


    it('SHOULD respond with a 401 response, IF credentials are not valid (wrong password)', async function() {
        let httpRequestForRegister = {
            body: {
                email: "user@email.com",
                password: "letmein"
            }
        }

        await controllers.postUser(httpRequestForRegister)

        httpRequestForLoginWithWrongPassword= {
            body: {
                email: "unexistingemail@email.com",
                password: "dontletmein"
            }
        }

        let expected = makeHttpError({
            statusCode: 401,
            errorMessage: "wrong email or password"
        })

        const httpResponse = await controllers.loginUserController(httpRequestForLoginWithWrongPassword)

        expect(httpResponse).toEqual(expected)

    })


    it('SHOULD respond with a 400 response, IF request body is not valid', async function() {
        httpRequest = {
        }
        expected = makeHttpError(
            {
                statusCode: 400,
                errorMessage: 'Bad Request. POST Request body must be a valid JSON.'
            }
        )
 
        const httpResponse = await controllers.loginUserController(httpRequest)

        expect(httpResponse).toEqual(expected)

    })

})
