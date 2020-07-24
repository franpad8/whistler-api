const dbHandler = require('../db-handler')
const makeWhistleList = require('../../whistles/whistle-list')
const makeHttpError = require('../../utils/http-error')

const makeEndpointHandler = require('../../whistles/whistles-endpoint');
const whistleDb = require('../../db/models/whistle')

const whistleList = makeWhistleList(whistleDb)
const endpointHandler = makeEndpointHandler(whistleList)

const makeId = require('../../utils/make-id');
const { makeWhistle } = require('../../whistles/whistle');


describe('postWhistle', function(){


    /**
     * Connect to a new in-memory database before running any tests.
     */
    beforeAll(async () => await dbHandler.connect());

    /**
     * Clear all test data after every test.
     */
    afterEach(async () => await dbHandler.clearDatabase());

    /**
     * Remove and close the db and server.
     */
    afterAll(async () => await dbHandler.closeDatabase());


    it(`SHOULD add new whistle with the current logged in user as the creator 
            and the text set in the request body 
          IF success case`, async function(){
        const httpRequest = {
            method: 'POST',
            currentUser: {_id: makeId()},
            body: {
                text: 'test text'
            }
        }

        await endpointHandler(httpRequest);

        const { whistles } = await whistleList.list();

        expect(whistles).toHaveLength(1);
        expect(whistles[0].creatorId).toEqual(httpRequest.currentUser._id);
        expect(whistles[0].text).toEqual(httpRequest.body.text);
    });

    it(`SHOULD return an object with code 400 IF not body is found in the request`, async function(){
        const httpRequest = {
            method: 'POST',
            currentUser: {_id: makeId()},
        }
        const expected = makeHttpError(
            {
                statusCode: 400,
                errorMessage: 'Bad Request. POST Request body must be a valid JSON.'
            }
        )

        const result = await endpointHandler(httpRequest)
 
        expect(result).toEqual(expected)

    })

    it(`SHOULD return an object with code 400 IF request body is not in valid json format`, async function(){
        const httpRequest = {
            method: 'POST',
            currentUser: {_id: makeId()},
            body: '{"text": "text"'
        }
        const expected = makeHttpError(
            {
                statusCode: 400,
                errorMessage: 'Bad request. POST body must be valid JSON.'
            }
        )

        const result = await endpointHandler(httpRequest)
 
        expect(result).toEqual(expected)

    })

})



describe('deleteWhistle', function(){


    /**
     * Connect to a new in-memory database before running any tests.
     */
    beforeAll(async () => await dbHandler.connect());

    /**
     * Clear all test data after every test.
     */
    afterEach(async () => await dbHandler.clearDatabase());

    /**
     * Remove and close the db and server.
     */
    afterAll(async () => await dbHandler.closeDatabase());

    it(`SHOULD remove a whistle WHEN already added`, async function(){
        const creatorId = makeId()
        const { created } = await whistleList.add(makeWhistle({ text: 'text test', creatorId }))

        const httpRequest = {
            method: 'DELETE',
            currentUser: {_id: creatorId},
            pathParams: { whistleId: created.whistleId }
        }

        await endpointHandler(httpRequest);

        const { whistles } = await whistleList.list();

        expect(whistles).toHaveLength(0);
    });

    it(`SHOULD return 403 code IF whistle's creator is not the same as the current logged in user`, async function(){
        const creatorId = makeId()
        const { created } = await whistleList.add(makeWhistle({ text: 'text test', creatorId }))

        const expected = makeHttpError(
            {
                statusCode: 403,
                errorMessage: 'Unauthorized. Whistles can only be deleted by its creator.'
            }
        )

        const httpRequest = {
            method: 'DELETE',
            currentUser: {_id: makeId()},
            pathParams: { whistleId: created.whistleId }
        }

        const result = await endpointHandler(httpRequest);

        expect(result).toEqual(expected);
    });

    it(`SHOULD return 404 code IF trying to delete a whistle that does not exists`, async function() {
        const expected = makeHttpError(
            {
                statusCode: 404,
                errorMessage: 'Whistle not found.'
            }
        )

        const httpRequest = {
            method: 'DELETE',
            currentUser: {_id: makeId()},
            pathParams: { whistleId: makeId().toString() }
        }

        const result = await endpointHandler(httpRequest)
        expect(result).toEqual(expected)

    })

    it(`SHOULD return 422 code IF passing an invalid id`, async function() {
        const expected = makeHttpError(
            {
                statusCode: 404,
                errorMessage: 'Whistle not found.'
            }
        )

        const httpRequest = {
            method: 'DELETE',
            currentUser: {_id: makeId()},
            pathParams: { whistleId: 'invalidid' }
        }

        const result = await endpointHandler(httpRequest)
        expect(result).toEqual(expected)

    })

})