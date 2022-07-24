//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components";
//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col_input_2, } from '../../../../theme';

//material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import { styled as MUstyled } from '@material-ui/core/styles';

export default function EmailChange({ setnewpasswordmatch, prevpassword, newpassword, newpasswordconfirm, setprevpassword, setnewpassword, setnewpasswordconfirm, newpasswordmatch, passwordModal , active}) {

  const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

  const prevpasswordChange = (e) => {
    setprevpassword(e.target.value);
  }
  const newpasswordChange = (e) => {
    setnewpassword(e.target.value);
  }
  const newpasswordconfirmChange = (e) => {
    setnewpasswordconfirm(e.target.value);
  }
  return (
    <>
      <Wrapper>
        <p className="tit-a2">비밀번호 변경</p>
        <Sect_R2>
          <div className="par-spacing">
            <MUTextField label='기존 비밀번호' type="password" onChange={prevpasswordChange} placeholder="" value={prevpassword} />
          </div>
          <div className="par-spacing">
            <MUTextField label='신규 비밀번호' helperText="문자,숫자,특수문자 포함 8자리 이상" type="password" onChange={newpasswordChange} placeholder="" value={newpassword} />
          </div>
          {/* 
                  <Label>변경 비밀번호<Span>(문자,숫자,특수문자 포함 8자리 이상)</Span></Label>
                  <InputBox type="password" placeholder="비밀번호를 입력하여주세요." value={newpassword} onChange={newpasswordChange}/>
                */}
          <div className="par-spacing">
            <MUTextField label='신규 비밀번호 확인' type="password" onChange={newpasswordconfirmChange} placeholder="" value={newpasswordconfirm} />
          </div>
          {/* <Label>변경 비밀번호 확인</Label>
                  <InputBox type="password" placeholder="비밀번호를 다시 입력하여주세요." value={newpasswordconfirm} onChange={newpasswordconfirmChange}/> */}
          {
            newpasswordmatch == false ?
              <div className="par-spacing">
                <ErrorMsg>비밀번호가 일치하지 않습니다.</ErrorMsg>
              </div>
              :
              null
          }


          {/*버튼*/}
          <div className="par-spacing">
            <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={() => {

              if (newpassword.length < 8 || newpasswordconfirm.length < 8) {
                alert('입력 비밀번호 조건을 지켜주세요.');
                return;
              }
              if (!pwRegex.test(newpassword)) {
                alert('문자,숫자,특수문자 포함 8자리 이상 조건을 지켜주세요.');
                setnewpassword('');
                setnewpasswordconfirm('');
                return;
              }
              if (newpasswordconfirm !== newpassword) {
                setnewpasswordmatch(false);

                return;
              }
              if(active)
                passwordModal();

            }}>변경</MUButton_Validation>
          </div>

          {/* <Button>
            <Link to="/MyProfileSetting">
              <CancleBtn type="submit" name="">취소</CancleBtn>
            </Link>
            <ChangeBtn type="submit" name="" onClick={() => {

              if (newpassword.length < 8 || newpasswordconfirm.length < 8) {
                alert('입력 비밀번호 조건을 지켜주세요.');
                return;
              }
              if (!pwRegex.test(newpassword)) {
                alert('문자,숫자,특수문자 포함 8자리 이상 조건을 지켜주세요.');
                setnewpassword('');
                setnewpasswordconfirm('');
                return;
              }
              if (newpasswordconfirm !== newpassword) {
                setnewpasswordmatch(false);

                return;
              }
              passwordModal();

            }}>변경</ChangeBtn>
          </Button> */}


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
const ErrorMsg = styled.p`
  font-size:0.75rem;
  color:#fe0101;
`

