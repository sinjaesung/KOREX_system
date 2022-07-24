//react
import React ,{useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";

//material-ui
import TextField from '@mui/material/TextField';
import { styled as MUstyled } from '@material-ui/core/styles';

//css
import styled from "styled-components"
//img
import Question from "../../../../img/member/question.png";
import WrapPwd from "../../../../img/member/pwdwrap.png";
import WrapPwdMb from "../../../../img/member/mb_pwdwrap.png";
import Close from "../../../../img/main/modal_close.png";

export default function JoinInput({pwd,pwdShow,setPwdShow,setPwd,pwdConfirm,setPwdConfirm,setActive}) {

    const pwdChange = (e) =>{ setPwd(e.target.value); }
    const pwdConfirmChange = (e) =>{ setPwdConfirm(e.target.value); }

    useEffect( () => {
      console.log('brokeer>joinpwd compont내부 요소 변화 발생 pwd변화밠생:',pwd,pwdConfirm);

      if(pwd == pwdConfirm){
        document.getElementById('passwordError').style.display='none';
      }else{
        document.getElementById('passwordError').style.display='block';
      }
    })
    return (
        <Container>
          <InputTop>
            <InputRow>
              <InputTitleTop>
                {/* <Title>비밀번호</Title> */}

                <PwdSetting>
                  <Link onClick={()=>{setPwdShow(true)}}>
                    <Img src={Question}/>
                    <Span>비밀번호 규정</Span>
                  </Link>
                  {/*비밀번호 규정 눌렀을때 나오는 pop*/}
                {
                  pwdShow ?
                  <PwdPop>
                    <PwdPopBg onClick={()=>{setPwdShow(false)}}/>
                    <WrapPwdBox>
                      <CloseBtn>
                        <Link onClick={()=>{setPwdShow(false)}}>
                          <CloseImg src={Close}/>
                        </Link>
                      </CloseBtn>
                      <InfoTxt>
                        <Div>- 영문대문자1개,영문소문자1개,숫자1개,특수문자1개를 반드시 포함</Div>
                        <Div>- 비밀번호 길이 8-12자까지 사용가능</Div>
                        <Div>- 아이디와4자이상 동일하거나 연속되는 숫자,문자는 사용불가 )</Div>
                      </InfoTxt>
                    </WrapPwdBox>
                  </PwdPop>

                  :
                  null
                }
                </PwdSetting>

              </InputTitleTop>
            {/*<MUTextField id="outlined-basic" label="비밀번호" placeholder="비밀번호를 입력해주세요." onChange={pwdChange} variant="outlined" />*/}
              {/*<Pwd type='password' name='' placeholder='비밀번호를 입력해주세요.' maxlength="2" onChange={pwdChange}/>*/}
              <MUTextField id='outline-basic' label='비밀번호' placeholder='비밀번호를 입력해주세요.' onChange={pwdChange} type='password' variant='outlined'/>
              {/* <Pwd type="password" name="" placeholder="비밀번호를 입력해주세요." maxlength="2" onChange={pwdChange}/> */}
            </InputRow>

            <InputRow style={{"margin-bottom":0}}>
            <MUTextField id="outlined-basic"  label="비밀번호 확인" placeholder="비밀번호를 한번 더 입력해주세요." onChange={pwdConfirmChange} type='password' variant="outlined" />
             {/*<PwdConfirm type='password' name='' placeholder='비밀번호를 한번 더 입력해주세요.' maxlength="2" onChange={pwdConfirmChange}/>*/}
              {/* <InputTitle>비밀번호 확인</InputTitle>
              <PwdConfirm type="password" name="" placeholder="비밀번호를 한번 더 입력해주세요." maxlength="2" onChange={pwdConfirmChange}/> */}
            </InputRow>

          {/*비밀번호가 일치하지 않을때 show*/}
            <ErrorMsg style={{display:"none"}} id='passwordError'>비밀번호가 일치하지 않습니다.</ErrorMsg>
          </InputTop>
        </Container>
  );
}

const MUTextField = MUstyled(TextField)`
  margin-top: 5px;
  width: 100%;
`

const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = styled.div`
    width:410px;
    margin:50px auto 0;
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(370/428));
      margin:calc(100vw*(40/428)) auto 0;
    }
`
const InputTop = styled.div`
    width:100%;
    position:relative;
    padding-bottom:40px;
    @media ${(props) => props.theme.mobile} {
      padding-bottom:calc(100vw*(30/428));
    }
`
const InputRow = styled.div`
    width:100%;
    margin-bottom:17px;
    &:last-child{margin-bottom:0;}
    @media ${(props) => props.theme.mobile} {
      margin-bottom:calc(100vw*(15/428));
      &:last-child{margin-bottom:0;}
    }
`
const InputTitle = styled.div`
    display:inline-block;
    font-size:12px;
    padding-left:7px;
    margin-bottom:10px;
    font-weight:600;
    transform:skew(-0.1deg);
    @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(12/428));
      padding-left:calc(100vw*(7/428));
      margin-bottom:calc(100vw*(15/428));
    }
`
const InputTitleTop = styled.div`
    display:flex;justify-content:space-between;align-items:center;
    width:100%;
`
const Title = styled(InputTitle)`
`
const PwdSetting = styled.div`
  position:relative;
  display:flex;justify-content:flex-start;align-items:center;
`
const Img = styled.img`
  display:inline-block;
  width:13px;margin-right:11px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(13/428));
    margin-right:calc(100vw*(11/428));
  }
`
const Span = styled.span`
  display:inline-block;
  font-size:12px;font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
  }

`
const Pwd = styled.input`
  width:100%;
  height:43px;
  transform:skew(0.1deg);
  font-size:15px;
  color:#979797;
  text-align:center;
  border-radius:4px;
  border:1px solid #e4e4e4;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(43/428));
    font-size:calc(100vw*(14/428));
  }

`
const PwdConfirm = styled(Pwd)`
`
const PwdPop = styled.div`
  width:100%;
  position:absolute;
`
const WrapPwdBox = styled.div`
  position:Absolute;
  width:396px;height:107px;
  left:110px;top:50%;transform:translateY(-50%);
  background:url(${WrapPwd}) no-repeat; background-size:100% 100%;
  z-index:2;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(255/428));
    height:calc(100vw*(149/428));
    left:calc(100vw*(-260/428));
    top:calc(100vw*(45/428));
    background:url(${WrapPwdMb}) no-repeat;background-size:100% 100%;
  }
`
const PwdPopBg = styled.div`
  position:fixed;
  left:0;top:0;
  width:100%;height:100%;background:transparent;
  z-index:1;content:'';display:block;
`
const InfoTxt = styled.div`
  width:100%;height:100%;
  padding:25px 28px 15px;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(35/428)) calc(100vw*(28/428)) calc(100vw*(15/428)) calc(100vw*(20/428));
  }
`
const Div = styled.p`
  font-size:12px;color:#707070;
  margin-bottom:8px;
  font-weight:600;
  transform:skew(-0.1deg);
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(5/428));
    word-break:keep-all;
  }
`
const CloseBtn = styled.div`
  position:absolute;
  right:15px;top:10px;
  @media ${(props) => props.theme.mobile} {
    right:calc(100vw*(20/428));
    top:calc(100vw*(15/428));
  }
`
const CloseImg =styled.img`
  display:inline-block;width:8px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(8/428));
  }
`
const ErrorMsg =styled.p`
  position:absolute;
  width:100%;text-align:center;
  left:0;bottom:10px;
  font-size: 12px;color:#FE0101;
  font-weight:600;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    bottom:calc(100vw*(0/428));
  }
`
