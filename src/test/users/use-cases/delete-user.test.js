process.env.JWT_KEY = 'testkey'

const dbHandler = require('../../db-handler')
const makeId = require('../../../utils/make-id')
const { RequiredParameterError, InvalidPropertyError } = require('../../../utils/errors')

const { registerUser, deleteUserUseCase } = require('../../../users/use-cases')


describe(`delete user`, function(){
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


    it(`Should return 1 as deletedCount`, async function() {
        const userId = makeId()
        const userInfo = makeFakeUser({ id: userId })
        await registerUser(userInfo)

        const input = {
            id: userId
        }
        
        const result = await deleteUserUseCase(input)

        expect(result).toEqual({
            deletedCount: 1,
            ok: true
        })

    })

    it(`Should return 0 as deleted count WHEN trying to delete an unexisting user`, async function() {
        const input = {
            id: makeId()
        }
        
        const result = await deleteUserUseCase(input)

        expect(result).toEqual({
            deletedCount: 0,
            ok: true
        })

    })

    it(`Should throw required parameter error IF no id argument is passed`, async function() {
        const input = {
        }
        
        expect.assertions(2)
        
        try {
            await deleteUserUseCase(input)
            
        } catch(error) {
            expect(error).toBeInstanceOf(RequiredParameterError)
            expect(error.message).toEqual('id cannot be null nor undefined')
        }

    })

    it(`Should throw required parameter error IF no arguments are passed at all`, async function() {
        expect.assertions(2)
        try {
            await deleteUserUseCase()
            
        } catch(error) {
            expect(error).toBeInstanceOf(RequiredParameterError)
            expect(error.message).toEqual('id cannot be null nor undefined')
        }

    })

    it(`Should throw 422 invalid property error IF id is not valid`, async function() {
        expect.assertions(2)

        const input = {
            id: 'invalidid'
        }

        try {
            await deleteUserUseCase(input)
            
        } catch(error) {
            expect(error).toBeInstanceOf(InvalidPropertyError)
            expect(error.message).toEqual('Invalid id')
        }

    })

    
})