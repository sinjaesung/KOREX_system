//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import serverController from '../../../server/serverController';

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import JoinTab from '../../../component/member/join/broker/JoinTab';
import JoinTopTxt from '../../../component/member/join/broker/JoinTopTxt';
import JoinPwd from '../../../component/member/join/broker/JoinPwd';
import JoinCheck from '../../../component/member/join/broker/JoinCheck';
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

//redux addons
import { useSelector } from 'react-redux';
import { tempRegisterUserdataActions } from '../../../store/actionCreators';

export default function JoinAgree() {
  const history = useHistory();
  console.log('page>member?>brokerJoinagree.js실행 ===========================>>');

  const tempregisteruserdata = useSelector(data => data.temp_register_userdata);
  console.log('data.temp_register_userdata refer info:', tempregisteruserdata, tempRegisterUserdataActions);

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

  //동의 상태 문자여 ㄹ조정
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
    console.log('brokermemjosinagree>useEffect >> ===== 관련 컴포넌트들 state상태변화감지:', pwd, pwdConfirm, agreestatus, agreePossible, active);

    if (checkVaildate())
      setActive(true);
    else
      setActive(false);

    tempRegisterUserdataActions.usertypechange({ usertypes: '중개사' });
    tempRegisterUserdataActions.passwordchange({ passwords: pwd });
    tempRegisterUserdataActions.agreestatuschange({ agreeStatuss: agreestatus });
  })

  //broker_submit_function(중개사 최종회원가입) 회원가입 요청 post요청가한다. 가입요청을 하는 경우는 현재 로직으론 일단 사전에 등록을했고(코렉스 시스템을 이용해 제출하기:신규회원인경우or기 등록된 번호에 대해서 말고 취소하고 등록하거나)
  //제출을 통한 or 아나로그로 사전 등록되어있는 중개사업자정보가 있는경우에 한해서 코렉스 서버측에 가입요청 보낸다.
  const broker_submit_function = async (e) => {
    console.log('broker submit function중개사 brokderjoinagree에서 만들어진것을 하위로 보냄, 중개사 회원가입submit발생');

    console.log('submit누른 시점 당시 모든 프로퍼티값들', tempregisteruserdata, tempRegisterUserdataActions);

    if (active == true) {
      let body_info = {
        email: '',
        agree_status: tempregisteruserdata.agree_status,
        name: tempregisteruserdata.name,
        password: tempregisteruserdata.password,
        phone: tempregisteruserdata.phone,
        usertype: tempregisteruserdata.usertype,
        businessnumber: tempregisteruserdata.businessnumber,
        businessname: tempregisteruserdata.businessname,
        mngno: tempregisteruserdata.mngno,
        regno: tempregisteruserdata.regno,
        addrraw: tempregisteruserdata.addrraw,
        addrjibun: tempregisteruserdata.addrjibun,
        addrroad: tempregisteruserdata.addrroad,
        x: tempregisteruserdata.x,
        y: tempregisteruserdata.y
      };

      console.log('JSONSTRINGIFYB(BODY_INFO):', JSON.stringify(body_info));
      let res = await serverController.connectFetchController('/api/auth/broker/register', 'post', JSON.stringify(body_info));
      console.log('res_result:', res);
      //alert(res);

      if (res.success) {
        //가입완료후 페이지 이동 등 액션
        history.push('/');
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
        <JoinTopTxt />
        <JoinPwd
          pwd={pwd}
          setPwd={setPwd}
          pwdShow={pwdShow}
          setPwdShow={setPwdShow}
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
          broker_submit_function={broker_submit_function}
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