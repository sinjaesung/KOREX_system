//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import styled from "styled-components"

//component

import SubTitle from '../../component/common/SubTitle';
import FaqListBody from '../../component/faq/FaqListBody';
import FaqSearch from '../../component/faq/FaqSearch';


import CommonHeader from '../../component/common/commonHeader';
import CommonFooter from '../../component/common/commonFooter';

export default function Faq() {

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader/>
        <SubTitle/>
        <FaqListBody />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}