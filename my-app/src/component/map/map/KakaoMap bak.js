/* global kakao */

import React, { useEffect, useState, useRef } from "react";

//css
import styled from "styled-components"
import { Mobile, PC , Landscape, Portrait } from "../../../MediaQuery";

// Img
import markerImgelement from '../../../img/map/sideMapMarker.png';

import exclusiveMarker from "../../../img/map/exclusiveMarker.png";
import probrokerMarker from "../../../img/map/probrokerMarker.png";
import blockMarker from "../../../img/map/blockMarker.png";
import schoolMarker from "../../../img/map/schoolMarker.png";
import childMarker from "../../../img/map/childMarker.png";
import officeMarker from "../../../img/map/officeMarker.png";
import subwayMarker from "../../../img/map/subwayMarker.png";
import bankMarker from "../../../img/map/bankMarker.png";

import excClusterer from "../../../img/map/excClusterer.png";
import proClusterer from "../../../img/map/proClusterer.png";
import blockClustererImg from "../../../img/map/blockClusterer.png";
import blockClusterermarkerImg from "../../../img/map/blockClustermarker.png";

import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import DraggableResizeModal from './DraggableresizeModal';

// redex
import { MapRight, MapProductEls, mapHeader, dangisidebarmodal, exculsivesidebarmodal, probrokersidebarmodal, sidebarmodal } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

import json from '../../../json/geoMap.json'

import style from './kakaoMap.css';

//server
import serverController from '../../../server/serverController';
import mapProductEls from "../../../store/modules/mapProductEls";
import { TrainRounded } from "@material-ui/icons";

export default function KakaoMap({ status, mapheader_search_element }) {

  //resize,draggable모달관련
  const [resizeOpen, setResizeOpen] = useState(true);
  const handleOpenResizeToggle = (evt) => {
    roadViewModalRef.current.style.display = 'none';
  };

  var searchdetail_origin_matcharea = JSON.parse(localStorage.getItem('searchdetail_origin_matcharea'));
  console.log('==?>>페이지로드시점 kakaomap요소 콤퍼넌트 실행>>>', searchdetail_origin_matcharea, mapheader_search_element);
  console.log(dangisidebarmodal, exculsivesidebarmodal, probrokersidebarmodal, sidebarmodal);


  const [mapobject, setmapobject] = useState(null);//처음 로드시점에만 저장되는 카카오맵실행초기화때 설정되는 맵객체를 저장하는 state변수. 전역변수론 한계가 있음. state내부상태값 변화시마다 해당컴포넌트 계속변하면서 전역변수의경우 게속 값 임의값 초기화되나,state변수는 state로인한 재랜더링시에는 상태유지함.
  const [roadviewmapwalker, setroadviewmapwalker] = useState(null);//로드뷰맵워커.설정한다. state로써 전역저장. 최초로드시점에만 초기화되고, 그 이후 state변화에의한 랜더링시에는 냅둔다.
  const [geocoder, setgeocoder] = useState(null);//지오코더 api
  const [polygon, setpolygon] = useState(null);

  const [kakaoMap, setKakaoMap] = useState(null);
  const [, setExcClusterer] = useState();
  const [, setProClusterer] = useState();
  const [blockClusterer, setBlockClusterer] = useState();
  const [, setAroundClusterer] = useState();
  const [, setRoadClusterer] = useState();
  const [, setCurrnetClusterer] = useState();
  const pivot = { lat: 37.496463, lng: 127.029358 }
  const [centerClusterer, setCenterClusterer] = useState({ lat: "", lng: "" })
  const [clickMarker, setClickMarker] = useState({});
  const [searchpolygonarea, setSearchpolygonarea] = useState([]);

  const mapRightRedux = useSelector(state => { return state.mapRight });
  const mapFilterRedux = useSelector(state => { return state.mapFilter });
  const productRedux = useSelector(state => { return state.mapProductEls });
  const login_user = useSelector(data => data.login_user);

  const mapHeaderRedux = useSelector(data => data.mapHeader);

  const [exclusiveArr, setExclusiveArr] = useState([]);
  const [probrokerArr, setProbrokerArr] = useState([]);
  const [blockArr, setBlockArr] = useState([]);
  const [aroundArr, setAroundArr] = useState([]);

  const container = useRef();
  const rvWrapperRef = useRef();
  const roadViewRef = useRef();
  const roadViewRefsss = useRef();
  const roadViewModalRef = useRef();


  // 거리재기
  var drawingFlag = false;
  var clickLine;
  var moveLine;
  var distanceOverlay;
  var dots = [];

  var map_globe;

  // 용산구 폴리곤 더미 데이터 입니다.
  // 검색 후 폴리곤은 dummyArea안에 넣으시면 됩니다.
  var searcharea_polygon = [];

  //재귀탐사. 재귀 n차원배열의 원소탐색.
  function loop_search(target) {
    //console.log('재귀탐사 시작:', target);
    if (target.constructor === Array) {
      //console.log('넘어온 인자 개체요소가 배열인경우 하위자식 탐사:', target);
      //넘어온요소가 배열형태 자료형이라면 자식이 있다는것이고 이런경우 직속자식들을 조회한다.(배열자식들) 그리고 그 원소들로 해서 또 재귀루프.
      for (let ss = 0; ss < target.length; ss++) {
        //타깃요소의 각 자식들. 
        let target_item = target[ss];//각 자식 한개.
        loop_search(target_item);//그 자식을 넘긴다.
      }
    } else {
      //배열이 아니라면 문자열값이라는것이고 이러한 값이라면 바로 조회를 해서. 처리를한다.
      //경도,위도순으로 저장...나누기 2로 처리.
      //console.log('넘어온 인자개체요소가 배열이 아니고 value값인경우, 하위자식 비탐사:', target);
      if (target > 30 && target < 50) {
        //위도값.
        searcharea_polygon.push(target);//위도값.
      } else if (target > 110 && target < 130) {
        //경도값.
        searcharea_polygon.push(target);//경도값.
      }
    }
  }


  var dummyArea2 = [
    new kakao.maps.LatLng(37.5548768201904, 126.96966524449994),
    new kakao.maps.LatLng(37.55308718044556, 126.97642899633566),
    new kakao.maps.LatLng(37.55522076659584, 126.97654602427454),
    new kakao.maps.LatLng(37.55320655210504, 126.97874667968763),
    new kakao.maps.LatLng(37.55368689494708, 126.98541456064552),
    new kakao.maps.LatLng(37.54722934282707, 126.995229135048),
    new kakao.maps.LatLng(37.549694559809545, 126.99832516302801),
    new kakao.maps.LatLng(37.550159406110104, 127.00436818301327),
    new kakao.maps.LatLng(37.54820235864802, 127.0061334023129),
    new kakao.maps.LatLng(37.546169758665414, 127.00499711608721),
    new kakao.maps.LatLng(37.54385947805103, 127.00727818360471),
    new kakao.maps.LatLng(37.54413326436179, 127.00898460651953),
    new kakao.maps.LatLng(37.539639030116945, 127.00959054834321),
    new kakao.maps.LatLng(37.537681185520256, 127.01726163044557),
    new kakao.maps.LatLng(37.53378887274516, 127.01719284893274),
    new kakao.maps.LatLng(37.52290225898471, 127.00614038053493),
    new kakao.maps.LatLng(37.51309192794448, 126.99070240960813),
    new kakao.maps.LatLng(37.50654651085339, 126.98553683648308),
    new kakao.maps.LatLng(37.50702053393398, 126.97524914998174),
    new kakao.maps.LatLng(37.51751820477105, 126.94988506562748),
    new kakao.maps.LatLng(37.52702918583156, 126.94987870367682),
    new kakao.maps.LatLng(37.534519656862926, 126.94481851935942),
    new kakao.maps.LatLng(37.537500243531994, 126.95335659960566),
    new kakao.maps.LatLng(37.54231338779177, 126.95817394011969),
    new kakao.maps.LatLng(37.54546318600178, 126.95790512689311),
    new kakao.maps.LatLng(37.548791603525764, 126.96371984820232),
    new kakao.maps.LatLng(37.55155543391863, 126.96233786542686),
    new kakao.maps.LatLng(37.5541513366375, 126.9657135934734),
    new kakao.maps.LatLng(37.55566236579088, 126.9691850696746),
    new kakao.maps.LatLng(37.5548768201904, 126.96966524449994)
  ]

  // 폴리곤 생성
  useEffect(() => {
    if (!kakaoMap) { return; }
    console.log('searchpolygonarae변경>>>:',searchpolygonarea);
    let mapData = JSON.parse(localStorage.getItem("mapData"));

    if (mapData.level >= 1 && mapData.level <= 7) {
      // 폴리곤 뜨게 할려면 return 삭제하시면됩니다!
      console.log('kakaompa state상태변경시 조회당시때의 searcharea_polyogonL:', searchpolygonarea, polygon);
      if (polygon) {
        polygon.setMap(null);
      }

      let polygonss = new kakao.maps.Polygon({
        map: kakaoMap,
        path: searchpolygonarea, // 각 좌표 배열을 넣어야합니다.
        strokeWeight: 2, // 선 두께
        strokeColor: '#F34829', // 선 색깔
        strokeOpacity: 0.7, // 선 투명도 
        fillColor: '#FF6D41', // 채우는 색깔
        fillOpacity: 0.1  // 채우는 투명도 
      });
      //polygonss.setMap(mapobject);
      setpolygon(polygonss);
    } else if (mapData.level >= 8) {
      if (polygon) {
        polygon.setMap(null);
      }
    }

  }, [searchpolygonarea])


  // 전세 텍스트
  const jeonseTextfunc = (num) => {
    let text = "";
    switch (num) {
      case 1: text = "500000"; break;
      case 2: text = "1000000"; break;
      case 3: text = "2000000"; break;
      case 4: text = "3000000"; break;
      case 5: text = "5000000"; break;
      case 6: text = "10000000"; break;
      case 7: text = "20000000"; break;
      case 8: text = "30000000"; break;
      case 9: text = "40000000"; break;
      case 10: text = "50000000"; break;
      case 11: text = "60000000"; break;
      case 12: text = "70000000"; break;
      case 13: text = "80000000"; break;
      case 14: text = "90000000"; break;
      case 15: text = "100000000"; break;
      case 16: text = "120000000"; break;
      case 17: text = "150000000"; break;
      case 18: text = "170000000"; break;
      case 19: text = "200000000"; break;
      case 20: text = "250000000"; break;
      case 21: text = "300000000"; break;
      case 22: text = "350000000"; break;
      case 23: text = "400000000"; break;
      case 24: text = "500000000"; break;
      case 25: text = "700000000"; break;
      case 26: text = "1000000000"; break;
      case 27: text = "1200000000"; break;
      case 28: text = "1500000000"; break;
      case 29: text = "2000000000"; break;
    }
    return (text);
  }

  // 월세 텍스트
  const monthlyTextfunc = (num) => {
    let text = "";
    switch (num) {
      case 1: text = "50000"; break;
      case 2: text = "100000"; break;
      case 3: text = "200000"; break;
      case 4: text = "250000"; break;
      case 5: text = "300000"; break;
      case 6: text = "350000"; break;
      case 7: text = "400000"; break;
      case 8: text = "500000"; break;
      case 9: text = "600000"; break;
      case 10: text = "700000"; break;
      case 11: text = "1000000"; break;
      case 12: text = "1500000"; break;
      case 13: text = "2000000"; break;
      case 14: text = "2500000"; break;
      case 15: text = "3000000"; break;
      case 16: text = "4000000"; break;
      case 17: text = "5000000"; break;
    }
    return (text);
  }

  const updateProduct = async () => {
    console.log('>>>>updateProduc함수호출::', login_user,mapRightRedux.isExclusive.is,mapRightRedux.isBlock.is,mapRightRedux.isProbroker.is);
    //첫로드시,mapheader검색내역 변경,필터변경,idle변경,우측메뉴 변경등 모조리 다 이것 실행.
    let searchdetail_origindata = JSON.parse(localStorage.getItem("searchdetail_origin"));//위 덷이터는 첫 검색하여 유입한경우or mapheader검색해서 유입한경우에 존재하며 검색이후 없어집니다.
    let mapData = JSON.parse(localStorage.getItem("mapData"));
    // console.log('getProduct요청 실행(페이지로드 또는 검색시에 오는 표준요청)::',searchdetail_origindata);

    if (!searchdetail_origindata) {//검색없이 온경우or 페이지 새로고침, 우측메뉴변경,필터변경,맵idle
      // console.log('지도검색데이터없는경우:',mapData);

      if (mapData) {
        var map_sendData = {
          level: mapData.level,//레벨 상황별로 매번 다른 se,ne정보에 따른 startx,starty~ endx,endy정보값 조회한다.
          lat: mapData.lat,
          lng: mapData.lng,//지도중심좌표값.
          startx: mapData.sw.La ? mapData.sw.La : 0,//시작x,y  종료x,y값..
          starty: mapData.sw.Ma ? mapData.sw.Ma : 0,
          endx: mapData.ne.La ? mapData.ne.La : 0,
          endy: mapData.ne.Ma ? mapData.ne.Ma : 0,
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
          prdtype_val: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',
          isexclusive_val: mapRightRedux.isExclusive.is,
          isprobroker_val: mapRightRedux.isProbroker.is,
          isblock_val: mapRightRedux.isBlock.is
        }
      } else {
        //맵데이터 없던경우엔 
        var map_sendData = {
          level: 3,
          lat: 37.496463,
          lng: 127.029358,
          startx: 127.01839783277482,
          starty: 37.4924650388405,
          endx: 127.04011313906764,
          endy: 37.500469610188944,//해당 지도 중심좌표(강남지역주변)지도화면일때에(해당레벨지도조건)일때에 지도 영역(지도랜더링영역의 x,y bounding직사각형영역 크기)전달.
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
          prdtype_val: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',
          isexclusive_val: mapRightRedux.isExclusive.is,
          isprobroker_val: mapRightRedux.isProbroker.is,
          isblock_val: mapRightRedux.isBlock.is
        }
      }
    } else if (searchdetail_origindata && ((searchdetail_origindata.y && searchdetail_origindata.x) || (searchdetail_origindata.prd_latitude && searchdetail_origindata.prd_longitude))) {//검색으로 넘어오는경우에 한정.
      console.log('지도검색 데이터있던경우::', searchdetail_origindata, map_globe);
      //지도검색으로 이동되어져있던 지도화면상에서의 정보(borderarea정보 조회 bounding정보)
      //var bounds_data=map_globe.getBounds();
      //var swLatlng=bounds_data.getSouthwWest();
      //var neLastlng=bounds_data.getNorthEast();

      if (mapData) {
        var map_sendData = {
          level: 3,
          lat: (searchdetail_origindata['prd_id'] && searchdetail_origindata['prd_identity_id']) ? searchdetail_origindata['prd_latitude'] : searchdetail_origindata['y'],
          lng: (searchdetail_origindata['prd_id'] && searchdetail_origindata['prd_identity_id']) ? searchdetail_origindata['prd_longitude'] : searchdetail_origindata['x'],
          startx: mapData.sw.La,
          starty: mapData.sw.Ma,
          endx: mapData.ne.La,
          endy: mapData.ne.Ma,
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
          prdtype_val: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',
          isexclusive_val: mapRightRedux.isExclusive.is,
          isprobroker_val: mapRightRedux.isProbroker.is,
          isblock_val: mapRightRedux.isBlock.is
        };
      } else {
        //아무것도 안함. 검색을 했는데 검색당시에 지정된 맵 상황에 따라 저장했던 맵데이터가 없다면 
      }

    } else {
      // console.log('지도검색데이터가 없거나, x,y,prdlat,longitude값이 유효하지 않은경우!');
      var map_sendData = {
        level: 3,
        lat: 37.496463,
        lng: 127.029358,
        startx: 127.01839783277482,
        starty: 37.4924650388405,
        endx: 127.04011313906764,
        endy: 37.500469610188944,//해당 지도 중심좌표(강남지역주변)지도화면일때에(해당레벨지도조건)일때에 지도 영역(지도랜더링영역의 x,y bounding직사각형영역 크기)전달.
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        prdtype_val: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',
        isexclusive_val: mapRightRedux.isExclusive.is,
        isprobroker_val: mapRightRedux.isProbroker.is,
        isblock_val: mapRightRedux.isBlock.is
      }
    }

    const reduxFilter = mapFilterRedux.filterUI;
    const reduxTextFilter = mapFilterRedux.filterArr;
    //if(!mapData){return};
    let type = 1;
    let roomTextArr = [];
    let isPark = 1;
    let isPet = 0;
    if (status == "apart") {
      type = 1
    } else if (status == "officetel") {
      type = 2
    } else if (status == "store") {
      type = 3
    } else if (status == "office") {
      type = 4
    }

    if (reduxTextFilter.room == "전체") {
      roomTextArr = null;
    } else {
      for (let i = 0; i < reduxTextFilter.room.length; i++) {
        roomTextArr.push(reduxTextFilter.room[i]);
      }
    }
    if (status == "officetel") {
      isPark = reduxFilter.parkOfficetel;
    } else if (status == "store" || status == "office") {
      isPark = reduxFilter.parkStore;
    } else {
      isPark = null;
    }

    // ** api 사용시 유의사항
    // "전체"일경우에는 1을 넣지 마시고 null값을 넣어주세요!
    // roomStructure 는 숫자가 아닌 배열안에 문자열로 넣어주세요 ex) ["오픈형원룸", "분리형원룸"]
    let data = {
      prdType: type, // 건물 타입 1-아파트, 2-오피스텔, 3-상가, 4-사무실
      prdSelType: reduxFilter.prd_sel_type, // 거래 유형 1-매매, 2-전세, 3-월세 

      tradePriceMin: reduxFilter.priceRangeValue[0] == 0 ? null : reduxFilter.priceRangeValue[0] * 10000000, // 매매 최소
      tradePriceMax: reduxFilter.priceRangeValue[1] == 100 ? null : reduxFilter.priceRangeValue[1] * 10000000, // 매매 최대
      jeonsePriceMin: reduxFilter.jeonseRangeValue[0] == 0 ? null : jeonseTextfunc(reduxFilter.jeonseRangeValue[0]), // 전세금(보증금) 최소
      jeonsePriceMax: reduxFilter.jeonseRangeValue[1] == 30 ? null : jeonseTextfunc(reduxFilter.jeonseRangeValue[1]), // 전세금(보증금) 최대
      monthPriceMin: reduxFilter.monthlyRangeValue[0] == 0 ? null : monthlyTextfunc(reduxFilter.monthlyRangeValue[0]), // 월세 최소
      monthPriceMax: reduxFilter.monthlyRangeValue[1] == 18 ? null : monthlyTextfunc(reduxFilter.monthlyRangeValue[1]), // 월세 최대
      supplySpaceMin: reduxFilter.areaRangeValue[0] == 0 ? null : reduxFilter.areaRangeValue[0], // 공급면적 최소
      supplySpaceMax: reduxFilter.areaRangeValue[1] == 100 ? null : reduxFilter.areaRangeValue[1], // 공급면적 최대
      managementPriceMin: reduxFilter.manaRangeValue[0] == 0 ? null : reduxFilter.manaRangeValue[0] * 10000,
      managementPriceMax: reduxFilter.manaRangeValue[1] == 75 ? null : reduxFilter.manaRangeValue[1] * 10000,


      floor: reduxFilter.floor == "0" ? null : Number(reduxFilter.floor) + 1, // 층수
      roomCount: reduxFilter.roomApart == "0" ? null : Number(reduxFilter.roomApart) + 1, // 방수
      bathCount: reduxFilter.bath == "0" ? null : Number(reduxFilter.bath) + 1, // 욕실수
      isParking: isPark == 0 ? null : isPark, // 전용주차장 여부 1->있음,  0->없음
      isToilet: status !== "officetel" && status !== "apart" ? reduxFilter.toilet : null, // 전용 화장실 여부 1->있음,  0->없음
      isManagement: reduxFilter.manaStatus == 0 ? null : reduxFilter.manaStatus, // 관리비 여부 1->있음,  0->없음
      totalHousehold: reduxFilter.danji == "0" ? null : Number(reduxFilter.danji) + 1, // 총세대수 1-> 전체, 2 -> 200세대이상, 3 -> 500세대이상, 4 -> 1000세대이상, 5 -> 2000세대이상
      prdUsage: reduxFilter.purpose == "0" ? null : Number(reduxFilter.purpose) + 1, // 용도 1->전체, 2-> 주거용, 3-> 업무용
      roomStructure: roomTextArr, // 오픈형원룸, 분리형원룸, 원룸원거실, 투룸, 쓰리룸이상
      isDouble: reduxFilter.double == "0" ? null : reduxFilter.double, // 복층 2-> 복층,  1->단층

      isPet: status == "officetel" ? reduxFilter.pet == "0" ? null : Number(reduxFilter.pet) : null, // 반려동물 여부 1->있음,  0->없음 ㅠㅠㅠㅠ

      acceptUseDate: reduxFilter.use == "0" ? null : Number(reduxFilter.use) + 1, // 2-> 5년이내, 3->10년이내, 4-> 20년이내, 5->20년이상

      zido_level: map_sendData && map_sendData.level,
      origin_x: map_sendData && map_sendData.lng,
      origin_y: map_sendData && map_sendData.lat,
      startx: map_sendData && map_sendData.startx,
      starty: map_sendData && map_sendData.starty,
      endx: map_sendData && map_sendData.endx,//상황별 지도의 영역범위 x,y ~ x,y정보를 보낸다. 사실상 지도중심좌표와 화면크기 레벨값등은 보낼필요는 없음.
      endy: map_sendData && map_sendData.endy,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      prd_type: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',
      isexclusive: mapRightRedux.isExclusive.is,
      isprobroker: mapRightRedux.isProbroker.is,
      isblock: mapRightRedux.isBlock.is,
      //isprobroker:mapright_probroker,
      //isblock: mapright_block,
      mem_id: login_user.memid ? login_user.memid : 0
    }
    console.log('==>>>>map페이지도달시점 로그인리덕스정보상태:',login_user,mapRightRedux.isExclusive.is,mapRightRedux.isBlock.is,mapRightRedux.isProbroker.is);

    serverController.connectFetchController(`/api/mapProduct`, "POST", JSON.stringify(data), function (res) {
      if (res.success) {
        console.log('updateproudctmap change reusltss:', res);
        // 전속 매물
        if (mapRightRedux.isExclusive.is) {
          let match_matterial_exclusive = res.data[0];//제한 20개 갱신된것 가져옴.
          let match_matterial_exclusive_zido = res.data[3];//페이지 새로고침or 메인,지도페이지 검색을통해서 온경우에 관련 데이터 mapchange에서기준 가져옴.

          setExclusiveArr(res.data[3]);
          MapProductEls.updateExclusive_zido({ exclusive_zido: { cnt: res.data[3].length } });
          MapProductEls.updateExclusive({ exclusive: match_matterial_exclusive });
        } else {
          MapProductEls.updateExclusive_zido({ exclusive_zido: [] });//강제 빈배열 넣기.
          MapProductEls.updateExclusive({ exclusive: [] });
        }

        // 전문 중개사
        if (mapRightRedux.isProbroker.is) {
          let match_matterial_probroker = res.data[1];
          let match_matterial_probroker_zido = res.data[4];
          setProbrokerArr([...res.data[4]])
          MapProductEls.updateProbroker_zido({ probroker_zido: { cnt: res.data[4].length } });
          MapProductEls.updateProbroker({ probroker: match_matterial_probroker });
        } else {
          MapProductEls.updateProbroker_zido({ probroker_zido: [] });
          MapProductEls.updateProbroker({ probroker: [] });
        }

        // 단지별 실거래
        if (mapRightRedux.isBlock.is) {
          let match_matterial_block = res.data[2];
          console.log('match_matteriarlblcokss:', match_matterial_block);
          let match_matterial_block_zido = res.data[5];
          setBlockArr([...res.data[5]])
          MapProductEls.updateBlock_zido({ block_zido: { cnt: res.data[5].length } });
          MapProductEls.updateBlock({ block: match_matterial_block });
        } else {
          MapProductEls.updateBlock_zido({ block_zido: [] });
          MapProductEls.updateBlock({ block: [] });
        }
                
      }
      localStorage.removeItem('searchdetail_origin');//메인or지도에서 검색해서 온 그 검색데이터는 그 위치기반으로 해서 주변 데이터 검색이후 지운다.  
    }, function (err) { console.log(err); });

  }

  // 호출 상황 --------
  // idle 이벤트
  async function getProduct_idleCase() {

    // **api
    // 현재 활성 버튼/필터 서버에 보내서 
    // 지도에 띄울 좌표(마커/클러스터러), 매물 리스트 받아와야 합니다.

    // fetch api요청 해당 현재 지도의 change 중심좌표,레벨,화면스크린크기 등을 보낸다.그에 따른 그 지도상화면에서 보이는 주변 매물들 결과얻는다.
    //console.log('-=======>>getProduct함수 실행::',mapData);
    var mapData = JSON.parse(localStorage.getItem("mapData"));
    console.log('지도 변화이벤트 발생 지도변화이벤트시마다 데이터 호출>>레벨값에 따라서 api호출을 막음', mapData);
    if (mapData) {

      if (mapData.level >= 1 && mapData.level <= 5) {
        updateProduct();
      } else if (mapData.level >= 6) {
        //클러스터 다 지움.아무 호출도 안함.
        initExcCluster();
        initProCluster();
        initBlockCluster();
        //setExclusiveArr([]);
        //setProbrokerArr([]);
        //setBlockArr([]);
        //사이드바 데이터도 지움.
        MapProductEls.updateExclusive_zido({ exclusive_zido: [] });
        MapProductEls.updateExclusive({ exclusive: [] });
        MapProductEls.updateProbroker_zido({ probroker_zido: [] });
        MapProductEls.updateProbroker({ probroker: [] });
        MapProductEls.updateBlock_zido({ block_zido: [] });
        MapProductEls.updateBlock({ block: [] });
      }

    }
  }

  /*
    전속매물, 전문중개사, 단지별 실거래
    각 클러스터러와 마커를 초기화시키는 함수를 만들었습니다.
    새로운 마커를 표시하기 전 함수를 실행하여 이전에 있던 클러스터러를 지웠습니다.
  */
  const initExcCluster = () => {
    setExcClusterer(clusterer => {
      console.log('==>>setExcCLUSTER initcluster:',clusterer);
      if (!clusterer) { return clusterer };
      clusterer.clear();
      return clusterer;
    });
  }
  const initProCluster = () => {
    setProClusterer(clusterer => {
      // console.log('====>setRroclustere initcluster:',clusterer);
      if (!clusterer) { return clusterer };
      clusterer.clear();
      return clusterer;
    });
  }
  const initBlockCluster = () => {
    setBlockClusterer(clusterer => {
      // console.log('====>>setblockClustere initcluster:',clusterer);
      if (!clusterer) { return clusterer };
      clusterer.clear();
      return clusterer;
    });
  }

  // 제거
  const removeEvent = (event) => {
    let target=event.target;
    let real_target=event.currentTarget;
    console.log('우측버튼또는 좌측필터 클릭시에,또는 좌측메뉴필터 range변화시에 getProucdt_idleCase제거핸들러발생',target,target.getAttribute('aria-expanded'),real_target,real_target.getAttribute('aria-expanded'));
    let target_type=real_target.id;
    let target_status=real_target.getAttribute('aria-expanded');
    if(target_type == 'filter_expandbtn'){
      if(target_status == 'true'){
        console.log('필터 축소액션였던경우 ',target_status);
        return;
      }
    }
    kakao.maps.event.removeListener(kakaoMap, 'idle', getProduct_idleCase);
  }
  var custom_searcharea_polygon = [];
  //페이지 첫 로드 시에 getProuct
  useEffect(() => {
    console.log('페이지 첫 로드시에 실행>>getProduct실행 및 gemetrydata처리.', searchdetail_origin_matcharea, mapheader_search_element);//메인으로 가서 검색하고 이쪽 페이지로 오는경우,페이지 강제 새로고침 로드 하는경우

    //첫 로드시점때의 맵데이터가 있는경우에 한해서.관련 연산진행>1~5레벨값였을때만 불러온다.
    let mapData = JSON.parse(localStorage.getItem("mapData"));
    if (mapData) {

      if (mapData.level >= 1 && mapData.level <= 5) {
        updateProduct();
      } else if (mapData.level >= 6) {
        //클러스터 다 지움.아무 호출도 안함.
        initExcCluster();
        initProCluster();
        initBlockCluster();
        //setExclusiveArr([]);
        //setProbrokerArr([]);
        //setBlockArr([]);
        //사이드바 데이터도 지움.
        MapProductEls.updateExclusive_zido({ exclusive_zido: [] });
        MapProductEls.updateExclusive({ exclusive: [] });
        MapProductEls.updateProbroker_zido({ probroker_zido: [] });
        MapProductEls.updateProbroker({ probroker: [] });
        MapProductEls.updateBlock_zido({ block_zido: [] });
        MapProductEls.updateBlock({ block: [] });
      }

    }


    if (searchdetail_origin_matcharea) {
      var geometry_data = searchdetail_origin_matcharea.geometry.coordinates;

      loop_search(geometry_data);

      console.log('재귀탐색후에 searcharea_polygon::', searcharea_polygon);

      var outer = searcharea_polygon.length / 2; //18/2 9개외부.
      for (let l = 0; l < outer; l++) {
        var x, y;
        for (let s = 0; s <= 1; s++) {//경도,위도순.
          if (s == 0) {
            x = searcharea_polygon[2 * l + s];//2*0+0,2*0+1, 2*1+0,1 2*2+0,1
          } else {
            y = searcharea_polygon[2 * l + s];
          }
        }
        //console.log('각 외부 꼭지점별 x,y값', x, y);
        custom_searcharea_polygon.push(new kakao.maps.LatLng(y, x));
      }
     // console.log('가공된 꼭지점배열형태::', custom_searcharea_polygon);
      setSearchpolygonarea(custom_searcharea_polygon);

      searcharea_polygon = [];
      custom_searcharea_polygon = [];

      //입력창 채워놓기 이벤트,메인또는 검색창에서 클릭선택한 행정구역명 string으로 채워져있게끔!
      if (mapheader_search_element.current) {
        console.log('행정구역 확인 ', mapheader_search_element.current);
        mapheader_search_element.current.value = searchdetail_origin_matcharea.properties.SIG_KOR_NM ? searchdetail_origin_matcharea.properties.SIG_KOR_NM : searchdetail_origin_matcharea.properties.EMD_KOR_NM;//시군구명값.
      }
    }
  }, []);


  useEffect(() => {
    console.log('mapHeader리덕스 검색시에 실행>>getProduct실행:: 또는 지역폴리곤재갱신.', searchdetail_origin_matcharea, mapheader_search_element); //mapHeader현재 지도페이지에서 검색하는경우로 해더리덕스origin변경시에 실행.

    let mapData = JSON.parse(localStorage.getItem("mapData"));
    if (mapData) {

      if (mapData.level >= 1 && mapData.level <= 5) {
        updateProduct();
      } else if (mapData.level >= 6) {
        //클러스터 다 지움.아무 호출도 안함.
        initExcCluster();
        initProCluster();
        initBlockCluster();
        //setExclusiveArr([]);
        //setProbrokerArr([]);
        //setBlockArr([]);
        //사이드바 데이터도 지움.
        MapProductEls.updateExclusive_zido({ exclusive_zido: [] });
        MapProductEls.updateExclusive({ exclusive: [] });
        MapProductEls.updateProbroker_zido({ probroker_zido: [] });
        MapProductEls.updateProbroker({ probroker: [] });
        MapProductEls.updateBlock_zido({ block_zido: [] });
        MapProductEls.updateBlock({ block: [] });
      }

    }

    if (searchdetail_origin_matcharea) {
      var geometry_data = searchdetail_origin_matcharea.geometry.coordinates;

      loop_search(geometry_data);

      console.log('재귀탐색후에 searcharea_polygon::', searcharea_polygon);

      var outer = searcharea_polygon.length / 2; //18/2 9개외부.
      for (let l = 0; l < outer; l++) {
        var x, y;
        for (let s = 0; s <= 1; s++) {//경도,위도순.
          if (s == 0) {
            x = searcharea_polygon[2 * l + s];//2*0+0,2*0+1, 2*1+0,1 2*2+0,1
          } else {
            y = searcharea_polygon[2 * l + s];
          }
        }
        //console.log('각 외부 꼭지점별 x,y값', x, y);
        custom_searcharea_polygon.push(new kakao.maps.LatLng(y, x));
      }
      //console.log('가공된 꼭지점배열형태::', custom_searcharea_polygon);
      setSearchpolygonarea(custom_searcharea_polygon);

      searcharea_polygon = [];
      custom_searcharea_polygon = [];

      //입력창 채워놓기 이벤트,메인또는 검색창에서 클릭선택한 행정구역명 string으로 채워져있게끔!
      if (mapheader_search_element.current) {
        mapheader_search_element.current.value = searchdetail_origin_matcharea.properties.SIG_KOR_NM ? searchdetail_origin_matcharea.properties.SIG_KOR_NM : searchdetail_origin_matcharea.properties.EMD_KOR_NM;//시군구명값.
      }

    }

    //초기로드시점때뿐 아니라(다른데서 넘어온 또는 페이지 새로고침인 경우 제외하고,현재페이지에서 검색하는 경우)
  }, [mapHeaderRedux.origin, mapHeaderRedux.originid]);

 
  // 우측메뉴(두가지메뉴),filter,kakaomp등(카카오맵은 최초로드시에만 바뀐다.)바뀔때마다 이벤트 발생
  useEffect(() => {
     console.log('===>>우측 right메뉴,맵필터, 카카오맵등 바뀔떄마다 이벤트 발생:');
    if (!kakaoMap) { return; };
    const filerRedux = mapFilterRedux;
    localStorage.setItem("filterData", JSON.stringify(filerRedux));

    // #.1 현재 리스트/마커/클러스터러 변경
    //getProduct_normal();

    // #.2 이벤트 추가 ( 새 이벤트 추가)
    kakao.maps.event.addListener(kakaoMap, 'idle', getProduct_idleCase);

    // #.3  클릭 시 이벤트 제거 ( 기존 이벤트 제거 )
    const changeBtn = document.querySelectorAll(".changeBtn");
    const changeBtnRange = document.querySelectorAll(".changeBtnRange");

    for (let i = 0; i < changeBtn.length; i++) {
      changeBtn[i].addEventListener("click", removeEvent);
      //changeBtn[i].onClick=removeEvent;//전통방식 여러번 등록되지않는다.
    }
    for(let i=0; i<changeBtnRange.length; i++){
      changeBtnRange[i].addEventListener("click", removeEvent);
      changeBtnRange[i].addEventListener("change",removeEvent);
      //changeBtnRange[i].onClick=removeEvent;
    }
    
    let mapData = JSON.parse(localStorage.getItem("mapData"));
    if (mapData) {

      if (mapData.level >= 1 && mapData.level <= 5) {
        updateProduct();
      } else if (mapData.level >= 6) {
        //클러스터 다 지움.아무 호출도 안함.
        initExcCluster();
        initProCluster();
        initBlockCluster();
        //setExclusiveArr([]);
        //setProbrokerArr([]);
       // setBlockArr([]);
        //사이드바 데이터도 지움.
        MapProductEls.updateExclusive_zido({ exclusive_zido: [] });
        MapProductEls.updateExclusive({ exclusive: [] });
        MapProductEls.updateProbroker_zido({ probroker_zido: [] });
        MapProductEls.updateProbroker({ probroker: [] });
        MapProductEls.updateBlock_zido({ block_zido: [] });
        MapProductEls.updateBlock({ block: [] });
      }
    }
  }, [ mapRightRedux.isProbroker.is,mapRightRedux.isBlock.is, kakaoMap, mapFilterRedux]);
  
  // ----------------------

  // 관련 리덕스 지도변경에 따른 데이터변동시에 발생.
  // useEffect(() => {
  //   let exclusive_kakaomap_elements=[];
  //   for(let b=0; b<productRedux.exclusive_zido.length; b++){
  //     exclusive_kakaomap_elements[b]= new kakao.maps.LatLng(productRedux.exclusive_zido[b].prd_latitude,productRedux.exclusive_zido[b].prd_longitude);
  //   }
  //   setExclusiveArr( exclusive_kakaomap_elements);

  //   let probroker_kakaomap_elements=[];
  //   for(let b=0; b<productRedux.probroker_zido.length; b++){
  //     probroker_kakaomap_elements[b] = new kakao.maps.LatLng(productRedux.probroker_zido[b].y,productRedux.probroker_zido[b].x);
  //   }
  //   setProbrokerArr(probroker_kakaomap_elements)

  //   let block_kakaomap_elements=[];
  //   for(let b=0; b<productRedux.block_zido.length; b++){
  //     block_kakaomap_elements[b] = {};
  //     block_kakaomap_elements[b]['position'] =  new kakao.maps.LatLng(productRedux.block_zido[b].y,productRedux.block_zido[b].x);
  //     block_kakaomap_elements[b]['info'] = {'complex_name':  productRedux.block_zido[b].complex_name , 'approval_date': productRedux.block_zido[b].approval_date};
  //   }
  //   setBlockArr(block_kakaomap_elements)

  // }, [productRedux.block_zido, productRedux.probroker_zido, productRedux.exclusive_zido]);

  function searchAddFromCoords(coords, callback, geocoders) {
    console.log('idle>>>변화시에 지도중심좌표값 주소로갱신::', coords, geocoders);

    if (geocoders && geocoders.coord2RegionCode) {
      geocoders.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    }
  }
  async function displayCenterinfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {

      let mapData = JSON.parse(localStorage.getItem("mapData"));

      console.log('idle변화시에 지도중심좌표에 대한 주소값을얻음::', result, mapData);

      let result0 = result[0];

      if (result0) {
        let sig_name = result0.region_2depth_name;//시군구 행정구역명. 
        let emd_name = result0.region_3depth_name;//읍면동 행정구역명.
        let sig_code = result0.code;//시군구 코드값.시군구읍면동리 정도까지의 전체적 코드자리 거의always 10자리 이중 앞자리 5자리까지가. 시군구레벨까지의 코드를 의미.
        let emd_code = result0.code.substr(0, 8);//읍면동코드값(지도레벨에 따라서 처리를 달리하는데, 1,2레벨때는 읍면동레벨로 조회하게, 3,4,5,6,..때는 시군구레벨) 8?레벨 이상때는 아예 폴리곤 처리하지 않게끔!!
        //1,2,3 읍면동 조회(idel),4,5,...:시군구조회  7이상?:폴리곤 미출력(요청x)
        sig_code = sig_code.substr(0, 5);
        let area_info = {
          sig_value: sig_name,
          emd_value: emd_name,
          sigcode_value: sig_code,
          emdcode_value: emd_code,
          maplevel: mapData.level//레벨값.지도레벨값.
        };
        //해당 시군구or읍면동에 대한(detault:시군구 현재는) 꼮지점areaoutlineborder정보를 얻는다.
        if (mapheader_search_element.current) {
          if (mapData.level >= 1 && mapData.level <= 5) {
            //읍면동레벨 1~5지도레벨때는 읍면동검색된 emd_name값이 검색창에 띄워질수있게끔
            mapheader_search_element.current.value = emd_name;
          } else if (mapData.level >= 6 && mapData.level <= 7) {
            //6~7지도레벨때는 시군구검색된 sig_name값이 검색창에 띄워질수있게끔
            mapheader_search_element.current.value = sig_name;
          }

          let area_result = await serverController.connectFetchController('/api/matterial/idlezido_areaoutlineborder', 'POST', JSON.stringify(area_info));

          if (area_result) {
            console.log("area resultsssss:", area_result);
            if (area_result.success) {
              if (area_result.outlineborder_result) {
                if (area_result.outlineborder_result.geometry) {
                  var geometry_data = area_result.outlineborder_result.geometry.coordinates;

                  loop_search(geometry_data);

                  console.log('재귀탐색후에 searcharea_polygon::', searcharea_polygon);

                  var outer = searcharea_polygon.length / 2;
                  for (let l = 0; l < outer; l++) {
                    var x, y;
                    for (let s = 0; s <= 1; s++) {
                      if (s == 0) {
                        x = searcharea_polygon[2 * l + s];
                      } else {
                        y = searcharea_polygon[2 * l + s];
                      }
                    }
                    //console.log('각 외부 꼭지점별 x,y값:::>>', x, y);
                    custom_searcharea_polygon.push(new kakao.maps.LatLng(y, x));
                  }
                  //console.log('가공된 꼭지점배열형태>>:', custom_searcharea_polygon);
                  setSearchpolygonarea(custom_searcharea_polygon);
                }

              }
            }
          }
          
        }

      }
    }

    searcharea_polygon = [];
    custom_searcharea_polygon = [];
  }
  // 지도 생성
 /* useEffect(() => {
    console.log('지도생성 이벤트 >>:',navigator.geolocation);
    if (navigator.geolocation) {
      console.log('지도생성 이벤트 >>:',navigator.geolocation);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('navigatoer getCURRPentPosition is positon eixsts',mapRightRedux.isCurrnet.is);

          const lat = position.coords.latitude.toFixed(11); // 위도
          const lng = position.coords.longitude.toFixed(11); // 경도  

          let searchdetail_origindata = JSON.parse(localStorage.getItem("searchdetail_origin"));
          let mapData = JSON.parse(localStorage.getItem("mapData"));
          console.log('카카오맵 실행 최초초기화 해당 위치이동::', mapData, searchdetail_origindata);
          if (searchdetail_origindata) {
            if (searchdetail_origindata.y && searchdetail_origindata.x) {
              var center = new kakao.maps.LatLng(searchdetail_origindata.y, searchdetail_origindata.x);
            } else if (searchdetail_origindata.prd_longitude && searchdetail_origindata.prd_latitude) {
              var center = new kakao.maps.LatLng(searchdetail_origindata.prd_latitude, searchdetail_origindata.prd_longitude);
            } else {
              var center = new kakao.maps.LatLng(lat, lng);
            }
            var level = 3;
          } else if (!searchdetail_origindata) {
            var center = new kakao.maps.LatLng(lat, lng);
            var level = 3;

            if (mapData) {
              center = new kakao.maps.LatLng(Number(mapData.lat), Number(mapData.lng));
              level = mapData.level;
            }
          }
          const options = {
            center,
            level: level
          };
          const map = new kakao.maps.Map(container.current, options);
          console.log('초기화당시 생성 맵:', map);
          //localStorage.setItem('mapobject',map);
          setmapobject(map);//map 객체 순수pure object로써 저장(위험도x)

          var imageSize = new kakao.maps.Size(35, 44);
          var imageoption = { offset: new kakao.maps.Point(4, 4) };
          var single_markerimage = new kakao.maps.MarkerImage(markerImgelement, imageSize, imageoption);
          var markerpos = center; //검색중심좌표와 일치하게.
          var single_marker = new kakao.maps.Marker({
            position: markerpos,
            image: single_markerimage,
            zIndex: 3
          });
          map.setMaxLevel(12);
          single_marker.setMap(map);
          setKakaoMap(map);

          //새로고침 새로 로드시에,검색으로 넘어와서 오는 경우에 그 위치이동했던 당시의 지도상태 bounds데이터를 얻는다.
          let map_bounds = map.getBounds();
          let mapload_data = {
            level: map.getLevel(),
            lng: map.getCenter().La.toFixed(11),
            lat: map.getCenter().Ma.toFixed(11),
            bounds: map_bounds,
            sw: map_bounds.getSouthWest(),
            ne: map_bounds.getNorthEast()
          }
          localStorage.setItem("mapData", JSON.stringify(mapload_data));
          console.log('페이지 새로고침or검색시마다 맵데이터 저장>>:', mapload_data);

          let geocoders = new kakao.maps.services.Geocoder();
          console.log('>카카오맵 초기화 맵 로드처음시점에 저장:', geocoders);
          //setgeocoder(geocoders);

          kakao.maps.event.addListener(map, 'idle', (e) => {
            var level = map.getLevel();
            var lng = map.getCenter().La.toFixed(11);
            var lat = map.getCenter().Ma.toFixed(11);
            var bounds = map.getBounds();
            var swLatlng = bounds.getSouthWest();//남서쪽좌표x,y y좌표는 고위도일수록 커집니다.
            var neLastlng = bounds.getNorthEast();
            const data = {
              level: level,
              lat: lat,
              lng: lng,
              bounds: bounds,
              sw: swLatlng,
              ne: neLastlng
            }
            localStorage.setItem("mapData", JSON.stringify(data));
            //지도변화시에 지도중심좌표에대한 주소정보얻으루있게끔.
            if (level >= 1 && level <= 7) {
              searchAddFromCoords(map.getCenter(), displayCenterinfo, geocoders);//관련 서버 위치 폴리곤정보 요청하는것 레벨8이상부턴 하지않음!
            }else{
              console.log('===>>지도 변화시에 관련 실행>>레벨8이상일떄:');
              if (polygon) {
                //polygon.setMap(null);
              }           
            }
          });
          //map_globe=map;
          console.log('mapglobe storessss stores values:', map);
        },
        (err) => {
          console.log('navigatoer getCURRPentPosition is not eixsts',mapRightRedux.isCurrnet.is);
          let searchdetail_origindata = JSON.parse(localStorage.getItem("searchdetail_origin"));
          let mapData = JSON.parse(localStorage.getItem("mapData"));
          console.log('카카오맵 실행 최초초기화 해당 위치이동::', mapData, searchdetail_origindata);
          if (searchdetail_origindata) {
            if (searchdetail_origindata.y && searchdetail_origindata.x) {
              var center = new kakao.maps.LatLng(searchdetail_origindata.y, searchdetail_origindata.x);
            } else if (searchdetail_origindata.prd_longitude && searchdetail_origindata.prd_latitude) {
              var center = new kakao.maps.LatLng(searchdetail_origindata.prd_latitude, searchdetail_origindata.prd_longitude);
            } else {
              var center = new kakao.maps.LatLng(37.496463, 127.029358);
            }
            var level = 3;
          } else if (!searchdetail_origindata) {
            var center = new kakao.maps.LatLng(37.496463, 127.029358);
            var level = 3;

            if (mapData) {
              center = new kakao.maps.LatLng(Number(mapData.lat), Number(mapData.lng));
              level = mapData.level;
            }
          }
          const options = {
            center,
            level: level
          };
          const map = new kakao.maps.Map(container.current, options);
          console.log('초기화당시 생성 맵:', map);
          //localStorage.setItem('mapobject',map);
          setmapobject(map);//map 객체 순수pure object로써 저장(위험도x)

          var imageSize = new kakao.maps.Size(35, 44);
          var imageoption = { offset: new kakao.maps.Point(4, 4) };
          var single_markerimage = new kakao.maps.MarkerImage(markerImgelement, imageSize, imageoption);
          var markerpos = center; //검색중심좌표와 일치하게.
          var single_marker = new kakao.maps.Marker({
            position: markerpos,
            image: single_markerimage,
            zIndex: 3
          });
          map.setMaxLevel(12);
          single_marker.setMap(map);
          setKakaoMap(map);

          //새로고침 새로 로드시에,검색으로 넘어와서 오는 경우에 그 위치이동했던 당시의 지도상태 bounds데이터를 얻는다.
          let map_bounds = map.getBounds();
          let mapload_data = {
            level: map.getLevel(),
            lng: map.getCenter().La.toFixed(11),
            lat: map.getCenter().Ma.toFixed(11),
            bounds: map_bounds,
            sw: map_bounds.getSouthWest(),
            ne: map_bounds.getNorthEast()
          }
          localStorage.setItem("mapData", JSON.stringify(mapload_data));
          console.log('페이지 새로고침or검색시마다 맵데이터 저장>>:', mapload_data);

          let geocoders = new kakao.maps.services.Geocoder();
          console.log('>카카오맵 초기화 맵 로드처음시점에 저장:', geocoders);
          //setgeocoder(geocoders);

          kakao.maps.event.addListener(map, 'idle', (e) => {
            var level = map.getLevel();
            var lng = map.getCenter().La.toFixed(11);
            var lat = map.getCenter().Ma.toFixed(11);
            var bounds = map.getBounds();
            var swLatlng = bounds.getSouthWest();//남서쪽좌표x,y y좌표는 고위도일수록 커집니다.
            var neLastlng = bounds.getNorthEast();
            const data = {
              level: level,
              lat: lat,
              lng: lng,
              bounds: bounds,
              sw: swLatlng,
              ne: neLastlng
            }
            localStorage.setItem("mapData", JSON.stringify(data));
            //지도변화시에 지도중심좌표에대한 주소정보얻으루있게끔.
            if (level >= 1 && level <= 7) {
              searchAddFromCoords(map.getCenter(), displayCenterinfo, geocoders);//관련 서버 위치 폴리곤정보 요청하는것 레벨6이상부턴 하지않음!
            }else{
              console.log('===>>지도 변화시에 관련 실행>>레벨8이상일떄:');
              if (polygon) {
               // polygon.setMap(null);
              }
            }
          });
          console.log('mapglobe storessss stores values:', map);
        }
      )
      //map_globe=map;

    } else {
      alert("gelocation이 지원되지 않습니다.")
    }

  }, [container, mapHeaderRedux.origin]);*/
  // 지도 생성
  useEffect(() => {
      let searchdetail_origindata = JSON.parse(localStorage.getItem("searchdetail_origin"));
      let mapData = JSON.parse(localStorage.getItem("mapData"));
      console.log('카카오맵 실행 최초초기화 해당 위치이동::', mapData, searchdetail_origindata);
      if (searchdetail_origindata) {
        if (searchdetail_origindata.y && searchdetail_origindata.x) {
          var center = new kakao.maps.LatLng(searchdetail_origindata.y, searchdetail_origindata.x);
        } else if (searchdetail_origindata.prd_longitude && searchdetail_origindata.prd_latitude) {
          var center = new kakao.maps.LatLng(searchdetail_origindata.prd_latitude, searchdetail_origindata.prd_longitude);
        } else {
          var center = new kakao.maps.LatLng(37.496463, 127.029358);
        }
        var level = 3;
      } else if (!searchdetail_origindata) {
        var center = new kakao.maps.LatLng(37.496463, 127.029358);
        var level = 3;

        if (mapData) {
          center = new kakao.maps.LatLng(Number(mapData.lat), Number(mapData.lng));
          level = mapData.level;
        }
      }
      const options = {
        center,
        level: level
      };
      const map = new kakao.maps.Map(container.current, options);
      console.log('초기화당시 생성 맵:', map);
      //localStorage.setItem('mapobject',map);
      setmapobject(map);//map 객체 순수pure object로써 저장(위험도x)

      var imageSize = new kakao.maps.Size(35, 44);
      var imageoption = { offset: new kakao.maps.Point(4, 4) };
      var single_markerimage = new kakao.maps.MarkerImage(markerImgelement, imageSize, imageoption);
      var markerpos = center; //검색중심좌표와 일치하게.
      var single_marker = new kakao.maps.Marker({
        position: markerpos,
        image: single_markerimage,
        zIndex: 3
      });
      map.setMaxLevel(12);
      single_marker.setMap(map);
      setKakaoMap(map);

      //새로고침 새로 로드시에,검색으로 넘어와서 오는 경우에 그 위치이동했던 당시의 지도상태 bounds데이터를 얻는다.
      let map_bounds = map.getBounds();
      let mapload_data = {
        level: map.getLevel(),
        lng: map.getCenter().La.toFixed(11),
        lat: map.getCenter().Ma.toFixed(11),
        bounds: map_bounds,
        sw: map_bounds.getSouthWest(),
        ne: map_bounds.getNorthEast()
      }
      localStorage.setItem("mapData", JSON.stringify(mapload_data));
      console.log('페이지 새로고침or검색시마다 맵데이터 저장>>:', mapload_data);

      let geocoders = new kakao.maps.services.Geocoder();
      console.log('>카카오맵 초기화 맵 로드처음시점에 저장:', geocoders);
      //setgeocoder(geocoders);

      kakao.maps.event.addListener(map, 'idle', (e) => {
        var level = map.getLevel();
        var lng = map.getCenter().La.toFixed(11);
        var lat = map.getCenter().Ma.toFixed(11);
        var bounds = map.getBounds();
        var swLatlng = bounds.getSouthWest();//남서쪽좌표x,y y좌표는 고위도일수록 커집니다.
        var neLastlng = bounds.getNorthEast();
        const data = {
          level: level,
          lat: lat,
          lng: lng,
          bounds: bounds,
          sw: swLatlng,
          ne: neLastlng
        }
        localStorage.setItem("mapData", JSON.stringify(data));
        //지도변화시에 지도중심좌표에대한 주소정보얻으루있게끔.
        if (level >= 1 && level <= 7) {
          searchAddFromCoords(map.getCenter(), displayCenterinfo, geocoders);//관련 서버 위치 폴리곤정보 요청하는것 레벨6이상부턴 하지않음!
        }else{
          console.log('===>>지도 변화시에 관련 실행>>레벨8이상일떄:');
          if (polygon) {
            // polygon.setMap(null);
          }
        }
      });
      console.log('mapglobe storessss stores values:', map);

  }, [container, mapHeaderRedux.origin]);

  useEffect(() => {
    console.log('geocoder변경::', geocoder);
  }, [geocoder]);

  useEffect(() => {
    console.log('mapobject변화시마다 테스트:', mapobject);
  }, [mapobject]);

  // 전속매물 토글 --- 
  useEffect(() => {
    console.log('전속매물 right메뉴 변경당시때의 exclusiveArrr:', exclusiveArr,mapRightRedux.isExclusive.is);

    let mapData = JSON.parse(localStorage.getItem('mapData'));
    if(mapData){
      if (mapData.level >= 1 && mapData.level <= 5) {
        mapRightRedux.isExclusive.is
          ?
          addMarkClust(exclusiveArr, setExcClusterer, exclusiveMarker, excClusterer, 3, 'exclusive')
          :
          initExcCluster();
      } else if (mapData.level >= 6) {
        initExcCluster();
      }
    }
    
  }, [mapRightRedux.isExclusive.is])
  //전속매물 요소 state 배열리스트(마커배열) 변동시마다실행
  useEffect(() => {
    // console.log('exclusvieArr변경::',exclusiveArr);
    initExcCluster();
    let mapData = JSON.parse(localStorage.getItem('mapData'));
    if(mapData){
      if (mapData.level >= 1 && mapData.level <= 5) {
        /*if(mapRightRedux.isExclusive.is){
          addMarkClust(exclusiveArr, setExcClusterer, exclusiveMarker, excClusterer, 3, 'exclusive');
        }*/
        addMarkClust(exclusiveArr, setExcClusterer, exclusiveMarker, excClusterer, 3, 'exclusive');
        
      }else if (mapData.level >= 6) {
      }
    }
    
  }, [exclusiveArr]);

  // 전문 중개사 토글 --- 
  useEffect(() => {
    console.log('전문중개사 right메뉴 변경당시떄의 probrokerArr:', probrokerArr,mapRightRedux.isProbroker.is);

    let mapData = JSON.parse(localStorage.getItem('mapData'));
    if(mapData){
      if (mapData.level >= 1 && mapData.level <= 5) {
        mapRightRedux.isProbroker.is
          ?
          addMarkClust(probrokerArr, setProClusterer, probrokerMarker, proClusterer, 4, 'probroker')
          :
          initProCluster();
      } else if (mapData.level >= 6) {
        initProCluster();
      }
    }

  }, [mapRightRedux.isProbroker.is])
  //전문중개사 요소 state 관련마커배열 리스트 변동시마다 실행
  useEffect(() => {
    //console.log('probrokerArr::',probrokerArr);
    initProCluster();
    let mapData = JSON.parse(localStorage.getItem('mapData'));
    if(mapData){
      if (mapData.level >= 1 && mapData.level <= 5) {
        addMarkClust(probrokerArr, setProClusterer, probrokerMarker, proClusterer, 4, 'probroker');
      }else if (mapData.level >= 6) {
      }
    }
    
  }, [probrokerArr]);

  // 단지별 실거래 토글 --- 
  useEffect(() => {
    console.log('단지별실거래 right메뉴 변경당시때의 blockArr:', blockArr,mapRightRedux.isBlock.is);

    let mapData = JSON.parse(localStorage.getItem('mapData'));
    if(mapData){
      if(mapData.level >= 1 && mapData.level <= 5) {
        mapRightRedux.isBlock.is
          ?
          addMarkClustBlock(blockArr, setBlockClusterer, blockMarker, blockClusterermarkerImg, blockClustererImg, 4)
          :
          initBlockCluster();
      } else if (mapData.level >= 6) {
        initBlockCluster();
       // setBlockArr([]);
        MapProductEls.updateBlock_zido({block_zido: []});
        MapProductEls.updateBlock({block: []});
      }
    }
    
  }, [mapRightRedux.isBlock.is]);

  //단지별요소 state관련 마커배열 리스트 변동시마다 실행
  useEffect(() => {
    console.log('blockArr::', blockArr);
    let mapData = JSON.parse(localStorage.getItem('mapData'));
    if(mapData){
      if (mapData.level >= 1 && mapData.level <= 5) {
        addMarkClustBlock(blockArr, setBlockClusterer, blockMarker, blockClusterermarkerImg, blockClustererImg, 4)
      } else if (mapData.level >= 6) {
        initBlockCluster();
        //setBlockArr([]);
        MapProductEls.updateBlock_zido({block_zido : []});
        MapProductEls.updateBlock({block: []});
      }
    }
  }, [blockArr]);

  // 마커/클러스터러 함수
  const addMarkClust = (array, setClusterer, markerImg, clustererImg, cluLevel, element_type) => {

    let mapData = JSON.parse(localStorage.getItem('mapData'));//마커 클러스터 생성시 각 마커별 크릭이벤트 등록. 클릭한 마커 위치조건 + 필터상태값+매물조건부검색.

    var imageSize = new kakao.maps.Size(40, 40),
      imageOption = { offset: new kakao.maps.Point(4, 4) };
    var markerImage = new kakao.maps.MarkerImage(markerImg, imageSize, imageOption);
    let markers = [];
    console.log('addmarkclust싈행::', array);
    if (array) {
      array.map(item => {
        const retrunLatLng = () => {
          if (element_type == "exclusive") {
            return new kakao.maps.LatLng(item.prd_latitude, item.prd_longitude)
          } else if (element_type == "probroker") {
            return new kakao.maps.LatLng(item.y, item.x)
          } else if (element_type == "around") {
            return new kakao.maps.LatLng(item.Ma, item.La)
          }
        }

        var markerEl = new kakao.maps.Marker({
          map: kakaoMap,
          position: retrunLatLng(),
          image: markerImage,
          opacity: 1
        })

        if (array.length < 400) { //마커의 개수(업뎃되는 그리는addMarkcluster)가 150개미만인 것들인 경우에만 클릭핸들러등록.150개이상인 충분히 지도의 레벨이 커져서 클러스터화가 많이 되어있고 그 클러스터안에 아주 많은 마커들이 존재할시에.. 이러한 상황에선 굳이 마커가 안보이고 클러스터만 보이는 레벨이기에, 이럴때는 굳이 마커에 핸들러등록과정 생략!
          kakao.maps.event.addListener(markerEl, 'click', async function () {
            console.log('>>>>클러스터 핸들러등록::', login_user);
            if (element_type == "exclusive") {
              setClickMarker({
                lat: item.prd_latitude,
                lng: item.prd_longitude,
                click_type: element_type,
                //id : item['info'].company_id
              });

              //마커 클릭시점 당시때의 맵데이터를 구합니다. 맵데이터 레벨,중심좌표값,화면크기,매물타입등.
              if (mapData) {
                var map_sendData = {
                  level: mapData.level,
                  lat: mapData.lat,
                  lng: mapData.lng,
                  screen_width: window.innerWidth,
                  screen_height: window.innerHeight,
                  prdtype_val: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',
                  isexclusive_val: mapRightRedux.isExclusive.is,
                  isprobroker_val: mapRightRedux.isProbroker.is,
                  isblock_val: mapRightRedux.isBlock.is
                }
              } else {
                var map_sendData = {
                  level: 3,
                  lat: 37.496463,
                  lng: 127.029358,
                  screen_width: window.innerWidth,
                  screen_height: window.innerHeight,
                  prdtype_val: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',
                  isexclusive_val: mapRightRedux.isExclusive.is,
                  isprobroker_val: mapRightRedux.isProbroker.is,
                  isblock_val: mapRightRedux.isBlock.is
                }
              }

              var reduxFilter = mapFilterRedux.filterUI;
              var reduxTextFilter = mapFilterRedux.filterArr;
              //if(!mapData){return};
              let type = 1;
              let roomTextArr = [];
              let isPark = 1;
              let isPet = 0;
              if (status == "apart") {
                type = 1
              } else if (status == "officetel") {
                type = 2
              } else if (status == "store") {
                type = 3
              } else if (status == "office") {
                type = 4
              }

              if (reduxTextFilter.room == "전체") {
                roomTextArr = null;
              } else {
                for (let i = 0; i < reduxTextFilter.room.length; i++) {
                  roomTextArr.push(reduxTextFilter.room[i]);
                }
              }
              if (status == "officetel") {
                isPark = reduxFilter.parkOfficetel;
              } else if (status == "store" || status == "office") {
                isPark = reduxFilter.parkStore;
              } else {
                isPark = null;
              }

              // ** api 사용시 유의사항
              // "전체"일경우에는 1을 넣지 마시고 null값을 넣어주세요!
              // roomStructure 는 숫자가 아닌 배열안에 문자열로 넣어주세요 ex) ["오픈형원룸", "분리형원룸"]
              var body_info = {
                prdType: type, // 건물 타입 1-아파트, 2-오피스텔, 3-상가, 4-사무실
                prdSelType: reduxFilter.prd_sel_type, // 거래 유형 1-매매, 2-전세, 3-월세 

                tradePriceMin: reduxFilter.priceRangeValue[0] == 0 ? null : reduxFilter.priceRangeValue[0] * 10000000, // 매매 최소
                tradePriceMax: reduxFilter.priceRangeValue[1] == 100 ? null : reduxFilter.priceRangeValue[1] * 10000000, // 매매 최대
                jeonsePriceMin: reduxFilter.jeonseRangeValue[0] == 0 ? null : jeonseTextfunc(reduxFilter.jeonseRangeValue[0]), // 전세금(보증금) 최소
                jeonsePriceMax: reduxFilter.jeonseRangeValue[1] == 30 ? null : jeonseTextfunc(reduxFilter.jeonseRangeValue[1]), // 전세금(보증금) 최대
                monthPriceMin: reduxFilter.monthlyRangeValue[0] == 0 ? null : monthlyTextfunc(reduxFilter.monthlyRangeValue[0]), // 월세 최소
                monthPriceMax: reduxFilter.monthlyRangeValue[1] == 18 ? null : monthlyTextfunc(reduxFilter.monthlyRangeValue[1]), // 월세 최대
                supplySpaceMin: reduxFilter.areaRangeValue[0] == 0 ? null : reduxFilter.areaRangeValue[0], // 공급면적 최소
                supplySpaceMax: reduxFilter.areaRangeValue[1] == 100 ? null : reduxFilter.areaRangeValue[1], // 공급면적 최대
                managementPriceMin: reduxFilter.manaRangeValue[0] == 0 ? null : reduxFilter.manaRangeValue[0] * 10000,
                managementPriceMax: reduxFilter.manaRangeValue[1] == 75 ? null : reduxFilter.manaRangeValue[1] * 10000,


                floor: reduxFilter.floor == "0" ? null : Number(reduxFilter.floor) + 1, // 층수
                roomCount: reduxFilter.roomApart == "0" ? null : Number(reduxFilter.roomApart) + 1, // 방수
                bathCount: reduxFilter.bath == "0" ? null : Number(reduxFilter.bath) + 1, // 욕실수
                isParking: isPark == 0 ? null : isPark, // 전용주차장 여부 1->있음,  0->없음
                isToilet: status !== "officetel" && status !== "apart" ? reduxFilter.toilet : null, // 전용 화장실 여부 1->있음,  0->없음
                isManagement: reduxFilter.manaStatus == 0 ? null : reduxFilter.manaStatus, // 관리비 여부 1->있음,  0->없음
                totalHousehold: reduxFilter.danji == "0" ? null : Number(reduxFilter.danji) + 1, // 총세대수 1-> 전체, 2 -> 200세대이상, 3 -> 500세대이상, 4 -> 1000세대이상, 5 -> 2000세대이상
                prdUsage: reduxFilter.purpose == "0" ? null : Number(reduxFilter.purpose) + 1, // 용도 1->전체, 2-> 주거용, 3-> 업무용
                roomStructure: roomTextArr, // 오픈형원룸, 분리형원룸, 원룸원거실, 투룸, 쓰리룸이상
                isDouble: reduxFilter.double == "0" ? null : reduxFilter.double, // 복층 2-> 복층,  1->단층

                isPet: status == "officetel" ? reduxFilter.pet == "0" ? null : Number(reduxFilter.pet) : null, // 반려동물 여부 1->있음,  0->없음 ㅠㅠㅠㅠ

                acceptUseDate: reduxFilter.use == "0" ? null : Number(reduxFilter.use) + 1, // 2-> 5년이내, 3->10년이내, 4-> 20년이내, 5->20년이상

                //zido_level:map_sendData.level,//지도레벨
                //origin_x:map_sendData.lng,//지도중심좌표
                //origin_y:map_sendData.lat,//지도중심좌표
                //screen_width:window.innerWidth,//화면크기
                //screen_height:window.innerHeight,
                prd_type: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',//매물타입 mapHEDER매물타입(아팥,오피,상가,사무실)
                isexclusive: mapRightRedux.isExclusive.is,//전속매물체크
                isprobroker: mapRightRedux.isProbroker.is,//전문중개사체크
                isblock: mapRightRedux.isBlock.is,//단지별실거래관련체크
                //mem_id:login_user.memid ? login_user.memid : 0
                lat: item.prd_latitude,
                lng: item.prd_longitude,
                click_type: element_type,
                mem_id: login_user.memid ? login_user.memid : 0
              }
              /*var body_info = {
                lat:item.prd_latitude,
                lng:item.prd_longitude,
                click_type : element_type,
               // id : item['info'].company_id
              }*/
            } else {
              //단지별실거래,전문중개사의 경우 x,y클릭한것 조건부만 검색.(필터,매물종류 이런것 없기에) 전문중개사의 경우 전달정보에 그 전문중개사 위치값xy만 간단전달.
              setClickMarker({
                lat: item.y,
                lng: item.x,
                click_type: element_type,
                //id : item['info'].company_id
              });

              var body_info = {
                lat: item.y,
                lng: item.x,
                click_type: element_type,
                // id : item['info'].company_id
              }

            }

            var res_results = await serverController.connectFetchController('/api/matterial/clickMarker_match_infoget', 'POST', JSON.stringify(body_info));
            console.log('res reusltsss:',res_results);
            if (res_results) {
              if (res_results.result) {
                if (element_type == 'probroker') {
                  //전문중개사 클릭한경우.전문중개사 list팝업을 띄웁니다.
                  //MapProductEls.updateProbroker({probroker: res_results.result});
                  probrokersidebarmodal.updateOpenstatus({ openstatus: 1 });
                  probrokersidebarmodal.updateProbroker({ probroker: res_results.result });

                  exculsivesidebarmodal.updateOpenstatus({ openstatus: 0 });
                  dangisidebarmodal.updateOpenstatus({ openstatus: 0 });

                  sidebarmodal.updateOpenstatus({ openstatus: 1 });
                  sidebarmodal.updateSidebartype({ sidebartype: 'probroker' });
                } else if (element_type == 'exclusive') {
                  //전속매물 클릭한경우. 전속매물 list팝업을 띄웁니다.
                  //MapProductEls.updateExclusive({exclusive: res_results.result});
                  //관련된 결과중에서 지도데이터 갱신은 안하고 조건부 만족하는 관련 매물들 만 리턴.사이드바 데이터.
                  exculsivesidebarmodal.updateOpenstatus({ openstatus: 1 });//열기 상태 스태이트로는 못하는.
                  exculsivesidebarmodal.updateExculsive({ exculsive: res_results.result });

                  probrokersidebarmodal.updateOpenstatus({ openstatus: 0 });
                  dangisidebarmodal.updateOpenstatus({ openstatus: 0 });

                  sidebarmodal.updateOpenstatus({ openstatus: 1 });
                  sidebarmodal.updateSidebartype({ sidebartype: 'exclusive' });
                }
              }
            }
          });
        }
        markers.push(markerEl);
      })
    }

    var clusterer = new kakao.maps.MarkerClusterer({
      map: kakaoMap,
      averageCenter: true,
      minLevel: cluLevel,
      disableClickZoom: true,
      calculator: [1, 50, 100],
      styles: [
        {
          width: '50px', height: '50px',
          backgroundImage: `url(${clustererImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '50px'
        },
        {
          width: '60px', height: '60px',
          backgroundImage: `url(${clustererImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '60px'
        },
        {
          width: '94px', height: '94px',
          backgroundImage: `url(${clustererImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '94px'
        }
      ]
    });

    clusterer.addMarkers(markers);

    kakao.maps.event.addListener(clusterer, 'clusterclick', function (cluster) {
      var latlng_object_array = [];
      for (let child = 0; child < cluster._markers.length; child++) {
        let local_coords = cluster._markers[child]['n'];
        let latlng_object = local_coords.toLatLng();
        latlng_object_array[child] = latlng_object;
      }

      //전속매물클러스텨,전문중개사클러스터 통용 centerCluster정보 state정보갱신. 클러스터 중심좌표값x,y 클러스터어떤유형의 클러스터인지.(전속매물or전문중개사) / 자식마커들의 latlng각도좌표계x,y값들리턴.
      setCenterClusterer({
        lat: cluster._center.toLatLng().Ma,
        lng: cluster._center.toLatLng().La,
        markerlist_latlng: latlng_object_array,
        click_type: element_type
      });
    });
    setClusterer(clusterer);//각 생성랜더링 함수상황별 전속매물 마커&클러스터clusterer생성, 전문중개사 마커&클러스터clustesre생성진행.
  }

  // 단지별 실거래 마커/클러스터러 함수
  const addMarkClustBlock = (array, setClusterer, markerImg, blockClusterermarkerImg, clustererImg, cluLevel) => {
    initBlockCluster();
    let markers = [];

    let imageSize = new kakao.maps.Size(50, 50),
      imageOption = { offset: new kakao.maps.Point(4, 4) };
    var markerImage = new kakao.maps.MarkerImage(blockClusterermarkerImg, imageSize, imageOption);

    console.log('===>addMarkClusterblock실행>>:', array);
    //단지별실거래의 경우 필터데이터,매물종류 데이터등 추가 데이터 필요없고, complex들만을 위한, 매물종류/필터조건부서식 추가로 붙는게없음.

    let mapData = JSON.parse(localStorage.getItem('mapData'));//맵데이터 맵 레벨에 따른 처리.

    if (array) {
      array.map(item => {

        if (mapData.level < cluLevel) {
          var create_content = document.createElement('DIV');

          let recent_transaction_year = item.contract_ym.substr(0, 4);//년도값.
          let recent_transaction_month = item.contract_ym.substr(4, 2);//월값.
          let recent_transaction_date = item.contract_dt;//일값. 최근 거래한 날짜를 기준으로한다.
          /*최근거래일날짜기준값이
          1. 3개월이내인경우   now_date - 3month < transaction   100%
          2. 3개월이상,6개월미만  now_date - 3month > trnasaction && now_date -6month < tarnsaction  85%
          3. 6개월이상, 9개월미만  now_date -9mnonth < transaciton && tranwsaction < now_date-6month    70%
          4. 9~ 12개월이상된것 now_date-12month < transaciton && transaciton < now_date-9month 55% 
          5. 12개월이상 transaction < tnowd-ate-12month  40%
          */
          let now_date = new Date();
          let threemonth_prev_date = now_date.setMonth(now_date.getMonth() - 3);//현재로부터 삼개월이전날짜 자동나옴.
          let sixmonth_prev_date = now_date.setMonth(now_date.getMonth() - 6);//육개월이전의 timestamp값으로 자돈나옴
          let ninemonth_prev_date = now_date.setMonth(now_date.getMonth() - 9);//구개월이전 teimstamp자동나옴
          let twelvemonth_prev_date = now_date.setMonth(now_date.getMonth() - 12);//12개월이전  timestamp자동나옴
          let transaction_date = new Date(recent_transaction_year + '-' + recent_transaction_month + '-' + recent_transaction_date);//최근거래한 날짜값 문자열형태 date형태 저장.
          console.log(threemonth_prev_date, sixmonth_prev_date, ninemonth_prev_date, twelvemonth_prev_date, transaction_date);

          create_content.innerHTML = `<p>` + item.contract_ym + item.contract_dt + `</p><p>` + item.type + item.deposit + `</p>`;

          if (threemonth_prev_date <= transaction_date) {
            //3개월이전(현재로부터)의 시간시점보다 더 큰값 더 미래의 더 이내의 최근내역에 해당하는 transction_date값 가진 내역은 100%
            //console.log('item별 최근거래일::',item.contract_ym+item.contract_dt+',최근거래일이 3개월이내인경우');
            create_content.className = 'markerWrap opacity100';
          } else if (sixmonth_prev_date < transaction_date && transaction_date < threemonth_prev_date) {
            //console.log('item별 최근거래일:',item.contract_ym+item.contract_dt+',최근거래일 3~6개월범위인경우');
            create_content.className = 'markerWrap opacity85';
          } else if (ninemonth_prev_date < transaction_date && transaction_date < sixmonth_prev_date) {
            //console.log('item별 최근거래일::',item.contract_ym+item.contract_dt+',최근거래일 6~9개월범위인경우');
            create_content.className = 'markerWrap opacity70';
          } else if (twelvemonth_prev_date < transaction_date && transaction_date < ninemonth_prev_date) {
            //console.log('item별 최근거래일::',item.contract_ym+item.contract_dt+',최근거래일 9~12개월범위인경우');
            create_content.className = 'markerWrap opacity55';
          } else if (transaction_date <= twelvemonth_prev_date) {
            //console.log('item별 최근거래일::',item.contract_ym+item.contract_dt+',12개월 이전경우');
            create_content.className = 'markerWrap opacity40';
          }

          var customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(item.y, item.x),
            content: create_content,
          });

          markers.push(customOverlay);
          customOverlay.setMap(kakaoMap);
        } else {
          var customOverlay = new kakao.maps.Marker({
            map: kakaoMap,
            position: new kakao.maps.LatLng(item.y, item.x),
            image: markerImage,
            opacity: 1
          });//마커이며, 모양만 달리한다. 마커일뿐이며, 클러스터와 모양을 기하학적으로 갖게하며 마커또한 단일요소1개 요소 마커일뿐임. 한개를 표현하는 클러스터같이 보이기도함(시각적)

          markers.push(customOverlay);
        }

        //카카오맵에 생성한 create_content관련 커스텀오버레이 개체요소(마커)를 그립니다. 맵에 랜더링합니다. 랜더링되는 콘텐츠의 수가 120개이하인 경우에만(마커들로 다 보이는 순간) , 마커들이 굳이 보이지 않는 순간엔. 굳이 안보이는 마커들(마커클릭발생일x)을 위한 핸들러 등록은 비효율적.
        if (array.length < 400) {
          //마커만 보이는 레벨인경우에만 관련 마커 클릭시 반응 핸들러 등록합니다.
          var async_func = async function () {
            setClickMarker({
              lat: item.y,//complex 오피아파트단지x,y 각도좌표위치값.
              lng: item.x,
              click_type: 'block'
            });
            MapProductEls.updateClickMarker({ clickMarker: { lat: item.y, lng: item.x, click_type: 'block', isclick: true } });

            let body_info = {
              lat: item.y,
              lng: item.x,
              click_type: 'block'
            }
            var res_results = await serverController.connectFetchController('/api/matterial/clickMarker_match_infoget', 'POST', JSON.stringify(body_info));

            if (res_results) {
              if (res_results.result) {
                //MapProductEls.updateBlock({block : res_results.result});
                dangisidebarmodal.updateOpenstatus({ openstatus: 1 });
                dangisidebarmodal.updateBlock({ block: res_results.result });

                probrokersidebarmodal.updateOpenstatus({ openstatus: 0 });
                exculsivesidebarmodal.updateOpenstatus({ openstatus: 0 });

                sidebarmodal.updateOpenstatus({ openstatus: 1 });
                sidebarmodal.updateSidebartype({ sidebartype: 'dangi' });
              }
            }
          };

          if (mapData.level < cluLevel) {

            create_content.addEventListener('click', async_func, false);//마커만 보이는 레벨에서만 craete_content지정한다.클러스터보이는 레벨부터는 관련실행x
          } else {
            kakao.maps.event.addListener(customOverlay, 'click', async_func);
          }
        }
      });
    }

    var clusterer = new kakao.maps.MarkerClusterer({
      map: kakaoMap,
      averageCenter: true,
      minLevel: cluLevel,
      disableClickZoom: true,
      calculator: [20, 50, 100],
      styles: [
        {
          width: '50px', height: '50px',
          backgroundImage: `url(${clustererImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '50px'
        },
        {
          width: '60px', height: '60px',
          backgroundImage: `url(${clustererImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '60px'
        },
        {
          width: '94px', height: '94px',
          backgroundImage: `url(${clustererImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '94px'
        }
      ]
    });
    clusterer.addMarkers(markers);
    kakao.maps.event.addListener(clusterer, 'clusterclick', function (cluster) {
      var latlng_object_array = [];
      for (let child = 0; child < cluster._markers.length; child++) {
        let child_marker = cluster._markers[child]['n'];//coords좌표값 반환.

        let local_coords = cluster._markers[child]['n'];
        let latlng_object = local_coords.toLatLng();
        latlng_object_array[child] = latlng_object;
      }

      setCenterClusterer({
        lat: cluster._center.toLatLng().Ma,
        lng: cluster._center.toLatLng().La,
        markerlist_latlng: latlng_object_array,
        click_type: 'block'
      })
    });
    setClusterer(clusterer);//proCluster,excClutser,blockCluster종류별,주변Cluster
  }

  //맵워커 클래스 생성자 및 관련 함수들.
  //지도위에 현재 로드뷰의 위치와 각도 표시하기 위한 mapWalker 아이콘 생성클래스 생성자함수.
  function MapWalker(position) {
    var content = document.createElement('div');
    var figure = document.createElement('div');
    var angleback = document.createElement('div');

    content.className = 'MapWalker';
    figure.className = 'figure';
    angleback.className = 'angleback';

    content.appendChild(angleback);
    content.appendChild(figure);

    var walker = new kakao.maps.CustomOverlay({
      position: position,
      content: content,
      yAnchor: 1
    });

    this.walker = walker;
    this.content = content;
  }
  //로드뷰의 pan값에 따라 mapwalker의 백그라운드 이미지를 변경시키는 함수 background로 사용할 sprite이미지에 따라 계산식은 달라질수있음
  MapWalker.prototype.setAngle = function (angle) {
    console.log('로드뷰 changeviewpoint시에 발생한다. 맵워커 각도설정처리');
    var threshold = 22.5;
    for (var i = 0; i < 16; i++) {
      if (angle > (threshold * i) && angle < (threshold * (i + 1))) {
        var className = 'm' + i;
        this.content.className = this.content.className.split(' ')[0];
        this.content.className += (' ' + className);
        break;
      }
    }
  };
  //mapWalker위치를 변경시키는 함수
  MapWalker.prototype.setPosition = function (position) {
    this.walker.setPosition(position);//인자로 지정한 latLng값을 워커객체에 반영 카카오맵상에서 반영이동.
  };
  //mapWalker를 지도위에 올리는 함수
  MapWalker.prototype.setMap = function (map) {
    this.walker.setMap(map);//인자로 전달받은 mapcontinare오브젝트에 올린다.
  };


  // 지도유형
  useEffect(() => {
    if (!kakaoMap) {
      return;
    }

    //var refer_map = localStorage.getItem('mapobject');//mapobject 참조가져온다.
    //console.log('mapright메뉴 변경::',refer_map);
    console.log('==>>>현재 mapobject state변수값 조회::', mapobject, roadviewmapwalker, roadViewRef);

    kakaoMap.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
    kakaoMap.removeOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);

    if (roadViewRef.current) {
      roadViewRef.current.style.display = 'none';
    }
    if (rvWrapperRef.current) {
      rvWrapperRef.current.style.pointerEvents = 'none';
    }
    if (roadViewModalRef.current) {
      roadViewModalRef.current.style.display = 'none';
    }

    if (mapRightRedux.mapStyle == "roadView") {
      console.log('==>>>roadView상태로의 변경::', mapobject);
      if (roadViewRef.current) {
        //모바일일때만 존재.
        console.log('모바일일때 존재한느 개체:',roadViewRef);
        var rv = new kakao.maps.Roadview(roadViewRef.current); //로드뷰 객체
      }
      if (roadViewRefsss.current) {
        //피시일때만 존재
        var rv2 = new kakao.maps.Roadview(roadViewRefsss.current);//로드뷰 모달형객체
      }
      var rvClient = new kakao.maps.RoadviewClient();//피시모바일공통.
      var mapCenter = new kakao.maps.LatLng(37.511138, 126.997544);

      var markImage = new kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
        new kakao.maps.Size(26, 46),
        {
          spriteSize: new kakao.maps.Size(1666, 168),
          spriteOrigin: new kakao.maps.Point(705, 114),
          offset: new kakao.maps.Point(13, 46)
        }
      );

      let markers = [];
      var rvMarker = new kakao.maps.Marker({
        image: markImage,
        draggable: true,
        map: kakaoMap,
        position: new kakao.maps.LatLng(37.511138, 126.997544)
      });

      markers.push(rvMarker);
      var clusterer = new kakao.maps.MarkerClusterer({
        map: kakaoMap,
        averageCenter: true,
        minLevel: 1,
        disableClickZoom: true,
      });
      clusterer.addMarkers(markers);
      setRoadClusterer(clusterer);//rvMaker및 클러스터형태.형식 클러스터>로드뷰마커.
      // console.log('===>>roadview 지도유형 선택하여 실행 함수 구문 rvmarkers설정 및 markers정보:',markers,clusterer);

      var mapwalker = null;

      //로드뷰의 초기화되었을때 mapwalker를 생성한다.(rv:mobile)
      if (rv && roadViewRef.current) {
        kakao.maps.event.addListener(rv, 'init', function () {
          console.log('로드뷰 초기화 이벤트 발생???:', rv);
          //map walker를 생성한다.생성시 지도의 중심좌표를 넘긴다.
          mapwalker = new MapWalker(mapCenter);
          mapwalker.setMap(mapobject);
          setroadviewmapwalker(mapwalker);//맵워커 설정 state지정. 맵>로드뷰overlay wrapper>>로드뷰마커클러스터,로드뷰맵워커 맵right메뉴 우측메뉴 로드뷰메뉴 변경하고, 로드뷰누를시마다 활성화초기화될시마다 갱신으로 맵워커 및 로드뷰마커클러스터 생성 초기화.
          console.log('mapobject 참조::', mapobject, mapwalker);
          //모바일일떄는 rv에 대해서만 관련 핸들러 등록
          //로드뷰 초기화된 후  추가이벤트 등록, 로드뷰 상하좌우ㅇ줌인줌아웃을 할경우발생한다. 로드뷰 조작할때 발생하는 값을 받아 mapwalker의 상태를 변경해준다.
          kakao.maps.event.addListener(rv, 'viewpoint_changed', function () {
            var viewpoint = rv.getViewpoint();
            console.log('viewpoint changed로드뷰 이벤트 발생::', viewpoint);
            mapwalker.setAngle(viewpoint.pan);//지도변화로 넘어온 각도회전값 0~360각도값을 전달한다.

            kakao.maps.event.removeListener(rv, 'viewpoint_changed');
          });

          //로드뷰내에 화살표나 점프를 하였을때 발생한다. 포지션값이 바뀔때마다 mapWlaker상태 변경해준다.
          kakao.maps.event.addListener(rv, 'position_changed', function () {
            //이벤트가 발생할때마다 로드뷰 포지션값을 읽어 mapwalker에 반영
            var position = rv.getPosition();
            console.log('position changed이벤트발생:::', position);
            mapwalker.setPosition(position);
            mapobject.setCenter(position);//전역변수참조하고있는 맵(로드된)에 중심좌표위치를 이동함.

            kakao.maps.event.removeListener(rv, 'position_changed');
          });
          kakao.maps.event.removeListener(rv, 'init');
        })
      }
      if (rv2 && roadViewRefsss.current) {
        kakao.maps.event.addListener(rv2, 'init', function () {
          console.log('로드뷰초기화이벤트 발생 피시:', rv2);
          //map walker를 생성한다.생성시 지도의 중심좌표를 넘긴다.
          mapwalker = new MapWalker(mapCenter);
          mapwalker.setMap(mapobject);
          setroadviewmapwalker(mapwalker);//맵워커 설정 state지정. 맵>로드뷰overlay wrapper>>로드뷰마커클러스터,로드뷰맵워커 맵right메뉴 우측메뉴 로드뷰메뉴 변경하고, 로드뷰누를시마다 활성화초기화될시마다 갱신으로 맵워커 및 로드뷰마커클러스터 생성 초기화.
          console.log('mapobject 참조::', mapobject, mapwalker);
          //피시일떄는 rv2에대해서만 관련 핸들러 등록.
          //로드뷰 초기화된 후  추가이벤트 등록, 로드뷰 상하좌우ㅇ줌인줌아웃을 할경우발생한다. 로드뷰 조작할때 발생하는 값을 받아 mapwalker의 상태를 변경해준다.
          kakao.maps.event.addListener(rv2, 'viewpoint_changed', function () {
            var viewpoint = rv2.getViewpoint();
            console.log('viewpoint changed로드뷰 이벤트 발생::', viewpoint);
            mapwalker.setAngle(viewpoint.pan);//지도변화로 넘어온 각도회전값 0~360각도값을 전달한다.

            kakao.maps.event.removeListener(rv2, 'viewpoint_changed');
          });
          //로드뷰내에 화살표나 점프를 하였을때 발생한다. 포지션값이 바뀔때마다 mapWlaker상태 변경해준다.
          kakao.maps.event.addListener(rv2, 'position_changed', function () {
            //이벤트가 발생할때마다 로드뷰 포지션값을 읽어 mapwalker에 반영
            var position = rv2.getPosition();
            console.log('position changed이벤트발생:::', position);
            mapwalker.setPosition(position);
            mapobject.setCenter(position);//전역변수참조하고있는 맵(로드된)에 중심좌표위치를 이동함.

            kakao.maps.event.removeListener(rv2, 'position_changed');
          });
          kakao.maps.event.removeListener(rv2, 'init');
        })
      }

      var clickHandler = function (mouseEvent) {
        var position = mouseEvent.latLng;
        // console.log('로드뷰 지도유형상태값 상태에서 카카오맵 임의지점 클릭핸들러:',position);
        rvMarker.setPosition(position);//rvMarker 위치지정.
        toggleRoadview(position);
      };

      function toggleRoadview(position) {
        // console.log('=====>>toggleRoadview함수실행>>:',position);
        rvClient.getNearestPanoId(position, 50, function (panoId) {
          console.log('rvCLIENT 클릭지점 근처의 파노라마id값 관련 콜백함수실행>>:', panoId);
          if (panoId === null) {
            if (roadViewRef.current) {
              roadViewRef.current.style.display = 'none';
              rvWrapperRef.current.style.pointerEvents = 'none';
            }
            if (roadViewModalRef.current) {
              roadViewModalRef.current.style.display = 'none';
            }

            kakaoMap.relayout();
          } else {
            kakaoMap.relayout();
            if (roadViewRef.current) {
              roadViewRef.current.style.display = 'block';
              rvWrapperRef.current.style.pointerEvents = 'auto';
              rv.setPanoId(panoId, position);
              rv.relayout();
            }
            if (roadViewModalRef.current) {
              roadViewModalRef.current.style.display = 'block';

              rv2.setPanoId(panoId, position);
              rv2.relayout();
            }
          }
        });
      }
    }

    kakao.maps.event.removeListener(kakaoMap, 'click');//지도 상태 변경시에 click모든 핸들러 해제한다.

    console.log('mapStyless것들::', mapRightRedux.mapStyle);
    switch (mapRightRedux.mapStyle) {

      case "roadmap":
        kakaoMap.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
        if (roadviewmapwalker && roadviewmapwalker.setMap) {
          console.log('mapwalkerss:', roadviewmapwalker);
          roadviewmapwalker.setMap(null);//맵워커 제거합니다.
        }
        setRoadClusterer(clusterer => {
          if (clusterer && clusterer.clear) {
            clusterer.clear();
          }
          return clusterer;
        });
        break;
      case "district":
        kakaoMap.addOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
        if (roadviewmapwalker && roadviewmapwalker.setMap) {
          console.log('mapwalkerss:', roadviewmapwalker);
          roadviewmapwalker.setMap(null);//맵워커 제거합니다.
        }
        setRoadClusterer(clusterer => {
          if (clusterer && clusterer.clear) {
            clusterer.clear();
          }
          return clusterer;
        })
        break;
      case "hybrid":
        kakaoMap.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
        if (roadviewmapwalker && roadviewmapwalker.setMap) {
          console.log('mapwalkerss:', roadviewmapwalker);
          roadviewmapwalker.setMap(null);//맵워커 제거합니다.
        }
        setRoadClusterer(clusterer => {
          if (clusterer && clusterer.clear) {
            clusterer.clear();
          }
          return clusterer;
        })
        break;
      case "roadView":
        kakao.maps.event.addListener(kakaoMap, 'click', clickHandler);
        /*const noRv = document.querySelectorAll(".noRv");
        if(noRv){
          for(let s=0; s<noRv.length; s++){
            noRv[s].onClick = function() {
              console.log('로드뷰가 아닌 개체 클릭시 발생 핸들러, 카카오맵 로드뷰클릭핸들러 해제처리');
              kakao.maps.event.removeListener(kakaoMap, 'click', clickHandler);
              setRoadClusterer(clusterer => { clusterer.clear(); return clusterer; });
              //관련 각 개체들 개별적 핸들러 걸고, 다른것 클릭순간 카카오맵 클릭(로드뷰관련) 이벤트 지운다. 그러다 다시 로드맵누르면 다시 카카오맵 클릭핸들러지정, 다른것들에 전통방식 온클릭지정(핸들러 여러개 안쌓이고 덮어씌워진다.)
            }
          }
        } */       
        kakaoMap.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
        break;
      default:
        kakaoMap.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
        if (roadviewmapwalker && roadviewmapwalker.setMap) {
          console.log('mapwalkerss:', roadviewmapwalker);
          roadviewmapwalker.setMap(null);//맵워커 제거합니다.
        }
        setRoadClusterer(clusterer => {
          if (clusterer && clusterer.clear) {
            clusterer.clear();
          }
          return clusterer;
        })
        break;
    }
  }, [mapRightRedux.mapStyle, kakaoMap])


  // 클러스터러 클릭
  // **api 선택한 클러스터러의 좌표를 서버에 보내고 해당 목록 데이터를 받아와야합니다.
  // 목록 데이터는 mapProductEl 저장하여 화면에 띄어야 합니다. 
  useEffect(async () => {
    // console.log('클러스터러 클릭 centerCluSTER STATE변경시에 호출:',centerClusterer);

    //전문중개사,전속매물,단지별실거래 클러스터 어떤 유형을 클릭하게된건지.
    var click_type_val = centerClusterer['click_type'];//cetnerCluster클릭한 클러슽의 타입클릭타입
    if (click_type_val == 'exclusive') {
      let mapData = JSON.parse(localStorage.getItem('mapData'));

      //마커 클릭시점 당시때의 맵데이터를 구합니다. 맵데이터 레벨,중심좌표값,화면크기,매물타입등.
      if (mapData) {
        var map_sendData = {
          level: mapData.level,
          lat: mapData.lat,
          lng: mapData.lng,
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
          prdtype_val: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',//매물타입
          isexclusive_val: mapRightRedux.isExclusive.is,//전속매물체크
          isprobroker_val: mapRightRedux.isProbroker.is,//전문중개사체크여부
          isblock_val: mapRightRedux.isBlock.is
        }
      } else {
        var map_sendData = {
          level: 3,
          lat: 37.496463,
          lng: 127.029358,
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
          prdtype_val: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',
          isexclusive_val: mapRightRedux.isExclusive.is,
          isprobroker_val: mapRightRedux.isProbroker.is,
          isblock_val: mapRightRedux.isBlock.is
        }
      }

      var reduxFilter = mapFilterRedux.filterUI;
      var reduxTextFilter = mapFilterRedux.filterArr;
      //if(!mapData){return};
      let type = 1;
      let roomTextArr = [];
      let isPark = 1;
      let isPet = 0;
      if (status == "apart") {
        type = 1
      } else if (status == "officetel") {
        type = 2
      } else if (status == "store") {
        type = 3
      } else if (status == "office") {
        type = 4
      }

      if (reduxTextFilter.room == "전체") {
        roomTextArr = null;
      } else {
        for (let i = 0; i < reduxTextFilter.room.length; i++) {
          roomTextArr.push(reduxTextFilter.room[i]);
        }
      }
      if (status == "officetel") {
        isPark = reduxFilter.parkOfficetel;
      } else if (status == "store" || status == "office") {
        isPark = reduxFilter.parkStore;
      } else {
        isPark = null;
      }

      // ** api 사용시 유의사항
      // "전체"일경우에는 1을 넣지 마시고 null값을 넣어주세요!
      // roomStructure 는 숫자가 아닌 배열안에 문자열로 넣어주세요 ex) ["오픈형원룸", "분리형원룸"]
      var body_info = {
        prdType: type, // 건물 타입 1-아파트, 2-오피스텔, 3-상가, 4-사무실
        prdSelType: reduxFilter.prd_sel_type, // 거래 유형 1-매매, 2-전세, 3-월세 

        tradePriceMin: reduxFilter.priceRangeValue[0] == 0 ? null : reduxFilter.priceRangeValue[0] * 10000000, // 매매 최소
        tradePriceMax: reduxFilter.priceRangeValue[1] == 100 ? null : reduxFilter.priceRangeValue[1] * 10000000, // 매매 최대
        jeonsePriceMin: reduxFilter.jeonseRangeValue[0] == 0 ? null : jeonseTextfunc(reduxFilter.jeonseRangeValue[0]), // 전세금(보증금) 최소
        jeonsePriceMax: reduxFilter.jeonseRangeValue[1] == 30 ? null : jeonseTextfunc(reduxFilter.jeonseRangeValue[1]), // 전세금(보증금) 최대
        monthPriceMin: reduxFilter.monthlyRangeValue[0] == 0 ? null : monthlyTextfunc(reduxFilter.monthlyRangeValue[0]), // 월세 최소
        monthPriceMax: reduxFilter.monthlyRangeValue[1] == 18 ? null : monthlyTextfunc(reduxFilter.monthlyRangeValue[1]), // 월세 최대
        supplySpaceMin: reduxFilter.areaRangeValue[0] == 0 ? null : reduxFilter.areaRangeValue[0], // 공급면적 최소
        supplySpaceMax: reduxFilter.areaRangeValue[1] == 100 ? null : reduxFilter.areaRangeValue[1], // 공급면적 최대
        managementPriceMin: reduxFilter.manaRangeValue[0] == 0 ? null : reduxFilter.manaRangeValue[0] * 10000,
        managementPriceMax: reduxFilter.manaRangeValue[1] == 75 ? null : reduxFilter.manaRangeValue[1] * 10000,


        floor: reduxFilter.floor == "0" ? null : Number(reduxFilter.floor) + 1, // 층수
        roomCount: reduxFilter.roomApart == "0" ? null : Number(reduxFilter.roomApart) + 1, // 방수
        bathCount: reduxFilter.bath == "0" ? null : Number(reduxFilter.bath) + 1, // 욕실수
        isParking: isPark == 0 ? null : isPark, // 전용주차장 여부 1->있음,  0->없음
        isToilet: status !== "officetel" && status !== "apart" ? reduxFilter.toilet : null, // 전용 화장실 여부 1->있음,  0->없음
        isManagement: reduxFilter.manaStatus == 0 ? null : reduxFilter.manaStatus, // 관리비 여부 1->있음,  0->없음
        totalHousehold: reduxFilter.danji == "0" ? null : Number(reduxFilter.danji) + 1, // 총세대수 1-> 전체, 2 -> 200세대이상, 3 -> 500세대이상, 4 -> 1000세대이상, 5 -> 2000세대이상
        prdUsage: reduxFilter.purpose == "0" ? null : Number(reduxFilter.purpose) + 1, // 용도 1->전체, 2-> 주거용, 3-> 업무용
        roomStructure: roomTextArr, // 오픈형원룸, 분리형원룸, 원룸원거실, 투룸, 쓰리룸이상
        isDouble: reduxFilter.double == "0" ? null : reduxFilter.double, // 복층 2-> 복층,  1->단층

        isPet: status == "officetel" ? reduxFilter.pet == "0" ? null : Number(reduxFilter.pet) : null, // 반려동물 여부 1->있음,  0->없음 ㅠㅠㅠㅠ

        acceptUseDate: reduxFilter.use == "0" ? null : Number(reduxFilter.use) + 1, // 2-> 5년이내, 3->10년이내, 4-> 20년이내, 5->20년이상

        //zido_level:map_sendData.level,//지도레벨
        //origin_x:map_sendData.lng,//지도중심좌표
        //origin_y:map_sendData.lat,//지도중심좌표
        //screen_width:window.innerWidth,//화면크기
        //screen_height:window.innerHeight,
        prd_type: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',//매물타입 mapHEDER매물타입(아팥,오피,상가,사무실)
        isexclusive: mapRightRedux.isExclusive.is,//전속매물체크
        isprobroker: mapRightRedux.isProbroker.is,//전문중개사체크
        isblock: mapRightRedux.isBlock.is,//단지별실거래관련체크
        //mem_id:login_user.memid ? login_user.memid : 0

        click_type: click_type_val,//클릭 클러스터 타입.
        markerlist_latlng: centerClusterer['markerlist_latlng'],
        prdtype_val: mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',
        mem_id: login_user.memid ? login_user.memid : 0
      }
    } else {
      var body_info = {
        click_type: click_type_val,//클릭타입
        markerlist_latlng: centerClusterer['markerlist_latlng']//자식 마커들 latlng좌표값들. 단지별실거래클러스터, 전문중개사클러스터의 경우 그 위치값으로만 조회한다.
      }
    }

    var send_results = await serverController.connectFetchController('/api/matterial/clickCluster_match_infoget', 'POST', JSON.stringify(body_info));

    if (send_results) {
      if (send_results.result) {

        if (click_type_val == 'probroker') {
          //MapProductEls.updateProbroker({probroker : send_results.result});
          probrokersidebarmodal.updateOpenstatus({ openstatus: 1 });
          probrokersidebarmodal.updateProbroker({ probroker: send_results.result });

          exculsivesidebarmodal.updateOpenstatus({ openstatus: 0 });
          dangisidebarmodal.updateOpenstatus({ openstatus: 0 });

          sidebarmodal.updateOpenstatus({ openstatus: 1 });
          sidebarmodal.updateSidebartype({ sidebartype: 'probroker' });
        } else if (click_type_val == 'exclusive') {
          exculsivesidebarmodal.updateOpenstatus({ openstatus: 1 });
          exculsivesidebarmodal.updateExculsive({ exculsive: send_results.result });
          //MapProductEls.updateExclusive({exclusive : send_results.result});

          probrokersidebarmodal.updateOpenstatus({ openstatus: 0 });
          dangisidebarmodal.updateOpenstatus({ openstatus: 0 });

          sidebarmodal.updateOpenstatus({ openstatus: 1 });
          sidebarmodal.updateSidebartype({ sidebartype: 'exclusive' });
        } else if (click_type_val == 'block') {
          dangisidebarmodal.updateOpenstatus({ openstatus: 1 });
          dangisidebarmodal.updateBlock({ block: send_results.result });
          //MapProductEls.updateBlock({block : send_results.result});

          probrokersidebarmodal.updateOpenstatus({ openstatus: 0 });
          exculsivesidebarmodal.updateOpenstatus({ openstatus: 0 });

          sidebarmodal.updateOpenstatus({ openstatus: 1 });
          sidebarmodal.updateSidebartype({ sidebartype: 'dangi' });
        }
      }
    }
  }, [centerClusterer])

  // 마커 클릭
  // **api 선택한 마커의 좌표 혹은 아이디를 서버에 보내고 해당 데이터를 받아와야합니다.
  useEffect(() => {
    // // console.log(clickMarker);
  }, [clickMarker])

  // 줌인
  useEffect(() => {
    if (mapRightRedux.isZoomIn == 0) {
      return;
    }
    kakaoMap && kakaoMap.setLevel(kakaoMap.getLevel() - 1);
  }, [mapRightRedux.isZoomIn]);

  // 줌아웃
  useEffect(() => {
    if (mapRightRedux.isZoomOut == 0) {
      return;
    }
    kakaoMap &&  kakaoMap.setLevel(kakaoMap.getLevel() + 1);
  }, [mapRightRedux.isZoomOut]);

  // 주변
  useEffect(() => {
    // console.log('===>>>mapRightRedux.around 변화에따른 감지::',mapRightRedux.around);
    if (!kakaoMap || mapRightRedux.around.is == "") {
      return;
    }
    const searchPlace = () => {
      // console.log('===>>searchPlace함수실행 주변검색 주변의 시설검색::');
      setAroundClusterer(clusterer => { if (!clusterer) { return; } clusterer.clear(); return clusterer; });
      places.categorySearch(mapRightRedux.around.is, callback, {
        location: new kakao.maps.LatLng(kakaoMap.getCenter().Ma, kakaoMap.getCenter().La)
      });
    }

    const aroundBuild = document.querySelector("#aroundBuild");
    kakao.maps.event.addListener(kakaoMap, 'idle', searchPlace);
    aroundBuild.addEventListener("click", () => {
      kakao.maps.event.removeListener(kakaoMap, 'idle', searchPlace);
      setAroundArr([]);
    })

    var places = new kakao.maps.services.Places(kakaoMap);
    // console.log('places::',places);

    var callback = function (data, status, pagination) {
      // console.log('==>>searhcplace> categorySDearch callbackfucntion call',data);
      if (status === kakao.maps.services.Status.OK) {
        let newArr = [];
        data.map(item => {
          newArr.push(new kakao.maps.LatLng(item.y, item.x));
        })
        setAroundArr(newArr);
      }
    };

    searchPlace()
  }, [mapRightRedux.around, kakaoMap])

  // 주변 업데이트
  useEffect(() => {
    //// console.log('===>>>arouindArr,맵변경,idle,around>>>');
    if (!kakaoMap) { return; }

    setAroundClusterer(clusterer => { if (!clusterer) { return; } clusterer.clear(); return clusterer; });
    switch (mapRightRedux.around.is) {
      case "PS3":
        addMarkClust(aroundArr, setAroundClusterer, childMarker, "", 99, "around")
        break;
      case "SC4":
        addMarkClust(aroundArr, setAroundClusterer, schoolMarker, "", 99, "around")
        break;
      case "SW8":
        addMarkClust(aroundArr, setAroundClusterer, subwayMarker, "", 99, "around")
        break;
      case "BK9":
        addMarkClust(aroundArr, setAroundClusterer, bankMarker, "", 99, "around")
        break;
      case "PO3":
        addMarkClust(aroundArr, setAroundClusterer, officeMarker, "", 99, "around")
        break;
      default:
        setAroundClusterer(clusterer => { if (!clusterer) { return; } clusterer.clear(); return clusterer; });
        break;
    }
  }, [mapRightRedux.around, aroundArr, kakaoMap])

  // 내위치
  useEffect(() => {
    console.log('내위치변화시에!!!:',mapRightRedux.isCurrnet.is)
    if (!kakaoMap) { return; }
    if (mapRightRedux.isCurrnet.is) {
      console.log('위치허용시에!!!:',mapRightRedux.isCurrnet.is);
      function displayMarker(locPosition) {
        let markers = [];
        var marker = new kakao.maps.Marker({
          map: kakaoMap,
          position: locPosition
        });
        markers.push(marker);

        var clusterer = new kakao.maps.MarkerClusterer({
          map: kakaoMap,
          averageCenter: true,
          minLevel: 1,
          disableClickZoom: true,
        });
        clusterer.addMarkers(markers);
        setCurrnetClusterer(clusterer);
        kakaoMap.setCenter(locPosition);
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          console.log('내위치 관련 위치:', position);
          var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
          var locPosition = new kakao.maps.LatLng(lat, lon);
          displayMarker(locPosition);
        });

        // 현재 위치 추적
        navigator.geolocation.watchPosition(
          (success) => {
            setCurrnetClusterer(clusterer => { if (!clusterer) { return } clusterer.clear(); return clusterer; })
            var lat = success.coords.latitude, // 위도
              lon = success.coords.longitude; // 경도
            var locPosition = new kakao.maps.LatLng(lat, lon);
            console.log("위치 이동 감지");
            displayMarker(locPosition);
          },
          (error) => {
            console.log(error)
          }
        );

      } else {
        alert("navigator.geolocation 지원하지 않음")
      }
    } else {
      setCurrnetClusterer(clusterer => { if (!clusterer) { return } clusterer.clear(); return clusterer; })
    }
  }, [mapRightRedux.isCurrnet, kakaoMap])



  // 거리재기
  useEffect(() => {
    console.log('==>>mapright.istinace.is상태값변경 거리재기right요소 변경시마다 실행:거래재기상태값false이면 카카오맵핸들러click,mousemove미등록',moveLine,mapRightRedux);
    if (!kakaoMap || !mapRightRedux.isDistance.is) { return }

    if (mapRightRedux.isDistance.is) {
      kakao.maps.event.addListener(kakaoMap, 'click', clickMap);
      kakao.maps.event.addListener(kakaoMap, 'mousemove', moveMouse);
      const distance = document.querySelector(".distance");
      distance.addEventListener("click", () => {
        console.log('distance요소 클릭한경우에 카카오맵에 있는 클릭맵,마우스무브이벤트 핸들러 제거한다,무브라인 제거한다')
        kakao.maps.event.removeListener(kakaoMap, 'click', clickMap);
        kakao.maps.event.removeListener(kakaoMap, 'mousemove', moveMouse);
        if (moveLine) {
          moveLine.setMap(null);
          moveLine = null;
        }
        initLineDot();
      })
    }

    const distanceEnd = document.querySelector(".distanceEnd");
    if(distanceEnd){
      distanceEnd.addEventListener("click", () => {
        // 지도 오른쪽 클릭 이벤트가 발생했는데 선을 그리고있는 상태이면
         console.log('distanceEnd거리측정 버튼 클릭시에 실행 이벤트핸들러:',drawingFlag,moveLine);
        if (drawingFlag && moveLine) {
          // 마우스무브로 그려진 선은 지도에서 제거합니다
          moveLine.setMap(null);
          moveLine = null;
          // 마우스 클릭으로 그린 선의 좌표 배열을 얻어옵니다
          var path = clickLine.getPath();
          // console.log('마지막클릭까지의 클릭좌표들값 불러오기:',path);
  
          // 선을 구성하는 좌표의 개수가 2개 이상이면
          if (path.length > 1) {
  
            // 마지막 클릭 지점에 대한 거리 정보 커스텀 오버레이를 지웁니다
            if (dots[dots.length - 1].distance) {
              dots[dots.length - 1].distance.setMap(null);
              dots[dots.length - 1].distance = null;
            }
  
            var distance = Math.round(clickLine.getLength()), // 선의 총 거리를 계산합니다
              content = getTimeHTML(distance); // 커스텀오버레이에 추가될 내용입니다
  
            // 그려진 선의 거리정보를 지도에 표시합니다
            showDistance(content, path[path.length - 1]);
          } else {
            initLineDot();
          }
          // 상태를 false로, 그리지 않고 있는 상태로 변경합니다
          drawingFlag = false;
        }
      })
    }
  
    // Click
    function clickMap(mouseEvent) {
       //console.log("clickMap function call:");
      var clickPosition = mouseEvent.latLng;
      // 첫 클릭
      if (!drawingFlag) {
        drawingFlag = true;

        initLineDot();

        // 클린 라인 스타일링
        clickLine = new kakao.maps.Polyline({
          map: kakaoMap,
          path: [clickPosition],
          strokeWeight: 3,
          strokeColor: '#db4040',
          strokeOpacity: 1,
          strokeStyle: 'solid'
        });

        moveLine = new kakao.maps.Polyline({
          strokeWeight: 3,
          strokeColor: '#db4040',
          strokeOpacity: 0.5,
          strokeStyle: 'solid'
        });
        displayCircleDot(clickPosition, 0);
      } else {  // 첫 클릭 X
        var path = clickLine.getPath();  // clickLine의 좌표배열을 가져온다.
        // console.log('첫클릭clikcmamp아님 클릭한 좌표배열 가져오기:',path);
        path.push(clickPosition); // 클릭 좌표를 넣는다.
        clickLine.setPath(path); // 패스를 설정한다.
        var distance = Math.round(clickLine.getLength()); // 거리 계산
        displayCircleDot(clickPosition, distance); // 점, 거리 스타일링
      }
    }

    // Move
    function moveMouse(mouseEvent) {
      //console.log('mouseMove call executes!!!');
      if (drawingFlag) {
        var mousePosition = mouseEvent.latLng;
        // console.log('====>mousemove이벤트 발생>>>>',drawingFlag,clickLine,clickLine.getPath());
        // 마지막과 현재 좌표를 가져와 연결한다.
        var path = clickLine.getPath();
        var movepath = [path[path.length - 1], mousePosition];
        moveLine.setPath(movepath);
        moveLine.setMap(kakaoMap);

        var distance = Math.round(clickLine.getLength() + moveLine.getLength()), // 선의 총 거리를 계산합니다
          content = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m</div>'; // 커스텀오버레이에 추가될 내용입니다
        showDistance(content, mousePosition);
      }
    }

    // Init
    function initLineDot() {
      // console.log('initilinedot실행 초기함수:',clickLine,distanceOverlay,dots);
      if (clickLine) {
        clickLine.setMap(null);
        clickLine = null;
      }

      if (distanceOverlay) {
        distanceOverlay.setMap(null);
        distanceOverlay = null;
      }

      var i;
      for (i = 0; i < dots.length; i++) {
        if (dots[i].circle) {
          dots[i].circle.setMap(null);
        }

        if (dots[i].distance) {
          dots[i].distance.setMap(null);
        }
      }

      dots = [];
    }

    // Measure Distance Time
    function getTimeHTML(distance) {
      // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
      var walkkTime = distance / 67 | 0;
      var walkHour = '', walkMin = '';

      // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
      if (walkkTime > 60) {
        walkHour = '<span class="number">' + Math.floor(walkkTime / 60) + '</span>시간 '
      }
      walkMin = '<span class="number">' + walkkTime % 60 + '</span>분'

      // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
      var bycicleTime = distance / 227 | 0;
      var bycicleHour = '', bycicleMin = '';

      // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
      if (bycicleTime > 60) {
        bycicleHour = '<span class="number">' + Math.floor(bycicleTime / 60) + '</span>시간 '
      }
      bycicleMin = '<span class="number">' + bycicleTime % 60 + '</span>분'

      // 거리와 도보 시간, 자전거 시간을 가지고 HTML Content를 만들어 리턴합니다
      var content = '<ul class="dotOverlay distanceInfo">';
      content += '    <li>';
      content += '        <span class="label">총거리</span><span class="number">' + distance + '</span>m';
      content += '    </li>';
      content += '    <li>';
      content += '        <span class="label">도보</span>' + walkHour + walkMin;
      content += '    </li>';
      content += '    <li>';
      content += '        <span class="label">자전거</span>' + bycicleHour + bycicleMin;
      content += '    </li>';
      content += '</ul>'
      return content;
    }

    // Dot Custom Overay
    function displayCircleDot(position, distance) {
      // console.log('=>>>displayCircleodot function calls: mouseClickmap에 의해 촉발',position,distance);
      var circleOverlay = new kakao.maps.CustomOverlay({
        content: `<div class="dot"></div>`,
        position: position,
        zIndex: 4
      });
      circleOverlay.setMap(kakaoMap);

      if (distance > 0) {
        // 클릭한 지점까지의 거리 계산 
        var distanceOverlay = new kakao.maps.CustomOverlay({
          content: '<div class="dotOverlay">거리 <span class="number">' + distance + '</span>m</div>',
          position: position,
          yAnchor: 1,
          zIndex: 2
        });
        // 지도에 표시합니다
        distanceOverlay.setMap(kakaoMap);
      }

      // 배열에 추가합니다
      dots.push({ circle: circleOverlay, distance: distanceOverlay });
      // console.log('update된 점좌표들 dots::',dots);
    }

    // Move Custom Overay
    function showDistance(content, position) {
      // console.log('=-==>>mousemove function에 or 마지막거리측정(end)클릭에 의해 촉발된 showdistance:',content,position);
      if (distanceOverlay) { // 커스텀오버레이가 생성된 상태이면
        // console.log('distanceoverlay prev 생성상태:',distanceOverlay)
        // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
        distanceOverlay.setPosition(position);
        distanceOverlay.setContent(content);
      } else { // 커스텀 오버레이가 생성되지 않은 상태이면
        // 커스텀 오버레이를 생성하고 지도에 표시합니다
        // console.log('distanceoverlay prev 미생성 없는 상태:',distanceOverlay);
        distanceOverlay = new kakao.maps.CustomOverlay({
          map: kakaoMap, // 커스텀오버레이를 표시할 지도입니다
          content: content,  // 커스텀오버레이에 표시할 내용입니다
          position: position, // 커스텀오버레이를 표시할 위치입니다.
          xAnchor: 0,
          yAnchor: 0,
          zIndex: 3
        });
      }
    }

  }, [mapRightRedux.isDistance, kakaoMap])

  return (
    <SuperContainer>
      <KakaoMapContainer id="container" ref={container} />
      {/*<PC>
        <RoadViewModalDiv ref={roadViewModalRef}>
          <DraggableResizeModal
            title={'거리뷰'}
            open={true}
            isResize={true}
            width={450}
            height={450}
            onClose={handleOpenResizeToggle}
          >
            <RoadViewDivsss ref={roadViewRefsss}></RoadViewDivsss>
          </DraggableResizeModal>
        </RoadViewModalDiv>
      </PC>
      <Mobile>
        <RvWrapper ref={rvWrapperRef} className="rvWrapper">
          <RoadViewDiv ref={roadViewRef} className="roadview"></RoadViewDiv>
        </RvWrapper>
      </Mobile>
      */}
      <Landscape>
        <RoadViewModalDiv ref={roadViewModalRef}>
          <DraggableResizeModal
            title={'거리뷰'}
            open={true}
            isResize={true}
            width={450}
            height={450}
            onClose={handleOpenResizeToggle}
          >
            <RoadViewDivsss ref={roadViewRefsss}></RoadViewDivsss>
          </DraggableResizeModal>
        </RoadViewModalDiv>
      </Landscape>
      <Portrait>
        <RvWrapper ref={rvWrapperRef} className="rvWrapper">
          <RoadViewDiv ref={roadViewRef} className="roadview"></RoadViewDiv>
        </RvWrapper>
      </Portrait>
    </SuperContainer>
  )
}

const SuperContainer = styled.div`
  height:100%;
  //position:relative;
`

const KakaoMapContainer = styled.div`
  height:100%;
`

const RvWrapper = styled.div`
  position:absolute;
  bottom:150px;
  left:22px;
  width:650px;
  height:350px;
  z-index:3;

  @media ${(props) => props.theme.mobile} {
    bottom:calc(100vw*(77/428));
    left:calc(100vw*(25/428));
    height:calc(100vw*(288/428));
    width:calc(100vw*(379/428));
    
  }
`

const RoadViewDiv = styled.div`
  width:100%;
  height:100%;
`
const RoadViewDivsss = styled.div`
  width:100%;height:100%
`

const RoadViewModalDiv = styled.div`
`

