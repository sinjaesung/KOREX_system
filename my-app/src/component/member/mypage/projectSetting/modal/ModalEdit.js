//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


import DatePicker from "react-datepicker";

//material-ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled as MUstyled } from '@material-ui/core/styles'

//css
import styled from "styled-components"

//img
import ArrowDown from '../../../../../img/member/arrow_down.png';

//지도 모달
export default function EditModal({ value,setEditObject,setModalOption }) {
  const [SelectDate, setSelectDate] = useState(new Date());
  const [text,setText] = useState("");

  const checkVaildate = (t) =>{ return t.length > 1 }

  const textChange = (e) =>{ 
    if(checkVaildate(e.target.value)){
      setModalOption((modalOption) => {
        modalOption.confirm.active = true;
        return {...modalOption};
      });
     }
     else{
      setModalOption((modalOption) => {
        modalOption.confirm.active = false;
        return {...modalOption};
      });
     }
     
     setEditObject((modalOption) => {
      modalOption.text = e.target.value;
      return modalOption;
    });
    
    setText(e.target.value); 
  }


  useEffect(() => {
    setSelectDate(new Date(value.tour_start_date.split('T')[0].replace(/-/gi,'/')));
  }, [])

  const getTimeList = () =>{

    let resultTag = [];
    for(var i = 1; i<24;i++){
      resultTag.push(
        <Option value={i} >{i}시</Option>
      )
    }

    return resultTag;
  }

  const changeMin = (e) =>{
    setEditObject((modalOption) => {
      modalOption.hour = e.target.value;
      return modalOption;
    });
  }
  const changeHour = (e) =>{
    setEditObject((modalOption) => {
      modalOption.min = e.target.value;
      return modalOption;
    });
  }

  const changeDate = (date)=>{
    setEditObject((modalOption) => {
      modalOption.date = date;
      return modalOption;
    });
    setSelectDate(date);
  }

  /* !!@@ 211103_이형규>구조하자--- 방송일시 달력 부분은 ModalAdd.js와 통합하여 컴포넌트화하고, 컴포넌트안에서 props로 mode(create, update)분기처리하여,
  사용할 것 */
    return (
      <>
        <WrapInputBox>
          <Label>방송일</Label>
          <WrapDate>
            <DatePicker
              dateFormat="yyyy.MM.dd"
              selected={SelectDate}
              onChange={(date) => changeDate(date)}
            />
          </WrapDate>
          <Label>시간</Label>
          <WrapSelect>
            <Select onChange={changeMin}>
              <Option selected disalbed>
                시
              </Option>
              {
                getTimeList()
              }
            </Select>
            <Select onChange={changeHour}>
              <Option selected disalbed>
                분
              </Option>
              <Option value={"00"}>00분</Option>
              <Option value={"10"}>10분</Option>
              <Option value={"20"}>20분</Option>
              <Option value={"30"}>30분</Option>
              <Option value={"40"}>40분</Option>
              <Option value={"50"}>50분</Option>
            </Select>
          </WrapSelect>
          <div className="par-spacing">
            <MUTextField_100 label="변경 사유" placeholder="방송변경안내 내용 입력 " multiline rows={4} onChange={textChange} value={text} required/>
          </div>
        </WrapInputBox>
      </>
    );
}

const MUTextField = styled(TextField)``

const MUTextField_100 = styled(MUTextField)`
      &.MuiFormControl-root.MuiTextField-root {
        width:100%;    
  }
`


const WrapDate = styled.div`
  width:300px;position:relative;z-index:3;
  margin-bottom:30px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(280/428));
    margin-bottom:calc(100vw*(25/428));
  }
`


const WrapModalAdd = styled.div`
  width:100%;
  margin-bottom:40px;
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
  margin-bottom:20px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(10/428));
  }
`
const Select = styled.select`
  width:205px;height:43px;font-size:15px;color:#707070;
  border-radius:4px; border:1px solid #e4e4e4;transform:skew(-0.1deg);
  background:url(${ArrowDown}) no-repeat 85% center; background-size:11px;
  text-align-last:center;
  appearance:none;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(170/428));
    height:calc(100vw*(43/428));
    font-size:calc(100vw*(15/428));
    background-size:calc(100vw*(11/428));
  }
`
const Option = styled.option`
`
const TextArea = styled.textarea`
  width:100%;height:160px;
  border-radius:4px; border:1px solid #e4e4e4;font-weight:600;
  resize:none;font-size:15px;transform:skew(-0.1deg);
  padding:10px;
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(160/428));
    font-size:calc(100vw*(15/428));
    padding:calc(100vw*(10/428));
  }
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
