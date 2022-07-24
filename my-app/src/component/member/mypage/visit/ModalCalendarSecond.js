//react
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//style
import styled from "styled-components";

//img
import CloseIcon from "../../../../img/main/modal_close.png";
import Prev from "../../../../img/member/slick_prev.png";
import Arrow from "../../../../img/member/arrow_down.png";

//datepicker
import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import "../../../../react-datepicker.css";
import ko from "date-fns/locale/ko";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

export default function ModalCal({ cal, selectTime ,setSelectDate,selectDate, setSelectTime, calModal,updatePageIndex }) {
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(selectTime, 30), 16)
  );

  if (cal == false) return null;
  return (
    <Container>
        <SeletedDate>
          <Preved
            onClick={() => {
              updatePageIndex(0);
            }}
            src={Prev}
          />
          <DateDay>{selectDate.getFullYear()}년 {selectDate.getMonth()+1}월 {selectDate.getDate()}일 </DateDay>
        </SeletedDate>
        <Label>시간</Label>
            <br/>
        <WrapDatePicker>
          <DatePicker className="date_time"
            selected={startDate}
            onChange={(date) => {setSelectTime(date); setStartDate(date)}}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30} //간격 설정
            timeCaption="Time"
            dateFormat="h:mm aa" // 시간 타입(보여주는)
            minTime={setHours(setMinutes(new Date(), 0), 1)} //시작 시간 세팅
            maxTime={setHours(setMinutes(new Date(), 30), 22)} // 종료 시간 세팅
          />
        </WrapDatePicker>
        <NextButton>
          <Next
            type="button"
            onClick={() => {
              updatePageIndex(2);
            }}
          >
            다음
          </Next>
        </NextButton>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;
const Wraplive = styled.div`
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
const ModalClose = styled.div`
  width: 100%;
  text-align: right;
  margin-bottom: 22px;

  @media ${(props) => props.theme.modal} {
    margin-bottom: calc(100vw * (25 / 428));
  }
`;
const CloseImg = styled.img`
  display: inline-block;
  width: 15px;
  height: 16px;
  @media ${(props) => props.theme.modal} {
    width: calc(100vw * (12 / 428));
    height: calc(100vw * (13 / 428));
  }
`;
const ModalTop = styled.div`
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid #a3a3a3;

  @media ${(props) => props.theme.modal} {
    padding-bottom: calc(100vw * (15 / 428));
  }
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #707070;
  @media ${(props) => props.theme.modal} {
    font-size: calc(100vw * (15 / 428));
  }
`;
const ModalBody = styled.div`
  width: 100%;
  padding-top: 11px;
  @media ${(props) => props.theme.modal} {
    padding-top: calc(100vw * (14 / 428));
  }
`;
const Label = styled.label`
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
const SeletedDate = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  margin: 20px 0 50px;

  @media ${(props) => props.theme.modal} {
    margin: calc(100vw * (20 / 428)) 0 calc(100vw * (50 / 428));
  }
`;
const Preved = styled.img`
  display: inline-block;
  width: 27px;
  margin-right: 23px;
  @media ${(props) => props.theme.modal} {
    width: calc(100vw * (27 / 428));
    margin-right: calc(100vw * (23 / 428));
  }
`;
const DateDay = styled.div`
  font-size: 15px;
  font-weight: 800;
  transform: skew(-0.1deg);
  text-align: left;
  color: #4a4a4a;
  @media ${(props) => props.theme.modal} {
    font-size: calc(100vw * (15 / 428));
  }
`;

const WrapDatePicker = styled.div`
  width:100%;position:relative;
`
const SelectBox = styled.select`
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
const Option = styled.option``;
const NextButton = styled.div`
  margin-top: 30px;
  width: 100%;
  @media ${(props) => props.theme.modal} {
    margin-top: calc(100vw * (30 / 428));
  }
`;
const Next = styled.button`
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
