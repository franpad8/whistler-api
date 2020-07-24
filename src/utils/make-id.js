const { ObjectId } = require('mongoose').Types

module.exports = id => {
    if(id instanceof ObjectId){
        return id
    }
    else if (id && !ObjectId.isValid(id)) {
        return null
    }

    return id ? new ObjectId(id) : new ObjectId()
};
