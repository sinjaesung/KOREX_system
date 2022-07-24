//react
import React ,{useState, useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

//style
import styled from "styled-components";

//img
import ItemImg from "../../../img/main/item01.png";
import SwipImg from "../../../img/main/swip_img.png";
import Homepage from "../../../img/main/go_home.png";
import Exit from "../../../img/main/exit.png";
import Call from "../../../img/main/call.png";
import Live from "../../../img/main/live.png";
import Chat from "../../../img/main/chat.png";
import Heart from "../../../img/main/heart.png";
import BackBtn from '../../../img/notice/back_btn.png';
import CloseBtn from '../../../img/main/w_close_btn.png';

SwiperCore.use([Navigation]);
export default function ImgDetail({detailimg, setDetailImg, imgArr}){
  if(detailimg == false)
    return null;
    return (
      <Container>
        <SwiperBg onClick={()=>{setDetailImg(false)}}></SwiperBg>
          <SwiperBennerWrap className="img_swiper">
            <CloseImg>
              <Link onClick={()=>{setDetailImg(false)}}>
                <ModalClose src={CloseBtn}/>
              </Link>
            </CloseImg>
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
                imgArr.map((item, index) => {
                  return(
                    <SwiperSlide key={index}>
                      <Imgbox>
                        <Img src={item} alt="img"/>
                      </Imgbox>
                    </SwiperSlide>
                  )
                })
              }
              {/* <SwiperSlide>
                <Imgbox>
                  <Img src={SwipImg} alt="img"/>
                </Imgbox>
              </SwiperSlide>
              <SwiperSlide>
                <Imgbox>
                  <Img src={SwipImg} alt="img"/>
                </Imgbox>
              </SwiperSlide> */}
            </Swiper>
          </SwiperBennerWrap>
      </Container>
    );
}

const Container = styled.div`
  width:100%;

`
const SwiperBg = styled.div`
  position:fixed;
  width:100%;
  z-index:1001;
  height:100%;left:0;top:0;display:block;content:'';
  background:rgba(0,0,0,0.2);
`
const CloseImg = styled.div`
  position:absolute;
  top:0;right:0;
  width:29px;
  @media ${(props) => props.theme.container} {
        width:calc(100vw*(29/1436));
    }
  @media ${(props) => props.theme.mobile} {
      z-index:3;
      top:calc(100vw*(-30/428));
      right:calc(100vw*(20/428));
      width:calc(100vw*(18/428));
    }
`
const ModalClose = styled.img`
  width:100%;
`
const SwiperBennerWrap = styled.div`
  position:fixed;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:1252px;
  height:auto;
  z-index:1002;
  @media ${(props) => props.theme.container} {
      width:calc(100vw*(1252/1436));
    }
  @media ${(props) => props.theme.mobile} {
      width:100%;
    }
`
const Imgbox = styled.div`
  width:100%;
  padding:0 40px;
  @media ${(props) => props.theme.container} {
      padding:0 calc(100vw*(40/1436));
    }
  @media ${(props) => props.theme.mobile} {
      width:100%;
      padding:0;
    }
`
const Img = styled.img`
  width:100%;
  height:800px;
  @media ${(props) => props.theme.container} {
      height:calc(100vw*(800/1436));
    }
  @media ${(props) => props.theme.mobile} {
      height:auto;
    }
`
