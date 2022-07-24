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


export default function DanjiTab({ value, index, onClickEl, loginUser }) {

  const mapHeaderRedux = useSelector(state => { return state.mapHeader });

  const insertYMComma = (string) => {
    let newString = string;
    newString.substring(0, 2);
    newString = newString.substring(2, 6);
    newString = newString.replace(/(.{2})/g, "$1.")
    newString = newString.substring(0, 5);
    return newString
  }

  function insertZero(string) {
    let newString = string;
    if (string.length == 1) {
      newString = "0" + string;
    }
    return newString
  }


  if (mapHeaderRedux['originid']['origintype'] == 'complex') {
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
              <>

                <p>{value && value.complex_name}</p>
                <p>{value && value.addr_jibun}({value && value.addr_road})</p>
                {
                  value ?
                    <div className="flex-left-center">
                      <span>{insertYMComma(value['contract_ym'])}.{insertZero(value['contract_dt'])}</span>
                      <span>{value['type']}{numTokor(value['deposit'])}</span>
                      <span>{value['floor']}층</span>
                    </div>
                    :
                    null
                }

              </>
              {/* <ListItemCont_Broker_T1 broker={value.probroker_info} /> */}
            </div>
          </MUListItemButton>
        </MUListItem>
      </WrapListItem>
    )
  } else {
    return (
      <WrapListItem
        key={index}
        highlightcolor={false}
        aniDelay={animationDelay(index)}
      >
        <MUListItem disablePadding>
          <MUListItemButton>
            <div className="flexGlow-1">
              <Link onClick={() => onClickEl(value)} className="data_link"></Link>
              <>
                <p>{value && value.complex_name}</p>
                <p>{value && value.addr_jibun}</p>
                {
                  value ?
                    <div className="flex-left-center">
                      <span>{insertYMComma(value['contract_ym'])}.{insertZero(value['contract_dt'])}</span>
                      <span>{value['type']}{numTokor(value['deposit'])}{value['type'] == '월세' ? '/' + value['monthly_rent'] + "만원" : ''}</span>
                      <span>{value['floor']}층</span>
                    </div>
                    :
                    null
                }
              </>
              {/* <ListItemCont_Broker_T1 broker={value.probroker_info} /> */}
            </div>
          </MUListItemButton>
        </MUListItem>
      </WrapListItem>
    )
  }

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


const TabContent = styled.div`
  animation-name: ${opacityAni}; 
  ${({ aniDelay }) => { return retunAnimation(aniDelay) }}
  position:relative; 
  background-color: ${(props) => (props.highlightcolor == true ? 'rgba(240,240,240,0.9)' : 'transparent')};
  padding:30px 27px 0 27px;margin-top:17px;
  margin-bottom:30px;
  border-top:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(24/428)) calc(100vw*(12/428)) 0;
    margin-bottom:calc(100vw*(24/428));
  }
`

const Address = styled.p`
  font-size:15px;color:#707070;
  margin-bottom:10px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(10/428));
  }
`
const DanjiInfo = styled.div`
  display:flex;justify-content:flex-start;align-item:center;
`
const Date = styled(Address)`
  color:#01684b;
  margin-bottom:0;
`
const Price = styled(Date)`
  margin:0 8px;
  @media ${(props) => props.theme.mobile} {
    margin:0 calc(100vw*(8/428));
  }
`
const Floor = styled(Date)`
`