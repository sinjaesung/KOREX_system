//삭제될 예정의 페이지입니다. 2021-0605
const LocalStrategy=require('passport-local').Strategy;
const bcrypt=require('bcrypt');

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

console.log('passports.js의 local실행에 의해서 실행>>define');

module.exports= passport => {
    passport.use(
        new LocalStrategy(
            {
                usernameField:'login_email',
                passwordField:'login_password',
                session:true
            },
            async(login_email,login_password,done) => {
                try{
                    console.log('[assport의 local-login:',login_email,login_password);

                    var sql="select * from users where email=?";
                    var query=connection.query(sql,[login_email],function(err,datas){
                        var existed=undefined;
                        console.log('쿼리결과(로그인시도시에: 이메일 발견 시에):',datas,datas.length);
                        if(err){

                        }
                        if(datas.length){
                            existed=datas[0];//발견데이터중에서 하나(유일 식별아이디 하나)첫 요소.row리턴.
                        }else{

                            existed=false;
                        }

                        console.log('위아래 실행 직렬 동기형태 existed값:',existed,existed.password);

                        if(existed){
                            //const result=await bcrypt.compare(password,existed.password);
                            const result=bcrypt.compareSync(login_password,existed.password);//sync버전
                            if(result){
                                done(null,existed);
                            }else{
                                done(null,false,{
                                    message:'아이디 혹은 암호가 올바르지 않습니다.'
                                });
                            }
                        }else{
                            done(null,false,{
                                message:'아이디 혹은 암호가 올바르지 않습니다.'
                            });
                        }
                    });

                }catch(err){
                    console.error(err);
                    done(err);
                }
            }
        )
    );
};
