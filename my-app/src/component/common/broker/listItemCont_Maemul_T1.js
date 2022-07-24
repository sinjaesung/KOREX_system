//react
import React, { useState, useEffect } from 'react';

//css
import styled from "styled-components"
import Item from "../../../img/map/map_item.png";
import Check from "../../../img/main/heart.png";
import HeartCheck from "../../../img/main/heart_check.png";

//material

// components
import ExcMaemulMark from './excMaemulMark';
import { SliceText, numTokor } from '../commonUse';
import localStringData from '../../../const/localStringData';
import LikeCheckBtn from '../accessary/likeCheckBtn';


export default function ListItemCont_Maemul_T1({ mode, mode_likeCheckBtn, user, item, setListData, refer_action,setexculsivesidebarlist}) {
console.log('여기확인 리스트 항목(접근페이지정보 referer)', item,mode, refer_action,setexculsivesidebarlist)

  return (
    <>
      <ExcMaemulMark status={item.exclusive_status} startDate={item.exclusive_start_date} endDate={item.exclusive_end_date} />
      <div className="clearfix">
        <Item_Thumb className="img-centering respHgt-100pct">
          {/* <img className="pos-centering wid-100pct" src={Item} /> */}
          <img src={item.prd_imgs ? localStringData.imagePath + (item.prd_imgs.split(',')[0]) : Item} />

          {mode !== 'PropertyList'?
            <WrapLikeCheckBtn>
              <LikeCheckBtn mode={mode_likeCheckBtn} user={user} item={item} setListData={setListData} />
            </WrapLikeCheckBtn>
            :
            null
          }
        </Item_Thumb>
        <div>
          <div>
            <span className="list-tag vAlign-m">[{item.prd_type ? item.prd_type : ''}]</span>&nbsp;
             <span className="list-subtit vAlign-m">{item.prd_name}</span>
          </div>
          <p className="list-tit">{item.prd_sel_type}{item.prd_sel_type == '월세' ? `${numTokor(item.prd_price)}/${numTokor(item.prd_month_price)}` : numTokor(item.prd_price)}</p>
          <div className="capt-a1">
            <p> {item.floorint}층, {item.supply_pyeong}평({item.supply_area}m<sup>2</sup>), {item.managecost}만원</p>
            <p>{SliceText(item.prd_description, 12)}</p>
          </div>
        </div>
      </div>
    </>
  );
}


const Item_Thumb = styled.div`
  float: right;
  width:8rem;

  @media (max-width: 375px), (max-width: 1366px) and (orientation:landscape) {
      width:100%;
      &:after {padding-bottom: 56%;}
      float: none;
  }
`
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
const WrapLikeCheckBtn = styled.div`
  position:absolute;
  top:1px;right:1px;
  z-index:2;  
`