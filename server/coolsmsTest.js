const coolsms=require('./coolsms'); //coolsms custoizme apis load

const http=require('http');
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

var app=express();
//app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.post('/sendprocess',function(request,response){
    console.log('===>>>request.body',request.body);
    
    var req_body=request.body;
   // console.log('sendprocess post request:',req_body);

    var number=req_body.number;
   // var message=req_body.message;//보낼 메시지.
     message='9999';
    console.log('보낼 수신 대상번호와,메시지:',number,message);

    //console.log('coolsms',coolsms,coolsms.sendSms);

    var sms_result=coolsms.sendSms(request,response);
    console.log(sms_result);
    response.json(sms_result);//response,json하는것의 있어야 처리가 됄것임. response로 render.,txt,json으로 겨로가반환을 해야 받을수있다.
});
app.get('/sendform',function(request,response){
    
    response.render('signIn');
   
});

//개인 회원가입post요청
app.post('/member/register', function(request,response){
    console.log('=========>>request.body',request.body);

    var req_body=request.body;

    var 
})

//55550 서버 하나로 처리 비동기형태의 응답 async기반 . 여러 요청이 몰려도 막히는것은 일단 없음.
http.createServer(app).listen(55550,function(){
    console.log('server running at 127.0.0.1:55550');
});
