const express=require('express');
const morgan=require('morgan');
const cookieparser=require('cookie-parser');
const passport=require('passport');
const session=require('express-session');
require('dotenv').config();

const bodyparser=require('body-parser');

//const authRouter=require('./routes/auth');//회원가입&로그인 관련 모든 처리 router페이지(네종류 회원별)분기 url처리
const smsRouter=require('./routes/coolsmsUse');//coolsms라이브러리 사용 사용자에게 휴대폰 sms 메시지보낸다.

const passportconfig=require('./passports');//패스포트 api설정

const port=8080;
const app=express();
passportconfig(passport);//passport api전달한다.


const cors=require('cors');
app.use(cors("http://localhost:3000"));
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.use(
    session({
        resave:false,
        saveUninitialized:false,
        secret:'sgnjij#njskgnsdigna*&)',
        cookie:{
            httpOnly:true,
            secure:false
        }
    })
);

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//app.use(passport.initialize());
//app.use(passport.session());

//app.use('/auth',authRouter);
app.use('/coolsms',smsRouter);//coolsms형태의 주소 요청

//로그인,회원가이 부분 파트(router로 말고 직접 진행)
const bcrypt=require('bcrypt');
const loginCheck=require('../server/loginCheck');
//const app=express();

var isLogin=loginCheck.isLogin;
var isLogout=loginCheck.isLogout;


//디비 관련 연결 필요
const mysql=require('mysql');
const connection=mysql.createConnection({
    host:'localhost',
    port:3307,
    user:'sinja',
    password:'sinja',
    database:'korex'
});
connection.connect();

//개인 회원가입
app.post('/auth/member/register',async(req,res,next)=> {
    const { email,name,password,phone,usertype,agree_status }=req.body;
    console.log('/member/register 개인회원가입 요청:',req.body);
    try{
        //이메일,폰번호 중복검사진행. 전체종류 회원에서 이메일/폰번호 중복검사진행.

        var sql="select * from users where email=?";
        var email_exists_query=connection.query(sql,[email],function(err,datas){
            var existed=false;
            if(err){

            }
            if(datas.length){
                existed=datas;
            }else{
                existed=false;
            }

            console.log('위아래 실행 직렬?동기형태? existed값',existed);

            if(existed){return res.status(403).json('이미 가입돼어 있는 이메일입니다.');}
        });
        var sql2="select * from users where phone=?";
        var phone_exists_query=connection.query(sql2,[phone],function(err,datas){
            var existed=false;
            if(err){

            }
            if(datas.length){
                existed=datas;
            }else{
                existed=false;
            }
            console.log('existed값:',existed);

            if(existed){return res.status(403).json('이미 가입돼어 있는 휴대폰번호입니다.');}

            var hashed=bcrypt.hashSync(password,10);//sync 동기처리 먼저 받고진행.
            console.log('bcrypt암호화 진행 복잡도10(salt blur):',hashed);

            //email,name,password,phone,usertype,agree_status등 저장.
            var insert_sql="insert into users(user_name,email,phone,user_type,register_type,password,mem_admin,agree_status) values('"+name+"','"+email+"','"+phone+"','"+usertype+"','korex','"+hashed+"','admin','"+agree_status+"')";
            console.log('member/register insert sql query:',insert_sql);

            var insert_query=connection.query(insert_sql,function(err,datas){
                if(err) return res.json('오류발생!!!'+err,datas);
                /*return res.json({
                    'user_id':user_id,
                    'id':datas.insertId
                });*/
                return res.json(email+','+phone+'::) 회원님 가입이 완료되었습니다.');
            });
        });

    }catch(err){
        console.error(err);
        return next(err);
    }
});
//개인 로그인
app.post('/auth/member/login',(req,res,next) => {
    console.log('개인 로그인 요청 post login=>>>>',req.body);
    passport.authenticate('local',(err,user,info) => {
        //localstragegy 실행후 결과가 콜백함수에서 출력됍니다.
        console.log('passport local login(개인 로그인) requests에대한 passportLocal process callback',err,user,info);
        if(err){
            console.error(err);
            return next(err);
        }
        if(!user){
            return res.status(403).json({
                info,
                result:'error'
            });
        }
        console.log('req.session값 조회 및 지정:',req.session);
        req.session.logined=true;
        req.session.user_id=user.mem_id;

        return res.json({
            user,
            result:'success'
        });
        /*return req.login(user,err => {
            if(err){
                console.error(err);
                return next(err);
            }
            
            //에러없이 passport 로그인 함수 실행되었다는것은 authenticaitin유효하다는것 일차적으로.
            console.log('세션개체 참조 가능??',req.session);
            req.session.logined=true;
            req.session.user_id=user.mem_id;

            return res.json({
                user,
                result:'success'
            });
        });*/
    })(req,res,next);
});

app.get('/auth/session_list',async(req,res)=>{
    req.session.logined=true;
    req.session.user_id='sdgsdgasdg';

    console.log('요청 req,res,세션존재리스트:',req.session,req.user);
    res.json({'req_user':req.user,'req_session':req.session});  
});

//공통 로그아웃
app.get('/auth/logout',(req,res,next) => {
    req.logout();
    req.session.destroy();
    /*req.session.save(function(){
        return res.json('로그아웃');
    });*/
    res.json('로그아웃 처리');
});


//테스트 시험용===================================================================================
app.get('/auth/info',(req,res,next)=> {
    const info=req.user;
    return res.json(info);
});
console.log('로그인 로그아웃체크여부 모듈확인:',loginCheck);

app.get('/auth/signup',isLogout,async(req,res,next)=>{
    console.log('singup회원가입폼 페이지 요청을 한다, isLogout상태인 경우에만 접근 가능, 로그아웃됀 상태인인경우에만 처리받음');
    res.render('signUp');

    console.log('req_sessioin:',req.session);
});
app.get('/auth/login',isLogout,async(req,res,next)=>{
    console.log('login로그인폼 페이지 요청을 한다, isLogout상태인 경우에만 접근 가능, 로그아웃상태에서만 처리받음');
    res.render('signIn');

    console.log('req_sessioin:',req.session);
});
app.get('/auth/logoutss',isLogin, async (req,res,next) => {
    console.log('logoutsss 로그아웃즈 페이지 요청을 한다, isLogin로그인상태인 경우에만 접근가능,그렇지 않으면 접근처리돼지않음.');
    res.render('signIn');

    console.log('req_sessioin:',req.session);
});
app.get('/auth/session_list',async(req,res)=>{
    req.session.logined=true;
    req.session.user_id='sdgsdgasdg';

    console.log('요청 req,res,세션존재리스트:',req.session,req.user);
    res.json({'req_user':req.user,'req_session':req.session});  
});


app.use((req,res,next) => {
    res.status(404).send('not found');
});

app.listen(port,function(){
    console.log('========SERVER IS LISTENING ON '+port);
});