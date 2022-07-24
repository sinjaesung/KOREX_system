import React ,{useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Switch ,Link} from "react-router-dom";
import "./App.css";
import "./style/new-app.css";
import { Mobile, PC } from "./MediaQuery"

/* page */
import Main from './page/MainPage';
import MbSearch from './page/mobile/MbSearchPage';
import MbBunyang from './page/mobile/MbBunyang';
import MbBunyangDetail from './page/mobile/MbBunyangDetail';
import Notice from './page/notice/NoticeList';
import NoticeDetail from './page/notice/NoticeDetail';
import Faq from './page/faq/FaqList';
import FaqDetail from './page/faq/FaqDetail';
/*개인*/
import MemberJoin from './page/member/member/Join';
import MemberLogin from './page/member/member/Login';
import MemJoinAgree from './page/member/member/MemJoinAgree';
import MemJoinAgreeSocial from './page/member/member/MemJoinAgreeSocial';
/*기업*/
import CompanyJoin from './page/member/company/Join';
import CompanyJoinInfo from './page/member/company/JoinInfo';
import CompanyJoinAgree from './page/member/company/CompanyJoinAgree';
import CompanyLogin from './page/member/company/Login';
/*중개사*/
import BrokerJoin from './page/member/broker/Join';
import JoinSearchResult from './page/member/broker/JoinSearchResult';
import JoinBusinessNumber from './page/member/broker/JoinBusinessNumber';
import BrokerJoinAgree from './page/member/broker/BrokerJoinAgree';
import BrokerRegistration from  './page/member/broker/BrokerRegistration';
import BrokerLogin from './page/member/broker/Login';
/*분양대행사*/
import AgencyJoin from './page/member/agency/Join';
import AgencyJoinInfo from './page/member/agency/JoinInfo';
import AgencyJoinAgree from './page/member/agency/AgencyJoinAgree';
import AgencyLogin from './page/member/agency/Login';
/*팀원 가입 로그인*/
import TeamLogin from './page/member/TeamLogin';
import TeamJoin from './page/member/TeamJoin';
import TeamInvitefinal from './page/member/TeamInvitefinal';

//비번찾기
import StandardPasswordfind from './page/member/StandardPasswordfind';
import MemberPasswordfind from './page/member/MemberPasswordfind';

/*mypage*/
import Mypage from './page/member/mypage/Mypage';
import MyProfileSetting from './page/member/mypage/MyProfileSetting';
import EmailChange from './page/member/mypage/EmailChange';
import PhoneChange from './page/member/mypage/PhoneChange';
import PasswordChange from './page/member/mypage/PasswordChange';
import Reservation from './page/member/mypage/Reservation';

import Team from './page/member/mypage/Team';
import BunyangTeam from './page/member/mypage/BunyangTeam';

import CompanyProfile from './page/member/mypage/CompanyProfile';
import Request from './page/member/mypage/Request';
import AddRequest from './page/member/mypage/AddRequest';//중개의뢰 추가 페이지
import AddRequestSecond from './page/member/mypage/AddRequestSecond';// 중개의뢰 > 기본정보입력
import AddRequestBroker from './page/member/mypage/AddRequestBroker'//중개의뢰 > 중개사 선택
import AddRequestBrokerSecond from './page/member/mypage/AddRequestBrokerSecond'//중개의뢰 > 중개사 기본정보입력
import EditRequest from './page/member/mypage/EditRequest';//중개의뢰 수정 페이지
import RequestExtend from './page/member/mypage/RequestExtend';//중개의뢰 수정 페이지(기한연장)
import DetailViewRequest from './page/member/mypage/DetailViewRequest';//중개의뢰 상세 페이지

import MyLike from './page/member/mypage/MyLike';
import MyMember from './page/member/mypage/MyMember';
import MyMemberEdit from './page/member/mypage/MyMemberEdit';
import MyMemberAdd from './page/member/mypage/MyMemberAdd';
import MyLive from './page/member/mypage/MyLive';
import MyAlarm from './page/member/mypage/MyAlarm';
import MyAlarmSetting from './page/member/mypage/MyAlarmSetting';
import MyAlramDetail from './page/member/mypage/MyAlramDetail';
import PropertyManagement from './page/member/mypage/PropertyManagement';
import BrokerReservation from './page/member/mypage/BrokerReservation';
import MyLiveSetting from './page/member/mypage/MyLiveSetting';
import MyVisitSetting from './page/member/mypage/MyVisitSetting';
import MyLiveManage from './page/member/mypage/MyLiveManage';
import MyLiveManageInvite from './page/member/mypage/MyLiveManageInvite';
import MyVisitManage from './page/member/mypage/MyVisitManage';
import AddProperty from './page/member/mypage/AddProperty';
import AddPropertyBasicInfo from './page/member/mypage/AddPropertyBasicInfo';
import AddPropertySecond from './page/member/mypage/AddPropertySecond';
import AddPropertyThird from './page/member/mypage/AddPropertyThird';
import ConditionChange from './page/member/mypage/ConditionChange';
import RequestReview from './page/member/mypage/RequestReview';
import RequestReviewEdit from './page/member/mypage/RequestReviewEdit';
import RequestReviewEditSecond from './page/member/mypage/RequestReviewEditSecond';
import PropertyTourSetting from './page/member/mypage/PropertyTourSetting';
import PropertyTourManage from './page/member/mypage/PropertyTourManage';
import RegistProBroker from './page/member/mypage/RegistProBroker';
import RegistProBrokerSecond from './page/member/mypage/RegistProBrokerSecond';
import RegistProBrokerThird from './page/member/mypage/RegistProBrokerThird';

//채널상담 서비스관련 콤퍼넌트
import ChannelServiceElement from './component/common/ChannelServiceElement';

/*map*/
import Map from './page/map/Map';
import TestMap from './page/map/testmap';

/*app component*/
import Preview from './page/App/Preview';
import PreviewComplete from './page/App/PreviewComplete';

/*added devlop redux elements 설정등 추가*/
import { useSelector } from 'react-redux';
import { Login_userActions,MyActions } from './store/actionCreators';

//서버요청 
import serverController from '../src/server/serverController';

export default function App(){
  var globe_aws_url='https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  const [load,setLoad] = useState(false);
  
    ChannelServiceElement.shutdown();//모든 페이지 기본값 닫기!
    
     //유저 로그인여부 로그인했으면 로그인정보 redux저장.
     useEffect ( async () => {
       console.log('app.js상태 변화시에 비동기형태 함수 실행, 앱 로그인여부 검사진행 awiait형태 함수 호출');
       let res=await serverController.connectFetchController('/api/auth/islogin','get');
      
      if(res){
        if(res.login_session == null){
          //alert('비로그인 상태입니다.');
          Login_userActions.isloginchange({islogins : 0});
          setLoad(true);
        }else{
          if(res.login_session.islogin){
           
            var get_memid=res.login_session.user_id;//mem_id 얻기
            let body_info = {
              mem_id : get_memid
            };
            //console.log(JSON.stringify(body_info));
            let user_info= await serverController.connectFetchController('/api/auth/userinfo_request','POST',JSON.stringify(body_info));
      
            //console.log('userinfo_request >>> res_result:',user_info,user_info.user_data);
            
            //alert(document.cookie);
            if(user_info.success){
              //회원정보 조회가 성공한경우에만!

              var web_cookie_list=document.cookie.split(';');//sdgsdg=gaejwgnisngjsingjsg;sndgjisngdjignjsgsg=sdgasdgasdgsadg;  ;기준으로 쿠키아이템별 조회.
              var isfcmtocken=false;//해당 웹 실행서버상에 네이티브서버에서 보낸 fcmToken값이 있는지 여부판단.
              var fcm_cookie=null;
              for(let c=0; c<web_cookie_list.length; c++){
                let cookie_item=web_cookie_list[c];//쿠키아이템 한개.
                let cookie_key= cookie_item.split('=')[0];
                let cookie_value= cookie_item.split('=')[1];//각 쿠키의 키와 값.쿠키 키값이 fcmTocken fcmTocken

                if(cookie_key.indexOf('fcmTocken')!=-1 && cookie_key == 'fcmTocken'){
                  
                  isfcmtocken=true;//fcmTocken존재한다.

                  fcm_cookie={};
                  fcm_cookie['key']=cookie_key;
                  fcm_cookie['value']=cookie_value;

                  break;
                }
              }

              if(isfcmtocken){
                 //alert('fcmTocken쿠키발견!'+document.cookie);

                // 서버로 api 호출 및 저장 
                // main_server app base authenticaiton 토큰값 여부 검사 api
                let basic_fcm_info = {
                  fcmTocken : fcm_cookie.value?fcm_cookie.value:'',//토큰값 value값을 보낸다.
                  mem_id : user_info.user_data.mem_id//유저memid값 보낸다. 해당 로그인세션 유저가 app.js 들어올시마다 호출!
                }
                let basic_fcm_authentication= await serverController.connectFetchController('/api/auth/basic_fcm_authentication','POST',JSON.stringify(basic_fcm_info));
                
                if(basic_fcm_authentication){
                  if(basic_fcm_authentication.success){
                    //alert('fcmtocken user update query success');
                  }else{
                   // alert('fcmtoken suer update query failed!');
                  }
                }
              }else{
                //쿠키 미발견이면 일반 웹 접속인것임. 그런 경우에는 fcm값을 비워야한다. 기존에 앱설치상태로 해서 앱으로 온경우

              }


              //로그인 회원정보row 리덕스 저장(암호 제외 저장) 모든 페이지에서 상태값 변화 리덕스 변화상태 감지. 조회 가능.
              Login_userActions.memidchange({memids: user_info.user_data.mem_id});
              Login_userActions.companyidchange({companyids: user_info.user_data.company_id});
              Login_userActions.user_usernamechange({user_usernames: user_info.user_data.user_username});
              Login_userActions.phonechange({phones: user_info.user_data.phone});
              Login_userActions.emailchange({emails: user_info.user_data.email});
              Login_userActions.usernamechange({usernames: user_info.user_data.user_name});
              Login_userActions.memimgchange({memimgs : user_info.user_data.mem_img});
              Login_userActions.usertypechange({usertypes: user_info.user_data.user_type});
              Login_userActions.registertypechange({registertypes: user_info.user_data.register_type});
              Login_userActions.memadminchange({memadmins: user_info.user_data.mem_admin});
              Login_userActions.memnotificationchange({mem_notification: user_info.user_data.mem_notification});
              // Login_userActions.isloginchange({islogins: 1 });
              Login_userActions.isloginchange({islogins: 1 });
              Login_userActions.companynamechange({company_name : user_info.user_data.company_name});
              Login_userActions.isprochange({ispros : user_info.user_data.ispro});
              Login_userActions.memprofilechange({memprofile : globe_aws_url!=''?(globe_aws_url+user_info.user_data.mem_img):('https://korexdata.s3.ap-northeast-2.amazonaws.com/'+user_info.user_data.mem_img)});
            
              setLoad(true);
            }
           
          }
        }
      }else{
        setLoad(true);
      }
       
     },[]);//[]이걸 넣으면 아무런 state값 변화감지 하지 않겠다는것이고, 변화감지때마다 실행개념은 아니고, 최초 앱실행때만 하겠다는 뜻이기도.*/
    

    if(!load)
     return <></>;
 
    return (
        <Router>
            {/* main */}
             <Route exact path="/" component={() => <Main />}/>
             <Route exact path="/Notice" component={Notice}/>
             <Route exact path="/NoticeDetail/:id" component={NoticeDetail}/>
             <Route exact path="/Faq" component={Faq}/>
             <Route exact path="/FaqDetail/:id" component={FaqDetail}/>
            {/*member 개인*/}
             <Route exact path="/MemberJoin" component={MemberJoin}/>
             <Route exact path="/MemberLogin" component={MemberLogin}/>
             <Route exact path="/MemJoinAgree" component={MemJoinAgree}/>
             <Route exact path="/MemJoinAgree/:useremail" component={(route) => {return(<MemJoinAgree useremail={route.match.params.useremail}/>)}}/>
             <Route exact path="/MemJoinAgreeSocial/:socialidentity" component={(route) => {return(<MemJoinAgreeSocial socialidentiy={route.match.params.socialidentity}/>)}}/>
            {/*company 기업*/}
            <Route exact path="/CompanyJoin" component={CompanyJoin}/>
            <Route exact path="/CompanyJoinInfo" component={CompanyJoinInfo}/>
            <Route exact path="/CompanyJoinAgree" component={CompanyJoinAgree}/>
            <Route exact path="/CompanyLogin" component={CompanyLogin}/>
            {/*broker 중개사*/}
            <Route exact path="/BrokerJoin" component={BrokerJoin}/>
            <Route exact path="/JoinSearchResult" component={JoinSearchResult}/>
            <Route exact path="/JoinBusinessNumber" component={JoinBusinessNumber}/>
            <Route exact path="/BrokerJoinAgree" component={BrokerJoinAgree}/>
            <Route exact path="/BrokerRegistration" component={BrokerRegistration}/>
            <Route exact path="/BrokerLogin" component={BrokerLogin}/>
            {/*분양대행사*/}
            <Route exact path="/AgencyJoin" component={AgencyJoin}/>
            <Route exact path="/AgencyJoinInfo" component={AgencyJoinInfo}/>
            <Route exact path="/AgencyJoinAgree" component={AgencyJoinAgree}/>
            <Route exact path="/AgencyLogin" component={AgencyLogin}/>
            {/*팀원 로그인,가입관련*/}
            <Route exact path="/TeamLogin/:authinfo" component={TeamLogin}/>
            <Route exact path="/TeamJoin/:authinfo" component={TeamJoin}/>
            <Route exact path="/TeamInvitefinal/:memid" component={TeamInvitefinal}/>

            {/*비번찾기*/}
            <Route exact path="/StandardPasswordfind" component={StandardPasswordfind}/>
            <Route exact path="/MemberPasswordfind" component={MemberPasswordfind}/>

            {/*mypage*/}
            <Route exact path="/Mypage" component={Mypage}/>{/*마이페이지 기본*/}
            <Route exact path="/MyProfileSetting" component={MyProfileSetting}/>{/*내 계정설정*/}
            <Route exact path="/EmailChange" component={EmailChange}/>{/*계정설정 > 이메일변경*/}
            <Route exact path="/PhoneChange" component={PhoneChange}/>{/*계정설정 > 휴대전화변경*/}
            <Route exact path="/PasswordChange" component={PasswordChange}/>{/*계정설정 > 비밀번호변경*/}
            <Route exact path="/Reservation" component={Reservation}/>{/*내 물건투어예약*/}

            <Route exact path="/Team" component={Team}/>{/*소속선택*/}
            <Route exact path="/BunyangTeam" component={BunyangTeam}/>{/*소속선택*/}
            <Route exact path="/CompanyProfile" component={CompanyProfile}/>{/*회사 프로필설정*/}

            <Route exact path="/Request" component={Request}/>{/*내 중개의뢰 */}
            <Route exact path="/AddRequest" component={AddRequest}/>{/*중개의뢰 추가*/}
            <Route exact path="/AddRequestSecond" component={AddRequestSecond}/>{/*중개의뢰>기본정보입력*/}
            <Route exact path="/AddRequestBroker" component={AddRequestBroker}/>{/*중개의뢰 중개사 선택*/}
            <Route exact path="/AddRequestBrokerSecond" component={AddRequestBrokerSecond}/>{/*중개의뢰 중개사 기본정보입력*/}
            <Route exact path="/EditRequest/:id" component={EditRequest}/>{/*중개의뢰>수정*/}
            <Route exact path="/DetailViewRequest/:id" component={DetailViewRequest}/>{/*중개의뢰>상세보기*/}
            <Route exact path="/RequestExtend/:id" component={RequestExtend}/>{/*중개의뢰>기한연장*/}

            <Route exact path="/MyLike" component={MyLike}/>{/*내 관심*/}
            <Route exact path="/MyMember" component={MyMember}/>{/*팀원관리*/}
            <Route exact path="/MyMemberAdd" component={MyMemberAdd}/>{/*팀원관리 > 팀원추가*/}
            <Route exact path="/MyMemberEdit/:id" component={MyMemberEdit}/>{/*팀원관리 > 팀원수정*/}
            <Route exact path="/MyLive" component={MyLive}/>{/*내 라이브 시청예약*/}
            <Route exact path="/MyAlarm" component={MyAlarm}/>{/*내 알림*/}
            <Route exact path="/MyAlarmSetting" component={MyAlarmSetting}/>{/*내 알림 설정*/}
            <Route exact path="/MyAlramDetail/:id" component={MyAlramDetail}/>{/*내 알림 상세*/}
            <Route exact path="/PropertyManagement" component={PropertyManagement}/>{/*물건관리*/}
            <Route exact path="/BrokerReservation" component={BrokerReservation}/>{/*내 방문예약 */}
            <Route exact path="/MyLiveSetting" component={MyLiveSetting}/>{/*Live 시청 예약 세팅*/}
            <Route exact path="/MyLiveManage" component={MyLiveManage}/>{/*Live 시청예약접수관리*/}
            <Route exact path="/MyVisitSetting" component={MyVisitSetting}/>{/*방문 예약 세팅*/}
            <Route exact path="/MyLiveManageInvite" component={MyLiveManageInvite}/>{/*live 시청예약관리 > 초대 */}
            <Route exact path="/MyVisitManage" component={MyVisitManage}/>{/*방문예약관리 */}
            <Route exact path="/AddProperty" component={AddProperty}/>{/*내 물건관리 > 물건(외부수임)등록*/}
            <Route exact path="/AddPropertyBasicInfo" component={AddPropertyBasicInfo}/>{/*내 물건관리>물건(외부수임)등록> 의뢰인정보입력*/}
            <Route exact path="/AddPropertySecond" component={AddPropertySecond}/>{/*내 물건관리 > 물건(외부수임)등록 > 기본정보입력*/}
            {/* <Route exact path="/AddPropertyThird" component={AddPropertyThird}/>내 물건관리 > 물건(외부수임)등록 > 추가정보입력 */}
        <Route exact path="/AddPropertyThird/:id" component={(route) => { return (<AddPropertyThird prd_id={route.match.params.id} />) }}/>{/*내 물건관리 > 물건(외부수임)등록 > 추가정보입력*/}
            <Route exact path="/ConditionChange/:id" component={ConditionChange}/>{/*내 물건관리 > 상태변경내역*/}
            <Route exact path="/RequestReview/:id" component={RequestReview}/>{/*내 물건관리 > 의뢰접수검토*/}
            <Route exact path="/RequestReviewEdit/:id" component={RequestReviewEdit}/>{/*내 물건관리 > 물건 수정(기본정보)*/}
            {/* <Route exact path="/RequestReviewEditSecond" component={RequestReviewEditSecond}/>내 물건관리 > 물건 수정(추가정보) */}
        <Route exact path="/RequestReviewEditSecond/:id" component={(route) => { return (<RequestReviewEditSecond prd_id={route.match.params.id} />)}}/>{/*내 물건관리 > 물건 수정(추가정보)*/}
            <Route exact path="/PropertyTourSetting/:id" component={PropertyTourSetting}/>{/*내 물건관리 > 물건투어예약셋팅*/}
            <Route exact path="/PropertyTourManage" component={PropertyTourManage}/>{/*물건투어예약접수관리*/}
            <Route exact path="/RegistProBroker" component={RegistProBroker}/>{/*전문중개사 신청*/}
            <Route exact path="/RegistProBrokerSecond" component={RegistProBrokerSecond}/>{/*전문중개사 신청>사업자등록증 등 사진첨부페이지*/}
            <Route exact path="/RegistProBrokerThird" component={RegistProBrokerThird}/>{/*전문중개사 신청>신청서 확인 페이지*/}

            {/* mobile */}
            <Route exact path="/MbSearch" component={MbSearch}/>{/*모바일 분양써치*/}
            <Route exact path="/MbBunyang" component={MbBunyang}/>{/*모바일 분양리스트*/}
            <Route exact path="/MbBunyangDetail/:id" component={(route) => { return(<MbBunyangDetail status={route.match.params.id}/>)} }/>{/*모바일 분양상세페이지*/}

            {/*map*/}
            <Route exact path="/Map/:text" component={(route) => { return(<Map status={route.match.params.text}/>)}}/>
            <Route exact path="/TestMap" component={TestMap}/>
            {/*app*/}
            <Route exact path="/Preview/:id" component={Preview}/>{/* notificiaton& 문자로 전송되는 미리보기 페이지*/}
            <Route exact path="/PreviewComplete/:id" component={PreviewComplete}/>

        </Router>   
    );
}
