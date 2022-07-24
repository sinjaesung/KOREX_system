//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import NavIcon from '../../../img/main/nav_btn.png';
import Logo from '../../../img/main/header_logo.png';
import PCLogo from '../../../img/main/pc_header_logo.png';
import Mypage from '../../../img/main/mypage_icon.png';

// components
import { Mobile, PC } from "../../../MediaQuery";
import DanjiSideBar from './DanjiSideBar';
import SideBarItemDetail from './SideBarItemDetail';
import SideBarDanjiDetail from './SideBarDanjiDetail';

export default function WrapSideBar({setReport,setMap,pageIndex,setPageIndex}) {
  //사이드 내 페이지 이동
  const [historyInfo , setHistoryInfo] = useState({pageIndex:1,prevTab:"",prevIndex:[]});
  const [updown,setUpDown] = useState(false);
  console.log(updown)
  const position=()=>{
    if(updown == true) {
      return "absolute"
    }else{
      return "relative"
    }
  }
  const overflow=()=>{
    if(updown == true) {
      return "scroll"
    }else{
      return "hidden"
    }
  }
  const top=()=>{
    if(updown == true) {
      return "calc(100vw*(59/428));"
    }else{
      return "calc(100vw*(-122/428));"
    }
  }

  const pageLoader = () =>{
    switch (pageIndex) {
      case 0: return <DanjiSideBar updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} updown={updown} setUpDown={setUpDown}/>;
      case 1: return <SideBarItemDetail updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} setReport={setReport} />; //물건 상세페이지
      case 2: return <SideBarDanjiDetail updatePageIndex={updatePageIndex} historyInfo={historyInfo} setHistoryInfo={setHistoryInfo} setMap={setMap}/>;//전문중개사 상세페이지
      default :return <DanjiSideBar updatePageIndex={updatePageIndex} setHistoryInfo={setHistoryInfo}/>;
    }
  }
  const updatePageIndex = (index) =>{
    if(index < 0)
      setPageIndex(0);
    else if(index == 1)
      setPageIndex(1);
      else if(index == 2)
        setPageIndex(2);
    else
      setPageIndex(index);
  }
    return (
        <Container pageIndex={pageIndex} position={position} overflow={overflow} top={top}>
        {
          pageLoader()
        }
        </Container>
  );
}

const Container = styled.div`
  position:fixed;
  right:0;
  top:106px;
  width:495px;height:100vh;
  padding-bottom:120px;
  overflow-y:scroll;
  content:'';
  background:#fff;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {display: none;}
  @media ${(props) => props.theme.mobile} {
    position:${({position}) => position};
    overflow-y:${({overflow}) => overflow};
    top:${({top}) => top};
    width:100%;
    padding-bottom:calc(100vw*(150/428));
    ${({pageIndex})=>{
      return pageIndex != 0 ?
      `
      top:calc(100vw*(0/428));
      `
      :
      `
      `
    }}
  }
`
