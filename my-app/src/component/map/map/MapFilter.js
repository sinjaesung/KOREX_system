//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import Slider from "react-slick";

//css
import styled from "styled-components"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//img
import NavIcon from '../../../img/main/nav_btn.png';
import Logo from '../../../img/main/header_logo.png';
import PCLogo from '../../../img/main/pc_header_logo.png';
import Mypage from '../../../img/main/mypage_icon.png';
import FilterClose from '../../../img/map/filter_close.png';
import FilterDown from '../../../img/map/filter_down_arrow.png';

// components
import { Mobile, PC } from "../../../MediaQuery";
export default function MapFilter({openBunyang, rank}) {
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.5,
    slidesToScroll: 1,
  };
    return (
        <>
        <WrapFilter>
          <SliderWrap>
            <Slider {...settings} className="filter_slick">
                <SlickSlide className="slide__one">
                  <Link>
                    <FliterEa>
                      Filter_1
                      <CloseFilter/>
                    </FliterEa>
                  </Link>
                </SlickSlide>
                <SlickSlide className="slide__one">
                  <Link>
                    <FliterEa>
                      Filter_1
                      <CloseFilter/>
                    </FliterEa>
                  </Link>
                </SlickSlide>
                <SlickSlide className="slide__one">
                  <Link>
                    <FliterEa>
                      Filter_1
                      <CloseFilter/>
                    </FliterEa>
                  </Link>
                </SlickSlide>
                <SlickSlide className="slide__one">
                  <Link>
                    <FliterEa>
                      Filter_1
                      <CloseFilter/>
                    </FliterEa>
                  </Link>
                </SlickSlide>
              </Slider>
            </SliderWrap>
            <FilterDownArrow>
               <Link>
                 <ImgDiv>
                   <DownImg src={FilterDown}/>
                 </ImgDiv>
               </Link>
            </FilterDownArrow>
         </WrapFilter>
        </>
  );
}

const Container = styled.div`
`
const WrapFilter = styled.div`
  position:absolute;
  width: 360px;
  height: 80px;
  padding:15px 25px 0;
  border-radius: 17px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  left:22px;top:26px;
`
const SlickSlide = styled.div`
`
const SliderWrap = styled.div`
width:100%;
margin-bottom:16px;
`
const FliterEa = styled.p`
  position:relative;
  height: 30px;
  padding: 6px 10px;
  border-radius: 15px;
  border: solid 1px #e4e4e4;
  background-color: #f8f7f7;
  font-size: 14px;
  font-weight: 800;transform:skew(-0.1deg);
  text-align: center;
  color: #01684b;
  margin-right:8px;
`
const CloseFilter = styled.div`
  display:inline-block;
  width:8px;height:8px;
  background:url(${FilterClose}) no-repeat;background-size:100% 100%;
  vertical-align:middle;
  margin-left:5px;
`
const FilterDownArrow = styled.div`
  width:100%;
`
const ImgDiv = styled.div`
  width:100%;
  text-align:center;
`
const DownImg = styled.img`
  display:inline-block;
  width:16px;
`
