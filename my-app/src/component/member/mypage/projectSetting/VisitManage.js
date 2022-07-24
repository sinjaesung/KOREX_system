//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import ModalSearch from '../../../common/modal/ModalSearch';

//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col, } from '../../../../theme';

//material-ui
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';

//img
import FilterImgIcon from '../../../../img/member/filter.png';
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
import IconSearch from '../../../../img/main/icon_search.png';

import { Mobile, PC } from "../../../../MediaQuery"

//component
import VisitManageList from "./VisitManageList";
import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';
import SearchInput_T1 from '../../../common/searchFilter/SearchInput_T1';

import serverController from '../../../../server/serverController';

export default function VisitManage({ updateModal, cancleModal, setCancle, reservationList, openVisitorList, updateReservationList, setFilter, alramsetting_tiny, setalramsetting_tiny }) {

  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");

  const showModal = () => {
    setMenu(!menu);
  }

  const topInfoContent = () => {

    return (
      <div className="flex-right-center">
        {/* <ModalSearch placeholder={"예약자 검색"} value={search} onChange={(e) => { setSearch(e.target.value); setFilter((ob) => { ob.search = e.target.value; return ob; }) }}>
          <SearchButton type="button" onClick={updateReservationList}/>
        </ModalSearch> */}

        {/* <FilterImg src={FilterImgIcon} onClick={updateModal} alt="filter" /> */}

        {/* <SearchBox>
          <InputSearch type="search" placeholder="예약자 검색" value={search} onChange={(e)=>{setSearch(e.target.value); setFilter((ob)=>{  ob.search = e.target.value; return ob;})}}/>
          <SearchButton type="button" onClick={updateReservationList}/>
        </SearchBox>
        <FilterImg src={FilterImgIcon} onClick={updateModal} alt="filter"/> */}

        <SearchInput_T1 placeholder={"예약자 검색"} value={search} onChange={(e) => { console.log("동작"); setSearch(e.target.value); setFilter((ob) => { ob.search = e.target.value; return ob; }) }} goAction={updateReservationList} />
        <IconButton onClick={() => { updateModal(); }}>
          <FilterListIcon />
        </IconButton>

      </div>
    )
  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">방문예약접수 관리</p>
        <Sect_R2>
          <div className="par-spacing">
            <CommonTopInfo length={reservationList.length} leftComponent={topInfoContent()} />
          </div>
          {/* <TopInfo>
              <All>총 <GreenColor>3</GreenColor> 건</All>
              <FilterAndAdd>
                <SearchBox>
                  <InputSearch type="search" placeholder="예약자 검색"/>
                  <SearchButton type="button"/>
                </SearchBox>
                <FilterImg src={Filter} onClick={()=>{setFilter(true);updateModal();}} alt="filter"/>
              </FilterAndAdd>
            </TopInfo> */}
          <div className="par-spacing-after">
            <ul className="scroll-y">
              {
                reservationList.map((value) => {
                  let isEnd;
                 if(value.reserv_start_time){
                  isEnd = new Date(value.reserv_start_time.split('.')[0].replace(/T/gi, ' ').replace(/-/gi, '/')).getTime() < new Date().getTime();
                 }
                  
                  const type = () => {
                    if (isEnd) {
                      return "#707070"
                    }
                    if (value.tr_status == 0) {
                      return "#fe7a01"
                    } else if (value.tr_status == 1)
                      return "#707070"
                    return "#fe7a01";
                  }
                  const type2 = () => {
                    if (isEnd) {
                      return 0.5
                    }
                    if (value.tr_status == 0) {
                      return 1
                    } else if (value.tr_status == 1)
                      return 0.5
                    return 1;
                  }

                  return <VisitManageList
                    cancleModal={cancleModal}
                    setCancle={setCancle}
                    openVisitorList={openVisitorList}
                    isEnd={isEnd}
                    value={value}
                    type={type}
                    type2={type2}
                    alramsetting_tiny={alramsetting_tiny}
                    setalramsetting_tiny={setalramsetting_tiny}
                  />
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