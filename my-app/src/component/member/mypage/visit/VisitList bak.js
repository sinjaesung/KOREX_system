//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//materiail-ui
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

import serverController from '../../../../server/serverController'
import { Mobile, PC } from "../../../../MediaQuery"

//redux
import {useSelector} from 'react-redux';

function checkZero(checkString){
  return checkString.toString().length == 1 ?  "0" + checkString : checkString;
}

function getDateType(date){
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
  return temp;
}


function getDateTimeType(date){
  var temp = `  ${date.getHours() > 12 ? "오후 " : "오전 "} ${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${checkZero(date.getMinutes())} `;
  return temp;
}

function calculateDiffTime(date){
  console.log(' calucdatediffTimesss date whatssssss:',date);
  var stDate =  new Date();
  var endDate = new Date(date);
  
  console.log('calucdatediffTimesss:',endDate,stDate,endDate.getTime(),stDate.getTime());
  var btMs = endDate.getTime() - stDate.getTime();
  var btDay = btMs / (1000*60*60*24) ;
  console.log('btDaysss:',btDay);
  return Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일"
}

export default function Request({updateList,updateMapModal,visitorModal,calModal,value,type,type2,alramsetting_tiny,setalramsetting_tiny}) {
 
  const login_user=useSelector(data=>data.login_user);
  
  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
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
  
  const bunyangsuyo_myvisit_part_toggle_change = async(e) => {
    console.log('체크 알림 요소 prd_id 값:',e.target.value);

    if(e.target.checked){
      let body_info = {
        mem_id:login_user.memid,
        action:'insert',
        target_id:e.target.value,
        target_column:'notiset_bunyangsuyo_myvisit_part',
        company_id : login_user.company_id,
        user_type: login_user.user_type
      }
      let res=await serverController.connectFetchController('/api/alram/alramSetting_process_bunyang','POST',JSON.stringify(body_info));
      if(res){
        if(res.success){
          console.log('res resultsss:',res.result);
          setalramsetting_tiny(res.result);
        }else{
          alert(res.message);
        }
      }
    }else{
      let body_info={
        mem_id:login_user.memid,
        action:'delete',
        target_id : e.target.value,
        target_column : 'notiset_bunyangsuyo_myvisit_part',
        company_id: login_user.company_id,
        user_type : login_user.user_type
      }
      let res=await serverController.connectFetchController('/api/alram/alramSetting_process_bunyang','POST',JSON.stringify(body_info));
      if(res){
        if(res.success){
          console.log('res ruesltssss:',res.result);
          setalramsetting_tiny(res.result);
        }else{
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
      content :"예약취소",
      url :"",
      userList : [{
        tr_id :value.tr_id,
        tr_status : 1,
      }]
    }

    if(window.confirm('예약을 취소하시겠습니까??')){
      let result = await serverController.connectFetchController("/api/bunyang/reservation/link","PUT",JSON.stringify(data));

      updateList();
      if(result.success){
        //예약 취소 성공한 경우에 한해서 실행>>

        let noti_infoee={
          transaction_id : value.tr_id,
          tour_id : value.tour_id,
          message: `=============${value.tr_name} 신청자가 분양방문예약 신청 취소하였습니다.`,
          noti_type : 'bunyang_visit_reserv_cancle'
        }
        let noti_infoess=await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(noti_infoee));
        if(noti_infoess){
          if(noti_infoess.success){
            console.log('noti inresultsss:',noti_infoess);
          }else{
            alert('알람 전송오류');
          }
        }
      }

    }
    
  }

  // 삭제
  const onClickDelete = () => {
    setAnchorEl(null);
  }


  const getStatus = (v) =>{
    console.log('getStatusss:',v);
    if(v && v.reserv_start_time){
      if(v.tr_status == 1)
        return "예약취소";
      else if(new Date( v.reserv_start_time.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/') + " " + v.reserv_start_time.split('.')[0].split('T')[1]).getTime() <= new Date().getTime())
        return "만료";
        
      return calculateDiffTime(v.reserv_start_time.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/') + " " + v.reserv_start_time.split('.')[0].split('T')[1]) ;
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
    <Container>
      <Li opacity={type2}>
        <Infos>
          <Condition>상태:<Orange color={type}>{getStatus(value)}</Orange></Condition>
          <Number>등록번호 {value.tr_group_id}</Number>
          <Title>{value.bp_name}({value.tr_id})tdid:{value.td_id}</Title>
          <Address>
            <Link onClick={() => {onClickEl(value)}}>
              <AddressTitle>{value.bp_addr_jibun}<LocaImg src={value.locaImg}/></AddressTitle>
            </Link>
          </Address>
          <DateTime>
            <DateDiv>{getDateType(new Date(value.reserv_start_time&&value.reserv_start_time.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/')))}</DateDiv>
            <Time>{/*getDateTimeType(new Date(value.reserv_start_time.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/') + " " + value.reserv_start_time.split('.')[0].split('T')[1]))*/}{value.reserv_start_time&&new Date(value.reserv_start_time).getHours()<10?'0'+value.reserv_start_time&&new Date(value.reserv_start_time).getHours():value.reserv_start_time&&new Date(value.reserv_start_time).getHours()}:{value.reserv_start_time&&new Date(value.reserv_start_time).getMinutes()<10?'0'+value.reserv_start_time&&new Date(value.reserv_start_time).getMinutes():value.reserv_start_time&&new Date(value.reserv_start_time).getMinutes()}</Time>
          </DateTime>
          <Visitor>동반고객 {value.visitor}</Visitor>
        </Infos>
        <RightMenu>
          <Alarm>
            <AlarmCheck type="checkbox" name="" checked={alramsetting_tiny['notiset_bunyangsuyo_myvisit_part']&&alramsetting_tiny['notiset_bunyangsuyo_myvisit_part'].indexOf(value.tr_id)!=-1?true:false} onClick={(e) => bunyangsuyo_myvisit_part_toggle_change(e)} id={"check"+value.tr_group_id} value={value.tr_id}/>
            <Label for={"check"+value.tr_group_id}/>
          </Alarm>

          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls="long-menu"
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
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
            <MenuItem onClick={() => { onClickVisit(value) }}>
              <div className={["data_link", "cursor-p"]} />
              동반고객 보기</MenuItem>
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

        </RightMenu>
      </Li>
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
  display:block;
  padding:29px 32px;
  border-bottom:1px solid #f7f8f8;
  opacity:${({opacity}) => opacity};
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(29/428)) calc(100vw*(15/428));
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
`
const Condition = styled.h4`
  font-size:15px;color:#707070;font-weight:800;
  transform:skew(-0.1deg);
  margin-bottom:33px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    margin-bottom:calc(100vw*(30/428));
  }
`
const Orange = styled(Condition)`
  color:${({color}) => color};
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
  margin-bottom:8px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(6/428));
  }
`
const Title = styled.h4`
  font-size:15px;margin-bottom:6px;
  font-weight:800;transform:skew(-0.1deg);
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(6/428));
  }
`

const Address = styled.div`
  width:100%;
`
const AddressTitle = styled.div`
  display:inline-block;
  font-size:18px;margin-bottom:8px;
  font-weight:800;color:#4a4a4a;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(6/428));
  }
`
const LocaImg = styled.img`
  display:inline-block;width:20px;margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    margin-left:calc(100vw*(3/428));
  }
`
const DateTime = styled.div`
  width:100%;
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(6/428));
  }
`
const DateDiv = styled.div`
  display:inline-block;
  font-size:15px;color:#01684b;
  font-weight:800;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Time = styled(DateDiv)`
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(5/428));
  }
`
const Visitor = styled.p`
  font-size:15px;color:#4a4a4a;font-weight:800;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const RightMenu = styled.div`
    position:absolute;
    right:32px;
    top:30px;
    @media ${(props) => props.theme.mobile} {
      top:calc(100vw*(20/428));right:0;
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
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(35/428));
    left:calc(100vw*(-30/428));
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
