//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import PreviewComplete from '../../component/AppComponent/PreviewComplete';
import ModalCommon from "../../component/common/modal/ModalCommon";
import ModalEdit from "../../component/AppComponent/modal/ModalEdit";
import ReportModal from "../../component/AppComponent/modal/ReportModal";
import ModalReject from "../../component/AppComponent/modal/ModalReject";

import CommonHeader from '../../component/common/commonHeader';
import CommonFooter from '../../component/common/commonFooter';

import ChannelServiceElement from '../../component/common/ChannelServiceElement';


//server controller
import serverController from '../../server/serverController';

export default function Join({ match }) {
  const history = useHistory();
  console.log('app/preview페이지 도달 등록 거래준비매물 미리보기페이지>>;', match, match.params.id);
  var prd_identity_id = match.params.id;

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

  // //분양 모달
  // const [bunyang, setBunyang] = useState(false);
  // const openBunyang = (onOff) =>{ setBunyang(onOff);}
  // //라이브 시청 모달
  // const [live, setLive] = useState(false);
  // //분양 상세이미지 모달
  // const [detailimg, setDetailImg] = useState(false);
  // const [cal, setCal] = useState(false);
  var rejectreason_change = (value) => {
    rejectreason = value;
  }
  var rejectreason = '';
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, submitnone: {}, cancle: {}, confirm: {}, confirmgreennone: {}, link: {}, content: {} });
  const [off, setOff] = useState(false);
  const [maemulinfo, setmaemulinfo] = useState({});
  const [buildinginfo, setbuildinginfo] = useState({});//아파트,오피스텔의 경우 동정보건물정보
  const [complexinfo, setcomplexinfo] = useState({});

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }
  const updateReserveModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "물건투어예약",
      content: { type: "component", text: `ddfdf`, component: <ModalEdit /> },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: true, title: "수정", event: () => { offModal(); } }

    });
  }
  const reportModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "허위매물신고",
      content: { type: "component", text: `ddfdf`, component: <ReportModal off={off} setOff={(e) => { setOff(e); offModal(); }} /> },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: false, title: "수정", event: () => { offModal(); } }

    });
  }

  const rejectModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "거절 사유",
      content: { type: "component", text: `ddfdf`, component: <ModalReject rejectreason_change={rejectreason_change} off={off} setOff={(e) => { setOff(e); offModal(); }} /> },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirmgreennone: {
        show: true, title: "확인", event: async () => {
          console.log('거절사유 상태::', rejectreason, maemulinfo);

          //거래갯시스인요청 거절상태값 변화 요청
          let req_info = {
            prd_identity_id: prd_identity_id,
            company_id: maemulinfo.company_id,//해당 나온 companyid 값 어떤 매물 그리고 어떤 선임중개사인지여부
            prd_status_val: '거래완료승인요청 거절',
            generator_memid: '',
            change_reason: rejectreason
          };
          console.log('거래완료승인요청한 매물 외부수임or의뢰매물 상관없이, 거래완료승인요청 거절상태값으로 insert할뿐임:', JSON.stringify(req_info));
          let prdstatus_result = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(req_info));
          console.log('prdstatus resultsss:', prdstatus_result);

          if (prdstatus_result) {
            if (prdstatus_result.success) {
              alert('>>>거래완료승인요청거절 상태값 변경');

              let noti_info = {
                prd_identity_id: prd_identity_id,
                company_id: maemulinfo.company_id,//어떤 선임중개사에게 사업체회원들에게 보내는지
                message: prd_identity_id + '::해당매물 의뢰자로부터 거래완료승인요청 거절받았습니다.',
                noti_type: 17//17거래완료승인요청 거절.
              }
              let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
              if (noti_res) {
                if (noti_res.success) {
                  console.log('noti_resss:', noti_res);

                } else {
                  alert(noti_res.message);
                }
              }
            }
            rejectModalConfirm();
          } else {
            alert(prdstatus_result.message);
          }

          history.push('/');
        }
      }
    });
  }
  const rejectModalConfirm = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "거절 사유",
      content: { type: "text", text: `정상적으로 처리 되었습니다.`, component: '' },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }

    });
  }

  const confirmModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "거래완료 승인",
      content: { type: "text", text: `해당 물건을 거래완료 처리하시겠습니까??`, component: '' },
      submitnone: {
        show: true, title: "확인", event: async () => {
          offModal();
          //alert('거래개시 승인 요청!');

          let req_info = {
            prd_identity_id: prd_identity_id,
            company_id: maemulinfo.company_id,
            prd_status_val: '거래완료',
            generator_memid: '',
            change_reason: ''
          };
          console.log('거래완료 승인요청한 매물 외보수임or의로매물 상관없이 거래완료승인요청 수락상태값으로 insert할뿐임:', JSON.stringify(req_info));
          let prdstatus_result = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(req_info));
          console.log('prdstatus_resultsss:', prdstatus_result);


          //거래개시승인 수락받음. 관련알림 전문중개사들에게.
          if (prdstatus_result) {
            if (prdstatus_result.success) {
              alert('거래완료승인요청 수락 상태값 변경');

              let noti_info = {
                prd_identity_id: prd_identity_id,
                company_id: maemulinfo.company_id,//어떤 선임중개사에게 사업체회원들에게 보낼건지
                message: prd_identity_id + '::해당매물 의뢰자로부터 거래완료승인요청 수락받았습니다.',
                noti_type: 17
              }
              let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
              if (noti_res) {
                if (noti_res.success) {
                  console.log('niti resressss:', noti_res);
                } else {
                  alert(noti_res.message);
                }
              }
            }
          } else {
            alert(prdstatus_result.message);
          }

          history.push('/');
        }
      },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirmgreennone: { show: false, title: "확인", event: () => { offModal(); } }

    });
  }

  useEffect(async () => {
    console.log('페이지로드시점 prd_identity_id값 및 관련 매물 정보 조회::', prd_identity_id);

    let body_info = {
      prd_identity_idval: prd_identity_id
    }
    let maemulinfo_preview = await serverController.connectFetchController('/api/broker/brokerRequest_productview', 'POST', JSON.stringify(body_info));
    if (maemulinfo_preview) {
      console.log('maemulinfo previewss:', maemulinfo_preview);

      setmaemulinfo(maemulinfo_preview.result_data[0]);//가장 최근or근원적 매물정보를 리턴한다.
      if (maemulinfo_preview.building_dong_info && maemulinfo_preview.building_dong_info[0]) {
        setbuildinginfo(maemulinfo_preview.building_dong_info[0]);
      }
      if (maemulinfo_preview.complex_info && maemulinfo_preview.complex_info[0]) {
        setcomplexinfo(maemulinfo_preview.complex_info[0]);
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
        <PreviewComplete updateReserveModal={updateReserveModal} reportModal={reportModal} rejectModal={rejectModal} confirmModal={confirmModal} maemulinfo={maemulinfo} buildinginfo={buildinginfo} complexinfo={complexinfo} />
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