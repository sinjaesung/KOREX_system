//react
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";

//component
import MainHeader from '../component/common/MainHeader';
import MainBody from '../component/main/MainBody';
import MainFooter from '../component/common/MainFooter';
import TermService from '../component/common/TermsOfService';
import TermPrivacy from '../component/common/TermsOfPrivacy';
import TermLocation from '../component/common/TermsOfLocation';
import Bunyang from '../component/common/bunyang/Bunyang';
import ImgDetail from "../component/common/bunyang/ImgDetail";
import LiveModal from "../component/common/bunyang/LiveModal";
import ModalCalendar from "../component/common/bunyang/ModalCalendar";

//채널상담 서비스관련 콤퍼넌트
import ChannelServiceElement from '../component/common/ChannelServiceElement';

//css
import styled from "styled-components"

import { Mobile, PC, SM_smaller, SM_larger } from "../MediaQuery"

//added redux actions go
import { useSelector } from 'react-redux';
import { MyActions, UserActions, tempRegisterUserdataActions } from '../store/actionCreators';

import CommonHeader from '../component/common/commonHeader';
import CommonFooter from '../component/common/commonFooter';

import ServerController from '../server/serverController';

export default function MainPage({ }) {
  console.log('mainpage Testsss: channserViceElement::', ChannelServiceElement, ChannelServiceElement.boot);
  /*ChannelServiceElement.boot({
    "pluginKey" : "030ef078-7b0d-4045-bdcb-fe6e799257b7",
    //"customLauncherSelector" : ".chat_button",
   // "hideChannelButtonOnBoot" : true
  });*/
  ChannelServiceElement.shutdown();

  const history = useHistory();
  const [bannerData, setBannerData] = useState([{}]);

  useEffect(() => {
    ServerController.connectFetchController(`api/banner`, "GET", null, function (res) {
      console.log('banner data getsssssa::', res);
      setBannerData(res.data);
    }, function (err) { console.log(err); });
  }, [])


  //console.log('메인페이지도달 현재 기기환경상태', window.innerWidth);
  if (window.innerWidth < 1024) {
    //모바일기기환경이라면 페이지이동
    //history.push('/MbSearch');
  }

  return (
    <>
      {/* <PC> */}
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
        <LiveModal live={live} setLive={setLive}/>
        <ModalCalendar cal={cal} setCal={setCal}/>
        <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
        <MainHeader openBunyang={openBunyang}/> */}
        <div className="flex-col-spabetween minHgt-100vh">
          <div>
            <CommonHeader />
            <MainBody bannerData={bannerData} />
          </div>
          <CommonFooter />
        </div>
        {/* <TermService termservice={termservice} openTermService={openTermService}/>
        <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
        <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
        <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
      {/* </PC>
      <Mobile>
        <div className="flex-col-spabetween minHgt-100vh">
          <div>
            <CommonHeader />
            <MainBody bannerData={bannerData} />
          </div>
          <CommonFooter />
        </div> */}
        {/* <TermService termservice={termservice} openTermService={openTermService}/>
        <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
        <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
        <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
      {/* </Mobile> */}
    </>
  );
}


// 분기 정리하기