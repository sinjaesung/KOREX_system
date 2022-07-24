//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import Button from '@material-ui/core/Button';

//theme
import { TtCon_Frame_F } from '../../theme';


//img
import FooterLogo from '../../img/main/footer_logo.png';

export default function MainFooter({ openTermService, openTermPrivacy, openTermLocation }) {
  return (
    <>
      <Wrapper>
        <TopList>
          {/* <List onClick={()=>{openTermService(true)}}>
                <Link to="#">이용약관</Link>
              </List> */}
          <MUButton color="secondary" onClick={() => { openTermService(true) }}>
            <Link to="#">이용약관</Link>
          </MUButton>
          <MUButton color="secondary" onClick={() => { openTermPrivacy(true) }}>
            <Link to="#">개인정보 처리방침</Link>
          </MUButton>
          <MUButton color="secondary" onClick={() => { openTermLocation(true) }}>
            <Link to="#">위치기반 서비스 이용약관</Link>
          </MUButton>
          {/* <MUButton>
                <Link onClick={()=>{openTermPrivacy(true)}}>
                  개인정보 처리방침</Link>
              </MUButton>

              <MUButton>
                <Link onClick={()=>{openTermLocation(true)}}>
                  위치기반 서비스 이용약관</Link>
              </MUButton> */}
          <MUButton color="secondary">
            <Link to="/Faq">FAQ</Link>
          </MUButton>
          <MUButton color="secondary">
            <Link to="/Notice">공지사항</Link>
          </MUButton>
        </TopList>
        <BottomInfo>
          {/* <FooterImg>
                <FooterImage src={FooterLogo}/>
              </FooterImg> */}
         <InfoTxt>(주) 코렉스 │ 대표 : 홍길동 │ 사업자등록번호 : 120-87-61559 │ 통신판매업 신고번호 : 제2020-서울서초-0853호 │
          전화 : 02-514-4114(10:00~18:00, 공휴일 제외) │ 팩스 : 02-568-4908 │ 이메일 : info@korex.com │ 주소 : 서울특별시 강남구 삼성로 549, 2층 202호(삼성동)
          </InfoTxt>     
        </BottomInfo>
        <Copyright>© KOREX Corp. All Rights Reserved.</Copyright>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  ${TtCon_Frame_F}
`
const TopList = styled.div`
    display:flex;
    justify-content:center;
    word-break:keep-all;
`
const MUButton = styled(Button)`

`
const BottomInfo = styled.div`
    font-size:0.75rem;
    margin: 0 auto;
`
const InfoTxt = styled.div`
   
`
const Copyright = styled.div`
    font-size:0.75rem;
    text-align:center;
    padding: 1.25rem 0 2.5rem;
`
