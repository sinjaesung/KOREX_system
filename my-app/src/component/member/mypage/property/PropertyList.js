//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//material-ui
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';
import Tooltip from '@mui/material/Tooltip';
import PhoneIcon from '@mui/icons-material/Phone';

//css
import styled from "styled-components"

//img
import Item from '../../../../img/main/item01.png';
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Bell2 from '../../../../img/member/bell2.png';
import BellActive2 from '../../../../img/member/bell2_active.png';

//component
import { Mobile, PC } from "../../../../MediaQuery"
import ExcMaemulMark from '../../../common/broker/excMaemulMark';
import { SliceText, numTokor } from '../../../common/commonUse';
import ListItemCont_Maemul_T1 from '../../../common/broker/listItemCont_Maemul_T1';

//server process
import serverController from '../../../../server/serverController';

//image load
import localStringData from '../../../../const/localStringData';

//redux
import { useSelector } from 'react-redux';


export default function Request({ value, type, alramsetting_tiny, setalramsetting_tiny, setBrokerRequest_productlist }) {
  console.log('valuess:', value, alramsetting_tiny);
  const login_user = useSelector(data => data.login_user);

  const history = useHistory();
  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  const notiset_rsvprdmanage_toggle_change = async (e) => {
    console.log('체크알림요소 prdieintitiy값::', e.target.checked);

    if (e.target.checked) {
      let body_info = {
        mem_id: login_user.memid,
        action: 'insert',
        prd_identity_id: e.target.value,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_reservmanage', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res resulstsss:', res.result);
          setalramsetting_tiny(res.result);
        } else {
          alert(res.message);
        }
      }
    } else {
      let body_info = {
        mem_id: login_user.memid,
        action: 'delete',
        prd_identity_id: e.target.value,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_reservmanage', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res ruesltsss:', res.result);
          setalramsetting_tiny(res.result);
        } else {
          alert(res.message);
        }
      }
    }
  }

  const prd_alramcheck_toggle_change = async (e) => {
    console.log('체크알림요소 prdidientityid값::',e.target.checked);

    if (e.target.checked) {
      let body_info = {
        mem_id: login_user.memid,
        action: 'insert',
        prd_identity_id: e.target.value,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_prdlist', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res resultsss:', res.result);
          setalramsetting_tiny(res.result);
        } else {
          alert(res.message);
        }
      }
    } else {
      let body_info = {
        mem_id: login_user.memid,
        action: 'delete',
        prd_identity_id: e.target.value,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_prdlist', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res reusltsss:', res.result);
          setalramsetting_tiny(res.result);
        } else {
          alert(res.message);
        }
      }
    }
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  console.log('여기확인000', value)
  // console.log('여기확인000', login_user)

  const moreVertMenu = () => {
    console.log('moreVertmenu호출;;;;;;;:',open);
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {value.prd_status == '검토대기' || value.prd_status == '검토중' ?
          <div>
            <MenuItem onClick={() => history.push(`/RequestReview/${value.prd_id}`)}>검토</MenuItem>
            <MenuItem onClick={() => history.push(`/ConditionChange/${value.prd_id}`)}>상태변경 내역</MenuItem>
          </div>
          :
          null
        }

        {value.prd_status == '거래개시동의요청'?
          <div>
            <MenuItem onClick={async () => {
              if (window.confirm('수임취소 하시겠습니까??')) {
                //alert('수임취소 기능 활성'); //전문중개사 위임받은 물건관리 매물에 대해서 수임취소시에 관련 알림과 상태값 변경 쿼리진행.
                //매물에 대해서 요청을 했고 위임이나 수임을 취소해버린다는것은 일단 아무것도 아닌 머물른 상태로 냅둔다..
                let prdstatus_info = {
                  prd_identity_id: value.prd_id,
                  company_id: value.company_id,//어떤 전문중개사가 수임위임한 매물였는지 여부 그 product에 대한 내역을 처리하는것이기에
                  prd_status_val: '수임취소',
                  generator_memid: login_user.memid,
                  change_reason: ''
                };
                console.log('수임취소한 매물 외부수임or의뢰온 매물의 상태값 product의 거래준비->>수임취소로 상태값만 변경:', JSON.stringify(prdstatus_info));
                let prdstatus_result = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(prdstatus_info));
                console.log('prdstratus resultss:', prdstatus_result);

                if (prdstatus_result) {
                  if (prdstatus_result.success) {
                    alert('거래준비 -> 수임취소 상태값 변경');
                    //상태변경내역화면으로 이동시키기전에 서버에 반영한다. 알림도 insert한다. 알림의 경우 그 의뢰자당사자memid에게 보낸다.그 당사자가 개인이라면 그 개인에게만 가하고, 기업이라면 그 당사자의 소속회사의 소속된 모든 팀원들users에게 다 보낸다. 

                    //1.외부수임의 경우 문자로만 알림 외부수임휴대폰번호에 대한 코렉스회원여부 조회필요없고, 외부수임은 문자로만 알림.
                    //2.중개의뢰의 경우 notificaiton 알림을 기본적으로 가하면서 앱설치자라마녀 푸시알림만 가하고, 앱미설치라ㅏ면 문자로 전송.
                    if (value.product_create_origin == '중개의뢰') {
                      //중개의뢰매물인 경우 알림을 가하며, 그 중개의뢰매물 의뢰자에 당시 소속값을 구한다. 그 소속의 회원들에게만 알림가하면된다. 그 의뢰자에 모든 소속 회사들에게 다 가하는것은 아니다.
                      let noti_info = {
                        prd_identity_id: value.prd_id, //어떤 외부수임or요청한의뢰매물 id에 대한 알림인지여부
                        request_memid: value.request_memid,//해당 의뢰인memid가 있다면 중개의뢰 코렉스회원에게 가하는것이고, 중개의뢰건의 경우 그 memid에게 notifiaciton가한다.
                        request_mem_selectsosokid: value.request_mem_selectsosokid,
                        message: value.prd_id + '::해당 매물 선임중개사에서 수임취소 하였습니다.',
                        noti_type: 3, //3:중개의뢰매물or 외부수임매물에 대한 상태변경 기타 여러가지 내역상태값
                      }
                      let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
                      if (noti_res) {
                        if (noti_res.success) {
                          console.log('tnii resss:', noti_res);
                        }
                      }
                    } else {
                      //이땐 알리고문자 전송 외부수임매물인경우. 외부수임인의 경우 소속개념이 없기에 그 대상 한명에 휴대폰에게 알림보낼뿐임.
                      if (value.request_mem_phone && value.request_man_name) {
                        let sms_info = {
                          receiver: value.request_mem_phone,
                          msg: value.prd_id + '::해당 매물 선임중개사에서 수임취소 하였습니다.',
                          msg_type: 'LMS',
                          title: '전문중개사 의뢰매물 수임취소관련 알림',
                          type: '수임취소알림'
                        };
                        let sms_res = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info));
                        console.log('aligoSMs send res resultsss:', sms_res);

                        if (sms_res) {
                          if (!sms_res.success) {
                            alert('발송오류 발생::', sms_res.message);
                          }
                        }
                      } else {
                        alert('외부수임인 정보가 없습니다! 알림을 보낼수없습니다.');
                        return;
                      }
                    }
                    history.push('/Mypage');
                  } else {
                    alert(prdstatus_result.message);
                  }
                }
              }
            }}>
              <div className="data_link cursor-p" />
              수임 취소
            </MenuItem>

            <MenuItem onClick={() => history.push(`/ConditionChange/${value.prd_id}`)}>
              상태변경 내역
            </MenuItem>
          </div>
          :
          null
        }

        {/*거래 준비 상태일때*/}
        {/* {(value.prd_status == '거래준비' || value.prd_status == '거래개시승인 요청' || value.prd_status == '거래개시동의요청' || value.prd_status == '거래개시동의요청 거절' || value.prd_status == '거래승인 요청') ? */}
        {(value.prd_status == '거래준비' || value.prd_status == '거래개시동의요청' || value.prd_status == '거래개시동의요청거절' || value.prd_status == '거래동의요청') ?
          <div>
            {/* { value.loanprice && value.direction && value.heat_fuel_type && value.heat_method_type && value.month_base_guaranteeprice && value.maemul_description && value.maemul_descriptiondetail ?                      */}

            {!value.prd_imgs ?  null : 
            
            <MenuItem onClick={async () => {
              if (window.confirm('거래개시동의요청 하시겠습니까??')) {
                let req_info = {
                  prd_identity_id: value.prd_id,
                  company_id: value.company_id,
                  prd_status_val: '거래개시동의요청',
                  generator_memid: login_user.memid,
                  change_reason: ''
                };
                console.log('거래동의 요청한 매물 외부수임or의뢰매물 상관없이, 상태값 -->>거래승인요청으로 상태값 변경insert추가:', JSON.stringify(req_info));

                let body = {
                  prd_status : '거래개시동의요청',
                  modify_mem_id: login_user.memid
                }

                let prdstatus_result = await serverController.connectFetchController(`/api/products/${value.prd_id}`, 'PATCH', JSON.stringify(body));


                console.log('prdstatus resultss:', prdstatus_result);


                // let prdstatus_result = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(req_info));
                console.log('prdstatus resultss:', prdstatus_result);

                if (prdstatus_result) {
                  if (prdstatus_result.success) {
                    alert('>>>>거래개시동의요청 상태값 변경');
                    //상태변경내역화면으로 이동시키기전 서버에 반영,알림도 isnert한다. 알림의 경우 그 외부수임인 경우에는 문자알림을 가하고, 중개의뢰요청인 경우엔 notificaition + 문자로(기본값:문자) 로 일단 처리.

                    //알릴정보:: 전속매물 거래개시승인 요청입니다. 
                    /*
                    전속기간 : x 개월
                    수임사업체 : 수임전문중개사
                    등록번호 : xxx
                    물건종류 : xxx,
                    건물명 층수 호수
                    시도/시군구/읍면동/리
                    거래유형, 거래금액
                    내용확인.
                    */
                    let maemul_info_loca = '';
                    maemul_info_loca = '전속기간: ' + value.exclusive_periods + ' 개월 \n';
                    maemul_info_loca += '물건종류: ' + value.prd_type + '\n';
                    maemul_info_loca += '물건이름: ' + (value.prd_name + ' ' + value.dong_name + ' ' + value.ho_name + '호') + '\n';
                    maemul_info_loca += '물건주소: ' + value.addr_jibun + '(' + value.addr_road + ')\n';
                    maemul_info_loca += '거래금액: ' + '(' + value.prd_sel_type + ')' + value.prd_price;
                    maemul_info_loca += (value.prd_sel_type == '월세' ? '월세 : '+value.prd_month_price : '보증금 : '+ value.prd_price);

                    if (value.product_create_origin == '중개의뢰') {
                      let noti_info = {
                        prd_identity_id: value.prd_id,
                        request_memid: value.request_memid,//중개의뢰인 경우엔 request_memid존재한다. 따라서 이를 보낸다. 외부수임인 경우는 미존재로, 알리고api호출한다.
                        request_mem_selectsosokid: value.request_mem_selectsosokid,//해당 매물의 신청자id,신청자 선택소속companyid 거래개시동의요청.
                        message: value.prd_id + '::선임중개사에서 전속매물 등록 요청이 왔습니다.',
                        company_id: value.company_id,//선임중개사 값.
                        maemul_info: maemul_info_loca,
                        noti_type: 5//거래승인요청 
                      }
                      let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
                      if (noti_res) {
                        if (noti_res.success) {
                          console.log('notii resss:', noti_res);
                        } else {
                          alert(noti_res.message);
                        }
                      }

                    } else {
                      //이떈 알리고문자 전송. 외부수임매물인경우 외부수임인에겐 문자로만!
                      if (value.request_mem_phone && value.request_mem_name) {
                        let sms_info = {
                          receiver: value.request_mem_phone,
                          msg: value.prd_id + '::해당 매물 선임중개사에서 거래개시승인요청이 왔습니다.\n\n' + maemul_info_loca + '\n\n [[내용확인]]:' + "https://korexpro.com/Preview/" + value.prd_id,

                          msg_type: 'LMS',
                          title: '거래개시동의요청 전송',
                          type: '거래개시동의요청'
                        };
                        let sms_res = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info));
                        console.log('aligosms send res reuslstsss:', sms_res);

                        if (sms_res) {
                          if (!sms_res.success) {
                            alert('발송오류발생:', sms_res.message);
                          }
                        }

                      } else {
                        alert('외부수임인 정보가 없습니다! 알림을 보낼수 없습니다');
                        return;
                      }

                    }
                   // history.push('/Mypage');
                  } else {
                    alert(prdstatus_result.message);
                  }
                }
              }
            }}>
              <div className="data_link cursor-p" />
              거래개시동의요청
            </MenuItem>
            }
            {/* :
                null
              } */}
            <MenuItem onClick={async () => {
              if (window.confirm('수임취소 하시겠습니까??')) {
                //alert('수임취소 기능 활성'); //전문중개사 위임받은 물건관리 매물에 대해서 수임취소시에 관련 알림과 상태값 변경 쿼리진행.
                //매물에 대해서 요청을 했고 위임이나 수임을 취소해버린다는것은 일단 아무것도 아닌 머물른 상태로 냅둔다..
                let prdstatus_info = {
                  prd_identity_id: value.prd_id,
                  company_id: value.company_id,//어떤 전문중개사가 수임위임한 매물였는지 여부 그 product에 대한 내역을 처리하는것이기에
                  prd_status_val: '수임취소',
                  generator_memid: login_user.memid,
                  change_reason: ''
                };
                console.log('수임취소한 매물 외부수임or의뢰온 매물의 상태값 product의 거래준비->>수임취소로 상태값만 변경:', JSON.stringify(prdstatus_info));
                let prdstatus_result = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(prdstatus_info));
                console.log('prdstratus resultss:', prdstatus_result);

                if (prdstatus_result) {
                  if (prdstatus_result.success) {
                    alert('거래준비 -> 수임취소 상태값 변경');
                    //상태변경내역화면으로 이동시키기전에 서버에 반영한다. 알림도 insert한다. 알림의 경우 그 의뢰자당사자memid에게 보낸다.그 당사자가 개인이라면 그 개인에게만 가하고, 기업이라면 그 당사자의 소속회사의 소속된 모든 팀원들users에게 다 보낸다. 

                    //1.외부수임의 경우 문자로만 알림 외부수임휴대폰번호에 대한 코렉스회원여부 조회필요없고, 외부수임은 문자로만 알림.
                    //2.중개의뢰의 경우 notificaiton 알림을 기본적으로 가하면서 앱설치자라마녀 푸시알림만 가하고, 앱미설치라ㅏ면 문자로 전송.
                    if (value.product_create_origin == '중개의뢰') {
                      //중개의뢰매물인 경우 알림을 가하며, 그 중개의뢰매물 의뢰자에 당시 소속값을 구한다. 그 소속의 회원들에게만 알림가하면된다. 그 의뢰자에 모든 소속 회사들에게 다 가하는것은 아니다.
                      let noti_info = {
                        prd_identity_id: value.prd_id, //어떤 외부수임or요청한의뢰매물 id에 대한 알림인지여부
                        request_memid: value.request_memid,//해당 의뢰인memid가 있다면 중개의뢰 코렉스회원에게 가하는것이고, 중개의뢰건의 경우 그 memid에게 notifiaciton가한다.
                        request_mem_selectsosokid: value.request_mem_selectsosokid,
                        message: value.prd_id + '::해당 매물 선임중개사에서 수임취소 하였습니다.',
                        noti_type: 3, //3:중개의뢰매물or 외부수임매물에 대한 상태변경 기타 여러가지 내역상태값
                      }
                      let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
                      if (noti_res) {
                        if (noti_res.success) {
                          console.log('tnii resss:', noti_res);
                        }
                      }
                    } else {
                      //이땐 알리고문자 전송 외부수임매물인경우. 외부수임인의 경우 소속개념이 없기에 그 대상 한명에 휴대폰에게 알림보낼뿐임.
                      if (value.request_mem_phone && value.request_man_name) {
                        let sms_info = {
                          receiver: value.request_mem_phone,
                          msg: value.prd_id + '::해당 매물 선임중개사에서 수임취소 하였습니다.',
                          msg_type: 'LMS',
                          title: '전문중개사 의뢰매물 수임취소관련 알림',
                          type: '수임취소알림'
                        };
                        let sms_res = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info));
                        console.log('aligoSMs send res resultsss:', sms_res);

                        if (sms_res) {
                          if (!sms_res.success) {
                            alert('발송오류 발생::', sms_res.message);
                          }
                        }
                      } else {
                        alert('외부수임인 정보가 없습니다! 알림을 보낼수없습니다.');
                        return;
                      }
                    }
                    history.push('/Mypage');
                  } else {
                    alert(prdstatus_result.message);
                  }
                }
              }
            }}>
              <div className="data_link cursor-p" />
              수임 취소
            </MenuItem>

            <MenuItem onClick={() => history.push(`/ConditionChange/${value.prd_id}`)}>
              상태변경 내역
            </MenuItem>

            <MenuItem onClick={() => history.push(`/RequestReviewEdit/${value.prd_id}`)}>
              <div className="data_link cursor-p" />
              수정
            </MenuItem>

            <MenuItem onClick={() => history.push(`/PropertyTourSetting/${value.prd_id}`)}>
              <div to={`/PropertyTourSetting/${value.prd_id}`} className="data_link cursor-p" />
              물건투어예약세팅
            </MenuItem>
          </div>
          :
          null
        }
        {/*거래 개시 상태일때*/}
        {
          value.prd_status == '거래개시' || value.prd_status == '거래완료승인요청 거절' || value.prd_status == '거래완료승인요청' ?
            <div>
              {/*<Div>
              <div  className="data_link cursor-p"/>
              <InDiv>거래개시승인 요청</InDiv>
            </Div>*/}
              <MenuItem onClick={async () => {
                if (window.confirm('수임취소 하시겠습니까??')) {
                  //alert('수임취소 기능 활성'); //전문중개사 위임받은 물건관리 매물에 대해서 수임취소시에 관련 알림과 상태값 변경 쿼리진행.
                  //매물에 대해서 요청을 했고 위임이나 수임을 취소해버린다는것은 일단 아무것도 아닌 머물른 상태로 냅둔다..
                  let prdstatus_info = {
                    prd_identity_id: value.prd_id,
                    company_id: value.company_id,//어떤 전문중개사가 수임위임한 매물였는지 여부 그 product에 대한 내역을 처리하는것이기에
                    prd_status_val: '수임취소',
                    generator_memid: login_user.memid,
                    change_reason: ''
                  };
                  console.log('수임취소한 매물 외부수임or의뢰온 매물의 상태값 product의 거래준비->>수임취소로 상태값만 변경:', JSON.stringify(prdstatus_info));
                  let prdstatus_result = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(prdstatus_info));
                  console.log('prdstratus resultss:', prdstatus_result);

                  if (prdstatus_result) {
                    if (prdstatus_result.success) {
                      alert('거래준비 -> 수임취소 상태값 변경');
                      //상태변경내역화면으로 이동시키기전에 서버에 반영한다. 알림도 insert한다. 알림의 경우 그 의뢰자당사자memid에게 보낸다.그 당사자가 개인이라면 그 개인에게만 가하고, 기업이라면 그 당사자의 소속회사의 소속된 모든 팀원들users에게 다 보낸다.

                      //1.외부수임의 경우 문자로만 알림 외부수임휴대폰번호에 대한 코렉스회원여부 조회필요없고, 외부수임은 문자로만 알림.
                      //2.중개의뢰의 경우 notificaiton 알림을 기본적으로 가하면서 앱설치자라마녀 푸시알림만 가하고, 앱미설치라ㅏ면 문자로 전송.
                      if (value.product_create_origin == '중개의뢰') {
                        let noti_info = {
                          prd_identity_id: value.prd_id, //어떤 외부수임or요청한의뢰매물 id에 대한 알림인지여부
                          request_memid: value.request_memid,//해당 의뢰인memid가 있다면 중개의뢰 코렉스회원에게 가하는것이고, 중개의뢰건의 경우 그 memid에게 notifiaciton가한다.
                          request_mem_selectsosokid: value.request_mem_selectsosokid,
                          message: value.prd_id + '::해당 매물 선임중개사에서 수임취소 하였습니다.',
                          noti_type: 3, //3:중개의뢰매물or 외부수임매물에 대한 상태변경 기타 여러가지 내역상태값

                        }
                        let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
                        if (noti_res) {
                          if (noti_res.success) {
                            console.log('tnii resss:', noti_res);
                          }
                        }
                      } else {
                        if (value.request_mem_phone && value.request_man_name) {
                          let sms_info = {
                            receiver: value.request_mem_phone,
                            msg: value.prd_id + '::해당 매물 선임중개사에서 수임취소하였습니다.',
                            msg_type: 'LMS',
                            title: '전문중개사 의뢰매물 수임취소관련 알림',
                            type: '수임취소알림'
                          };
                          let sms_res = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info));
                          console.log('ALIGOSMS SEND RES RESULTSSS:', sms_res);

                          if (sms_res) {
                            if (!sms_res.success) {
                              alert('발송 오류 발생::', sms_res.message);
                            }
                          }
                        } else {
                          alert('외무수임인 정보가 없습니다!알림을 보낼수없습니다.');
                          return;
                        }
                      }

                      history.push('/Mypage');
                    } else {
                      alert(prdstatus_result.message);
                    }
                  }
                }
              }}>
                <div className="data_link cursor-p" />
                수임 취소
              </MenuItem>
              <MenuItem onClick={async () => {
                if (window.confirm('거래완료승인 요청하시겠습니까??')) {
                  let req_info = {
                    prd_identity_id: value.prd_id,
                    company_id: value.company_id,
                    prd_status_val: '거래완료승인요청',
                    generator_memid: login_user.memid,
                    change_reason: ''
                  };
                  let prdstatus_result = await serverController.connectFetchController('/api/broker/brokerRequest_productstatus_updateinsert', 'POST', JSON.stringify(req_info));
                  console.log('prdstatus reuslsstss:', prdstatus_result);

                  if (prdstatus_result) {
                    if (prdstatus_result.success) {
                      alert('>>>>거래완료 요청상태값 변경');

                      let maemul_info_loca = '';
                      maemul_info_loca = '전속기간: ' + value.exculsive_periods + ' 개월 \n';
                      maemul_info_loca += '등록번호: ' + value.prd_id + '\n';
                      maemul_info_loca += '물건종류: ' + value.prd_type + '\n';
                      maemul_info_loca += (value.prd_name + ' ' + value.address_detail) + '\n';
                      maemul_info_loca += value.addressjibun + '(' + value.addressroad + ')\n';
                      maemul_info_loca += value.prd_sel_type + " ";
                      maemul_info_loca += (value.prd_sel_type == '월세' ? value.prd_month_price : value.prd_price);

                      if (value.product_create_origin == '중개의뢰') {
                        let noti_info = {
                          prd_identity_id: value.prd_id,
                          request_memid: value.request_memid,
                          request_mem_sectsosokid: value.request_mem_selectsosokid,
                          message: value.prd_id + '::해당 매물 선임중개사에서 거래완료승인요청이 왔습니다.',
                          company_id: value.company_id,
                          maemul_info: maemul_info_loca,
                          noti_type: 16 //거래완료승인요청.
                        }
                        let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
                        if (noti_res) {
                          if (noti_res.success) {
                            console.log('noti resultsss:', noti_res);
                          } else {
                            alert(noti_res.message);
                          }
                        }
                      } else {
                        //거래완료승인요청 외부수임 매물에 대해선 알리고문자전송
                        if (value.request_mem_phone && value.request_man_name) {
                          let sms_info = {
                            receiver: value.request_mem_phone,
                            msg: value.prd_id + '::해당 매물 선임중개사에서 거래완료승인요청이 왔습니다.\n\n[[내용확인]]:https://korexpro.com/PreviewComplete/' + value.prd_id + '\n\n' + maemul_info_loca,
                            msg_type: 'LMS',
                            title: '거래완료승인요청 전송',
                            type: '거래완료승인요청'
                          };
                          let sms_res = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(sms_info));
                          console.log('aligosms send resultsss ssss:', sms_res);

                          if (sms_res) {
                            if (!sms_res.success) {
                              alert('발송오류 발생::', sms_res.message);
                            }
                          }
                        } else {
                          alert('외부수임인 정보가 없습니다! 알림을 보낼수없습니다.');
                          return;
                        }
                      }
                      //history.push('/Mypage');
                    } else {
                      alert(prdstatus_result.message);
                    }
                  }
                }
              }}>
                <div className="data_link cursor-p" />
                거래완료승인 요청
              </MenuItem>
              <MenuItem onClick={() => history.push(`/ConditionChange/${value.prd_id}`)}>
                상태변경 내역
              </MenuItem>
              <MenuItem onClick={() => history.push(`/RequestReviewEdit/${value.prd_id}`)}>
                <div className="data_link cursor-p" />
                수정
              </MenuItem>
              <MenuItem onClick={() => history.push(`/PropertyTourSetting/${value.prd_id}`)}>
                <Link to={`/PropertyTourSetting/${value.prd_id}`} className="data_link cursor-p" />
                물건투어예약셋팅
              </MenuItem>
              {
                value.product_create_origin == '외부수임' ?
                  <MenuItem onClick={async () => {
                    //alert('해당 value중개의뢰 product자체를 삭제한다!'+value.prd_id);
                    //관련된 모든 product,transaction,transactionhistory다 삭제한다.

                    if (window.confirm('해당 외부수임 매물을 삭제하시겠습니까??')) {
                      let body_info = {
                        delete_target_id: value.prd_id
                      }
                      let delete_request = await serverController.connectFetchController('/api/broker/brokerRequest_product_deleteProcess', 'POST', JSON.stringify(body_info));

                      if (delete_request) {
                        console.log('delete request reulsts:', delete_request);

                        if (delete_request.success) {
                          alert('삭제 처리 되었습니다.');

                          let send_info = {
                            login_memid: login_user.memid,
                            company_id: login_user.company_id
                          };
                          let res_resultss = await serverController.connectFetchController('/api/broker/BrokerRequest_productlist', 'POST', JSON.stringify(send_info));
                          console.log('res_reusltsss:', res_resultss);

                          if (res_resultss) {
                            if (res_resultss.success) {
                              if (res_resultss.result_data) {
                                setBrokerRequest_productlist(res_resultss.result_data);
                              }
                            }
                          }
                          //history.push('/Mypage');
                        } else {
                          alert(delete_request.message);
                        }
                      }
                    }
                  }}>
                    <div className="data_link cursor-p" />
                    삭제
                  </MenuItem>
                  :
                  null
              }

            </div>
            :
            null
        }

        {
          value.prd_status == '수임취소' || value.prd_status == '위임취소' || value.prd_status == '의뢰철회' || value.prd_status == '의뢰거절' ?
            <div>
              <MenuItem onClick={() => history.push(`/ConditionChange/${value.prd_id}`)}>
                상태변경 내역
              </MenuItem>
              {
                value.product_create_origin == '외부수임' ?
                  <MenuItem onClick={async () => {
                    //alert('해당 value중개의뢰 product자체를 삭제한다!'+value.prd_id);
                    //관련된 모든 product,transaction,transactionhistory다 삭제한다.

                    if (window.confirm('해당 외부수임 매물을 삭제하시겠습니까??')) {
                      let body_info = {
                        delete_target_id: value.prd_id
                      }
                      let delete_request = await serverController.connectFetchController('/api/broker/brokerRequest_product_deleteProcess', 'POST', JSON.stringify(body_info));

                      if (delete_request) {
                        console.log('delete request reulsts:', delete_request);

                        if (delete_request.success) {
                          alert('삭제 처리 되었습니다.');

                          let send_info = {
                            login_memid: login_user.memid,
                            company_id: login_user.company_id
                          };
                          let res_resultss = await serverController.connectFetchController('/api/broker/BrokerRequest_productlist', 'POST', JSON.stringify(send_info));
                          console.log('res_reusltsss:', res_resultss);

                          if (res_resultss) {
                            if (res_resultss.success) {
                              if (res_resultss.result_data) {
                                setBrokerRequest_productlist(res_resultss.result_data);
                              }
                            }
                          }
                          //history.push('/Mypage');
                        } else {
                          alert(delete_request.message);
                        }
                      }
                    }
                  }}>
                    <div className="data_link cursor-p" />
                    삭제
                  </MenuItem>
                  :
                  null
              }
            </div>
            :
            null
        }
      </Menu>
    )
  }


  return (
    <>
      <MUListItem
        disablePadding
        secondaryAction={
          <>
            <IconButton
              sx={{ mr: 0.3 }}
              edge="end"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={null}
            >
              <PhoneIcon />
            </IconButton>
            {/*<IconButton
              sx={{ mr: 0.3 }}
              edge="end"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={null}
            >
              <NotificationsNoneIcon />
            </IconButton>
            {/* <IconButton
              sx={{ mr: 0.3 }}
              edge="end"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={null}
            >
              <AccessAlarmIcon />
            </IconButton>*/}
            <IconButton>
              <AlarmCheck type="checkbox" id={"prdcheck"+value.prd_id} name="" value={value.prd_id} checked={alramsetting_tiny['notiset_prd_part']&&alramsetting_tiny['notiset_prd_part'].indexOf(value.prd_id)!=-1?true:false} onChange={prd_alramcheck_toggle_change}/>
              <Label for={"prdcheck"+value.prd_id}/>
            </IconButton>
            <IconButton>
              <AlramCheck2 type="checkbox" id={"prdrsvmanagecheck"+value.prd_id} name="" value={value.prd_id} checked={alramsetting_tiny['notiset_rsv_prd_manage_part']&&alramsetting_tiny['notiset_rsv_prd_manage_part'].indexOf(value.prd_id)!=-1?true:false} onChange={notiset_rsvprdmanage_toggle_change}/>
              <Label2 for={"prdrsvmanagecheck"+value.prd_id}/>
            </IconButton>
           
            <IconButton
              edge="end"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            {moreVertMenu()}
          </>
        }
      >
      
        <MUListItemButton onClick={() => history.push(`/RequestReviewEdit/${value.prd_id}`)}><div className="flexGlow-1">
            <Sect_R1 className="flex-spabetween-center">
              <div className="par-spacing">
                <p className="capt-00">PRD{value.prd_id}</p>
                {/* <p><Tooltip title="의뢰인"><FaceIcon /></Tooltip>{value.request_mem_name}{value.request_mem_phone.substring(value.request_mem_phone.length - 4, value.request_mem_phone.length)}({value.request_mem_selectsosokid})</p> */}
              <p><Tooltip title="의뢰인"><FaceIcon /></Tooltip>{value.request_mem_name}{!!value.request_mem_phone ? value.request_mem_phone.substring(value.request_mem_phone.length - 4, value.request_mem_phone.length) : null}</p>
                <p><ConditionType color={type}>{value.prd_create_origin}</ConditionType>&nbsp;&nbsp;<Chip label={value.prd_status} size="small" color="primary" /></p>
              </div>
              <div>
                {/* <AlarmCheck type="checkbox" id={"prdcheck" + value.prd_id} name="" value={value.prd_id} checked={alramsetting_tiny['notiset_prd_part'] && alramsetting_tiny['notiset_prd_part'].indexOf(value.prd_id) != -1 ? true : false} onChange={prd_alramcheck_toggle_change} />
              <Label for={"prdcheck" + value.prd_id} />
              <AlramCheck2 type="checkbox" id={"prdrsvmanagecheck" + value.prd_id} name="" value={value.prd_id} checked={alramsetting_tiny['notiset_rsv_prd_manage_part'] && alramsetting_tiny['notiset_rsv_prd_manage_part'].indexOf(value.prd_id) != -1 ? true : false} onChange={notiset_rsvprdmanage_toggle_change} />
              <Label2 for={"prdrsvmanagecheck" + value.prd_id} />              */}
              </div>
            </Sect_R1>
            <ListItemCont_Maemul_T1 mode={'PropertyList'} item={value} />
          </div>
        </MUListItemButton>
      </MUListItem>
    </>
  );
}

const MUListItem = styled(ListItem)`
& .MuiListItemSecondaryAction-root{
  top: 2rem;
  right: 1rem;
  //transform: translateY(-50%);
}

&.MuiListItem-root>.MuiListItemButton-root {
  position: relative;
  padding-right: 16px;
}
`
const MUListItemButton = styled(ListItemButton)``
const MUListItemTxt = styled(ListItemText)``

const Sect_R1 = styled.div``
const Sect_R2 = styled.div``

const ConditionType = styled.div`
  color:${({ color }) => color};
  display:inline-block;
`

const AlarmCheck = styled.input`
  display:none;
  &:checked + label{background:url(${BellActive}) no-repeat center center; background-size:20px 20px}
  @media ${(props) => props.theme.mobile} {
    &:checked + label{background:url(${BellActive}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428))}
  }
`
const Label = styled.label`
  display:inline-block;
  width:36px;height:36px;
  border-radius:5px;
  border:1px solid #e4e4e4;
  background:url(${Bell}) no-repeat center center; background-size:20px 20px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(31/428));
    height:calc(100vw*(31/428));
    background:url(${Bell}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428));
  }
`
const AlramCheck2 = styled.input`
  display:none;
  &:checked + label{background:url(${BellActive2}) no-repeat center center; background-size:20px 20px}
  @media ${(props) => props.theme.mobile} {
    &:checked + label{background:url(${BellActive2}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428))}
  }
`
const Label2 = styled.label`
  display:inline-block;
  width:36px;height:36px;
  border-radius:5px;
  border:1px solid #e4e4e4;
  background:url(${Bell2}) no-repeat center center; background-size:20px 20px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(31/428));
    height:calc(100vw*(31/428));
    background:url(${Bell2}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428));
  }
`