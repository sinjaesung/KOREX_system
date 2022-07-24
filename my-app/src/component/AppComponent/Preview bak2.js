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

export default function PreviewPage({ updateReserveModal, reportModal, rejectModal, confirmModal, maemulinfo, buildinginfo, complexinfo, probrokerinfo, prdid }) {
  console.log('5556',maemulinfo);
  console.log('555677',probrokerinfo);
  return (
    <>
      <Wrapper>
        <p className="tit-a2">거래개시 동의요청</p>
        <div className="par-indent-left par-spacing-before-2p5">
          <div className="par-spacing tAlign-r">
            <MUButton variant="standard" onClick={() => { rejectModal(); }}>거절</MUButton>
            <MUButton variant="contained" onClick={() => { confirmModal(); }}>동의하기</MUButton>
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          <MaemulDetailContent mode={'의뢰인동의뷰'} Previewinfo={maemulinfo} previewprobrokerinfo={probrokerinfo} prdid={prdid}/>
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