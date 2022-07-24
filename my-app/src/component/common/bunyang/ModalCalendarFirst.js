//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";

//style
import styled from "styled-components";
import "../../../react-datepicker.css";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

//img
// import CloseIcon from "../../../img/main/modal_close.png";
import Check from "../../../img/member/check.png";
import Checked from "../../../img/member/checked.png";

import ko from "date-fns/locale/ko";
registerLocale("ko", ko); // 달력 한글화...


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



export default function ModalCal({ holidayMap, changeMonth, tour,cal, setCal,updatePageIndex,SelectDate,setModalOption,offModal ,setSelectDate}){
  const [startDate, setStartDate] = useState(new Date());
  
  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <MUDialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MUDialogTitle>
    );
  };

  const Change = (date)=>{
    console.log('날짜 변경!!!:',date);
    if(!tour){
      setModalOption({
        show:true,
        setShow:offModal,
        title:"예약 불가능",
        content:{type:"text",text:`투어 예약이 불가능합니다.`},
        submit:{show:false , title:"적용" , event : ()=>{offModal(); }},
        cancle:{show:false , title:"초기화" , event : ()=>{offModal(); }},
        confirm:{show:false , title:"확인" , event : ()=>{offModal(); }},
        confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal();}}
      }); 
      
      return;
    }

   
    if(/*new Date().getMonth() == date.getMonth() &&*/  holidayMap[date.getDate()] && tour.is_tour_holiday_except){
      setModalOption({
        show:true,
        setShow:offModal,
        title:"예약 불가능",
        content:{type:"text",text:`공휴일에는 예약이 불가능합니다.`},
        submit:{show:false , title:"적용" , event : ()=>{offModal(); }},
        cancle:{show:false , title:"초기화" , event : ()=>{offModal(); }},
        confirm:{show:false , title:"확인" , event : ()=>{offModal(); }},
        confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal();}}
      }); 
      
      return;
    }


    let dayTitleArray = ["일","월","화","수","목","금","토"];
    let daysArray = [];
    tour.tour_set_days.split(',').map((value)=>{ daysArray.push(value == "true" ? true : false); })
    if(daysArray[date.getDay()] == true){
      console.log(date.getDay());
      console.log(daysArray);
      var str = "";
      for(var i =0;i<daysArray.length;i++){
        if(daysArray[i] == false){
          str += dayTitleArray[i]  + "요일 ";
        }
      }
      setModalOption({
        show:true,
        setShow:offModal,
        title:"예약 불가능",
        content:{type:"text",text:`${str}만 예약 가능합니다.`},
        submit:{show:false , title:"적용" , event : ()=>{offModal(); }},
        cancle:{show:false , title:"초기화" , event : ()=>{offModal(); }},
        confirm:{show:false , title:"확인" , event : ()=>{offModal(); }},
        confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal();}}
      });      
      return;
    }

    let startDate = new Date(tour.tour_start_date.split('.')[0].replace('T',' ').replace(/-/gi,'/'));
    let endDate = new Date(tour.tour_end_date.split('.')[0].replace('T',' ').replace(/-/gi,'/'));

    if(date.getTime() < startDate.getTime() ||
      date.getTime() > endDate.getTime()){
        setModalOption({
          show:true,
          setShow:offModal,
          title:"예약 불가능",
          content:{type:"text",text:`${getDateType(startDate)} ~ ${getDateType(endDate)} 사이의 시간에만 방문 예약이 가능합니다.`},
          submit:{show:false , title:"적용" , event : ()=>{offModal(); }},
          cancle:{show:false , title:"초기화" , event : ()=>{offModal(); }},
          confirm:{show:false , title:"확인" , event : ()=>{offModal(); }},
          confirmgreennone:{show:true , title:"확인" , event : ()=>{offModal();}}
        });
      // alert(getDateType(startDate) + " ~ " + getDateType(endDate) + " 사이의 시간에만 방문 예약이 가능합니다.");
      return;
    }
    else{
      updatePageIndex(1);
      setStartDate(date); 
      setSelectDate(date);
    }
  }

  const MyContainer = ({ className, children }) => {
    console.log(children);
    return (
      <div>
        <CalendarContainer className={className}>
          <div style={{ position: "relative"}}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };
  
  const monthChange = (date) =>{
    changeMonth(date);
  }

  const compareDate = (date) => {

    console.log('compareDate실행::',date,date.getDate(),date.getMonth(),new Date().getMonth());
    console.log('date getDate,getmonth',date.getDate(),date.getMonth());
    console.log('new date now month:',new Date().getMonth());
    //console.log('tour is tourholidayexcept:',tour.is_tour_holiday_except);

    if(date.getMonth() == new Date().getMonth() && new Date().getDate() == date.getDate())
      return "";

    if(!tour)
      return "random";

    
    let startDate = new Date(tour.tour_start_date.split('.')[0].replace('T',' ').replace(/-/gi,'/'));
    let endDate = new Date(tour.tour_end_date.split('.')[0].replace('T',' ').replace(/-/gi,'/'));
    let daysArray = [];
    tour.tour_set_days.split(',').map((value)=>{ daysArray.push(value == "true" ? true : false); })

    console.log(tour);
    /*if(new Date().getMonth() == date.getMonth() && holidayMap[date.getDate()] && tour.is_tour_holiday_except){
      return "random";
    }*/
    if(holidayMap[date.getDate()] && tour.is_tour_holiday_except){
      return "random";
    }
    else if(daysArray[date.getDay()] == true){
      return "random";
    }
    else if(date.getTime() < startDate.getTime() ||date.getTime() > endDate.getTime()){
      return "random";
    }
    return "";
  }

  useEffect(() => {
    console.log("===========")
  }, [SelectDate])

  if(cal == false)
    return null;
    return (
      <Container>
        <Dialog
          onClose={() => { setCal(false); updatePageIndex(0) }}
          open={cal}
          maxWidth={'sm'}
          fullWidth={true}
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { setCal(false); updatePageIndex(0) }}>
            방문 예약
          </BootstrapDialogTitle>

          {/* <MUDialogContent dividers> dividers : padding-top 과 같은 역할 */}
          <MUDialogContent >
            <Label>방문일시</Label>
            <DatePicker
              locale="ko"
              selected={SelectDate}
              calendarContainer={MyContainer}
              onChange={Change}
              onMonthChange={monthChange}
              inline
              choseDate={SelectDate}
              dayClassName={compareDate}
              dateFormat="yyyy.mm.dd(eee)"
            />
          </MUDialogContent>
        </Dialog>



        {/* <Wraplive>
          <ModalClose>
              <Link onClick={()=>{setCal(false);updatePageIndex(0)}}>
              <CloseImg src={CloseIcon}/>
            </Link>
          </ModalClose>
          <ModalTop>
            <Title>방문 예약</Title>
          </ModalTop>
          <Label>방문일시</Label>
          <DatePicker
            locale="ko"
            selected={SelectDate}
            calendarContainer={MyContainer}
            onChange={Change}
            onMonthChange={monthChange}
            inline
            choseDate={SelectDate}
            dayClassName={compareDate}
            dateFormat="yyyy.mm.dd(eee)"
          />
        </Wraplive>
         */}
      </Container>
    );
}

const MUDialogContent = styled(DialogContent)`
  width: 100%;
  height: 65vh;
  padding-right: 70px;
  padding-left: 70px;
`
const MUDialogTitle = styled(DialogTitle)`
  width: 80%;
  margin : 0 auto;
`

const Container = styled.div`
  width:100%;
`
const CalendarContainer  = styled.div`
height:100%;
`
const Wraplive = styled.div`
  position:fixed;z-index:3;
  width:535px;height:auto;
  background:#fff;
  border-radius:24px;
  border:1px solid #f2f2f2;
  left:50%;top:50%;transform:translate(-50%,-50%);
  padding:49px 49px 50px 63px;
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
const Label = styled.label`
  margin:10px 0;
  font-size:12px;display:inline-block;
  transform:skew(-0.1deg);font-weight:600;
  @media ${(props) => props.theme.modal} {
      font-size:calc(100vw*(12/428));
      margin-top:calc(100vw*(10/428));
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
    @media ${(props) => props.theme.modal} {
      height:calc(100vw*(60/428));
      line-height:calc(100vw*(54/428));
      font-size:calc(100vw*(15/428));
    }
`
