//react
import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

import Item from '../../../img/main/item01.png';

//component
import MainHeader from '../../../component/common/MainHeader';
import SubTitle from '../../../component/common/SubTitle';
import Reservation from '../../../component/member/mypage/reservation/MyReservation';
import ModalMap from '../../../component/member/mypage/reservation/ModalMap';
import MymodalReserve from '../../../component/member/mypage/reservation/MymodalReserve';
import MainFooter from '../../../component/common/MainFooter';
import TermService from '../../../component/common/TermsOfService';
import TermPrivacy from '../../../component/common/TermsOfPrivacy';
import TermLocation from '../../../component/common/TermsOfLocation';
import Bunyang from '../../../component/common/bunyang/Bunyang';
import ImgDetail from "../../../component/common/bunyang/ImgDetail";
import LiveModal from "../../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../../component/common/bunyang/ModalCalendar";
import ModalCommon from '../../../component/common/modal/ModalCommon';
import ModalFilterComponent from '../../../component/member/mypage/reservation/ModalFilterComponent';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

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

  //공통 flow 모든 마이페이지(로그인권한) 요구페이지에서 로그인,유효회원여부 쿼리 pagecompoentn단위에서 진행후 , 결과존재시에 유효회원일시 회원관련 리덕스정보저장. 모든페이지에 새로고침형태로 도달시에. 데이터 조회 및 유지를 위해 필요함(안정성) starts
  useEffect(async () => {
    console.log('mypage도달>>> 로그인세션여부검사 및 관련 조회::', login_user);
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

          // 초기 리스트를 설정해줍니다.(초기 물건투어예약접수내가 한내역들 리스팅.) + 나의 알람셋팅내역정보 조회.
          let body_infos = {
            company_id: user_info.user_data.company_id,//임의 사업체id소속의 팀원들이 있을것이고 그 팀원들memid이 했었던 투어예약접수내역들을 총적으로 불러온다.
            mem_id: user_info.user_data.mem_id,//개인이라면 memid만 필요.
            user_type: user_info.user_data.user_type//로그인되어있는 유저의 현재 소속이 있을것이고 그 소속에 해당하는 내역들이 나오게 companyid
          };
          console.log('JSON BODY INTO TEST::', JSON.stringify(body_infos));

          let ress = await serverController.connectFetchController('/api/broker/brokerproduct_myreservationList', 'POST', JSON.stringify(body_infos));
          if (ress) {
            console.log('res resultsss:', ress);
            if (ress.success) {
              let list_item = ress.result_data;

              setListData(list_item);
            } else {
              alert(ress.message);
            }
          }

          //알람셋팅 정보 조회한다. 알람종류별 셋팅형태 조회. 개인이면 memid별 알람정보,기업or중개사이면 companyid조건만족되는 해당소속알람조회
          let alram_info = {
            mem_id: user_info.user_data.mem_id,
            user_type: user_info.user_data.user_type,
            company_id: user_info.user_data.company_id,
            bp_id: bunyangTeam.bunyangTeam.bp_id
          };
          let ressss = await serverController.connectFetchController('/api/alram/alramSetting_status', 'POST', JSON.stringify(alram_info));

          if (ressss) {
            console.log('res reusltsss alramsettingsitnyss:', ressss);
            if (ressss.success) {
              let result = ressss.result;
              if (result) {
                setalramsetting_tiny(result);
              }
            } else {
              alert(ressss.message);
            }
          }

          //관련 로드형태의 초기initiial데이터 저장처리후에 리덕스 저장한다.
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

  const login_userinfo = useSelector(data => data.login_user);

  var week = ['일', '월', '화', '수', '목', '금', '토'];
  function data_ascending(a, b) {
    var left = new Date(a['date']).getTime();
    var right = new Date(b['date']).getTime();

    return left > right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
  }
  //내물건투어예약 수정 유효성관련
  const [isvalid, setisvalid] = useState(false);

  //지도 모달창
  const [map, setMap] = useState(false);
  //필터 모달창
  const [filter, setFilter] = useState(false);
  //물건예약수정 모달창
  const [reserve, setReserve] = useState(false);

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submitnone: {}, cancle: {}, confirm: {}, confirmgreennone: {}, content: {} });
  const [sortChecked, setSortChecked] = useState([1, 0, 0]);
  const [condiChecked, setCondiChecked] = useState([1, 0, 0, 0, 0]);
  const sortRef = useRef();
  const condiRef = useRef();

  const [listData, setListData] = useState([]);//전체 접수리스트. 
  const [alramsetting_tiny, setalramsetting_tiny] = useState({});//알렘셋팅정보.

  //접수리스트 하나 조회하려고할시 그 접수한 투어예약에 관련딘 매물에 대한 tourdates셋팅정보조회하기위함.
  const [except_datelist, setExcept_datelist] = useState([]);//표현에서 제외할 특정날짜 리스트
  const [result_usedatalist, setResult_usedatalist] = useState([]);//사용할 표현할 최종데이터리스트 초기값 배열

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  // 모달창을 다시 열어도 선택한 옵션을 계속 유지시킵니다. 
  const onChangeSort = (e) => {
    let newChecked = [0, 0, 0];
    newChecked[e.target.value] = 1;
    setSortChecked([...newChecked]);
  }


  const onChangeCondi = (e, dateOption) => {
    let newChecked = [0, 0, 0, 0, 0];
    newChecked[e.target.value] = 1;
    // console.log(newChecked);
    setCondiChecked([...newChecked]);
  }

  // 모달창을 닫고 선택한 옵션들을 초기화합니다.
  const onClickReset = () => {
    offModal();
    setSortChecked([1, 0, 0]);
    setCondiChecked([1, 0, 0, 0, 0]);
  }

  // 적용버튼을 눌렀을때 서버에서 새로운 리스트를 불러온다.
  const onClickSubmit = async () => {
    // 선택한 정렬기준과 상태입니다.
    // console.log(sortRef.current.value); // 0, 1, 2
    // console.log(condiRef.current.value); // 0, 1, 2, 3, 4
    const Option = document.querySelector('.Option').getAttribute('optionselect')
    const Option2 = document.querySelector('.Option2').getAttribute('optionselect2')

    console.log(Option); // 0, 1, 2
    console.log(Option2); // 0, 1, 2, 3, 4


    //최신등록순,과거순,가나다순 물건투어예약셋팅 기준 정렬order by처리. myReservaton tourReservation처리하며 등록이된날짜순최신순,과거순, 등록신청자 이름순..정렬orderby
    //상태값: 전체 , 오늘,내일,예약취소,만료 : 내역들중에서 이미 지난것들 과거에 했던것들만료 예약취소한내역들, 예약일이 내일인거,오늘인거  제약없는거(전체)
    let body_info = {
      company_id: login_userinfo.company_id,//임의 사업체id소속의 팀원들이 있을것이고 그 팀원들memid이 했었던 투어예약접수내역들전체집합 + 필터정렬집합.
      mem_id: login_userinfo.memid,//개인이라면 memid만 필요.
      user_type: login_userinfo.user_type,
      // orderby: sortRef.current.value,
      // wherecond: condiRef.current.value
      orderby: Option,
      wherecond: Option2,
    };
    //  console.log(body_info);
    let filter_result = await serverController.connectFetchController('/api/broker/brokerproduct_myreservationList_filter', 'POST', JSON.stringify(body_info));

    if (filter_result) {
      if (filter_result.success) {
        console.log('filter resultsss:', filter_result);

        let list_item = filter_result.result_data;

        setListData(list_item);
      } else {
        alert(filter_result.message);
      }
    }

    // setListData([ - data - ])

    offModal();
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다. 필터모달
  const updateModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "필터",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalFilterComponent condiRef={condiRef} sortRef={sortRef} onChangeSort={onChangeSort} onChangeCondi={onChangeCondi} sortChecked={sortChecked} condiChecked={condiChecked} /> },
      submitnone: { show: true, title: "적용", event: (OptionValue) => onClickSubmit(OptionValue) },
      cancle: { show: true, title: "초기화", event: () => onClickReset() },
      confirmgreennone: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }

  //만약에 다른걸 키고 싶으면 아래 함수 호출하시면됩니다.매물주소맵 모달.
  const updateMapModal = (match_productinfo) => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "건물위치",
      content: { type: "component", text: `ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`, component: <ModalMap addr_jibun={match_productinfo.addr_jibun} addr_road={match_productinfo.addr_road} prd_longitude={match_productinfo.prd_longitude} prd_latitude={match_productinfo.prd_latitude} /> },
      submitnone: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirmgreennone: { show: false, title: "", event: () => { offModal(); } }
    });
  }

  //투어예약수정모달창 관련 수정 액션시에(확인) 개별수정
  const sendinfo_data = {};
  const sendInfo_local = (selectDay, selectTimes, tourid, tourtype, td_id, r_tr_id, reserv_start_time, reserv_end_time, isvalidss) => {
    console.log('sendtime locaslsss:', isvalidss);

    if (!selectTimes || !tourid || !tourtype || !td_id || !selectDay) {
      if (isvalidss == true) {
        sendinfo_data['isvalidss'] = isvalidss;
      } else if (isvalidss == false) {
        sendinfo_data['isvalidss'] = isvalidss;
      }

      return false;
    } else {
      if (isvalidss == true) {
        sendinfo_data['isvalidss'] = isvalidss;
      } else if (isvalidss == false) {
        sendinfo_data['isvalidss'] = isvalidss;
      }

      console.log('selectTIMES,TDID:', selectTimes, td_id, String(selectTimes).indexOf("|"), isvalidss);
      if (reserv_start_time == '9:00am') {
        sendinfo_data['reserv_start_time'] = selectDay + ' 09:00:00';
      } else if (reserv_start_time == '12:00pm') {
        sendinfo_data['reserv_start_time'] = selectDay + ' 12:00:00';
      } else if (reserv_start_time == '15:00pm') {
        sendinfo_data['reserv_start_time'] = selectDay + ' 15:00:00';
      } else if (reserv_start_time == '18:00pm') {
        sendinfo_data['reserv_start_time'] = selectDay + ' 18:00:00';
      }

      if (reserv_end_time == '9:00am') {
        sendinfo_data['reserv_end_time'] = selectDay + ' 09:00:00';
      } else if (reserv_end_time == '12:00pm') {
        sendinfo_data['reserv_end_time'] = selectDay + ' 12:00:00';
      } else if (reserv_end_time == '15:00pm') {
        sendinfo_data['reserv_end_time'] = selectDay + ' 15:00:00';
      } else if (reserv_end_time == '18:00pm') {
        sendinfo_data['reserv_end_time'] = selectDay + ' 18:00:00';
      }

      sendinfo_data['selectDay'] = selectDay; //어떤날짜택한지
      sendinfo_data['selectTimes'] = String(selectTimes).indexOf('|') != -1 ? String(selectTimes).split('|')[0] : selectTimes;  //어떤 날짜의시간대
      sendinfo_data['tourid'] = tourid; //투어아이디 어떤요일
      sendinfo_data['tourtype'] = tourtype;
      sendinfo_data['td_id'] = String(td_id).indexOf('|') != -1 ? String(td_id).split('|')[0] : td_id; //어떤 요일에 어떤 시간대
      sendinfo_data['r_tr_id'] = r_tr_id;//어떤 예약신청아이디인지 여부 저장.
    }

    console.log('sendinfo_local정보 확인 먼저 저장여부>>>>:', sendinfo_data);
  }
  useEffect(() => {
    console.log('is valids trakcingtsss:', isvalid);
  }, [isvalid]);
  const clickReservation_edit = async (tr_id, prd_identity_id, company_id) => {
    console.log('reservation(id선택한 방문예약셋팅날짜 수정::', sendinfo_data, tr_id, prd_identity_id, company_id);

    offModal();

    if (sendinfo_data) {
      if (sendinfo_data.selectDay == '' || sendinfo_data.selectDay == null || sendinfo_data.selectTimes == '' || sendinfo_data.selectTimes == null || sendinfo_data.tourid == '' || sendinfo_data.starttime == '' || sendinfo_data.endtime == '') {
        alert('입력값이 비어있습니다.');
        return;
      }
    }
    if (login_userinfo.is_login) {
      let body_info = {
        tr_id: sendinfo_data.r_tr_id,//어떤 tr_id에 대한 수정을 하는건지 알기위함.
        selectdate: sendinfo_data.selectDay,//선택날짜
        selectTime: sendinfo_data.selectTimes,  //선택시간대.
        selectTourid: sendinfo_data.tourid,//선택한 요일
        selectTourtype: sendinfo_data.tourtype, //투어타입
        selectTdid: sendinfo_data.td_id, //선택한 요일의 시간대
        reserv_start_time: sendinfo_data.reserv_start_time,
        reserv_end_time: sendinfo_data.reserv_end_time
      };
      //어떤trid에 대해서 txn_id(tr_id)에 대해서 수정하려는건지 그 수정한 날짜값으로 관련된 노티들 모두 수정한다.
      console.log('JSON_BODY>>>:', JSON.stringify(body_info));

      let res = await serverController.connectFetchController('/api/broker/mybrokerProduct_tourReservation_modify', 'POST', JSON.stringify(body_info));

      if (res) {
        console.log('====>>>>>res_result::', res);

        if (res.success) {
          alert('접수내역 수정되었습니다.');

          let reserv_date = sendinfo_data.selectDay;
          let date_format = new window.Date(reserv_date);
          date_format = date_format.getTime() - (1 * 24 * 60 * 60 * 1000);
          date_format = new window.Date(date_format);
          let year = date_format.getFullYear();
          let month = date_format.getMonth() + 1;
          let date = date_format.getDate();//년월일 구함
          if (month < 10) {
            month = '0' + month;
          }
          if (date < 10) {
            date = '0' + date;
          }
          reserv_date = new window.Date(year + '-' + month + '-' + date);
          console.log('예약알림일로 지정한 날짜값::', reserv_date);

          //자기자신(개인or기업 관련된 memid들에ㅐ게) 예약알림(특정예약날짜조건일에 display표현)저장처리하는것 필요함.내 물건투어예약 trid내역 날짜수정시에 처리.
          let noti_info2 = {
            tour_reserv_id: sendinfo_data.r_tr_id,
            noti_reserv_date: reserv_date,
            message: sendinfo_data.r_tr_id + '::물건투어예약 방문예정일 1일전입니다.\n [접수자정보]:' + login_userinfo.user_name + '(' + login_userinfo.phone + ')' + login_userinfo.email,
            request_mem_id: login_userinfo.memid,//어떤 접수자에서 신청한건지 여부 및 참조
            request_user_selectsosokid: login_userinfo.company_id,//개인이나 생성자라고한다면 이값이 비어있을수도있음.고정값이거나,선택되어있던 소속id값.
            noti_type: 11,//물건투어예약 일일전 예약발송.
            action: 'update'
          }
          let noti_res2 = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info2));
          if (noti_res2) {
            if (noti_res2.success) {
              console.log('noti reusltssss:', noti_res2);
            } else {
              alert(noti_res2.message);
            }
          }

          //날짜에 대한 수정이뤄질시에 (접수내역)에도 알림 가해지게 관련 처리진행.(예약취소,신규접수,접수수정)모두 9번으로..
          let noti_info3 = {
            prd_identity_id: prd_identity_id,
            message: login_userinfo.user_name + '(' + login_userinfo.phone + ')' + login_userinfo.email + ' 님이' + prd_identity_id + '매물에 대한 신청하신 물건투어예약접수내역 수정하였습니다.\n 수정한 정보>> 선택날짜:' + sendinfo_data.selectDay + ',선택시간대(selectTimes):' + sendinfo_data.reserv_start_time + '~' + sendinfo_data.reserv_end_time,
            company_id: company_id,
            noti_type: 8
          }
          let noti_res3 = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info3));
          if (noti_res3) {
            if (noti_res3.success) {
              console.log('noti reusltssss:', noti_res3);
            } else {
              alert(noti_res3.message);
            }
          }
          history.push('/Mypage');
        } else {
          alert(res.message);
        }
      }

    } else {
      //비로그인 상태
    }
  }

  //내 물건투어예약 조회확인수정모달
  const updateReserveModal = async (tr_id, prd_identity_id, company_id) => {

    let tr_info = {
      tr_id_val: tr_id
    };
    let ress = await serverController.connectFetchController('/api/broker/brokerProduct_reservationRegisterview', 'POST', JSON.stringify(tr_info));

    if (ress) {
      console.log('server request resultss:', ress);

      var tr_info_result = ress.result_data[0].tr_info;//신청한 trinfo
    }

    let body_info = {
      id: prd_identity_id//선택한 매물id에 대한 정보전달.선택한 매물의투어예약접수내역을 조회하기에.
    }
    let res = await serverController.connectFetchController('/api/broker/brokerProduct_toursetting_dates', 'POST', JSON.stringify(body_info));

    if (res) {

      console.log('res results:', res);
      if (res.result_total_data && res.except_special_specifydate_tourRowlist) {
        var result_total_data = res.result_total_data;//특별추가내역(덮어씌워짐포함),일반추가낸역들 그 날짜들의 경우 같은tourid를 공유하는것도 있음.

        var except_special_specifydate_tourRowlist = res.except_special_specifydate_tourRowlist;
        var except_specifydatelist = [];
        for (let e = 0; e < except_special_specifydate_tourRowlist.length; e++) {
          except_specifydatelist[e] = except_special_specifydate_tourRowlist[e]['tour_set_specifydate'];
        }
        console.log('->>>>>server load 제외 날짜데이터들:', except_specifydatelist);

        var result_use_datalist = [];//서버에서 가져온 각 date날짜에 대한 정보값들을 클라이언트에서 사용하기 위한 자료구조.

        for (let r = 0; r < result_total_data.length; r++) {
          let loca_result_dateData = result_total_data[r];
          console.log('.>>>>>loca result dataeData:', loca_result_dateData);
          let loca_result_getyoil = week[new Date(loca_result_dateData['date']).getDay()];//요일반환
          let loca_result_getday = new Date(loca_result_dateData['date']).getDate();//일자반환
          let loca_result_tourid = loca_result_dateData['tour_id'];
          let loca_result_tourtype = loca_result_dateData['tour_type'];
          let is_tour_holiday_except = loca_result_dateData['is_tour_holiday_except'];

          result_use_datalist[r] = {};
          result_use_datalist[r]['date'] = loca_result_dateData['date'];
          result_use_datalist[r]['setTimes'] = loca_result_dateData['setTimes'];
          result_use_datalist[r]['date_yoil'] = loca_result_getyoil;
          result_use_datalist[r]['date_day'] = loca_result_getday;
          result_use_datalist[r]['tour_id'] = loca_result_tourid;
          result_use_datalist[r]['tour_type'] = loca_result_tourtype;
          result_use_datalist[r]['is_tour_holiday_except'] = is_tour_holiday_except;
        }
        console.log('+>>>>>final result_use_datalist:', result_use_datalist);

        result_use_datalist = result_use_datalist.sort(data_ascending);

        //제외할 항목들 제외
        for (let s = 0; s < except_specifydatelist.length; s++) {
          let except_special_dates_item = except_specifydatelist[s];

          for (let h = 0; h < result_use_datalist.length; h++) {
            if (except_special_dates_item == result_use_datalist[h]['date']) {
              //제외할 항목에 해당되는 결과항목날짜의 경우 프로퍼티 invisible추가하여 제외처리한다.
              result_use_datalist[h]['isexcepted'] = true;
            }
          }
        }
        setExcept_datelist(except_specifydatelist);
        setResult_usedatalist(result_use_datalist);
        setModalOption({
          show: true,
          setShow: offModal,
          title: "투어예약 수정",
          content: { type: "component", text: `ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`, component: <MymodalReserve isvalid={isvalid} setisvalid={setisvalid} sendInfo_local={sendInfo_local} tr_id={tr_id} except_datelist={except_datelist} result_usedatalist={result_use_datalist} /> },
          submitnone: { show: false, title: "", event: () => { offModal(); } },
          cancle: { show: false, title: "", event: () => { offModal(); } },
          confirmgreennone: {
            show: true, title: "수정", event: () => {

              offModal();

              alert(sendinfo_data['isvalidss']);
              if (sendinfo_data['isvalidss'] == false) {
                alert('공휴일제외 설정인 날짜엔 신청불가합니다.');
                return false;
              }
              if (tr_info_result.is_time_decide == 1) {
                alert('중개사에 의해 시간 조정(결정)된 내역에 대해선 수정 불가능합니다.');
                return;
              }
              clickReservation_edit(tr_id, prd_identity_id, company_id);
            }
          }

        });
      }
    }
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

        {/*개인로 로그인했을때*/}
        {
          login_userinfo.user_type == '개인' ?
            <SubTitle title={"개인"} rank={false} cursor={"default"} />
            :
            <SubTitle title={login_userinfo.company_name} arrow={"▼"} path={"/Team"} rank={true} cursor={"pointer"} />
        }

        {/*기업으로 로그인했을때*/}
        {/*<SubTitle title={"소속명　"} arrow={"▼"} path={"/Team"} rank={true}/> cursor={"pointer"}*/}
        {/*중개사로 로그인했을때*/}
        {/*<SubTitle title={"럭키공인중개사　"} arrow={"▼"} path={"/Team"} rank={true}/> cursor={"pointer"}*/}

        <Reservation listData={listData} setListData={setListData} alramsetting_tiny={alramsetting_tiny} setalramsetting_tiny={setalramsetting_tiny} updateModal={updateModal} updateMapModal={updateMapModal} updateReserveModal={updateReserveModal} setMap={setMap} setFilter={setFilter} setReserve={setReserve} />
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

