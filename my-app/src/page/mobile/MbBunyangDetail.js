//react
import React, { useState, useEffect } from 'react';

//css
import styled from "styled-components"

//component
import MainHeader from '../../component/common/MainHeader';
import SubTitle from '../../component/common/SubTitle';
import MbBunyangView from '../../component/common/bunyang/mobilecomp/MbBunyangView';
import LiveModal from '../../component/common/bunyang/LiveModal';
import ModalCalendar from "../../component/common/bunyang/ModalCalendar";
import ImgDetail from '../../component/common/bunyang/ImgDetail';
import MainFooter from '../../component/common/MainFooter';
import TermService from '../../component/common/TermsOfService';
import TermPrivacy from '../../component/common/TermsOfPrivacy';
import TermLocation from '../../component/common/TermsOfLocation';

import ChannelServiceElement from '../../component/common/ChannelServiceElement';

import CommonFooter from '../../component/common/commonFooter';
import serverController from '../../server/serverController';

import { Mobile, PC } from "../../MediaQuery";
import { useSelector } from 'react-redux';

export default function MbBunyangDetail({ status }) {

  ChannelServiceElement.shutdown();

  const loginUser = useSelector(state => { return state.login_user });

  const [bunyangDetail, setBunyangDetail] = useState({});

  useEffect(() => {
    serverController.connectFetchController(`/api/bunyang/detail?bp_id=${status}&mem_id=${loginUser.memid ? loginUser.memid : 0}`, 'GET', null, function (res) {

      if (res.success == 1) {
        setBunyangDetail(res.data[0]);
      }
    });
  }, [])


  //라이브 시청 모달
  const [live, setLive] = useState(false);
  //분양 상세이미지 모달
  const [detailimg, setDetailImg] = useState(false);
  const [cal, setCal] = useState(false);


  if (bunyangDetail && bunyangDetail.bp_id) { }
  else { return null; }

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        <MainHeader rank={true} />
        <SubTitle title={"분양 상세"} rank={false} />
        <LiveModal bunyangDetail={bunyangDetail} live={live} setLive={setLive} />
        <ModalCalendar bunyangDetail={bunyangDetail} cal={cal} setCal={setCal} />
        <ImgDetail bunyangDetail={bunyangDetail} detailimg={detailimg} setDetailImg={setDetailImg} />
        <MbBunyangView bunyangDetail={bunyangDetail} status={status} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} />
      </div>
      <CommonFooter />
    </div>
  );
}