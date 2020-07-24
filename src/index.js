const express = require('express');
const bodyParser = require('body-parser');

//const { mongoConnect } = require('./db');
const mongoose = require('mongoose');

const config = require('./config');
const { authenticate } = require('./users/auth');

const app = express();

const handleUsersRequest = require('./users')
const handleContactsRequest = require('./whistles')
const adaptRequest = require('./utils/adapt-request')

app.use(bodyParser.json());

app.use(authenticate);

// app.use((req, res, next) => {

//     res.send('Hola mundo');
// });

app.delete('/whistles/:whistleId', whistlesController)
app.post('/whistles', whistlesController);

function whistlesController(req, res) {
    const httpRequest = adaptRequest(req)
    handleContactsRequest(httpRequest)
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

//app.delete('/users/:whistleId', whistlesController)
app.post('/users', usersControllers)
app.post('/users/login', usersControllers)
app.delete('/users/:id', usersControllers)

function usersControllers(req, res) {
    const httpRequest = adaptRequest(req)
    handleUsersRequest(httpRequest)
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


app.use(async (req, res, next) => {
    res.status(404).end();
});

app.use(async (err, req, res, next) => {

    console.log(err);
    const code = err.statusCode || err.code || 500;
    const msg = (code !== 500)? err.message : 'Server Error'
    
    res.status(code).json({errors: [ { msg } ]});
});


mongoose.connect(config.DB_URI)
    .then( () => {
        app.listen(3001);
    })
    .catch(err => {
        console.log(err);
    })

