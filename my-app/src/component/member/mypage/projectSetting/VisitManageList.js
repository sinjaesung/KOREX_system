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
import PeopleIcon from '@mui/icons-material/People';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import PhoneIcon from '@mui/icons-material/Phone';

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

import { Mobile, PC } from "../../../../MediaQuery"

//redux
import { useSelector } from 'react-redux';

import serverController from '../../../../server/serverController';


function checkZero(checkString) {
  return checkString.toString().length == 1 ? "0" + checkString : checkString;
}

function getDateType(date) {
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
  return temp;
}


function getDateTimeType(date) {
  var temp = `${checkZero(date.getHours())}:${checkZero(date.getMinutes())}:00`;
  console.log(temp)
  return temp;
}

function calculateDiffTime(date) {
  var stDate = new Date();
  var endDate = date;

  var btMs = endDate.getTime() - stDate.getTime();
  var btDay = btMs / (1000 * 60 * 60 * 24);
  return Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일"
}


export default function Request({
  cancleModal,
  setCancle,
  value,
  type,
  type2,
  openVisitorList,
  isEnd,
  alramsetting_tiny,
  setalramsetting_tiny
}) {

  const login_user = useSelector(data => data.login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  const getStatus = (v) => {

    if (v.reserv_start_time) {
      if (new Date(v.reserv_start_time.split('.')[0].replace(/T/gi, ' ').replace(/-/gi, '/')).getTime() < new Date().getTime()) {
        return "만료";
      }

      switch (v.tr_status) {
        case 0: return calculateDiffTime(new Date(v.reserv_start_time.split('.')[0].replace(/T/gi, ' ').replace(/-/gi, '/')));
        case 1: return "예약취소";
        case 2: return "완료";
      }
    }

  }
  var visitDate = value.reserv_start_time.replace(/\-/g, '.');

  const bunyangsupply_visit_reserv_part_change = async (e) => {
    console.log('체크 알림 요소 prd_id 값:', e.target.value);

    if (e.target.checked) {
      let body_info = {
        mem_id: login_user.memid,
        action: 'insert',
        target_id: e.target.value,
        target_column: 'notiset_bunyangsupply_visit_reserv_part',
        bp_id: bunyangTeam.bunyangTeam.bp_id
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
        target_column: 'notiset_bunyangsupply_visit_reserv_part',
        bp_id: bunyangTeam.bunyangTeam.bp_id
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
        <MenuItem className="data_link" onClick={() => { setCancle(true); cancleModal(value); setAnchorEl(null); }}>예약해제</MenuItem>
      </Menu>
    );
  }

  return (
    <>
      <MUListItem
        opacity={type2}
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
            <Tooltip title="동반고객">
              <IconButton
                sx={{ mr: 0.3 }}
                edge="end"
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={() => { openVisitorList(value.tr_id);}}
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
                <AlarmCheck type="checkbox" name="" onClick={(e) => bunyangsupply_visit_reserv_part_change(e)} value="" defaultChecked={alramsetting_tiny['notiset_bunyangsupply_visit_reserv_part']&&alramsetting_tiny['notiset_bunyangsupply_visit_reserv_part'].indexOf(value.tr_id)!=-1?true:false} id={"check"+value.tr_id} value={value.tr_id}/>
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
          <div className="flexGlow-1 flex-spabetween-center">
            <div className="par-spacing">
              <p className="capt-00">{value.create_date}_{value.tr_id}</p>
              <p><FaceIcon />{value.tr_name} {value.tr_phone}</p>
              {/*!!@@ 211102_이형규>수정 요청--- Chip label 안에 상태값,방문일자,방문시각 삽입하려면 함수호출이 아닌 변수참조 방식으로 되어야 함.*/}
              {/* <p><Chip label={getStatus(value)} size="small" color="primary" /></p> */}
              <p><Chip label={`${getStatus(value)} ${visitDate}`} size="small" color="primary" /></p>
            </div>
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