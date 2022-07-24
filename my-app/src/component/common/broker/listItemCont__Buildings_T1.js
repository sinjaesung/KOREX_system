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

//component
import { insertYMComma, insertZero, numTokor } from '../commonUse';

// img
import Profile from "../../../img/map/profile_img.png";
import Call from "../../../img/map/call.png";
import Chat from "../../../img/map/chat.png";

export default function ListItemCont_Buildings_T1({ item, isDanji }) {
  return (
    <>
      <p className="fs-1p2">{item && item.complex_name}</p>
      <div className="pl-0p3">
        <p className="txt-sub c-blx0p4">{item && item.addr_jibun}({item && item.addr_road})</p>
      </div>

      {item ?
        <>
          {
            isDanji ?
              <div className="pl-0p3">
                <div className="flex-left-center fs-0p9 c-secondary">
                  <span>{insertYMComma(item['contract_ym'])}.{insertZero(item['contract_dt'])},&nbsp;&nbsp;</span>
                  <span>{item['type']}{numTokor(item['deposit'])},&nbsp;&nbsp;</span>
                  <span>{item['floor']}층</span>
                </div>
              </div>
              :
              <div className="pl-0p3">
                <div className="flex-left-center fs-0p9 c-secondary">
                  <span>{insertYMComma(item['contract_ym'])}.{insertZero(item['contract_dt'])},&nbsp;&nbsp;</span>
                  <span>{item['type']}{numTokor(item['deposit'])}{item['type'] == '월세' ? item['monthly_rent'] + "만원" : ''},&nbsp;&nbsp;</span>
                  <span>{item['floor']}층</span>
                </div>
              </div>
          }
        </>
        :
        null
      }
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
