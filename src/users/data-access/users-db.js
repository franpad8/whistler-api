const { UniqueConstraintError } = require('../../utils/errors')

module.exports = function makeUserDB(userDBCollection) {

    return Object.freeze({
        insert,
        update,
        findById,
        findByEmail,
        remove
    })

    async function insert({ id: _id, email, username, hash, isAdmin }) {
        try{
            const userDoc = await userDBCollection.create({ _id, email, username, hash, isAdmin })
            return documentToUserObject(userDoc)
        } catch (error) {
            if(error.message.includes('E11000')) {
                throw new UniqueConstraintError('email')
            }
            throw error
        }
    }

    async function update() {}

    async function findById(id) {
        const userDoc = await userDBCollection.findById(id)
        if (!userDoc){
            return null
        }
        return documentToUserObject(userDoc)
    }

    async function findByEmail(email) {
        const userDoc = await userDBCollection.findOne({ email })
        if (!userDoc){
            return null
        }
        return documentToUserObject(userDoc)
    }

    async function remove(id) {
        const { ok, deletedCount } = await userDBCollection.remove({ _id: id })
        return { ok: ok === 1, deletedCount }
    }

    function documentToUserObject(doc) {
        return Object.freeze({
            id: doc._id,
            email: doc.email,
            username: doc.username,
            hash: doc.hash,
            isAdmin: doc.isAdmin,
            following: doc.following,
            followers: doc.followers
        }) 
    }


 }
