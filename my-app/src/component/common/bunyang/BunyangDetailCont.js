//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

//style
import styled from "styled-components"

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Card from '@mui/material/Card';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HomeIcon from '@mui/icons-material/Home';

//img
import ItemImg from "../../../img/main/item01.png";
import SwipImg from "../../../img/main/swip_img.png";
import Homepage from "../../../img/main/go_home.png";
import Exit from "../../../img/main/exit.png";
import Heart from "../../../img/main/heart.png";
import HeartCheck from "../../../img/main/heart_check.png";
import Call from "../../../img/main/call.png";
import Live from "../../../img/main/live.png";
import Chat from "../../../img/main/chat.png";
import BackBtn from '../../../img/notice/back_btn.png';

//components
import localStringData from '../../../const/localStringData';
import { useSelector } from 'react-redux';
import CommonContact from '../contact/commonContact';
import LikeCheckBtn from '../accessary/likeCheckBtn';


export default function BunyangDetailCont({ loginUser, bunyangDetail, onClickList, setLive, setDetailImg, setCal, livetour, optionList, numberWithCommas, contact,invitetour, active, LikeBtnEvent, readOnly, setReadOnly }) {
  
  function checkZero(checkString){
    return checkString.toString().length == 1 ?  "0" + checkString : checkString;
  }

  function getDateType(date){
    //date.setDate(date.getDate() + 1);
    var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
    return temp;
  }
  
  function getDateTimeType(date){
    var temp = `${checkZero(date.getHours())}:${checkZero(date.getMinutes())}:00`;
    console.log(temp)
    return temp;
  }

  
  return (
    <>
      <Wrap_Content>
        <Sect_C1>
          {
            bunyangDetail.image_list ?
              <Swiper
                spaceBetween={5}
                slidesPerView={1}
                loop={true}
                autoplay={false}
                navigation={{ clickable: true }}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
              >
                {
                  bunyangDetail.image_list.split(',').map((value, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <DetailImg onClick={() => { setDetailImg(true) }}>
                          <img src={localStringData.imagePath + (value)} alt="img" />
                        </DetailImg>
                      </SwiperSlide>
                    )
                  })
                }
              </Swiper>
              :
              <></>
          }
        </Sect_C1>
        <Sect_C2>
          {
            livetour && livetour.tour_start_date ?
              <div className="par-spacing-after">
                <EmBox>

                  {/* <h3>LIVE 방송일시 : {livetour&& livetour.tour_start_date ? livetour.tour_start_date.replace(/-/gi, '/').slice(0, -3) : ""}</h3> */}
                  <h3>LIVE 방송일시 : {livetour.tour_start_date}</h3>
                  <div className="flex-right-center">
                    <MUButton variant="contained" disableElevation color="secondary" onClick={() => { setLive(true) }} startIcon={<LiveTvIcon />}>시청 예약</MUButton>
                  </div>
                </EmBox>
              </div>
              :
              null
          }

          <Box_1 className="par-spacing">
            <UtilBtns>
              <Tooltip title="홈페이지">
                <IconButton aria-label="delete">
                  <HomeIcon />
                </IconButton>
              </Tooltip>
              <LikeCheckBtn user={loginUser} item={bunyangDetail} />
            </UtilBtns>
            {/* <div><TopTitle>{bunyangDetail.bp_name}</TopTitle><Number>{bunyangDetail.bp_type}</Number></div> */}
            <div><TopTitle>{bunyangDetail.bp_name}</TopTitle></div>
            <Option>{`물건종류 : ${bunyangDetail.bp_type}`}</Option>
            {/* <Option>{optionList()}</Option> */}
            <Address>{bunyangDetail.bp_addr_road + " " + bunyangDetail.bp_addr_detail}</Address>
          </Box_1>
          <div className="divider-a1" />
          <div className="par-spacing">
            <Desc>
              <DTitle>분양세대</DTitle>
              <DescInfo>{bunyangDetail.household_cnt}세대</DescInfo>
            </Desc>
            <Desc>
              <DTitle>분양면적</DTitle>
              <DescInfo>{bunyangDetail.min_exclusive_area}㎡ ~ {bunyangDetail.max_exclusive_area}㎡</DescInfo>
            </Desc>
            <Desc>
              <DTitle>전용면적</DTitle>
              <DescInfo>{bunyangDetail.min_supply_area}㎡ ~ {bunyangDetail.max_supply_area}㎡</DescInfo>
            </Desc>
            <Desc>
              <DTitle>분양가격</DTitle>
              <DescInfo>{numberWithCommas(bunyangDetail.min_price)} ~ {numberWithCommas(bunyangDetail.max_price)} 만원</DescInfo>
            </Desc>
            <Desc>
              <DTitle>모델하우스 주소</DTitle>
              <DescInfo>{bunyangDetail.md_addr_road + " " + bunyangDetail.md_addr_detail}</DescInfo>
            </Desc>
          </div>
          <div className="divider-a1" />
          <div className="par-spacing">
            <TopTitle><MonetizationOnIcon />중개보수</TopTitle>
            <p>금액금액금액금액 설명설명설명설명설명</p>
          </div>
        </Sect_C2>
      </Wrap_Content>
      <WrapBtns_1 className="flex-right-center">
        <CommonContact contact={contact} />
        <MUButton_Validation
          variant="contained"
          type="submit"
          active={invitetour}
          onClick={() => onClickList(bunyangDetail)}
          startIcon={<DirectionsWalkIcon />}
        >
          방문 예약
        </MUButton_Validation>
      </WrapBtns_1>
    </>
  )
}

const Wrap_Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Sect_C1 = styled.div`
  width:50%;
  padding: 0 1rem;
  @media ${(props) => props.theme.breakpoints.md} {
      width:100%;
    }
    @media ${(props) => props.theme.breakpoints.sm} {
      padding: 0;
    }
`

const Sect_C2 = styled.div`
  width:50%;
  padding: 0 1rem;
  @media ${(props) => props.theme.breakpoints.md} {
      width:100%;
      padding: 0 1.5rem;
    }
`

const MUButton = styled(Button)``


const EmBox = styled.div`
  background-color: ${(props) => props.theme.palette.mono.main};
  border: 1px solid ${(props) => props.theme.palette.line.main};
  padding:1rem;
`

const TopTitle = styled.h2`
  display:inline-block;
`
const Number = styled.span``
const Option = styled.p``
const Address = styled.p``

const Desc = styled.div`
  display:flex;justify-content:space-between;
`
const DTitle = styled.p``

const DescInfo = styled.p``

const WrapBtns_1 = styled.div`
  &>button {
    margin-right: 0.5rem;
  }

`

/* 현재 이미지 비율이 Horizontal Wide, Vertical Wide 동적구별 코딩이 없는 상태라서,
임시적으로 Horizontal Wide형이 안짤리도록 >img의 width:100%; 설정함. 
width:100% 대신 height:100%; 설정하면 Vertical Wide형이 안짤림 */
const DetailImg = styled.div`
  position:relative;
  overflow: hidden;
  width:100%;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  //object-fit:cover;

  &>img {
    position:absolute;
    width: 100%;
    top: 50%;left: 50%;
    transform: translate(-50%, -50%);
    //object-fit:contain;
  }
`
const Box_1 = styled.div`
    position: relative;
`
const UtilBtns = styled.div`
  position:Absolute;
  right:0.5rem;top:0.5rem;
`
const LikeBtn = styled.div`
  display: inline-block;
  vertical-align: middle;
`

const Like = styled.input`
  display:none;
  &:checked + .check_label{width:29px;height:29px;background:url(${HeartCheck}) no-repeat center center;background-size:17px 17px;}
`

const Label = styled.label`
  display:inline-block;
  width:29px;height:29px;
  border:1px solid #d0d0d0;border-radius:3px;
  background:#fff url(${Heart}) no-repeat center center;
  background-size:17px 17px;
`

const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    // width:100%;
  }
`