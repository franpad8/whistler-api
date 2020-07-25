const express = require('express');
const bodyParser = require('body-parser');

//const { mongoConnect } = require('./db');
const mongoose = require('mongoose');

const config = require('./config');
const { authenticate, requireToBeAdmin, requireAuthentication } = require('./users/auth');

const app = express();

const handleUsersRequest = require('./users')
const handleWhistlesRequest = require('./whistles')
const adaptRequest = require('./utils/adapt-request')
const makeHttpError = require('./utils/http-error');


app.use(bodyParser.json());

app.use(authenticate);



const whistlesController = makeController(handleWhistlesRequest)

app.delete('/whistles/:whistleId', requireAuthentication, whistlesController)
app.post('/whistles', requireAuthentication, whistlesController);


const usersController = makeController(handleUsersRequest)

app.post('/users', usersController)
app.post('/users/login', usersController)
app.delete('/users/:id', requireToBeAdmin, usersController)
app.put('/users/follow/:id', requireAuthentication, usersController)
app.put('/users/unfollow/:id', requireAuthentication, usersController)

app.use(async (req, res, next) => {
    res.status(404).end();
});

app.use((err, req, res, next) => {
    console.log(err);
    const { headers, statusCode, data } = makeHttpError({ 
        errorMessage: err.message || "Server Error",
        statusCode: err.statusCode || 500
    })

    res
        .set(headers)
        .status(statusCode)
        .send(data)

});


mongoose.connect(config.DB_URI)
    .then( () => {
        app.listen(3001);
    })
    .catch(err => {
        console.log(err);
    })


function makeController(handler) {
    return function controller(req, res) {
        const httpRequest = adaptRequest(req)
        handler(httpRequest)
            .then(({ headers, statusCode, data }) => {
                res
                    .set(headers)
                    .status(statusCode)
                    .send(data)
            })
            .catch(error => {
                console.log(error);
                res.status(500).end();
            })
    }
}
