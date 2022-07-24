//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import RequestExtend from '../../../component/member/mypage/request/RequestExtend';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import ModalCommon from '../../../component/common/modal/ModalCommon';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//server
import serverController from '../../../server/serverController';

export default function Edit({ match }) {
  //해당 페이지는 로그인권한을 요구하지 않습니다!..

  ChannelServiceElement.shutdown();

  console.log('개인기업회원:로그인여부상관없이 조회가능한 형태의 매물정보로하여 들어올수있는페이지:외부수임떄문에>>', match, match.params);
  var prd_identity_id = match.params.id;
  const history = useHistory();

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, confirmgreennone: {}, content: {} });

  const [maemulinfo, setmaemulinfo] = useState({});
  const [probrokerinfo, setprobrokerinfo] = useState({});
  const [nowprdstatus, setnowprdstatus] = useState('');

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const confirmModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "기한 연장",
      content: { type: "text", text: `정상적으로 기한이 연장되었습니다.`, component: "" },
      submit: { show: false, title: "적용", event: () => { offModal(); } },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", link: "/", event: () => { offModal(); } }
    });
  }

  useEffect(async () => {
    console.log('개인기업회원이 주로 중개의뢰한(외부수임자포함)한 내역에 대한 정보조회 및 전속기한연장관련 처리페이지ui단:', prd_identity_id);

    let body_info = {
      prd_identity_idval: prd_identity_id
    };
    let brokerRequest_product_info = await serverController.connectFetchController('/api/broker/brokerRequest_productview', 'POST', JSON.stringify(body_info));

    if (brokerRequest_product_info) {
      console.log('brokerReuqest_p[roducftinfo::', brokerRequest_product_info);
      if (brokerRequest_product_info.success) {
        if (brokerRequest_product_info.result_data) {
          let maemul_info = brokerRequest_product_info.result_data[0];
          let maemul_exclusive_end_date = maemul_info['exclusive_end_date'];//매물 종료마감일 전속마감일 값을 구하고, 그 마감일(기존 전속기간까지)보다 경과한경우에는 만료된 링크로써 기한연장불가능처리해줌.
          console.log('기한연장페이지 접속 접속시점이 기존 매물의 전속기한마감일보다 경과했는지여부 판단', new Date(), new Date(maemul_exclusive_end_date));
          if (new Date().getTime() > new Date(maemul_exclusive_end_date).getTime()) {
            alert('만료된 기한연장링크');
            history.push('/');//메인페이지 이동.리다렉션.
          }
          let probrokerinfo = brokerRequest_product_info.probroker_match;
          let now_prd_status = brokerRequest_product_info.result_data[0].prd_status;//가장 product매물에 있는 가장 첫 레코드내역또한 최근정보

          console.log('중개의뢰매물 update내역정보::', maemul_info, probrokerinfo, now_prd_status);

          setmaemulinfo(maemul_info);
          setprobrokerinfo(probrokerinfo[0]);
          setnowprdstatus(now_prd_status);
        } else {
          alert('해당 매물에 대한 정보가 없습니다.');
          return;
        }
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
        {/*개인로 로그인했을때*/}
        <SubTitle title={"기한 연장"} rank={false} cursor={"default"} />
        <RequestExtend confirmModal={confirmModal} probrokerinfo={probrokerinfo} nowprdstatus={nowprdstatus} maemulinfo={maemulinfo} />
        <ModalCommon modalOption={modalOption} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
      <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
      <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
      <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}