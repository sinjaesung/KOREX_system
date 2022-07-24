//react
import React ,{Component ,useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import Slider from "react-slick";

//css
import styled from "styled-components"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//img
import ArrowDown from '../../../../../img/member/arrow_down.png';

import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

//server process
import serverController from '../../../../../server/serverController';

export default function ModalMapReserve({r_tr_id,sendInfo_local,isvalid,setisvalid,sendInfo_local_starttime,sendInfo_local_endtime,except_datelist,result_usedatalist,reserve, setReserve }) {
  //시간 셀렉트박스
  const [timeSelect,setTimeSelect] = useState(false);
  const [selectDay,setSelectDay] = useState(null);
  const [timeList,setTimeList] = useState([]);
  const [tourid,setTourid] = useState('');
  const [tourtype,setTourtype] = useState('');
  const [selecttdid,setSelecttdid] = useState('');//선택한 tdid값 시간대 선택시 설정되게한다.
  
  var now_date=new window.Date();
  now_date.setHours(0);now_date.setMinutes(0);now_date.setSeconds(0);now_date.setMilliseconds(0);
  console.log('now_date hmmmsss:',now_date);

  const showSelect = ()=>{
    setTimeSelect(!timeSelect);
  }
  const [activeIndex,setActiveIndex] = useState(0);  //slick slider setting

  const [startTime, setStartTime] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [endTime, setEndTime] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [hour,sethour] = useState('');
  const [minute,setminute] = useState('');//선택한 시간,분값.

  const [Interval, setInterval] = useState(30); //간격 값 저장

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };

  console.log('===>>>modalEdit요소 물건투어예약수정 모달창 실행::(r_tr_id)',except_datelist,result_usedatalist,r_tr_id);
  
  //r_tr_id에 대한 신청정보 어떤 tour_id,td_id선택했었는지 여부 
  const [serverload_timelist,setServerload_timelist]= useState([]);
  const [serverload_tr_info,setServerload_tr_info]=useState({});

  useEffect( async () => {
    let body_info={
      tr_id_val : r_tr_id
    };
    let res=await serverController.connectFetchController('/api/broker/brokerProduct_reservationRegisterview','POST',JSON.stringify(body_info));

    if(res){
      console.log('server request resultss:',res);

      var result_data=res.result_data[0];
      var tr_info=result_data.tr_info;
      var tour_info=result_data.tour_info;//선택한 요일tourid값
      var td_info=result_data.td_info;//선택한tourid의 소속시간대tdinfo

      var td_detail_list=[];
      
      //tr_info['td_id']=tr_info.td_id;//해당 tr_Id신청내역이 어떤 td_id 시간대를 택한건지, tour_id어떤 날짜에 해당하는 tour_id를 택한건지 활성화한다.selected,checked한다.
      //tr_info['tour_id']=result_data[r].tour_id;
      //tr_info['reserv_start_time'] = result_data[r].reserv_start_time;
      //tr_info['reserv_end_time'] = result_data[r].reserv_end_time;
      //tr_info['r_tour_start_date']=result_data[r].t_tour_start_date;
      //tr_info['r_tour_type'] = result_data[r].t_tour_type;
      //tr_info['r_tour_reservDate'] = result_data[r].r_tour_reservDate;//투어예약일.

      //td_detail_list[r] = {};
      //td_detail_list[r]['td_id']=result_data[r].td_td_id;
      //td_detail_list[r]['td_text']=result_data[r].td_td_text;//어떤 디테일리스트 어떤tdid,td_text리스트인지 구한다.

      console.log('-->>>page load set reserv start,end times::',tr_info, tr_info['tour_reservDate'],tour_info, td_info, tr_info['reserv_start_time'],tr_info['reserv_end_time']);

      if(tour_info){
        //tourinfo가 존재해야 tdinfo도 존재하며 정보가 있을수있다.
        if(td_info){
          for(let s=0; s<td_info.length; s++){
            let item=td_info[s];
            let td_text=item['td_text'];
            
            if(td_text =='오전1T' || td_text=='오전 1T'){
              td_detail_list[s]={};
              td_detail_list[s]['td_text'] = td_text;
              td_detail_list[s]['td_starttime']='9:00am';
              td_detail_list[s]['td_endtime']='12:00pm';
            }else if(td_text == '오후1T' || td_text=='오후 1T'){
              td_detail_list[s]={};
              td_detail_list[s]['td_text'] = td_text;
              td_detail_list[s]['td_starttime']='12:00pm';
              td_detail_list[s]['td_endtime']='15:00pm';
            }else if(td_text == '오후2T' || td_text=='오후 2T'){
              td_detail_list[s]={};
              td_detail_list[s]['td_text'] = td_text;
              td_detail_list[s]['td_starttime']='15:00pm';
              td_detail_list[s]['td_endtime']='18:00pm';
            }
          }
          setServerload_timelist(td_detail_list);
        }
      }

     
      if(tr_info){
        setServerload_tr_info(tr_info);
      
        setSelectDay(tr_info['tour_reservDate']); setTourid(tr_info['tour_id']); setTourtype(tr_info['tour_type']); setSelecttdid(tr_info['td_id']);
        //초기값 state지정하고, seninfo_local정보 저장해놓는다.
        sendInfo_local(tr_info['tour_reservDate'],tr_info['td_id'],tr_info['tour_id'],tr_info['tour_type'],tr_info['td_id'],r_tr_id,tr_info['reserv_start_time'],tr_info['reserv_end_time']);

        if(tr_info['reserv_start_time'] && tr_info['reserv_end_time']){
          setStartTime(tr_info['reserv_start_time'].split(' ')[1]);
          setEndTime((tr_info['reserv_end_time'].split(' ')[1]));//시작 종료시간의 경우 최종적 저장에선 두개 같은 특정 시간값으로 되기에, 중개사가 지정하기 전에도 시작,종룟기간다른값인데 시작시간값으로 기준으로 되어있게끔한다.

          let reserv_start_time=tr_info['reserv_start_time'].split(' ')[1];
          let reserv_end_time=tr_info['reserv_end_time'].split(' ')[1];
          sendInfo_local_starttime(reserv_start_time); sendInfo_local_endtime(reserv_end_time);//조정 시작~종료시간대 serverload값 지정한다.
          //데이터가 있다면 rserv_start,endtiem데이터가있다면 날짜 이후에 시간 시작종료값 문자열 불러온다. startTime,endTime state에도 저장한다.
        }else{
          sendInfo_local_starttime('09:00:00'); sendInfo_local_endtime('09:00:00');
          //시작 종료시간값이 없다면 default더미형태 뎅이터로써 9시 압홉시로한다.
        }
      }
      
    }

  },[]);

  const change_dateEvent = async (date,setTimes,tour_id,tour_type,Selecttdidval,is_tour_holiday_except) => {
    console.log('선택날짜 선택index값:',date,setTimes,activeIndex,tour_id,tour_type,is_tour_holiday_except);

    let holi_res = await serverController.connectFetchController(`/api/holiday?month=${new window.Date(date).getMonth()+1}&year=${new window.Date(date).getFullYear()}`,'GET');
    var holi_map=[];
    if(holi_res){
      if(holi_res.data){
        console.log('res datsss:',holi_res);
        let holi_result=holi_res.data.response.body.items.item;

        if(holi_result){
          if(holi_result.locdate){
            holi_map.push(holi_result.locdate.toString().slide(6,8));
          }else{
            holi_result.map((value)=>{
              holi_map.push(value.locdate.toString().slice(6,8));
            })
          }
        }
        console.log('holidays mapssss:',holi_map);
      }
    }
    var isvalids;
    if(is_tour_holiday_except && holi_map.indexOf(String(new window.Date(date).getDate()))!=-1){
      alert('해당 날짜는 공휴일로 신청 불가합니다.');

      isvalids=false;
      //sendInfo_local(null,null,null,null,null,null,null,null,isvalids);
      sendInfo_local(null,null,null,null,null,null,null,isvalids);
      setisvalid(false);
    }else{
      isvalids=true;
      console.log('isvaliddss설정:',isvalids);

      setisvalid(true);
    }

    setSelectDay(date);
    setTourid(tour_id);
    setTourtype(tour_type);

    let body_info={
      tour_id_val : tour_id
    };
    let res=await serverController.connectFetchController('/api/broker/brokerProduct_tourid_tourdetailList','POST',JSON.stringify(body_info));
    console.log('server request result:',res);

    var tdDetail_list=[];

    if(res['result_data']){
      for(var ss=0; ss<res['result_data'].length; ss++){
        let result_data_item=res['result_data'][ss];
        tdDetail_list[ss] ={};
        tdDetail_list[ss]['td_text'] = result_data_item['td_text'];
        
        var tdDetail_starttime_val; var tdDetail_endtime_val;
        if(tdDetail_list[ss]['td_text'] == '오전 1T' || tdDetail_list[ss]['td_text']=='오전1T'){
          tdDetail_starttime_val = '9:00am';
          tdDetail_endtime_val = '12:00pm';
        }else if(tdDetail_list[ss]['td_text'] == '오후 1T' || tdDetail_list[ss]['td_text'] == '오후1T'){
          tdDetail_starttime_val = '12:00pm';
          tdDetail_endtime_val = '15:00pm';
        }else if(tdDetail_list[ss]['td_text'] == '오후 2T' || tdDetail_list[ss]['td_text'] == '오후2T'){
          tdDetail_starttime_val = '15:00pm';
          tdDetail_endtime_val = '18:00pm';
        }
        tdDetail_list[ss]['tour_id'] = result_data_item['tour_id'];
        tdDetail_list[ss]['td_id'] = result_data_item['td_id'];//몇번 timeDetail인지.
        tdDetail_list[ss]['td_starttime'] = tdDetail_starttime_val;
        tdDetail_list[ss]['td_endtime'] = tdDetail_endtime_val;
  
        setTimes = result_data_item['td_id'];//해당 선택한날짜에 관련된tdid디테일시간대들 값중 아무거나로 해서 tdid임의지정해서 저장처리한다.딱히 그중에서 어떤걸 택하고 한것은 아니기에 임의의 마지막것 하나로 한다.
        Selecttdidval = result_data_item['td_id'];
      }
    }
    
    console.log('==>>>>tdDetail_list:',tdDetail_list);
    setServerload_timelist(tdDetail_list); //초기 불러온 정보가 있고 임의 tr에 선택된 tour_id,td_id가 있고, 그 tour_id에 있는 tdDetaillist가 불려와져있다.그중에서 td_id에 해당하는 것이 selected,checekd되어있게 한다.  

    console.log('==>>>dateChange날짜 변경 이벤트 발생:',date,setTimes,tour_id,tour_type,Selecttdidval,r_tr_id);
    sendInfo_local(date,setTimes,tour_id,tour_type,Selecttdidval,r_tr_id,tdDetail_list[tdDetail_list.length-1]['td_starttime'],tdDetail_list[tdDetail_list.length-1]['td_endtime'],isvalids);//시간대 선택하여 state설정되어있는 td_id값이 있다면 보내고 없다면 ''이 갈것임. 초기값은 서버로드 값으로 무조건 처리해준다.
    
  };

  if(reserve == false)
    return null;
    return (
        <Container>
          <WrapModalMap>
              <WrapTourDate>
                <TourTitle>투어일시 r_tr_id:{r_tr_id} / 선택날짜,시간대 {selectDay} / {serverload_tr_info['reserv_start_time']}~{serverload_tr_info['reserv_end_time']}</TourTitle>
                  <Slider {...settings} className="about">
                    {
                      result_usedatalist.map((value,index) => {
                        //console.log('==>>>>serverload_tr_info view:',serverload_tr_info,value);

                        var from_now;
                        var value_datetime = new Date(value['date']);
                        if(value_datetime.getTime() >= now_date.getTime()){
                          from_now = true;
                        }else{
                          from_now = false;
                        }

                        if(serverload_tr_info['r_tour_id']==value['tour_id']){
                          //console.log('서버로드 tr_info 선택 날짜 tour_id날짜값:',serverload_tr_info['r_tour_id'],value['tour_id']);
                        }
                        if(!value['isexcepted'] && from_now == true){
                          return(
                            <SlickSlide className='slide__one'>
                              <Link>
                                <WrapDateItem>
                                  <DateItem serverload_active={serverload_tr_info['tour_reservDate']==value['date']} active={activeIndex == index} onClick={() => {change_dateEvent(value['date'],selecttdid,value['tour_id'],value['tour_type'],selecttdid,value['is_tour_holiday_except']);
                                  setActiveIndex(index);}}>
                                    <Day>{value['date_yoil']}({value['tour_type']=='1'?'일반':'특별'})</Day>
                                    <DateDay>{value['date_day']}</DateDay>
                                  </DateItem>
                                </WrapDateItem>
                              </Link>
                            </SlickSlide>
                          )
                        }
                      })
                    }
                    {/*<SlickSlide className="slide__one">
                      <Link>
                        <WrapDateItem>
                          <DateItem active={activeIndex == 0} onClick={()=>{setActiveIndex(0)}}>
                            <Day>금</Day>
                            <DateDay>22</DateDay>
                          </DateItem>
                        </WrapDateItem>
                      </Link>
                    </SlickSlide>
                    <SlickSlide className="slide__one">
                      <Link>
                        <WrapDateItem>
                          <DateItem active={activeIndex == 1} onClick={()=>{setActiveIndex(1)}}>
                            <Day>토</Day>
                            <DateDay>23</DateDay>
                          </DateItem>
                        </WrapDateItem>
                      </Link>
                    </SlickSlide>
                    <SlickSlide className="slide__one">
                      <Link>
                        <WrapDateItem>
                          <DateItem active={activeIndex == 2} onClick={()=>{setActiveIndex(2)}}>
                            <Day>일</Day>
                            <DateDay>24</DateDay>
                          </DateItem>
                        </WrapDateItem>
                      </Link>
                    </SlickSlide>
                    <SlickSlide className="slide__one">
                      <Link>
                        <WrapDateItem>
                          <DateItem active={activeIndex == 3} onClick={()=>{setActiveIndex(3)}}>
                            <Day>월</Day>
                            <DateDay>25</DateDay>
                          </DateItem>
                        </WrapDateItem>
                      </Link>
                    </SlickSlide>
                    <SlickSlide className="slide__one">
                      <Link>
                        <WrapDateItem>
                          <DateItem active={activeIndex == 4} onClick={()=>{setActiveIndex(4)}}>
                            <Day>화</Day>
                            <DateDay>26</DateDay>
                          </DateItem>
                        </WrapDateItem>
                      </Link>
                    </SlickSlide>
                    <SlickSlide className="slide__one">
                      <Link>
                        <WrapDateItem>
                          <DateItem active={activeIndex == 5} onClick={()=>{setActiveIndex(5)}}>
                            <Day>수</Day>
                            <DateDay>27</DateDay>
                          </DateItem>
                        </WrapDateItem>
                      </Link>
                    </SlickSlide>
                    */}
                  </Slider>
                </WrapTourDate>
                <FilterBox>
                  <FilterSelectSort onChange={(e)=>{
                    console.log('==>>>시간대 선택변화 중요 데이터 지정여부>>>');
                    console.log('>>>selecdtaday(선택날짜):',selectDay);
                    console.log('>>>timelist(선택시간대들):',serverload_timelist);
                    console.log('>>>tourid,tourtype:',tourid,tourtype);
                    console.log('>>>선택시간대(td_id):',e.target.value);
                    console.log('>>>유효여부::',isvalid);

                    setSelecttdid(e.target.value);//선택tdid값 지정한다. 

                    sendInfo_local(selectDay,e.target.value,tourid,tourtype,e.target.value,r_tr_id,e.target.value.split('|')[1].split('~')[0],e.target.value.split('|')[1].split('~')[1]);
                    setTimeSelect(e.target.value);
                  }}>
                    <FilterSelectSortList>
                      <InOption disabled>시간을 선택해주세요.</InOption>
                      {
                        serverload_timelist.map((value)=> {
                          console.log('serverload_timelist value:',value);
                          return <InOption value={value['td_id']+'|'+value['td_starttime']+'~'+value['td_endtime']} selected={serverload_tr_info['td_id']==value['td_id']}>{value['td_text']} ({value['td_starttime']}~{value['td_endtime']})</InOption>
                        })
                      }
                    </FilterSelectSortList>
                  </FilterSelectSort>
                </FilterBox>
                <FilterBox>
                  <FilterSelectSort>
                     <FilterSelectShort onChange={(e)=>{
                       console.log('>>>>시간대에 중개사 조율하여 지정하는 정확한 시간값(시값):',e.target.value);
                       console.log('>>>선택날짜::',selectDay);
                       console.log('>>>>선택시간대들:',serverload_timelist);
                       console.log('>>>tourid,tourtype::',tourid,tourtype);
                       console.log('>>>선택시간대(td_id)::',e.target.value);
                       console.log('선택시간값,분값::',hour,minute);
                       sethour(e.target.value);

                       console.log('시,분 선택에 따른 현재시간분 확정시간값::',e.target.value+':'+minute);
                       if(e.target.value !='' && minute!=''){
                         sendInfo_local_starttime(e.target.value+':'+minute+':00');
                         sendInfo_local_endtime(e.target.value+':'+minute+':00');
                       }
                     }}>
                      <InOption disabled>시</InOption>
                      
                      <InOption selected={startTime.split&&startTime.split(':')[0]=='09'?true:false} value='09'>9시</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[0]=='10'?true:false} value='10'>10시</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[0]=='11'?true:false} value='11'>11시</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[0]=='12'?true:false} value='12'>12시</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[0]=='13'?true:false} value='13'>13시</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[0]=='14'?true:false}value='14'>14시</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[0]=='15'?true:false}value='15'>15시</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[0]=='16'?true:false}value='16'>16시</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[0]=='17'?true:false}value='17'>17시</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[0]=='18'?true:false}value='18'>18시</InOption>
                     
                    </FilterSelectShort>
                    <FilterSelectShort onChange={(e)=>{
                      console.log('===>>>시간대에 중개사가 조율하여 지정하는 정확한 시간값(분값):',e.target.value);
                      console.log('>>>선택날짜::',selectDay);
                      console.log('>>>>선택시간대들:',serverload_timelist);
                      console.log('>>>tourid,tourtype::',tourid,tourtype);
                      console.log('>>>선택시간대(td_id)::',e.target.value);
                      console.log('선택시간값,분값::',hour,minute);
                      setminute(e.target.value);//선택시간설정
                      
                      console.log('시,분 선택에 따른 현재 시간,분 확정시간값::',hour+':'+e.target.value);
                      if(e.target.value!='' && hour!=''){
                        sendInfo_local_starttime(hour+':'+e.target.value+':00');//선택시간 09,10,11,....18:00,05,10,15,,,,55:00 이런식 simple문자열 연결 concat
                        sendInfo_local_endtime(hour+':'+e.target.value+':00');//선택시간 선택한 시간분으로 start,endtiem같은것으로 지정.
                      } 
                      
                    }}>
                      <InOption disabled selected>분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('00')!=-1?true:false} value='00'>00분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('05')!=-1?true:false} value='05'>05분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('10')!=-1?true:false} value='10'>10분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('15')!=-1?true:false}  value='15'>15분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('20')!=-1?true:false}  value='20'>20분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('25')!=-1?true:false}  value='25'>25분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('30')!=-1?true:false}  value='30'>30분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('35')!=-1?true:false}  value='35'>35분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('40')!=-1?true:false}  value='40'>40분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('45')!=-1?true:false}  value='45'>45분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('50')!=-1?true:false}  value='50'>50분</InOption>
                      <InOption selected={startTime.split&&startTime.split(':')[1].indexOf('55')!=-1?true:false}  value='55'>55분</InOption>
                    </FilterSelectShort>
              {/*<Time>
                  <DatePicker className="date_time"
                    selected={startTime}
                    onChange={(time) => {
                       setStartTime(time); console.log('선택날짜, 시작시간대 설정 변경:',selectDay,time,new Date(time)); 
                       let select_date= selectDay;
                       let select_time_val=new Date(time);
                       let hour_val = select_time_val.getHours();
                       let minute_val = select_time_val.getMinutes();
                       if(hour_val < 10){
                         hour_val = '0'+hour_val;//01,02,03,...09,10,11,12
                       }
                       if(minute_val < 10){
                         minute_val ='0'+minute_val;//01,02,03,...09,10,11,12,15,54
                       }
                       
                       let second_val = '00';
                       let select_start_time_val = hour_val+":"+minute_val+":"+second_val;
                       console.log('make select_start_time_val',select_start_time_val);
                       sendInfo_local_starttime(select_start_time_val);
                      
                      }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={Interval} //간격 설정
                    timeCaption="Time"
                    dateFormat="h:mm aa" // 시간 타입(보여주는)
                    minTime={setHours(setMinutes(new Date(), 0), 0)} //시작 시간 세팅
                    maxTime={setHours(setMinutes(new Date(), 0), 23)} // 종료 시간 세팅
                  />
                </Time>*/}
             {/*<Time>
                  <DatePicker className="date_time"
                    selected={endTime}
                    onChange={(time) => { 
                      setEndTime(time); console.log('종료시간대 설정 변경:',time,new Date(time));
                      let select_date=selectDay;
                      let select_time_val = new Date(time);
                      let hour_val = select_time_val.getHours();
                      let minute_val = select_time_val.getMinutes();
                      if(hour_val < 10){
                        hour_val = '0'+hour_val;
                      }
                      if(minute_val < 10){
                        minute_val = '0'+minute_val;
                      }

                      let second_val='00';
                      let select_end_time_val = hour_val+':'+minute_val+':'+second_val;
                      console.log('make select_end_time_val:',select_end_time_val);

                      sendInfo_local_endtime(select_end_time_val);
  
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={Interval} //간격 설정
                    timeCaption="Time"
                    dateFormat="h:mm aa" // 시간 타입(보여주는)
                    minTime={setHours(setMinutes(new Date(), 0), 0)} //시작 시간 세팅
                    maxTime={setHours(setMinutes(new Date(), 0), 23)} // 종료 시간 세팅
                  />
                </Time> */}
                  </FilterSelectSort>
                </FilterBox>
          </WrapModalMap>
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
    width:100%;
`

const WrapModalMap = styled.div`
  width:100%;
`
const ModalMapBg = styled.div`
  width:100%;height:100%;
  position:fixed;left:0;top:0;
  background:rgba(0,0,0,0.2);
  display:block;content:'';
  z-index:2;
`
const ModalMap = styled.div`
  position:absolute;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:535px;border-radius:24px;
  border:1px solid #f2f2f2;
  background:#fff;
  padding:49px 50px 60px 50px;
  z-index:3;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(395/428));
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`
const MapCloseBtn = styled.div`
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const MapCloseImg = styled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(12/428));
  }
`
const ModalMapTitle = styled.h3`
  font-size:20px;font-weight:800;color:#707070;
  transform:skew(-0.1deg);
  padding-bottom:20px;
  border-bottom:1px solid #707070;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    padding-bottom:calc(100vw*(15/428));
  }
`
const WrapTourDate = styled.div`
  width:100%;
`
const TourTitle = styled.div`
  margin:12px 0 8px;
  font-size:12px;color:#4a4a4a;
  font-family:'nbg',sans-serif;
  @media ${(props) => props.theme.modal} {
    margin:calc(100vw*(14/428)) calc(100vw*(9/428));
    font-size:calc(100vw*(12/428));
  }
`
const SwiperBennerWrap = styled.div`
  width:100%;
`

const SlickSlide = styled.div`

  `
const WrapDateItem = styled.div`
`
const DateItem = styled.div`
  width:59px;height:59px;
  border-radius:4px;border:1px solid #e4e4e4;
  text-align:center;
  padding:10px 0;
  border:${({active}) => active ? "1px solid #707070" : "1px solid #e4e4e4"};
  background-color: ${({serverload_active}) => serverload_active ? '#dfdfdf' : 'transparent'};
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(53/428));
    height:calc(100vw*(53/428));
    padding:calc(100vw*(10/428)) 0;
  }


`
const Day = styled.h4`
  font-size:12px;
  font-weight:800;transform:skew(-0.1deg);
  color:#979797;
  margin-bottom:5px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(9/428));
    margin-bottom:calc(100vw*(5/428));
  }
`
const DateDay = styled(Day)`
  color:#4a4a4a;
  margin-bottom:0;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
  }
`
const FilterBox = styled.div`
  position:relative;
  width:100%;
  margin:40px 0;
  @media ${(props) => props.theme.modal} {
    margin:calc(100vw*(40/428)) 0;
  }
`
const FilterLabel = styled.label`
  display:inline-block;
  font-size:12px;color:#4a4a4a;
  transform:skew(-0.1deg);
  font-family:'nbg', sans-serif;
  margin-bottom:9px;
  padding-left:3px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(9/428));
    font-size:calc(100vw*(12/428));
    padding-left:calc(100vw*(3/428));
  }
`
const FilterSelectSort = styled.div`
  width:100%;
  display:flex;justify-content:space-between;align-items:center;
`
const Time = styled.div`
  width:210px;height:43px;position:relative;z-index:2;
  text-align:center;font-size:15px;transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(170/428));
    font-size:calc(100vw*(15/428));
    height:calc(100vw*(43/428));
  }
`
const FilterSelectSortList = styled.select`
  width:100%;
  height:43px;
  text-align-last:center;
  font-size:15px;color:#4a4a4a;transform:skew(-0.1deg);
  border-radius:4px;border:1px solid #e4e4e4;
  background:#fff;
  appearance:none;
  background:url(${ArrowDown}) no-repeat 90% center;background-size:11px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    height:calc(100vw*(43/428));
    background:url(${ArrowDown}) no-repeat 90% center;background-size:calc(100vw*(11/428));
  }
`
const FilterSelectShort = styled(FilterSelectSortList)`
  width:210px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(170/428));
  }
`
const Option = styled.option`
  font-family:'nbg',sans-serif;

`
const InOption = styled(Option)`
  padding:8px 0;
  background:#fff;
  &:hover{background:#f8f7f7;}
  @media ${(props) => props.theme.modal} {
    padding:calc(100vw*(8/428)) 0;
  }
`
