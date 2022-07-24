var express=require('express');
var app=express();var fs=require('fs');

var router=express.Router();
var session=require('express-session');
//const {request} = require('../app2');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var flash=require('connect-flash');
var ejs=require('ejs');
var path=require('path');
var cookieParser=require('cookie-parser');
var logger=require('morgan');
var FileStore=require('session-file-store')(session);
var flash=require('connect-flash');


//view engine setup
app.set('views','../views');
app.set('view engine','ejs');

var authData={
    email:'sinja@naver.com',
    password:'1111',
    nickname:'sinja'
}
console.log('index.js routes 파일 js사ㅣㄹ행:',authData,ejs);

function authIsOwner(req,res){
    console.log('authIsOnwer함수 호출:',req,res,req.user);
    if(req.user){
        return true;
    }else{
        return false;
    }
}
app.get('/',function(req,res,next){
    console.log('this is home :',req.user);//done req deseriavleizuser가 보낸 users들어있음 세션에 들어있는?

    var isOwner=authIsOwner(req,res);
    var email=req.user;
    var userStatus='로그인하기';
    if(isOwner){
        userStatus='로그아웃하기';
        res.render('index',{title:'To do list',userStatus:userStatus,isOwner:isOwner,email:email});
    }else{
        userStatus='로그인을 해주세요';
        res.render('index',{title:'To do list',userStatus:userStatus,isOnwer:isOwner,email:email});
    }
});

app.get('/loginform',function(req,res,next){
    var isOwner=authIsOwner(req,res);
    var flash=req.flash();
    console.log('flash:',flash);
    var feedback='';

    if(flash.error){
        feedback=flash.error[0];
    }
    console.log('isOwner값:',isOwner);
    if(!isOwner){
        console.log('loginform.ejs불러오기:',ejs);
        //res.render('loginform',{feedback : feedback});

        fs.readFile('../views/first_ejs.ejs','utf-8',function(err,data){
            res.writeHead(200,{"Content-Type":"text/html"});
            res.end(ejs.render(data,{
                feedback: feedback
            }));
        });
    }else{
        req.logout();

        req.session.save(function(err){
            res.redirect('/');
        });
    }
});


app.post('/login',passport.authenticate('local-login',{
    successRedirect:'/',
    failureRedirect: '/loginform',
    failureFlash: true
}));

passport.use('local-login',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
    },function(email,password,done){
        console.log('요청 로그인 입력값?:',email,password,done);
        if(email==authData.email){
            if(password==authData.password){
                console.log('login success');
                return done(null,authData);
            }else{
                console.log('password error');
                return done(null,false,{
                    message:'Incorrect password'
                });
            }
        }else{
            console.log('id error');
            return done(null,false,{message:'Incorrect username.'});
        }
    }
));

passport.serializeUser(function(user,done){
    console.log('this is serializeL',user);
    done(null,user.email);
    console.log('넘겨받은 인증성공후 넘겨받은 user,done등값:',user,done);//세션 스토어 값저장.
});
//각 페이지 들어갈때마다 보여지는 세션
passport.deserializeUser(function(id,done){
    console.log('this is deserialize:',id);//세션 user.email데이터를 첫 인자id로 받는다. 넘어온것을 확인후 그것을 done으로 넘겨줌
    done(null,id);
});

module.exports=router;
