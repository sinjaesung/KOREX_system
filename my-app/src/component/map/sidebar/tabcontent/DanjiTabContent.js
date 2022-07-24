//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import Item from "../../../../img/map/map_item.png";
import FilterDown from "../../../../img/map/filter_down_arrow.png";
import FilterNext from "../../../../img/map/filter_next.png";
import FilterClose from "../../../../img/map/filter_close.png";
import Checked from "../../../../img/map/checked.png";
import Check from "../../../../img/main/heart.png";
import Profile from "../../../../img/map/profile_img.png";
// components
import { Mobile, PC } from "../../../../MediaQuery";
import { opacityAni, retunAnimation, animationDelay } from './contentAnimation';
import DanjiTab from './DanjiTab';

// redux
import { MapProductEls } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';


export default function ItemTabContent({ updatePageIndex, setHistoryInfo, setMap }) {

  const productRedux = useSelector(state => { return state.mapProductEls });

  const onClickEl = (value) => {
    MapProductEls.updateClickBlo({ clickBlo: value.complex_id });
    updatePageIndex(3);
    setHistoryInfo(e => { e.prevIndex.push(0); return JSON.parse(JSON.stringify(e)); });
  }

  useEffect(() => {
    let newInt = productRedux.block;
    console.log(newInt);
  }, [productRedux.block]);

  return (
    <>
      {
        productRedux.block.length == 0 ?
          <NoList>검색 결과가 없습니다.</NoList>
          :
          <>
            {
              productRedux.block.map((value, index) => {
                return <DanjiTab value={value} index={index} onClickEl={onClickEl} />

              })
            }
          </>
      }
    </>
  );
}


const NoList = styled.div`
  text-align: center;
  margin-top:2rem;
  font-size:1rem;
`