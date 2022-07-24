//react
import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//component
import MainHeader from '../../component/common/MainHeader';
import SubTitle from '../../component/common/SubTitle';
import MobileMainBodyTop from '../../component/main/MobileMainBodyTop';
import MbSearchBody from '../../component/main/mobilecomp/MbSearchBody';
import MainFooter from '../../component/common/MainFooter';
import TermService from '../../component/common/TermsOfService';
import TermPrivacy from '../../component/common/TermsOfPrivacy';
import TermLocation from '../../component/common/TermsOfLocation';

import ChannelServiceElement from '../../component/common/ChannelServiceElement';

import CommonFooter from '../../component/common/commonFooter';

import { Mobile, PC } from "../../MediaQuery"

export default function MainPage() {
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
  const history = useHistory();
  if (window.innerWidth >= 1024) {
    //피시환경에서 접속한경우 페이지이동
    history.push('/');
  }
  return (
    <Mobile>
      <div className="flex-col-spabetween minHgt-100vh">
        <div>
          {/* <MainHeader /> */}
          <SubTitle title={"검색"} rank={false} />
          <MobileMainBodyTop />
          {/*<MbSearchBody/>*/}
        </div>
        {/* <CommonFooter /> */}
        {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
      </div >
    </Mobile>
  );
}