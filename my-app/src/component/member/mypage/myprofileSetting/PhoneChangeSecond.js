//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//material-ui
import TextField from '@material-ui/core/TextField';
import { styled } from '@material-ui/core/styles';

//css
import Sstyled from "styled-components";

//server request
import serverController from '../../../../server/serverController';

export default function EmailChange({prevphone,newphone,cernum,verify_cernum,setCernum,updatePageIndex,phoneModal}) {
   
  const [cernumerror,setCernumerror] = useState(false);

   const cernum_change = async (e) =>{
     setCernum(e.target.value);

     /*console.log('매번 입력하는 인증번호값 문자열이 서버에 저장되어진 해당번호의(새로운핸드폰)벉호 변경또한 새로운 번호로 인증요청하는것이기에 같은테이블사용,');
     let body_info = {
       phone_number : newphone,
       cernum_number : e.target.value
     };
     var cernumchk_validate_result = await serverController.connectFetchController('/api/cernum_validate_process','POST',JSON.stringify(body_info));

     if(cernumchk_validate_result){
       console.log('cernumchk_validate_reusltss:',cernumchk_validate_result);

       if(cernumchk_validate_result.success){
         setCernumerror(false);
       }else{
         setCernumerror(true);
       }
     }*/
   }

    return (
        <Container>
            <ProfileTop>
              <WrapInputBox>
                <Box>
              <MUInput label="기존 전화번호" placeholder='기존 휴대폰전화' value={prevphone}
                helperText="휴대번호를 '-' 빼고 입력해주세요."
                type="text"/>



                  {/* <Label>휴대전화</Label>
                  <InputBox type="text" value={prevphone}/> */}


                </Box>
                <Box>
              <MUInput label="변경 전화번호" placeholder='변경 휴대폰전화' value={newphone}
                helperText="휴대번호를 '-' 빼고 입력해주세요."
                type="text" />




                  {/* <Label>변경 휴대전화</Label>
                  <InputBox type="text" value={newphone} /> */}
                  {/*<InputBoxMt type="text" placeholder="휴대번호를 '-'를 빼고 입력하여주세요."/>*/}

              <MUInput label="인증번호" placeholder='변경 휴대폰전화' value={cernum}
                onChange={cernum_change}
                type="text" />


{/* 
                  <Label>인증번호</Label>
                  <InputBox type="text" value={cernum} onChange={cernum_change}/> */}
                  {
                    cernumerror == true ?
                    <ErrorMsg>휴대전화 인증번호가 일치하지 않습니다.</ErrorMsg>:
                    null
                  }
                </Box>
              </WrapInputBox>
            </ProfileTop>
          {/*버튼*/}
            <Button>
              <Link to="/MyProfileSetting">
                <CancleBtn type="submit" name="">취소</CancleBtn>
              </Link>
              <ChangeBtn type="submit" name="" onClick={async() =>{
                console.log('변경버튼 클릭!!!!:',cernum,verify_cernum);

                let body_info = {
                  phone_number : newphone,
                  cernum_number : cernum
                };
                var cernumchk_validate_result = await serverController.connectFetchController('/api/cernum_validate_process','POST',JSON.stringify(body_info));

                if(cernumchk_validate_result){
                  console.log('cernumchk_validate_resultss::',cernumchk_validate_result);
                  
                  if(cernumchk_validate_result.success){
                    //성공인 경우
                    setCernumerror(false);
                    phoneModal();      
                  }else{
                    //실패인 경우
                    alert(cernumchk_validate_result.message);
                    setCernumerror(true);
                    return false;
                  }
                }
                //phoneModal();
                
              }}>변경</ChangeBtn>
            </Button>
        </Container>
  );
}

//material-ui
const MUInput = styled(TextField)`
  margin-bottom : 10px;
  width: 100%;
  height:66px;
   @media ${(props) => props.theme.mobile} {
      /* height:calc(100vw*(43/428)); */
      font-size:calc(100vw*(14/428));
      margin-bottom:calc(100vw*(15/428));
       margin-bottom : 50px;
      }
    
`

const Pb = Sstyled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = Sstyled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = Sstyled.div`
`
const ProfileTop = Sstyled.div`
  width:100%;
  display:flex;justify-content:flex-start;align-items:center;
  padding-bottom:42px;
  @media ${(props) => props.theme.mobile} {
    justify-content:center;
    }
`
const WrapInputBox = Sstyled.div`
  width:100%;
`
const Box = Sstyled.div`
  width:100%;position:relative;
  margin-bottom:54px;
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(30/428));
    }
`
const Label = Sstyled.label`
  display:inline-block;
  font-size:12px;font-weight:600;transform:skew(-0.1deg);
  padding-left:7px;margin-bottom:10px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    padding-left:calc(100vw*(7/428));
    margin-bottom:calc(100vw*(10/428));
    }
`
const InputBox = Sstyled.input`
  width:100%;height:43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  text-align:center;
  transform:skew(-0.1deg);
  font-size:15px;
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    height:calc(100vw*(43/428));
    }
`
const InputBoxMt = Sstyled(InputBox)`
  margin-top:6px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(6/428));
  }
`
const Button = Sstyled.div`
  width: 408px;
  display:flex;justify-content:space-between;align-items:center;
  margin:50px auto 0;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    margin:calc(100vw*(50/428)) auto;
    }
`
const CancleBtn = Sstyled.button`
  width:200px;
  height: 66px;
  line-height:60px;
  text-align:center;
  color:#fff;
  font-size:20px;transform:skew(-0.1deg);
  font-weight:800;
  border-radius: 11px;
  transition:all 0.3s;
  background:#979797;
  border:3px solid #e4e4e4;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(180/428));
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
    }
`
const ChangeBtn = Sstyled(CancleBtn)`
  background:#01684b;
  border: 3px solid #04966d;
`
const ErrorMsg = Sstyled.p`
  position:Absolute;
  left:50%;width:100%;
  bottom:-30px;
  font-size:12px; color:red;
  font-weight:600;transform:skew(-0.1deg) translateX(-50%);
  margin-top:20px;
  text-align:center;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-top:calc(100vw*(10/428));
    bottom:calc(100vw*(-30/428));
    }
`