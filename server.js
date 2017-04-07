var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');
var userPromises = require('./app/promises/userPromises');
var Hr = require('./app/models/admin').hrSchema;
var root = require('./app/routes/root');
mongoose.connect(config.url);
var db = mongoose.connection;
mongoose.set('debug', true);
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Connected Successfully Done......');
});
app.set('Supersecret', config.secret);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(morgan('dev'));

app.get('/', (req, res, next) => {
    res.end("Connected Successfully...");
});

function addInitial(obj) {
    return new Promise((resolve, reject) => {
        Hr.create(obj, (err, docs) => {
            if (err)
                reject(err);
            else
                resolve(docs);
        });
    });
}
app.get('/setup', (req, res, next) => {

    addInitial({ name: "Ajit jain", email: "jainajit194@gmail.com", password: "ajitjain", gender: "Male" }).then((docs) => {
        res.json(docs);
    }).catch((err) => {
        console.log(err);
        res.end("Failed..")
    })


})

app.use('/api', root);

app.listen(process.env.PORT || 8000);
console.log("Server is Running...");
