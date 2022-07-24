//react
import React ,{useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_1col_input_2 } from '../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

//img
import Question from "../../img/member/question.png";
import WrapPwd from "../../img/member/pwdwrap.png";
import WrapPwdMb from "../../img/member/mb_pwdwrap.png";
import Close from "../../img/main/modal_close.png";

//server controlller
import serverController from '../../server/serverController';

export default function JoinInput({setemail,email,setcernum,cernum,next_step, emailvalid, phonevalid}) {

    const emailSend = async (e) => {

      if(!emailvalid){
        alert('이메일 입력양식을 확인해주세요!');
        return false;
      }
      console.log('nodemailer사용예정이며 nodemainling함수 호출, 최초의 origin관련 정보 식별 정보는 보낼필요있음:',emailvalid);
        
        if(email.length >=1){
          let body_info = { email: email};
          let res = await serverController.connectFetchController('/api/nodemailer/gmailSend2','POST',JSON.stringify(body_info));
    
          console.log('email send resultss::',res);
    
          if(res.success){
            alert('이메일이 성공적으로 발송되었습니다!');
          }else{
            alert('이메일 전송에 문제가 있습니다.');
          }
        }
        
      }
      return (
        <Container>
          <Wrapper>
    
            <div className="par-spacing">
              <MUTextField type="text" label="이메일" variant="outlined" placeholder="이메일을 입력해주세요" onChange={(e) => { setemail(e.target.value); }} />
            </div>
            <div className="par-spacing">
              <MUTextField type="text" label="인증번호" variant="outlined" placeholder="인증번호를 입력해주세요" onChange={(e) => { setcernum(e.target.value); }} />
            </div>
            {/* <InputRow>
                  <InputTitleTop>
                    <Title>이메일</Title>
                  </InputTitleTop>
                  <Pwd type="text" name="" placeholder="이메일을 입력해주세요" onChange={(e)=>{ setemail(e.target.value);}}/>
                </InputRow>
                <InputRow style={{"margin-bottom":0}}>
                  <InputTitle>인증번호</InputTitle>
                  <PwdConfirm type="text" name="" placeholder="인증번호를 입력해주세요" onChange={(e)=> { setcernum(e.target.value);}}/>
                </InputRow> */}
    
    
            {/* <JoinBtn type='submit' name='' onClick={emailSend}>인증메일받기</JoinBtn>
              <JoinBtn type='submit' name='' onClick={next_step}>찾기</JoinBtn> */}
    
            <div className="par-spacing">
            <MUButton_Validation variant="contained" type ="submit" name="" active={emailvalid} onClick={emailSend}>인증메일 받기</MUButton_Validation>
            </div>
            <div className="par-spacing">
            <MUButton_Validation variant="contained" type ="submit" name="" active={emailvalid} onClick={next_step}>찾기</MUButton_Validation>
            </div>
          </Wrapper>
        </Container >
      );
    }
    
    const MUTextField = styled(TextField)`
    &.MuiFormControl-root.MuiTextField-root {
      width:100%;
    }  
    `
    const MUButton = styled(Button)``
    
    //-----------------------------------------------
    const Container = styled.div`
       ${TtCon_Frame_B}
    `
    const Wrapper = styled.div`
      ${TtCon_1col_input_2}
    `
    const ErrorMsg = styled.p`
      font-size:0.75rem;
      color:#fe0101;
    `
    const MUButton_Validation = MUstyled(MUButton)`
      &.MuiButtonBase-root.MuiButton-root{
        background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
        color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
        box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
        width:100%;
      }
    `