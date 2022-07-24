//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col, } from '../../../../theme';

//material-ui
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';

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

import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';

export default function Live({ updateModal, list, updateList, alramsetting_tiny, setalramsetting_tiny }) {

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);

  const showModal = () => {
    setMenu(!menu);
  }

  const topInfoContent = () => {
    return (
      <IconButton onClick={() => { updateModal(); }}>
        <FilterListIcon />
      </IconButton>
    )
  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">내 Live시청예약</p>
        {/* -- 수정코드입니다. */}
        <Sect_R2>
          <div className="par-spacing">
            <CommonTopInfo length={list.length} leftComponent={topInfoContent()} />
          </div>
          {/* -- 원래 코드입니다. */}
          {/*
              <TopInfo>
                <All>총 <GreenColor>3</GreenColor> 건</All>
                <div onClick={() => {updateModal();}} className="cursor-p">
                  <FilterImg src={Filter} alt="filter"/>
                </div>
              </TopInfo>
            */}
          <div className="par-spacing-after">
            <ul className="scroll-y">
              {
                list.map((value) => {

                  const type = () => {
                    if (value.tr_status == 0) {
                      return "#707070"
                    } else if (value.tr_status == 1) {
                      return "#707070"
                    } else if (value.tr_status == 0) {
                      return "#01684b"
                    }
                  }
                  const type2 = () => {
                    if (value.tr_status == 0) {
                      return 1
                    } else if (value.tr_status == 1) {
                      return 0.5
                    } else if (value.type == "days") {
                      return 1
                    } else if (value.type == "end") {
                      return 0.5
                    }
                  }

                  return (
                    <LiveList value={value} type={type} type2={type2} updateList={updateList} alramsetting_tiny={alramsetting_tiny} setalramsetting_tiny={setalramsetting_tiny} />
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


const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col}
`