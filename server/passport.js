const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

const mysql=require('mysql');
var connection=mysql.createConnection({
    host:'localhost',
    port:3307,
    user:'sinja',
    password:'sinja',
    database:'passport_test'
});
connection.connect();

passport.use('local-login',new LocalStrategy({
        usernameField: 'user_id',
        passwordField: 'password',
        passReqToCallback:true
    },(req,user_id,password,done)=>{
        console.log('pssport의 local-login :',user_id,password);

        /*if(user_id !='kang' || password!='12345'){
            console.log('비밀번호 불일치!');
            return done(null,false,req.flash('loginMessage','비밀번호 불일치'));
        }*/
        var sql='select * from users where user_id=? and password=?';
        var query=connection.query(sql,[user_id,password],function(err,datas){
            if(err) return done(err);
            if(datas.length){
                console.log('해당 정보 회원 존재한다.');
                return done(null,{
                    user_id:user_id
                });
            }else{
                return done(null,false,{
                    message:'아이디 혹은 암호가 다릅니다.'
                });
            }
        });
    }
));

passport.serializeUser(function(user,done){
    console.log('seriliazeUser() 호출됌,');
    console.log(user,done,user.user_id);

    try{
        done(null,user.user_id);
    }catch(e){

    }
});

passport.deserializeUser(function(user_id,done){
    console.log('passport session get user_id:',user_id);

    done(null,user_id);
});

module.exports=passport;
