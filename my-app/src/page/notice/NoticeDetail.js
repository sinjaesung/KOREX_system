//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import styled from "styled-components"

//component

import SubTitle from '../../component/common/SubTitle';
import NoticeView from '../../component/notice/NoticeViewBody';


import CommonHeader from '../../component/common/commonHeader';
import CommonFooter from '../../component/common/commonFooter';

//server
import serverController from '../../server/serverController';

export default function NoticeDetail({ match }) {
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
  console.log('공지사항 상세페이지 도달 관련 id:', match, match.params);

  const [detailContent, setDetailContent] = useState({});
  useEffect(async () => {
    let body_info = {
      target_id: match.params.id,
      request_data: 'board'
    }
    let res = await serverController.connectFetchController(`/api/commondata/request_detail`, "POST", JSON.stringify(body_info), function () { }, function (test) { console.log(test) });
    console.log('board details results:', res);
    //alert(res);
    if (res) {
      if (res.success) {
        setDetailContent(res.result[0]);
      }
    }

  }, []);

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
        <SubTitle title={"공지사항"} />
        <NoticeView detailContent={detailContent} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}
