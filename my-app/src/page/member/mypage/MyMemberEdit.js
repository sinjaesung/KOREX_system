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

  //로그인 검증,유효성 검증startss...미검증유저일시 리다렉션, 검증유저일시 유지하며 로그인유저회원 연동해야할 데이터가 있다면 해당 함수내부에서 의존성코드작성.의존성 관련 쿼리리스트.
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

          let teamone_info = {
            mem_id: mem_id_get
          };
          let teamone_info_view = await serverController.connectFetchController("/api/mypage/teamone_view_process", 'POST', JSON.stringify(teamone_info));

          console.log('팀원 정보', teamone_info_view);
          console.log('팀원 정보', teamone_info);
          // if (teamone_info_view) {
          //   console.log('teamoneinfo view::', teamone_info_view);

          //   if (teamone_info_view.result) {
          //     setTeamoneinfo(teamone_info_view.result[0]);
          //     setName(teamone_info_view.result[0].user_name);
          //     setPhone(teamone_info_view.result[0].phone);
          //     setcmtype(teamone_info_view.result[0].cm_type);
          //   }
          // }

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

  }, []);//로그인검증 endss....


  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreennone: {}, content: {} });
  const [teamoneinfo, setTeamoneinfo] = useState({});

  const [name, setName] = useState(teamoneinfo&&teamoneinfo.user_name);/*기본값*/
  const [phone, setPhone] = useState(teamoneinfo&&teamoneinfo.phone);/*기본값*/
  const [cmtype, setcmtype] = useState(teamoneinfo&&teamoneinfo.mem_admin);

  useEffect(() => {
    console.log('name,phone,memadmin관련 변경::', name, phone, cmtype);
  }, [name, phone, cmtype]);

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
        <MemberEdit saveModal={saveModal} teamoneinfo={teamoneinfo} setName={setName} setPhone={setPhone} setcmtype={setcmtype} name={name} phone={phone} cmtype={cmtype} />
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