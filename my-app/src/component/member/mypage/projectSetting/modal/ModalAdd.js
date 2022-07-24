//react
import React ,{useState, useEffect, forwardRef} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components";
// import "../../react-datepicker.css";
import "../../../../../react-datepicker.css";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

//img
import ArrowDown from '../../../../../img/member/arrow_down.png';


//components
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

registerLocale("ko", ko); // 달력 한글화...

//지도 모달
export default function AddModal({  startDate, setStartDate, selectDate, setSelectDate  }) {
  const [active,setActive] = useState(false);

  const [tDate, setTdate] = useState(setHours(setMinutes(new Date(), 30), 16));
  const [sDate, setSdate] = useState(new Date());

  const [Interval, setInterval] = useState(10); //간격 값 저장


  const VisitTime = forwardRef(({ value, onClick }, ref) => (
    <MUTextField label="Time*" value={value} onClick={onClick} ref={ref}   
    InputProps={{
      endAdornment: <InputAdornment position="end"><AccessTimeIcon/></InputAdornment>,
    }}/>

  ));

  const MyContainer = ({ className, children }) => {
    console.log(children);
    return (
      <CalendarContainer className={className}>
        <div style={{ background: "#f0f0f0" }}>
          <p className="c-primary">※방송예정일자 선택하세요.</p>
        </div>
        <div style={{ position: "relative" }} className="clearfix">{children}</div>
        <div className="divider-a1" />
          <WrapTime className="flex-center-center par-spacing-2p5x0">
            <p className="mr-0p5 c-primary">※방송예정시각 선택하세요.</p>
            <DatePicker
              className="date_time_mobile"
              selected={sDate}
              onChange={(date) => {setSdate(date);setStartDate(date)}}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={Interval} //간격 설정
              timeCaption="Time"
              dateFormat="h:mm aa" // 시간 타입(보여주는)
              minTime={setHours(setMinutes(new Date(), 0), 0)} //시작 시간 세팅
              maxTime={setHours(setMinutes(new Date(), 0), 23)} // 종료 시간 세팅
              customInput={<VisitTime />}
              withPortal
            />
          </WrapTime>
      </CalendarContainer>
    );
  };

    return (
      <>
            <div className="par-spacing">
              <div className="par-indent-left">
                <div className="par-spacing">
                  <DatePicker
                  locale="ko"
                  selected={tDate}
                  calendarContainer={MyContainer}
                  onChange={(date) =>{setTdate(date);setSelectDate(date)}}
                  inline
                  dateFormat="yyyy.mm.dd(eee)"
                  />
                </div>
              </div>
            </div>
      </>
    );
}

const CalendarContainer = styled.div`
height:100%;
`
const MUButton = styled(Button)``
const MUTextField = styled(TextField)``
const MUTextField_100 = styled(MUTextField)`
        &.MuiFormControl-root.MuiTextField-root {
          width:100%;    
  }
        `


const WrapTime = styled.div`
  width:90%;
  margin: 0 auto;
`









