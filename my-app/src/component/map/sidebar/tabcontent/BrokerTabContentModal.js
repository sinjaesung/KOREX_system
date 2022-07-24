//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import Chip from '@material-ui/core/Chip';
import Stack from '@mui/material/Stack';

//img
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
import {opacityAni, retunAnimation, animationDelay} from './contentAnimation';
import BrokerTab from './BrokerTab';

// redux
import { MapProductEls , probrokersidebarmodal } from '../../../../store/actionCreators';
import { useSelector } from 'react-redux';

export default function ItemTabContent({updatePageIndex,setHistoryInfo, containerRef}) {

  //const productRedux = useSelector(state=>{ return state.mapProductEls});
  const probrokerSidebarmodal = useSelector(data => data.probrokerSidebarmodal);

  const onClickEl = (value) => {
    MapProductEls.updateClickPro({ clickPro : value.company_id });
    if(containerRef){
      containerRef.current.scrollTop=0;
    }
    updatePageIndex(2);
    setHistoryInfo(e => {e.prevIndex.push(0); return JSON.parse(JSON.stringify(e));});
  }

   if(probrokerSidebarmodal.openstatus == 1){
    return (
        <>
            
          {
              probrokerSidebarmodal.probroker.map((value, index) => {
              let probroker_info = value.probroker_info;
              let permission_info = value.permission_info;//가장 최근 승인된 정보.전문종목
              let asign_productinfo = value.asign_productinfo;//array형태이며 수임한 매물에 대한 정보.
              //console.log('각 전문중개사>>:',value,permission_info);
              if(asign_productinfo){
                  var ongoing_walse_productscnt=0;
                  var ongoing_jeonse_productscnt=0;
                  var ongoing_maemae_productscnt=0;//현재 사용가능한 활성화되어져있는 카운팅하는. 월세,전세,매매의 개수를 카운팅.
          
                  for(let p=0; p<asign_productinfo.length; p++){
                      let txn_status=asign_productinfo[p].txn_status;
                      let productinfo = asign_productinfo[p];
                      if(txn_status=='거래완료'){
                      //현재 진행중(취소,의뢰거절,의뢰취소,의뢰철회,수임취소,위윔취소등의 상태값들은 제외)
                      switch(productinfo.prd_sel_type){
                          case '월세':
                          ongoing_walse_productscnt++;
                          break;
                          case '전세':
                          ongoing_jeonse_productscnt++;
                          break;
                          case '매매':
                          ongoing_maemae_productscnt++;
                          break;
                      }
                      }
                  }
                  }
                  return <BrokerTab value={value} index={index} onClickEl={onClickEl}/>         
              })
          } 
        </>
      );
   }else{
       return null;
   }
}

const MUStack = styled(Stack)`
text-align:center;
//margin:1rem 0 1rem;
`
const MUChip = styled(Chip)``


const Container = styled.div`
  /* background-color:white; width:100%; height:100%;overflow-y:auto;padding-bottom:80px; */
  /* @media ${(props) => props.theme.mobile}{
      padding:0 calc(100vw * (22 / 428));width:100%;
  } */
`
// const Closebtn = styled.button`
//   width:30px;height:30px;position:absolute;right:2%;top:2%;z-index:8;
// `
// const Img = styled.img`
//   width:100%;height:100%;display:block;
// `
// const NoList = styled.div`
//   text-align: center;
//   margin-top:30px;
//   font-size:16px;
//   @media ${(props) => props.theme.mobile} {
//     font-size:calc(100vw*(16/428));
//     margin-top:calc(100vw*(30/428));
//   }
// `
const TabContent = styled.div`
  animation-name: ${opacityAni}; 
  ${({aniDelay})=>{ return retunAnimation(aniDelay)}}
  position:relative;
  padding:0.625rem;
  margin-bottom:2rem;
`
// const TopBox = styled.div`
//   display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;
//   flex-wrap:wrap;
//   width:100%;
//   margin-bottom:14px;
//   @media ${(props) => props.theme.mobile} {
//     margin-bottom:calc(100vw*(14/428));
//   }
// `
// const Tag = styled.div`
//   border-radius: 15px;
//   border: solid 1px #e4e4e4;
//   background-color: #f8f7f7;
//   height:30px;
//   padding:7px 16px;
//   margin-right:5px;
//   font-size:15px;color:#01684b;
//   font-weight:600;transform:skew(-0.1deg);
//   text-align:center;
//   @media ${(props) => props.theme.mobile} {
//     height:calc(100vw*(30/428));
//     padding: calc(100vw*(6/428)) calc(100vw*(10/428));
//     font-size:calc(100vw*(14/428));
//     margin-right:calc(100vw*(5/428));
//   }
// `
const BottomBox = styled.div`
  display:flex;justify-content:space-between;align-items:center;
`
const LeftContent = styled.div`
`
const ItemInfo = styled.div`
`

const Name = styled.div``
const Address = styled.div`
  display:inline-block;
`

const ColorOrange = styled.span`
  display:inline-block;
  color:#fe7a01;
  vertical-align:middle;
  margin-left:3px;
`
const SellList = styled.div`
  width:100%;display:flex;
  justify-content:flex-start;align-items:center;
`
const List = styled.span`
  display:inline-block;
  vertical-align:middle;
  margin-right:7px;
`
const Part = styled.div`
  display:inline-block;
  width:1px;height:12px;
  background:black;
  margin-right:7px;
`

const RightContent = styled.div`
  position:relative;
  width:95px;height:95px;
`
const ItemImg = styled.img`
  width:100%;height:100%;
  border-radius:100%;
`
