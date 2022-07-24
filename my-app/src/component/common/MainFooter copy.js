//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import Button from '@material-ui/core/Button';
//import { styled } from '@material-ui/core/styles';

//img
import FooterLogo from '../../img/main/footer_logo.png';

export default function MainFooter({openTermService, openTermPrivacy, openTermLocation}) {
    return (
        <Container>
          <FooterInner className="clearfix">
            <TopList>
              {/* <List onClick={()=>{openTermService(true)}}>
                <Link to="#">이용약관</Link>
              </List> */}
            <MUButton onClick={()=>{openTermService(true)}}>
                <Link to="#">이용약관</Link>
            </MUButton>
            <MUButton onClick={() => { openTermPrivacy(true)}}>
                <Link to="#">이용약관</Link>
            </MUButton>
            <MUButton onClick={() => { openTermLocation(true)}}>
                <Link to="#">이용약관</Link>
            </MUButton>

              {/* <MUButton>
                <Link onClick={()=>{openTermPrivacy(true)}}>
                  개인정보 처리방침</Link>
              </MUButton>

              <MUButton>
                <Link onClick={()=>{openTermLocation(true)}}>
                  위치기반 서비스 이용약관</Link>
              </MUButton> */}

              <MUButton>
                <Link to="/Faq">FAQ</Link>
              </MUButton>
              <MUButton>
                <Link to="/Notice">공지사항</Link>
              </MUButton>
            </TopList>
            <FooterRight>
              <FooterImg>
                <FooterImage src={FooterLogo}/>
              </FooterImg>
              <BottomInfo>
                <InfoTxt>
                  <TxtInner>상호 : (주) 코렉스</TxtInner>
                  <TxtInner>대표 : 홍길동</TxtInner>
                  <TxtInner>사업자등록번호 : 120-87-61559</TxtInner>
                </InfoTxt>
                <InfoTxt>
                  <TxtInner>팩스 : 02-568-4908</TxtInner>
                  <TxtInner>주소 : 서울특별시 서초구 서초대로 441, 5층 (서초동 GT타워) (우:06615)</TxtInner>
                </InfoTxt>
              </BottomInfo>
            </FooterRight>
            <FooterLeft>
              <BottomInfo>
                <InfoTxt>통신판매업 신고번호 : 제2020-서울서초-0853호</InfoTxt>
                <InfoTxt>
                  <TxtInner>서비스 이용문의 : 1661-8734</TxtInner>
                  <TxtInner>이메일 : korex.help@korex.com</TxtInner>
                </InfoTxt>
              </BottomInfo>
            </FooterLeft>
            <Copyright>
              <InfoTxt>Copyright © KOREX. All Rights Reserved.</InfoTxt>
            </Copyright>
          </FooterInner>
        </Container>
  );
}

//material-ui
const MUButton = styled(Button)`
  font-size:13px;
    color:#707070;
    font-weight:800;
`

const Container = styled.div`
    position:relative;
    z-index:2;
    width: 100%;
    height:203px;
    padding:39px 0 38px 0;
    background:#fbfbfb;

    @media ${(props) => props.theme.mobile} {
        width:100%;
        padding:0;
        padding-top:calc(100vw*(20/428));
        height:calc(100vw*(270/428));
      }
`
const FooterInner = styled.div`
    width: 1436px;
    margin:0 auto;

    @media ${(props) => props.theme.container} {
        width:90%;
      }
    @media ${(props) => props.theme.mobile} {
        position:relative;
        width:calc(100vw*(390/428));
        padding-bottom:calc(100vw*(55/428));
        align-items:center;
        flex-wrap:wrap;
        text-align:center;
      }
`
const TopList = styled.div`
    display:flex;
    justify-content:flex-start;
    align-item:center;
    float:left;
    width:100%;
    @media ${(props) => props.theme.container} {
      }
    @media ${(props) => props.theme.mobile} {
        width:100%;
        float:none;
        margin-bottom:calc(100vw*(50/428));
        align-items:center;
        word-break:keep-all;
        justify-content:flex-start;
      }
`
const FooterLeft = styled.div`
    width:50%;
    float:left;
    margin-top:36px;
    @media ${(props) => props.theme.mobile} {
        float:right;
        width:100%;
        margin-top:calc(100vw*(20/428));
      }
`
const List = Sstyled.div`
    font-size:13px;
    color:#707070;
    font-weight:800;
    margin-right:25px;
    transform:skew(0.1deg);
    @media ${(props) => props.theme.mobile} {
        font-size:calc(100vw*(9/428));
        margin-right:calc(100vw*(15/428));
      }
`
const BottomInfo = styled.div`
    display:block;
`
const InfoTxt = styled.div`
    display:block;
    font-size:13px;
    margin-bottom:11px;
    transform:skew(0.1deg);
    color:#a3a3a3;
    @media ${(props) => props.theme.mobile} {
        font-size:calc(100vw*(9/428));
        margin-bottom:calc(100vw*(10/428));
        text-align:left;
        &:last-child{margin-bottom:0;}
      }
`
const TxtInner = styled.div`
    display:inline-block;
    font-size:13px;
    margin-right:35px;
    color:#a3a3a3;
    &:last-child {
      margin-right:0;
    }
    @media ${(props) => props.theme.mobile} {
        font-size:calc(100vw*(9/428));
        display:inline-block;
        margin-right:calc(100vw*(10/428));
      }
`
const FooterRight = styled.div`
    width:50%;
    float:right;
    text-align:right;
    @media ${(props) => props.theme.mobile} {
        float:none;
        text-align:center;
        width:100%;
      }
`
const FooterImg = styled.div`
    text-align:right;
    margin-bottom:13px;
`
const FooterImage = styled.img`
    width:80px;
    @media ${(props) => props.theme.mobile} {
        position:Absolute;
        width:calc(100vw*(60/428));
        right:calc(100vw*(0/428));
        bottom:calc(100vw*(33/428));
      }
`
const Copyright = styled.div`
    width:100%;
    text-align:left;
    float:left;
    @media ${(props) => props.theme.mobile} {
        margin-top:calc(100vw*(14/428));
      }
`
