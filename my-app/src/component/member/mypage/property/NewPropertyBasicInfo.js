//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col_input_2, } from '../../../../theme';

//material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import { styled as MUstyled } from '@material-ui/core/styles';
import MoodIcon from '@mui/icons-material/Mood';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

//img
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Location from '../../../../img/member/loca.png';
import Set from '../../../../img/member/setting.png';
import Item from '../../../../img/main/item01.png';
import Noimg from '../../../../img/member/company_no.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';

import { Mobile, PC } from "../../../../MediaQuery"

//server controller
import serverController from '../../../../server/serverController';

//component
import SearchApartOfficetel from "./SearchApartOfficetel";
import SearchStoreOffice from "./SearchStoreOffice";
import SearchApartOfficetelSelectInfo from "./SearchApartOfficetelSelectInfo";

//redux addon sasetss;
import { useSelector } from 'react-redux';
import { tempBrokerRequestActions } from '../../../../store/actionCreators';

export default function NewBasicInfo() {

  const tempBrokerRequests = useSelector(data => data.tempBrokerRequest);

  const [name, setName] = useState("");/*기본값*/
  const [phone, setPhone] = useState("");/*기본값*/

  const [active, setActive] = useState(false);

  const nameChange = (e) => { setName(e.target.value); }
  const phoneChange = (e) => { setPhone(e.target.value); }

  const checkVaildate = () => {
    return phone.length > 9 && name.length > 0
  }

  useEffect(() => {
    if (checkVaildate())
      setActive(true);
    else
      setActive(false);
  })

  const nextStep = async (e) => {
    console.log('nextStep다음단계 호출');

    if (active) {
      tempBrokerRequestActions.phonechange({ phones: phone });
      tempBrokerRequestActions.namechange({ names: name });
    } else {
      e.preventDefault();
    }
  };

  console.log('물건정보', tempBrokerRequests)

  return (
    <>
      <Wrapper>
        <p className="tit-a2">의뢰인정보 입력</p>
        <div className="par-indent-left">
          <div className="par-spacing mb-1">
            <p className="capt-00">{tempBrokerRequests.maemultype}</p>
            <p className="capt-00">{tempBrokerRequests.dangiroadaddress}</p>
            <p className="capt-00">{tempBrokerRequests.dangijibunaddress}</p>
            <p className="list-tit">{tempBrokerRequests.dangi} {tempBrokerRequests.dong_name} {tempBrokerRequests.hosil} {tempBrokerRequests.floor}층</p>
          </div>
        </div>
        <div className="divider-a1" />
        <div className="par-spacing-2p5x0 flex-center-center bgc-mono">
          {/* <MoodIcon color="primary" fontSize="large"/> */}
          <ThumbUpIcon color="primary" fontSize="large" className="mr-1" />
          <p className="list-subtit c-primary">위 물건은 의뢰가 유일한 것으로 확인되어 전속매물등록이 가능합니다.<br />의뢰인 확인에 필요한 정보를 정확하게 입력하세요.</p>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          {/* <Box>
            <Label>이름</Label>
            <Input type="text" placeholder="이름을 입력해주세요." onChange={nameChange} />
          </Box> */}
          {/* <Box>
            <Label>휴대전화</Label>
            <Input type="text" placeholder="휴대번호를 ’-‘를 빼고 입력해주세요." onChange={phoneChange} />
          </Box> */}
          <div className="par-spacing mt-2">
            <MUTextField label='의뢰인 이름' type="text" onChange={nameChange} placeholder="" />
          </div>
          <div className="par-spacing">
            <MUTextField label='의뢰인 휴대폰번호' type="text" helperText="휴대번호를 ’-‘를 빼고 입력해주세요." onChange={phoneChange} />
          </div>

          {/* <SubmitButton onClick={nextStep}>
            <Link to="/AddPropertySecond">
              <Submit type="submit" name="" active={active}>다음</Submit>
            </Link>
          </SubmitButton> */}
          <div className="par-spacing">
            <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={nextStep}><Link to="/AddPropertySecond" className="data_link" />다음</MUButton_Validation>
          </div>
        </Sect_R2>
      </Wrapper>
    </>
  );
}

const MUTextField = styled(TextField)`
  &.MuiFormControl-root.MuiTextField-root {
    width:100%;
  } 
`
const MUButtonArea = styled.div`
  display: flex;
  flex-direction: column;
`
const MUButton = MUstyled(Button)`
  margin-bottom: 5px;
  width : 100%;
`
//---------------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2`
  ${TtCon_Title}  
`
const Sect_R1 = styled.div``

const Sect_R2 = styled.div`
  ${TtCon_1col_input_2}
`

const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`

// const Container = styled.div`
//     width:680px;
//     margin:0 auto;
//     padding:24px 0 250px;
//     @media ${(props) => props.theme.mobile} {
//       width:calc(100vw*(380/428));
//       padding:calc(100vw*(30/428)) 0 calc(100vw*(100/428));
//       }
// `
// const WrapRequest = styled.div`
//   width:100%;
// `
// const TopTitle = styled.h2`
//   font-size:20px;color:#707070;
//   text-align:left;padding-left:30px;
//   font-weight:800;transform:skew(-0.1deg);
//   @media ${(props) => props.theme.mobile} {
//     font-size:calc(100vw*(14/428));
//     padding-left:calc(100vw*(16/428));
//     }
// `
// const WrapBox = styled.div`
//   width:408px;
//   margin:50px auto 0;
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(370/428));
//     margin:calc(100vw*(50/428)) auto 0;
//     }
// `
// const Box = styled.div`
//   width:100%;
//   margin-bottom:14px;
//   &:last-child{margin-bottom:0;}
//   @media ${(props) => props.theme.mobile} {
//     margin-bottom:calc(100vw*(14/428));
//     }
// `
// const Label = styled.label`
//   display:block;
//   padding-left:7px;
//   font-size:12px;font-weight:600;
//   transform:skew(-0.1deg);
//   margin-bottom:10px;
//   @media ${(props) => props.theme.mobile} {
//     padding-left:calc(100vw*(7/428));
//     font-size:calc(100vw*(12/428));
//     margin-bottom:calc(100vw*(10/428));
//     }
// `
// const Input = styled.input`
//   display:inline-block;
//   width:100%;height:43px;
//   border-radius:4px;
//   border:1px solid #e4e4e4;
//   text-align:center;transform:skew(-0.1deg);
//   font-size:15px;color:#979797;font-weight:600;
//   &::placeholder{color:#979797;font-weight:500;}
//   @media ${(props) => props.theme.mobile} {
//     height:calc(100vw*(43/428));
//     font-size:calc(100vw*(15/428));
//     }
// `
// const SubmitButton = styled.div`
//   width:100%;
//   margin-top:60px;
//   @media ${(props) => props.theme.mobile} {
//     margin-top:calc(100vw*(50/428));
//     }
// `
// const Submit = styled.button`
//   width:100%;
//   height:66px;
//   line-height:60px;
//   font-size:20px;
//   color:#fff;
//   border-radius:11px;
//   border:3px solid #e4e4e4;
//   transition:all 0.3s;
//   font-weight:800;
//   background:${({ active }) => active ? "#01684b" : "#979797"};
//   border:${({ active }) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
//   @media ${(props) => props.theme.mobile} {
//       height:calc(100vw*(60/428));
//       line-height:calc(100vw*(54/428));
//       font-size:calc(100vw*(15/428));
//     }
// `