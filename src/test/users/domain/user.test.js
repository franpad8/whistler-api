const { makeUser } = require('../../../users/domain/user')
const { InvalidPropertyError, RequiredParameterError } = require('../../../utils/errors')
const makeId = require('../../../utils/make-id')

const makeFakeUserInfo = overrides => {

    const user = {
        id: makeId(),
        email: 'test@user.com',
        username: 'test',
        isAdmin: false,
        hash: 'testhash',
        following: [],
        followers: []
    }
    return {...user, ...overrides}
}

describe('makeUser', () => {

    it(`SHOULD throw required parameter error IF not user info is passed as argument`, () => {
        expect.assertions(2)
        try{
            makeUser()
        } catch (error) {
            expect(error).toBeInstanceOf(RequiredParameterError)
            expect(error.message).toEqual('userInfo cannot be null nor undefined')
        }
    })

    it(`SHOULD throw required parameter error IF not email is passed`, () => {
        const userInfo = {}

        expect.assertions(2)
        try{
            makeUser(userInfo)
        } catch (error) {
            expect(error).toBeInstanceOf(RequiredParameterError)
            expect(error.message).toEqual('email cannot be null nor undefined')
        }
    })

    it(`SHOULD throw invalid property error IF email address does not have valid format`, () => {
        const userInfo = makeFakeUserInfo({
            email: 'someinvalidemail'
        })

        expect.assertions(2)
        try{
            makeUser(userInfo)
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidPropertyError)
            expect(error.message).toEqual('User must have a valid email')
        }
    })

    it(`SHOULD accept email IF email is valid`, () => {
        const userInfo = makeFakeUserInfo({
            email: 'test@email.com'
        })

        const user = makeUser(userInfo)
        expect(user.getEmail()).toEqual(userInfo.email)
    })


    it('SHOULD throw an invalid property error IF invalid id is passed', function() {
        const userInfo = makeFakeUserInfo({id: 'invalid'})

        expect.assertions(2)
        try{
            makeUser(userInfo)
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidPropertyError)
            expect(error.message).toEqual('User must have a valid id')
        }
    })

    it('SHOULD create new id IF no id is passed', function() {
        const userInfo = makeFakeUserInfo({ id: undefined })
        const user = makeUser(userInfo)

        expect(user.getId()).toBeDefined()
    })

    it('SHOULD accept id IF id is valid', function() {
        const userInfo = makeFakeUserInfo({ id: makeId() })
        const user = makeUser(userInfo)

        expect(user.getId()).toEqual(userInfo.id)
    })

    it('SHOULD return username', function() {
        const testUsername = 'aTestingUsername' 
        const userInfo = makeFakeUserInfo({ username: testUsername })
        const user = makeUser(userInfo)

        expect(user.getUsername()).toEqual(testUsername)
    })

    it('SHOULD return first part of email address as username IF no username parameter is passed', function() {
        const userInfo = makeFakeUserInfo({ email: 'usertest@email.com', username: undefined })
        const user = makeUser(userInfo)

        expect(user.getUsername()).toEqual('usertest')
    })

    it('SHOULD return isAdmin equal to false IF no isAdmin parameter is passed', function() {
        const userInfo = makeFakeUserInfo({ isAdmin: undefined })
        const user = makeUser(userInfo)

        expect(user.isAdmin()).toBeDefined()
        expect(user.isAdmin()).toEqual(false)
    })

    it('SHOULD return isAdmin IF isAdmin is passed', function() {
        const userInfo = makeFakeUserInfo({ isAdmin: true })
        const user = makeUser(userInfo)

        expect(user.isAdmin()).toEqual(true)
    })

    it('SHOULD return the hash', function() {
        const userInfo = makeFakeUserInfo({ hash: 'hashespac' })
        const user = makeUser(userInfo)
    
        expect(user.getHash()).toEqual('hashespac')
    })

    it('SHOULD throw required parameter error IF no hash is passed', function() {
        const userInfo = makeFakeUserInfo({ hash: undefined })

        expect.assertions(2)
        try{
            makeUser(userInfo)
        } catch(error){
            expect(error).toBeInstanceOf(RequiredParameterError)
            expect(error.message).toEqual('hash cannot be null nor undefined')
        }
    })

    it('SHOULD return the following users IF the following list is passed', function() {
        const following = ['user1', 'user2', 'user3']
        const userInfo = makeFakeUserInfo({ following })
        const user = makeUser(userInfo)
    
        expect(user.getFollowing()).toEqual(following)
    })

    it('SHOULD return empty list IF no following list is passed', function() {
        const userInfo = makeFakeUserInfo({ following: undefined })

        const user = makeUser(userInfo)

        expect(user.getFollowing()).toEqual([])
    })

    it('SHOULD return the followers users IF the followers list is passed', function() {
        const followers = ['user1', 'user2', 'user3']
        const userInfo = makeFakeUserInfo({ followers })
        const user = makeUser(userInfo)
        expect(user.getFollowers()).toEqual(followers)
    })

    it('SHOULD return empty list IF no followers list is passed', function() {
        const userInfo = makeFakeUserInfo({ followers: undefined })

        const user = makeUser(userInfo)

        expect(user.getFollowers()).toEqual([])
        
    })

})
