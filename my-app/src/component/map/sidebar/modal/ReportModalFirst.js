//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//img
import Close from "../../../../img/main/modal_close.png";
import Check from "../../../../img/map/radio.png";
import Checked from "../../../../img/map/radio_chk.png";

//redux
import {reportmodal} from '../../../../store/actionCreators';

export default function ReportModalFirst({report,setReport,updatePageIndex}) {
  console.log('허위매물신고 첫 단계창::',reportmodal);
  const [select,setSelect] = useState(false);
  const showModal =()=>{
    setSelect(!select);
  }

  const reportype_change=(event)=>{
    reportmodal.reporttypechange({reporttype: event.target.value});
  }
  if(report[0] == false)
  return null;
    return (
        <Container>
            <WrapModal>
              <CloseBtn>
                <CloseImg onClick={() => {setReport([false,0,0]);updatePageIndex(0)}} src={Close}/>
              </CloseBtn>
              <InCont>
                <TopTitleTxt>허위매물 신고</TopTitleTxt>
                <RadioBox>
                  <Box>
                    <Radio type="radio" name="report" id="no" value='1'onChange={reportype_change}/>
                    <Label for="no">
                      <Span/>
                      없는 매물
                    </Label>
                  </Box>
                  <Box>
                    <Radio type="radio" name="report" id="diffrent" value='2' onChange={reportype_change}/>
                    <Label for="diffrent">
                      <Span/>
                      정보와 다른 매물
                    </Label>
                  </Box>
                </RadioBox>
              </InCont>
              <AgreeCheck>
                <Desc>허위·악성신고자는 사이트 이용이 제한될 수 있습니다. 동의하시겠습니까?</Desc>
                <AgreeCheckBox>
                  <CheckBox type="checkbox" name="" id="check"/>
                  <CheckLabel for="check" onClick={() => {updatePageIndex(1)}}>
                    <CheckSpan/>
                    동의합니다.
                  </CheckLabel>
                </AgreeCheckBox>
              </AgreeCheck>
            </WrapModal>
        </Container>
  );
}

const Container = styled.div `
  width:100%;
`

const WrapModal = styled.div`
  position:fixed;
  width:535px;height:470px;
  left:50%;top:50%;transform:translate(-50%,-50%);
  border-radius: 24px;
  border: solid 1px #f2f2f2;
  padding: 49px 0 59px;
  background:#fff;
  z-index:4;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(395/428));
    height:calc(100vw*(450/428));
    padding:calc(100vw*(24/428)) 0 calc(100vw*(70/428));
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
const RadioBox = styled.div`
  width:100%;
  padding-left:30px;
  margin:35px 0;
  @media ${(props) => props.theme.modal} {
    padding-left:calc(100vw*(20/428));
    margin:calc(100vw*(40/428)) 0;
  }
`
const Box = styled.div`
  width:100%;
  margin-bottom:32px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(30/428));
  }
`
const Radio = styled.input`
  display:none;
  &:checked+label span{background:url(${Checked}) no-repeat; background-size:100% 100%;}
`
const Label = styled.label`
  display:inline-block;
  font-size:15px;color:#4a4a4a;font-weight:500;transform:skew(-0.1deg);
  font-family:'nbg',sans-serif;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
  }
`
const Span = styled.span`
  display:inline-block;
  width:20px;height:20px;margin-right:16px;
  background:url(${Check}) no-repeat;
  background-size:100% 100%;
  vertical-align:middle;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));margin-right:calc(100vw*(15/428));
  }
`
const AgreeCheck = styled.div`
  width:100%;
  height:122px;
  background:#f8f7f7;
  padding-top:35px;
  text-align:center;
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(122/428));padding-top:calc(100vw*(30/428));
  }
`
const Desc = styled.p`
  font-size: 12px;
  margin-bottom:15px;
  font-weight: normal;
  text-align: center;
  font-family:'nbg',sans-serif;
  color: #4a4a4a;transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(22/428));
  }
`
const AgreeCheckBox = styled.div`
`
const CheckBox = styled.input`
  display:none;
  &:checked+label span{background:url(${Checked}) no-repeat; background-size:100% 100%;}
`
const CheckLabel = styled.label`
  display:inline-block;
  font-size: 15px;
  font-family:'nbg',sans-serif;
  color: #4a4a4a;transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
  }
`
const CheckSpan = styled.span`
  display:inline-block;
  width:20px;height:20px;
  background:url(${Check}) no-repeat; background-size:100% 100%;
  vertical-align:middle;margin-right:8px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));margin-right:calc(100vw*(8/428));
  }
`
