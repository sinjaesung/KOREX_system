//react
import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import SubTitle from '../../../component/common/SubTitle';
import PropertyManage from '../../../component/member/mypage/propertyManage/PropertyManage';

import ModalCommon from '../../../component/common/modal/ModalCommon';
import ModalMap from '../../../component/member/mypage/propertyManage/modal/ModalMap';
import ModalFilter from '../../../component/member/mypage/propertyManage/modal/ModalFilter';
import ModalSelect from '../../../component/member/mypage/propertyManage/modal/ModalSelect';
import ModalEdit from '../../../component/member/mypage/propertyManage/modal/ModalEdit';
import ModalAllEdit from '../../../component/member/mypage/propertyManage/modal/ModalAllEdit';
import ModalEditResult from '../../../component/member/mypage/propertyManage/modal/ModalEditResult';

import ChannelServiceElement from '../../../component/common/ChannelServiceElement';

import CommonHeader from '../../../component/common/commonHeader';
import CommonFooter from '../../../component/common/commonFooter';

//server
import serverController from '../../../server/serverController';

import { useSelector } from 'react-redux';
import { Login_userActions, BunyangTeam } from '../../../store/actionCreators';

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

          console.log('=>>>>propertyYTOurtmnangae페이지 최초 실행시점때만 실행, 접수리스트 데이터 조회:');
          let body_info = {
            memid: user_info.user_data.mem_id,
            company_id: user_info.user_data.company_id,
            user_type: user_info.user_data.user_type,
            isexculsive: user_info.user_data.ispro
          };
          console.log('JSONBODY INFO TEST:', JSON.stringify(body_info));

          let ress = await serverController.connectFetchController('/api/broker/brokerproduct_reservationList', 'POST', JSON.stringify(body_info));

          if (ress) {
            console.log('res result ...>:::', ress);

            var reservation_data = ress.result_data;
            setReservationItemlist(reservation_data);
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

  //사용자 물건투어예약접수 각 내역별(개별수정,일괄수정) 수정 하는데 그 유효성관련
  const [isvalid, setisvalid] = useState(false);

  function data_ascending(a, b) {
    var left = new Date(a['date']).getTime();
    var right = new Date(b['date']).getTime();

    return left > right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
  }
  //필터 모달창
  const [filter, setFilter] = useState(false);
  //물건예약수정 모달창
  const [reserve, setReserve] = useState(false);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, submitnone: {}, cancle: {}, confirm: {}, confirmgreennone: {}, content: {} });

  // (전체 버튼 누르면 나오는) 리스트 셀렉트
  const [select, setSelect] = useState(false);
  console.log(select);

  //사용자 투어예약접수리스트 가져오기.
  const login_userinfo = useSelector(data => data.login_user);
  const [reservationItemlist, setReservationItemlist] = useState([]);//reservationItemlist 예약아이템리스트 page에서 선언하고, 여기서 사용한다. 초기화하고 건내준다.
  const [prdidvalue, setPrdidvalue] = useState('');

  //각 선택한 매물아이템에 대한 투어예약셋팅 정보로써 고유한 state로써 취급한다.
  var week = ['일', '월', '화', '수', '목', '금', '토'];

  const [except_datelist, setExcept_datelist] = useState([]);//표현에서 제외할 특정날짜 리스트
  const [result_usedatalist, setResult_usedatalist] = useState([]);//사용할 표현할 최종데이터리스트 초기값 배열

  //투어예약신청리스트 필터정렬관련
  const orderby_ref = useRef();
  const trstatus_ref = useRef();
  const prdtype_ref = useRef();
  const createorigin_ref = useRef();


  //투어예약신청리스트 변경시
  useEffect(() => {
    console.log('=>>>>>propertyTourmanage페이지의 reservationImtelist state변수값 변화감지 변화시에만 실행되는 형태', reservationItemlist, prdidvalue);

    setTridchklist([]);//빈값 초기화한다.

  }, [reservationItemlist, prdidvalue]);


  //투어예약수정모달창 관련 수정 액션시에(확인) 개별수정
  const sendinfo_data = {};
  const sendInfo_local = (selectDay, selectTimes, tourid, tourtype, td_id, r_tr_id, starttime, endtime, isvalidss) => {
    console.log('sendtime localsssss:', isvalidss);

    console.log('selectTIMES,TDID:', selectTimes, td_id, String(selectTimes).indexOf("|"));

    if (!selectDay || !tourid || !tourtype || !td_id || !selectTimes) {
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

      if (starttime == '9:00am' || starttime == '09:00:00') {
        sendinfo_data['reserv_start_time'] = selectDay + ' 09:00:00';
      } else if (starttime == '12:00pm' || starttime == '12:00:00') {
        sendinfo_data['reserv_start_time'] = selectDay + ' 12:00:00';
      } else if (starttime == '15:00pm' || starttime == '15:00:00') {
        sendinfo_data['reserv_start_time'] = selectDay + ' 15:00:00';
      } else if (starttime == '18:00pm' || starttime == '18:00:00') {
        sendinfo_data['reserv_start_time'] = selectDay + ' 18:00:00';
      }

      if (endtime == '9:00am' || endtime == '09:00:00') {
        sendinfo_data['reserv_end_time'] = selectDay + ' 09:00:00';
      } else if (endtime == '12:00pm' || endtime == '12:00:00') {
        sendinfo_data['reserv_end_time'] = selectDay + ' 12:00:00';
      } else if (endtime == '15:00pm' || endtime == '15:00:00') {
        sendinfo_data['reserv_end_time'] = selectDay + ' 15:00:00';
      } else if (endtime == '18:00pm' || endtime == '18:00:00') {
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
    console.log('is validss trakcingstss :L', isvalid);
  }, [isvalid]);

  const sendInfo_local_starttime = (time) => {

    sendinfo_data['reserv_start_time'] = sendinfo_data['selectDay'] + ' ' + time;//문자열 그대로 저장.
    console.log('sendinfo_local_starttime>>:', sendinfo_data);
  }
  const sendInfo_local_endtime = (time) => {

    sendinfo_data['reserv_end_time'] = sendinfo_data['selectDay'] + ' ' + time;
    console.log('sendinfo_local_endtime:', sendinfo_data);
  }
  const clickReservation_edit = async (reserv_memid, email, phone, name, request_user_selectsosokid) => {
    console.log('reservation(id선택한 방문예약셋팅날짜 수정::', sendinfo_data, reserv_memid, email, phone, name, request_user_selectsosokid);

    offModal();

    if (sendinfo_data) {
      if (sendinfo_data.selectDay == '' || sendinfo_data.selectDay == null || sendinfo_data.selectTimes == '' || sendinfo_data.selectTimes == null || sendinfo_data.tourid == '' || sendinfo_data.reserv_start_time == '' || sendinfo_data.reserv_end_time == '' || sendinfo_data.reserv_start_time.indexOf(':') == -1 || sendinfo_data.reserv_end_time.indexOf(":") == -1) {
        alert('입력값에 문제가있습니다. 조율시간값을 확인바랍니다.');
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
        starttime: sendinfo_data.reserv_start_time, //starttime~endtime 시작~종료시간대.조율시간대  최종 서버 저장은 날짜 포함 문자열로 저장처리.
        endtime: sendinfo_data.reserv_end_time
      };

      console.log('JSON_BODY>>>:', JSON.stringify(body_info));

      let res = await serverController.connectFetchController('/api/broker/brokerProduct_tourRerservation_modify', 'POST', JSON.stringify(body_info));//중개사가 특정 접수내역에 대한 개별수정(특정한개 대상체)에 대한 개별수정시에만 일단 현재는 더이상 수정못하게끔 하는(개인기업신청자가)플래그를 넣는다.

      if (res) {
        console.log('====>>>>>res_result::', res);

        if (res.success) {
          alert('예약접수시간 변경되었습니다!.');

          //에약접수시간변경완료시에 예약자에게 관련 내역 변경된 내역상태 시간값 발송한다. 요청한 예약자 reservmemid대상자에게.
          let noti_info = {
            tour_reserv_id: sendinfo_data.r_tr_id,
            request_mem_id: reserv_memid,//그 신청한 사람에 대한 쿼리를 해서 그 로그인유저 신청자의 현재companyid선택저장 소속값으로 해서 처리.
            request_user_selectsosokid: request_user_selectsosokid,
            message: '신청하신 물건투어예약접수 변경사항 전달드립니다.\n 날짜:' + sendinfo_data.selectDay + '\n 예약조정시간' + sendinfo_data.reserv_start_time + '~' + sendinfo_data.reserv_end_time,
            noti_type: 10//물건투어예약접수내역 개별수정 시간 재조정시에 관련 개인기업 대상자 신청한trid내역신청의뢰자에 소속companyid 소속팀원들에게 재조정사실알림가한다.
          }
          let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
          if (noti_res) {
            if (noti_res.success) {
              console.log('noti ressssresults:', noti_res);
            } else {
              alert(noti_res.message);
            }
          }
          //예약접수시간 개별 변경완료시에 예약자에게 관련 내역 변경내역 시간값 발송한다. 요청한 예약자 RESEVEMMEID대상 폰에게
          if (phone && name) {
            let sms_info = {
              receiver: phone,
              msg: '신청하신 물건투어예약접수 변경사항 전달드립니다.\n 날짜:' + sendinfo_data.selectDay + '\n 예약조정시간' + sendinfo_data.reserv_start_time + '~' + sendinfo_data.reserv_end_time,
              msg_type: 'LMS',
              type: '물건투어예약접수 예약시간조정'
            };
            let sms_res = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info));
            console.log('aligoSMS SEND RES RESULTSSS:', sms_res);

            if (sms_res) {
              if (!sms_res.success) {
                alert('발송오류 발생:', sms_res.message);
              }
            }
          } else {
            alert('외부수임인 정보가 없습니다! 알림을 보낼수없습니다.');
            return;
          }

          //개별수정(trid목록중선택한)한 항목의 변경하고자 한 날짜.를 지정하고, 변경할 tr관련된것들 지정되어있는 노티피케이션 memid별,notiytype별,tr_id내역별 관련 알림목록.투어일일전 알림 관련된 사항들 update발생.
          let reserv_date = sendinfo_data.selectDay;
          let date_format = new window.Date(reserv_date);
          date_format = date_format.getTime() - (1 * 24 * 60 * 60 * 1000);
          date_format = new window.Date(date_format);
          let year = date_format.getFullYear();
          let month = date_format.getMonth() + 1;
          let date = date_format.getDate();
          if (month < 10) {
            month = '0' + month;
          }
          if (date < 10) {
            date = '0' + date;
          }
          reserv_date = new window.Date(year + '-' + month + '-' + date);
          console.log('예약알림 수정일로 지정한 날짜값:', reserv_date);

          //전문중개사회원 특정선택trid관련 대상체 그 tr이 누가 신청했던건지 구한다. 그를통해 그 mmeid소속관련 팀원들에게 모두 알림.
          let noti_info2 = {
            tour_reserv_id: sendinfo_data.r_tr_id,//관련 투어trid신청id
            noti_reserv_date: reserv_date,
            message: sendinfo_data.r_tr_id + ':::물건투어예약 방문예정일 1일전입니다.\n',
            request_mem_id: reserv_memid,
            request_user_selectsosokid: request_user_selectsosokid,
            noti_type: 11,//물건투어예약 일일전 예약발송
            action: 'update'
          };
          let noti_res2 = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info2));
          if (noti_res2) {
            if (noti_res2.success) {
              console.log('noti resulsstss:', noti_res2);
            } else {
              alert(noti_res2.message);
            }
          }
          //history.push('/Mypage');
        } else {
          alert(res.message);
        }
      }

    } else {
      //비로그인 상태
    }
  }

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const cancleModal = (tr_id, mem_id, email, phone, name,request_user_selectsosokid) => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "예약 해제",
      content: { type: "text", text: `예약을 해제하시겠습니까?\n해제 시, 예약자에게 알림이 전송됩니다.`, component: "" },
      submit: {
        show: true, title: "확인", event: async () => {
          offModal();

          console.log('what tr_id::', tr_id);

          let body_info = {
            tr_id_val: tr_id
          };
          let res = await serverController.connectFetchController('/api/broker/brokerproduct_reservation_release', 'POST', JSON.stringify(body_info));

          if (res) {
            console.log('ress_>>>>>>:', res);

            if (res.success) {
              let noti_info = {
                tour_reserv_id: tr_id,//관련 신청아이디값.
                request_memid: mem_id,//관련 어떤 유저가 신청한건지(소속까지)에 대해서 예약해제되었다고 알림
                request_user_selectsosokid: request_user_selectsosokid,
                message: name + '(' + phone + ') :' + email + ' 님이 신청하신 물건투어예약접수 해제처리되었습니다!',
                noti_type: 10
              }
              let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
              if (noti_res) {
                if (noti_res.success) {
                  confirmModal();
                } else {
                  alert(noti_res.message);
                }
              }
            } else {
              alert(res.message);
            }
          }
        }
      },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }
  //예약해제 완료되었습니다 모달
  const confirmModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "예약 해제",
      content: { type: "text", text: `예약해제가 완료되었습니다.`, component: "" },
      submit: { show: false, title: "확인", event: () => { offModal(); } },
      cancle: { show: false, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
      confirmgreennone: { show: true, title: "확인", event: () => { offModal(); history.push('/Mypage'); } }
    });
  }
  //물건투어예약접수내역 필터처리.
  const updateModal = () => {
    //setSelect(false);
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "필터",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalFilter orderby_ref={orderby_ref} trstatus_ref={trstatus_ref} prdtype_ref={prdtype_ref} createorigin_ref={createorigin_ref} /> },
      submitnone: {
        show: true, title: "적용", event: async () => {
          offModal(); setSelect(false); setPrdidvalue('');
          console.log('필터 적용 버튼 클릭::');
          const orderby = document.querySelector('.OptionSelect').getAttribute('option');
          const trstatus = document.querySelector('.OptionSelect2').getAttribute('option2');
          const prdtype = document.querySelector('.OptionSelect3').getAttribute('option3');
          const createorigin = document.querySelector('.OptionSelect4').getAttribute('option4');

          // console.log(orderby_ref.current.value,prdtype_ref.current.value,trstatus_ref.current.value,createorigin_ref.current.value);
          console.log(orderby, trstatus, prdtype, createorigin);

          let body_info = {
            orderby: orderby,
            trstatus: trstatus,
            prdtype: prdtype,
            createorigin: createorigin,
            // orderby: orderby_ref.current.value,
            // trstatus: trstatus_ref.current.value,
            // prdtype: prdtype_ref.current.value,
            // createorigin: createorigin_ref.current.value,
            memid: login_userinfo.memid,
            company_id: login_userinfo.company_id,
            user_type: login_userinfo.user_type,
            isexculsive: login_userinfo.ispro
          };
          console.log(body_info);

          let res = await serverController.connectFetchController('/api/broker/brokerproduct_reservationList_filter', 'POST', JSON.stringify(body_info));
          console.log(res);
          if (res) {
            if (res.success) {
              console.log('res resultsss:::>>>', res);

              var reservation_data = res.result_data;
              setReservationItemlist(reservation_data);
            }
          }
        }
      },
      cancle: { show: true, title: "초기화", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } }
    });
  }
  const search_keyword_filter = async (e) => {
    //검색(건물명,의뢰인명)기준 관련 검색 
    console.log('검색어 입력시작:', e.target.value);
    setPrdidvalue(''); setSelect(false);//setSelect는 특정 매물idneintityid를 택했나 안했나 여부로 그 매물에 접수한 내역만 보여지는 일괄수정모드,setprdidivalue는 어떤prdiidntietiyid택한건지 알수있음.이것을 초기값으로 한다는것은 매물별 조회모드->일반 전체조회 모드로 전환을 의미한다.
    let search_keyword = e.target.value;
    //if(search_keyword){
    let body_info = {
      search_keyword_val: search_keyword,
      memid: login_userinfo.memid,
      company_id: login_userinfo.company_id,
      user_type: login_userinfo.user_type,
      isexculsive: login_userinfo.ispro
    };
    let search_result = await serverController.connectFetchController('/api/broker/brokerproduct_reservationList_filter2', 'POST', JSON.stringify(body_info));

    if (search_result) {
      if (search_result.success) {
        console.log('search reusltsss:', search_result);

        var reservation_data = search_result.result_data;
        setReservationItemlist(reservation_data);
      }
    }
    //}
  }

  const mapModal = (addr_jibun, addr_road, prd_longitude, prd_latitude) => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "건물 위치",
      content: { type: "component", text: ` 완료되었습니다.`, component: <ModalMap addr_jibun={addr_jibun} addr_road={addr_road} prd_longitude={prd_longitude} prd_latitude={prd_latitude} /> },
      submit: { show: false, title: "확인", event: () => { offModal(); } },
      cancle: { show: false, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
    });
  }
  const selectModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "물건별 검색",
      content: { type: "component", text: ``, component: <ModalSelect setTridchklist={setTridchklist} setPrdidvalue={setPrdidvalue} setReservationItemlist={setReservationItemlist} select={select} setSelect={(e) => { setSelect(e); offModal(); }} /> },
      submit: { show: false, title: "확인", event: () => { offModal(); } },
      cancle: { show: false, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } },
    });
  }
  //임의 항목 수정하기 누를시 투어예약접수관리 개별수정.특정 매물id에 대한 셋팅리스트 보여주며, 그 tr_id에 대해서 수정처리될수있게한다.
  const editModal = async (select_prd_identity_id, r_tr_id, reserv_memid, email, phone, name, request_user_selectsosokid) => {

    let body_info = {
      id: select_prd_identity_id
    };
    let res = await serverController.connectFetchController('/api/broker/brokerProduct_toursetting_dates', 'POST', JSON.stringify(body_info));

    if (res) {
      console.log("res_result:", res);

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
          title: "물건투어예약접수 수정",
          content: { type: "component", text: ``, component: <ModalEdit isvalid={isvalid} setisvalid={setisvalid} sendInfo_local={sendInfo_local} sendInfo_local_starttime={sendInfo_local_starttime} sendInfo_local_endtime={sendInfo_local_endtime} select_prd_identity_id={select_prd_identity_id} r_tr_id={r_tr_id} except_datelist={except_datelist} result_usedatalist={result_use_datalist} /> },
          submit: { show: false, title: "확인", event: () => { offModal(); } },
          cancle: { show: false, title: "취소", event: () => { offModal(); } },
          confirm: {
            show: true, title: "확인", event: () => {

              offModal();
              alert(sendinfo_data['isvalidss']);
              if (sendinfo_data['isvalidss'] == false) {
                alert('공휴일제외 설정인 날짜입니다.');
                return false;
              }
              editResultModal();
              clickReservation_edit(reserv_memid, email, phone, name, request_user_selectsosokid);
            }
          }
        });
      }
    }
  }


  //일괄수정처리.
  //투어예약수정 매물(한개)에 대한 여러 trlist에 대한 체크항목들 일괄수정.

  //체크모드,매물별 trlist 일괄수정 모드시에 관련 사용
  //어떤 tridlist체크했는지 여부
  const [Tridchklist, setTridchklist] = useState([]);

  const tridchklist_function = (value, type) => {
    console.log('현재 체크된 tridchcklistt:', Tridchklist);

    var tridchklist_array = Tridchklist;
    var is_exists = false;
    if (type == 'add') {
      for (let j = 0; j < tridchklist_array.length; j++) {
        if (tridchklist_array[j] == value) {
          is_exists = true;
        }
      }
      if (is_exists) {

      } else {
        tridchklist_array.push(value);
      }
    } else if (type == 'remove') {
      let find_remove_index;
      for (let r = 0; r < tridchklist_array.length; r++) {
        if (tridchklist_array[r] == value) {
          //삭제할 항목에 해당하는 요소의 인댁스를 찾는다.
          find_remove_index = r;
        }
      }
      tridchklist_array.splice(find_remove_index, 1);//해당 위치에서의 한개 삭제한다.
    }
    console.log('삭제/add 적용 tridchklist_array:', tridchklist_array);
    setTridchklist(tridchklist_array);
  }

  const [except_datelist_for_multimodify, setExcept_datelist_for_mutlimodify] = useState([]);
  const [result_usedatalist_for_multimodify, setResult_usedatalist_for_multimodify] = useState([]);

  const sendinfo_data_multimodify = {};
  const sendInfo_local_multimodify = (selectDay, selectTimes, tourid, tourtype, td_id, tridchklist, starttime, endtime, isvalidss) => {
    console.log('sendtime locaslssss:', isvalidss);

    console.log('selectTIMES,TDID:', selectDay, selectTimes, td_id, String(selectTimes).indexOf("|"), starttime, endtime);

    if (!selectDay || !selectTimes || !tourid || !td_id || !tourtype) {
      if (isvalidss == true) {
        sendinfo_data_multimodify['isvalidss'] = isvalidss;
      } else if (isvalidss == false) {
        sendinfo_data_multimodify['isvalidss'] = isvalidss;
      }

      return false;
    } else {
      if (isvalidss == true) {
        sendinfo_data_multimodify['isvalidss'] = isvalidss;
      } else if (isvalidss == false) {
        sendinfo_data_multimodify['isvalidss'] = isvalidss;
      }

      if (starttime == '9:00am') {
        sendinfo_data_multimodify['reserv_start_time'] = selectDay + ' 09:00:00';
      } else if (starttime == '12:00pm') {
        sendinfo_data_multimodify['reserv_start_time'] = selectDay + ' 12:00:00';
      } else if (starttime == '15:00pm') {
        sendinfo_data_multimodify['reserv_start_time'] = selectDay + ' 15:00:00';
      } else if (starttime == '18:00pm') {
        sendinfo_data_multimodify['reserv_start_time'] = selectDay + ' 18:00:00';
      }

      if (endtime == '9:00am') {
        sendinfo_data_multimodify['reserv_end_time'] = selectDay + ' 09:00:00';
      } else if (endtime == '12:00pm') {
        sendinfo_data_multimodify['reserv_end_time'] = selectDay + ' 12:00:00';
      } else if (endtime == '15:00pm') {
        sendinfo_data_multimodify['reserv_end_time'] = selectDay + ' 15:00:00';
      } else if (endtime == '18:00pm') {
        sendinfo_data_multimodify['reserv_end_time'] = selectDay + ' 18:00:00';
      }

      sendinfo_data_multimodify['selectDay'] = selectDay; //일괄수정모달창에서의 액션시 가져온 selectDay, 수정할 trid리스트
      sendinfo_data_multimodify['selectTimes'] = String(selectTimes).indexOf('|') != -1 ? String(selectTimes).split('|')[0] : selectTimes;
      sendinfo_data_multimodify['tourid'] = tourid;
      sendinfo_data_multimodify['tourtype'] = tourtype;
      sendinfo_data_multimodify['td_id'] = String(td_id).indexOf('|') != -1 ? String(td_id).split('|')[0] : td_id;
      sendinfo_data_multimodify['tridchklist'] = tridchklist;//어떤 예약신청아이디인지 여부 저장.

    }

    console.log('sendinfo_local정보 확인 먼저 저장여부>>>>:', sendinfo_data_multimodify);
  }
  const sendInfo_local_multimodify_starttime = (time) => {

    sendinfo_data_multimodify['reserv_start_time'] = sendinfo_data_multimodify['selectDay'] + ' ' + time;//문자열 그대로 저장.
    console.log('sendinfo_local_starttime>>:', sendinfo_data_multimodify);
  }
  const sendInfo_local_multimodify_endtime = (time) => {

    sendinfo_data_multimodify['reserv_end_time'] = sendinfo_data_multimodify['selectDay'] + ' ' + time;
    console.log('sendinfo_local_endtime:', sendinfo_data_multimodify);
  }
  const clickReservation_edit_multimodify = async () => {
    console.log('reservation(id선택한 방문예약셋팅날짜 수정::', sendinfo_data_multimodify);

    offModal();

    if (sendinfo_data_multimodify) {

      if (sendinfo_data_multimodify.selectDay == '' || sendinfo_data_multimodify.selectDay == null || sendinfo_data_multimodify.selectTimes == '' || sendinfo_data_multimodify.tourid == '' || sendinfo_data_multimodify.reserv_start_time == '' || sendinfo_data_multimodify.reserv_end_time == '' || sendinfo_data_multimodify.reserv_start_time.indexOf(':') == -1 || sendinfo_data_multimodify.reserv_end_time.indexOf(':') == -1) {
        alert('입력값이 비어있습니다');
        return;
      }
    }
    if (login_userinfo.is_login) {
      let body_info = {
        tridchklist: sendinfo_data_multimodify.tridchklist.join(','),//어떤 tr_id항목들 집합들에 대해서 수정하는건지 일괄수정인지
        selectdate: sendinfo_data_multimodify.selectDay,
        selectTime: sendinfo_data_multimodify.selectTimes,
        selectTourid: sendinfo_data_multimodify.tourid,//바꿀 날짜,시간대,tourid,타입,시간대,
        selectTourtype: sendinfo_data_multimodify.tourtype,
        selectTdid: sendinfo_data_multimodify.td_id,
        starttime: sendinfo_data_multimodify.reserv_start_time,
        endtime: sendinfo_data_multimodify.reserv_end_time
      };

      console.log('JSON_BODY>>>:', JSON.stringify(body_info));

      let res = await serverController.connectFetchController('/api/broker/brokerProduct_tourRerservation_multimodify', 'POST', JSON.stringify(body_info));

      if (res) {
        console.log('====>>>>>res_result::', res);

        if (res.success) {
          alert('예약접수시간변경 일괄 수정되었습니다.');

          //각 체크 trid들 에대한 tourReservation내역들 가져온다. 각 신청목록별 정보를 얻기위함.
          let tridchklist_send = {
            tridchklist: sendinfo_data_multimodify.tridchklist.join(',')
          }
          let tridchklist_reserveinfo = await serverController.connectFetchController('/api/broker/brokerProduct_tourReservation_partlist', 'POST', JSON.stringify(tridchklist_send));
          if (tridchklist_reserveinfo) {
            if (tridchklist_reserveinfo.success) {
              console.log('tridchklist_reserverfino', tridchklist_reserveinfo.result_data);
              //예약접수시간 일괄변경완료시 예약자들에게 관련 내역 변경된 내역상태 시간값 발송한다. 요청한 예약자 rservmemid대상자들에게.
              let reserv_list = tridchklist_reserveinfo.result_data;
              if (reserv_list.length >= 1) {
                for (let ha = 0; ha < reserv_list.length; ha++) {
                  let noti_info = {
                    tour_reserv_id: reserv_list[ha].tr_id,//각 trid값.
                    request_mem_id: reserv_list[ha].mem_id,//어떤 사람이 신청했는지 여부. 그 사람의 소속에 따른.
                    request_user_selectsosokid: reserv_list[ha].request_user_selectsosokid,//각 투어신청내역에서의 의뢰한자의 당시소속값을 기준으로 알려져야함.
                    message: '신청하신 물건투어예약접수 변경사항 전달드립니다. \n 날짜:' + sendinfo_data_multimodify.selectDay + '\n 예약조정시간:' + sendinfo_data_multimodify.reserv_start_time + '~' + sendinfo_data_multimodify.reserv_end_time,
                    noti_type: 10//하나하나는 결국 각각의신청자에게 수정된 사항에 대한 알림(개별적수정)
                  }
                  let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
                  if (noti_res) {
                    if (noti_res.success) {

                    } else {
                      //alert(noti_res.message);
                    }
                  }
                }

                //전문중개사 회원이 특정 신청trid인포 내역별로 일괄수정하는것, 그 관련 대상자(소속체memid들 각 for문별)에게 관련 저장처리(예약알림시간변경)지정한다.관련된 trid 개별수정일때뿐 아니라 각 개별tr_id별 일괄수정하려는 특정날짜들로 관련 수정 알림.
                let reserv_date = sendinfo_data_multimodify.selectDay;
                let date_format = new window.Date(reserv_date);
                date_format = date_format.getTime() - (1 * 24 * 60 * 60 * 1000);
                date_format = new window.Date(date_format);
                let year = date_format.getFullYear();
                let month = date_format.getMonth() + 1;
                let date = date_format.getDate();//년 월일
                if (month < 10) {
                  month = '0' + month;
                }
                if (date < 10) {
                  date = '0' + date;
                }
                reserv_date = new window.Date(year + '-' + month + '-' + date);
                console.log('예약알림일로 지정한 날짜값:', reserv_date);

                for (let ss = 0; ss < reserv_list.length; ss++) {
                  let noti_info2 = {
                    tour_reserv_id: reserv_list[ss].tr_id,//각 수정하려는 trid인포값 하나하나.
                    noti_reserv_date: reserv_date,//반복문밖에서 trid여러개를 일괄수정하려는 그 선택한 수정날짜값
                    message: reserv_list[ss].tr_id + ':::물건투어예약 방문에정일 1일전입니다.\n',
                    request_mem_id: reserv_list[ss].mem_id,//각 trid(tourResevation row)별 신청했었던 그 memid정보(그 memid와 같은 소속체 기업회원들 및 개인그 정보자체)
                    request_user_selectsosokid: reserv_list[ss].request_user_selectsosokid,//각 신청내역에서의 예약자의 당시소속값 보낸다.관련하여 알림가해지게처리.
                    noti_type: 11,
                    action: 'update'
                  }
                  let noti_res2 = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info2));
                  if (noti_res2) {
                    if (noti_res2.success) {
                      console.log('noti reuls reuslsstss:', noti_res2);
                    } else {
                      alert(noti_res2.message);
                    }
                  }
                }//trid반복문별로 관련 수정 저장처리 로직 발생.각trid별 관련된 소속쳉팀원들에게 투어예약방문일일전 관련 예약알림 수정액션 발생.
                history.push('/Mypage');
              }
            } else {
              alert(tridchklist_reserveinfo.message);
            }
          }

        } else {
          alert(res.message);
        }
      }

    } else {
      //비로그인 상태
    }
  }
  const editAllModal = async (prdidvalue) => {
    //일괄수정하려는 대상들 리스트(trlist)의 카운트와, 그 리스트들이 어떠한 매물(prd_identity_id)에 대한 방문예약신청인것들인지(단일id)구한다.어떠한 tr_id리스트들을 일괄 수정인지 구한다. 일괄수정이면 전체 수정을 하는 액션 취하는것이고, 체크한것들 수정을 취한다. 정확히는 선택한 tr들을 수정처리한다. 어떤 tr_list체크한건지 같이 전달하여 반복문돌리면서 모두 동일한 내용으로 수정하려는 내용으로 처리한다.

    let body_info = {
      id: prdidvalue
    }
    let res = await serverController.connectFetchController('/api/broker/brokerProduct_toursetting_dates', 'POST', JSON.stringify(body_info));

    if (res) {
      console.log("res_result:", res);

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
        setExcept_datelist_for_mutlimodify(except_specifydatelist);
        setResult_usedatalist_for_multimodify(result_use_datalist);

        if (Tridchklist.length < 1) {
          alert('일괄 수정할 항목들을 체크해주세요!');
          return false;
        }

        setModalOption({
          show: true,
          setShow: offModal,
          title: "물건투어예약접수 일괄 수정",
          content: { type: "component", text: ``, component: <ModalAllEdit isvalid={isvalid} setisvalid={setisvalid} sendInfo_local_multimodify={sendInfo_local_multimodify} sendInfo_local_multimodify_starttime={sendInfo_local_multimodify_starttime} sendInfo_local_multimodify_endtime={sendInfo_local_multimodify_endtime} Tridchklist={Tridchklist} prdidvalue={prdidvalue} except_datelist_for_multimodfiy={except_datelist_for_multimodify} result_usedatalist_for_multimodify={result_use_datalist} /> },
          submit: { show: false, title: "확인", event: () => { offModal(); } },
          cancle: { show: false, title: "취소", event: () => { offModal(); } },
          confirm: {
            show: true, title: "확인", event: () => {
              offModal();
              alert(sendinfo_data_multimodify['isvalidss']);
              if (sendinfo_data_multimodify['isvalidss'] == false) {
                alert('공휴일 제외설정인 날짜입니다.');
                return false;
              }
              editResultModal();
              clickReservation_edit_multimodify();
            }
          }
        });
      }

    }
  }
  //예약수정 얼럿창
  const editResultModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "물건투어예약접수",
      content: { type: "component", text: ``, component: <ModalEditResult /> },
      submit: { show: true, title: "확인", event: () => { offModal(); } },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirm: { show: false, title: "확인", event: () => { offModal(); } }
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
        <SubTitle title={"소속명"} arrow={"　▼"} path={"/Team"} cursor={"pointer"} />
        <PropertyManage tridchklist_function={tridchklist_function} prdidvalue={prdidvalue} reservationItemlist={reservationItemlist} cancleModal={cancleModal} confirmModal={confirmModal} select={select} setSelect={setSelect}
          mapModal={mapModal} selectModal={selectModal} updateModal={updateModal} search_keyword_filter={search_keyword_filter} editModal={editModal} editAllModal={editAllModal} editResultModal={editResultModal} setTridchklist={setTridchklist} />
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