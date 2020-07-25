const { UniqueConstraintError } = require('../../utils/errors')

module.exports = function makeUserDB(userDBCollection) {

    return Object.freeze({
        insert,
        update,
        findById,
        findByEmail,
        remove,
        followUser,
        unfollowUser
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

    async function followUser(id, userToFollowId) {
        const user = await userDBCollection.findOne(id)
        if (!user) {
            throw Error('User Not Found')
        }
        
        const userToFollow = await userDBCollection.findOne(userToFollowId)
        if(!userToFollow) {
            return { ok: true, message: 'User To follow no longer exists' }
        }


        if (user.following
                .toObject()
                .map(doc => doc.userId.toString())
                .indexOf(userToFollow._id.toString()) !== -1) {
            return { ok: true, message: 'Already following the user' }
        }

        user.following.push({ userId: userToFollowId })
        userToFollow.followers.push({ userId: id})

        await user.save()
        await userToFollow.save()

        return { ok: true }

    }


    async function unfollowUser(id, userToUnfollowId) {
        const user = await userDBCollection.findOne(id)
        if (!user) {
            throw Error('User Not Found')
        }
        
        const userToUnfollow = await userDBCollection.findOne(userToUnfollowId)
        if(!userToUnfollow) {
            return { ok: true, message: 'User To follow no longer exists' }
        }


        if (user.following
                .toObject()
                .map(doc => doc.userId.toString())
                .indexOf(userToUnfollowId.toString()) === -1) {
            return { ok: true, message: 'Already unfollowing the user' }
        }

        user.following = user.following.filter(doc => doc.userId.toString() !== userToUnfollowId.toString())
        userToUnfollow.followers = userToUnfollow.followers.filter(doc => doc.userId.toString() !== id.toString())

        await user.save()
        await userToUnfollow.save()

        return { ok: true }

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
