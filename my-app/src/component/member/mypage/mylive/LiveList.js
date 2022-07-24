//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

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
import FaceIcon from '@mui/icons-material/Face';
import Chip from '@mui/material/Chip';

import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';

//css
import styled from "styled-components"

//component
import { Mobile, PC } from "../../../../MediaQuery"
import serverController from '../../../../server/serverController';
import BunyangItemCont_T1 from '../../../common/bunyang/BunyangItemCont_T1';

//redux
import { useSelector } from 'react-redux';

function checkZero(checkString) {
  return checkString.toString().length == 1 ? "0" + checkString : checkString;
}

function getDateType(date) {
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
  return temp;
}


function getDateTimeType(date) {
  var temp = `  ${date.getHours() > 12 ? "오후 " : "오전 "} ${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${checkZero(date.getMinutes())} `;
  return temp;
}

function calculateDiffTime(date) {
  var stDate = new Date();
  var endDate = date;

  var btMs = endDate.getTime() - stDate.getTime();
  var btDay = btMs / (1000 * 60 * 60 * 24);
  return Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일"
}


export default function Request({ value, type, type2, updateList, setalramsetting_tiny, alramsetting_tiny }) {
  const login_user = useSelector(data => data.login_user);
  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  //const [alarm,setAlarm] = useState(value.tr_alarm == 0 ? true : false);

  const onClickCancel = async () => {
    setAnchorEl(null);
    let data = {
      content: "예약취소",
      url: "",
      userList: [{
        tr_id: value.tr_id,
        tr_status: 1,
      }]
    }

    if (window.confirm("예약을 취소하시겠습니까?")) {
      let result = await serverController.connectFetchController("/api/bunyang/reservation/link", "PUT", JSON.stringify(data));

      updateList();
      if (result.success) {

        //예약취소성공한경우 라이브예약 취소한경우
        let noti_infoee = {
          transaction_id: value.tr_id,
          tour_id: value.tour_id,
          message: `================${value.tr_name} 신청자가 분양라이브예약 신청 취소하였습니다.`,
          noti_type: 'bunyang_live_reserv_cancle'
        }
        let noti_infoess = await serverController.connectFetchController("/api/alram/notification_process", "POST", JSON.stringify(noti_infoee));
        if (noti_infoess) {
          if (noti_infoess.success) {
            console.log('noti infoeerreultss:', noti_infoess);
          } else {
            alert('알람 전송오류');
          }
        }
      }
    }

  };

  // 예약 취소
  /*const onClickAlarm = async () => {

    let data = {  
      tr_alarm : alarm == false ? 0 : 1,
      tr_id :value.tr_id,
     }
    let result = await serverController.connectFetchController("/api/bunyang/reservation/alarm","PUT",JSON.stringify(data));

    if(result.success == 1){
      setAlarm(e => !e);
    }
    
  };*/
  //내 라이브시청예약 파트리스트 조율  notiset_bunyangsuyo_mylive_part 조정
  const bunyangsuyo_mylive_part_toggle_change = async (e) => {
    console.log('체크 알림 요소 prd_id 값:', e.target.value);

    if (e.target.checked) {
      let body_info = {
        mem_id: login_user.memid,
        action: 'insert',
        target_id: e.target.value,
        target_column: 'notiset_bunyangsuyo_mylive_part',
        user_type: login_user.user_type,
        company_id: login_user.company_id
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_bunyang', 'POST', JSON.stringify(body_info));
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
        target_id: e.target.value,
        target_column: 'notiset_bunyangsuyo_mylive_part',
        user_type: login_user.user_type,
        company_id: login_user.company_id
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_bunyang', 'POST', JSON.stringify(body_info));
      if (res) {
        if (res.success) {
          console.log('res ruesltssss:', res.result);
          setalramsetting_tiny(res.result);
        } else {
          alert(res.message);
        }
      }
    }
  }

  const getStatus = (v) => {
    console.log('livelist value;:: v:',v);
    if (v.tr_status == 1)
      return "예약취소";
    else if (new Date(v.reserv_start_time.split('T')[0].replace(/T/gi, ' ').replace(/-/gi, '/') + " " + v.reserv_start_time.split('.')[0].split('T')[1]).getTime() <= new Date().getTime())
      return "만료";
    else if (v.tr_status == 2)
      return "라이브링크초대";
    //return calculateDiffTime(new Date(v.reserv_start_time.split('T')[0].replace(/T/gi, ' ').replace(/-/gi, '/') + " " + v.reserv_start_time.split('.')[0].split('T')[1]));
    return calculateDiffTime(new Date(v.reserv_start_time));
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const moreVertMenu = () => {
    return (
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}

      >
        <MenuItem onClick={() => { onClickCancel() }}>
          <div className={["data_link", "cursor-p"]} />예약취소
        </MenuItem>
      </Menu>
    )
  }


  return (
    <>
      <MUListItem
        opacity={type2}
        disablePadding
        secondaryAction={
          <>
            {/*<IconButton
              sx={{ mr: 0.3 }}
              edge="end"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={null}
            >
              <NotificationsNoneIcon />
            </IconButton>
            */}
            <IconButton>
              <Alarm>
                <AlarmCheck type="checkbox" name="" checked={alramsetting_tiny['notiset_bunyangsuyo_mylive_part']&&alramsetting_tiny['notiset_bunyangsuyo_mylive_part'].indexOf(value.tr_id)!=-1?true:false} onClick={(e) => bunyangsuyo_mylive_part_toggle_change(e)} id={"check"+value.tr_id} value={value.tr_id}/>
                <Label for={"check"+value.tr_id}/>
              </Alarm>
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
              <div>
                <p className="capt-00">{value.tr_group_id}</p>
                <p><Chip label={getStatus(value)} size="small" color="primary"/></p>
              </div>
            </Sect_R1>
            <BunyangItemCont_T1 item={value} />
          </div>
        </MUListItemButton>
      </MUListItem>
    </>
  );
}

const Alarm = styled.div`
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:0;
    margin-right:calc(100vw*(5/428));
  }

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