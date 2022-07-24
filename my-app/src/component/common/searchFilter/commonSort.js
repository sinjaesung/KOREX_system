//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';

//css
import styled from "styled-components"


const CommonSort = ({ onClickEls, items }) => {

  // 외부에서 클릭 시 발생하는 함수를 정의해주어야 합니다.
  // const [open, setopen] = useState(false)
  //... 눌렀을때(메뉴)

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItem = (e) => {
    console.log('211207___iiii',e.target.id);
    return (
      onClickEls(e.target.id)
    )
  }
  
  return (
    <>
      <IconButton
        onClick={handleClick}
      >
        <SortIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {
          items.map((item) => {
            return <MenuItem id={item} onClick={(e)=> onClickEls(e)}>{item}</MenuItem>
          })
        }
      </Menu>
    </>
  )
};

export default CommonSort;