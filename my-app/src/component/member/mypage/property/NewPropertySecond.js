//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_1col_input, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

//component
import InputForm_ItemSpec_Basic from '../common/InputForm_ItemSpec_Basic';

import tempBrokerRequest from '../../../../store/modules/tempBrokerRequest';

// import ModalCommonWithoutcancel from '../../../common/modal/ModalCommonWithoutcancel';
import ModalCommonWithoutcancel from '../../../common/modal/ModalCommonWithoutcancel';

export default function Request({ mode, nextModal, saveNext, updateModal ,serveruploadimgs_server ,changeaddedimgs_server}) {

  const tempBrokerRequest = useSelector(data => data.tempBrokerRequest);
  const history = useHistory();

  const [active, setActive] = useState(false);
  const [forwarding, setforwarding] = useState(0)


  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });


  const nextStep = () => {

    if (active == false) {
      console.log(!tempBrokerRequest.dangi, !tempBrokerRequest.jeonyongdimension, !tempBrokerRequest.jeonyongpyeong, !tempBrokerRequest.jeonyongdimension, !tempBrokerRequest.supplydimension, !tempBrokerRequest.supplypyeong, !tempBrokerRequest.selltype, !tempBrokerRequest.sellprice);
      alert('필수입력사항을 채워주세요!');
      return;
    }else{
      history.push('/AddPropertyThird');
      console.log('확인하기5569',tempBrokerRequest);
      // nextModal();
      // /AddPropertyThird
      
      
    }

  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">물건 등록&#62; 필수정보</p>
        <Sect_R2>
          <InputForm_ItemSpec_Basic setActive={setActive} forwarding={forwarding} nextModal={nextModal} saveNext={saveNext} setModalOption={setModalOption} modalOption={modalOption} updateModal={updateModal} serveruploadimgs_server={serveruploadimgs_server} changeaddedimgs_server={changeaddedimgs_server}/>
          {/* <div className="par-spacing">
            <MUButton_Validation variant="contained" type="button" name="" active={active} onClick={nextStep}>다음</MUButton_Validation>
          </div> */}
        </Sect_R2>
      </Wrapper >
      <ModalCommonWithoutcancel modalOption={modalOption} />
    </>
  );
}


const MUButton = styled(Button)``
//--------------------------------------
const Wrapper = styled.div`
        ${TtCon_Frame_B}
        `
const Title = styled.h2``

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