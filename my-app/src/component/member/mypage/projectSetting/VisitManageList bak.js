//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//material-ui
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

import { Mobile, PC } from "../../../../MediaQuery"

//redux
import {useSelector} from 'react-redux';

import serverController from '../../../../server/serverController';


function checkZero(checkString){
  return checkString.toString().length == 1 ?  "0" + checkString : checkString;
}

function getDateType(date){
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
  return temp;
}


function getDateTimeType(date){
  var temp = `${checkZero(date.getHours())}:${checkZero(date.getMinutes())}:00`;
  console.log(temp)
  return temp;
}

function calculateDiffTime(date){
  var stDate =  new Date();
  var endDate = date;

  var btMs = endDate.getTime() - stDate.getTime();
  var btDay = btMs / (1000*60*60*24) ;
  return Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일"
}


export default function Request({cancleModal,setCancle,value,type,type2,openVisitorList,isEnd,alramsetting_tiny,setalramsetting_tiny}) {

  const login_user=useSelector(data=>data.login_user);
  const bunyangTeam=useSelector(data=>data.bunyangTeam);

  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const showModal =()=>{
    setMenu(!menu);
  }


  const getStatus = (v) =>{

    if(v.reserv_start_time){
      if(new Date(v.reserv_start_time.split('.')[0].replace(/T/gi,' ').replace(/-/gi,'/')).getTime() < new Date().getTime()){
        return "만료";
      }
  
      switch(v.tr_status){
        case 0 : return calculateDiffTime(new Date(v.reserv_start_time.split('.')[0].replace(/T/gi,' ').replace(/-/gi,'/'))) ;
        case 1 : return "예약취소"; 
        case 2 : return "완료"; 
      }
    }
    
  }

  const bunyangsupply_visit_reserv_part_change = async(e) => {
    console.log('체크 알림 요소 prd_id 값:',e.target.value);

    if(e.target.checked){
      let body_info = {
        mem_id:login_user.memid,
        action:'insert',
        target_id:e.target.value,
        target_column:'notiset_bunyangsupply_visit_reserv_part',
        bp_id : bunyangTeam.bunyangTeam.bp_id
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
        target_column : 'notiset_bunyangsupply_visit_reserv_part',
        bp_id : bunyangTeam.bunyangTeam.bp_id
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
          <Li opacity={type2()}>
            <Infos>
              <Condition>상태:<Orange color={type}>{getStatus(value)}</Orange></Condition>
              <Number>등록번호 {value.tr_group_id} trid:{value.tr_id} company_id:{value.request_user_selectsosokid}</Number>
              <FlexBox>
                <Title>예약자명</Title>
                <Name>{value.tr_name}</Name>
              </FlexBox>
              <FlexBox>
                <Title>휴대폰번호</Title>
                <CallTag href="tel:010-1234-5678">
                  <Phone>{value.tr_phone}</Phone>
                </CallTag>
              </FlexBox>
              <DateTime>
                <Datediv>{value.reserv_start_time&&getDateType(new Date(value.reserv_start_time.split('.')[0].replace(/T/gi,' ').replace(/-/gi,'/')))}</Datediv>
                <Time>{/*getDateTimeType(new Date(value.reserv_start_time.split('.')[0].replace(/T/gi,' ').replace(/-/gi,'/')))*/}{value.reserv_start_time ? new Date(value.reserv_start_time).getHours():''}:{value.reserv_start_time? new Date(value.reserv_start_time).getMinutes()<10?'0'+new Date(value.reserv_start_time).getMinutes():new Date(value.reserv_start_time).getMinutes():''}</Time>
              </DateTime>
              <Visitor>동반고객 {value.visitor} tr_status:{value.tr_status}</Visitor>
            </Infos>
            <RightMenu>
              <Alarm>
              <AlarmCheck type="checkbox" name="" onClick={(e) => bunyangsupply_visit_reserv_part_change(e)} value="" defaultChecked={alramsetting_tiny['notiset_bunyangsupply_visit_reserv_part']&&alramsetting_tiny['notiset_bunyangsupply_visit_reserv_part'].indexOf(value.tr_id)!=-1?true:false} id={"check"+value.tr_id} value={value.tr_id}/>
                <Label for={"check"+value.tr_id}/>
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
              <MenuItem className="data_link" onClick={() => { openVisitorList(value.tr_id); setAnchorEl(null); }}>동반고객 보기</MenuItem>
              <MenuItem className="data_link" onClick={() => { setCancle(true); cancleModal(value.tr_id, value.mem_id); setAnchorEl(null); }}>예약해제</MenuItem>
            </Menu>

              {/* <Menu>
                <Link onClick={showModal}>
                  <MenuIcon/>
                    {
                      menu ?
                      <InMenu>
                        <Div>
                          <Link onClick={()=>{openVisitorList(value.tr_id)}} className="data_link"></Link>
                          <InDiv>동반고객 보기</InDiv>
                        </Div>
                        <Div>
                          <Link onClick={()=> {setCancle(true); cancleModal(value.tr_id,value.mem_id);}} className="data_link"></Link>
                          <InDiv>예약취소</InDiv>
                        </Div>
                      </InMenu>
                      :
                      null
                    }
                </Link>
              </Menu> */}
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

const Number = styled.p`
  font-size:14px;color:#979797;
  transform:skew(-0.1deg);
  margin-bottom:8px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(6/428));
  }
`
const FlexBox = styled.div`
  width:88%;
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
  }
`
const Title = styled.h4`
  font-size:15px;
  font-weight:800;transform:skew(-0.1deg);
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Name = styled.p`
  font-size:15px; color:#979797;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Phone = styled(Name)`
  color:#fe7a01;
  text-decoration:underline;
`
const CallTag = styled.a`
  display:inline-block;
`
const DateTime = styled.div`
  width:100%;
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(6/428));
  }
`
const Datediv = styled.div`
  display:inline-block;
  font-size:15px;color:#01684b;
  font-weight:800;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Time = styled.span`
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
