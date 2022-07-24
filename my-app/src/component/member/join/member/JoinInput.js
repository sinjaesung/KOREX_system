//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import serverController from '../../../../server/serverController';

//css
import styled from "styled-components";
//theme
import { TtCon_1col_input_2 } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

//added redux actions go
import { useSelector } from 'react-redux';
import { tempRegisterUserdataActions } from '../../../../store/actionCreators';

export default function JoinInput() {
  
  const tempregisteruserdata = useSelector(data => data.temp_register_userdata);

  const [email, setEmail] = useState("");/*기본값*/
  const [active, setActive] = useState(false);

  const emailChange = (e) => { setEmail(e.target.value); }


  const emailSend = async (e) => {

    if (email.length >= 1) {
      let body_info = { email: email };
      let res = await serverController.connectFetchController('/api/nodemailer/gmailSend', 'POST', JSON.stringify(body_info));

      if (res.success) {
        alert('이메일이 성공적으로 발송되었습니다!');
      } else if(res.success == false && res.message == "emali already exit"){
        alert('이미 가입된 이메일입니다.');
      }
      else {
        alert('이메일 전송에 문제가 있습니다.');
      }
    }

  }

  const checkValidate = () => {
    console.log('useEffect로 내부의 임의 프로퍼티내부값의 하나적 미시적 변화감지하여 함수 호출:', email);
    return email.length >= 1
  }


  useEffect(() => {
    if (checkValidate())
      setActive(true);
    else
      setActive(false);
  })

  return (
    <>
      <Wrapper>
        {/* <InputTitle>이메일</InputTitle> */}
        {/* <Input type="email" name="" placeholder="이메일을 입력해주세요." onChange={emailChange}/> */}
        <div className="par-spacing">
          <MUInput label="이메일" type="email" placeholder="이메일을 입력해주세요." onChange={emailChange} />
        </div>
        {/* <InputTitle>이름</InputTitle>
              <Input type="text" name="" placeholder="이름을 입력해주세요." onChange={nameChange}/>
              <InputTitle>휴대전화</InputTitle>
              <Input type="text" name="" placeholder="휴대번호를 '-'를 빼고 입력해주세요." onChange={phoneChange}/> */}
        {/*NextBtn(인증번호발송) 버튼 눌렀을때 show*/}
        {/*<InputCerNum type="text" name="" placeholder="인증번호를 입력하세요." id='inputcernum' style={{display:'none'}} onChange={cernumChange} />*/}
        {/*인증번호가 일치하지 않을때 Msg*/}
        {/*<ErrorMsg style={{display:"none"}}>휴대전화 인증번호가 일치하지 않습니다.</ErrorMsg>*/}


        {/* <NextBtn type="button" name="" active={active} onClick={emailSend}>인증메일 받기</NextBtn> */}
        <div className="par-spacing-before">
          <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={emailSend}>인증메일 받기</MUButton_Validation>
          {/*NextBtn(인증번호발송) 눌렀을때 show*/}
          {/*<Link to="/MemJoinAgree" id='memjoinagree_move' style={{display:'none'}}>
                  <Submit type="submit" name="" active={active}>다음</Submit>
                 </Link>*/}
         </div> 
         <div className="par-spacing-after">
          <Wrap_MUButton_R31>
            <MUButton_R31>
              <Link to="/MemberLogin" className="data_link" />
              로그인
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


const MUInput = styled(TextField)`
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