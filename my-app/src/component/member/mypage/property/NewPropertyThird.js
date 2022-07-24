//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//server process
import serverController from '../../../../server/serverController';
import serverController2 from '../../../../server/serverController2';

//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_1col_input, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


//component
import { Mobile, PC } from "../../../../MediaQuery"
import ModalCommon from '../../../common/modal/ModalCommon';
import ModalCommonWithoutcancel from '../../../common/modal/ModalCommonWithoutcancel';
import InputForm_ItemSpec_Add from '../common/InputForm_ItemSpec_Add';

export default function Request({ updateModal, serveruploadimgs_server, changeaddedimgs_server, setimgfiles, imgfiles, prdID}) {

  const [active, setActive] = useState(0);
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  const nextStep = () => {

  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">물건 등록&#62; 추가정보</p>
        <Sect_R1></Sect_R1>
        <Sect_R2>
          <InputForm_ItemSpec_Add updateModal={updateModal} serveruploadimgs_server={serveruploadimgs_server} changeaddedimgs_server={changeaddedimgs_server} setimgfiles={setimgfiles} imgfiles={imgfiles} setModalOption={setModalOption} modalOption={modalOption} prdID={prdID}/>
          {/* <div className="par-spacing">
            <MUButton_Validation variant="contained" type="button" name="" active={""} onClick={nextStep}>다음</MUButton_Validation>
          </div> */}
        </Sect_R2>
      </Wrapper>
      {/* <ModalCommon modalOption={modalOption} /> */}
      <ModalCommonWithoutcancel modalOption={modalOption} />
    </>
  );
}

const MUButton = styled(Button)``

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R1 = styled.div`
  /* border-bottom:1px solid ${(props) => props.theme.palette.line.main}; */
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