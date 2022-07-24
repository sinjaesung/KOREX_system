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


export default function ReportModalComplete({report,setReport,updatePageIndex}) {

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
                <Desc>허위매물 신고가 접수되었습니다.</Desc>
                <Button type="submit" name="" onClick={() => {setReport([false,0,0]);updatePageIndex(0)}}>확인</Button>
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
  width:535px;height:auto;
  left:50%;top:50%;transform:translate(-50%,-50%);
  border-radius: 24px;
  border: solid 1px #f2f2f2;
  padding: 49px 0 59px;
  background:#fff;
  z-index:4;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(395/428));
    height:calc(100vw*(460/428));
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
  font-size: 15px;
  padding:80px 0 60px;
  text-align:center;
  color: #4a4a4a;transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    padding:calc(100vw*(105/428)) 0 calc(100vw*(86/428));
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
  background:#01684b;
  border:3px solid #04966d;
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
    margin-top:calc(100vw*(20/428));
  }
`
