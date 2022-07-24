//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components";

//img
import NavIcon from '../../../img/main/nav_btn.png';
import Logo from '../../../img/main/header_logo.png';
import PCLogo from '../../../img/main/pc_header_logo.png';
import Mypage from '../../../img/main/mypage_icon.png';
import FilterClose from '../../../img/map/filter_close.png';
import FilterDown from '../../../img/map/filter_down_arrow.png';

// components
import { Mobile, PC } from "../../../MediaQuery";

//redux
import { MapFilterRedux } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

export default function MapFilter({ openBunyang, rank }) {

  const mapFilterRedux = useSelector(state => { return state.mapFilter });
  let uiData = JSON.parse(JSON.stringify(mapFilterRedux.filterUI));
  let filterArr = JSON.parse(JSON.stringify(mapFilterRedux.filterArr));

  const onClickTrade = (e) => {
    const text = e.target.dataset.text;
    const num = e.target.dataset.num;
    console.log('이벤트이벤트이벤트_________', e);
    console.log('텍스트텍스트______________',text);
    console.log('넘넘넘_______________',num);
    console.log('전전전_____________',uiData.prd_sel_type);
    let count = 0;
    if (e.target.checked) {
      filterArr.prd_sel_type.push(text);
      uiData.prd_sel_type[num] = 1;
    } else {
      uiData.prd_sel_type.map(item => { if (item) { console.log('아이템아이템__________',item); count++; } })
      if (count == 1) {
        e.preventDefault();
        return;
      }
      uiData.prd_sel_type[num] = 0;
      filterArr.prd_sel_type = filterArr.prd_sel_type.filter(item => item != text);
    }
    console.log('후후후후_________________',uiData.prd_sel_type);

    MapFilterRedux.updateFilterArr({ filterArr: filterArr });
    MapFilterRedux.updateFilterUI({ filterUI: uiData });
  }

  return (
    <>
      <WrapFilterButton>
        <Box>
          <SubTitle>거래유형</SubTitle>
          <WrapButtons>
            <Button checked={uiData.prd_sel_type[0]} onChange={(e) => { onClickTrade(e) }} data-text="매매" data-num="0" className={["trade", "changeBtn"]} type="checkbox" id="trade1" />
            <Label for="trade1">매매</Label>
            <Button checked={uiData.prd_sel_type[1]} onChange={(e) => { onClickTrade(e) }} data-text="전세" data-num="1" className={["trade", "changeBtn"]} type="checkbox" id="trade2" />
            <Label for="trade2">전세</Label>
            <Button checked={uiData.prd_sel_type[2]} onChange={(e) => { onClickTrade(e) }} data-text="월세" data-num="2" className={["trade", "changeBtn"]} type="checkbox" id="trade3" />
            <Label for="trade3">월세</Label>
          </WrapButtons>
        </Box>
      </WrapFilterButton>
    </>
  );
}


const WrapFilterButton = styled.div`
  width:100%;
  padding:1rem;
`
const Box = styled.div`
  width:100%;
`
const SubTitle = styled.div`
  margin-bottom:0.75rem;
`
const WrapButtons = styled.div`
  width:100%;
  display:flex;justify-content:flex-start;align-items:center;
`
const Button = styled.input`
  display:none;
  &:last-child{margin-right:0;}
  &:checked+label{background:#2b664d;color:#fff;}
`
const Label = styled.label`
  display:inline-block;
  padding:0.2rem 2rem;
  /* width: 106px;
  height: 35px; */
  line-height:2rem;
  text-align:center;
  border-radius:3px;
  margin-right:5px;
  background:#f8f7f7;color:#4a4a4a;
  cursor:pointer;transition:all 0.15s;
  @media ${(props) => props.theme.mobile} {
    /* width:calc(100vw*(106/428));
    height:calc(100vw*(35/428));
    line-height:calc(100vw*(35/428));
    font-size:calc(100vw*(14/428));
    margin-right:calc(100vW*(5/428)); */
  }
`
