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
import { TtCon_MainMapSidePanel_Pos, TtCon_MainMapSidePanel_ModalPos } from '../../../theme';

// components
import { Mobile, PC } from "../../../MediaQuery";
import MainSideBarModal from './MainSideBarModal';
import SideBarItemDetail from './SideBarItemDetail';
import SideBarBrokerDetail from './SideBarBrokerDetail';
import SideBarDanjiDetail from './SideBarDanjiDetail';

// redux
import { MapProductEls, sidebarmodal } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

import ModalCommon from '../../../component/common/modal/ModalCommon';
import ModalReserve from '../../../component/member/mypage/reservation/ModalReserve';

//server process
import serverController from '../../../server/serverController';

export default function WrapSideBar({ containerRef, setReport,pageIndex,setPageIndex,reserveModal, status, setMap, setDangimap_data}) {
  // console.log('mainWrpasidebar실행>>>');
  //사이드 내 페이지 이동
  // const [pageIndex , setPageIndex] = useState(0);
  const [isvalid,setisvalid] = useState(false);
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
  const Sidebarmodal = useSelector(data => data.Sidebarmodal);//사이드바모달 wrap창.
  // console.log(productRedux.clickmarker);

  const loaderRef = useRef();

  //const [ismarkerclick,setIsmarkerclick] = useState(productRedux.clickmarker);
  
  // const containerRef = useRef();
  

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

  useEffect(() => {
    console.log(updown);
  }, [updown])
  
  const sendinfo_data={};
  const sendInfo_local = (selectDay,selectTimes,tourid,tourtype, td_id,company_id,isvalidss) => {
    console.log('sendinfo locasss:',isvalidss);
    if(!selectTimes || !tourid || !tourtype || !td_id || !company_id){
      //setisvalid(isvalid);
      sendinfo_data['isvalidss']=isvalidss;
      return false;
    }else{
      //setisvalid(isvalid);

      sendinfo_data['selectDay'] = selectDay;  //선택날짜값.어떤 날짜값 선택여부
      sendinfo_data['selectTimes'] = selectTimes.split('|')[0];  //선택한 시간대.tdid값. 임의 tourid리스트에 대해 할다오디어있는 tdid(시간대)
      sendinfo_data['tourid'] = tourid;  //투어아디(선택요일)
      sendinfo_data['tourtype'] = tourtype; //투어타입(일반,특별여부 추가타입)
      sendinfo_data['td_id']= td_id.split('|')[0];  //선택시간대 tdid값. tdid==selsectTimes(tdid)  
     // sendinfo_data['isvalidss']=isvalidss;

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
   
    switch (pageIndex) {
      case 0: return <MainSideBarModal status={status} setActiveIndex={setActiveIndex} activeIndex={activeIndex} updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} updown={updown} setUpDown={setUpDown} containerRef={containerRef}/>;
      case 1: return <SideBarItemDetail updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} setReport={setReport} updateReserveModal={updateReserveModals} click_prdidentityid={click_prdidentityid}/>; //물건 상세페이지
      case 2: return <SideBarBrokerDetail updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo}/>;//전문중개사 상세페이지
      case 3: return <SideBarDanjiDetail click_complexid={click_complexid} updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} setMap={setMap} setDangimap_data={setDangimap_data}/>;// 단지별 실거래 상세페이지
      default :return <MainSideBarModal status={status} setActiveIndex={setActiveIndex} activeIndex={activeIndex} updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} updown={updown} setUpDown={setUpDown} containerRef={containerRef}/>;
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
        content:{type:"component",text:`ㅂㅂㅂㅂㅂㅂㅂㅂㅂㅂ`,component:<ModalReserve isvalid={isvalid} setisvalid={setisvalid} sendInfo_local={sendInfo_local} company_id={company_id} setReservationId={setReservationId} except_datelist={except_datelist} result_usedatalist={result_usedatalist} />},
        submit:{show:false , title:"" , event : ()=>{offModal(); }},
        cancle:{show:false , title:"" , event : ()=>{offModal(); }},
        confirm:{show:true , title:"확인" , event : ()=> { 
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


  // 탭 변경 시 Event
  useEffect(() => {
    updatePageIndex(0);
  }, [mapRightRedux])

  
  console.log('Sidebarmodal상태값::',Sidebarmodal);
  if(Sidebarmodal.openstatus == 1){
    return (
    <Container pageIndex={pageIndex}
      updown={updown}
      //  position, overflow, top 왜있는지 모르겠습니다..
      position={position}
      overflow={overflow}
      top={top}
      
      ref={containerRef} className="sideBarWrap">
      
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
      </Container>
    );
  }else{
      return null;//wrap sidebar를 열고닫는 컨트롤.
  }
}

const Container = styled.div`
    ${TtCon_MainMapSidePanel_Pos}
    ${TtCon_MainMapSidePanel_ModalPos}
    float:none; z-index:9;
    position:absolute;
    top:0; right:0;
    box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
    background:#fff;
    overflow-y:scroll;
    content:'';
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {display: none;}

`

// const Container = styled.div`
//   background-color:white;
//   box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
//   position:absolute;
//   right:0;top:0;
//   width:400px;
//   height:100%;
//   background:#fff;
//   padding-bottom:120px;
//   overflow-y:scroll;
//   content:'';
//   scrollbar-width: none;
//   -ms-overflow-style: none;
//   &::-webkit-scrollbar {display: none;}
//   @media ${(props) => props.theme.mobile} {
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


