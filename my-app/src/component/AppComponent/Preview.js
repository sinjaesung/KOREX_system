//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col_input, } from '../../theme';

//material-ui
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';

//components
import MaemulDetailContent from '../map/sidebar/maemulDetailContent';

//server controller
import serverController from '../../server/serverController';


export default function PreviewPage({ updateReserveModal, reportModal, rejectModal, confirmModal, maemulinfo, buildinginfo, complexinfo, probrokerinfo, prdid, startDeal }) {
  console.log('5556', maemulinfo);
  console.log('555677', probrokerinfo);
  return (
    <>
      <Wrapper>
        <div className="tAlign-c">
          <p className="tit-a2">전속매물거래를 개시하겠습니다.</p>
          <div className="par-spacing">
            <MUButton variant="contained" onClick={() => { startDeal(); }}>확인</MUButton>
          </div>
        </div>
        &nbsp;
        <div className="divider-a1" />
        <Sect_R2>
          <MaemulDetailContent mode={'의뢰인동의뷰'} Previewinfo={maemulinfo} previewprobrokerinfo={probrokerinfo} prdid={prdid} />
        </Sect_R2>
      </Wrapper>
    </>
  );
}

const MUButton = styled(Button)``
//---------------------------------
const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2`
  ${TtCon_Title}  
`
const Sect_R2 = styled.div`
  ${TtCon_1col_input}
`