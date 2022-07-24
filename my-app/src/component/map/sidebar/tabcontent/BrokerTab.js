//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled, { keyframes } from "styled-components";

//material
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';

// components
import { Mobile, PC } from "../../../../MediaQuery";
import { opacityAni, retunAnimation, animationDelay } from './contentAnimation';
import { InsertComma, DateText, SliceText, numTokor } from '../../../common/commonUse';
import ListItemCont_Broker_T1 from '../../../common/broker/listItemCont_Broker_T1';

// redux
import { MapProductEls } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';
import serverController from '../../../../server/serverController';


export default function BrokerTab({ value, index, onClickEl, loginUser }) {

  return (
    <WrapListItem
      key={index}
      aniDelay={animationDelay(index)}
    >
      <MUListItem disablePadding>
        <MUListItemButton>
          <div className="flexGlow-1">
            <Link onClick={() => onClickEl(value)} className="data_link"></Link>
            <ListItemCont_Broker_T1 broker={value.probroker_info} />
          </div>
        </MUListItemButton>
      </MUListItem>
    </WrapListItem>
  );
}

const WrapListItem = styled.div`
  position:relative; 
  animation-name: ${opacityAni}; 
  ${({ aniDelay }) => { return retunAnimation(aniDelay) }};
  background-color:${(props) => (props.highlightcolor == true ? 'rgba(240,240,240,0.9)' : 'transparent')};
`

const MUListItem = styled(ListItem)`
& .MuiListItemSecondaryAction-root{
  top: 2rem;
  right: 1rem;
  //transform: translateY(-50%);
}

&.MuiListItem-root>.MuiListItemButton-root {
  position: relative;
  padding-right: 16px;
}
`
const MUListItemButton = styled(ListItemButton)``