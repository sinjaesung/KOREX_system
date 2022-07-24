//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import SubTitle from '../../../component/common/SubTitle';
import LiveManageInvite from '../../../component/member/mypage/projectSetting/LiveManageInvite';

import ModalCommon from '../../../component/common/modal/ModalCommon';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import serverController from '../../../server/serverController';
import { useSelector } from 'react-redux';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

export default function MyLiveManageInvite({ location }) {

  ChannelServiceElement.shutdown();

  const [reservationList, setReservationList] = useState([]);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreennone: {}, content: {} });
  const [url, setUrl] = useState(false);
  const [text, setText] = useState(false);
  const history = useHistory();
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  useEffect(() => {
    if (!location.state || !location.state.list) {
      history.replace('/Mypage');
      return;
    }
    setReservationList(location.state.list)
  }, [location]);

  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }


  const spendInviteLink = async () => {

    let userList = [];
    reservationList.map((value) => {
      userList.push({
        tr_id: value.tr_id,
        bp_name: value.bp_name,
        tr_name: value.tr_name,
        tr_email: value.tr_email,
        tr_phone: value.tr_phone,
        tr_status: 2,
        mem_id :value.mem_id,
        company_id: value.request_user_selectsosokid
      });
    })

    let data = {
      url: url,
      content: text,
      userList: userList
    }
    let result = await serverController.connectFetchController("/api/bunyang/reservation/link", "PUT", JSON.stringify(data));
    if (result.success == 1) {
      updateModal();

      //초대자들 실제 초대 관련 액션 이뤄진후에 관련 링크 포함된 메시지 알림한다
      //userList는 하나의 trid신청 내역이며, 각 신청아이디별 memid정보 있을것임. 
      //let transaction_id= bunyangTeam.bunyangTeam.bp_id;

      let noti_info = {
        message: `====분양라이브방송 초대 알람입니다====\n\n${text}\n 초대링크:${url}`,
        noti_type: 'bunyang_live_invite',
        userList: userList
      }

      let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
      if (noti_res) {
        if (noti_res.success) {
          console.log('noti_resultsss :', noti_res);
        } else {
          alert('알람발송오류!!');
        }
      }
    }
    else {
      updateFailModal();
    }

  }


  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const updateModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "Live 시청초대",
      content: { type: "text", text: `초대가 완료되었습니다.`, component: "" },
      submit: { show: false, title: "적용", event: () => { offModal(); } },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", link: "/MyLiveManage", event: () => { offModal(); } }
    });
  }
  const updateFailModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "Live 시청초대",
      content: { type: "text", text: `초대가 실패하였습니다.`, component: "" },
      submit: { show: false, title: "적용", event: () => { offModal(); } },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", link: "/MyLiveManage", event: () => { offModal(); } }
    });
  }

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
        <SubTitle title={"초대"} rank={false} cursor={"default"} />
        <LiveManageInvite url={url} setUrl={setUrl} text={text} setText={setText} reservationList={reservationList} spendInviteLink={spendInviteLink} />
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