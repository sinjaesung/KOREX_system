const coolsms=require('../modules/coolsms');

const http=require('http');
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

//const app=express();
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(cors());

const router=express.Router(); 

router.post('/sendprocess',function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    var number=req_body.number;
    //var message='9999';

    var random_number=Math.floor(1000 + Math.random() * 9000);//1000+0~1000+8999.xxxxx -> 1000~9999.xxx 의 네자리의 int정수 반환한다.

    console.log('보낼 수신대상 번호와,메시지:',number,random_number);

    var sms_result=coolsms.sendSms(request,response);
    console.log(sms_result);
    response.json(sms_result);
});
router.get('/sendprocess',function(request,response){
    response.json('sendProcess get request 테스트:');
});

module.exports=router;