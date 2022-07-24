//react
import React ,{useState, useEffect} from 'react';
import {Link , useHistory} from "react-router-dom";

//css
import styled from "styled-components"

//img
import Check from "../../../../img/member/check.png";
import Checked from "../../../../img/member/checked.png";

//material-ui
import TextField from '@material-ui/core/TextField';
import { styled as MUstyled} from '@material-ui/core/styles'

//added redux actions go
import {useSelector } from 'react-redux';
import {tempRegisterUserdataActions } from '../../../../store/actionCreators';

//server process
import serverController from '../../../../server/serverController';

export default function JoinTab() {
  const history= useHistory();
  console.log('component>agency>joininput 컴포넌트 실행=============================');

  const tempregisteruserdata = useSelector(data => data.temp_register_userdata);
  console.log('data.temp_register_userdata refer info:',tempregisteruserdata,tempRegisterUserdataActions);

  const [name,setName] = useState("");/*기본값*/
  const [reginum1,setReginum1] = useState("");/*기본값*/
  const [reginum2,setReginum2] = useState("");/*기본값*/
  const [reginum3,setReginum3] = useState("");/*기본값*/

  const [active,setActive] = useState(false);

  const nameChange = (e) =>{ setName(e.target.value); }
  const regiChange1 = (e) =>{ setReginum1(e.target.value); }
  const regiChange2 = (e) =>{ setReginum2(e.target.value); }
  const regiChange3 = (e) =>{ setReginum3(e.target.value); }

  const checkVaildate = () =>{
    return name.length > 0 && reginum1.length == 3 && reginum2.length == 2 && reginum3.length == 5
   }

   useEffect(()=>{
     console.log('member>agency>joininput js페이지 useEffect상태값 변화:',name,reginum1,reginum2,reginum3,active);
     if(checkVaildate())
         setActive(true);
     else
         setActive(false);
   },)

   const nextStep = async (e) => {
    console.log('nextSTEP다음 스탭A링크 클릭:',e,e.target);
    e.preventDefault();

    var business_number = reginum1+reginum2+reginum3;
    if(active){
      //active값이 유효성 통과한(초록색)인경우에만 다음단계로 넘어갈수잇게끔.
      console.log('유효성 통과시에 통과되게끔 사업자번호,상호명');

      console.log('현재 최종적 확인 update값:',name,reginum1,reginum2,reginum3);

      //xxxxxxxxxxx형태 문자열인가 적절여부검사 기업,분양대행사 회원 또한 사업자등록번호 유효성 검사여부 클라이언트검사(홈택스인증) added
      var crnumber_sendinfo = {
        crNumber : business_number
      };
      console.log('crnumber validiaton send data:',JSON.stringify(crnumber_sendinfo));
      var cr_validation_result = await serverController.connectFetchController('/api/auth/agency/crNumber_validation','POST',JSON.stringify(crnumber_sendinfo));
      console.log('cr_valdiaton resultss:',cr_validation_result);

      if(cr_validation_result){
        if(cr_validation_result.result){
          console.log('사업자등록번호 클라단 유효성 검증여부 검사::',cr_validation_result.result);

          let result_object=cr_validation_result.result;

          if(result_object['message'].indexOf('등록되어 있지 않은')>=0 || result_object['messageEng'].indexOf('is not registered')>=0){
           
            alert(result_object['trtcntn']);
            
            return false;
          }else if(result_object['message'].indexOf('등록되어 있는')>=0 || result_object['messageEng'].indexOf('is registered')>=0){

            tempRegisterUserdataActions.businessnumberchange({businessnumbers : business_number});
            tempRegisterUserdataActions.businessnamechange({businessname: name});

            alert(result_object['trtcntn']);

            history.push(`/AgencyJoinAgree`);
          }
        }
      }
    }else{
      console.log('유효성 통과 못했을시(회색) 다음단계로 기본이벤트 막음');
      //e.preventDefault();
    }
  }

    return (
        <Container>
          <TopTxt>소속팀원은 팀원이 추가되면 로그인할 수 있습니다.</TopTxt>
          <WrapJoinInput>
            <InputTop>

            <MUTextField1 label="상호명" variant="outlined" type="text" name="" placeholder="상호명을 입력해주세요." onChange={nameChange}/>
            <InputTitle>사업자 등록번호</InputTitle>
            <RegistInputArea>
              <TextField variant="outlined" type="text" name="" onChange={regiChange1}/>
              <Dash>-</Dash>
              <TextField variant="outlined" type="text" name="" onChange={regiChange2}/>
              <Dash>-</Dash>
              <TextField variant="outlined" type="text" name="" onChange={regiChange3}/>
            </RegistInputArea>



              {/* <InputTitle>상호명</InputTitle>
              <Input type="text" name="" placeholder="상호명을 입력해주세요." onChange={nameChange}/>
              <InputTitle>사업자 등록번호</InputTitle>
              <RegistInput type="text" name="" onChange={regiChange1}/>
              <Dash>-</Dash>
              <RegistInput type="text" name="" onChange={regiChange2}/>
              <Dash>-</Dash>
              <RegistInput type="text" name="" onChange={regiChange3}/> */}
            </InputTop>
            <SubmitButton>
              <Link to="/AgencyJoinAgree" onClick={nextStep}>
                <Submit type="submit" name="" active={active}>다음</Submit>
              </Link>
            </SubmitButton>
          </WrapJoinInput>
        </Container>
  );
}

//material-ui
const RegistInputArea = styled.div`
  display: flex;
  flex-direction: column;
`
const MUTextField1 = MUstyled(TextField)`
  width : 100%;
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
    width:450px;
    margin:0 auto;
    padding-top:40px;
    @media ${(props) => props.theme.mobile} {
        width:calc(100vw*(370/428));
        padding-top:0;
      }
`
const TopTxt = styled.h2`
  font-size:15px;
  font-weight:800;
  transform:skew(-0.1deg);
  text-align:center;
  margin-bottom:80px;
`
const WrapChooseBox = styled.div`
  width:100%;
  background:#f7f8f8;
  padding:70px 0px 70px 100px;
`
const ChooseBox = styled.div`
  width:100%;
  margin-bottom:15px;
`
const Checkbox = styled.input`
  display:none;
  &:checked + .chk_label .chk_on_off {
    width:16px;height:16px;background:url(${Checked}) no-repeat;background-size:100% 100%;
    }
`
const Label = styled.label`
  font-size:15px;
  font-weight:500;transform:skew(-0.1deg);
  color:#4a4a4a;
  font-family:'nbg',sans-serif;
`
const Span = styled.span`
  width:16px;height:16px;display:inline-block;
  margin-right:24px;vertical-align:middle;
  background:url(${Check}) no-repeat; background-size:100% 100%;
`

const WrapJoinInput = styled.div`
    width:410px;
    margin:0 auto;
    padding-bottom:150px;
    @media ${(props) => props.theme.mobile} {
        width:100%;
        padding-bottom:calc(100vw*(100/428));
      }
`
const InputTop = styled.div`
    position:relative;
    width:100%;
    padding-bottom:60px;
    @media ${(props) => props.theme.mobile} {
        padding-bottom:calc(100vw*(50/428));
      }
`
const InputTitle = styled.label`
    display:block;
    font-size:12px;
    padding-left:7px;
    margin-bottom:10px;
    font-weight:600;
    transform:skew(-0.1deg);
    @media ${(props) => props.theme.mobile} {
        font-size:calc(100vw*(12/428));
        padding-left:calc(100vw*(7/428));
        margin-bottom:calc(100vw*(9/428));
      }
`
const Input = styled.input`
  width:100%;
  height:43px;
  transform:skew(0.1deg);
  font-weight:600;
  font-size:15px;
  margin-bottom:15px;
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
const RegistInput = styled.input`
  width:124px;height:43px;
  text-align:center;
  font-weight:600;
  font-size:15px;
  color:#4a4a4a;
  border-radius:4px;
  border:1px solid #e4e4e4;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(113/428));
      font-size:calc(100vw*(14/428));
      height:calc(100vw*(43/428));
    }
`
const Dash = styled.span`
  display:inline-block;
  margin:0 6px;vertical-align:middle;
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
      margin:0 calc(100vw*(5/428));
      font-size:calc(100vw*(10/428));
    }
`

const SubmitButton = styled.div`
  width:100%;
`
const Submit = styled.button`
  width:100%;
  height:66px;
  line-height:60px;
  font-size:20px;
  color:#fff;
  border-radius:11px;
  transition:all 0.3s;
  font-weight:800;
  background:${({active}) => active ? "#01684b" : "#979797"};
  border:${({active}) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(60/428));
      line-height:calc(100vw*(54/428));
      font-size:calc(100vw*(15/428));
    }
`

const ErrorMsg = styled.p`
  position:absolute;
  left:0;
  bottom:30px;
  width:100%;
  font-size:12px;color:#fe0101;
  font-weight:600;transform:skew(-0.1deg);
  text-align:center;
  @media ${(props) => props.theme.mobile} {
      bottom:calc(100vw*(18/428));
      font-size:calc(100vw*(12/428));
    }
`
