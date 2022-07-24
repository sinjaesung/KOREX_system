//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_1col_input_2, } from '../../../../theme';

//material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import { styled as MUstyled } from '@material-ui/core/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

//redux
import { useSelector } from 'react-redux';

//server contorller
import serverController from '../../../../server/serverController';

export default function EmailChange({ emailChangeStartModal, emailModal, changeemail, setChangeemail, cernum, setCernum, emailactive, finalactive }) {

  const login_userinfo = useSelector(data => data.login_user);
  /*const prevemail_change= (e) =>{    
    setPrevemail(e.target.value);
  }*/
  const changeemail_change = (e) => {
    setChangeemail(e.target.value);
  }
  const cernum_change = (e) => {
    setCernum(e.target.value);
  }

  const emailSend = async (e) => {
    console.log('nodemiilaer사용예정이며 nodemainling함수를 최초의 origin관련정보 식별정보는 보낼필요있음');

    if (changeemail.length >= 1) {
      if(emailactive){
        //이메일이 유효한경우에만 처리>>
        let body_info = { email: changeemail };
        let res = await serverController.connectFetchController('/api/nodemailer/gmailSend2', 'POST', JSON.stringify(body_info));
        //console.log('email send reusltss:',res);
  
        if (res.success) {
          alert('이메일 성공적 발송되었습니다.');
        } else {
          alert('이메일 전송에 문제가 있습니다.');
        }
      } 
    }else {
      alert('변경할 이메일을 입력해주세요!');
    }   
  }
  return (
    <>
      <Wrapper>
        <p className="tit-a2">이메일 변경</p>
        <Sect_R2>
          <div className="par-spacing">
            <MUTextField_WithIcon label='이메일' type="email" onChange={changeemail_change} placeholder='이메일' value={changeemail}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => { emailChangeStartModal(); }}>
                      <CancelIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            </div>
            {/* <Label>변경 이메일</Label>
                  <InputBox type="text" placeholder="변경하실 이메일을 입력하여주세요." value={changeemail} onChange={changeemail_change}/> */}

            <div className="par-spacing">
            <MUTextField label='인증번호' type="text" onChange={changeemail_change} placeholder='?자리 인증번호를 입력해주세요' value={cernum} onChange={cernum_change} />
            </div>
            {/* 
                  <Label>인증번호</Label>
                  <InputBox type="text" placeholder='전달받은 인증번호를 입력해주세요.' value={cernum} onChange={cernum_change}/> */}
        
          <div className="par-spacing">
            <MUButton_Validation variant="contained" type="submit" name="" active={emailactive} onClick={emailSend}>인증번호 받기</MUButton_Validation>
            {/* <MUButton variant="contained" ype="submit" name="" onClick={() => { emailModal(); }}>변경</MUButton>
            <Link to="/MyProfileSetting" >
              <MUButton variant="contained" type="submit">
                취소
              </MUButton>
            </Link> */}
             
          </div>
          <div className="par-spacing">
            <MUButton_Validation variant="contained" type="submit" name="" active={finalactive} onClick={emailModal}>변경</MUButton_Validation>            
          </div>
          
          {/* <Button>
            <ChangeBtn type="submit" name="" onClick={emailSend}>인증번호 받기</ChangeBtn>
          </Button>

          <Button>
            <Link to="/MyProfileSetting">
              <CancleBtn type="submit" name="">취소</CancleBtn>
            </Link>
            <ChangeBtn type="submit" name="" onClick={() => { emailModal(); }}>변경</ChangeBtn>
          </Button> */}

        </Sect_R2>
      </Wrapper>
    </>
  );
}
const MUButtonArea = styled.div`
  display: flex;
  flex-direction: column;
`
const MUButton = MUstyled(Button)`
  margin-bottom: 5px;
  width : 100%;
`
const MUTextField = styled(TextField)`
  &.MuiFormControl-root.MuiTextField-root {
    width:100%;
  } 
`
const MUTextField_WithIcon = styled(MUTextField)`
  & .MuiButtonBase-root.MuiIconButton-root{
    margin: 0px -12px 0px 0px;
  }
`

//---------------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

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
