//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import serverController from '../../../server/serverController';
import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import JoinTab from '../../../component/member/join/member/JoinTab';
import JoinPwd from '../../../component/member/join/member/JoinPwd';
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

export default function JoinAgree({ useremail }) {
  const history = useHistory();
  console.log('page > member > memjoinagree 실행=============================', useremail);//useremail을 얻기위한 사실상의식별자. 유효시간 하루.

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

  /*비밀번호 규정 show, hide*/
  const [pwdShow, setPwdShow] = useState(false);
  /*비밀번호 validate*/
  const [pwd, setPwd] = useState("");/*기본값*/
  const [pwdConfirm, setPwdConfirm] = useState("");/*기본값*/
  const [active, setActive] = useState(false);//가입버튼 활성화/비활성화여부 변수
  //동의상태 문자열 조정
  const [agreeStatus, setAgreeStatus] = useState("");//agree_essential1,2,3,4, agree_optional 선택상태 여부. 필수1~4 모두 포함하고있어야통과
  const [agreePossible, setAgreePossible] = useState(false);//기본값 false ->true여부
  const [useremailval, setUseremailval] = useState('');

  //console.log(pwd);
  // console.log(pwdConfirm);

  //암호는 잘 썼고, 일치하는지, 그리고 동의항목(필수) 모두 체크했는지 여부에 따른 true,false검사
  const checkVaildate = () => {
    let regx= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,12}/;
    console.log('regx 암호검사::',pwd,regx.test(pwd));
     if(regx.test(pwd)){

     }
    return pwd.length > 7
      && pwdConfirm.length > 7
      && pwd == pwdConfirm && (agreePossible == true) && regx.test(pwd)
  }

  //페이지 강제 새로고침,다른페이지에서 넘어온경우에 모두 해당.
  useEffect(async () => {
    console.log('page load useEffect시점 실행::', useremail);
    if (useremail) {
      //var useremail_get = decodeURIComponent(useremail);//디코딩처리한 사용자 이메일값.
      //console.log('useremail_getsss:',useremail_get);

      let body_info = {
        identifier: useremail//식별자 유니크값에 대한 셀렉트쿼리.
      }
      //해당 식별자 값 에 대한 실제 이메일요청자(개인회원)의 값을 구한다.
      let ress = await serverController.connectFetchController('/api/auth/member/member_regi_emailIdentify', 'POST', JSON.stringify(body_info));
      if (ress) {
        if (ress.success) {
          console.log('ressss:', ress, ress.result);

          setUseremailval(ress.result);//얻어낸 이메일값으로 state지정.
        } else {
          alert(ress.message);//서버오류or인증문자열이상함or 인증문자열정상이나 유효기간이 지난 인증메일에 대한 참조및 요청.지난 하루지난 링크에대해서 들어와서 참조추적하여 요청하는 경우에 해당한다.
          setUseremailval(undefined);
        }
      }

    }
  }, []);
  //상태변화 감지(동의페이지)
  useEffect(() => {
    console.log('memjoinAgree>USEEFFECT>>=====관련 컴포넌트들의 프로퍼티 state값들 pwd,pwdconfirm,active,agreeStstus,agreeposibble등 상태값변화감지:');
    //암호값,암호확인,동의상태,동의가능여부,등의 값들도 추가적으로 저장한다. useEffect발생시마다.
    console.log(pwd, pwdConfirm, agreeStatus, agreePossible, active);
    if (checkVaildate())
      setActive(true);
    else
      setActive(false);

    tempRegisterUserdataActions.usertypechange({ usertypes: '개인' });
    tempRegisterUserdataActions.passwordchange({ passwords: pwd });
    tempRegisterUserdataActions.agreestatuschange({ agreeStatuss: agreeStatus });
  })

  //member_submit_funciton(최종가입) 회원가입 요청 post요청을 가한다.
  const member_submit_function = async (e) => {
    console.log('member_submit_function 개인 memberjoinAgree페이지에서 만들어진것을 하위로 보냄,개인 회원가입submit발생');

    console.log('submit버튼 누른 시점 당시의 모든 프로퍼티값들 pwd,pwdconfirm,active,agreestatus,agreepossible, user_name, phone, 등의 값조회');
    console.log('data.temp_register_userdata refer info:', tempregisteruserdata, tempRegisterUserdataActions);

    if (useremailval) {
      if (active == true) {
        let body_info = {
          email: useremailval,//얻어낸 이메일값에 대해서 가입요청.
          agree_status: tempregisteruserdata.agree_status,
          name: tempregisteruserdata.name,
          password: tempregisteruserdata.password,
          //phone: tempregisteruserdata.phone,
          usertype: tempregisteruserdata.usertype
        };
        console.log('JSON.STRINGFY(BODY_INFO):', JSON.stringify(body_info));
        let res = await serverController.connectFetchController(`/api/auth/member/register`, "POST", JSON.stringify(body_info));
        console.log('res result:', res);
        console.log('여기확인:', res);

        //this.props.history.push({}); 로그인 페이지로 이동.
        if (res.success) {
          alert(res.message);

          history.push('/');
        } else {
          alert(res.message);
        }
      }
    } else {
      alert('인증메일의 유효기간이 지났거나,인증식별자 문자열오류가 있습니다.');
      return false;
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
          setPwd={setPwd}
          pwdShow={pwdShow}
          setPwdShow={setPwdShow}
          pwdConfirm={pwdConfirm}
          setPwdConfirm={setPwdConfirm}
        />
        <JoinCheck
          active={active}
          setActive={setActive}
          agreeStatus={agreeStatus}
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