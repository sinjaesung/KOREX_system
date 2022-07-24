const express=require('express');
const router=express.Router();
const passport=require('passport');
const bcrypt=require('bcrypt');

console.log('socialRouter 요소 실행!!!!!:',passport);

router.get('/',async(req,res,next)=>{
    console.log('기본 페이지 요청을 한다');
    res.render('kakaologin');
});

router.get('/kakao',passport.authenticate('kakao-login'));//auth/default -> auth/kakao,kakao_sucdess,... auth/kakao요어 auth/kakao/callback  api/auth/xxxxx 이런형태 서버에선 설정서버에선 api가 붙어야만 반응되게끔 셋팅
router.get(
    '/kakao/callback',
    passport.authenticate('kakao-login',{
        successRedirect: '/auth/social/kakao_success',
        failureRedirect: '/auth/social/kakao_fail'
    })
);
router.get('/kakao_success',(req,res,next)=>{
    console.log('카카오 로그인 성공시에(두가지 케이스 모두여기를 case)',req.session,next);
    //res.json({'status':'success!!!!!!!!!!'});

    var req_session_passport=req.session.passport.user;
    if(req_session_passport['mem_id']==='kakao' || req_session_passport['newuserid_val'] || req_session_passport['newuserpassword_val']){
        console.log('===>>>카카오 소셜로그인 계정정보로의 정보 코렉스db에 존재하지 않았던 경우:',req_session_passport);

        res.statusCode=302;
        //res.setHeader('Location','http://localhost:3000/MemJoinAgreeSocial/'+req_session_passport['newuserid_val']);
        res.setHeader('Location','https://korexpro.com/MemJoinAgreeSocial/'+req_session_passport['newuserid_val']);
        res.end();
    }else{
        console.log('====>>카카오 소셜로그인 계정정보로의 정보 코렉스db에 존재했던 경우 로그인처리:',req_session_passport);

        req.session.user_id=req_session_passport['mem_id'];
        req.session.islogin=true;

        req.session.save(function(){
            res.statusCode=302;
           // res.setHeader('Location','http://localhost:3000/');
            res.setHeader('Location','https://korexpro.com/');
            res.end();
        });
        //res.statusCode=302;
        //res.setHeader('Location','http://localhost:3000/');
        //res.end();
    }
});
/*router.get('/kakao_fail',(req,res,next)=>{
    console.log('카카오 로그인 실패');//deprecated..
    res.statusCode=302;
    res.setHeader('Location','http://localhost:3000/MemJoinAgreeSocial/');
    res.end();
    //res.json({'status':'failed!!!!!!!!!!!!!!'});
});*/


router.get('/naver',passport.authenticate('naver-login'));//auth/default -> auth/kakao,kakao_sucdess,... auth/kakao요어 auth/kakao/callback
router.get(
    '/naver/callback',
    passport.authenticate('naver-login',{
        successRedirect: '/auth/social/naver_success',
        failureRedirect: '/auth/social/naver_fail'
    })
);
router.get('/naver_success',(req,res,next)=>{
    console.log('네이버 로그인 성공',req.sessison);

    var req_session_passport= req.session.passport.user;
    if(req_session_passport['mem_id']==='naver' || req_session_passport['newuserid_val'] || req_session_passport['newuserpassword_val']){
        console.log('======>>네이버 소셜로그인 계정정보로의정보 코렉스db에 존재하지 않았던 경우!:',req_session_passport);

        res.statusCode=302;
        //res.setHeader('Location','http://localhost:3000/MemJoinAgreeSocial/'+req_session_passport['newuserid_val']);
        res.setHeader('Location','https://korexpro.com/MemJoinAgreeSocial/'+req_session_passport['newuserid_val']);
        res.end();
    }else{
        console.log('======>>네이버 소셜로그인 계정정보로의 정보 코렉스db에 존재했던 경우 로그인처리:',req_session_passport);

        req.session.user_id=req_session_passport['mem_id'];
        req.session.islogin = true;

        req.session.save(function(){
            res.statusCode=302;
            //res.setHeader('Location','http://localhost:3000/');
            res.setHeader('Location','https://korexpro.com');
            res.end();
        });
    }
});
/*
router.get('/naver_fail',(req,res,next)=>{
    console.log('네이버 로그인 실패');
    res.json({'status':'failed!!!!!!!!!!!!!!'});
});
*/

router.get('/facebook',passport.authenticate('facebook-login'));//auth/default -> auth/kakao,kakao_sucdess,... auth/kakao요어 auth/kakao/callback
router.get(
    '/facebook/callback',
    passport.authenticate('facebook-login',{
        successRedirect: '/auth/social/facebook_success',
        failureRedirect: '/auth/social/facebook_fail'
    })
);
router.get('/facebook_success',(req,res,next)=>{
    console.log('facebook 로그인 성공');

    var req_session_passport= req.session.passport.user;
    if(req_session_passport['mem_id'] === 'facebook' || req_session_passport['newuserid_val'] || req_session_passport['newuserpassword_val']){
        console.log('=====>>페이스북 소셜로그인 계정정보로의 정보 코렉스d에 존재하지않았던 경우::',req_session_passport);

        res.statusCode=302;
        //res.setHeader('Location','http://localhost:3000/MemJoinAgreeSocial/'+req_session_passport['newuserid_val']);
        res.setHeader('Location','https://korexpro.com/MemJoinAgreeSocial/'+req_session_passport['newuserid_val']);
        res.end();
    }else{
        console.log('======>페이스북 소셜로그인 계정정보로의 정보 코렉스db에 존재했던 경우 로그인처리::',req_session_passport);

        req.session.user_id=req_session_passport['mem_id'];
        req.session.islogin = true;

        req.session.save(function(){
            res.statusCode=302;
            //res.setHeader('Location','http://localhost:3000/');
            res.setHeader('Location','https://korexpro.com');
            res.end();
        })
    }
});
/*
router.get('/facebook_fail',(req,res,next)=>{
    console.log('facebook 로그인 실패');
    res.json({'status':'failed!!!!!!!!!!!!!!'});
});*/


router.get('/session_list',function(req,res,next){
    console.log('서버 현재 세션리스트:',req.session,req.user);
    res.json({'req_user':req.user,'req.session':req.session});
});
module.exports=router;
