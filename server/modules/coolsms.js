const {config,group} = require('coolsms-node-sdk');
const conf=require('../config/smsconfig'); //smsconfig.json

//cool sms api 설정
config.init({
    apiKey : /*"NCSEHX0S1UAWEBLX",*/conf.apiKey,
    apiSecret: /*"QAKMXH23QC9ALTVFTOYSX3UYZZXJ4LSD"*/conf.apiSecret
})

/*async function send(message,agent = {}){
    try{
        console.log('====send메소드 호출 관련 파라미터 넘어옴:',message,agent);
        var res= await group.sendSimpleMessage(message,agent);
        console.log('=====res:',res);
        return res;
    }catch(e){
        throw new Error(e);
    }
}*/
async function send(params={}){
    try{
        const response=await group.sendSimpleMessage(params);
        console.log('message send responses:',response);
    }catch(e){
        console.log(e);
    }
}
const params = {
  text: '[쿨에스엠에스 테스트] 흐흐흐 테스트진행... 테스트 문자발송!!', // 문자 내용
  type: 'SMS', // 발송할 메시지 타입 (SMS, LMS, MMS, ATA, CTA)
  to: '01055878970', // 수신번호 (받는이)
  from: '01055878970' // 발신번호 (보내는이)
}
//coll sms api 사용
exports.sendSms=(req,response)=> {
    console.log('==============>>>>문자요청 send api 호출===============<<<:');
    const number = req.body.number;

    var random_number=Math.floor(1000 + Math.random() * 9000);//1000+0~1000+8999.xxxxx -> 1000~9999.xxx 의 네자리의 int정수 반환한다.

    console.log('>>number:'+number);
    console.log('>>message:'+random_number);
    console.log('conf.type,conf.from:',conf.type,conf.from);
    try{
        /*var res=send({
            to:number,
            text:message,
            type:conf.type,
            from:conf.from
        });*/
        //console.log(response);
        //response.json( {result:true});
        return {result:true,sms_message:random_number};
    }catch(e){
        console.log(e);
        //response.json( {result:false,message:'sms transmission failed'});
        return {result:false};
    }
};
//send(params);
