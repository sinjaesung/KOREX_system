//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import serverController from '../../../server/serverController';
import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import JoinTab from '../../../component/member/join/member/JoinTab';
import JoinCheck from '../../../component/member/join/member/JoinCheck';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";

import { useSelector } from 'react-redux';
import { tempRegisterUserdataActions } from '../../../store/actionCreators';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

export default function JoinAgree({ socialidentiy }) {
  const history = useHistory();
  console.log('page > member > memjoinagreeSocial 실행=============================', socialidentiy);

  ChannelServiceElement.shutdown();

  const tempregisteruserdata = useSelector(data => data.temp_register_userdata);

  console.log('data.temp_register_userdata refer info:', tempregisteruserdata, tempRegisterUserdataActions);

  // //이용약관
  // const [termservice, setTermService] = useState(false);
  // const openTermService = (onOff) =>{ setTermService(onOff);}

  // //개인정보처리방침
  // const [termprivacy, setTermPrivacy] = useState(false);
  // const openTermPrivacy = (onOff) =>{ setTermPrivacy(onOff);}

  // //위치기반서비스 이용약관
  // const [termlocation, setTermLocation] = useState(false);
  // const openTermLocation = (onOff) =>{ setTermLocation(onOff);}

  // //분양 모달
  // const [bunyang, setBunyang] = useState(false);
  // const openBunyang = (onOff) =>{ setBunyang(onOff);}
  // //라이브 시청 모달
  // const [live, setLive] = useState(false);
  // //분양 상세이미지 모달
  // const [detailimg, setDetailImg] = useState(false);
  // const [cal, setCal] = useState(false);

  const [active, setActive] = useState(false);//가입버튼 활성화/비활성화여부 변수
  //동의상태 문자열 조정
  const [agreeStatus, setAgreeStatus] = useState("");//agree_essential1,2,3,4, agree_optional 선택상태 여부. 필수1~4 모두 포함하고있어야통과
  const [agreePossible, setAgreePossible] = useState(false);//기본값 false ->true여부

  //console.log(pwd);
  // console.log(pwdConfirm);

  //암호는 잘 썼고, 일치하는지, 그리고 동의항목(필수) 모두 체크했는지 여부에 따른 true,false검사
  const checkVaildate = () => {
    return agreePossible == true
  }

  //상태변화 감지(동의페이지)
  useEffect(() => {
    console.log('memjoinAgree>USEEFFECT>>=====관련 컴포넌트들의 프로퍼티 state값들 pwd,pwdconfirm,active,agreeStstus,agreeposibble등 상태값변화감지:');
    //암호값,암호확인,동의상태,동의가능여부,등의 값들도 추가적으로 저장한다. useEffect발생시마다.
    console.log(agreeStatus, agreePossible, active);
    if (checkVaildate())
      setActive(true);
    else
      setActive(false);

    tempRegisterUserdataActions.usertypechange({ usertypes: '개인' });
    tempRegisterUserdataActions.agreestatuschange({ agreeStatuss: agreeStatus });
  })

  //member_submit_funciton(최종가입) 회원가입 요청 post요청을 가한다.
  const member_submit_functionSocial = async (e) => {
    console.log('member_submit_function 개인 memberjoinAgree페이지에서 만들어진것을 하위로 보냄,개인 회원가입submit발생');

    console.log('submit버튼 누른 시점 당시의 모든 프로퍼티값들 pwd,pwdconfirm,active,agreestatus,agreepossible, user_name, phone, 등의 값조회');
    console.log('data.temp_register_userdata refer info:', tempregisteruserdata, tempRegisterUserdataActions);

    if (active == true) {
      let body_info = {
        agree_status: tempregisteruserdata.agree_status,
        user_username: socialidentiy,
        usertype: tempregisteruserdata.usertype
      };
      console.log('JSON.STRINGFY(BODY_INFO):', JSON.stringify(body_info));
      let res = await serverController.connectFetchController(`/api/auth/member/registerSocial`, "POST", JSON.stringify(body_info));
      console.log('res result:', res);

      //this.props.history.push({}); 로그인 페이지로 이동.
      if (res.success) {
        alert(res.message);

        history.push('/');
      } else {
        alert(res.message);
      }
    }
  }
  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
        <SubTitle title={"회원가입"} />
        <JoinTab />
        <JoinCheck
          active={active}
          setActive={setActive}
          agreeStatus={agreeStatus}
          setAgreeStatus={setAgreeStatus}
          agreePossible={agreePossible}
          setAgreePossible={setAgreePossible}
          member_submit_function={member_submit_functionSocial}
        />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}

