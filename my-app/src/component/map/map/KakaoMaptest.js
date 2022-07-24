/* global kakao */

import React, { useEffect, useState, useRef } from "react";

import styled from "styled-components"

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

// redex
import { MapRight, MapProductEls, mapHeader } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

import json from '../../../json/geoMap.json'

import style from './kakaoMap.css';

export default function KakaoMap({status}) {
  const [kakaoMap, setKakaoMap] = useState(null);
  const [, setExcClusterer] = useState();
  const [, setProClusterer] = useState();
  const [blockClusterer, setBlockClusterer] = useState();
  const [, setAroundClusterer] = useState();
  const [, setRoadClusterer] = useState();
  const [, setCurrnetClusterer] = useState();
  const pivot = {lat:37.496463, lng:127.029358}
  const [centerClusterer, setCenterClusterer] = useState({lat:"", lng:""})
  const [clickMarker, setClickMarker] = useState({});

  const mapRightRedux = useSelector(state=>{ return state.mapRight});
  const mapFilterRedux = useSelector(state=>{ return state.mapFilter});
  const productRedux = useSelector(state=>{ return state.mapProductEls});
  const login_user = useSelector(data=> data.login_user);

  const mapHeaderRedux = useSelector(data => data.mapHeader);

  const [exclusiveArr, setExclusiveArr] = useState([]);
  const [probrokerArr, setProbrokerArr] = useState([]);
  const [blockArr, setBlockArr] = useState([]);
  const [aroundArr, setAroundArr] = useState([]);
  
  const container = useRef();
  const rvWrapperRef = useRef();
  const roadViewRef = useRef();
  
  // 거리재기
  var drawingFlag = false;
  var clickLine;
  var moveLine;
  var distanceOverlay;
  var dots = [];

  // 용산구 폴리곤 더미 데이터 입니다.
  // 검색 후 폴리곤은 dummyArea안에 넣으시면 됩니다.
  var dummyArea =   [
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
    if(!kakaoMap){return;}

    // 폴리곤 뜨게 할려면 return 삭제하시면됩니다!
    new kakao.maps.Polygon({
      map: kakaoMap, 
      path: dummyArea, // 각 좌표 배열을 넣어야합니다.
      strokeWeight: 2, // 선 두께
      strokeColor: '#004c80', // 선 색깔
      strokeOpacity: 0.8, // 선 투명도 
      fillColor: '#fff', // 채우는 색깔
      fillOpacity: 0.5  // 채우는 투명도 
    });
  }, [kakaoMap])
  
  
  /*
    전속매물, 전문중개사, 단지별 실거래
    각 클러스터러와 마커를 초기화시키는 함수를 만들었습니다.
    새로운 마커를 표시하기 전 함수를 실행하여 이전에 있던 클러스터러를 지웠습니다.
  */
  const initExcCluster = () => {
    setExcClusterer(clusterer=>{ 
      // console.log('==>>setExcCLUSTER initcluster:',clusterer);
      if(!clusterer){return clusterer}; 
      clusterer.clear(); 
      return clusterer;
    });
  }
  const initProCluster = () => {
    setProClusterer(clusterer=>{ 
      // console.log('====>setRroclustere initcluster:',clusterer);
      if(!clusterer){return clusterer}; 
      clusterer.clear(); 
      return clusterer;
    });
  }
  const initBlockCluster =  () => {
    setBlockClusterer(clusterer=>{ 
      // console.log('====>>setblockClustere initcluster:',clusterer);
      if(!clusterer){return clusterer}; 
      clusterer.clear(); 
      return clusterer;
    });
  }

  // 제거
  const removeEvent = () => {
   // kakao.maps.event.removeListener(kakaoMap, 'idle', getProduct_idleCase );
  }
  //페이지 첫 로드 시에 getProuct
  useEffect(() =>{
    // console.log('페이지 첫 로드시에 실행>>getProduct실행::');//메인으로 가서 검색하고 이쪽 페이지로 오는경우,페이지 강제 새로고침 로드 하는경우
    //updateProduct();
  },[]);
  

  useEffect(() => {
    // console.log('mapHeader리덕스 검색시에 실행>>getProduct실행::'); //mapHeader현재 지도페이지에서 검색하는경우로 해더리덕스origin변경시에 실행.
    //updateProduct();
  },[mapHeaderRedux.origin, mapHeaderRedux.originid]);

  // 필터/메뉴 바뀔때마다 이벤트 발생
  useEffect(() => {
    // console.log('===>>필터 right메뉴, 카카오맵등 바뀔떄마다 이벤트 발생:');
    if(!kakaoMap){return;};
    const filerRedux = mapFilterRedux;
    localStorage.setItem( "filterData", JSON.stringify(filerRedux));
    
    // #.1 현재 리스트/마커/클러스터러 변경
    //getProduct_normal();

    // #.2 이벤트 추가 ( 새 이벤트 추가)
    //kakao.maps.event.addListener(kakaoMap, 'idle', getProduct_idleCase );
    
    // #.3  클릭 시 이벤트 제거 ( 기존 이벤트 제거 )
    const changeBtn = document.querySelectorAll(".changeBtn");
    const changeBtnRange = document.querySelectorAll(".changeBtnRange");
    for(let i = 0; i < changeBtn.length ; i++){
      changeBtn[i].addEventListener("click", removeEvent );
    }
    for(let i = 0; i < changeBtnRange.length ; i++){
      changeBtnRange[i].addEventListener("mousedown", removeEvent );
    }

    //updateProduct();
  },[mapFilterRedux, mapRightRedux, kakaoMap])
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

  // 지도 생성
  useEffect(() => {
    let searchdetail_origindata = JSON.parse(localStorage.getItem("searchdetail_origin"));

    let mapData = JSON.parse(localStorage.getItem("mapData"));
    console.log('카카오맵 실행 최초초기화 해당 위치이동::',mapData,searchdetail_origindata);
    if(searchdetail_origindata){
      if(searchdetail_origindata.y && searchdetail_origindata.x){
        var center= new kakao.maps.LatLng(searchdetail_origindata.y, searchdetail_origindata.x);
      }else if(searchdetail_origindata.prd_longitude && searchdetail_origindata.prd_latitude){
        var center = new kakao.maps.LatLng(searchdetail_origindata.prd_latitude, searchdetail_origindata.prd_longitude);
      }else{
        var center = new kakao.maps.LatLng(37.496463, 127.029358);
      } 
      var level = 3;
    }else if(!searchdetail_origindata){
      var center = new kakao.maps.LatLng(37.496463, 127.029358);
      var level = 3;

      if(mapData){
        center = new kakao.maps.LatLng(Number(mapData.lat), Number(mapData.lng));
        level = mapData.level;
      }
    }
    const options = {
      center,
      level: level
    };
    const map = new kakao.maps.Map(container.current, options);
    
    var imageSize=new kakao.maps.Size(35,44);
    var imageoption = {offset : new kakao.maps.Point(4,4)};
    var single_markerimage = new kakao.maps.MarkerImage(markerImgelement, imageSize, imageoption);
    var markerpos = center; //검색중심좌표와 일치하게.
    var single_marker= new kakao.maps.Marker({
      position: markerpos,
      image: single_markerimage,
      zIndex: 3
    });
    
    single_marker.setMap(map);
    setKakaoMap(map); 
    map.setMaxLevel(10);

    kakao.maps.event.addListener(map, 'idle', (e) => {
      console.log('지도 idle상황 변화시마다 관련 정보 저장, 지도의 현재 범위정보 조회 지도의 좌표(경도위도) 직사각형기준 범위 조회한다.');
      var level = map.getLevel();
      var lng = map.getCenter().La.toFixed(11);
      var lat = map.getCenter().Ma.toFixed(11);
      var bounds=map.getBounds();
      var swLatlng=bounds.getSouthWest();//남서쪽좌표x,y
      var neLastlng=bounds.getNorthEast();

      console.log('지도의 현재 영역(bounds,level)',bounds,level,swLatlng,neLastlng);
      
      var bounds_display=new kakao.maps.LatLngBounds(swLatlng,neLastlng);

      const data = {
        level:level,
        lat:lat,
        lng:lng,
        bounds: bounds,
        se:swLatlng,
        ne:neLastlng,
      }
      localStorage.setItem( "mapData", JSON.stringify(data));
    });
    
  }, [container, mapHeaderRedux.origin]);

  // 전속매물 토글 --- 
  useEffect(() => {
    mapRightRedux.isExclusive.is
    ?
    addMarkClust(exclusiveArr, setExcClusterer, exclusiveMarker, excClusterer, 3 , 'exclusive')
    :
    initExcCluster();
  }, [mapRightRedux.isExclusive.is])
  //전속매물 요소 state 배열리스트(마커배열) 변동시마다실행
  useEffect( () => {
     console.log('exclusvieArr변경::',exclusiveArr);
    initExcCluster();
    addMarkClust(exclusiveArr, setExcClusterer, exclusiveMarker, excClusterer, 3 ,'exclusive');
  },[exclusiveArr]);

  // 전문 중개사 토글 --- 
  useEffect(() => {
    mapRightRedux.isProbroker.is
    ?
    addMarkClust(probrokerArr, setProClusterer, probrokerMarker, proClusterer, 4 , 'probroker')
    :
    initProCluster();
  }, [mapRightRedux.isProbroker.is])
  //전문중개사 요소 state 관련마커배열 리스트 변동시마다 실행
  useEffect(() => {
     console.log('probrokerArr::',probrokerArr);
    initProCluster();
    addMarkClust(probrokerArr, setProClusterer, probrokerMarker, proClusterer, 4 , 'probroker');
  },[probrokerArr]);

  // 단지별 실거래 토글 --- 
  useEffect(() => {
    mapRightRedux.isBlock.is
    ?
    addMarkClustBlock(blockArr, setBlockClusterer, blockMarker, blockClustererImg, 5)
    :
    initBlockCluster();
  }, [mapRightRedux.isBlock.is]);
  //단지별요소 state관련 마커배열 리스트 변동시마다 실행
  useEffect(() => {
    console.log('blockArr::',blockArr);
    addMarkClustBlock(blockArr, setBlockClusterer, blockMarker,blockClustererImg, 5)
  },[blockArr]);

  // 마커/클러스터러 함수
  const addMarkClust = (array, setClusterer, markerImg, clustererImg, cluLevel , element_type) => {
    
    let mapData = JSON.parse(localStorage.getItem('mapData'));//마커 클러스터 생성시 각 마커별 크릭이벤트 등록. 클릭한 마커 위치조건 + 필터상태값+매물조건부검색.

    var imageSize = new kakao.maps.Size(40, 40),
        imageOption = {offset: new kakao.maps.Point(4, 4)};
    var markerImage = new kakao.maps.MarkerImage(markerImg, imageSize, imageOption);
    let markers = [];

    if(array){
      array.map(item => {
        const retrunLatLng = () => {
          if(element_type == "exclusive"){
            return new kakao.maps.LatLng(item.prd_latitude, item.prd_longitude)
          }else if(element_type == "probroker"){
            return new kakao.maps.LatLng(item.y, item.x)
          }else if(element_type == "around"){
            return new kakao.maps.LatLng(item.Ma, item.La)
          }
        }

        const markerEl = new kakao.maps.Marker({
          map: kakaoMap, 
          position: retrunLatLng(),
          image: markerImage,
          opacity:1
        })   
        })
    }

     var clusterer = new kakao.maps.MarkerClusterer({
      map: kakaoMap, 
      averageCenter: true, 
      minLevel: cluLevel,
      disableClickZoom: true,
      calculator: [1, 50, 100],
      styles:[
        {
          width : '50px', height : '50px',
          backgroundImage:  `url(${clustererImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '50px'
        },
        {
          width : '60px', height : '60px',
          backgroundImage:  `url(${clustererImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '60px'
        },
        {
          width : '94px', height : '94px',
          backgroundImage:  `url(${clustererImg})`,
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

    kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {
      var latlng_object_array=[];
      for(let child=0; child<cluster._markers.length; child++){
        let local_coords= cluster._markers[child]['n'];
        let latlng_object=local_coords.toLatLng();
        latlng_object_array[child]=latlng_object;
      }

      //전속매물클러스텨,전문중개사클러스터 통용 centerCluster정보 state정보갱신. 클러스터 중심좌표값x,y 클러스터어떤유형의 클러스터인지.(전속매물or전문중개사) / 자식마커들의 latlng각도좌표계x,y값들리턴.
      setCenterClusterer({
        lat:cluster._center.toLatLng().Ma,
        lng:cluster._center.toLatLng().La,
        markerlist_latlng : latlng_object_array,
        click_type : element_type
      });
    });
    setClusterer(clusterer);//각 생성랜더링 함수상황별 전속매물 마커&클러스터clusterer생성, 전문중개사 마커&클러스터clustesre생성진행.
  }

  // 단지별 실거래 마커/클러스터러 함수
  const addMarkClustBlock = (array, setClusterer, markerImg, clustererImg, cluLevel) => {
    initBlockCluster();
    let markers = [];
    
    //단지별실거래의 경우 필터데이터,매물종류 데이터등 추가 데이터 필요없고, complex들만을 위한, 매물종류/필터조건부서식 추가로 붙는게없음.
    if(array){
      array.map(item => {
        var create_content=document.createElement('DIV');
        
        create_content.innerHTML = `<p>`+item.contract_ym+item.contract_dt+`</p><p>`+item.type+item.deposit+`</p>`;
        create_content.className='markerWrap';
        
        var customOverlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(item.y, item.x),
          content: create_content,
        });
     
       markers.push(customOverlay);
       customOverlay.setMap(kakaoMap);

       //카카오맵에 생성한 create_content관련 커스텀오버레이 개체요소(마커)를 그립니다. 맵에 랜더링합니다. 랜더링되는 콘텐츠의 수가 120개이하인 경우에만(마커들로 다 보이는 순간) , 마커들이 굳이 보이지 않는 순간엔. 굳이 안보이는 마커들(마커클릭발생일x)을 위한 핸들러 등록은 비효율적.
       
        
        //create_content.addEventListener('click',async_func,false);
       });
    }
   
    var clusterer = new kakao.maps.MarkerClusterer({
      map: kakaoMap, 
      averageCenter: true, 
      minLevel: cluLevel,
      disableClickZoom: true,
      calculator: [20, 50, 100],
      styles:[
        {
          width : '50px', height : '50px',
          backgroundImage:  `url(${clustererImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '50px'
        },
        {
          width : '60px', height : '60px',
          backgroundImage:  `url(${clustererImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '60px'
        },
        {
          width : '94px', height : '94px',
          backgroundImage:  `url(${clustererImg})`,
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
    kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {
      var latlng_object_array=[];
      for(let child=0; child<cluster._markers.length; child++){
        let child_marker=cluster._markers[child]['n'];//coords좌표값 반환.

        let local_coords= cluster._markers[child]['n'];
        let latlng_object=local_coords.toLatLng();
        latlng_object_array[child]=latlng_object;
      }

      setCenterClusterer({
        lat:cluster._center.toLatLng().Ma,
        lng:cluster._center.toLatLng().La,
        markerlist_latlng : latlng_object_array,
        click_type : 'block'
      })
    });
    setClusterer(clusterer);//proCluster,excClutser,blockCluster종류별,주변Cluster
  }

  // 지도유형
  useEffect(() => {
    if(!kakaoMap){
      return;
    }
    
    kakaoMap.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
    kakaoMap.removeOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
    //roadViewRef.current.style.display = 'none';
    //rvWrapperRef.current.style.pointerEvents = 'none';
    if(mapRightRedux.mapStyle == "roadView"){
      var rv = new kakao.maps.Roadview(roadViewRef.current); //로드뷰 객체
      var rvClient = new kakao.maps.RoadviewClient();

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
        image : markImage,
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
      setRoadClusterer(clusterer);
      // console.log('===>>roadview 지도유형 선택하여 실행 함수 구문 rvmarkers설정 및 markers정보:',markers,clusterer);

      var clickHandler = function(mouseEvent) {    
        var position = mouseEvent.latLng; 
        // console.log('로드뷰 지도유형상태값 상태에서 카카오맵 임의지점 클릭핸들러:',position);
        rvMarker.setPosition(position);
        toggleRoadview(position);
      }; 

      function toggleRoadview(position){
        // console.log('=====>>toggleRoadview함수실행>>:',position);
        rvClient.getNearestPanoId(position, 50, function(panoId) {
          // console.log('rvCLIENT 클릭지점 근처의 파노라마id값 관련 콜백함수실행>>:',panoId);
            if (panoId === null) {
              roadViewRef.current.style.display = 'none';
              rvWrapperRef.current.style.pointerEvents  = 'none';
              kakaoMap.relayout();
            } else {
              kakaoMap.relayout();
              roadViewRef.current.style.display = 'block'; 
              rvWrapperRef.current.style.pointerEvents  = 'auto';
              rv.setPanoId(panoId, position);
              rv.relayout();
            }
        });
      }
    }

    switch (mapRightRedux.mapStyle){
      case "roadmap":
        kakaoMap.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);    
        break;
      case "district":
        kakaoMap.addOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
        break;
      case "hybrid":
        kakaoMap.setMapTypeId(kakao.maps.MapTypeId.HYBRID);    
        break;
      case "roadView":
        kakao.maps.event.addListener(kakaoMap, 'click', clickHandler);
        const noRv = document.querySelector(".noRv");
        noRv.addEventListener("click", () => {
          kakao.maps.event.removeListener(kakaoMap, 'click', clickHandler);
          setRoadClusterer(clusterer=>{clusterer.clear(); return clusterer;})
        })
        kakaoMap.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
        break;
      default:
        kakaoMap.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);    
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
    if(click_type_val == 'exclusive'){
      let mapData =JSON.parse(localStorage.getItem('mapData'));

      //마커 클릭시점 당시때의 맵데이터를 구합니다. 맵데이터 레벨,중심좌표값,화면크기,매물타입등.
      if(mapData){
        var map_sendData={
          level : mapData.level,
          lat : mapData.lat,
          lng : mapData.lng,
          screen_width : window.innerWidth,
          screen_height : window.innerHeight,
          prdtype_val : mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',//매물타입
          isexclusive_val : mapRightRedux.isExclusive.is,//전속매물체크
          isprobroker_val : mapRightRedux.isProbroker.is,//전문중개사체크여부
          isblock_val : mapRightRedux.isBlock.is
        }
      }else{
        var map_sendData={
          level : 3,
          lat : 37.496463, 
          lng : 127.029358,
          screen_width : window.innerWidth,
          screen_height : window.innerHeight,
          prdtype_val : mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',
          isexclusive_val : mapRightRedux.isExclusive.is,
          isprobroker_val : mapRightRedux.isProbroker.is,
          isblock_val : mapRightRedux.isBlock.is
        }
      }  

      var reduxFilter = mapFilterRedux.filterUI;
      var reduxTextFilter = mapFilterRedux.filterArr;
      //if(!mapData){return};
      let type = 1;
      let roomTextArr = [];
      let isPark = 1;
      let isPet = 0;
      if(status == "apart"){
        type = 1
      }else if(status == "officetel"){
        type = 2
      }else if(status == "store" ){
        type = 3
      }else if(status == "office"){
        type = 4
      }

      if(reduxTextFilter.room=="전체"){
          roomTextArr=null;
      }else{
        for(let i = 0 ; i < reduxTextFilter.room.length ; i++){
          roomTextArr.push(reduxTextFilter.room[i]);
        }
      }
      if(status == "officetel"){
        isPark=reduxFilter.parkOfficetel;
      }else if(status == "store" || status == "office"){
        isPark=reduxFilter.parkStore;
      }else{
        isPark=null;
      }

      // ** api 사용시 유의사항
      // "전체"일경우에는 1을 넣지 마시고 null값을 넣어주세요!
      // roomStructure 는 숫자가 아닌 배열안에 문자열로 넣어주세요 ex) ["오픈형원룸", "분리형원룸"]
      /*var body_info = {
        prdType:type, // 건물 타입 1-아파트, 2-오피스텔, 3-상가, 4-사무실
        prdSelType:reduxFilter.prd_sel_type, // 거래 유형 1-매매, 2-전세, 3-월세 

        tradePriceMin:reduxFilter.priceRangeValue[0]==0?null:reduxFilter.priceRangeValue[0]*10000000, // 매매 최소
        tradePriceMax:reduxFilter.priceRangeValue[1]==100?null:reduxFilter.priceRangeValue[1]*10000000, // 매매 최대
        jeonsePriceMin:reduxFilter.jeonseRangeValue[0]==0?null:jeonseTextfunc(reduxFilter.jeonseRangeValue[0]), // 전세금(보증금) 최소
        jeonsePriceMax:reduxFilter.jeonseRangeValue[1]==30?null:jeonseTextfunc(reduxFilter.jeonseRangeValue[1]), // 전세금(보증금) 최대
        monthPriceMin:reduxFilter.monthlyRangeValue[0]==0?null:monthlyTextfunc(reduxFilter.monthlyRangeValue[0]), // 월세 최소
        monthPriceMax:reduxFilter.monthlyRangeValue[1]==18?null:monthlyTextfunc(reduxFilter.monthlyRangeValue[1]), // 월세 최대
        supplySpaceMin:reduxFilter.areaRangeValue[0]==0?null:reduxFilter.areaRangeValue[0], // 공급면적 최소
        supplySpaceMax:reduxFilter.areaRangeValue[1]==100?null:reduxFilter.areaRangeValue[1], // 공급면적 최대
        managementPriceMin:reduxFilter.manaRangeValue[0]==0?null:reduxFilter.manaRangeValue[0] * 10000,
        managementPriceMax:reduxFilter.manaRangeValue[1]==75?null:reduxFilter.manaRangeValue[1] * 10000,
        

        floor: reduxFilter.floor=="0"?null:Number(reduxFilter.floor)+1, // 층수
        roomCount:reduxFilter.roomApart=="0"?null:Number(reduxFilter.roomApart)+1, // 방수
        bathCount:reduxFilter.bath=="0"?null:Number(reduxFilter.bath)+1, // 욕실수
        isParking:isPark==0?null:isPark, // 전용주차장 여부 1->있음,  0->없음
        isToilet:status !== "officetel" && status !== "apart"? reduxFilter.toilet:null, // 전용 화장실 여부 1->있음,  0->없음
        isManagement:reduxFilter.manaStatus==0?null:reduxFilter.manaStatus, // 관리비 여부 1->있음,  0->없음
        totalHousehold:reduxFilter.danji=="0"?null:Number(reduxFilter.danji)+1, // 총세대수 1-> 전체, 2 -> 200세대이상, 3 -> 500세대이상, 4 -> 1000세대이상, 5 -> 2000세대이상
        prdUsage:reduxFilter.purpose=="0"?null:Number(reduxFilter.purpose)+1, // 용도 1->전체, 2-> 주거용, 3-> 업무용
        roomStructure:roomTextArr, // 오픈형원룸, 분리형원룸, 원룸원거실, 투룸, 쓰리룸이상
        isDouble:reduxFilter.double=="0"?null:reduxFilter.double, // 복층 2-> 복층,  1->단층

        isPet:status == "officetel"? reduxFilter.pet=="0"?null:Number(reduxFilter.pet) : null, // 반려동물 여부 1->있음,  0->없음 ㅠㅠㅠㅠ
        
        acceptUseDate:reduxFilter.use=="0"?null:Number(reduxFilter.use)+1, // 2-> 5년이내, 3->10년이내, 4-> 20년이내, 5->20년이상

        //zido_level:map_sendData.level,//지도레벨
        //origin_x:map_sendData.lng,//지도중심좌표
        //origin_y:map_sendData.lat,//지도중심좌표
        //screen_width:window.innerWidth,//화면크기
        //screen_height:window.innerHeight,
        prd_type:mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart',//매물타입 mapHEDER매물타입(아팥,오피,상가,사무실)
        isexclusive:mapRightRedux.isExclusive.is,//전속매물체크
        isprobroker:mapRightRedux.isProbroker.is,//전문중개사체크
        isblock:mapRightRedux.isBlock.is,//단지별실거래관련체크
        //mem_id:login_user.memid ? login_user.memid : 0
       
        click_type:click_type_val,//클릭 클러스터 타입.
        markerlist_latlng : centerClusterer['markerlist_latlng'],
        prdtype_val : mapHeaderRedux.prdtype ? mapHeaderRedux.prdtype : 'apart'
      }*/
    }else{
      /*var body_info ={
        click_type : click_type_val,//클릭타입
        markerlist_latlng : centerClusterer['markerlist_latlng']//자식 마커들 latlng좌표값들. 단지별실거래클러스터, 전문중개사클러스터의 경우 그 위치값으로만 조회한다.
      }*/
    }

    /*var send_results= await serverController.connectFetchController('/api/matterial/clickCluster_match_infoget','POST',JSON.stringify(body_info));

    if(send_results){
      if(send_results.result){
        if(click_type_val == 'probroker'){
          MapProductEls.updateProbroker({probroker : send_results.result});
        }else if(click_type_val == 'exclusive'){
          MapProductEls.updateExclusive({exclusive : send_results.result});
        }else if(click_type_val == 'block'){
          MapProductEls.updateBlock({block : send_results.result});
        }
      }
    }*/
  }, [centerClusterer])

  // 마커 클릭
  // **api 선택한 마커의 좌표 혹은 아이디를 서버에 보내고 해당 데이터를 받아와야합니다.
  useEffect(() => {
    // // console.log(clickMarker);
  }, [clickMarker])

  // 줌인
  useEffect(() => {
    if(mapRightRedux.isZoomIn == 0){
      return;
    }
    kakaoMap.setLevel(kakaoMap.getLevel() - 1);
  }, [mapRightRedux.isZoomIn]);

  // 줌아웃
  useEffect(() => {
    if(mapRightRedux.isZoomOut == 0){
      return;
    }
    kakaoMap.setLevel(kakaoMap.getLevel() + 1);
  }, [mapRightRedux.isZoomOut]);

  // 주변
  useEffect(() => {
    // console.log('===>>>mapRightRedux.around 변화에따른 감지::',mapRightRedux.around);
    if(!kakaoMap ||  mapRightRedux.around.is == ""){
      return;
    }
    const searchPlace = () => {
      // console.log('===>>searchPlace함수실행 주변검색 주변의 시설검색::');
      setAroundClusterer(clusterer=>{if(!clusterer){return;} clusterer.clear(); return clusterer;});
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

    var callback = function(data, status, pagination) {
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
    if(!kakaoMap){return;}

    setAroundClusterer(clusterer=>{if(!clusterer){return;} clusterer.clear(); return clusterer;});
    switch (mapRightRedux.around.is){
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
        setAroundClusterer(clusterer=>{if(!clusterer){return;} clusterer.clear(); return clusterer;});
        break;
    }
  }, [mapRightRedux.around, aroundArr, kakaoMap])

  // 내위치
  useEffect(() => {
    if(!kakaoMap){return;}
    if(mapRightRedux.isCurrnet.is){
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
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도
            var locPosition = new kakao.maps.LatLng(lat, lon);
            displayMarker(locPosition);
          });
      }else{ 
        alert("navigator.geolocation 지원하지 않음")
      }
    }else{
      setCurrnetClusterer(clusterer=>{ if(!clusterer){return} clusterer.clear(); return clusterer;})
    }
  }, [mapRightRedux.isCurrnet, kakaoMap])

  // 거리재기
  useEffect(() => {
    // console.log('==>>mapright.istinace.is상태값변경 거리재기right요소 변경시마다 실행:거래재기상태값false이면 카카오맵핸들러click,mousemove미등록',moveLine);
    if(!kakaoMap || !mapRightRedux.isDistance.is){return}

    if(mapRightRedux.isDistance.is){
      kakao.maps.event.addListener(kakaoMap, 'click', clickMap );
      kakao.maps.event.addListener(kakaoMap, 'mousemove', moveMouse);  
      const distance = document.querySelector(".distance");
      distance.addEventListener("click", () => {
        kakao.maps.event.removeListener(kakaoMap, 'click', clickMap );
        kakao.maps.event.removeListener(kakaoMap, 'mousemove', moveMouse );
        if(moveLine){
          moveLine.setMap(null);
          moveLine = null;  
        }
        initLineDot();
      })
    }

    const distanceEnd = document.querySelector(".distanceEnd");
    distanceEnd.addEventListener("click", () => {
      // 지도 오른쪽 클릭 이벤트가 발생했는데 선을 그리고있는 상태이면
      // console.log('distanceEnd거리측정 버튼 클릭시에 실행 이벤트핸들러:',drawingFlag,moveLine);
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
          if (dots[dots.length-1].distance) {
            dots[dots.length-1].distance.setMap(null);
            dots[dots.length-1].distance = null;    
          }

          var distance = Math.round(clickLine.getLength()), // 선의 총 거리를 계산합니다
              content = getTimeHTML(distance); // 커스텀오버레이에 추가될 내용입니다
              
          // 그려진 선의 거리정보를 지도에 표시합니다
          showDistance(content, path[path.length-1]);
        }else {
          initLineDot();
        }    
          // 상태를 false로, 그리지 않고 있는 상태로 변경합니다
          drawingFlag = false;          
       }    
    })

    // Click
    function clickMap(mouseEvent){
      // console.log("clickMap function call:");
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
    function moveMouse(mouseEvent){
      
      if (drawingFlag){
        var mousePosition = mouseEvent.latLng; 
        // console.log('====>mousemove이벤트 발생>>>>',drawingFlag,clickLine,clickLine.getPath());
        // 마지막과 현재 좌표를 가져와 연결한다.
        var path = clickLine.getPath();
        var movepath = [path[path.length-1], mousePosition];  
        moveLine.setPath(movepath);    
        moveLine.setMap(kakaoMap);
        
        var distance = Math.round(clickLine.getLength() + moveLine.getLength()), // 선의 총 거리를 계산합니다
            content = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m</div>'; // 커스텀오버레이에 추가될 내용입니다
        showDistance(content, mousePosition);   
      }    
    }

    // Init
    function initLineDot(){
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
      for ( i = 0; i < dots.length; i++ ){
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
      dots.push({circle:circleOverlay, distance: distanceOverlay});
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
    <>
      <KakaoMapContainer id="container" ref={container} />
      
    </>
  )
}

const KakaoMapContainer = styled.div`
  position:absolute;
  width:100%;
  height:calc(100vh - 80px);
  z-index:0;

  @media ${(props) => props.theme.mobile} {
    height:calc(100vh - (100vw*(64/428)));
  }
`

const RvWrapper = styled.div`
  position:absolute;
  bottom:150px;
  left:22px;
  width:650px;
  height:350px;
  z-index:0;

  @media ${(props) => props.theme.mobile} {
    bottom:calc(100vw*(77/428));
    left:calc(100vw*(25/428));
    height:calc(100vw*(225/428));
    width:calc(100vw*(379/428));
    max-width: 437px;
    max-height: 272px;
  }
`

const RoadViewDiv = styled.div`
  width:100%;
  height:100%;
`
