const { makeWhistle } = require('./whistle')
const makeId = require('../utils/make-id')

module.exports = function makeWhistleList( db ) {
    return Object.freeze({
        add,
        findById,
        remove,
        getItems,
        list,
        update
    })

    async function add({ whistleId, text, creatorId }) {
        const documentToAdd = {}
        if ( whistleId && typeof whistleId === 'string') {
            documentToAdd._id = makeId(whistleId)
        }
        documentToAdd.text = text
        documentToAdd.creator = (typeof creatorId === 'string')?  makeId(creatorId) : creatorId

        const createdDocument = await db.create(documentToAdd)

        return {
            success: true,
            created: documentToWhistle(createdDocument._doc)
        }
    }

    async function findById(whistleId) {
        const _id = makeId(whistleId)
        const document = await db.findById(_id)
        if (!document) {
            return null
        }

        return documentToWhistle(document._doc)

    }

    async function remove({ whistleId: _id }) {
        const result = await db.deleteOne({ _id })
        return {
            success: result.deletedCount === 1
        }
    }

    async function getItems() {
        
    }

    async function list() {
        const documents = await db.find({});
        return {
            success: true,
            whistles: documents.map(doc => documentToWhistle(doc._doc))
        }
    }

    async function update() {
        
    }

    function documentToWhistle ({ _id: whistleId, creator: creatorId, ...doc }) {
        return makeWhistle({ whistleId, creatorId, ...doc })
    }

}