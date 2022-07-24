//react
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

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

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

//server controlller
import serverController from '../../server/serverController';

export default function JoinInput({ setusertype,usertype, setphone, phone, setcernum, cernum, next_step , phonevalid }) {

  const aligoSmsSend = async (e) => {
    if(!phonevalid){
      alert('유효하지 않은 휴대폰번호 양식입니다!');
      return false;
    }
    console.log('aligosms send발송함수 호출:', phone);//새로운폰번호로 발송해야한다.

    let body_info = {
      receiver: phone,
      msg: 'api test send',
      msg_type: 'SMS',
      title: 'api test입니다.',
    };

    let res = await serverController.connectFetchController('/api/aligoSms', 'POST', JSON.stringify(body_info));
    console.log('res resultss resultss:', res);

    if (res.success) {
      alert('문자 전송 성공했습니다.');
    } else {
      alert(res.message);
    }
    //setVerify_cernum(res.message); 클라단에 저장하지 않고 phone_identify phone_request에 저장해놓고, 그런 로직을 따른다.
  }
  return (
    <Container>
      <Wrapper>
        <div className="par-spacing">
          <FormControl>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={usertype}
              onChange={(e)=>{ setusertype(e.target.value);}}
            >
              <MenuItem value={"기업"} selected={usertype == '기업' ? true : false}>기업</MenuItem>
              <MenuItem value={"중개사"} selected={usertype == '중개사' ? true : false}>중개사</MenuItem>
              <MenuItem value={"분양대행사"} selected={usertype == '분양대행사' ? true : false}>분양대행사</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="par-spacing">
          <MUTextField type="text" label="휴대폰번호" variant="outlined" placeholder="휴대폰번호를 입력해주세요" onChange={(e) => { setphone(e.target.value); }} />
        </div>
        <div className="par-spacing">
          <MUTextField type="text" label="인증번호" variant="outlined" placeholder="인증번호를 입력해주세요" onChange={(e) => { setcernum(e.target.value); }} />
        </div>
        {/* 
            <InputRow>
              <InputTitleTop>
                <Title>휴대폰번호</Title>
              </InputTitleTop>
              <Pwd type="text" name="" placeholder="휴대폰번호를 입력해주세요" onChange={(e)=>{ setphone(e.target.value);}}/>
            </InputRow>
            <InputRow style={{"margin-bottom":0}}>
              <InputTitle>인증번호</InputTitle>
              <PwdConfirm type="text" name="" placeholder="인증번호를 입력해주세요" onChange={(e)=> { setcernum(e.target.value);}}/>
            </InputRow> */}

        <div className="par-spacing">
          <MUButton_Validation variant="contained" type="submit" name="" active={phonevalid} onClick={aligoSmsSend}>인증번호받기</MUButton_Validation>
        </div>
        <div className="par-spacing">
          <MUButton_Validation variant="contained" type="submit" name="" active={phonevalid} onClick={next_step}>찾기</MUButton_Validation>
        </div>
        {/* <JoinBtn type='submit' name='' onClick={aligoSmsSend}>인증번호받기</JoinBtn>
          <JoinBtn type='submit' name='' onClick={next_step}>찾기</JoinBtn> */}
      </Wrapper >
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
const Sect_EndButton = styled.div`
  margin: 1.25rem 0 2.5rem;
`
const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`