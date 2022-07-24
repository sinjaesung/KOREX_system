//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import serverController from '../../../../server/serverController';

//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col_input, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

//component
import ListItemCont_Broker_T1 from '../../../common/broker/listItemCont_Broker_T1';
import CommonContact from '../../../common/contact/commonContact';
import BrokerInfo from './component/BrokerInfo';
import NewRequestTopInfos from './NewRequestTopInfos';
import InputForm_ItemSpec_Basic from '../common/InputForm_ItemSpec_Basic';

//redux addons saseests.
import { useSelector } from 'react-redux';
import { tempBrokerRequestActions } from '../../../../store/actionCreators';
//@@__import tempBrokerRequest from '../../../../store/modules/tempBrokerRequest';

export default function Request({ mode, failModal, probrokersingleinfo }) {

  const [active, setActive] = useState(0);
  const nextStep = () => {

  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">기본정보 입력</p>
        <div className="par-indent-left">
          <div className="par-spacing flex-col-spabetween-end">
            <ListItemCont_Broker_T1 broker={probrokersingleinfo} />
            <div>
              <CommonContact broker={probrokersingleinfo} />
            </div>
          </div>
        </div>
        <div className="divider-a1"/>
        <Sect_R2>
          <InputForm_ItemSpec_Basic setActive={setActive} mode={mode} failModal={failModal} />
          <div className="par-spacing">
            <MUButton_Validation variant="contained" type="button" name="" active={""} onClick={nextStep}>다음</MUButton_Validation>
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


