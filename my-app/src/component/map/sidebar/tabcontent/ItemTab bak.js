//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled, { keyframes } from "styled-components"
import Item from "../../../../img/map/map_item.png";
import FilterDown from "../../../../img/map/filter_down_arrow.png";
import FilterNext from "../../../../img/map/filter_next.png";
import FilterClose from "../../../../img/map/filter_close.png";
import Checked from "../../../../img/map/checked.png";
import Check from "../../../../img/main/heart.png";
import HeartCheck from "../../../../img/main/heart_check.png";

//material
import Typography from '@mui/material/Typography';


// components
import { Mobile, PC } from "../../../../MediaQuery";
import { opacityAni, retunAnimation, animationDelay } from './contentAnimation';
import { InsertComma, DateText, SliceText } from '../../../common/commonUse';


// redux
import { MapProductEls } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';
import serverController from '../../../../server/serverController';

function numTokor(num) {
  var newNum = num * 10000;
  var inputNumber = newNum < 0 ? false : newNum;

  var unitWords = ['', '만', '억', '조', '경'];
  var splitUnit = 10000;
  var splitCount = unitWords.length;
  var resultArray = [];
  var resultString = '';

  for (var i = 0; i < splitCount; i++) {
    var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
    unitResult = Math.floor(unitResult);
    if (unitResult > 0) {
      resultArray[i] = unitResult;
    }
  }

  for (var i = 0; i < resultArray.length; i++) {
    if (!resultArray[i]) continue;
    resultString = String(resultArray[i]) + unitWords[i] + resultString;
  }

  return resultString;
}

export default function ItemTab({ value, index, onClickEl, loginUser }) {
  //console.log('===>>>itemTab element valuess:',value.prd_identity_id,value.isLike);
  const [active, setActive] = useState(value.isLike);

  const mapHeaderRedux = useSelector(state => { return state.mapHeader });

  const clickLikeEvent = () => {
    if (!loginUser.memid) {
      window.location.href = "/MemberLogin";
      return;
    }
    const data = {
      mem_id: loginUser.memid ? loginUser.memid : 0,
      prd_identity_id: value.prd_identity_id ? value.prd_identity_id : 0,
      bp_id: value.bp_id ? value.bp_id : 0,
      likes_type: 0,
    }

    serverController.connectFetchController("/api/likes/item", 'POST', JSON.stringify(data), function (res) {
      setActive(e => !e);
    });
  }



  return (
    <List_Item
      key={index}
      highlightcolor={mapHeaderRedux['originid']['origintype'] == 'exclusive' ? mapHeaderRedux['originid']['id_vals'] === value.prd_id : false}
      aniDelay={animationDelay(index)}
    >
      <Link onClick={() => onClickEl(value)} className="data_link" />
      <Sect_R1>
        {
          value.prd_exculsive_status == 1 ?
            <ExclusivItemMark>
              <ColorGreen>전속매물</ColorGreen>
              <WrapDate>
                <StartDate>{value.prd_exculsive_start_date ? value.prd_exculsive_start_date : null}</StartDate>
                <Line>~</Line>
                <EndDate>{value.prd_exculsive_end_date ? value.prd_exculsive_end_date : null}</EndDate>
              </WrapDate>
            </ExclusivItemMark>
            :
            <ExclusivItemMark>
              <ColorGreen>전속매물</ColorGreen>
              <WrapDate>
                <StartDate></StartDate>
                <Line>~</Line>
                <EndDate></EndDate>
              </WrapDate>
            </ExclusivItemMark>
        }
      </Sect_R1>
      <Sect_R2 className="clearfix">
        <ItemInfo_Img>
          <ItemImg src={Item} />
          <div>
            <Input type="checkbox" checked={active} onChange={clickLikeEvent} id={"check" + value.prd_identity_id} />
            <CheckLabel for={"check" + value.prd_identity_id} />
          </div>
        </ItemInfo_Img>
        <ItemInfo_Txt>
          {/*전속매물에 속한 아파트 일때 TopBox가 나와야함*/}
          <Item_Title>
            {value.prd_type ? value.prd_type : ''}<BreakDot>·</BreakDot>{value.prd_name}
          </Item_Title>
          <Price_Line>{value.prd_sel_type}{value.prd_sel_type == '월세' ? ` ${numTokor(value.prd_month_price)} / 보증금 ${numTokor(value.prd_price)}` : numTokor(value.prd_price)}</Price_Line>
          {/* <Option>
              <Floor>{value.floorname}층</Floor>
              <Area>{value.supply_pyeong}평/({value.supply_space}m<sup>2</sup>)</Area>
              <Expenses>{value.managecost}만원 active:{active}</Expenses>
            </Option> */}
          <Desc>
            <div> {value.floorname}층 / {value.supply_pyeong}평/({value.supply_space}m<sup>2</sup>) {value.managecost}만원 active:{active}</div>
            <div>{SliceText(value.maemul_description, 12)}</div>
          </Desc>
          {/*<Desc>{value.prd_longitude} &nbsp;{value.prd_latitude}</Desc>
            <Desc>{value.prd_identity_id}</Desc>*/}
        </ItemInfo_Txt>
      </Sect_R2>
    </List_Item>
  );
}


const List_Item = styled.div`
  position:relative; 
  padding:0 0.625rem;
  margin-bottom:2rem;
  background-color:${(props) => (props.highlightcolor == true ? 'rgba(240,240,240,0.9)' : 'transparent')};
  animation-name: ${opacityAni}; 
  ${({ aniDelay }) => { return retunAnimation(aniDelay) }};
`

const Sect_R1 = styled.div``
const Sect_R2 = styled.div``

const ExclusivItemMark = styled.div`
  display:flex;justify-content:center;align-items:center;
  border:1px solid #2b664d;
  line-height:1.125rem;
`
const ColorGreen = styled.span`
  font-size:1rem;
  color:#01684b;
  display:inline-block;margin-right:3px;
`
const WrapDate = styled.div`
  display:flex;
  justify-content:flex-start;
  align-items:center;
`
const StartDate = styled.p`
  font-size:11px;
  color:#707070;
`
const Line = styled(StartDate)``
const EndDate = styled(StartDate)``

const ItemInfo_Img = styled.div`
  float: right;
  position:relative;
  overflow: hidden;
  width:8rem;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  @media (max-width: 375px), (max-width: 1366px) and (orientation:landscape) {
      width:100%;
      &:after {
      content: "";
      display: block;
      padding-bottom: 56%;
      }
      float: none;
  }
`
const ItemImg = styled.img`
  position:absolute;
  width: 100%;
  top: 50%;left: 50%;
  transform: translate(-50%, -50%);
`
// const LikeBox = styled.div`
//   position:absolute;
//   width:100%;height:100%;
//   left:0;top:0;
// `
const Input = styled.input`
  display:none;
  &:checked + label{
    background:#fff url(${HeartCheck}); background-repeat:no-repeat;
    background-position:center center; background-size:17px 17px;}
`
const CheckLabel = styled.label`
  position:absolute;
  top:0.5rem;right:0.5rem;
  z-index:2;
  display:inline-block;
  width:29px;height:29px;
  border:1px solid #d0d0d0;
  border-radius:3px;
  background:#fff url(${Check});background-repeat:no-repeat;
  background-position:center center; background-size:17px 17px;
  
`
const ItemInfo_Txt = styled.div``

const Item_Title = styled.p``

const BreakDot = styled.span`
  font-size:1.5rem;
  line-height:1;
  font-weight:600;
  color:#fe7a01;
  vertical-align:middle;
  margin:0 0.25rem;
`

const Price_Line = styled.p``

const Desc = styled.p`
    margin: 0;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.43;
    letter-spacing: 0.01071em;
    color: rgba(0, 0, 0, 0.6);
`