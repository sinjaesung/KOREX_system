//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import serverController from '../../server/serverController';

import styled from "styled-components"

//component
import MainHeader from '../../component/common/MainHeader';
import SubTitle from '../../component/common/SubTitle';

import FindInputMember from '../../component/member/FindInputMember';

import MainFooter from '../../component/common/MainFooter';
import TermService from '../../component/common/TermsOfService';
import TermPrivacy from '../../component/common/TermsOfPrivacy';
import TermLocation from '../../component/common/TermsOfLocation';
//import ImgDetail from "../../../component/common/house/ImgDetail";
//import LiveModal from "../../../component/common/house/LiveModal";

import ChannelServiceElement from '../../component/common/ChannelServiceElement';

import CommonFooter from '../../component/common/commonFooter';

import Bunyang from '../../component/common/bunyang/Bunyang';

export default function JoinAgree() {
  ChannelServiceElement.shutdown();

  console.log('page>member>comapnyJoinagreejs 실행======================');
  const history = useHistory();


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

  //휴대폰번호 그리고 인증번호 검사 진행후 해당 휴대폰 회원내역검사.
  const [cernum, setcernum] = useState(false);//이메일인증을 하고 인증통과시 해당 이메일에 대한 회원 개인회원중에 존재하는지 여부 판단.존재한다면 그 내역(유니크)한개 내역에 대해 암호를 임시지정된값으로 바꿔주고 그 암호값을 알려줌.(이메일로 보내줘서 알려줌)
  const [email, setemail] = useState("");/*기본값*/
 
  //이메일유효성검사,인증메일번호값 유효성검사등관련 state
  const [emailvalid,setEmailvalid] = useState(false);

  useEffect(()=>{
    console.log('email,cercnums등 변경시에::',email,cernum);

    let emailregx = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if(emailregx.test(email)){
      setEmailvalid(true);//이메일 유효적이게 입력한경우>>
    }else{
      setEmailvalid(false);
    }
  },[email,cernum]);
  //find submit_function(기업 최종가입) 회원가입 요청 post요청 가한다.
  const find_submit_function = async (e) => {
    console.log('find_submit_function submit발생');

    let body_info = {
      email: email,
      cernum_number: cernum
    };
    var cernumchk_validate_result = await serverController.connectFetchController('/api/cernum_validate_process_email', 'POST', JSON.stringify(body_info));

    if (cernumchk_validate_result) {
      console.log('cernumchk_validate_resultss::', cernumchk_validate_result);

      if (cernumchk_validate_result.success) {
        //성공인 경우
        //setCernumerror(false);
        //phoneModal();
        //성공인 경우 성공한 이메일값을 바탕으로 해당 회원 개인회원내역중 존재여부 판단 1.존재하면 그 회원의 내역을 유저에게 알려주면서,임의 지정랜덤 암호값을 유저에게 이메일로 보내서 알려준다.
        let email_info = {
          email: email,
        }
        let memberuser_newpasswordEmail = await serverController.connectFetchController('/api/auth/memberuser_newpasswordEmail', 'POST', JSON.stringify(email_info));
        if (memberuser_newpasswordEmail) {
          if (memberuser_newpasswordEmail.success) {
            let member_info = memberuser_newpasswordEmail.result;
            alert('회원정보\n' + member_info['user_name'] + ',' + member_info['phone'] + ',' + member_info['email'] + '\n 회원내역 확인되며, 임시 비밀번호 전달주신 이메일로 전송드렸습니다.');
          } else {
            alert(memberuser_newpasswordEmail.message);
          }
        }
      } else {
        //실패인 경우
        alert(cernumchk_validate_result.message);//서버오류가 있거나,인증번호이맃하지않거나,유효기간 지난것인경우에.
        //setCernumerror(true);
        return false;
      }
    }

  }
  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} />
        <MainHeader openBunyang={openBunyang} />
        <SubTitle title={"비밀번호찾기"}/>
        <FindInputMember
          email={email}
          setemail={setemail} next_step={find_submit_function}
          cernum={cernum} setcernum={setcernum} emailvalid={emailvalid}
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