//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import ArrowTop from '../../../../img/map/arrow_top.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import Enter from '../../../../img/member/enter.png';
import CheckImg from '../../../../img/map/radio.png';
import CheckedImg from '../../../../img/map/radio_chk.png';
import RadioImg from '../../../../img/map/radi.png';
import RadioChkImg from '../../../../img/map/radi_chk.png';

import { Mobile, PC } from "../../../../MediaQuery"
import ConditionChangeList from "./ConditionChangeList";
import RequestReviewBasicInfo from "./RequestReviewBasicInfo";


export default function RequsetReview({brokerRequest_product,acceptModal,cancleModal,setAccept,setCancle,disabled,nowprdstatus}) {
  const [basic, setBasic] = useState(false);

  console.log('====>>>>requestReview components transfer receive state product value:',brokerRequest_product,nowprdstatus);

  const rotatebasic=()=>{
    if(basic == true) {
      return "rotate(180deg)"
    }else{
      return "rotate(0deg)"
    }
  }
    return (
        <Container>
          <WrapCondition>
            <TopTitle>의뢰접수 검토</TopTitle>
            <WrapReview>
              <ReviewTop>
                <Condition>상태:<Gray>{nowprdstatus}</Gray></Condition>
                <TeamName>소속명</TeamName>
                <WrapFlexBox>
                  <FlexBox>
                    <Left>의뢰인명</Left>
                    <Right>{brokerRequest_product.request_man_name}({brokerRequest_product.request_mem_selectsosokid})</Right>
                  </FlexBox>
                  <FlexBox>
                    <Left>휴대폰번호</Left>
                    <Rightph>{brokerRequest_product.request_mem_phone}</Rightph>
                  </FlexBox>
                  <FlexBox>
                    <Left>요청사항</Left>
                    <Rightwd>{brokerRequest_product.requestmessage}</Rightwd>
                  </FlexBox>
                </WrapFlexBox>
                <JunsokDate>
                  <Label>전속기간<Pilsu> *</Pilsu></Label>
                  <Input type="text" value={brokerRequest_product.exculsive_periods}개월/>
                </JunsokDate>
              </ReviewTop>
            {/*기본정보*/}
              <ReviewMiddle>
                <BasicInfo onClick={() =>{setBasic(!basic);}}>
                  <BasicTitle>기본정보</BasicTitle>
                  <Arrow src={ArrowDown} rotatebasic={rotatebasic}/>
                </BasicInfo>
            {/*기본정보 내용*/}
                {basic ?
                    <RequestReviewBasicInfo brokerRequest_product={brokerRequest_product} disabled={disabled}/>
                    :
                    null
                }
                <RequestAccept>
                  <Desc>
                  위 의뢰를 수락하여<br/>
                  거래를 준비하시겠습니까?
                  </Desc>
                  <Buttons>
                    <CancleBtn type="button" onClick={()=>{setCancle(true);cancleModal();}}>거절</CancleBtn>
                    <AcceptBtn type="button" onClick={()=>{setAccept(true);acceptModal();}}>수락</AcceptBtn>
                  </Buttons>
                </RequestAccept>
              </ReviewMiddle>
            </WrapReview>
      </WrapCondition>
  </Container>
  );
}

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
    width:680px;
    margin:0 auto;
    padding:43px 0 100px;
    @media ${(props) => props.theme.mobile} {
      width:100%;
      padding:calc(100vw*(30/428)) 0 calc(100vw*(100/428));
      }
`
const WrapCondition = styled.div`
  width:100%;
`
const WrapReview = styled.div`
  width:490px;
  margin:0 auto;
  padding-top:43px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding-top:calc(100vw*(43/428));
    }
`

const ReviewTop = styled.div`
width:408px;
margin:0 auto 35px;
position:relative;
@media ${(props) => props.theme.mobile} {
  width:calc(100vw*(380/428));
  margin:0 auto calc(100vw*(30/428));
  }
`
const TopTitle = styled.h2`
  font-size:20px;color:#707070;
  text-align:left;padding-left:30px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding-left:calc(100vw*(36/428));
    }
`
const Condition = styled.div`
  font-size:15px;font-weight:600;
  transform:skew(-0.1deg);color:#707070;
  margin-bottom:15px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(15/428));
    }
`
const Gray = styled.span`
padding-left:5px;
font-size:15px;font-weight:600;vertical-align:middle;
transform:skeW(-0.1deg);color:#979797;
@media ${(props) => props.theme.mobile} {
  font-size:calc(100vw*(15/428));
  padding-left:calc(100vw*(5/428));
  }
`
const TeamName = styled.div`
  font-size:18px;
  font-weight:600;transform:skew(-0.1deg);
  color:#4a4a4a;margin-bottom:23px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(18/428));
    margin-bottom:calc(100vw*(23/428));
    }
`
const WrapFlexBox = styled.div`
  width:100%;
`
const FlexBox = styled.div`
  width:100%;display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(6/428));
    }
`
const Left = styled.p`
  font-size:15px;font-weight:800;
  transform:skeW(-0.1deg);color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    }
`
const Right = styled(Gray)`
  padding-left:0;
`
const Rightph = styled(Gray)`
  color:#fe7a01;
  text-decoration:underline;
`
const Rightwd = styled(Right)`
  width:100%;
  margin-top:8px;
  line-height:1.5;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(8/428));
    }
`
const JunsokDate = styled.div`
  width:408px;
  margin:43px auto 0;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    margin:calc(100vw*(43/428)) auto 0;
    }
`

const Input = styled.input`
  width:100%;height:43px;
  display:inline-block;
  text-align:center;border-radius: 4px;
  border: solid 1px #a3a3a3;
  background-color: #ffffff;color:#4a4a4a;
  font-size:15px;font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(43/428));
    font-size:calc(100vw*(15/428));
    }
`
const ReviewMiddle = styled.div`
  width:100%;
`
const BasicInfo = styled.div`
  width:100%;display:flex;justify-content:space-between;align-items:center;
  height:66px;padding:0 45px;
  background:#f8f7f7;cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(66/428));
    padding:0 calc(100vw*(45/428));
    }
`
const BasicTitle = styled.h2`
  font-size:20px;font-weight:800;color:#4a4a4a;
  transform:skeW(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(20/428));
    }
`
const Arrow = styled.img`
  display:inline-block;
  width:13px;opacity:0.8;
  transition:all 0.3s;
  transform:${({rotatebasic}) => rotatebasic};
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(13/428));
    }
`
const Label = styled.label`
  display:block;
  font-size:12px;font-weight:600;
  transform:skew(-0.1deg);color:#4a4a4a;
  margin-bottom:10px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(10/428));
    }
`
const Pilsu = styled.span`
  display:inline-block;
  font-size:12px;font-weight:600;
  transform:skew(-0.1deg);color:#fe7a01;
  vertical-align:middle;
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-left:calc(100vw*(5/428));
    }
`
const RequestAccept = styled.div`
  width:100%;border-top:1px solid #f2f2f2;
  padding-top:67px;margin-top:50px;
  @media ${(props) => props.theme.mobile} {
    padding-top:calc(100vw*(60/428));
    margin-top:calc(100vw*(50/428));
    }
`
const Desc = styled.p`
  font-size: 15px;
  font-weight: 800;
  transform:skew(-0.1deg);
  line-height: 1.13;
  letter-spacing: normal;
  text-align: center;
  color: #4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    }
`
const Buttons = styled.div`
  width:408px;
  margin: 43px auto 0;
  display:flex;justify-content:space-between;align-items:center;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(380/428));
    margin:calc(100vw*(43/428)) auto 0;
    }
`
const CancleBtn = styled.button`
  width: 200px;
  height: 66px;
  line-height:60px;
  text-align:center;
  font-size:20px;color:#fff;font-weight:800;trabsform:skeW(-0.1deg);
  border-radius: 11px;
  border: solid 3px #e4e4e4;
  background-color: #979797;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(180/428));height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));font-size:calc(100vw*(15/428));
    }
`
const AcceptBtn = styled(CancleBtn)`
  border: solid 3px #04966d;
  background-color: #01684b;
`
