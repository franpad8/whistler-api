class RequiredParameterError extends Error {
    constructor(param) {
        super(`${param} cannot be null nor undefined`)

        this.statusCode = 400

        if(Error.captureStackTrace){
            Error.captureStackTrace(this, RequiredParameterError)
        }
    }
}

class InvalidPropertyError extends Error {
    constructor(msg) {
        super(msg)

        this.statusCode = 422

        if(Error.captureStackTrace){
            Error.captureStackTrace(this, InvalidPropertyError)
        }
    }
}

class UniqueConstraintError extends Error {
    constructor (value) {
        super(`${value} must be unique`)

        this.statusCode = 409

        if(Error.captureStackTrace){
            Error.captureStackTrace(this, UniqueConstraintError)
        }
    }
}

class AuthenticationError extends Error {
    constructor (value) {
        super(value)

        this.statusCode = 401

        if(Error.captureStackTrace){
            Error.captureStackTrace(this, UniqueConstraintError)
        }
    }
}



module.exports = { AuthenticationError, RequiredParameterError, InvalidPropertyError, UniqueConstraintError }
