//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
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
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Set from '../../../../img/member/setting.png';
import Check from '../../../../img/map/radio.png';
import Checked from '../../../../img/map/radio_chk.png';

//component
import { Mobile, PC } from "../../../../MediaQuery"
import ExcMaemulMark from '../../../common/broker/excMaemulMark';
import { SliceText, numTokor } from '../../../common/commonUse';
import ListItemCont_Maemul_T1 from '../../../common/broker/listItemCont_Maemul_T1';

//image load
import localStringData from "../../../../const/localStringData";


export default function Request({ tridchklist_function, cancleModal, confirmModal, mapModal, value, match_productinfo, select, cond, opacity, time_distance, time_status, setSelect, editModal, editResultModal }) {

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
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

  const trid_chk_change = (e) => {
    console.log('각 체크박스요소 체크여부:', e.target, e.target.value);

    if (e.target.checked) {
      //변화 발생시점에 체크가 된 상황이라면 해당 요소의 ischk 고유값은 변화
      //setIschk(true);//각 개별 요소 변화시킨다.
      //각 요소에 대해서 체크발생시 기존 배열에 해당 요소 추가,set으로 관리. 해제하면 기존배열에서(set)에서 대상요소 제거
      tridchklist_function(e.target.value, 'add');
    } else {
      //체크해제시에 
      //setIschk(false);
      tridchklist_function(e.target.value, 'remove');
    }
  }
  /*useEffect( () => {
    console.log('managelist요소 useEfeect 형태 실행:::',ischk_val);

    setIschk(ischk_val);
  });*/

  console.log('managleilist element for loops:', value.tr_id);
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
        <MenuItem onClick={() => { cancleModal(value.tr_id, value.mem_id, value.tr_email, value.tr_phone, value.tr_name); setAnchorEl(null); }}>
          <div className={["data_link", "cursor-p"]} />예약 해제</MenuItem>
        <MenuItem onClick={() => {
          console.log('=>>>>value.선택한 상품prd_identity_id값:', match_productinfo.prd_identity_id);
          setAnchorEl(null);
          editModal(match_productinfo.prd_identity_id, value.tr_id, value.mem_id, value.tr_email, value.tr_phone, value.tr_name, value.request_user_selectsosokid);//선택한 매물id값에 대해서 보낸다.어떤 매물에 대한 셋팅리스트 보여준다. 또한 어떤 tr_id에 대한 예약접수내역을 클릭한지 여부 구한다. 유저가 선택한 소속id값도 보낸댜. 어떤 소속에 있었었는지.어떤 소속상태에서 보낸건지.
        }}>수정</MenuItem>
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
                <p className="capt-00">{value.number} PRD{value.prd_identity_id}</p>
                <p><Tooltip title="예약자"><FaceIcon /></Tooltip>{value.tr_name}{value.tr_phone}</p>
                <p><Chip label={`${message}(${value.tour_reservDate})`} size="small" color="primary" /></p>
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


const ConditionType = styled.div`
  color:${({ color }) => color};
  display:inline-block;
`

















const Li = styled.li`
  width:100%;
  display:flex;justify-content:flex-start;align-items:center;
  position:relative;
  padding:29px 24px 29px 20px;
  border-bottom:1px solid #f7f8f8;
  opacity:${({ opacity }) => opacity};
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(29/428)) 0;
    align-items:center;
  }
`
const WrapLeft = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  margin-right:40px;
  @media ${(props) => props.theme.mobile} {
    margin-right:0;
  }
`
const ItemImg = styled.div`
  width:106px;height:106px;border: solid 1px #e4e4e4;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(80/428));height:calc(100vw*(80/428));
  }
`
const Img = styled.img`
  width:100%;height:100%;border-radius:3px;
`
const Infos = styled.div`
  display:flex;justify-content:center;align-items:center;
  width:100%;margin: 0 auto;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    justify-content:space-between;
  }
`
const Date = styled.div`
  display:block;
  font-size:15px;
  font-weight:800;color:#4a4a4a;
  transform:skew(-0.1deg);
  margin-bottom:7px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(3/428));
  }
`
const ConditionDiv = styled(Date)`
  display:inline-block;
  color:#979797;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    margin-bottom:calc(100vw*(5/428));
  }
`
const Condition = styled(ConditionDiv)`
  margin-bottom:0;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    margin-bottom:0;
  }
`
const Number = styled.p`
  font-size:14px;color:#979797;
  transform:skew(-0.1deg);
  display:inline-block;
  margin-left:5px;
  font-weight:600;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-left:calc(100vw*(5/428));
  }
`
const Line = styled.h2`
  display:flex;justify-content:space-between;align-items:flex-start;
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
  }
`
const Left = styled.p`
  font-size:15px;font-weight:600;
  transform:skew(-0.1deg);color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }
`

const Right = styled(Left)`
  color:#979797;
  text-align:right;
  width:330px;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(190/428));
    }
`
const RightOg = styled(Right)`
  color:#fe7a01;
  text-decoration:underline;
`
const RightCursor = styled(Right)`
  cursor:pointer;
`
const Call = styled.a`
`
const WrapRight = styled.div`
  margin-right:20px;
  @media ${(props) => props.theme.modal} {
      margin-right:calc(100vw*(10/428));
    }
`
const CheckBox = styled.div`
`
const InputCheckEa = styled.input`
  display:none;
  &:checked+label{background:url(${Checked}) no-repeat;background-size:100% 100%}
`
const CheckLabelEa = styled.label`
  display:inline-block;
  width:20px;height:20px;
  background:url(${Check}) no-repeat;background-size:100% 100%;
  @media ${(props) => props.theme.modal} {
      width:calc(100vw*(20/428));
      height:calc(100vw*(20/428));
    }
`
const RightMenu = styled.div`
    position:absolute;
    right:0;
    top:20px;
    @media ${(props) => props.theme.mobile} {
      top:calc(100vw*(10/428));
      transform:none;
      display:flex;justify-content:flex-start;
    }
`
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
// const Menu = styled(Alarm)`
//   margin-bottom:0;
//   @media ${(props) => props.theme.mobile} {
//     margin-right:0;
//   }
// `
const MenuIcon = styled.div`
  width:36px;height:36px;
  border-radius:5px;
  border:1px solid #e4e4e4;
  background:url(${Set}) no-repeat center center; background-size:20px 20px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(31/428));
    height:calc(100vw*(31/428));
    background:url(${Set}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428));
  }
`
const Bg = styled.div`
  position:fixed;width:100%;height:100%;
  background:rgba(0,0,0,0.2);left:0;top:0;
`
const InMenu = styled.ul`
  position:absolute;
  top:46px;left:44px;
  width:112px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;
  z-index:2;
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(35/428));
    left:calc(100vw*(-40/428));
    width:calc(100vw*(100/428));
  }

`
const Div = styled.li`
  font-size:13px;
  transform:skew(-0.1deg);
  border-radius:8px;
  padding:4px 0 4px 17px;
  transition:all 0.3s;
  &:hover{background:#f8f7f7;}
  &:first-child{padding-top:8px;}
  &:last-child{padding-bottom:8px;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    padding:calc(100vw*(4/428)) 0 calc(100vw*(4/428)) calc(100vw*(12/428));
    &:first-child{padding-top:calc(100vw*(8/428));}
    &:last-child{padding-bottom:calc(100vw*(8/428));}
  }
`
const InDiv = styled.div`
  width:100%;height:100%;
`
const InBox = styled.div`
width:74%;

`