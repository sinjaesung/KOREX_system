//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import NewRequestBrokerSecond from '../../../component/member/mypage/request/NewRequestBrokerSecond';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import ModalCommon from "../../../component/common/modal/ModalCommon";

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server
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

          //선택건물등 선택입력정보사항에 수임전문중개사정보를 통해 전문중개사 정보를 모두 가져옵니다.tempBrokerRequest.companyid등의 사전 리덕스정보가 유지된상태에서만 실행되어야 적절하게 오류없이 나올수 있습니다.
          if (tempBrokerRequest.companyid && (tempBrokerRequest.dangijibunaddress || tempBrokerRequest.dangiroadaddress)) {
            let body_infoss = {
              company_id: tempBrokerRequest.companyid
            }
            console.log(body_infoss);
            let result_set = await serverController.connectFetchController('/api/mypage/probroker_info_single', 'POST', JSON.stringify(body_infoss));

            if (result_set) {
              console.log('resultsss:', result_set);

            }

            //페이지 도달시점에 실행, 임의 특정 선택된 중개사회원사업체의 companyid에 수임하고있는 관련 내역 리스팅.
            let body_info22 = {
              company_id: tempBrokerRequest.companyid,
              user_type: '중개사'
            }
            let transactionlist = await serverController.connectFetchController('/api/broker/brokerProduct_commit_liststatic', 'POST', JSON.stringify(body_info22));

            if (transactionlist) {
              console.log('====>>resultss:', transactionlist);
              let brokerRequest_commit_transactionlist = transactionlist.result_data;

              var txn_status_structure = {
                now_doing: {
                  'jeonse': [],
                  'walse': [],
                  'maemae': []
                },
                complete: {
                  'jeonse': [],
                  'walse': [],
                  'maemae': []
                }
              };

              if (brokerRequest_commit_transactionlist) {
                for (let ss = 0; ss < brokerRequest_commit_transactionlist.length; ss++) {
                  let txn_status = brokerRequest_commit_transactionlist[ss].transaction_status;
                  let productinfo = brokerRequest_commit_transactionlist[ss].match_product;
                  console.log('hmm????>>>', txn_status, productinfo);
                  if (txn_status == '거래완료') {
                    switch (productinfo.prd_sel_type) {
                      case '월세':
                        txn_status_structure['complete']['walse'].push(productinfo);
                        break;

                      case '전세':
                        txn_status_structure['complete']['jeonse'].push(productinfo);
                        break;

                      case '매매':
                        txn_status_structure['complete']['maemae'].push(productinfo);
                        break;
                    }
                  // } else if (txn_status == '검토대기' || txn_status == '검토중' || txn_status == '거래준비' || txn_status == '거래개시요청' || txn_status == '거래개시' || txn_status == '거래개시승인 요청' || txn_status == '거래완료승인 요청' || txn_status == '거래승인 요청') {
                  //   switch (productinfo.prd_sel_type) {
                  //     case '월세':
                  //       txn_status_structure['now_doing']['walse'].push(productinfo);
                  //       break;

                  //     case '전세':
                  //       txn_status_structure['now_doing']['jeonse'].push(productinfo);
                  //       break;

                  //     case '매매':
                  //       txn_status_structure['now_doing']['maemae'].push(productinfo);
                  //       break;
                  //   }

                  }
                }

                console.log('txn status sturcture all form:', txn_status_structure);
                //setTxnstatus_structure(txn_status_structure);

                setProbrokersingleinfo({
                  pro_apt_id:result_set.result.pro_apt_id?result_set.result.apt_name:'',
                  pro_oft_id:result_set.result.pro_oft_id?result_set.result.oft_name:'',
                  is_pro_store:result_set.result.is_pro_store?result_set.result.is_pro_store:'',
                  is_pro_office:result_set.result.is_pro_office?result_set.result.is_pro_office:'',
                  profile:result_set.result.profile_img?result_set.result.profile_img:'',
                  name:result_set.result.company_name?result_set.result.company_name:'',
                  address:result_set.result.addr_road?result_set.result.addr_road:'',
                  trade:txn_status_structure.complete.maemae.length,
                  jeonse:txn_status_structure.complete.jeonse.length,
                  walse:txn_status_structure.complete.walse.length
                })
              }

            }
          } else {
            // alert('적절하지않은 접근입니다!');
            // history.push('/AddRequest');
            //return;
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

  const tempBrokerRequest = useSelector(data => data.tempBrokerRequest);//선택 입력건물정보 이게 있어야만 정상적 페이지출력가능. 새로고침형태로 접근시 리덕스데이터는 없기에 페이지 정상 출력불가함.
  const [probrokersingleinfo, setProbrokersingleinfo] = useState({});//선택전문중개사의 정보
  const [txnstatus_structure, setTxnstatus_structure] = useState({});//선택전문중개사가 수임매물들 정보.
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });


  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }


  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const successModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "중개의뢰",
      content: { type: "text", text: `중개의뢰신청이 접수되었습니다.\n전문중개사가 의뢰검토 후 결과 알려드립니다.`, component: "" },
      submit: { show: false, title: "적용", event: () => { offModal(); } },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", link: "/PropertyManagement", event: () => { offModal(); } }

    });
  }

  const failModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "중개의뢰",
      content: { type: "text", text: `등록 불가합니다.\n이미 중개 의뢰된 물건입니다.\n상기 사유에 해당하지 않는 경우,\n고객센터로 문의해주세요.`, component: "" },
      submit: { show: false, title: "적용", event: () => { offModal(); } },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreen: { show: true, title: "확인", event: () => { offModal(); } }

    });
  }

  //@@--- 중개의뢰인 경우 mode=0, 외부수임인 경우 mode=1
  const mode = 0;
  //---@@

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
        <SubTitle title={"중개의뢰 추가"} rank={false} cursor={"default"} />
        <NewRequestBrokerSecond mode={mode} successModal={successModal} failModal={failModal} probrokersingleinfo={probrokersingleinfo} txnstatus_structure={txnstatus_structure} />
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

