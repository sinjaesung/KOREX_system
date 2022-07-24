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

import VisitList from "./VisitList";

export default function BrokerVisit({ updateList, calModal, visitorModal, updateModal, updateMapModal, list, alramsetting_tiny, setalramsetting_tiny }) {

  console.log('방문예약내역 trid요소들::', list);
  return (
    <>
      <Wrapper>
        <p className="tit-a2">내 방문예약</p>
        <Sect_R2>
          <div className="par-spacing">
            <div className="flex-spabetween-center">
              <span>총 {list.length}건</span>
              {/* <Link onClick={() => {setFilter(true);updateModal();}}/> */}
              {/* <All>총 <GreenColor>3</GreenColor> 건</All> */}
              <IconButton onClick={() => { updateModal(); }}>
                <FilterListIcon />
              </IconButton>
            </div>
          </div>
          <div className="par-spacing-after">
            <Ul>
              {
                list.map((value) => {
                  console.log('valuesss:', value);
                  const type = () => {
                    if (value.type == "today") {
                      return "#fe7a01"
                    } else if (value.type == "cancel") {
                      return "#707070"
                    } else if (value.type == "days") {
                      return "#01684b"
                    }
                  }
                  const type2 = () => {
                    if (value.type == "today") {
                      return 1
                    } else if (value.type == "cancel") {
                      return 0.5
                    } else if (value.type == "days") {
                      return 1
                    }
                  }

                  return (
                    <VisitList updateList={updateList} visitorModal={visitorModal} calModal={calModal} updateMapModal={updateMapModal} value={value} type={type} type2={type2} alramsetting_tiny={alramsetting_tiny} setalramsetting_tiny={setalramsetting_tiny} />
                  )
                })
              }
            </Ul>
            </div> 
        </Sect_R2>
      </Wrapper>
    </>
  );
}



const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2`
  ${TtCon_Title}
`
const Sect_R2 = styled.div`
  ${TtCon_1col}
`
const Ul = styled.ul`
  width:100%;
  overflow-y:scroll;
`
