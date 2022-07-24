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
import ModalCommon from "../modal/ModalCommon";
import ModalFilter from "./modal/ModalFilter";
import BunyangItemCont_T1 from './BunyangItemCont_T1';

import serverController from "../../../server/serverController";
import localStringData from '../../../const/localStringData';
import LikeCheckBtn from '../accessary/likeCheckBtn';

export default function BunyangItem({ mode_likeCheckBtn, user, item, setListData, onClickList,}) {
 
  console.log('아이템__________',item);
  return (
    <MUListItem
      disablePadding
      secondaryAction={
         <LikeCheckBtn mode={mode_likeCheckBtn} user={user} item={item} setListData={setListData}/>
      }
    >
      <MUListItemButton >
        <Link onClick={() => onClickList(item)} className="data_link"></Link>
        <BunyangItemCont_T1 item={item} />
      </MUListItemButton>
    </MUListItem>
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