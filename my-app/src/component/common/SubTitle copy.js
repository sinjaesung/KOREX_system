//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//material-ui
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditIcon from '@material-ui/icons/Edit';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import SettingsIcon from '@material-ui/icons/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

//theme
import { TtCon_Frame_SubH } from '../../theme';

//css
import styled from "styled-components"
import BackBtn from '../../img/notice/back_btn.png';
import RightArrow from '../../img/notice/right_arrow.png';
import EditBtn from '../../img/member/edit_btn.png';
import SaveBtn from '../../img/member/save_btn.png';
import Set from '../../img/member/set.png';

export default function SubTitle({ title, arrow, path, cursor, edit, editButtonBox, editOffButtonBox, rank, accountEdit }) {
  console.log('comppnent common sub_title공통 요소 실행:', title, arrow, path, cursor, edit, editButtonBox, editOffButtonBox, rank);
  //back button
  const history = useHistory();
  const goBack = () => {
    history.goBack();
  }

  //수정버튼 클릭시 저장버튼 변경
  const editCheck = () => {
    return editButtonBox;
  }
  // 저장버튼 클릭시 수정버튼으로 변경
  const editOffCheck = () => {
    return editOffButtonBox;
  }

  //수정버튼
  const btnlist = () => {
    switch (edit) {
      case 1: //상태가 조회인상태일때.(연필수정하기노출)
        return (
          <MUIconButton size="middle" onClick={editCheck()}>
            <Tooltip title="수정하기">
              <EditIcon />
            </Tooltip>
          </MUIconButton>
        );
      case 2: //상태가 수정버튼눌러서 저장중상태일때. (저장버튼노출)
        return (
          <MUIconButton size="middle" onClick={editOffCheck()}>
            <Tooltip title="저장하기">
              <SaveAltIcon />
            </Tooltip>
          </MUIconButton>
        );
      default: return null;
    }

    // switch (edit) {
    //   case 1: //상태가 조회인상태일때.(연필수정하기노출)
    //     return (
    //       <Tooltip title="계정/프로필 설정">
    //         <MUIconButton size="middle">
    //           <Link to="/MyProfileSetting" className="data_link" />
    //           <ManageAccountsIcon />
    //         </MUIconButton>
    //       </Tooltip>
    //     );
    //   default: return null;
    // }
  }

  return (
    <div className="bgc-mono">
      <Wrapper className="clearfix">
        {/* <InSubTitle> */}
        {/* <Link onClick={goBack}>
          <BackImg src={BackBtn} />
        </Link> */}
        <div className="inlineB-float-l">
          <MUIconButton
            size="middle"
            onClick={goBack}
          >
            <ArrowBackIosNewIcon />
          </MUIconButton>
        </div>
        <div className="pos-centering wid-100pct">
          <Tooltip title="소속선택하기">
            <MUButton>
              <Link to={path}>{title}<Arrow>{arrow}</Arrow></Link>
            </MUButton>
          </Tooltip>
        </div>
        <div className="inlineB-float-r">
          {/* {btnlist()} */}
          {
            rank ?
              // <Link to="/MyAlarmSetting">
              //   <SetImg src={Set} />
              // </Link>
              <MUIconButton
                size="middle"
                onClick={goBack}
              >
                <Link to="/MyAlarmSetting"><SettingsIcon /></Link>
              </MUIconButton>
              :
              null
          }
          {
            accountEdit ?
              <Tooltip title="계정/프로필 설정">
                <MUIconButton size="middle">
                  <Link to="/MyProfileSetting" className="data_link" />
                  <ManageAccountsIcon />
                </MUIconButton>
              </Tooltip>
              :
              null
          }
          <Tooltip title="계정/프로필 설정">
            <MUIconButton size="middle">
              <Link to="/MyProfileSetting" className="data_link" />
              <ManageAccountsIcon />
            </MUIconButton>
          </Tooltip>
        </div>
        {/* </InSubTitle> */}
      </Wrapper>
    </div>
  );
}


const MUButton = styled(Button)`
&.MuiButtonBase-root.MuiButton-root{
  font-size:1rem;
}
`
const MUIconButton = styled(IconButton)`

`

//-------------------------------------------------------
const Wrapper = styled.div`
  ${TtCon_Frame_SubH}
  padding: 2px 0 2px;
  text-align:center;
  position:relative;
`
const Arrow = styled.span`
font-size:7px;
`