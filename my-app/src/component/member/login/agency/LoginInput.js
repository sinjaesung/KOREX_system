//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import serverController from '../../../../server/serverController';

//css
import styled from "styled-components";
//theme
import { TtCon_1col_input_2 } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function JoinInput() {
  const history = useHistory();
  const [phone, setPhone] = useState("");/*기본값*/
  const [pwd, setPwd] = useState("");/*기본값*/
  const [active, setActive] = useState(false);

  const phoneChange = (e) => { setPhone(e.target.value); }
  const pwdChange = (e) => { setPwd(e.target.value); }

  const checkVaildate = () => {
    return phone.length > 9 && pwd.length > 7
  }
  useEffect(() => {
    console.log('agencylogin inputs>>useEffect호출 상태 변화==============', phone, pwd);

    if (checkVaildate())
      setActive(true);
    else
      setActive(false);
  })

  const agency_login_submit = async (e) => {
    console.log('agency_login_submit 분양대행사 로그인 submit onclick발생==================', phone, pwd, active);

    if (active) {
      let body_info = {
        login_phone: phone,
        login_password: pwd
      };

      console.log('JSON.STINRIGFY(BODY_INFO):', JSON.stringify(body_info));

      let res = await serverController.connectFetchController('/api/auth/agency/login', 'post', JSON.stringify(body_info), function () { }, function (test) { console.log(test); });
      console.log('res results:', res);
      //alert(res);

      if (!res.success) {
        document.getElementById('loginfail').style.display = 'block';

        /*if(res.message.indexOf('팀원초대미수락')!=-1){
         //로그인자체 성공하였으나 초대미수락 회원이여서 페이지이동처리(팀원초대수락권유페이지) 해주는 분기작성.
         let login_request_userid = res.login_request;
         history.push('/TeamInvitefinal/'+login_request_userid);
       }*/
      } else {
        document.getElementById('loginfail').style.display = 'none';
        // alert(res.message);

       window.location.href='https://korexpro.com/Mypage'
      }
    }
  }
  return (
    <> 
      <Wrapper>
        <div className="par-spacing"><p>관리자외 소속팀원은 팀원추가 후 로그인 가능합니다.</p></div>
        <div className="par-spacing">
          <MUTextField label="휴대전화" type="text" helperText="휴대번호를 '-' 빼고 입력해주세요." onChange={phoneChange} />
        </div>
        <div className="par-spacing">
          <MUTextField label='비밀번호' type="password" onChange={pwdChange} />
        </div>
        {/* <InputTitle>휴대전화</InputTitle>
              <Input type="text" name="" placeholder="휴대번호를 '-' 빼고 입력해주세요." onChange={phoneChange}/>
              <InputTitle>비밀번호</InputTitle>
              <Input type="password" name="" placeholder="비밀번호를 입력해주세요." onChange={pwdChange}/> */}
        {/*아이디 또는 비밀번호가 일치하지 않을때 Msg*/}
        <div className="par-spacing" style={{ display: "none" }} id='loginfail'>
          <ErrorMsg >휴대폰번호 또는 비밀번호가 일치하지 않습니다.</ErrorMsg>
        </div>
        <div className="par-spacing-before">
          <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={agency_login_submit}>로그인</MUButton_Validation>
        </div>
        <div className="par-spacing-after">
          <Wrap_MUButton_R31>
            <MUButton_R31>
              <Link to="/AgencyJoin" className="data_link" />
              회원가입
            </MUButton_R31>
            <MUButton_R31>
              <Link to='/StandardPasswordfind' className="data_link" />
              비밀번호찾기
            </MUButton_R31>
          </Wrap_MUButton_R31>
        </div>
      </Wrapper>
    </>
  );
}

const MUTextField = styled(TextField)`
      &.MuiFormControl-root.MuiTextField-root {
        width:100%;
  }
      `
const MUButton = styled(Button)``

//----------------------------------------

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
const Wrap_MUButton_R31 = styled.div`
      display:flex;
      justify-content:space-between;
      align-items:center;
      `

const MUButton_R31 = styled(MUButton)`
      &.MuiButtonBase-root.MuiButton-root {
        font-size: 0.8125rem;
  }
      `
