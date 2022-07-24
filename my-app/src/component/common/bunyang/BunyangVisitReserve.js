//react
import React ,{useState, useEffect} from 'react';

//style
import styled from "styled-components";

//components
import ModalCalendarFirst from "./ModalCalendarFirst";
import ModalCalendarSecond from "./ModalCalendarSecond";
import ModalCalendarThird from "./ModalCalendarThird";
import BunyangVisitReserveAll from './BunyangVisitReserveAll';

import serverController from '../../../server/serverController'
import ModalCommon from '../modal/ModalCommon';
import { useSelector } from 'react-redux';

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


export default function BunyangVisitReserve({bunyangDetail,cal, setCal}){
  const [value, onChange] = useState(new Date());
  const [pageIndex , setPageIndex] = useState(0);
  const [tour,setTour] = useState({});
  const userInfo = useSelector(e => e.login_user);

  
  const [SelectDate, setSelectDate] = useState(new Date());
  const [selectTime, setSelectTime] = useState(new Date());
  const [holidayMap, setHolidayMap] = useState({});

  const [checkedTime, setcheckedTime] = useState('');

  const [userList, setUserList] = useState([]);
  const [modalOption,setModalOption] = useState({show : false,setShow:null,link:"",title:"",submit:{},cancle:{},confirm:{},confirmgreennone:{},content:{}});

  useEffect(() => {  
    
    if(!bunyangDetail.bp_id)
      return;

    serverController.connectFetchController(`/api/bunyang/reservation/setting?bp_id=${bunyangDetail.bp_id}&tour_type=3&is_active=1`,'GET',null,function(res){
      if(res.success == 1){
        console.log('분양모달상세 디테일상세 셋팅 요일들:::',res);
        setTour(res.data[0]);
      }
    });
  }, [bunyangDetail])
  
  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = ()=>{
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  const finalModal= () =>{
    setModalOption({
      show:true,
      setShow:offModal,
      title:"등록",
      content:{type:"text",text:`이름과 이메일을 확인해주세요.`,component:""},
      submit:{show:false , title:"" , event : ()=>{offModal(); }},
      cancle:{show:false , title:"" , event : ()=>{offModal(); }},
      confirm:{show:false , title:"확인" , event : ()=>{offModal();}},
      confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal();}}
    });
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
      confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal();updatePageIndex(0)}}
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
      confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal();updatePageIndex(0)}}
    });
  }
  
  const failModal = () =>{
    setModalOption({
      show:true,
      setShow:offModal,
      title:"등록",
      content:{type:"text",text:`방문 예약이 불가능한 분양입니다.`},
      submit:{show:false , title:"적용" , event : ()=>{offModal(); }},
      cancle:{show:false , title:"초기화" , event : ()=>{offModal(); }},
      confirm:{show:false , title:"확인" , event : ()=>{offModal(); }},
      confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal(); updatePageIndex(0);}}
  });
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

  useEffect(() => { changeMonth(new Date()) }, [])


  let blockEvent = false;
  const confimReservation = () =>{
    console.log('confimReservaitonsss>>분양방문신청>>:',SelectDate,selectTime,getDateType(SelectDate) + " " + getDateTimeType(selectTime));
    if(!tour){
      failModal();
      return;
    }

    if(blockEvent){
      return;
    }
    blockEvent = true;

    let data = {
      tour_id : tour.tour_id,
      td_id : tour.td_id,//어떤tourid최근것 예약셋팅에 대해서 하는건지
      userList : userList,
      tr_name : userInfo.user_name ? userInfo.user_name : "프래프이름",
      tr_email : userInfo.email ? userInfo.email : "aid@prefinc.com",
      tr_phone : userInfo.phone ? userInfo.phone :"01000001234",
      mem_id : userInfo.memid ? userInfo.memid : 43,
      tr_type : 1,
      reserv_start_time : getDateType(SelectDate) + " " + getDateTimeType(selectTime),
      reserv_target_time : getDateType(SelectDate) + " " + getDateTimeType(selectTime),
      bp_id:bunyangDetail.bp_id,
      tr_group_id : new Date().getTime() + "" + tour.tour_id + userInfo.memid,
      company_id : userInfo.company_id ? userInfo.company_id : ""
    }
    console.log('send ressvation submit datasss:',data);

    serverController.connectFetchController(`/api/bunyang/reservation`,'POST',JSON.stringify(data),async function(res){
      if(res.success == 1){
        successInsertReservation();
        blockEvent = false;

        //방문예약신청완료가 다 되면, 신규접수되었다고 해당 분양프로젝트 bpid에 관련된 모든 분양대상인들에게 분양사팀원들에게 관련 알림을 보낸다. 해당 신청하는 분양방문셋팅 tourid,tdid(tour테이블) 에 관련해서 그 투어셋팅에 관련된 분양bpid를 구한다.
        let noti_infoee={
          tour_id : tour.tour_id,//투어아이디 따로 전달.
          transaction_id : tour.tour_id,//어떤 분양플젝트의 어떤 방문예약셋팅 tourid에 대한 신청인지txnid
          message : `==============${bunyangDetail.bp_name} 프로젝트 방문예약 신규접수되었습니다.\n\n 접수자:${userInfo.user_name}(${userInfo.phone})`,
          noti_type : 'bunyang_visit_new_registed',
        }
        let noti_infores=await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(noti_infoee));
        if(noti_infores){
          if(noti_infores.success){
            console.log('noti_resultsss:',noti_infores);
          }else{
            alert('알람 발송 오류!');
          }
        }

        //분양방문예약 접수신청성공시에 관련된 처리진행>> 분양방문예약 방문일 삼일전 알림
        console.log('예약접수신청 방문예약접수신청>>>:',SelectDate);
        let reserv_start_date= new window.Date(SelectDate);//신청날짜값 방문예약방문 신청대상날짜.
        let reserv_start_dates=new window.Date(SelectDate);//신청일당일.
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
          transaction_id : tour.tour_id,//어떤 분양플젝트의 어떤 방문예약셋팅 tourid에 대한 신청인지txnid
          message : `==============신청하신 분양방문일 : ${getDateType(SelectDate)} 3일전입니다!(${tour.tour_id})`,
          noti_type : 'bunyang_visit_startday_reservealram_3days',
          noti_reserv_date : reserv_start_date,
          request_memid : userInfo.memid ? userInfo.memid : 1,
          sosok_company_id : userInfo.company_id?userInfo.company_id : -1,
          action : 'insert'
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
          transaction_id : tour.tour_id,
          message : `==========신청하신 분양방문일 : ${getDateType(SelectDate)} 당일입니다!(${tour.tour_id})`,
          noti_type: 'bunyang_visit_startday_reservealram',
          noti_reserv_date : reserv_start_dates,
          request_memid : userInfo.memid ? userInfo.memid : 1,
          sosok_company_id : userInfo.company_id ? userInfo.company_id : -1,
          action: 'insert'
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
        blockEvent = false;
      }
    });
  }

  const updatePageIndex = (index) =>{
    if(index == 0)
      setPageIndex(0);
    else if(index == 1)
      setPageIndex(1);
    else
      setPageIndex(index);
  }

    return (
      <>
        <BunyangVisitReserveAll 
        holidayMap={holidayMap} 
        changeMonth={changeMonth}
        tour={tour}
        updatePageIndex={updatePageIndex}
        offModal={offModal}
        setModalOption={setModalOption}
        SelectDate={SelectDate}
        setSelectDate={setSelectDate}
        selectTime={selectTime}
        setSelectTime={setSelectTime}
        checkedTime={checkedTime}
        setcheckedTime={setcheckedTime}
        userList={userList}
        setUserList={setUserList}
        finalModal={finalModal}
        confimReservation={confimReservation}
        />
        {/* <ModalBg onClick={()=>{setCal(false)}}/>
        {
          pageLoader()
        }
        */}
        <ModalCommon modalOption={modalOption} /> 
      </>
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
