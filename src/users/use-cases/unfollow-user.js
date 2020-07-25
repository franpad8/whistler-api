const { makeFollowUserEntity} = require('../domain/follow-user-entity.js')
const requiredParam = require('../../utils/required-param')

module.exports = function makeUnfollowUserUseCase(userDb) {

    return async function unfollowUser(
        { 
            id = requiredParam('id'),
            userToUnfollowId = requiredParam('id')
        } = requiredParam('params')) {

        const followUserEntity = makeFollowUserEntity({ id, userToFollowId: userToUnfollowId })
        
        const result = await userDb.unfollowUser(followUserEntity.getId(), followUserEntity.getUserToFollowId())
        return result
    }

}