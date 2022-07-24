//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

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
//theme
import { TtCon_MainMapSidePanel_FilterListPos } from '../../../theme';

//material-ui
import { styled as MUstyled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';


//theme
import { TtCon_Frame_Portrait_A, TtCon_MainMapSidePanel_ArticlePos, TtCon_MainMapSidePanel_TapPos } from '../../../theme';

// components
import { Portrait, Landscape } from "../../../MediaQuery";
import ItemTabContent from "./tabcontent/ItemTabContent";
import BrokerTabContent from "./tabcontent/BrokerTabContent";
import BrokerTabContentModal from "./tabcontent/BrokerTabContentModal";
import OnlyMaemul from "./topmenu/OnlyMaemul";
import OnlyBroker from "./topmenu/OnlyBroker";
import OnlyDanji from "./topmenu/OnlyDanji";
import DanjiTabContent from './tabcontent/DanjiTabContent';
import DanjiTabContentModal from './tabcontent/DanjiTabContentModal';
// import TopMenu from '../commonDetail/topMenu_연결해제';
import ListContentFilter from '../commonDetail/ListContentFilter'

// redux
import { useSelector } from 'react-redux';

export default function MainSideBar({ onScrollList, setActiveIndex, activeIndex, updatePageIndex, historyInfo, setHistoryInfo, setReport, updown, setUpDown, status, containerRef,scrollRef }) {
  //const [activeIndex,setActiveIndex] = useState(0);
  const [tapStatus, setTapStatus] = useState(0);
  // const [isInit, setIsInit] = useState(true);
  const [typeStatus, setTypeStatus] = useState("");
  const mapRightRedux = useSelector(state => { return state.mapRight });
  const productRedux = useSelector(state => { return state.mapProductEls });

  // Init
  useEffect(() => {
    setActiveIndex(0);
    setTapStatus(0)
    setHistoryInfo(e => { e.prevTab = 0; return JSON.parse(JSON.stringify(e)); });
    // setIsInit(false);
  }, [])

  useEffect(() => {
    switch (status) {
      case "apart":
        setTypeStatus("아파트");
        break;
      case "officetel":
        setTypeStatus("오피스텔");
        break;
      case "store":
        setTypeStatus("상가");
        break;
      case "office":
        setTypeStatus("사무실");
        break;
      default:
        setTypeStatus("");
        break;
    }
  }, [status])

  // 분기처리  
  useEffect(() => {
    console.log('mapRIghtRedux 변화 변화될일이있나??',mapRightRedux);
    console.log(mapRightRedux.isExclusive.is && mapRightRedux.isProbroker.is);

    // 전속매물, 전문중개사 
    if (mapRightRedux.isExclusive.is && mapRightRedux.isProbroker.is) {
      setTapStatus(3);
      setActiveIndex(0);//기본값지정.
      // if(isInit){return;}
    } // 전속매물, 단지별 실거래
    else if (mapRightRedux.isExclusive.is && mapRightRedux.isBlock.is) {
      setTapStatus(5);
      setActiveIndex(0);//기본값 지정.
    } // 전속매물
    else if (mapRightRedux.isExclusive.is) {
      //전속매물만 active되어있던 경우는 0값 index처리한다.
      setActiveIndex(0);//전속매물 0
      setHistoryInfo(e => { e.prevTab = 0; return JSON.parse(JSON.stringify(e)); });
      setTapStatus(0);
    } // 전문중개사
    else if (mapRightRedux.isProbroker.is) {
      //전문중개사만 active되어있던 경우 1값 처리.
      setActiveIndex(1);//전문중개사 1
      setHistoryInfo(e => { e.prevTab = 1; return JSON.parse(JSON.stringify(e)); });
      setTapStatus(1)
    } // 단지별 실거재
    else if (mapRightRedux.isBlock.is) {
      //단지별실거래만 active되어있던 경우 2값 처리.
      setActiveIndex(2);//단지실거래 2
      setHistoryInfo(e => { e.prevTab = 2; return JSON.parse(JSON.stringify(e)); });
      setTapStatus(2)
    }// 석택 x
    else {
      setHistoryInfo(e => { e.prevTab = 4; return JSON.parse(JSON.stringify(e)); });
      setTapStatus(4);
      setActiveIndex(0);
    }
  }, [mapRightRedux])

  // 상단 제목
  // **api 서버에서 총 몇개인지 가져와 length에 담아야 합니다. 
  const tapReturn = () => {
    if (tapStatus == 3) { // 전속매물/전문중개사  active
      return (
        <Sect_TabLine>
          <WrapTabBtn>
            <Span className="tab ApartTab" active={activeIndex == 0} onClick={() => { setActiveIndex(0); setHistoryInfo(e => { e.prevTab = 0; return JSON.parse(JSON.stringify(e)); }); setUpDown('true'); }}>{typeStatus}&nbsp;{productRedux.exclusive_zido.cnt}</Span>
            <Part />
            <Span2 className="tab ApartTab" active={activeIndex == 1} onClick={() => { setActiveIndex(1); setHistoryInfo(e => { e.prevTab = 1; return JSON.parse(JSON.stringify(e)); }); setUpDown('true'); }}>전문중개사&nbsp;<Orange active={activeIndex == 1} onClick={() => { setActiveIndex(1); }}>{productRedux.probroker_zido.cnt}</Orange></Span2>
          </WrapTabBtn>
          <Portrait>{/*모바일 open List Btn*/}
            {/* <OpenListImg onClick={() => { setUpDown(!updown) }} /> */}
            <ExpandMore
              expand={updown}
              onClick={() => { setUpDown(!updown); }}
              aria-expanded={updown}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Portrait>
        </Sect_TabLine>
      )
    } else if (tapStatus == 5) { //전속매물 / 단지별 실거래 active
      return (
        <Sect_TabLine>
          <WrapTabBtn>
            <Span className="tab ApartTab" active={activeIndex == 0} onClick={() => { setActiveIndex(0); setHistoryInfo(e => { e.prevTab = 0; return JSON.parse(JSON.stringify(e)); }); setUpDown('true'); }}>{typeStatus}&nbsp;{productRedux.exclusive_zido.cnt}</Span>
            <Part />
            <Span2 className="tab ApartTab" active={activeIndex == 2} onClick={() => { setActiveIndex(2); setHistoryInfo(e => { e.prevTab = 2; return JSON.parse(JSON.stringify(e)); }); setUpDown('true'); }}>아파트 단지&nbsp;<Orange active={activeIndex == 2} onClick={() => { setActiveIndex(2); }}>{productRedux.block_zido.cnt}</Orange></Span2>
          </WrapTabBtn>
          <Portrait>{/*모바일 open List Btn*/}
            {/* <OpenListImg onClick={() => { setUpDown(!updown) }} /> */}
            <ExpandMore
              expand={updown}
              onClick={() => { setUpDown(!updown) }}
              aria-expanded={updown}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Portrait>
        </Sect_TabLine>
      )
    }
    else if (tapStatus == 0) { // 전속매물 active
      return (
        <Sect_TabLine>
          <WrapTabBtn>
            <Span className="tab ApartTab" active={activeIndex == 0} onClick={() => { setActiveIndex(0); setHistoryInfo(e => { e.prevTab = 0; return JSON.parse(JSON.stringify(e)); }); setUpDown('true'); }}>{typeStatus}&nbsp;{productRedux.exclusive_zido.cnt}</Span>
          </WrapTabBtn>
          <Portrait>{/*모바일 open List Btn*/}
            {/* <OpenListImg onClick={() => { setUpDown(!updown) }} /> */}
            <ExpandMore
              expand={updown}
              onClick={() => { setUpDown(!updown); }}
              aria-expanded={updown}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Portrait>
        </Sect_TabLine>
        // <TopMenu typeStatus={typeStatus} productRedux={productRedux} length={productRedux.exclusive_zido.cnt} updown={updown} setHistoryInfo={setHistoryInfo} setUpDown={setUpDown} />
      )
    } else if (tapStatus == 1) { // 전문중개사 active   
      return (
        <Sect_TabLine>
          <WrapTabBtn>
            <Span2 className="tab ApartTab" active={activeIndex == 1} onClick={() => { setActiveIndex(1); setHistoryInfo(e => { e.prevTab = 1; return JSON.parse(JSON.stringify(e)); }); setUpDown('true'); }}>전문중개사&nbsp;<Orange active={activeIndex == 1} onClick={() => { setActiveIndex(1); }}>{productRedux.probroker_zido.cnt}</Orange></Span2>
          </WrapTabBtn>
          <Portrait>{/*모바일 open List Btn*/}
            {/* <OpenListImg onClick={() => { setUpDown(!updown) }} /> */}
            <ExpandMore
              expand={updown}
              onClick={() => { setUpDown(!updown); }}
              aria-expanded={updown}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Portrait>
        </Sect_TabLine>
        // <TopMenu typeStatus={"전문중개사"} productRedux={productRedux} length={productRedux.probroker_zido.cnt} updown={updown} setHistoryInfo={setHistoryInfo} setUpDown={setUpDown} />
      )
    } else if (tapStatus == 2) { // 단지별 실거래 active   
      return (
        <Sect_TabLine>
          <WrapTabBtn>
            <Span2 className="tab ApartTab" active={activeIndex == 2} onClick={() => { setActiveIndex(2); setHistoryInfo(e => { e.prevTab = 2; return JSON.parse(JSON.stringify(e)); }); setUpDown('true'); }}>아파트 단지&nbsp;<Orange active={activeIndex == 2} onClick={() => { setActiveIndex(2); }}>{productRedux.block_zido.cnt}</Orange></Span2>
          </WrapTabBtn>
          <Portrait>{/*모바일 open List Btn*/}
            {/* <OpenListImg onClick={() => { setUpDown(!updown) }} /> */}
            <ExpandMore
              expand={updown}
              onClick={() => { setUpDown(!updown) }}
              aria-expanded={updown}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Portrait>
        </Sect_TabLine>
        // <TopMenu typeStatus={"아파트단지"} productRedux={productRedux} length={productRedux.block_zido.cnt} updown={updown} setHistoryInfo={setHistoryInfo} setUpDown={setUpDown} />
      )
    } else { // 선텍 x
      return (<></>)
    }
  }

const ListFillter = ()=>{
  if (tapStatus == 0) {
    return (
      <ListContentFilter typeStatus={typeStatus} productRedux={productRedux} length={productRedux.exclusive_zido.cnt} updown={updown} setHistoryInfo={setHistoryInfo} setUpDown={setUpDown} />
      // <TopMenu typeStatus={typeStatus} productRedux={productRedux} length={productRedux.exclusive_zido.cnt} updown={updown} setHistoryInfo={setHistoryInfo} setUpDown={setUpDown} />
    )

  } else if (tapStatus == 1){
    return(
      <ListContentFilter typeStatus={"전문중개사"} productRedux={productRedux} length={productRedux.probroker_zido.cnt} updown={updown} setHistoryInfo={setHistoryInfo} setUpDown={setUpDown} />
      // <TopMenu typeStatus={"전문중개사"} productRedux={productRedux} length={productRedux.probroker_zido.cnt} updown={updown} setHistoryInfo={setHistoryInfo} setUpDown={setUpDown} />
      )

  } else if (tapStatus == 2){
    return(
      <ListContentFilter typeStatus={"아파트단지"} productRedux={productRedux} length={productRedux.block_zido.cnt} updown={updown} setHistoryInfo={setHistoryInfo} setUpDown={setUpDown} />
      // <TopMenu typeStatus={"아파트단지"} productRedux={productRedux} length={productRedux.block_zido.cnt} updown={updown} setHistoryInfo={setHistoryInfo} setUpDown={setUpDown} />
    )
  }else{
    return(
      <>
      </>
    )
  }

}

  // 컨텐츠
  const contentReturn = () => {
    // 전속매물
    if (historyInfo.prevTab == 0) {
      return (
        <>
          <ItemTabContent updatePageIndex={updatePageIndex} setReport={setReport} setHistoryInfo={setHistoryInfo} productList={productRedux.exclusive} containerRef={containerRef} index={0} />
        </>
      )
    } // 전문 중개사
    else if (historyInfo.prevTab == 1) {
      return (
        <>
          <BrokerTabContent updatePageIndex={updatePageIndex} setHistoryInfo={setHistoryInfo} containerRef={containerRef} />
        </>
      )
    } // 단지별 실거래
    else if (historyInfo.prevTab == 2) {
      return (
        <>
          <DanjiTabContent updatePageIndex={updatePageIndex} setHistoryInfo={setHistoryInfo} />
        </>
      )
    } // x 
    else if (historyInfo.prevTab == 4) {
      return (<></>)
    }
  }

  return (
    <>
      <Wrapper>
        {tapReturn()}
        {/* <FilterSection>
          </FilterSection> */}
        <Sect_FilterList className="clearfix">

          {ListFillter()} 

          {/* <MUIconButton_FilterList
            size="middle"
            onClick={console.log('필터리스트창')}
          >
            <FilterListIcon />
          </MUIconButton_FilterList> */}
        </Sect_FilterList>
        
        <Sect_Article className="noneScrollbar" ref={scrollRef} onScroll={()=>{onScrollList()}}>
          <Sect_Article_1>
            <Landscape>{contentReturn()}</Landscape>
            <Portrait>
              {updown && contentReturn()}
            </Portrait>
          </Sect_Article_1>
        </Sect_Article>

      </Wrapper>
    </>

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

const FilterSection = styled.div`
  display: flex;
    justify-content: flex-end;
`

const MUIconButton = styled(IconButton)``

//-----------------------------------------------------

const Wrapper = styled.div`
height:100%;
`

const ExpandMore = styled(IconButton)`
&.MuiButtonBase-root.MuiIconButton-root{
  position: absolute;
  top:50%;right:8px;
  transform: translateY(-50%) ${({ expand }) => !expand ? 'rotate(180deg)' : 'rotate(0deg)'};
  //margin-left: auto;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 3ms;
}
`

//--------------------------------------
const Sect_TabLine = styled.div`
  height:100%;
  ${TtCon_MainMapSidePanel_TapPos}
  background-color:${(props) => props.theme.palette.mono.main};
  position:relative;
`

const WrapTabBtn = styled.div`
  height: 100%;
  display:flex;
  justify-content:center;
  align-items:center;
`
//-------------------------------------------

const Sect_FilterList = styled.div`
${TtCon_MainMapSidePanel_FilterListPos}
${TtCon_Frame_Portrait_A}
/* position:relative; */
display: flex;
    justify-content: end;
`
const MUIconButton_FilterList = styled(MUIconButton)`
  &.MuiButtonBase-root.MuiIconButton-root {
    position:absolute;
    right:0;
    top: 50%; transform: translateY(-50%);
  }
`
//----------------------------------------------------
const Sect_Article = styled.div`
${TtCon_MainMapSidePanel_ArticlePos}
overflow-y: auto;
`

const Sect_Article_1 = styled.div`
${TtCon_Frame_Portrait_A}
`






// const OpenListImg = styled.div`
//   position:absolute;
//   cursor:pointer;
//   left:1rem;
//   top:50%;transform:translateY(-50%);
//   width:2rem;height:2rem;
//   background:url(${OpenList}) no-repeat center center;
//   background-size:contain;
//  `
const Span = styled.span`
  color:${({ active }) => active ? "#01684b" : "#707070"};
  cursor:pointer;
`
const Span2 = styled.span`
  color:${({ active }) => active ? "#4a4a4a" : "#070707"};
  cursor:pointer;

`
const Orange = styled.span`
  color:${({ active }) => active ? "#FF7B01" : "#070707"};
`

// const WrapNonTab = styled.div`
//   width:100%;padding:0 25px;
//   display:flex;justify-content:space-between;align-items:center;

// `
// const NonTab = styled.p`
// font-size:18px;font-weight:800;
// transform:skew(-0.1deg);
// color:#4a4a4a;
// `
// const ViewBtn = styled.div`
//   position:relative;
// `
// const Img = styled.img`
//   display:inline-block;
//   width:19px;
// `
// const InMenu = styled.ul`
//   position:absolute;
//   top:20px;left:-80px;
//   width:112px;
//   border:1px solid #707070;
//   border-radius:8px;
//   background:#fff;
//   z-index:3;
//   @media ${(props) => props.theme.mobile} {
//     top:calc(100vw*(35/428));
//     left:calc(100vw*(-30/428));
//     width:calc(100vw*(100/428));
//   }

// `
// const Div = styled.li`
//   font-size:13px;
//   transform:skew(-0.1deg);
//   border-radius:8px;
//   padding:4px 0 4px 17px;
//   transition:all 0.3s;
//   &:hover{background:#f8f7f7;}
//   &:first-child{padding-top:8px;}
//   &:last-child{padding-bottom:8px;}
//   @media ${(props) => props.theme.mobile} {
//     font-size:calc(100vw*(13/428));
//     padding:calc(100vw*(4/428)) 0 calc(100vw*(4/428)) calc(100vw*(12/428));
//     &:first-child{padding-top:calc(100vw*(8/428));}
//     &:last-child{padding-bottom:calc(100vw*(8/428));}
//   }
// `
// const InDiv = styled.div`
//   width:100%;height:100%;
// `

// const Green = styled.span`
//  font-size:18px;font-weight:800;
//  transform:skew(-0.1deg);
//  color:#01684b;
//  @media ${(props) => props.theme.mobile} {
//    font-size:calc(100vw*(15/428));
//  }
// `
// const OrangeColor = styled(Green)`
//   color:#FF7B01;
// `
const Part = styled.span`
  display:inline-block;width:1px;height:16px;
  background:#707070;margin:0 14px;
  /* @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(15/428));
  } */
`
// const TabContent = styled.div`
//   position:relative;
//   display:flex;justify-content:flex-start;align-items:center;
//   padding:25px 27px 0 27px;margin-top:17px;
//   margin-bottom:17px;
//   border-top:1px solid #f2f2f2;
//   @media ${(props) => props.theme.mobile} {
//     padding:calc(100vw*(15/428));
//   }
// `
// const LeftContent = styled.div`
//   margin-right:31px;
// `
// const TopBox = styled.div`
//   display:flex;justify-content:center;align-items:center;
//   width:163px;height:26px;border:1px solid #2b664d;
//   line-height:24px;
// `
// const ColorGreen = styled.span`
//   font-size:11px;
//   font-weight:800;transform:skew(-0.1deg);
//   color:#01684b;
//   display:inline-block;margin-right:3px;
// `
// const WrapDate = styled.div`
//   display:flex;
//   justify-content:flex-start;
//   align-items:center;
// `
// const StartDate = styled.p`
//   font-size:11px;
//   font-weight:800;transform:skew(-0.1deg);
//   color:#707070;

// `
// const Line = styled(StartDate)`
// `
// const EndDate = styled(StartDate)`
// `
// const ItemInfo = styled.div`
//   margin-top:8px;
// `
// const Name = styled.div`
//   margin-bottom:3px;
// `
// const Kind = styled.p`
//   display:inline-block;
//   font-size:15px;color:#707070;
//   font-weight:600;transform:skew(-0.1deg);
// `
// const ColorOrange = styled.span`
//   display:inline-block;
//   font-size:15px;color:#fe7a01;
//   vertical-align:middle;
//   margin:0 3px;
//   font-weight:600;transform:skew(-0.1deg);
// `
// const Detail = styled(Kind)`
// `
// const Price = styled.h3`
//   font-size:20px;color:#4a4a4a;
//   font-weight:800;transform:skew(-0.1deg);
// `
// const Option = styled.div`
//   margin:6.5px 0;
//   display:flex;justify-content:flex-start;align-items:center;
// `
// const Floor = styled.p`
//   font-size:15px;color:#707070;
//   font-weight:600;transform:skew(-0.1deg);
//   margin-right:5px;
// `
// const area = styled(Floor)`
// `
// const Expenses = styled(Floor)`
//   margin-right:0;
// `
// const Desc = styled(Expenses)`
//   width:196px;
//   white-space:nowrap;
//   text-overflow:ellipsis;
//   overflow:hidden;
// `
// const RightContent = styled.div`
//   position:relative;
//   width:158px;height:158px;
// `
// const ItemImg = styled.img`
//   width:100%;height:100%;
// `
