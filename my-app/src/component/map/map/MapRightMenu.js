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

//material-ui
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { styled as MUstyled } from '@mui/material/styles';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// components
import { Portrait, Landscape } from "../../../MediaQuery";
import { TtCon_MainMapToolBox_pos } from '../../../theme';

// redux
import { MapRight } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

export default function MainHeader({ containerRef }) {
  console.log('mapRightMenu실행>>>');
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
    console.log('mapRightmnenu 로드시점>>>');
    MapRight.updateExclusive({ isExclusive: { is: true } });
    //MapRight.updateProbroker({ isProbroker: { is: true } });
    //MapRight.updateBlock({ isBlock: { is: false } });
  }, [])

  // Exclusive Click

  const onClickExclusive = async () => {
    //setSelected_exclusive(!selected_exclusive);
    
    // const isExc = excRef.current.checked;   //전속매물 체크 여부 t/f
    var isExc = excRef.current.value;   //전속매물 체크 여부 t/f 
    const isPro = proText.current.classList.contains("select");  //전문중개사 체크 여부 t/f
    const isBlo = blockText.current.classList.contains("select");  //단지별 실거래 체크 여부 t/f
    
    // console.log(excRef.current.value);
    
    console.log("전속매물 체크 여부 : "+isExc);
    console.log('전문중개사 체크 여부 : '+isPro);
    console.log('단지별 실거래 체크 여부 : '+isBlo);
    
    console.log("체크 갯수 확인  : " + isAllFalse());

    console.log(isExc && !isPro && !isBlo);
    //전속매물만 선택한 경우
    if (isExc && !isPro && !isBlo) {
      console.log("전속매물만 선택된상태였던경우");

      // excRef.current.checked = false;
      excRef.current.value = true;//끄지않는다.
      MapRight.updateExclusive({ isExclusive: { is: true } });
      return;
    }else{
      //전속매물외에 중개사or단지별실거래 체크되어있던경우..
      console.log('전속매물체크상태여부 뭐지:',isExc);
      if (isExc==false) {
        console.log("전속미체크 상태 전속매물체크");
        
        // blockText.current.classList.remove("select");
        // MapRight.updateBlock({  isBlock: {is:false} });
        excRef.current.value = true;
        excRef.current.selected= true;
        MapRight.updateExclusive({ isExclusive: { is: true } });
        //setExclusive(true);
        //setIsFilter(true);
      } else {
        console.log("전속체크상태 전속매물 비체크(비활성화)");

        excRef.current.value=false;
        excRef.current.selected=false;
        MapRight.updateExclusive({ isExclusive: { is: false } });
        //setExclusive(false);
        //setIsFilter(false);
      }
    }
    
    
    /*if (containerRef) {
      console.log(containerRef.current.scrollTop);
      containerRef.current.scrollTop = 0;
      console.log("containerRef존재");
    }*/
    
    // console.log("!excRef.current.value : " + !excRef.current.value);
    //console.log("!isExc : " + !isExc);
   // console.log("Exclusive : " + Exclusive);
    // if (!excRef.current.checked) {
      // if (!excRef.current.value) {
    
  };

  // 모두 꺼졌는지 체크
  const isAllFalse = () => {
    // const isExc = excRef.current.checked;
    const isExc = excRef.current.value;
    const isPro = proText.current.classList.contains("select");
    const isBlo = blockText.current.classList.contains("select");

    let count = 0;
    if (isExc) { count++ };
    if (isPro) { count++ };
    if (isBlo) { count++ };
    return (count);
  }

  // Build Click

  const onClickBuildType = async (e) => {
    console.log('onClickBuildTypesss:',e.target.id,e.target.classList,e.target.classList.contains("select"));
   // console.log('mapTool_1:',mapTool_1);
    console.log(e.target.id !== mapTool_1 ? false : true);
    
      /*if (!Exclusive) {
        console.log('전속매물 꺼진 상태라고한다면..',Exclusive);
       
          return;     
      } */
    
    //전속 매물이 꺼저 있을떄
      console.log('동작하기');
    
    distanceEndRef.current.classList.add("hidden");

    if (e.target.id == "probrokerBuild") {

      if(e.target.classList.contains('select')){
        //포함되어있던경우 해제처리한다.
        initSelectBuild();
        console.log('===>>e.target.classList.contasin(select)',e.target.classList.contains("select"),'전문중개사버튼 선택->해제');
        proText.current.classList.remove("select");
        blockText.current.classList.remove("select");
        e.target.classList.remove('select');

        MapRight.updateProbroker({ isProbroker: { is: false } });
      }else{
        initSelectBuild();
        console.log(e.target.classList.contains("select"),'전문중개사버튼 해제->선택');
        proText.current.classList.remove("select");
        blockText.current.classList.remove("select");
        e.target.classList.add("select");
        MapRight.updateProbroker({ isProbroker: { is: true } });
      }
     
    } else if (e.target.id == "blockBuild") {
      // setIsFilter(false);
      // MapRight.updateExclusive({  isExclusive: {is:false} });
      if(e.target.classList.contains('select')){
        console.log('blockbuild 단지별실거래버튼 누른경우: 선택->해제',e.target.id,e.target.classList.contains('select'))
        initSelectBuild();
        proText.current.classList.remove("select");
        blockText.current.classList.remove("select");
        e.target.classList.remove('select');

        MapRight.updateBlock({ isBlock: { is: false } });
      }else{
        initSelectBuild();
        console.log('blockbuild단지별실거래 버튼 누른경우 : 해제->선택:',e.target.id,e.target.classList.contains('select'));
        proText.current.classList.remove("select");
        blockText.current.classList.remove("select");
        e.target.classList.add('select');

        MapRight.updateBlock({ isBlock: { is: true } });
      }
     
      // excRef.current.checked = false;
    }
    // aroundAlRef.current.classList.add("hidden");
    //mapAlRef.current.classList.add("hidden");
    //setIsMapStyle(false);

   
    // aroundText.current.classList.remove("select");
    //MapRight.updateProbroker({ isProbroker: { is: false } });
    //MapRight.updateBlock({ isBlock: { is: false } });
    // MapRight.updateAround({ around: { is:"" } });
   // MapRight.updateDistance({ isDistance: { is: false } });
    
  }

  // Build Init
  const initSelectBuild = () => {
    /*if (containerRef) {
      containerRef.current.scrollTop = 0;
    }*/
    // aroundAlRef.current.classList.add("hidden");
    // console.log(mapAlRef.current.classList);
    // console.log(proText.current.classList);
    // console.log(blockText.current.classList);
    // mapAlRef.current.classList.add("hidden");
    //setIsMapStyle(false);

    proText.current.classList.remove("select");
    blockText.current.classList.remove("select");
    // aroundText.current.classList.remove("select");

    // distanceEndRef.current.classList.add("hidden");
    MapRight.updateProbroker({ isProbroker: { is: false } });
    MapRight.updateBlock({ isBlock: { is: false } });
    // MapRight.updateAround({ around: { is:"" } });
    MapRight.updateDistance({ isDistance: { is: false } });
  }

  // // 주변 버튼 클릭
  // const onClickAround = (e) => {
  //   if (e.target.classList.contains("select")) {
  //     e.target.classList.remove("select");
  //     aroundAlRef.current.classList.add("hidden");
  //     MapRight.updateAround({ around: { is: "" } });
  //   } else {
  //     e.target.classList.add("select");
  //     aroundAlRef.current.classList.remove("hidden");
  //   }
  // }

  // Around  Item Click
  const onClickAroundEls = (e) => {
    console.log(e.target.innerText);
    switch (e.target.innerText) {
      case "지하철":
        MapRight.updateAround({ around: { is: "SW8" } });
        setAround(null);
        break;
      case "유치원":
        MapRight.updateAround({ around: { is: "PS3" } });
        setAround(null);
        break;
      case "학교":
        MapRight.updateAround({ around: { is: "SC4" } });
         setAround(null);
        break;
      case "은행":
        MapRight.updateAround({ around: { is: "BK9" } });
         setAround(null);
        break;
      case "관공서":
        MapRight.updateAround({ around: { is: "PO3" } });
         setAround(null);
        break;
      default:
        MapRight.updateAround({ around: { is: "" } });
         setAround(null);
        break;
    }
    // aroundAlRef.current.classList.add("hidden");
  }

  //  Map Styles Click
  const onClickMap = () => {
    let isBool = !isMapStyle;
    //setIsMapStyle(isBool);
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
    
    let rel_target;//관련 타깃.
    switch (e.target.innerText) {
      case "일반":
        MapRight.updateMapStyle({ mapStyle: "roadmap" });
        console.log("관련대상개체:",document.getElementById('normal'));
        rel_target = document.getElementById('normal');
        //rel_target.dispatchEvent(new Event('click',{bubbles:true}));
        rel_target.click();//클릭이벤트 강제
        //setAnchorEl_mapType(null);
        break;
      case "지적":
        MapRight.updateMapStyle({ mapStyle: "district" });
        console.log("관련대상개체:",document.getElementById('district'));
        rel_target = document.getElementById('district');
        //rel_target.dispatchEvent(new Event('click',{bubbles:true}));
        rel_target.click();//클릭이벤트 강제
        //setAnchorEl_mapType(null);
        break;
      case "위성":
        MapRight.updateMapStyle({ mapStyle: "hybrid" });
        console.log("관련대상개체:",document.getElementById('hybrid'));
        rel_target = document.getElementById('hybrid');
        //rel_target.dispatchEvent(new Event('click',{bubbles:true}));
        rel_target.click();//클릭이벤트 강제
        //setAnchorEl_mapType(null);
        break;
      case "거리뷰":
        MapRight.updateMapStyle({ mapStyle: "roadView" });
        //setAnchorEl_mapType(null);
        break;
      default:
        MapRight.updateMapStyle({ mapStyle: "roadmap" });
        //setAnchorEl_mapType(null);
        break;
     }
    // mapAlRef.current.classList.add("hidden");
    //setIsMapStyle(false);
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
  const onclickCurrent = (event) => {
    console.log('onclickCurrnetsss:',currentRef);
    if (mapRightRedux.isCurrnet.is) {
      MapRight.updateCurrent({ isCurrnet: { is: !mapRightRedux.isCurrnet.is } });
      //currentRef.current.classList.remove("select");
      event.target.setAttribute('selected',false);
      return;
    }

    if (window.confirm("내 위치 조회 허용?")) {
      //currentRef.current.classList.add("select");
      event.target.setAttribute("selected",true);
      MapRight.updateCurrent({ isCurrnet: { is: !mapRightRedux.isCurrnet.is } });
    } else {
      event.preventDefault();
      //currentRef.current.classList.remove("select");
      event.target.setAttribute("selected",false);
      return;
    }
  }

  const onClickDistance = () => {
    let isBool = false;
   // setIsMapStyle(isBool);
  
    console.log('거리재기상황실행>>:',distanceEndRef,distanceRef,currentRef);

    if(distanceEndRef.current){
      distanceEndRef.current.classList.toggle("hidden");
      if (!distanceEndRef.current.classList.contains("hidden")) {
        distanceRef.current.classList.add("select");
      } else {
        distanceRef.current.classList.remove("select");
      }
    }
   
    //mapAlRef.current.classList.add("hidden");
    //aroundAlRef.current.classList.add("hidden");
    MapRight.updateAround({ around: { is: "" } });
    MapRight.updateDistance({ isDistance: { is: !mapRightRedux.isDistance.is } });
  }



  //@@ 전속매물 버튼--------------------------------------------------
  const [selected_exclusive, setSelected_exclusive] = useState(true);

  //@@ -------------------------------------------------
  const [mapTool_1, setMapTool_1] = useState("");
  const [mapTool_2, setMapTool_2] = useState(() => ['']);
  const [mapTool_0, setMapTool_0] = useState("Exclusive");

  const handleMapTool_0 = async (event, newMapTool_0) => {
    console.log('handleMaptool0??실행::',newMapTool_0);
    await setMapTool_0(newMapTool_0);
  };
  const handleMapTool_1 = async (event, newMapTool_1) => {

    if (Exclusive == true){
      await setMapTool_1(newMapTool_1);
    }else{
      if (newMapTool_1 !== null){
        await setMapTool_1(newMapTool_1);
      }
    }
  };

  
  const handleMapTool_2 = (event, newMapTool_2) => {
    console.log('handleMaptool2??실행::',newMapTool_2);
    setMapTool_2(newMapTool_2);
  };

  //@@지도유형--------------------------------------------
  const [anchorEl_mapType, setAnchorEl_mapType] = React.useState(null);
  const open_mapType = Boolean(anchorEl_mapType);

  const handleClick_mapType = (event) => {
    console.log('지도유형클릭??이거 왜 존재하는건가?:',event.currentTarget);
    setAnchorEl_mapType(event.currentTarget);
  };

  const handleClose_mapType = () => {
    setAnchorEl_mapType(null);
  };

  //주변 fuction
  const [Around, setAround] = useState(null);
  const open = Boolean(Around);

  const handleClick = (event) => {
    setAround(event.currentTarget);
  };

  const handleClose = () => {
    setAround(null);
  };

  const [Distance, setDistance] = useState(null);
  const distanceopen = Boolean(Distance);
  const distanceClick = (event) => {
    console.log('distanceClickss:',event.currentTarget);
    setDistance(event.currentTarget);

    onClickDistance();
  };
  const distanceClose = () => {
    //setDistance(null);
  };

  const [Exclusive, setExclusive] = useState(true)
  
  useEffect(()=>{
    console.log('Exclusive상태변화::',Exclusive);
  },[Exclusive]);
  return (
    <>
      {/*세로형 화면에서만*/}
      <Portrait>
        <PortraitLeft isFilter={isFilter}>
          <div className="par-spacing-after">
            <Paper
              elevation={1}
              sx={{
                display: 'inline-flex',
              }}
            >
              <MUButton_Bunyang variant="contained">
                <Link to="/MbBunyang" className="data_link" />
                분양
              </MUButton_Bunyang>
            </Paper>
          </div>


          <div className="par-spacing-after">
            <Paper
              elevation={1}
              sx={{
                display: 'inline-flex',
              }}
            >
              <MUButtonGroup
                orientation="vertical"
                aria-label="확대/축소 버튼"
              >
                <MUButton_Zoom key="plus" onClick={() => { onClikZoomIn() }}><span style={{ fontSize: "1.75rem", lineHeight: 1, fontWeight: 300, }}>+</span></MUButton_Zoom>
                <MUButton_Zoom key="minus" onClick={() => { onClikZoomOut() }}><span style={{ fontSize: "3.2rem", lineHeight: 0.5469, fontWeight: 300, }}>-</span></MUButton_Zoom>
              </MUButtonGroup>
            </Paper>
          </div>
        </PortraitLeft>
      </Portrait>



      {/*기본 */}
      <RightMenu isFilter={isFilter} className="noneScrollbar">
            
         <div className="par-spacing-after">
         <Paper
            elevation={1}
            sx={{
              display: 'inline-flex'
            }}
          >

            <MUToggleButton_1
              ref={excRef}
              value={true}
              selected={true}
              
            >
              <ToggleBtnTxt value="전속매물">전속<br />매물</ToggleBtnTxt>
            </MUToggleButton_1>

          </Paper>
         
        </div>

        <div className="par-spacing-after">
          <Paper
            elevation={1}
            sx={{
              display: 'inline-flex',
              // border: (theme) => `1px solid ${theme.palette.divider}`,
              flexDirection: 'column',
            }}
           >

            {/* <Divider flexItem orientation="horizontal" sx={{ mx: 0.5 }} /> */}
            <StyledToggleButtonGroup
              size="small"
              value={mapTool_1}
              onChange={handleMapTool_1}
              orientation="vertical"
              exclusive
            >
              <MUToggleButton_2 value="probrokerBuild" >
                <ToggleBtnTxt id="probrokerBuild" ref={proText} className={["changeBtn"]} onClick={(e) => { onClickBuildType(e) }}>전문<br/>중개사</ToggleBtnTxt>
              </MUToggleButton_2>

              <MUToggleButton_2 value="blockBuild">
                <ToggleBtnTxt id="blockBuild" ref={blockText} className={["changeBtn"]} Texttype="단지별실거래" onClick={(e) => { onClickBuildType(e) }}>단지별<br/>실거래</ToggleBtnTxt>
              </MUToggleButton_2>

            </StyledToggleButtonGroup>


            {/* <MUToggleButton_3b
              value="주변"
              selected={selected_around}
              onChange={() => {
                setSelected_around(!selected_around);
                handleClick()
              }}
              aria-label="주변"
              id="basic-button"
              aria-controls="basic-menu"
              aria-haspopup="true"
              aria-expanded={open_subAround ? 'true' : undefined}
            >
              <ToggleBtnTxt>주변</ToggleBtnTxt>
            </MUToggleButton_3b> */}

            <MUToggleButton_3b id="aroundBuild" value="주변" onClick={handleClick}>
              <ToggleBtnTxt>주변</ToggleBtnTxt>
            </MUToggleButton_3b>

            <Menu
              id="basic-menu"
              anchorEl={Around}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={onClickAroundEls}>지하철</MenuItem>
              <MenuItem onClick={onClickAroundEls}>유치원</MenuItem>
              <MenuItem onClick={onClickAroundEls}>학교</MenuItem>
              <MenuItem onClick={onClickAroundEls}>은행</MenuItem>
              <MenuItem onClick={onClickAroundEls}>관공서</MenuItem>
            </Menu>
          </Paper>
         
        </div>


        {/* //------------------------------------------------------------------ */}
        <div className="par-spacing-after">
          <Paper
            elevation={1}
            sx={{
              display: 'inline-flex',
              flexDirection: 'column',
            }}
          >
            <StyledToggleButtonGroup
              size="small"
              value={mapTool_2}
              onChange={handleMapTool_2}
              orientation="vertical"
            >
              <MUToggleButton_2 selected value="지도유형" aria-label="지도유형"
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open_mapType ? 'true' : undefined}
                onClick={handleClick_mapType}
              >
                <ToggleBtnTxt>지도<br />유형</ToggleBtnTxt>
              </MUToggleButton_2>

              <Menu              
                id="basic-menu"
                anchorEl={anchorEl_mapType}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open_mapType}
                onClose={handleClose_mapType}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem  onClick={(e) => { onClickMapEls(e) }}>일반</MenuItem>
                <MenuItem  onClick={(e) => { onClickMapEls(e) }}>지적</MenuItem>
                <MenuItem  onClick={(e) => { onClickMapEls(e) }}>위성</MenuItem>
                <MenuItem onClick={(e) => { onClickMapEls(e) }}>거리뷰</MenuItem>
              </Menu>
              <VirutualMaptype className={["noRv hidden"]} id={"normal"}>일반</VirutualMaptype>
              <VirutualMaptype className={["noRv hidden"]} id={"district"}>지적</VirutualMaptype>
              <VirutualMaptype className={["noRv hidden"]} id={"hybrid"}>위성</VirutualMaptype>

              <MUToggleButton_2 onClick={distanceClick} className="distance" ref={distanceRef} value="거리재기" >
                <ToggleBtnTxt>거리<br />재기</ToggleBtnTxt>
              </MUToggleButton_2>
              <MUToggleButton_2 ref={distanceEndRef} className={["distanceEnd","hidden"]}>
                 <ToggleBtnTxt>거리측정</ToggleBtnTxt>
              </MUToggleButton_2>

              {/*<Menu
                id="basic-menu"
                anchorEl={Distance}
                open={distanceopen}
                onClose={distanceClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem ref={distanceEndRef} className={["distanceEnd","hidden"]}>거리측정</MenuItem>
              </Menu>*/}

              <MUToggleButton_2 selected={mapRightRedux.isCurrnet.is} onClick={(event) => onclickCurrent(event)} value="내위치" aria-label="내위치">
                <ToggleBtnTxt ref={currentRef}>내 위치</ToggleBtnTxt>
              </MUToggleButton_2>

            </StyledToggleButtonGroup>
          </Paper>
        </div>

        {/*가로형 화면에서만*/}
        <Landscape>
            <MUButtonGroup
              orientation="vertical"
              aria-label="확대/축소 버튼"
            >
              <MUButton_Zoom key="plus" onClick={() => { onClikZoomIn() }}><span style={{ fontSize: "1.75rem", lineHeight: 1, fontWeight: 300, }}>+</span></MUButton_Zoom>
              <MUButton_Zoom key="minus" onClick={() => { onClikZoomOut() }}><span style={{ fontSize: "3.2rem", lineHeight: 0.5469, fontWeight: 300, }}>-</span></MUButton_Zoom>
            </MUButtonGroup>
        </Landscape>
      </RightMenu>
    </>
  );
}

const StyledToggleButtonGroup = MUstyled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: "0.25rem",
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const MUToggleButton = styled(ToggleButton)`
  &.MuiButtonBase-root.MuiToggleButton-root {
    padding: 0.125rem;
  }
`
const MUButton = styled(Button)``

const MUToggleButton_1 = styled(MUToggleButton)`
  width:3.125rem;
  height:3.125rem;

  &.MuiButtonBase-root.MuiToggleButton-root {
    border:none;
    background-color:#fff;
  }
  &.MuiButtonBase-root.MuiToggleButton-root.Mui-selected {
    color:#fff;
    background-color:${(props) => props.theme.palette.primary.main};
  }
  
`
const MUToggleButton_2 = styled(MUToggleButton)`
  width:2.625rem;
  height:2.625rem;

  &.MuiButtonBase-root.MuiToggleButton-root.Mui-selected {
    /* background-color:#fff; */
    color:${(props) => props.theme.palette.secondary.main};
  }
`

// const MUToggleButton_2 = styled(MUToggleButton)`
//   width:2.625rem;
//   height:2.625rem;
//   &.MuiButtonBase-root.MuiToggleButton-root.Mui-selected {
//     color:${(props) => props.theme.palette.secondary.main};
//   }
// `
const MUToggleButton_3 = styled(MUToggleButton_2)`
  &.MuiButtonBase-root.MuiToggleButton-root{
    margin:0.25rem;
    border:none;
  }
`
const MUToggleButton_3b = styled(MUToggleButton_3)`
  &.MuiButtonBase-root.MuiToggleButton-root{
    margin-top:-1px;
  }
`

const ToggleBtnTxt = styled.span`
  /* position:relative;
  display:inline-block;
  width:100%;
  text-align:center; */
  /* word-break:keep-all; */
  font-size:0.75rem;
  line-height:1.2;
  //font-weight:600;
  /* transition:all 0.2s; */
  /* cursor:pointer; */
`
const MUButtonGroup = styled(ButtonGroup)`
  &.MuiButtonGroup-root { background-color: #fff }
`
const MUButton_Bunyang = styled(MUButton)`
  width: 3.125rem;
  height: 3.125rem;
  &.MuiButtonBase-root.MuiButton-root {
    padding:0.125rem;
    min-width:0;
  }
`
const MUButton_Zoom = styled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root {
    padding: 0.25rem 0.7rem;
    min-width:0;
  }
`

//---------------------------------------------------------

const Container = styled.div``
const VirutualMaptype=styled.div`
   display:none;
`;
const RightMenu = styled.div`
  ${TtCon_MainMapToolBox_pos}
  text-align: right;
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
const Bunyang = styled.div`
  margin-top:calc(100vw*(7/428));
`

const MinusBtn = styled.img`
  padding:10px;
  cursor: pointer;
  /* @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(5/428));
    width:calc(100vw*(25/428));
  } */
`
const PlusBtn = styled.img`
  padding:10px;
  cursor: pointer;
  /* @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(5/428));
    width:calc(100vw*(25/428));
  } */
  `