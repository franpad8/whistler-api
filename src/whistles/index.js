

const db = require('../db/models/whistle')
const makeWhistleList = require('./whistle-list')
const makeWhistlesEndpointHandler = require('./whistles-endpoint')


const whistleList = makeWhistleList(db)
module.exports = makeWhistlesEndpointHandler(whistleList)
