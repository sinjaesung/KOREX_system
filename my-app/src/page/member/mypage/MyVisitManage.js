//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component

import SubTitle from '../../../component/common/SubTitle';
import ModalVisitFilter from '../../../component/member/mypage/projectSetting/modal/ModalVisitFilter';
import ModalVisitor from '../../../component/member/mypage/projectSetting/modal/ModalVisitor';
import ModalVisitCancle from '../../../component/member/mypage/projectSetting/modal/ModalVisitCancle';
import VisitManage from '../../../component/member/mypage/projectSetting/VisitManage';

import ModalCommon from '../../../component/common/modal/ModalCommon';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';
import serverController from '../../../server/serverController';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';


export default function MyVisitManage() {

  ChannelServiceElement.shutdown();

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  const history = useHistory();

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  useEffect(async () => {
    console.log('mypage도달>>> 로그인세션여부검사 및 관련 조회::');
    let res = await serverController.connectFetchController('/api/auth/islogin', 'get');
    //마이페이지 도달시에도 정보 저장 마이펭지 표면 노출되는 유저이름,프로필url등 state바로저장. 
    if (res) {
      if (res.login_session == null) {
        //alert('비로그인 상태입니다.'); 유효하지않은 정보인경우or비로그인
        Login_userActions.isloginchange({ islogins: 0 });
        history.push(`/MemberLogin`);
        //비로그인상태라면 로그인페이지 이동처리!
        return;
      } else {
        var get_memid = res.login_session.user_id;//mem_id 얻기
        let body_info = {
          mem_id: get_memid
        };
        console.log(JSON.stringify(body_info));
        let user_info = await serverController.connectFetchController('/api/auth/userinfo_request', 'POST', JSON.stringify(body_info));
        console.log('userinfo_request >>> res_result:', user_info, user_info.user_data);

        if (user_info.success) {
          //회원정보 조회가 성공한경우에만!

          setUsername(user_info.user_name);
          setUserprofile(user_info.mem_img);

          if (user_info.user_data.user_type != '개인') {
            //개인은 userType바뀔일이없다.
            if (user_info.user_data.user_type == '' || !user_info.user_data.user_type || user_info.user_data.company_id == '' || !user_info.user_data.company_id) {
              //하나라도 비어있던경우에 선택된 소속이랑 user_type정보가 없던 경우 유효치 않은 값이 하나라도 있는경우라면 마이페이지 보여주지 않는다!
              history.push('/Team');
              return;
            }
          }

          Login_userActions.memidchange({ memids: user_info.user_data.mem_id });
          Login_userActions.companyidchange({ companyids: user_info.user_data.company_id });
          Login_userActions.user_usernamechange({ user_usernames: user_info.user_data.user_username });
          Login_userActions.phonechange({ phones: user_info.user_data.phone });
          Login_userActions.emailchange({ emails: user_info.user_data.email });
          Login_userActions.usernamechange({ usernames: user_info.user_data.user_name });
          Login_userActions.memimgchange({ memimgs: user_info.user_data.mem_img });
          Login_userActions.usertypechange({ usertypes: user_info.user_data.user_type });
          Login_userActions.registertypechange({ registertypes: user_info.user_data.register_type });
          Login_userActions.memadminchange({ memadmins: user_info.user_data.mem_admin });
          Login_userActions.memnotificationchange({ mem_notification: user_info.user_data.mem_notification });
          Login_userActions.isloginchange({ islogins: 1 });
          Login_userActions.companynamechange({ company_name: user_info.user_data.company_name });
          Login_userActions.isprochange({ ispros: user_info.user_data.ispro });
          Login_userActions.memprofilechange({ memprofile: globe_aws_url != '' ? (globe_aws_url + user_info.user_data.mem_img) : ('https://korexdata.s3.ap-northeast-2.amazonaws.com/' + user_info.user_data.mem_img) });
        }
      }
    }
    console.log(BunyangTeam.bunyangTeam)
    if (login_user.user_type == '분양대행사' && (!BunyangTeam.bunyangTeam && (bunyangTeam.bunyangTeam && !bunyangTeam.bunyangTeam.bp_id))) {
      serverController.connectFetchController(`/api/bunyang/team?no=${login_user.memid}`, 'GET', null, function (res) {
        if (res.success == 1) {
          // BunyangTeam.updateBunyangTeam({bunyangTeam:res.data[0]});
          console.log('res datasss:', res.data);
          if (res.data.length == 0) {

            alert('분양소속팀이 없습니다.분양소속팀을 선택해주세요!');
            history.goBack();
          }
        }
      });
    }

  }, []);


  //필터 모달창
  const [filter, setFilter] = useState({
    order: "N",
    sort: "ALL",
    search: "",
  });
  //방문예약 취소모달창
  const [cancle, setCancle] = useState(false);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  const [reservationList, setReservationList] = useState([]);

  //분양알람셋팅 데이터.
  const [alramsetting_tiny, setalramsetting_tiny] = useState({});

  //여기 두개가 핵심이에여 넵!
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  const cancelReservation = async (value) => {
    console.log('분양대행사측에서 중개사 신청 방문예약value,신청중개사의 companyid값등.,...:',value);
    let result = await serverController.connectFetchController(`/api/bunyang/reservation?tr_id=${value.tr_id}`, 'DELETE', null);
    if (result && result.success == 1) {
      //alert("취소되었습니다.");
      offModal();

      //그 대상의 trid대상 request_mmeid에게 알림 대상한명에게 예약취소되었다고알림 분양방문예약신청한것 취소된것(해제)알림
      let transaction_id = value.tr_id;//어떤 접수내역 방문예약접수내역trid에 대해서 한건지.

      let noti_info = {
        transaction_id: transaction_id,
        message: `신청하신 분양방문예약 tr_id:${value.tr_id} 에 대해서 분양사측에서 해제처리하였습니다.`,
        noti_type: 'bunyang_visit_cancled_by_bunyang',
        request_mem_id: value.mem_id,
        company_id : value.request_user_selectsosokid,//요청유저 요청중개사 소속companyid값.  
      }
      let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
      if (noti_res) {
        if (noti_res.success) {
          console.log('noti resultsss:', noti_res);

          updateReservationList();//관련 취소된것에 대해서 내역 업뎃이후에 후처리진행>>

        } else {
          alert('알람 발송오류!!!');
        }
      }
    }
  }

  async function updateReservationList() {
    let result = await serverController.connectFetchController(
      `/api/bunyang/reservation?bp_id=${bunyangTeam.bunyangTeam.bp_id}&tr_type=1&order=${filter.order}&sort=${filter.sort}&search=${filter.search}`,
      'GET',
      null);

    if (result && result.success == 1) {
      console.log('bunyang ream resultsss resultssss:', result);
      setReservationList(result.data);
    }
  }

  useEffect(async () => {

    if (!bunyangTeam.bunyangTeam || !bunyangTeam.bunyangTeam.bp_id) {
      return;
    }
    updateReservationList();
    //방문예약접수내역관리에서 쓰이는 분양알람셋팅데이터 조회.
    let send_info = {
      mem_id: login_user.memid,
      user_type: login_user.user_type,
      company_id: login_user.company_id,
      bp_id: bunyangTeam.bunyangTeam.bp_id
    };
    let send_res = await serverController.connectFetchController('/api/alram/alramSetting_status', 'POST', JSON.stringify(send_info));

    if (send_res) {
      console.log('reulstss alram setting intysss:', send_res);
      if (send_res.success) {
        let result = send_res.result;
        if (result) {
          setalramsetting_tiny(result);
        }
      } else {
        alert(send_res.message);
      }
    }
  }, []);

  const openVisitorList = async (tr_id) => {

    let result = await serverController.connectFetchController(`/api/bunyang/reservation/members?tr_id=${tr_id}`, 'GET', null);

    if (result && result.success == 1) {
      visitorModal(result.data);
    }

  }

  function clearFilter() {
    setFilter({ order: "DESC", sort: "ALL", search: "", });
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const updateModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "필터",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalVisitFilter filter={filter} setFilter={setFilter} /> },
      submit: { show: true, title: "적용", event: () => { updateReservationList(); offModal(); } },
      cancle: { show: true, title: "초기화", event: () => { clearFilter(); offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }

  //만약에 다른걸 키고 싶으면 아래 함수 호출하시면됩니다.
  const visitorModal = (userList) => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "동반고객",
      content: { type: "component", text: `ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`, component: <ModalVisitor userList={userList} /> },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: false, title: "", event: () => { offModal(); } }
    });
  }

  const cancleModal = (value) => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "투어예약 수정",
      content: { type: "component", text: `ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`, component: <ModalVisitCancle /> },
      submit: { show: true, title: "확인", event: () => { cancelReservation(value); } },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "수정", event: () => { offModal(); } }
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
        <SubTitle title={bunyangTeam.bunyangTeam && bunyangTeam.bunyangTeam.bp_name ? bunyangTeam.bunyangTeam.bp_name : "소속명"} arrow={"　▼"} path={"/BunyangTeam"} cursor={"pointer"} />
        <VisitManage
          filter={filter}
          setFilter={setFilter}
          updateModal={updateModal}
          visitorModal={visitorModal}
          cancleModal={cancleModal}
          setCancle={setCancle}
          reservationList={reservationList}
          setReservationList={setReservationList}
          openVisitorList={openVisitorList}
          updateReservationList={updateReservationList}
          setalramsetting_tiny={setalramsetting_tiny} alramsetting_tiny={alramsetting_tiny}
        />
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