//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"

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


//img
import Item from '../../../../img/main/item01.png';
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Location from '../../../../img/member/loca.png';
import Set from '../../../../img/member/setting.png';
import Noimg from '../../../../img/main/main_icon3.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';

//component
import { Mobile, PC } from "../../../../MediaQuery";
import ListItemCont_Maemul_T1 from '../../../common/broker/listItemCont_Maemul_T1';

//server process
import serverController from '../../../../server/serverController';

//redux 
import { useSelector } from 'react-redux';

export default function RequestList({ filter, setFilter, mannerModal, cancleModal, startModal, completeModal, cancle2Modal, value, type, match_transaction_item, alramsetting_tiny, setalramsetting_tiny, setBrokerproductlist }) {
  const login_user = useSelector(data => data.login_user);

  var modify_date = new window.Date(value.modify_date);
  var year = new window.Date(modify_date).getFullYear();

  var month = new window.Date(modify_date).getMonth() + 1;
  var date = new window.Date(modify_date).getDate() + 1;
  month = month < 10 ? '0' + month : month;
  date = date < 10 ? '0' + date : date;

  //각 매물의 값을 조회.기한만료여부의 경우 현재 날짜값 timestamp이 기한만료일(exclusive_end_date)보다 더 큰경우로 판단.
  var now_date = new window.Date();
  var exclusive_end_date = value.exclusive_end_date;
  var prd_exculsive_timestamp = new window.Date(exclusive_end_date).getTime();
  var exculsive_is_expired = false;

  if (now_date.getTime() > prd_exculsive_timestamp) {
    exculsive_is_expired = true;
  } else {
    exculsive_is_expired = false;
  }

  const history = useHistory();
  //console.log('중개의뢰 매물 요청 list반복:',value,match_transaction_item);

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  // 모달창 분기처리 
  const moreVertMenu = () => {
    if (match_transaction_item.txn_status == '대기' || match_transaction_item.txn_status == '검토대기' || match_transaction_item.txn_status == '검토 대기' || match_transaction_item.txn_status == '검토중') {
      return (
        <div>
          <MenuItem onClick={() => { cancleModal(value.prd_identity_id, value.company_id, value.request_mem_id); setAnchorEl(null); }}>의뢰철회</MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to={"/EditRequest/" + value.prd_identity_id} className={["data_link"]} />
            수정
          </MenuItem>
        </div>


        // <InMenu>
        //   <Div>
        // <InDiv onClick={()=>{cancleModal(value.prd_identity_id, value.company_id, value.request_mem_id);}}>의뢰 철회</InDiv>
        //   </Div>
        //   <Div>
        // <Link to={"/EditRequest/"+value.prd_identity_id}  className={["data_link"]}/>
        //     <InDiv>수정</InDiv>
        //   </Div>
        // </InMenu>
      )
    } else if (match_transaction_item.txn_status == '거래 준비' || match_transaction_item.txn_status == '거래준비' || match_transaction_item.txn_status == '거래개시') {
      return (
        <div>
          <MenuItem onClick={() => { cancle2Modal(value.prd_identity_id, value.company_id, value.request_mem_id); setAnchorEl(null); }}>의뢰철회</MenuItem>
          <MenuItem onClick={() => { mannerModal(value.company_id); setAnchorEl(null); }}>중개매너 평가</MenuItem>
          <MenuItem onClick={() => { history.push('/DetailViewRequest/' + value.prd_identity_id); setAnchorEl(null); }}>
            <div to="/DetailViewRequest" className={["data_link", "cursor-p"]} />
            상세
          </MenuItem>
        </div>

        //  <InMenu>
        //   <Div>
        //     <InDiv onClick={()=>{cancle2Modal(value.prd_identity_id, value.company_id, value.request_mem_id);}}>위임 취소</InDiv>
        //   </Div>
        //   <Div>
        //     <InDiv onClick={()=>{mannerModal(value.company_id);}}>중개매너 평가</InDiv>
        //   </Div>
        //   <Div onClick={() => { history.push('/DetailViewRequest/'+value.prd_identity_id);}}>
        //     <div to="/DetailViewRequest"  className={["data_link", "cursor-p"]}/>
        //     <InDiv>상세</InDiv>
        //   </Div>
        // </InMenu>

      )
    } else if (match_transaction_item.txn_status == '거래개시승인 요청' || match_transaction_item.txn_status == '거래승인 요청') {
      return (

        <div>
          <MenuItem onClick={() => { history.push('/Preview/' + value.prd_identity_id); setAnchorEl(null); }}>거래개시동의요청 확인</MenuItem>
          <MenuItem onClick={() => { cancle2Modal(value.prd_identity_id, value.company_id, value.request_mem_id); setAnchorEl(null); }}>위임 취소</MenuItem>
          <MenuItem onClick={() => { mannerModal(value.company_id); setAnchorEl(null); }}>중개매너 평가</MenuItem>
          <MenuItem onClick={() => { history.push('/DetailViewRequest/' + value.prd_identity_id); setAnchorEl(null); }}>
            <div to="/DetailViewRequest" className={["data_link", "cursor-p"]} />
            상세
          </MenuItem>
        </div>
      )
    } else if (match_transaction_item.txn_status == '거래완료승인 요청' || match_transaction_item.txn_status == '거래완료승인요청') {
      return (

        <div>
          <MenuItem onClick={() => { history.push('/PreviewComplete/' + value.prd_identity_id); setAnchorEl(null); }}>거래완료승인요청 확인</MenuItem>
          <MenuItem onClick={() => { cancle2Modal(value.prd_identity_id, value.company_id, value.request_mem_id); setAnchorEl(null); }}>위임 취소</MenuItem>
          <MenuItem onClick={() => { mannerModal(value.company_id); setAnchorEl(null); }}>중개매너 평가</MenuItem>
          <MenuItem onClick={() => { history.push('/DetailViewRequest/' + value.prd_identity_id); setAnchorEl(null); }}>
            <div to="/DetailViewRequest" className={["data_link", "cursor-p"]} />
            상세
          </MenuItem>
        </div>
      )
    } else if (match_transaction_item.txn_status == '의뢰철회' || match_transaction_item.txn_status == '의뢰거절' || match_transaction_item.txn_status == '거래완료' || match_transaction_item.txn_status == '위임취소' || match_transaction_item.txn_status == '수임취소' || exculsive_is_expired == true) {
      return (
        <div>
          <MenuItem onClick={async () => {
            //alert('해당 value중개의뢰 product자체를 삭제한다!'+value.prd_identity_id);
            //관련된 모든 product,transaction,transactionhistory다 삭제한다.

            if (window.confirm('해당 중개요청 매물을 삭제하시겠습니까??')) {
              let body_info = {
                delete_target_id: value.prd_identity_id
              }
              let delete_request = await serverController.connectFetchController('/api/broker/brokerRequest_product_deleteProcess', 'POST', JSON.stringify(body_info));

              if (delete_request) {
                console.log('delete request reulsts:', delete_request);

                if (delete_request.success) {
                  alert('삭제 처리 되었습니다.');

                  let brokerRequest_info = {
                    user_type: login_user.user_type
                  };
                  try {
                    let broker_res = await serverController.connectFetchController('/api/broker/user_brokerRequestlistview', 'POST', JSON.stringify(brokerRequest_info));
                    console.log('res resultssss:', broker_res);

                    if (broker_res) {
                      if (broker_res.success) {
                        if (broker_res.result_data) {
                          setBrokerproductlist(broker_res.result_data);
                          setAnchorEl(null);
                        }
                      }
                    }
                  } catch (e) {

                  }
                  // history.push('/Mypage');
                } else {
                  alert(delete_request.message);
                  setAnchorEl(null);
                }
              }
            }

          }}>
            <div className={["data_link", "cursor-p"]} />
            삭제
          </MenuItem>
          <MenuItem onClick={() => { mannerModal(value.company_id); setAnchorEl(null); }}>중개매너 평가</MenuItem>
        </div>

      )
    } else {
      return;
    }

  }

  const brokerprd_alramcheck_toggle_change = async (e) => {
    console.log('체크 알림 요소 prdiideinditityid값:', e.target.value);

    if (e.target.checked) {
      let body_info = {
        mem_id: login_user.memid,
        action: 'insert',
        prd_identity_id: e.target.value,
        company_id: login_user.company_id,
        user_type: login_user.user_type
      }
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_brokerprdlist', 'POST', JSON.stringify(body_info));
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
      let res = await serverController.connectFetchController('/api/alram/alramSetting_process_brokerprdlist', 'POST', JSON.stringify(body_info));
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
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {moreVertMenu()}
            </Menu>
          </>
        }
      >
        <MUListItemButton >
          <div className="flexGlow-1">
            <Sect_R1 className="flex-spabetween-center">
            <div className="par-spacing">
                <p className="capt-00">{value.prd_identity_id}</p>
                <p><Tooltip title="중개사"><FaceIcon /></Tooltip>중개사명</p>
                <p><Chip label={`${match_transaction_item.txn_status} ${value.modify_date}`} size="small" color="primary" /></p>
              </div>
              <div>
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

const ItemImg = styled.div`
  width:106px;height:106px;border: solid 1px #e4e4e4;
  margin-right:40px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(80/428));height:calc(100vw*(80/428));
    margin-right:calc(100vw*(13/428));
  }
`
const Img = styled.img`
  width:100%;height:100%;border-radius:3px;
 
`
const Infos = styled.div`
  width:450px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(280/428));
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
    font-size:calc(100vw*(13/428));max-width:calc(100vw * (105 / 428));overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
    margin-bottom:0;
  }
`
const ConditionDate = styled(Condition)`
`
const Number = styled.p`
  font-size:14px;color:#979797;
  transform:skew(-0.1deg);
  margin-bottom:7px;
  font-weight:600;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(3/428));
  }
`
const Title = styled.h3`
  font-size:18px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  margin-bottom:15px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(17/428));
    margin-bottom:calc(100vw*(8/428));
  }
`
const Kinds = styled.h2`
  display:flex;justify-content:space-between;align-items:flex-start;
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(6/428));
  }
`
const Left = styled.p`
  font-size:15px;font-weight:600;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    width:calc(100vw*(65/428));
    word-break:keep-all;
  }
`
const Right = styled(Left)`
  color:#979797;
  text-align:right;
  width:330px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(200/428));
  }
`
const Address = styled(Kinds)`
`
const Trade = styled(Kinds)`
  margin-bottom:0;
`
const RightMenu = styled.div`
    position:absolute;
    right:0;
    top:50%;transform:translateY(-50%);
    @media ${(props) => props.theme.mobile} {
      top:calc(100vw*(20/428));
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
    left:calc(100vw*(-30/428));
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