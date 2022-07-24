//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import NavIcon from '../../../img/main/nav_btn.png';
import Logo from '../../../img/main/header_logo.png';
import PCLogo from '../../../img/main/pc_header_logo.png';
import Mypage from '../../../img/main/mypage_icon.png';
import Item from "../../../img/map/map_item.png";
import FilterDown from "../../../img/map/filter_down_arrow.png";
import FilterNext from "../../../img/map/filter_next.png";
import FilterClose from "../../../img/map/filter_close.png";
import Checked from "../../../img/map/checked.png";
import Check from "../../../img/main/heart.png";
import View from "../../../img/main/icon_view.png";
import OpenList from "../../../img/map/toggle_list.png";


// components
import { Mobile, PC } from "../../../MediaQuery";
import ItemTabContent from "./tabcontent/ItemTabContent";
import DanjiTabContent from "./tabcontent/DanjiTabContent";

const ItemListItem =[
{
  item_id : 0,
  path:"/",
  startDate:"20.00.00",
  endDate: "20.00.00",
  kind:"아파트",
  detail:"자이 109동",
  price:"전세 12억 5,000",
  floor:"층수",
  Area:"공급면적",
  expenses:"관리비",
  desc:"매물특징 칸입니다. 작은설명작은설명작은설명작은설명"
},
{
  item_id : 1,
  path:"/",
  startDate:"20.00.00",
  endDate: "20.00.00",
  kind:"아파트",
  detail:"자이 109동",
  price:"전세 12억 5,000",
  floor:"층수",
  Area:"공급면적",
  expenses:"관리비",
  desc:"매물특징 칸입니다. 작은설명작은설명작은설명작은설명"
},
{
  item_id : 2,
  path:"/",
  startDate:"20.00.00",
  endDate: "20.00.00",
  kind:"아파트",
  detail:"자이 109동",
  price:"전세 12억 5,000",
  floor:"층수",
  Area:"공급면적",
  expenses:"관리비",
  desc:"매물특징 칸입니다. 작은설명작은설명작은설명작은설명"
},
{
  item_id : 3,
  path:"/",
  startDate:"20.00.00",
  endDate: "20.00.00",
  kind:"아파트",
  detail:"자이 109동",
  price:"전세 12억 5,000",
  floor:"층수",
  Area:"공급면적",
  expenses:"관리비",
  desc:"매물특징 칸입니다. 작은설명작은설명작은설명작은설명"
},
{
  item_id : 4,
  path:"/",
  startDate:"20.00.00",
  endDate: "20.00.00",
  kind:"아파트",
  detail:"자이 109동",
  price:"전세 12억 5,000",
  floor:"층수",
  Area:"공급면적",
  expenses:"관리비",
  desc:"매물특징 칸입니다. 작은설명작은설명작은설명작은설명"
},
{
  item_id : 5,
  path:"/",
  startDate:"20.00.00",
  endDate: "20.00.00",
  kind:"아파트",
  detail:"자이 109동",
  price:"전세 12억 5,000",
  floor:"층수",
  Area:"공급면적",
  expenses:"관리비",
  desc:"매물특징 칸입니다. 작은설명작은설명작은설명작은설명"
},
{
  item_id : 6,
  path:"/",
  startDate:"20.00.00",
  endDate: "20.00.00",
  kind:"아파트",
  detail:"자이 109동",
  price:"전세 12억 5,000",
  floor:"층수",
  Area:"공급면적",
  expenses:"관리비",
  desc:"매물특징 칸입니다. 작은설명작은설명작은설명작은설명"
}
]


export default function MainHeader({updatePageIndex,historyInfo,setHistoryInfo,setReport,setMap,updown,setUpDown}) {
    const [activeIndex,setActiveIndex] = useState(0);

    return (
        <Container>
          <WrapTab className="Tabs">
          {/*전문중개사 버튼 눌려있을때 -> 탭으로 아파트 ㅣ 전문중개사*/}
          <WrapTabBtn>
            <Mobile>{/*모바일 open List Btn*/}
              <OpenListImg onClick={() => {setUpDown(!updown)}}/>
            </Mobile>
            <Span className="tab ApartTab" active={activeIndex == 0} onClick={()=>{setActiveIndex(0);setHistoryInfo(e => {e.prevTab = false; return JSON.parse(JSON.stringify(e));});}}>아파트 303</Span>
            <Part/>
            <Span2 className="tab ApartTab" active={activeIndex == 1} onClick={()=>{setActiveIndex(1);setHistoryInfo(e => {e.prevTab = true; return JSON.parse(JSON.stringify(e));});}}>아파트단지 <Orange active={activeIndex == 1} onClick={()=>{setActiveIndex(1);}}>37</Orange></Span2>
          </WrapTabBtn>
            {
              historyInfo.prevTab ?
                <DanjiTabContent updatePageIndex={updatePageIndex} setHistoryInfo={setHistoryInfo} setMap={setMap}/>
                :
                <ItemTabContent updatePageIndex={updatePageIndex} setReport={setReport} itemList={ItemListItem} setHistoryInfo={setHistoryInfo} index={0}/>
             }
          </WrapTab>
          {/**/}
        </Container>
  );
}

/*
{/*전문매물(초록색) 버튼이 활성화 됐을때}
    // <Tabs onSelect={(index, label) => console.log(label + ' selected')} className="Tabs">
{/*아파트 탭}
      <Tab label="아파트 303" className="tab ApartTab">
    {/*tabcontent 폴더에 컴포넌트로 따로 빼놓았습니다.}
        <ItemTabContent updatePageIndex={updatePageIndex} itemList={ItemListItem}/>
      </Tab>

{/*전문중개사 탭}
      <Tab label="전문중개사 37" className="tab ProTab">
        {/*tabcontent 폴더에 컴포넌트로 따로 빼놓았습니다.}
        <BrokerTabContent updatePageIndex={updatePageIndex}/>
      </Tab>
    </Tabs>

*/
const Container = styled.div `
  padding:0 22px;
  @media ${(props) => props.theme.mobile} {
    padding:0 calc(100vw*(22/428));
  }
`
const WrapMainSide = styled.section`
`
const WrapTab = styled.div`
@media ${(props) => props.theme.mobile} {
  padding-top:calc(100vw*(22/428));
}
`
const WrapTabBtn = styled.div`
  position:relative;
  display:flex;justify-content:center;align-items:center;
`
const OpenListImg = styled.div`
  position:absolute;
  cursor:pointer;left:calc(100vw*(10/428));top:50%;transform:translateY(-50%);
  width:calc(100vw*(30/428));
  height:calc(100vw*(30/428));
  background:url(${OpenList}) no-repeat center center;background-size:calc(100vw*(12/428)) calc(100vw*(30/428));
`
const Span = styled.span`
  display:inline-block;
  font-size:18px;font-weight:800;
  transform:skew(-0.1deg);
  color:${({active}) => active ? "#01684b" : "#707070"};
  cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Span2 = styled.span`
  display:inline-block;
  font-size:18px;font-weight:800;
  transform:skew(-0.1deg);
  color:${({active}) => active ? "#4a4a4a" : "#070707"};
  cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Orange = styled.span`
  color:${({active}) => active ? "#FF7B01" : "#070707"};
`

const WrapNonTab = styled.div`
  width:100%;padding:0 25px;
  display:flex;justify-content:space-between;align-items:center;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const NonTab = styled.p`
font-size:18px;font-weight:800;
transform:skew(-0.1deg);
color:#4a4a4a;
@media ${(props) => props.theme.mobile} {
  font-size:calc(100vw*(15/428));
}
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
const Part = styled.span`
  display:inline-block;width:1px;height:16px;
  background:#707070;margin:0 14px;
`
