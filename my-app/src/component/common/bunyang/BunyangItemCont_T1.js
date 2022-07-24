//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//style
import styled from "styled-components"

//material-ui
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { styled as MUstyled } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';


//component
import localStringData from '../../../const/localStringData';

export default function BunyangItemCont_T1({ item }) {

  console.log('손주락21121__________', item);

  return (
    <>
      <div>
        <Item_Thumb className="img-centering respHgt-100pct">
          <img src={localStringData.imagePath + (item.image_list ? item.image_list.split(',')[0] : "")} />
        </Item_Thumb>
      </div>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div>
        {
          item.liveDate ?
            <Chip label="LIVE방송 예고" color="secondary" size="small" />
            :
            null
        }
        <p className="list-tag">[{item.bp_type}]</p>
        <p className="list-tit">{item.bp_name}</p>
        {/* <Option>{item.option}</Option> */}
        <p className="capt-a1">{item.bp_addr_road}</p>
      </div>
    </>
  );
}

const MUListItem = styled(ListItem)`
  & .MuiListItemSecondaryAction-root{
    z-index:2;
  }
  &.MuiButtonBase-root.MuiListItemButton-root{
      position: relative;
  }
`
const MUListItemButton = styled(ListItemButton)``

const Item_Thumb = styled.div`
  float: left;
  width:6rem;
`

const LiImg = styled.img`
  float:left;
  display:inline-block;
  width:6rem;height:6rem;
  border:1px solid #e4e4e4;
`
const LiDesc = styled.div`
  float:left;
  padding-top:10px;
`
const LiTitle = styled.h3``

const Number = styled.span`
  vertical-align:baseline;
`

const Option = styled.div``
const Address = styled(Option)``