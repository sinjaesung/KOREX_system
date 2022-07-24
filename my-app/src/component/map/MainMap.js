//react
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import { Portrait, Landscape  } from "../../MediaQuery";
import NavIcon from '../../img/main/nav_btn.png';
import Logo from '../../img/main/header_logo.png';
import PCLogo from '../../img/main/pc_header_logo.png';
import Mypage from '../../img/main/mypage_icon.png';

// components
import WrapMap from './map/WrapMap';
import MainWrapSideBar from './sidebar/MainWrapSideBar';
import MainWrapSideBarModal from './sidebar/MainWrapSideBarModal';
import DanjiWrapSideBar from './sidebar/DanjiWrapSideBar';

export default function MainHeader({ openBunyang, rank, setReport, reserveModal, setMap, setDangimap_data, status, mapheader_search_element }) {
  //console.log('mainMap실행>>');
  const [pageIndex, setPageIndex] = useState(0);

  const containerRef = useRef();
  const containerRef2 = useRef();

  return (
    <>
        {/*<DanjiWrapSideBar setMap={setMap} setReport={setReport} pageIndex={pageIndex} setPageIndex={setPageIndex}/>*/}{/*단지 사이드바 컴포넌트*/}
        <Landscape>
          <MainWrapSideBar containerRef={containerRef} setDangimap_data={setDangimap_data} setMap={setMap} status={status} setReport={setReport}  reserveModal={reserveModal} pageIndex={pageIndex} setPageIndex={setPageIndex}/>{/*메인 사이드바 컴포넌트*/}
          <WrapMap status={status} containerRef={containerRef} mapheader_search_element={mapheader_search_element} />
        </Landscape>
        <Portrait>
          {
            pageIndex == 0 ?
              <WrapMap status={status} mapheader_search_element={mapheader_search_element} />
              :
              null
           
          }
           
           <MainWrapSideBar containerRef={containerRef} setDangimap_data={setDangimap_data} setMap={setMap} status={status} setReport={setReport}  reserveModal={reserveModal} pageIndex={pageIndex} setPageIndex={setPageIndex} />{/*메인 사이드바 컴포넌트*/}
        </Portrait>
        <MainWrapSideBarModal containerRef={containerRef2} setDangimap_data={setDangimap_data} setMap={setMap} status={status} setReport={setReport} pageIndex={pageIndex} setPageIndex={setPageIndex} reserveModal={reserveModal} />
    </>
  );
}
