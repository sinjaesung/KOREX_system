//react
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import NavIcon from '../../../img/main/nav_btn.png';
import Logo from '../../../img/main/header_logo.png';
import PCLogo from '../../../img/main/pc_header_logo.png';
import Mypage from '../../../img/main/mypage_icon.png';
//theme
import { TtCon_MainMapBoard } from "../../../theme";

// components
import { Mobile, PC } from "../../../MediaQuery";
import MapRightMenu from "./MapRightMenu";
import WrapMapFilter from "./WrapMapFilter";
import KakaoMap from './KakaoMap';
import TestBox from "./TestBox";

// redux
import { MapRight } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

const { kakao } = window;

export default function WrapMap({ openBunyang, rank, open, setOpen, status, containerRef, mapheader_search_element }) {
  const mapRightRedux = useSelector(state => { return state.mapRight });
  const filterRef = useRef();

  useEffect(() => {
    if (mapRightRedux.isExclusive.is) {
      filterRef.current.classList.remove("hidden");
    } else {
      filterRef.current.classList.add("hidden");
    }
  }, [mapRightRedux.isExclusive.is])

  return (
    <Container>
      <Sect_MapBoard>
        <KakaoMap status={status} mapheader_search_element={mapheader_search_element} />
        {/* <TestBox></TestBox> */}
      </Sect_MapBoard>
      <Sect_ToolBox>
        <MapRightMenu containerRef={containerRef} />
      </Sect_ToolBox>
      <Sect_Filter ref={filterRef}>
        <WrapMapFilter setOpen={setOpen} status={status} />
      </Sect_Filter>
    </Container>
  );

}

const Container = styled.div`
  & > .hidden{
    display:none;
  } 
  ${TtCon_MainMapBoard}
`
const Sect_MapBoard = styled.div`
  height:100%;
  opacity: .99;
`
const Sect_ToolBox = styled.div`
  /* height:100%;
  position:absolute; */
`

const Sect_Filter = styled.div`
  /* height:100%;
  position:absolute; */
`
