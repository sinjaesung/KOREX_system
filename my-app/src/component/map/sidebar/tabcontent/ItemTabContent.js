//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled, {keyframes} from "styled-components"
import Item from "../../../../img/map/map_item.png";
import FilterDown from "../../../../img/map/filter_down_arrow.png";
import FilterNext from "../../../../img/map/filter_next.png";
import FilterClose from "../../../../img/map/filter_close.png";
import Checked from "../../../../img/map/checked.png";
import Check from "../../../../img/main/heart.png";
import HeartCheck from "../../../../img/main/heart_check.png";

// components
import { Mobile, PC } from "../../../../MediaQuery";
import {opacityAni, retunAnimation, animationDelay} from './contentAnimation';
import ItemTab from './ItemTab';

// redux
import { MapProductEls } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';

export default function ItemTabContent({updatePageIndex, setHistoryInfo,setReport,index, productList, containerRef}) {

  console.log('===>>>ImtemTabContnets whatsss:',productList);
  const onClickEl = (value,refer_action) => {
    console.log('부모부모부모____');
    if(containerRef){
      containerRef.current.scrollTop=0;
    }
    if(value.prd_name == '더미매물'){
      MapProductEls.updateClickExc({ clickExc : { id: value.prd_id , type:'dummy'}});
      // updatePageIndex(1,value.item_id);
      updatePageIndex(1,value.prd_id,refer_action);
    }else{
      MapProductEls.updateClickExc({ clickExc : { id: value.prd_id , type:'standard'}});
      // updatePageIndex(1,value.item_id);
      updatePageIndex(1,value.prd_identity_id,refer_action);
    }
    
    setHistoryInfo(e => {e.prevIndex.push(index);
    return JSON.parse(JSON.stringify(e));});
  }


  const loginUser = useSelector(state => {return state.login_user});
  return (
    <>
      {
        productList.length==0?
        <NoList>검색 결과가 없습니다.</NoList>
        :
        <ul>
          {
            productList.map((value, index) => {
              return <ItemTab value={value} index={index} loginUser={loginUser} onClickEl={onClickEl}/>
            })
          }
        </ul>
      }
    </>
  );
}

const NoList = styled.div`
  text-align: center;
  margin-top:2rem;
  font-size:1rem;
`