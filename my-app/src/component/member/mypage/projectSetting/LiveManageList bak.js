//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//material-ui
import Checkbox from '@mui/material/Checkbox';
//css
import styled from "styled-components"

//img
import ArrowDown from '../../../../img/member/arrow_down.png';
import Check from '../../../../img/map/radio.png';
import Checked from '../../../../img/map/radio_chk.png';

import { Mobile, PC } from "../../../../MediaQuery"

export default function Request({value, index, onChangeCheckEl}) {

  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const showModal =()=>{
    setMenu(!menu);
  }

  const get_status=(tr_status) =>{
    let status;
    switch(tr_status){
      case 0:
        status='예약접수';
      break;
      case 1:
        status='예약취소/해제';
      break;
      case 2:
        status='라이브예약초대';
      break;
    }
    return status;
  }

    return (
      <>
        <li>
          {/*방송 만료상태일때 CheckBox 사라져야함  tr_status:1취소*/}
          {
            value.tr_status == 0 ? 

              <Checkbox id={"check" + index} checked={value.isChecked} onChange={() => onChangeCheckEl(index)}/>
            // <CheckBox>
            //   <InputCheckEa type="checkbox" id={"check"+index} checked={value.isChecked} onChange={() => onChangeCheckEl(index)}/>
            //   <InputCheckEaLabel for={"check"+index}/>
            // </CheckBox>
            :
            null
          }
          <Infos>
            <Number>등록번호 : {value.tr_group_id} trid:{value.tr_id} company_id:{value.request_user_selectsosokid}</Number>
            <FlexBox>
              <Left>이름</Left>
              <Right>{value.tr_name} {get_status(value.tr_status)}</Right>
            </FlexBox>
            <FlexBox>
              <Left>이메일</Left>
              <Right>{value.tr_email}</Right>
            </FlexBox>
          </Infos>
        </li>
      </>
    );
}



const Li = styled.li`
  width:100%;
  position:relative;
  display:flex;justify-content:flex-start;align-items:center;
  padding:16px 70px;
  border-bottom:1px solid #f7f8f8;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(22/428)) calc(100vw*(10/428));
  }
`
const Infos = styled.div`
  width:500px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
  }
`
const CheckBox = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  margin-right:30px;
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(30/428));
  }
`
const InputCheckEa = styled.input`
  display:none;
  &:checked+label{background:url(${Checked}) no-repeat;background-size:100% 100%;}
`
const InputCheckEaLabel = styled.label`
  display:inline-block;
  width:20px;height:20px;
  background:url(${Check}) no-repeat;background-size:100% 100%;
  margin-right:10px;
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));
    margin-right:calc(100vw*(10/428));
  }
`
const Number = styled.p`
  font-size:14px;color:#707070;
  transform:skew(-0.1deg);
  margin-bottom:10px;
  font-weight:600;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(10/428));
  }
`
const FlexBox = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(6/428));
  }
`
const Left = styled.h2`
  font-size:15px;font-weight:800;
  color:#4a4a4a;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Right = styled(Left)`
  color:#979797;
`
