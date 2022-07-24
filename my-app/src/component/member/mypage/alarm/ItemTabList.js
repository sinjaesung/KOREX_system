//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//img
import View from '../../../../img/main/icon_view.png';
import Item from "../../../../img/map/map_item.png";
import Check from "../../../../img/main/heart.png";
import HeartCheck from "../../../../img/main/heart_check.png";
import Set from '../../../../img/member/setting.png';

import { Mobile, PC } from "../../../../MediaQuery";

//material
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

//server process
import serverController from '../../../../server/serverController';

//redux
import { useSelector } from 'react-redux';

export default function ItemTabList({ value, setexculsive_supply_privacycompany_notilist, setexculsive_supply_probroker_notilist, setexculsive_demand_notilist, setexculsive_supply_privacycompany_notilist_notseencnt, setexculsive_supply_probroker_notilist_notseencnt, setexculsive_demand_notilist_notseencnt, setbunyangsuyo_notilist, setbunyangsupply_notilist, setbunyangsuyo_notilist_notseencnt, setbunyangsupply_notilist_notseencnt }) {

  var alram_case;
  const history = useHistory();

  const login_user = useSelector(data => data.login_user);

  switch (value.noti_type) {
    case '1':
      alram_case = '중개의뢰검토결과';//전속매물공급(개인기업)
      break;

    case '2':
      alram_case = '중개의뢰신규등록';//전속매물공급(중개사)
      break;

    case '3':
      alram_case = '매물상태변경';//전속매물공급(개인기업)
      break;

    case '6':
      alram_case = '거래개시동의요청결과';//전속매물공급(중개사)
      break;

    case '4':
      alram_case = '매물상태변경';//전속매물공급(중개사)
      break;

    case '5':
      alram_case = '매물상태변경';//전속매물공급(개인기업)
      break;

    case '9':
      alram_case = '물건투어예약신규접수';//전속매물공급(중개사)
      break;

    case '8':
      alram_case = '물건투어예약내역 예약취소/수정';//전속매물공급(중개사)
      break;

    case '10':
      alram_case = '물건투어예약접수내역 예약시간조정';//전속매물수요(개인기업중개사)
      break;

    case '11':
      alram_case = '물건투어예약접수 방문 1일전입니다.';//전속매물수요(개인기업중개사)
      break;

    case '13':
      alram_case = '매물상태변경(전속기한만료3일전)';//전속기한만료삼일전 관련알림
      break;
    case '14':
      alram_case = '매물상태변경(전속기한만료)';//전속기한만료당일 관련알림 만료됨 >>더이상 사이드바에 뜨지않음.거래종료상태와비슷.
      break;
    case '15':
      alram_case = '전속기한연장요청';//전속매물공급 전문중개사
      break;
    case '16':
      alram_case = '매물상태변경';//전속매물공급 개인기업 : 전문중개사>>>거래완료승인요청
      break;
    case '17':
      alram_case = '거래완료승인요청결과';//전속매물공급 전문중개사  개인기업>>>전문중개사
      break;

    case 'bunyang_live_newRegisted':
      alram_case = '분양라이브방송예고 신규등록';
      break;
    case 'bunyang_live_edited':
      alram_case = '분양라이브방송 일정변경(취소,수정)';
      break;
    case 'bunyang_live_invite':
      alram_case = '분양라이브방송 초대알림';
      break;
    case 'bunyang_live_startday_reservealram':
      alram_case = '분양라이브방송예약 방송당일알림';
      break;
    case 'bunyang_visit_startday_reservealram':
      alram_case = '분양방문예약 방문일 당일,3일전 알림';
      break;
    case 'bunyang_visit_cancled_by_bunyang':
      alram_case = '분양방문예약 해제알림';
      break;
    case 'bunyang_visit_new_registed':
      alram_case = '분양방문예약 신규접수(등록)';
      break;
    case 'bunyang_visit_reserv_modify':
      alram_case = '분양방문예약 접수내역 접수자측 수정';
      break;
    case 'bunyang_visit_reserv_cancle':
      alram_case = '분양방문예약 접수내역 접수자측 접수취소';
      break;
    case 'bunyang_live_new_registed':
      alram_case = '분양라이브방송예약 신규접수(등록)';
      break;
    case 'bunyang_live_reserv_cancle':
      alram_case = '분양라이브방송예약 접수내역 접수자측 접수취소';
      break;

    default:
      alram_case = '알림케이스000';
      break;
  }
  const [menu2, setMenu2] = useState(false);
  const showModal2 = () => {
    setMenu2(!menu2);
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
        <MenuItem>숨기기</MenuItem>
        <MenuItem>사건ID의 모든 알림 끄기</MenuItem>
      </Menu>
    )
  }

  return (
    <MUListItem
      disablePadding
      secondaryAction={
        <>
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
        <div className="flex-gsb">
          <p className="capt-00">{value.reserv_plan_date ? value.reserv_plan_date : value.modify_date}_{value.noti_id}</p>
          <div>
            {
              value.noti_status == 0 ?
                <>
                  <Chip label="안읽음" size="small" color='secondary' variant="outlined" />&nbsp;&nbsp;
                </>
                :
                null
            }
            <span className="list-tit">{/*alram_case*/value.noti_case}gg</span>
          </div>
          <p className="list-tag">[사건ID:{value.txn_id}]</p>
          <div className="flex-ellipsis-1">
            <div className="flex-ellipsis-2">
              <p className="flex-ellipsis-3 capt-a1" onClick={async () => {
                //클릭한 순간 읽은것으로 간주하며, 알람상세페이지이동한다.

                let body_info = {
                  noti_id: value.noti_id//해당 noti_id알람을 읽었다 처리합니다.
                }
                let noti_status_update = await serverController.connectFetchController('/api/alram/noti_status_update', 'POST', JSON.stringify(body_info));

                if (noti_status_update) {
                  console.log('noti_stautss updatess:', noti_status_update);
                  if (noti_status_update.success) {

                    history.push('/MyAlramDetail/' + value.noti_id);

                  }
                }
              }
              }>{value.noti_content}
              </p>
            </div>
          </div>
        </div>

        {/* <RightMenu>
          <MenuIn>
            <div onClick={showModal2} className="cursor-p">
              <MenuIcon />
              {
                menu2 ?
                  <InMenu2>
                    <Div onClick={async () => {
                      let body_info = {
                        noti_id: value.noti_id
                      }
                      let noti_status_update = await serverController.connectFetchController('/api/alram/noti_status_update2', 'POST', JSON.stringify(body_info));

                      if (noti_status_update) {
                        console.log('noti_status updatesss:', noti_status_update);
                        if (noti_status_update.success) {
                          //숨김처리한다.
                          //alert('숨김처리되었습니다.');
                          //history.push('/Mypage');

                          let noti_info = {
                            mem_id: login_user.memid,
                          }
                          let noti_list_request = await serverController.connectFetchController('/api/alram/myalram_list_process', 'POST', JSON.stringify(noti_info));
                          console.log('=====>>noti list requetsss:', noti_list_request);

                          if (noti_list_request.success) {
                            let exculsive_supply_privacycompany_notilist_res = noti_list_request.result[0];
                            let exculsive_supply_probroker_notilist_res = noti_list_request.result[1];
                            let exculsive_demand_notilist_res = noti_list_request.result[2];
                            let bunyangsuyo_notilist_res = noti_list_request.result[3];
                            let bunyangsupply_notilist_res = noti_list_request.result[4];

                            let exculsive_supply_privacycompany_notilist_notseen = noti_list_request.count_result[0];
                            let exculsive_supply_probroker_notilist_notseen = noti_list_request.count_result[1];
                            let exculsive_demain_notilist_notseen = noti_list_request.count_result[2];
                            let bunyangsuyo_notilist_notseen = noti_list_request.count_result[3];
                            let bunyangsupply_notilist_notseen = noti_list_request.count_result[4];

                            setexculsive_supply_privacycompany_notilist(exculsive_supply_privacycompany_notilist_res);
                            setexculsive_supply_probroker_notilist(exculsive_supply_probroker_notilist_res);
                            setexculsive_demand_notilist(exculsive_demand_notilist_res);
                            setbunyangsuyo_notilist(bunyangsuyo_notilist_res);
                            setbunyangsupply_notilist(bunyangsupply_notilist_res);

                            setexculsive_supply_privacycompany_notilist_notseencnt(exculsive_supply_privacycompany_notilist_notseen);
                            setexculsive_supply_probroker_notilist_notseencnt(exculsive_supply_probroker_notilist_notseen);
                            setexculsive_demand_notilist_notseencnt(exculsive_demain_notilist_notseen);
                            setbunyangsuyo_notilist_notseencnt(bunyangsuyo_notilist_notseen);
                            setbunyangsupply_notilist_notseencnt(bunyangsupply_notilist_notseen);
                          }
                        } else {
                          //alert(noti_status_update.message);
                        }
                      }
                    }}>
                      <InDiv className="cursor-p">숨기기</InDiv>
                    </Div>
                    <Div>
                      <InDiv className="cursor-p">사건ID의 모든 알림 끄기</InDiv>
                    </Div>
                  </InMenu2>
                  :
                  null
              }
            </div>
          </MenuIn>
        </RightMenu> */}
      </MUListItemButton>
    </MUListItem >
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







const TabContent = styled.div`
  position:relative;
  width:100%; overflow:visible;
  padding:30px 0;margin-top:17px;
  margin:0 auto 17px;
  border-bottom:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding:0 calc(100vw*(27/428)) calc(100vw*(23/428));
    margin:calc(100vw*(23/428)) auto;
    }
`
const Condition = styled.div`
  font-size:15px;color:#707070;
  font-weight:800;transform:skew(-0.1deg);
  margin-bottom:15px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    margin-bottom:calc(100vw*(20/428));
    }
`
const Orange = styled.span`
  font-size:15px;color:#fe7a01;
  font-weight:800;transform:skew(-0.1deg);
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    }
`
const WrapAlarmInfo = styled.div`
  width:550px;
  padding-left:50px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding-left:0;
    }

`
const FlexBox = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(6/428));
    }
`
const Left = styled.p`
  font-size:15px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    }
`
const Right = styled(Left)`
  color:#979797;
`
const RightWd100 = styled(Right)`
  width:100%; cursor:pointer;
  margin-top:6px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(6/428));
    }
`
const RightMenu = styled.div`
  position:absolute;right:30px;top:30px;
  @media ${(props) => props.theme.mobile} {
    right:calc(100vw*(23/428));
    top:calc(100vw*(-10/428));
  }
`

const InMenu2 = styled.ul`
  position:absolute;
  width:160px;
  top:0;left:44px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;
  z-index:3;
  @media ${(props) => props.theme.mobile} {
    width: calc(100vw*(145/428));
    left: calc(100vw*(-114/428));
    top: calc(100vw*(35/428));
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
    font-size:calc(100vw*(12/428));
    padding:calc(100vw*(4/428)) 0 calc(100vw*(4/428)) calc(100vw*(12/428));
    &:first-child{padding-top:calc(100vw*(8/428));}
    &:last-child{padding-bottom:calc(100vw*(8/428));}
  }
`
const InDiv = styled.div`
  width:100%;height:100%;
`
const Alarm = styled.div`
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:0;
    margin-right:calc(100vw*(5/428));
  }

`
// const Menu = styled(Alarm)`
//   margin-bottom:0;
//   @media ${(props) => props.theme.mobile} {
//     margin-right:0;
//   }
// `
// const MenuIn = styled(Menu)`

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
