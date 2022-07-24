//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import EmailChange from '../../../component/member/mypage/myprofileSetting/EmailChange';
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

//server request
import serverController from '../../../server/serverController';

//이메일 변경시에바로 리덕스 변경 반환(새로고침해야 서버단 반영된게 반영디는데, 새로고침안하고 spa상에서 변경하기위함)
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

export default function Join() {

  ChannelServiceElement.shutdown();

  const history = useHistory();
  //이용약관
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
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  // const [prevemail,setPrevemail] = useState('');
  const [changeemail, setChangeemail] = useState('');
  const [cernum, setCernum] = useState('');
  const [emailactive,setemailactive] = useState(false);
  const [finalactive,setfinalactive] = useState(false);
  
  useEffect(()=>{
    console.log('이메일상태값 변경등 이메일 적절여부 유효성::',changeemail,cernum);

    let emailRule= /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;//이메일 정규식

    if(!emailRule.test(changeemail)){
      console.log('이메일이 유효하지 않습니다.');
      setemailactive(false);
      return;
    }else{
      console.log('이메일이 유효합니다.');
      setemailactive(true);
    }
  },[changeemail,cernum]);

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //이메일변경시작 모달
  const emailChangeStartModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "이메일 재입력",
      content: { type: "text", text: `이메일을 변경하려면 다시 인증을 받아야 합니다.\n 삭제하고 다시 입력하시겠습니까?`, component: "" },
      submitnone: { show: true, title: "확인", event: async () => { offModal(); } },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
    });
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const emailModal = () => {

    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "이메일 변경",
      content: { type: "text", text: `이메일을 변경하시겠습니까?`, component: "" },
      submit: { show: false, title: "로그아웃", event: () => { offModal(); } },
      cancle: {
        show: false, title: "취소", event: () => {
          offModal();
        }
      },
      confirm: {
        show: true, title: "확인", event: async () => {
          offModal();

          let send_info = {
            email: changeemail,
            cernum_number: cernum
          };
          var cernumchk_validate_result = await serverController.connectFetchController('/api/cernum_validate_process_email', 'POST', JSON.stringify(send_info));

          if (cernumchk_validate_result) {
            console.log('cernumchk_vlidate_resultss:', cernumchk_validate_result);

            if (cernumchk_validate_result.success) {

            } else {
              //서버오류있거나, 인증번호일치하지않거나, 유효기간 지난것 한경우.
              alert(cernumchk_validate_result.message);
              return;
            }
          }

          // link:"/MyProfileSetting",
          console.log('===>이메일 변경 모달 확인', changeemail);
          const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
          if (!emailRegex.test(changeemail)) {
            alert('이메일 형식에 맞춰 작성해주세요.')
            return;
          }

          let body_info = {
            //prevemail_val : prevemail,
            changeemail_val: changeemail
          }
          let emailchange = await serverController.connectFetchController('/api/mypage/emailchange_request', 'POST', JSON.stringify(body_info));

          if (emailchange) {
            console.log('emailchange reusltssss:', emailchange);

            if (emailchange.success) {
              alert(emailchange.message);

              Login_userActions.emailchange({ emails: changeemail });
              history.push('/MyProfileSetting');
            } else {
              alert(emailchange.message);
            }
          }
        }
      },
      confirmgreen: {
        show: false, title: "확인", event: () => {
          offModal();

        }
      }

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
        <SubTitle title={"계정 설정"} noNeedAccount={true}/>
        <EmailChange emailChangeStartModal={emailChangeStartModal} emailModal={emailModal} setChangeemail={setChangeemail} changeemail={changeemail} cernum={cernum} setCernum={setCernum} emailactive={emailactive} finalactive={finalactive}/>
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
