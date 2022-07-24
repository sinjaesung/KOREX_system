//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

import View from "../../../../img/main/icon_view.png";
import OpenList from "../../../../img/map/toggle_list.png";

//component
import { Mobile, PC } from "../../../../MediaQuery";

export default function MainHeader({updatePageIndex,historyInfo,setHistoryInfo,setReport,updown,setUpDown}) {
    const [activeIndex,setActiveIndex] = useState(0);
    const [select,setSelect] = useState(false);
    const showModal =()=>{
      setSelect(!select);
    }
    return (
        <Container>
          <WrapNonTab>
            <Mobile>{/*모바일 open List Btn*/}
              <OpenListImg onClick={() => {setUpDown(!updown)}}/>
            </Mobile>
            <NonTab onClick={()=>{setActiveIndex(1);setHistoryInfo(e => {e.prevTab = false; return JSON.parse(JSON.stringify(e));});}}>전문중개사 <OrangeColor>3</OrangeColor>건</NonTab>
            <PC>
              <ViewBtn>
                <Link onClick={showModal}>
                  <Img src={View}/>
                  {
                    select ?
                    <InMenu>
                      <Div>
                        <Link className="data_link"></Link>
                        <InDiv>최신등록순</InDiv>
                      </Div>
                      <Div>
                        <Link className="data_link"></Link>
                        <InDiv>높은가격순</InDiv>
                      </Div>
                      <Div>
                        <Link className="data_link"></Link>
                        <InDiv>낮은가격순</InDiv>
                      </Div>
                      <Div>
                        <Link className="data_link"></Link>
                        <InDiv>넓은면적순</InDiv>
                      </Div>
                      <Div>
                        <Link className="data_link"></Link>
                        <InDiv>좁은면적순</InDiv>
                      </Div>
                      <Div>
                        <Link className="data_link"></Link>
                        <InDiv>가나다순</InDiv>
                      </Div>
                    </InMenu>
                    :
                    null
                  }
                </Link>
              </ViewBtn>
            </PC>
            <Mobile>
              <ViewBtn>
                <SelectMb>
                  <Option selected disabled></Option>
                  <Option>최신등록순</Option>
                  <Option>높은가격순</Option>
                  <Option>낮은가격순</Option>
                  <Option>넓은면적순</Option>
                  <Option>좁은면적순</Option>
                  <Option>가나다순</Option>
                </SelectMb>
              </ViewBtn>
            </Mobile>
          </WrapNonTab>
        </Container>
  );
}
const Container = styled.div`
`
const WrapNonTab = styled.div`
  position:relative;
  width:100%;padding:0 25px;
  display:flex;justify-content:space-between;align-items:center;
  @media ${(props) => props.theme.mobile} {
    padding:0 calc(100vw*(15/428)) 0 calc(100vw*(45/428));
  }
`
const OpenListImg = styled.div`
  position:absolute;
  cursor:pointer;left:calc(100vw*(10/428));top:50%;transform:translateY(-50%);
  width:calc(100vw*(30/428));
  height:calc(100vw*(30/428));
  background:url(${OpenList}) no-repeat center center;background-size:calc(100vw*(12/428)) calc(100vw*(30/428));
`
const NonTab = styled.p`
font-size:18px;font-weight:800;
transform:skew(-0.1deg);
color:#4a4a4a;
`
const ViewBtn = styled.div`
  position:relative;
`
const Img = styled.img`
  display:inline-block;
  width:19px;
`
const InMenu = styled.ul`
  position:absolute;
  top:20px;left:-80px;
  width:112px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;
  z-index:3;
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(35/428));
    left:calc(100vw*(-30/428));
    width:calc(100vw*(100/428));
  }

`
const Div = styled.li`
  font-size:13px;
  transform:skew(-0.1deg);
  border-radius:8px;
  padding:4px 0 4px 17px;
  transition:all 0.3s;
  &:hover{background:#f8f7f7;}
  &:first-child{padding-top:8px;}
  &:last-child{padding-bottom:8px;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    padding:calc(100vw*(4/428)) 0 calc(100vw*(4/428)) calc(100vw*(12/428));
    &:first-child{padding-top:calc(100vw*(8/428));}
    &:last-child{padding-bottom:calc(100vw*(8/428));}
  }
`
const InDiv = styled.div`
  width:100%;height:100%;
`

const Green = styled.span`
 font-size:18px;font-weight:800;
 transform:skew(-0.1deg);
 color:#01684b;
`
const OrangeColor = styled(Green)`
  color:#FF7B01;
`
const SelectMb = styled.select`
  width:calc(100vw*(30/428));
  height:calc(100vw*(30/428));
  background:url(${View}) no-repeat center center; background-size:calc(100vw*(16/428));
  appearance:none;
`
const Option = styled.option`
`
