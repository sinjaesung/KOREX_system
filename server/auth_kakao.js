//디비 관련 연결 필요
const mysql=require('mysql');
var connection=mysql.createConnection({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    //host: 'localhost',
    //host : '13.209.251.38',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref',
    dateStrings : 'date'
});
connection.connect();

const LocalStrategy=require('passport-local').Strategy;
const KakaoStrategy=require('passport-kakao').Strategy;
const sha256=require('sha256');//이걸 그대로 사용이 가능한가?

const bcrypt=require('bcrypt');

const kakaoKey= {
    //clientID:'1325c6a2d5885b05d9d035f85d182862',
    clientID:'ac08f2d6adfd16a501ad517d7a2fab3f',
    //callbackURL:'http://localhost:8080/auth/social/kakao/callback',
    callbackURL :'https://korexpro.com/api/auth/social/kakao/callback'
};

console.log('passport_kakao.js모듈의 auth_kakao()!! js실행에 의해서 실행, 파라미터전달 모듈로써 전달됄듯 define형태 앱 초기구동시 실행');

module.exports= passport => {
    console.log('모듈 함수 정의에 파라미터로써 passport전달. KAKAO',passport);

    passport.use(
        'kakao-login',
        new KakaoStrategy(kakaoKey, (accessToken,refreshToken,profile,done) => {
            console.log('카카오전략 수립, 카카오로그인 요청에 대한 인증완료후 콜백형태로 호출:',accessToken,refreshToken,profile,done);

            const newuserid='kakao:'+profile.id;
            const newuserpassword=sha256.x2(newuserid);//카카오로그인으로 들어온 계정들은 가입처리가 카카오식별id값, 그리고 그를 sha256x2암호화처리한것이 비번이다.

            const sql='select * from user where user_username= ? and register_type="kakao"';
            const post=[newuserid];

            connection.query(sql,post,(err,results,fields) => {
                if(err){
                    console.log(err);
                    done(err);
                }

                //만약 해당 user_id 카카오연동 자동가입처리됀 유저정보가 없다면 개인회원약관동의페이지(비번입력x)로 이동시킴.
                if(results.length == 0){
                    /*const sql="insert into user(user_username,password) values(?,?)";
                    const post=[newuserid,newuserpassword];
                    connection.query(sql,post,(err,results,fields) => {
                        if(err) {
                            console.log(err);
                            done(err);
                        }
                        //가입이 되었다면 해당유저로 바로 로그인시켜줌
                        const sql="select * from user where user_username=?";
                        const post=[newuserid];
                        connection.query(sql,post,(err,results,fields)=> {
                            if(err){
                                console.log(err);
                                done(err);
                            }
                            const user=results[0];
                            return done(null,user);
                        });
                    });
                    */
                   return done(null,{mem_id:'kakao',newuserid_val:newuserid,newuserpassword_val:newuserpassword});//이렇게 보낸다면 로그인프로필 연동 계정이 코렉스디비상에 없던경우로써(로그인은 성공한것) 약관동의(개인)로 이동시켜, 거기서 최종적 코렉스시스템에 가입시킴.
                }else{
                    //이미 유저가 존재한다면 바로 로그인시켜줌
                    const user=results[0];
                    return done(null,user);
                }
            });
        })
    );
};
