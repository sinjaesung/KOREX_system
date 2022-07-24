const authService = require('../service/authService');
const appleService = require('../utils/apple');

const init = (app) =>{

    //메인서버 authentication basic fcmTocken 클라이언트로부터 보내온 쿠키 fcmToken value정보 토큰값 조회한다.
    app.post('/api/auth/basic_fcm_authentication',async(req,res) => {
        return await authService.getBasicFcmAuthentication(req);
    });

    //개인회원가입 전에 고유식별자로부터 서버에 요청하여 얻어낸 개인회원가입인증요청자의 이메일값을 추적하여 얻는부분코드.그 얻는 과정에서 유효하지않은 값여부 판단
    app.post('/api/auth/member/member_regi_emailIdentify',async(req,res,next)=>{
        return await authService.getMemberRegiEmailIdentify(res,req);
    });

    app.post('/api/register', async (req, res, next) => {
        try{
            await authService.register(req);
            res.json({ success: true, message: 'CREATE' });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ success: false, message: err });
        }
    });

    //개인 회원가입
    app.post('/api/auth/member/register',async(req,res,next)=> {
        return await authService.getMemberRegister(res,req);
    });

    app.get('/api/apple/redirect',async(req,res,next)=> {
        console.log('애플로그인 요청>>>:',req.body);
        let result = await appleService.appleAuthAction(res,req);

        //result.sub
        //result.sub
        //.sub; 만쓰세요 아이디입니다.
        /*
        result data 예시 
{ iss: 'https://appleid.apple.com',
  aud: 'com.korex.applelogin',
  exp: 1631628622,
  iat: 1631542222,
  sub: '000511.b00caf979fd442b59e4573fc3599e0fb.0353',
  at_hash: 'ewhquWxxp4QRmVvFdsVEGw',
  auth_time: 1631542221,
  nonce_supported: true }
        */

        let loginprocess_result = await authService.registerSocialAppleLogin(res,req,result);
        //res.redirect('/finish?id' + string);
        return loginprocess_result;
    }); 
}


module.exports = {
    initController(app){
        init(app);
    },
}