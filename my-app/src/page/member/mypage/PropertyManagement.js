//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import ModalCommon from '../../../component/common/modal/ModalCommon';
import ModalFilter from '../../../component/member/mypage/property/modal/ModalFilter';
import PropertyManage from '../../../component/member/mypage/property/PropertyManage';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';


//server process
import serverController from '../../../../src/server/serverController';

//redux
import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

export default function Join() {

  ChannelServiceElement.shutdown();

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);

  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  const [filterItem, setfilterItem] = useState({ company_id: login_user.company_id});
  const [order, setOrder] = useState({});

  const Fistorder = { name: '상태변경 최신순', order: 'history_create_date', orderType: 'desc' }

  const history = useHistory();

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

          let res_resultss = await serverController.connectFetchController(`/api/products?prd_field_all=1&order=${Fistorder.order}&order_type=${Fistorder.orderType}&filter=${JSON.stringify({default: filterItem})} `, 'get' );
          setBrokerRequest_productlist(res_resultss.data)
                
          console.log('여기를 확인해야함3333', res_resultss.data)
          console.log('여기를 확인해야함222' , filterItem)
          console.log('여기를 확인해야함2222' , order)
          setOrder({ name: '상태변경 최신순', order: 'history_create_date', orderType: 'desc' })
          setfilterItem({})


           /*console.log('propertymanagement 페이지 실행>>>>>>>>>>>>>>>>>>>>', user_info);
           let send_info = {
             login_memid: user_info.user_data.memid,
             company_id: user_info.user_data.company_id
           };
           let res_resultss = await serverController.connectFetchController('/api/broker/BrokerRequest_productlist', 'POST', JSON.stringify(send_info));
           console.log('res reusltss:123', res_resultss);

           if (res_resultss) {
             if (res_resultss.success) {
               if (res_resultss.result_data) {
                 setBrokerRequest_productlist(res_resultss.result_data);
               }
             }
           }*/

    //       //정보요청.알람셋팅정보 요청 매페이지 api 로그인여부,유효성로그인여부 통과시에 마이페이지접근통과시에 리턴되는 회원정보(await 기다린후)결과관련하여 그 유효한 memid결과에 해당하는 데이터정보 요청. 비동기방식의 경우 통신의 교차점 불일치 현상이 많이 발생할여지가있음.
           let alaram_info = {
             mem_id: user_info.user_data.mem_id,
             user_type: user_info.user_data.user_type,
             company_id: user_info.user_data.company_id,
             bp_id: bunyangTeam.bunyangTeam.bp_id
           }
           let resss = await serverController.connectFetchController('/api/alram/alramSetting_status', 'POST', JSON.stringify(alaram_info));

           if (resss) {
             console.log("res resultsss alramsetting tinyss:", resss);
             if (resss.success) {
               let result = resss.result;
               if (result) {
                 setalramsetting_tiny(result);
               }
             } else {
               alert(resss.message);
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

  const [rank, setRank] = useState(false);
  //필터 모달
  const [filter, setFilter] = useState(false);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submitnone: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });
  const [cate, setCate] = useState([0, 0, 0, 0])

  
  const FilterBtn = async ()=>{
    let res_resultss = await serverController.connectFetchController(`/api/products?prd_field_all=1&order=${order.order}&order_type=${order.orderType}&filter=${JSON.stringify({ default: filterItem })} `, 'get',);
    console.log('여기를 확인해야함', res_resultss)
    console.log('여기를 확인해야함333', order)
    setBrokerRequest_productlist(res_resultss.data)
    setOrder({ name: '상태변경 최신순', order: 'history_create_date', orderType: 'desc' })
    setfilterItem({});
    offModal();
  }


  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }
  //물건관리 필터 정렬처리.
  const onClickSubmit = async () => {
    // 선택한 옵션들을 서버에 보내 새로운 리스트를 받아옵니다.
    // cate[0], cate[1], cate[2], cate[3]
    console.log('선택옵션들 선택값 상태:::', cate);
    //cate0 상태변경최신순,최신등록순,과거등록순
    //cate1 전체,검토대기,검토중,의뢰철회,의뢰수락(거래준비),의뢰거절,거래개시동의요청,거래개시,거래개시거절,위임취소,수임취소,거래완료승인요청,거래완료,거래완료거절,기한만료
    //cate2 전체,아파트,오피스트ㅔㄹ,상가,사무실
    //cate3 전체,사용자의뢰,외부수임
    offModal();

    let body_info = {
      login_memid: login_user.memid,
      company_id: login_user.company_id,
      orderby: cate[0],
      txnstatus: cate[1],
      prdtype: cate[2],
      createorigin: cate[3]
    };
    let res_result = await serverController.connectFetchController('/api/broker/BrokerRequest_productlist_filter', 'POST', JSON.stringify(body_info));
    console.log('borkerREUQEST PRODUCDFT LIST LOAD RES REUSLTSS:', res_result);

    if (res_result) {
      if (res_result.success) {
        if (res_result.result_data) {
          console.log('res resultss::', res_result.result_data);

          setBrokerRequest_productlist(res_result.result_data);
        }
      }
    }
  }
  //물건관리 건물명,의뢰인 검색관련 필터.
  const search_keyword_filter = async (e) => {
    console.log('검색어 입력시작>>>:', e.target.value);

    let search_keyword = e.target.value;
    let body_info = {
      search_keyword_val: search_keyword,
      login_memid: login_user.memid,
      company_id: login_user.company_id,
    };
    
    console.log('리스트 확인', e.target.value);
    const filter = { contains: {prd_name : e.target.value} }
    

    // let search_result = await serverController.connectFetchController('/api/broker/BrokerRequest_productlist_filter2', 'POST', JSON.stringify(body_info));
    let search_result = await serverController.connectFetchController(`/api/products?prd_field_all=1&order=${Fistorder.order}&order_type=${Fistorder.orderType}&filter=${JSON.stringify(filter)}`, 'GET');
    console.log('리스트 확인', search_result);
    if (search_result) {
      if (search_result.success) {
        if (search_result.data) {
          // console.log('res results search resultss:', search_result.result_data);

          setBrokerRequest_productlist(search_result.data);
        }
      }
    }
  }

  useEffect(() => {
    console.log(filterItem);
    console.log(order);
  }, [filterItem, order])


  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const updateModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "필터",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalFilter order={order} setOrder={setOrder} cate={cate} setfilterItem={setfilterItem} setCate={setCate} filterItem={filterItem}/> },
      submitnone: { show: true, title: "적용", event: () => { FilterBtn(); } },
      // submitnone: { show: true, title: "적용", event: () => { onClickSubmit(); } },
      cancle: { show: true, title: "초기화", event: () => { offModal(); setCate([0, 0, 0, 0]); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }
  const [brokerRequest_productlist, setBrokerRequest_productlist] = useState([]);
  const [alramsetting_tiny, setalramsetting_tiny] = useState({});//물건투어예약접수관리관련,물건관리 관련 알림셋팅시마다 관련된 현재의 매 결과 리턴한다.그 현재결과에 해당하는 데이터와 화면 보여줄수있게

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
          login_user.user_type !== '개인' ?
            <SubTitle title={login_user.company_name} path={"/Team"} />
            :
            <SubTitle title={"개인"}/>
        }

        <PropertyManage setFilter={setFilter} updateModal={updateModal} search_keyword_filter={search_keyword_filter} brokerRequest_productlist={brokerRequest_productlist} setBrokerRequest_productlist={setBrokerRequest_productlist} alramsetting_tiny={alramsetting_tiny} setalramsetting_tiny={setalramsetting_tiny} />
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

