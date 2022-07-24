//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import styled from "styled-components"

//component
import SubTitle from '../../component/common/SubTitle';
import NoticeListBody from '../../component/notice/NoticeListBody';


import CommonHeader from '../../component/common/commonHeader';
import CommonFooter from '../../component/common/commonFooter';

//server request
import serverController from '../../server/serverController';

export default function Notice() {

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
        <SubTitle/>
        <NoticeListBody />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}