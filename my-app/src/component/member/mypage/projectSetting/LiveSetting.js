//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col } from '../../../../theme';

//img
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Location from '../../../../img/member/loca.png';
import Set from '../../../../img/member/setting.png';
import Item from '../../../../img/main/item01.png';
import Noimg from '../../../../img/main/main_icon3.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';

import { Mobile, PC } from "../../../../MediaQuery"

import LiveList from "./LiveList";

export default function LiveSetting({ settingList, addModal, editModal, cancleModal, comfirmModal, setAdd, setEdit, setCancle }) {

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">Live시청예약 세팅</p>
        <div className="par-spacing">
          <div className="flex-right-center">
            <MUButton variant="contained" disableElevation onClick={() => { setAdd(true); addModal(); }}>추가</MUButton>
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          <div className="par-spacing-after">
            <ul className="scroll-y">
              {
                settingList.map((value) => {

                  const type = () => {
                    if (value.tr_status == 0) {
                      return "#fe7a01"
                    } else if (value.tr_status == 1)
                      return "#707070"
                    return "#fe7a01";
                  }

                  const type2 = () => {
                    if (value.tr_status == 0) {
                      return "#fe7a01"
                    } else if (value.tr_status == 1)
                      return "#707070"
                    return "#fe7a01";
                  }

                  return (
                    <LiveList comfirmModal={comfirmModal} editModal={editModal} cancleModal={cancleModal} setCancle={setCancle} setEdit={setEdit} value={value} type={type} type2={type2} />
                  )
                })
              }
            </ul>
          </div>
        </Sect_R2>
      </Wrapper>
    </>
  );
}

const MUButton = styled(Button)``
//------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col}
`