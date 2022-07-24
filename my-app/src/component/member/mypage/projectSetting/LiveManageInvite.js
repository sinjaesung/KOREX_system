//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled as MUstyled } from '@material-ui/core/styles'

//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_1col_input, } from '../../../../theme';


export default function LiveManageInvite({ reservationList, spendInviteLink, url, setUrl, text, setText }) {

  const textChange = (e) => { setText(e.target.value); }
  const urlChange = (e) => { setUrl(e.target.value); }

  const [active, setActive] = useState(false);

  const checkVaildate = () => {
    return text.length > 0 && url.length > 0
  }

  useEffect(() => {
    if (checkVaildate())
      setActive(true);
    else
      setActive(false);
  })


  return (
    <>
      <Wrapper>
        <p className="tit-a2">초대</p>
        <div className="par-indent-left">
          <div className="par-spacing tAlign-c">
              <span>총{reservationList.length}명에게 이메일 초대장을 발송합니다.</span>
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2 className="par-spacing-2p5x0">
          <div className="par-spacing">
            <MUTextField_100 label="초대 링크" variant="outlined" placeholder="Live방송에 입장할 수 있는 URL을 입력하세요." onChange={urlChange} required />
          </div>
          <div className="par-spacing">
            <MUTextField_100 placeholder="초대 내용 입력" multiline rows={4} onChange={textChange} />
          </div>
          <div className="par-spacing">
            <MUButton_Validation variant="contained" active={active} onClick={spendInviteLink}>확인</MUButton_Validation>
            {/* <SaveBtn type="submit" name="" active={active} onClick={spendInviteLink}>확인</SaveBtn> */}
          </div>
        </Sect_R2>
      </Wrapper>
    </>
  );
}

const MUTextField = styled(TextField)``

const MUTextField_100 = styled(MUTextField)`
      &.MuiFormControl-root.MuiTextField-root {
        width:100%;    
  }
`
const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col_input}  
`
const MUButton = MUstyled(Button)``

const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"};
    width: 100%; 
  }
`