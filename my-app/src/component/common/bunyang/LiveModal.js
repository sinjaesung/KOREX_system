//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled as MUstyled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

//style
import styled from "styled-components"

import ModalCommon from "../modal/ModalCommon";

//img
// import CloseIcon from "../../../img/main/modal_close.png";
import Check from "../../../img/member/check.png";
import Checked from "../../../img/member/checked.png";

import serverController from '../../../server/serverController'
import { useSelector } from 'react-redux';


function checkZero(checkString){
  return checkString.toString().length == 1 ?  "0" + checkString : checkString;
}

function getDateType(date){
  //date.setDate(date.getDate() + 1);
  console.log('what data whatssss?',date,date.getFullYear(),date.getMonth()+1, date.getDate());
  var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
  return temp;
}


function getDateTimeType(date){
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getHours())}:${checkZero(date.getMinutes())}:00`;
  return temp;
}


export default function LiveModal({bunyangDetail,cal, setCal,live, setLive}){
  console.log('라이브모달 띄우기ㅣㅣ:',live,setLive,bunyangDetail);

  const [tour, setTour] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [modalOption,setModalOption] = useState({
    show : false,
    setShow:null,
    link:"",
    title:"",
    submit:{},
    cancle:{},
    confirm:{},
    confirmgreennone:{},
    content:{}
  });
  const userInfo = useSelector(e => e.login_user);

  const offModal = ()=>{
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const liveModal = () =>{
    // 확인버튼 눌렀을때 이름과 이메일 value 값입니다.
    //여기가 모달 키는 거에엽
    setModalOption({
        show:true,
        setShow:offModal,
        title:"Live 시청예약",
        content:{type:"text",text:`Live시청 예약이 정상적으로\n접수되었습니다.\n담당자가 Live방송 시작전에\n초대장을 이메일로 보내드립니다.`},
        submit:{show:false , title:"적용" , event : ()=>{offModal(); }},
        cancle:{show:false , title:"초기화" , event : ()=>{offModal(); }},
        confirm:{show:false , title:"확인" , event : ()=>{offModal(); }},
        confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal(); setLive(false);}}
    });

    // 이후 서버에 성공적으로 저장되었다면 초기화시켜줍니다.
    setName("");
    setEmail("");
  }
  
  const failModal = () =>{
    setModalOption({
      show:true,
      setShow:offModal,
      title:"Live 시청예약",
      content:{type:"text",text:`Live 예약이 불가능한 분양입니다.`},
      submit:{show:false , title:"적용" , event : ()=>{offModal(); }},
      cancle:{show:false , title:"초기화" , event : ()=>{offModal(); }},
      confirm:{show:false , title:"확인" , event : ()=>{offModal(); }},
      confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal(); setLive(false);}}
  });
  }

  const moveToEmail = () =>{
    window.location.href = "/EmailChange";
  }

  const userMissingModal = () =>{
    setModalOption({
      show:true,
      setShow:offModal,
      title:"Live 시청예약",
      content:{type:"text",text:`Live 예약은 계정에 이메일이 등록되어있어야 사용가능합니다. 지금 이메일 등록하시겠습니까?`},
      submit:{show:false , title:"적용" , event : ()=>{offModal(); }},
      cancle:{show:false , title:"초기화" , event : ()=>{offModal(); }},
      confirm:{show:false , title:"확인" , event : ()=>{offModal(); }},
      confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal(); setLive(false); moveToEmail();}}
    });
  }

  useEffect(() => {
    if(bunyangDetail && !bunyangDetail.bp_id)
      return;

    serverController.connectFetchController(`/api/bunyang/reservation/setting?bp_id=${bunyangDetail&&bunyangDetail.bp_id}&tour_type=4`,'GET',null,function(res){
      if(res.success == 1){
        setTour(res.data[0]);//그 나온 관련 리스트중에서 분양디테일변경 로드시점떄에 분양라이브예약셋팅내역리스트중 첫번째것??가장 최근것.으로 한다.여러개 쌓여있다면 가장 최근거하나의정보tour지정.
      }
    });
  }, [bunyangDetail])

  
  let blockEvent = false;

  const confimLiveReservation = () =>{
    
    console.log('coinfimliveResevation호출::',live,tour,tour.tour_start_date);

    if(live && (!userInfo.email || !userInfo.user_name)){
        userMissingModal();
        return;
    }

    if(!tour){ failModal(); return; }

    if(blockEvent){ return; }

    blockEvent = true;
  
    let data = {
      tour_id : tour.tour_id,
      td_id : tour.td_id,
      userList : [],
      tr_name : userInfo.user_name,
      tr_email : userInfo.email,
      tr_phone : userInfo.phone ? userInfo.phone :"01000001234",
      mem_id : userInfo.memid ? userInfo.memid : 43,
      company_id : userInfo.company_id? userInfo.company_id : null,
      tr_type : 2,
      reserv_start_time : getDateType(new Date()) + " " + getDateTimeType(new Date()),
      reserv_target_time : getDateType(new Date(tour.tour_start_date)),
      bp_id : bunyangDetail.bp_id,
      tr_group_id : new Date().getTime() + "" + tour.tour_id
    }
    console.log('data requessssts:',data);//라이브예약을 한다.라이브예약접수 유저의 자동적 로그인유저의 중개사회원유저가 타겟이며 그의 이름,이메일,폰번호정보가,memid값보낸다.
    //tr_type:2 라이브시청예약. 그 투어 tourid,td_id

    serverController.connectFetchController(`/api/bunyang/reservation`,'POST',JSON.stringify(data),async function(res){
      if(res.success == 1){
        blockEvent = false;
        liveModal();

        //분양라이브예약신청한 시점에 그 신청하려는 분양라이브방송tourid,tdid 그 투어의 방송일 값으로 당시되어있었던것으로 관련처리한다.
        /*
        let transaction_id = tour.tour_id;//어떤 tourid셋팅 라이브셋팅방에 대한 txnid인지 그것을 이용하여 어떤 memid가 신청했었는지 그 신청했었던 존재에게만 예약알림.
        let tour_start_date=new window.Date(tour.tour_start_date);
        console.log('tour_start_datessss:',(tour_start_date.getFullYear())+'-'+(tour_start_date.getMonth()+1<10?'0'+(tour_start_date.getMonth()+1):(tour_start_date.getMonth()+1))+'-'+(tour_start_date.getDate()<10?'0'+(tour_start_date.getDate()):(tour_start_date.getDate())) );
        let noti_info ={
          transaction_id : transaction_id,
          message : `========== 신청하신 분양라이브 방송일 : ${(tour_start_date.getFullYear())+'-'+(tour_start_date.getMonth()+1<10?'0'+(tour_start_date.getMonth()+1):(tour_start_date.getMonth()+1))+'-'+(tour_start_date.getDate()<10?'0'+(tour_start_date.getDate()):(tour_start_date.getDate()))} 당일이 되었습니다!!(tour_id:${tour.tour_id})`,
          noti_type : 'bunyang_live_startday_reservealram',
          noti_reserv_date : (tour_start_date.getFullYear())+'-'+(tour_start_date.getMonth()+1<10?'0'+(tour_start_date.getMonth()+1):(tour_start_date.getMonth()+1))+'-'+(tour_start_date.getDate()<10?'0'+(tour_start_date.getDate()):(tour_start_date.getDate())),
          request_mem_id: userInfo.memid ? userInfo.memid : 1
        }
        let noti_res = await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(noti_info));
        if(noti_res){
          if(noti_res.success){
            console.log('noti reusltsss:',noti_res);
          }else{
            alert('알람 발송오류!!');
          }
        }*/

        //라이브방송신청 등록되면 관련 처리.
        let noti_infoee={
          tour_id: tour.tour_id,//어떤 라이브예약셋팅 tourid에 대한 신청인지
          transaction_id : tour.tour_id,//어떤 라이브예약셋팅 tourid에 대한 
          message : `==============${bunyangDetail.bp_name} 프로젝트 라이브방송예약 신규접수되었습니다.\n\n 접수자:${userInfo.user_name}(${userInfo.phone})`,
          noti_type : 'bunyang_live_new_registed'//분양라이브방송 신규접수
        }
        let noti_infoess=await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(noti_infoee));
        if(noti_infoess){
          if(noti_infoess.success){
            console.log('noti_resultssss:',noti_infoess);
          }else{
            alert('알람 발송오류!');
          }
        }
      }
      else{
        blockEvent = false;
      }
    });
  }


  if(live == false)
    return null;

    return (
      <Container>
        <Dialog
          open={live}
          onClose={() => { setLive(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
           Live 시청예약
          </DialogTitle>
          <DialogContent>
            <ModalBody>
              {
                (!userInfo.email || !userInfo.user_name)?
                <>
                  <Box>
                  <BoxTitle>이름</BoxTitle>
                  <InputText type="text" name="" placeholder="이름이 등록되어있지않은 계정입니다."></InputText>
                </Box>
                <Box>
                  <BoxTitle>이메일</BoxTitle>
                  <InputText type="email" name="" placeholder="이메일이 등록되어있지않은 계정입니다."></InputText>
                </Box> 
              </>
              :
              <>
                <Box>
                  <BoxTitle>이름</BoxTitle>
                  <InputText type="text" name="" value={userInfo.user_name} ></InputText>
                </Box>
                <Box>
                  <BoxTitle>이메일</BoxTitle>
                  <InputText type="email" name="" value={userInfo.email}></InputText>
                </Box> 
              </>
              }
              
            </ModalBody>
            <ModalBtn>
              <Confirm type="submit" name="" onClick={confimLiveReservation}>확인</Confirm>
            </ModalBtn>
          </DialogContent>
      
        </Dialog>
        <ModalCommon modalOption={modalOption} />        
      </Container>
    );
}

const Container = styled.div`
  width:100%;

`
const ModalBg = styled.div`
  position:fixed;
  width:100%;height:100%;left:0;top:0;
  display:block;content:'';background:rgba(0,0,0,0.05);
  z-index:1001;
`
const Wraplive = styled.div`
  position:fixed;z-index:1002;
  width:535px;height:auto;
  background:#fff;
  border-radius:24px;
  border:1px solid #f2f2f2;
  left:50%;top:50%;transform:translate(-50%,-50%);
  padding:49px 49px 77px 63px;

  @media ${(props) => props.theme.modal} {
      width:calc(100vw*(395/428));
      height:auto;
      padding:calc(100vw*(24/428)) calc(100vw*(20/428)) calc(100vw*(50/428));
    }
`
const ModalClose = styled.div`
  width:100%;
  text-align:right;
  margin-bottom:22px;

  @media ${(props) => props.theme.modal} {
      margin-bottom:calc(100vw*(25/428));
    }
`
const CloseImg = styled.img`
  display:inline-block;
  width:15px;height:16px;

  @media ${(props) => props.theme.modal} {
      width:calc(100vw*(12/428));
      height:calc(100vw*(13/428));
    }
`
const ModalTop = styled.div`
  width:100%;padding-bottom:20px;
  border-bottom:1px solid #a3a3a3;
  @media ${(props) => props.theme.modal} {
      padding-bottom:calc(100vw*(15/428));
    }
`
const Title = styled.div`
  font-size:20px;
  font-weight:800;
  color:#707070;
  @media ${(props) => props.theme.modal} {
      font-size:calc(100vw*(15/428));
    }
`
const ModalBody = styled.div`
  width:100%;
  padding-top:11px;
  @media ${(props) => props.theme.modal} {
      padding-top:calc(100vw*(14/428));
    }
`
const Box = styled.div`
  width:100%;
  margin-bottom:14px;
  &:last-child{margin-bottom:0;}

  @media ${(props) => props.theme.modal} {
      margin-bottom:calc(100vw*(15/428));
    }
`
const BoxTitle = styled.p`
  font-size:12px;color:#4a4a4a;
  margin-bottom:9px;
  padding-left:7px;

  @media ${(props) => props.theme.modal} {
      font-size:calc(100vw*(12/428));
      margin-bottom:calc(100vw*(9/428));
      padding-left:calc(100vw*(7/428));
    }
`
const InputText = styled.input`
  font-size:15px;color:#979797;
  transform:skew(-0.1deg);
  text-align:center;
  width:100%;
  height:43px;
  line-height:43px;
  border:1px solid #e4e4e4;
  &::placeholder{font-size:15px;color:#979797;}

  @media ${(props) => props.theme.modal} {
      font-size:calc(100vw*(14/428));
      height:calc(100vw*(43/428));
      line-height:calc(100vw*(43/428));
      &::placeholder{font-size:calc(100vw*(14/428));}
    }
`
const Checkbox = styled.div`
  margin:30px 0;
  text-align:center;
  @media ${(props) => props.theme.modal} {
      margin:calc(100vw*(25/428)) 0;
    }

`
const CheckInput = styled.input`
  display:none;
  &:checked + .check_label .chk_on_off{width:16px;height:16px;background:url(${Checked}) no-repeat;background-size:100% 100%;}
  @media ${(props) => props.theme.modal} {
    &:checked + .check_label .chk_on_off{width:calc(100vw*(16/428));height:calc(100vw*(16/428));background:url(${Checked}) no-repeat;background-size:100% 100%;}
    }
`
const Label = styled.label`
  font-size:12px;
  transform:skew(-0.1deg);
  font-weight:bold;color:#4a4a4a;

  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(12/428));
    }

`
const Span = styled.span`
  display:inline-block;
  margin-right:12px;
  width:16px;height:16px;
  background:url(${Check}) no-repeat;
  background-size:100% 100%;
  vertical-align:middle;
  transform:skew(-0.1deg);

  @media ${(props) => props.theme.modal} {
    margin-right:calc(100vw*(12/428));
    width:calc(100vw*(16/428));height:calc(100vw*(16/428));
  }
`
const ViewTerm = styled.p`
  display:inline-block;
  font-size:12px;
  color:#a0a0a0;
  font-weight:600;
  transform:skew(-0.1deg);
  vertical-align:text-bottom;
  margin-left:20px;

  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(12/428));
    margin-left:calc(100vw*(12/428));
  }
`
const ModalBtn = styled.div`
    width:100%;
`
const Confirm = styled.div`
    width:100%;text-align:center;
    background:#979797;
    border:3px solid #e4e4e4;
    border-radius:11px;
    height:66px;
    line-height:60px;
    color:#fff;
    font-size:20px;font-weight:600;
    margin-top:40px;
    @media ${(props) => props.theme.modal} {
      height:calc(100vw*(60/428));
      line-height:calc(100vw*(54/428));
      font-size:calc(100vw*(15/428));
    }
`
