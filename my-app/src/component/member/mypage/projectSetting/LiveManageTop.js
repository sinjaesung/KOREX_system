//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

//img
import Check from '../../../../img/map/radio.png';
import Checked from '../../../../img/map/radio_chk.png';
import ArrowDown from '../../../../img/member/arrow_down.png';

import { Mobile, PC } from "../../../../MediaQuery"

//component
import LiveManageList from "./LiveManageList";

export default function LiveManageTop({ reservationList, isAllCheck, onChangeAllCk }) {

  const [active, setActive] = useState(false);

  return (
    <>
      <div className="flex-spabetween-center">
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={isAllCheck} onChange={(e) => onChangeAllCk(e)} />} label="전체선택" />
        </FormGroup>
        {/* 전체선택 */}
        {/* <CheckBox>
              <InputCheck type="checkbox" id="all" checked={isAllCheck} onChange={(e) => onChangeAllCk(e)}/>
              <CheckLabel for="all">
                <Span/>
                전체선택
              </CheckLabel>
            </CheckBox> */}

          {/*!!@@ 211102_이형규>수정---체크박스가 전체or특정 선택이 되어야만 유효성 버튼 활성화되어야 함.*/}  
          <MUButton_Validation variant="contained" disableElevation active={active}><Link to={{ pathname: "/MyLiveManageInvite", state: { list: reservationList.filter((value) => value.isChecked) } }} className="data_link"/>초대</MUButton_Validation>
          {/* <Invite>초대</Invite> */}
      </div>
    </>
  );
}


const MUButton = styled(Button)``

const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
  }
`