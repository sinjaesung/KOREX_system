//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//img
import Close from "../../../img/main/modal_close.png";
import Check from "../../../img/map/radio.png";
import Checked from "../../../img/map/radio_chk.png";


export default function ReportModalThird({report,setReport,updatePageIndex}) {

  const [name,setName] = useState("");/*기본값*/
  const [phone,setPhone] = useState("");/*기본값*/
  const [cernum,setCernum] = useState("");/*기본값*/
  const [active,setActive] = useState(false);

  const nameChange = (e) =>{ setName(e.target.value); }
  const phoneChange = (e) =>{ setPhone(e.target.value); }
  const cernumChange = (e) =>{ setCernum(e.target.value); }

  const checkVaildate = () =>{
    return name.length > 0 && phone.length > 9 && cernum.length > 4
   }

   useEffect(()=>{
     if(checkVaildate())
         setActive(true);
     else
         setActive(false);
   },)

  if(report == false)
  return null;
    return (
        <Container>
              <InCont>
                <Desc>KOREX는 허위매물 근절을 위하여 최선의 노력을 기울이고 있습니다.<br/>
                내용 확인을 위해 KOREX검증 담당자가 직접 연락드리겠습니다. </Desc>
                <WrapInputBox>
                  <Box>
                    <Label>이름</Label>
                    <Input type="text" name="" placeholder="이름을 입력하여주세요." onChange={nameChange}/>
                  </Box>
                  <Box>
                    <Label>휴대전화</Label>
                    <Input type="text" name="" placeholder="휴대번호를 ’-‘를 빼고 입력하여주세요." onChange={phoneChange}/>
                    <InputCernum type="text" name="" placeholder="인증번호를 입력하여 주세요." onChange={cernumChange}/>
                    {/*인증번호가 일치하지않을때*/}
                    <ErrorMsg style={{display:"none"}}>휴대전화 인증번호가 일치하지 않습니다.</ErrorMsg>
                  </Box>
                  <Button type="submit" name="" active={active} onClick={() => {updatePageIndex(3)}}>제출</Button>
                </WrapInputBox>
              </InCont>
        </Container>
  );
}

const Container = styled.div `
  width:100%;
`
const InCont = styled.div`
  
`
const TopTitleTxt = styled.h3`
  font-size:20px;font-weight:600;
  transform:skew(-0.1deg);color:#707070;
  padding-bottom:21px;border-bottom:1px solid #a3a3a3;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    padding-bottom:calc(100vw*(15/428));
  }
`
const Desc = styled.p`
  margin-top:18px;
  font-size: 12px;
  margin-bottom:15px;
  font-weight: normal;
  text-align: center;
  font-family:'nbg',sans-serif;
  color: #4a4a4a;transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(12/428));
    margin-top:calc(100vw*(20/428));
    margin-bottom:calc(100vw*(18/428));
  }
`
const WrapInputBox = styled.div`
  width:100%;
`

const Box = styled.div`
  position:relative;
  width:100%;
  margin-bottom:14px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(15/428));
  }
`
const Label = styled.div`
  font-size: 12px;
  margin-bottom:10px;
  color: #4a4a4a;
  font-family:'nbg',sans-serif;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(10/428));
    font-size:calc(100vw*(12/428));
  }
`
const ErrorMsg = styled.p`
  font-size:11px;color:#FE0101;
  transform:skew(-0.1deg);
  position:Absolute;left:50%;transform:translateX(-50%);
  bottom:-40px;
  @media ${(props) => props.theme.modal} {
    width:100%;
    text-align:center;
    font-family:'nbg',sans-serif;
    font-size:calc(100vw*(11/428));
    bottom:calc(100vw*(-30/428));
  }
`
const Input = styled.input`
  width:100%;height: 43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;text-align:center;
  color:#4a4a4a;
  font-size:15px;font-weight:600;transform:skew(-0.1deg);
  &::placeholder{color:#979797;font-weight:500;font-size:15px;}
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(43/428));
    font-size:calc(100vw*(14/428));
    &::placeholder{font-size:calc(100vw*(14/428));}
  }
`
const InputCernum = styled(Input)`
  margin-top:10px;
  @media ${(props) => props.theme.modal} {
    margin-top:calc(100vw*(10/428));
  }
`

const Button = styled.button`
  width:100%;
  height: 66px;
  margin-top:60px;
  text-align:center;
  color:#fff;font-size:20px;font-weight:800;transform:skew(-0.1deg);
  border-radius: 11px;
  transition:all 0.3s;
  background:${({active}) => active ? "#01684b" : "#979797"};
  border:${({active}) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
    margin-top:calc(100vw*(30/428));
  }
`
