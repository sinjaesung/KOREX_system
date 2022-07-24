//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"
import BackBtn from '../../../../img/notice/back_btn.png';
import RightArrow from '../../../../img/notice/right_arrow.png';
import EditBtn from '../../../../img/member/edit_btn.png';
import SaveBtn from '../../../../img/member/save_btn.png';

//material-ui
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { TtCon_MainMapSidePanel_TapPos } from '../../../../theme';

export default function SubTitle({ title, updatePageIndex, historyInfo, value }) {
  //back button
  const history = useHistory();
  const goBack = () => {
    history.goBack();
  }
  return (
    <>
      <Wrapper className="clearfix">
        <LeftSect>
          <MUIconButton
            size="middle"
            onClick={() => { 
              updatePageIndex(historyInfo.prevIndex.length == 0 ? -1 : historyInfo.prevIndex.pop()) 
              console.log('뒤로가기 버튼 클릭시에 뭔가???:',historyInfo.prevIndex,historyInfo.prevIndex.length == 0 ? -1 : historyInfo.prevIndex.pop());
            }}
          >
            <ArrowBackIosNewIcon />
          </MUIconButton>
        </LeftSect>
        <CenterSect>
          <p>{title}</p>
        </CenterSect>
      </Wrapper>
    </>
  );
}


const MUIconButton = styled(IconButton)``

//-------------------------------------------------------

const Wrapper = styled.div`
  ${TtCon_MainMapSidePanel_TapPos}
  position:relative;
  background-color:${(props) => props.theme.palette.mono.main};
`

const LeftSect = styled.div`
display: inline-block;
float: left;
position:absolute;
`
const CenterSect = styled.div`
position : absolute;
left: 50%; top: 50%;
transform: translate(-50%, -50%);
`
const RightSect = styled.div`
display: inline-block;
float: right;
`