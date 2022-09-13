//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const ejs = require('ejs');
const alert = require('alert');
const encrypt = require('mongoose-encryption');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/userDB').then(function(){console.log("Connected successfully")}).catch(function(err){console.log(err)});

const userSchema = new mongoose.Schema({
    mail:String,
    password:String
});

userSchema.plugin(encrypt, { secret:process.env.SECRET ,encryptedFields:["password"]});

const User = new mongoose.model('User',userSchema);

app.get('/',function(req,res){
    res.render('home',{});
})

app.get('/login',function(req,res){
    res.render('login',{});
})

app.get('/register',function(req,res){
    res.render('register',{});
})

app.post('/register',function(req,res){
    const User1 = new User({
        mail:req.body.username,
        password:req.body.password
    })

    User.findOne({mail:req.body.username},function(err,data){
        if(!err){
            if(!data){
                User1.save();
                res.render('secrets',{});
            }
            else{
                alert("You are already registered");
                console.log("User alreadyn registered");
                res.redirect('/login');
            }
        }
    })
})

app.post('/login',function(req,res){
    User.findOne({mail:req.body.username},function(err,data){
        if(!err){
            if(!data){
                console.log(" wrong User data");
                alert("Username or password is not correct");
                res.redirect('/login');
            }
            else{
                if(data.password === req.body.password){
                    res.render('secrets',{});
                }
                else{
                    console.log(" wrong User data");
                    alert(" password is not correct");
                    res.redirect('/login');
                }
            }
        }
    });
});


app.listen(3000,function(req,res){
    console.log("Server started at port 3000");
})