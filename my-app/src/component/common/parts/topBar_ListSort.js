//react
import React, { useState, useEffect } from 'react';

//css
import styled from "styled-components";

//component
import SearchInput_T1 from '../searchFilter/SearchInput_T1';

//material-ui
import IconButton from '@material-ui/core/IconButton';
import SortIcon from '@mui/icons-material/Sort';

//Sort(정렬)스타일 탑바
const TopBar_ListSort = ({ length, placeholder }) => {

  return (
    <div className="flex-spabetween-center">
      {
        length ?
        <span>총 {length} 건</span>
        :
        <div className="flexGlow-1"/>
      }
      <div className="flex">
        <SearchInput_T1 placeholder={placeholder} />
        <IconButton >
          <SortIcon />
        </IconButton>
      </div>
    </div>
  )
};

export default TopBar_ListSort;