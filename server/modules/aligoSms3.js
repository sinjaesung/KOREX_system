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

const send =  (data) => {
  // 메시지 발송하기
   //console.log('==>>aligomsm send메서드 호출! 요청request전달전달:',req,req_data);
   
   data['body']['sender'] = '025144114';
   //req.body['sender'] = '01093063307';
 

    //data['body']['msg'] = req_data.msg;
 
  // console.log('>>data.body final:',req.body);
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
  aligoapi.send(data, AuthData)
    .then( async (r) => {
        console.log('async sendrseult then >> send basic process results!!!:',r);

        if(r.result_code =='1' && r.message=='success'){
            console.log('문자전송 성공했습니다.');
        
           // return res.json({success:true, message:'send success!'});
        }else{
            //실패한경우
            console.log('문자전송에 문제가 있습니다.');      
            //return res.status(403).json({success:false, message:'send failed!'});
        }
      
      /*else if(type =='거래개시동의요청' || type=='거래완료동의요청'){
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

          return res.json({success:true, message:'send success!'});

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

          return res.status(403).json({success:false, message:'send failed!'});
        }
      }*/ 
    })
    .catch((e) => {
      console.log('send basic process errors!!:',e);
      //res.send(e);
      //return res.status(403).json({success:false, message:'send failed!'});
      //result_get=r;
    });
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
  cancel
}