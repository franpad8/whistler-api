const { makeWhistle } = require('../../whistles/whistle')
const { RequiredParameterError } = require('../../utils/errors');

describe('makeWhistle', function(){

    it('SHOULD throw RequiredParameterError IF not text argument is passed', function() {
        expect.assertions(1);
        const whistleInfo = { creatorId: 'creator id', dummy: 'dummy' };

        try {
            makeWhistle(whistleInfo);
        } catch (error) {
            expect(error).toBeInstanceOf(RequiredParameterError);
        }
        
    });

    it('SHOULD throw RequiredParameterError IF not creatorId argument is passed', function() {
        expect.assertions(1);
        const whistleInfo = { text: 'dummy text',  dummy: 'dummy' };

        try {
            makeWhistle(whistleInfo);
        } catch (error) {
            expect(error).toBeInstanceOf(RequiredParameterError);
        }

    });

    it('SHOULD return object with text getter', function() {
        const whistleInfo = { text: 'dummy text', creatorId: 'creator id', dummy: 'dummy' };

        const result = makeWhistle(whistleInfo);

        expect(result).toHaveProperty('text');
        expect(result.text).toEqual(whistleInfo.text);

    });

    it('SHOULD return object with creatorId getter', function() {
        const whistleInfo = { text: 'dummy text', creatorId: 'creator id', dummy: 'dummy' };

        const result = makeWhistle(whistleInfo);

        expect(result).toHaveProperty('creatorId');
        expect(result.creatorId).toEqual(whistleInfo.creatorId);

    });

    it('SHOULD return truncated text to 250 characters IF text is longer than 250 characters', function() {
        const whistleInfo = { creatorId: 'creator id', dummy: 'dummy' };
        whistleInfo.text = 'a'.repeat(300);

        const result = makeWhistle(whistleInfo);

        expect(result.text).toHaveLength(250);
    });

});
