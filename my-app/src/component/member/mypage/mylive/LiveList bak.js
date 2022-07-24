//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//material-ui
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import localStringData from '../../../../const/localStringData';

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

import serverController from '../../../../server/serverController';

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
  var stDate =  new Date();
  var endDate = date;

  var btMs = endDate.getTime() - stDate.getTime();
  var btDay = btMs / (1000*60*60*24) ;
  return Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일"
}


export default function Request({value,type,type2,updateList , setalramsetting_tiny, alramsetting_tiny}) {
  const login_user=useSelector(data=> data.login_user);
  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  //const [alarm,setAlarm] = useState(value.tr_alarm == 0 ? true : false);

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

    if(window.confirm("예약을 취소하시겠습니까?")){
      let result = await serverController.connectFetchController("/api/bunyang/reservation/link","PUT",JSON.stringify(data));

      updateList();
      if(result.success){

        //예약취소성공한경우 라이브예약 취소한경우
        let noti_infoee={
          transaction_id : value.tr_id,
          tour_id : value.tour_id,
          message : `================${value.tr_name} 신청자가 분양라이브예약 신청 취소하였습니다.`,
          noti_type : 'bunyang_live_reserv_cancle'
        }
        let noti_infoess= await serverController.connectFetchController("/api/alram/notification_process","POST",JSON.stringify(noti_infoee));
        if(noti_infoess){
          if(noti_infoess.success){
            console.log('noti infoeerreultss:',noti_infoess);
          }else{
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
  const bunyangsuyo_mylive_part_toggle_change = async(e) => {
    console.log('체크 알림 요소 prd_id 값:',e.target.value);

    if(e.target.checked){
      let body_info = {
        mem_id:login_user.memid,
        action:'insert',
        target_id:e.target.value,
        target_column:'notiset_bunyangsuyo_mylive_part',
        user_type: login_user.user_type,
        company_id : login_user.company_id
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
        target_column : 'notiset_bunyangsuyo_mylive_part',
        user_type:login_user.user_type,
        company_id:login_user.company_id
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

  const getStatus = (v) =>{
    if(v.tr_status == 1)
      return "예약취소";
    else if(new Date(v.reserv_start_time.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/') + " " + v.reserv_start_time.split('.')[0].split('T')[1]).getTime() <= new Date().getTime())
      return "만료";
    else if(v.tr_status==2)
      return "라이브링크초대";  
    return calculateDiffTime(new Date(v.reserv_start_time.split('T')[0].replace(/T/gi,' ').replace(/-/gi,'/') + " " + v.reserv_start_time.split('.')[0].split('T')[1])) ;
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
        <Img>
          <ItemImg src={localStringData.imagePath + value.image_list.split(',')[0]} alt="img"/>
        {/*상품이미지가 없을경우*/}
          {/* <ItemImg src={Noimg} alt="img"/> */}
        </Img>
        <Infos>
          <Condition>상태:<Orange color={type}>{getStatus(value)}</Orange></Condition>
          <Number>등록번호 {value.tr_group_id} trid:{value.tr_id}</Number>
          <ProjectName>{value.bp_name} {value.tr_status==2?'초대링크:'+value.tr_liveurl:""}</ProjectName>
        </Infos>
        <RightMenu>
          <Alarm>
            <AlarmCheck type="checkbox" name="" checked={alramsetting_tiny['notiset_bunyangsuyo_mylive_part']&&alramsetting_tiny['notiset_bunyangsuyo_mylive_part'].indexOf(value.tr_id)!=-1?true:false} onClick={(e) => bunyangsuyo_mylive_part_toggle_change(e)} id={"check"+value.tr_id} value={value.tr_id}/>
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
            <MenuItem onClick={() => { onClickCancel() }}>
              <div className={["data_link", "cursor-p"]} />예약취소
              </MenuItem>
          </Menu>


          {/* <Menu>
            <div onClick={() => setMenu(!menu)} className="cursor-p">
              <MenuIcon/>
                {
                  menu ?
                  <InMenu>
                    <Div>
                      <div className={["data_link", "cursor-p"]}/>
                      <InDiv onClick={() => {onClickCancel()}} >예약취소</InDiv>
                    </Div>
                  
                  </InMenu>
                  :
                  null
                }
            </div>
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
  display:flex;justify-content:flex-start;align-items:center;
  padding:29px 24px 29px 20px;
  border-bottom:1px solid #f7f8f8;
  opacity:${({opacity}) => opacity};
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(29/428)) 0;
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
  margin-bottom:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
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
const ProjectName = styled.div`
  display:inline-block;
  font-size:18px;margin-bottom:8px;
  font-weight:800;color:#4a4a4a;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(6/428));
  }
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
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(35/428));
    left:calc(100vw*(-10/428));
    width:calc(100vw*(80/428));
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
