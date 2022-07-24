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
const NaverStrategy=require('passport-naver').Strategy;
const sha256=require('sha256');//이걸 그대로 사용이 가능한가?

const bcrypt=require('bcrypt');

const naverKey= {
    //clientID:'Y1kP2_so_kvzRpl24FYe',
    clientID: 'pszXyW9mvHCnhlgVapmp',
    //clientSecret:'VpP4iEKbZK',
    clientSecret : 'N6ZnoPNQuX',
    //callbackURL:'http://localhost:8080/auth/social/naver/callback',
    callbackURL: "https://korexpro.com/api/auth/social/naver/callback"
};

console.log('passport_naver.js모듈의 auth_naver()!! js실행에 의해서 실행, 파라미터전달 모듈로써 전달됄듯 define형태 앱 초기구동시 실행');

module.exports= passport => {
    console.log('모듈 함수 정의에 파라미터로써 passport전달. Naver',passport);

    passport.use(
        'naver-login',
        new NaverStrategy(naverKey, (accessToken,refreshToken,profile,done) => {
            console.log('네이버전략 수립, 네이버로그인 요청에 대한 인증완료후 콜백형태로 호출:',accessToken,refreshToken,profile,done);

            const newuserid='naver:'+profile.id;
            const newuserpassword=sha256.x2(newuserid);

            const sql='select * from user where user_username=? and register_type="naver"';
            const post=[newuserid];

            connection.query(sql,post,(err,results,fields) => {
                if(err){
                    console.log(err);
                    done(err);
                }

                //naver 자동가입처리됀 유저젖ㅇ보없다면 새론 아디만들고 로그인시켜줌
                if(results.length == 0){
                    console.log('reuslts.lenght==0',results.length,results);
                    return done(null,{mem_id:'naver',newuserid_val : newuserid, newuserpassword_val : newuserpassword});
                }else{
                    const user=results[0];
                    return done(null,user);
                }
            });
        })
    );
};
