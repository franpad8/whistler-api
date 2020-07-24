const { RequiredParameterError } = require('./errors')

module.exports = param => {
    throw new RequiredParameterError(param)
}