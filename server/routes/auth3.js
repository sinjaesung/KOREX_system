const express=require('express');
const router=express.Router();
const passport=require('passport');
const bcrypt=require('bcrypt');
const loginCheck=require('../loginCheck');

var isLogin=loginCheck.isLogin;
var isLogout=loginCheck.isLogout;

//디비 관련 연결 필요
const mysql=require('mysql');
var connection=mysql.createConnection({
    host:'localhost',
    port:3307,
    user:'sinja',
    password:'sinja',
    database:'passport_test'
});
connection.connect();


//기존 회원가입요청
router.post('/signup',async(req,res,next)=> {
    const { user_id,password }=req.body;
    try{

        var sql="select * from users where user_id=?";
        var query=connection.query(sql,[user_id],function(err,datas){
            var existed=false;
            if(err){

            }
            if(datas.length){
                existed=datas;
            }else{
                existed=false;
            }

            console.log('위아래 실행 직렬?동기형태? existed값',existed);

            if(existed){return res.status(403).json('이미 가입돼어있는 아이디입니다');}

            //const hashed=bcrypt.hash(password,10); async callback what.
            var hashed=bcrypt.hashSync(password,10);//sync 동기처리 먼저 받고진행.
            console.log('bcrypt암호화 진행 열자리:',hashed);

            var insert_sql="insert into users(user_id,password) values('"+user_id+"','"+hashed+"')";
            var insert_query=connection.query(insert_sql,function(err,datas){
                if(err) return res.json('오류발생!!!'+err+datas);
                /*return res.json({
                    'user_id':user_id,
                    'id':datas.insertId
                });*/
                return res.json(user_id+'회원님 가입이 완료돼었습니다.');
            });
        });

    }catch(err){
        console.error(err);
        return next(err);
    }
});
//회원가입 기능 (유효성 간단 통과시에)
router.post('/register',async(req,res,next) => {
    console.log('siungnusup post노드 서버 요청:jsoin join요청:',req.body);
    const {user_ids,emails,passwords} = req.body;

    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Credentials','true');

    try{
        var sql="select * from users where user_id=?";
        var query=connection.query(sql,[user_ids],function(err,datas){
            var existed=false;
            if(err){

            }
            if(datas.length){
                existed=datas;
            }else{
                existed=false;
            }
            if(existed){
                return res.status(403).json('이미 가입돼어있는 아이딥니다.');
            }

            var hashed=bcrypt.hashSync(passwords,10);
            console.log('bcrypt암호화 진행열자리가 아니라 복잡도:',hashed);

            var insert_sql="insert into users(user_id,email,password) values('"+user_ids+"','"+emails+"','"+hashed+"')";
            var insert_query=connection.query(insert_sql,function(err,datas){
                if(err)return res.json('오류발생!!!'+err+datas);

                return res.json(user_ids+'회원님 가입이 완료돼었습니다.');
            });
        });
    }catch(err){
        console.error(err);
        return next(err);
    }
});
//이메일 존재여부
router.post('/email',async(req,res,next) => {
    const { email} =req.body;
    console.log('post user/email 요청 처리:',req.body);

    try{
        var sql="select * from users where email=?";
        var query=connection.query(sql,[email],function(err,datas){
            var existed=false;
            if(err){

            }
            if(datas.length){
                existed=datas;
            }else{
                existed=false;
            }
            if(existed){return res.json('not allow');}
            else{return res.json('success');}
        });
    }catch(err){
        console.error(err);
        return next(err);
    }
});
//아이디 존재여부
router.post('/user_id',async(req,res,next) => {
    const { user_id } =req.body;
    console.log('post user/user_id 요청 처리:',req.body);

    try{
        var sql="select * from users where user_id=?";
        var query=connection.query(sql,[user_id],function(err,datas){
            var existed=false;
            if(err){

            }
            if(datas.length){
                existed=datas;
            }else{
                existed=false;
            }
            if(existed){return res.json('not allow');}
            else{return res.json('success');}
        });
    }catch(err){
        console.error(err);
        return next(err);
    }
});

//기존 로그인 기능 구현(리액ㅌ츠연돝xxxx)
router.post('/login',async(req,res,next) => {
    passport.authenticate('local',(err,user,info) => {
        //localstragegy 실행후 결과가 콜백함수에서 출력됍니다.
        console.log('localstargery locals실행후에 인증 겨로가값 콜백함수로써 호출:',err,user,info);
        if(err){
            console.error(err);
            return next(err);
        }
        if(!user){
            return res.status(403).json({
                info,
                result:'로그인 실패'
            });
        }
        return req.login(user,err => {
            if(err){
                console.error(err);
                return next(err);
            }
            return res.json({
                user,
                result:'로그인 성공'
            });
        });
    })(req,res,next);
});

router.post('/logins',async(req,res,next) => {
    console.log('logins요초ㅓ청 호출 호출:',req.body);

    res.setHeader('Access-Control-Allow-Origin','localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials','true');

    passport.authenticate('local',(err,user,info) => {
        console.log('localstoragetgy locals실행후에 인증 결과값 콜백함수로써 호출:',err,user,info);
        if(err){
            console.error(err);
            return next(err);
        }
        if(!user){
            return res.status(403).json({
                info,
                result:'로그인 실패',
                success:false
            });
        }
        return req.login(user,err => {
            if(err){
                console.error(err);
                return next(err);
            }
            return res.json({
                user,
                result:'success 로그인 성공',
                success: true
            });
        });
    })(req,res,next);
});

//기존 로그아웃
router.get('/logout',(req,res,next) => {
    req.logout();
    req.session.save(function(){
        return res.json('로그아웃');
    });
});
router.get('/hello',(req,res,next) => {
    return res.json('hello world');
});
router.get('/info',(req,res,next)=> {
    const info=req.user;
    return res.json(info);
});
console.log('로그인 로그아웃체크여부 모듈확인:',loginCheck);

router.get('/signup',isLogout,async(req,res,next)=>{
    console.log('singup회원가입폼 페이지 요청을 한다, isLogout상태인 경우에만 접근 가능, 로그아웃됀 상태인인경우에만 처리받음');
    res.render('signUp');
});
router.get('/login',isLogout,async(req,res,next)=>{
    console.log('login로그인폼 페이지 요청을 한다, isLogout상태인 경우에만 접근 가능, 로그아웃상태에서만 처리받음');
    res.render('signIn');
});
router.get('/logoutss',isLogin, (req,res,next) => {
    console.log('logoutsss 로그아웃즈 페이지 요청을 한다, isLogin로그인상태인 경우에만 접근가능,그렇지 않으면 접근처리돼지않음.');
    res.render('signIn');
});
router.get('/session_list',(req,res)=>{
    console.log('요청 req,res,세션존재리스트:',req.session,req.user);
    res.json({'req_user':req.user,'req_session':req.session});
});


module.exports=router;
