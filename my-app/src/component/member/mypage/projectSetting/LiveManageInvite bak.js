//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//material-ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled as MUstyled } from '@material-ui/core/styles'
//css
import styled from "styled-components"


export default function LiveManageInvite({reservationList, spendInviteLink , url,setUrl ,text,setText}) {


  const textChange =  (e) =>{ setText(e.target.value); }
  const urlChange =  (e) =>{ setUrl(e.target.value); }

  const [active,setActive] = useState(false);

  const checkVaildate = () =>{
    return text.length > 0 && url.length > 0
   }

   useEffect(()=>{
     if(checkVaildate())
             setActive(true);
     else
         setActive(false);
   },)


    return (
        <Container>
          <WrapLive>
            <TopTitle>총 <GreenColor>{reservationList.length}</GreenColor>명</TopTitle>
            <Line/>
            <WrapInvite>

            <MUTextField label="초대링크" variant="outlined" placeholder="초대링크 URL 입력(필수)" onChange={urlChange}/>

              {/* <Label>초대링크 <Plisu>*</Plisu></Label>
              <InputText placeholder="초대링크 URL 입력(필수)" onChange={urlChange}/> */}
              <TextArea type="textarea" onChange={textChange}/>

              <WrapFilterButtons>
              <MUButton variant="contained" active={active} onClick={spendInviteLink}>확인</MUButton>
                {/* <SaveBtn type="submit" name="" active={active} onClick={spendInviteLink}>확인</SaveBtn> */}
              </WrapFilterButtons>

            </WrapInvite>
          </WrapLive>
  </Container>
  );
}

const MUTextField = MUstyled(TextField)`
  width : 100%;
`


const MUButton = MUstyled(Button)`
   width: 100%;
  height: 66px;
  margin-top:100px;
  border-radius: 11px;
  line-height:60px;color:#fff;
  font-size:20px;font-weight:800;transform:skew(-0.1deg);
  text-align:center;transition:all 0.3s;
  background:${({ active }) => active ? "#01684b" : "#979797"};
  border:${({ active }) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
`

const Container = styled.div`
    width:680px;
    margin:0 auto;
    padding:24px 0 250px;
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(380/428));
      padding:calc(100vw*(30/428)) 0 calc(100vw*(150/428));
      }
`
const WrapLive = styled.div`
  width:100%;
`
const TopTitle = styled.h2`
  font-size:20px;color:#707070;
  text-align:left;padding-left:30px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding-left:calc(100vw*(16/428));
    }
`
const Line = styled.div`
  width:100%;height:1px;
  background:#f2f2f2;
  margin:40px 0 34px;
  @media ${(props) => props.theme.mobile} {
    margin:calc(100vw*(27/428)) 0 calc(100vw*(40/428));
    }
`
const GreenColor = styled.span`
font-size:17px;color:#4a4a4a;
font-weight:800;transform:skew(-0.1deg);margin:0 7px;
  color:#01684b;display:inline-block;vertical-align:middle;
@media ${(props) => props.theme.mobile} {
  font-size:calc(100vw*(14/428));
  }

`
const WrapInvite = styled.div`
  width:408px;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:95%;
  }
`
const Label = styled.label`
  display:inline-block;
  font-size:12px;color:#4a4a4a;
  font-weight:600;transform:skew(-0.1deg);
  margin-bottom:10px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(10/428));
  }
`
const Plisu = styled.span`
  display:inline-block;
  font-size:12px;color:#fe7a01;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
  }
`
const InputText = styled.input`
  display:block;
  width:100%;
  height:43px;border:1px solid #e4e4e4;
  border-radius:4px;transform:skew(-0.1deg);
  text-align:center;font-size:15px;color:#707070;
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(43/428));
    font-size:calc(100vw*(15/428));
  }
`
const TextArea = styled.textarea`
  width:100%;height:250px;
  margin-top:18px;
  border:1px solid #e4e4e4;transform:skew(-0.1deg);
  text-align:left;font-size:15px;color:#707070;
  padding:15px;resize:none;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(250/428));
    font-size:calc(100vw*(15/428));
    padding:calc(100vw*(15/428));
  }
`
const WrapFilterButtons = styled.div`
  width:100%;
`
const SaveBtn = styled.button`
  width: 100%;
  height: 66px;
  margin-top:100px;
  border-radius: 11px;
  line-height:60px;color:#fff;
  font-size:20px;font-weight:800;transform:skew(-0.1deg);
  text-align:center;transition:all 0.3s;
  background:${({active}) => active ? "#01684b" : "#979797"};
  border:${({active}) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
    margin-top:calc(100vw*(60/428));
  }
`
