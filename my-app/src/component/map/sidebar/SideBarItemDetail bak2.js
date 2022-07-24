//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//theme
import { TtCon_Frame_Portrait_A, TtCon_MainMapSidePanel_ArticlePos_NoFilterList } from '../../../theme';

//material-ui
import Button from '@mui/material/Button';
import IconButton from '@material-ui/core/IconButton';

// components
import SideSubTitle from "./subtitle/SideSubTitle";
import MaemulDetailContent from './maemulDetailContent';



export default function SideItemDetail({ openBunyang, rank, updatePageIndex, setHistoryInfo, historyInfo, report, setReport, reser, updateReserveModal, click_prdidentityid }) {
 

  return (
    <Wrapper>
      <SideSubTitle title={"물건 상세"} updatePageIndex={updatePageIndex} historyInfo={historyInfo} />{/*상단 타이틀은 subtitle폴더에 컴포넌트로 뺐습니다*/}
      <MaemulDetailContent updatePageIndex={updatePageIndex} setHistoryInfo={setHistoryInfo} setReport={setReport} click_prdidentityid={click_prdidentityid} />
    </Wrapper>
  );
}


const MUButton = styled(Button)``
const MUIconButton = styled(IconButton)``

//--------------------------------------------------------

const Wrapper = styled.div`
height:100%;
`