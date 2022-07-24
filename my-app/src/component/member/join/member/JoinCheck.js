//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


//Img
import AllImg from "../../../../img/member/all_check.png";
import Check from "../../../../img/member/check.png";
import Checked from "../../../../img/member/checked.png";

//redux데이터 접근, submit시에 보내기(쿠키저장?, 상태값 데이터 유지됀것 받아서 보내기)
import { useSelector } from 'react-redux';
import { tempRegisterUserdataActions } from '../../../../store/actionCreators';

export default function JoinSns({agreeStatus, setAgreeStatus, setActive, active, agreePossible, setAgreePossible , member_submit_function}) {
    //전체 선택 체크박스 ! !
    const [allCheck, setAllCheck] = useState(false);//여기 자체의 값(올체크 여부)

    const [CheckOption1, setCheckOption1] = useState(false);
    const [CheckOption2, setCheckOption2] = useState(false);
    const [CheckOption3, setCheckOption3] = useState(false);
    const [CheckOption4, setCheckOption4] = useState(false);
    const [CheckOptional, setCheckOptional] = useState(false)
    
    const tempregisteruserdata = useSelector(data => data.temp_register_userdata);

    console.log('data.temp_register_userdata refer info:',tempregisteruserdata, tempRegisterUserdataActions);

    //전체 체크박스 체크상태변화여부
    const allcheck_status_change = (e) =>{
       console.log('전체동의체크박스 체크여부 상태 변화발생:',e,e.target);
       
       console.log('체크여부상태:',e.target.checked);//체크를 한경우에(클릭시에 체크가 된 경우)에는 모두 체크한다.

       let agree_status_string='';

       if(e.target.checked){
         setAllCheck(true);//allCheck true상태.
         setCheckOption1(true);
         setCheckOption2(true);
         setCheckOption3(true);
         setCheckOption4(true);
         setCheckOptional(true);
        //  console.log(document.getElementsByClassName('agree_checks'));
        //  let agree_checks=document.getElementsByClassName('agree_checks');
         let agree_checks = document.getElementsByName('essential');
         console.log(agree_checks.length);
         
         for(let i=0; i<agree_checks.length; i++){
           agree_checks[i].checked=true;
          //  console.log('동작 : '+agree_checks[i].checked);
           if(i == agree_checks.length-1){
             agree_status_string += (agree_checks[i].id);
            }else{
              agree_status_string += (agree_checks[i].id+',');
            }           
          }
         console.log(agree_status_string);
          //올 체크를 했기에 필수도 다 체크됐기에 통과이다.
          setAgreePossible(true);
        }else{
          setAllCheck(false);
         setCheckOption1(false);
         setCheckOption2(false);
         setCheckOption3(false);
         setCheckOption4(false);
         setCheckOptional(false);
          // let agree_checks=document.getElementsByClassName('agree_checks');
          let agree_checks = document.getElementsByName('essential');
         for(let i=0; i<agree_checks.length; i++){
          agree_checks[i].checked=false;
          
        }
        agree_status_string='';
        //모두 체크해제했기에 필수 해제됐기에 비통과이다.
        setAgreePossible(false);
       }
       setAgreeStatus(agree_status_string); 
       console.log('agree_status_string:',agree_status_string);     
    }
    //동의 체크박스 개개별 체크상태변화여부
    const agreecheck_status_change = (e) => {
      // console.log('동의체크박스 개개별 체크 여부 상태 변화발생간주(click):',e,e.target);

      console.log(e.target.checked);
      console.log(e.target.id);

      switch (e.target.id) {
        case "agree_essential1":
          setCheckOption1(e.target.checked)
          break;
        case "agree_essential2":
          setCheckOption2(e.target.checked)
          break;
        case 'agree_essential3':
          setCheckOption3(e.target.checked)
          break;
        case 'agree_essential4':
          setCheckOption4(e.target.checked)
          break;
        case 'agree_optional':
          setCheckOptional(e.target.checked)
          break;
      
        default:
          break;
      }


      let agree_status_string='';//이게 필요한 이유는 필수 다 택한것은 기본조건이고, 마케팅정보수신 agree_optional체크여부 포함여부 확인위함.마케팅정보수신동의했는지알기위함
      let agree_check_array=[];

      // let agree_checks= document.getElementsByClassName('agree_checks');
      let agree_checks = document.getElementsByName('essential')

      for(let i=0; i<agree_checks.length; i++){
          if(agree_checks[i].checked){
          agree_check_array.push(agree_checks[i].id);       
        }        
      
      }
      agree_status_string=agree_check_array.join(',');
      //체크상태여부 단지 문자열 저장
      setAgreeStatus(agree_status_string);
      console.log('agree_status_string:',agree_status_string);

      //체크한 대상들중에서 필수항목들 네개가 모두 체크됀지 여부 판단(통과/비통과 true,false)
      console.log(agree_check_array);
      let essential_check_count=0;
      for(let j=0; j<agree_check_array.length; j++){
        if(agree_check_array[j].indexOf('essential')!=-1){
          //essenttial(id명)필수항목명 string을 포함하는 선택지의 개수만을 카운팅한다.
          essential_check_count++;
        }
      }
      console.log('필수항목 체크 동의수:',essential_check_count);
      if(essential_check_count >= 4){
        setAgreePossible(true);
      }else{
        setAgreePossible(false);
      }
    }

    return (
        <Container>
      {/*전체 체크 항목*/}
          <AgreeAll>
            <WrapAllCheck>

            <FormGroup>
              <FormControlLabel control={<Checkbox checked={allCheck}  name="" id="all_check" onClick={allcheck_status_change} />} label="전체동의" />
            </FormGroup>
            <ViewTerm>
              <Link>약관 보러가기</Link>
            </ViewTerm>

              
              {/* <Checkbox>
                <AllCheck type="checkbox" name="" id="all_check" onClick={allcheck_status_change}></AllCheck>
                <AllCheckLabel for="all_check" className="check_label">
                <AllCheckImg className="chk_on_off"></AllCheckImg>
                   전체동의
                </AllCheckLabel>
              </Checkbox>
              <ViewTerm>
                <Link>약관 보러가기</Link>
              </ViewTerm> */}
            </WrapAllCheck>
        {/*개별적 체크 항목 */}
            <WrapCheck>

            <FormGroup>
              <FormControlLabel control={<Checkbox checked={CheckOption1} className='agree_checks' name="essential" id="agree_essential1" onClick={agreecheck_status_change}/>} label="(필수) 만14세 이상입니다." />
              <FormControlLabel control={<Checkbox checked={CheckOption2} className='agree_checks' name="essential" id="agree_essential2" onClick={agreecheck_status_change}/>} label="(필수) 이용약관 동의" />
              <FormControlLabel control={<Checkbox checked={CheckOption3} className='agree_checks' name="essential" id="agree_essential3" onClick={agreecheck_status_change}/>} label="(필수) 개인정보 수집 및 이용 동의" />
              <FormControlLabel control={<Checkbox checked={CheckOption4} className='agree_checks' name="essential" id="agree_essential4"onClick={agreecheck_status_change}/>} label="(필수) 개인정보 제3자 제공 동의" />
              <FormControlLabel control={<Checkbox checked={CheckOptional} className='agree_checks' name="essential" id="agree_optional" onClick={agreecheck_status_change}/>} label="(선택) 마케팅 정보 수신 동의" />
            </FormGroup>
            


              {/* <CheckList>
                <List>
                  <ListCheck type="checkbox" className='agree_checks' name="" id="agree_essential1" onClick={agreecheck_status_change}></ListCheck>
                  <ListCheckLabel for="agree_essential1" className="check_label">
                    <ListCheckImg className="chk_on_off"></ListCheckImg>
                     (필수) 만14세 이상입니다.
                  </ListCheckLabel>
                </List>
                <List>
                  <ListCheck type="checkbox" className='agree_checks'  name="" id="agree_essential2" onClick={agreecheck_status_change}></ListCheck>
                  <ListCheckLabel for="agree_essential2" className="check_label">
                    <ListCheckImg className="chk_on_off"></ListCheckImg>
                     (필수) 이용약관 동의
                  </ListCheckLabel>
                  <ViewListTerm>
                    <Link>보기</Link>
                  </ViewListTerm>
                </List>
                <List>
                  <ListCheck type="checkbox" className='agree_checks'  name="" id="agree_essential3" onClick={agreecheck_status_change}></ListCheck>
                  <ListCheckLabel for="agree_essential3" className="check_label">
                    <ListCheckImg className="chk_on_off"></ListCheckImg>
                     (필수) 개인정보 수집 및 이용 동의
                  </ListCheckLabel>
                  <ViewListTerm>
                    <Link>보기</Link>
                  </ViewListTerm>
                </List>
                <List>
                  <ListCheck type="checkbox" className='agree_checks'  name="" id="agree_essential4" onClick={agreecheck_status_change}></ListCheck>
                  <ListCheckLabel for="agree_essential4" className="check_label">
                    <ListCheckImg className="chk_on_off"></ListCheckImg>
                     (필수) 개인정보 제3자 제공 동의
                  </ListCheckLabel>
                  <ViewListTerm>
                    <Link>보기</Link>
                  </ViewListTerm>
                </List>
                <List>
                  <ListCheck type="checkbox" className='agree_checks' name="" id="agree_optional" onClick={agreecheck_status_change}></ListCheck>
                  <ListCheckLabel for="agree_optional" className="check_label">
                    <ListCheckImg className="chk_on_off"></ListCheckImg>
                     (선택) 마케팅 정보 수신 동의
                  </ListCheckLabel>
                </List>
              </CheckList> */}


            </WrapCheck>
          </AgreeAll>
        {/*가입 버튼*/}
        <MUButton type="submit" name="" variant='contained' active={active} onClick={member_submit_function}>가입</MUButton>
          {/* <JoinBtn type="submit" name="" active={active} onClick={member_submit_function}>가입</JoinBtn> */}
        </Container>
  );
}

const MUButton = MUstyled(Button)`
  width : 100%;
  background:${({ active }) => active ? "#01684b" : "#979797"};
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
    padding-bottom:150px;
    margin-top:20px;
    padding-top:20px;
    border-top:1px solid #f2f2f2;
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(370/428));
      padding-bottom:calc(100vw*(100/428));
      margin-top:calc(100vw*(20/428));
      padding-top:calc(100vw*(20/428));
    }
`
const AgreeAll = styled.div`
  width:100%;
`
const WrapAllCheck = styled.div`
  width:100%;
  margin:0 auto;
  height:42px;
  background:#fbfbfb;
  display:flex;justify-content:space-between;align-items:center;
  padding:0 32px;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(42/428));
    padding:0 calc(100vw*(16/428));
  }
`
// const Checkbox = styled.div`
//   display:inline-block;
// `
const AllCheck = styled.input`
  display:none;
  &:checked + .check_label .chk_on_off{width:15px;height:15px;background:url(${AllImg}) no-repeat;background-size:100% 100%;}
  @media ${(props) => props.theme.mobile} {
    &:checked + .check_label .chk_on_off{width:calc(100vw*(15/428));height:calc(100vw*(15/428));background:url(${AllImg}) no-repeat;background-size:100% 100%;}
  }
`
const AllCheckLabel = styled.label`
  font-size:15px;
  transform:skew(-0.1deg);
  font-weight:bold;color:#707070;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }

`
const AllCheckImg = styled.span`
  display:inline-block;
  margin-right:12px;
  width:15px;height:15px;
  background:url(${Check}) no-repeat;
  background-size:100% 100%;
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(15/428));
    height:calc(100vw*(15/428));
    margin-right:calc(100vw*(12/428));
  }
`
const ViewTerm = styled.p`
  font-size:13px;
  transform:skew(-0.1deg);
  color:#4a4a4a;
  font-weight:bold;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
  }
`
const WrapCheck = styled.div`
  width:387px;
  margin:12px auto 0;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(337/428));
    margin:calc(100vw*(8/428)) auto 0;
  }
`
const CheckList = styled.ul`
  width:100%;
`
const List = styled.li`
  position:relative;
  width:100%;
  margin-bottom:12px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(8/428));
  }
`
const ListCheck = styled.input`
  display:none;
  &:checked + .check_label .chk_on_off{width:15px;height:15px;background:url(${Checked}) no-repeat;background-size:100% 100%;}
  @media ${(props) => props.theme.mobile} {
    &:checked + .check_label .chk_on_off{width:calc(100vw*(15/428));height:calc(100vw*(15/428));background:url(${Checked}) no-repeat;background-size:100% 100%;}
  }
`
const ListCheckLabel = styled(AllCheckLabel)`
  font-size:13px;
  transform:skew(-0.1deg);
  font-weight:normal;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
  }
`
const ListCheckImg = styled(AllCheckImg)`
`
const ViewListTerm = styled.p`
  position:absolute;
  right:0;top:50%;transform:translateY(-50%) skew(-0.1deg);
  font-size:13px;font-weight:800;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
  }
`
const JoinBtn = styled.button`
  width:100%;
  height:66px;
  line-height:60px;
  font-size:20px;
  margin-top:46px;
  font-weight:800;
  transform:skew(-0.1deg);
  color:#fff;
  border-radius: 11px;
  transition:all 0.3s;
  background:${({active}) => active ? "#01684b" : "#979797"};
  border:${({active}) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.mobile} {
    width:100%;
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    margin-top:calc(100vw*(40/428));
    font-size:calc(100vw*(15/428));

  }
`
