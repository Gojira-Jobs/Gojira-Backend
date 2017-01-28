var express = require('express');
var app = express();
var bodyParser =require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors=require('cors');
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');
var UserRouter = require('./app/routes/userRoutes');
var PostRouter = require('./app/routes/postRouter');
var userPromises = require('./app/promises/userPromises');
var Hr=require('./app/models/admin').hrSchema;
var commonlogin = require('./app/routes/commonroute');
var superlogin = require('./app/routes/superlogin');
var auth_user_route = require('./app/routes/userroute');//user route
var auth_admin_route = require('./app/routes/adminroute');// admin route
var auth_super_route = require('./app/routes/superroute');// super user route
var user_regis = require('./app/routes/userregistration');
var forgetpassword = require('./app/routes/passwordchange');
var forgetpassset= require('./app/routes/setpassword');
//var port = process.env.PORT || 8000;
mongoose.connect(config.url);
var db = mongoose.connection;
mongoose.set('debug', true);
db.on('error',console.error.bind(console,'Connection Error:'));
db.once('open',()=>{
    console.log('Connected Successfully......');
});
app.set('Supersecret',config.secret);
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use(morgan('dev'));

app.get('/',(req,res,next)=>{
    res.end("Connected Successfully...");
});
function addInitial(obj){
    return new Promise((resolve,reject)=>{
        Hr.create(obj,(err,docs)=>{
            if(err)
                reject(err);
            else
                resolve(docs);
        });
    });
}
app.get('/setup',(req,res,next)=>{
    
   addInitial({name:"Ajit jain",email:"ajit.x@venturepact.com",password:"ajitjain"}).then((docs)=>{
           res.json(docs);
    }).catch((err)=>{
            console.log(err);
            res.end("Failed..")
    })

    //res.end("Hii Ajit ..");
})
//app.use('/api',UserRouter);
app.use('/api',PostRouter);
app.use('/api/authenticate/login',commonlogin);
app.use('/api/super/login',superlogin);
app.use('/api/user/auth',auth_user_route);
app.use('/api/admin/auth',auth_admin_route);
app.use('/api/super/auth',auth_super_route);
app.use('/api/user/registration',user_regis);
app.use('/api/forget/reset',forgetpassword);
app.use('/api/forget/passwordset',forgetpassset);
app.listen(3000);
console.log("Server is Running...");