
const request_api = require('request-promise-native');

const API_HOLIDAY_URL = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo`;
const API_KEY = `dQgLUY9%2FfsdKWhtCndmYAHTHOryvi21AEKYdW12GA0aNeFhic4%2BGbp6%2FcG3DwzXJzAyj19lboM%2FjnuWdpdWRIQ%3D%3D`;

function checkZero(checkString){ 
    console.log(checkString.toString().length == 1 ?  "0" + checkString : checkString);
    return checkString.toString().length == 1 ?  "0" + checkString : checkString; 
}
  

module.exports = {
    async getHoliday(req){
        const { year, month }=req.query; 
        console.log('get holiady sss:',year,month);
        const additonalURL = `?solYear=${year}&solMonth=${checkZero(month)}&ServiceKey=${API_KEY}&_type=json&numOfRows=20`;
        try{
            let api_response = await request_api.get({
                url:`${API_HOLIDAY_URL}${additonalURL}`,
            });
            console.log('holiday api repsonsesss:',api_response);
            api_response=JSON.parse(api_response);
            /*then((res)=>{
                console.log('성공>>>:',res);
                return res.json(); 
            })*/
            return api_response;
        }
        catch(e){
            console.log('무슨 에러:',e);
            throw null;
        }
    },
}