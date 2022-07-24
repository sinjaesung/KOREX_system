//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';


//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//Img
import MainTopImg from '../../img/main/main_top.png';
import IconSearch from '../../img/main/icon_search.png';
import SwiperImg from '../../img/main/img01.png'
import PCLogo from '../../img/main/pc_header_logo.png';

SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function MainBody({bannerData}) {
  
  console.log('bannerdATA HAAAAAA:',bannerData);
    
  var globe_aws_url='https://korexdata.s3.ap-northeast-2.amazonaws.com/';

  // const default_bannerdata=[
  //   {
  //     ban_url : '',
  //     ban_image: SwiperImg,
  //   },{
  //     ban_url : '',
  //     ban_image : SwiperImg
  //   }
  // ]
    return (
        <Container>
          <MainBodyBottom>
              <SwiperBennerWrap className="main_swiper">
                {
                  bannerData.length>0 ?
                  <Swiper
                    spaceBetween={5}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 2000 }}
                    speed={2000}
                    navigation
                    pagination={{ clickable: true }}
                    // onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                  >
                    {
                      bannerData.map((item, index) => {
                        console.log('banner items:',item);
                        return(
                          <SwiperSlide className="main-slide" key={index}>
                            <ItemWrap onClick={item.ban_url ? () => window.location=item.ban_url : null }>
                              <Img src={item.ban_image?globe_aws_url+item.ban_image:SwiperImg} alt="img"/>                          
                              <Wraptxt>
                                {/* <Txt>{item.ban_title}</Txt>
                                <LogoImg src={PCLogo}/> */}
                                 
                              </Wraptxt>
                            </ItemWrap>
                          </SwiperSlide>
                        )
                      })
                    }
                </Swiper>
                : null
                // <Swiper  
                // spaceBetween={5}
                // slidesPerView={1}
                // loop={true}
                // autoplay={{ delay: 2000 }}
                // speed={2000}
                // navigation
                // pagination={{ clickable: true }}
                // // onSlideChange={() => console.log('slide change')}
                // onSwiper={(swiper) => console.log(swiper)}>
                //   {
                //     default_bannerdata.map((item, index) => {
                //       return(
                //         <SwiperSlide key={index}>
                //           <ItemWrap onClick={item.ban_url ? () =>window.location=item.ban_url : null}>
                //             <Img src={item.ban_image} alt="img"/>
                //             <Wraptxt>
                            
                //             </Wraptxt>
                //           </ItemWrap>
                //         </SwiperSlide>
                //       )
                //     })
                //   }
                // </Swiper>
              }
            </SwiperBennerWrap>
          </MainBodyBottom>
        </Container>
  );
}
const Pb = styled.b`
  display:block;

  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;

  @media ${(props) => props.theme.mobile} {
      display:flex;
    }
`
const Container = styled.div`
  width:935px;
  margin:0 auto 0;
  //padding-bottom:203px;
  @media ${(props) => props.theme.mobile} {
    display: flex;
    justify-content: center;
        width:calc(100vw*(360/428));
        //padding-bottom:0;
    }
`
const MainBodyBottom = styled.div`
  width:100%;

  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(400/428));
  }
`
const SwiperBennerWrap = styled.div`
  width:100%;

  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(400/428));
  }
`
const ItemWrap = styled.div`
  width:800px;height:400px;
  margin:0 auto;
  padding: 0 35px;
  box-sizing:border-box;
  border-radius:9px;
  cursor:pointer;

  @media ${(props) => props.theme.mobile} {
    display: flex;
    justify-content: center;
      width:100%;
      /* height:auto; */
      /* padding:calc(100vw*(20/428)); */
      padding: 0;
      height: calc(100vw * (320/428));
    }
`
const Img = styled.img`
  width:100%; height:100%;
  object-fit: contain;
  
  @media ${(props) => props.theme.mobile} {
    /* width:100%;  */
    /* height: calc(100vw*(220/428)); */
    object-fit: cover;
    width: calc(100vw * (360/428));
    height: calc(100vw * (297/428));
    border-radius: calc(100vw * (10/428));
    }
`
const Wraptxt = styled.div`
  position:absolute;
  left:192px;
  top:50%;transform:translateY(-50%);
  
  @media ${(props) => props.theme.mobile} {
        display:none;
    }
`
const Txt = styled.p`
  font-size:33px;
  color:#4a4a4a;
  font-weight:800;
  transform:skew(-0.1deg);
`
const Orange = styled(Txt)`
  display:inline-block;
  color:#fe7a01;
`
const Green = styled(Txt)`
  display:inline-block;
  color:#01684b;
`
const LogoImg = styled.img`
  display:inline-block;
  width:153px;
  margin-top:13px;
`
