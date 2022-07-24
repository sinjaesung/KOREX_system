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
      <ParentBox_1>
        <ChildBox_1></ChildBox_1>
      </ParentBox_1>
      <ParentBox_2>
        The standard Lorem Ipsum passage, used since the 1500s
"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC
"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
      </ParentBox_2>
      <Box1></Box1>
      <Box2></Box2>
      <Box3></Box3>
    </Container>
  );
}


const Container = styled.div`
  height: 100%;
`
const ParentBox_1 = styled.div`
  /* height: 60%; border: 10px orange solid; */
  border: 5px #ff7b01 solid; 
`
const ChildBox_1 = styled.div`
  /* width:80%; height: 100%; border: 10px #F00 solid; float:right; */
  width: 200px; height: 200px; border: 10px #F00 solid; float:left;
`


const ParentBox_2 = styled.p`
  /* display:block;
  overflow: hidden;
  font-size: 14px;
  height: 100%; border: 8px #0F0 solid; */
  width: 150px; height: 300px; border: 5px #0F0 solid; 
`


const Box1 = styled.div`
width:300px; height:300px; float:right;
background-color:orange;
`
const Box2 = styled.div`
width:200px; height:500px;
background-color:blue;
`
const Box3 = styled.div`
width:500px; height:200px; float:right;
background-color:green;
`