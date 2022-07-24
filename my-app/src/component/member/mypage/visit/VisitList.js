//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//materiail-ui
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
import PeopleIcon from '@mui/icons-material/People';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

//css
import styled from "styled-components"

//img
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Location from '../../../../img/member/loca.png';
import Set from '../../../../img/member/setting.png';
import Item from '../../../../img/main/item01.png';
import Noimg from '../../../../img/main/main_icon3.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';

import date_format from '../../../../const/dateFormat_return';
import serverController from '../../../../server/serverController'
import { Mobile, PC } from "../../../../MediaQuery"
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
  console.log(' calucdatediffTimesss date whatssssss:', date);
  var stDate = new Date();
  var endDate = new Date(date);

  console.log('calucdatediffTimesss:', endDate, stDate, endDate.getTime(), stDate.getTime());
  var btMs = endDate.getTime() - stDate.getTime();
  var btDay = btMs / (1000 * 60 * 60 * 24);
  console.log('btDaysss:', btDay);
  return Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일"
}

export default function Request({ updateList, updateMapModal, visitorModal, calModal, value, type, type2, alramsetting_tiny, setalramsetting_tiny }) {

  const login_user = useSelector(data => data.login_user);

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  //const [alarm,setAlarm] = useState(value.tr_alarm == 0 ? true : false);
  // const showModal =()=>{
  //   setMenu(!menu);
  // }

  const onClickEl = (value) => {
    updateMapModal(value);
  }

  /*const onClickAlarm = async (e) => {
    let data = {  
      tr_alarm : alarm == false ? 0 : 1,
      tr_id :value.tr_id,
     }
    let result = await serverController.connectFetchController("/api/bunyang/reservation/alarm","PUT",JSON.stringify(data));

    if(result.success == 1){
      setAlarm(e => !e);
    }
  }*/

  const bunyangsuyo_myvisit_part_toggle_change = async (e) => {
    console.log('체크 알림 요소 prd_id 값:', e.target.value);

    if (e.target.checked) {
      let body_info = {
        mem_id: login_user.memid,
        action: 'insert',
        target_id: e.target.value,
        target_column: 'notiset_bunyangsuyo_myvisit_part',
        company_id: login_user.company_id,
        user_type: login_user.user_type
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
        target_column: 'notiset_bunyangsuyo_myvisit_part',
        company_id: login_user.company_id,
        user_type: login_user.user_type
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

  // 동반고객 보기
  const onClickVisit = (value) => {
    visitorModal(value);
    setAnchorEl(null);
  }

  // 수정
  const onClickModify = (value) => {
    calModal(value);
    setAnchorEl(null);
  }

  // 예약취소
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

    if (window.confirm('예약을 취소하시겠습니까??')) {
      let result = await serverController.connectFetchController("/api/bunyang/reservation/link", "PUT", JSON.stringify(data));

      updateList();
      if (result.success) {
        //예약 취소 성공한 경우에 한해서 실행>>

        let noti_infoee = {
          transaction_id: value.tr_id,
          tour_id: value.tour_id,
          message: `=============${value.tr_name} 신청자가 분양방문예약 신청 취소하였습니다.`,
          noti_type: 'bunyang_visit_reserv_cancle'
        }
        let noti_infoess = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_infoee));
        if (noti_infoess) {
          if (noti_infoess.success) {
            console.log('noti inresultsss:', noti_infoess);
          } else {
            alert('알람 전송오류');
          }
        }
      }
    }
  }

  // 삭제
  const onClickDelete = async (v) => {
    setAnchorEl(null);

    console.log('삭제할 대상 예약내역:',v);
    let send_data={
      tour_id : v.tour_id,
      td_id : v.td_id,
      tr_id : v.tr_id,
      mem_id : v.mem_id
    }
    let delete_result=await serverController.connectFetchController('/api/bunyang/reservation_del','DELETE',JSON.stringify(send_data));
    if(delete_result){
      if(delete_result.success){
        console.log('deltee reusltss:',delete_result);
       
        updateList();
      }else{
        alert('삭제오류');
      }
    }
  }

  const getStatus = (v) => {
    console.log('getStatusss:', v);
    if (v && v.reserv_start_time) {
      if (v.tr_status == 1)
        return "예약취소";
      else if (new Date(v.reserv_start_time.split('T')[0].replace(/T/gi, ' ').replace(/-/gi, '/') + " " + v.reserv_start_time.split('.')[0].split('T')[1]).getTime() <= new Date().getTime())
        return "만료";

     // return calculateDiffTime(v.reserv_start_time.split('T')[0].replace(/T/gi, ' ').replace(/-/gi, '/') + " " + v.reserv_start_time.split('.')[0].split('T')[1]);
     return calculateDiffTime(v.reserv_start_time);
    }
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
        <MenuItem onClick={() => { onClickModify(value) }}>
          <div className={["data_link", "cursor-p"]} />
          수정</MenuItem>
        <MenuItem onClick={() => onClickCancel(value)}>
          <div className={["data_link", "cursor-p"]} />
          예약취소</MenuItem>
        <MenuItem onClick={() => onClickDelete(value)}>
          <div className={["data_link", "cursor-p"]} />
          삭제</MenuItem>
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
          <Tooltip title="동반고객">
            <IconButton
              sx={{ mr: 0.3 }}
              edge="end"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={() => { onClickVisit(value) }}
            >
              <PeopleIcon />
              <span className="iconTag-count">{value.visitor}</span>
            </IconButton>
            </Tooltip>
            {/*<IconButton
              sx={{ mr: 0.3 }}
              edge="end"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={null}
            >
              <NotificationsNoneIcon />
            </IconButton>*/}
            <IconButton>
              <Alarm>
                <AlarmCheck type="checkbox" name="" checked={alramsetting_tiny['notiset_bunyangsuyo_myvisit_part']&&alramsetting_tiny['notiset_bunyangsuyo_myvisit_part'].indexOf(value.tr_id)!=-1?true:false} onClick={(e) => bunyangsuyo_myvisit_part_toggle_change(e)} id={"check"+value.tr_group_id} value={value.tr_id}/>
                <Label for={"check"+value.tr_group_id}/>
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
                <p><Chip label={`${getStatus(value)}, ${getDateType(new Date(value.reserv_start_time && value.reserv_start_time.split('T')[0].replace(/T/gi, ' ').replace(/-/gi, '/')))}`} size="small" color="primary"/></p>
                {/* <div>
                  <span>{getDateType(new Date(value.reserv_start_time && value.reserv_start_time.split('T')[0].replace(/T/gi, ' ').replace(/-/gi, '/')))}</span>
                  <span>{value.reserv_start_time && new Date(value.reserv_start_time).getHours() < 10 ? '0' + value.reserv_start_time && new Date(value.reserv_start_time).getHours() : value.reserv_start_time && new Date(value.reserv_start_time).getHours()}:{value.reserv_start_time && new Date(value.reserv_start_time).getMinutes() < 10 ? '0' + value.reserv_start_time && new Date(value.reserv_start_time).getMinutes() : value.reserv_start_time && new Date(value.reserv_start_time).getMinutes()}</span>
                </div> */}
              </div>
            </Sect_R1>
            <div className="flex-left-center">
             <BunyangItemCont_T1 item={value} />
            </div>  
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