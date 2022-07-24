/////////////////////////////////// 사용 안함 ///////////////////////////////////
const getMapLocation = (mapLevel, screenWidth, screenHeight, originX, originY) => {
    //나온 중심 좌표x,y값을 기준으로 계산처리. 추상적으로 임의의 지점으로부터 중심으로 해서 직사각형 area영역 크기만큼(화면스크린사이즈px사이즈 가로,세로)와 지도레벨값에 따른 분기처리를 한다. 각 레벨에서 화면상에서 현재의 화면좌표일때 기준 차이px량 크기px량만큼 위도경도 크기 차이난다.x,y
    var levelArray={
      '1' : 0.000003000,//레벨1일떄 단위1px당(화면상 보여지는 지도에서의 각 1px 단위크기당 일때의 위도,경도 차이값.지도상에서 가로,세로 크기1px의 차이일 경우마다 십억분에 7500차이나게형상화)
      '2' : 0.000007500,
      '3' : 0.000015000,
      '4' : 0.000025000,
      '5' : 0.000038000,
      '6' : 0.000075000,
      '7' : 0.000150000,
      '8' : 0.000300000,
      '9' : 0.000750000,
      '10' : 0.001250000,
      '11' : 0.002500000,
      '12' : 0.007500000,
      '13' : 0.050000000,
      '14' : 0.200000000  //14레벨일때는 화면상 지도 1px가로세로당 위도경도값 0.5만큼 차이 이동된다고 할수있다. 추상화.
    };
    var xDistance= levelArray[mapLevel] * parseInt(screenWidth / 2);
    var yDistance = levelArray[mapLevel] * parseInt(screenHeight / 2);

    return {
      startX: Number(originX) - Number(xDistance),
      endX: Number(originX) + Number(xDistance),
      startY: Number(originY) - Number(yDistance),
      endY: Number(originY) + Number(yDistance)
    };
  };

module.exports = { getMapLocation };
