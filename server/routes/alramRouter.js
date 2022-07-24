const coolsms=require('../modules/coolsms');
const aligosms2 = require('../modules/aligoSms2');
const aligosms3=require('../modules/aligoSms3');//문자알리미(알리고)
const fcmpushalram=require('../modules/fcmPushalram');//푸시알림(fcm)

const http=require('http');
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

//const app=express();
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(cors());

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

console.log('==>>>>>brokerRouter default program excecute poolss::',pool);

//알람라우터에 구현. setInterval로 하여 프로그램실행(mainserver실행시점에 프로그램실행되며, 실행시점이후 settInterval계속 돈다.)
console.log(">>>main_server실행 앱서버실행 시점에 의한 alramRouter 요소실행");

//Seterinterval 일일요약알림로직 startss...
var alram_timer = setInterval( async () => {
    var connection_globe= await pool.getConnection(async conn => conn);
    console.log('==============1시간마다 실행===================');
    
    var now_date=new Date();
    console.log('현재 서버 오늘현재날짜',now_date,now_date.getFullYear(),now_date.getMonth()+1,now_date.getDate());
    console.log('현재 서버 시간값:',now_date.getHours(),now_date.getMinutes());
    var today_range_start=now_date.getFullYear()+ '-'+( now_date.getMonth()+1 <10 ? '0'+(now_date.getMonth()+1) : now_date.getMonth()+1) + '-'+( now_date.getDate()+1 <10 ? '0'+now_date.getDate() : now_date.getDate()) + ' 00:00:00';
    var today_range_end = now_date.getFullYear()+ '-'+( now_date.getMonth()+1 <10 ? '0'+(now_date.getMonth()+1) : now_date.getMonth()+1) + '-'+ ( now_date.getDate()+1 <10 ? '0'+now_date.getDate() : now_date.getDate()) + ' 23:59:59';

    if(now_date.getHours() == 19){
        console.log('===>>현재 포착된 시간 19시대이며, 유저별 일일요약알림 보냅니다!!');
        console.log('금일 시간범위 :',today_range_start,today_range_end);
        //19 01~1959인 순간에 일별로 항상 19로 조회될것이고, 19시대인순간이면 일일요약알림 보내기(유저별로) 코드를 쫘르륵 긁어와실행한다.

        //전체 유저리스트중에서 alramSemtting값에 일일요약알림 notiset_rsv값이 1인 내역들만 조회.(일일요약알림받기론 한 유저들만)
        var [base_userlist] = await connection_globe.query("select * from user u join notificationSetting note on u.mem_id=note.mem_id where note.notiset_rsv=1");

        for(let s=0; s<base_userlist.length; s++){
            let memid_local=base_userlist[s]['mem_id'];
            let [noti_query]= await connection_globe.query("select * from notification where mem_id=? and reserv_plan_date is null and create_date >= ? and create_date <= ?",[memid_local,today_range_start,today_range_end]);//금일 해당 유저에게(팀원,소셜로그인자,생성자,모두 포함한 사람들임) 발생한 모든 비예약(즉시발송내역)내역들을 조회한다.
            console.log('noti_query::',noti_query);
            if(noti_query.length>=1){
                //일일 즉시발송한 내역들이 있는 경우에만 요약알림을 보냅니다.
                let make_string='';
                for(let ss=0; ss<noti_query.length; ss++){
                    let item=noti_query[ss];
                    make_string += ( (ss+1)+'. txn_id::'+item['txn_id']+', noti_type:'+item['noti_type']+' message:'+item['noti_content']+'::[발송일]:'+item['create_date']);
                    make_string += ('\n');
                }
                console.log('각 memId유저 및 유저별 일일(금일) 모든 비예약형태의 즉시알림내역들 리스트::',memid_local, make_string);

                //해당 유저가 이제 앱 설치자인지(앱설치자라면 앱 푸시알람으로 일괄저장한 내역들) 그날발생한 내역들 모두 요약하여서 대상에게 푸시알람 or 앱 미설치자라면 문자알림 처리한다.
                let [user_query]=await connection_globe.query("select * from user where mem_id=?",[memid_local]);
                let user_fcmtocken=user_query[0]['fcmtocken'];//fcmtocken값이 있다는것 앱설치자라는뜻임. null로 비어있으면 아직 미설치자임.
                let user_phone= user_query[0]['phone'];
                if(user_fcmtocken){
                    console.log('해당 유저는 앱 설치자로써 푸시알람 전송!',memid_local,user_fcmtocken);

                    fcmpushalram.push_send(null,user_fcmtocken,make_string,'일일요약알림')
                    
                }else{
                    console.log('해당 유저는 앱 미설치자로써 문자알람 전송!!',memid_local,user_phone);             
                
                    if(user_phone == '01055878970' || user_phone.indexOf('01055878970')!=-1){
                        console.log('번호가 01055878970인 유저에게만 일때만 작성:',user_phone);
                        let send_data={
                            'headers' : {
                                'content-type': null
                            },
                            'body' : {
                                'msg' : make_string,
                                'msg_type' : 'LMS',
                                'title' : '일일요약알림 문자',
                                'receiver' : user_phone
                            }
                        }
                        aligosms3.send(send_data);
                    }              
                }
            }
            
        }
        //유저별(for문)로 모두 일일요약일괄보냄 완료후(실행구문 통과후)에 realse!! 
    }
    connection_globe.release();
},1000*60*60);//1시간에 한번씩 실행 n시m분에 프로그램 서버가 node서버가 켜졌다면 켜진시점때가 오후7시가 아니라면 아무것도 안하고, 오후7시대 였던 경우에만 관련 로직 실행


//Seterinval 일일요약알림 로직 ends...
const router=express.Router(); 

//알림상태값 변경update
router.post('/noti_status_update',async function(request,response){
    console.log('====+========>>noti status update request.body',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        var noti_id = req_body.noti_id;

        await connection.beginTransaction();
        var [noti_update_query] = await connection.query("update notification set noti_status=1 where noti_id=?",[noti_id]);
        await connection.commit();

        if(noti_update_query){
            console.log('server query success:',noti_update_query);
            connection.release();

            return response.json({success:true, message:'server query success'});
        }else{
            console.log('server query error');
            connection.rollback();
            connection.release();

            return response.status(403).json({success:false, message:'server query full problem error!'});
        }
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//알림상태값 변경update 숨김처리
router.post('/noti_status_update2',async function(request,response){
    console.log('====+========>>noti status update request.body',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        var noti_id = req_body.noti_id;

        await connection.beginTransaction();
        var [noti_update_query] = await connection.query("update notification set noti_status=2 where noti_id=?",[noti_id]);
        await connection.commit();

        if(noti_update_query){
            console.log('server query success:',noti_update_query);
            connection.release();

            return response.json({success:true, message:'server query success'});
        }else{
            console.log('server query error');
            connection.rollback();
            connection.release();

            return response.status(403).json({success:false, message:'server query full problem error!'});
        }
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//알림관련 처리(알림발송)
router.post('/notification_process',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        
        var prd_identity_id= req_body.prd_identity_id;//noti_id 어떤 매물id값(transaction,prdidinetiity)에 대한 관련 알림인지여부.
        var request_mem_id=req_body.request_mem_id; //요청의뢰인memid 
        //var prd_status_val = req_body.prd_status_val;//prd_status_val 상태값
        var noti_type = req_body.noti_type;//noti_type
        var message= req_body.message;//메시지는 상황별로 다양할수있다.  
        var company_id = req_body.company_id;
        var request_company_id=req_body.request_company_id;//임의 중개사가 어떤소속상태에서 신청했던건지.

        if(noti_type == 1){
            //의뢰검토결과 관련 알림. 그 의뢰자에게 알림이 가해져야함.  전문중개사 의뢰검토결과 알림 ->>>>>개인기업 소속체들에게 알림.
            //mem_id 알림대상인,txn_id관련 아이디, noti_content(알림메시지내용), noti_type(알림타입:의뢰검토결과알림,....) , noti_stauts(읽었나삭제되었나여부)
            //받는 사람memid가 회원타입을 구한다. 
            var [send_memid_sosoklist] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);
            var user_type=send_memid_sosoklist[0].user_type;
            var company_id_get = send_memid_sosoklist[0].company_id;//해당 유저의 유저타입을 구한다.
            //var noti_case='전속매물공급(개인,기업)';
            var noti_case='전속매물상태알림';

            console.log('target companyid getss:',company_id_get);

            if(user_type == '개인'){
                var [notiset_brokerprd_part_query] = await connection.query("select * from notificationSetting where mem_id=?",[request_mem_id]);
                if(notiset_brokerprd_part_query.length>=1){
                    if(notiset_brokerprd_part_query[0]['notiset_brokerprd_part']){
                        var notiset_brokerprd_part_array=notiset_brokerprd_part_query[0]['notiset_brokerprd_part'].split(',');
                    }else{
                        var notiset_brokerprd_part_array=[];
                    }
                    
                    var notiset_brokerprd=notiset_brokerprd_part_query[0]['notiset_brokerprd'];

                    if(notiset_brokerprd_part_array.includes(prd_identity_id) && notiset_brokerprd==1){
                        //해당 관련된 거래개시동의요청 관련된 매물 상태변경에 따른 알림보낼지 여부 판단. 해당 리스트에 있는 prd매물과 중개의뢰관리 체크인 알림받기로
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                         //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                         var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);
                         if(targetuser_query.length>=1){
                             if(targetuser_query[0].fcmtocken){
                                 //토큰존재시에 푸시알림
                                 console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                 fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'의뢰접수검토결과');
                                 return response.json({success:true, message:'notification_insert_rows등 server query success!!'});    
                             }else{
                                 //토큰이 없다면 문자알림!
                                 console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                 let req_data={
                                 
                                     receiver: targetuser_query[0].phone,
                                     msg : message,
                                     msg_type : 'LMS',
                                     title : '의뢰접수검토결과',
                                     type : '의뢰접수검토결과'
                                     
                                 }
                                 
                                 aligosms2.send(request,req_data,response,'의뢰접수검토결과');
                             }
                         }
                    }
                }else{
                    //해당 관련된 회원유저 알림셋팅 아무것도 없는 유저러면 그냥 보냄.
                    await connection.beginTransaction();
                    var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit(); 
                    console.log('notificaiton insert rowss inqery query orwss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'의뢰접수검토결과');
                            return response.json({success:true, message:'notification_insert_rows등 server query success!!'});    
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '의뢰접수검토결과',
                                type : '의뢰접수검토결과'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'의뢰접수검토결과');
                        }
                    }
                }
                
            }else{
               
                //특정 소속하 팀원들에게 보내기. (팀원 + 최초생성자 생성자또한 companymember에 최초가입시에 개설되게끔 추가된다.>>>)
                var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[request_mem_selectsosokid]);//해당 소속사업체의 소속팀원들 소속의 모든 memid들에게보낸다. 의뢰자에 선택 소속에 해당하는 (의뢰자포함) 멤버들에게.보낸다. 의뢰자소속으로 선택했었던 값에 해당하는 소속팀원들 + 생성자(최초 가입자)에게 모두 보내야한다.최초생성자->>>팀원들(팀원들끼리 자기들끼리 관리자,팀원 등 조율 조정가능, 팀원들이 생성자는 못 제거함.최초생성자)
                console.log('해당 사업체 소속 회원들:ㅣ',company_sosok_userlist);

                for(let ss=0; ss<company_sosok_userlist.length; ss++){
                    let local_memid = company_sosok_userlist[ss].mem_id;

                    //정확히 해당 memid개인기업회원에게 각 팀원별 보낼 알림셋팅에 따라서 조건만족시애만 발송저장처리. 
                    var [notiset_brokerprd_part_query] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,request_mem_selectsosokid]);
                    if(notiset_brokerprd_part_query.length>=1){
                        if(notiset_brokerprd_part_query[0]['notiset_brokerprd_part']){
                            var notiset_brokerprd_part_array=notiset_brokerprd_part_query[0]['notiset_brokerprd_part'].split(',');
                        }else{
                            var notiset_brokerprd_part_array=[];
                        }
                        
                        var notiset_brokerprd=notiset_brokerprd_part_query[0]['notiset_brokerprd'];
                        console.log('localmemid,notisetbrokerprdpart:',local_memid,notiset_brokerprd_part_query[0]['notiset_brokerprd_part'],notiset_brokerprd);

                        if(notiset_brokerprd_part_array.includes(prd_identity_id) && notiset_brokerprd==1){
                            //해당 관련된 거래개시동의요청 관련 상태변경따른 알림보낼지 여부 판단. 해당 리스트에 있는 prd매물과 중개의뢰관리 체크인 알림받기로
                            await connection.beginTransaction();
                            var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,request_mem_selectsosokid,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                            await connection.commit();
                            console.log('notifciaton insert rowss insert query rowsss:',notification_insert_rows);

                            //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                            var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                            if(targetuser_query.length>=1){
                                if(targetuser_query[0].fcmtocken){
                                    //토큰존재시에 푸시알림
                                    console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                    fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'의뢰접수검토결과');
                                }else{
                                    //토큰이 없다면 문자알림!
                                    console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                    let req_data={
                                    
                                        receiver: targetuser_query[0].phone,
                                        msg : message,
                                        msg_type : 'LMS',
                                        title : '의뢰접수검토결과',
                                        type : '의뢰접수검토결과'
                                        
                                    }
                                    
                                    aligosms2.send(request,req_data,response,'의뢰접수검토결과');
                                }
                            }
                        }
                    }else{
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[local_memid,request_mem_selectsosokid,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                         //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                         var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                         if(targetuser_query.length>=1){
                             if(targetuser_query[0].fcmtocken){
                                 //토큰존재시에 푸시알림
                                 console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                 fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'의뢰접수검토결과');
                             }else{
                                 //토큰이 없다면 문자알림!
                                 console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                 let req_data={
                                 
                                     receiver: targetuser_query[0].phone,
                                     msg : message,
                                     msg_type : 'LMS',
                                     title : '의뢰접수검토결과',
                                     type : '의뢰접수검토결과'
                                     
                                 }
                                 
                                 aligosms2.send(request,req_data,response,'의뢰접수검토결과');
                             }
                         }
                    }                   
                }
            } 
            connection.release();
            //return response.json({success:true, message:'notification_insert_rows등 server query success!!'});         
        }else if(noti_type==2){
            //신규의뢰접수사건 발생.  개인기업 신규의뢰등록 대상 companyid 소속체들에게 ->>>>전문중개사 회원들 알림.
            //mem_id 알림대상인,txn_id관련 아이디, noti_content(알림메시지내용), noti_type(알림타입:의뢰검토결과알림,....) , noti_stauts(읽었나삭제되었나여부)
            //관련 company_id소속에 있는 팀원들에게 모두 보낸다.중개의뢰접수가 처리된경우에 알림저장발송처리/해당 중개사에서 물건관리관련알림체크여부/물건별 알ㄹ미섲렁 리스트 체크여부 보통은 prd_part_array는 해당 prdiienitiy는 새로 추가이기에 없는 경우가 많음. 중개의뢰대상 중개사companyid소속자들에게 모두>>

           // var noti_case='전속매물공급(전문중개사)';
            var noti_case ='전속매물상태알림';

            //특정 소속 하의 companymember팀웑들에게 보내기.(해당 중개사 생성자,팀원들 모두에게)
            var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id]);//해당 전문중개사 소속 팀원들 소속의 모든 memid들에게보낸다.
            console.log('해당 중개사 대상companyid소속 회원들::',company_sosok_userlist);

            for(let ss=0; ss<company_sosok_userlist.length; ss++){
                let local_memid= company_sosok_userlist[ss].mem_id;

                //정확히 각 memid별 알람셋팅에 따라서 조건 만족시에만 발송(저장) 처리한다. 각 중개사회원별 각 물건별 설정관리에 알림을 받기로 선택한 이런순서대로 각 물건별 설정관리에서 해당 id에 대한 알림설정물건목록이 있으면 통과이고, 없다면 우선 물건관리에 체크여부 확인 물건과리가 체크되어있으면 물건설정에서 없어도 보냄.
                var [notiset_prd_part_query] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id]);
                if(notiset_prd_part_query.length>=1){
                    //var notiset_prd_part_array=notiset_prd_part_query[0]['notiset_prd_part'].split(',');
                    var notiset_prd=notiset_prd_part_query[0]['notiset_prd'];

                    if(notiset_prd==1){
                        //새로 물건 등록된경우엔 물건별 알림설정 체크여부 상관없이 그냥 물건관리 체크여부에 따라서만 검사하며, 미체크시에 미수신,미저장 처리. 체크시엔 저장처리한다.
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        console.log('targtuserqueryu:',targetuser_query);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'신규의뢰접수');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '신규의뢰접수',
                                    type : '신규의뢰접수'
                                    
                                }
                                
                                aligosms2.send(request,req_data,response,'신규의뢰접수');
                            }
                        }
                    }  
                }else{
                    //알림셋팅결과가 아예 없는 경우거나 한경우에는 제한없음.따로 설정 안한것이기에.알림가해짐.
                    await connection.beginTransaction();
                    var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notificaiton insert rowss insert query rowsss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다. 있는유저인경우에 대해서만 푸시알림 또는 문자알림 addon!!
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                    console.log('targetuserquerys::',targetuser_query);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'신규의뢰접수');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '신규의뢰접수',
                                type : '신규의뢰접수'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'신규의뢰접수');
                        }
                    }
                }                 
            } 
            connection.release();
            //return response.json({success:true, message:'notification_insert_rows등 server query success!!'});         
        }else if(noti_type==6){
            // or 거래개시동의요청거절+수락 올시에 관련 알림 전문중개사에게 가해짐.

           // var noti_case='전속매물공급(전문중개사)';
            var noti_case='전속매물상태알림';

             //특정 중개사 소속팀원들에게 보내기.(해당 소속 생성자와 팀원들에게 모두 보낸다.)
            var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id]);//해당 전문중개사 소속 팀원들 소속의 모든 memid들에게보낸다. compnay_member하 존재들에게 전문중개사 회원들에게 전송한다.
            console.log('해당 중개사 대상companyid소속 회원들::',company_sosok_userlist);
            //개인기업회원에게 보낸 거래개시동의요청에 대한 결과값 관련된 알림을 받는지 여부.각 소속 중개사팀원별로memid별로 동일내용으로 보내는데, 팀원별 알림설정셋팅이기에 그 설정한것에 따라서 알림을 받을지 안받을지 여부 커스터마이징 가능
            for(let ss=0; ss<company_sosok_userlist.length; ss++){
                let local_memid= company_sosok_userlist[ss].mem_id;

                console.log('local memId::',local_memid,notiset_prd_part_array,notiset_prd);

                //정확히 각memid별 알림셋팅에 따라서 조건만족시에만 발송(저장)처리한다. 각 중개사회원별 각 물건별 설정관리에 알림을 받기로 선택한 이런순서대로 각 물건별 설정관리에서 해당 id에 대한 알림설정물건목록이 있으면 통과이고, 없다면 물건관리에 체크여부 확인 물건관리 체크되어있으면 물건설정에서 없어도 보냄.
                var [notiset_prd_part_query] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id]);
                if(notiset_prd_part_query.length>=1){
                    if(notiset_prd_part_query[0]['notiset_prd_part']){
                        var notiset_prd_part_array=notiset_prd_part_query[0]['notiset_prd_part'].split(',');
                    }else{
                        var notiset_prd_part_array=[];
                    }
                   
                    var notiset_prd=notiset_prd_part_query[0]['notiset_prd'];

                    if(notiset_prd_part_array.includes(String(prd_identity_id)) && notiset_prd==1){
                        //물건별 알림설정 항목에서 있는 prd_identitiy품목이라면 바로 통과이다.해당 각 유저가 어떤id매물에 대해 어떤 내용알림이 보내진건지 저장처리.물건관리도 체크되어있어야 보내짐.
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'거래개시동의요청결과');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '거래개시동의요청결과',
                                    type : '거래개시동의요청결과'
                                    
                                }
                                
                                aligosms2.send(request,req_data,response,'거래개시동의요청결과');
                            }
                        }
                    }  
                }else{
                    await connection.beginTransaction();
                    var [notification_insert_rows]=await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'거래개시동의요청결과');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '거래개시동의요청결과',
                                type : '거래개시동의요청결과'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'거래개시동의요청결과');
                        }
                    }
                }       
            } 
            connection.release();
            //return response.json({success:true, message:'notification_insert_rows등 server query success!!'});         
        }else if(noti_type ==3){
            //중개의뢰매물or외부수임매물에 대한 상태변경관련된 여러 사건별 발생  전문중개사의 매물에 대한 액션으로인해(수임취소,이런것들) =>>관련 개인,기업소속체들에게 알림진행.
            //memid 알림대상인 txnid관련 아이ㅏ디,알림메시지내용 
            //받는 사람memid가 회원타입을 구한다.  중개사 -> 개인,기업 의뢰자에게 가해지는 관련 알림들.(중개의뢰매물 수임취소등.) 특정 중개의뢰매물AAAAA가 87소속상태에서인 oriign로부터 보낸것인데, 그러면 그 87상태인 그 하의 회원들에게만 알림떄리는게 기획적으로 적합하다. AAAA신청한 의뢰인이 90,98에 모두 소속되어있다고 하더라도 90,98비소속상태에서 신청한것이기에 그들에게까지 보내는것은 말이안됨. 중개의로인memid는 필요없고 그 중개인의 선택소속값만 필요하며, 그 소속값 하에 관련 회원들에게 당시시점에 보낸다.
           // var noti_case='전속매물공급(개인,기업)';
            var noti_case='전속매물상태알림';

            //관련 requestemmeid의 회원타입등을 구한다>>
            var [send_memid_sosoklist] = await connection.query("select * from user where mem_id=?",[request_memid]);//해당 매물을 의뢰한 사람memid의 소속회사comapnyid정보를 얻음.
            var user_type=send_memid_sosoklist[0].user_type;
            var company_id_get= send_memid_sosoklist[0].company_id;
            console.log('target companyid getss:',company_id_get);
            
            if(user_type == '개인'){
                //정확히 각 memmid별 알림셋팅에 따라서 조건만족시 발송처리한다. 중개사 수임취소수임취소 이런것으로 관련 개인,기업회원에게 관련 매물상태변경 관련 알림 변경알림여부 지정판단
                var [notiset_brokerprd_part_query] = await connection.query("select * from notificationSetting where mem_id=?",[request_mem_id]);
                if(notiset_brokerprd_part_query.length>=1){
                    if(notiset_brokerprd_part_query[0]['notiset_brokerprd_part']){
                        var notiset_brokerprd_part_array=notiset_brokerprd_part_query[0]['notiset_brokerprd_part'].split(',');
                    }else{
                        var notiset_brokerprd_part_array=[];
                    }
                    
                    var notiset_brokerprd=notiset_brokerprd_part_query[0]['notiset_brokerprd'];
                    console.log('memid::',request_mem_id,notiset_brokerprd_part_array);
                    if(notiset_brokerprd_part_array.includes(String(prd_identity_id)) && notiset_brokerprd==1){
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notificaiton insert rowsss insert query rowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다. 푸시알림의 경우 앱설치아니 memid유저라고한다면 때리고,미설치자로 판단되면 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);//개인해당회원
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림::',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(request_mem_id,targetuser_query[0].fcmtocken,message,'의뢰매물상태변경');
                            }else{
                                //토큰이 없다면 문자알림!!!
                                console.log('토큰이 없다면 문자알림!!:',aligosms2,aligosms2.send);
                                let req_data = {
                                    receiver : targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '중개의뢰매물 상태변경',
                                    type : '중개의뢰매물수임취소'
                                }

                                aligosms2.send(request,req_data,response,'중개의뢰매물수임취소');
                            }
                        }
                    }
                }else{
                    //해당 관련된 회원유저가 알림셋팅 아무것도 없는 유저라면 그냥 보냄.
                    await connection.beginTransaction();
                    var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('noticiaition insert rowss insrert query rowss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다. 푸시알림의 경우 앱설치아니 memid유저라고한다면 때리고,미설치자로 판단되면 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);//개인해당회원
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림::',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'의뢰매물상태변경');
                        }else{
                            //토큰이 없다면 문자알림!!!
                            console.log('토큰이 없다면 문자알림!!:',aligosms2,aligosms2.send);
                            let req_data = {
                                receiver : targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '중개의뢰매물 상태변경',
                                type : '중개의뢰매물수임취소'
                            }

                            aligosms2.send(request,req_data,response,'중개의뢰매물수임취소');
                        }
                    }
                }              
            }else{
                
                //해당 기업회원하 팀원들에게 보낸다.(생성자,팀원들 모두에게)
                var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id_get]);//해당 소속사업체의 소속팀원들 소속의 모든 memid들에게보낸다.
                console.log('해당 사업체 소속 회원들:ㅣ',company_sosok_userlist);

                for(let ss=0; ss<company_sosok_userlist.length; ss++){
                    let local_memid = company_sosok_userlist[ss].mem_id;

                    var [notiset_brokerprd_part_query] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id_get]);
                    if(notiset_brokerprd_part_query.length >= 1){
                        if(notiset_brokerprd_part_query[0]['notiset_brokerprd_part']){
                            var notiset_brokerprd_part_array=notiset_brokerprd_part_query[0]['notiset_brokerprd_part'].split(',');
                        }else{
                            var notiset_brokerprd_part_array=[];
                        }
                        
                        var notiset_brokerprd=notiset_brokerprd_part_query[0]['notiset_brokerprd'];
                        console.log('memid::',local_memid,notiset_brokerprd_part_array);

                        if(notiset_brokerprd_part_array.includes(String(prd_identity_id)) && notiset_brokerprd==1){
                            await connection.beginTransaction();
                            var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id_get,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                            await connection.commit();
                            console.log('notification insert rowss insert query rowsss:',notification_insert_rows);

                            //알림수신받는다고 동의한경우에만 푸시알림 떄린다. 푸시알림의 경우 앱설치아니 memid유저라고한다면 때리고,미설치자로 판단되면 문자알림을 한다.
                            var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);//개인해당회원
                            if(targetuser_query.length>=1){
                                if(targetuser_query[0].fcmtocken){
                                    //토큰존재시에 푸시알림
                                    console.log('토큰존재 푸시알림::',targetuser_query[0],targetuser_query[0].fcmtocken);
                                    fcmpushalram.push_send(request_mem_id,targetuser_query[0].fcmtocken,message,'의뢰매물상태변경');
                                }else{
                                    //토큰이 없다면 문자알림!!!
                                    console.log('토큰이 없다면 문자알림!!:',aligosms2,aligosms2.send);
                                    let req_data = {
                                        receiver : targetuser_query[0].phone,
                                        msg : message,
                                        msg_type : 'LMS',
                                        title : '중개의뢰매물 상태변경',
                                        type : '중개의뢰매물수임취소'
                                    }

                                    aligosms2.send(request,req_data,response,'중개의뢰매물수임취소');
                                }
                            }
                        }
                    }else{
                        //해당 관련 유저 알림셋팅 아무것도 없다면 그냥 보냄.
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[local_memid,company_id_get,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다. 푸시알림의 경우 앱설치아니 memid유저라고한다면 때리고,미설치자로 판단되면 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);//개인해당회원
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림::',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(request_mem_id,targetuser_query[0].fcmtocken,message,'의뢰매물상태변경');
                            }else{
                                //토큰이 없다면 문자알림!!!
                                console.log('토큰이 없다면 문자알림!!:',aligosms2,aligosms2.send);
                                let req_data = {
                                    receiver : targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '중개의뢰매물 상태변경',
                                    type : '중개의뢰매물수임취소'
                                }

                                aligosms2.send(request,req_data,response,'중개의뢰매물수임취소');
                            }
                        }
                    }                   
                }
            }
            connection.release();
           // return response.json({success:true, message:'notification_insert_rows등 server query success!!'});
        }else if(noti_type == 4){
            //개인기업회원들이 매물에 대한 액션 수행시에(위임취소,의뢰철회,...등) ->>관련 companyid수임 전문중개사들에게 관련 알림 가해짐. 해당 COMPANYID 해당 수임매물 맡긴 전문중개사companyid 하의 모든 companymember소속 회원들 companymember특정하나에 소속된 회원들 리스트.들에게보낸다.
            
            //var noti_case='전속매물공급(전문중개사)';
            var noti_case='전속매물상태알림';

             //특정 소속 중개사 팀원들에게보낸다. 소속 팀원들,생성자
            var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id]);//해당 수임 전문중개사 관련 회원들.
            console.log('해당 중개사 대상companyid소속 회원들::',company_sosok_userlist);

            for(let ss=0; ss<company_sosok_userlist.length; ss++){
                let local_memid= company_sosok_userlist[ss].mem_id;

                //정확히 각 memid별 알림셋팅에 따라서 조건만족시에만 발송저장처리한다. 각 중개사회원별 각 물건별 섲렁관리에 알림받기로 선택한 이런순서대로 
                var [notiset_prd_part_query] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id]);
                if(notiset_prd_part_query.length>=1){
                    
                    if(notiset_prd_part_query[0]['notiset_prd_part']){
                        var notiset_prd_part_array=notiset_prd_part_query[0]['notiset_prd_part'].split(',');
                    }else{
                        var notiset_prd_part_array=[];
                    }
                    
                    var notiset_prd=notiset_prd_part_query[0]['notiset_prd'];

                    console.log('local memId::',local_memid,notiset_prd_part_array,notiset_prd);
                    if(notiset_prd_part_array.includes(String(prd_identity_id)) && notiset_prd==1){
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);//해당 txn_id대상 매물에과 해당 메시지,해당 타입관련 내용으로 가한다. 
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'의뢰매물상태변경');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '중개의뢰매물 상태변경',
                                    type : '중개의뢰매물상태변경'
                                    
                                }
                                
                                aligosms2.send(request,req_data,response,'중개의뢰매물상태변경');
                            }
                        }
                    }
                }else{
                    await connection.beginTransaction();
                    var [notification_insert_rows]= await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notificaition insert rowss insert query rowss:',notification_insert_rows,local_memid);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'의뢰매물상태변경');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '중개의뢰매물상태변경',
                                type : '중개의뢰매물상태변경'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'중개의뢰매물상태변경');
                        }
                    }
                }                
            }     
            connection.release();
            //return response.json({success:true, message:'notification_insert_rows등 server query success!!'});
        }else if(noti_type == 5){

            //var noti_case='전속매물공급(개인,기업)';
            var noti_case='전속매물상태알림';

            console.log('fcmpushalram',fcmpushalram,fcmpushalram.push_send);
            //전문중개사 ->>의뢰자(중개의뢰인) 알림noticiation가해짐(외부수임인에겐 알리고로 대신) 전속매물공급(기업,개인)관련 알림설정연관성
            var maemul_info = req_body.maemul_info;
            console.log('->>request maeemulfino:',maemul_info);

            var [send_memid_sosoklist] = await connection.query("select * from user where mem_id=?",[request_mem_id]);
            var user_type =send_memid_sosoklist[0].user_type;
            //var company_id_get= send_memid_sosoklist[0].company_id;
            //console.log('target companyid getss:',company_id_get);
            var company_id_get = req_body.request_company_id;
            //의뢰된or외부수임된 물건의 선임 중개사 구하기
            let company_id = req_body.company_id;
            var [probroker_info ] = await connection.query("select * from company2 where company_id=?",[company_id]);
            var get_probroker_name = probroker_info[0]['company_name'];

            var message_final=message+'\n\n'+maemul_info+'\n선임중개사 : '+get_probroker_name+'\n\n'+'[[내용확인]] https://korexpro.com/Preview/'+prd_identity_id;
            if(user_type =='개인'){

                //정확히 해당memid 개인회원에게 보낼 알림셋팅에 따라서 조건만족시에만 발송저장처리한다. 각 중개사회원별 각 물건별 설정관리에 알림받기로 선택한 이런순서대로
                var [notiset_brokerprd_part_query] = await connection.query("select * from notificationSetting where mem_id=?",[request_mem_id]);
                if(notiset_brokerprd_part_query.length>=1){
                    if(notiset_brokerprd_part_query[0]['notiset_brokerprd_part']){
                        var notiset_brokerprd_part_array=notiset_brokerprd_part_query[0]['notiset_brokerprd_part'].split(',');
                    }else{
                        var notiset_brokerprd_part_array=[];
                    }
                    console.log('===>>>local memid:',request_mem_id,notiset_brokerprd_part_query[0]['notiset_brokerprd_part'],prd_identity_id,notiset_brokerprd_part_array,notiset_brokerprd_part_array.includes(prd_identity_id));
                    var notiset_brokerprd=notiset_brokerprd_part_query[0]['notiset_brokerprd'];

                    if(notiset_brokerprd_part_array.includes(String(prd_identity_id)) && notiset_brokerprd==1){
                        //console.log('관련 조건 만족시에 회원별 알림수신받을 조건 완성시에::',notiset_brokerprd_part_array.includes(prd_identity_id));
                        //해당 관련된 거래개시동의요청한 관련된 매물 관련된 매물상태변경에 따른 알림을 보낼지 여부 판단. 해당 리스트에 있는 prd매물과,중개의뢰관리 체크인 알림받기로 (중개의뢰관련)인경우에만 알림저장처리.알림받기로 할 중개의뢰매물인경우이면서 중개의뢰물건관리체크된 경우에 한해서만 해당 중개의뢰물에 대한 관련 알림저장등록
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(request_mem_id,targetuser_query[0].fcmtocken,message_final,'의뢰매물상태변경');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message_final,
                                    msg_type : 'LMS',
                                    title : '중개의뢰매물 상태변경',
                                    type : '거래개시동의요청'                                   
                                }                               
                                aligosms2.send(request,req_data,response,'거래개시동의요청');
                            }
                        }
                    }
                }else{
                    //해당 관련된 회원유저가 알림셋팅 아무것도 없는유저라면 그냥 보냄.
                    await connection.beginTransaction();
                    var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notification insert rowsss insert query rwowsss:',notification_insert_rows);

                
                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(request_mem_id,targetuser_query[0].fcmtocken,message_final,'의뢰매물상태변경');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                                
                                receiver: targetuser_query[0].phone,
                                msg : message_final,
                                msg_type : 'LMS',
                                title : '중개의뢰매물 상태변경',
                                type : '거래개시동의요청'
                                
                            }
                          
                            aligosms2.send(request,req_data,response,'거래개시동의요청');
                        }
                    }
                }
            }else{
                 
                var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id_get]);//해당 소속사업체의 소속팀원들 소속의 모든 memid들에게보낸다. 의뢰자가 선택했었떤 소속상태에서 중개의뢰보낸것이고, 그런 관련 내역이기에 그 관련 소속의 기업대상소속인들에게만 보냄.
                console.log('해당 사업체 소속 회원들:',company_sosok_userlist);

                for(let ss=0; ss<company_sosok_userlist.length; ss++){
                    let local_memid = company_sosok_userlist[ss].mem_id;

                    //정확히 해당 memid개인기업회원에게 각 팀원회원별 보낼 알림셋팅에 따라서 조건만족시에만 발송저장처리한다.각 중개사회원별 각 물건별 설정관리에 알림받기로 선택한 이런순서대로
                    var [notiset_brokerprd_part_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id_get]);
                    if(notiset_brokerprd_part_query.length>=1){
                        if(notiset_brokerprd_part_query[0]['notiset_brokerprd_part']){
                            var notiset_brokerprd_part_array=notiset_brokerprd_part_query[0]['notiset_brokerprd_part'].split(',');
                        }else{
                            var notiset_brokerprd_part_array=[];
                        }
                        console.log('===>>>local memid:',local_memid,notiset_brokerprd_part_query[0]['notiset_brokerprd_part'],prd_identity_id,notiset_brokerprd_part_array,notiset_brokerprd_part_array.includes(prd_identity_id));
                        var notiset_brokerprd=notiset_brokerprd_part_query[0]['notiset_brokerprd'];

                        if(notiset_brokerprd_part_array.includes(String(prd_identity_id)) && notiset_brokerprd==1){
                            //console.log('관련 조건 만족시에 회원별 알림수신받을 조건 완성시에::',notiset_brokerprd_part_array.includes(prd_identity_id));
                            //해당 관련된 거래개새시승인요청관련된 매물관련 매물상태변경에 따른(거래개싯ㅅ승인요청)알림보낼지 여부 판단. 해당 리스트에있는 prd매물과 중개의뢰관리 체크인 알림받기로(중개의뢰관련)인경우만 알림저장처리.
                            await connection.beginTransaction();
                            var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id_get,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_case]);
                            await connection.commit();
                            console.log('notificaiton insert rowss insert query rowsss:',notification_insert_rows);

                            //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                            var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                            if(targetuser_query.length>=1){
                                if(targetuser_query[0].fcmtocken){
                                    //토큰존재시에 푸시알림
                                    console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                    fcmpushalram.push_send(local_memid,targetuser_query[0].fcmtocken,message_final,'의뢰매물상태변경');
                                }else{
                                     //토큰이 없다면 문자알림!
                                    console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                    let req_data={
                                
                                        receiver: targetuser_query[0].phone,
                                        msg : message_final,
                                        msg_type : 'LMS',
                                        title : '중개의뢰매물 상태변경',
                                        type : '거래개시동의요청'
                                        
                                    }
                                
                                    aligosms2.send(request,req_data,response,'거래개시동의요청');
                                }
                            }
                        }
                    }else{
                        //해당 관련된 회원유저가 알림셋팅 아무것도 없는 유저라면 그냥 보냄.
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id_get,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notificiaton insert rowss insert query rowsssss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(local_memid,targetuser_query[0].fcmtocken,message_final,'의뢰매물상태변경');
                            }else{
                                 //토큰이 없다면 문자알림!
                                 console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                 let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message_final,
                                    msg_type : 'LMS',
                                    title : '중개의뢰매물 상태변경',
                                    type : '거래개시동의요청'
                                    
                                }
                               
                                aligosms2.send(request,req_data,response,'거래개시동의요청');
                            }
                        }
                    }
                }
            }
        }else if(noti_type==8){
            //개인기업회원들이 접수신청한 내역들에 대해서 수정 및 예약취소할시마다 관련 알림처리.8번 구번 모두 전속매물공급(전문중개사)관련 알림의 큰 카테고리속함.
            //var noti_case='전속매물공급(전문중개사)';
            var noti_case='물건투어예약';

            var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id]);//해당 수임 전문중개사 관련 회원들.
            console.log('해당 중개사 대상companyid소속 회원들::',company_sosok_userlist);

            for(let ss=0; ss<company_sosok_userlist.length; ss++){
                let local_memid= company_sosok_userlist[ss].mem_id;

                var [notiset_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id]);
                if(notiset_query.length>=1){
                    var notiset_rsv_prd_manage=notiset_query[0]['notiset_rsv_prd_manage'];//물건투어예약접수내역(신규접수)에 대한 알림 받을지여부.그냥 특정prdieintityti타겟팅없고,임의의 신규접수발생시에 관련된 매물관련된 접수내역 알림저장 할지 여부 판단.
                    if(notiset_query[0]['notiset_rsv_prd_manage_part']){
                        var notiset_rsv_prd_manage_part_array=notiset_query[0]['notiset_rsv_prd_manage_part'].split(',');
                    }else{
                        var notiset_rsv_prd_manage_part_array=[];
                    }
                    console.log('prdidneintitiyid value::',prd_identity_id,local_memid,notiset_rsv_prd_manage, notiset_query[0]['notiset_rsv_prd_manage_part'],notiset_rsv_prd_manage_part_array);
                    if(notiset_rsv_prd_manage==1 && notiset_rsv_prd_manage_part_array.includes(String(prd_identity_id))){
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);//해당 txn_id대상 매물에과 해당 메시지,해당 타입관련 내용으로 가한다. 
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'물건투어예약접수 예약자수정');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '물건투어예약접수내역 예약자측 수정',
                                    type : '물건투어예약접수내역 예약자측 수정'
                                    
                                }
                                
                                aligosms2.send(request,req_data,response,'물건투어예약접수내역 예약자측 수정');
                            }
                        }
                    }   
                }else{
                    await connection.beginTransaction();
                    var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notification insert rowss insert query rowwsss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'물건투어예약접수 예약자수정');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '물건투어예약접수내역 예약자측 수정',
                                type : '물건투어예약접수내역 예약자측 수정'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'물건투어예약접수내역 예약자측 수정');
                        }
                    }
                }                     
            }      
            connection.release();
            //return response.json({success:true, message:'notification_insert_rows등 server query success!!'});
        }else if(noti_type==9){
            //개인기업회원들이 특정 중개사올려놓은 매물에 대해 물건투어예약접수시에마다 관련 수임매물 중개사에게 알림가한다. 큰 카테고리는 전속매물공급에 속함>물건투어예약접수알림수신. txn_id는 매물id임. 신규접수시에진행.
            var noti_case='물건투어예약';

            var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id]);//해당 수임 전문중개사 관련 회원들.
            console.log('해당 중개사 대상companyid소속 회원들::',company_sosok_userlist);

            for(let ss=0; ss<company_sosok_userlist.length; ss++){
                let local_memid= company_sosok_userlist[ss].mem_id;

                var [notiset_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id]);
                if(notiset_query.length>=1){
                    var notiset_rsv_prd_manage=notiset_query[0]['notiset_rsv_prd_manage'];//물건투어예약접수내역(신규접수)에 대한 알림 받을지여부.그냥 특정prdieintityti타겟팅없고,임의의 신규접수발생시에 관련된 매물관련된 접수내역 알림저장 할지 여부 판단.

                    if(notiset_rsv_prd_manage==1){
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);//해당 txn_id대상 매물에과 해당 메시지,해당 타입관련 내용으로 가한다. 
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'물건투어예약접수 신규접수');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '물건투어예약접수신청',
                                    type : '물건투어예약접수신청'
                                    
                                }
                                
                                aligosms2.send(request,req_data,response,'물건투어예약접수신청');
                            }
                        }
                    }   
                }else{
                    await connection.beginTransaction();
                    var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notification insert rowss insert query rowwsss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'물건투어예약접수 신규접수');

                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '물건투어예약접수신청',
                                type : '물건투어예약접수신청'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'물건투어예약접수신청');
                        }
                    }
                }                     
            }
            connection.release();
            //return response.json({success:true, message:'notification_insert_rows등 server query success!!'});      
        }else if(noti_type == 10){
            //전문중개사 ->>물건투어예약접수자 알림noticiation가해짐 중개사가 개인기업 물건투어예약접수한 내역에 대해 수정이발발시에(trid)그걸 일단txnid로 해서 관련 접수자or접수자 소속 회원들모두에게 해서 예약시간조정관련 아림보냄. 큰틀에서 전속매물수요관련 알림.
           console.log('==>>>req_body:',req_body);
            var noti_case='물건투어예약';

            var [send_memid_sosoklist] = await connection.query("select * from user where mem_id=?",[request_memid]);//해당 Tourservation내역에 신청자user쿼리진행한다 개인인지 기업회원였던지 판단한다.개인회원였다면 그 개인함녕한테 다이렉트로 보내면되고, 팀원회원이였다면 현재 소속되어ㅇ져있는 comapnyid의 소속팀원들에게만 동적으로 보낸다.
            var user_type =send_memid_sosoklist[0].user_type;
            //var company_id_get= send_memid_sosoklist[0].company_id;
            var company_id_get= req_body.request_user_selectsosokid;//어떤 소속상태였었는지.
            console.log('target companyid getss:',company_id_get);
            var tour_reserv_id = req_body.tour_reserv_id;//어떤 tourReservid에 대해서 개인기업에게 전속매물수요관련알림(시간재조정,예약해제,물건투어예약하루전관련trid로 알림받을지 전속매물수요관련 알림 여부 결정가능.)

            if(user_type =='개인'){
                var [notiset_query] = await connection.query("select * from notificationSetting where mem_id=?",[request_mem_id]);
                if(notiset_query.length>=1){
                    var notiset_rsv_prd_reserve = notiset_query[0]['notiset_rsv_prd_reserve'];//물건투어예약접수내역 신청한것에 대해서 예약시간대 재조정사실에 대한 알림받을지 여부 셋팅상태 조회한다. 관련 재조정사건 발생시마다 insert발생하는데 그것을 막음.(insert안하면 그 insert한것에 대한 알림은 뜨지 않겠지.)
                    if(notiset_query[0]['notiset_rsv_prd_reserve_part']){
                        var notiset_rsv_prd_reserve_part_array=notiset_query[0]['notiset_rsv_prd_reserve_part'].split(',');
                    }else{
                        var notiset_rsv_prd_reserve_part_array=[];
                    }
                    console.log('tour_rseerv_id::',notiset_rsv_prd_reserve,request_mem_id,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part'],notiset_rsv_prd_reserve_part_array);
                    if(notiset_rsv_prd_reserve == 1 && notiset_rsv_prd_reserve_part_array.includes(String(tour_reserv_id))){
                        console.log('알림발송가능한 대상체::',notiset_rsv_prd_reserve,request_mem_id,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part']);
                        //그 관련 물건투어예약접수내역(내물건투어) 받겠는지 여부 받겠다.해당 내역이 있는경우에.
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?)",[request_memid,tour_reserv_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notificaiton insert rowss insert query orwss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'물건투어예약접수시간 재조정');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '물건투어예약접수시간 재조정',
                                    type : '물건투어예약접수시간 재조정'
                                    
                                }
                                
                                aligosms2.send(request,req_data,response,'물건투어예약접수시간 재조정');
                            }
                        }
                    }
                }else{
                    //예약셋팅한 내역이 없다면 바로 보낸다.insert한다. 즉시 insert형태. insert하는게 곧 바로 알림보여지는확인되는
                    await connection.beginTransaction();
                    var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?)",[request_memid,tour_reserv_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notification insert rowss insert query rowssss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'물건투어예약접수시간 재조정');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '물건투어예약접수시간 재조정',
                                type : '물건투어예약접수시간 재조정'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'물건투어예약접수시간 재조정');
                        }
                    }
                }
                
            }else{
               //개인에게 보내느알림이라면 그 개인한명에 대한 소속없이 소속알림셋팅이 아니라, 개인유저별 알림셋팅으로 참조하고, 기업,중개사등 회원이라면 소속알림셋팅으로처리>
                var [company_sosok_userlist] = await connection.query("select * from user where company_id=?",[company_id_get]);//해당 소속사업체의 소속팀원들 소속의 모든 memid들에게보낸다. 재조정시에 인자로 넘어온 trid신청자의 소속comapnyid값에 해당하는 회원들 팀원들 전부에게 알림.
                console.log('해당 사업체 소속 회원들:',company_sosok_userlist);

                for(let ss=0; ss<company_sosok_userlist.length; ss++){
                    let local_memid = company_sosok_userlist[ss].mem_id;

                    var [notiset_query] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id_get]);
                    if(notiset_query.length>=1){
                        var notiset_rsv_prd_reserve=notiset_query[0]['notiset_rsv_prd_reserve'];//물건투어예약접수내역 신청한것에 대한 예약시간재조정사실에 대한알림받을지 여부 셋팅상태 조회한다. 관련 재조정사건 발생시마다 insert발생하는거 그것을 막음.
                        if(notiset_query[0]['notiset_rsv_prd_reserve_part']){
                            var notiset_rsv_prd_reserve_part_array=notiset_query[0]['notiset_rsv_prd_reserve_part'].split(',');
                        }else{
                            var notiset_rsv_prd_reserve_part_array=[];
                        }
                        console.log('tour_rseerv_id::',notiset_rsv_prd_reserve,local_memid,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part'],notiset_rsv_prd_reserve_part_array);
                        if(notiset_rsv_prd_reserve == 1 && notiset_rsv_prd_reserve_part_array.includes(String(tour_reserv_id))){
                            console.log('알림발송가능한 대상체::',notiset_rsv_prd_reserve,local_memid,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part']);
                            //그 관련 물건투어예약접수내역(내물건투어) 받겠는지 여부 받겠다.
                            await connection.beginTransaction();
                            var [notification_insert_rows] = await connection.query('insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[local_memid,company_id_get,tour_reserv_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                            await connection.commit();
                            console.log('notificaiton insert orwss insert queryt orwss:',notification_insert_rows);

                            //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                            var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                            if(targetuser_query.length>=1){
                                if(targetuser_query[0].fcmtocken){
                                    //토큰존재시에 푸시알림
                                    console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                    fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'물건투어예약접수시간 재조정');
                                }else{
                                    //토큰이 없다면 문자알림!
                                    console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                    let req_data={
                                    
                                        receiver: targetuser_query[0].phone,
                                        msg : message,
                                        msg_type : 'LMS',
                                        title : '물건투어예약접수시간 재조정',
                                        type : '물건투어예약접수시간 재조정'
                                        
                                    }
                                    
                                    aligosms2.send(request,req_data,response,'물건투어예약접수시간 재조정');
                                }
                            }
                        }
                    }else{
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id_get,tour_reserv_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notificaiton insert rowss insert query rowsss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'물건투어예약접수시간 재조정');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '물건투어예약접수시간 재조정',
                                    type : '물건투어예약접수시간 재조정'
                                    
                                }
                                
                                aligosms2.send(request,req_data,response,'물건투어예약접수시간 재조정');
                            }
                        }
                    }
                }
            }
            connection.release();
            return response.json({success:true, message:'notification_insert_rows등 server query success!!'});
        }
        //예약형 알림1(일일전 발송) 
        else if(noti_type==11){
            var noti_case='물건투어예약';

            //개인기업회원이 물건투어예약접수신청시에 개인기업회원 자신에게 예약알림형태로 쌓아둔다.(최초신청시에는 관련insert하고,수정때부터는 update되게끔 로직변경필요)
            var [send_memid_sosoklist] = await connection.query("select * from user where mem_id=?",[request_memid]);
            var user_type= send_memid_sosoklist[0].user_type;//로그인한 자기자신(접수신청한사람 접수신청시점에 or 개인물건투어예약접수수정 or 개별,일괄수정시에 관련 수정
            var company_id_get=send_memid_sosoklist[0].company_id;//물건투어예약자(대상자)의 소속값.소속companyid값이 곧 신청당시의 소속comapnyid값이다.
            var request_user_selectsosokid = req_body.request_user_selectsosokid;//신규접수물건투어예약 예약자의 현재 소속id값. 그 소속id에 해당하는 소속팀원들에게 다보낸다.

            var tour_reserv_id=req_body.tour_reserv_id;
            var noti_reserv_date=req_body.noti_reserv_date;//날짜 문자열을 date형태 변환필요?? 하루전날짜값으로 넘어온 날짜문자열 그대로 저장하면 될뿐임.
            var action=req_body.action;
            
            console.log('>>개인기업회원이 물건투어예약접수신청or접수신청수정or중개사회원 접수내역 개별or일괄수정시에 관련 api처리>>:',noti_reserv_date);

            if(action=='insert'){
                if(user_type =='개인'){
                    //개인or기업이 물건투어예약접수시점때(insert)에 최초로 관련된 노티 예약알림(일일전입니다.)가한다.만약 내일것을 신청하면 오늘이 곧 에약알림대상일이기에 오늘 바로 알림이 오는 즉시효과임.어쨋든 이러한 예약형태의 알림insert를 받지않음.받음 설정가능
                    var [notiset_query] = await connection.query("select * from notificationSetting where mem_id=?",[request_mem_id]);//해당 신청한 유저의 관련알림셋팅조회
                    if(notiset_query.length>=1){
                        if(notiset_query[0]['notiset_rsv_prd_reserve_part']){
                            var notiset_rsv_prd_reserve_part_array=notiset_query[0]['notiset_rsv_prd_reserve_part'].split(',');
                        }else{
                            var notiset_rsv_prd_reserve_part_array=[];
                        }

                        var notiset_rsv_prd_reserve=notiset_query[0]['notiset_rsv_prd_reserve'];//물건투어예약접수내역에 대한 방문일일전 관련 예약알림 받을지 여부insert여부 결정.
                        console.log('tour_rseerv_id::',notiset_rsv_prd_reserve,request_memid,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part'],notiset_rsv_prd_reserve_part_array);
                        if(notiset_rsv_prd_reserve==1){
                            console.log('알림발송가능한 대상체::',notiset_rsv_prd_reserve,request_mem_id,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part']);
                            await connection.beginTransaction();
                            var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,reserv_plan_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[request_memid,tour_reserv_id,message,noti_type,0,new Date(),new Date(),noti_reserv_date,noti_case]);//해당 예정날짜에 발송(보이기) 되게끔 처리. 투어예약일일전입니다 알림저장해두기.
                            await connection.commit();
                            console.log('notifciaton투어예약일일전 예약알림 insert queryt rowss:',notification_insert_rows);
                           
                        }
                    }else{
                        //아무런 알람셋팅 되어있지 않은 유저는 바로 저장하게끔.
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,reserv_plan_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[request_memid,tour_reserv_id,message,noti_type,0,new Date(),new Date(),noti_reserv_date,noti_case]);
                        await connection.commit();
                        console.log('notificaiton 투어예약일일전 예약알림insert query rowsss:',notification_insert_rows);
                     
                    }
                }else{
                    
                    var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[request_user_selectsosokid]);
                    console.log('해당 사업체 소속 회원들::',company_sosok_userlist);

                    for(let ss=0; ss<company_sosok_userlist.length; ss++){
                        let local_memid=company_sosok_userlist[ss].mem_id;

                        var [notiset_query]=await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,request_user_selectsosokid]);

                        if(notiset_query.length>=1){
                            var notiset_rsv_prd_reserve=notiset_query[0]['notiset_rsv_prd_reserve'];
                            if(notiset_query[0]['notiset_rsv_prd_reserve_part']){
                                var notiset_rsv_prd_reserve_part_array=notiset_query[0]['notiset_rsv_prd_reserve_part'].split(',');
                            }else{
                                var notiset_rsv_prd_reserve_part_array=[];
                            }
                            console.log('tour_reservid:',notiset_rsv_prd_reserve,local_memid,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part'],notiset_rsv_prd_reserve_part_array);
                            if(notiset_rsv_prd_reserve==1){
                                console.log('발송가능관련 알림체:',notiset_rsv_prd_reserve,local_memid,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part']);
                                await connection.beginTransaction();
                                var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,reserv_plan_date,noti_case) values(?,?,?,?,?,?,?,?,?,?)",[local_memid,request_user_selectsosokid,tour_reserv_id,message,noti_type,0,new Date(),new Date(),noti_reserv_date,noti_case]);
                                await connection.commit();
                                console.log('notificaiton투어예약일일전 예약알림 insert query orwss:',notification_insert_rows);                           
                            }
                        }else{
                            //아무런 알람셋팅 되어있지 않은 유저는 바로 저장하게끔.
                            await connection.beginTransaction();
                            var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,reserv_plan_date,noti_case) values(?,?,?,?,?,?,?,?,?,?)",[local_memid,request_user_selectsosokid,tour_reserv_id,message,noti_type,0,new Date(),new Date(),noti_reserv_date,noti_case]);//해당 예정날짜에 발송보이기 되게끔 처리.관련 소속 팀원들 자기자신포함에게 예약형탱알림 저장해두기.
                            await connection.commit();
                            console.log('notificaiton 투어예약일일전 예약알림insert query rowss:',notification_insert_rows);
       
                        }                       
                    }
                }
            }else if(action=='update'){
                if(user_type =='개인'){
                    var [notiset_query] = await connection.query("select * from notificationSetting where mem_id=?",[request_mem_id]);
                    if(notiset_query.length>=1){
                        var notiset_rsv_prd_reserve= notiset_query[0]['notiset_rsv_prd_reserve'];//해당 개인요청한 접수자 셋팅알람값 rsvprdreserve물건투어관련 여부확인.미확인으로 되어있다면 관련noti조회 및 update처리하지 않음.
                        if(notiset_query[0]['notiset_rsv_prd_reserve_part']){
                            var notiset_rsv_prd_reserve_part_array=notiset_query[0]['notiset_rsv_prd_reserve_part'].split(',');
                        }else{
                            var notiset_rsv_prd_reserve_part_array=[];
                        }
                        console.log('tour_reservid:',notiset_rsv_prd_reserve,request_mem_id,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part'],notiset_rsv_prd_reserve_part_array);
                        if(notiset_rsv_prd_reserve==1 && notiset_rsv_prd_reserve_part_array.includes(String(tour_reserv_id))){
                            console.log('알림가능 대상체:',notiset_rsv_prd_reserve,request_mem_id,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part']);
                            var [match_noti_query]=await connection.query("select * from notification where mem_id=? and txn_id=? and noti_type=11",[request_mem_id,tour_reserv_id]);//관련memid, txn_id관련된 노티내역 조회.
                            console.log('관련 매칭 notificaiton리스트:',match_noti_query);//해당 memid이며,txnid이며, 노티타입11인것들 관련 매칭내역 임의의 특정조건회원이며,txnid이며,물건투어예약일일전 관련 알림 내역 리스트 조회.
                            if(match_noti_query.length>=1){
                                for(let sss=0; sss<match_noti_query.length; sss++){
                                    let noti_id_local=match_noti_query[sss]['noti_id'];
                                    await connection.beginTransaction();
                                    var [notification_update_rows] = await connection.query("update notification set reserv_plan_date=?, modify_date=?, noti_status=0 where noti_id=?",[noti_reserv_date,new Date(),noti_id_local]);//해당 예정날짜에 발송(보이기)되게끔 처리. 투어 예약 일일전입니다.알림 가해지기.
                                    console.log('notificaiton update rowsss:',notification_update_rows);//관련된 notiid매칭내역들 에데해서 수저된 날짜 예약발송일 날짜로 update처리한다.
                                    await connection.commit();
                                    console.log('notificaiton 투어예약일일전 예약알림notification_update_rows::',notification_update_rows);
                                }
                            }                            
                        }//1값이 아니라면 아무것도 하지 않음(변경 관련 투어예약접수내여 변경되어도 수정하지않습니다.)투어예약시간내역 변경되어도 관련 수정처리하지않음(관련알림반응수정처리)
                    }else{
                        //알람셋팅내역자체가 없는 개인회원이라면 그냥 저장처리 수정반영예약저장처리.
                        var [match_noti_query]=await connection.query("select * from notification where mem_id=? and txn_id=? and noti_type=11",[request_mem_id,tour_reserv_id]);//관련memid, txn_id관련된 노티내역 조회.
                        console.log('관련 매칭 notificaiton리스트:',match_noti_query);//해당 memid이며,txnid이며, 노티타입11인것들 관련 매칭내역 임의의 특정조건회원이며,txnid이며,물건투어예약일일전 관련 알림 내역 리스트 조회.
                        if(match_noti_query.length>=1){
                            for(let sss=0; sss<match_noti_query.length; sss++){
                                let noti_id_local=match_noti_query[sss]['noti_id'];
                                await connection.beginTransaction();
                                var [notification_update_rows] = await connection.query("update notification set reserv_plan_date=?, modify_date=?, noti_status=0 where noti_id=?",[noti_reserv_date,new Date(),noti_id_local]);//해당 예정날짜에 발송(보이기)되게끔 처리. 투어 예약 일일전입니다.알림 가해지기.
                                console.log('notificaiton update rowsss:',notification_update_rows);//관련된 notiid매칭내역들 에데해서 수저된 날짜 예약발송일 날짜로 update처리한다.
                                await connection.commit();
                                console.log('notificaiton 투어예약일일전 예약알림notification_update_rows::',notification_update_rows);
                            }
                        }
                    }
                }else{
                    var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[request_user_selectsosokid]);
                    console.log('해당 사업체 소속 회원들::',company_sosok_userlist);

                    for(let ss=0; ss<company_sosok_userlist.length; ss++){
                        let local_memid=company_sosok_userlist[ss].mem_id;

                        var [notiset_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,request_user_selectsosokid]);
                        if(notiset_query.length>=1){
                            var notiset_rsv_prd_reserve=notiset_query[0]['notiset_rsv_prd_reserve'];
                            if(notiset_query[0]['notiset_rsv_prd_reserve_part']){
                                var notiset_rsv_prd_reserve_part_array=notiset_query[0]['notiset_rsv_prd_reserve_part'].split(',');
                            }else{
                                var notiset_rsv_prd_reserve_part_array=[];
                            }
                            console.log('tour_reservid:',notiset_rsv_prd_reserve,local_memid,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part'],notiset_rsv_prd_reserve_part_array);
                            if(notiset_rsv_prd_reserve==1 && notiset_rsv_prd_reserve_part_array.includes(String(tour_reserv_id))){
                                console.log('알림가능 대상체',notiset_rsv_prd_reserve,local_memid,tour_reserv_id,notiset_query[0]['notiset_rsv_prd_reserve_part']);
                                var [match_noti_query] = await connection.query("select * from notification where mem_id=? and txn_id=? and noti_type=11",[local_memid,tour_reserv_id]);
                                console.log('관련 소속체 팀원별 알림내역 조건별 txn_id조건 별 해서 조회 매칭:',match_noti_query);
                                if(match_noti_query.length>=1){
                                    for(let sss=0; sss<match_noti_query.length; sss++){
                                        let noti_id_local=match_noti_query[sss]['noti_id'];
                                        await connection.beginTransaction();
                                        var [notification_update_rows] = await connection.query("update notification set reserv_plan_date=?,modify_date=?, noti_status=0 where noti_id=?",[noti_reserv_date,new Date(),noti_id_local]);//해당 예정날짜에 발송(보이기)되게끔 처리. 투어 예약 일일전입니다.알림 가해지기.
                                        console.log('notificaiton update rowsss:',notification_update_rows);//관련된 notiid매칭내역들 에데해서 수저된 날짜 예약발송일 날짜로 update처리한다.
                                        await connection.commit();
                                        console.log('notificaiton 투어예약일일전 예약알림notification_update_rows::',notification_update_rows);
                                    }
                                } 
                            }//관련 셋팅 1값으로 해놓은 경우에만 수정반영처리한다.관련 노티 수정반영.
                        }else{
                            //알람셋팅 내역자체가 없는 회원(기업)팀원이라면 그냥 저장처리 수정반영예약저장처리.
                            var [match_noti_query] = await connection.query("select * from notification where mem_id=? and txn_id=? and noti_type=11",[local_memid,tour_reserv_id]);
                            console.log('관련 소속체 팀원별 알림내역 조건별 txn_id조건 별 해서 조회 매칭:',match_noti_query);
                            if(match_noti_query.length>=1){
                                for(let sss=0; sss<match_noti_query.length; sss++){
                                    let noti_id_local=match_noti_query[sss]['noti_id'];
                                    await connection.beginTransaction();
                                    var [notification_update_rows] = await connection.query("update notification set reserv_plan_date=?,modify_date=?, noti_status=0 where noti_id=?",[noti_reserv_date,new Date(),noti_id_local]);//해당 예정날짜에 발송(보이기)되게끔 처리. 투어 예약 일일전입니다.알림 가해지기.
                                    console.log('notificaiton update rowsss:',notification_update_rows);//관련된 notiid매칭내역들 에데해서 수저된 날짜 예약발송일 날짜로 update처리한다.
                                    await connection.commit();
                                    console.log('notificaiton 투어예약일일전 예약알림notification_update_rows::',notification_update_rows);
                                }
                            }
                        }                                                                                            
                    }
                }
            }      
            connection.release();
        }else if(noti_type == 13){
            //전문중개사 ->>의뢰자(중개의뢰인) 알림noticiation가해짐(외부수임인에겐 알리고로 대신) 전속매물공급(기업,개인)관련 알림설정연관성 전속기한만료 3일전 예약알림.
            var noti_case='전속매물상태알림';

            var maemul_info = req_body.maemul_info;
            console.log('->>request maeemulfino:',maemul_info);
            var noti_reserv_date=req_body.reserv_date;
            console.log('==>>>>전속기한만료 삼일전 관련 알림>>>:',req_body);

            var [send_memid_sosoklist] = await connection.query("select * from user where mem_id=?",[request_memid]);
            var user_type =send_memid_sosoklist[0].user_type;
            //var company_id_get= send_memid_sosoklist[0].company_id;
            //console.log('target companyid getss:',company_id_get);
            var company_id_get = req_body.request_company_id;//매물 중개의뢰자의 companyid소속선택값.
            //의뢰된or외부수임된 물건의 선임 중개사 구하기
            let company_id = req_body.company_id;
            var [probroker_info ] = await connection.query("select * from company2 where company_id=?",[company_id]);
            var get_probroker_name = probroker_info[0]['company_name'];
          
            var message_final=message+'\n\n'+maemul_info+'\n선임중개사 : '+get_probroker_name+'\n\n'+'[[기한연장]]:: https://korexpro.com/RequestExtend/'+prd_identity_id;
            console.log('messagein_final insert hmmm:',message_final);
            
            var action=req_body.action;

            if(action=='insert'){        
                if(user_type =='개인'){

                    //정확히 해당memid 개인회원에게 보낼 알림셋팅에 따라서 조건만족시에만 발송저장처리한다. 각 중개사회원별 각 물건별 설정관리에 알림받기로 선택한 이런순서대로
                    /*var [notiset_brokerprd_part_query] = await connection.query("select * from notificationSetting where mem_id=?",[request_memid]);
                    if(notiset_brokerprd_part_query.length>=1){
                        if(notiset_brokerprd_part_query[0]['notiset_brokerprd_part']){
                            var notiset_brokerprd_part_array=notiset_brokerprd_part_query[0]['notiset_brokerprd_part'].split(',');
                        }else{
                            var notiset_brokerprd_part_array=[];
                        }
                        console.log('===>>>local memid:',request_memid,notiset_brokerprd_part_query[0]['notiset_brokerprd_part'],prd_identity_id,notiset_brokerprd_part_array,notiset_brokerprd_part_array.includes(prd_identity_id));
                        var notiset_brokerprd=notiset_brokerprd_part_query[0]['notiset_brokerprd'];

                        if(notiset_brokerprd_part_array.includes(String(prd_identity_id)) && notiset_brokerprd==1){
                            //console.log('관련 조건 만족시에 회원별 알림수신받을 조건 완성시에::',notiset_brokerprd_part_array.includes(prd_identity_id));
                            //해당 관련된 거래개시동의요청한 관련된 매물 관련된 매물상태변경에 따른 알림을 보낼지 여부 판단. 해당 리스트에 있는 prd매물과,중개의뢰관리 체크인 알림받기로 (중개의뢰관련)인경우에만 알림저장처리.알림받기로 할 중개의뢰매물인경우이면서 중개의뢰물건관리체크된 경우에 한해서만 해당 중개의뢰물에 대한 관련 알림저장등록
                            await connection.beginTransaction();
                            var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date) values(?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message_final,noti_type,0,new Date(),new Date()]);
                            await connection.commit();
                            console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);
                        }
                    }*///else{
                        //해당 관련된 회원유저가 알림셋팅 아무것도 없는유저라면 그냥 보냄.
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,reserv_plan_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_reserv_date,noti_case]);
                        await connection.commit();
                        console.log('notification insert rowsss insert query rwowsss:',notification_insert_rows);
                    //}
                }else{              
                    var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id_get]);//해당 소속사업체의 소속팀원들 소속의 모든 memid들에게보낸다. 의뢰자가 선택했었떤 소속상태에서 중개의뢰보낸것이고, 그런 관련 내역이기에 그 관련 소속의 기업대상소속인들에게만 보냄.
                    console.log('해당 사업체 소속 회원들:',company_sosok_userlist);

                    for(let ss=0; ss<company_sosok_userlist.length; ss++){
                        let local_memid = company_sosok_userlist[ss].mem_id;

                        //정확히 해당 memid개인기업회원에게 각 팀원회원별 보낼 알림셋팅에 따라서 조건만족시에만 발송저장처리한다.각 중개사회원별 각 물건별 설정관리에 알림받기로 선택한 이런순서대로
                        /*var [notiset_brokerprd_part_query]= await connection.query("select * from notificationSetting where mem_id=?",[local_memid]);
                        if(notiset_brokerprd_part_query.length>=1){
                            if(notiset_brokerprd_part_query[0]['notiset_brokerprd_part']){
                                var notiset_brokerprd_part_array=notiset_brokerprd_part_query[0]['notiset_brokerprd_part'].split(',');
                            }else{
                                var notiset_brokerprd_part_array=[];
                            }
                            console.log('===>>>local memid:',local_memid,notiset_brokerprd_part_query[0]['notiset_brokerprd_part'],prd_identity_id,notiset_brokerprd_part_array,notiset_brokerprd_part_array.includes(prd_identity_id));
                            var notiset_brokerprd=notiset_brokerprd_part_query[0]['notiset_brokerprd'];

                            if(notiset_brokerprd_part_array.includes(String(prd_identity_id)) && notiset_brokerprd==1){
                                //console.log('관련 조건 만족시에 회원별 알림수신받을 조건 완성시에::',notiset_brokerprd_part_array.includes(prd_identity_id));
                                //해당 관련된 거래개새시승인요청관련된 매물관련 매물상태변경에 따른(거래개싯ㅅ승인요청)알림보낼지 여부 판단. 해당 리스트에있는 prd매물과 중개의뢰관리 체크인 알림받기로(중개의뢰관련)인경우만 알림저장처리.
                                await connection.beginTransaction();
                                var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date) values(?,?,?,?,?,?,?)",[local_memid,prd_identity_id,message_final,noti_type,0,new Date(),new Date()]);
                                await connection.commit();
                                console.log('notificaiton insert rowss insert query rowsss:',notification_insert_rows);
                            }
                        }*///else{
                            //해당 관련된 회원유저가 알림셋팅 아무것도 없는 유저라면 그냥 보냄.
                            await connection.beginTransaction();
                            var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date, reserv_plan_date,noti_case) values(?,?,?,?,?,?,?,?,?,?)",[local_memid,company_id_get,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_reserv_date,noti_case]);
                            await connection.commit();
                            console.log('notificiaton insert rowss insert query rowsssss:',notification_insert_rows);
                        //}
                    }
                }
            }else if(action =='update'){
                if(user_type =='개인'){
                  
                    var [match_noti_query] = await connection.query("select * from notification where mem_id=? and txn_id=? and noti_type=13",[request_memid,prd_identity_id]);
                    console.log('관련 매칭 관련notificaiton리스트:',match_noti_query);
                    if(match_noti_query.length>=1){
                        for(let sss=0; sss<match_noti_query.length; sss++){
                            let noti_id_local=match_noti_query[sss]['noti_id'];
                            await connection.beginTransaction();
                            var [notification_update_rows] = await connection.query("update notification set reserv_plan_date=?,modify_date=?,noti_status=0 where noti_id=?",[noti_reserv_date,new Date(),noti_id_local]);
                            console.log('notifi id localss수정updatess:',noti_id_local);
                            await connection.commit();
                            console.log('notificaiton 전속매물기한만료 삼일전알림 update rowss:',notification_update_rows);
                        }
                    }

                //}
                }else{              
                    var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id_get]);//해당 소속사업체의 소속팀원들 소속의 모든 memid들에게보낸다. 의뢰자가 선택했었떤 소속상태에서 중개의뢰보낸것이고, 그런 관련 내역이기에 그 관련 소속의 기업대상소속인들에게만 보냄.
                    console.log('해당 사업체 소속 회원들:',company_sosok_userlist);

                    for(let ss=0; ss<company_sosok_userlist.length; ss++){
                        let local_memid = company_sosok_userlist[ss].mem_id;
                        
                        var [match_noti_query] = await connection.query("select * from notification where mem_id=? and txn_id=? and noti_type=13",[local_memid,prd_identity_id]);
                        console.log('관련 매칭 관련notificaiton리스트::',match_noti_query);
                        if(match_noti_query.length>=1){
                            for(let sss=0; sss<match_noti_query.length; sss++){
                                let noti_id_local=match_noti_query[sss]['noti_id'];
                                await connection.beginTransaction();
                                var [notification_update_rows] = await connection.query("update notification set reserv_plan_date=?,modify_date=?,noti_status=0 where noti_id=?",[noti_reserv_date,new Date(),noti_id_local]);
                                console.log('notifi id localss수정updatess:',noti_id_local);
                                await connection.commit();
                                console.log('notificaiton 전속매물기한만료 삼일전알림 update rowss:',notification_update_rows);
                            }
                        }                     
                    }
                }
            }
            connection.release();
        }
        else if(noti_type == 14){
            //전문중개사 ->>의뢰자(중개의뢰인) 알림noticiation가해짐(외부수임인에겐 알리고로 대신) 전속매물공급(기업,개인)관련 알림설정연관성 전속기한만료 당일날짜에 예약알림.
            var noti_case='전속매물상태알림';

            var maemul_info = req_body.maemul_info;
            console.log('->>request maeemulfino:',maemul_info);
            var noti_reserv_date=req_body.reserv_date;
            console.log('==>>>>전속기한만료 당일 관련 알림>>>:',req_body);

            var [send_memid_sosoklist] = await connection.query("select * from user where mem_id=?",[request_mem_id]);
            var user_type =send_memid_sosoklist[0].user_type;
            //var company_id_get= send_memid_sosoklist[0].company_id;
            //console.log('target companyid getss:',company_id_get);
            var company_id_get = req_body.request_company_id;//매물 중개의뢰자의 companyid소속선택값.
            //의뢰된or외부수임된 물건의 선임 중개사 구하기
            let company_id = req_body.company_id;
            var [probroker_info ] = await connection.query("select * from company2 where company_id=?",[company_id]);
            var get_probroker_name = probroker_info[0]['company_name'];
          
            var message_final=message+'\n\n'+maemul_info+'\n선임중개사 : '+get_probroker_name+'\n\n'+'[[기한연장]]:: https://korexpro.com/RequestExtend/'+prd_identity_id;
            console.log('messagein_final insert hmmm:',message_final);

            var action=req_body.action;

            if(action=='insert'){
                if(user_type =='개인'){
               
                    //해당 관련된 회원유저가 알림셋팅 아무것도 없는유저라면 그냥 보냄.
                    await connection.beginTransaction();
                    var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,reserv_plan_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_reserv_date,noti_case]);
                    await connection.commit();
                    console.log('notification insert rowsss insert query rwowsss:',notification_insert_rows);
                    //}
                }else{
                     
                    var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id_get]);//해당 소속사업체의 소속팀원들 소속의 모든 memid들에게보낸다. 의뢰자가 선택했었떤 소속상태에서 중개의뢰보낸것이고, 그런 관련 내역이기에 그 관련 소속의 기업대상소속인들에게만 보냄.
                    console.log('해당 사업체 소속 회원들:',company_sosok_userlist);
    
                    for(let ss=0; ss<company_sosok_userlist.length; ss++){
                        let local_memid = company_sosok_userlist[ss].mem_id;
                     
                        //해당 관련된 회원유저가 알림셋팅 아무것도 없는 유저라면 그냥 보냄.
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date, reserv_plan_date, noti_case) values(?,?,?,?,?,?,?,?,?,?)",[local_memid,company_id_get,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_reserv_date,noti_case]);
                        await connection.commit();
                        console.log('notificiaton insert rowss insert query rowsssss:',notification_insert_rows);
                    }
                }
            }else if(action=='update'){
                if(user_type =='개인'){
                    var [match_noti_query] = await connection.query("select * from notification where mem_id=? and txn_id=? and noti_type=14",[request_memid,prd_identity_id]);
                    console.log('관련 매칭 관련notificaiton리스트:',match_noti_query);
                    if(match_noti_query.length>=1){
                        for(let sss=0; sss<match_noti_query.length; sss++){
                            let noti_id_local=match_noti_query[sss]['noti_id'];
                            await connection.beginTransaction();
                            var [notification_update_rows] = await connection.query("update notification set reserv_plan_date=?,modify_date=?,noti_status=0 where noti_id=?",[noti_reserv_date,new Date(),noti_id_local]);
                            console.log('notifi id localss수정updatess:',noti_id_local);
                            await connection.commit();
                            console.log('notificaiton 전속매물기한만료 삼일전알림 update rowss:',notification_update_rows);
                        }
                    }
                }else{
                     
                  var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id_get]);//해당 소속사업체의 소속팀원들 소속의 모든 memid들에게보낸다. 의뢰자가 선택했었떤 소속상태에서 중개의뢰보낸것이고, 그런 관련 내역이기에 그 관련 소속의 기업대상소속인들에게만 보냄.
                    console.log('해당 사업체 소속 회원들:',company_sosok_userlist);
    
                    for(let ss=0; ss<company_sosok_userlist.length; ss++){
                        let local_memid = company_sosok_userlist[ss].mem_id;
                        
                        var [match_noti_query] = await connection.query("select * from notification where mem_id=? and txn_id=? and noti_type=14",[local_memid,prd_identity_id]);
                        console.log('관련 매칭 관련notificaiton리스트::',match_noti_query);
                        if(match_noti_query.length>=1){
                            for(let sss=0; sss<match_noti_query.length; sss++){
                                let noti_id_local=match_noti_query[sss]['noti_id'];
                                await connection.beginTransaction();
                                var [notification_update_rows] = await connection.query("update notification set reserv_plan_date=?,modify_date=?,noti_status=0 where noti_id=?",[noti_reserv_date,new Date(),noti_id_local]);
                                console.log('notifi id localss수정updatess:',noti_id_local);
                                await connection.commit();
                                console.log('notificaiton 전속매물기한만료 삼일전알림 update rowss:',notification_update_rows);
                            }
                        }
                    }
                }
            }
            
            connection.release();
        }else if(noti_type==15){
            // or 특정 외부수임의뢰자,내부의뢰자(회원)개인기업회원등이 매물에 대한 전속기한연장요청 관련 알림 전문중개사에게 가해짐.
            var noti_case='전속매물상태알림';

             //특정 중개사 소속팀원들에게 보내기.
            var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id]);//해당 전문중개사 소속 팀원들 소속의 모든 memid들에게보낸다. compnay_member하 존재들에게 전문중개사 회원들에게 전송한다.
            console.log('해당 중개사 대상companyid소속 회원들::',company_sosok_userlist);
            //개인기업회원에게 보낸 거래개시동의요청에 대한 결과값 관련된 알림을 받는지 여부.각 소속 중개사팀원별로memid별로 동일내용으로 보내는데, 팀원별 알림설정셋팅이기에 그 설정한것에 따라서 알림을 받을지 안받을지 여부 커스터마이징 가능
            for(let ss=0; ss<company_sosok_userlist.length; ss++){
                let local_memid= company_sosok_userlist[ss].mem_id;

                    await connection.beginTransaction();
                    var [notification_insert_rows]=await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'전속기한연장요청');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '의뢰자 전속기한연장요청.',
                                type : '의뢰자 전속기한연장요청.'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'의뢰자 전속기한연장요청');
                        }
                    }
                //}                      
            }    
            connection.release();
           // return response.json({success:true, message:'notification_insert_rows등 server query success!!'});      
        }else if(noti_type == 16){
            //전문중개사 ->>의뢰자(중개의뢰인) 알림noticiation가해짐(외부수임인에겐 알리고로 대신) 전속매물공급(기업,개인)관련 알림설정연관성(거래완료동의요청)
            var noti_case='전속매물상태알림';

            var maemul_info = req_body.maemul_info;
            console.log('->>request maeemulfino:',maemul_info);

            var [send_memid_sosoklist] = await connection.query("select * from user where mem_id=?",[request_mem_id]);
            var user_type =send_memid_sosoklist[0].user_type;
            //var company_id_get= send_memid_sosoklist[0].company_id;
            //console.log('target companyid getss:',company_id_get);
            var company_id_get = req_body.request_mem_sectsosokid;
            //의뢰된or외부수임된 물건의 선임 중개사 구하기
            let company_id = req_body.company_id;
            var [probroker_info ] = await connection.query("select * from company2 where company_id=?",[company_id]);
            var get_probroker_name = probroker_info[0]['company_name'];

            var message_final=message+'\n\n'+maemul_info+'\n선임중개사 : '+get_probroker_name+'\n\n'+'[[내용확인]] https://korexpro.com/PreviewComplete/'+prd_identity_id;
            if(user_type =='개인'){

                //정확히 해당memid 개인회원에게 보낼 알림셋팅에 따라서 조건만족시에만 발송저장처리한다. 각 중개사회원별 각 물건별 설정관리에 알림받기로 선택한 이런순서대로
                var [notiset_brokerprd_part_query] = await connection.query("select * from notificationSetting where mem_id=?",[request_mem_id]);
                if(notiset_brokerprd_part_query.length>=1){
                    if(notiset_brokerprd_part_query[0]['notiset_brokerprd_part']){
                        var notiset_brokerprd_part_array=notiset_brokerprd_part_query[0]['notiset_brokerprd_part'].split(',');
                    }else{
                        var notiset_brokerprd_part_array=[];
                    }
                    console.log('===>>>local memid:',request_mem_id,notiset_brokerprd_part_query[0]['notiset_brokerprd_part'],prd_identity_id,notiset_brokerprd_part_array,notiset_brokerprd_part_array.includes(prd_identity_id));
                    var notiset_brokerprd=notiset_brokerprd_part_query[0]['notiset_brokerprd'];

                    if(notiset_brokerprd_part_array.includes(String(prd_identity_id)) && notiset_brokerprd==1){
                        //console.log('관련 조건 만족시에 회원별 알림수신받을 조건 완성시에::',notiset_brokerprd_part_array.includes(prd_identity_id));
                        //해당 관련된 거래개시동의요청한 관련된 매물 관련된 매물상태변경에 따른 알림을 보낼지 여부 판단. 해당 리스트에 있는 prd매물과,중개의뢰관리 체크인 알림받기로 (중개의뢰관련)인경우에만 알림저장처리.알림받기로 할 중개의뢰매물인경우이면서 중개의뢰물건관리체크된 경우에 한해서만 해당 중개의뢰물에 대한 관련 알림저장등록
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다. 푸시알림의 경우 앱설치아니 memid유저라고한다면 때리고,미설치자로 판단되면 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);//개인해당회원
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림::',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(request_mem_id,targetuser_query[0].fcmtocken, message_final,'의뢰매물 상태변경');
                            }else{
                                //토큰이 없다면 문자알림!!!
                                console.log('토큰이 없다면 문자알림!!:',aligosms2,aligosms2.send);
                                let req_data = {
                                    receiver : targetuser_query[0].phone,
                                    msg : message_final,
                                    msg_type : 'LMS',
                                    title : '중개의뢰매물 상태변경',
                                    type : '거래완료동의요청'
                                }

                                aligosms2.send(request,req_data,response,'거래완료동의요청');
                            }
                        }
                    }
                }else{
                    //해당 관련된 회원유저가 알림셋팅 아무것도 없는유저라면 그냥 보냄.
                    await connection.beginTransaction();
                    var [notification_insert_rows] = await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?)",[request_memid,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notification insert rowsss insert query rwowsss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다. 푸시알림의 경우 앱설치아니 memid유저라고한다면 때리고,미설치자로 판단되면 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);//개인해당회원
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림::',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(request_mem_id,targetuser_query[0].fcmtocken,message_final,'의뢰매물 상태변경');
                        }else{
                            //토큰이 없다면 문자알림!!!
                            console.log('토큰이 없다면 문자알림!!:',aligosms2,aligosms2.send);
                            let req_data = {
                                receiver : targetuser_query[0].phone,
                                msg : message_final,
                                msg_type : 'LMS',
                                title : '중개의뢰매물 상태변경',
                                type : '거래완료동의요청'
                            }

                            aligosms2.send(request,req_data,response,'거래완료동의요청');
                        }
                    }
                }
            }else{
                
                var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id_get]);//해당 소속사업체의 소속팀원들 소속의 모든 memid들에게보낸다. 의뢰자가 선택했었떤 소속상태에서 중개의뢰보낸것이고, 그런 관련 내역이기에 그 관련 소속의 기업대상소속인들에게만 보냄.
                console.log('해당 사업체 소속 회원들:',company_sosok_userlist);

                for(let ss=0; ss<company_sosok_userlist.length; ss++){
                    let local_memid = company_sosok_userlist[ss].mem_id;

                    //정확히 해당 memid개인기업회원에게 각 팀원회원별 보낼 알림셋팅에 따라서 조건만족시에만 발송저장처리한다.각 중개사회원별 각 물건별 설정관리에 알림받기로 선택한 이런순서대로
                    var [notiset_brokerprd_part_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id_get]);
                    if(notiset_brokerprd_part_query.length>=1){
                        if(notiset_brokerprd_part_query[0]['notiset_brokerprd_part']){
                            var notiset_brokerprd_part_array=notiset_brokerprd_part_query[0]['notiset_brokerprd_part'].split(',');
                        }else{
                            var notiset_brokerprd_part_array=[];
                        }
                        console.log('===>>>local memid:',local_memid,notiset_brokerprd_part_query[0]['notiset_brokerprd_part'],prd_identity_id,notiset_brokerprd_part_array,notiset_brokerprd_part_array.includes(prd_identity_id));
                        var notiset_brokerprd=notiset_brokerprd_part_query[0]['notiset_brokerprd'];

                        if(notiset_brokerprd_part_array.includes(String(prd_identity_id)) && notiset_brokerprd==1){
                            //console.log('관련 조건 만족시에 회원별 알림수신받을 조건 완성시에::',notiset_brokerprd_part_array.includes(prd_identity_id));
                            //해당 관련된 거래개새시승인요청관련된 매물관련 매물상태변경에 따른(거래개싯ㅅ승인요청)알림보낼지 여부 판단. 해당 리스트에있는 prd매물과 중개의뢰관리 체크인 알림받기로(중개의뢰관련)인경우만 알림저장처리.
                            await connection.beginTransaction();
                            var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id_get,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_case]);
                            await connection.commit();
                            console.log('notificaiton insert rowss insert query rowsss:',notification_insert_rows);

                            //알림수신받는다고 동의한경우에만 푸시알림 떄린다. 푸시알림의 경우 앱설치아니 memid유저라고한다면 때리고,미설치자로 판단되면 문자알림을 한다.
                            var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                            if(targetuser_query.length>=1){
                                if(targetuser_query[0].fcmtocken){
                                    //토큰존재시에 푸시알림
                                    console.log('토큰존재 푸시알림::',targetuser_query[0],targetuser_query[0].fcmtocken);
                                    fcmpushalram.push_send(null,targetuser_query[0].fcmtocken, message_final,'의뢰매물 상태변경');
                                }else{
                                    //토큰이 없다면 문자알림!!!
                                    console.log('토큰이 없다면 문자알림!!:',aligosms2,aligosms2.send);
                                    let req_data = {
                                        receiver : targetuser_query[0].phone,
                                        msg : message_final,
                                        msg_type : 'LMS',
                                        title : '중개의뢰매물 상태변경',
                                        type : '거래완료동의요청'
                                    }

                                    aligosms2.send(request,req_data,response,'거래완료동의요청');
                                }
                            }
                        }
                    }else{
                        //해당 관련된 회원유저가 알림셋팅 아무것도 없는 유저라면 그냥 보냄.
                        await connection.beginTransaction();
                        var [notification_insert_rows] = await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id_get,prd_identity_id,message_final,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notificiaton insert rowss insert query rowsssss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다. 푸시알림의 경우 앱설치아니 memid유저라고한다면 때리고,미설치자로 판단되면 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림::',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message_final,'의뢰매물 상태변경');
                            }else{
                                //토큰이 없다면 문자알림!!!
                                console.log('토큰이 없다면 문자알림!!:',aligosms2,aligosms2.send);
                                let req_data = {
                                    receiver : targetuser_query[0].phone,
                                    msg : message_final,
                                    msg_type : 'LMS',
                                    title : '중개의뢰매물 상태변경',
                                    type : '거래완료동의요청'
                                }

                                aligosms2.send(request,req_data,response,'거래완료동의요청');
                            }
                        }
                    }
                }
            }
            connection.release();
            //return response.json({success:true, message:'notification_insert_rows등 server query success!!'});
        }else if(noti_type==17){
            // or 거래완료동의요청거절+수락 올시에 관련 알림 전문중개사에게 가해짐.
            var noti_case='전속매물상태알림';

            //특정 중개사 소속팀원들에게 보내기.+관련 생성자
            var [company_sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id]);//해당 전문중개사 소속 팀원들 소속의 모든 memid들에게보낸다. compnay_member하 존재들에게 전문중개사 회원들에게 전송한다.
            console.log('해당 중개사 대상companyid소속 회원들::',company_sosok_userlist);
            //개인기업회원에게 보낸 거래개시동의요청에 대한 결과값 관련된 알림을 받는지 여부.각 소속 중개사팀원별로memid별로 동일내용으로 보내는데, 팀원별 알림설정셋팅이기에 그 설정한것에 따라서 알림을 받을지 안받을지 여부 커스터마이징 가능
            for(let ss=0; ss<company_sosok_userlist.length; ss++){
                let local_memid= company_sosok_userlist[ss].mem_id;


                //정확히 각memid별 알림셋팅에 따라서 조건만족시에만 발송(저장)처리한다. 각 중개사회원별 각 물건별 설정관리에 알림을 받기로 선택한 이런순서대로 각 물건별 설정관리에서 해당 id에 대한 알림설정물건목록이 있으면 통과이고, 없다면 물건관리에 체크여부 확인 물건관리 체크되어있으면 물건설정에서 없어도 보냄.
                var [notiset_prd_part_query] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id]);
                if(notiset_prd_part_query.length>=1){
                    if(notiset_prd_part_query[0]['notiset_prd_part']){
                        var notiset_prd_part_array=notiset_prd_part_query[0]['notiset_prd_part'].split(',');
                    }else{
                        var notiset_prd_part_array=[];
                    }
                   
                    var notiset_prd=notiset_prd_part_query[0]['notiset_prd'];

                    console.log('local memId::',local_memid,notiset_prd_part_array,notiset_prd);

                    if(notiset_prd_part_array.includes(String(prd_identity_id)) && notiset_prd==1){
                        //물건별 알림설정 항목에서 있는 prd_identitiy품목이라면 바로 통과이다.해당 각 유저가 어떤id매물에 대해 어떤 내용알림이 보내진건지 저장처리.물건관리도 체크되어있어야 보내짐.
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'거래완료동의요청결과');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '거래완료동의요청결과',
                                    type : '거래완료동의요청결과'
                                    
                                }
                                
                                aligosms2.send(request,req_data,response,'거래완료동의요청결과');
                            }
                        }
                    }  
                }else{
                    await connection.beginTransaction();
                    var [notification_insert_rows]=await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,company_id,prd_identity_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'거래완료동의요청결과');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '거래완료동의요청결과',
                                type : '거래완료동의요청결과'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'거래완료동의요청결과');
                        }
                    }
                }                      
            }
            connection.release();
        }
        //분양쪽 알림 ============================start====================================================
        else if(noti_type=="bunyang_live_newRegisted"){

            var noti_case='라이브방송신규접수';

            var transaction_id = req_body.transaction_id;
            // 분양 라이브방송 예고 신규등록될시마다 모든 불특정다수 중개사들에게 알림가한다.
             
             var [all_brokerUser_query_teamone] = await connection.query("select c.company_id as origin_company_id,c.company_name as company_name, cm.mem_id as cm_memid,cm.company_id as cm_company_id,cm.bp_id as cm_bpid,u.mem_id as mem_id from company2 c join company_member cm on c.company_id=cm.company_id join user u on cm.mem_id=u.mem_id where c.type='중개사' and u.is_deleted=0");//중개사소속의 모든 팀원들 임의중개사소속의 모든 팀원들(origin들 아님) 내역. root내역,팀원들 내역 각각 모든 memid대상들에게 보낸다.

             //중개사 소속팀원들에게 보내기.+중개사 최초생성자>>>
            for(let ss=0; ss<all_brokerUser_query_teamone.length; ss++){
                let local_memid= all_brokerUser_query_teamone[ss].mem_id;//user memid
                let sosok_companyid = all_brokerUser_query_teamone[ss].cm_company_id;//comapny_id_original은 그 compoanymember compnay_id에 연결되어있는 관련된 기업리스트이며 이게 각 회원별로 일대일매칭형태로 대응되지는 확실치는 않음. 더 정확한것은 compnaymember에 있는 memid별 대응되는 소속되어져있는 값이 불변형태가 중요.

                console.log('local memId,sosokcompanyid',local_memid,sosok_companyid);

                //회원별 분양알람셋팅 알람세팅.중개사소속되어있는 회원별 고유하게 지정되어있는 현재의 소속값이 아니라 배정된(설정된fixed) memid별로 여러개씩의 중개사소속이 있다고하면 emmid ,companyid쌍으로 하여 각한번씩 관련알람소속알람 가해지게한다.
                var [notiset_bunyangquery] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,sosok_companyid]);

                if(notiset_bunyangquery.length>=1){
                    //각 중개사팀원 memid의 분양수요관련 셋팅 분양관련 알람셋팅내역조회.
                            
                    var notiset_bunyangsuyo_newlive=notiset_bunyangquery[0]['notiset_bunyangsuyo_newlive'];

                    if(notiset_bunyangsuyo_newlive==1){
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case,company_id) values(?,?,?,?,?,?,?,?,?)',[local_memid,transaction_id,message,noti_type,0,new Date(),new Date(),noti_case,sosok_companyid]);
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양 신규라이브방송 예고');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '분양 신규라이브방송 예고',
                                    type : '분양 신규라이브방송 예고'                                 
                                }
                                
                                aligosms2.send(request,req_data,response,'분양 신규라이브방송 예고');
                            }
                        }
                    }                  
                }else{
                    await connection.beginTransaction();
                    var [notification_insert_rows]=await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case,company_id) values(?,?,?,?,?,?,?,?,?)",[local_memid,transaction_id,message,noti_type,0,new Date(),new Date(),noti_case,sosok_companyid]);
                    await connection.commit();
                    console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양 신규라이브방송 예고');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '분양 신규라이브방송 예고',
                                type : '분양 신규라이브방송 예고'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'분양 신규라이브방송 예고');
                        }
                    }
                }                      
            }
            connection.release();
        }else if(noti_type=="bunyang_live_edited"){

            var noti_case='라이브방송수정';//중개사 신청 당사자에게 분양라이브신청예약 방송취소 수정된경우에 알림>>>특정대상id값이 없기에 관련된 내역들은 서버에서 취합해서 처리.

            var transaction_id = req_body.transaction_id;//해당 txnid tourid,tdid에 관련된 내역들. 이 케이스의 경우 해당 분양 라이브예약셋팅 tourid,tdid일대일대응 에 대해서 신청한 touRreservation리스트 회원들조회.

             var [regist_user_query] = await connection.query("SELECT t.tour_id as tour_id,tr.tr_id as tr_id,tr.td_id as td_id,tr.mem_id as mem_id,tr.request_user_selectsosokid as company_id FROM tour t join tourdetail td on t.tour_id=td.tour_id join tourReservation tr on td.td_id=tr.td_id where t.tour_id=? group by mem_id",[transaction_id]);//해당 tour_id,tdid에 신청한 내역들(회원들memid리스트)구한다. 그 리스트에게 관련 알림보낸다.(취소할경우, 수정할경우에 모두) 
              console.log('관련 알람 대상들 리스트::',regist_user_query); 

             //관련 분양 > 라이브예약셋팅 상품(셋팅 tourid,tdid)에 대해서 신청했었던 회원memid들에게 보낸다.
            for(let ss=0; ss<regist_user_query.length; ss++){
                let local_memid= regist_user_query[ss].mem_id;
                let tr_id = regist_user_query[ss].tr_id;//어떤 trid신청한 내역였는지.
                let company_id= regist_user_query[ss].company_id;
                console.log('local memId and 신청당시 중개사소속id',local_memid,company_id);//대상 유저,신청당시 소속companyid값
             
                var [notiset_bunyang_query] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,company_id]);
                if(notiset_bunyang_query.length>=1){
                    //각 관련 유저의 알람셋팅내역조회. 분양라이브방송셋팅에서 방송 취소,수정하는경우에처리. 
                    if(notiset_bunyang_query[0]['notiset_bunyangsuyo_mylive_part']){
                        var notiset_bunyangsuyo_mylive_array=notiset_bunyang_query[0]['notiset_bunyangsuyo_mylive_part'].split(',');
                    }else{
                        var notiset_bunyangsuyo_mylive_array=[];
                    }
                                      
                    var notiset_bunyangsuyo_mylive=notiset_bunyang_query[0]['notiset_bunyangsuyo_mylive'];

                    if(notiset_bunyangsuyo_mylive_array.includes(String(tr_id)) && notiset_bunyangsuyo_mylive==1){
                        //내 라이브시청예약관련된 내역에서 알림받기론 trid리스트에 포함되는 txn_id(trid) 각 신청회원별 자기가 신청했었던 예약trid에 대한 내역에 대한 알림수신여부(trid) 지정되어있는지 유므
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case,company_id) values(?,?,?,?,?,?,?,?,?)',[local_memid,tr_id,message,noti_type,0,new Date(),new Date(),noti_case,company_id]);
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양 신규라이브방송일정 수정&취소');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '분양 신규라이브방송일정 수정&취소',
                                    type : '분양 신규라이브방송일정 수정&취소'
                                    
                                }
                                
                                aligosms2.send(request,req_data,response,'분양 신규라이브방송일정 수정&취소');
                            }
                        }
                    }
   
                }else{
                    await connection.beginTransaction();
                    var [notification_insert_rows]=await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case,company_id) values(?,?,?,?,?,?,?,?,?)",[local_memid,tr_id,message,noti_type,0,new Date(),new Date(),noti_case,company_id]);
                    await connection.commit();
                    console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양 신규라이브방송일정 수정&취소');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '분양 신규라이브방송일정 수정&취소',
                                type : '분양 신규라이브방송일정 수정&취소'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'분양 신규라이브방송일정 수정&취소');
                        }
                    }
                }
                       
            }
            connection.release();
        }else if(noti_type=="bunyang_live_invite"){

            var noti_case='라이브방송초대';//분양초대했을떄 관련 알림 중개사에게 가한다.

            var transaction_id = req_body.transaction_id;//해당 txnid tourid,tdid에 관련된 내역들. 이 케이스의 경우 해당 분양 라이브예약셋팅 tourid,tdid일대일대응 에 대해서 신청한 touRreservation리스트 회원들조회.
            var userlist = req_body.userList;//유저리스트.
          
            console.log('관련 알람 대상들 리스트::',userlist);          
            //관련 분양 > 라이브예약셋팅 상품(셋팅 tourid,tdid)에 대해서 신청했었던 회원memid들에게 보낸다.
            for(let ss=0; ss<userlist.length; ss++){
                let tr_id=userlist[ss].tr_id;//각 memid별 자기가 신청했었던 trid가 일대일대응인것이고, 자기가신청했었던 라이브예약접수내역에 대해서 알림수신받을지여부(초대)
                //let [trid_infoquery] = await connection.query("select * from tourReservation where tr_id=?",[tr_id]);
                //let local_memid= trid_infoquery[0].mem_id;//tourid 신청한 유저리스트>> memid신청리스트
                let local_memid=userlist[ss].mem_id;
                let sosok_company_id=userlist[ss].company_id;//각 신청유저들의 memid,소속companyid값>>어떤 중개사소속상태의 팀원회원관련된 내역인지 조회.

                console.log('local memId,sosok companyid',local_memid,sosok_company_id);

                var [notiset_bunyang_query] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[local_memid,sosok_company_id]);
                if(notiset_bunyang_query.length>=1){
                    //각 관련 유저의 알람셋팅내역조회.
                    if(notiset_bunyang_query[0]['notiset_bunyangsuyo_mylive_part']){
                        var notiset_bunyangsuyo_mylive_part_array=notiset_bunyang_query[0]['notiset_bunyangsuyo_mylive_part'].split(',');
                    }else{
                        var notiset_bunyangsuyo_mylive_part_array=[];
                    }
                                      
                    var notiset_bunyangsuyo_mylive=notiset_bunyang_query[0]['notiset_bunyangsuyo_mylive'];//내 분양라이브신청예약(trid)들 거시적 내역에 대한 알림수신여부

                    if(notiset_bunyangsuyo_mylive_part_array.includes(String(tr_id)) && notiset_bunyangsuyo_mylive==1){
                        //분양수요 라이브예약신청 관련 수신여부체크여부(초대시에,라이브방송 수정,취소시에 알림) 및 동시에 자신이 신청했었던 라이브예약들 내역별 부분적 알림수신여부파트.
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query('insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case,company_id) values(?,?,?,?,?,?,?,?,?)',[local_memid,tr_id,message,noti_type,0,new Date(),new Date(),noti_case,sosok_company_id]);
                        await connection.commit();
                        console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                        //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                        var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                        if(targetuser_query.length>=1){
                            if(targetuser_query[0].fcmtocken){
                                //토큰존재시에 푸시알림
                                console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양라이브 방송 초대링크');
                            }else{
                                //토큰이 없다면 문자알림!
                                console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                let req_data={
                                
                                    receiver: targetuser_query[0].phone,
                                    msg : message,
                                    msg_type : 'LMS',
                                    title : '분양라이브 방송 초대링크',
                                    type : '분양라이브 방송 초대링크'
                                    
                                }
                                
                                aligosms2.send(request,req_data,response,'분양라이브 방송 초대링크');
                            }
                        }
                    }

                }else{
                    await connection.beginTransaction();
                    var [notification_insert_rows]=await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case,company_id) values(?,?,?,?,?,?,?,?,?)",[local_memid,tr_id,message,noti_type,0,new Date(),new Date(),noti_case,sosok_company_id]);
                    await connection.commit();
                    console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[local_memid]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양라이브 방송 초대링크');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '분양라이브 방송 초대링크',
                                type : '분양라이브 방송 초대링크'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'분양라이브 방송 초대링크');
                        }
                    }
                }                       
            }
            connection.release();

        }else if(noti_type=="bunyang_live_startday_reservealram" || noti_type=='bunyang_visit_startday_reservealram' || noti_type=='bunyang_visit_startday_reservealram_3days'){
            var noti_case='분양방문예정알림';

            //분양방문예약,라이브예약신청 당일알림,3일전알림등 진행>>(분양방문일정의 경우 분양사에 의해서 수정되는 경우는 없다.) 라이브예약의 같은 경우는 분양사에의해서 수정되는경우가 있다. 중개사가 분양신청한 내역에 대해해서 수정하는 경우 관련 알림처리되며, 라이브예약신청한것들에 대해선 수정개념이 없다.
            var transaction_id = req_body.transaction_id;//해당 txnid tourid,tdid에 관련된 내역들. 이 케이스의 경우 해당 분양 라이브예약셋팅 tourid,tdid일대일대응 에 대해서 신청한 touRreservation리스트 회원들조회.
            var request_memid = req_body.request_memid;
            var noti_reserv_date = req_body.noti_reserv_date;//예약노티알림 예정일.
            var type=req_body.type;//group여부.

            var sosok_company_id=req_body.sosok_company_id;//신청중개사 소속id값..>>

            var action=req_body.action;

            if(action=='insert'){
                //분양방문예약,라이브예약 삼일전,당일알림 관련된것 insert되는 경우(중개사가 첫 신청하는경우) 임의 한개의 중개사 신청하는경우 그 대상에게만 관련것을 보내야함.
                /*if(type == 'group'){
                    var [match_user_query] = await connection.query("SELECT distinct tr.mem_id FROM tour t join tourdetail td on t.tour_id=td.tour_id join tourReservation tr on td.td_id=tr.td_id where t.tour_id=?",[transaction_id]);//해당 tour_id,tdid에 신청한 내역들(회원들memid리스트)구한다. 그 리스트에게 관련 알림보낸다.(취소할경우, 수정할경우에 모두) 해당 신청했었던 유저 한명에게 보낸다.여러번 신청했었던경우 여러번씩 가해지면 안되기에, a,b유저가 각각 m,n번 신청했었다면 그 유저는 각각 1회씩만 관련알림보내야함.
                    console.log('관련 알람 대상들 리스트::',match_user_query);          
                    //관련 분양 > 라이브예약셋팅 상품(셋팅 tourid,tdid)에 대해서 신청했었던 회원memid들에게 보낸다.
                    for(let ss=0; ss<match_user_query.length; ss++){
                        let local_memid= match_user_query[ss].mem_id;

                        console.log('발송대상 타깃:',local_memid);
                        
                        await connection.beginTransaction();
                        var [notification_insert_rows]=await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,reserv_plan_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[local_memid,transaction_id,message,noti_type,0,new Date(),new Date(),noti_reserv_date,noti_case]);
                        await connection.commit();
                        console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);                
                    }
        
                }*/
                //else{
                    console.log('발송대상 타깃 단일:',request_memid);
                                 
                    await connection.beginTransaction();
                    var [notification_insert_rows]=await connection.query("insert into notification(mem_id,company_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,reserv_plan_date,noti_case) values(?,?,?,?,?,?,?,?,?,?)",[request_memid,sosok_company_id,transaction_id,message,noti_type,0,new Date(),new Date(),noti_reserv_date,noti_case]);
                    await connection.commit();
                    console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);                            
                //}*/
            }else if(action=='update'){
                if(type=='group'){
                    //수정하는 경우에 관련(중개사가 신청했었던 방문,라이브예약 신청했던거에 대해서 수정하는경우) 분양대행사가 수정했던경우.
                    var [match_user_query] = await connection.query("SELECT distinct tr.mem_id FROM tour t join tourdetail td on t.tour_id=td.tour_id join tourReservation tr on td.tr_id=tr.td_id where t.tour_id=?",[transaction_id]);//그 수정하려는 tourid관련된 내역을 신청한것들에게 모두보내야함.
                    console.log('관련 알람 대상들 리스트::',match_user_query);

                    for(let ss=0; ss<match_user_query.length; ss++){
                        let local_memid=match_user_query[ss].mem_id;

                        console.log('발송대상 타깃:',local_memid);

                        var [match_noti_query] = await connection.query("select * from notification where mem_id=? and txn_id=? and noti_type=?",[local_memid,transaction_id,noti_type]);//bunyang_visit_startday_reservealram, bunyang_visit_startday_reservealram_3days 분양방문예약에 대해서만 관련한게 있고 라이브는 없음 분양방문 삼일전,당일 관련 일수 변경관련 컨트롤>>
                        console.log('관련 매칭관련notificaiton리스트:',match_noti_query);

                        if(match_noti_query.length>=1){
                            for(let sss=0; sss<match_noti_query.length; sss++){
                                let noti_id_local=match_noti_query[sss]['noti_id'];
                                await connection.beginTransaction();
                                var [notification_update_rows] =await connection.query("update notification set reserv_plan_date=?,modify_date=?,noti_status=0, message=? where noti_id=?",[noti_reserv_date,new Date(),message,noti_id_local]);
                                await connection.commit();
                                console.log('분양관련된 분양방문 관련된 삼일전,당일 알림 관련 update로직:',notification_update_rows);
                            }
                        }
                    }
                }else{
                    //그 내 방문예약신청수정하는 경우.
                    console.log('발송 대상 타깃 단일: 개인이 수정한경우:',request_memid);

                    var [match_noti_query] = await connection.query("select * from notification where mem_id=? and txn_id=? and noti_type=?",[request_memid,transaction_id,noti_type]);//bunyang_visit_startday_reservealram, bunyang_visit_startday_reservealram_3days 분양방문예약에 대해서만 관련한게 있고 라이브는 없음 분양방문 삼일전,당일 관련 일수 변경관련 컨트롤>>
                    console.log('관련 매칭관련notificaiton리스트:',match_noti_query);

                    if(match_noti_query.length>=1){
                        for(let sss=0; sss<match_noti_query.length; sss++){
                            let noti_id_local=match_noti_query[sss]['noti_id'];
                            await connection.beginTransaction();
                            var [notification_update_rows] =await connection.query("update notification set reserv_plan_date=?,modify_date=?,noti_status=0 ,noti_content=? where noti_id=?",[noti_reserv_date,new Date(),message,noti_id_local]);
                            await connection.commit();
                            console.log('분양관련된 분양방문 관련된 삼일전,당일 알림 관련 update로직:',notification_update_rows);
                        }
                    }                   
                }
            }
                                      
            connection.release();

        }else if(noti_type=="bunyang_visit_cancled_by_bunyang"){
            var noti_case='분양방문예약해제알림';

            var transaction_id = req_body.transaction_id;//해당 txnid tourid,tdid에 관련된 내역들. 이 케이스의 경우 해당 분양 라이브예약셋팅 tourid,tdid일대일대응 에 대해서 신청한 touRreservation리스트 회원들조회.
            var request_mem_id = req_body.request_mem_id;
            var company_id = req_body.company_id;//중개사 소속id 신청당시떄의 중개사 소속id값.

            console.log('발송대상 타깃 단일:',request_mem_id,company_id);//중개사소속된 중개사회원들 모두에게가 아니라 그 단일 한명에게 보낸다>>>분양사에 의해서 취소된 분양방문예약내역자체는 fixed로 고정 중개사회원  // 해당 id이면서 해당소속 모두 만족인것은 해당 소속이면서 해당 유저였던것만족
            
            var [notiset_bunyang_query] = await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[request_mem_id,company_id]);
            if(notiset_bunyang_query.length>=1){
                //각 관련 유저의 알람셋팅내역조회.
                if(notiset_bunyang_query[0]['notiset_bunyangsuyo_myvisit_part']){
                    var notiset_bunyangsuyo_part_array=notiset_bunyang_query[0]['notiset_bunyangsuyo_myvisit_part'].split(',');
                }else{
                    var notiset_bunyangsuyo_part_array=[];
                }
                               
                var notiset_bunyangsuyo_myvisit=notiset_bunyang_query[0]['notiset_bunyangsuyo_myvisit'];

                if(notiset_bunyangsuyo_part_array.includes(String(transaction_id)) && notiset_bunyangsuyo_myvisit==1){
                    //물건별 알림설정 항목에서 있는 prd_identitiy품목이라면 바로 통과이다.해당 각 유저가 어떤id매물에 대해 어떤 내용알림이 보내진건지 저장처리.물건관리도 체크되어있어야 보내짐.
                    await connection.beginTransaction();
                    var [notification_insert_rows]=await connection.query('insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case,company_id) values(?,?,?,?,?,?,?,?,?)',[request_mem_id,transaction_id,message,noti_type,0,new Date(),new Date(),noti_case,company_id]);
                    await connection.commit();
                    console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양방문예약 분양대행사에 의해 예약해제(취소) 알림');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '분양방문예약 분양대행사에 의해 예약해제(취소) 알림',
                                type : '분양방문예약 분양대행사에 의해 예약해제(취소) 알림'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'분양방문예약 분양대행사에 의해 예약해제(취소) 알림');
                        }
                    }
                }
                
            }else{
                await connection.beginTransaction();
                var [notification_insert_rows]=await connection.query("insert into notification(mem_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case,company_id) values(?,?,?,?,?,?,?,?,?)",[request_mem_id,transaction_id,message,noti_type,0,new Date(),new Date(),noti_case,company_id]);
                await connection.commit();
                console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[request_mem_id]);
                if(targetuser_query.length>=1){
                    if(targetuser_query[0].fcmtocken){
                        //토큰존재시에 푸시알림
                        console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                        fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양방문예약 분양대행사에 의해 예약해제(취소) 알림');
                    }else{
                        //토큰이 없다면 문자알림!
                        console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                        let req_data={
                        
                            receiver: targetuser_query[0].phone,
                            msg : message,
                            msg_type : 'LMS',
                            title : '분양방문예약 분양대행사에 의해 예약해제(취소) 알림',
                            type : '분양방문예약 분양대행사에 의해 예약해제(취소) 알림'
                            
                        }
                        
                        aligosms2.send(request,req_data,response,'분양방문예약 분양대행사에 의해 예약해제(취소) 알림');
                    }
                }
            }                                  
            connection.release();
        }else if(noti_type=="bunyang_visit_new_registed" || noti_type=="bunyang_visit_reserv_modify" || noti_type=='bunyang_visit_reserv_cancle' || noti_type=='bunyang_live_new_registed' || noti_type=='bunyang_live_reserv_cancle'){
            let noti_case='분양수요알림';
            //특정 분양상품 셋팅에 대한 신규접수시에 처리. 그 분양프로젝트에 소속되어있는 팀원들 및 생성자들(분양사)에게 모두 알람.
            /* 신규로 신청한 분양방문예약(어떤투어셋팅에대해) / 분양방문예약수정(어떤투어셋팅)에 대한 수정였는지 / 분양방문예약취소(어떤투어셋팅)에 대한 수정였는지 / 분양라이브신규접수시에(어떤투어셋팅에대해) / 분양라이브신청취소시에(어떤투어셋팅에대해) */
            var target_tour_id = req_body.tour_id;//해당 txnid tourid,tdid에 관련된 내역들. 이 케이스의 경우 해당 분양 라이브예약셋팅 tourid,tdid일대일대응 에 대해서 신청한 touRreservation리스트 회원들조회.
            var transaction_id = req_body.transaction_id;
            /*
            어떤 trid또는 tourid에 대해서 한건지 신규접수의 경우 trid없기에 라이브신규접수,방문예약신규접수시엔 tour_id,transaciton-id같은값(tourid)
            1.분양방문예약,라이브예약 신규접수시에 tour_id == transaction_id(tour_id)
            2.분양방문예약수정,취소,라이브방송예약취소시엔 tour_id != transaciton_id(tr_id) 어떤 신청에대해서 수정,취소했고 했는지.
            */
            var [match_bunyangprojectquery] = await connection.query("select * from tour where tour_id=?",[target_tour_id]);//해당 투어id값 분양플젝 셋팅id값이 어떤 분양프로젝트에있는 방문or라이브예약셋팅여부인지조회.

            var target_bpid=match_bunyangprojectquery[0].bp_id;//관련 프로젝트bpid값.

            var [match_bunyang_query] = await connection.query("select * from company_member where bp_id=?",[target_bpid]);//해당 bpid에 속해져있는 등록되어있는 분양사팀원들 및 그 내역들에서 분양임의 팀원들내역이 있을것이고 bpId가 있는내역들은 모두 분양팀원들 내역이며 이 분양팀원들에게 관련하여 보낸다.
           // var [match_bunyang_query_distinctcompanyid] = await connection.query("select distinct company_id from company_member where bp_id=?",[target_bpid]);
            var match_bunyang_memid=[];
            /*for(let j=0; j<match_bunyang_query_distinctcompanyid.length; j++){
               let companyid_loca=match_bunyang_query_distinctcompanyid[j]['company_id'];
              // let [user_query]= await connection.query("select * from user where company_id=? and register_type='korex'",[companyid_loca]);//각 회사 생성자들.(분양사)
               //let origin_memid=user_query[0].mem_id;

               //match_bunyang_memid.push(origin_memid);
            }*/
            for(let jj=0; jj<match_bunyang_query.length; jj++){
                match_bunyang_memid.push(match_bunyang_query[jj].mem_id);
            }
            console.log('관련된 모든 발송대상 분양대행사 회원들:',match_bunyang_memid);

            for(let a=0; a<match_bunyang_memid.length; a++){
                let memid_local=match_bunyang_memid[a];

                var [notiset_bunyang_query] = await connection.query("select * from notificationSetting where mem_id=? and bp_id=?",[memid_local,target_bpid]);
                //그 특정 관련된 txnid tourid관련된 bpid분양프로젝트별 알람셋틷 분양프로젝트별 알람셋팅(분양대행사유저)내역을 가져와야한다.
                if(notiset_bunyang_query.length>=1){

                    var notiset_flag;
                    if(noti_type== "bunyang_visit_new_registed" || noti_type=="bunyang_visit_reserv_modify" || noti_type=="bunyang_visit_reserv_cancle"){
                        //분양 방문신청 신규신청,내역수정,신청취소 등의 상황시에
                        notiset_flag=notiset_bunyang_query[0]['notiset_bunyangsupply_visit_reserv'];//분양공급 방문예약 셋팅허용여부
                    }else if(noti_type=="bunyang_live_new_registed" || noti_type=="bunyang_live_reserv_cancle"){
                        //분양 라이브신청 신규신청,예약취소 등의 라이브방송관련 상황발생시(분양공급 라이브예약 셋팅허용여부)
                        notiset_flag=notiset_bunyang_query[0]['notiset_bunyangsupply_live_reserv'];
                    }

                    //각 관련 유저의 알람셋팅내역조회.
                    if(notiset_flag==1){
                        //방문예약 수정,취소인경우>>
                        if(noti_type=="bunyang_visit_reserv_modify" || noti_type=="bunyang_visit_reserv_cancle"){
                            //1.분양방문예약수정,취소시에 관련 알람을 받을지 여부 정하는것(분양대행사마페에서) 인 경우에만.
                            //중개사가 신청한 방문예약내역 수정,취소시에 관련 사항 알림을 받을지 여부.각 신청내역trid별 관리
                            if(notiset_bunyang_query[0]['notiset_bunyangsupply_visit_reserv_part']){
                                var notiset_bunyangsupply_visit_reserv_part_array=notiset_bunyang_query[0]['notiset_bunyangsupply_visit_reserv_part'].split(',');
                            }else{
                                var notiset_bunyangsupply_visit_reserv_part_array=[];
                            }

                            if(notiset_bunyangsupply_visit_reserv_part_array.includes(String(transaction_id))){
                                //분양방문예약 수정,취소시에 수정,취소한 trid에 대한 내역을 유저별로 알림받기로한 신청내역 part_id로 갖고있는지여부.
                                await connection.beginTransaction();
                                var [notification_insert_rows]=await connection.query('insert into notification(mem_id,bp_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[memid_local,target_bpid,transaction_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                                await connection.commit();
                                console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);
        
                                //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                                var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[memid_local]);
                                if(targetuser_query.length>=1){
                                    if(targetuser_query[0].fcmtocken){
                                        //토큰존재시에 푸시알림
                                        console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                        fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양상품 예약(라이브,방문) 상태값변경');
                                    }else{
                                        //토큰이 없다면 문자알림!
                                        console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                        let req_data={
                                        
                                            receiver: targetuser_query[0].phone,
                                            msg : message,
                                            msg_type : 'LMS',
                                            title : '분양상품 예약(라이브,방문) 상태값변경',
                                            type : '분양상품 예약(라이브,방문) 상태값변경'
                                            
                                        }
                                        
                                        aligosms2.send(request,req_data,response,'분양상품 예약(라이브,방문) 상태값변경');
                                    }
                                }
                            }
                        }else{
                            //분양방문예약 새로등록하는경우
                            await connection.beginTransaction();
                            var [notification_insert_rows]=await connection.query('insert into notification(mem_id,bp_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)',[memid_local,target_bpid,transaction_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                            await connection.commit();
                            console.log('notification_insert_rows insert query rtowss:',notification_insert_rows);
    
                            //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                            var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[memid_local]);
                            if(targetuser_query.length>=1){
                                if(targetuser_query[0].fcmtocken){
                                    //토큰존재시에 푸시알림
                                    console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                                    fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양상품 예약(라이브,방문) 상태값변경');
                                }else{
                                    //토큰이 없다면 문자알림!
                                    console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                                    let req_data={
                                    
                                        receiver: targetuser_query[0].phone,
                                        msg : message,
                                        msg_type : 'LMS',
                                        title : '분양상품 예약(라이브,방문) 상태값변경',
                                        type : '분양상품 예약(라이브,방문) 상태값변경'
                                        
                                    }
                                    
                                    aligosms2.send(request,req_data,response,'분양상품 예약(라이브,방문) 상태값변경');
                                }
                            }
                        }
                    }
 
                }else{
                    //알람셋팅내역없던경우 (분양대행사 방문예약 part관리는 방문예약의 경우는 ui별로 있으나, 라이브예약은 없기에, 라이브예약은 체크박스여부로만 판단한다.)
                    await connection.beginTransaction();
                    var [notification_insert_rows]=await connection.query("insert into notification(mem_id,bp_id,txn_id,noti_content,noti_type,noti_status,modify_date,create_date,noti_case) values(?,?,?,?,?,?,?,?,?)",[memid_local,target_bpid,transaction_id,message,noti_type,0,new Date(),new Date(),noti_case]);
                    await connection.commit();
                    console.log('notificaiton insert rowss insert query rowss:',notification_insert_rows);

                    //알림수신받는다고 동의한경우에만 푸시알림 떄린다.푸시알림의 경우 앱설치자인 memid유저라고한다면 때리고, 미설치자 토큰값(기기)없으면 미설치자이기에 문자알림을 한다.
                    var [targetuser_query] = await connection.query("select * from user where mem_id=? and is_deleted=0",[memid_local]);
                    if(targetuser_query.length>=1){
                        if(targetuser_query[0].fcmtocken){
                            //토큰존재시에 푸시알림
                            console.log('토큰존재 푸시알림!',targetuser_query[0],targetuser_query[0].fcmtocken);
                            fcmpushalram.push_send(null,targetuser_query[0].fcmtocken,message,'분양상품 예약(라이브,방문) 상태값변경');
                        }else{
                            //토큰이 없다면 문자알림!
                            console.log('토큰없다면 문자알림!',aligosms2,aligosms2.send);
                            let req_data={
                            
                                receiver: targetuser_query[0].phone,
                                msg : message,
                                msg_type : 'LMS',
                                title : '분양상품 예약(라이브,방문) 상태값변경',
                                type : '분양상품 예약(라이브,방문) 상태값변경'
                                
                            }
                            
                            aligosms2.send(request,req_data,response,'분양상품 예약(라이브,방문) 상태값변경');
                        }
                    }
                }                       
            }
        }
        connection.release();
        return response.json({success:true, message:'notification_insert_rows등 server query success!!'});  
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
router.post('/myalram_detail',async function(request,response){
    console.log('malram sdetailsss:',request.body);

    var req_body= request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        var noti_id = req_body.noti_id;

        var [notiinfo_query] = await connection.query("select * from notification where noti_id=?",[noti_id]);

        console.log('notiinfo reusltsss:',notiinfo_query);
        connection.release();

        return response.json({success:true, message:'notiinfo detail query reusltsss!!',result:[notiinfo_query[0]]});
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
    
});
router.post('/myalram_list_process',async function(request,response){
    console.log('=============>>>myalram_list_process request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        
        var mem_id = req_body.mem_id;//memid 에게 가해진 모든 알림리스트 조회.

        var [exculsive_supply_privacycompany_notilist]=await connection.query('select * from notification where mem_id='+mem_id+' and (noti_type=1 || noti_type=3 || noti_type=5 || noti_type=16 || (noti_type=13 and date_format(now(),"%Y-%m-%d")>= reserv_plan_date) || (noti_type=14 and date_format(now(),"%Y-%m-%d")>= reserv_plan_date)) and noti_status!=2 order by create_date desc');//전속매물공급(개인,기업) 관련된 모든 알림들 조회(해당 임의 memijd회원의)  개인기업용
        var [exculsive_supply_probroker_notilist] = await connection.query('select * from notification where mem_id='+mem_id+' and (noti_type=2 || noti_type=4 || noti_type=6 || noti_type=9 || noti_type=8 || noti_type=15 || noti_type=17) and  noti_status!=2 order by create_date desc');//전속매물공급(중개사) 관련된 모든 알림들 조회(핸당 회원의)  중개사회원용
        var [exculsive_demand_notilist] = await connection.query("select * from notification where ((mem_id="+mem_id+" and noti_type=10) or (mem_id="+mem_id+" and noti_type=11 and date_format(now(),'%Y-%m-%d') >= reserv_plan_date)) and  noti_status!=2 order by create_date desc")//예약성알림(물건투어예약에 대한 예약일1일전 알림(시스템에 의한 예약노출알림) 예약해제되었을시 예약시간조정된경우)  >>개인기업용 

        var [bunyangsuyo_notilist] = await connection.query(`select * from notification where (noti_type='bunyang_live_newRegisted' || noti_type='bunyang_live_edited' || noti_type='bunyang_live_invite' || (noti_type='bunyang_live_startday_reservealram' and date_format(now(),'%Y-%m-%d')>=reserv_plan_date) || (noti_type='bunyang_visit_startday_reservealram' and date_format(now(),'%Y-%m-%d')>=reserv_plan_date) || noti_type='bunyang_visit_cancled_by_bunyang' ) and mem_id=${mem_id} and noti_status!=2 order by create_date desc`);
        var [bunyangsupply_notilist] = await connection.query(`select * from notification where (noti_type='bunyang_visit_new_registed' || noti_type='bunyang_visit_reserv_modify' || noti_type='bunyang_visit_reserv_cancle' || noti_type='bunyang_live_new_registed' || noti_type='bunyang_live_reserv_cancle') and mem_id=${mem_id} and noti_status!=2 order by create_date desc`);


        console.log('select * from notification where mem_id='+mem_id+' and (noti_type=1 || noti_type=3 || noti_type=5 || noti_type=16 || (noti_type=13 and date_format(now(),"%Y-%m-%d")>= reserv_plan_date) || (noti_type=14 and date_format(now(),"%Y-%m-%d")>= reserv_plan_date)) and  noti_status!=2 order by create_date desc');
        console.log('select * from notification where mem_id='+mem_id+' and (noti_type=2 || noti_type=4 || noti_type=6 || noti_type=9 || noti_type=8 || noti_type=15 || noti_type=17) and  noti_status!=2 order by create_date desc');
        console.log("select * from notification where ((mem_id="+mem_id+" and noti_type=10) or (mem_id="+mem_id+" and noti_type=11 and date_format(now(),'%Y-%m-%d') >= reserv_plan_date)) and  noti_status!=2 order by create_date desc");
        console.log(`select * from notification where (noti_type='bunyang_live_newRegisted' || noti_type='bunyang_live_edited' || noti_type='bunyang_live_invite' || (noti_type='bunyang_live_startday_reservealram' and date_format(now(),'%Y-%m-%d')>=reserv_plan_date) || (noti_type='bunyang_visit_startday_reservealram' and date_format(now(),'%Y-%m-%d')>=reserv_plan_date) || noti_type='bunyang_visit_cancled_by_bunyang' ) and mem_id=${mem_id} and noti_status!=2 order by create_date desc`);
        console.log(`select * from notification where (noti_type='bunyang_visit_new_registed' || noti_type='bunyang_visit_reserv_modify' || noti_type='bunyang_visit_reserv_cancle' || noti_type='bunyang_live_new_registed' || noti_type='bunyang_live_reserv_cancle') and mem_id=${mem_id} and noti_status!=2 order by create_date desc`);


        //읽지 않은 카운트 수 구하기 용도.
        console.log('select count(*) as cnt from notification where mem_id='+mem_id+' and (noti_type=1 || noti_type=3 || noti_type=5 || noti_type=16 || (noti_type=13 and date_format(now(),"%Y-%m-%d")>=reserv_plan_date) || (noti_type=14 and date_format(now(),"%Y-%m-%d")>=reserv_plan_date)) and noti_status=0');
        console.log('select count(*) as cnt from notification where mem_id='+mem_id+' and (noti_type=2 || noti_type=4 || noti_type=6 || noti_type=9 || noti_type=8 || noti_type=15 || noti_type=17) and noti_status=0');
        console.log("select count(*) as cnt from notification where ((mem_id="+mem_id+" and noti_type=10) or (mem_id="+mem_id+" and noti_type=11 and date_format(now(),'%Y-%m-%d')>= reserv_plan_date)) and noti_status=0");//전속매물수요관련(예약접수한것 시간재조정경우 + 물건투어예약 일일전 관련 예약알림..)관련 된 모든 내역들중에서 읽지않은것들만 카운팅.
        console.log(`select count(*) as cnt from notification where (noti_type='bunyang_live_newRegisted' || noti_type='bunyang_live_edited' || noti_type='bunyang_live_invite' || (noti_type='bunyang_live_startday_reservealram' and date_format(now(),'%Y-%m-%d')>=reserv_plan_date) || (noti_type='bunyang_visit_startday_reservealram' and date_format(now(),'%Y-%m-%d')>=reserv_plan_date) || noti_type='bunyang_visit_cancled_by_bunyang' ) and mem_id=${mem_id} and noti_status=0`);
        console.log(`select count(*) as cnt from notification where (noti_type='bunyang_visit_new_registed' || noti_type='bunyang_visit_reserv_modify' || noti_type='bunyang_visit_reserv_cancle' || noti_type='bunyang_live_new_registed' || noti_type='bunyang_live_reserv_cancle') and mem_id=${mem_id} and noti_status=0`);

        var [exculsive_supply_privacycompany_notilist_notseen]=await connection.query('select count(*) as cnt from notification where mem_id='+mem_id+' and (noti_type=1 || noti_type=3 || noti_type=5 || noti_type=16 || (noti_type=13 and date_format(now(),"%Y-%m-%d")>=reserv_plan_date) || (noti_type=14 and date_format(now(),"%Y-%m-%d")>=reserv_plan_date)) and (noti_status!=1 and noti_status!=2)');//전속매물공급(개인,기업) 관련된 모든 알림들 조회(해당 임의 memijd회원의)
        var [exculsive_supply_probroker_notilist_notseen] = await connection.query('select count(*) as cnt from notification where mem_id='+mem_id+' and (noti_type=2 || noti_type=4 || noti_type=6 || noti_type=9 || noti_type=8 || noti_type=15 || noti_type=17) and (noti_status!=1 and noti_status!=2)');//전속매물공급(중개사) 관련된 모든 알림들 조회(핸당 회원의)
        var [exculsive_demand_notilist_notseen] = await connection.query("select count(*) as cnt from notification where ((mem_id="+mem_id+" and noti_type=10) or (mem_id="+mem_id+" and noti_type=11 and date_format(now(),'%Y-%m-%d')>= reserv_plan_date)) and (noti_status!=1 and noti_status!=2)");//예약성알림(물건투어예약에 대한 예약일1일전 알림(시스템에 의한 예약노출알림) 예약해제되었을시 예약시간조정된경우) 관련된 전속매물수요관련 알림들(예약발송일이후에 온것들)내역 카운팅.
        var [bunyangsuyo_notilist_notseen] = await connection.query(`select count(*) as cnt from notification where (noti_type='bunyang_live_newRegisted' || noti_type='bunyang_live_edited' || noti_type='bunyang_live_invite' || (noti_type='bunyang_live_startday_reservealram' and date_format(now(),'%Y-%m-%d')>=reserv_plan_date) || (noti_type='bunyang_visit_startday_reservealram' and date_format(now(),'%Y-%m-%d')>=reserv_plan_date) || noti_type='bunyang_visit_cancled_by_bunyang' ) and mem_id=${mem_id} and noti_status=0`);
        var [bunyangsupply_notilist_notseen] = await connection.query(`select count(*) as cnt from notification where (noti_type='bunyang_visit_new_registed' || noti_type='bunyang_visit_reserv_modify' || noti_type='bunyang_visit_reserv_cancle' || noti_type='bunyang_live_new_registed' || noti_type='bunyang_live_reserv_cancle') and mem_id=${mem_id} and noti_status=0`);

        //console.log('notification_list_view select query rtowss:',exculsive_supply_privacycompany_notilist,exculsive_supply_probroker_notilist,exculsive_demand_notilist);
        
        connection.release();

        return response.json({success:true, message:'notification_list_view server query success!!',result:[exculsive_supply_privacycompany_notilist,exculsive_supply_probroker_notilist,exculsive_demand_notilist,bunyangsuyo_notilist,bunyangsupply_notilist],count_result:[exculsive_supply_privacycompany_notilist_notseen[0]['cnt'],exculsive_supply_probroker_notilist_notseen[0]['cnt'],exculsive_demand_notilist_notseen[0]['cnt'],bunyangsuyo_notilist_notseen[0]['cnt'], bunyangsupply_notilist_notseen[0]['cnt']]});
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//알림관련 설정 알림설정.
router.post('/alramSetting_process',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        
        var change_value= req_body.change_value;//noti_id 어떤 매물id값(transaction,prdidinetiity)에 대한 관련 알림인지여부.
        var target=req_body.target;
        var mem_id=req_body.mem_id;

        var company_id=req_body.company_id;
        var bp_id=req_body.bp_id;
        var user_type=req_body.user_type;

        if(company_id && !bp_id){
            //기업,중개사 companyid소속별 알람별 셋팅 분양프로젝트별bpid별 셋팅이 아녔던 케이스

            var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);

            await connection.beginTransaction();
            if(select_query.length>=1){
                
                var [updatequery] = await connection.query("update notificationSetting set "+target+"="+change_value+" , modify_date=? where mem_id=? and company_id=?",[new Date(),mem_id,company_id]);//해당 memid,companyid(중개사or기업소속id)의 소속별 알람셋팅 및 수정orinsert
                console.log('updatequery reusltssss:',updatequery);
                
            }else{
                var [insertquery] =await connection.query("insert into notificationSetting("+target+",mem_id,modify_date,company_id) values(?,?,?,?)",[change_value,mem_id,new Date(),company_id]);

                console.log('insertquery reulssssss:',insertquery);
            }
            connection.commit();
            connection.release();

            var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);
            if(select_query.length >=1){
                return response.json({success:true, result:select_query[0]});
            }else{
                return response.json({success:true, result:null});
            }
        }else if(!company_id && bp_id){
            //분양대행사회원 소속된 분양프로젝트별 분양프로젝트소속별 알렘셋팅인케이스
            var [select_query] = await connection.query("select * from notificationSetting where mem_id=? and bp_id=?",[mem_id,bp_id]);

            await connection.beginTransaction();
            if(select_query.length>=1){
                var [updatequery] = await connection.query("update notificationSetting set "+target+"="+change_value+" , modify_date=? where mem_id=? and bp_id=?",[new Date(),mem_id,bp_id]);
                console.log('updatequery reulsttssss:',updatequery);
            }else{
                var [insertquery] = await connection.query("insert into notificationSetting("+target+",mem_id,modify_date,bp_id) values(?,?,?,?)",[change_value,mem_id,new Date(),bp_id]);

                console.log('insertquery resultsss:',insertquery);
            }
            connection.commit();
            connection.release();

            var [select_query] = await connection.query("select * from notificationSetting where mem_id=? and bp_id=?",[mem_id,bp_id]);
            if(select_query.length>=1){
                return response.json({success:true, result:select_query[0]});
            }else{
                return response.json({success:true, result: null});
            }
        }else if(user_type=='개인'){
            var [select_query] = await connection.query("select * from notificationSetting where mem_id=?",[mem_id]);

            await connection.beginTransaction();
            if(select_query.length>=1){
                var [updatequery] = await connection.query("update notificationSetting set "+target+"="+change_value+" , modify_date=? where mem_id=?",[new Date(),mem_id]);
                console.log('updatequery reulsttssss:',updatequery);
            }else{
                var [insertquery] = await connection.query("insert into notificationSetting("+target+",mem_id,modify_date) values(?,?,?)",[change_value,mem_id,new Date()]);

                console.log('insertquery resultsss:',insertquery);
            }
            connection.commit();
            connection.release();

            var [select_query] = await connection.query("select * from notificationSetting where mem_id=?",[mem_id]);
            if(select_query.length>=1){
                return response.json({success:true, result:select_query[0]});
            }else{
                return response.json({success:true, result: null});
            }
        }
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//알림관련 설정 알림설정.
router.post('/alramSetting_process_prdlist',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        
        var action= req_body.action;//noti_id 어떤 매물id값(transaction,prdidinetiity)에 대한 관련 알림인지여부.
        var prd_identity_id=req_body.prd_identity_id;
        var mem_id=req_body.mem_id;
        var company_id=req_body.company_id;

        //중개사만 요청하는 api이다.
        var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);

        if(select_query.length >= 1){
             //await connection.beginTransaction();
             var notiset_prd_part_prev=select_query[0]['notiset_prd_part'];
            
            if(action=='insert'){
                 
                if(notiset_prd_part_prev){
                    var notiset_prd_part_prev=notiset_prd_part_prev.split(',');

                    if(notiset_prd_part_prev.includes(prd_identity_id)){

                    }else{
                        notiset_prd_part_prev.push(prd_identity_id);
                    }
                    console.log('추가 적용후에 배열상태:',notiset_prd_part_prev);
                    await connection.beginTransaction();
                    var [updatequery] = await connection.query("update notificationSetting set notiset_prd_part=? where mem_id=? and company_id=?",[notiset_prd_part_prev.join(','),mem_id,company_id]);
                    console.log('updater query reulstss:',updatequery);
                }else{
                    var notiset_prd_part_prev=[];
                    notiset_prd_part_prev.push(prd_identity_id);
                    console.log('초기 아무것도  없던 상태인경우에 바로 넣기:',notiset_prd_part_prev);
                    await connection.beginTransaction();
                    var [updatequery] = await connection.query("update notificationSetting set notiset_prd_part=? where mem_id=? and company_id=?",[notiset_prd_part_prev.join(','),mem_id,company_id]);
                    console.log('updater query reulstss:',updatequery);
                }
                
                connection.commit();

                var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);
                connection.release();
  
                return response.json({success:true, result:select_query[0]});               

            }else{
                if(notiset_prd_part_prev){
                   var notiset_prd_part_prev=notiset_prd_part_prev.split(',');

                    for(let j=0; j<notiset_prd_part_prev.length; j++){
                        if(notiset_prd_part_prev[j]==prd_identity_id){
                            notiset_prd_part_prev.splice(j,1);
                            j--;
                        }
                    }
                    console.log('삭제 적용후에 배열상태:',notiset_prd_part_prev);
                    await connection.beginTransaction();
                    var [updatequery] = await connection.query("update notificationSetting set notiset_prd_part=? where mem_id=? and company_id=?",[notiset_prd_part_prev.join(','),mem_id,company_id]);
                    console.log('updater query reulstss:',updatequery);
                    connection.commit();

                    var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);
                    connection.release();

                    return response.json({success:true, result:select_query[0]});    
                }else{
                    console.log('더이상 삭제할 요소가 없습니다!');
                    connection.rollback();
                    connection.release();
                    return response.json({success:false, result:null});
                }                    
            }
                       
        }else{
            connection.rollback();
            connection.release();
            return response.json({success:false, message:'기본 알림정보 셋팅 이후에 시도해주세요',result:null});
        }

    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//알림관련 설정 알림설정.(중개의뢰매물 물건별 알림설정)
router.post('/alramSetting_process_brokerprdlist',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        
        var action= req_body.action;//noti_id 어떤 매물id값(transaction,prdidinetiity)에 대한 관련 알림인지여부.
        var prd_identity_id=req_body.prd_identity_id;
        var mem_id=req_body.mem_id;//개인기업이 중개의로한 매물들목록에 대해서 기업타입인경우,개인타입인경우 좀 다르다.
        var company_id=req_body.company_id;
        var user_type=req_body.user_type;

        if(user_type=='개인'){
            var [select_query]= await connection.query("select * from notificationSetting where mem_id=?",[mem_id]);

            if(select_query.length >= 1){
                //await connection.beginTransaction();
                var notiset_prd_part_prev=select_query[0]['notiset_brokerprd_part'];
                
                if(action=='insert'){
                    
                    if(notiset_prd_part_prev){
                        var notiset_prd_part_prev=notiset_prd_part_prev.split(',');

                        if(notiset_prd_part_prev.includes(prd_identity_id)){

                        }else{
                            notiset_prd_part_prev.push(prd_identity_id);
                        }
                        console.log('추가 적용후에 배열상태:',notiset_prd_part_prev);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query("update notificationSetting set notiset_brokerprd_part=? where mem_id=?",[notiset_prd_part_prev.join(','),mem_id]);
                        console.log('updater query reulstss:',updatequery);
                    }else{
                        var notiset_prd_part_prev=[];
                        notiset_prd_part_prev.push(prd_identity_id);
                        console.log('초기 아무것도  없던 상태인경우에 바로 넣기:',notiset_prd_part_prev);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query("update notificationSetting set notiset_brokerprd_part=? where mem_id=?",[notiset_prd_part_prev.join(','),mem_id]);
                        console.log('updater query reulstss:',updatequery);
                    }
                    
                    connection.commit();

                    var [select_query]= await connection.query("select * from notificationSetting where mem_id=?",[mem_id]);
                    connection.release();
    
                    return response.json({success:true, result:select_query[0]});               

                }else{
                    if(notiset_prd_part_prev){
                    var notiset_prd_part_prev=notiset_prd_part_prev.split(',');

                        for(let j=0; j<notiset_prd_part_prev.length; j++){
                            if(notiset_prd_part_prev[j]==prd_identity_id){
                                notiset_prd_part_prev.splice(j,1);
                                j--;
                            }
                        }
                        console.log('삭제 적용후에 배열상태:',notiset_prd_part_prev);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query("update notificationSetting set notiset_brokerprd_part=? where mem_id=?",[notiset_prd_part_prev.join(','),mem_id]);
                        console.log('updater query reulstss:',updatequery);
                        connection.commit();

                        var [select_query]= await connection.query("select * from notificationSetting where mem_id=?",[mem_id]);
                        connection.release();
                        return response.json({success:true, result:select_query[0]});    
                    }else{
                        console.log('더이상 삭제할 요소가 없습니다!');
                        connection.rollback();
                        connection.release();
                        return response.json({success:false, result:null});
                    }                    
                }
                        
            }else{
                connection.rollback();
                connection.release();
                return response.json({success:false, message:'기본 알림정보 설정이후 시도해주세요.', result:null});
            }
        }else{
            var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);

            if(select_query.length >= 1){
                //await connection.beginTransaction();
                var notiset_prd_part_prev=select_query[0]['notiset_brokerprd_part'];
                
                if(action=='insert'){
                    
                    if(notiset_prd_part_prev){
                        var notiset_prd_part_prev=notiset_prd_part_prev.split(',');

                        if(notiset_prd_part_prev.includes(prd_identity_id)){

                        }else{
                            notiset_prd_part_prev.push(prd_identity_id);
                        }
                        console.log('추가 적용후에 배열상태:',notiset_prd_part_prev);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query("update notificationSetting set notiset_brokerprd_part=? where mem_id=? and company_id=?",[notiset_prd_part_prev.join(','),mem_id,company_id]);
                        console.log('updater query reulstss:',updatequery);
                    }else{
                        var notiset_prd_part_prev=[];
                        notiset_prd_part_prev.push(prd_identity_id);
                        console.log('초기 아무것도  없던 상태인경우에 바로 넣기:',notiset_prd_part_prev);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query("update notificationSetting set notiset_brokerprd_part=? where mem_id=? and company_id=?",[notiset_prd_part_prev.join(','),mem_id,company_id]);
                        console.log('updater query reulstss:',updatequery);
                    }
                    
                    connection.commit();

                    var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);
                    connection.release();
    
                    return response.json({success:true, result:select_query[0]});               

                }else{
                    if(notiset_prd_part_prev){
                    var notiset_prd_part_prev=notiset_prd_part_prev.split(',');

                        for(let j=0; j<notiset_prd_part_prev.length; j++){
                            if(notiset_prd_part_prev[j]==prd_identity_id){
                                notiset_prd_part_prev.splice(j,1);
                                j--;
                            }
                        }
                        console.log('삭제 적용후에 배열상태:',notiset_prd_part_prev);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query("update notificationSetting set notiset_brokerprd_part=? where mem_id=? and company_id=?",[notiset_prd_part_prev.join(','),mem_id,company_id]);
                        console.log('updater query reulstss:',updatequery);
                        connection.commit();

                        var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);
                        connection.release();
                        return response.json({success:true, result:select_query[0]});    
                    }else{
                        console.log('더이상 삭제할 요소가 없습니다!');
                        connection.rollback();
                        connection.release();
                        return response.json({success:false, result:null});
                    }                    
                }
                        
            }else{
                connection.rollback();
                connection.release();
                return response.json({success:false, message:'기본 알림정보 설정이후 시도해주세요.', result:null});
            }
        }
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//알림관련 설정 알림설정.개인기업회원  전속매물수요관련 알림설정 관련 관리.(내물건투어예약)
router.post('/alramSetting_process_tourreserv',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        
        var action= req_body.action;//noti_id 어떤 매물id값(transaction,prdidinetiity)에 대한 관련 알림인지여부.
        var tr_id=req_body.tr_id;
        var mem_id=req_body.mem_id;
        var company_id=req_body.company_id;
        var user_type=req_body.user_type;

        var where_companyid=` and company_id=${company_id}`;
        var [select_query]= await connection.query(`select * from notificationSetting where mem_id=? ${user_type!='개인'?where_companyid:''}`,[mem_id]);

        if(select_query.length >= 1){
            //await connection.beginTransaction();
            var notiset_rsv_prd_reserve_part=select_query[0]['notiset_rsv_prd_reserve_part'];
            
            if(action=='insert'){
                
                if(notiset_rsv_prd_reserve_part){
                    var notiset_rsv_prd_reserve_part_prev=notiset_rsv_prd_reserve_part.split(',');

                    if(notiset_rsv_prd_reserve_part_prev.includes(tr_id)){

                    }else{
                        notiset_rsv_prd_reserve_part_prev.push(tr_id);
                    }
                    console.log('추가 적용후에 배열상태:',notiset_rsv_prd_reserve_part_prev);
                    await connection.beginTransaction();
                    var [updatequery] = await connection.query(`update notificationSetting set notiset_rsv_prd_reserve_part=? where mem_id=? ${user_type!='개인'?where_companyid:''}`,[notiset_rsv_prd_reserve_part_prev.join(','),mem_id]);
                    console.log('updater query reulstss:',updatequery);
                }else{
                    var notiset_rsv_prd_reserve_part_prev=[];
                    notiset_rsv_prd_reserve_part_prev.push(tr_id);
                    console.log('초기 아무것도  없던 상태인경우에 바로 넣기:',notiset_rsv_prd_reserve_part_prev);
                    await connection.beginTransaction();
                    var [updatequery] = await connection.query(`update notificationSetting set notiset_rsv_prd_reserve_part=? where mem_id=? ${user_type!='개인'?where_companyid:''} `,[notiset_rsv_prd_reserve_part_prev.join(','),mem_id]);
                    console.log('updater query reulstss:',updatequery);
                }
                
                connection.commit();

                var [select_query]= await connection.query(`select * from notificationSetting where mem_id=? ${user_type!='개인'?where_companyid:''}`,[mem_id]);
                connection.release();

                return response.json({success:true, result:select_query[0]});               

            }else{
                if(notiset_rsv_prd_reserve_part){
                var notiset_rsv_prd_reserve_part_prev=notiset_rsv_prd_reserve_part.split(',');

                    for(let j=0; j<notiset_rsv_prd_reserve_part_prev.length; j++){
                        if(notiset_rsv_prd_reserve_part_prev[j]==tr_id){
                            notiset_rsv_prd_reserve_part_prev.splice(j,1);
                            j--;
                        }
                    }
                    console.log('삭제 적용후에 배열상태:',notiset_rsv_prd_reserve_part_prev);
                    await connection.beginTransaction();
                    var [updatequery] = await connection.query(`update notificationSetting set notiset_rsv_prd_reserve_part=? where mem_id=? ${user_type!='개인'?where_companyid:''}`,[notiset_rsv_prd_reserve_part_prev.join(','),mem_id]);
                    console.log('updater query reulstss:',updatequery);
                    connection.commit();

                    var [select_query]= await connection.query(`select * from notificationSetting where mem_id=? ${user_type!='개인'?where_companyid:''}`,[mem_id]);
                    connection.release();
                    return response.json({success:true, result:select_query[0]});    
                }else{
                    console.log('더이상 삭제할 요소가 없습니다!');
                    connection.rollback();
                    connection.release();
                    return response.json({success:false, result:null});
                }                    
            }
                    
        }else{
            connection.rollback();
            connection.release();
            return response.json({success:false, message:'기본 알림정보 설정이후 시도해주세요',result:null});
        }   

    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//알림관련 설정 알림설정.전문중개사회원 물건투어예약접수관리 전속매물공급관련 알림설정 관련 관리.(나애게로온 물건투어예약접수내역 신규접수,사용자수정,예약취소시 관련알림 기업,개인->중개사에게로 갈지 안갈지 여부 설정관련 물건별id값으로 받을 매물id리스트 설정시 그 매물id리스트에 해당하는 관련된 액션내역들만 알림간다.)
router.post('/alramSetting_process_reservmanage',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        
        var action= req_body.action;//noti_id 어떤 매물id값(transaction,prdidinetiity)에 대한 관련 알림인지여부.
        var prd_identity_id=req_body.prd_identity_id;
        var mem_id=req_body.mem_id;
        var company_id=req_body.company_id;
        var user_type=req_body.user_type;

        var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);

        if(select_query.length >= 1){
            //await connection.beginTransaction();
            var notiset_rsv_prd_manage_part=select_query[0]['notiset_rsv_prd_manage_part'];
            
            if(action=='insert'){
                 
                if(notiset_rsv_prd_manage_part){
                    var notiset_rsv_prd_manage_part_prev=notiset_rsv_prd_manage_part.split(',');

                    if(notiset_rsv_prd_manage_part_prev.includes(prd_identity_id)){

                    }else{
                        notiset_rsv_prd_manage_part_prev.push(prd_identity_id);
                    }
                    console.log('추가 적용후에 배열상태:',notiset_rsv_prd_manage_part_prev);
                    await connection.beginTransaction();
                    var [updatequery] = await connection.query("update notificationSetting set notiset_rsv_prd_manage_part=? where mem_id=? and company_id=?",[notiset_rsv_prd_manage_part_prev.join(','),mem_id,company_id]);
                    console.log('updater query reulstss:',updatequery);
                }else{
                    var notiset_rsv_prd_manage_part_prev=[];
                    notiset_rsv_prd_manage_part_prev.push(prd_identity_id);
                    console.log('초기 아무것도  없던 상태인경우에 바로 넣기:',notiset_rsv_prd_manage_part_prev);
                    await connection.beginTransaction();
                    var [updatequery] = await connection.query("update notificationSetting set notiset_rsv_prd_manage_part=? where mem_id=? and company_id=?",[notiset_rsv_prd_manage_part_prev.join(','),mem_id,company_id]);
                    console.log('updater query reulstss:',updatequery);
                }
                
                connection.commit();

                var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);
                connection.release();
  
                return response.json({success:true, result:select_query[0]});               

            }else{
                if(notiset_rsv_prd_manage_part){
                   var notiset_rsv_prd_manage_part_prev=notiset_rsv_prd_manage_part.split(',');

                    for(let j=0; j<notiset_rsv_prd_manage_part_prev.length; j++){
                        if(notiset_rsv_prd_manage_part_prev[j]==prd_identity_id){
                            notiset_rsv_prd_manage_part_prev.splice(j,1);
                            j--;
                        }
                    }
                    console.log('삭제 적용후에 배열상태:',notiset_rsv_prd_manage_part_prev);
                    await connection.beginTransaction();
                    var [updatequery] = await connection.query("update notificationSetting set notiset_rsv_prd_manage_part=? where mem_id=? and company_id=?",[notiset_rsv_prd_manage_part_prev.join(','),mem_id,company_id]);
                    console.log('updater query reulstss:',updatequery);
                    connection.commit();

                    var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);
                    connection.release();
                    return response.json({success:true, result:select_query[0]});    
                }else{
                    console.log('더이상 삭제할 요소가 없습니다!');
                    connection.rollback();
                    connection.release();
                    return response.json({success:false, result:null});
                }                    
            }
                       
        }else{
            connection.rollback();
            connection.release();
            return response.json({success:false,message:'기본 알람설정 설정이후 시도해주세요.', result:null});
        }

    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//알림관련 설정 알림설정.분양알림설정관련 공통적 개체
router.post('/alramSetting_process_bunyang',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        
        var action= req_body.action;//noti_id 어떤 매물id값(transaction,prdidinetiity)에 대한 관련 알림인지여부.
        var target_id=req_body.target_id;
        var mem_id=req_body.mem_id;
        var target_column=req_body.target_column;
        var bp_id = req_body.bp_id;
        var company_id = req_body.company_id;//bp_id!=null company_id=null인경우 분양대행사가 분양공급관련 알람셋팅이고 bp_id=null ,company_id!=null인경우 중개사가 분양수요관련 알람셋팅이다.

        if(bp_id && !company_id){
            //분양공급 관련 알람셋팅의 경우..
            var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and bp_id=?",[mem_id,bp_id]);

            if(select_query.length >= 1){
                //await connection.beginTransaction();
                var notiset_prev_datalist=select_query[0][target_column];
                
                if(action=='insert'){
                     
                    if(notiset_prev_datalist){
                        var notiset_prev_datalist_array=notiset_prev_datalist.split(',');
    
                        if(notiset_prev_datalist_array.includes(target_id)){
    
                        }else{
                            notiset_prev_datalist_array.push(target_id);
                        }
                        console.log('추가 적용후에 배열상태:',notiset_prev_datalist_array);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query(`update notificationSetting set ${target_column}=? where mem_id=? and bp_id=?`,[notiset_prev_datalist_array.join(','),mem_id,bp_id]);
                        console.log('updater query reulstss:',updatequery);
                    }else{
                        var notiset_prev_datalist_array=[];
                        notiset_prev_datalist_array.push(target_id);
                        console.log('초기 아무것도  없던 상태인경우에 바로 넣기:',notiset_prev_datalist_array);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query(`update notificationSetting set ${target_column}=? where mem_id=? and bp_id=?`,[notiset_prev_datalist_array.join(','),mem_id,bp_id]);
                        console.log('updater query reulstss:',updatequery);
                    }
                    
                    connection.commit();
    
                    var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and bp_id=?",[mem_id,bp_id]);
                    connection.release();
      
                    return response.json({success:true, result:select_query[0]});               
    
                }else{
                    if(notiset_prev_datalist){
                       var notiset_prev_datalist_array=notiset_prev_datalist.split(',');
    
                        for(let j=0; j<notiset_prev_datalist_array.length; j++){
                            if(notiset_prev_datalist_array[j]==target_id){
                                notiset_prev_datalist_array.splice(j,1);
                                j--;
                            }
                        }
                        console.log('삭제 적용후에 배열상태:',notiset_prev_datalist_array);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query(`update notificationSetting set ${target_column}=? where mem_id=? and bp_id=?`,[notiset_prev_datalist_array.join(','),mem_id,bp_id]);
                        console.log('updater query reulstss:',updatequery);
                        connection.commit();
    
                        var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and bp_id=?",[mem_id,bp_id]);
                        connection.release();
                        return response.json({success:true, result:select_query[0]});    
                    }else{
                        console.log('더이상 삭제할 요소가 없습니다!');
                        connection.rollback();
                        connection.release();
                        return response.json({success:false, result:null});
                    }                    
                }
                           
            }else{
                connection.rollback();
                connection.release();
                return response.json({success:false,message:'기본 알람정보 설정이후 시도해주세요', result:null});
            }
        }else{
            //분양수요관련 셋팅의경우>>
            var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);

            if(select_query.length >= 1){
                //await connection.beginTransaction();
                var notiset_prev_datalist=select_query[0][target_column];
                
                if(action=='insert'){
                     
                    if(notiset_prev_datalist){
                        var notiset_prev_datalist_array=notiset_prev_datalist.split(',');
    
                        if(notiset_prev_datalist_array.includes(target_id)){
    
                        }else{
                            notiset_prev_datalist_array.push(target_id);
                        }
                        console.log('추가 적용후에 배열상태:',notiset_prev_datalist_array);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query(`update notificationSetting set ${target_column}=? where mem_id=? and company_id=?`,[notiset_prev_datalist_array.join(','),mem_id,company_id]);
                        console.log('updater query reulstss:',updatequery);
                    }else{
                        var notiset_prev_datalist_array=[];
                        notiset_prev_datalist_array.push(target_id);
                        console.log('초기 아무것도  없던 상태인경우에 바로 넣기:',notiset_prev_datalist_array);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query(`update notificationSetting set ${target_column}=? where mem_id=? and company_id=?`,[notiset_prev_datalist_array.join(','),mem_id,company_id]);
                        console.log('updater query reulstss:',updatequery);
                    }
                    
                    connection.commit();
    
                    var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);
                    connection.release();
      
                    return response.json({success:true, result:select_query[0]});               
    
                }else{
                    if(notiset_prev_datalist){
                       var notiset_prev_datalist_array=notiset_prev_datalist.split(',');
    
                        for(let j=0; j<notiset_prev_datalist_array.length; j++){
                            if(notiset_prev_datalist_array[j]==target_id){
                                notiset_prev_datalist_array.splice(j,1);
                                j--;
                            }
                        }
                        console.log('삭제 적용후에 배열상태:',notiset_prev_datalist_array);
                        await connection.beginTransaction();
                        var [updatequery] = await connection.query(`update notificationSetting set ${target_column}=? where mem_id=? and company_id=?`,[notiset_prev_datalist_array.join(','),mem_id,company_id]);
                        console.log('updater query reulstss:',updatequery);
                        connection.commit();
    
                        var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);
                        connection.release();
                        return response.json({success:true, result:select_query[0]});    
                    }else{
                        console.log('더이상 삭제할 요소가 없습니다!');
                        connection.rollback();
                        connection.release();
                        return response.json({success:false, result:null});
                    }                    
                }
                           
            }else{
                connection.rollback();
                connection.release();
                return response.json({success:false,message:'기본 알람정보 설정이후 시도해주세요', result:null});
            }
        }
       
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//내알림설정 관련 조회뷰 상태값 조회
router.post('/alramSetting_status',async function(request,response){
    console.log('================== request bodyss:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        var mem_id=req_body.mem_id;
        var user_type=req_body.user_type;
        var company_id = req_body.company_id;
        var bp_id=req_body.bp_id;

        if(user_type=='분양대행사'){
            var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and bp_id=?",[mem_id,bp_id]);
            connection.release();
            if(select_query.length >=1){
                return response.json({success:true, result:select_query[0]});
            }else{
                return response.json({success:true, result:null});
            }
        }else if(user_type=='개인'){
            //개인회원의 경우 소속개념이 없기에 유저별>>끝
            var [select_query]= await connection.query("select * from notificationSetting where mem_id=?",[mem_id]);
            connection.release();
            if(select_query.length >=1){
                return response.json({success:true, result:select_query[0]});
            }else{
                return response.json({success:true, result:null});
            }
        }else{
            //기업,중개사..
            var [select_query]= await connection.query("select * from notificationSetting where mem_id=? and company_id=?",[mem_id,company_id]);
            connection.release();
            if(select_query.length >=1){
                return response.json({success:true, result:select_query[0]});
            }else{
                return response.json({success:true, result:null});
            }
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
module.exports=router;