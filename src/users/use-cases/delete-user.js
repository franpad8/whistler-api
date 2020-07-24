const { makeDeleteUserEntity} = require('../domain/delete-user-entity.js')
const requiredParam = require('../../utils/required-param')

module.exports = function makeDeleteUserUseCase(userDb) {

    return async function deleteUser({ id = requiredParam('id') } = requiredParam('id')) {

        const deleteUserEntity = makeDeleteUserEntity({ id })
        
        const result = await userDb.remove(deleteUserEntity.getId())
        return result
    }

}