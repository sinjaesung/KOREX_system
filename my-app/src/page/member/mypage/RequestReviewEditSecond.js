//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import RequestReviewEditSecond from '../../../component/member/mypage/property/RequestReviewEditSecond';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import ModalCommon from '../../../component/common/modal/ModalCommon';
import ModalPicture from '../../../component/member/mypage/property/modal/ModalPicture';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';


//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server request
import serverController from '../../../server/serverController';

export default function RequestEdit({prd_id}) {

  console.log('파람스', prd_id);

  ChannelServiceElement.shutdown();

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  

  const history = useHistory();

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  const brokerRequest_productinfo = useSelector(data => data.brokerRequest_product);//이전페이지에서 저장한 리덕스 정보인데, 기본적으로 기본정보는 항상 저장될것이고, 정상적 유입을 했다면 추가정보까진 아니라도 기본정보는 입력되어있을것이고, 기본정보도 비어있는채라면 새로고침형태로 접속한것이기에 이건 문제가 있는 비유효접속.

  //공통 flow 모든 마이페이지(로그인권한) 요구페이지에서 로그인,유효회원여부 쿼리 pagecompoentn단위에서 진행후 , 결과존재시에 유효회원일시 회원관련 리덕스정보저장. 모든페이지에 새로고침형태로 도달시에. 데이터 조회 및 유지를 위해 필요함(안정성) starts
  useEffect(async () => {

    console.log('mypage도달>>> 로그인세션여부검사 및 관련 조회::>>RequestReivewEidtSecond페이지도달::', brokerRequest_productinfo);
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

          console.log('추가정보 수정 전 기본정보 확인하기..',brokerRequest_productinfo);

          //기본정보 값이 입력되있지 않으면 추가수정 불가
          // if (!brokerRequest_productinfo.exclusive_periods || !brokerRequest_productinfo.maemulname || !brokerRequest_productinfo.maemultype || !brokerRequest_productinfo.include_managecost || !brokerRequest_productinfo.selltype || !brokerRequest_productinfo.sellprice || !brokerRequest_productinfo.exculsivedimension || !brokerRequest_productinfo.exculsivepyeong || !brokerRequest_productinfo.supplydimension || !brokerRequest_productinfo.supplypyeong) {
          //   //기본정보도 없다는것은 접속시점에 기본정보도 없다는것은 뭔가 시스템오류가 있거나, 새로고침으로 들어온경우가 거의 대부분.

          //   alert('유효하지않은 접근입니다.');
          //   history.push('/');
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
    if (login_user.user_type == '분양대행사' && (!BunyangTeam.bunyangTeam && !bunyangTeam.bunyangTeam.bp_id)) {
      serverController.connectFetchController(`/api/bunyang/team?no=${login_user.memid}`, 'GET', null, function (res) {
        if (res.success == 1) {
          BunyangTeam.updateBunyangTeam({ bunyangTeam: res.data[0] });
        }
      });
    }

  }, []);
  //login 유효성 관련 검증코드 ends

  const [rank, setRank] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const confirmModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "물건 (사용자의뢰) 수정",
      content: {
        type: "text",
        text: `정상적으로 처리되었습니다.`, component: ""
      },
      submit: { show: false, title: "확인", link: "/RequestReviewEdit", event: () => { offModal(); } },
      cancle: { show: false, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", link: "/PropertyManagement", event: () => { offModal(); } }
    });
  }

  //사진처리 관련(매물사진)
  const [serveruploadimgs_server, setServeruploadimgs_server] = useState([]);
  const [changeaddedimgs_server, setChangeaddedimgs_server] = useState([]);
  const [prdidinfo, setprdidinfo] = useState('')

  const updateModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: '사진업로드(기존 항목에 추가)',
      content: {
        type: "components", text: "TESESDGSDGSDG",
        component: <ModalPicture setServeruploadimgs_server={setServeruploadimgs_server} setChangeaddedimgs_server={setChangeaddedimgs_server} prd_id={prd_id} prdidinfo={prdidinfo}/>
      },
      submit: {
        show: true, title: '적용', event: () => {
          console.log('serveruploadimgs_server:', serveruploadimgs_server);

          offModal();
          //모달창 새로 열때마다 state는 초기화되는 개념이라고 보면되고, state는 유지된다. 유지된 state값으로 전달되어져서 넘긴다.
          console.log('사진업로드 적용 시점때 리덕스 저장해버리기', serveruploadimgs_server);

        }
      },
      cancle: { show: true, title: '초기화' },
      confirm: { show: false, title: "확인" }
    });
  }

  useEffect(() => {
    console.log('serveruploadimgs server변경 state변경::', serveruploadimgs_server);
  }, [serveruploadimgs_server]);

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
        {/*개인로 로그인했을때*/}
        {/*기업으로 로그인했을때*/}
        {
          login_user.user_type != '개인' ?
            <SubTitle title={login_user.company_name} arrow={"▼"} path={"/Team"} rank={true} cursor={"pointer"} />
            :
            <SubTitle title={"개인"} rank={false} cursor={"default"} />
        }
        <RequestReviewEditSecond confirmModal={confirmModal} updateModal={updateModal} serveruploadimgs_server={serveruploadimgs_server} changeaddedimgs_server={changeaddedimgs_server} prd_id={prd_id} setprdidinfo={setprdidinfo}/>
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