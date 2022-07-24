//react
import React, { useState, useEffect, forwardRef } from 'react';
import { Link } from "react-router-dom";

//style
import styled from "styled-components";
import "../../../react-datepicker.css";

//theme
import { TtCon_1col_input } from '../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClearIcon from '@mui/icons-material/Clear';

//components
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

registerLocale("ko", ko); // 달력 한글화...

function checkZero(checkString) {
  return checkString.toString().length == 1 ? "0" + checkString : checkString;
}

function getDateType(date) {
  console.log('date whatsss??what:',date,new Date(date));
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
  return temp;
}

function getDateTimeType(date) {
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getHours())}:${checkZero(date.getMinutes())}:00`;
  return temp;
}

export default function BunyangVisitReserveAll
  ({ holidayMap, changeMonth, tour, updatePageIndex, SelectDate, setModalOption, offModal, setSelectDate, setSelectTime, selectTime, setcheckedTime, finalModal, userList, setUserList, checkedTime, confimReservation }) {

  const Change = (date) => {
    console.log('날짜 변경!!!:', date,tour);
    if (!tour) {
      setModalOption({
        show: true,
        setShow: offModal,
        title: "예약 불가능",
        content: { type: "text", text: `투어 예약이 불가능합니다.` },
        submit: { show: false, title: "적용", event: () => { offModal(); } },
        cancle: { show: false, title: "초기화", event: () => { offModal(); } },
        confirm: { show: false, title: "확인", event: () => { offModal(); } },
        confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }
      });

      return;
    }
    console.log('holidayMAP:',holidayMap,date.getDate(),holidayMap[date.getDate()],tour.is_tour_holiday_except);

    if ( holidayMap[date.getDate()] && tour.is_tour_holiday_except) {
      setModalOption({
        show: true,
        setShow: offModal,
        title: "예약 불가능",
        content: { type: "text", text: `공휴일에는 예약이 불가능합니다.` },
        submit: { show: false, title: "적용", event: () => { offModal(); } },
        cancle: { show: false, title: "초기화", event: () => { offModal(); } },
        confirm: { show: false, title: "확인", event: () => { offModal(); } },
        confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }
      });

      return;
    }

    let dayTitleArray = ["일", "월", "화", "수", "목", "금", "토"];
    let daysArray = [];
    tour.tour_set_days.split(',').map((value) => { daysArray.push(value == "true" ? true : false); });
    if (daysArray[date.getDay()] == true) {
      console.log(date.getDay());
      console.log(daysArray);
      var str = "";
      for (var i = 0; i < daysArray.length; i++) {
        if (daysArray[i] == false) {
          str += dayTitleArray[i] + "요일 ";
        }
      }
      setModalOption({
        show: true,
        setShow: offModal,
        title: "예약 불가능",
        content: { type: "text", text: `${str}만 예약 가능합니다.` },
        submit: { show: false, title: "적용", event: () => { offModal(); } },
        cancle: { show: false, title: "초기화", event: () => { offModal(); } },
        confirm: { show: false, title: "확인", event: () => { offModal(); } },
        confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }
      });
      return;
    }

    let startDate = new Date(tour.tour_start_date.split('.')[0].replace('T', ' ').replace(/-/gi, '/'));
    let endDate = new Date(tour.tour_end_date.split('.')[0].replace('T', ' ').replace(/-/gi, '/'));

    if (date.getTime() < startDate.getTime() ||
      date.getTime() > endDate.getTime()) {
      setModalOption({
        show: true,
        setShow: offModal,
        title: "예약 불가능",
        content: { type: "text", text: `${getDateType(startDate)} ~ ${getDateType(endDate)} 사이의 시간에만 방문 예약이 가능합니다.` },
        submit: { show: false, title: "적용", event: () => { offModal(); } },
        cancle: { show: false, title: "초기화", event: () => { offModal(); } },
        confirm: { show: false, title: "확인", event: () => { offModal(); } },
        confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }
      });
      // alert(getDateType(startDate) + " ~ " + getDateType(endDate) + " 사이의 시간에만 방문 예약이 가능합니다.");
      return;
    }
    else {
      updatePageIndex(1);
      setStartDate(date);
      setSelectDate(date);
    }
  }

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
          <p className="c-primary">※방문일자 선택하세요.</p>
        </div>
        <div style={{ position: "relative" }} className="clearfix">{children}</div>
        <div className="divider-a1" />
          <WrapTime className="flex-center-center par-spacing-2p5x0">
            <p className="mr-0p5 c-primray">※방문시각 선택하세요.</p>
            <DatePicker
              className="date_time_mobile"
              selected={selectTime}
              onChange={(date) => { setSelectTime(date); }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={tour.time_distance} //간격 설정
              timeCaption="Time"
              dateFormat="h:mm aa" // 시간 타입(보여주는)
              minDate={new Date(2021,9,22)}
              maxDate={new Date(2021,11,16)}
              minTime={new Date(getDateType(new Date()) + " " + tour.td_starttime)} //시작 시간 세팅
              maxTime={new Date(getDateType(new Date()) + " " + tour.td_endtime)} // 종료 시간 세팅
              customInput={<VisitTime />}
              withPortal
            />
          </WrapTime>
      </CalendarContainer>
    );
  };

  const monthChange = (date) => {
    changeMonth(date);
  }

  //--------------------------------@@

  //@@ ModalCalendarSecond.js------------------
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [SelectedDay, setSelectedDay] = useState("일")

  useEffect(() => {

    // 선택하지않고 바로 지나갔을경우를 대비하여 초기값을 넣었습니다.
    setSelectTime(setHours(setMinutes(new Date(), 30), 16))

    switch (SelectDate.getDay()) {
      case 0:
        setSelectedDay("일")
        break;
      case 1:
        setSelectedDay("월")
        break;
      case 2:
        setSelectedDay("화")
        break;
      case 3:
        setSelectedDay("수")
        break;
      case 4:
        setSelectedDay("목")
        break;
      case 5:
        setSelectedDay("금")
        break;
      default:
        setSelectedDay("토")
        break;
    }

  }, [SelectDate])
  //--------------------------------@@

  useEffect(()=>{
    console.log('페이지 로드 시점 관련 참조:',tour);

    //setTourstartdate(tour.tour_start_date);
    //setTourenddate(tour.tour_end_date);
    console.log('tour start datesss:',getDateType(new Date(tour.tour_start_date)));
    console.log('tour end datesss:',getDateType(new Date(tour.tour_end_date)));
  },[]);

  //@@ ModalCalendarThird.js------------------
  const [Name, setName] = useState("");
  const [Phone, setPhone] = useState("");/*기본값*/
  const [Num, setNum] = useState(0);

  const phoneChange = (e) => {
    const regex = /[^0-9\b]+$/;
    if (!regex.test(e.target.value)) {
      setPhone(e.target.value);
    }
    else
      setPhone("");
  }
  const nameChange = (e) => {
    const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/; //문자입력만 받기
    if (regex.test(e.target.value)) {
      setName(e.target.value);
    }
    else
      setName("");
  }

  //동반고객 리스트 작성...
  const Add = () => {
    if (Name !== "" && Phone !== "") {
      if (userList.find(obj => obj.phone === Phone)) { // 현재 등록된 전화번호와 겹칠 때
        setModalOption({
          show: true,
          setShow: offModal,
          title: "중복",
          content: { type: "text", text: `중복된 전화번호가 있습니다.` },
          submit: { show: false, title: "적용", event: () => { offModal(); } },
          cancle: { show: false, title: "초기화", event: () => { offModal(); } },
          confirm: { show: false, title: "확인", event: () => { offModal(); } },
          confirmgreennone: { show: true, title: "확인", event: () => { offModal(); } }
        });
        return;
      } else {
        setUserList([
          ...userList,
          { name: Name, phone: Phone, num: Num }
        ]);
        setName('');
        setPhone('');
        setNum(Num + 1);
      }
    } else {
      finalModal()
    }
  }

  const onRemove = item => {
    setNum(Num - 1);
    setUserList(userList.filter(user => user.num !== item.num));
  }
  //---------------------------------@@

  return (
    <>
      <Sect_R2>
        <Wrap_Content>
          <Sect_C1>
            <div className="par-spacing">
              <h3 className="title-sub">방문 일시</h3>
              <div className="par-indent-left">
                <div className="par-spacing">
                  <DatePicker
                    locale="ko"
                    selected={SelectDate}
                    calendarContainer={MyContainer}
                    onChange={Change}
                    onMonthChange={monthChange}
                    inline
                    choseDate={SelectDate}
                    dateFormat="yyyy.mm.dd(eee)"
                  />
                </div>
              </div>
            </div>
          </Sect_C1>
          <Sect_C2>
            <div className="par-spacing">
              <h3 className="title-sub">동반고객 정보</h3>
              <div className="par-indent-left">
                <div className="par-spacing">
                  <p className="capt-00">
                    분양대행사와 보수 정산 시, 증거자료로 활용하실 수 있으니, 동반고객 정보를 정확하게 입력하시길 바랍니다.
                  </p>
                </div>
              </div>
              <Sect_C_R2>

                <div className="m-1x0x2">
                  <div className="par-spacing">
                    <MUTextField_100 required label="동반하실 고객이름" type="text" name="username" value={Name} onChange={nameChange} />
                  </div>
                  <div className="par-spacing">
                    <MUTextField_100 required label="휴대폰번호" type="tel" name="userphoneNum" value={Phone} onChange={phoneChange} minLength="10" maxLength="11" placeholder="휴대번호를 ’-‘를 빼고 입력하여주세요." helperText="동반고객 휴대폰 중간번호 4자리는 보안 처리되어 분양대행사에 제공됩니다." />
                  </div>
                  {/* <InputTitle>이름</InputTitle>
                      <InputTxt
                        type="text"
                        name="username"
                        placeholder="이름을 입력하여주세요."
                        value={Name}
                        onChange={nameChange}
                      />
                      <WrapPhone>
                        <InputTitle>휴대폰번호</InputTitle>
                        <WrapInput>
                          <Input
                            type="tel"
                            name="userphoneNum"
                            placeholder="휴대번호를 ’-‘를 빼고 입력하여주세요."
                            value={Phone}
                            onChange={phoneChange}
                            maxLength="15"
                          />
                          <Delete
                            src={Close}
                            alt="delete"
                            onClick={() => {
                              setPhone("");
                            }}
                          />
                        </WrapInput>
                      </WrapPhone> */}

                  {/* <AddBtn type="button" onClick={Add} /> */}

                  <div className="tAlign-r">
                    <MUButton type="button" variant="outlined" onClick={Add}> 추가 </MUButton>
                  </div>
                </div>

                <div className="par-spacing">
                  {
                    userList.map((item) => {
                      return (
                        <>
                          <div className="par-spacing">
                            <div className="flex-spabetween-center">
                              <EaName>{item.name}</EaName>
                              <EaPhone>{item.phone}</EaPhone>
                              <div className="flexGlow-1"/>
                              <IconButton onClick={(e) => { onRemove(item) }}><ClearIcon /></IconButton>
                            </div>
                          </div>
                          <div className="divider-a1"/>
                        </>
                      );
                    })
                  }
                </div>

              </Sect_C_R2>
            </div>
          </Sect_C2>
        </Wrap_Content>
        <WrapBtns_1 className="flex-right-center">
          <div className="par-spacing-before">
            <MUButton_Validation
              variant="contained"
              type="submit"
              active={userList.length > 0}
              onClick={confimReservation}
            >
              확인
            </MUButton_Validation>
          </div>
        </WrapBtns_1>
      </Sect_R2 >
    </>
  )
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
//----------------------------------------

const Sect_R2 = styled.div`
  width: 95%;
  height:100%;
  padding:0.625rem 0 0.625rem;
  margin:0 auto;
`
const Sect_C_R2 = styled.div`
${TtCon_1col_input}
`

const Wrap_Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Sect_C1 = styled.div`
  width:50%;
  padding: 0 1rem;
  @media ${(props) => props.theme.breakpoints.md} {
      width:100%;
    }
    @media ${(props) => props.theme.breakpoints.sm} {
      padding: 0;
    }
`

const Sect_C2 = styled.div`
  width:50%;
  padding: 0 1rem;
  @media ${(props) => props.theme.breakpoints.md} {
      width:100%;
      padding: 0 1.5rem;
    }
`

const WrapBtns_1 = styled.div`
  &>button {
    margin-right: 0.5rem;
  }

`

const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`

//@@----------------------------------------

const WrapTime = styled.div`
  width:90%;
  margin: 0 auto;
`

const EaName = styled.div`
  position:relative;
  display:inline-block;
  margin-right:15px;
  padding-left:15px;
  &:before{position:absolute;left:0;top:50%;transform:translateY(-50%);width:4px;height:4px;display:block;content:'';background:${(props)=>props.theme.palette.secondary.main};border-radius:100%;}
`
const EaPhone = styled(EaName)`
  margin-right:0;
  padding-left:0;
  &:before{display:none;}
`