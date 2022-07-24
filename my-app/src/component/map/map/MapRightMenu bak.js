//react
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import NavIcon from '../../../img/main/nav_btn.png';
import Logo from '../../../img/main/header_logo.png';
import LandscapeLogo from '../../../img/main/pc_header_logo.png';
import Mypage from '../../../img/main/mypage_icon.png';
import plus from '../../../img/map/plus.png';
import minus from '../../../img/map/minus.png';

// components
import { Portrait, Landscape } from "../../../MediaQuery";
import { TtCon_MainMapToolBox_pos } from '../../../theme';

// redux
import { MapRight } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

export default function MainHeader({ containerRef }) {

  const [isFilter, setIsFilter] = useState(true);
  const [isMapStyle, setIsMapStyle] = useState(false);
  const mapRightRedux = useSelector(state => { return state.mapRight });
  const excRef = useRef();
  const proText = useRef();
  const blockText = useRef();
  const aroundText = useRef();
  const aroundAlRef = useRef();
  const mapAlRef = useRef();
  const distanceRef = useRef();
  const distanceEndRef = useRef();
  const currentRef = useRef();


  // Init Status
  useEffect(() => {
    MapRight.updateExclusive({ isExclusive: { is: true } });
    MapRight.updateProbroker({ isProbroker: { is: true } });
    MapRight.updateBlock({ isBlock: { is: false } });
  }, [])

  // Exclusive Click
  const onClickExclusive = () => {

    const isExc = excRef.current.checked;
    const isPro = proText.current.classList.contains("select");
    const isBlo = blockText.current.classList.contains("select");

    if (isExc && !isPro && !isBlo) {
      excRef.current.checked = false;
      MapRight.updateExclusive({ isExclusive: { is: true } });
      return;
    }

    if (containerRef) {
      containerRef.current.scrollTop = 0;
    }

    if (!excRef.current.checked) {
      setIsFilter(true);
      // blockText.current.classList.remove("select");
      // MapRight.updateBlock({  isBlock: {is:false} });
      MapRight.updateExclusive({ isExclusive: { is: true } });
    } else {
      setIsFilter(false);
      MapRight.updateExclusive({ isExclusive: { is: false } });
    }
  };

  // 모두 꺼졌는지 체크
  const isAllFalse = () => {
    const isExc = excRef.current.checked;
    const isPro = proText.current.classList.contains("select");
    const isBlo = blockText.current.classList.contains("select");


    let count = 0;
    if (isExc) { count++ };
    if (isPro) { count++ };
    if (isBlo) { count++ };
    return (count);
  }

  // Build Click
  const onClickBuildType = (e) => {
    // select가 포함되어 있을때
    if (e.target.classList.contains("select")) {
      //대상 요소가 켜져있던경우 꺼야한다.단지별실거래체크박스가 비체크땐 무시한다.
      if (!excRef.current.checked) {
        //끄는 연산시에 전속매물이 미체크된 상태였다면 아무것도 하지 않음
        if (isAllFalse() == 1) {
          console.log("모두 체크되어있지 않음..")
          return;
        }
      } else { // 켜져있었을떄(체크박스) 대상만을 꺼야한다.
       // initSelectBuild();//
        e.target.classList.remove("select");
        if (e.target.id == "probrokerBuild") {
          console.log('전문중개사메뉴 클릭한경우:');
          MapRight.updateProbroker({ isProbroker: { is: false } });
        }else if (e.target.id == "blockBuild") {
          // setIsFilter(false);
          // MapRight.updateExclusive({  isExclusive: {is:false} });
          console.log('단지별실거래메뉴 클릭한경우:');
          MapRight.updateBlock({ isBlock: { is: false } });
          // excRef.current.checked = false;
        }
        return;
      }
    }else{
      //대상이 꺼져있었던 경우 대상을 키고 다른 대상은 없앤다.
      initSelectBuild();
      e.target.classList.add("select");

      if (e.target.id == "probrokerBuild") {
        console.log('전문중개사메뉴 클릭한경우:');
        MapRight.updateProbroker({ isProbroker: { is: true } });
      }else if (e.target.id == "blockBuild") {
        // setIsFilter(false);
        // MapRight.updateExclusive({  isExclusive: {is:false} });
        console.log('단지별실거래메뉴 클릭한경우:');
        MapRight.updateBlock({ isBlock: { is: true } });
        // excRef.current.checked = false;
      }
    }
    
  }

  // Build Init
  const initSelectBuild = () => {
    if (containerRef) {
      containerRef.current.scrollTop = 0;
    }
    // aroundAlRef.current.classList.add("hidden");
    mapAlRef.current.classList.add("hidden");
    setIsMapStyle(false);

    proText.current.classList.remove("select");
    blockText.current.classList.remove("select");
    // aroundText.current.classList.remove("select");

    distanceEndRef.current.classList.add("hidden");
    MapRight.updateProbroker({ isProbroker: { is: false } });
    MapRight.updateBlock({ isBlock: { is: false } });
    // MapRight.updateAround({ around: { is:"" } });
    MapRight.updateDistance({ isDistance: { is: false } });
  }

  // 주변 버튼 클릭
  const onClickAround = (e) => {
    if (e.target.classList.contains("select")) {
      e.target.classList.remove("select");
      aroundAlRef.current.classList.add("hidden");
      MapRight.updateAround({ around: { is: "" } });
    } else {
      e.target.classList.add("select");
      aroundAlRef.current.classList.remove("hidden");
    }
  }

  // Around  Item Click
  const onClickAroundEls = (e) => {
    switch (e.target.innerText) {
      case "지하철":
        MapRight.updateAround({ around: { is: "SW8" } });
        break;
      case "유치원":
        MapRight.updateAround({ around: { is: "PS3" } });
        break;
      case "학교":
        MapRight.updateAround({ around: { is: "SC4" } });
        break;
      case "은행":
        MapRight.updateAround({ around: { is: "BK9" } });
        break;
      case "관공서":
        MapRight.updateAround({ around: { is: "PO3" } });
        break;
      default:
        MapRight.updateAround({ around: { is: "" } });
        break;
    }
    aroundAlRef.current.classList.add("hidden");
  }

  //  Map Styles Click
  const onClickMap = () => {
    let isBool = !isMapStyle;
    setIsMapStyle(isBool);
    distanceEndRef.current.classList.add("hidden");
    MapRight.updateDistance({ isDistance: { is: false } });
    aroundAlRef.current.classList.add("hidden");
    if (isBool) {
      mapAlRef.current.classList.remove("hidden");
    } else {
      mapAlRef.current.classList.add("hidden");
    }
  }

  // Map Styles Item Click
  const onClickMapEls = (e) => {
    switch (e.target.innerText) {
      case "일반":
        MapRight.updateMapStyle({ mapStyle: "roadmap" });
        break;
      case "지적":
        MapRight.updateMapStyle({ mapStyle: "district" });
        break;
      case "위성":
        MapRight.updateMapStyle({ mapStyle: "hybrid" });
        break;
      case "거리뷰":
        MapRight.updateMapStyle({ mapStyle: "roadView" });
        break;
      default:
        MapRight.updateMapStyle({ mapStyle: "roadmap" });
        break;
    }
    mapAlRef.current.classList.add("hidden");
    setIsMapStyle(false);
  }

  // Zoom In
  const onClikZoomIn = () => {
    let newCount = mapRightRedux.isZoomIn;
    newCount++;
    MapRight.updateZoomIn({ isZoomIn: newCount });
  }

  // Zoom Out
  const onClikZoomOut = () => {
    let newCount = mapRightRedux.isZoomOut;
    newCount++;
    MapRight.updateZoomOut({ isZoomOut: newCount });
  }

  // Current Location Click
  const onclickCurrent = () => {
    if (mapRightRedux.isCurrnet.is) {
      MapRight.updateCurrent({ isCurrnet: { is: !mapRightRedux.isCurrnet.is } });
      currentRef.current.classList.remove("select");
      return;
    }

    if (window.confirm("내 위치 조회 허용?")) {
      currentRef.current.classList.add("select");
      MapRight.updateCurrent({ isCurrnet: { is: !mapRightRedux.isCurrnet.is } });
    } else {
      return;
    }
  }

  const onClickDistance = () => {
    let isBool = false;
    setIsMapStyle(isBool);
    distanceEndRef.current.classList.toggle("hidden");

    if (!distanceEndRef.current.classList.contains("hidden")) {
      distanceRef.current.classList.add("select");
    } else {
      distanceRef.current.classList.remove("select");
    }

    mapAlRef.current.classList.add("hidden");
    aroundAlRef.current.classList.add("hidden");
    MapRight.updateAround({ around: { is: "" } });
    MapRight.updateDistance({ isDistance: { is: !mapRightRedux.isDistance.is } });
  }


  return (
    <Container>
      <Portrait>
        <PortraitLeft isFilter={isFilter}>
          <RadioBoxLeft>
            <RadioSpan ref={currentRef} onClick={() => onclickCurrent()}>내위치</RadioSpan>
          </RadioBoxLeft>

          <MapControl>
            <PlusBtn src={plus} alt="확대 버튼" onClick={() => { onClikZoomIn() }} />
            <Part />{/*분기 라인*/}
            <MinusBtn src={minus} alt="축소 버튼" onClick={() => { onClikZoomOut() }} />
          </MapControl>



        </PortraitLeft>
      </Portrait>

      {/*Right Tab*/}
      <RightMenu isFilter={isFilter} className="noneScrollbar">

        <WrapMenuTop>
          <Exclusive type="checkbox" name="" ref={excRef} id="Exclusive" defaultChecked />
          <ExclusiveLabel className="changeBtn" for="Exclusive" onClick={() => { onClickExclusive() }} >전속 매물</ExclusiveLabel>
        </WrapMenuTop>
        <WrapMenuBottom>
          <RadioBox>
            <RadioSpan id="probrokerBuild" ref={proText} className={["select", "changeBtn"]} onClick={(e) => { onClickBuildType(e) }} >전문 중개사</RadioSpan>
          </RadioBox>
          <Part />{/*분기 라인*/}
          <RadioBox>
            <RadioSpan id="blockBuild" ref={blockText} className={["changeBtn"]} onClick={(e) => { onClickBuildType(e) }}>단지별 실거래</RadioSpan>
          </RadioBox>

          <Part />{/*분기 라인*/}
          <RadioBox>
            <RadioSpan id="aroundBuild" ref={aroundText}
              // onClick={(e)=>{onClickBuildType(e)}}
              onClick={(e) => { onClickAround(e) }}
            >주변</RadioSpan>
          </RadioBox>

          <RadioAlert ref={aroundAlRef} className={["hidden"]} >
            <RadioBox>
              <RadioSpan className="aroundEl" onClick={(e) => { onClickAroundEls(e) }}>지하철</RadioSpan>
            </RadioBox>
            <Part />
            <RadioBox>
              <RadioSpan className="aroundEl" onClick={(e) => { onClickAroundEls(e) }}>유치원</RadioSpan>
            </RadioBox>
            <Part />
            <RadioBox>
              <RadioSpan className="aroundEl" onClick={(e) => { onClickAroundEls(e) }}>학교</RadioSpan>
            </RadioBox>
            <Part />
            <RadioBox>
              <RadioSpan className="aroundEl" onClick={(e) => { onClickAroundEls(e) }}>은행</RadioSpan>
            </RadioBox>
            <Part />
            <RadioBox>
              <RadioSpan className="aroundEl" onClick={(e) => { onClickAroundEls(e) }}>관공서</RadioSpan>
            </RadioBox>
          </RadioAlert>

        </WrapMenuBottom>

        <WrapMenuBottom2>
          <RadioBox>
            <RadioSpan onClick={() => { onClickMap() }} >지도 유형</RadioSpan>
          </RadioBox>
          <RadioAlertMap ref={mapAlRef} className={["hidden"]}>
            <RadioBox>
              <RadioSpan className="noRv" onClick={(e) => { onClickMapEls(e) }}>일반</RadioSpan>
            </RadioBox>
            <Part />{/*분기 라인*/}
            <RadioBox>
              <RadioSpan className="noRv" onClick={(e) => { onClickMapEls(e) }}>지적</RadioSpan>
            </RadioBox>
            <Part />{/*분기 라인*/}
            <RadioBox>
              <RadioSpan className="noRv" onClick={(e) => { onClickMapEls(e) }}>위성</RadioSpan>
            </RadioBox>
            <Part />{/*분기 라인*/}
            <RadioBox>
              <RadioSpan onClick={(e) => { onClickMapEls(e) }}>거리뷰</RadioSpan>
            </RadioBox>
          </RadioAlertMap>

          <Part />{/*분기 라인*/}
          <RadioBox>
            <RadioSpan className="distance" ref={distanceRef} onClick={() => { onClickDistance() }}>거리 재기</RadioSpan>
          </RadioBox>
          <CurrentEnd ref={distanceEndRef} className={["distanceEnd", "hidden"]} >
            거리<br />
            측정
          </CurrentEnd>

          <Landscape>
            <Part />{/*분기 라인*/}
            <RadioBox>
              <RadioSpan ref={currentRef} onClick={() => onclickCurrent()}>내위치</RadioSpan>
            </RadioBox>
          </Landscape>



        </WrapMenuBottom2>

        <Landscape>
          <MapControl>
            <PlusBtn src={plus} alt="확대 버튼" onClick={() => { onClikZoomIn() }} />
            <Part />{/*분기 라인*/}
            <MinusBtn src={minus} alt="축소 버튼" onClick={() => { onClikZoomOut() }} />
          </MapControl>
        </Landscape>

        {/*모바일에서 생기는 분양 탭 ... */}
        <Portrait>
          <Link to="/MbBunyang">
            <Bunyang><BunyangLabel for="Exclusive">분양</BunyangLabel></Bunyang>
          </Link>
        </Portrait>
      </RightMenu>
    </Container>
  );
}


const Container = styled.div`
`
const RightMenu = styled.div`
  ${TtCon_MainMapToolBox_pos}
  right:0.7rem;
  width:50px;
  @media ${(props) => props.theme.breakpoints.sm} {
    right:0.5rem;
  }
`

const WrapMenuTop = styled.div`
  width:100%;height:50px;
  margin-bottom:7px;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(50/428));
    height:calc(100vw*(45/428));
    margin-bottom:calc(100vw*(7/428));
  } */
`
const Exclusive = styled.input`
  display:none;
  &:checked+label{background:#01684b;color:#fff;}
`
const ExclusiveLabel = styled.label`
  display:inline-block;
  width:100%;height:100%;
  background:#fff;
  border-radius:10px;
  word-break:break-word;

  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  font-size:0.8125rem;
  padding:0.5rem;
  color:#707070;
  text-align:center;line-height: 1.31;
  transition:all 0.2s;
`
const WrapMenuBottom = styled.div`
  position:relative;
  width:100%;
  background:#fff;border-radius:10px;
  padding:22px 5px 10px 6px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  margin-bottom:20px;
  
  & > .hidden {
    opacity:0;
    pointer-events: none;
  }

  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(50/428));
    height:calc(100vw*(160/428));
    padding:calc(100vw*(22/428)) calc(100vw*(5/428)) calc(100vw*(10/428)) calc(100vw*(6/428));
    margin-bottom:calc(100vw*(10/428));
  } */
`
const WrapMenuBottom2 = styled.div`
  position:relative;
  width:100%;
  background:#fff;border-radius:10px;
  padding:22px 5px 10px 6px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  margin-bottom:20px;
  
  & > .hidden {
    opacity:0;
    pointer-events: none;
  }

  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(50/428));
    height:calc(100vw*(128/428));
    padding:calc(100vw*(22/428)) calc(100vw*(5/428)) calc(100vw*(10/428)) calc(100vw*(6/428));
    margin-bottom:calc(100vw*(10/428));
  } */
`



const MapControl = styled.div`
  width:100%;height:120px;
  background:#fff;border-radius:10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  margin-bottom:20px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(85/428));
    padding:calc(100vw*(6/428)) calc(100vw*(5/428)) calc(100vw*(10/428)) calc(100vw*(6/428));
    margin-bottom:calc(100vw*(10/428));
  } */
`

const RadioBox = styled.div`
  width:100%;
  & > .select {
    color:#fe7a01;
    position:relative;
  }

  & > .select::after {
    content:"";
    width:6px;
    height:6px;
    background:#fe7a01;
    position:absolute;
    right:0px;
    top:-10px;
    border-radius:50%;
  }
`

const RadioBoxLeft = styled.div`
  width:100%;
  background-color: #fff;
  height:calc(100vw*(51/428));
  border-radius: 10px;
  display: flex;
  align-items: center;
  margin-bottom: calc(100vw*(10/428));
  & > .select {
    color:#fe7a01;
    position:relative;
  }

  & > .select::after {
    content:"";
    width:6px;
    height:6px;
    background:#fe7a01;
    position:absolute;
    right:0px;
    top:-10px;
    border-radius:50%;
  }
`


const CurrentEnd = styled.div`
  position:absolute;
  top:70px;
  right:65px;
  width: 50px;
  height: 80px;
  background:#fff;
  border-radius:10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  font-size:0.8125rem;
  line-height: 1.31;
  //font-weight:600;
  display:flex;
  align-items: center;
  justify-content: center;
  cursor:pointer;
  transition:500ms;
  /* @media ${(props) => props.theme.mobile} {
    font-size: calc(100vw*(13/428));
    top:calc(100vw*(60/428));
    right:calc(100vw*(65/428));
    width:calc(100vw*(50/428));
    height:calc(100vw*(59/428));
    padding:calc(100vw*(6/428)) calc(100vw*(5/428)) calc(100vw*(10/428)) calc(100vw*(6/428));
  } */
`

const Radio = styled.input`
  display:none;
  &:checked+label{color:#fe7a01;}
  &:checked+label:before{position:absolute;right:0;top:-7px;width:6px;height:6px;background:#fe7a01;border-radius:100%;display:block;content:'';}
  @media ${(props) => props.theme.mobile} {
    &:checked+label:before{position:absolute;right:0;top:calc(100vw*(-7/428));width:calc(100vw*(6/428));height:calc(100vw*(6/428));}
  }
`
const PortraitLeft = styled.div`
 ${TtCon_MainMapToolBox_pos}
 left:0.7rem;
 @media ${(props) => props.theme.breakpoints.sm} {
    left:0.5rem;
  }
`

const RadioAlert = styled.div`
  position:absolute;
  width: 50px;
  height: 260px;
  background:#fff;
  border-radius:10px;
  right:65px;
  bottom:-195px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  padding:22px 5px 10px 6px;
  transition:200ms;
  @media ${(props) => props.theme.mobile} {
    /* height:200px; */
    /* bottom:calc(100vw*(-185/428));
    height:calc(100vw*(225/428));
    width:calc(100vw*(50/428));
    padding:calc(100vw*(22/428)) calc(100vw*(5/428)) calc(100vw*(10/428)) calc(100vw*(6/428));
    right:calc(100vw*(65/428)); */
  }
`

const RadioAlertMap = styled.div`
  position:absolute;
  width: 50px;
  height: 210px;
  background:#fff;
  border-radius:10px;
  right:65px;
  top:0;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  padding:22px 5px 10px 6px;
  transition:200ms;
  @media ${(props) => props.theme.mobile} {
    /* height:calc(100vw * (170/428));
    width:calc(100vw * (50/428));
    right:calc(100vw*(65/428));
    padding:calc(100vw*(22/428)) calc(100vw*(5/428)) calc(100vw*(10/428)) calc(100vw*(6/428)); */
  }
`

const RadioSpan = styled.span`
  position:relative;
  display:inline-block;
  width:100%;
  text-align:center;word-break:keep-all;
  font-size:0.8125rem;
  line-height: 1.31;
  transform:skew(-0.1deg);
  //font-weight:600;
  color:#707070;
  transition:all 0.2s;
  cursor:pointer;
  /* @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
  } */
`

const Part = styled.div`
  width:32px;margin:15px auto 15px;
  height:1px;background:#707070;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(32/428));
    margin:calc(100vw*(10/428)) auto;
  } */
`
const Bunyang = styled(WrapMenuTop)`
  margin-top:Calc(100vw*(7/428));
`
const BunyangLabel = styled(ExclusiveLabel)`
  //line-height:calc(100vW*(35/428));
`

const PlusBtn = styled.img`
  padding:10px;
  cursor: pointer;
  /* @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(5/428));
    width:calc(100vw*(25/428));
  } */
  `

const MinusBtn = styled.img`
  padding:10px;
  cursor: pointer;
  /* @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(5/428));
    width:calc(100vw*(25/428));
  } */
`

