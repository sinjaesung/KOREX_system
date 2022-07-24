const http=require('http');
const express=require('express');
const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');var cors=require('cors');
var appdir= path.dirname(require.main.filename);


console.log('path require.main.filename whats????:',require.main.filename,appdir);

var app=express();
app.use(cors());

app.post('/mail',async(req,res)=>{
    console.log('mailsend post요청시에처리',req,res);
    let authnum= Math.random().toString().substr(2,6);
    let emailTemplate;
    ejs.renderFile(appdir+'/template/authMail.ejs',{authCode:authnum},function(err,data){
        console.log('ejs render files exectues:',err,data);
        if(err){console.log(err);}
        emailTemplate=data;
    });

    let transporter=nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        tls:{
            rejectUnauthorized: false
        },
        secure:false,
        auth:{
            user:'gotodongyang@naver.com',
            pass:'sinjagoogle93@#'
        },
    });
    let mailOptions= await transporter.sendMail({
        from:'테스타',
        to:req.body.mail,
        subject:'회원가입을 위한 인증번호를 입력해주세요.',
        html:emailTemplate
    });

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }
        console.log('Finish sending email:'+info.response);
        res.send(authnum);
        transporter.close();
    });
});
app.get('/',async(req,res)=>{
    console.log('mailsend get요청시에 그냥 test용:',req,res);
    let authnum=Math.random().toString().substr(2,6);
    let emailTemplate;
    ejs.renderFile(appdir+'/template/authMail.ejs',{authCode : authnum }, function(err,data){
        console.log('ejs render files exceuctes:',err,data);
        if(err){console.log(err);}
        emailTemplate=data;
    });
    let transporter=nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        tls: {
            rejectUnauthorized: false
        },
        auth:{
            user:'sinja.pref@gmail.com',
            pass:'sinjagoogle93@#'
        },
    });
    console.log('transporter:',transporter,req.body);
    let mailOptions= {
        from:'sinja.pref@gmail.com',
        to:'gotodongyang@naver.com',
        subject:'회원가입을 위한 인증번호를 입력해주세요.',
        html:emailTemplate
    };
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }
        console.log('Finish sending email:'+info.response);
        res.send(authnum);
        transporter.close();
    });
});
http.createServer(app).listen(8004,function(){
    console.log('server running at 127.0.1:8004');
});
