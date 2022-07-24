//react
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import Slider from "react-slick";

//css
import styled from "styled-components"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//theme
import { TtCon_Frame_Portrait_A, TtCon_MainMapFilter, TtCon_MainMapFilter_ArticlePos, TtCon_MainMapFilter_TapPos } from '../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SyncIcon from '@material-ui/icons/Sync';
import Button from '@material-ui/core/Button';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';


//img
import NavIcon from '../../../img/main/nav_btn.png';
import Logo from '../../../img/main/header_logo.png';
import PCLogo from '../../../img/main/pc_header_logo.png';
import Mypage from '../../../img/main/mypage_icon.png';
import FilterClose from '../../../img/map/filter_close.png';
import FilterDown from '../../../img/map/filter_down_arrow.png';

// components
import { Mobile, PC } from "../../../MediaQuery";
import FilterTopButton from "./FilterTopButton";
import FilterCloseAndReset from "./FilterCloseAndReset";
import ApartFilter from "./filter/ApartFilter";
import OfficetelFilter from "./filter/OfficetelFilter";
import StoreAndOfficeFilter from "./filter/StoreAndOfficeFilter";

// redux
import { MapFilterRedux } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';



const ExpandMore = MUstyled((props) => {
  console.log('ExpandMoresss:>>>');
  const { expand, ...other } = props;
  return <IconButton {...other}/>;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "" }}
      onClick={onClick}
    ><NavigateNextIcon /></div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "" }}
      onClick={onClick}
    ><NavigateBeforeIcon /></div>
  );
}



export default function MapFilter({ status }) {

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    centeredSlides: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const mapFilterRedux = useSelector(state => { return state.mapFilter });
  let uiData = JSON.parse(JSON.stringify(mapFilterRedux.filterUI));
  const filterWrap = document.querySelector("#filterWrap");
  let preventBubbling = false;

  const filterListRef = useRef();
  const downArrowRef = useRef();

  const padding = () => {
    if (open == true) {
      // return "calc(100vw*(50/428)) calc(100vw*(10/428)) calc(100vw*(80/428))"
    } else {
      // return "calc(100vw*(10/428)) calc(100vw*(10/428)) 0"
    }
  }

  // useEffect(() => {
  //   if (open) {
  //     filterListRef.current.classList.remove("hidden");
  //     if (downArrowRef.current) {
  //       downArrowRef.current.classList.add("hidden")
  //     }
  //   } else {
  //     filterListRef.current.classList.add("hidden");
  //     if (downArrowRef.current) {
  //       downArrowRef.current.classList.remove("hidden")
  //     }
  //   }
  // }, [open])

  // 거래유형 텍스트 
  const typeText = () => {
    const data = mapFilterRedux.filterArr;
    let text = data.prd_sel_type[0];
    for (let i = 1; i < data.prd_sel_type.length; i++) {
      text = text + ", " + data.prd_sel_type[i]
    }
    return <>{text}</>
  }

  // 방구조
  const roomText = () => {
    const data = mapFilterRedux.filterArr.room;
    if (data[0] == "전체") {
      return;
    }

    let text = "";
    text = data[0];
    for (let i = 1; i < data.length; i++) {
      text = text + ", " + data[i]
    }

    return (
      <SlickSlide className="slide__one">
        <MUChip label={text} onDelete={(e) => { e.target.setAttribute("data-type", "room"); onClickClose(e) }} />
      </SlickSlide>
    )
  }

  const filterRange = (bool, bool_2, data, scrollPos, dataType) => {
    if (bool) { return; }
    if (bool_2) { return };
    return (
      <SlickSlide className={["slide__one","changeBtn"]}>
        <MUChip label={data} onDelete={(e) => { e.target.setAttribute("data-type", dataType); onClickClose(e); }}/>
      </SlickSlide>
    )
  }

  /// 필터 생성
  const filterText = (bool, text, dataType, scroll) => {
    if (!bool) {
      return;
    }

    if (text == "전체") {
      return;
    }

    return (
      <SlickSlide className={["slide__one","changeBtn"]}>
        <MUChip label={text} onDelete={(e) => { e.target.setAttribute("data-type", dataType); onClickClose(e) }} />
      </SlickSlide>

    )
  }

  // 필터 삭제
  const onClickClose = (e) => {
    preventBubbling = true;
    setTimeout(() => {
      preventBubbling = false;
    }, 300)
    const data = mapFilterRedux.filterArr;
    const type = e.target.dataset.type;

    // if(type == "option"){
    //   const option = document.querySelectorAll(`input[name='option']`);
    //   for(let i = 0 ; i < option.length ; i++){
    //     option[i].checked = false;
    //   }
    //   data.life_facilites = [];
    // }


    if (type == "use") {
      data.use = "전체";
      uiData.use = 0;
    }
    else if (type == "floor") {
      data.floor = "전체";
      uiData.floor = 0;
    }
    else if (type == "purpose") {
      data.purpose = "전체";
      uiData.purpose = 0;
    }
    else if (type == "room") {
      data.room = ["전체"];
      uiData.roomOfficetel = [1, 0, 0, 0, 0, 0];
    }
    else if (type == "double") {
      data.double = "전체";
      uiData.double = 0;
    }
    else if (type == "pet") {
      data.pet = "전체";
      uiData.pet = 0;
    }
    else if (type == "parkBtn") {
      uiData.parkOfficetel = 0;
    }
    else if (type == "parkBtnStore") {
      uiData.parkStore = 0;
    }
    else if (type == "toiletBtn") {
      uiData.toilet = 0;
    }
    else if (type == "roomApart") {
      data.roomApart = "전체";
      uiData.roomApart = 0;
    }
    else if (type == "bath") {
      data.bath = "전체";
      uiData.bath = 0;
    }
    else if (type == "danji") {
      data.danji = "전체";
      uiData.danji = 0;
    }
    else if (type == "priceRange") {
      data.priceRange = "전체";
      uiData.priceRangeValue = [0, 100];
    }
    else if (type == "manaRange") {
      data.manaRange = "전체";
      uiData.manaRangeValue = [0, 75];
    }
    else if (type == "manaBtn") {
      uiData.manaStatus = 0;
    }
    else if (type == "areaRange") {
      data.areaRange = "전체";
      uiData.areaRangeValue = [0, 100];
    }
    else if (type == "jeonseRange") {
      data.jeonseRange = "전체";
      uiData.jeonseRangeValue = [0, 30];
    }
    else if (type == "monthlyRange") {
      data.monthlyRange = "전체";
      uiData.monthlyRangeValue = [0, 18];
    }
    MapFilterRedux.updateFilterUI({ filterUI: uiData });
    MapFilterRedux.updateFilterArr({ filterArr: data });
  }

  // 클릭 시 스크롤 이동
  const scrollToClick = (id) => {
    if (preventBubbling) { return; }
    const value = document.querySelector(`#${id}`);
    const optionList = document.querySelector(".optionList");
    setOpenDetail(true);
    optionList.classList.remove("hidden");
    setTimeout(() => {
      if (value) {
        filterWrap.scrollTop = value.getBoundingClientRect().y - 100;
      }
    }, 100)
  }

  return (
    <>
      <Wrapper id="filterWrap">
        <MUCard>
          {/* <SliderFixed>
          <SlideFixedWrap> */}
          {/* 슬라이더 태그  */}
          <SliderWrap open={open}>
            {/* <Slider {...settings} className="filter_slick"> */}
            {/* 필터 가장 윗 부분의 칩 */}
            <MUTabs
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="scrollable force tabs example"
              TabIndicatorProps={{
                style: {
                  display: "none",
                },
              }}
            >
              {/* 거래 유형 */}
              <SlickSlide className="slide__one">
                <Link>
                  <MUChip label={typeText()} />
                </Link>
              </SlickSlide>

              {/* 공통 */}
              {filterRange(uiData.prd_sel_type[0] == 0, uiData.priceRangeValue[0] == 0 && uiData.priceRangeValue[1] == 100, mapFilterRedux.filterArr.priceRange, "priceWrap", "priceRange")}
              {filterRange(uiData.prd_sel_type[1] == 0 && uiData.prd_sel_type[2] == 0, uiData.jeonseRangeValue[0] == 0 && uiData.jeonseRangeValue[1] == 30, mapFilterRedux.filterArr.jeonseRange, "jeonseWrap", "jeonseRange")}
              {filterRange(uiData.prd_sel_type[2] == 0, uiData.monthlyRangeValue[0] == 0 && uiData.monthlyRangeValue[1] == 18, mapFilterRedux.filterArr.monthlyRange, "monthlyWrap", "monthlyRange")}
              {filterRange(uiData.manaRangeValue[0] == 0 && uiData.manaRangeValue[1] == 75, false, mapFilterRedux.filterArr.manaRange, "manaWrap", "manaRange")}
              {filterRange(uiData.areaRangeValue[0] == 0 && uiData.areaRangeValue[1] == 100, false, mapFilterRedux.filterArr.areaRange, "areaWrap", "areaRange")}

              {filterText(Number(uiData.floor), mapFilterRedux.filterArr.floor, "floor", "floorWrap")}
              {filterText(uiData.manaStatus, "관리비없음", "manaBtn", "manaWrap")}


              {/* 아파트 */}
              {filterText(Number(uiData.roomApart), '방수 ' + mapFilterRedux.filterArr.roomApart, "roomApart", "roomApartWrap")} {/*아파트방수*/}
              {filterText(uiData.bath, '욕실수 ' + mapFilterRedux.filterArr.bath, "bath", "toiletWrap")}{/*아파트 욕실수*/}

              {/* 오피스텔 */}
              {filterText(uiData.purpose, mapFilterRedux.filterArr.purpose, "purpose", "purposeWrap")}{/*오피스텔 사용목적*/}
              {roomText()} {/*오피스텔한정 방구조 :전체,오픈형우런룸,분리형원룸,원룸원거실,투룸,쓰리룽이상*/}
              {filterText(uiData.double, '복층여부 ' + mapFilterRedux.filterArr.double, "double", "doubleWrap")}{/*복층여부*/}
              {filterText(uiData.parkOfficetel, "주차가능", "parkBtn", "parkWrap")}{/*오피스텔주차가능*/}
              {filterText(uiData.pet, mapFilterRedux.filterArr.pet, "pet", "petWrap")}{/*오피스텔 반려동물가능여부*/}


              {/* 상가/사무실 */}
              {filterText(uiData.parkStore, "주차가능", "parkBtnStore", "parkStoreWrap")}
              {filterText(uiData.toilet, "전용화장실", "toiletBtn", "toiletWrap")}

              {/* 공통 */}
              {/* {optionText()} */}
              {filterText(uiData.use, mapFilterRedux.filterArr.use, "use", "useWrap")}

              {/* 아파트*/}
              {filterText(Number(uiData.danji), mapFilterRedux.filterArr.danji, "danji", "danjiWrap")}

            </MUTabs>
            {/* </Slider> */}
          </SliderWrap>

          {/* {
              open ?
                <FilterCloseAndReset setOpen={setOpen} />
                :
                <FilterDownArrow ref={downArrowRef} className="downArrow" onClick={() => { setOpen(true) }}>
                  <ImgDiv>
                    <DownImg src={FilterDown} />
                  </ImgDiv>
                </FilterDownArrow>
            } */}

          {/* </SlideFixedWrap>
        </SliderFixed> */}

          {/* 초기화 버튼 및 필터 open & close 버튼 부분 */}
          <MUCardActions disableSpacing>
            <FilterCloseAndReset/>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              className={["changeBtn"]} id="filter_expandbtn"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </MUCardActions>

          {/*필터의 열린 부분  */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <MUCardContent>
              {/* <FilterList ref={filterListRef} className={["filterList", "hidden"]}> */}
              <FilterList>
                <FilterTopButton />
                {/*<ApartFilter/>*/}
                {/* <OfficetelFilter/> */}
                <StoreAndOfficeFilter status={status} open={openDetail} setOpen={setOpenDetail} />
              </FilterList>
            </MUCardContent>
          </Collapse>
        </MUCard>
      </Wrapper>
    </>
  );
}

const MUCard = styled(Card)`
 &.MuiPaper-root.MuiCard-root {
  ${TtCon_MainMapFilter}
  z-index: 99;
 }
`
const MUCardActions = styled(CardActions)`
&.MuiCardActions-root {
  padding:1px 8px;
}
`
const MUCardContent = styled(CardContent)`
&.MuiCardContent-root{
  ${TtCon_MainMapFilter_ArticlePos}
  overflow-y:auto;
  overflow-x:hidden;
  padding: 0.375rem;
}
`

const MUTabs = styled(Tabs)`
&.MuiTabs-root{
  ${TtCon_MainMapFilter_TapPos}
}

& .MuiButtonBase-root.MuiTabScrollButton-root{
  width:1.125rem;
}

& .MuiTabs-flexContainer{
  position : absolute;
left: 0; top: 50%;
transform: translateY(-50%);
}
`
const MUChip = styled(Chip)`
&.MuiChip-root {
 height:2rem;
}
`
//-----------------------------------------------------

const Wrapper = styled.div`
  /* position:absolute;
  left:0.5rem;top:0.5rem; */
`
// const None = styled.div`
//   display:none;
// `
const FilterList = styled.div`
${TtCon_Frame_Portrait_A}
`
// const WrapFilter = styled.div``
// const WrapFilter = styled.div`
//   & > .hidden {
//     display:none;
//   }
//   position:absolute;
//   width: 360px;
//   height: auto;
//   max-height:85vh;
//   padding:0 20px 0;
//   border-radius: 17px;
//   box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
//   background-color: #ffffff;
//   left:22px;top:26px;
//   overflow-y:scroll;
//   overflow-x:hidden;
//   scrollbar-width: none;
//   -ms-overflow-style: none;
//   &::-webkit-scrollbar {display: none;}
//   @media ${(props) => props.theme.mobile} {
//     position:absolute;
//     top:0;
//     width:100%;
//     /* padding:${({ padding }) => padding}; */
//     padding:unset;
//     z-index:1;
//     left:0;
//     height:auto;
//     max-height:100%;
//     border-radius:0;
//     box-shadow:none;
//     overflow-y:scroll;
//   } 
// `

// const SliderFixed = styled.div`
//   position: relative;
//   height: 72px;
//   background-color: red;
//   @media ${(props) => props.theme.mobile} {
//     height:calc(100vw*(87/428));
//   }
// `
// const SlideFixedWrap = styled.div`
//   position:fixed;
//   z-index: 100;
//   //background-color: #fff;
//   ${({ open }) => {
//       return open ? `
//       height:98px;
//     `
//         :
//         `
//     height:70px;
//     `
//   }} 
// @media ${(props) => props.theme.mobile} {
//   position:"relative";
//   width: 100%;
//   height:calc(100vw*(64/428));
// }
//`

const SliderWrap = styled.div`
left:42px;
//position:fixed;
//width:320px;
//height:65px;
//margin-top:-50px;
//padding: 0.2rem;
background:#fff;
z-index:101;
border-bottom:1px solid ${(props) => props.theme.palette.line.main};

/* @media ${(props) => props.theme.breakpoints.sm} {
  margin-top:0;
  width:100%;
  margin: unset;
  padding: unset;
  padding:calc(100vw*(12/428)) 0 0 0;
  height:calc(100vw*(64/428));
  top:calc(100vw*(64/428));
  left:0;
  transition: 500ms;
  box-sizing: border-box;
} */
`

const SlickSlide = styled.div`
`

const FliterEa = styled.p`
  /* position:relative;
  padding: 6px 20px;
  border-radius: 1rem;
  border: solid 1px #e4e4e4;
  background-color: #f8f7f7;
  text-align: center;
  text-overflow: ellipsis;
    margin-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    font-size:0.875rem;
    width:auto; !important;
    padding:0.3rem; */

`
const CloseFilter = styled.div`
  display:inline-block;
  position:absolute;right:7px;top:50%;transform:translateY(-50%);
  width:8px;height:8px;
  background:url(${FilterClose}) no-repeat;background-size:100% 100%;
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(8/428));
    height:calc(100vw*(8/428));
    right:calc(100vw*(7/428));
  }
`
// const FilterDownArrow = styled.div`
//   width:100%;
//   @media ${(props) => props.theme.mobile} {
//     position:relative;
//     z-index:102;
//   }
// `
// const ImgDiv = styled.div`
//   width:100%;
//   text-align:center;
// `
// const DownImg = styled.img`
//   display:inline-block;
//   width:16px;
//   @media ${(props) => props.theme.mobile} {    
//     width:calc(100vw*(16/428));
//  }
// `
