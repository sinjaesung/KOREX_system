// react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

// css
import styled from "styled-components";

//mateiral-ui
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Chip from '@material-ui/core/Chip';
import Stack from '@mui/material/Stack';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';
import Radio from '@material-ui/core/Radio';
import Avatar from '@mui/material/Avatar';

// img
import Profile from "../../../img/map/profile_img.png";
import Call from "../../../img/map/call.png";
import Chat from "../../../img/map/chat.png";

export default function ListItemCont_Broker_T1({ broker, isDetial }) {
  console.log('821120___broker', broker);
  return (
    <>
      <div className="par-spacing-after">
        <MUStack direction="row" spacing={0.5}>
          {
            broker.pro_apt_id &&
            <MUChip label={`${broker.pro_apt_id}`} />
          }
          {
            broker.pro_oft_id &&
            <MUChip label={`${broker.pro_oft_id}`} />
          }
          {
            broker.is_pro_store &&
            <MUChip label={`상가`} />
          }
          {
            broker.is_pro_office &&
            <MUChip label={`사무실`} />
          }
        </MUStack>
      </div>
      <div className="flex-left-center">
        <Avatar
          alt="중개사 썸네일"
          src={broker.profile ? broker.profile : Profile}
          sx={{ width: "3.5rem", height: "3.5rem" }}
        />
        <div className="par-indent-left">
          <p className="list-tit">{broker.ceo_name} {broker.name}</p>
          <p className="capt-a1">{broker.address}</p>
          <div className="flex-left-center">
            <span className="list-subtit">매매 {broker.trade}</span>
            {/* <Part /> */}
            <span className="list-subtit">전세 {broker.jeonse}</span>
            {/* <Part /> */}
            <span className="list-subtit">월세 {broker.monthly}</span>
          </div>
        </div>
      </div>
    </>
  )
};


const MUStack = styled(Stack)`
flex-flow:row wrap;
text-align:center;
//margin:1rem 0 1rem;
`
const MUChip = styled(Chip)``
const MUButton = styled(Button)``

//---------------------------------------------

const ColorOrange = styled.span`
  color:#fe7a01;
  vertical-align:middle;
`
const List = styled(ColorOrange)`
  color:#4a4a4a;
  margin-right:0.5rem;
`
const Part = styled.div`
  display:inline-block;
  width:1px;height:12px;
  background:#4a4a4a;
  margin-right:7px;
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(7/428));
    height:calc(100vw*(10/428));
  }
`