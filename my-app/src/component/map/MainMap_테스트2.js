//react
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import { Mobile, PC } from "../../MediaQuery";
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
    // <Container className="clearfix">
    <Container>
      <Wrap>
        <LeftBox class="lfet_box"></LeftBox>
      </Wrap>
      <TextBox>
        {/* <Parent><Child>어처구니없네업처구니</Child></Parent> */}
        The standard Lorem Ipsum passage, used since the 1500s
"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC
"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
<Parent>어처구니없네업처구니</Parent>
      </TextBox>
    </Container>
  );
}


const Container = styled.div`
  height: 100%;
`
const Wrap = styled.div`
  height: 30%; border: 10px orange solid; float:right;
`
const LeftBox = styled.div`
  width:1000px; height: 100%; border: 10px #F00 solid;
`


const TextBox = styled.p`
  display:block;
  //overflow: hidden;
  font-size: 14px;
  height: 100%; border: 8px #0F0 solid;
`


const Parent = styled.div`
  overflow: hidden;
  width:90%; height: 100%; border: 30px blue solid; width: 
`

/* const Parent = styled.div`
  min-width: auto;
  height: 100%; 
  border: 15px green solid;
`
const Child = styled.div`
  overflow: hidden;
  width:100%; height: 100%; border: 30px blue solid; width: 
` */
