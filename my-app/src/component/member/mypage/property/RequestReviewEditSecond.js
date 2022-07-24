//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col_input, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

//img
import ArrowDown from '../../../../img/member/arrow_down.png';

//component
import { Mobile, PC } from "../../../../MediaQuery"
import RequestReviewEditSecondInfo from "./RequestReviewEditSecondInfo";
import InputForm_ItemSpec_Add from '../common/InputForm_ItemSpec_Add';
import ModalCommonWithoutcancel from '../../../common/modal/ModalCommonWithoutcancel';

export default function RequsetReview({ confirmModal, updateModal, serveruploadimgs_server, changeaddedimgs_server, prd_id, setprdidinfo }) {
  

  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  console.log('파람스55', prd_id );


  return (
    <>
      <Wrapper>
        <p className="tit-a2">물건 수정&#62; 추가정보</p>
        <div className="divider-a1" />
        <Sect_R2>
          <InputForm_ItemSpec_Add confirmModal={confirmModal} updateModal={updateModal} serveruploadimgs_server={serveruploadimgs_server} changeaddedimgs_server={changeaddedimgs_server} prdID={prd_id} setModalOption={setModalOption} modalOption={modalOption} setprdidinfo={setprdidinfo}/>
          {/* <MUButton_Validation variant="contained" type="submit" name="" active={active} onClick={""}>저장</MUButton_Validation> */}
        </Sect_R2>
      </Wrapper>
      <ModalCommonWithoutcancel modalOption={modalOption} />
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
const MUButton_Validation = MUstyled(MUButton)`
        &.MuiButtonBase-root.MuiButton-root{
          background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
        color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
        box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"};
        width:100%;
  }
  `
