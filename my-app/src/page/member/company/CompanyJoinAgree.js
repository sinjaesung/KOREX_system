//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import serverController from '../../../server/serverController';

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import JoinTab from '../../../component/member/join/company/JoinTab';
import JoinPwd from '../../../component/member/join/company/JoinPwd';
import JoinCheck from '../../../component/member/join/company/JoinCheck';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
//import ImgDetail from "../../../component/common/house/ImgDetail";
//import LiveModal from "../../../component/common/house/LiveModal";

import { agreestatuschange } from '../../../store/modules/temp_register_userdata';
import { tempRegisterUserdataActions } from '../../../store/actionCreators';

import { useSelector } from 'react-redux';
import { tempRegisterdataActions } from '../../../store/actionCreators';
//import ModalCalendar from "../../../component/common/house/ModalCalendar";

import CommonFooter from '../../../component/common/commonFooter';

import Bunyang from '../../../component/common/bunyang/Bunyang';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

export default function JoinAgree() {
  console.log('page>member>comapnyJoinagreejs 실행======================');

  ChannelServiceElement.shutdown();

  const history = useHistory();
  const tempregisteruserdata = useSelector(data => data.temp_register_userdata);

  console.log('data.temp_register_userdata refer info:', tempregisteruserdata, tempRegisterUserdataActions);

  //이용약관
  const [termservice, setTermService] = useState(false);
  const openTermService = (onOff) => { setTermService(onOff); }

  //개인정보처리방침
  const [termprivacy, setTermPrivacy] = useState(false);
  const openTermPrivacy = (onOff) => { setTermPrivacy(onOff); }

  //위치기반서비스 이용약관
  const [termlocation, setTermLocation] = useState(false);
  const openTermLocation = (onOff) => { setTermLocation(onOff); }

  //분양 모달
  const [bunyang, setBunyang] = useState(false);
  const openBunyang = (onOff) => { setBunyang(onOff); }
  //라이브 시청 모달
  const [live, setLive] = useState(false);
  //분양 상세이미지 모달
  const [detailimg, setDetailImg] = useState(false);
  const [cal, setCal] = useState(false);

  /*비밀번호 규정 show, hide*/
  const [pwdShow, setPwdShow] = useState(false);
  /*비밀번호 validate*/
  const [pwd, setPwd] = useState("");/*기본값*/
  const [pwdConfirm, setPwdConfirm] = useState("");/*기본값*/
  const [active, setActive] = useState(false);

  //동의 상태 문자열 조정
  const [agreestatus, setAgreeStatus] = useState('');//agree_esstiaonl1,2,3,4,agree_optional 여부 필수1~4 모두 포함하고 있어야 통과
  const [agreePossible, setAgreePossible] = useState(false);//기본값 false 

  const checkVaildate = () => {
    let regx= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,12}/;
    console.log('regx 암호검사::',pwd,regx.test(pwd));
     if(regx.test(pwd)){

     }
    return pwd.length > 7
      && pwdConfirm.length > 7
      && pwd == pwdConfirm && (agreePossible == true) && regx.test(pwd)
  }

  useEffect(() => {
    console.log('companymemJoinagree>> 상태변화감지:', pwd, pwdConfirm, agreestatus, agreePossible, active);

    if (checkVaildate())
      setActive(true);
    else
      setActive(false);

    tempRegisterUserdataActions.usertypechange({ usertypes: '기업' });
    tempRegisterUserdataActions.passwordchange({ passwords: pwd });
    tempRegisterUserdataActions.agreestatuschange({ agreeStatuss: agreestatus });
  })

  //member_submit_function(기업 최종가입) 회원가입 요청 post요청 가한다.
  const member_submit_function = async (e) => {
    console.log('member submit function개인 companyjoinagree에서 만들어진것을 하위로 보냄, 기업 회원가입submit발생');

    console.log('submit버튼 누른 시점 당시의 모든 프로퍼티값들 pwd,pwddconfir,active,agreestatus,agreepoissible,username,phone,사업자번호등 값 조회');
    console.log('data.temp_register_userdata refer info:', tempregisteruserdata, tempRegisterUserdataActions);

    
    if (active == true) {
      let body_info = {
        email: '',
        agree_status: tempregisteruserdata.agree_status,
        name: tempregisteruserdata.name,
        password: tempregisteruserdata.password,
        phone: tempregisteruserdata.phone,
        usertype: tempregisteruserdata.usertype,
        businessnumber: tempregisteruserdata.businessnumber,
        businessname: tempregisteruserdata.businessname
      };
      console.log('JSON>STRINGIFY(BODY_INFO):', JSON.stringify(body_info));
      let res = await serverController.connectFetchController("/api/auth/company/register", "POST", JSON.stringify(body_info));
      console.log('res_result:', res);
      alert(res);

      if (res) {
        //가입완료후 페이지 이동 등 액션
        history.push(`/`);
      } else {
        alert(res);
      }

    }
  }
  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} />
        <MainHeader openBunyang={openBunyang} />
        <SubTitle title={"회원가입"} />
        <JoinTab />
        <JoinPwd
          pwd={pwd}
          pwdShow={pwdShow}
          setPwdShow={setPwdShow}
          setPwd={setPwd}
          pwdConfirm={pwdConfirm}
          setPwdConfirm={setPwdConfirm}
        />
        <JoinCheck
          active={active}
          setActive={setActive}
          agreeStatus={agreestatus}
          setAgreeStatus={setAgreeStatus}
          agreePossible={agreePossible}
          setAgreePossible={setAgreePossible}
          member_submit_function={member_submit_function}
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