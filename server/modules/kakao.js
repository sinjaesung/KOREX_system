const request = require('request-promise-native');

const getCoordinateByAddress = async (query) => {
  try {
    const headers = { "Authorization": "KakaoAK " + "ac08f2d6adfd16a501ad517d7a2fab3f" };
    const url = "https://dapi.kakao.com/v2/local/search/address.json?&query=" + encodeURI(query);
    let response = await request.get({
      uri: url,
      headers: headers
    });
    response = JSON.parse(response);
    response = response.documents[0];
    
    return { x: response.x, y: response.y };
  }
  catch (err) {
    console.log(err);
  }
};

const getDongCodeByCoordinate = async (x, y) => {
  try {
    const headers = { "Authorization": "KakaoAK " + "ac08f2d6adfd16a501ad517d7a2fab3f" };
    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?input_coord=WGS84&output_coord=WGS84&x=${x}&y=${y}`;
    let response = await request.get({
      uri: url,
      headers: headers
    });
    response = JSON.parse(response);
    response = response.documents;

    for (let i = 0; i < response.length; i++) {
      if (response[i].region_type === "B") { return response[i].code };
    };
    
    return null;
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = { getCoordinateByAddress, getDongCodeByCoordinate };
