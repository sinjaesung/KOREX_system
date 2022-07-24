//react
import React, { useState, useEffect } from 'react';

//css
import styled from "styled-components";

//component
import SearchInput_T1 from '../searchFilter/SearchInput_T1';

//material-ui
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';

//Sort(정렬)스타일 탑바
const TopBar_ListSort = ({ length }) => {

  return (
    <div className="flex-spabetween-center">
      {
        length ?
        <span>총 {length} 건</span>
        :
        <div className="flexGlow-1"/>
      }
      <div className="flex">
        <SearchInput_T1 placeholder={"예약자 검색"} />
        <IconButton >
          <FilterListIcon />
        </IconButton>
      </div>
    </div>
  )
};

export default TopBar_ListSort;