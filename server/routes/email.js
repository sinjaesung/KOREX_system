var express=require('express');
var app=express();
var router=express.Router();
var path=require('path');
var mysql=require('mysql');

var connection=mysql.createConnection({
    host:'localhost',
    port:'3307',
    user:'sinja',
    password:'sinja',
    database:'passport_test'
});

connection.connect();

router.post('/form',(req,res)=>{
    console.log(req.body.email);
    res.render('email.ejs',{'email':req.body.email});
});

router.post('/ajax',(req,res)=>{
    console.log('성공',req.body.email);
    var email=req.body.email;
    var responseData={};

    console.log('1');
    var query=connection.query('select name from users where email="'+email+'"',function(err,rows){
        if(err){
            throw err;
        }
        console.log('2');
        if(rows[0]){
            responseData.result='ok';
            responseData.name=rows[0].name;
        }else{
            responseData.result='none';
            responseData.name='';
        }
        console.log('3');
        res.json(responseData);
    });
});

module.exports=router;
