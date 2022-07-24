const http=require('http');
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const nodemailer = require('nodemailer');
const ejs=require('ejs');
const path=require('path');
var appdir=path.dirname(require.main.filename);

var app=express();
app.use(cors());

console.log('nodemailerRouter loaded property values:',require.main.filename,appdir);

const mysqls=require('mysql2/promise');
const pool =mysqls.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    //host: 'localhost',
    //host : '13.209.251.38',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref',
    dateStrings : 'date'
});

const router=express.Router(); 

//개인회원가입 유도 링크 관련 지메일 발송 메일링.
router.post('/gmailSend',async(req,res)=>{
    const connection = await pool.getConnection(async conn => conn);

    var req_body=req.body;  
    var user_email=req_body.email;
    //var authnum=Math.random().toString().substr(2,6);//식별자를 생성하여 임의 랜덤난수또는 타임스탬프값+난수조합의 식별자 생성하여, 그 식별자에 해당하는 idneintnify내역을 조회하여 관련 이메일을 추출하여 그 추출한 이메일값으로 가입신청을 했던것이기에 그 이메일정보로 해서 가입시켜준다.
    var random_identifyString=Math.random().toString(36)+new Date().getTime();
    var emailTemplate;

    var [rows] = await connection.query("select count(*) from user where email=? and user_type='개인'",[user_email]);
    if(rows > 0){
        return res.json({success:false, message:'emali already exit'});
    }

    try{
        ejs.renderFile(appdir+'/template/authMail.ejs',{authCode:random_identifyString, useremail: encodeURIComponent(user_email)},function(err,data){
            console.log('ejs render fiels executesss:',err,data);
            if(err){console.log(err);}
            emailTemplate=data;
        });

        let transporter=nodemailer.createTransport({
            service:'gmail',
            host:'smtp.gmail.com',
            port:587,
            tls:{
                rejectUnauthorized:false
            },
            secure:false,
            auth:{
                user: 'biz@korex.or.kr',
                //user: 'korexproject@gmail.com',
                //pass:'prefkorex890!@#'
                pass:'takrcdtdzmenxqxm'
            },
        });

        let mailOptions={
            //from:'sinja.pref@gmail.com',
            from : 'biz@korex.or.kr',
            to:user_email,
            subject:'회원가입을 위한 링크를 클릭해주세요',
            html:emailTemplate
        };
        transporter.sendMail(mailOptions,async function(error,info){
            if(error){
                return res.status(403).json({success:false, message:'email send fail',result:undefined})
            }

            transporter.close();

            //이메일전송 성공적으로 처리된경우 이메일 url식별자에 로컬호스트:3000/MemberJoingagree/식별자랜덤난수문자열 로 보내게된다. 해당 관련 제공페이지에서의 식별자값 관련된 row행 레코드값에 인증유효시간을 재서 유효시간안에 한것이라면 통과이고, 초과시점때 들어온것인지 여부 판단하여 가입허용여부 처리.
            try{
                var now_date=new Date();
                var now_date2=new Date();
                var oneday_add_date=now_date2.setDate(now_date2.getDate()+1);//하루더하기

                await connection.beginTransaction();
                var [email_identifyquery] = await connection.query("insert into email_identify(identify_number,identify_email,create_date,certify_possible_datetime) values(?,?,?,?)",[random_identifyString,user_email,now_date,new Date(oneday_add_date)]);//하루뒤의 날짜값.하루뒤의 유효시간값.

                await connection.commit();
                connection.release();
            }catch(err){
                connection.rollback();
                connection.release();
            }
            return res.json({success:true, message:'emali send success',result:{toemail: user_email, content:emailTemplate, rel_data:random_identifyString} });
        });

    }catch(err){
        return res.status(403).json({success:false, message:'email send fail',result:undefined})
    }   
});
router.post('/gmailSend2',async(req,res)=>{
    const connection = await pool.getConnection(async conn => conn);

    var req_body=req.body;
    var user_email=req_body.email;
    console.log('gmailSend router reuqest post::',req_body);
    var authnum=Math.random().toString().substr(2,6);
    var emailTemplate;

    try{
        ejs.renderFile(appdir+'/template/authMail2.ejs',{authCode:authnum, useremail: encodeURIComponent(user_email)},function(err,data){
            console.log('ejs render fiels executesss:',err,data);
            if(err){console.log(err);}
            emailTemplate=data;
        });

        let transporter=nodemailer.createTransport({
            service:'gmail',
            host:'smtp.gmail.com',
            port:587,
            tls:{
                rejectUnauthorized:false
            },
            secure:false,
            auth:{
                user: 'biz@korex.or.kr',
                //user: 'korexproject@gmail.com',
                //pass:'prefkorex890!@#'
                pass:'takrcdtdzmenxqxm'
            },
        });
        console.log('nodemial transporterss::',transporter);
        let mailOptions={
            //from:'sinja.pref@gmail.com',
            from : 'biz@korex.or.kr',
            to:user_email,
            subject:'이메일인증을 위한 인증번호를 입력해주세요',
            html:emailTemplate
        };
        transporter.sendMail(mailOptions,async function(error,info){
            if(error){
                console.log('email send error!!:',error);
                return res.status(403).json({success:false, message:'email send fail',result:undefined})
            }
            console.log('finishignbsending emila::',info.response);
    
            transporter.close();

            //이메일전송 성공적으로 처리된경우 관련된 이메일인증했던 내역 insert한다. 인증번호 와 함께 전달되는 이메일인증내역.
            try{
                var now_date=new Date();
                var now_date2=new Date();
                var oneday_add_date=now_date2.setDate(now_date2.getDate()+1);//하루더하기 인증유효기간 하루.
                
               // var fiveminute_add_date=now_date.setMinutes(now_date.getMinutes()+5);//오분 더하기.오분뒤의 미래 유효시간 오분내로 입력.그 datetime 이전과거시간까지가 유효
                console.log('now_date,onedayadddate:',now_date,new Date(oneday_add_date));

                await connection.beginTransaction();
                var [email_identifyquery] = await connection.query("insert into email_identify(identify_number,identify_email,create_date,certify_possible_datetime) values(?,?,?,?)",[authnum,user_email,new Date(),new Date(oneday_add_date)]);
                console.log('email idneintify query reusltsss:',email_identifyquery);
                await connection.commit();
                connection.release();
            }catch(err){
                console.log('db query error:',err);
                connection.rollback();
                connection.release();
            }

            return res.json({success:true, message:'emali send success',result:{toemail: user_email, content:emailTemplate, rel_data:authnum} });
        });


    }catch(err){
        console.log('error::',err);

        return res.status(403).json({success:false, message:'email send fail',result:undefined})
    }   
});
module.exports=router;