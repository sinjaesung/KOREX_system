//react
import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import RequestReviewEdit from '../../../component/member/mypage/property/RequestReviewEdit';
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

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

//redux
import { useSelector } from 'react-redux';
import { brokerRequest_productEditActions } from '../../../store/actionCreators';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server process
import serverController from '../../../../src/server/serverController';

export default function Join({ match }) {
  ChannelServiceElement.shutdown();

  //사용자의뢰로 넘어온 or 외부수임 물건에 대한 물건수정 페이지입니다. 물건을 수정할뿐임(기본정보수정) 거래준비품목에 대해서 정보 수정, 개인기업회원입장에선 중갱릐뢰 검토대기,검토중, 거래준비되기전까진 중개의뢰수정(EditRequest)내 중개의뢰수정 가능.내가 의뢰한 물건 수정하기  /  중개사>>RequestReviewEdit(의뢰받은or외부수임해서 등록한 물건)에 대한 수정(기본,추가정보)
  console.log('requestReviewEdit넘겨받은 id값:', match.params);
  var prd_identity_id = match.params.id;//해당 prdidientiyid에 해당하는 상품(매물요청,외부수임물건)을 구한다.

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  const [nowprdstatus, setNowprdstatus] = useState('');//최근 수정값.
  const [disabled, setDisabled] = useState(false);

  const [probrokerinfo, setprobrokerinfo] = useState({})

  const [rank, setRank] = useState(false);

  const history = useHistory();

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  const [prd_state, setprd_state] = useState('')


  //공통 flow 모든 마이페이지(로그인권한) 요구페이지에서 로그인,유효회원여부 쿼리 pagecompoentn단위에서 진행후 , 결과존재시에 유효회원일시 회원관련 리덕스정보저장. 모든페이지에 새로고침형태로 도달시에. 데이터 조회 및 유지를 위해 필요함(안정성) starts
  useEffect(async () => {
    

    console.log('test확인1', prd_identity_id);

    // let res = await serverController.connectFetchController(`/api/products/${prd_identity_id}?prd_field_all=1 `, 'get');
    let res = await serverController.connectFetchController(`/api/products/${prd_identity_id} `, 'get');

    console.log('한가지 물건 정보 가져오기', res );
    console.log('한가지 물건 정보 가져오기', res.data );

    setprd_state(res.data.prd_status)
    //중개사 정보
    let res2 = await serverController.connectFetchController(`/api/realtors/${res.data.company_id}/pro/info`, 'GET');
    console.log('확인987987987', res2);
    setprobrokerinfo(res2.data)

    // console.log('mypage도달>>> 로그인세션여부검사 및 관련 조회::');
    let resss = await serverController.connectFetchController('/api/auth/islogin', 'get');
    // //마이페이지 도달시에도 정보 저장 마이펭지 표면 노출되는 유저이름,프로필url등 state바로저장. 
     if (resss) {
       if (resss.login_session == null) {
         //alert('비로그인 상태입니다.'); 유효하지않은 정보인경우or비로그인
         Login_userActions.isloginchange({ islogins: 0 });
         history.push(`/MemberLogin`);
         //비로그인상태라면 로그인페이지 이동처리!
        return;
       } else {
         var get_memid = resss.login_session.user_id;//mem_id 얻기
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

           //정보조회. 매물정보 조회
           let prd_info = {
             prd_identity_idval: prd_identity_id
           }
           let prd_res = await serverController.connectFetchController('/api/broker/brokerRequest_productview', 'POST', JSON.stringify(prd_info));
           console.log('=>>>>requestReview/view ->>> ', prd_res, prd_res.result_data[0]);//result_data의 첫 데이터는 가장초기의 매물수정히스토리내역이다.상태변경내역수정리스트(가장초기의 내역에 최근 수정된 매물의 정보가 담겨있고,가장 마지막 내역에 말그대로 최근 상태값이 저장되어있음.) 거래준비 최신 상태값의 매물에 대한 정보 조회 리덕스 저장 및 수정처리.
           console.log('test확인 E',prd_res.result_data[0]);
           console.log('test확인 E',prd_res);

           let result_data_length = prd_res.result_data.length;
           let now_prd_status = prd_res.result_data[result_data_length - 1].prd_status;
           console.log('===>>>request rewview 검토대기,검토중 매물 현재 상태값::', now_prd_status);
           setNowprdstatus(now_prd_status);
          
           console.log('-=>>>>>>리덕스 정보 저장(불러온 product데이터 저장::: ', prd_res.result_data[0]);
           console.log('랜더링확인 1번 여기는 아니다. ', prd_res.result_data[0]);
           console.log('여기를 확인. ', prd_res.result_data[0]);
           console.log('-=>>>>>>리덕스 정보 저장(불러온 product데이터 저장:::');
          
 
           //리덕스 정보 저장..(기본정보불러오기)
           brokerRequest_productEditActions.addresschange({ addresss: prd_res.result_data[0].address + ' ' + prd_res.result_data[0].addr_detail });

           brokerRequest_productEditActions.companyidchange({ companyids: prd_res.result_data[0].company_id });
           brokerRequest_productEditActions.prdidentityidchange({ prd_identity_ids: prd_identity_id });
           brokerRequest_productEditActions.requestmemidchange({ requestmemids: prd_res.result_data[0].request_mem_id });
           brokerRequest_productEditActions.exculsivedimensionchange({ exculsivedimensions: prd_res.result_data[0].exclusive_area });
           brokerRequest_productEditActions.exculsivepyeongchange({ exclusivepyeongs: prd_res.result_data[0].exclusive_pyeong });
           brokerRequest_productEditActions.maemultypechange({ maemultypes: prd_res.result_data[0].prd_type });
           brokerRequest_productEditActions.maemulnamechange({ maemulnames: prd_res.result_data[0].prd_name });

           brokerRequest_productEditActions.selltypechange({ selltypes: prd_res.result_data[0].prd_sel_type });
           brokerRequest_productEditActions.sellpricechange({ sellprices: prd_res.result_data[0].prd_price });

           brokerRequest_productEditActions.managecostchange({ managecosts: prd_res.result_data[0].managecost });
           brokerRequest_productEditActions.ibjuisinstantchange({ is_immediate_ibjus: prd_res.result_data[0].is_immediate_ibju });
           brokerRequest_productEditActions.ibjuspecifydatechange({ ibju_specifydates: prd_res.result_data[0].ibju_specifydate });

           brokerRequest_productEditActions.namechange({ names: prd_res.result_data[0].request_mem_name });
           brokerRequest_productEditActions.phonechange({ phones: prd_res.result_data[0].request_mem_phone });

           brokerRequest_productEditActions.supplydimensionchange({ supplydimensions: prd_res.result_data[0].supply_area });
           brokerRequest_productEditActions.supplypyeongchange({ supplypyeongs: prd_res.result_data[0].supply_pyeong });
           brokerRequest_productEditActions.requestmannamechange({ requestmannames: prd_res.result_data[0].request_mem_name });
           brokerRequest_productEditActions.requestmemphonechange({ requestmemphones: prd_res.result_data[0].request_mem_phone });

           // //추가정보 리덕스 저장.추가정보 미 저장된 product일수도 있음. 처음 들어온경우는 비어있음.
           brokerRequest_productEditActions.bathroomcountchange({ bathroomcounts: prd_res.result_data[0].bathroom_count });
           brokerRequest_productEditActions.directionchange({ directions: prd_res.result_data[0].direction });
           brokerRequest_productEditActions.entrancechange({ entrances: prd_res.result_data[0].entrance });
           brokerRequest_productEditActions.heatfueltypechange({ heatfueltypes: prd_res.result_data[0].heat_fuel_type });
           brokerRequest_productEditActions.heatmethodtypechange({ heatmethodtypes: prd_res.result_data[0].heat_method_type });
           brokerRequest_productEditActions.iselevatorchange({ iselevators: prd_res.result_data[0].is_elevator });
           brokerRequest_productEditActions.isparkingchange({ isparkings: prd_res.result_data[0].is_parking });
           brokerRequest_productEditActions.is_contract_renewalchange({ is_contract_renewals: prd_res.result_data[0].is_contract_renewal });
           brokerRequest_productEditActions.is_duplex_floorchange({ is_duplex_floors: prd_res.result_data[0].is_duplex_floor });
           brokerRequest_productEditActions.is_petchange({ is_pets: prd_res.result_data[0].is_pet });
           brokerRequest_productEditActions.loanpricechange({ loanprices: prd_res.result_data[0].loanprice });
           brokerRequest_productEditActions.maemuldescriptionchange({ maemuldescriptions: prd_res.result_data[0].prd_description });
           brokerRequest_productEditActions.maemuldescriptiondetailchange({ maemuldescriptiondetails: prd_res.result_data[0].prd_description_detail });
           brokerRequest_productEditActions.managecostchange({ managecosts: prd_res.result_data[0].managecost });
           brokerRequest_productEditActions.monthbaseguaranteepricechange({ monthbaseguranteeprices: prd_res.result_data[0].month_base_guaranteeprice });
           brokerRequest_productEditActions.parking_optionchange({ parking_option: prd_res.result_data[0].parking_option });
           brokerRequest_productEditActions.roomcountchange({ roomcounts: prd_res.result_data[0].room_count });
           // brokerRequest_productEditActions.roomtypechange({roomtypes: res.result_data[0].room_type});
           brokerRequest_productEditActions.security_optionchange({ security_options: prd_res.result_data[0].security_option });
           brokerRequest_productEditActions.prdimgschange({ prdimgs: prd_res.result_data[0].prd_imgs });

           brokerRequest_productEditActions.isrightspricechange({ is_rightsprice: prd_res.result_data[0].is_rightprice });
           brokerRequest_productEditActions.istoiletchange({ istoilet: prd_res.result_data[0].is_toilet });
           brokerRequest_productEditActions.isinteriorchange({ isinterior: prd_res.result_data[0].is_interior });
           brokerRequest_productEditActions.recommend_jobstorechange({ recommend_jobstore: prd_res.result_data[0].recommend_jobstore });
           brokerRequest_productEditActions.room_structurechange({ room_structure: prd_res.result_data[0].room_structure });

           if (prd_res.result_data[0].prd_type == '오피스텔') {
             brokerRequest_productEditActions.officetelspace_optionchange({ officetelspace_option: prd_res.result_data[0].space_option });
           } else {
             brokerRequest_productEditActions.standardspace_optionchange({ standardspace_option: prd_res.result_data[0].space_option });
           }

           if (prd_res.result_data[0].prd_type == '오피스텔') {
             brokerRequest_productEditActions.officeteloptionchange({ officeteloption: prd_res.result_data[0].prd_option });
           } else if (prd_res.result_data[0].prd_type == '상가' || prd_res.result_data[0].prd_type == '사무실') {
             brokerRequest_productEditActions.storeofficeoptionchange({ storeofficeoption: prd_res.result_data[0].prd_option });
           }

           //로그인정보 관련 처리. 리덕스 저장처리.
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
            <SubTitle title={login_user.company_name} path={"/Team"} />
            :
            <SubTitle />
        }

        <RequestReviewEdit disabled={false} nowprdstatus={nowprdstatus} probrokerinfo={probrokerinfo} prd_id={prd_identity_id} prd_state={prd_state}/>
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}