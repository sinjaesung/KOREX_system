//react
import React ,{useState, useEffect,useRef} from 'react';
import {Link,useHistory} from "react-router-dom";

//css
import styled from "styled-components"

//theme
import { TtBody_Map_Pos } from '../../theme';

//component
import MapHeader from '../../component/map/MapHeader';
import MainMap from '../../component/map/MainMap';
import ReportModal from '../../component/map/sidebar/modal/ReportModal';
import ModalMap from '../../component/map/sidebar/modal/ModalMap';
import ModalEdit from '../../component/map/sidebar/modal/ModalEdit';
import FilterCloseAndReset from '../../component/map/map/FilterCloseAndReset';
import MainFooter from '../../component/common/MainFooter';
import TermService from '../../component/common/TermsOfService';
import TermPrivacy from '../../component/common/TermsOfPrivacy';
import TermLocation from '../../component/common/TermsOfLocation';
import Bunyang from '../../component/common/bunyang/Bunyang';
import ImgDetail from "../../component/common/bunyang/ImgDetail";
import LiveModal from "../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../component/common/bunyang/ModalCalendar";
import ModalCommon from '../../component/common/modal/ModalCommon';

import ChannelServiceElement from '../../component/common/ChannelServiceElement';

//server process
import serverController from '../../server/serverController';
import {useSelector} from 'react-redux';

// redex
import { MapRight, MapProductEls , mapHeader,Login_userActions,BunyangTeam } from '../../store/actionCreators';
//import { Container } from '@material-ui/core';

export default function NoticeDetail({status}) {
  console.log('==>>page>map.js요소 갱신 랜더링처리:',status);
  
  ChannelServiceElement.shutdown();

  mapHeader.updateprdtype({prdtypes: status});//명시적으로 한번 더 맵해더 prdtypes지정한다. 

  var globe_aws_url='https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username,setUsername] = useState('');
  const [userprofile,setUserprofile]= useState('');
  const [editCheck,setEditChk] = useState(1);//기본값 1(EDIT버튼)
  const mapheader_search_element=useRef();

  const history=useHistory();
  
  const login_user = useSelector(data => data.login_user);console.log('login_user status mypagess:',login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);
  
  useEffect(async()=> {
    console.log('mypage도달>>> 로그인세션여부검사 및 관련 조회::');
    let res=await serverController.connectFetchController('/api/auth/islogin','get');
    //마이페이지 도달시에도 정보 저장 마이펭지 표면 노출되는 유저이름,프로필url등 state바로저장. 
    if(res){
      if(res.login_session == null){
        //alert('비로그인 상태입니다.'); 유효하지않은 정보인경우or비로그인
        Login_userActions.isloginchange({islogins : 0});
        //history.push(`/MemberLogin`);
        //비로그인상태라면 로그인페이지 이동처리!
      return;
    }else{
      var get_memid=res.login_session.user_id;//mem_id 얻기
      let body_info = {
        mem_id : get_memid
      };
      console.log(JSON.stringify(body_info));
      let user_info= await serverController.connectFetchController('/api/auth/userinfo_request','POST',JSON.stringify(body_info));
      console.log('userinfo_request >>> res_result:',user_info,user_info.user_data);
      
      if(user_info.success){
        //회원정보 조회가 성공한경우에만!

        setUsername(user_info.user_name);
        setUserprofile(user_info.mem_img);

        if(user_info.user_data.user_type!='개인'){
          //개인은 userType바뀔일이없다.
          if(user_info.user_data.user_type=='' || !user_info.user_data.user_type || user_info.user_data.company_id=='' || !user_info.user_data.company_id){
            //하나라도 비어있던경우에 선택된 소속이랑 user_type정보가 없던 경우 유효치 않은 값이 하나라도 있는경우라면 마이페이지 보여주지 않는다!
            //history.push('/Team');
            return;
          }
        }
        
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
        Login_userActions.isloginchange({islogins: 1 });
        Login_userActions.companynamechange({company_name : user_info.user_data.company_name});
        Login_userActions.isprochange({ispros : user_info.user_data.ispro});
        Login_userActions.memprofilechange({memprofile : globe_aws_url!=''?(globe_aws_url+user_info.user_data.mem_img):('https://korexdata.s3.ap-northeast-2.amazonaws.com/'+user_info.user_data.mem_img)});
      }               
    } 
  }
  console.log(BunyangTeam.bunyangTeam)
  if(login_user.user_type == '분양대행사' &&  (!BunyangTeam.bunyangTeam   && !bunyangTeam.bunyangTeam.bp_id)){
    serverController.connectFetchController(`/api/bunyang/team?no=${login_user.memid}`,'GET',null,function(res){
      if(res.success == 1){
        BunyangTeam.updateBunyangTeam({bunyangTeam:res.data[0]});
      }
    });
  }
 
},[]);

  //이용약관
  const [termservice, setTermService] = useState(false);
  const openTermService = (onOff) =>{ setTermService(onOff);}

  //개인정보처리방침
  const [termprivacy, setTermPrivacy] = useState(false);
  const openTermPrivacy = (onOff) =>{ setTermPrivacy(onOff);}

  //위치기반서비스 이용약관
  const [termlocation, setTermLocation] = useState(false);
  const openTermLocation = (onOff) =>{ setTermLocation(onOff);}

  const [bunyangDetail , setBunyangDetail] = useState({});
  const [imgArr, setImgArr] = useState([]);
  //분양 모달
  const [bunyang, setBunyang] = useState(false);
  const openBunyang = (onOff) =>{ setBunyang(onOff);}
  //라이브 시청 모달
  const [live, setLive] = useState(false);
  //분양 상세이미지 모달
  const [detailimg, setDetailImg] = useState(false);
  const [cal, setCal] = useState(false);
  
  //신고모달
  const [report,setReport] = useState([false,0,0]);
  //단지위치 모달
  const [map,setMap] = useState(false);
  const [dangimap_data,setDangimap_data] = useState({});

  const [modalOption,setModalOption] = useState({show : false,setShow:null,link:"",title:"",submit:{},cancle:{},confirm:{},confirmgreen:{},confirmgreennone:{},content:{}});
  
  
  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = ()=>{
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }
  
  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const reserveModal = () =>{
    //여기가 모달 키는 거에엽
    setModalOption({
        show:true,
        setShow:offModal,
        title:"물건투어 예약",
        content:{type:"components",text:``,component:<ModalEdit/>},
        submit:{show:false , title:"적용" , event : ()=>{offModal(); }},
        cancle:{show:false , title:"초기화" , event : ()=>{offModal(); }},
        confirm:{show:true , title:"확인" , event : ()=>{offModal(); }}
    });
  }

  return (
    <>
      <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
      <LiveModal bunyangDetail={bunyangDetail} live={live} setLive={setLive}/>
      <ModalCalendar bunyangDetail={bunyangDetail} cal={cal} setCal={setCal}/>
      <Bunyang bunyangDetail={bunyangDetail} setBunyangDetail={setBunyangDetail} bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} setImgArr={setImgArr} imgArr={imgArr}/>
      <MapHeader openBunyang={openBunyang} mapheader_search_element={mapheader_search_element}/>
      <Container>
          <ModalMap dangimap_data={dangimap_data} map={map} setMap={setMap}/>
          <ReportModal report={report} setReport={setReport}/>
          <MainMap setReport={setReport} setDangimap_data={setDangimap_data} setMap={setMap} status={status}  reserveModal={reserveModal} mapheader_search_element={mapheader_search_element}/>
          <ModalCommon modalOption={modalOption}/>
      </Container>
    </>
  );
}


const Container = styled.div`
  ${TtBody_Map_Pos}
  position: relative;
`


