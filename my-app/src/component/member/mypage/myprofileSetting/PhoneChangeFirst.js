//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//material-ui
import TextField from '@material-ui/core/TextField';
import { styled } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';

//css
import Sstyled from "styled-components";

import serverController from '../../../../server/serverController';

//redux
import {useSelector} from 'react-redux';

export default function EmailChange({newphone, setnewphone,prevphone,setprevphone,updatePageIndex,cerModal}) {
  
  const login_userinfo = useSelector(data=>data.login_user);
  
  const [active,setActive] = useState(false);
  const regex = /[^0-9\b]+$/;

  const prevphoneChange = (e) =>{ 
    if (!regex.test(e.target.value)) {    
      setprevphone(e.target.value); 
    } else {
      return;
    }    
  }

  const newphoneChange = (e) =>{ 
    if (!regex.test(e.target.value)) {      
      setnewphone(e.target.value); 
    } else {
      return;
    }   
  }
  
  /*const coolSmsSend= async(e) => {
    console.log('coolsmsSend발송 함수 호출 member broker josininput요소 고유 현재의값 phone',prevphone);

    let body_info= {number: newphone};
    let res=await serverController.connectFetchController('/api/coolsms/sendprocess','post',JSON.stringify(body_info));
    console.log('res results coolsms:',res);

    setVerify_cernum(res.sms_message);

  }*/
  
  const aligoSmsSend = async(e) =>{
    console.log('aligosms send발송함수 호출:',prevphone,newphone);//새로운폰번호로 발송해야한다.
    
    let body_info = {
      receiver: newphone,
      msg : 'api test send',
      msg_type : 'SMS',
      title:'api test입니다.',      
    };

    let res = await serverController.connectFetchController('/api/aligoSms','POST',JSON.stringify(body_info));
    console.log('res resultss resultss:',res);

    //setVerify_cernum(res.message); 클라단에 저장하지 않고 phone_identify phone_request에 저장해놓고, 그런 로직을 따른다.
  }

  const checkVaildate = () =>{
    return newphone.length > 9
   }

   useEffect(()=>{
     if(checkVaildate())
        setActive(true);
     else
        setActive(false);
   },)

    return (
        <Container>
            <ProfileTop>
              <WrapInputBox>
                <Box>
                  {/* <Label> 휴대전화 {login_userinfo.phone}</Label> */}
                  {/* <InputBox type="text" placeholder='기존 휴대폰전화' value={prevphone} onChange={prevphoneChange}/> */}

              <MUInput label="기존 전화번호" placeholder={`기존 휴대폰전화 ${login_userinfo.phone}`} value={prevphone}
                helperText="휴대번호를 '-' 빼고 입력해주세요."
                type="text" onChange={prevphoneChange} />


                </Box>
                <Box>

                  {/* <Label>변경 휴대전화</Label>
                  <InputBox type="text" placeholder="휴대번호를 '-'를 빼고 입력하여주세요." value={newphone} onChange={newphoneChange}/> */}
              <MUInput label='변경할 휴대폰 번호' helperText="휴대번호를 '-' 빼고 입력해주세요." type="text" onChange={newphone} placeholder='변경할 휴대폰 번호' onChange={newphoneChange}/>
                
                </Box>
              </WrapInputBox>
            </ProfileTop>
          {/*버튼*/}
            <Button>
              <ChangeBtn type="submit" name="" active={active} onClick={async () => {

                if(prevphone.length > 9 && newphone.length > 9){
                 

                  //기존 휴대폰번호값이 일치하는 경우에만 번호발송하며,일치하지않으면 보내지않음.
                  let prev_phone_info={
                    prevphone_val : prevphone,//해당 기존번호가 로그인해있는 유저의 번호값과 일치하는지 여부 기존번호를 맞게 입력한경우 여부 구분.
                  }
                  let prevphone_match_request= await serverController.connectFetchController("/api/mypage/prevphone_match_request","POST",JSON.stringify(prev_phone_info));
                  if(prevphone_match_request){
                    console.log('prevphone match request reulstsss:',prevphone_match_request);

                    if(prevphone_match_request.success){
                      //기존번호를 맞게 입력한경우.

                      updatePageIndex(1);cerModal();
                      
                      aligoSmsSend();
                    }else{
                      alert(prevphone_match_request.message);
                      return;
                    }
                  }
                  
                }else{
                  alert('휴대폰 번호를 제대로 입력하세요!');
                }
                
              }}>인증번호 발송</ChangeBtn>
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
  width:100%;
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
const Button = Sstyled.div`
  width: 408px;
  display:flex;justify-content:space-between;align-items:center;
  margin:50px auto 0;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    margin:calc(100vw*(50/428)) auto;
    }
`
const ChangeBtn = Sstyled.button`
  width:100%;
  height: 66px;
  line-height:60px;
  text-align:center;
  color:#fff;
  font-size:20px;transform:skew(-0.1deg);
  font-weight:800;
  border-radius: 11px;
  transition:all 0.3s;
  background:${({active}) => active ? "#01684b" : "#979797"};
  border:${({active}) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(180/428));
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
    }
`
