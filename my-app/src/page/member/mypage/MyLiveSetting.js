//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component

import SubTitle from '../../../component/common/SubTitle';
import LiveSetting from '../../../component/member/mypage/projectSetting/LiveSetting';
import ModalAdd from '../../../component/member/mypage/projectSetting/modal/ModalAdd';
import ModalEdit from '../../../component/member/mypage/projectSetting/modal/ModalEdit';
import ModalCancle from '../../../component/member/mypage/projectSetting/modal/ModalCancle';

import ModalCommon from '../../../component/common/modal/ModalCommon';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import serverController from '../../../server/serverController';
//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

function checkZero(checkString) {
  return checkString.toString().length == 1 ? "0" + checkString : checkString;
}

function getDateType(date) {
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
  return temp;
}


function getDateTimeType(date) {
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getHours())}:${checkZero(date.getMinutes())}:00`;
  return temp;
}


export default function MyLiveSetting() {

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

          if (user_info.user_data.user_type == '분양대행사') {
            serverController.connectFetchController(`/api/bunyang/team?no=${user_info.user_data.mem_id}`, 'GET', null, function (res) {
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              console.log('userinfo usertdatasss:', user_info.user_data, res);
              if (res.success == 1) {
                 //BunyangTeam.updateBunyangTeam({bunyangTeam:res.data[0]});
                //setTeamList(res.data);//팀원리스트를 뿌려주는 페이지가 아니면 임의 분양팀의 첫번째 소속으로 지정.
                console.log('res datasss:', res.data);
                if (res.data.length == 0) {

                  alert('분양소속팀이 없습니다.분양소속팀을 선택해주세요!');
                  history.goBack();
                }
              }
            });
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

  }, []);

  //추가 모달창
  const [add, setAdd] = useState(false);
  //수정 모달창
  const [edit, setEdit] = useState(false);
  //취소 모달창
  const [cancle, setCancle] = useState(false);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreennone: {}, content: {} });
  const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 30), 16));
  const [selectDate, setSelectDate] = useState(new Date());
  const [settingList, setSettingList] = useState([]);
  const [cancelText, setCancelText] = useState({ text: "" });
  const [editObject, setEditObject] = useState({ time: "", text: "" });

  const userInfo = useSelector(e => e.login_user);

  let blockEvent = false;

  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  useEffect(() => {
    getSettingList();
  }, [])
  useEffect(() => {
    console.log(bunyangTeam);
    console.log(bunyangTeam);
    console.log(bunyangTeam);
    console.log(bunyangTeam);
    console.log(bunyangTeam);
    console.log(bunyangTeam);
    console.log(bunyangTeam);
    console.log(bunyangTeam);
    console.log(bunyangTeam);
    if (!bunyangTeam.bunyangTeam || !bunyangTeam.bunyangTeam.bp_id)
      return;
    getSettingList();

  }, [bunyangTeam])


  const getSettingList = () => {
    serverController.connectFetchController(`/api/bunyang/reservation/setting?bp_id=${bunyangTeam.bunyangTeam.bp_id}&tour_type=4`, 'GET', null, function (res) {
      if (res.success == 1) {
        setSettingList(res.data);
      }
    });
  }


  function insertLiveSetting(value) {
    console.log('insertLiveSetting 라이브셋팅::', value);
    if (blockEvent) { return; }
    blockEvent = true;

    let data = {
      company_id: userInfo.company_id,
      mem_id: userInfo.memid,//어떤memid,어떤소속id에서 한건지.
      tour_start_date: getDateType(value.selectDate),
      tour_end_date: getDateType(value.selectDate),//분양라이브방송 시작날짜
      tour_start_time: getDateTimeType(value.startDate),//분양라이브방송 시작시간
      tour_end_time: getDateTimeType(value.startDate),
      tour_set_days: [false, false, false, false, false, false, false],//요일셋팅없음
      time_distance: 0,
      bp_id: bunyangTeam.bunyangTeam.bp_id,
      is_tour_holiday_except: 0,
      isActive: 1,
      tour_type: 4,
      tour_group_id: new Date().getTime() + "" + userInfo.memid,
    }


    serverController.connectFetchController(`/api/bunyang/reservation/setting`, 'POST', JSON.stringify(data), async function (res) {
      if (res.success == 1) {
        getSettingList();
        comfirmModal();

        //새로운 라이브시청예약 셋팅 bp-id->>>>라이브예약셋팅 성공하면 신규라이브방송예고등록되었다고 모든 중개사들에게 알림가한다.
        let transaction_id = bunyangTeam.bunyangTeam.bp_id;//분양프로젝트id로한다.

        let noti_info = {
          transaction_id: transaction_id,
          message: '분양 신규라이브 방송이 등록되었습니다.',//해당 알림은 특정타깃이 아니라 전체 중개사에게 가한다.
          noti_type: 'bunyang_live_newRegisted'
        }

        let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
        if (noti_res) {
          if (noti_res.success) {
            console.log('noti resultsss:', noti_res);
          } else {
            alert('알람발송오류!!');
          }
        }
      }
      else {
        failModal();
      }

      blockEvent = false;
    });
  }

  const editLiveReservation = (value) => {

    console.log('수정 및 안내 관련 사항들 보내기::', value, editObject);

    if (editObject.date && editObject.hour && editObject.min) {
      let dateStr = getDateType(editObject.date).replace(/\//gi, '-');
      let timeStr = checkZero(editObject.hour) + ":" + editObject.min + ":00";

      let data = {
        reserv_start_time: dateStr + " " + timeStr, cancelText: editObject.text,
        reserv_end_time: dateStr + " " + timeStr, cancelText: editObject.text,
        tour_start_date: dateStr + " " + timeStr, cancelText: editObject.text,
        tour_end_date: dateStr + " " + timeStr, cancelText: editObject.text,
        tour_start_time: timeStr, cancelText: editObject.text,
        tour_end_time: timeStr, cancelText: editObject.text,
        td_endtime: timeStr, cancelText: editObject.text,
        tour_start_date: dateStr,
        content: editObject.text,
        td_id: value.td_id,
        tour_id: value.tour_id,
        tr_status: 0,
        isActive: true,
      }
      console.log('editLiveRESEVATION::', data);

      serverController.connectFetchController(`/api/bunyang/reservation/setting`, 'PUT', JSON.stringify(data), async function (res) {
        if (res.success == true) {
          serverController.connectFetchController(`/api/bunyang/reservation/live/edit`, 'PUT', JSON.stringify(data), function (res) {
            if (res.success == true) {
              editSuccess();
              getSettingList();
            }
            else {
              editCancel();
            }

            blockEvent = false;
          });
          //라이브예약셋팅수정 시간대 수정되었을때 관련 알림가한다.
          let transaction_id = value.tour_id;//해당 tourid값.

          let noti_info = {
            transaction_id: transaction_id,//해당 tourid>tdid로 신청한 tourReservation 각 회원들 리스트.
            message: `분양 신규라이브 방송일정이 수정되었습니다\n\n 시간대:${dateStr}  ${timeStr}`,//해당 알림은 특정타깃이 아니라 전체 중개사에게 가한다.
            noti_type: 'bunyang_live_edited',
          }

          let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
          if (noti_res) {
            if (noti_res.success) {
              console.log('noti resultsss:', noti_res);
            } else {
              alert('알람발송오류!!');
            }
          }
        }
        else {
          editCancel();
          blockEvent = false;
        }
      });
    }

  }

  const cancelLiveReservation = (value) => {
    console.log('cancelLiveResvation 라이브방송 취소 관련 처리모달:', value, cancelText);

    let data = {
      id: value.td_id,
      content: cancelText.text,
      tr_status: 1,//라이브방송 취소
      isActive: false,
      tour_id: value.tour_id,//tourid 투업타입4관련 취소처리.
      td_id: value.td_id
    }

    serverController.connectFetchController(`/api/bunyang/reservation/setting`, 'PUT', JSON.stringify(data), async function (res) {
      console.log('api/bunyang/resvation/setting 라이브방송 취소 puttingss:', res);
      if (res.success == true) {
        serverController.connectFetchController(`/api/bunyang/reservation/live/edit`, 'PUT', JSON.stringify(data), function (res) {
          console.log('api/bunyang/resevation/live/edit관련 처리>>putt:', res);
          if (res.success == true) {
            editSuccess();
            getSettingList();
          }
          else {
            editCancel();
          }

          blockEvent = false;
        });
        //라이브예약셋팅취소 되었을때 관련 알림가한다.
        let transaction_id = value.tour_id;//해당 tourid값.

        let noti_info = {
          transaction_id: transaction_id,
          message: `분양 신규라이브 방송일정이 취소되었습니다.`,//해당 알림은 특정타깃이 아니라 전체 중개사에게 가한다.
          noti_type: 'bunyang_live_edited'
        }

        let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
        if (noti_res) {
          if (noti_res.success) {
            console.log('noti resultsss:', noti_res);
          } else {
            alert('알람발송오류!!');
          }
        }
      }
      else {
        blockEvent = false;
        editCancel();
      }

    });
  }

  function updateStartDate(date) {
    setStartDate(date);
  }
  function updateSelectDate(date) {
    setSelectDate(date);
  }

  function clickConfirm(value) {

    offModal();
    insertLiveSetting(value);
  }

  const addModal = () => {

    setModalOption({
      show: true,
      setShow: offModal,
      title: "LIVE방송예고 등록",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalAdd startDate={startDate} setStartDate={updateStartDate} selectDate={selectDate} setSelectDate={updateSelectDate} /> },
      submit: { show: false, title: "적용", event: () => { offModal(); } },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirm: { show: true, title: "확인", event: (value) => { clickConfirm(value); } },
    });
  }

  const editModal = (value) => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "수정 및 안내",
      content: { type: "component", text: `ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`, component: <ModalEdit value={value} editObject={editObject} setEditObject={setEditObject} setModalOption={setModalOption} /> },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: true, title: "확인 및 이메일 발송", event: () => { offModal(); editLiveReservation(value); } }
    });
  }

  const cancleModal = (value) => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "취소 및 안내",
      content: { type: "component", text: `ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`, component: <ModalCancle setModalOption={setModalOption} value={value} setCancelText={setCancelText} /> },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: {
        show: true, title: "확인 및 이메일 발송", event: () => {
          offModal();
          cancelLiveReservation(value);
        }
      }

    });
  }

  const editSuccess = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "등록",
      content: { type: "text", text: `수정되었습니다.`, component: "" },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }
    });
  }

  const editCancel = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "등록",
      content: { type: "text", text: `수정 실패하였습니다.`, component: "" },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }
    });
  }

  const comfirmModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "등록",
      content: { type: "text", text: `등록되었습니다.`, component: "" },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }
    });
  }

  const failModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "등록",
      content: { type: "text", text: `등록 실패하였습니다..`, component: "" },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }
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
        <SubTitle title={bunyangTeam.bunyangTeam.bp_name ? bunyangTeam.bunyangTeam.bp_name : "소속명"} arrow={"　▼"} path={"/BunyangTeam"} cursor={"pointer"} />
        <LiveSetting settingList={settingList} addModal={addModal} editModal={editModal} cancleModal={cancleModal} setAdd={setAdd} setEdit={setEdit} setCancle={setCancle} comfirmModal={comfirmModal} />
        <ModalCommon modalOption={modalOption} value={{ startDate: startDate, selectDate: selectDate }} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}
