const aligoapi = require('aligoapi');
// 해당 예제는 npm에서도 확인하실 수 있습니다
// npm i aligoapi
// https://www.npmjs.com/package/aligoapi

var AuthData = {
  key: 'gqq8z9mw1j3v02wdyggj01cozvh7y2jb',
  // 이곳에 발급받으신 api key를 입력하세요
  user_id: 'korex',
  // 이곳에 userid를 입력하세요
}
// 인증용 데이터는 모든 API 호출시 필수값입니다.

//AuthData.testmode_yn = 'Y'
// test 모드를 사용하시려면 'Y'값으로 설정하세요

// form데이터를 포함한 request를 모두 보내시고 JSON data는 body pares를 사용하시기 바랍니다.
//aligoSMSS.JS는 return이 없는 aligosms단독 단일 api호출하는 경우에 사용하는 경우로써 문자의 결과값에 따라서 return결과문을 기다리는지 여부등을 의존합니다.
//따라서 api자체의 리턴값에 의존하지 않고 직렬적 outer api의 return을 처리하고 , 문자내부api는 병렬적 보내는 aligoSms2,3.js과는 차이가 있습니다.

console.log('aligo_sms.js 파일 요소 실행>>>>',aligoapi);

const mysqls=require('mysql2/promise');
const pool =mysqls.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    //host: 'localhost',
    //host : '13.209.251.38',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref',
    dateStrings : 'date'
});


const sendJoinCompany = async (req, res , type,random_newpassword) => {
  // 메시지 발송하기
   req.body['sender'] = '025144114';
   //req.body['sender'] = '01093063307';

   var receive_phone_number= req.body['receiver'];
   var random_number=Math.floor(1000 + Math.random() * 9000);//1000+0~1000+8999.xxxxx -> 1000~9999.xxx 의 네자리의 int정수 반환한다.
   
    req.body['msg'] = random_number;
    
    const connection=await pool.getConnection(async conn=> conn);
    var [rows] = await connection.query("select count(*) from user where phone=? and user_type=?",[req.body['receiver'],req.body['type']]);
    if(rows > 0){
        return res.json({success:false, message:'phone already exit'});
    }
    
    aligoapi.send(req, AuthData)
      .then( async (r) => {
        
            //보편적 휴대폰 인증 관련 로직.
      
          if(r.result_code =='1' && r.message=='success'){
              
              var now_date=new Date();//현재시간
              var now_date2=new Date();//현재시간
              //var oneday_add_date=now_date2.setDate(now_date2.getDate()+1);//하루더하기
              var fiveminute_add_date=now_date2.setMinutes(now_date2.getMinutes()+5);//오분 더하기.오분뒤의 미래 유효시간 오분내로 입력.그 datetime 이전과거시간까지가 유효

              try{
                await connection.beginTransaction();
                var [phone_identifyquery] = await connection.query("insert into phone_identify (identify_number, identify_phone, create_date,certify_possible_datetime) values(?,?,?,?)",[random_number, receive_phone_number, now_date,new Date(fiveminute_add_date)]);
                await connection.commit();
                connection.release();
              }catch(err){
                connection.rollback();
                connection.release();
              }
              
              return res.json({success:true, message:'send success!'});
          }else{
              return res.status(403).json({success:false, message:'send failed!'});
          }
        })
     
}


const send =  (req, res , type,random_newpassword) => {
  // 메시지 발송하기
   req.body['sender'] = '025144114';
   //req.body['sender'] = '01093063307';

   var receive_phone_number= req.body['receiver'];
   var random_number=Math.floor(1000 + Math.random() * 9000);//1000+0~1000+8999.xxxxx -> 1000~9999.xxx 의 네자리의 int정수 반환한다.
   
  // if(receive_phone_number=='010-5587-8970' || receive_phone_number=='01055878970'){
  if(true){
    if(!type){
      req.body['msg'] = random_number;
    }else if(type == '거래개시동의요청' || type=='거래완료동의요청'){
      
    }else if(type=='수임취소알림'){

    }else if(type=='물건투어예약접수 예약시간조정'){

    }else if(type=='임시비밀번호발급'){

      req.body['receiver']= req.body['phone'];
      req.body['msg'] =random_newpassword;//임시비밀번호발급.
      req.body['msg_type']='SMS';
      req.body['title'] = 'api test입니다.';

    }else if(type=='전속기한만료3일전안내' || type=='전속기한만료일안내'){

    }
    
    console.log('>>req.body final:',req.body);
    // req.body = {
    /*** 필수값입니다 ***/
    //   sender: 발신자 전화번호  // (최대 16bytes)
    //   receiver: 수신자 전화번호 // 컴마()분기 입력으로 최대 1천명
    //   msg: 메시지 내용	// (1~2,000Byte)
    /*** 필수값입니다 ***/
    //   msg_type: SMS(단문), LMS(장문), MMS(그림문자)
    //   title: 문자제목(LMS, MMS만 허용) // (1~44Byte)
    //   destination: %고객명% 치환용 입력
    //   rdate: 예약일(현재일이상) // YYYYMMDD
    //   rtime: 예약시간-현재시간기준 10분이후 // HHMM
    //   image: 첨부이미지 // JPEG, PNG, GIF
    // }
    // req.body 요청값 예시입니다.

    /*
    key=xxxx, user_id=xxxxx,sender=025114560 receiver=01012341234,01012341235 destionation:01012341234|ghdrlfehd,01012341235|아무개 
    msg=~~~~님 안녕핫요 api teste esen dtitle=api test입니다.  rdate=20210604 rtime:now time, tstmode_yn=y연동테스트시 image=..
    */
    //var result_get;
    aligoapi.send(req, AuthData)
      .then( async (r) => {
        console.log('async sendrseult then >> send basic process results!!!:',r);

        if(!type){
            //보편적 휴대폰 인증 관련 로직.
          const connection=await pool.getConnection(async conn=> conn);
          //res.send(r);
        // result_get=r;
      
          if(r.result_code =='1' && r.message=='success'){
              //성공한 경우에 한해 db insert한다.
              console.log('문자전송 성공했습니다.');
              
              var now_date=new Date();//현재시간
              var now_date2=new Date();//현재시간
              //var oneday_add_date=now_date2.setDate(now_date2.getDate()+1);//하루더하기
              var fiveminute_add_date=now_date2.setMinutes(now_date2.getMinutes()+5);//오분 더하기.오분뒤의 미래 유효시간 오분내로 입력.그 datetime 이전과거시간까지가 유효

              console.log('now_date,fiveminute_add_date:',now_date,new Date(fiveminute_add_date));//오분뒤의 시간미래값 지정.관련datetime날짜값.

              try{
                await connection.beginTransaction();
                var [phone_identifyquery] = await connection.query("insert into phone_identify (identify_number, identify_phone, create_date,certify_possible_datetime) values(?,?,?,?)",[random_number, receive_phone_number, now_date,new Date(fiveminute_add_date)]);
                console.log('phone_identifyquery resultsss:',phone_identifyquery);//5분뒤의 유효시간을 지정하여 저장해둔다.
                await connection.commit();
                connection.release();
              }catch(err){
                console.log('db query error:',err);
                connection.rollback();
                connection.release();
              }
              
              return res.json({success:true, message:'send success!'});
          }else{
              //실패한경우
              console.log('문자전송에 문제가 있습니다.');
            
              return res.status(403).json({success:false, message:'send failed!'});
          }
        }else if(type =='거래개시동의요청' || type=='거래완료동의요청'){
          if(r.result_code =='1' && r.message=='success'){
            console.log('문자전송 성공했습니다.');
          
            return res.json({success:true, message:'send success!'});
          }else{
              //실패한경우
              console.log('문자전송에 문제가 있습니다.');
            
              return res.status(403).json({success:false, message:'send failed!'});
          }
        }else if(type=='수임취소알림'){
          if(r.result_code=='1' && r.message=='success'){
            console.log('문자전송 성공했습니다.');

            return res.json({success:true, message:'send success'});

          }else{
            //실패한 경우
            console.log('문자전송에 문제가 있습니다.');

            return res.status(403).json({success:false, message:'send failed!'});
          }
        }else if(type=='물건투어예약접수 예약시간조정'){
          if(r.result_code=='1' && r.message=='success'){
            console.log('문자전송 성고했습니다.');

            return res.json({success:true, message:'send success!'});
          }else{
            //실패한 경우 
            console.log('문자전송에 문제가 있습니다.');

            return res.status(403).json({success:false, message:'send failed!'});
          }
        }else if(type=='임시비밀번호발급'){
          if(r.result_code =='1' && r.message=='success'){
              console.log('문자전송 성공했습니다.');
              
              return res.json({success:true, message:'send success!'});
          }else{
            //실패한경우
            console.log('문자전송에 문제가 있습니다.');
            
            return res.status(403).json({success:false, message:'send failed!'});
          }
        }else if(type=='전속기한만료3일전안내' || type=='전속기한만료일안내'){//문자 예약발송입니다!
          if(r.result_code=='1' && (r.message=='success' || r.message=='reserved')){
            console.log('문자전송 성공했습니다.');

            return res.json({success:true, message:'send success!'});
          }else{
            //실패경우
            console.log('문자전송에 문제가 있습니다.');

            return res.status(403).json({success:false,message:'send failed!'});
          }
        } 
      })
      .catch((e) => {
        console.log('send basic process errors!!:',e);
        //res.send(e);
        return res.status(403).json({success:false, message:'send failed!'});
        //result_get=r;
      });
  }else{
     console.log('01055878970아닌 경우 ====>>테스트 완료후 제거');

     return res.status(403).json({success:false, message:'send failed!'});
  }
}

const sendMass = (req, res) => {
  // 메시지 대량발송하기

  // req.body = {
  /*** 필수값입니다 ***/
  //   sender: 발신자 전화번호 // (최대 16bytes) 
  //   rec_1: 수신자 전화번호1
  //   msg_1: 메시지 내용1	// (1~2,000Byte)
  //   msg_type: SMS(단문), LMS(장문), MMS(그림문자)
  //   cnt: 메세지 전송건수 // (1~500)
  /*** 필수값입니다 ***/
  //   title: 문자제목(LMS, MMS만 허용) // (1~44Byte)
  //   destination: %고객명% 치환용 입력
  //   rdate: 예약일(현재일이상) // YYYYMMDD
  //   rtime: 예약시간-현재시간기준 10분이후 // HHMM
  //   image: 첨부이미지 // JPEG, PNG, GIF
  // }
  // req.body 요청값 예시입니다.
  // _로 넘버링된 최대 500개의 rec, msg 값을 보내실 수 있습니다
  console.log('====>>aligo sms sendmultipel메서드 호출::',req.body);
  req.body['sender'] = '025144114';

  console.log("====>>req.body finalss:",req.body);
  
  aligoapi.sendMass(req, AuthData)
    .then((r) => {
      console.log('asnyc send result then >> send multiple proces reulstss:',r);
      
      //res.send(r)
      return res.json({success:true, message:'send multiple success'});
    })
    .catch((e) => {
      console.log('asny send reuslt then send multiep failed~!');
      //res.send(e)
      return res.status(403).json({success:false, message:'send multiple failed!'});
    });
}

const list = (req, res) => {
  // 전송결과보기

  // req.body = {
  //   page: 페이지번호 // (기본 1)
  //   page_size: 페이지당 출력갯수 // (기본 30) 30~500
  //   start_date: 조회시작일자 // (기본 최근일자) YYYYMMDD
  //   limit_day: 조회마감일자
  // }
  // req.body 요청값 예시입니다.

  aligoapi.list(req, AuthData)
    .then((r) => {
      res.send(r)
    })
    .catch((e) => {
      res.send(e)
    })

}

const smsList = (req, res) => {
  // 전송결과보기 상세

  // req.body = {
  /*** 필수값입니다 ***/
  //   mid: 메세지 고유ID	
  /*** 필수값입니다 ***/
  //   page: 페이지번호 // (기본 1)
  //   page_size: 페이지당 출력갯수 // (기본 30) 30~500
  //   start_date: 조회시작일자 // (기본 최근일자) YYYYMMDD
  //   limit_day: 조회마감일자
  // }
  // req.body 요청값 예시입니다.

  aligoapi.smsList(req, AuthData)
    .then((r) => {
      res.send(r)
    })
    .catch((e) => {
      res.send(e)
    })
}

const remain = (req, res) => {
  // 발송가능건수

  aligoapi.remain(req, AuthData)
    .then((r) => {
      res.send(r)
    })
    .catch((e) => {
      res.send(e)
    })
}

const cancel = (req, res) => {
  // 예약취소하기

  // req.body = {
  /*** 필수값입니다 ***/
  //   mid: 메세지 고유ID	
  /*** 필수값입니다 ***/
  // }
  // req.body 요청값 예시입니다.

  aligoapi.cancel(req, AuthData)
    .then((r) => {
      res.send(r)
    })
    .catch((e) => {
      res.send(e)
    })
}

module.exports = {
  send,
  sendMass,
  list,
  smsList,
  remain,
  cancel,
  sendJoinCompany
}