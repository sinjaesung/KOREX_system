//react
import React ,{useState, useEffect,useRef} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//img
import Close from "../../../../img/main/modal_close.png";
import Check from "../../../../img/map/radio.png";
import Checked from "../../../../img/map/radio_chk.png";

//redux
import {useSelector} from 'react-redux';

//server
import serverController from '../../../../server/serverController';

export default function ReportModalThird({report,setReport,updatePageIndex}) {

  const reportmodal=useSelector(data=>data.reportmodal);
  const login_user=useSelector(data=>data.login_user);

  const Errormessge=useRef();

  const [cernum,setCernum] = useState("");/*기본값*/
  const [active,setActive] = useState(false);

  const cernumChange = (e) =>{ setCernum(e.target.value); }

  /*
  const checkVaildate = () =>{
    return name.length > 0 && phone.length > 9 && cernum.length > 4
   }

   useEffect(()=>{
     if(checkVaildate())
         setActive(true);
     else
         setActive(false);
   },)*/

  //다음단계 누를시 넘길지 말지 여부
   const nextStep = async (e) => {
    e.preventDefault();
    console.log('nextStep다음스탭 a링크 클릭:',e,e.target);
    console.log('현재 리포트 state 연결값::',report);

    //해당 폰 번호 수신자에게로온 인증번호값을 보내서, 해당 폰번호로의 최신발송이 발견되면 그 row는 삭제처리
    let body_info ={
      phone_number : reportmodal.reportphone,
      cernum_number: cernum
    }
    console.log('send datasss::',JSON.stringify(body_info));
    var cernumchk_validate_result= await serverController.connectFetchController('/api/cernum_validate_process','POST',JSON.stringify(body_info));

    if(cernumchk_validate_result){
      console.log('cernumchk vadliate reusltss:',cernumchk_validate_result);

      if(cernumchk_validate_result.success){

        setActive(true);Errormessge.current.style.display='none';
        //성공인 경우 해당 입력정보를 모두 담아서 리포트 서버전송전달.
        let send_reportinfo={
          reporttype: reportmodal.reporttype,
          reportname: reportmodal.reportname,
          reportphone: reportmodal.reportphone,
          prd_identity_id:report[1],
          company_id : report[2],
          mem_id :login_user.memid,
        }
        
        var report_send_result=await serverController.connectFetchController('/api/broker/brokerproduct_reportProcess','POST',JSON.stringify(send_reportinfo));

        if(report_send_result){
          console.log('send report send resultsss:',report_send_result);
          if(report_send_result.success){

          }
        }
        updatePageIndex(3);    
      }else{
        setActive(false);
        Errormessge.current.style.display='block';
        alert(cernumchk_validate_result.message);
      }
    }
   }
  if(report == false)
  return null;
    return (
        <Container>
            <WrapModal>
              <CloseBtn>
                <CloseImg onClick={() => {setReport([false,0,0]);updatePageIndex(0)}} src={Close}/>
              </CloseBtn>
              <InCont>
                <TopTitleTxt>허위매물 신고</TopTitleTxt>
                <Desc>KOREX는 허위매물 근절을 위하여 최선의 노력을 기울이고 있습니다.<br/>
                내용 확인을 위해 KOREX검증 담당자가 직접 연락드리겠습니다. </Desc>
                <WrapInputBox>
                  <Box>
                    <Label>이름</Label>
                    <Input type="text" name="" placeholder="이름을 입력하여주세요." value={reportmodal.reportname} readonly/>
                  </Box>
                  <Box>
                    <Label>휴대전화</Label>
                    <Input type="text" name="" placeholder="휴대번호를 ’-‘를 빼고 입력하여주세요." value={reportmodal.reportphone} readonly/>
                    <InputCernum type="text" name="" placeholder="인증번호를 입력하여 주세요." onChange={cernumChange}/>
                    {/*인증번호가 일치하지않을때*/}
                    <ErrorMsg ref={Errormessge} style={{display:"none"}}>휴대전화 인증번호가 일치하지 않습니다.</ErrorMsg>
                  </Box>
                  <Button type="submit" name="" active={active} onClick={nextStep}>제출</Button>
                </WrapInputBox>
              </InCont>
            </WrapModal>
        </Container>
  );
}

const Container = styled.div `
  width:100%;
`
const WrapModal = styled.div`
  position:fixed;
  width:535px;height:605px;
  left:50%;top:50%;transform:translate(-50%,-50%);
  border-radius: 24px;
  border: solid 1px #f2f2f2;
  padding: 49px 0 59px;
  background:#fff;
  z-index:4;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(395/428));
    height:calc(100vw*(520/428));
    padding:calc(100vw*(24/428)) 0 calc(100vw*(50/428));
  }
`
const CloseBtn= styled.div`
  width:100%;
  text-align:right;
  margin-bottom:22px;
  padding-right:60px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(28/428));
    padding-right:calc(100vw*(24/428));
  }
`
const CloseImg = styled.img`
  display:inline-block;
  width:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(12/428));
  }
`
const InCont = styled.div`
  padding:0 60px;
  @media ${(props) => props.theme.modal} {
    padding:0 calc(100vw*(20/428));
  }
`
const TopTitleTxt = styled.h3`
  font-size:20px;font-weight:600;
  transform:skew(-0.1deg);color:#707070;
  padding-bottom:21px;border-bottom:1px solid #a3a3a3;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    padding-bottom:calc(100vw*(15/428));
  }
`
const Desc = styled.p`
  margin-top:18px;
  font-size: 12px;
  margin-bottom:15px;
  font-weight: normal;
  text-align: center;
  font-family:'nbg',sans-serif;
  color: #4a4a4a;transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(12/428));
    margin-top:calc(100vw*(20/428));
    margin-bottom:calc(100vw*(18/428));
  }
`
const WrapInputBox = styled.div`
  width:100%;
`

const Box = styled.div`
  position:relative;
  width:100%;
  margin-bottom:14px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(15/428));
  }
`
const Label = styled.div`
  font-size: 12px;
  margin-bottom:10px;
  color: #4a4a4a;
  font-family:'nbg',sans-serif;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(10/428));
    font-size:calc(100vw*(12/428));
  }
`
const ErrorMsg = styled.p`
  font-size:11px;color:#FE0101;
  transform:skew(-0.1deg);
  position:Absolute;left:50%;transform:translateX(-50%);
  bottom:-40px;
  @media ${(props) => props.theme.modal} {
    width:100%;
    text-align:center;
    font-family:'nbg',sans-serif;
    font-size:calc(100vw*(11/428));
    bottom:calc(100vw*(-30/428));
  }
`
const Input = styled.input`
  width:100%;height: 43px;
  border-radius: 4px;
  border: solid 1px #e4e4e4;text-align:center;
  color:#4a4a4a;
  font-size:15px;font-weight:600;transform:skew(-0.1deg);
  &::placeholder{color:#979797;font-weight:500;font-size:15px;}
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(43/428));
    font-size:calc(100vw*(14/428));
    &::placeholder{font-size:calc(100vw*(14/428));}
  }
`
const InputCernum = styled(Input)`
  margin-top:10px;
  @media ${(props) => props.theme.modal} {
    margin-top:calc(100vw*(10/428));
  }
`

const Button = styled.button`
  width:100%;
  height: 66px;
  margin-top:60px;
  text-align:center;
  color:#fff;font-size:20px;font-weight:800;transform:skew(-0.1deg);
  border-radius: 11px;
  transition:all 0.3s;
  background:${({active}) => active ? "#01684b" : "#979797"};
  border:${({active}) => active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
    margin-top:calc(100vw*(30/428));
  }
`
