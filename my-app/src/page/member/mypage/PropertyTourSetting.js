//react
import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import SubTitle from '../../../component/common/SubTitle';
import PropertyTourSetting from '../../../component/member/mypage/property/PropertyTourSetting';

import ModalCommon from '../../../component/common/modal/ModalCommon';
import ModalAddBasic from '../../../component/member/mypage/property/modal/ModalAddBasic';
import ModalAddSpecial from '../../../component/member/mypage/property/modal/ModalAddSpecial';
import ModalModifyBasic from '../../../component/member/mypage/property/modal/ModalModifyBasic';
import ModalModifySpecial from '../../../component/member/mypage/property/modal/ModalModifySpecial';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

//server
import serverController from '../../../server/serverController';

export default function Join({ match }) {

  ChannelServiceElement.shutdown();

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
  //마이페이지 프로필수정부분(mem_img,user_name부분 수정)
  const [username, setUsername] = useState('');
  const [userprofile, setUserprofile] = useState('');
  const [editCheck, setEditChk] = useState(1);//기본값 1(EDIT버튼)

  const history = useHistory();

  const login_user = useSelector(data => data.login_user); console.log('login_user status mypagess:', login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  var prd_identity_id = match.params.id;
  if (!prd_identity_id) {
    alert('유효하지 않은 접근입니다.');
    history.push('/');
  }

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

          //로그인유저의 중개사회사id값을 의존성 필요로 하기에, 리덕스데이터와 서버에서 가져온 데이터간의 통신 가져오는 교차차이가 없어야함.서버에서 가져온값에 대해서 처리한다.
          console.log('최초 한번 실행 투어셋팅페이지 도달시 한번 실행', prd_identity_id);
          let body_infoss = {
            //mem_id : login_user.memid,
            company_id: user_info.user_data.company_id,
            prd_identity_ids: prd_identity_id //어떤 매물id에 대한 투어예약셋팅내역들인지
          };
          // console.log('JSON>BODYINFO STIRNGIFY ',body_info,JSON.stringify(body_info));

          let toursetting_res = await serverController.connectFetchController('/api/broker/productToursettinglist', 'POST', JSON.stringify(body_infoss));
          console.log('res results:>>>>:', toursetting_res);

          if (toursetting_res.success) {
            var toursetting_result = toursetting_res.result_data;
            setPropertyToursettinglist(toursetting_result);

            let is_tour_active = toursetting_res.is_tour_active;

            console.log('istouractivessssssssssss:', is_tour_active);
            console.log('propertytoursettinglist:', propertyToursettinglist);
            setistouractive(is_tour_active);
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

  // 일반  모달
  const dataRef = useRef();
  const timeRef = useRef();
  const dayRef = useRef();
  const holiRef = useRef();
  const dataRef_m = useRef();
  const timeRef_m = useRef();
  const dayRef_m = useRef();
  const holiRef_m = useRef();

  // 특별 모달
  const speDateRef = useRef();
  const speTimeRef = useRef();
  const speIsTimeRef = useRef();
  const speExcRef = useRef();
  const speDateRef_m = useRef();
  const speTimeRef_m = useRef();
  const speIsTimeRef_m = useRef();
  const speExcRef_m = useRef();

  const temp_tourReservsettings = useSelector(data => data.temp_tourReservsetting);

  const [propertyToursettinglist, setPropertyToursettinglist] = useState([]);
  const [istouractive, setistouractive] = useState(1);//비활성화 토글링에 따라서 companytid,prdidientiy관련된 모든 셋팅들 일괄 상태변경되므로 이들중 하나라도 true인경우라면 활성상태,아니면 비활성상태입니다.
  // console.log('=>>>>proeprtyTOursetting 페이지요소 실행:',login_user);

  useEffect(() => {
    console.log('proeprtyYourtsettlinglist참조확인::', propertyToursettinglist);
  }, [propertyToursettinglist]);

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const addBasic = async () => {
    //여기가 모달 키는 거에엽
    // console.log('==>>>.adDBASIC함숫 실행:');
    setModalOption({
      show: true,
      setShow: offModal,
      title: "일반추가",
      content: { type: "components", text: ``, component: <ModalAddBasic dataRef={dataRef} timeRef={timeRef} dayRef={dayRef} holiRef={holiRef} /> },
      submit: {
        show: false, title: "적용", event: () => {
          // console.log('일반추가 모달 확인submit발생:',temp_tourReservsettings);

          offModal();
        }
      },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirm: {
        show: true, title: "확인", event: async () => {
          // console.log('일반추가 모달 확인confirm발생:',temp_tourReservsettings);

          // 이제 전부 잘 받아옵니다!!!!
          console.log(checkedArr(dataRef));  // 요일
          console.log(checkedArr(timeRef)); // 시간
          console.log(dayRef.current.value); // 일자
          console.log(holiRef.current.checked); // 공휴일

          if (login_user.memid != '' && login_user.company_id != '' && checkedArr(dataRef).length >= 1 && checkedArr(timeRef).length >= 1) {
            let body_info = {
              tour_type: 1,//일반:1 특별:2
              mem_id: login_user.memid,//어떤 중개사회원id가 어떤수임한 상품에 대해서 예약셋팅하는건지
              company_id: login_user.company_id,
              prd_identity_ids: prd_identity_id,
              normal_isholidayexcept: holiRef.current.checked,
              normal_select_daycount: dayRef.current.value,
              normal_select_days: checkedArr(dataRef).join(','),
              normal_select_times: checkedArr(timeRef).join(',')
            };
            console.log('JSONBODY SUBMIT INFO:', body_info, JSON.stringify(body_info));

            let res = await serverController.connectFetchController('/api/broker/productToursettingRegister', 'POST', JSON.stringify(body_info));
            console.log('res_result:', res);

            if (res.success) {
              if (res.error == 'already_day_exists') {
                alert('이미 등록되어있는 요일or요일들입니다.');
                return;
              }
              offModal();
              history.push('/PropertyManagement');
            } else {
              alert(res.message);
              return;
            }
          } else {
            alert('입력값이 비어있습니다.');
          }
        }
      }
    });
  }

  //만약에 다른걸 키고 싶으면 아래 함수 호출하시면됩니다.
  const addSpecial = async () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "특별추가",
      content: { type: "component", text: `ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`, component: <ModalAddSpecial speDateRef={speDateRef} speTimeRef={speTimeRef} speIsTimeRef={speIsTimeRef} speExcRef={speExcRef} /> },
      // submit:{show:false , title:"" , event : ()=>{ console.log('특별추가모달 확인 submit발생:');offModal(); }},
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: {
        show: true, title: "확인", event: async () => {
          // console.log('특별추가모달 confirm발생',temp_tourReservsettings);

          // 이제 전부 잘 받아옵니다!!!!
          console.log(speDateRef.current.value) // 일자
          console.log(speIsTimeRef.current.checked) // 시간 여부
          console.log(checkedArr(speTimeRef)) // 시간
          console.log(speExcRef.current.checked) // 제외 여부
          if (login_user.memid != '' && login_user.company_id != '' && speDateRef.current.value != '' && checkedArr(speTimeRef).length >= 1) {
            let body_info = {
              tour_type: 2,
              mem_id: login_user.memid,
              company_id: login_user.company_id,
              prd_identity_ids: prd_identity_id,
              special_specifydate: speDateRef.current.value,
              special_specifydatetimes: checkedArr(speTimeRef).join(','),
              special_isexceptspecifydate: speExcRef.current.checked
            };
            console.log('JSONBODY SUMBIT INFO:', body_info, JSON.stringify(body_info));

            let res = await serverController.connectFetchController('/api/broker/productToursettingRegister', 'POST', JSON.stringify(body_info));
            console.log('res_result:', res);

            if (res.success) {
              if (res.error == 'already_exceptdate_exists') {
                alert('이미 등록되어있는 제외날짜입니다.');
                return;
              } else if (res.error == 'already_specifydate_exists') {
                alert('이미 등록되어있는 특정날짜입니다.');
                return;
              }
              offModal();
              history.push('/PropertyManagement');
            } else {
              alert(res.message);
            }

          } else {
            alert('입력값이 비어있습니다.');
          }
        }
      }
    });
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const modifyBasic = async (key_val) => {
    //alert('modifybasic호출!!!');
    //해당 key_val에 해댱 내용을 불러와서 모달수정창에 띄워준다.
    let view_info = {
      key_value: key_val//tourgroupid에 해당하는 내역들 가져온다.
    }
    let view_info_result = await serverController.connectFetchController('/api/broker/productTournormalsetting_singleitemview', 'POST', JSON.stringify(view_info));
    if (view_info_result) {
      console.log('view_info_resultss:', view_info_result);
      var load_day_select_count = view_info_result.day_select_count_result;
      var load_is_tour_holiday_except = view_info_result.is_tour_holiday_except_result;
      var load_tour_set_days = view_info_result.tour_set_days_result.join(',');
      var load_tour_set_times = view_info_result.tour_set_times_result;
    }
    //여기가 모달 키는 거에엽
    // console.log('==>>>.adDBASIC함숫 실행:');
    setModalOption({
      show: true,
      setShow: offModal,
      title: "일반수정",
      content: { type: "components", text: ``, component: <ModalModifyBasic load_day_select_count={load_day_select_count} load_is_tour_holiday_except={load_is_tour_holiday_except} load_tour_set_days={load_tour_set_days} load_tour_set_times={load_tour_set_times} dataRef={dataRef_m} timeRef={timeRef_m} dayRef={dayRef_m} holiRef={holiRef_m} /> },
      submit: {
        show: false, title: "적용", event: () => {
          // console.log('일반추가 모달 확인submit발생:',temp_tourReservsettings);

          offModal();
        }
      },
      cancle: { show: false, title: "초기화", event: () => { offModal(); } },
      confirm: {
        show: true, title: "확인", event: async () => {
          // console.log('일반추가 모달 확인confirm발생:',temp_tourReservsettings);

          // 이제 전부 잘 받아옵니다!!!!
          console.log(checkedArr(dataRef_m));  // 요일
          console.log(checkedArr(timeRef_m)); // 시간
          console.log(dayRef_m.current.value); // 일자
          console.log(holiRef_m.current.checked); // 공휴일

          if (login_user.memid != '' && login_user.company_id != '' && checkedArr(dataRef_m).length >= 1 && checkedArr(timeRef_m).length >= 1) {
            let body_info = {
              tour_type: 1,//일반:1 특별:2
              mem_id: login_user.memid,//어떤 중개사회원id가 어떤수임한 상품에 대해서 예약셋팅하는건지
              company_id: login_user.company_id,
              prd_identity_ids: prd_identity_id,
              key_value: key_val,//어떤 tourid groupid에대해서 관련된 tourid들을 수정한다.관련된 tourid들을 수정한다.에 넘겼었던 각 prdidneintiy,companyid,tourtype,선택 요일들,요일수,시간값들,주말제외여부 등 수정한다.
              normal_isholidayexcept: holiRef_m.current.checked,
              normal_select_daycount: dayRef_m.current.value,
              normal_select_days: checkedArr(dataRef_m).join(','),
              normal_select_times: checkedArr(timeRef_m).join(',')
            };
            console.log('JSONBODY SUBMIT INFO:', body_info, JSON.stringify(body_info));

            let res = await serverController.connectFetchController('/api/broker/productToursettingupdate', 'POST', JSON.stringify(body_info));
            console.log('res_result:', res);

            if (res.success) {

              offModal();
              history.push('/PropertyManagement');
            } else {
              alert(res.message);
              return;
            }
          } else {
            alert('입력값이 비어있습니다.');
          }
        }
      }
    });
  }

  //만약에 다른걸 키고 싶으면 아래 함수 호출하시면됩니다.
  const modifySpecial = async (key_val) => {//특정 선택 특별tour_id (kkeyvalue)에 대핸 수정을 할뿐이다.
    // alert(key_val);
    let view_info = {
      key_value: key_val
    }
    let view_info_result = await serverController.connectFetchController('/api/broker/productTourspecialsetting_singleitemview', 'POST', JSON.stringify(view_info));
    if (view_info_result) {
      console.log('view info resuyltsss:', view_info_result);

      var load_tour_set_specifydate = view_info_result.tour_set_specifydate_result;
      var load_tour_set_specifydate_times = view_info_result.tour_set_specifydate_times_result;
      var load_tour_specifyday_except = view_info_result.tour_specifyday_except_result;
    }

    setModalOption({
      show: true,
      setShow: offModal,
      title: "특별수정",
      content: { type: "component", text: `ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`, component: <ModalModifySpecial load_tour_set_specifydate={load_tour_set_specifydate} load_tour_set_specifydate_times={load_tour_set_specifydate_times} load_tour_specifyday_except={load_tour_specifyday_except} speDateRef={speDateRef_m} speTimeRef={speTimeRef_m} speIsTimeRef={speIsTimeRef_m} speExcRef={speExcRef_m} /> },
      // submit:{show:false , title:"" , event : ()=>{ console.log('특별추가모달 확인 submit발생:');offModal(); }},
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: {
        show: true, title: "확인", event: async () => {
          // console.log('특별추가모달 confirm발생',temp_tourReservsettings);

          // 이제 전부 잘 받아옵니다!!!!
          console.log(speDateRef_m.current.value) // 일자
          console.log(speIsTimeRef_m.current.checked) // 시간 여부
          console.log(checkedArr(speTimeRef_m)) // 시간
          console.log(speExcRef_m.current.checked) // 제외 여부
          if (login_user.memid != '' && login_user.company_id != '' && speDateRef_m.current.value != '' && checkedArr(speTimeRef_m).length >= 1) {
            let body_info = {
              tour_type: 2,
              mem_id: login_user.memid,
              company_id: login_user.company_id,
              prd_identity_ids: prd_identity_id,
              key_value: key_val,//특정 선택tourid(특별의경우)에 대해 companyid,prdineitiiyds담당ㅁ애물,tourtyp,e특저선택일,특정선택일선택시간,제외추가여부 등 수정사항 update
              special_specifydate: speDateRef_m.current.value,
              special_specifydatetimes: checkedArr(speTimeRef_m).join(','),
              special_isexceptspecifydate: speExcRef_m.current.checked
            };
            console.log('JSONBODY SUMBIT INFO:', body_info, JSON.stringify(body_info));

            let res = await serverController.connectFetchController('/api/broker/productToursettingupdate', 'POST', JSON.stringify(body_info));
            console.log('res_result:', res);

            if (res.success) {

              offModal();
              history.push('/PropertyManagement');
            } else {
              alert(res.message);
            }

          } else {
            alert('입력값이 비어있습니다.');
          }
        }
      }
    });
  }
  const checkedArr = (ref) => {
    let newArr = [];
    if (ref.current) {
      console.log('ref currentsss:', ref.current);
      if (ref.current.children) {
        for (let i = 0; i < ref.current.children.length; i++) {
          if (ref.current.children[i].children[0].checked) {
            newArr.push(ref.current.children[i].children[0].value)
          }
        }
      }
    }
    return newArr
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

        {/*개인로 로그인했을때*/}
        {/*기업으로 로그인했을때*/}
        {
          login_user.user_type != '개인' ?
            <SubTitle title={login_user.company_name} arrow={"▼"} path={"/Team"} rank={true} cursor={"pointer"} />
            :
            <SubTitle title={"개인"} rank={false} cursor={"default"} />
        }
        <PropertyTourSetting addBasic={addBasic} addSpecial={addSpecial} modifyBasic={modifyBasic} modifySpecial={modifySpecial} istouractive={istouractive} setistouractive={setistouractive} id={prd_identity_id} propertyToursettinglist={propertyToursettinglist} />
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