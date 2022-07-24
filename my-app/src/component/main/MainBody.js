//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//material
import PanToolIcon from '@mui/icons-material/PanTool';

//component
import MainSearch from './mainSearch';
import MainCarousel from './mainCarousel';

export default function MainBody({ bannerData }) {

  return (
    <>
      <Wrapper className="tAlign-c">
        <Qqq>**.현재 BETA 테스트 중----&nbsp;빠른시일내에 서비스하겠습니다</Qqq>
        <Title>부동산 전속매물 플랫폼</Title>
        <MainSearch />
        <div className="par-spacing-before-2p5">
          <MainCarousel bannerData={bannerData} />
        </div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
    padding-top: 3.5vw;
`

const Qqq = styled.p`
  font-size:1rem;
  line-height: 2;
  background-color: #fffcdb;
`

const Title = styled.p`
    font-size:2.5rem;

    @media ${(props) => props.theme.breakpoints.md} {
      font-size:2.2rem;
    }
    @media ${(props) => props.theme.breakpoints.sm} {
      font-size:1.8rem;
    }
    color:${(props) => props.theme.palette.primary.main};   
`