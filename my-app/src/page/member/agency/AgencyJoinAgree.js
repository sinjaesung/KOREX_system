//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import serverController from '../../../server/serverController';

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import JoinTab from '../../../component/member/join/agency/JoinTab';
import JoinPwd from '../../../component/member/join/agency/JoinPwd';
import JoinCheck from '../../../component/member/join/agency/JoinCheck';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//redux addons assets
import { useSelector } from 'react-redux';
import { tempRegisterdataActions, tempRegisterUserdataActions } from '../../../store/actionCreators';

export default function JoinAgree() {
  const history = useHistory();
  console.log('page>agecny>companyJoinagreejs 실행===========================');

  const tempregisteruserdata = useSelector(data => data.temp_register_userdata);

  console.log('dat.temp_register_userdata refer info:', tempregisteruserdata, tempRegisterUserdataActions);

  ChannelServiceElement.shutdown();
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

  /*비밀번호 규정 show, hide*/
  const [pwdShow, setPwdShow] = useState(false);
  /*비밀번호 validate*/
  const [pwd, setPwd] = useState("");/*기본값*/
  const [pwdConfirm, setPwdConfirm] = useState("");/*기본값*/
  const [active, setActive] = useState(false);

  //동의 상태 문자열 조정
  const [agreestatus, setAgreeStatus] = useState('');
  const [agreePossible, setAgreePossible] = useState(false);

  //console.log(pwd);
  // console.log(pwdConfirm);

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
    console.log('agencyJoinagree>useEffect>> ====== 관련 컴포넌들 프로퍼티값state값 상태변화감지:', pwd, pwdConfirm, agreestatus, agreePossible, active);
    if (checkVaildate())
      setActive(true);
    else
      setActive(false);

    //내부 암호 암호확인,동의상태등 상태값 변화 리덕스 저장
    tempRegisterUserdataActions.usertypechange({ usertypes: '분양대행사' });
    tempRegisterUserdataActions.passwordchange({ passwords: pwd });
    tempRegisterUserdataActions.agreestatuschange({ agreeStatuss: agreestatus });
  })

  const agency_submit_function = async (e) => {
    console.log('agency submit function 분양사 가입 회원가입 submit발생');

    console.log('submit버튼 누른시점 당시의 모든 프로퍼티값들 pwd,pwdconfir,.....', tempregisteruserdata, tempRegisterUserdataActions);

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

      console.log('JSON>STRINGFIY(BODY_INFO):', JSON.stringify(body_info));
      let res = await serverController.connectFetchController('/api/auth/agency/register', 'post', JSON.stringify(body_info));
      console.log('res_result:', res);
      //alert(res);

      if (res.success) {
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
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
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
          agreestatus={agreestatus}
          setAgreeStatus={setAgreeStatus}
          agreePossible={agreePossible}
          setAgreePossible={setAgreePossible}
          agency_submit_function={agency_submit_function}
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