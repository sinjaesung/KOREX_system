//react
import React from 'react';

//css
import styled from "styled-components"

//img
import ArrowTop from '../../../../img/map/arrow_top.png';

const DetailTopCommon = ({onClick, open}) => {
    return(
        <DetailTopBox onClick={onClick}>
            <DetailTitle>물건상세</DetailTitle>
            <Line/>
            <ArrowImg src={ArrowTop} rotate={open?"rotate(180deg)":"rotate(0deg)"}/>
        </DetailTopBox>
    )
};

export default DetailTopCommon;

const DetailTopBox = styled.div`
  width:100%;cursor:pointer;
  padding:1rem;
  border-top:1px solid #f2f2f2;
  display:flex;justify-content:space-between;align-items:center;
  /* @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(22/428)) calc(100vw*(33/428));
  } */
`
const DetailTitle = styled.div`
  /* font-size:15px;color:#4e4e4e;font-weight:600;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  } */
`
const Line = styled.div`
  width:200px;
  height:1px; background:#cecece;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(230/428));
  }
`
const ArrowImg = styled.img`
  display:inline-block;
  width:26px;
  transition:all 0.2s;
  transform:${({rotate}) => rotate};
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(26/428));
  }
`