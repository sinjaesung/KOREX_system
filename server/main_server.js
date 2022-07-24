const mysqls=require('mysql2/promise');

const { UnorderedCollection } = require('http-errors');
var pool= mysqls.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    //host: 'localhost',
    //host : '13.209.251.38',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref'
});
const awsS3  = require('./modules/fileuploadModule');
const { register_ } = require('./modules/uploadfile_register_');

const https = require('https');
const fs = require('fs');
const express=require('express');
const morgan=require('morgan');
const cookieparser=require('cookie-parser');
const nodemailer = require('nodemailer');

const passport=require('passport');
const ejs=require('ejs');
const path=require('path');
var appdir=path.dirname(require.main.filename);

const session=require('express-session');
require('dotenv').config();

////console.log('>>>passport facebook.kakao,naver:',passport_facebook,passport_kakao,passport_naver);
const bodyparser=require('body-parser');

//const authRouter=require('./routes/auth');//회원가입&로그인 관련 모든 처리 router페이지(네종류 회원별)분기 url처리
const smsRouter=require('./routes/coolsmsUse');//coolsms라이브러리 사용 사용자에게 휴대폰 sms 메시지보낸다.
const aligosms=require('./modules/aligoSms');//문자알리미(알리고)
const fcmpushalram=require('./modules/fcmPushalram');//푸시알림(fcm)

const nodemailRouter=require('./routes/nodemailRouter');
const brokerRouter=require('./routes/brokerRouter');
const mypageRouter=require('./routes/mypageProcess');//mypage관련 전반적 범용처리 라우터
const matterialRouter=require('./routes/matterialRouter');//전속을 제외한 물건들에 대한 정보 관련 처리(단지,단지별실거래,지하철,대학교,등등.)
const alramRouter=require('./routes/alramRouter');
const fileuploadRouter=require('./routes/fileuploadUse');
//const filedeleteRouter=require('./routes/fileDeleterouter');

 const facebook_passportconfig=require('./passport_facebook');
 const kakao_passportconfig=require('./passport_kakao');
 const naver_passportconfig=require('./passport_naver');

const passportconfig=require('./passports');//패스포트 api설정

const port=8080;
const app=express();


 facebook_passportconfig(passport);//passport api전달한다.
 kakao_passportconfig(passport);
 naver_passportconfig(passport);


const social_router=require('./routes/social_router');//social router;

passport.serializeUser((user,done) => {

    if(user.mem_id === 'naver' || user.mem_id==='kakao' || user.mem_id==='facebook'){
        done(null, {mem_id:user.mem_id, newuserid_val : user.newuserid_val, newuserpassword_val : user.newuserpassword_val});
    }else{
        done(null, {mem_id:user.mem_id, newuserid_val :undefined, newuserpassword_val : undefined});
    }
});
passport.deserializeUser((id,done)=> {
    done(null,id);
});


const cors=require('cors');
app.use(cors({
    origin : 'http://localhost:3000',
    credentails:true
}));
//app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({
    limit:'50mb',
    extended:false
}));
app.use(express.json({
    limit:'50mb'
}));
app.use(cookieparser());
app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(session({
    secret: 'keyboard catss',
    resave:false,
    saveUninitialized:true,
    //store : new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());


const axios=require('axios');
const xml2js = require('xml2js');

// 국세청 사업자번호 조회 API [POST]
const postUrl = "https://teht.hometax.go.kr/wqAction.do?actionId=ATTABZAA001R08&screenId=UTEABAAA13&popupYn=false&realScreenId=";
// API 에 raw 로 올라갈 xml 데이터
const xmlRaw = "<map id=\"ATTABZAA001R08\"><pubcUserNo/><mobYn>N</mobYn><inqrTrgtClCd>1</inqrTrgtClCd><txprDscmNo>{CRN}</txprDscmNo><dongCode>15</dongCode><psbSearch>Y</psbSearch><map id=\"userReqInfoVO\"/></map>";

//app.use('/auth',authRouter);
app.use('/api/coolsms',smsRouter);//coolsms형태의 주소 요청
app.use('/api/nodemailer',nodemailRouter);//api/nodemailer형태의 주소요청, 해당 api로 메일발송 관련된 모든 응용처리 진행예정
app.use('/api/auth/social',social_router);//socail 로그인,가입 관련 기능 router
app.use('/api/broker',brokerRouter);//broker라우터 (중개사,개인/기업관련 모든것 매물 요청 관련 모든처리)
app.use('/api/mypage',mypageRouter);//mypage라우터 api/mypage/companyprofileEdit 관련 분기 처리.
app.use('/api/matterial',matterialRouter);
app.use('/api/alram',alramRouter);
app.use('/api/fileupload',fileuploadRouter);
//app.use('/api/filedelete',filedeleteRouter);
//로그인 회원가입처리.

//const router=express.Router();
//const passport=require('passport');
const bcrypt=require('bcrypt');
const sha256=require('sha256');//이걸 그대로 사용이 가능한가?

//const loginCheck=require('../loginCheck');
//const app=express();

/*var isLogin=loginCheck.isLogin;
var isLogout=loginCheck.isLogout;*/


//디비 관련 연결 필요
/*const mysql=require('mysql');
var connection=mysql.createConnection({
    host:'localhost',
    port:3307,
    user:'sinja',
    password:'sinja',
    database:'korex'
});
connection.connect();*/


//init bunyang controller 분양 api 셋팅 부분입니다.
const bunyangController = require('./controller/bunyangController').initController(app);
const bannerController = require('./controller/bannerController').initController(app);
const mapFilterController = require('./controller/mapFilterController').initController(app);
const likesController = require('./controller/likesController').initController(app);
const productController = require('./controller/productController').initController(app);
const utilsController = require('./controller/utilsController').initController(app);
const authController = require('./controller/authController').initController(app);
const realtorController = require('./controller/realtorController').initController(app);
const complexController = require('./controller/complexController').initController(app);
const awsController = require('./controller/awsController').initController(app);
const companyController = require('./controller/companyController').initController(app);
const userController = require('./controller/userController').initController(app);
const mapController = require('./controller/mapController').initController(app);
const actualTransactionController = require('./controller/actualTransactionController').initController(app);
const termController = require('./controller/termController').initController(app);
const bunyangProjectController = require('./controller/bunyangProjectController').initController(app);


app.post('/api/commondata/request',async(req,res)=>{
    const connection=await pool.getConnection(async conn=> conn);

    try{
      
        let type=req.body.type;
        let request_data=req.body.request_data;//terms요청,board요청,faq요청

        let where_string;
        if(request_data=='board'){
            where_string = `where board_type=${type}`;
        }else if(request_data=='terms'){
            where_string = `where terms_type=${type}`;
        }
        var [result_list] = await connection.query(`select * from ${request_data} order by create_date desc`);

        connection.release();
   
        return res.json({success:true, message:'result suscesss',result:result_list});//그 회원정보 비번을 바꾸고, 그 이메일로 바꾼 비번을 알려주고, 회원에겐 그 사항을 알려준다.
        
    }catch(err){
        connection.release();

        return res.status(403).json({success:false, message:'email exists query server error'});
    }
});
app.post('/api/commondata/request_detail',async(req,res)=>{
    const connection=await pool.getConnection(async conn=> conn);

    try{
        let target_id=req.body.target_id;
        let request_data=req.body.request_data;//terms요청,board요청,faq요청

        var [result_target] = await connection.query(`select * from ${request_data} where ${request_data}_id=${target_id}`);

        connection.release();
   
        return res.json({success:true, message:'result suscesss',result:result_target});//그 회원정보 비번을 바꾸고, 그 이메일로 바꾼 비번을 알려주고, 회원에겐 그 사항을 알려준다.
        
    }catch(err){
        connection.release();

        //console.log('server errors:',err);
        return res.status(403).json({success:false, message:'email exists query server error'});
    }
});
//개인회원 이메일로 하여 비밀번호찾기 새비밀번호 임시생성
app.post('/api/auth/memberuser_newpasswordEmail',async(req,res,next)=>{

    const connection=await pool.getConnection(async conn=> conn);

    try{
       var email=req.body.email;
        var emailTemplate;
        var [user_rows] = await connection.query("select * from user where email=? and user_type='개인'",[email]);//개인회원중 해당 요청 이메일에 대한 회원목록 :회원별로 이메일값은 유니크하다고 가정(적어도 회원종류별 유니크하다고 가정,그런식으로 코드작성되어있음.)

        connection.release();

        if(user_rows.length>=1){
            var mem_id=user_rows[0].mem_id;//고유한 값 하나만 나온다 거의 99.9999%
            var user_info=user_rows[0];//매칭 유저인포.
            var random_newpassword=Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10);//랜덤숫자 5자리의 숫자문자열을 랜덤하게 생성하여 정보수정쿼리후 대상회원 이메일로 새비밀번호(임시)생성 메일보내기.

            await connection.beginTransaction();
            
            var hashed=bcrypt.hashSync(random_newpassword,10);
            
            var [passwordchange_rows]= await connection.query("update user set password=? where mem_id=? and user_type='개인'",[hashed,mem_id]);//암호변경 하여 지정하는 update쿼리(개인회원중 해당 이메일의 회원 )
            await connection.commit();

            connection.release();


           //이메일보내기 
           ejs.renderFile(appdir+'/template/authMail3.ejs',{authCode:random_newpassword,useremail:encodeURIComponent(email)},function(err,data){
               if(err){
                   console.log(err);
                }
               emailTemplate=data;
               console.log('email render datsss:',data);
           });

           let transporter=nodemailer.createTransport({
               service:'gmail',
               host:'smtp.gmail.com',
               port:57,
               tls:{
                   rejectUnauthorized:false
               },
               secure:false,
               auth:{
                   user:'biz@korex.or.kr',
                   pass:'takrcdtdzmenxqxm'
               }
           });
           let mailOptions={
               from:'biz@korex.or.kr',
               to:email,
               subject:'비밀번호 찾기 결과 : 새로운 임시비밀번호 발급',
               html:emailTemplate
           };
           transporter.sendMail(mailOptions,async function(error,info){
               if(error){
                   //console.log('email errorss:',error);
                   return res.status(403).json({success:false,message:'email send failed',result:undefined})
               }
               transporter.close();
           });
            
           return res.json({success:true, message:'user passwordchangequery success and emailsend success',result:user_info});//그 회원정보 비번을 바꾸고, 그 이메일로 바꾼 비번을 알려주고, 회원에겐 그 사항을 알려준다.
        }else{
            connection.rollback();
            connection.release();
            
            return res.status(403).json({success:false, message:'해당 이메일관련된 개인회원이 없습니다!'});//해당 식별자값이 유효하지 않아서 결과가 없는경우.
        }
    }catch(err){
        connection.rollback();
        connection.release();

        //console.log('server errors:',err);
        return res.status(403).json({success:false, message:'email exists query server error'});
    }
});
//중개사,기업,분양사 회원이 비밀번호찾는경우에는 보편적으로 휴대폰번호로 찾으며 세 회원전체종류상에서 휴대폰번호내역존재여부.
app.post('/api/auth/standarduser_newpasswordphone',async(req,res,next)=>{

    const connection=await pool.getConnection(async conn=> conn);

    try{
       var phone=req.body.phone;
        var user_type= req.body.user_type;//비번찾기페이지에서 어떤 유형의 회원이 찾으려고했는지 추적참조.
        console.log('어떤 회원타입(기업,중개사,분양대행사)에서의 회원이 특정번호(유니크)에 대해서 찾으려고했던건지??;',user_type);
        var [user_rows] = await connection.query("select * from user where phone=? and user_type=?",[phone,user_type]);//개인제외회원 전체종류주에서 해당 번호 휴대폰회원내역회원이 존재하는경우를 찾음.

        connection.release();

        if(user_rows.length>=1){
            var mem_id=user_rows[0].mem_id;//고유한 값 하나만 나온다 거의 99.9999%  특정회원종류(기업)에선 같은 번호의 users가 한개이상은 로직상없고, 같은번호로 다른 사업자로해서 생성되고company2,companymember생성되는경우만 있을뿐임.
            var user_info=user_rows[0];//매칭 유저인포.
            var random_newpassword=Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10)+''+Math.ceil(Math.random()*10);//랜덤숫자 5자리의 숫자문자열을 랜덤하게 생성하여 정보수정쿼리후 대상회원 이메일로 새비밀번호(임시)생성 메일보내기.

            await connection.beginTransaction();
            
            var hashed=bcrypt.hashSync(random_newpassword,10);
            //console.log('craeted newpasword,hashed:',random_newpassword,hashed);
            
            var [passwordchange_rows]= await connection.query("update user set password=? where mem_id=? and user_type!='개인'",[hashed,mem_id]);//암호변경 하여 지정하는 update쿼리(개인회원중 해당 이메일의 회원 )
            //console.log('passwordchange_rowsss:',passwordchange_rows);
            await connection.commit();
            connection.release();
            
            //console.log('passworchange_queryss:',passwordchange_rows);
               
            aligosms.send(req,res,'임시비밀번호발급',random_newpassword);
            
            //return res.json({success:true, message:'user passwordchangequery success',result:user_info});//그 회원정보 비번을 바꾸고 알려준다.
        }else{
            connection.rollback();
            connection.release();
            
            return res.status(403).json({success:false, message:'해당 이메일관련된 개인회원이 없습니다!'});//해당 식별자값이 유효하지 않아서 결과가 없는경우.
        }
    }catch(err){
        connection.rollback();
        connection.release();

        //console.log('server errors:',err);
        return res.status(403).json({success:false, message:'email exists query server error'});
    }
});

//개인 회원가입(소셜가입)
app.post('/api/auth/member/registerSocial',async(req,res,next)=> {
    const { usertype,agree_status,user_username }=req.body;
    //console.log('/member/registerSocial 개인회원가입소셜 요청:',req.body);

    try{
        //agree_optional문자열 포함된다면 선택 마케팅정보수신을 동의한것, 선택사항 수신동의한경우 여부 구분
        var is_select_agree=false;
        if(agree_status.indexOf('agree_optional')!=-1){
            is_select_agree=true;
        }else{
            is_select_agree=false;
        }

        //console.log('pool objessts:',pool,pool.getConnection);
        const connection = await pool.getConnection(async conn => conn);

        //user_username(소셜계정별 kakao,facebook,naver,apple식별고유자id 어떻게보면 각 플랫폼별 유니크한 계정정보들 하나하나이고 이건 다른 계정들이다.) 중복검사진행. 
        try{
            var [rows,fields]=await connection.query('select * from user where user_username=? and user_type=?',[user_username,usertype]);

            //console.log('user회원리스트 개인 회원리스트 해당 user_username(플랫폼별 고유계정id정보) 중복여부검사:',rows);

            if(rows.length>0 || rows[0]){
                connection.release();
                return res.status(403).json({success:false, message:'개인 소셜 회원리스트에 이미 가입되어있는 소셜계정정보id 입니다.'});
            }
        }catch(err){
            //console.log('user_username exists query error');
            connection.release();

            return res.status(403).json({success:false, message:'user_username exists query server error'});
        }
        var password_hash=sha256.x2(user_username);//카카오로그인으로 들어온 계정들은 가입처리가 카카오식별id값, 그리고 그를 sha256x2암호화처리한것이 비번이다.
        //var hashed=bcrypt.hashSync(password,10);//sync 동기처리 먼저 받고진행.
        //console.log('소셜계정정보 가입정보 암호화 해시',password_hash);

        var register_types;
        if(user_username.indexOf('kakao')>=0){
            register_types = 'kakao';
        }else if(user_username.indexOf('naver')>=0){
            register_types = 'naver';
        }else if(user_username.indexOf('facebook')>=0){
            register_types = 'facebook';
        }else{
            register_types = 'apple';//나머지 형태의 아이디구조를 띈다면(소셜가입시도시에 애플,카카오,네이버,페이스북)>>>
        }
        try{
            await connection.beginTransaction();
            var [rows,fields]= await connection.query("insert into user(user_type,user_username,register_type,password,mem_admin,create_date,modify_date,mem_notification) values(?,?,?,?,?,?,?,?)",[usertype,user_username,register_types,password_hash,'root',new Date(),new Date(),is_select_agree]);

            await connection.commit();
            connection.release();
            //console.log('user insert rows:',rows);

            return res.json({success:true, message: user_username+'::)회원님 개인회원 소셜 가입이 완료되었습니다.'});
        }catch(err){
            //console.log('뭔 에러인가?:',err);

            await connection.rollback();
            connection.release();

            //console.log('server users insert query error');

            return res.status(403).json({success:false, message:'server users insert query error'});
        }
            
    }catch(err){
        console.error(err);
        return next(err);
    }
});

//팀원 가입처리(기업,중개사,분양대행사)
app.post('/api/auth/team/register',async(req,res,next)=> {
    const { usertype,agree_status,company_id,phone,password,invite_memid_val}=req.body;
    //console.log('/team/reigster 팀 회원가입 요청:',req.body);
    //users에 insert될항목들 
    /*
    팀원가입 users
    유저memid, 유저휴대폰번호값(초대받은), 유저 암호값, 회원가입타입(팀원 어떤 사업체형태의 회원가입인지  :kakao,apple,facebook,naver,korex,team), 생성수정일, 로그인잉ㄹ시, 회원분류, 프로필이미지
    users: mem_id,phone,password,register_type,create_date,modify_date,login_dttm,회원분류
    company_mmeber: cm_id,cp_type,create_date,modify_date, mem_id(users에서 생성된 팀원계정users), 팀원을 등록시킨 초대자등록인(register_mem_id) ,소속아이디 comapny_id, is_invite_garee default 0 회원가입
    */
    try{
        //agree_optional문자열 포함된다면 선택 마케팅정보수신을 동의한것, 선택사항 수신동의한경우 여부 구분
        var is_select_agree=false;
        if(agree_status.indexOf('agree_optional')!=-1){
            is_select_agree=true;
        }else{
            is_select_agree=false;
        }

        //console.log('pool objessts:',pool,pool.getConnection);
        const connection = await pool.getConnection(async conn => conn);

        try{
            //팀원의 경우 특정 유저가 추가를 해주는데, 같은 유저타입중에서 동일휴대폰등록계정여부 검사동일하게진행. 이걸 요청하는 것 자체가 문자 url초대링크로 들어온 유저가 가입요청하는것이며, 임의 번호에 대해서 가입요청한 내역이 있는지 여부 검사함. 이미 있다는것은 이미 그 번호로 가입이 되어있다는것
            var [team_phone_exists_query] = await connection.query("select * from user where phone=? and user_type=?",[phone,usertype]);//삭제되지 않은 or 삭제된(회원탈퇴)된 전체 해당 소속사업체,해당유형,해당 폰번호,가입타임 팀원유형에 대해 가입여부. 임의의 회원은 여러유형의 (기업,중개사,분양사?)에 소속될수도있다는 융통성 임의의 생성된memid유저는 어이든 소속이 바뀌고 수저될수있기에 그 초대하는 업체들의 타입은 맴번다를수있기에 user_type(개인,기업,중개사,분양사)의 여부의 경계가 딱히없음. 전체회원내역에서
            /*시나리오
            01012341234회원에 대해서 무소속상태(팀원삭제되어서 든 포함)이고 a기업,b중개사,c분양사가 이를 초대한 경우에 링크를 통해 가입하려고할때에 users테이블에서 각각 기업회원중 01012341234에대해서 존재하는지,중개사에서,분양사에서 존재여부 조회쿼리하고 존재하면 각 초대자의 소속회원타입 관련된 회원내역중에 존재하는것으로 판단하고 로그인페이지로 이동한다.로그인페이지에서 리다랙션되면서 company_member에도 해당 초대자의 소속하에 존재여부하면 이미 존재하는 것이라고 띄우고,존재하지않으면 초대링크페이지로 이동한다.각 회원타입별 회원자체는 있으나 팀원삭제되었거나 그런경우이다. 정보자체가 없으면 각 그 요청하는 없으면 각 팀원가입페이지이동. 초대하려는 사람의 소속(유저타입)에서의 가입내역.각 번호별 user record계정은(회원타입: 기업,중개사,분양사)별로 독립적으로 여러개 있으며, 중개사회원으로 있는 01012341234에 대해서 다른 임의 중개사들에서 팀원초대로 하려고할시에 가입시에 이미 있는users이기에 users는 미추가하고 , 각 중개사회원의 소속으로써 추가될뿐.플로우상 회원타입별 각 회원은 그 타입에 해당하는 중개사/기업/분양사 업체로부터의 소속리스트들만 있을수있으며, 각 게정별(회원별) 여러 종류(회원종류)의 소속은 가질수는 없게끔.
            */
            if(team_phone_exists_query.length >=1 || team_phone_exists_query[0]){
                connection.release();
                return res.status(403).json({success:false,message:'이미 해당 회원유형 가입자중 존재하고있는 휴대폰입니다.'});
            }       
        }catch(err){
            //console.log('teamone user eisxts quer error',err);
            connection.release();

            return res.status(403).json({success:false, message:'user_username exists query server error'});
        }

        //폰 중복여부까지(팀원의 경우 소속개념이 여러개임.) 통과시에 실행
        var hashed=bcrypt.hashSync(password,10);
        //console.log('bcrypt암호화 진행 복잡도 (salt blur):',hashed);

        var register_types='team';
        
        try{
            await connection.beginTransaction();
            var [rows,fields]= await connection.query("insert into user(mem_admin,phone,password,register_type,user_type,create_date,modify_date,mem_notification,is_deleted) values(?,?,?,?,?,?,?,?,?)",['team',phone,hashed,register_types,usertype,new Date(),new Date(),is_select_agree,0]);
            await connection.commit();
            
            //console.log('user insert rows:',rows);
            //var extract_user_insertid= rows.insertId;

           // await connection.beginTransaction();
            //cp_type:1 팀원 2 관리자
            //var [rows2] = await connection.query("insert into company_member(cm_type,mem_id,register_mem_id,company_id,create_date,modify_date,is_invite_agree) values(?,?,?,?,?,?,?)",[0,extract_user_insertid,invite_memid_val,company_id,new Date(),new Date(),1]);
           // //console.log('===>>company_member insert rows results:',rows2);
            //await connection.commit();

            if(rows){
                connection.release();
                return res.json({success:true, message: '팀원 가입 처리되었습니다.',result: extract_user_insertid});//팀원 가입성공 처리된 memid를 보낸다.
            }else{
                connection.rollback();
                connection.release();
                return res.json({success:false, message: '서버오류가 있습니다.'});
            }
        }catch(err){
            //console.log('뭔 에러인가?:',err);

            connection.rollback();
            connection.release();

            //console.log('server users insert query error');

            return res.status(403).json({success:false, message:'server users insert query error'});
        }
            
    }catch(err){
        connection.release();
        console.error(err);
        return next(err);
    }
});
//팀원로그인페이지(초대용 링크로 접근시에)로 접근한 피초대자에 관련된 게정이 서버에 존재여부검사
app.post('/api/auth/team/Teamuser_exists_request',async(req,res,next)=> {
    const { invite_memid_val,invite_companyid_val,invite_mem_usertype_val, receiver_phone_val, register_type_val}=req.body;//초대한사람memid,초대한사람소속id,초대한사람유저타입(어떤 초대자소속타입로부터 초대된건지) , 피초대자폰, 가입타입:팀원쿼리.팀원가입자 관련 쿼리.
    //console.log('/team/팀 회원 계정존재여부검사:',req.body);
    
    try{
        //console.log('pool objessts:',pool,pool.getConnection);
        const connection = await pool.getConnection(async conn => conn);
                
        try{
            
            //2021-09-17 12:49 생성자(관리자)로 생성된 계정에 대해서도 팀원초대가 가능하게 로직수정
            var [rows,fields]= await connection.query("select * from user where phone=? and is_deleted=0 and user_type=?",[receiver_phone_val, invite_mem_usertype_val]);//해당 팀유형가입자이며,해당 소속사업체이며,휴대폰번호이며,해당소속가입유형인 팀원 모두 만족하는 사실상의 특정 가입된 팀원여부 조회 해당 피초대자(초대자의 소속) 에 해당하는 user 가입(유저생성:유저타입)내역여부 조회한다.
            /*
            해당 초대자id,해당초대자소속id,해당 기업타입(개인기업중개사분양사), 피초대자번호, 가입타입:팀원,코렉스,소셜 여부 .에 대한 내역이 기존 users에 존재하고있던 회원이면 company_member테이블에 추가, 같은 companyid등으로 있느내역이 이미 소속별로 있다면 중복방지로 insert추가. user에서 검사하여 내역이 없다면 팀원가입페이지로 아예 이동!!!TeamRTegister로 아예 이동. 해당 users자체가 없다는것으로 최초 팀원추가자임.
            */

            //console.log('teamuser select query rows:',rows,rows[0]);
            
            if(rows){
                connection.release();

                if(rows.length >=1){
                    //users에서 존재하기만 하면 시스템상에 존재는 하고있는 회원(팀원)정보인것이며 true로써 로그인페이지 머물게한다.
                    //cp_type:1 팀원 2 관리자
                    var find_teamuser_memid= rows[0].mem_id;//찾아낸 해당 user memid 
                    var [rows2] = await connection.query("select * from company_member where mem_id=? and register_mem_id=? and company_id=?",[find_teamuser_memid, invite_memid_val, invite_companyid_val]);//해당 초대자memid이면서,피초대자id유저, 해당 소속체로의 초대내역 초대내역 팀원소속정보가 존재하고있는지 여부 이미 존재하고있으면 굳이 추가는 안한다. 해당 피초대자가 초대자memid이며 초대자소속의 companymember해당초대하려는 사람의 소속compaynind에 소속되어있는지 여부.

                    //console.log('===>>comapny member rows results:',rows2);//팀원초대내역 레코드 리스트있는경우.

                    if(rows2.length >=1){
                        //이미 companymember에 존재하고있는 memid,초대자,companyid소속업체로 이미 있는 내역이라면 insert하지않음.
                        //팀원초대수락까지 한 경우(companymember까지 존재하는경ㅇ 해당 초대자, 해당 소속으로저장 모두 만족)하는 팀원초대내역까지 있는경우와 그렇지 않은경우 (팀원가입으로 user만생성된경우) 이미 해당 소속팀에 존재하는 회원!!

                        return res.json({success:true, message: '이미 해당팀에 존재하는 정보입니다.', type:'already_team_exists'});
                    }else{
                        //팀원회원형태로 user 가입만 된 상황에 접속한경우
                        return res.json({success:true, message: '아직 팀원으로 초대되지or초대수락 하지 않은상태입니다!초대장페이지로 이동합니다.',type:'go_team_invitepage', result:rows[0].mem_id});//해당 memid를 result값으로 넘겨서 어떤 memid user에 대해서 초대장관련 페이지 액션처리할지여부 지정.
                    }
                    
                }else{
                    //users자체가 없던경우. flase로 가입페이지로 이동시킨다.
                    return res.json({success:false, message:'존재하지 않는 팀원입니다.'});
                }
                
            }else{
                //users자체가 없던경우.
                connection.release();
                return res.json({success:false, message:'존재하지 않는 팀원입니다.'});//아예 팀원가입페이지로이동.
            }
        }catch(err){
            //console.log('뭔 에러인가?:',err);
            
            connection.rollback();
            connection.release();

            //console.log('server select query error');

            return res.status(403).json({success:false, message:'server users insert query error'});
        }
            
    }catch(err){
        connection.rollback();
        connection.release();
        console.error(err);
        return next(err);
    }
});
//팀원로그인페이지(초대용 링크로 접근시에)로 접근한 피초대자가 로그인요청시에.(표준로그인페이지에서가 아님) depreactead관련 api 팀원로그인이란것자체가 정식적으로 로그인하는 개념이랑은 틀린게 초대링크로 해서 들어오는것이기에 이것으로 정식로그인은 뭔가 flow가 이상함.
/*app.post('/api/auth/team/team_login_request',async(req,res,next)=> {
    const { login_phone, login_password,user_type, company_id, register_type, mem_admin}=req.body;
    //console.log('/team/팀 로그인 요청 ',req.body);
    
    res.setHeader('Access-Control-Allow-Credentials','true');

    //팀원 초대장링크로 가입완료후 또는 로그인에서 로그인완료후에 모두 초대장펼치기페이지 (참여) 이동시키게끔 flow한다.
    try{
        //console.log('pool objessts:',pool,pool.getConnection);
        const connection = await pool.getConnection(async conn => conn);
                
        try{
            var sql='select * from user where phone=? and is_deleted!=1 and register_type=? and mem_admin="team"';
            var [rows,fields]= await connection.query(sql,[login_phone,register_type]);//팀유형 가입자이며, 휴대폰번호를 가진 유저 로그인시도시에.내역존재하는지??관련 유저내역.

            //console.log('teamuser select query rows:',rows,rows[0]);
            
            if(rows.length == 0 || !rows[0]){
                connection.release();
                return res.status(403).json({success:false, data:null,message:'존재하지 않는 계정입니다.'});
            }else{
                //존재하는 계정정보 발견된거라면
                connection.release();
                const compare_results=bcrypt.compareSync(login_password, rows[0].password);
                if(compare_results){
                    //입력 암호값 입력폰번호(팀원계정 요청)에 대한 암호화 암호도 같으면 적절하게 들어온것

                    res.json({success:true, message:'로그인 성공', result:rows[0].mem_id});
                }else{
                    res.status(403).json({success:false, message:'올바르지 않은 정보'});
                }
            }
            
        }catch(err){
            //console.log('뭔 에러인가?:',err);

            connection.release();

            //console.log('server select query error');

            return res.status(403).json({success:false, message:'server users insert query error'});
        }
            
    }catch(err){
        connection.release();
        console.error(err);
        return next(err);
    }
});*/
//팀원 초대형 링크에서의 가입한 유저 or 로그인성공한 피초대자유저 참여수락한경우에 한해서 요청
app.post('/api/auth/team/companymember_invite_statusProcess',async(req,res,next)=> {
    const { request_mem_id_val,invite_memid_val,company_id,phone}=req.body;

    //console.log('/team/팀 요청유저 mem-id값 상태값변경 및 해당 user로의 가입처리',req.body);
    
    res.setHeader('Access-Control-Allow-Credentials','true');

    //팀원 초대장링크로 가입완료후 또는 로그인에서 로그인완료후에 모두 초대장펼치기페이지 (참여) 이동시키게끔 flow한다.
    try{
        //console.log('pool objessts:',pool,pool.getConnection);
        const connection = await pool.getConnection(async conn => conn);
                
        try{
           /* var sql='update company_member set is_invite_agree=1 where mem_id=?';
            await connection.beginTransaction();
            var [rows,fields]= await connection.query(sql,[team_mem_id]);//특정 팀원유저의 수락동의여부 상태값 변경.
            await connection.commit();
            //console.log('teamuser companymmber updat euqewry:',rows);

            넘어온 authinfo로 가입을 시킵니다.. companymember추가한다.
            */
            await connection.beginTransaction();
            //cp_type:1 팀원 2 관리자
            var [rows] = await connection.query("insert into company_member(cm_type,mem_id,register_mem_id,company_id,create_date,modify_date,is_invite_agree) values(?,?,?,?,?,?,?)",[0,request_mem_id_val,invite_memid_val,company_id,new Date(),new Date(),1]);
            //console.log('===>>company_member insert rows results:',rows);
            await connection.commit();

            connection.release();

            return res.json({success:true,message:'company_member insert*update query susccess'});
    
        }catch(err){
            //console.log('뭔 에러인가?:',err);
            connection.rollback();
            connection.release();

            //console.log('server select query error');

            return res.status(403).json({success:false, message:'server query error'});
        }
            
    }catch(err){
        connection.rollback();
        connection.release();
        console.error(err);
        return next(err);
    }
});
//기업 회원가입
app.post('/api/auth/company/register',async(req,res,next)=> {
    const { email,name,password,phone,usertype,agree_status, businessname,businessnumber }=req.body;
    console.log('/company/register 기업회원가입 요청(비동기형태 호출 형태 함수 실행체):',req.body);
    try{
        //이메일,폰번호 중복검사진행. 전체종류 회원에서 이메일/폰번호 중복검사진행.기업회원에서 해당 이메일/폰번호 중복 검사진행.
        //개인에서 01055878970으로 가입했었고, 기업에서 같은번호로 가입됀거 없으면 가입가능,각 종류별 한개씩은 이메일,폰번호 유니크하게 등록가능.

        //사업자등록번호users테이블에 이미 있는 root_businessnumber, business_number인지 구한다.사업자등록번호는 기업에서 1231212345가입한게 있다면 다른 회원가입에서 동일번호로 못하게.
        //본인이 대표가 아닌경우는 기업의 경우 사업자번호,상호명 없이 넘어오는데 이때 ''값으로 쿼리를 하면 안되기에, 빈값이 아닌경우(본인이 대표)인 경우에만 쿼리한다.
        //console.log('pool objexts??',pool,pool.getConnection);
        const connection = await pool.getConnection(async conn => conn);

        //agree_optianiol 문자열 포함한다면 선택 만케팅정보수신을 동의한거다. 선택사항 수신동의한경우,여부 구분
        var is_select_agree=false;
        if(agree_status.indexOf('agree_optional')!=-1){
            is_select_agree=true;
        }else{
            is_select_agree=false;
        }

        //임의 기업 팀원으로써의 유저가 같은 번호로 가입하려는 상황속에서 새로운 사업자로 가입하는것은 허용한다.
        try{
            var [rows,fields] = await connection.query('select * from company2 where company_no=? and type="기업"',[businessnumber]);

            //console.log('company테이블에서 이미 존재하는 사업자번호인지 여부 검사',rows);

            if(rows.length > 0 || rows[0]){
                connection.release();
                return res.status(403).json('이미 등록되어있는 사업자정보입니다.');
            }
        }catch(err){
            console.log('company table eixts query error',err);
            connection.release();

            return res.status(403).json('server or query error');
        }

        //user에서 해당 기업회원리스트중에서 해당 폰번호의 유저가 있는지 여부 검사한다. user에서는 기업회원리스트에서 해당 폰번호 중복여부 검사 폰번호 중복검사. 탈퇴,비탈퇴 전체 회원 기업가입자(탈퇴자,비탈퇴자)중 전체에서 검사하기에 전체내역에서 해당 가입시도하려는 번호에대한 내역 여부 검사.기업가입시도자중에서 기업 탈퇴회원까지 포함한 내역중 해당 폰번호에 대한 존재여부검사.
        try{
            var [rows,fields]= await connection.query("select * from user where phone=? and user_type=?",[phone,usertype]);
            
            //console.log('user 회원리스트 기업회원리스트중에서 입력폰번호 중복여부 검사',rows);
            
            if(rows.length > 0 || rows[0]){
                let related_mem_id=rows[0].mem_id;

                await connection.beginTransaction();
                var [rows,fileds] = await connection.query("insert into company2(reg_dttm,mod_dttm,type,company_name,company_no,reg_user_id) values(?,?,?,?,?,?)",[new Date(),new Date(),usertype,businessname,businessnumber,related_mem_id]);//신규 입력 정보등 기업정보등으로 해서 가입 사업자추가한다.사업자만 추가. 팀원테이블에 추가되는게 키포인트..
                await connection.commit();

                //이미 해당 존재하는 유저정보로 해서 회사팀원테이블가입시킨다. 해당 번호의 기 유저가 새사업자 팀원 소속으로써 관리자권한 생성(소속추가)
                await connection.beginTransaction();
                var [rowss] = await connection.query("insert into company_member(cm_type,mem_id,register_mem_id,company_id,create_date,modify_date,is_invite_agree) values(?,?,?,?,?,?,?)",[1,related_mem_id,related_mem_id,rows.insertId,new Date(),new Date(),1]);
                await connection.commit();

                connection.release();

                //이미 유저테이블에 관련된 가입하려는 번호의 타입으로 있다면 해당식별자로써 사업자테이블에 사업자생성합니다.(동일번호의 특정회원식별자로써 사업자새로생성), 임의의 하나의 번호의 회원이 여러개 사업자생성가능 , 팀원테이블에 해당 사업자식별자와 유저식별자 관리자권한 가진 팀원생성>>
                return res.status(403).json('기업 회원리스트에 이미 가입되어있는 휴대폰번호입니다.');
            }
        }catch(err){
            console.log('phone eixsts query error',err);
            connection.release();

            return res.status(403).json('phone eixsts server query error');
        }

        //폰 중복여부까지(회원별 유니크)통과시에 실행
        var hashed=bcrypt.hashSync(password,10);
        //console.log('bcrypt암호화 진행 복잡도 (salt blur):',hashed);

        //가입처리 진행 (기업회원) user,company테이블 inserted or update진행.
        try{
            
            //사업자중복,휴대폰 중복 통과시에 처리한다. 새로운사업자로만 한다면 가입은 가능하며, 기존 정보있는 중복회원정보라면 사업자만 신규추가한다. 사업자정보새거,유저정보도 새것이라면 새로운 회원가입(기존회원중)기존회원이 새로운사업자 여는케이스는 아님.
            await connection.beginTransaction();
            var [rows,fields]= await connection.query("insert into company2(reg_dttm,mod_dttm,type,company_name,company_no ) values(?,?,?,?,?)",[new Date(),new Date(),usertype,businessname,businessnumber]);

            await connection.commit();
            //connection.release();

            //console.log('company insert rows:',rows);

            var connection_local = await pool.getConnection(async conn => conn);//추가 insert작업용 커넥션풀
            //console.log('connection local get local gets:',connection_local,connection_local.query);

            if(rows && rows.insertId){
                //console.log('company insert query successss===================');
                let insert_companyid=rows.insertId;

                var hashed=bcrypt.hashSync(password,10);
                //console.log('bcrypt암호화 진행 복잡도 (salt blur):',hashed);

                await connection_local.beginTransaction();
                var [rows2,fields2]= await connection_local.query('insert into user(company_id,user_name,phone,password,user_type,register_type,mem_admin,create_date,modify_date,mem_notification) values(?,?,?,?,?,?,?,?,?,?)',[insert_companyid,name,phone,hashed,usertype,'korex','root',new Date(),new Date(),is_select_agree]);

                await connection_local.commit();
                connection_local.release();

                //console.log('user insert rows:',rows2);
            
                if(rows2 && rows2.insertId){
                    let insert_memid=rows2.insertId;

                    await connection.beginTransaction();
                    var [updaterows] = await connection.query('update company2 set reg_user_id=? where company_id=?',[insert_memid,insert_companyid]);
                    await connection.commit();

                    //해당 새로 추가되는 회원은 insert_memid,insert_companyid 새로추가한 사업자가입자로써의 소속의 팀원소속을 갖게된다. comapnymebmer회사의 소속원인것이지
                    await connection.beginTransaction();
                    var [queryss]= await connection.query("insert into company_member(cm_type,mem_id,register_mem_id,company_id,create_date,modify_date,is_invite_agree) values(?,?,?,?,?,?,?)",[1,insert_memid,insert_memid,insert_companyid,new Date(),new Date(),1])
                    await connection.commit();

                    connection.release();

                    //console.log('company테이블 update query setting 쿼리결과:',updaterows);

                    return res.json(phone+'::)회원님 기업회원 가입이 완료되었습니다.');
                }else{
                    return res.status(403).json('server insert query error');
                }
            }
        }catch(err){
            console.log('뭔 에러인가??:',err);

            await connection.rollback();
            connection.release();
            await connection_local.rollback();
            connection_local.release();
            
            //console.log('server users or business insert query error');

            return res.status(403).json('server users or business insert query error');
        }

    }catch(err){
        console.error(err);
        return next(err);
    }
});
//기업 사업자등록번호 인증 조회.홈택스 api
app.post('/api/auth/company/crNumber_validation',async function(req,res){
    let req_body=req.body;

    console.log('get crnumber validation Test::',req_body);

    try{
        console.log('axiosss:',axios);
        var crNumber=req_body.crNumber;//사업자번호 넘어온거.입력값.
       // var crNumber = '2208102810'; //220-81-02810 tfc임의 사업자번호 테스트
        var validation_result;
        postCRN(crNumber).catch(err => { 
            console.log('err발생:',err); 

            return res.json({success:false, result:undefined});
        }).then(result => { 
            console.log('POSTCRN ->> PRMOMISE GETCRRESULTXFROMXML -> XML2JSPARSINGSTRING -> CRNUMBER REUTNR result',result);

            validation_result = result;

            return res.json({success:true, result:validation_result});
        });

        function postCRN(crn){
            console.log('POSTCRN호출::',crn);
            return new Promise((resolve,reject) => {
                axios.post(postUrl,xmlRaw.replace(/\{CRN\}/,crn),
                { headers: {'Content-Type':'text/xml'}})
                .catch(err => reject(err))
                .then(result => {
                    //console.log('postcrn promise axiso request요청 결과 result::',result);
                    getCRNresultFromXml(result['data']) //api응답의 data텍스트 파싱
                    .catch(err => reject(err))
                    .then(CRNumber => {
                        resolve(CRNumber)
                    })
                })
            })
        }

        function getCRNresultFromXml(dataString){
            //console.log('GETCRNSREULT FROM XML함수 호출::',dataString);
            return new Promise((resolve,reject) => {
                xml2js.parseString(dataString, //api응답의 data지정된 xml값 추출 파싱
                    (err,res) => {
                        //console.log('xml2js parseStrign결과값:',err,res,res.map.trtCntn);
                        if(err) reject(err)
                        else resolve({trtcntn: res.map.trtCntn[0], message: res.map.smpcBmanTrtCntn[0], messageEng: res.map.smpcBmanEnglTrtCntn[0]}) //trtCntn이라는 tag의값을 get
                    })
            })
        }

        //return res.json({success:true, result:validation_result});
    }catch(err){
        //console.log('server error:',err);

        return res.status(403).json({success:false, result: undefined });
    }
});

//분양대행사 회원가입
app.post('/api/auth/agency/register',async(req,res,next)=> {
    const { agree_status,businessname,businessnumber,email,name,password,phone,usertype }=req.body;
    //console.log('/agency/register 분양대행사 회원가입 요청(비동기형태 호출 형태 함수 실행체):',req.body);
    try{
        
        //분양대행사때에도 검사를 하나??? 
        //console.log('pool objexts??',pool,pool.getConnection);
        const connection = await pool.getConnection(async conn => conn);

        //agree_optional문자열을 포함한다면 선택 마케팅정보수신을 동의한것이다. 선택사항 수신동의한경우..수신동의하지 않았다면!! true or false
        var is_select_agree=false;
        if(agree_status.indexOf('agree_optional')!=-1){
            is_select_agree=true;
        }else{
            is_select_agree=false;
        }
        
        //가입하려는 중개사회원의 사업자번호가 중개사기업리스트중에서 존재하는건지
        try{
            //기업테이블에서 해당 businessnumber이며 중개사기업종류인 회사리스트존재여부 존재하는 사업자번호인지(중개사기업)
            var [rows,fields]= await connection.query("select * from company2 where company_no=? and type='분양대행사'",[businessnumber]);
            
            //console.log('company 테이블에서 이미 존재하는 사업자등록번호인지 여부 검사',rows);
            
            if(rows.length > 0 || rows[0]){
                connection.release();
                return res.status(403).json('분양대행사 기업중에서 이미 등록되어있는 사업자등록번호입니다.');
            }
        }catch(err){
            //console.log('company table eixsts query error');
            connection.release();

            return res.status(403).json('server or query error');
        }
        
        //중복여부 통과했으면..user에서 검사를 하는데, companay->users순으로 insert처리. user에서는 user_type중개사회원리스트중에서 해당 폰번호로 중복여부검사, 폰번호 중복검사. 전체회원(탈퇴자까지포함) 분양사 내역중에서 해당 폰번호내역검사 탈퇴자에 해당하는 폰번호정보로 가입하려고 하는경우 막을수있음.
        try{
            var [rows,fields] = await connection.query("select * from user where phone=? and user_type=?",[phone,usertype]);//해당 타입이면서 해당 번호가 존재하는지 폰 중복검사.

            //console.log('user회원리스트 분양사회원리스트중에서 입력폰번호 중복여부 검사',rows);

            if(rows.length > 0 || rows[0]){

                let related_mem_id=rows[0].mem_id;
                //이미 있는 분양사회원정보로 휴대폰번호로 가입하였으나 그 사업자정보는 다른것으로 가입시도하는 경우에는 기존 분양사회원users는 그대로 유지한채 팀원테이블소속 새로추가한 사업자정보로 꾸려지게끔 한다.
                await connection.beginTransaction();
                var [rows,fields] = await connection.query("insert into company2(reg_dttm,mod_dttm,type,company_name,company_no,reg_user_id) values(?,?,?,?,?,?)",[new Date(),new Date(),usertype,businessname,businessnumber,related_mem_id]);
                await connection.commit();

                await connection.beginTransaction();
                var [rows] = await connection.query("insert into company_member(cm_type,mem_id,register_mem_id,company_id,create_date,modify_date,is_invite_agree) values(?,?,?,?,?,?,?)",[1,related_mem_id,related_mem_id,rows.insertId,new Date(),new Date(),1]);
                await connection.commit();

                connection.release();
                return res.status(403).json('분양대행사 회원리스트에 이미 가입되어있는 휴대폰번호입니다.기존 가입정보로 새로운사업자정보 개설하였습니다.');
            }
        }catch(err){
            //console.log('user table exits phone exists query error');
            connection.release();
            
            return res.status(403).json('server or query error');
        }

        //가입처리 진행 users,company테이블 inserted or updated진행.
        try{
            await connection.beginTransaction();
            var [rows,fields] = await connection.query("insert into company2(reg_dttm,mod_dttm,type, company_name, company_no) values(?,?,?,?,?)",[new Date(),new Date(),usertype,businessname,businessnumber]);
            await connection.commit();
            //connection.release();

            //console.log('company insert rows:',rows);

            var connection_local = await pool.getConnection(async conn => conn);//추가 insert작업용 커넥션풀
            //console.log('connection local cget local gets:',connection_local,connection_local.query);

            if(rows && rows.insertId){
                //return res.json(name+','+phone+'::) 회원님 가입이 완료되었습니다.');
                //insert성공시에 정보에 insertId 기입된다. users삽입 성공시에 business에도 넣는다.
                
                //console.log('comapny insert query susccess:========');
                let insert_companyid=rows.insertId;

                var hashed=bcrypt.hashSync(password,10);
                //console.log('bcrypt암호화 진행 복잡도 (salt blur):',hashed);

                await connection_local.beginTransaction();
                var [rows2,fields2] = await connection_local.query("insert into user(company_id,user_name,phone,password,user_type,register_type,mem_admin,create_date,modify_date,mem_notification) values(?,?,?,?,?,?,?,?,?,?)",[insert_companyid,name,phone,hashed,usertype,'korex','root',new Date(),new Date(),is_select_agree]);
                let insert_userid=rows2.insertId;//삽입하여 생긴 유저아이디(고유아이디)분양대행사 최초생성자의 memid또한 companymember에 추가.분양사에 한해서 생성자도 companymember에 포함될수있게끔한다. 생성자+팀원들(분양소속 모든 인간들)로 관리를 하면 코렉스 관리자에서 그 분양소속 인간들에게 특정하여 companymember하에서 bp_id로 분양프로젝트 부여..
                //팀원으로써의 가입자(생성자),초대자 동일하게.초대개념으로 가입이 아님.
                var [companymember_rows] = await connection.query("insert into company_member(cm_type,mem_id,register_mem_id,company_id,create_date,modify_date,is_invite_agree) values(?,?,?,?,?,?,?)",[1,insert_userid,insert_userid,insert_companyid,new Date(),new Date(),1]);

                await connection_local.commit();
                connection_local.release();  

                //console.log('user insert rows:',rows2);
                //console.log('companymember insert rowsss:',companymember_rows);
             
                if(rows2 && rows2.insertId && companymember_rows){
                    //company,users에 모두 정보 insert성공시에 update형태의 쿼리 진행!
                    let insert_memid=rows2.insertId;//추가된 user테이블 추가된 mem_id값
                    
                    await connection.beginTransaction();
                    var [updaterows]= await connection.query("update company2 set reg_user_id=? where company_id=?",[insert_memid,insert_companyid]);
                    await connection.commit();
                    connection.release();

                    //console.log('company테이블 update query setting 쿼리결과:',updaterows);

                    return res.json(phone+'::) 회원님 분양대행사 회원 가입이 완료되었습니다.');
                }else{
                    //여기에 온다는것은 business insert쿼리가 뭔가 안되었다는것임. 
                    return res.status(403).json('server insert query error');
                }
            }
            
        }catch(err){
            //console.log('뭔 에러인가??:',err);

            await connection.rollback();
            connection.release();
            await connection_local.rollback();
            connection_local.release();

            //console.log('server users or business insert query error!!');
            
            return res.status(403).json('server users or business insert query error');
        }

    }catch(err){
        console.error(err);
        return next(err);
    }
});
//분양대행사 사업자등록번호 인증 조회.홈택스 api
app.post('/api/auth/agency/crNumber_validation',async function(req,res){
    let req_body=req.body;

    //console.log('get crnumber validation Test::',req_body);

    try{
        var crNumber=req_body.crNumber;//사업자번호 넘어온거.입력값.
       // var crNumber = '2208102810'; //220-81-02810 tfc임의 사업자번호 테스트
        var validation_result;
        postCRN(crNumber).catch(err => { 
            console.log('err발생:',err); 
            return res.json({success:false, result:undefined})
        }).then(result => { 
            console.log('POSTCRN ->> PRMOMISE GETCRRESULTXFROMXML -> XML2JSPARSINGSTRING -> CRNUMBER REUTNR result',result);

            validation_result = result;

            return res.json({success:true, result:validation_result});
        });

        function postCRN(crn){
            //console.log('POSTCRN호출::',crn);
            return new Promise((resolve,reject) => {
                axios.post(postUrl,xmlRaw.replace(/\{CRN\}/,crn),
                { headers: {'Content-Type':'text/xml'}})
                .catch(err => reject(err))
                .then(result => {
                    //console.log('postcrn promise axiso request요청 결과 result::',result);
                    getCRNresultFromXml(result['data']) //api응답의 data텍스트 파싱
                    .catch(err => reject(err))
                    .then(CRNumber => {
                        resolve(CRNumber)
                    })
                })
            })
        }

        function getCRNresultFromXml(dataString){
            //console.log('GETCRNSREULT FROM XML함수 호출::',dataString);
            return new Promise((resolve,reject) => {
                xml2js.parseString(dataString, //api응답의 data지정된 xml값 추출 파싱
                    (err,res) => {
                        //console.log('xml2js parseStrign결과값:',err,res,res.map.trtCntn);
                        if(err) reject(err)
                        else resolve({trtcntn: res.map.trtCntn[0], message: res.map.smpcBmanTrtCntn[0], messageEng: res.map.smpcBmanEnglTrtCntn[0]}) //trtCntn이라는 tag의값을 get
                    })
            })
        }

        //return res.json({success:true, result:validation_result});
    }catch(err){
        //console.log('server error:',err);

        return res.status(403).json({success:false, result: undefined });
    }
});

//중개사 회원가입
app.post('/api/auth/broker/register',async(req,res,next)=> {
    const { agree_status,name,password,phone,usertype,businessnumber,businessname,mngno,regno,addrraw,addrjibun,addrroad,x,y }=req.body;
    //console.log('/broker/register 중개사회원가입 요청(비동기형태 호출 형태 함수 실행체)/ 유저단에서 가입이 치뤄지는경우(clc조회성공 및 사업자조회성공케이스)',req.body);
    try{
        
        //중개사때 또한 중복된 사업자번호여부 검사하나??? 
        //console.log('pool objexts??',pool,pool.getConnection);
        const connection = await pool.getConnection(async conn => conn);

        var is_select_agree;
        if(agree_status.indexOf('agree_optional')!=-1){
            is_select_agree=true;
        }else{
            is_select_agree=false;
        }

        //가입하려는 중개사회원의 사업자번호가 중개사기업리스트중에서 존재하는건지
        try{
            //기업테이블에서 해당 businessnumber이며 중개사기업종류인 회사리스트존재여부 존재하는 사업자번호인지(중개사기업)
            var [rows,fields]= await connection.query("select * from company2 where company_no=? and type='중개사'",[businessnumber]);
            
            //console.log('company테이블에서 이미 존재하는 사업자등록번호인지 여부 검사',rows);
            
            if(rows.length > 0 || rows[0]){
                connection.release();
                return res.status(403).json('중개사 기업중에서 이미 등록되어있는 사업자등록번호입니다.');
            }
        }catch(err){
            //console.log('company table eixsts query error');
            connection.release();

            return res.status(403).json('server or query error');
        }

        //중복여부 통과했으면..users에서 검사를 하는데, companay->users순으로 insert처리. user에서는 user_type중개사회원리스트중에서 해당 폰번호로 중복여부검사, 폰번호 중복검사.중개사였으면,기업였으면,분양사였으면 그 타입의 회원중에서 해당번호로 가입된 내역을 찾는다. 그게 팀원였는지 생성자였는지 상관없이 내역이 있었다면 01055878970의 중개사생성자회원였던 팀원존재였던간에 상관없이 적어도 이 번호가 같은 중개사에서 유니크한값인것은 자명함. 그번호의 식별자로써 사업자테이블(comapny2)에 사업자 생성한다.(등록인 칼럼에 해당 유저식별자memid)로써 신규사업자로 생성 / 즉 기존 중개사팀원였던 해당번호회원에 대해서 users는 추가되는게 아니라 company2가 여러개 추가가능. comapny2에서 등록인 memid를 통해서 해당 사업체를 최초생성한 회원대상을 얻을수도이있고, 특정memid유저가 어떤어떤 소속사업체를 등록했었는지도 알수있음. 유저테이블에 
        try{
            var [rows,fields] = await connection.query("select * from user where phone=? and user_type=?",[phone,usertype]);//해당 타입이면서 해당 번호가 존재하는지 폰 중복검사.중개사회원중 전체 회원중개사 기존리스트중(탈퇴자까지포함) 폰번호에 대한 내역여부 검사. 탈퇴한 ㅎ중개사회원정보 폰정보로 가입하려고시도시에 막을수있다.

            //console.log('user회원리스트 중개회원리스트중에서 입력폰번호 중복여부 검사',rows);

            if(rows.length > 0 || rows[0]){

                let related_memid=rows[0].mem_id;//해당 유저 관련 유저정보(기존유저정보)

                await connection.beginTransaction();
                var [rows,fields]=await connection.query("insert into company2(reg_dttm,mod_dttm,company_name,company_no,realtor_reg_no,ceo_name,ceo_phone,addr_jibun,addr_road,x,y,type,is_pro,company_reg_path,realtor_reg_path,mngno,reg_user_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[new Date(),new Date(),businessname,businessnumber,regno,name,phone,addrjibun,addrroad,x,y,usertype,0,company_reg_path,realtor_reg_path,mngno,related_memid]);
                await connection.commit();

                //기 가입된 중개사팀원관련된 회원memid관련하여 식별자값으로 , 새로 꾸린 사업자companyid로 해서 소속추가 생성.
                await connection.beginTransaction();
                var [rowsss] = await connection.query("insert into company_member(cm_type,mem_id,register_mem_id,company_id,create_date,modify_date,is_invite_agree) values(?,?,?,?,?,?,?)",[1,related_memid,related_memid,rows.insertId,new Date(),new Date(),1]);
                await connection.commit();

                connection.release();
                //console.log('company2 insert관련 쿼리 진행완료>>>:',rows);
                //이미 유저테이블 관련된 가입하려는 번호의 타입으로 있으면 해당 식별자로써 사업자테이블에 사업자 생성(동일번호의 특정회원식별자로써 사업자새로 생성, 임의의 하나의 번호의 회원이 여러개 사업자생성가능)
                //팀원테이블에 해당 사업자식별자와 유저식별자 관리자권한 가진 팀원생성>>> 01055878970 83 소속팀원였던거에 대해서 같은회원이 새사업자로 가입하려는 경우 기존사업자로 되어있는것이면 안 시킴. 새 사업자로써 추가가 되면 해당사업자식별자소속이며,유저식별자로써 생성돈 관리자권한 팀원생성>>

                return res.status(403).json('중개사 회원리스트에 이미 가입되어있는 휴대폰번호입니다. 기 가입자정보로 하여 새로운사업자 개설하였습니다.');
            }
        }catch(err){
            //console.log('user table exits phone exists query error');
            connection.release();
            
            return res.status(403).json('server or query error');
        }

        //가입처리 진행 users,company테이블 inserted or updated진행.
        try{
            //해당 폰번호,대표명,사업자번호값을 가진 값이 기존 신규중개사등록 내역에 존재하는지 검색하여 존재했다면 그 정보도 붙여서 가입시킴.
            var [realtor_identify_existsquery] = await connection.query("select * from realtor_identify2 where ceo_name=? and ceo_phone=? and company_no=?",[name,phone,businessnumber]);
            //console.log('>>>relator_identify_existsquery::',realtor_identify_existsquery);
            if(realtor_identify_existsquery.length>=1){
                var company_reg_path = realtor_identify_existsquery[0].company_reg_path;
                var realtor_reg_path = realtor_identify_existsquery[0].realtor_reg_path;
            }else{
                var company_reg_path='';
                var realtor_reg_path='';
            }
            //유저테이블에 맞는 정보가 없었다면 사업자 생성하고(새로추가하려고하는 그 사업자로써) 요청한 정보로 해서 유저를 생성한다. 그리고 그 생성한 유저식별자로써 사업자를 update한다. 해당 생성유저식별자는 해당 생성사업자정보의 소속된 생성자 관리자자권한은로써 팀원개념생성>>
            await connection.beginTransaction();
            var [rows,fields] = await connection.query("insert into company2(reg_dttm,mod_dttm,company_name,company_no, realtor_reg_no, ceo_name,ceo_phone,addr_jibun,addr_road,x,y,type, is_pro, company_reg_path, realtor_reg_path, mngno) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[new Date(),new Date(),businessname,businessnumber,regno,name,phone,addrjibun,addrroad,x,y,usertype,0,company_reg_path,realtor_reg_path,mngno]);
            await connection.commit();
            //connection.release();

            //console.log('company insert rows:',rows);

            var connection_local = await pool.getConnection(async conn => conn);//추가 insert작업용 커넥션풀
            //console.log('connection local get local gets:',connection_local,connection_local.query);

            if(rows && rows.insertId){
                //return res.json(name+','+phone+'::) 회원님 가입이 완료되었습니다.');
                //insert성공시에 정보에 insertId 기입된다. users삽입 성공시에 business에도 넣는다.
                
                //console.log('comapny insert query susccess:========');
                let insert_companyid=rows.insertId;

                var hashed=bcrypt.hashSync(password,10);
                //console.log('bcrypt암호화 진행 복잡도 (salt blur):',hashed);

                await connection_local.beginTransaction();
                var [rows2,fields2] = await connection_local.query("insert into user(company_id,phone,user_name, password,user_type,register_type,mem_admin,create_date,modify_date,mem_notification) values(?,?,?,?,?,?,?,?,?,?)",[insert_companyid,phone,name,hashed,usertype,'korex','root',new Date(),new Date(),is_select_agree]);

                await connection_local.commit();
                connection_local.release();  

                //console.log('user insert rows:',rows2);
                
                if(rows2 && rows2.insertId){
                    //company,users에 모두 정보 insert성공시에 update형태의 쿼리 진행!
                    let insert_memid=rows2.insertId;//추가된 user테이블 추가된 mem_id값
                    
                    await connection.beginTransaction();
                    var [updaterows]= await connection.query("update company2 set reg_user_id=? where company_id=?",[insert_memid,insert_companyid]);
                    await connection.commit();

                    await connection.beginTransaction();
                    var [rowssss] = await connection.query("insert into company_member(cm_type,mem_id,register_mem_id,company_id,create_date,modify_date,is_invite_agree) values(?,?,?,?,?,?,?)",[1,insert_memid,insert_memid,insert_companyid,new Date(),new Date(),1]);
                    connection.release();
                    await connection.commit();

                    //console.log('company테이블 update query setting 쿼리결과:',updaterows);

                    return res.json(phone+'::) 회원님 중개사 회원 가입이 완료되었습니다.');
                }else{
                    //여기에 온다는것은 business insert쿼리가 뭔가 안되었다는것임. 
                    connection.release();
                    return res.status(403).json('server insert query error');
                }
            }
            
        }catch(err){
            //console.log('뭔 에러인가??:',err);

            await connection.rollback();
            connection.release();
            await connection_local.rollback();
            connection_local.release();

            //console.log('server users or business insert query error!!');
            
            return res.status(403).json('server users or business insert query error');
        }

    }catch(err){
        console.error(err);
        return next(err);
    }
});
//중개사 인증 요청request(신규로 중개사 인증을 요청하는 경우에 처리)
app.post('/api/auth/broker/brokerVerifyRequest',awsS3.upload.fields([{name:'businessmanpath'},{name:'mediationpath'}]),async(req,res,next)=> {
    const { repname,phone, businessnumber  }=req.body; //대표명,대표휴대폰,사업자번호, 사업자등록증,중개등록증첨부 파일등(file데이터) 넘어온다.
    //console.log('/broker/brokerVerifyRequest 중개사 인증 요청(비동기형태 호출 형태 함수 실행체):',req.body,req.files);
    try{
        if(req.files && req.body){
            const realtorauth_uploadfiles_array = await register_(req.files, req.body);
            // const images= await register_(req.files, req.body);
            //console.log('process imagesss:',images);
            //console.log('pool objexts??',pool,pool.getConnection);
            const connection = await pool.getConnection(async conn => conn);
            
            // var image_base_path='https://korexdata.s3.ap-northeast-2.amazonaws.com/';
            // var target_folder=req.body.folder;//특정 관련 타깃폴더(relator_auth?)
            // var realtorauth_uploadfiles_array=[];//관련 폴더에 관련하여 올릴(사업자등록증,중개등록증파일) 파일 저장 array   사업자등록증파일하나, 중개등록증파일하나 일단 두개파일이 업로드는 필수이고 두개파일 (사업자등록증,중개등록증)순서대로 오나?

            // if(images && images.length >=1){
            //     for(let i=0; i<images.length; i++){
            //         let image_actual_name = images[i];
            //         realtorauth_uploadfiles_array.push(target_folder+'/'+image_actual_name);
            //     }
                //console.log('uploaeded or stored예정 realturauth rpofiel path arrayss:',realtorauth_uploadfiles_array, realtorauth_uploadfiles_array.join(','));
            // }
            //중개사 인증 요청에 그냥 계속 inserted요청을 가한다. 같은번호로 여러번 신청가능하게(재신청해야할수도있음)
            try{
                await connection.beginTransaction();
                var [rows,fields] = await connection.query("insert into realtor_identify2(reg_dttm,mod_dttm,company_no,ceo_name,ceo_phone,company_reg_path,realtor_reg_path) values(?,?,?,?,?,?,?)",[new Date(),new Date(),businessnumber, repname,phone,realtorauth_uploadfiles_array[0],realtorauth_uploadfiles_array[1]]);
                await connection.commit();
                connection.release();

                //console.log('brokerIdentitfy(realtorIdenfity2) insert rows:',rows);
                if(rows && rows.insertId){
                    //return res.json(name+','+phone+'::) 회원님 가입이 완료되었습니다.');
                    //insert성공시에 정보에 insertId 기입된다. users삽입 성공시에 business에도 넣는다.
                    
                    //console.log('brokerIdentify(realtorIdentify2) insert query susccess:========',rows);
                    let insert_id=rows.insertId;

                    return res.json({success:true, messsage:'중개사 신규등록요청 성공했습니다.'});              
                }else{
                    //여기에 온다는것은 쿼리가 뭔가 안되었다는것임. 
                    return res.status(403).json({success:false, message:'중개사 신규등록요청 실패했습니다'});
                }
                
            }catch(err){
                //console.log('뭔 에러인가??:',err);

                await connection.rollback();
                connection.release();

                //console.log('server or insert query error!!');
                
                return res.status(403).json({success:false, message:'서버오류.'});
            }
        }
        
    }catch(err){
        console.error(err);
        return next(err);
    }
});

//개인 로그인
app.post('/api/auth/member/login',async function(req,res,next){
   // res.setHeader('Access-Control-Allow-Credentials', 'true');
    //res.setHeader('Access-Control-Allow-Origin:','*');
   //res.writeHead(200, {'Access-Control-Allow-Origin':'*'})
   res.setHeader('Access-Control-Allow-Credentials', 'true');

    let body=req.body;
    ////console.log('request_origin:',req);
    //console.log('req.body:',body);
    var req_email=body.login_email;
    var req_password=body.login_password;

    //console.log('개인 로그인 요청 passport 쓰지 않고 post요청:',req_email,req_password);

    const connection= await pool.getConnection(async conn => conn);

    try{
        var sql="select * from user where email=? and user_type='개인' and is_deleted!=1";//회원종류별 이메일 유니크하게 접속이기에 개인으로 xxxx메일로 로그인시도했으면 전체회원이 아니라, 개인에서 xxx메일 여부가 있는지검사
        var [users_email_exists,fields]=await connection.query(sql,[req_email]);

        //console.log('users테이블에서 입력 email 검사 진행:',users_email_exists);

        if(users_email_exists.length == 0 || !users_email_exists[0]){
            connection.release();
            //rows 길이가 0이고, 결과index체가 없는경우!
            return res.status(403).json({success:false, data:null, message:'이메일 혹은 암호가 올바르지 않습니다.'});
        }else{
            //이메일이 존재하는 이메일이라면, 개인에서 존재하는 이메일이라면
            connection.release();
            const compare_results=bcrypt.compareSync(req_password,users_email_exists[0].password);
            if(compare_results){
                //입력 암호값,입력이메일에 대한 계정(개인) 암호가 암호화한게 서로 비교해서 같으면, 개인의 xxx이메일에 대한 적절암호로 입력한것.
                req.session.user_id=users_email_exists[0].mem_id;
                req.session.islogin=true;

                req.session.save(function(){
                    res.json({success:true, data:users_email_exists[0],message:'로그인 성공!'});
                });
            }else{
                res.status(403).json({success:false, data:null, message:'이메일 혹은 암호가 올바르지 않습니다.'});
            }
        }
    }catch(err){
        //console.log('server or query Errror');
        connection.release();
        return res.status(403).json('users email exists query server error');
    }     
});

//기업 로그인(팀원or관리자 여부 상관없이 로그인  mem_admin은 그냥 권한여부이고, register_type:소셜가입or 코렉스(최초가입자) or team(최초가입자 초대로 이뤄진가입)) 
app.post('/api/auth/company/login',async function(req,res,next){
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
     //res.setHeader('Access-Control-Allow-Origin:','*');
    //res.writeHead(200, {'Access-Control-Allow-Origin':'*'})
    res.setHeader('Access-Control-Allow-Credentials', 'true');
 
     let body=req.body;
     ////console.log('request_origin:',req);
     //console.log('req,body:',body);
     var req_phone=body.login_phone;
     var req_password=body.login_password;
 
     //console.log('기업 로그인 요청 passport 쓰지 않고 post요청:',req_phone,req_password);
 
     const connection= await pool.getConnection(async conn => conn);
 
     try{
         //var sql="select * from user where phone=? and user_type='기업' and is_deleted!=1";//회원종류별 휴대폰 유니크하게 접속이기에 xxxx번호에 대해서 각 회원 개인,기업,중개사,분양사 별로 한개씩은 존재가능.
         var sql="select * from user where phone=? and is_deleted!=1 and user_type='기업'";//삭제되지 않은 회원목록(해당 폰번호의) 내역조회한다.

         var [users_phone_exists,fields]=await connection.query(sql,[req_phone]);
 
         //console.log('users테이블에서 입력 phone 검사 진행:',users_phone_exists);
 
         if(users_phone_exists.length == 0 || !users_phone_exists[0]){
             connection.release();
             //rows 길이가 0이고, 결과index체가 없는경우!
             return res.status(403).json({success:false, data:null, message:'휴대폰번호 혹은 암호가 올바르지 않습니다.'});
         }else{
             //존재하는 폰번호라면.
             connection.release();
             const compare_results=bcrypt.compareSync(req_password,users_phone_exists[0].password);
             if(compare_results){
                 //입력 암호값,입력이메일에 대한 계정(개인) 암호가 암호화한게 서로 비교해서 같으면, 개인의 xxx이메일에 대한 적절암호로 입력한것.

                 //로그인이 성공했는데 여기서 register_type : korex이면 최초origin가입자로 로그인한것이며, team인 유형에 한해서 초대장수락여부(팀원초대가입자로그인자중에서)검사하여 초대장 수락여부 권유페이지로 이동여부 처리한다.
                 var login_request_userid=users_phone_exists[0].mem_id;
                 var login_request_user_regitype=users_phone_exists[0].register_type;//가입타입 team(팀원초대로가입자) or korex(최초가입자)

                 console.log('기업로그인 로그인시도 계정유형 형태:',users_phone_exists,login_request_userid, login_request_user_regitype);

                if(login_request_user_regitype === 'team'){
                    //var [company_member_query] = await connection.query("select * from company_member where mem_id=?",[login_request_userid]);///해당 로그인하려는 팀원에 companymember조회한다. 초대장수락여부 검사.
                    //var is_invite_agree = company_member_query[0].is_invite_agree;//0 or 1
                   
                    //초대장 수락한경우였다면 바로 로그인시킴.
                    req.session.user_id=login_request_userid;
                    req.session.islogin=true;

                    req.session.save(function(){
                        res.json({success:true, data:users_phone_exists[0],message:'로그인 성공!'});
                    });
                    /*else{
                        //수락하지 않은 상태였다면 로그인실패이며 초대장 권유페이지이동.
                        res.status(403).json({success:false, data:null, login_request: login_request_userid, message:'로그인 실패(팀원초대미수락상태)'});
                    }*/
                }else if(login_request_user_regitype === 'korex'){
                     //관리자:최초가입자 는 바로 로그인시킨다.
                    //req.session.user_id=users_phone_exists[0].mem_id;
                    req.session.user_id=login_request_userid;
                    req.session.islogin=true;
    
                    req.session.save(function(){
                        res.json({success:true, data:users_phone_exists[0],message:'로그인 성공!'});
                    });
                }                
            }else{
                res.status(403).json({success:false, data:null, message:'휴대폰번호 혹은 암호가 올바르지 않습니다.'});
            }
         }
     }catch(err){
         //console.log('server or query Errror');
         connection.release();
         return res.status(403).json('server or query Errror');
     }        
});
//중개사 로그인 (팀원or최초등록자)
app.post('/api/auth/broker/login',async function(req,res,next){
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
     //res.setHeader('Access-Control-Allow-Origin:','*');
    //res.writeHead(200, {'Access-Control-Allow-Origin':'*'})
    res.setHeader('Access-Control-Allow-Credentials', 'true');
 
     let body=req.body;
     ////console.log('request_origin:',req);
     //console.log('req,body:',body);
     var req_phone=body.login_phone;
     var req_password=body.login_password;
 
     //console.log('중개사 로그인 요청 passport 쓰지 않고 post요청:',req_phone,req_password);
 
     const connection= await pool.getConnection(async conn => conn);
 
     try{
         var sql="select * from user where phone=? and is_deleted!=1 and user_type='중개사'";//회원종류별 휴대폰 유니크하게 접속이기에 xxxx번호에 대해서 각 회원 개인,기업,중개사,분양사 별로 한개씩은 존재가능. 해당 유저타입중에서 검색

         var [users_phone_exists,fields]=await connection.query(sql,[req_phone]);
 
         //console.log('users테이블에서 입력 phone 검사 진행:',users_phone_exists);
 
         if(users_phone_exists.length == 0 || !users_phone_exists[0]){
             connection.release();
             //rows 길이가 0이고, 결과index체가 없는경우!
             return res.status(403).json({success:false, data:null, message:'휴대폰번호 혹은 암호가 올바르지 않습니다.'});
         }else{
             //존재하는 폰번호라면.
             connection.release();

             //팀원가입시에 해당usertype,companyid소속하에서 휴대폰중복 벉호는 다 다르게한다.팀원가입의 경우 전체회원유형타입에서 폰번호 중복검사하는것에서 해당유형>소속companyid 하에서 검색한다.
             
             const compare_results=bcrypt.compareSync(req_password,users_phone_exists[0].password);
             if(compare_results){
                 //입력 암호값,입력휴대폰에 대한 계정(개인) 암호가 암호화한게 서로 비교해서 같으면, 개인의 번호에 대한 적절암호로 입력한것.

                 //로그인이 성공했는데 여기서 register_type:korex이면 최초 origin가입자로 로그인한것이며,team인 유형에 한해서 초대장수락여부 검사(팀원초대가입자로그인중에서)검사하여 수락여부 권유페이지로 이동여부처리한다.
                 var login_request_userid = users_phone_exists[0].mem_id;
                 var login_request_user_regitype = users_phone_exists[0].register_type;//가입타입 team(팀원초대자) or korex(최초가입자)

                 //console.log('중개사로그인 시도 계정유형형태:',login_request_userid,login_request_user_regitype);

                 if(login_request_user_regitype === 'team'){
                     
                    //초대장 수락했으면 바로 로그인시킴.
                    req.session.user_id= login_request_userid;
                    req.session.islogin = true;

                    req.session.save(function(){
                        res.json({success:true, data:users_phone_exists[0], message:'로그인 성공!'});
                    });
                     /*else{
                         //수락하지 않은 상태였다면 로그인실패이며 초대장권유페이지이동
                         res.status(403).json({success:false, data:null,login_request:login_request_userid, message:'로그인 실패(팀원초대미수락상태)'});
                     }*/
                 }else if(login_request_user_regitype === 'korex'){
                     //관리자 최초가입자는 바로 로그인시킨다.
                    // req.session.user_id=users_phone_exists[0].mem_id;
                    req.session.user_id = login_request_userid;
                    req.session.islogin=true;
    
                    req.session.save(function(){
                        res.json({success:true, data:users_phone_exists[0],message:'로그인 성공!'});
                    });
                 }
                 
             }else{
                 res.status(403).json({success:false, data:null, message:'휴대폰번호 혹은 암호가 올바르지 않습니다.'});
             }
         }
     }catch(err){
         //console.log('server or query Errror');
         connection.release();
         return res.status(403).json('server or query Errror');
     }       
});
//분양대행사 로그인(팀원or 최초가입자)
app.post('/api/auth/agency/login',async function(req,res,next){
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
     //res.setHeader('Access-Control-Allow-Origin:','*');
    //res.writeHead(200, {'Access-Control-Allow-Origin':'*'})
    res.setHeader('Access-Control-Allow-Credentials', 'true');
 
     let body=req.body;
     ////console.log('request_origin:',req);
     //console.log('req,body:',body);
     var req_phone=body.login_phone;
     var req_password=body.login_password;
 
     //console.log('분양사 로그인 요청 passport 쓰지 않고 post요청:',req_phone,req_password);
 
     const connection= await pool.getConnection(async conn => conn);
 
     try{
         var sql="select * from user where phone=? and is_deleted!=1 and user_type='분양대행사'";//회원종류별 휴대폰 유니크하게 접속이기에 xxxx번호에 대해서 각 회원 개인,기업,중개사,분양사 별로 한개씩은 존재가능.

         var [users_phone_exists,fields]=await connection.query(sql,[req_phone]);
 
         //console.log('users테이블에서 입력 phone 검사 진행:',users_phone_exists);
 
         if(users_phone_exists.length == 0 || !users_phone_exists[0]){
             connection.release();
             //rows 길이가 0이고, 결과index체가 없는경우!
             return res.status(403).json({success:false, data:null, message:'휴대폰번호 혹은 암호가 올바르지 않습니다.'});
         }else{
             //존재하는 폰번호라면.
             connection.release();
             const compare_results=bcrypt.compareSync(req_password,users_phone_exists[0].password);
             if(compare_results){
                 //입력 암호값,입력이메일에 대한 계정(개인) 암호가 암호화한게 서로 비교해서 같으면, 개인의 xxx이메일에 대한 적절암호로 입력한것.

                 //로그인이 성공했는데 여기서 register_type : korex이면 최초origin가입자로 로그인한것이며, team인 유형에 한해서 초대장수락여부(팀원초대가입자로그인자중에서)검사하여 초대장 수락여부 권유페이지로 이동여부 처리한다.
                 var login_request_userid=users_phone_exists[0].mem_id;
                 var login_request_user_regitype=users_phone_exists[0].register_type;//가입타입 team(팀원초대로가입자) or korex(최초가입자)

                 //console.log('분양사로그인 로그인시도 계정유형 형태:',login_request_userid, login_request_user_regitype);

                 if(login_request_user_regitype === 'team'){
                    //var [company_member_query] = await connection.query("select * from company_member where mem_id=?",[login_request_userid]);///해당 로그인하려는 팀원에 companymember조회한다. 초대장수락여부 검사.
                    //var is_invite_agree = company_member_query[0].is_invite_agree;//0 or 1
                    
                    //초대장 수락한경우였다면 바로 로그인시킴.
                    req.session.user_id=login_request_userid;
                    req.session.islogin=true;

                    req.session.save(function(){
                        res.json({success:true, data:users_phone_exists[0],message:'로그인 성공!'});
                    });
                    /*else{
                        //수락하지 않은 상태였다면 로그인실패이며 초대장 권유페이지이동.
                        res.status(403).json({success:false, data:null, login_request: login_request_userid, message:'로그인 실패(팀원초대미수락상태)'});
                    }*/
                 }else if(login_request_user_regitype === 'korex'){
                     //관리자:최초가입자 는 바로 로그인시킨다.
                    //req.session.user_id=users_phone_exists[0].mem_id;
                    req.session.user_id=login_request_userid;
                    req.session.islogin=true;
    
                    req.session.save(function(){
                        res.json({success:true, data:users_phone_exists[0],message:'로그인 성공!'});
                    });
                 }
             }else{
                 res.status(403).json({success:false, data:null, message:'휴대폰번호 혹은 암호가 올바르지 않습니다.'});
             }
         }
     }catch(err){
         //console.log('server or query Errror');
         connection.release();
         return res.status(403).json('server or query Errror');
     }       
});

//중개사(국가공간정보cls인증) 휴대폰번호 기준 검색.
app.post('/api/auth/broker/brokerClcRealtors_confirm',async function(req,res,next){
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
 
     let body=req.body;
     ////console.log('request_origin:',req);
     //console.log('req,body:',body);
     var phone=body.phone;
 
     //console.log('중개사clcRelaators정보 사전등록여부 조회:',phone);
 
     const connection= await pool.getConnection(async conn => conn);
 
     try{
         var sql="select * from clc_realtors where rep_tel=?";//clcREatlros에 휴대폰 기준 검색한다. 해당 번호 회원이 clc중개사정보에 사전등록된 회원인지 여부 검사.

         var [clcrealtors_info_exists,fields]=await connection.query(sql,[phone]);
 
         //console.log('국가공간정보포탈(clc)사전 등록된 중개사업자번호 인증조회',clcrealtors_info_exists);
 
         if(clcrealtors_info_exists.length == 0 || !clcrealtors_info_exists[0]){
             connection.release();
             //rows 길이가 0이고, 결과index체가 없는경우!
            return res.json({success:false, data:null, message:'해당 휴대폰번호로 등록된 clc중개사정보가 없습니다!'});
         }else{
             connection.release();
             //clc에 등록된 중개사회원 phonenumber 라면(사전 등록된 중개사회원 정보라면)
            return res.json({success:true, data:clcrealtors_info_exists[0],message:'존재하는 clc중개사 정보입니다.'});                
        }
         
     }catch(err){
         //console.log('server or query Errror');
         connection.release();
         return res.json({success:false, data:null, message:'server or query error'});
    }        
});
//중개사회원 사업자등록번호 홈택스 인증조회.
app.post('/api/auth/broker/crNumber_validation',async function(req,res){
    let req_body=req.body;

    //console.log('get crnumber validation Test::',req_body);

    try{
        var crNumber=req_body.crNumber;//사업자번호 넘어온거.입력값.
       // var crNumber = '2208102810'; //220-81-02810 tfc임의 사업자번호 테스트
        var validation_result;
        postCRN(crNumber).catch(err => { 
            console.log('err발생:',err); return res.json({success:false, result:undefined}) 
        }).then(result => { 
            console.log('POSTCRN ->> PRMOMISE GETCRRESULTXFROMXML -> XML2JSPARSINGSTRING -> CRNUMBER REUTNR result',result);

            validation_result = result;

            return res.json({success:true, result:validation_result});
        });

        function postCRN(crn){
            //console.log('POSTCRN호출::',crn);
            return new Promise((resolve,reject) => {
                axios.post(postUrl,xmlRaw.replace(/\{CRN\}/,crn),
                { headers: {'Content-Type':'text/xml'}})
                .catch(err => reject(err))
                .then(result => {
                    //console.log('postcrn promise axiso request요청 결과 result::',result);
                    getCRNresultFromXml(result['data']) //api응답의 data텍스트 파싱
                    .catch(err => reject(err))
                    .then(CRNumber => {
                        resolve(CRNumber)
                    })
                })
            })
        }

        function getCRNresultFromXml(dataString){
            //console.log('GETCRNSREULT FROM XML함수 호출::',dataString);
            return new Promise((resolve,reject) => {
                xml2js.parseString(dataString, //api응답의 data지정된 xml값 추출 파싱
                    (err,res) => {
                        //console.log('xml2js parseStrign결과값:',err,res,res.map.trtCntn);
                        if(err) reject(err)
                        else resolve({trtcntn: res.map.trtCntn[0], message: res.map.smpcBmanTrtCntn[0], messageEng: res.map.smpcBmanEnglTrtCntn[0]}) //trtCntn이라는 tag의값을 get
                    })
            })
        }

        //return res.json({success:true, result:validation_result});
    }catch(err){
        //console.log('server error:',err);

        return res.status(403).json({success:false, result: undefined });
    }
});

//로그인된 회원정보 쿼리진행(유저 권한등 정보 조회, 모든 마이페이지에서 참조합니다.)
app.post('/api/auth/userinfo_request',async(req,res)=>{

    //2021-11-18 addss comments.
    /*get_userdata는 user테이블과 일대일대응 되는 형태의 데이터는 아니며, 유저유형에 따라 user , company_member정보를 혼합한 정보이며, 해당 정보에서 유저의 권한의 경우 기존엔 user의 mem_admin으로 가져왔었으나, company_member의 cmtype으로 변경처리하였습니다*/
    console.log('========로그인 회원정보 조회 쿼리진행===================',req.body);

    res.setHeader('Access-Control-Allow-Credentials','true');

    let body=req.body;
    var mem_id=body.mem_id;

    const connection = await pool.getConnection(async conn => conn);

    try{
        var sql="select * from user where mem_id=? and is_deleted!=1";//임의의 memid회원 groupby comapnymember정보내역 가져옴 소속내역이랑 같이 가져온다.

        var [rows]= await connection.query(sql,[mem_id]);

        if(rows.length >=1){
            var get_userdata={
                mem_id : rows[0].mem_id,
                company_id : rows[0].company_id,//마지막으로 선택한 소속id값.(소속된업체의 companyid)
                user_username : rows[0].user_username,
                phone: rows[0].phone,
                email: rows[0].email,
                user_name : rows[0].user_name,
                mem_img : rows[0].mem_img,
                user_type : rows[0].user_type,//임의의 가입유형(기업,중개사,대행사)의 user자체는 회원종류별로 휴대폰번호별로 유니크하고, 그 가입했을때는 한종류의 회원으로 한정하기에 기업으로했다면 기업관련된 사업자들만 추가될뿐임. 기업01012341234가입유저가있었는데, 동일번호로 또 같은 기업타입에 대해서 가입한다면 user에는 생성안되고, companymember만 새로운 사업자로하여 여러개 일대다형태로 생성, 소속이 여러개 생김, 해당 유저 기업으로만 로그인되며, 기업외의 소속은 없으며, 마이페이지에서 기업관련 comapnymember소속리스트들만 뜬다. -> 동일번호로 다른 대행사,중개사로 가입하면 각각 유니크하게 중복안되게끔 대행사,중개사에 user테이블 가입처리되며, 동일한 형태 반복, 각 회원종류user기반으로 하여 로그인할뿐이며(로그인시엔 companymember는 미사용) 로그인이후 소속관련 뜨는것 자체는 flow상 기업회원이 동일번호로 다른사업체로 추가하는로직의 경우 기업으로만 fixed형태로 사업자companymember추가될뿐이기에, 동타입 다른사업체리스트만 뜰것임.
                register_type : rows[0].register_type,
                //mem_admin : rows[0].mem_admin,//유저의 권한은 개인회원의 경우 그 자체로써 root이고, 생성자회원인 경우 그 자체로써memadmin root(comaopnymember비조인.)
                //mem_admin : rows[0].cm_type,
                mem_notification: rows[0].mem_notification,
                ispro : ''
            };

            //comapny_id기준으로 해서 추가조회한다. user테이블에 있는 companyid값 선택소속값이 없는경우는 아직 소속미지정한 상태이면 회사정보를 못얻고, 있으면 얻을수 선택소속의 회사정보얻을수있고, 그 소속companyid에 해당하는 companymember연동 memid 일대일대응내역기준의 권한정보등을 얻어야함 2depth>
            var user_type = rows[0].user_type;
            var register_type=rows[0].register_type;//코렉스(생성자), team(팀원가입자), social(소셜개인가입자),개인가입자의 경우 생성자korex상태임.
            if(user_type !='개인'){
                var company_id_get = rows[0].company_id;
                if(company_id_get){
                    var [company_info_query] = await connection.query("select * from company2 where company_id=?",[company_id_get]);
                    if(company_info_query.length >=1){
                        get_userdata['company_name'] = company_info_query[0].company_name;//로그인한 로그인시도된 사람(팀원or최초가입자)에 소속사업체 및 사업체명(기업,중개사,분양사)도 저장한다.
                    }        
                }
            }
            
            if(user_type=='개인'){
                //개인 일반가입자의 경우 그 자신이 곧 root권한임.
                get_userdata['mem_admin'] = 'root';
            }else if(user_type!='개인'){
                //기업,중개사,분양사 회원 가입자(최초생성자+팀원들)의 경우 companymember의 지정권한값 팀원지정권한값 가져온다.
                var [join_rows] = await connection.query("select * from user u join company_member c on u.mem_id=c.mem_id where u.mem_id=? and c.company_id=?",[mem_id,company_id_get]);//해당 mem-id 비개인 팀원가입자의 경우 companymember조인쿼리한다. 해당 memid에 대해서 같은 기업타입에서 여러개 리스트 조인되어 나오기에, 어떤 소속companyid상태에서의 어떤 소속유저로그인정보 접근한다.
                if(join_rows.length>=1){
                    //팀원으로 초대되어있는 계정인 경우에만 성공처리.
                    var cm_type=join_rows[0]['cm_type'];//0,1또는 값으로써 해당 companyid소속팀원의 회사내에서 부여된 권한값 root or team 여부 0,1 값에 따라 판단
                    if(cm_type==0){
                        //0 팀원권한
                        get_userdata['mem_admin']='team';
                    }else if(cm_type==1){
                        //관리자 권한
                        get_userdata['mem_admin']='root';
                    }
                }      
            }
        }
       
        if(rows.length == 0 || !rows[0]){
            connection.release();
            return res.json({success:false, data:null, message:'존재하지 않는 로그인정보입니다.', user_data : null});
        }else{
            var select_company_id=rows[0].company_id;
            //중개사회원의 경우 추가적으로 해당 중개사 소속중개사company2자체가 전문중개사 신청에 의한 전문중개사여부 검사.
            if(select_company_id != null && select_company_id){
                var [company_rows] = await connection.query('select is_pro from company2 where company_id=?',[select_company_id]);
                if(company_rows.length >=1){
                    get_userdata['ispro'] = company_rows[0].is_pro;
                }          
            }
            connection.release();
            return res.json({success:true, data:null, message:'존재하는 로그인정보입니다.', user_data : get_userdata});
        }
       
    }catch(err){
        connection.release();
        return res.json({success:false, data:null, message:'server or query error', user_data : null});
    }
});
//임의의 유저의 소속된 팀리스트 
app.post('/api/auth/user_sosokteamlist',async(req,res)=>{

    res.setHeader('Access-Control-Allow-Credentials','true');

    let body=req.body;
    var mem_id=body.mem_id;

    const connection = await pool.getConnection(async conn => conn);

    try{
        var sql="select * from user u join company_member c on u.mem_id=c.mem_id join company2 cc on c.company_id=cc.company_id where u.mem_id=?";

        var [rows]= await connection.query(sql,[mem_id]);//관련 조인 유저의 회원,팀원소속내역,회사소속정보 소속 회사정보리스트 
    
        if(rows.length == 0 || !rows[0]){
           
            connection.release();
            return res.json({success:false, data:null, message:'존재하는 소속이 없습니다!', user_data : null});
        }else{

            connection.release();
            return res.json({success:true, data:null, message:'존재하는 소속리스트 있습니다!', user_data : rows});
        }
       
    }catch(err){
        connection.release();
        return res.json({success:false, data:null, message:'server or query error', user_data : null});
    }
});
//로그인여부
app.get('/api/auth/islogin',async(req,res)=>{
    const connection = await pool.getConnection(async conn=>conn);
    try{

        if(req.session.user_id){
            var userquery=await connection.query("select * from user where mem_id=? and is_deleted!=1",[req.session.user_id]);//탈퇴되지않은 회원정보로써 존재하고있는건지.
            connection.release();
            if(userquery.length>=1){
                //유저 정보가 있는경우 req.session정보 전달한다.
                return res.json({'login_session':req.session});
            }else{
                //유저정보가 없다면 유효하지않은 로그인정보로써 판단
                return res.json({'login_session':null});
            }        
        }else{
            connection.release();
            return res.json({'login_session':null});
        }
    }catch(err){
        connection.release();
        return res.json({'login_session':null});
    }   
});
//공통 로그아웃
app.get('/api/auth/logout',(req,res,next) => {
    //console.log('api auth logout requestt:');
    req.logout();
    req.session.destroy(function(){
        return res.json({success:true, message:'로그아웃 되었습니다!'});
    });
});


//알리고모듈 테스트 
app.post('/api/aligoSms',async (req,res) => {
    //console.log('==>>api aligo_sms requeswtss::');
    var req_body= req.body;
    var type=req_body.type;
    aligosms.send(req,res,type);
});


app.post('/api/join/aligoSms',async (req,res) => {
    //console.log('==>>api aligo_sms requeswtss::');
    var req_body= req.body;
    var type=req_body.type;
    aligosms.sendJoinCompany(req,res,type);
});


app.post('/api/aligoSms_multiple',async (req,res) => {
    //console.log('===>>>api algio_multi sms requetsss:');
    var req_body = req.body;

    //console.log('req_body::',req_body,aligosms);

    aligosms.sendMass(req,res);
});
//알리고모듈로 보낸 문자발송성공시 폰인증(테이블)에 쌓인 인증요청내역중 각 식별번호별 가장 최근의 보내진 인증번호값에 대해서, 사용자 입력 인증번호값 대조하여 유효성 검사관련 api
app.post('/api/cernum_validate_process',async(req,res)=>{
   //console.log('====>>>cernum_validate process request post:');
   var req_body= req.body;

   //console.log('req_body:::',req_body);

   const connection=await pool.getConnection(async conn => conn);

   try{
       var phone_number = req_body.phone_number;
       var cernum_number = req_body.cernum_number;

       var [phone_identify_select] = await connection.query("select * from phone_identify where identify_phone=? order by create_date desc",[phone_number]);
       //해당 내역중에서 가장 최근 내역 한개가 의미하는것은, 해당 번호에 대해서 인증요청간것중 가장 최근것 번호 하나 의미한다.
       var get_cernum=phone_identify_select[0]['identify_number'];//해당 번호의 요청중 가장 최근 인증번호 요청값을 얻어내고, 그 인증번호와맞게 입력했나 여부.해당 번호내역중 가장 최근레코드 내역 조회한다.그의 인증번호값
        connection.release();
       if(cernum_number === get_cernum){
         //console.log('휴대폰 인증전송 cernum값과 동일하게 인증번호입력한경우!',cernum_number,get_cernum);
         var target_record_certifypossibledatetime= phone_identify_select[0]['certify_possible_datetime'];//인증가능 유효시간 오분뒤의 미래값.
         var now_time=new Date();
         //console.log('인증요청한 현재 시간값::',now_time,now_time.getTime());
         //console.log('인증번호요청 추적한 관련 인증record내역의 유효시간레코드값::',target_record_certifypossibledatetime,target_record_certifypossibledatetime.getTime());

         if(now_time.getTime() < target_record_certifypossibledatetime.getTime()){
            var delete_target_rowid= phone_identify_select[0]['identify_id'];//삭제 대상 매칭id값.

            //삭제 쿼리 진행.
            try{
                await connection.beginTransaction();
                var [phone_identify_success_deletequery] = await connection.query("delete from phone_identify where identify_id=?",[delete_target_rowid]);
                //console.log('phone identify success delte query result::',phone_identify_success_deletequery);
                await connection.commit();
                connection.release();
            }catch(err){
                //console.log('===>delte query error:',err);
                connection.rollback();
                connection.release();
            }
            
            return res.json({success:true, message:'인증번호가 같습니다!'});
         }else{
             //console.log('유효시간이 이미 지난 인증번호 링크입니다.인증번호 요청레코드>>');

             connection.release();
             return res.json({success:false,message:'인증유효시간이 지났습니다!'});
         }
         
       }else{
         //console.log('휴대폰전송cernum값과 cernum인증번호 입력값이 다른경우!',cernum_number,get_cernum);

         return res.json({sccess:false, message:'인증번호가 다릅니다!'});
       }
   }catch(err){
       //console.log('query error errsss:',err);
       connection.release();

       return res.json({success:false, message:'query error!'});
   }
});
//이메일인증으로 보낸 인증번호저장관련된 내역 조회.
app.post('/api/cernum_validate_process_email',async(req,res)=>{
    //console.log('====>>>cernum_validate process request post:');
    var req_body= req.body;
 
    //console.log('req_body:::',req_body);
 
    const connection=await pool.getConnection(async conn => conn);
 
    try{
        var email = req_body.email;
        var cernum_number = req_body.cernum_number;
 
        var [email_identify_select] = await connection.query("select * from email_identify where identify_email=? order by create_date desc",[email]);
        //해당 내역중에서 가장 최근 내역 한개가 의미하는것은, 해당 번호에 대해서 인증요청간것중 가장 최근것 번호 하나 의미한다.
        var get_cernum=email_identify_select[0]['identify_number'];//해당 번호의 요청중 가장 최근 인증번호 요청값을 얻어내고, 그 인증번호와맞게 입력했나 여부.
        connection.release();
        
        if(cernum_number === get_cernum){
          //console.log('이메일 인증전송 cernum값과 동일하게 인증번호입력한경우!',cernum_number,get_cernum);

          var certify_possible_datetime=email_identify_select[0]['certify_possible_datetime'];//저장된 인증이메일내역중 가장 최근것인데 인증번호맞게 입력한 그 관련record내역 의 인증유효시간값을 조회한다.
          var now_time=new Date();
          //console.log('현재 요청시간::',now_time,now_time.getTime());
          //console.log('인증가능유효시간datetime값::',certify_possible_datetime,certify_possible_datetime.getTime());

          if(now_time.getTime() < certify_possible_datetime.getTime()){
            //인증유효시간안에 적절히 맞게 입력해서 처리된경우
            //삭제 쿼리 진행.
            var delete_target_rowid= email_identify_select[0]['identify_id'];//삭제 대상 매칭id값.
            try{
                await connection.beginTransaction();
                var [email_identify_success_deletequery] = await connection.query("delete from email_identify where identify_id=?",[delete_target_rowid]);
                //console.log('phone identify success delte query result::',email_identify_success_deletequery);
                await connection.commit();
                connection.release();
            }catch(err){
                //console.log('===>delte query error:',err);
                connection.rollback();
                connection.release();
            }
            
            return res.json({success:true, message:'인증번호가 같습니다!'});
          }else{
            return res.json({success:false, message:'인증유효시간을 초과하였습니다.'});
          }
     
        }else{
          //console.log('이메일전송cernum값과 cernum인증번호 입력값이 다른경우!',cernum_number,get_cernum);
 
          return res.json({sccess:false, message:'인증번호가 다릅니다!'});
        }
    }catch(err){
        //console.log('query error errsss:',err);
        connection.release();
 
        return res.json({success:false, message:'query error!'});
    }
});
app.post('/api/fileDelete/specify_foldertarget_deleteprocess',async(req,res)=>{
    //console.log('특정 대상 삭제 대상들::',req.body);

    var delete_images=req.body.delete_images.split(',');
    req.body['delete_images'] = delete_images;//배열화.
    var return_value=awsS3.delObject(req,res);
    
    if(return_value){

        let prd_identity_id=req.body['prd_identity_id'];
        let folder=req.body['folder'];
        let delete_images = req.body['delete_images'];
        //해당 유니크한 folder,file명 식별자값을 배열내에서 찾음.

        const connection=await pool.getConnection(async conn => conn);

        var [prev_product_query] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);
        let prev_prd_imgs=prev_product_query[0]['prd_imgs'].split(',');
        //console.log('관련 대상 매물 id:',prd_identity_id);
        //console.log('삭제할 대상 기존 이미지리스트 ',prev_prd_imgs);
        //console.log(delete_images);
        let findindex=prev_prd_imgs.indexOf(delete_images[0]);
        //console.log('findinedexxs:',findindex);
        var adapt_prd_imgs=prev_prd_imgs.splice(findindex,1);//해당 위치요소 삭제.
        //console.log('적용 db stringsss:',prev_prd_imgs);

        try{
            await connection.beginTransaction();
            if(prev_prd_imgs.length>=1){
                var [update_prd_query] = await connection.query("update product set prd_imgs=? where prd_identity_id=?",[prev_prd_imgs.join(','),prd_identity_id]);
            }else{
                var [update_prd_query] = await connection.query("update product set prd_imgs=? where prd_identity_id=?",[null,prd_identity_id]);
            }
            
            //console.log('update_prd_query query result::',update_prd_query);
            await connection.commit();

            var [after_prd_result] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);
            connection.release();
        }catch(err){
            //console.log('===>up[date] query error:',err);
            connection.rollback();
            connection.release();
        }

        return res.json({success:true, message:'삭제 처리 성공',result:after_prd_result[0]});
    }else{
        return res.json({success:false, message:'삭제 처리 문제'});
    }
    
});
//테스트 시험용===================================================================================
app.get('/api/auth/info',(req,res,next)=> {
    const info=req.user;
    return res.json(info);
});
//console.log('로그인 로그아웃체크여부 모듈확인:');

app.get('/api/auth/signup',async(req,res,next)=>{
    //console.log('singup회원가입폼 페이지 요청을 한다, isLogout상태인 경우에만 접근 가능, 로그아웃됀 상태인인경우에만 처리받음');
    res.render('signUp');

    //console.log('req_sessioin:',req.session);
});
app.get('/api/auth/logintest',async(req,res,next)=>{
   let session=req.session;

   res.render('logintest',{
       session : session
   });
});
app.get('/api/auth/logoutss', async (req,res,next) => {
    //console.log('logoutsss 로그아웃즈 페이지 요청을 한다, isLogin로그인상태인 경우에만 접근가능,그렇지 않으면 접근처리돼지않음.');
    res.render('signIn');

    //console.log('req_sessioin:',req.session);
});
app.get('/api/auth/session_list',async(req,res)=>{
    //req.session.logined=true;
    //req.session.user_id='sdgsdgasdg';

    //console.log('요청 req,res,세션존재리스트:',req.session,req.user);
    res.json({'req_user':req.user,'req_session':req.session});  
});

app.get('/api/auth/userinfo',function(req,res,next){
    if(req.cookies){
        //console.log('req.cookies:',req.cookies);
    }
    res.send('환영합니다.!!!!');
});

app.use((req,res,next) => {
    res.status(404).send('not found');
});

app.listen(port,function(){
    //console.log('========SERVER IS LISTENING ON '+port);
});



// const options = {
//     key: fs.readFileSync('/etc/letsencrypt/live/korexpro.com/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/korexpro.com/cert.pem'),
//     ca: fs.readFileSync('/etc/letsencrypt/live/korexpro.com/fullchain.pem')
// };

// const server = https.createServer(options, app).listen(port);