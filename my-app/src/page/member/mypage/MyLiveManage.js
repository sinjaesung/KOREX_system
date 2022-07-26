//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import SubTitle from '../../../component/common/SubTitle';
import ModalFilter from '../../../component/member/mypage/projectSetting/modal/ModalFilter';
import LiveManage from '../../../component/member/mypage/projectSetting/LiveManage';

import ModalCommon from '../../../component/common/modal/ModalCommon';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import serverController from '../../../server/serverController';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

export default function MyLiveManage() {

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
    if (login_user.user_type == '분양대행사' && (!BunyangTeam.bunyangTeam && !bunyangTeam.bunyangTeam.bp_id)) {
      serverController.connectFetchController(`/api/bunyang/team?no=${login_user.memid}`, 'GET', null, function (res) {
        if (res.success == 1) {
          //BunyangTeam.updateBunyangTeam({bunyangTeam:res.data[0]});
          console.log('res datasss:', res.data);
          if (res.data.length == 0) {

            alert('분양소속팀이 없습니다.분양소속팀을 선택해주세요!');
            history.goBack();
          }
        }
      });
    }

  }, []);

  //const bunyangTeam = useSelector(data => data.bunyangTeam);

  //필터 모달창
  const [filter, setFilter] = useState({
    order: "DESC",
    sort: "ALL",
    search: "",
    index: 0
  });

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });
  const [reservationList, setReservationList] = useState([]);
  const [settingList, setSettingList] = useState([]);


  //여기 두개가 핵심이에여 넵!
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  async function updateReservationList(tour_id) {
    console.log('update resultavation::', filter);
    let query = "";

    if (tour_id) {
      query += `&tour_id=${tour_id}`;
    }
    else if (settingList[filter.index] && settingList[filter.index].tour_id)
      query += `&tour_id=${settingList[filter.index].tour_id}`;

    let result = await serverController.connectFetchController(
      `/api/bunyang/reservation?bp_id=${bunyangTeam.bunyangTeam.bp_id}&tr_type=2&order=${filter.order}&sort=${filter.sort}&search=${filter.search}${query}`,
      'GET',
      null);

    console.log(`/api/bunyang/reservation?bp_id=${bunyangTeam.bunyangTeam.bp_id}&tr_type=2&order=${filter.order}&sort=${filter.sort}&search=${filter.search}${query}`);

    if (result && result.success == 1) {
     
      let data = result.data;
      if(data){
        console.log('udpateREsvation분양라이브 신청리스트 특정tourid에 신청한 내역들 로컬조회:', data);
        for (let i = 0; i < data.length; i++) {
          data[i].isChecked = false;
        }
        setReservationList([...data]);
      }
    }
  }

  useEffect(() => {
    if (!bunyangTeam.bunyangTeam || !bunyangTeam.bunyangTeam.bp_id) {
      return;
    }
    serverController.connectFetchController(`/api/bunyang/reservation/setting?bp_id=${bunyangTeam.bunyangTeam.bp_id}&tour_type=4`, 'GET', null, function (res) {
      if (res.success == 1) {
        console.log('bunyangressvation setting listsss res datassss:', res.data);
        setSettingList(res.data);
        if (res.data.length > 0)
          updateReservationList(res.data[0].tour_id);
      }
    });
  }, []);

  function clearFilter() {
    setFilter({ order: "DESC", sort: "ALL", search: "", index: 0 });
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const updateModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "필터",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalFilter settingList={settingList} filter={filter} setFilter={setFilter} /> },
      submit: { show: true, title: "적용", event: () => { updateReservationList(); offModal(); } },
      cancle: { show: true, title: "초기화", event: () => { clearFilter(); offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } }
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
        <SubTitle title={bunyangTeam.bunyangTeam.bp_name ? bunyangTeam.bunyangTeam.bp_name : "소속명"} arrow={"　▼"} rank={false} path={"/BunyangTeam"} cursor={"pointer"} />
        <LiveManage updateReservationList={updateReservationList} settingList={settingList} reservationList={reservationList} setFilter={setFilter} updateModal={updateModal} setReservationList={setReservationList} />
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