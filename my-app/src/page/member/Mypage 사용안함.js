//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../component/common/MainHeader';
import SubTitle from '../../component/common/SubTitle';
import MyProfile from '../../component/member/mypage/MyProfile';
import MainFooter from '../../component/common/MainFooter';
import TermService from '../../component/common/TermsOfService';
import TermPrivacy from '../../component/common/TermsOfPrivacy';
import TermLocation from '../../component/common/TermsOfLocation';

import CommonHeader from '../../component/common/commonHeader';
import CommonFooter from '../../component/common/commonFooter';

//redux
import { useSelector } from 'react-redux';

export default function Join() {
  // //이용약관
  // const [termservice, setTermService] = useState(false);
  // const openTermService = (onOff) =>{ setTermService(onOff);}

  // //개인정보처리방침
  // const [termprivacy, setTermPrivacy] = useState(false);
  // const openTermPrivacy = (onOff) =>{ setTermPrivacy(onOff);}

  // //위치기반서비스 이용약관
  // const [termlocation, setTermLocation] = useState(false);
  // const openTermLocation = (onOff) =>{ setTermLocation(onOff);}
  const history = useHistory();
  const login_user = useSelector(data => data.login_user);
  console.log('mypage도달 login_user 정보상태::', login_user);
  if (login_user['is_login'] == '' || !login_user['is_login']) {
    history.push(`/MemberLogin`);
  } else {
    return (
      <div className="flex-col-spabetween minHgt-100vh">
        <div>
          <MainHeader />
          <SubTitle title={"마이페이지"} />
          <MyProfile />
        </div>
        <CommonFooter />
        {/* <TermService termservice={termservice} openTermService={openTermService}/>
        <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
        <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
        <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
      </div>
    );
  }

}