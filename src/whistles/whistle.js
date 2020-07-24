const requiredParam = require('../utils/required-param')

module.exports.makeWhistle = (
    whistleInfo = requiredParam('whistleInfo')
) => {

    const validatedInfo = validate(whistleInfo)
    const cleanedWhistle = cleanWhistle(validatedInfo)
    return Object.freeze({
        whistleId: cleanedWhistle.whistleId,
        text: cleanedWhistle.text,
        creatorId: cleanedWhistle.creatorId,
        createdAt: cleanedWhistle.createdAt,
        updatedAt: cleanedWhistle.updatedAt
    })

    function validate({
        text = requiredParam('text'),
        creatorId = requiredParam('creatorId'),
        ...otherInfo
    } = {}) {

        return {
            text,
            creatorId,
            ...otherInfo
        }
    }

    function cleanWhistle({ text, ...otherInfo }) {

        return {
            ...otherInfo,
            text: text.trim().substring(0, 250)
        }
    }
}

