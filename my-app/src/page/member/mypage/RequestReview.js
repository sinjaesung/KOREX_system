//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import RequestReview from '../../../component/member/mypage/property/RequestReview';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import ModalCommon from '../../../component/common/modal/ModalCommon';
import ModalCancle from '../../../component/member/mypage/property/modal/ModalCancle';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//server porcess
import serverController from '../../../server/serverController';

//redux addons developer elements
import { useSelector } from 'react-redux';
import { brokerRequest_productEditActions } from '../../../store/actionCreators';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

export default function RequestReviews({ match }) {

  ChannelServiceElement.shutdown();

  console.log('REquestReview넘겨받은 id값:', match.params);
  var prd_identity_id = match.params.id;//해당 prd_identity_id에 해당하는 상품(매물요청)을 구한다.

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

          //페이지파라미터값을 통해서 페이지불러온 시점때 가져와서 처리한다.
          let body_info = {
            prd_identity_idval: prd_identity_id
          }
          let ress = await serverController.connectFetchController('/api/broker/brokerRequest_productview', 'POST', JSON.stringify(body_info));
          console.log('=>>>>requestReview/view ->>> ', ress, ress.result_data[0]);//result_data의 첫 데이터는 가장초기의 매물수정히스토리내역이다.상태변경내역수정리스트(가장초기의 내역에 최근 수정된 매물의 정보가 담겨있고,가장 마지막 내역에 말그대로 최근 상태값이 저장되어있음.)
          let result_data_length = ress.result_data.length;
          let now_prd_status = ress.result_data[result_data_length - 1].prd_status;
          console.log('===>>>request rewview 검토대기,검토중 매물 현재 상태값::', now_prd_status);
          setNowprdstatus(now_prd_status);
          setBrokerRequest_product(ress.result_data[0]);

          console.log('-=>>>>>>리덕스 정보 저장(불러온 product데이터 저장:::');
          //리덕스 정보 저장..(기본정보불러오기)
          //brokerRequest_productEditActions.addresschange({addresss: res.result_data[0].address + ' '+res.result_data[0].addr_detail});

          brokerRequest_productEditActions.companyidchange({ companyids: ress.result_data[0].company_id });
          brokerRequest_productEditActions.prdidentityidchange({ prd_identity_ids: prd_identity_id });
          brokerRequest_productEditActions.requestmemidchange({ requestmemids: ress.result_data[0].request_mem_id });

          let statusupdate_info = {
            prd_identity_id: prd_identity_id,
            company_id: ress.result_data[0].company_id,
            prd_status_val: '검토중',
            generator_memid: login_user.memid,
            change_reason: ''
          };
          console.log('페이지 로드 시점 상태값 변경 쿼리 await진행>>', statusupdate_info);
          let prdstatus_res = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(statusupdate_info));
          console.log('res resultsss:', ress);

          if (prdstatus_res) {
            if (prdstatus_res.success) {

            } else {
              alert(prdstatus_res.message + '매물상태변경 쿼리 서버오류');
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
    console.log(BunyangTeam.bunyangTeam);
    if (login_user.user_type == '분양대행사' && (!BunyangTeam.bunyangTeam && !bunyangTeam.bunyangTeam.bp_id)) {
      serverController.connectFetchController(`/api/bunyang/team?no=${login_user.memid}`, 'GET', null, function (res) {
        if (res.success == 1) {
          BunyangTeam.updateBunyangTeam({ bunyangTeam: res.data[0] });
        }
      });
    }

  }, []);
  //login 유효성 관련 검증코드 ends

  //server brokerRequest_product info view load
  const [brokerRequest_product, setBrokerRequest_product] = useState('');
  const [nowprdstatus, setNowprdstatus] = useState('');
  const [disabled, setDisabled] = useState(true);

  const [cancle, setCancle] = useState(false);
  const [accept, setAccept] = useState(false);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  //의뢰거절 사유 
  const [cancleMessage, setCancleMessage] = useState('');
  const brokerRequest_productinfo = useSelector(data => data.brokerRequest_product);

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;

    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const acceptModal = () => {
    //여기가 모달 키는 거에엽
    console.log('수락모달창:::', brokerRequest_productinfo);
    setModalOption({
      show: true,
      setShow: offModal,
      title: "의뢰접수 수락",
      content: {
        type: "text",
        text: `의뢰인과 사전에 통화하여\n접수내용을 충분히 확인하시고\n의뢰 수락을 하시는 것이 좋습니다.\n의뢰를 수락하시겠습니까?`, component: ""
      },
      submit: {
        show: false, title: "확인", event: () => {

        }
      },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirm: {
        show: true, title: "확인", event: async () => {

          offModal();
          let body_info = {
            prd_identity_id: brokerRequest_productinfo.prdidentityid,
            company_id: brokerRequest_productinfo.companyid,
            prd_status_val: '거래준비',
            generator_memid: login_user.memid,
            change_reason: ''
          };
          console.log('의뢰 수락 생성된 매물 의뢰매물의 상태값 검토대기->거래준비로 상태값만 변경:', JSON.stringify(body_info));
          let res = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(body_info));
          console.log('res result:', res);

          if (res) {
            if (res.success) {
              alert('검토대기 -> 거래준비 수락되었습니다!');
              //상태변경내역화면으로 이동시키기 전에 서버에 반영(상태가 변경 insert를 진행한다. ) -> 알림도 insert한다. 의뢰수락(검토결과 검토대기->거래준비)결과 알림
              let noti_info = {
                prd_identity_id: brokerRequest_productinfo.prdidentityid,
                request_mem_id: brokerRequest_productinfo.requestmemid,
                request_company_id: brokerRequest_product.request_company_id,//의뢰한 사람의 신청당시의 소속companyind값.
                message: '의뢰접수검토결과입니다.\n 의뢰수락처리 되었습니다.', //거절 메시지값.
                noti_type: 1
              }
              let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
              if (noti_res) {
                if (noti_res.success) {
                  console.log('noti_resss:', noti_res);
                }
              }
              history.push('/Mypage');
            } else {
              alert(res.message);
            }
          }

        }
      }
    });
  }

  //만약에 다른걸 키고 싶으면 아래 함수 호출하시면됩니다.
  const cancleModal = () => {
    console.log('거절모달창:::', brokerRequest_productinfo);
    setModalOption({
      show: true,
      setShow: offModal,
      title: "의뢰접수 거절",
      content: { type: "component", text: `ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`, component: <ModalCancle setCancleMessage={setCancleMessage} /> },
      submit: {
        show: false, title: "확인", event: () => {
          offModal();

        }
      },
      cancle: { show: false, title: "취소", event: () => { offModal(); } },
      confirm: {
        show: true, title: "confirm", event: async () => {
          //alert('의뢰접수거절');  

          let body_info = {
            prd_identity_id: brokerRequest_productinfo.prdidentityid,
            company_id: brokerRequest_productinfo.companyid,
            prd_status_val: '의뢰거절',
            generator_memid: login_user.memid,
            change_reason: cancleMessage
          };
          console.log('의뢰 수락 생성된 매물 의뢰매물의 상태값 검토대기->의뢰거절로 상태값만 변경:', JSON.stringify(body_info), cancleMessage);

          let res = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(body_info));
          console.log('res result:', res);

          if (res) {
            if (res.success) {
              alert('검토대기 -> 의뢰거절 거절되었습니다!');
              //상태변경내역화면으로 이동시키기 전에 서버에 반영(상태가 변경 insert를 진행한다. ) -> 알림도 insert한다. 의뢰수락(검토결과 검토대기->거래준비)결과 알림
              let noti_info = {
                prd_identity_id: brokerRequest_productinfo.prdidentityid,
                request_mem_id: brokerRequest_productinfo.requestmemid,
                request_company_id: brokerRequest_product.request_company_id,//의뢰한 사람의 신청당시의 소속companyind값.
                //prd_status_val : '의뢰거절',
                message: '의뢰접수검토결과입니다.\n 의뢰거절처리 되었습니다. \n 거절사유:' + cancleMessage, //거절 메시지값.
                noti_type: 1 // 1:의뢰검토결과(거절,수락)  2:??, 3:,...???
              }
              let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
              if (noti_res) {
                if (noti_res.success) {
                  console.log('noti_resss:', noti_res);
                } else {
                  alert('알람 발송 오류');
                }
              }
              history.push('/Mypage');
            } else {
              alert(res.message);
            }
          }

        }
      },
      confirmgreen: {
        show: false, title: "확인", link: "/sdgsdgasdg", event: (e) => {

        }
      }
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
        <SubTitle title={"소속명"} arrow={"　▼"} rank={false} path={"/Team"} cursor={"pointer"} />
        <RequestReview brokerRequest_product={brokerRequest_product} cancleModal={cancleModal} acceptModal={acceptModal} setAccept={setAccept} setCancle={setCancle} disabled={disabled} nowprdstatus={nowprdstatus} />
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