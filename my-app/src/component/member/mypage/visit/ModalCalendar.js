//react
import React ,{useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";

//style
import styled from "styled-components";

//img
import CloseIcon from "../../../../img/main/modal_close.png";
import Check from "../../../../img/member/check.png";
import Checked from "../../../../img/member/checked.png";

//components
import ModalCalendarFirst from "./ModalCalendarFirst";
import ModalCalendarSecond from "./ModalCalendarSecond";
import ModalCalendarThird from "./ModalCalendarThird";

import serverController from '../../../../server/serverController'
import ModalCommon from '../../../common/modal/ModalCommon';
import BunyangDetail from '../../../common/bunyang/BunyangDetail';

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
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getHours())}:${checkZero(date.getMinutes())}:00`;
  return temp;
}

export default function ModalCal({value, offModal,updateList}){
  console.log('Modlacandlers요소 방문예약수정모달창관련요소:',value);
  const [pageIndex , setPageIndex] = useState(0);

  const [selectDate, setSelectDate] = useState(new Date());
  const [selectTime, setSelectTime] = useState(new Date());

  const [userList, setUserList] = useState([]);

  const [modalOption,setModalOption] = useState({show : false,setShow:null,link:"",title:"",submitnone:{},cancle:{},confirm:{},confirmgreen:{},content:{}});

  let blockEvent = false;

  const history = useHistory();

 const [tour,setTour] = useState({});
 const userInfo = useSelector(e=>e.login_user);

 const [holidayMap,setHolidayMap ] =useState({});
 const [checkedTime,setCheckedTime] = useState('');


  const confimReservation = async () =>{
   
    //if(blockEvent){  return; }

   // blockEvent = true;
    //대상 trid요소 tourReservation신청요소를 수정합니다. userList동반고객리스트 tourid,어떤tourid,tdid,trid신청내역에 대해서 하는건지, 신청자memid정보 그대로 해서 방문예약trtype처리 선택날짜 시간대에 방문예약시간, 분양플젝id,tourgroupidtimestamp값. tr_status신청수정반영, content''
    let data = {
      tour_id : value.tour_id,
      td_id : value.td_id,
      tr_id : value.tr_id,
      userList : userList,
      mem_id :value.mem_id,
      tr_type : 1,
      reserv_start_time : getDateType(selectDate) + " " + getDateTimeType(selectTime),
      bp_id:value.bp_id,
      tr_group_id : new Date().getTime() + "" + value.tour_id + value.mem_id,
      tr_status : 0,
      content : ""
    }
    console.log('cxonfirmReservation요청(내 방문예약 수정)::',data);
    let res = await serverController.connectFetchController(`/api/bunyang/reservation`,'PUT',JSON.stringify(data));
    //history.goBack();
    offModal();
    if(res.success == true){
      updateList();
      successInsertReservation();
  //    blockEvent = false;

      //내방문예약수정하려는 경우에 수정하려는 그 tourReservation tr레코드 내역의 방문예약셋팅tourid내역을 txnid로 보낸다. txnid의 경우 여기선 trid
      let noti_infoee={
        transaction_id : value.tr_id,//해당 신청id값.
        tour_id : value.tour_id,//어떤 tourid에서의 인지 어떤 분양프로젝트의 어떤방문예약셋팅에 대한 신청한것을 수정하는건지내역 보냄.
        message : `========== ${value.tr_name} 신청자가 분양방문예약 예약신청정보 수정하였습니다. \n\n 수정시간대:${getDateType(selectDate)+" "+getDateTimeType(selectTime)}`,
        noti_type : 'bunyang_visit_reserv_modify'
      }
      let noti_infoess=await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(noti_infoee));
      if(noti_infoess){
        if(noti_infoess.success){
          console.log('noti_resultssss:',noti_infoess);
        }else{
          alert('알람전송오류');
        }
      }


      //분양방문예약 내역 수정성공시에 관련된 처리진행>> 분양방문예약 방문일 삼일전 알림
      console.log('예약접수신청 방문예약접수신청>>>:',selectDate);//수정하기로 한 날짜값.
      let reserv_start_date= new window.Date(selectDate);//신청날짜값 방문예약방문 신청대상날짜.
      let reserv_start_dates=new window.Date(selectDate);//신청일당일.
      let date_format = reserv_start_date.getTime() - (3*24*60*60*1000);//3일전 타임스탬프값
      reserv_start_date = new window.Date(date_format);//다시 date형태.
      let year=reserv_start_date.getFullYear();
      let month=reserv_start_date.getMonth()+1;
      let date=reserv_start_date.getDate();

      let years=reserv_start_dates.getFullYear();
      let months=reserv_start_dates.getMonth()+1;
      let dates=reserv_start_dates.getDate();

      if(months<10){
        months= '0'+months;
      }
      if(dates<10){
        dates= '0'+dates;
      }

      if(month<10){
        month = '0'+month
      }
      if(date<10){
        date = '0'+date;
      }
      //reserv_start_date=new window.Date(year+'-'+month+'-'+date);//삼일전 날짜값.지정
      //reserv_start_dates=new window.Date(years+'-'+months+'-'+dates);//당일날 날짜값 지정.
      reserv_start_date=year+'-'+month+'-'+date;
      reserv_start_dates=years+'-'+months+'-'+dates;

      console.log('예약알림일로지정한 날짜값:',reserv_start_date,reserv_start_dates);
      //3일전 알림
      let noti_infoss={
        transaction_id : value.tour_id,//어떤 분양플젝트의 어떤 방문예약셋팅 tourid에 대한 신청인지txnid
        message : `==============신청하신 분양방문일 : ${getDateType(selectDate)} 3일전입니다!(${value.tour_id})`,
        noti_type : 'bunyang_visit_startday_reservealram_3days',
        noti_reserv_date : reserv_start_date,
        request_memid : userInfo.memid ? userInfo.memid : 1,
        action:"update",
        type:"private"
      }
      let noti_resss=await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(noti_infoss));
      if(noti_resss){
        if(noti_resss.success){
          console.log('noti_resultsss:',noti_resss);
        }else{
          alert('알람 발송 오류!');
        }
      }

      //당일 알림
      let noti_infosss={
        transaction_id : value.tour_id,
        message : `==========신청하신 분양방문일 : ${getDateType(selectDate)} 당일입니다!(${value.tour_id})`,
        noti_type: 'bunyang_visit_startday_reservealram',
        noti_reserv_date : reserv_start_dates,
        request_memid : userInfo.memid ? userInfo.memid : 1,
        action: "update",
        type:'private'
      }
      let noti_ressso=await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(noti_infosss));
      if(noti_ressso){
        if(noti_ressso.success){
          console.log('noti_resulstssL:',noti_ressso);
        }else{
          alert('알람 발송 오류!');
        }
      }
    }
    else{
      failInsertReservation();
    //  blockEvent = false;
    }
  }

   const successInsertReservation = () =>{
     setModalOption({
       show:true,
       setShow:offModal,
       title:"등록",
       content:{type:"text",text:`등록되었습니다.`,component:""},
       submit:{show:false , title:"" , event : ()=>{offModal(); }},
      cancle:{show:false , title:"" , event : ()=>{offModal(); }},
       confirm:{show:false , title:"확인" , event : ()=>{offModal();}},
       confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal(); }}
     });
   }

   const failInsertReservation = () =>{
     setModalOption({
       show:true,
       setShow:offModal,
       title:"등록",
       content:{type:"text",text:`등록되었습니다.`,component:""},
       submit:{show:false , title:"" , event : ()=>{offModal(); }},
       cancle:{show:false , title:"" , event : ()=>{offModal(); }},
       confirm:{show:false , title:"확인" , event : ()=>{offModal();}},
       confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal(); }}
     });
   }

  const pageLoader = () =>{
    switch (pageIndex) {
      case 0: return <ModalCalendarFirst changeMonth={changeMonth} tour={tour} holidayMap={holidayMap} selectDate={selectDate} setSelectDate={setSelectDate} setSelectTime={setSelectTime} updatePageIndex={updatePageIndex}/>;
      case 1: return <ModalCalendarSecond selectTime={selectTime} selectDate={selectDate} setSelectDate={setSelectDate} setSelectTime={setSelectTime} updatePageIndex={updatePageIndex} />
      case 2: return <ModalCalendarThird confimReservation={confimReservation} userList={userList} setUserList={setUserList}  updatePageIndex={updatePageIndex}/>
      default: return <ModalCalendarFirst selectDate={selectDate} setSelectDate={setSelectDate} updatePageIndex={updatePageIndex} />;
    }
  }
  const updatePageIndex = (index) =>{
    if(index == 0)
      setPageIndex(0);
    else if(index == 1)
      setPageIndex(1);
    else
      setPageIndex(index);
  }

  const changeMonth = async (date) =>{
    console.log('changemONTHSSS실행:::',date);
    let res = await serverController.connectFetchController(`/api/holiday?month=${date.getMonth() + 1}&year=${date.getFullYear()}`,'GET');
    if(res){
      if(res.data){
        console.log('현재달 res datassss:',res.data);
        let result = res.data.response.body.items.item;
        let map = holidayMap;
        if(result){

          if(result.locdate){
            map[parseInt(result.locdate.toString().slice(6,8))] = true;
          }
          else{
            result.map((value)=>{
              map[parseInt(value.locdate.toString().slice(6,8))] = true;
            })
          }
            
        }
        console.log('현재달의 휴일.......',map);

        setHolidayMap(map)
        setSelectDate(date);
      }        
    }
  }

  useEffect(()=>{
    console.log('분양모달수정창 로드된 시점에 실행 관련value값 해당값은 trid중개사가 신청한 하나의 방문예약신청내역이며 어떤 분양프로젝트bpid관련된 신청내역인지 추적:',value);

    if(!value.bp_id){
      return;
    }
    serverController.connectFetchController(`/api/bunyang/reservation/setting?bp_id=${value.bp_id}&tour_type=3&is_active=1`,'GET',null,function(res){
      if(res.success==1){
        console.log('분양모달상세 디테일상세 셋팅요일들::',res);
        setTour(res.data[0]);
      }
    });
  },[]);

    return (
      <Container>
        { 
          pageLoader()
        }
        {/* <ModalCommon modalOption={modalOption}/> */}
      </Container>
    );
}

const Container = styled.div`
  width:100%;

`
const Wrap = styled.div`
  width:100%;
`
const ModalBg = styled.div`
  position:fixed;
  width:100%;height:100%;left:0;top:0;
  display:block;content:'';background:rgba(0,0,0,0.05);
  z-index:1001;
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
