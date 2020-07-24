
module.exports = (request = {}) => {
    return Object.freeze({
        body: request.body,
        currentUser: request.user,
        isAuthenticated: request.isAuthenticated,
        method: request.method,
        path: request.path,
        pathParams: request.params,
        queryParams: request.query
    })
}
