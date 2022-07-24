//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import NewPropertySecond from '../../../component/member/mypage/property/NewPropertySecond';
import ModalPicture from '../../../component/member/mypage/property/modal/ModalPicture';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import ModalCommon from "../../../component/common/modal/ModalCommon";
import ModalCommonWithoutcancel from "../../../component/common/modal/ModalCommonWithoutcancel";

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server request
import serverController from '../../../server/serverController';


export default function Join() {
  ChannelServiceElement.shutdown();

  //이전페이지 addProprerty등에서 입력했었던 검색했었던 건물의정보값이다

  const tempBrokerRequests = useSelector(data => data.tempBrokerRequest);
  console.log('===========>>addPorpertysecond페잊 얻어온 전 redux정보:', tempBrokerRequests);

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

          if (!tempBrokerRequests.dangijibunaddress || !tempBrokerRequests.dangiroadaddress || !tempBrokerRequests.floor || !tempBrokerRequests.maemultype || !tempBrokerRequests.name || !tempBrokerRequests.phone || !tempBrokerRequests.x || !tempBrokerRequests.y) {
            //선택입력한 아파트오피스텔의 단지주소값, 선택층, 매물타입, 외부의뢰인 이름,폰, 선택되어져서 나와져있는 단지의(아파트,오피스텔) 또는 검색floor의 x,y위치좌표값.이게 없다는것은 문제가있는 비유효접근.
            // alert('유효하지않은 접근이거나 선택한 건물의 공간위치x,y값이 유효하지않습니다.');
            // history.push('/AddProperty');
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
          BunyangTeam.updateBunyangTeam({ bunyangTeam: res.data[0] });
        }
      });
    }

  }, []);

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const nextModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "중개의뢰",
      content: { type: "text", text: `의뢰내용 확실하게 작성하셨나요?\n전문중개사가 의뢰 를 수락하게 되면,\n내용 수정은 전문중개사에게 요청해야 가능합니다.\n중개의뢰를 신청하시겠습니까?`, component: "" },
      submit: { show: true, title: "확인", link: "/AddPropertyThird", event: () => { offModal(); } },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }

  const saveNext = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "기본정보저장",
      content: { type: "text", text: `저장되었습니다.\n 종료 시 추후에 추가정보를 입력하셔야 합니다.\n추가 정보를 입력하시겠습니까?`, component: "" },
      cancle: { show: true, title: "종료", link: "/PropertyManagement", event: () => { offModal(); } },
      submit: { show: true, title: "추가정보입력", link: "/AddPropertyThird",event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }

//@@--- 중개의뢰인 경우 mode=0, 외부수임인 경우 mode=1
  const mode = 1;
//---@@
  
  const [serveruploadimgs_server, setServeruploadimgs_server] = useState([]);//서버에 반영할 최종적 이미지업로드 리스트.(inserted만 진행.)
  const [changeaddedimgs_server, setChangeaddedimgs_server] = useState([]);


  const [sort, setSort] = useState(0);
  const [condi, setCondi] = useState(0);

  const [imgfiles, setimgfiles] = useState([])
  const [originalfiles, setoriginalfiles] = useState([])

  const updateModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: '사진업로드',
      content: {
        type: "components", text: "TESESDGSDGSDG",
        component: <ModalPicture setServeruploadimgs_server={setServeruploadimgs_server} setChangeaddedimgs_server={setChangeaddedimgs_server} serveruploadimgs_server={serveruploadimgs_server} changeaddedimgs_server={changeaddedimgs_server} imgfiles={imgfiles} setimgfiles={setimgfiles} offModal={offModal} originalfiles={originalfiles} setoriginalfiles={setoriginalfiles} />
      },
    });
  }

  useEffect(() => {
    console.log('serveruprlaodinmsg server변경 state변경::', serveruploadimgs_server);

    /*if(serveruploadimgs_server.length <3){
      alert('사진은 최소 3장 등록해주세요.');
      return;
    }*/

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
        <SubTitle title={"물건 등록"} rank={false} cursor={"default"} />
        <NewPropertySecond mode={mode} nextModal={nextModal} saveNext={saveNext} updateModal={updateModal} serveruploadimgs_server={serveruploadimgs_server} changeaddedimgs_server={changeaddedimgs_server}/>
        {/* <ModalCommon modalOption={modalOption} /> */}
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
