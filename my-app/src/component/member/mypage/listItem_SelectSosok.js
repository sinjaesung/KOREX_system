//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//material-ui
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';


//css
import styled from "styled-components"
import Item from '../../../img/member/item.png';
import NoImg from '../../../img/member/company_no.png';
import RightArrow from '../../../img/notice/right_arrow.png';

//react redux
import { useSelector } from 'react-redux';
import { Login_userActions } from '../../../store/actionCreators';

//server
import serverController from '../../../server/serverController';

export default function ListItem_SelectSosok({user, value, onClickTeam}) {

  console.log('211205____cccc2222', value);

  return (
    <>
      <MUListItem disablePadding>
        <MUListItemButton onClick={() => onClickTeam(value)}>
          <Link to={"/Mypage"} className="data_link"></Link>
          <ListItemIcon>
            <ItemImg src={user.user_type != '분양대행사'? value.profile_img : value.mem_img} />
          </ListItemIcon>
          <ListItemText primary={user.user_type != '분양대행사'? value.company_name : value.bp_name} />
          <ChevronRightIcon />
        </MUListItemButton>
      </MUListItem>
    </>
  );
}



const MUListItem = styled(ListItem)``
const MUListItemButton = styled(ListItemButton)``
const MUListItemTxt = styled(ListItemText)``



const ItemImg = styled.img`
  width:55px;height:55px;
  border-radius:3px;
  margin-right:20px;
  border:1px solid #e4e4e4;
  transform:skew(0.1deg);
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(55/428));height:calc(100vw*(55/428));
    margin-right:calc(100vw*(28/428));
    }
`

const GoDetail = styled.span`

`
const RightArrowImg = styled.img`
  width:8px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(5/428));
  }
`
