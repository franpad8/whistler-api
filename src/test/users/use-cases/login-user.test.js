process.env.JWT_KEY = 'testkey'

const dbHandler = require('../../db-handler')
const makeId = require('../../../utils/make-id')
const { AuthenticationError } = require('../../../utils/errors')

const { registerUser, loginUserUseCase } = require('../../../users/use-cases')


describe(`login user`, function(){
    let makeFakeUser
    /**
     * Connect to a new in-memory database before running any tests.
     */
    beforeAll(async () => {
        await dbHandler.connect()

        makeFakeUser = overrides => {
            const user = {
                id: makeId(),
                email: 'test@user.com',
                username: 'test',
                isAdmin: false,
                password: 'letmein',
                following: [],
                followers: []
            }
            return {...user, ...overrides }
        }

    });

    /**
     * Clear all test data after every test.
     */
    afterEach(async () => await dbHandler.clearDatabase());

    /**
     * Remove and close the db and server.
     */
    afterAll(async () => await dbHandler.closeDatabase());


    it(`Should return Authentication Token IF credentials are correct`, async function() {
        const credentials = {
            email: 'test@user.com',
            password: 'letmein'
        }
        const userInfo = makeFakeUser();
        await registerUser(userInfo)

        const result = await loginUserUseCase(credentials)

        expect(result.token).toBeDefined()

    })

    it(`Should throw Authentication Error IF try to login with incorrect credentials`, async function() {
        expect.assertions(2)
        const wrongCredentials = {
            email: 'test@user.com',
            password: 'dontletmein'
        }
        const userInfo = makeFakeUser();
        await registerUser(userInfo)

        try {
            await loginUserUseCase(wrongCredentials)
        } catch (error) {
            expect(error).toBeInstanceOf(AuthenticationError)
            expect(error.message).toEqual('wrong email or password')
        }
    })
})