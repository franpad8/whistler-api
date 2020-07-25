const { makeFollowUserEntity} = require('../domain/follow-user-entity.js')
const requiredParam = require('../../utils/required-param')

module.exports = function makeFollowUserUseCase(userDb) {

    return async function followUser(
        { 
            id = requiredParam('id'),
            userToFollowId = requiredParam('id')
        } = requiredParam('params')) {

        const followUserEntity = makeFollowUserEntity({ id, userToFollowId })
        
        const result = await userDb.followUser(followUserEntity.getId(), followUserEntity.getUserToFollowId())
        return result
    }

}