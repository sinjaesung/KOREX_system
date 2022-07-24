//$$수정 부분 - korex( 프론트 )
// 아래에 bcrypt부분을 import 받아옴... 11.10
const bcrypt = require('bcrypt');

const mysqls=require('mysql2/promise');
const { getTestMessageUrl } = require('nodemailer');
const sha256 = require('sha256');
const pool= mysqls.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref'
});

module.exports = {
    async getBasicFcmAuthentication(req){
        const {fcmTocken, mem_id} = req.body;
        const connection = await pool.getConnection(async conn=>conn);
        try{
            await connection.query("update user set fcmtocken=? where mem_id=?",[fcmTocken, mem_id]);
            connection.release();
            return res.json({success:true, message:'user login tockenupdate success'})
        }catch(err){
            connection.release();
            return res.status(403).json({success:false, message:'user login tockenupdate fail'});
        }
    },
    async getMemberRegiEmailIdentify(req){
        const {identifier} = req.body;
        const connection=await pool.getConnection(async conn=> conn);
        try{
            var [emailrows] = await connection.query("select * from email_identify where identify_number=? LIMIT 1",[identifier]);
            connection.release();
            return emailrows;
        }catch(err){
            connection.release();
            return [];
        }
    },
    async getMemberRegister(req){
        const { email,password,usertype,agree_status }=req.body;
    
        var is_select_agree=false;
        if(agree_status.indexOf('agree_optional')!=-1){
            is_select_agree=true;
        }else{
            is_select_agree=false;
        }

        const connection = await pool.getConnection(async conn => conn);

        //이메일 중복검사진행. 개인 회원리스트중에서 해당 이메일유저 존재검사. 
        try{
            //탈퇴회원,비탈퇴회원여부 상관없이 전체 유저내역중에서 개인전체 회원중에서 해당 이메일로의 내역이 존재핮는지엽부(탈퇴한 개인회원까지 조회함.탈퇴한 개인회원정보로 가입시도시에 막을수있음)
            var [rows,fields]=await connection.query('select * from user where email=? and user_type=?',[email,usertype]);
            connection.release();

            if(rows.length>0 || rows[0]){
                return {success : false , message : '개인 회원리스트에 이미 가입되어있는 이메일입니다.'};
            }
        }catch(err){
            connection.release();
            return {success : false , message : 'email exists query server error'};
        }

        var hashed=bcrypt.hashSync(password,10);

        try{
            var [rows,fields]= await connection.query("insert into user(email,user_type,register_type,password,mem_admin,create_date,modify_date,mem_notification) values(?,?,?,?,?,?,?,?)",[email,usertype,'korex',hashed,'root',new Date(),new Date(),is_select_agree]);
            connection.release();
            return {success : true , message: email+'::)회원님 개인회원 가입이 완료되었습니다.' };
        }catch(err){
            connection.release();
            return {success : false , message : 'server users insert query error'};
        }

    },
    async getRegisterSocialAppleLogin(req,result){
        //result.sub고유 애플로그인 고유아이디값.>>
        
        const connection = await pool.getConnection(async conn => conn);
        var [applelogin_user_query] = await connection.query("select * from user where user_username= ? and register_type='apple'",[result.sub]);//애플로그인 가입되어있는 유저정보 해당 로그인시도한 아이디로 가입되어있는지 여부
        
        let newuserid=result.sub;
        let newuserpassword=sha256.x2(newuserid);//암호화 고유아이디값을 암호화처리한것..
        connection.release();
        //가입된 애플로그인 정보가 없으면 관련된 처리
        if(applelogin_user_query.length == 0){
            return {success:false, message:'가입된 정보가 없으므로 소셜애플가입페이지로 이동합니다.',newuserid_val:newuserid,newuserpassword_val:newuserpassword};
        }else{
            return {success:true, message:'가입된 정보가 있어서 바로 로그인 처리!'};
        }
    }

}