//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

import styled from "styled-components"

import MainTop from './MainTop';
import MainSearch from './MainSearch';
import MainBodyBottom from './MainBodyBottomNew';

export default function MainBody({bannerData}) {
 // console.log('bannerData hgmsss:',bannerData);
    return (
        <Container>
          <MainTop/>
          <MainSearch />
          <MainBodyBottom bannerData={bannerData}/>
        </Container>
  );
}
const Container = styled.div`
    padding-top: 3.5vw;
    /* padding-top: 3rem;
    @media (orientation: portrait) {
      padding-top: 1rem;
    } */
    
   /* width: 100%;
    padding-bottom:60px;
    min-height:calc(100vh - 289px);
    @media ${(props) => props.theme.mobile} {
      min-height:calc(100vh - calc(100vw*(334/428)));
      contentpadding-bottom:calc(100vw*(180/428));
    } */
`