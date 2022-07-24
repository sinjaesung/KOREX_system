//react
import React ,{useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import NavIcon from '../../../img/main/nav_btn.png';
import Logo from '../../../img/main/header_logo.png';
import PCLogo from '../../../img/main/pc_header_logo.png';
import Mypage from '../../../img/main/mypage_icon.png';
import ScrollLoader  from '../../../img/map/scrollLoader.gif';
import ScrollLoader2  from '../../../img/map/scrollLoader2.gif';
//theme
import { TtCon_MainMapSidePanel_Pos } from '../../../theme';

// components
import { Mobile, PC } from "../../../MediaQuery";
import MainSideBar from './MainSideBar';
import SideBarItemDetail from './SideBarItemDetail';
import SideBarBrokerDetail from './SideBarBrokerDetail';
import SideBarDanjiDetail from './SideBarDanjiDetail';

// redux
import { MapProductEls } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

import ModalCommon from '../../../component/common/modal/ModalCommon';
import ModalReserve from '../../../component/member/mypage/reservation/ModalReserve';

//server process
import serverController from '../../../server/serverController';

import ChannelServiceElement from '../../common/ChannelServiceElement';

export default function WrapSideBar({  containerRef,setReport,pageIndex,setPageIndex,reserveModal, status, setMap, setDangimap_data}) {
  console.log('mainWrapsidebar 실행>>:');
  console.log('ChannelSercvieElement map/sidebarsss changess executes:',ChannelServiceElement,ChannelServiceElement.shutdown);//변화 페이지 도달시마다 기존 상담채널톡 요소 지운다.>>
  ChannelServiceElement.shutdown();

  // console.log('mainWrpasidebar실행>>>');
  //사이드 내 페이지 이동
  // const [pageIndex , setPageIndex] = useState(0);
  const [isvalid,setisvalid]=useState(false);

  const [historyInfo , setHistoryInfo] = useState({pageIndex:1,prevTab:"",prevIndex:[]});
  const [updown,setUpDown] = useState(false);
  const [click_prdidentityid,setClick_prdidentityid] = useState('');//클릭한 매물 아이디이(상세매물위함)
  const [click_complexid, setClick_complexid] = useState('');//클릭한 단지 아이디(상세단지정보위함->단지정보 단지 실거래정보)

  const [reservationId,setReservationId] = useState({id:0 ,text:""});
 
  const [activeIndex,setActiveIndex] = useState(0);//어떤 형태가 tab된건지 0:전문중개사,전속매물,단지별실거래 여부.

  const productRedux = useSelector(state=>{ return state.mapProductEls});
  const mapRightRedux = useSelector(state=>{ return state.mapRight});
  const login_userinfo= useSelector(data => data.login_user);
  const mapFilterRedux = useSelector(state=>{ return state.mapFilter});
  // console.log(productRedux.clickmarker);

  const loaderRef = useRef();

  //const [ismarkerclick,setIsmarkerclick] = useState(productRedux.clickmarker);
  
   const scrollRef = useRef();
  
  const position=()=>{
    if(updown == true) {
      return "absolute"
    }else{
      return "relative"
    }
  }
  const overflow=()=>{
    if(updown == true) {
      return "scroll"
    }else{
      return "hidden"
    }
  }
  const top=()=>{
    if(updown == true) {
      if(mapRightRedux.isExclusive.is){
        return "calc(100vw*(59/428));"
      }else{
        return "calc(100vw*(0/428));"
      }
    }else{
      return "calc(100vw*(-122/428));"
    }
  }

   console.log('페이지실행>>>?/:',isvalid);
  useEffect(() => {
    console.log(updown);
  }, [updown])
  
  const sendinfo_data={};
  const sendInfo_local = (selectDay,selectTimes,tourid,tourtype, td_id,company_id,isvalidss) => {
    console.log('sendinfo localssss:',isvalidss);
    if(!selectTimes || !tourid || !tourtype || !td_id || !company_id){
      //setisvalid(isvalidss);
      sendinfo_data['isvalidss']=isvalidss;
      return false;
    }else{
      //console.log(isvalidss);
      //setisvalid(isvalidss);

      sendinfo_data['selectDay'] = selectDay;  //선택날짜값.어떤 날짜값 선택여부
      sendinfo_data['selectTimes'] = selectTimes.split('|')[0];  //선택한 시간대.tdid값. 임의 tourid리스트에 대해 할다오디어있는 tdid(시간대)
      sendinfo_data['tourid'] = tourid;  //투어아디(선택요일)
      sendinfo_data['tourtype'] = tourtype; //투어타입(일반,특별여부 추가타입)
      sendinfo_data['td_id']= td_id.split('|')[0];  //선택시간대 tdid값. tdid==selsectTimes(tdid)  
      //sendinfo_data['isvalidss']=isvalidss;
      let starttime=selectTimes.split('|')[1].split('~')[0];
      let endtime=selectTimes.split('|')[1].split('~')[1];
      if(starttime=='09:00am'){
        sendinfo_data['reserv_start_time']=selectDay+' 09:00:00';
      }else if(starttime=='12:00pm' ){
        sendinfo_data['reserv_start_time']=selectDay+' 12:00:00';
      }else if(starttime=='15:00pm'){
        sendinfo_data['reserv_start_time']=selectDay+' 15:00:00';
      }else if(starttime=='18:00pm'){
        sendinfo_data['reserv_start_time']=selectDay+' 18:00:00';
      }
      if(endtime=='09:00am'){
        sendinfo_data['reserv_end_time']=selectDay+' 09:00:00';
      }else if(endtime=='12:00pm' ){
        sendinfo_data['reserv_end_time']=selectDay+' 12:00:00';
      }else if(endtime=='15:00pm'){
        sendinfo_data['reserv_end_time']=selectDay+' 15:00:00';
      }else if(endtime=='18:00pm'){
        sendinfo_data['reserv_end_time']=selectDay+' 18:00:00';
      }
      sendinfo_data['company_id'] = company_id;//선택매물담당 선임중개사사업체id
      console.log('senfInfo_local정보 확인 먼저 저장여부>>>>:',sendinfo_data);

    } 
  }
  
  useEffect(()=>{
    console.log('is valid traksccssiong:',isvalid);
  },[isvalid]);

  const pageLoader = (updateReserveModals) =>{
    console.log('pageIndex pageLoasderss:',pageIndex);

    switch (pageIndex) {
      case 0: return <MainSideBar scrollRef={scrollRef} onScrollList={onScrollList} status={status} setActiveIndex={setActiveIndex} activeIndex={activeIndex} updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} updown={updown} setUpDown={setUpDown} containerRef={containerRef}/>;
      case 1: return <SideBarItemDetail updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} setReport={setReport} updateReserveModal={updateReserveModals} click_prdidentityid={click_prdidentityid}/>; //물건 상세페이지
      case 2: return <SideBarBrokerDetail updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo}/>;//전문중개사 상세페이지
      case 3: return <SideBarDanjiDetail click_complexid={click_complexid} pageIndex={pageIndex} updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} setMap={setMap} setDangimap_data={setDangimap_data}/>;// 단지별 실거래 상세페이지
      default :return <MainSideBar  scrollRef={scrollRef}containerRef={containerRef} onScrollList={onScrollList}  status={status} setActiveIndex={setActiveIndex} activeIndex={activeIndex} updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} updown={updown} setUpDown={setUpDown}/>;
    }
  }
  const updatePageIndex = (index,id) =>{
    if(index < 0){
      setPageIndex(0);
    }
    else if(index == 1){
      setPageIndex(1);
      setClick_prdidentityid(id); //클릭한 prd_idnentity매물아디값 mainWrapsidebar state상태값으로 관리.
    }
    else if(index == 2){
      setPageIndex(2);
    }
    else if(index == 3){
      setPageIndex(3);
      setClick_complexid(id);
    }
    else{
      setPageIndex(index);
    }
  }

  //물건 투어예약 모달창 
  const [reserve,setReserve] = useState(false);
  
  const [modalOption,setModalOption] = useState({show: false,setShow: null, link:'',title:'',submit:{},cancle:{},confirm:{},confirmgreen:{},content:{}});

  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show =false;
    setModalOption(option);
  }

  const clickReservation = async () =>{
    // console.log('reservationId(선택한 방문예약셋팅날짜):',sendinfo_data);
    
    offModal();
    
    if(sendinfo_data.selectDay  && sendinfo_data.selectTimes && sendinfo_data.tourid && sendinfo_data.tourtype && sendinfo_data.td_id){
      if(login_userinfo.is_login){
        let body_info= {
          selectdate : sendinfo_data.selectDay, //선택날짜값(노출 요일에 따른 매칭연결 날짜들)
          selectTime: sendinfo_data.selectTimes, //선택날짜(tourid:요일)에 연결되어있는 선택시간대tdid
          slectTourid : sendinfo_data.tourid, //tourid
          selectTourtype : sendinfo_data.tourtype,  //tourtype
          selectTdid: sendinfo_data.td_id, //tdid
          reserv_start_time : sendinfo_data.reserv_start_time,
          reserv_end_time : sendinfo_data.reserv_end_time,
          phone: login_userinfo.phone, 
          email: login_userinfo.email,
          user_name : login_userinfo.user_name,
          user_type : login_userinfo.user_type,
          prd_identity_id: click_prdidentityid,
          request_user_selectsosokid: login_userinfo.company_id//로그인한 유저의 신청자의 선택되어져저장되어있던 소속id값 어떤 소속으로 선택되어있는지 어떤소속업체상태에서 어떤중개사에 어떤 매물에 신청했었던건지 남기기위함.그 각 특정tr_id는 TourReservation 하나당 어떤 소속의 신청자가 신청했던건지 여부. 개인이 신청했다면...null값이 갈테고, user_type에서 개인이라면 따로 저장처리하지않음.null로저장.
        };
        //해당 선택날짜/선택한 시간대, 해당 날짜에 대한 tourId(예약방)에 어떤시간대(자리:요일그룹별,특수추가요일),어떤 방(일반,특별추가)에 요청한건지 구분키위함.
        // console.log('JSON_BODY>>>:',JSON.stringify(body_info));
        let res= await serverController.connectFetchController('/api/broker/brokerProduct_tourReservation_register','POST',JSON.stringify(body_info));
        if(res){
          // console.log('====>>>res::',res);

          if(res.success){
            alert('예약접수완료!');
            let result_data=res.result_data;//결과 데이터 얻음. 접수완료 결과 데이터 어떤tr_id에 대한 새로 생성되었으며, 참조.
            let trid=result_data.insertid;
            let reserv_date=result_data.reservdate;
            console.log('접수id값 tourReservation tr_id값::',result_data);
            let date_format=new window.Date(reserv_date);
            date_format=date_format.getTime()-(1*24*60*60*1000);//하루전 타임스탬값.
            date_format=new window.Date(date_format);//다시 date형태.
            let year=date_format.getFullYear();
            let month=date_format.getMonth()+1;
            let date=date_format.getDate();//년월일 구함.
            if(month<10){
              month = '0'+month;
            }
            if(date<10){
              date='0'+date;
            }
            reserv_date=new window.Date(year+'-'+month+'-'+date);
            console.log('예약알림일로 지정할 날짜값:',reserv_date);

            //접수가 완료디면 그 예약하려고했던 매물을 담당하고있던 .companyid에게 알림가한다.
            let noti_info = {
              prd_identity_id : click_prdidentityid,//어떤 매물관련된 투어예약접수인지
              //tour_reserve_memid : login_userinfo.mem_id,
              message : click_prdidentityid+'해당 매물에 대한 물건투어예약접수 신규접수되었습니다.\n [접수자 정보]:'+login_userinfo.user_name+'('+login_userinfo.phone+')'+login_userinfo.email,
              company_id : sendinfo_data.company_id,
              noti_type : 9 //물건투어예약신규접수.
            }
            console.log('send notifino::',noti_info);
            let noti_res = await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(noti_info));
            if(noti_res){
              if(noti_res.success){
                console.log('noti_resss :',noti_res);
              }else{
                alert(noti_res.message);
              }
            }
            //관련 중개사에게 신규접수되었다고 하는 알림도 하지만, 자기자신(개인이면 자기자신한명,기업이면 소속 팀원들모든 memid들에게) 예약알림(특정예약날짜조건일에 display표현) 저장처리하는것도 필요함.(투어예약 일일전 알림) 최초insert.
            let noti_info2={
              tour_reserv_id : trid,
              noti_reserv_date : reserv_date,//투어일로 지정한 날짜 하루전의날짜값.
              message :click_prdidentityid+'해당 매물에 대한 물건투어예약 방문예정일 1일전입니다,\n [접수자정보]:'+login_userinfo.user_name+'('+login_userinfo.phone+')'+login_userinfo.email,
              request_mem_id : login_userinfo.memid,//어떤 접수자memid에서 신청한건지 여부 
              request_user_selectsosokid: login_userinfo.company_id,//생성자or개인회원이라면 company_id가 고정값개념, 팀원이라고한다면 이 companyid값등이 null이되거나 바뀔수도 있음(로직상)
              noti_type: 11,//물건투어예약 투어예약 일일전 예약발송.
              action:'insert'
            }
            let noti_res2=await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(noti_info2));
            if(noti_res2){
              if(noti_res2.success){
                console.log('noti resusslsltss:',noti_res2);
              }else{
                alert(noti_res2.message);
              }
            }
          }else{
            alert('접수에 문제가 있습니다.');
          }
        }
      }else{
        alert('로그인이 필요한 서비스입니다.');
      }
    }else{
      alert('입력값이 비어있습니다!');
    }
  }

  const updateReserveModal = (except_datelist,result_usedatalist,company_id) =>{
    // console.log('updateReservemodal 예약모달창띄우기 >>> 건내받은 해당 매물의 관련 제외/최종표현 dateList:',except_datelist,result_usedatalist,company_id);
    setModalOption({
        show:true,
        setShow:offModal,
        title:"투어예약 진행",
        content:{type:"component",text:`ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`,component:<ModalReserve isvalid={isvalid} setisvalid={setisvalid} sendInfo_local={sendInfo_local} company_id={company_id} setReservationId={setReservationId} except_datelist={except_datelist} result_usedatalist={result_usedatalist}/>},
        submit:{show:false , title:"" , event : ()=>{offModal(); }},
        cancle:{show:false , title:"" , event : ()=>{offModal(); }},
        confirm:{show:true , title:"확인" , event : ()=> { 
          //alert(isvalid);
          alert(sendinfo_data['isvalidss']);
          if(sendinfo_data['isvalidss']==false){
            alert('공휴일제외 설정인 날짜엔 신청불가합니다.');
            return false;
          }
          clickReservation() 
        } }
    });
  }
  
  //필터상태 관련.
  // 전세 텍스트
  const jeonseTextfunc = (num) => {
    let text="";
    switch(num){
      case 1:text = "500000"; break;
      case 2:text = "1000000"; break;
      case 3:text = "2000000"; break;
      case 4:text = "3000000"; break;
      case 5:text = "5000000"; break;
      case 6:text = "10000000"; break;
      case 7:text = "20000000"; break;
      case 8: text = "30000000"; break;
      case 9:text = "40000000"; break;
      case 10:text = "50000000"; break;
      case 11:text = "60000000"; break;
      case 12:text = "70000000"; break;
      case 13:text = "80000000"; break;
      case 14:text = "90000000"; break;
      case 15:text = "100000000"; break;
      case 16:text = "120000000"; break;
      case 17:text = "150000000"; break;
      case 18:text = "170000000"; break;
      case 19:text = "200000000"; break;
      case 20:text = "250000000"; break;
      case 21:text = "300000000"; break;
      case 22:text = "350000000"; break;
      case 23:text = "400000000"; break;
      case 24:text = "500000000"; break;
      case 25:text = "700000000"; break;
      case 26:text = "1000000000"; break;
      case 27:text = "1200000000"; break;
      case 28:text = "1500000000"; break;
      case 29:text = "2000000000"; break;
    }
    return(text);
  }

  // 월세 텍스트
  const monthlyTextfunc = (num) => {
    let text="";
    switch(num){
      case 1:text = "50000"; break;
      case 2:text = "100000"; break;
      case 3:text = "200000"; break;
      case 4:text = "250000"; break;
      case 5:text = "300000"; break;
      case 6:text = "350000"; break;
      case 7:text = "400000"; break;
      case 8: text = "500000"; break;
      case 9:text = "600000"; break;
      case 10:text = "700000"; break;
      case 11:text = "1000000"; break;
      case 12:text = "1500000"; break;
      case 13:text = "2000000"; break;
      case 14:text = "2500000"; break;
      case 15:text = "3000000"; break;
      case 16:text = "4000000"; break;
      case 17:text = "5000000"; break;
    }
    return(text);
  }

  // 무한 스크롤
  // **api 서버에서 데이터 가져와서 배열에 추가하여야 합니다.
  const onScrollList = async () => {
     console.log('====>>onScorllList함수실행>>>');
     console.log('===>>currsent.scrollheight,scrolltop,.clientheight:',scrollRef.current.scrollHeight,scrollRef.current.scrollTop,scrollRef.current.clientHeight);

    if(scrollRef.current.scrollHeight <= scrollRef.current.scrollTop+scrollRef.current.clientHeight + 50){
      // 전속 매물 || 전문 중개사 상세--------------
      if(pageIndex == 0){

        console.log('activeIndex값::',activeIndex);
        
        if(activeIndex == 0){
          //전속매물 active상태라면 전속매물에 대해서만 처리.
          if(mapRightRedux.isExclusive.is){
            const currentArr = JSON.parse(JSON.stringify(productRedux.exclusive));
            //현재 상태 불려와져있는 전속매물 currentarr exclusive데이터수를 구한다.그 현재의 위치의 다음인댁스에 해당하는거 한개 불러오려면 현재 물량개수는 곧 다음index값이기도함.
            console.log('mapRight전속매물 active상태, 전속매물데이터 onscroll 요청::',status);
            console.log('현재 currentArr:',currentArr,currentArr.length);//스크롤이 발생할 당시에 mapData가 있는가??mapdata가 없는(idle한번도 안하고, 검색해서만 들어온경우도 있을수있음, 이경우는 searchdata origin좌표를 보냄.)  서버에 보낼것, 1.어떤 데이터조회(전문중개사,전속매물,단지) 2. 각 데이터에서 현재길이 상태 3.searchdata or mapdata로 인한 현재보여지는 화면상 지도의 중심좌표.  매번 결과를 가져오면,currentArr데이터배열(사이드바데이터덩어리)를 다시 리덕스에 실제 반영한다.
            
            loaderRef.current.style.display='flex';
            var scrollevent_server_async_request= async function(){
              
              let searchdetail_origindata = JSON.parse(localStorage.getItem("searchdetail_origin"));
              let mapData = JSON.parse(localStorage.getItem("mapData"));
              console.log('scrollevent에 따른 서버 비동기요청 전속매물>>',searchdetail_origindata,mapData, currentArr);//보통 페이지로드 이후 searchdetail데이터는 사라짐.
              
              if(mapData){
                //첫로드(새로고침,검색에의한)시에도 mapData 저장합니다.
              }else{
                
                console.log('mapData가 없다면 조회하지 않습니다.');

                return false;
              }

              var reduxFilter = mapFilterRedux.filterUI;
              var reduxTextFilter = mapFilterRedux.filterArr;
              //if(!mapData){return};
              let type = 1;
              let roomTextArr = [];
              let isPark = 1;
              let isPet = 0;
              if(status == "apart"){
                type = 1
              }else if(status == "officetel"){
                type = 2
              }else if(status == "store" ){
                type = 3
              }else if(status == "office"){
                type = 4
              }

              if(reduxTextFilter.room=="전체"){
                  roomTextArr=null;
              }else{
                for(let i = 0 ; i < reduxTextFilter.room.length ; i++){
                  roomTextArr.push(reduxTextFilter.room[i]);
                }
              }
              if(status == "officetel"){
                isPark=reduxFilter.parkOfficetel;
              }else if(status == "store" || status == "office"){
                isPark=reduxFilter.parkStore;
              }else{
                isPark=null;
              }

              var send_info = {
                prdType:type, // 건물 타입 1-아파트, 2-오피스텔, 3-상가, 4-사무실
                prdSelType:reduxFilter.prd_sel_type, // 거래 유형 1-매매, 2-전세, 3-월세 

                tradePriceMin:reduxFilter.priceRangeValue[0]==0?null:reduxFilter.priceRangeValue[0]*10000000, // 매매 최소
                tradePriceMax:reduxFilter.priceRangeValue[1]==100?null:reduxFilter.priceRangeValue[1]*10000000, // 매매 최대
                jeonsePriceMin:reduxFilter.jeonseRangeValue[0]==0?null:jeonseTextfunc(reduxFilter.jeonseRangeValue[0]), // 전세금(보증금) 최소
                jeonsePriceMax:reduxFilter.jeonseRangeValue[1]==30?null:jeonseTextfunc(reduxFilter.jeonseRangeValue[1]), // 전세금(보증금) 최대
                monthPriceMin:reduxFilter.monthlyRangeValue[0]==0?null:monthlyTextfunc(reduxFilter.monthlyRangeValue[0]), // 월세 최소
                monthPriceMax:reduxFilter.monthlyRangeValue[1]==18?null:monthlyTextfunc(reduxFilter.monthlyRangeValue[1]), // 월세 최대
                supplySpaceMin:reduxFilter.areaRangeValue[0]==0?null:reduxFilter.areaRangeValue[0], // 공급면적 최소
                supplySpaceMax:reduxFilter.areaRangeValue[1]==100?null:reduxFilter.areaRangeValue[1], // 공급면적 최대
                managementPriceMin:reduxFilter.manaRangeValue[0]==0?null:reduxFilter.manaRangeValue[0] * 10000,
                managementPriceMax:reduxFilter.manaRangeValue[1]==75?null:reduxFilter.manaRangeValue[1] * 10000,
                

                floor: reduxFilter.floor=="0"?null:Number(reduxFilter.floor)+1, // 층수
                roomCount:reduxFilter.roomApart=="0"?null:Number(reduxFilter.roomApart)+1, // 방수
                bathCount:reduxFilter.bath=="0"?null:Number(reduxFilter.bath)+1, // 욕실수
                isParking:isPark==0?null:isPark, // 전용주차장 여부 1->있음,  0->없음
                isToilet:status !== "officetel" && status !== "apart"? reduxFilter.toilet:null, // 전용 화장실 여부 1->있음,  0->없음
                isManagement:reduxFilter.manaStatus==0?null:reduxFilter.manaStatus, // 관리비 여부 1->있음,  0->없음
                totalHousehold:reduxFilter.danji=="0"?null:Number(reduxFilter.danji)+1, // 총세대수 1-> 전체, 2 -> 200세대이상, 3 -> 500세대이상, 4 -> 1000세대이상, 5 -> 2000세대이상
                prdUsage:reduxFilter.purpose=="0"?null:Number(reduxFilter.purpose)+1, // 용도 1->전체, 2-> 주거용, 3-> 업무용
                roomStructure:roomTextArr, // 오픈형원룸, 분리형원룸, 원룸원거실, 투룸, 쓰리룸이상
                isDouble:reduxFilter.double=="0"?null:reduxFilter.double, // 복층 2-> 복층,  1->단층

                isPet:status == "officetel"? reduxFilter.pet=="0"?null:Number(reduxFilter.pet) : null, // 반려동물 여부 1->있음,  0->없음 ㅠㅠㅠㅠ
                
                acceptUseDate:reduxFilter.use=="0"?null:Number(reduxFilter.use)+1, // 2-> 5년이내, 3->10년이내, 4-> 20년이내, 5->20년이상

                zido_level:mapData.level,//지도레벨
                origin_x:mapData.lng,//지도중심좌표
                origin_y:mapData.lat,//지도중심좌표
                screen_width:window.innerWidth,//화면크기
                screen_height:window.innerHeight,
                startx: mapData.sw.La,
                starty: mapData.sw.Ma,
                endx : mapData.ne.La,
                endy : mapData.ne.Ma,
                prd_type:status,

                currentArr_val : JSON.stringify(currentArr),
                mem_id:login_userinfo.memid ? login_userinfo.memid : 0

              }
              //매물타입,매물관련 필터정보,맵데이터 현재 화면상 맵데이터조건+매물타입&매물관련필터조건 모두 만족하는 현재 화면상에 보여지는 매물들 정보리스트 불러온다.관련 전체 매물리스트가 있을것이고, 현재 inserteed updated되어있는 관련 매물리스트가 있고 이들을 서버에서 대조하여 관련 작업 진행한다.
                            
              let exculsive_data_more = await serverController.connectFetchController("/api/matterial/nextExclusive_item_sidebar",'POST',JSON.stringify(send_info));
              console.log('===>>exculisve_data_more result::',exculsive_data_more);//single one item.
    
              return exculsive_data_more;
            };
            var await_data_get = await scrollevent_server_async_request();
            console.log('await data getss::전속매물>>',await_data_get);
            
            if(await_data_get.success){
              if(await_data_get.result){
                
                currentArr.push(await_data_get.result);//얻은 데이터 한개.
                MapProductEls.updateExclusive({ exclusive : currentArr });
                
              }else{
                console.log('======>>더이상 추가할만한 전속매물data가 없습니다.');
              }
            }else{
              console.log('======>>더이상 추가할만한 전속매물data가없습니다.');
            }
            loaderRef.current.style.display='none';
          }
        }
        else if(activeIndex == 1){
          //전문중개사 active된 상태라면 전문중개사 데이터만 요청한다.
          // 전문 중개사--------------
          if(mapRightRedux.isProbroker.is){
            const currentArr = JSON.parse(JSON.stringify(productRedux.probroker));
            //현재 상태 불려와져있는 전속매물 currentarr exclusive데이터수를 구한다.그 현재의 위치의 다음인댁스에 해당하는거 한개 불러오려면 현재 물량개수는 곧 다음index값이기도함.
            console.log('mapRight전문중개사 active상태, 전문중개사데이터 onscroll 요청::');
            console.log('현재 currentArr:',currentArr,currentArr.length,JSON.stringify(currentArr));//스크롤이 발생할 당시에 mapData가 있는가??mapdata가 없는(idle한번도 안하고, 검색해서만 들어온경우도 있을수있음, 이경우는 searchdata origin좌표를 보냄.)  서버에 보낼것, 1.어떤 데이터조회(전문중개사,전속매물,단지) 2. 각 데이터에서 현재길이 상태 3.searchdata or mapdata로 인한 현재보여지는 화면상 지도의 중심좌표.  매번 결과를 가져오면,currentArr데이터배열(사이드바데이터덩어리)를 다시 리덕스에 실제 반영한다.
            
            loaderRef.current.style.display='flex';
            var scrollevent_server_async_request= async function(){
              
              let searchdetail_origindata = JSON.parse(localStorage.getItem("searchdetail_origin"));
              let mapData = JSON.parse(localStorage.getItem("mapData"));
              console.log('scrollevent에 따른 서버 비동기요청 전문중개사>>',searchdetail_origindata,mapData);//보통 페이지로드 이후 searchdetail데이터는 사라짐.
    
             //맵데이터가 있어야 조회하고,현재 지도환경상태, 매물타입이나 필터 데이터는 없다.
              if(mapData){
                var send_info = {
                  currentArr_val : JSON.stringify(currentArr),
                  level : mapData.level, //mapdata있었던 지도현재화면 상의 레벨
                  origin_x : mapData.lng,
                  origin_y : mapData.lat,//지도중심좌표
                  screen_width : window.innerWidth,//화면크기
                  screen_height : window.innerHeight,
                  startx: mapData.sw.La,
                  starty: mapData.sw.Ma,
                  endx : mapData.ne.La,
                  endy : mapData.ne.Ma,
                }
                console.log('sendinfo::',send_info);
              }else{
                console.log('====>>mapData가없다면 조회하지 않습니다!!!!(전문중개사)=-========');
                return;
              }
              
              let probroker_data_more = await serverController.connectFetchController("/api/matterial/nextProbroker_item_sidebar",'POST',JSON.stringify(send_info));
              console.log('===>>probroker_data_more result::',probroker_data_more);
    
              return probroker_data_more;
            };
            var await_data_get = await scrollevent_server_async_request();
            console.log('await data gets::전문중개사>>',await_data_get);
            
            if(await_data_get.success){
              if(await_data_get.result){
                
                currentArr.push(await_data_get.result);//얻은 데이터 한개.전문중개사 one more singleitem한개
                MapProductEls.updateProbroker({ probroker : currentArr });
                
              }else{
                console.log('더이상 불러올 전문중개사 moredata가 없습니다.==================');
              }
            }else{
              console.log('더이상 불러울 전문중개사 moredata가 없습니다.====================');
            }
            loaderRef.current.style.display='none';
            /*currentArr.push({
              broker_id : 1,
              path:"/",
              tag2:"새아파트·현대아이리스",
              tag3:"상가",
              tag4:"사무실",
              name:"럭키 공인중개사 New",
              address:"강남구 논현동 104-5",
              sell_kind1:2,
              sell_kind2:7,
              sell_kind3:9,
            })
            MapProductEls.updateProbroker({ probroker : currentArr });*/
          }
        }
        else if(activeIndex == 2){
          // 단지별 실거래
          //단지별 실거래 active상태라면 단지별실거래데이터만 요청한다.
          if(mapRightRedux.isBlock.is){
            const currentArr = JSON.parse(JSON.stringify(productRedux.block));
            //현재 상태 불려와져있는 전속매물 currentarr exclusive데이터수를 구한다.그 현재의 위치의 다음인댁스에 해당하는거 한개 불러오려면 현재 물량개수는 곧 다음index값이기도함.
            console.log('mapRight단지별실거래 active상태, 단지데이터 onscroll 요청::');
            console.log('현재 currentArr:',currentArr,currentArr.length);//스크롤이 발생할 당시에 mapData가 있는가??mapdata가 없는(idle한번도 안하고, 검색해서만 들어온경우도 있을수있음, 이경우는 searchdata origin좌표를 보냄.)  서버에 보낼것, 1.어떤 데이터조회(전문중개사,전속매물,단지) 2. 각 데이터에서 현재길이 상태 3.searchdata or mapdata로 인한 현재보여지는 화면상 지도의 중심좌표.  매번 결과를 가져오면,currentArr데이터배열(사이드바데이터덩어리)를 다시 리덕스에 실제 반영한다.
            
            //console.log('====>>loader',loaderRef);
            loaderRef.current.style.display='flex';
            var scrollevent_server_async_request= async function(){
              
              let searchdetail_origindata = JSON.parse(localStorage.getItem("searchdetail_origin"));
              let mapData = JSON.parse(localStorage.getItem("mapData"));
              console.log('scrollevent에 따른 서버 비동기요청 단지별실거래>>',searchdetail_origindata,mapData);//보통 페이지로드 이후 searchdetail데이터는 사라짐.
    
              if(mapData){
                var send_info = {
                  currentArr_val : JSON.stringify(currentArr),
                  level : mapData.level, //mapdata있었던 지도현재화면 상의 레벨
                  lat : mapData.lat,
                  lng : mapData.lng,
                  screen_width : window.innerWidth,//화면크기
                  screen_height : window.innerHeight,
                  startx: mapData.sw.La,
                  starty: mapData.sw.Ma,
                  endx : mapData.ne.La,
                  endy : mapData.ne.Ma
                }
              }else{
                console.log('====>>mapData가없다면 조회하지 않습니다!!!!(단지별실거래)=-========');
                return;
              }
              
              let complex_data_more = await serverController.connectFetchController("/api/matterial/nextComplex_item_sidebar",'POST',JSON.stringify(send_info));
              console.log('===>>complex_data_more result::',complex_data_more);
    
              return complex_data_more;
            };
            var await_data_get = await scrollevent_server_async_request();
            console.log('await data gets::단지별실거래>>',await_data_get);
            
            if(await_data_get.success){
              if(await_data_get.result){ 
                currentArr.push(await_data_get.result);//얻은 데이터 한개.
                MapProductEls.updateBlock({ block : currentArr });                
              }else{
                console.log('===>>>더이상 불러올 단지별실거래moredata없습니다.================');
              }
            }else{
              console.log('===>>>더이상 불러올 단지별실거래moredata없습니다.================');
            }
            loaderRef.current.style.display='none';
            /*currentArr.push({
              danji_id : 0,
              path:"/",
              title:`골든카운티 New`,
              address:"서울특별시 강남구 삼성동 200-13",
              date:"21.02.01",
              price:"매매 3억5,000",
              floor:"7층",
            })
            MapProductEls.updateBlock({ block : currentArr });*/
          }
        }
      }
     
      console.log("end");
    }
  }

  // 탭 변경 시 Event
  useEffect(() => {
    console.log('mapRightredux변경시에 왜>>>:',mapRightRedux);
    updatePageIndex(0);
  }, [mapRightRedux])
  

    return (
    <Container pageIndex={pageIndex}
      updown={updown}
      //  position, overflow, top 왜있는지 모르겠습니다..
      position={position}
      overflow={overflow}
      top={top}
      ref={containerRef}
       className="sideBarWrap" >
        {
          pageLoader(updateReserveModal)
        }
        {/*
          productRedux.clickmarker.isclick? 
          <ClickMarkerClustSidebar setReport={setReport} updown={updown} setUpDown={setUpDown} containerRef={containerRef} status={productRedux.clickmarker.click_type}></ClickMarkerClustSidebar>
          :
          null
          */
        }
        <ModalCommon modalOption={modalOption}/>
        <ScrollLazyLoad ref={loaderRef}>
           <Img src={ScrollLoader2}/>
        </ScrollLazyLoad>
      </Container>
  );
}

const Container = styled.div`
    ${TtCon_MainMapSidePanel_Pos}
    box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
    background:#fff;
    overflow-y:scroll;
    content:'';
    scrollbar-width: none;
    -ms-overflow-style: none; z-index:9;
    &::-webkit-scrollbar {display: none;}

`
// const Container = styled.div` 
//   position:absolute;
//   right:0;top:0;
//   width:400px;
//   height:100%;
//   padding-bottom:120px;

//   box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
//   background:#fff;
//   overflow-y:scroll;
//   content:'';
//   scrollbar-width: none;
//   -ms-overflow-style: none;
//   &::-webkit-scrollbar {display: none;}


//   @media ${(props) => props.theme.breakpoints.sm} {
//     width:100%;
//     position: absolute;
//     bottom:0;
//     top: unset;
//     transition: 500ms;
//     padding: 0;
    
//     ${({updown})=>{
//     return updown?
//     `
//       height:calc(100vh - calc(100vw*(140/428)));
//     `
//     :
//     `
//       height:calc(100vw*(60/428));
//       overflow:hidden;  
//     `
//     }}
//   }
// `


const ScrollLazyLoad = styled.div`
  position:fixed; width:400px;height:100px; bottom:0;right:0; 
  display:flex;flex-flow:row wrap;justify-content:center;align-items:center; display:none;
`;
const Img = styled.img`
  display:block; width:80px;height:80px;
`;