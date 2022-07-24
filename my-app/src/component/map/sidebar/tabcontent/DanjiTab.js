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
import ListItemCont_Buildings_T1 from '../../../common/broker/listItemCont__Buildings_T1';

// redux
import { MapProductEls } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';
import serverController from '../../../../server/serverController';


export default function DanjiTab({ value, index, onClickEl, loginUser }) {

  const mapHeaderRedux = useSelector(state => { return state.mapHeader });

  return (
    <WrapListItem
      key={index}
      highlightcolor={value.complex_id === mapHeaderRedux['originid']['id_vals']}
      aniDelay={animationDelay(index)}
    >
      <MUListItem disablePadding>
        <MUListItemButton>
          <div className="flexGlow-1">
            <Link onClick={() => onClickEl(value)} className="data_link"></Link>
            <ListItemCont_Buildings_T1 item={value} isDanji={mapHeaderRedux['originid']['origintype'] == 'complex'} />
          </div>
        </MUListItemButton>
      </MUListItem>
    </WrapListItem>
  )
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
