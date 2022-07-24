//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import { styled } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';

//css
import Sstyled from "styled-components"

//img
import View from '../../../../img/main/icon_view.png';

const CommonFilter = ({ onClick }) => {

  // 외부에서 클릭 시 발생하는 함수를 정의해주어야 합니다.
  // const [open, setopen] = useState(false)
  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const Test=(e)=>{
    console.log(e.target.id);
    return(
      onClick(e.target.id)
    )
  }



    return(
        <FilterAndAdd>

        <IconButton
          onClick={handleClick}
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem id={"최신등록순"} onClick={Test}>최신등록순</MenuItem>
          <MenuItem id={"높은가격순"} onClick={Test}>높은가격순</MenuItem>
          <MenuItem id={"낮은가격순"} onClick={Test}>낮은가격순</MenuItem>
          <MenuItem id={"넓은면적순"} onClick={Test}>넓은면적순</MenuItem>
          <MenuItem id={"좁은면적순"} onClick={Test}>좁은면적순</MenuItem>
          <MenuItem id={"가나다순"} onClick={Test}>가나다순</MenuItem>
        </Menu>



      {/* <div onClick={showModal} className="cursor-p">
            <FilterImg src={View} alt="filter"/>
            {
                menu ?
                <InMenu>
                    <Div>
                        <div className={["data_link", "cursor-p"]}></div>
                        <InDiv onClick={onClick && onClick}>최신등록순</InDiv>
                    </Div>
                    <Div>
                        <div className={["data_link", "cursor-p"]}></div>
                        <InDiv onClick={onClick && onClick}>높은가격순</InDiv>
                    </Div>
                    <Div>
                        <div className={["data_link", "cursor-p"]}></div>
                        <InDiv onClick={onClick && onClick}>낮은가격순</InDiv>
                    </Div>
                    <Div>
                        <div className={["data_link", "cursor-p"]}></div>
                        <InDiv onClick={onClick && onClick}>넓은면적순</InDiv>
                    </Div>
                    <Div>
                        <div className={["data_link", "cursor-p"]}></div>
                        <InDiv onClick={onClick && onClick}>좁은면적순</InDiv>
                    </Div>
                    <Div>
                        <div className={["data_link", "cursor-p"]}></div>
                        <InDiv onClick={onClick && onClick}>가나다순</InDiv>
                    </Div>
                </InMenu>
                :
                null
            }
            </div> */}
    </FilterAndAdd>
  )
};

export default CommonFilter;

const MUMenuItem = styled(MenuItem)`
  color : ${props => props.color}
`

const FilterAndAdd = Sstyled.div`
  position:relative;
  display:flex;justify-content:flex-start; align-items:center;
`
const FilterImg = Sstyled.img`
  display:inline-block;
  width:18px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
  }
`
const InMenu = Sstyled.ul`
  position:absolute;
  top:20px;left:0;
  width:112px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;
  z-index:3;
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(35/428));
    left:calc(100vw*(-60/428));
    width:calc(100vw*(80/428));
  }
`
const Div = Sstyled.li`
  position:relative;
  font-size:13px;
  transform:skew(-0.1deg);
  border-radius:8px;
  padding:4px 0 4px 17px;
  transition:all 0.3s;
  &:hover{background:#f8f7f7;}
  &:first-child{padding-top:8px;}
  &:last-child{padding-bottom:8px;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    padding:calc(100vw*(4/428)) 0 calc(100vw*(4/428)) calc(100vw*(12/428));
    &:first-child{padding-top:calc(100vw*(8/428));}
    &:last-child{padding-bottom:calc(100vw*(8/428));}
  }
`
const InDiv = Sstyled.div`
  width:100%;height:100%;
`
