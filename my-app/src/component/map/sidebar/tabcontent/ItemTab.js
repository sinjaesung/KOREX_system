//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled, { keyframes } from "styled-components"


//material
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';



// components
import { Mobile, PC } from "../../../../MediaQuery";
import { opacityAni, retunAnimation, animationDelay } from './contentAnimation';
import { InsertComma, DateText, SliceText, numTokor } from '../../../common/commonUse';
import ExcMaemulMark from '../../../common/broker/excMaemulMark';
import ListItemCont_Maemul_T1 from '../../../common/broker/listItemCont_Maemul_T1';

// redux
import { MapProductEls } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';
import serverController from '../../../../server/serverController';


export default function ItemTab({ value, index, onClickEl, loginUser,refer_action,setexculsivesidebarlist}) {

  const mapHeaderRedux = useSelector(state => { return state.mapHeader });
  console.log('==>>>매물리스트 항목 요소 접근한 flow과정 사이드바상태에서 접근한것여부:',refer_action)
  return (
    <WrapListItem
      key={index}
      aniDelay={animationDelay(index)}
      highlightcolor={mapHeaderRedux['originid']['origintype'] == 'exclusive' ? mapHeaderRedux['originid']['id_vals'] === value.prd_id : false}
    >
      <MUListItem disablePadding>
        <MUListItemButton>
          <div className="flexGlow-1">
            <Link onClick={() => onClickEl(value,refer_action)} className="data_link" />
            <ListItemCont_Maemul_T1 mode="ItemTabList" user={loginUser} item={value} refer_action={refer_action} setexculsivesidebarlist={setexculsivesidebarlist}/>
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