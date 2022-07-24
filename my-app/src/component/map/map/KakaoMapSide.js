
// React
import React, { useEffect, useState, useRef } from "react";

// Style
import styled from "styled-components"

import markerImg from '../../../img/map/sideMapMarker.png';

const { kakao } = window;

const KakaoMapSide = ({cutomImg, centerLat, centerLng, markerLat, markerLng}) => {

  const [kakaoMap, setKakaoMap] = useState(null);
  const container = useRef();

  // Map
  useEffect(() => {

    const center = new kakao.maps.LatLng(centerLat, centerLng);
    const options = {
        center,
        level: 3
    };
    const map = new kakao.maps.Map(container.current, options);

    var imageSize = new kakao.maps.Size(35, 44),
    imageOption = {offset: new kakao.maps.Point(4, 4)};
    var markerImage = new kakao.maps.MarkerImage(cutomImg?cutomImg:markerImg, imageSize, imageOption);

    var markerPosition  = new kakao.maps.LatLng(markerLat, markerLng); 
    var marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
    });

    marker.setMap(map);
    setKakaoMap(map);
  }, [container, centerLat, centerLng, markerLat, markerLng]);

    return(
        <>
            <KakaoMapContainer id="container" ref={container} />
        </>
    )
};

export default KakaoMapSide;


const KakaoMapContainer = styled.div`
  width:100%;
  height:100%;
  z-index:0;
`