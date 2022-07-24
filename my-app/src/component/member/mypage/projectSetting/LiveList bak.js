//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"

//material-ui
import Switch from '@material-ui/core/Switch';
import { styled as MUstyled } from '@material-ui/core/styles'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
//img

import Set from '../../../../img/member/setting.png';
import LiveUser from '../../../../img/member/live_user.png';

import { Mobile, PC } from "../../../../MediaQuery"

import ModalCommon from '../../../common/modal/ModalCommon'
import serverController from '../../../../server/serverController';



function calculateDiffTime(date) {
  var stDate = new Date();
  var endDate = date;

  var btMs = endDate.getTime() - stDate.getTime();
  var btDay = btMs / (1000 * 60 * 60 * 24);

  return Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일"
  console.log(Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일");
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
  return (
    <Container>
      <Li opacity={type2}>
        <Infos>
          <Condition>
            상태:<Orange color={type}>{getStatus(value)}</Orange> <br />
            세팅 날짜/시간:<Orange color={type}>{`${year}-${month}-${FrontDate} / ${value.td_starttime}`}</Orange>
          </Condition>
          <Number>등록번호 {value.tour_group_id}</Number>
          <Live>
            <Txt>Live 시청 예약</Txt>
            <Person>
              <PersonImg src={LiveUser} />
              <Personnel>{value.reservation_count}</Personnel>
            </Person>
          </Live>
          <SwitchButton>
            {/* {
              getStatus(value) == '만료' ?
                <Switch
                  type="checkbox"
                  id={"switch" + value.tour_id}
                  checked={CheckOption}
                  disabled={true}
                  onClick={(event) => {
                    console.log('switch체크박스 요소 클릭::', CheckOption);
                    comfirmModal(CheckOption);
                  }}
                /> :
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
            } */}
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

            {/* <SwitchLabel for={"switch" + value.tour_id}>
              <SwitchSpan />
            </SwitchLabel> */}
            {/* <Span>예약기능 활성화{CheckOption} tour_id={value.tour_id},td_id={value.td_id}</Span> */}
            <Span>{value.is_active == true ? "예약기능 활성화" : "예약기능 비활성화"}</Span>
          </SwitchButton>
        </Infos>
        <RightMenu>


          {
            !isDoneReservation() ?
              <div>
                <IconButton
                  onClick={handleClick}
                  ref={anchorRef}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    'aria-labelledby': 'long-button',
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => {
                    setCancle(true);
                    setAnchorEl(null);
                    cancleModal(value);
                  }}>취소 및 안내</MenuItem>
                  <MenuItem onClick={() => {
                    setEdit(true);
                    editModal(value);
                    setAnchorEl(null);
                  }}>수정 및 안내</MenuItem>
                </Menu>

              </div>

              :
              null
          }



          {/* {
            !isDoneReservation() ?
              <Menu>
              <Link onClick={showModal}>
                <MenuIcon />
                { menu ? (
                  <InMenu>
                    <Div>
                      <Link
                        onClick={() => {
                          setCancle(true);
                          cancleModal(value);
                        }}
                        className="data_link"
                      ></Link>
                      <InDiv>취소 및 안내</InDiv>
                    </Div>
                    <Div>
                      <Link
                        onClick={() => {
                          setEdit(true);
                          editModal(value);
                        }}
                        className="data_link"
                      ></Link>
                      <InDiv>수정 및 안내</InDiv>
                    </Div>
                  </InMenu>
                ) : null}
              </Link>
            </Menu>
            :
            null
          } */}



        </RightMenu>
      </Li>
      <ModalCommon modalOption={modalOption} />
    </Container>
  );
}

const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = styled.div`

`
const Li = styled.li`
  width:100%;
  position:relative;
  display:flex;justify-content:flex-start;align-items:center;
  padding:29px 24px 29px 20px;
  border-bottom:1px solid #f7f8f8;
  opacity:${({ opacity }) => opacity};
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(26/428)) calc(100vw*(22/428));
  }
`
const Img = styled.div`
  width:106px;
  height:106px;
  margin-right:40px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(80/428));
    height:calc(100vw*(80/428));
    margin-right:calc(100vw*(18/428));
  }
`
const ItemImg = styled.img`
  width:100%;
  height:100%;border-radius:3px;
  border:1px solid #e4e4e4;
`
const Infos = styled.div`
  width:45%;
  @media ${(props) => props.theme.mobile} {
    width:100%;
  }
`
const Condition = styled.h4`
  font-size:15px;color:#707070;font-weight:800;
  transform:skew(-0.1deg);
    margin-bottom:30px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    margin-bottom:calc(100vw*(30/428));
  }
`
const Orange = styled(Condition)`
  color:${({ color }) => color};
  display:inline-block;
  margin-left:5px;
  margin-bottom:0;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(5/428));
  }
`
const Green = styled(Orange)`
  color:#01684b;
`
const Gray = styled(Orange)`
  color:#707070;
  opacity:0.5;
`
const Number = styled.p`
  font-size:14px;color:#979797;
  transform:skew(-0.1deg);
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(6/428));
  }
`
const Live = styled.div`
  width:100%;position:relative;
  margin-bottom:25px;
`
const Txt = styled.p`
  font-size:15px;color:#4a4a4a;
  transform:skew(-0.1deg);
  font-weight:800;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(8/428));
  }
`
const Person = styled.div`
  position:absolute;
  top:50%;transform:translateY(-50%);right:0;
  display:flex;justify-content:flex-start;align-items:center;
`
const PersonImg = styled.img`
  display:inline-block;
  width:20px;
  margin-right:11px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    margin-right:calc(100vw*(11/428));
  }
`
const Personnel = styled.p`
  font-size:15px;color:#4a4a4a;
  transform:skew(-0.1deg);
  font-weight:800;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const RightMenu = styled.div`
    position:absolute;
    right:32px;
    top:30px;
    @media ${(props) => props.theme.mobile} {
      top:calc(100vw*(25/428));
      right:0;
      display:flex;justify-content:flex-start;
    }
`
// const Menu = styled.div`
//   margin-bottom:6px;
//   @media ${(props) => props.theme.mobile} {
//     margin-bottom:0;
//     margin-right:calc(100vw*(5/428));
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
    background:url(${Set}) no-repeat center center; 
    background-size:calc(100vw*(20/428)) calc(100vw*(20/428));
    margin-right: calc(100vw * (10 / 428));
  }
`
const Bg = styled.div`
  position:fixed;width:100%;height:100%;
  background:rgba(0,0,0,0.2);left:0;top:0;
`
const InMenu = styled.ul`
  position:absolute;
  top:0;left:44px;
  width:112px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(35/428));
    left:calc(100vw*(-70/428));
    width:calc(100vw*(100/428));
  }
`
const Div = styled.li`
  position:relative;
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

const SwitchButton = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(20/428));
  }
`
// const Switch = styled.input`
//   display:none;
//   &:checked+label{background:#009053}
//   &:checked+label span{left:22px;}
//   @media ${(props) => props.theme.mobile} {
//     &:checked+label span{left:calc(100vw*(24/428));}
//   }
// `
const SwitchLabel = styled.label`
  position:relative;display:inline-block;
  width:41px;
  height:15px;background:#e4e4e4;
  border-radius: 18px;
  border: solid 1px #d6d6d6;
  transition:all 0.3s;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(41/428));
    height:calc(100vw*(15/428));
  }
`
const SwitchSpan = styled.span`
  position:absolute;left:-1px;top:50%;transform:translateY(-50%);
  width:18px;height:18px;border-radius:100%;
  border: solid 1px #888888;
  background-color: #ffffff;
  transition:all 0.3s;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
    height:calc(100vw*(18/428));
  }
`
const Span = styled.span`
  display:inline-block;font-size:15px;
  font-weight:800;transform:skew(-0.1deg);color:#4a4a4a;
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-left:calc(100vw*(10/428));
  }
`
