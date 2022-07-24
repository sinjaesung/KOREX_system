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

import closebtn from '../../../../img/main/close_btn.png';

// components
import { Mobile, PC } from "../../../../MediaQuery";
import { opacityAni, retunAnimation, animationDelay } from './contentAnimation'
import DanjiTab from './DanjiTab';

// redux
import { MapProductEls, dangisidebarmodal } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';

const insertYMComma = (string) => {
  let newString = string;
  newString.substring(0, 2);
  newString = newString.substring(2, 6);
  newString = newString.replace(/(.{2})/g, "$1.")
  newString = newString.substring(0, 5);
  return newString
}

function numTokor(num) {
  var newNum = num.replace(",", "");
  newNum = Number(newNum) * 10000;
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

function insertZero(string) {
  let newString = string;
  if (string.length == 1) {
    newString = "0" + string;
  }
  return newString
}

export default function ItemTabContent({ updatePageIndex, setHistoryInfo, setMap }) {

  const dangisidebarmodals = useSelector(data => data.dangiSidebarmodal);

  const onClickEl = (value) => {
    MapProductEls.updateClickBlo({ clickBlo: value.complex_id });
    updatePageIndex(3);
    setHistoryInfo(e => { e.prevIndex.push(0); return JSON.parse(JSON.stringify(e)); });
  }

  useEffect(() => {
    let newInt = dangisidebarmodals.block;
    console.log(newInt);
  }, [dangisidebarmodals.block]);


  if (dangisidebarmodals.openstatus == 1) {
    return (
      <>
        {
          dangisidebarmodals.block.map((value, index) => {
            return <DanjiTab value={value} index={index} onClickEl={onClickEl} />
          })
        }
      </>
    );
  } else {
    return null;
  }
}
