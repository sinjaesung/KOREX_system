const express=require('express');
const router=express.Router();
const passport=require('passport');
const bcrypt=require('bcrypt');

console.log('앱 실행 구동후 defines실행 정의');

router.get('/',async(req,res,next)=>{
    console.log('기본 페이지 요청을 한다');
    res.render('kakaologin');
});

router.get('/kakao',passport.authenticate('kakao-login'));//auth/default -> auth/kakao,kakao_sucdess,... auth/kakao요어 auth/kakao/callback
router.get(
    '/kakao/callback',
    passport.authenticate('kakao-login',{
        successRedirect: '/auth/kakao_success',
        failureRedirect: '/auth/kakao_fail'
    })
);
router.get('/kakao_success',(req,res,next)=>{
    console.log('카카오 로그인 성공');
    res.json({'status':'success!!!!!!!!!!'});
});
router.get('/kakao_fail',(req,res,next)=>{
    console.log('카카오 로그인 실패');
    res.json({'status':'failed!!!!!!!!!!!!!!'});
});


router.get('/naver',passport.authenticate('naver',null),function(req,res){
    console.log('/auth/naver요청 처리 실패failed,stopped');
});//auth/default -> auth/kakao,kakao_sucdess,... auth/kakao요어 auth/kakao/callback
router.get(
    '/naver/callback',
    passport.authenticate('naver',{
        successRedirect: '/auth/naver_success',
        failureRedirect: '/auth/naver_fail'
    }), function(req,res){
        console.log('naver/callback 콜백함수요청돼는것 끝');
    }
);
router.get('/naver_success',(req,res,next)=>{
    console.log('네이버 로그인 성공');
    res.json({'status':'success!!!!!!!!!!'});
});
router.get('/naver_fail',(req,res,next)=>{
    console.log('네이버 로그인 실패');
    res.json({'status':'failed!!!!!!!!!!!!!!'});
});


router.get('/facebook',passport.authenticate('facebook',null),function(req,res){
    console.log('/auth/facebook 요청 처리 실패failed,stopped');
});//auth/default -> auth/kakao,kakao_sucdess,... auth/kakao요어 auth/kakao/callback
router.get(
    '/facebook/callback',
    passport.authenticate('facebook',{
        successRedirect: '/auth/facebook_success',
        failureRedirect: '/auth/facebook_fail'
    }), function(req,res){
        console.log('facebook/callback 콜백함수요청돼는것 끝');
    }
);
router.get('/facebook_success',(req,res,next)=>{
    console.log('facebook 로그인 성공');
    res.json({'status':'success!!!!!!!!!!'});
});
router.get('/facebook_fail',(req,res,next)=>{
    console.log('facebook 로그인 실패');
    res.json({'status':'failed!!!!!!!!!!!!!!'});
});


router.get('/session_list',function(req,res,next){
    console.log('서버 현재 세션리스트:',req.session,req.user);
    res.json({'req_user':req.user,'req.session':req.session});
});
module.exports=router;
