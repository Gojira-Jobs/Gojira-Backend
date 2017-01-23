var express = require('express');
var app = express();
var bodyParser =require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');
var UserRouter = require('./app/routes/userRoutes');
var userPromises = require('./app/promises/userPromises');
var port = process.env.PORT || 8000;
mongoose.connect('mongodb://localhost:27017/MyPortal');
var db = mongoose.connection;
mongoose.set('debug', true);
db.on('error',console.error.bind(console,'Connection Error:'));
db.once('open',()=>{
    console.log('Connected Successfully......');
});
app.set('Supersecret',config.secret);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use(morgan('dev'));

app.get('/',(req,res,next)=>{
    res.end("Connected Successfully...");
});
function addInitial(obj){
    return new Promise((resolve,reject)=>{
        User.create(obj,(err,docs)=>{
            if(err)
                reject(err);
            else
                resolve(docs);
        });
    });
}
app.get('/setup',(req,res,next)=>{
    addInitial({name:"Ajit jain",email:"jainajit123@gmail.com",password:"jain123",mobile:"77777"}).then((docs)=>{
           res.json(docs);
    }).catch((err)=>{
            console.log(err);
            res.end("Failed..")
    })
})
app.use('/api',UserRouter);
app.listen(port);
console.log("Server is Running...");