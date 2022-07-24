//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import serverController from '../../server/serverController';

import styled from "styled-components"

//component
import MainHeader from '../../component/common/MainHeader';
import SubTitle from '../../component/common/SubTitle';

import FindInput from '../../component/member/FindInput';

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
  const [cernum, setcernum] = useState(false);
  const [phone, setphone] = useState("");/*기본값*/
  const [usertype,setusertype] = useState('');

  //휴대폰 번호 관련 인증유효성등 관련
  const [phonevalid,setphonevalid] = useState(false);

  useEffect(()=>{
    console.log('phone,cernum:',cernum,phone,usertype);

    let phoneregx = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if(phoneregx.test(phone)){
      setphonevalid(true);
    }else{
      setphonevalid(false);
    }

  },[cernum,phone,usertype]);

  //find submit_function(기업 최종가입) 회원가입 요청 post요청 가한다.
  const find_submit_function = async (e) => {
    console.log('find_submit_function submit발생',phone,cernum,usertype);

    let body_info = {
      phone_number: phone,
      cernum_number: cernum
    };
    var cernumchk_validate_result = await serverController.connectFetchController('/api/cernum_validate_process', 'POST', JSON.stringify(body_info));

    if (cernumchk_validate_result) {
      console.log('cernumchk_validate_resultss::', cernumchk_validate_result);

      if (cernumchk_validate_result.success) {
        //성공인 경우
        //setCernumerror(false);
        //phoneModal();
        let phone_info = {
          phone: phone,
          user_type : usertype
        }//중개사,기업,분양사에서 사용되고있는 그 세개전체내역에서 해당번호로 내역 존재여부
        let standarduser_newpasswordphone = await serverController.connectFetchController('/api/auth/standarduser_newpasswordphone', 'POST', JSON.stringify(phone_info));
        if (standarduser_newpasswordphone) {
          if (standarduser_newpasswordphone.success) {
            //let member_info = standarduser_newpasswordphone;

            //alert('회원정보\n'+member_info['user_name']+','+member_info['phone']+','+member_info['email']+'\n 회원내역 확인되며, 임시 비밀번호 전달주신 휴대폰번호로 전송드렸습니다.');
            alert('해당 번호에 대한 회원내역 확인되었으며, 해당 번호로 임시비밀번호 발급되었습니다.');

          } else {
            alert(standarduser_newpasswordphone.message);
          }
        }
      }else{
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
        <FindInput
          phone={phone}
          setphone={setphone} next_step={find_submit_function}
          cernum={cernum} setcernum={setcernum} phonevalid={phonevalid} setusertype={setusertype} usertype={usertype}
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

