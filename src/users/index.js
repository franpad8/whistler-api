const controllers = require('./controllers')
const makeUserEndpointHandler = require('./users-endpoint')

module.exports = makeUserEndpointHandler(controllers)
