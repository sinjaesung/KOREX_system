//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import serverController from '../../../../server/serverController';

//css
import styled from "styled-components"
//theme
import { TtCon_1col_input_2 } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
//img
import Check from "../../../../img/member/check.png";
import Checked from "../../../../img/member/checked.png";

//added redux actions go
import { useSelector } from 'react-redux';
import { tempRegisterUserdataActions } from '../../../../store/actionCreators';

export default function JoinTab() {
  const history = useHistory();

  console.log('component>member>agency>joinselect 컴포넌트 실행=================');
  const tempregisteruserdata = useSelector(data => data.temp_register_userdata);

  console.log('tdata.temp_register_userdata refer info:', tempregisteruserdata, tempRegisterUserdataActions);

  const [name, setName] = useState("");/*기본값*/
  const [phone, setPhone] = useState("");/*기본값*/
  const [cernum, setCernum] = useState("");/*기본값*/
  const [verify_cernum, setVerify_cernum] = useState("");
  const [isceo, setIsceo] = useState(undefined); //대표인가 여부 (분양대행사회원)

  const [nextshow, setNextShow] = useState(false);

  const [active, setActive] = useState(false);
  const [active2, setActive2] = useState(false);

  const nameChange = (e) => { setName(e.target.value); }
  const phoneChange = (e) => { setPhone(e.target.value); }
  const cernumChange = (e) => { setCernum(e.target.value); }

  //알리고 전송.
  const aligoSmsSend = async (e) => {

    let body_info = {
      receiver: phone,
      msg: 'api test send',
      msg_type: 'SMS',
      title: 'api test입니다.',
      type: '분양대행사',
      destination: phone + '|' + name,
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

    document.getElementById('inputcernum').style.display = 'block';

    //누른시점때에 체크된 라디오값에 따라서 달리
    var is_company_ceo_radios = document.getElementsByClassName('is_company_ceo');
    var check_id;
    for (var ss = 0; ss < is_company_ceo_radios.length; ss++) {
      if (is_company_ceo_radios[ss].checked) {
        check_id = is_company_ceo_radios[ss].id;//check1,2
      }
    }

    console.log('인증번호 발송버튼 누른시점에 라디오 체크값여부:', check_id);
    if (check_id) {
      switch (check_id) {
        case 'check1':
          //사업자 대표이면 사업자정보등록페이지 넘기는 companyjoininfo버튼 제공
          document.getElementById('agencyJoinInfo_move').style.display = 'block';
          document.getElementById('agencyJoinAgree_move').style.display = 'none';
          break;

        case 'check2':
          //사업자 대표가 아니라면 사업자정보등록페이지 동일하게 넘김.
          document.getElementById('agencyJoinInfo_move').style.display = 'block';
          document.getElementById('agencyJoinAgree_move').style.display = 'none';
          break;
      }
    } else {
      //체크되어있는게 없다면 다음 버튼 보이지 않음. default값으로써, 사업자대표일때 넘기는 companyjoininfo버튼 제공
      document.getElementById('agencyJoinInfo_move').style.display = 'block';
      document.getElementById('agencyJoinAgree_move').style.display = 'none';
    }
    setNextShow(true);//다음버튼 누른시점부터 true값 항상 띈다.발송을 눌렀기에.

    //setVerify_cernum(res.message);
  }

  //라디오(대표 여부 변화에 따른 다음 버튼 달리 노출)
  const is_agency_ceo_changes = (e) => {
    console.log('라디오 대표 여부 변화에 따른 선택값:', e, e.target);

    //인증번호 발송버튼 누른 이후시점(눌러서 인증번호input이랑, 기본적 다음버튼 제공은 되는 상황이후부터만 수행가능)
    //누른시점때에 체크된 라디오값에 따라서 달리
    var is_company_ceo_radios = document.getElementsByClassName('is_agency_ceo');
    var check_id;
    for (var ss = 0; ss < is_company_ceo_radios.length; ss++) {
      if (is_company_ceo_radios[ss].checked) {
        check_id = is_company_ceo_radios[ss].id;//check1,2
      }
    }
    if (check_id) {
      if (nextshow) {
        switch (check_id) {
          case 'check1':
            //사업자 대표이면 사업자정보등록페이지 넘기는 companyjoininfo버튼 제공
            document.getElementById('agencyJoinInfo_move').style.display = 'block';
            document.getElementById('agencyJoinAgree_move').style.display = 'none';
            setIsceo(true);
            break;

          case 'check2':
            //사업자 대표가 아니여도 사업자정보등록페이지로 이동한다.
            document.getElementById('agencyJoinInfo_move').style.display = 'block';
            document.getElementById('agencyJoinAgree_move').style.display = 'none';
            setIsceo(false);
            break;
        }
      } else {
        switch (check_id) {
          case 'check1':
            //인증번호발송 버튼을 누르지 않은 상태에서 체크박스 한경우
            setIsceo(true);
            break;

          case 'check2':
            setIsceo(false);
            break;
        }
      }
    } else {
      //체크되어있는게 없다면 다음 버튼 보이지 않음.
    }
  }

  const checkVaildate = () => {
    return name.length > 2 && phone.length > 9
  }

  useEffect(() => {
    console.log('useEffect상태값변화(분양대행사 가입):', name, phone, cernum, verify_cernum, isceo);
    if (checkVaildate())
      setActive(true);
    else
      setActive(false);
  })

  //다음단계 버튼 누른경우에 넘길지 말지 여부
  const nextStep = async (e) => {
    e.preventDefault();
    console.log('nextStep 다음 스탭 a링크 클릭:', e, e.target);

    //해당 폰번호(수신자), 수신자에게로온 인증번호값(입력값)을 보내어서, 해당 폰번호로의 최신 발송(디비요청내역)중에 대해서 해당 입력cernum 이 발견되면 그 row는 삭제처리.
    let body_info = {
      phone_number: phone,
      cernum_number: cernum
    }
    var cernumchk_validate_result = await serverController.connectFetchController('/api/cernum_validate_process', 'POST', JSON.stringify(body_info));

    if (cernumchk_validate_result) {
      console.log('cernumchk_validate_resultss::', cernumchk_validate_result);

      if (cernumchk_validate_result.success) {
        //성공인 경우

        setActive2(true);

        tempRegisterUserdataActions.namechange({ names: name });
        tempRegisterUserdataActions.phonechange({ phones: phone });

        history.push('/AgencyJoinInfo');
      } else {
        //실패인 경우
        setActive2(false);//서버오류거나 인증유효시간지났거나, 인증번호 다르거나 그런경우에 넘어가지못하게끔.

        alert(cernumchk_validate_result.message);
      }
    }
  }

  return (
    <>
      <Wrapper>
        <div className="par-spacing"><p>소속팀원은 팀원이 추가되면 로그인할 수 있습니다.</p></div>
        <div className="par-spacing">
          <WrapChooseBox>
            <FormControl component="fieldset">
              <RadioGroup >
                <FormControlLabel value="check1" control={<Radio id="check1" className="is_agency_ceo" onChange={is_agency_ceo_changes} />} label="본인은 사업자 대표입니다." />
                <FormControlLabel value="check2" control={<Radio id="check2" className="is_agency_ceo" onChange={is_agency_ceo_changes} />} label="본인은 사업자 대표가 아닙니다." />
              </RadioGroup>
            </FormControl>





            {/* <ChooseBox>
            <Checkbox type="radio" name="agency" id="check1" className="is_agency_ceo" onChange={is_agency_ceo_changes} />
            <Label for="check1" className="chk_label">
              <Span className="chk_on_off"></Span>
              본인은 사업자 대표입니다.
            </Label>
          </ChooseBox>
          <ChooseBox>
            <Checkbox type="radio" name="agency" id="check2" className="is_agency_ceo" onChange={is_agency_ceo_changes} />
            <Label for="check2" className="chk_label">
              <Span className="chk_on_off"></Span>
              본인은 사업자 대표가 아닙니다.
            </Label>
          </ChooseBox> */}



          </WrapChooseBox>
        </div>

        {/*체크박스가 선택되면 아래 내용이 활성화 됩니다.( WrapChooseBox는 display:none처리되어야 함)*/}
        <WrapJoinInput>

          {/* <InputTitle>이름</InputTitle>
              <Input type="text" name="" placeholder="이름을 입력해주세요." onChange={nameChange}/>
              <InputTitle>휴대전화</InputTitle>
              <Input type="text" name="" placeholder="휴대번호를 '-'빼고 입력해주세요." onChange={phoneChange}/> */}
          <div className="par-spacing">
            <MUTextField label="이름" type="text" placeholder="이름을 입력해주세요." onChange={nameChange} />
          </div>
          <div className="par-spacing">
            <MUTextField label='휴대전화' type="tel" helperText="휴대번호를 '-' 빼고 입력해주세요." placeholder="휴대번호를 '-'빼고 입력해주세요." onChange={phoneChange} />
          </div>
          {/*NextBtn(인증번호발송) 버튼 눌렀을때 show*/}
          <div className="par-spacing" id='inputcernum' style={{ display: "none" }}>
            <InputCerNum type="text" name="" placeholder="인증번호를 입력하세요." id='inputcernum' onChange={cernumChange} />
          </div>
          {/* <MUInput label='인증번호' type="text" placeholder="인증번호를 입력하세요." id='inputcernum' onChange={cernumChange} style={{display:"none"}}/> */}
          {/*인증번호가 일치하지 않을때 Msg*/}
          <div className="par-spacing" style={{ display: "none" }}>
            <ErrorMsg>휴대전화 인증번호가 일치하지 않습니다.</ErrorMsg>
          </div>

          {/* <NextBtn type="button" name="" active={active} onClick={aligoSmsSend}>인증번호 발송</NextBtn> */}
          <div className="par-spacing-before">
            <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={aligoSmsSend}>인증번호 발송</MUButton_Validation>
          </div>
          {/*NextBtn(인증번호발송) 눌렀을때 show*/}
          {/*  1) 사업자 대표가 아닙니다 선택시 ( 약관동의 페이지 MemJoinAgree 로 넘어간다.) 사업자대표 or 비대표 모두 사업자정보등록페이지로 넘김. */}
          {/* <Link to="/AgencyJoinAgree">
            <Submit type="submit" name="" active2={active2} className='nextButtons' id='CompanyJoinAgree_move' style={{ display: "none" }} onClick={nextStep}>다음</Submit>
          </Link> */}
          <div className="par-spacing-before" id='agencyJoinAgree_move' style={{ display: "none" }}>
            <MUButton_Validation_2 variant="contained" type="submit" name="" active2={active2} onClick={nextStep}>
              <Link to="/AgencyJoinAgree" className="data_link" />
              다음
            </MUButton_Validation_2>
          </div>
          {/*  2) 사업자 대표 선택시 ( 사업자 정보 등록페이지로 넘어간다 ) */}
          {/* <Link to="/AgencyJoinInfo">
            <GoNextPage type="submit" name="" active2={active2} className='nextButtons' id='AgencyJoinInfo_move' style={{ display: "none" }} onClick={nextStep}>다음</GoNextPage>
          </Link> */}
          <div className="par-spacing-before" id='agencyJoinInfo_move' style={{ display: "none" }}>
            <MUButton_Validation_2 variant="contained" type="submit" name="" active2={active2} onClick={nextStep}>
              <Link to="/AgencyJoinInfo" className="data_link" />
              다음
            </MUButton_Validation_2>
          </div>
          <div className="par-spacing-after">
            <Wrap_MUButton_R31>
              <MUButton_R31>
                <Link to="/AgencyLogin" className="data_link" />
                로그인
              </MUButton_R31>
              <MUButton_R31>
                <Link to='/StandardPasswordfind' className="data_link" />
                비밀번호찾기
              </MUButton_R31>
            </Wrap_MUButton_R31>
          </div>
        </WrapJoinInput>
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
const WrapChooseBox = styled.div`
  background:#f7f8f8;
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
const WrapJoinInput = styled.div``

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
  &:nth-child(4){margin-bottom:0;}
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(43/428));
      font-size:calc(100vw*(14/428));
      margin-bottom:calc(100vw*(15/428));
    }
`
const InputCerNum = styled(Input)`
  @media ${(props) => props.theme.mobile} {
      margin-top:calc(100vw*(10/428));
    }
`