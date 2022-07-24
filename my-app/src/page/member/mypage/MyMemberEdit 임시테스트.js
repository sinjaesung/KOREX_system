//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import MemberEdit from '../../../component/member/mypage/mymember/MemberEdit';
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

//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server request
import serverController from '../../../server/serverController';

export default function Join({ match }) {

  ChannelServiceElement.shutdown();

  //페이지파라미터. get
  console.log('page mymmembereidt sssinfo:', match, match.params);
  if (match.params) {
    var mem_id_get = match.params.id;
    //alert(match.params);
    console.log('match.params', mem_id_get);
  }

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  const history = useHistory();

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);



  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreennone: {}, content: {} });
  const [teamoneinfo, setTeamoneinfo] = useState({});

  const [name, setName] = useState("");/*기본값*/
  const [phone, setPhone] = useState("");/*기본값*/
  const [cmtype, setcmtype] = useState("");

  // useEffect(() => {
  //   console.log('name,phone,memadmin관련 변경::', name, phone, cmtype);
  // }, [name, phone, cmtype]);

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }
  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const saveModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "팀원 정보 수정",
      content: { type: "text", text: `정상적으로 수정되었습니다.`, component: "" },
      submit: { show: false, title: "적용", event: () => { offModal(); } },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", link: "/MyMember", event: () => { offModal(); } }
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
        {
          login_user.user_type !== '개인' ?
            login_user.user_type == '분양대행사' ?
              <SubTitle title={bunyangTeam.bunyangTeam && bunyangTeam.bunyangTeam.bp_name ? bunyangTeam.bunyangTeam.bp_name : "소속명"} arrow={"　▼"} path={"/BunyangTeam"} rank={true} cursor={"pointer"} />
              :
              <SubTitle title={login_user.company_name} arrow={"　▼"} path={"/Team"} rank={true} cursor={"pointer"} />
            :
            <SubTitle title={login_user.company_name} arrow={"　▼"} path={"/Team"} rank={true} cursor={"pointer"} />
        }
        <MemberEdit />
        <ModalCommon modalOption={""} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
        <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
        <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
        <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}