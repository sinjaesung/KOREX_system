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

//component
import { Mobile, PC } from "../../../../MediaQuery"
import ConditionChangeList from "./ConditionChangeList";
import RequestReviewBasicInfo from "./RequestReviewBasicInfo";
import InputForm_ItemSpec_Basic from '../common/InputForm_ItemSpec_Basic';


export default function RequsetReview({ brokerRequest_product, acceptModal, cancleModal, setAccept, setCancle, disabled, nowprdstatus }) {
  const [active, setActive] = useState(0);
  const save = () => {

  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">의뢰접수 검토</p>
        <div className="par-indent-left">
          <div className="par-spacing">
            <div className="clearfix desc">
              <p>상태: {nowprdstatus}</p>
              <p>소속명</p>
              <p>의뢰인명: {brokerRequest_product.request_man_name}({brokerRequest_product.request_mem_selectsosokid})</p>
              <p>휴대폰번호: {brokerRequest_product.request_mem_phone}</p>
              <p>요청사항: {brokerRequest_product.requestmessage}</p>
            </div>
            <MUButton variant="outlined">미리보기</MUButton>
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          <InputForm_ItemSpec_Basic brokerRequest_product={brokerRequest_product} disabled={disabled} />
          <div className="par-spacing">
            <p>위 의뢰를 수락하여 거래를 준비하시겠습니까?</p>
          </div>
          <div className="tAlign-r">
            <MUButton variant="outlined" onClick={() => { setCancle(true); cancleModal(); }}>거절</MUButton>
            <MUButton variant="contained" onClick={() => { setAccept(true); acceptModal(); }}>수락</MUButton>
          </div>
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
const MUButton_Validation = MUstyled(MUButton)`
        &.MuiButtonBase-root.MuiButton-root{
          background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
        color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
        box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"};
  }
        `