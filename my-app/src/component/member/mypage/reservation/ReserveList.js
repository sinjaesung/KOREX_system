//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";


//css
import styled from "styled-components";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles'
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


//img
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Set from '../../../../img/member/setting.png';
import Noimg from '../../../../img/main/main_icon3.png';

//component
import { Mobile, PC } from "../../../../MediaQuery";
import ListItemCont_Maemul_T1 from "../../../common/broker/listItemCont_Maemul_T1";


import localStringData from "../../../../const/localStringData";

//server process
import serverController from '../../../../server/serverController';

import { useSelector } from 'react-redux';

export default function Request({ map, setMap, filter, setFilter, reserve, setReserve, value, match_td_info, match_product_info, time_distance, time_status, color, opacity, cond, updateMapModal, updateReserveModal, alramsetting_tiny, setalramsetting_tiny, setListData }) {

  //material-ui
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const login_user = useSelector(data => data.login_user);

  const history = useHistory();
  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const [alarm, setAlarm] = useState(value.tr_alarm == 0 ? true : false);

  const showModal = () => {
    console.log('showModal클릭 메뉴모달::내물건투어예약');
    setMenu(!menu);
  }

  // 수정 버튼
  const onClickModify = (tr_id, prd_identity_id, company_id) => {
    setReserve(true);
    if (prd_identity_id) {
      updateReserveModal(tr_id, prd_identity_id, company_id);
    }
  }

  if (time_status == 'mirae') {
    var message = '+' + time_distance + '일후';
  } else if (time_status == 'today') {
    var message = '오늘';
  } else if (time_status == 'passed') {
    var message = '마감';
  }

  if (cond != '' && value.tr_status == 1) {
    var message = '예약해제';
  } else if (cond != '' && value.tr_status == 2) {
    var message = '예약취소';
  }

  const tourreserv_alramcheck_toggle_change = async (e) => {
    console.log('체크알림요소 prdidineitiytid값::', e.target.value);

    if (e.target.checked) {
      let body_info = {
        mem_id: login_user.memid,
        action: 'insert',
        tr_id: e.target.value,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_tourreserv', 'POST', JSON.stringify(body_info));
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
        tr_id: e.target.value,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_tourreserv', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res resultsss:', res.result);
          setalramsetting_tiny(res.result);
        } else {
          alert(res.message);
        }
      }
    }
  }
  console.log('여기 확인  ', match_product_info);


  const moreVertMenu = () => {
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      {
        value.tr_status == 0 && (message != '마감' && message != '예약해제' && message != '예약취소') ?
          <div>
            <MenuItem onClick={async () => {
              if (window.confirm('취소하시겠습니까??')) {
                let body_info = {
                  tr_id_val: value.tr_id//취소처리할.
                }
                let res = await serverController.connectFetchController('/api/broker/mybrokerproduct_tourReservcancle', 'POST', JSON.stringify(body_info));
                if (res) {
                  if (res.success) {
                    let noti_info = {
                      prd_identity_id: match_product_info && match_product_info.prd_identity_id,//취소처리할 관련매물관련 접수
                      //request_memid : value.mem_id,
                      message: value.tr_name + '(' + value.tr_phone + ')' + value.tr_email + ' 님이' + match_product_info.prd_identity_id + '매물에 대한 신청하신 물건투어예약접수 취소하였습니다.',
                      company_id: match_product_info.company_id,//그걸 수임담당하고있는 전문중개사 소소게에게 보낸다.
                      noti_type: 8
                    }
                    let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
                    if (noti_res) {
                      if (noti_res.success) {
                        alert('예약 취소되었습니다.');
                        setAnchorEl(null);
                        history.push('/Mypage');
                      } else {
                        alert(noti_res.message);
                        setAnchorEl(null);
                      }
                    }
                  } else {
                    alert(res.message);
                    setAnchorEl(null);
                  }
                }
              }

            }}>삭제</MenuItem>
            <MenuItem className="cursor-p" onClick={() => { onClickModify(value.tr_id, match_product_info ? match_product_info.prd_identity_id : null, match_product_info ? match_product_info.company_id : null) }}>수정</MenuItem>
          </div>
          :
          <div>
            <MenuItem className="cursor-p" onClick={async () => {
              if (window.confirm("삭제하시겠습니까??")) {
                let delete_info = {
                  tr_id: value.tr_id//삭제할 trid값 그냥 삭제한다.
                }
                let delete_process = await serverController.connectFetchController('/api/broker/mybrokerProduct_tourRservdelete', 'POST', JSON.stringify(delete_info));

                if (delete_process) {
                  console.log('삭제 결과:', delete_process);

                  if (delete_process.success) {
                    alert('삭제되었습니다.');
                    //history.push('/Mypage');
                    setAnchorEl(null);
                    //setListData
                    let body_infos = {
                      company_id: login_user.company_id,
                      mem_id: login_user.memid,
                      user_type: login_user.user_type
                    };
                    let ress = await serverController.connectFetchController('/api/broker/brokerproduct_myreservationList', 'POST', JSON.stringify(body_infos));
                    if (ress) {
                      console.log('res resultsss:', ress);
                      if (ress.success) {
                        let list_item = ress.result_data;

                        setListData(list_item);
                      } else {
                        alert(ress.message);
                        setAnchorEl(null);
                      }
                    }
                  } else {
                    alert(delete_process.message);
                    setAnchorEl(null);
                  }
                }
              }

            }}>삭제</MenuItem>
          </div>
      }
    </Menu>
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
              <NotificationsNoneIcon />
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
        <MUListItemButton >
          <div className="flexGlow-1">
            <Sect_R1 className="flex-spabetween-center">
            <div className="par-spacing">
                <p className="capt-00">{value ? value.tr_id : ""}</p>
                <p><Chip label={`${message} ${value.reserv_start_time && value.reserv_start_time.substring(0, 16)}`} size="small" color="primary"/></p>
              </div>
              <div>
              </div>
            </Sect_R1>
            <ListItemCont_Maemul_T1 mode={'PropertyList'} item={value} active={true} />
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