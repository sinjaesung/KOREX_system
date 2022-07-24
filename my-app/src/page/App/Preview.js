//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

//component
import Preview from '../../component/AppComponent/Preview';
import ModalCommon from "../../component/common/modal/ModalCommon";
import ModalEdit from "../../component/AppComponent/modal/ModalEdit";
import ReportModal from "../../component/AppComponent/modal/ReportModal";
import ModalReject from "../../component/AppComponent/modal/ModalReject";

import CommonHeader from '../../component/common/commonHeader';
import CommonFooter from '../../component/common/commonFooter';
import ChannelServiceElement from '../../component/common/ChannelServiceElement';

//server controller
import serverController from '../../server/serverController';

export default function Join({ match }) {
  const history = useHistory();
  console.log('app/preview페이지 도달 등록 거래준비매물 미리보기페이지>>;', match, match.params.id);
  var prd_identity_id = match.params.id;

  ChannelServiceElement.shutdown();//모든 페이지 기본값 닫기!

  var rejectreason_change = (value) => {
    rejectreason = value;
  }
  var rejectreason = '';
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, submitnone: {}, cancle: {}, confirm: {}, confirmgreennone: {}, link: {}, content: {} });
  const [off, setOff] = useState(false);
  const [maemulinfo, setmaemulinfo] = useState({});
  const [buildinginfo, setbuildinginfo] = useState({});//아파트,오피스텔의 경우 동정보건물정보
  const [complexinfo, setcomplexinfo] = useState({});

  const [probrokerinfo, setprobrokerinfo] = useState({});


  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }
  const updateReserveModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "물건투어예약",
      content: { type: "component", text: `ddfdf`, component: <ModalEdit /> },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: true, title: "수정", event: () => { offModal(); } }

    });
  }
  const reportModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "허위매물신고",
      content: { type: "component", text: `ddfdf`, component: <ReportModal off={off} setOff={(e) => { setOff(e); offModal(); }} /> },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: false, title: "수정", event: () => { offModal(); } }

    });
  }

  const rejectModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "거절 사유",
      content: { type: "component", text: `ddfdf`, component: <ModalReject rejectreason_change={rejectreason_change} off={off} setOff={(e) => { setOff(e); offModal(); }} /> },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirmgreennone: {
        show: true, title: "확인", event: async () => {
          console.log('거절사유 상태::', rejectreason, maemulinfo);

          //거래갯시스인요청 거절상태값 변화 요청
          let req_info = {
            prd_identity_id: prd_identity_id,
            company_id: maemulinfo.company_id,//해당 나온 companyid 값 어떤 매물 그리고 어떤 선임중개사인지여부
            prd_status_val: '거래개시동의요청 거절',
            generator_memid: '',
            change_reason: rejectreason
          };
          console.log('거래개시동의요청한 매물 외부수임or의뢰매물 상관없이, 거래개시동의요청 거절상태값으로 insert할ㄹ뿐임:', JSON.stringify(req_info));
          let prdstatus_result = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(req_info));
          console.log('prdstatus resultsss:', prdstatus_result);

          if (prdstatus_result) {
            if (prdstatus_result.success) {
              alert('>>>거래개시동의요청거절 상태값 변경');

              let noti_info = {
                prd_identity_id: prd_identity_id,
                company_id: maemulinfo.company_id,//어떤 선임중개사에게 사업체회원들에게 보내는지
                message: prd_identity_id + '::해당매물 의뢰자로부터 거래개시동의요청 거절받았습니다.',
                noti_type: 6
              }
              let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
              if (noti_res) {
                if (noti_res.success) {
                  console.log('noti_resss:', noti_res);

                } else {
                  alert(noti_res.message);
                }
              }
            }
            rejectModalConfirm();
          } else {
            alert(prdstatus_result.message);
          }

          history.push('/');
        }
      }
    });
  }
  const rejectModalConfirm = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "거절 사유",
      content: { type: "text", text: `정상적으로 처리 되었습니다.`, component: '' },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }

    });
  }

  const confirmModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "거래개시동의",
      content: { type: "text", text: `중개사가 거래개시동의를 요청하였습니다.\n전속기간 종료시 전속매물은 자동삭제되며,\n중개의뢰 계약은 자동종료됩니다.\n거래개시에 동의하시겠습니까?`, component: '' },
      submitnone: {
        show: true, title: "동의", event: async () => {
          offModal();
          //alert('거래개시 승인 요청!');

          let req_info = {
            prd_identity_id: prd_identity_id,
            company_id: maemulinfo.company_id,
            prd_status_val: '거래개시',
            generator_memid: '',
            change_reason: ''
          };
          console.log('거래개시 승인요청한 매물 외보수임or의로매물 상관없이 거래개승인요청 수락상태값으로 insert할뿐임:', JSON.stringify(req_info));
          // let prdstatus_result = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(req_info));

          let body = {
            prd_status : '거래개시'
          }

          let prdstatus_result = await serverController.connectFetchController(`/api/products/${prd_identity_id}`, 'PATCH', JSON.stringify(body));
          console.log('prdstatus_resultsss:', prdstatus_result);

          //의뢰인이 거래개시승인수락하는 경우 전속기간 기 가산일 시작~
           let exculsive_info = {
             prd_identity_id: prd_identity_id,
             company_id: maemulinfo.company_id,//어떤 중개사으 수임매물에 대해서 처리할건지
             type:'origin'
           }
           let exculsive_start = await serverController.connectFetchController('/api/broker/brokerRequest_product_exculsivestart', 'POST', JSON.stringify(exculsive_info));

          //거래개시승인 수락받음. 관련알림 전문중개사들에게.
          if (prdstatus_result) {
            if (prdstatus_result.success) {
              alert('전속매물이 거래개시 되었습니다.');

              let noti_info = {
                prd_identity_id: prd_identity_id,
                company_id: maemulinfo.company_id,//어떤 선임중개사에게 사업체회원들에게 보낼건지
                message: prd_identity_id + '::해당매물 의뢰자로부터 거래개시동의요청 수락받았습니다.',
                noti_type: 6
              }
              let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
              if (noti_res) {
                if (noti_res.success) {
                  console.log('niti resressss:', noti_res);
                } else {
                  alert(noti_res.message);
                }
              }
            }
          } else {
            alert(prdstatus_result.message);
          }

          if (exculsive_start) {
            console.log('excuslive_startsss 전속기간 계약시작~종료일::', exculsive_start);
            if (!exculsive_start.success) {
              alert(exculsive_start.message);
            } else {
              //전속기한 관련 수정 및 처리완료시에 수정된 전속기한만료일에 대한 관련 예약알림가한다.
              let process_result = exculsive_start.result;
              let exclusive_end_date = process_result.exclusive_end_date;//전속기한 만료일.만료예정일.

              let maemulinfo_data_loca = '만료일시:' + exclusive_end_date + '\n수임인:' + maemulinfo.company_id + '중개사\n등록번호:' + prd_identity_id + '\n물건종류:' + maemulinfo.prd_type + '\n건물명:' + maemulinfo.prd_name + ' ' + maemulinfo.dong_name + '동' + maemulinfo.ho_name + '호\n 건물주소:' + maemulinfo.addr_road + '\n 거래유형:' + maemulinfo.prd_sel_type + ' ' + (maemulinfo.prd_sel_type == '월세' ? (maemulinfo.prd_month_price + '만 / 보증금:' + maemulinfo.prd_price + '만') : (maemulinfo.prd_price + '만'));

              console.log('maemulinfo locasss:', maemulinfo_data_loca);
              if (exclusive_end_date) {
                //전속기간마감일 또는 
                var last_date = exclusive_end_date;
                var last_date_date = new Date(exclusive_end_date);
                var last_date_date2 = new Date(exclusive_end_date);
                var last_date_targetdate = last_date_date2.setDate(last_date_date2.getDate() - 3);//대상일의 삼일전.
                last_date_targetdate = new Date(last_date_targetdate);
                console.log('전속기한만료일 및 만료삼일전:', last_date, last_date_targetdate);
                var last_targetdate_year = last_date_targetdate.getFullYear();
                var last_targetdate_month = last_date_targetdate.getMonth() + 1;
                var last_targetdate_date = last_date_targetdate.getDate();
                last_date_targetdate = String(last_targetdate_year) + (last_targetdate_month < 10 ? '0' + last_targetdate_month : last_targetdate_month) + String(last_targetdate_date < 10 ? '0' + last_targetdate_date : last_targetdate_date);//20210802이런형태로 처리.
                var last_date_year = last_date_date.getFullYear();
                var last_date_month = last_date_date.getMonth() + 1;
                var last_date_dates = last_date_date.getDate();
                last_date_date = String(last_date_year) + (last_date_month < 10 ? '0' + last_date_month : last_date_month) + String(last_date_dates < 10 ? '0' + last_date_dates : last_date_dates);

                var noti_reserv_date_threeday = String(last_targetdate_year) + '-' + (last_targetdate_month < 10 ? '0' + last_targetdate_month : last_targetdate_month) + '-' + last_targetdate_date;
                var noti_reserv_date_day = String(last_date_year) + '-' + (last_date_month < 10 ? '0' + last_date_month : last_date_month) + '-' + last_date_dates;

                console.log('예약발송일(전속기한마감 삼일전, 당일):', last_date_targetdate, last_date_date, noti_reserv_date_threeday, noti_reserv_date_day);

                if (maemulinfo.prd_create_origin == '중개의뢰') {
                  //삼일전 알림
                  let notis_info = {
                    prd_identity_id: prd_identity_id,//알람 관련 txn_id아디(매물 거래개시된 매물 전속기한 풀린 거래개시매물에 대해서 전속기한마감당일,삼일전 관련 예약알림셋팅)
                    request_mem_id: maemulinfo.request_mem_id,//중개의뢰인 경우엔 requestmemid존재한다,. 따라서 이를 보낸다. 
                    request_company_id: maemulinfo.request_company_id,//외부수임물건이면 그 외부수임이라면 noti가 의미없음.외부수임인의 경우 코렉스회원이 아니기에.매물신청자에 소속선택값자체가null로없다.그 null소속하의 회원들도 없고,requestmemid도 없다. 이건 예약알림(노티)이기에. 중개의뢰온 것에 대한 것 거의 위주로개발진행.
                    message: prd_identity_id + '::매물 전속기한 만료 3일전입니다.\n 기한연장없으면 전문중개사 선임은 자동취소됩니다.\n\n',
                    company_id: maemulinfo.company_id,//선임중개사값
                    maemul_info: maemulinfo_data_loca,
                    reserv_date: noti_reserv_date_threeday,//삼일전에 전속기한만료 삼일전날짜에 예약알림가한다.보여지게끔.
                    noti_type: 13, //기한만료 삼일전.(예약알림)
                    action:'insert'
                  }
                  let notis_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(notis_info));
                  if (notis_res) {
                    if (notis_res.success) {
                      console.log('notissrses resultss:', notis_res);
                    } else {
                      alert(notis_res.message);
                    }
                  }
                  //당일알림(전속기한만료)
                  let notis_info2 = {
                    prd_identity_id: prd_identity_id,
                    request_mem_id: maemulinfo.request_mem_id,//중개의뢰인 경우
                    request_company_id: maemulinfo.request_company_id,
                    message: prd_identity_id + '::매물 전속기한 만료일입니다.\n 기한연장없으면 전문중개사 선임은 자동취소됩니다.\n\n',
                    company_id: maemulinfo.company_id,//선임중개사값
                    maemul_info: maemulinfo_data_loca,
                    reserv_date: noti_reserv_date_day,
                    noti_type: 14, //기한만료 당일.
                    action:'insert'
                  }
                  let notis_res2 = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(notis_info2));
                  if (notis_res2) {
                    if (notis_res2.success) {
                      console.log('notis_res2 resultsss:', notis_res2);
                    } else {
                      alert(notis_res2.message);
                    }
                  }

                } else {
                  //외부수임였던 매물의 경우 관련 로직작성.
                  //예약문자알림으로 해야할수도있다. 외부수임인의 경우 예약문자알림으로 하도록한다.(전속기한만료당일,삼일전알림) 
                  if (maemulinfo.request_mem_phone && maemulinfo.request_mem_name) {
                    let sms_info_reserve = {
                      receiver: maemulinfo.request_mem_phone,
                      msg: prd_identity_id + '::매물 전속기한 만료 3일전입니다.\n 기한연장없으면 전문중개사 선임은 자동취소됩니다.\n\n' + maemulinfo_data_loca+'\n\n[[기한연장]]:: https://korexpro.com/RequestExtend/' + prd_identity_id,
                      msg_type: 'LMS',
                      title: '전속기한만료3일전 안내',
                      type: '전속기한만료3일전안내',
                      rdate: last_date_targetdate,
                      rtime: '0800'//오전 여덟시.
                    };
                    console.log('예약문자알림을 가합니다.(외부수임의뢰자 전속매물 기한만료당일, 삼일전알림):', sms_info_reserve);
                    let sms_ress = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info_reserve));
                    console.log('aligosms reserve send res reulstss:', sms_ress);

                    if (sms_ress) {
                      if (!sms_ress.success) {
                        alert('발송오류 발생::', sms_ress.message);
                      }
                    }

                    let sms_info_reserve2 = {
                      receiver: maemulinfo.request_mem_phone,
                      msg: prd_identity_id + '::매물 전속기한 만료일입니다.\n 기한연장없으면 전문중개사 선임은 자동취소됩니다.\n\n' + maemulinfo_data_loca + '\n\n[[기한연장]]:: https://korexpro.com/RequestExtend/' + prd_identity_id,
                      msg_type: 'LMS',
                      title: '전속기한만료일 당일안내',
                      type: '전속기한만료일안내',
                      rdate: last_date_date,
                      rtime: '0800'
                    };
                    console.log('예약문자알림가합니다.(외부수임의뢰자 전속매물 기한만료당일,삼일전알림):', sms_info_reserve2);
                    let sms_ress2 = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info_reserve2));
                    console.log('aligosms reserve send res reusltss:', sms_ress2);

                    if (sms_ress2) {
                      if (!sms_ress2.success) {
                        alert('발송오류 발생::', sms_ress2.message);
                      }
                    }
                  } else {
                    alert('외부수임인 정보가 없습니다! 예약문자알림을 보낼수없습니다.');
                    return;
                  }
                }
              }

            }
          }

          history.push('/');
        }
      },
      cancle: { show: true, title: "취소", event: () => { offModal(); } },
      confirmgreennone: { show: false, title: "확인", event: () => { offModal(); } }

    });
  }


  const startDeal = async () => {
    
    let body = {
      prd_status : '거래개시'
    }
  
    let prdstatus_result = await serverController.connectFetchController(`/api/products/${prd_identity_id}`, 'PATCH', JSON.stringify(body));
    console.log('prdstatus_resultsss:', prdstatus_result);
  
    if (prdstatus_result) {
      if (prdstatus_result.success) {
        alert('전속매물이 거래개시 되었습니다.');
  
        let noti_info = {
          prd_identity_id: prd_identity_id,
          company_id: maemulinfo.company_id,//어떤 선임중개사에게 사업체회원들에게 보낼건지
          message: prd_identity_id + '::해당매물 의뢰자로부터 거래개시동의요청 수락받았습니다.',
          noti_type: 6
        }
        let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
        if (noti_res) {
          if (noti_res.success) {
            console.log('niti resressss:', noti_res);
          } else {
            alert(noti_res.message);
          }
        }
      }
    } else {
      alert(prdstatus_result.message);
    }
    alert('거래개시 되었습니다.')

    let result = await serverController.connectFetchController(`/api/products/${prd_identity_id}`, 'GET');

    let Prdtype = '';

    switch (result.data.prd_type) {
      case '아파트':
        Prdtype = 'apart'
        break;

      case '오피스텔':
        Prdtype = 'officetel'
        break;

      case '상가':
        Prdtype = 'store'

        break;
      case '사무실':
        Prdtype = 'office'

        break;

      default:
        break;
    }

    localStorage.setItem('searchdetail_origin', JSON.stringify(result.data));
    history.push(`/Map/${Prdtype}`);//저기로 이동을 해버리면, 저기 페이지 요소가 실행되겠지.
    // history.push('/');
  }


  useEffect(async () => {
    console.log('페이지로드시점 prd_identity_id값 및 관련 매물 정보 조회::', prd_identity_id);

    let body_info = {
      prd_identity_idval: prd_identity_id
    }
    
    //물건정보
    let maemulinfo_preview = await serverController.connectFetchController(`/api/products/${prd_identity_id}`, 'GET');
    // let maemulinfo_preview = await serverController.connectFetchController('/api/broker/brokerRequest_productview', 'POST', JSON.stringify(body_info));
    console.log('확인987987987', maemulinfo_preview);
    console.log('확인987987987', prd_identity_id);




  //중개사 정보
    let probrokerinfo_preview = await serverController.connectFetchController(`/api/realtors/${maemulinfo_preview.data.company_id}/pro/info`, 'GET');
    console.log('확인987987987', probrokerinfo_preview);
    setprobrokerinfo(probrokerinfo_preview.data);
    

    if (maemulinfo_preview) {
      console.log('maemulinfo previewss:', maemulinfo_preview);
      setmaemulinfo(maemulinfo_preview.data);//가장 최근or근원적 매물정보를 리턴한다.
      
      // if (maemulinfo_preview.building_dong_info && maemulinfo_preview.building_dong_info[0]) {
        //   setbuildinginfo(maemulinfo_preview.building_dong_info[0]);
        // }
        // if (maemulinfo_preview.complex_info && maemulinfo_preview.complex_info[0]) {
          //   setcomplexinfo(maemulinfo_preview.complex_info[0]);
          // }
          
        }

  }, []);
  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        {/* <CommonHeader /> */}
        <Preview updateReserveModal={updateReserveModal} reportModal={reportModal} rejectModal={rejectModal} confirmModal={confirmModal} maemulinfo={maemulinfo} buildinginfo={buildinginfo} complexinfo={complexinfo} probrokerinfo={probrokerinfo} prdid={prd_identity_id} startDeal={startDeal} />
        <ModalCommon modalOption={modalOption} />
      </div>
      {/* <CommonFooter /> */}
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}