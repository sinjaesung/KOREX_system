//react
import React ,{useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import { Mobile, PC } from "../../MediaQuery";
import NavIcon from '../../img/main/nav_btn.png';
import Logo from '../../img/main/header_logo.png';
import PCLogo from '../../img/main/pc_header_logo.png';
import Mypage from '../../img/main/mypage_icon.png';

// components
import WrapMaptest from './map/WrapMaptest';

export default function MainHeader({openBunyang, rank, setReport,reserveModal,setMap,setDangimap_data, status}){
    //console.log('mainMap실행>>');
    const [pageIndex , setPageIndex] = useState(0);

    const containerRef = useRef();

    return (
      <Container>
        <PC>
          <WrapMaptest status={status} containerRef={containerRef}/>
        </PC>
        <Mobile>
          {
            pageIndex == 0 ?
            <WrapMaptest status={status}/>
            :
            null
          }
        </Mobile>
        
      </Container>
    );
}

const Container = styled.div`
    position:relative;
    width: 100%;
    height: 100%;
`
