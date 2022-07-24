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
import IconButton from '@material-ui/core/IconButton';
import Chip from '@mui/material/Chip';

//img
import ItemImg from "../../../img/main/item01.png";
import Heart from "../../../img/main/heart.png";
import HeartCheck from "../../../img/main/heart_check.png";
import IconSearch from "../../../img/main/icon_search.png";
import IconRecent from "../../../img/main/icon_view.png";

//component
import ModalCommon from "../modal/ModalCommon";
import ModalFilter from "./modal/ModalFilter";

import serverController from "../../../server/serverController";
import localStringData from '../../../const/localStringData';
import LikeCheckBtn from '../accessary/likeCheckBtn';

export default function BunyangItem({ value, index, onClickList, loginUser }) {

  // const [active, setActive] = useState(value.isLike);
  // const LikeButton = () => {

  // console.log('여기확인',value);


  //   if (!loginUser.memid) {
  //     window.location.href = "/MemberLogin";
  //     return;
  //   }
  //   const data = {
  //     mem_id: loginUser.memid ? loginUser.memid : 0,
  //     prd_identity_id: value.prd_identity_id ? value.prd_identity_id : 0,
  //     bp_id: value.bp_id ? value.bp_id : 0,
  //     likes_type: 0,
  //   }

  //   serverController.connectFetchController("/api/likes/item", 'POST', JSON.stringify(data), function (res) {
  //     setActive(e => !e);
  //   });

  // }


  return (

    <MUListItem_Wrap disablePadding>
      <WrapLikeCheckBtn>
        <LikeCheckBtn user={loginUser} item={value} />
        {/* <Like type="checkbox" name="" id={`Like${index}`} defaultChecked={active} onClick={() => { LikeButton(value, index) }}></Like>
        <Label for={`Like${index}`} className="check_label"></Label> */}
      </WrapLikeCheckBtn>
      <ListItemButton >
        <Link onClick={() => onClickList(value)} className="data_link"></Link>
        <LiImg src={localStringData.imagePath + (value.image_list ? value.image_list.split(',')[0] : "")} />
        <LiDesc>
          {
            value.liveDate ?
              // <LiveView>Live방송 예고</LiveView>
              <Chip label="LIVE방송 예고" color="secondary" size="small" />
              :
              null
          }
          <LiTitle>{value.bp_name}
            <Number>{value.bp_type}</Number>
          </LiTitle>
          <Option>{value.option}</Option>
          <Address>{value.bp_addr_road}</Address>
        </LiDesc>
      </ListItemButton>
    </MUListItem_Wrap>
  );
}

const MUListItem = styled(ListItem)``
const MUTxt = styled(ListItemText)``
const MUListItemIcon = styled(ListItemIcon)``
const MUIconButton = styled(IconButton)``

const MUListItem_Wrap = styled(MUListItem)`
  &.MuiButtonBase-root.MuiListItemButton-root{
    position: relative;
  }
`

const MUIconButton_Like = styled(MUIconButton)`
  &.MuiButtonBase-root.MuiIconButton-root{
    position: absolute;
    z-index: 99;
    right:2%;
  }
`
const WrapLikeCheckBtn = styled.div`
    position: absolute;
    z-index: 99;
    right:2%;
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

const LikeBtn = styled.div`
  position:Absolute;
  right:0;
  top:10px;
`
const Like = styled.input`
  display:none;
  &:checked + .check_label{width:29px;height:29px;background:url(${HeartCheck}) no-repeat center center;background-size:17px 17px;}
`
const Label = styled.label`
  display:inline-block;
  width:29px;height:29px;
  border:1px solid #d0d0d0;border-radius:3px;
  background:url(${Heart}) no-repeat center center;
  background-size:17px 17px;
`