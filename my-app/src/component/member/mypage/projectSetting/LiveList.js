//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Stack from '@mui/material/Stack';
import FaceIcon from '@mui/icons-material/Face';
import PeopleIcon from '@mui/icons-material/People';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import PhoneIcon from '@mui/icons-material/Phone';


//img

import Set from '../../../../img/member/setting.png';
import LiveUser from '../../../../img/member/live_user.png';

import { Mobile, PC } from "../../../../MediaQuery"

import ModalCommon from '../../../common/modal/ModalCommon'
import serverController from '../../../../server/serverController';
import date_format from '../../../../const/dateFormat_return';

function calculateDiffTime(date) {
  var stDate = new Date();
  var endDate = date;

  var btMs = endDate.getTime() - stDate.getTime();
  var btDay = btMs / (1000 * 60 * 60 * 24);

  console.log(Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일");

  return Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일"
}

export default function Request({
  editModal,
  cancleModal,
  setCancle,
  setEdit,
  value,
  type,
  type2
}) {

  const anchorRef = React.useRef(null)

  console.log('>>>>setsettinglist:: 페이지재랜더링', value);
  // console.log('>>>>setsettinglist:: 페이지재랜더링', value.tour_start_date);

  const settingDate = new Date(value.tour_start_date);
  const year = settingDate.getFullYear();
  // const month = settingDate.getMonth();
  const month = ('0' + (settingDate.getMonth() + 1)).slice(-2);
  const FrontDate = ('0' + settingDate.getDate()).slice(-2);
  // const FrontDate = settingDate.getDate();

  console.log('FrontDate', `${year}-${month}-${FrontDate} / ${value.td_starttime}`);

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  };

  const [CheckOption, setCheckOption] = useState(value.is_active);
  // const [Disabled, setDisabled] = useState(value.type)

  const [modalOption, setModalOption] = useState({
    show: false,
    setShow: null,
    link: "",
    title: "",
    submit: {},
    cancle: {},
    confirm: {},
    confirmgreennone: {},
    content: {},
  });

  const offReservationSetting = (isActive) => {
    console.log('offReservation호출::', isActive);
    let data = {
      bp_id: 1,
      isActive: isActive == true ? 1 : 0,
      tour_id: value.tour_id
    }

    setCheckOption(isActive);
    serverController.connectFetchController(`/api/bunyang/reservation/setting`, 'PUT', JSON.stringify(data), function (res) {
      console.log('offReservationsetting라이브예약셋팅 비활성화 활성화::', res);

    });
  }

  useEffect(() => {
    console.log('checkoption상태값조회::', CheckOption);
  }, [CheckOption]);

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  };

  //등록되었습니다 모달
  const comfirmModal = (checkoption) => {
    console.log('checkioptions checkoiptin intial valuess:', checkoption);
    if (checkoption == 1) {
      setModalOption({
        show: true,
        setShow: offModal,
        title: "등록",
        content: {
          type: "text", text: `예약기능 비활성화하시겠습니까?`, component: "",
        },
        submit: { show: true, title: "비활성화", event: () => { offModal(); offReservationSetting(false); }, },
        cancle: { show: true, title: "취소", event: () => { offModal(); }, },
        confirm: { show: false, title: "확인", event: () => { offModal(); }, },
        confirmgreennone: {
          show: false,
          title: "확인",
          event: () => {
            offModal();
          },
        },
      });
    } else {
      setModalOption({
        show: true,
        setShow: offModal,
        title: "등록",
        content: {
          type: "text",
          text: `예약기능 활성화하시겠습니까?`,
          component: "",
        },
        submit: { show: true, title: "활성화", event: () => { offModal(); offReservationSetting(true); }, },
        cancle: {
          show: true,
          title: "취소",
          event: () => {
            offModal();
          },
        },
        confirm: {
          show: false,
          title: "확인",
          event: () => {
            offModal();
          },
        },
        confirmgreennone: {
          show: false,
          title: "확인",
          event: () => {
            offModal();
          },
        },
      });
    }
  };

  function isDoneReservation() {
    return new Date(value.tour_start_date.split('T')[0].replace(/T/gi, ' ').replace(/-/gi, '/') + " " + value.td_starttime).getTime() <= new Date().getTime()
  }

  const getStatus = (v) => {

    if (isDoneReservation())
      return "만료";
    else if (!CheckOption)
      return "예약비활성화";

    return calculateDiffTime(new Date(v.tour_start_date.split('T')[0].replace(/T/gi, ' ').replace(/-/gi, '/') + " " + v.td_starttime));
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
        <MenuItem onClick={() => { setCancle(true); setAnchorEl(null); cancleModal(value); }}>취소 및 안내</MenuItem>
        <MenuItem onClick={() => { setEdit(true); editModal(value); setAnchorEl(null); }}>수정 및 안내</MenuItem>
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
            <MUFormControlLabel
              control={
                <Switch
                  type="checkbox"
                  id={"switch" + value.tour_id}
                  checked={CheckOption}
                  disabled={false}
                  onClick={(event) => {
                    console.log('switch체크박스 요소 클릭::', CheckOption);
                    comfirmModal(CheckOption);
                  }}
                />
              }
              label="예약기능 활성" />
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
        <MUListItemButton>
          <div className="flexGlow-1 flex-spabetween-center">
            <div className="par-spacing">
              <p className="capt-00">{value.create_date}_{value.tour_id}</p>
              <p><FaceIcon />예약자 수: {value.reservation_count}</p>
              <p><Chip label={`${getStatus(value)} ${date_format(value.tour_start_date)} ${value.td_starttime}`} size="small" color="primary" /></p>
            </div>
          </div>
        </MUListItemButton>
      </MUListItem>
      <ModalCommon modalOption={modalOption} />
    </>
  );
}


const MUFormControlLabel = styled(FormControlLabel)``

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

const DD = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    outline: 0;
    border: 0;
    margin: 0;
    border-radius: 0;
    padding: 0;
    //cursor: pointer;
    user-select: none;
    vertical-align: middle;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-grow: 1;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    text-decoration: none;
    box-sizing: border-box;
    text-align: left;
    padding-top: 8px;
    padding-bottom: 8px;
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    padding-left: 16px;
    padding-right: 16px;
`