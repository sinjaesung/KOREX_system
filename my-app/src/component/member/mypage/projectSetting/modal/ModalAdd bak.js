//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import Filter from '../../../../../img/member/filter.png';
import Bell from '../../../../../img/member/bell.png';
import BellActive from '../../../../../img/member/bell_active.png';
import Location from '../../../../../img/member/loca.png';
import Set from '../../../../../img/member/setting.png';
import Item from '../../../../../img/main/item01.png';
import Noimg from '../../../../../img/main/main_icon3.png';
import Close from '../../../../../img/main/modal_close.png';
import Change from '../../../../../img/member/change.png';
import Marker from '../../../../../img/member/marker.png';
import ArrowDown from '../../../../../img/member/arrow_down.png';


import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

//지도 모달
export default function AddModal({  startDate, setStartDate, selectDate, setSelectDate  }) {
  const [active,setActive] = useState(false);

  const [tDate, setTdate] = useState(setHours(setMinutes(new Date(), 30), 16));
  const [sDate, setSdate] = useState(new Date());

  const [Interval, setInterval] = useState(10); //간격 값 저장

    return (
      <Container>
        <WrapInputBox>
          <Label>방송일</Label>
          <WrapDate>
            <DatePicker
              dateFormat="yyyy.MM.dd"
              selected={tDate}
              onChange={(date) =>{setTdate(date);setSelectDate(date)}}
            />
          </WrapDate>
          <Label>시간</Label>
          <WrapTime>
            <Time>
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
              />
            </Time>
            {/* <Time>
              <DatePicker
                className="date_time_mobile"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={Interval} //간격 설정
                timeCaption="Time"
                dateFormat="h:mm aa" // 시간 타입(보여주는)
                minTime={setHours(setMinutes(new Date(), 0), 0)} //시작 시간 세팅
                maxTime={setHours(setMinutes(new Date(), 0), 23)} // 종료 시간 세팅
              />
            </Time> */}
          </WrapTime>
        </WrapInputBox>
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

const WrapTime = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Time = styled.div`
  position:relative;
  width: 100%;
  height: 43px;
  font-size: 15px;
  text-align: center;
  color: #707070;
  transform: skew(-0.1deg);
  font-weight: 600;
  z-index:2;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
    height: calc(100vw * (43 / 428));
    font-size: calc(100vw * (15 / 428));
  }
`


const WrapModalAdd = styled.div`
  width:100%;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(40/428));
  }
`
const ModalAddBg = styled.div`
  width:100%;height:100%;
  position:fixed;left:0;top:0;
  background:rgba(0,0,0,0.2);
  display:block;content:'';
  z-index:3;
`
const ModalAdd = styled.div`
  position:fixed;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:535px;border-radius:24px;
  border:1px solid #f2f2f2;
  background:#fff;
  padding:49px 50px 60px 50px;
  z-index:3;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(395/428));
    height:auto;
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`
const AddCloseBtn = styled.div`
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const AddCloseImg = styled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(12/428));
  }
`
const ModalAddTitle = styled.h3`
  font-size:20px;font-weight:800;color:#707070;
  transform:skew(-0.1deg);
  padding-bottom:20px;
  border-bottom:1px solid #707070;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    padding-bottom:calc(100vw*(15/428));
  }

`
const WrapInputBox = styled.div`
  width:100%;margin:30px 0;
  @media ${(props) => props.theme.modal} {
    margin:calc(100vw*(30/428)) 0;
  }
`
const Label = styled.label`
  display:inline-block;margin-bottom:9px;
  font-size:12px;font-weight:600;
  transform:skew(-0.1deg);color:#4a4a4a;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(9/428));
    font-size:calc(100vw*(12/428));
  }
`
const Input = styled.input`
  width:100%;
  border-radius:4px; border:1px solid #e4e4e4;
  height:43px;font-size:15px;color:#707070;text-align:center;transform:skew(-0.1deg);
  margin-bottom:20px;
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(43/428));
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(20/428));
  }
`
const WrapSelect = styled.div`
  display:flex;justify-content:space-between;align-items:center;
`
const Select = styled.select`
  width:205px;height:43px;font-size:15px;color:#707070;
  border-radius:4px; border:1px solid #e4e4e4;transform:skew(-0.1deg);
  background:url(${ArrowDown}) no-repeat 85% center; background-size:11px;
  text-align-last:center;
  appearance:none;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(180/428));
    height:calc(100vw*(43/428));
    font-size:calc(100vw*(15/428));
    background-size:calc(100vw*(11/428));
  }
`
const Option = styled.option`
`
const Confirm = styled.div`
  width:100%;
  margin-top:30px;
  @media ${(props) => props.theme.modal} {
    margin-top:calc(100vw*(11/428));
  }
`
const ConfirmBtn = styled.button`
  width: 100%;
  height: 66px;
  line-height:60px;
  border-radius: 11px;
  transition:all 0.3s;
  color:#fff;
  font-size:20px;font-weight:800;transform:skew(-0.1deg);
  background:${({active}) => active ? "#01684b" : "#979797"};
  border:${({active}) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.modal} {
    width:100%;
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
  }
`
const WrapDate = styled.div`
  /* width:300px; */
  width: 100%;
  position:relative;z-index:3;
  margin-bottom:30px;
  @media ${(props) => props.theme.modal} {
    /* width:calc(100vw*(280/428)); */
    width: 100%;
    margin-bottom:calc(100vw*(25/428));
  }
`