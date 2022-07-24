//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import MyProfileSetting from '../../../component/member/mypage/myprofileSetting/MyProfileSetting';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import ModalCommon from '../../../component/common/modal/ModalCommon';
import ModalEditProfileImg from '../../../component/member/mypage/myprofileSetting/modal/ModalEditProfileImg';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server request
import serverController from '../../../server/serverController';

export default function Join() {
  ChannelServiceElement.shutdown();

  const history = useHistory();

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submitnone: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }


  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const logoutModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "로그아웃",
      content: { type: "text", text: `로그아웃 하시겠습니까?`, component: "" },
      submitnone: {
        show: true, title: "로그아웃", event: async () => {
          console.log('로그아웃 확인!');
          offModal();

          let logout_request = await serverController.connectFetchController('/api/auth/logout', 'GET');
          if (logout_request) {
            console.log('logout reqeust reusltss:', logout_request);
            if (logout_request.success) {
              alert(logout_request.message);

              //history.push('/');//메인페이지 이동.
              window.location.href = 'https:/korexpro.com';//리다랙션 형태 메인페이지 이동 페이지새로굄형 이동 app.js실행,라우터 이동으론 해당 콤퍼넌트대상체및 하부요소들까지만 실행됨. app.js에서 검사.
            }
          }
        }
      },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirm: {
        show: false, title: "확인", event: () => {

          offModal();
        }
      }
    });
  }

  //만약에 다른걸 키고 싶으면 아래 함수 호출하시면됩니다.
  const secessionModal = () => {

    setModalOption({
      show: true,
      setShow: offModal,
      title: "회원탈퇴",
      content: { type: "text", text: `회원탈퇴 하시겠습니까?`, component: "" },
      submitnone: {
        show: true, title: "취소", event: () => {
          offModal();

        }
      },
      cancle: {
        show: true, title: "회원탈퇴", event: async () => {
          offModal();

          console.log('회원탈퇴 진행 처리====>>');
          let user_delete_request = await serverController.connectFetchController('/api/mypage/userdelete_request', 'GET');//요청한 request 세션유저 nodejs환경 memid유저 정보 삭제.
          if (user_delete_request) {
            console.log('user_delete_request', user_delete_request);

            if (user_delete_request.success) {
              alert('회원탈퇴 처리 되었습니다!');

              window.location.href = 'https://korexpro.com';
            }
          }
        }
      },
      confirm: {
        show: false, title: "", event: () => {
          offModal();

        }
      }
    });
  }

  const editProfileImgModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "프로필사진 수정",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalEditProfileImg offModal={offModal} /> },
      // submit: { show: true, title: "적용", event: () => { modalAdjust(); } },
      // cancle: { show: true, title: "초기화", event: () => { clearFilter(); } },
      // confirm: { show: false, title: "확인", event: () => { modalAdjust(); } }
    });
  }

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  useEffect(async () => {
    console.log('로그인세션여부검사 및 관련 조회 로그인유효성검사');
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
          BunyangTeam.updateBunyangTeam({ bunyangTeam: res.data[0] });
        }
      });
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
        <SubTitle title={"계정/프로필 설정"} noNeedAccount={true}/>
        <MyProfileSetting secessionModal={secessionModal} logoutModal={logoutModal} editProfileImgModal={editProfileImgModal} />
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