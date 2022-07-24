//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import serverController from '../../../../server/serverController';

//css
import styled from "styled-components"
//theme
import { TtCon_1col_input_2 } from '../../../../theme';

//component
import JoinTopTxt from "./JoinTopTxt";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

//img
import Check from "../../../../img/member/check.png";
import Checked from "../../../../img/member/checked.png";

//added redux actionsgo gogog
import { useSelector } from 'react-redux';
import { tempRegisterUserdataActions } from '../../../../store/actionCreators';

export default function JoinTab() {
  const history = useHistory();
  console.log('compoent>member/broker>joininput 컴포넌트 실행');

  const tempregisteruserdata = useSelector(data => data.temp_register_userdata);

  console.log('data.temp_register_userdata refer infio:', tempregisteruserdata, tempRegisterUserdataActions);

  const [phone, setPhone] = useState("");/*기본값*/
  const [cernum, setCernum] = useState("");/*기본값*/
  const [verify_cernum, setVerify_cernum] = useState("");

  const [active, setActive] = useState(false);
  const [active2, setActive2] = useState(false);

  const phoneChange = (e) => { setPhone(e.target.value); }
  const cernumChange = (e) => { setCernum(e.target.value); setActive2(true); }

  const checkVaildate = () => {
    return phone.length > 9
  }

  useEffect(() => {
    if (checkVaildate())
      setActive(true);
    else
      setActive(false);
  })

  /*const coolSmsSend= async(e) => {
    console.log('coolsmsSend발송 함수 호출 member broker josininput요소 고유 현재의값 phone,cernum',phone,cernum);

    let body_info= {number: phone};
    let res=await serverController.connectFetchController('/api/coolsms/sendprocess','post',JSON.stringify(body_info));
    console.log('res results coolsms:',res);

    document.getElementById('inputcernum').style.display='block';

    setVerify_cernum(res.sms_message);

    document.getElementById('broker_joinsearchResult_move').style.display='block';
  }*/

  const aligoSmsSend = async (e) => {
    console.log('aligosmsSend발송함수 호출:', phone, cernum);

    let body_info = {
      receiver: phone,
      msg: 'api test send',
      msg_type: 'SMS',
      title: 'api test입니다.',
      type: '중개사',
      destination: phone + '|' + 'dddd',
      //rdate : new Date(),
      //rtime : '',
    };

    let res = await serverController.connectFetchController('/api/join/aligoSms', 'POST', JSON.stringify(body_info));
    if(res.success == false && res.message == "phone already exit"){
      alert('이미 가입된 번호입니다.');
      return
    }
    else
      alert("인증번호가 발송되었습니다.");

    console.log('aligosms send res reusltsss:', res);

    document.getElementById('inputcernum').style.display = 'block';

    document.getElementById('broker_joinsearchResult_move').style.display = 'block';
  }

  const nextStep = async (e) => {
    e.preventDefault();
    console.log('중개사 휴대폰인증 중개사통과후에 다음버튼 누르면나오는 페이지, joinsearchREulst검색중개사결과페이지:', e, e.target);

    //해당 폰번호 수신자에게로온 인증번호값 보내어서 해다 ㅇ폰번호로의 최신발송에 대해서 해당입력cernum 발견되면 그 row는 삭제처리.
    let body_info = {
      phone_number: phone,
      cernum_number: cernum
    };
    var cernumchk_validate_result = await serverController.connectFetchController("/api/cernum_validate_process", 'POST', JSON.stringify(body_info));

    if (cernumchk_validate_result) {
      console.log('cernumchk_vliadatie_resultss:', cernumchk_validate_result);
      console.log('cernumchk_vliadatie_resultss:', cernumchk_validate_result.success);

      if (cernumchk_validate_result.success) {
        setActive2(true);
        // document.getElementById('cernum_invalid').style.display = 'none';
        tempRegisterUserdataActions.phonechange({ phones: phone });

        history.push('/JoinSearchResult');
      } else {
        setActive2(false);
        // document.getElementById('cernum_invalid').style.display = 'block';
        alert(cernumchk_validate_result.message);//서버오류 또는 인증번호다름or 인증유효시간지남.

      }
    }
  }

  return (
    <>
      {/*체크박스가 선택되면 아래 내용이 활성화 됩니다.( WrapChooseBox는 display:none처리되어야 함)*/}
      <Wrapper>
      
          {/* <InputTitle>휴대전화</InputTitle>
              <Input type="text" name="" placeholder="휴대번호를 '-'를 빼고 입력해주세요." onChange={phoneChange}/> */}
          <div className="par-spacing">
          <MUInput label='휴대전화' type="tel" helperText="휴대번호를 '-' 빼고 입력해주세요." placeholder="휴대번호를 '-'빼고 입력해주세요." onChange={phoneChange} />
          </div>
          {/*NextBtn(인증번호발송) 버튼 눌렀을때 show*/}
          <div className="par-spacing" id='inputcernum' style={{ display: "none" }}>
          <InputCerNum type="text" name="" placeholder="인증번호를 입력하세요." onChange={cernumChange} />
          </div>
          {/*인증번호가 일치하지 않을때 Msg*/}
          <div className="par-spacing" style={{ display: "none" }} id='cernum_invalid'>
         <ErrorMsg >휴대전화 인증번호가 일치하지 않습니다.</ErrorMsg>
         </div>     
         <div className="par-spacing-before">
          <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={aligoSmsSend}>인증번호 발송</MUButton_Validation>
         </div>
         <div className="par-spacing-before"> 
          <MUButton_Validation_2 variant="contained" type="submit" name="" active2={active2} id='broker_joinsearchResult_move' style={{ display: "none" }} onClick={nextStep}>
            {/* <Link to="/JoinSearchResult" className="data_link" /> */}
            다음
          </MUButton_Validation_2>
         </div>
         <div className="par-spacing-after"> 
          <Wrap_MUButton_R31>
            <MUButton_R31>
              <Link to="/BrokerLogin" className="data_link" />
              로그인
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


const MUInput = MUstyled(TextField)`
  &.MuiFormControl-root.MuiTextField-root {
    width:100%;
  }  
`
const MUButton = MUstyled(Button)``

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
const MUButton_Validation_2 = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active2, theme }) => active2 ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active2, theme }) => active2 ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active2, theme }) => active2 ? theme.palette.shadows : "none"}; 
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
//------------------------


const Input = styled.input`
  width:100%;
  height:43px;
  transform:skew(0.1deg);
  font-weight:600;
  font-size:15px;
  color:#4a4a4a;
  text-align:center;
  border-radius:4px;
  border:1px solid #e4e4e4;
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(14/428));
    }
`
const InputCerNum = styled(Input)`
  margin-top:10px;
  @media ${(props) => props.theme.mobile} {
      margin-top:calc(100vw*(10/428));
    }
`
