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
import BrokerRating from '../../common/broker/brokerRating';


//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';

import ChannelServiceElement from '../../common/ChannelServiceElement';


SwiperCore.use([Navigation, Pagination]);
export default function SideBarBrokerDetailContent({ broker, contact }) {

  return (
    <>
      <div className="par-spacing-after">
        <ListItemCont_Broker_T1 broker={broker} />
      </div>
      <div className="par-spacing">
        <BrokerRating title={"전문성"} score={broker.profession} />
        <BrokerRating title={"중개매너"} score={broker.manner} />
      </div>
      <div className="par-spacing tAlign-c">
        <CommonContact contact={contact} />
      </div>
    </>
  );
}