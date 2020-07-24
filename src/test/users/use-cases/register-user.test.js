process.env.JWT_KEY = 'testkey'

const dbHandler = require('../../db-handler')
const userDb = require('../../../users/data-access')
const jwt = require('../../../jwt');
const makeRegisterUser = require('../../../users/use-cases/register-user')
const makeId = require('../../../utils/make-id')
const md5 = require('../../../utils/md5')
const { UniqueConstraintError } = require('../../../utils/errors')



describe(`register user`, function(){
    let registerUser
    let makeFakeUser
    /**
     * Connect to a new in-memory database before running any tests.
     */
    beforeAll(async () => {
        await dbHandler.connect()
        registerUser = makeRegisterUser(userDb, jwt, md5)

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

    it(`Should create new User`, async function(){
        const userInfo = makeFakeUser();
        await registerUser(userInfo)

        const userFound = await userDb.findById(userInfo.id)
        expect(userFound).toBeTruthy()
        expect(userFound.id).toEqual(userInfo.id)
    })

    it(`Should return Authentication Token`, async function(){
        const userInfo = makeFakeUser();
        const result = await registerUser(userInfo)
        expect(result.token).toBeDefined
    })

    it(`Should throw Duplicated error IF try to create a user that already exists`, async function() {
        expect.assertions(2)
        const user = makeFakeUser()
        await registerUser(user)

        const sameUserButWithDifferentId = makeFakeUser({ id: makeId() })
        try {
            await registerUser(sameUserButWithDifferentId)
        } catch (error) {
            expect(error).toBeInstanceOf(UniqueConstraintError)
            expect(error.message).toEqual('email must be unique')

        }
    })
})