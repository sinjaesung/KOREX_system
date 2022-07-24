//react
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//style
import Sstyled from "styled-components";

//img
// import CloseIcon from "../../../img/main/modal_close.png";
import Prev from "../../../img/member/slick_prev.png";
import Arrow from "../../../img/member/arrow_down.png";

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

//datepicker
import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import "../../../react-datepicker.css";
import ko from "date-fns/locale/ko";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

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


export default function ModalCalendarSecond({cal, setCal, updatePageIndex ,SelectDate ,tour, setSelectTime,selectTime, setcheckedTime}) {
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [SelectedDay, setSelectedDay] = useState("일")


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

  if (cal == false) return null;
  return (
    <Container>

      <Dialog
        onClose={() => {
          setCal(false);
          updatePageIndex(0);
        }}
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
          <SeletedDate>
            <Preved
              onClick={() => {
                updatePageIndex(0);
              }}
              src={Prev}
            />
            <DateDay>{SelectDate.getFullYear()}년 {SelectDate.getMonth() + 1}월 {SelectDate.getDate()}일 {SelectedDay}요일</DateDay>
          </SeletedDate>
          <Label>시간</Label>
          <br />
          <WrapDatePicker>
            {
              tour ?
                <DatePicker
                  className="date_time_mobile"
                  selected={selectTime}
                  onChange={(date) => { setSelectTime(date); }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={tour.time_distance} //간격 설정
                  timeCaption="Time"
                  dateFormat="h:mm aa" // 시간 타입(보여주는)
                  minTime={new Date(getDateType(new Date()) + " " + tour.td_starttime)} //시작 시간 세팅
                  maxTime={new Date(getDateType(new Date()) + " " + tour.td_endtime)} // 종료 시간 세팅
                />
                :
                null

            }

          </WrapDatePicker>
        </MUDialogContent>
        <DialogActions>
        
          <NextButton>
            <Next
              type="button"
              onClick={() => {
                updatePageIndex(2);
                setcheckedTime(startDate)
              }}
            >
              다음
            </Next>
          </NextButton>
        </DialogActions>

      </Dialog>


      {/* <Wraplive>
        <ModalClose>
          <Link
            onClick={() => {
              setCal(false);
              updatePageIndex(0);
            }}
          >
            <CloseImg src={CloseIcon} />
          </Link>
        </ModalClose>
        <ModalTop>
          <Title>방문 예약</Title>
        </ModalTop>
        <Label>방문일시</Label>
        <SeletedDate>
          <Preved
            onClick={() => {
              updatePageIndex(0);
            }}
            src={Prev}
          />
          <DateDay>{SelectDate.getFullYear()}년 {SelectDate.getMonth()+1}월 {SelectDate.getDate()}일 {SelectedDay}요일</DateDay>
        </SeletedDate>
        <Label>시간</Label>
            <br/>
        <WrapDatePicker>
          {
            tour ?
            <DatePicker 
            className="date_time_mobile"
            selected={selectTime}
            onChange={(date) => {setSelectTime(date);}}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={tour.time_distance} //간격 설정
            timeCaption="Time"
            dateFormat="h:mm aa" // 시간 타입(보여주는)
            minTime={new Date(getDateType(new Date()) + " " + tour.td_starttime)} //시작 시간 세팅
            maxTime={new Date(getDateType(new Date()) + " " + tour.td_endtime)} // 종료 시간 세팅
            />
            :
            null

          }
         
        </WrapDatePicker>
        <NextButton>
          <Next
            type="button"
            onClick={() => {
              updatePageIndex(2);
              setcheckedTime(startDate)
            }}
          >
            다음
          </Next>
        </NextButton>
      </Wraplive> */}



    </Container>
  );
}

const MUDialogContent = MUstyled(DialogContent)`
  width: 100%;
  height: 65vh;
  padding-right: 70px;
  padding-left: 70px;
`
const MUDialogTitle = MUstyled(DialogTitle)`
  width: 80%;
  margin : 0 auto;
`

const Container = Sstyled.div`
  width: 100%;
`;
const Wraplive = Sstyled.div`
  position: fixed;
  z-index: 1002;
  width: 535px;
  height: auto;
  background: #fff;
  border-radius: 24px;
  border: 1px solid #f2f2f2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 49px 49px 50px 63px;

  @media ${(props) => props.theme.modal} {
    width: calc(100vw * (395 / 428));
    height: auto;
    padding: calc(100vw * (24 / 428)) calc(100vw * (20 / 428))
      calc(100vw * (50 / 428));
  }
`;
const ModalClose = Sstyled.div`
  width: 100%;
  text-align: right;
  margin-bottom: 22px;

  @media ${(props) => props.theme.modal} {
    margin-bottom: calc(100vw * (25 / 428));
  }
`;
const CloseImg = Sstyled.img`
  display: inline-block;
  width: 15px;
  height: 16px;
  @media ${(props) => props.theme.modal} {
    width: calc(100vw * (12 / 428));
    height: calc(100vw * (13 / 428));
  }
`;
const ModalTop = Sstyled.div`
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid #a3a3a3;

  @media ${(props) => props.theme.modal} {
    padding-bottom: calc(100vw * (15 / 428));
  }
`;
const Title = Sstyled.div`
  font-size: 20px;
  font-weight: 800;
  color: #707070;
  @media ${(props) => props.theme.modal} {
    font-size: calc(100vw * (15 / 428));
  }
`;
const ModalBody = Sstyled.div`
  width: 100%;
  padding-top: 11px;
  @media ${(props) => props.theme.modal} {
    padding-top: calc(100vw * (14 / 428));
  }
`;
const Label = Sstyled.label`
  margin: 10px 0;
  font-size: 12px;
  display: inline-block;
  font-weight: 600;
  transform: skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size: calc(100vw * (12 / 428));
    margin: calc(100vw * (10 / 428)) 0;
  }
`;
const SeletedDate = Sstyled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  margin: 20px 0 50px;

  @media ${(props) => props.theme.modal} {
    margin: calc(100vw * (20 / 428)) 0 calc(100vw * (50 / 428));
  }
`;
const Preved = Sstyled.img`
  display: inline-block;
  width: 27px;
  margin-right: 23px;
  @media ${(props) => props.theme.modal} {
    width: calc(100vw * (27 / 428));
    margin-right: calc(100vw * (23 / 428));
  }
`;
const DateDay = Sstyled.div`
  font-size: 15px;
  font-weight: 800;
  transform: skew(-0.1deg);
  text-align: left;
  color: #4a4a4a;
  @media ${(props) => props.theme.modal} {
    font-size: calc(100vw * (15 / 428));
  }
`;

const WrapDatePicker = Sstyled.div`
  width:100%;position:relative;
`
const SelectBox = Sstyled.select`
  width: 100%;
  height: 43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  text-align-last: center;
  transform: skew(-0.1deg);
  text-align: center;
  appearance: none;
  background: url(${Arrow}) no-repeat 90% center;
  background-size: 11px;
  font-size: 15px;
  color: #707070;
  font-weight: 600;
  transform: skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    height: calc(100vw * (43 / 428));
    font-size: calc(100vw * (15 / 428));
    background-size: calc(100vw * (11 / 428));
  }
`;
const Option = Sstyled.option``;
const NextButton = Sstyled.div`
  margin-top: 30px;
  width: 100%;
  @media ${(props) => props.theme.modal} {
    margin-top: calc(100vw * (30 / 428));
  }
`;
const Next = Sstyled.button`
  width: 100%;
  height: 66px;
  margin-top: 28px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  transform: skew(-0.1deg);
  border-radius: 11px;
  transition: all 0.3s;
  background: #979797;
  border: 3px solid #e4e4e4;
  /*
액티브 됐을때
  background:#01684b;
  border:3px solid #04966d
*/
  @media ${(props) => props.theme.modal} {
    height: calc(100vw * (60 / 428));
    line-height: calc(100vw * (54 / 428));
    font-size: calc(100vw * (15 / 428));
  }
`;
