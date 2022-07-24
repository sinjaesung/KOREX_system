//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import { IconButton } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';

//style
import styled from "styled-components"

//component
import SearchInput_T1 from '../../searchFilter/SearchInput_T1';

import BunyangItem from '../BunyangItem';

export default function ContBunyangList({ searchVal, setSearchVal, onClickSearch, updateModal, onClickList, loginUser, byList }) {
  
  return (
    <>
        <TopSect>
          <SearchInput_T1 placeholder={"검색어 입력"} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} goAction={onClickSearch}/>
          <Filter>
            <MUIcontButton onClick={() => { updateModal(); }}>
              <FilterListIcon />
            </MUIcontButton>
          </Filter>
        </TopSect>
        <MiddleSect>
          <ListTop>총 {byList.length}건</ListTop>
          <WrapList>
            <ListUl>
              {
                byList.map((value, index) => {
                  return <BunyangItem value={value} index={index} onClickList={() => { onClickList(value) }} loginUser={loginUser} />
                })
              }
            </ListUl>
          </WrapList>
        </MiddleSect>
    </>
  );
}

const MUIcontButton = styled(IconButton)``

const TopSect = styled.div`
  display:flex;justify-content:flex-end;align-items:center;
  background:#f8f7f7;
  padding:0.725rem;
`
const MiddleSect = styled.div`
  height:100%;
  padding: 1rem 5%;
`
const Filter = styled.div`
`
const ListTop = styled.div`
`
const WrapList = styled.div`
  height: 75%;
  overflow-y:scroll;
`
const ListUl = styled.ul``