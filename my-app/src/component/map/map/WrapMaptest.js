//react
import React ,{useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import NavIcon from '../../../img/main/nav_btn.png';
import Logo from '../../../img/main/header_logo.png';
import PCLogo from '../../../img/main/pc_header_logo.png';
import Mypage from '../../../img/main/mypage_icon.png';

// components
import { Mobile, PC } from "../../../MediaQuery";
import MapRightMenu from "./MapRightMenu";
import WrapMapFilter from "./WrapMapFilter";
import KakaoMaptest from './KakaoMaptest';

// redux
import { MapRight } from '../../../store/actionCreators';

import {useSelector} from 'react-redux';

const { kakao } = window;

export default function WrapMap({openBunyang, rank, open, setOpen, status, containerRef}) {
  const mapRightRedux = useSelector(state=>{ return state.mapRight});
  /*const filterRef = useRef();

  useEffect(() => {
    if(mapRightRedux.isExclusive.is){
      filterRef.current.classList.remove("hidden");
    }else{
      filterRef.current.classList.add("hidden");
    }
  }, [mapRightRedux.isExclusive.is])*/

  return (
      <Container>
        <KakaoMaptest status={status}/>
       
      </Container>
  );

}

const Container = styled.div`
  & > .hidden{
    display:none;
  }

  position:relative;
  width:100%;
  height:100%;
`
const Div = styled.div`

`
