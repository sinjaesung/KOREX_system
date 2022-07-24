//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//mateiral-ui
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Chip from '@material-ui/core/Chip';
import Stack from '@mui/material/Stack';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';

//img
import Arrow from "../../../img/map/filter_next.png";
import Detail from "../../../img/map/detail_img.png";
import Trade from "../../../img/map/trade.png";
import Report from "../../../img/map/report.png";
import ChangeM from "../../../img/map/change_m.png";
import Change from "../../../img/member/change.png";
import Call from "../../../img/map/call.png";
import Chat from "../../../img/map/chat.png";
import Exit from "../../../img/main/exit.png";
import Checked from "../../../img/map/checked.png";
import Check from "../../../img/main/heart.png";
import Profile from "../../../img/map/profile_img.png";
import Like from '../../../img/member/like.png';
import Smile from '../../../img/member/smile.png';
import OrangeStar from '../../../img/member/star_orange.png';
import GreenStar from '../../../img/member/star_green.png';
import WhiteStar from '../../../img/member/star_white.png';

// components
import { Mobile, PC } from "../../../MediaQuery";
import SideSubTitle from "./subtitle/SideSubTitle";
import BrokerTabContent from "./tabcontent/BrokerTabContent";
import ListItemCont_Broker_T1 from '../../common/broker/listItemCont_Broker_T1';
import CommonContact from '../../common/contact/commonContact';


//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';

import ChannelServiceElement from '../../common/ChannelServiceElement';


SwiperCore.use([Navigation, Pagination]);
export default function SideBarBrokerDetailContent({ historyInfo, updatePageIndex, setHistoryInfo, broker, contact }) {

  
  const star = (length, isOrange) => {
    let arr = [];
    let whiteLength = 0;
    let isWhite = false;
    let whiteArr = [];
    for (let i = 0; i < length; i++) { arr.push(i); }
    if (5 - length !== 0) {
      whiteLength = 5 - length;
      isWhite = true;
      for (let i = 0; i < whiteLength; i++) { whiteArr.push(i); }
    }
    return (
      <>
        {
          arr.map((item, index) => {
            return (
              <Star key={index} src={isOrange ? OrangeStar : GreenStar} />
            )
          })
        }
        {
          isWhite &&
          whiteArr.map((item, index) => {
            return (
              <Star key={index} src={WhiteStar} />
            )
          })
        }
      </>
    )
  }
  
  /*const chatting_room=()=>{
    console.log('chattingRoom호출>>');
    if(broker.chatkey && broker.chatkey!=''){
      //해당 페이지 접근시점에 전문중개사상세페이지 도달시 해당중개사 상담채널로 자동열리게한다.
      console.log('ChjannelServiceElementsss:',ChannelServiceElement);
      ChannelServiceElement.boot({
        "pluginKey" : broker.chatkey,
        //"customLauncherSelector" : "#chat-button",
      // "hideChannelButtonOnBoot" : true
      });
    }
  }*/
  
  console.log('broker.profession____', broker.profession);
  return (
    <>
        <ListItemCont_Broker_T1 broker={broker} />
        <InfoDetail>
          <FlexBox>
            <Left>
              <Icon src={Like} alt="icon" />
              <SubTitle>전문성</SubTitle>
            </Left>
            <RightStar>
              {star(broker.profession, true)}
            </RightStar>
          </FlexBox>
          <FlexBox>
            <Left>
              <Icon src={Smile} alt="icon" />
              <SubTitle>중개매너</SubTitle>
            </Left>
            <RightStar>
              {star(broker.manner, false)}
            </RightStar>
          </FlexBox>
        </InfoDetail>
        <CommonContact contact={contact} />
    </>
  );
}


const MUStack = styled(Stack)`
text-align:center;
//margin:1rem 0 1rem;
`
const MUChip = styled(Chip)``
const MUButton = styled(Button)``
//--------------------------------------------

const TopContent = styled.div`
  position:relative;
  padding:0.625rem;
  border-bottom:8px solid #e4e4e4;
`
//---------------------------------------
const MiddleBox = styled.div`
  display:flex;justify-content:space-between;align-items:center;
`
const LeftContent = styled.div`
width:calc(100% * (343 / 428))
`
const BrokerInfoDetail = styled.div`
`
const BrokerName = styled.p``

const BrokerAddress = styled.p`
`
const ColorOrange = styled.span`
  color:#fe7a01;
  vertical-align:middle;
`
const SellList = styled.div`
  width:100%;display:flex;
  justify-content:flex-start;align-items:center;
`
const List = styled(ColorOrange)`
  color:#4a4a4a;
  margin-right:0.5rem;
`
//--------------------------------------------------


const Part = styled.div`
  display:inline-block;
  width:1px;height:12px;
  background:#4a4a4a;
  margin-right:7px;
  /* @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(7/428));
    height:calc(100vw*(10/428));
  } */
`

const InfoDetail = styled.div``

const Icon = styled.img`
  display:inline-block;
  width:20px;margin-right:12px;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    margin-right:calc(100vw*(12/428));
    } */
`
const SubTitle = styled.p`
`
const RightContent = styled.div`
  position:relative;
  width:80px;height:80px;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(95/428));
    height:calc(100vw*(95/428));
  } */
`
const ItemImg = styled.img`
  width:100%;height:100%;
  border-radius:100%;
`

const FlexBox = styled.div`
  display:flex;width:100%;
  justify-content:center;align-items:center;
  &:nth-child(3){margin-top:60px;}
  &:last-child{margin-bottom:0;}
  /* @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(25/428));
    &:nth-child(3){margin-top:calc(100vw*(40/428));}
    } */
`
const Left = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100px;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(100/428));
    } */
`
const Star = styled.img`
  display:inline-block;
  width:16px;
  margin-right:9px;
  &:last-child{margin-right:0;}
  vertical-align:middle;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(16/428));
    margin-right:calc(100vw*(9/428));
    } */
`

const RightStar = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:184px;
  margin-left:40px;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(184/428));
    } */
`
/* const CallBox = styled.div`
  display:flex;justify-content:center;align-items:center;
  width:90%;
  height: 84px;
  padding:0 16px;
  margin:16px auto 0;
  border-radius: 20px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 3px #efefef;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(398/428));
    height:calc(100vw*(84/428));
    padding:0;
    margin:calc(100vw*(14/428)) auto 0;
  }
` */
/* const ToCall = styled.div`
  position:relative;
  display:flex;justify-content:flex-start;align-items:center;
` */
/* const BottomImg = styled.img`
  width:20px;height:20px;
  display:inline-block;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));
  }
` */
/* const BottomTxt = styled.p`
  font-size:18px;font-weight:800;
  transform:skew(-0.1deg);margin-left:10px;
  color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(18/428));
    margin-left:calc(100vw*(10/428));
  }
` */
/* const ToChat = styled(ToCall)`` */
/* const LongPart = styled.p`
  width:1px;height:30px;background:#979797;
  margin:0 50px;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(30/428));
    margin:0 calc(100vw*(40/428));
  }
` */