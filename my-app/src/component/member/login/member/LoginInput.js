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
import Alert from '@material-ui/core/Alert';
import AlertTitle from '@material-ui/core/AlertTitle';

export default function JoinInput() {

  const history = useHistory();

  console.log('member>login 개인로그인 페이지 랜더링');
  console.log('ServercONTOLLER:', serverController.connectFetchController);

  const [email, setEmail] = useState("");/*기본값*/
  const [pwd, setPwd] = useState("");/*기본값*/
  const [active, setActive] = useState(false);

  const [authError, setAuthError] = useState(false);//authError가 true이면 보이고, false이면 안보이게처리.

  const emailChange = (e) => {
    setEmail(e.target.value);
  }
  const pwdChange = (e) => {
    setPwd(e.target.value);
  }

  const checkVaildate = () => {
    return email.length > 10 && pwd.length > 7
  }
  useEffect(() => {
    console.log('MEMBERLOGIN INPUTS >> USEEFFECT호출 상태변화===============', email, pwd);
    if (checkVaildate())
      setActive(true);
    else
      setActive(false);
  })

  //로그인 버튼(submit)발생시에 요청 실행
  const member_login_submit = async (e) => {
    console.log('member_login_submit 개인 로그인 submit onclick발생=================', email, pwd, active);

    //이메일,암호 입력
    if (active == true) {
      let body_info = {
        login_email: email,
        login_password: pwd
      };
      console.log('JSON.STIRNGIFY(BODY_INFO):', JSON.stringify(body_info));

      let res = await serverController.connectFetchController(`/api/auth/member/login`, "POST", JSON.stringify(body_info), function () { }, function (test) { console.log(test) });
      console.log('res results:', res);
      //alert(res);
      if (!res.success) {
        document.getElementById('loginfail').style.display = 'block';
      } else {
        document.getElementById('loginfail').style.display = 'none';
        // alert(res.message);

        //로그인 성공시 페이지 이동->>> 로그인이 서버에서 반영되어 관련 쿠키세션반영되었지만, 클라단에서 app.js에서 그걸 update정보를 감지해야하기에.
        //history.push('/');
        window.location.href = 'https://korexpro.com/Mypage';
      }

    }
  }

  return (
    <>
      <Wrapper>
        <div className="par-spacing">
          <MUTextField label="이메일" type="email" onChange={emailChange} />
        </div>
        <div className="par-spacing">
          <MUTextField label='비밀번호' type="password" onChange={pwdChange} />
        </div>
        {/* <InputTitle>이메일</InputTitle>
              <Input type="email" name="" placeholder="이메일을 입력해주세요." onChange={emailChange}/> */}
        {/* <InputTitle>비밀번호</InputTitle>
              <Input type="password" name="" placeholder="비밀번호를 입력해주세요." onChange={pwdChange}/> */}
        {/*아이디 또는 비밀번호가 일치하지 않을때 Msg*/}
        <div className="par-spacing" style={{ display: "none" }} id='loginfail'>
        <ErrorMsg authError={authError}>아이디 또는 비밀번호가 일치하지 않습니다.</ErrorMsg>
        </div>
        <div className="par-spacing-before">
          <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={member_login_submit}>로그인</MUButton_Validation>
        </div>
        <div className="par-spacing-after">  
          <Wrap_MUButton_R31>
            <MUButton_R31>
              <Link to="/MemberJoin" className="data_link" />
              회원가입
            </MUButton_R31>
            <MUButton_R31>
              <Link to='/MemberPasswordfind' className="data_link" />
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
