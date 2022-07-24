//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import MyProfile from '../../../component/member/mypage/MyProfile';
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
import serverController2 from '../../../server/serverController2';

import MyProfileSetting from '../../../component/member/mypage/myprofileSetting/MyProfileSetting'

export default function Join() {

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  const history = useHistory();

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  const isloginmember = 1;

  useEffect(async () => {
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

          setUsername(user_info.user_data.user_name);
          setUserprofile(user_info.user_data.mem_img);

          if (user_info.user_data.user_type != '개인') {
            //개인은 userType바뀔일이없다.
            if (user_info.user_data.user_type == '' || !user_info.user_data.user_type || user_info.user_data.company_id == '' || !user_info.user_data.company_id) {
              //하나라도 비어있던경우에 선택된 소속이랑 user_type정보가 없던 경우 유효치 않은 값이 하나라도 있는경우라면 마이페이지 보여주지 않는다!
              history.push('/Team');
              return;
            }
          }

          console.log('개인로그인', user_info);
          console.log('개인로그인', user_info.user_data);
          console.log('개인로그인', login_user);

          Login_userActions.memidchange({ memids: user_info.user_data.mem_id });
          Login_userActions.companyidchange({ companyids: user_info.user_data.company_id });
          Login_userActions.user_usernamechange({ user_usernames: user_info.user_data.user_username });
          Login_userActions.phonechange({ phones: user_info.user_data.phone });
          Login_userActions.emailchange({ emails: user_info.user_data.email });
          Login_userActions.usernamechange({ usernames: user_info.user_data.user_name });
          Login_userActions.memimgchange({ memimgs: user_info.user_data.mem_img });
          Login_userActions.usertypechange({ usertypes: user_info.user_data.user_type });
          Login_userActions.registertypechange({ registertypes: user_info.user_data.register_type });
          Login_userActions.memadminchange({ memadmins: user_info.user_data.mem_admin });//이거 companymember테이블의 cmtype(권한) 정보입니다. user테이블의 memadmin이 아닙니다.
          Login_userActions.memnotificationchange({ mem_notification: user_info.user_data.mem_notification });
          Login_userActions.isloginchange({ islogins: 1 });
          Login_userActions.companynamechange({ company_name: user_info.user_data.company_name });
          Login_userActions.isprochange({ ispros: user_info.user_data.ispro });
          Login_userActions.memprofilechange({ memprofile: globe_aws_url != '' ? (globe_aws_url + user_info.user_data.mem_img) : ('https://korexdata.s3.ap-northeast-2.amazonaws.com/' + user_info.user_data.mem_img) });
        }
      }
    }

    if (login_user.user_type == '분양대행사' && (!BunyangTeam.bunyangTeam && (bunyangTeam.bungyangTeam && !bunyangTeam.bunyangTeam.bp_id))) {
      serverController.connectFetchController(`/api/bunyang/team?no=${login_user.memid}`, 'GET', null, function (res) {
        if (res.success == 1) {
          BunyangTeam.updateBunyangTeam({ bunyangTeam: res.data[0] });
          console.log('bunyanteam resultsss:',res);
        }
      });
    }

    if (login_user.user_type == '분양대행사'){
      if (bunyangTeam.bunyangTeam && !bunyangTeam.bunyangTeam.bp_name) {
        history.push('/BunyangTeam')
      }
      
    }
  }, []);

  useEffect(async () => {

    if (!bunyangTeam.bunyangTeam || !bunyangTeam.bunyangTeam.bp_id)
      return;

    let result = await serverController.connectFetchController(`/api/bunyang/reservation/team/count?bp_id=${bunyangTeam.bunyangTeam.bp_id}`, 'GET', null);

    if (result && result.success == 1) {
      console.log('bunyang tame reulstsss:',result);

      BunyangTeam.updateBunyangTeamCount({
        liveCount: result.data.liveCount.length == 0 ? 0 : result.data.liveCount[0].count,
        visitCount: result.data.visitCount.length == 0 ? 0 : result.data.visitCount[0].count
      })

    }
  }, [bunyangTeam]);


  //수정버튼 클릭시 저장버튼 변경
  const editButtonBox = () => {
    console.log('subtitle 연필 수정버튼 클릭시에 실행발발, 임의 페이지 수정요소 형태로 발생, 1->2 저장중상태로 처리');
    setEditChk(2);
    return setValueChk(2);
  }
  const editOffButtonBox = async () => {
    console.log('subtitle 저장버튼 클릭시에 실행발발,임의 페이지 저장요소 형태,저장버튼을 눌렀을때!!!,다시 2->1 조회상태로 처리.', username, userprofile);
    setEditChk(1);

    let formData = new FormData();
    formData.append('username_val', username);
    formData.append('folder', 'userProfile');
    formData.append('memid_val', login_user.memid);
    formData.append('userprofile_val', userprofile);

    let profilechange_request = await serverController2.connectFetchController('/api/mypage/profilechange_request', 'POST', formData);
    if (profilechange_request) {
      console.log('profilechange request resultss:', profilechange_request);

      if (profilechange_request.success) {
        let result = profilechange_request.result;
        Login_userActions.memprofilechange({ memprofile: globe_aws_url + result.mem_img });
      } else {
        alert(profilechange_request.message);
      }
    }

    Login_userActions.usernamechange({ usernames: username });

    return setValueChk(1);
  }

  //저장버튼 클릭시 변경
  const [valueChk, setValueChk] = useState(1);
  const profileeditCheck = () => {
    setEditChk(1); //1 : 조회상태, 2:저장중
    return setValueChk(1);
  }

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });


  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }


  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const proBrokerModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "물건 등록하기",
      content: { type: "text", text: `전문중개사로 승인된 중개업소만\n물건 등록이 가능합니다.\n전문중개사 신청은\n관리자 권한만 할 수 있습니다.`, component: "" },
      submit: { show: false, title: "적용", event: () => { offModal(); } },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", link: "", event: () => { offModal(); } }

    });
  }


  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        <CommonHeader />
        {
          login_user.user_type !== '개인' ?
            login_user.user_type == '분양대행사' ?
              <SubTitle title={bunyangTeam.bunyangTeam && bunyangTeam.bunyangTeam.bp_name ? bunyangTeam.bunyangTeam.bp_name : "소속명"}  path={"/BunyangTeam"} />
              :
              <SubTitle title={login_user.company_name} path={"/Team"} />
            :
            <SubTitle />
        }

        <MyProfile profileedit={valueChk} proBrokerModal={proBrokerModal} username={username} setUsername={setUsername} userprofile={userprofile} setUserprofile={setUserprofile} edit={editCheck} editButtonBox={editButtonBox} editOffButtonBox={editOffButtonBox} profileeditCheck={profileeditCheck}/>
        <ModalCommon modalOption={modalOption} />
      </div>
      <CommonFooter />
    </div>
  );
}