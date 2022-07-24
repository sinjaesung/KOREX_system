//react
import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import MyRequest from '../../../component/member/mypage/request/MyRequest';
import ModalFilter from '../../../component/member/mypage/request/modal/ModalFilter';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import ModalCommon from '../../../component/common/modal/ModalCommon';
import ModalManner from '../../../component/member/mypage/request/modal/ModalManner';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';


//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server controller
import serverController from '../../../server/serverController';

export default function Join() {

  ChannelServiceElement.shutdown();

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  const history = useHistory();

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  //공통 flow 모든 마이페이지(로그인권한) 요구페이지에서 로그인,유효회원여부 쿼리 pagecompoentn단위에서 진행후 , 결과존재시에 유효회원일시 회원관련 리덕스정보저장. 모든페이지에 새로고침형태로 도달시에. 데이터 조회 및 유지를 위해 필요함(안정성) starts
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

          let brokerRequest_info = {
            user_type: user_info.user_data.user_type,//개인회원이면 그 신청자 한명이 했었던 의뢰매물만 나오면되고, 기업회원이라면 그 회원의 소속companyid를 구하고, 그 comapnyid하 모든 memid들이 각rewqustememid인 내역들 구하낟. 유저 memid는 서버단 세션에서 점검하여 대조하여 비교, 개인회원인지 기업형태,분양사 회원인지 여부 판단.
          };
          console.log('>>>>post parameter list:', brokerRequest_info);
          try {
            let broker_res = await serverController.connectFetchController('/api/broker/user_brokerRequestlistview', 'post', JSON.stringify(brokerRequest_info));
            console.log('res_result:', broker_res);
            //alert(res);

            if (broker_res) {
              //setIs_serveron(true);
              if (broker_res.success) {
                if (broker_res.result_data) {
                  setBrokerproductlist(broker_res.result_data);

                }
              }
            }

          } catch (e) {
          }

          //내 중개의뢰페이지도달시에 해당 memid유저의 알람셋팅상태조회한다.
          let send_info = {
            mem_id: user_info.user_data.mem_id,
            user_type: user_info.user_data.user_type,
            company_id: user_info.user_data.company_id,
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

  const [brokerproductlist, setBrokerproductlist] = useState([]);
  const [alramsetting_tiny, setalramsetting_tiny] = useState({});

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, submitnone: {}, cancle: {}, confirm: {}, confirmgreen: {}, confirmgreennone: {}, content: {} });

  //필터사용 관련 useRef
  const orderby_ref = useRef();
  const prdstatus_ref = useRef();
  const maemultype_ref = useRef();

  //중개매너 평가 .임의 선택 중개사의 중개매너값 1~5값 단계.
  var score_input = 5;
  const scorechange = (event) => {
    score_input = event.target.value;
  }

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }


  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const mannerModal = async (company_id) => {
    //여기가 모달 키는 거에엽
    let body_info = {
      company_id: company_id
    };//전문중개사의 정보 개괄적으로 모두 다 얻습니다.
    let broker_res = await serverController.connectFetchController('/api/matterial/probrokerinfo_detail', 'POST', JSON.stringify(body_info));
    if (broker_res) {
      console.log('broker_resss::', broker_res);
    }
    setModalOption({
      show: true,
      setShow: offModal,
      title: "중개매너평가",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalManner broker_res={broker_res.result} scorechange={scorechange} /> },
      submit: { show: false, title: "적용", event: () => { offModal(); } },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirmgreennone: {
        show: true, title: "확인", event: async () => {
          offModal();

          let score_info = {
            mem_id: login_user.memid,//어떤memid유저가 점수매긴건지
            company_id: broker_res.result.probroker_info.company_id,//어떤 전문주액사 기업의
            cs_type: 1,//어떤 점수타입인지
            cs_point: score_input,//몇점 줬는지.
          }
          console.log('관련 선택 중개사 및 매긴 점수값::', broker_res, score_input);
          let score_res = await serverController.connectFetchController('/api/broker/probroker_score_eval', 'POST', JSON.stringify(score_info));
          if (score_res) {
            if (score_res.success) {
              alert('평가 완료되었습니다.');
            } else {

            }
          }
        }
      }
    });
  }

  const filterModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "필터",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalFilter orderby_ref={orderby_ref} maemultype_ref={maemultype_ref} prdstatus_ref={prdstatus_ref} /> },
      submitnone: {
        show: true, title: "적용", event: async () => {
          offModal();
          const orderby = document.querySelector('.OptionSelect').getAttribute('option');
          const prdstatus = document.querySelector('.OptionSelect2').getAttribute('option');
          const maemultype = document.querySelector('.OptionSelect3').getAttribute('option');
          // console.log(orderby_ref.current.value);
          // console.log(prdstatus_ref.current.value);
          // console.log(maemultype_ref.current.value);
          let body_info = {
            user_type: login_user.user_type,
            // orderby : orderby_ref.current.value,
            orderby: orderby,
            // maemultype: maemultype_ref.current.value,
            maemultype: maemultype,
            // prdstatus: prdstatus_ref.current.value
            prdstatus: prdstatus
          };
          let result = await serverController.connectFetchController('/api/broker/user_brokerRequestlistview_filter2', 'POST', JSON.stringify(body_info));

          if (result) {
            if (result.success) {
              if (result.result_data) {
                console.log('result resultsdatasss:', result.result_data);
                setBrokerproductlist(result.result_data);
              }
            }
          }
        }
      },
      cancle: { show: true, title: "초기화", event: () => { offModal(); } },
      confirmgreennone: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }

  const cancleModal = (prd_identity_id_val, company_id_val, request_mem_id_val) => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "중개의뢰 철회",
      content: { type: "text", text: `정말 의뢰를 철회하시겠습니까?`, component: "" },
      submit: {
        show: true, title: "확인", event: async () => {
          offModal();
          //prd_idneity_id어떤매물을,그 매물을 어떤사업체가companyid,그 매물에 대해 업뎃할 상태값(prd_status_val) 넘기기기필요, notifiaciton정보엔 prd_idneitityid,해당 매물을 위임한 사업체id(그걸 이용해 그 소속의 모든 팀원들에게전송), 메시지내용 등.
          let body_info = {
            prd_identity_id: prd_identity_id_val,//어떤 매물 관련 매물인지
            company_id: company_id_val,//어떤 수임 전문중개사인지
            prd_status_val: '의뢰철회',
            generator_memid: login_user.memid,
            change_reason: ''
          };
          console.log('의뢰 철회 생성된 매물 의뢰매물으 상태값 의뢰철회상태로 상태값 변경insert추가:', JSON.stringify(body_info));
          let res = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(body_info));
          console.log('res resultsss:', res); //해당 매물관련된 내역 상태변경내역을 추가할뿐이다.

          if (res) {
            if (res.success) {
              alert('의뢰철회 처리되었습니다.');
              let noti_info = {
                prd_identity_id: prd_identity_id_val,//어떤 매물 관련 매물에 대한건지
                company_id: company_id_val,//어떤 수임전문중개사 소속에게 보낼건지
                message: request_mem_id_val + 'memid 의뢰자  ' + prd_identity_id_val + '::txn_id매물 의뢰철회 하였습니다.',
                noti_type: 4
              }
              let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
              if (noti_res) {
                if (noti_res.success) {
                  console.log('noti_ressss:', noti_res);
                }
              }
              history.push('/Mypage');
            } else {
              alert(res.message);
            }
          }
        }
      },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirmgreennone: {
        show: false, title: "확인", event: () => {
          offModal();
        }
      }
    });
  }

  const startModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "중개 거래개시",
      content: { type: "text", text: `거래를 개시하시겠습니까?`, component: "" },
      submit: { show: true, title: "확인", event: () => { offModal(); } },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirmgreennone: {
        show: false, title: "확인", event: (prd_identity_id) => {
          offModal();

          history.push('/Preview/' + prd_identity_id);//미리보기 페이지로 이동!(로그인여부 상관없음) 보안등의 처리 추후에.
        }
      }
    });
  }

  const cancle2Modal = (prd_identity_id_val, company_id_val, request_mem_id_val) => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "위임 취소",
      content: { type: "text", text: `위임 취소하시겠습니까?`, component: "" },
      submit: {
        show: true, title: "확인", event: async () => {
          offModal();
          //개인기업회원이 위임취소요청을 액션발생시에 관련 전문중개사에게 위임취소한다. 관련 내역을 history insert update하면 될뿐이다.
          let body_info = {
            prd_identity_id: prd_identity_id_val,//어떤 관련 매물인지
            company_id: company_id_val,//어떤 수임 전문중개사인지
            prd_status_val: '위임취소',
            generator_memid: login_user.memid,
            change_reason: ''
          };
          console.log('위임취소 생성된 매물 의뢰매물으로 상태값 위임취소 상태값 변경insert추가:', JSON.stringify(body_info));
          let res = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(body_info));
          console.log('res resultsss:', res);

          if (res) {
            if (res.success) {
              alert('위임 취소처리되었습니다.');
              let noti_info = {
                prd_identity_id: prd_identity_id_val,//어떤 매물 관련 매물에 대한건지
                company_id: company_id_val,//어떤 수임전문중개사 소속에게 보낼건지
                message: request_mem_id_val + 'memid 의뢰자 ' + prd_identity_id_val + '::txn_id매물 위임취소 하였습니다.',
                noti_type: 4
              };
              let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
              if (noti_res) {
                if (noti_res.success) {
                  console.log('noti_resss ruseltsss:', noti_res);
                }
              }
              history.push('/Mypage');
            } else {
              alert(res.message);
            }
          }
        }
      },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirmgreennone: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }

  const completeModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "거래 완료",
      content: { type: "text", text: `거래를 완료하시겠습니까?`, component: "" },
      submit: { show: true, title: "확인", event: () => { offModal(); } },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirmgreennone: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/*
            <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
            <LiveModal live={live} setLive={setLive}/>
            <ModalCalendar cal={cal} setCal={setCal}/>
            <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
            <MainHeader openBunyang={openBunyang}/>
          */}
        <CommonHeader />
        {
          login_user.user_type == '개인' ?
            <SubTitle title='개인' rank={false} cursor={"default"} />
            :
            <SubTitle title={login_user.company_name} arrow={"▼"} path={"/Team"} rank={true} cursor={"pointer"} />
        }
        <MyRequest mannerModal={mannerModal} cancleModal={cancleModal} filterModal={filterModal} startModal={startModal} cancle2Modal={cancle2Modal} completeModal={completeModal} brokerproductlist={brokerproductlist} setBrokerproductlist={setBrokerproductlist} alramsetting_tiny={alramsetting_tiny} setalramsetting_tiny={setalramsetting_tiny} />
        <ModalCommon modalOption={modalOption} />
      </div>
      <CommonFooter />
      {/*
            <TermService termservice={termservice} openTermService={openTermService}/>
            <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
            <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
            <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/>
          */}
    </div>
  );
}