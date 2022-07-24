//const Connection = require('mysql2/typings/mysql/lib/Connection');
const mapFilterMapper = require('../mapper/mapFilter');


// 건물 타입
const prdTypeData = [
    {num: 1, name:"= '아파트'"},
    {num: 2, name:"= '오피스텔'"},
    {num: 3, name:"= '상가'"},
    {num: 4, name:"= '사무실'"},
]

// 층수
const floorData = [
    {num: 1, name:">= 0"},
    {num: 2, name:"= 1"},
    {num: 3, name:">= 5"},
    {num: 4, name:"<= 5"},
]

// 방수 (아파트)
const roomCountData =[
    {num: 1, name:">= 0"},
    {num: 2, name:"= 1"},
    {num: 3, name:"= 2"},
    {num: 4, name:"= 3"},
    {num: 5, name:">= 4"},
]

// 욕실수 (아파트)
const bathCountData =[
    {num: 1, name:">= 0"},
    {num: 2, name:"= 1"},
    {num: 3, name:"= 2"},
    {num: 4, name:">= 3"},
]

// 주차 여부
const isParkingData = [
    {num: 0, name: "= 0"},//오피스텔주차가능여부(주차x,주차지원) 상가삼수리주차가능여부(주차x,주차지원)
    {num: 1, name: "= 1"},
]

// 전용화장실 여부
const isToiletData = [ //상가삼실 전용화장실지원여부
    {num: 0, name: "= 0"},
    {num: 1, name: "= 1"},
] 

// 관리비 여부
const isManagementData = [
    {num: 0, name: "= 0"},
    {num: 1, name: "= 1"},
]

// 아파트단지 총세대수
const totalHouseholdData = [
    {num: 1, name: ">= 0"},
    {num: 2, name: ">= 200"},
    {num: 3, name: ">= 500"},
    {num: 4, name: ">= 1000"},
    {num: 5, name: ">= 2000"},
] 
//오피스텔 사용용도
const prdUsageData = [
    {num: 1, name: "in ('주거용','업무용')"},
    {num: 2, name: "= '주거용'"},
    {num: 3, name: "= '업무용'"},
]

// 복층 여부
const isDoubleData = [
    {num: 0, name: ">= 0"},//전체
    {num: 1, name: "= 0"}, //복층아님.
    {num: 2, name: "= 1"},
]
// 반려동물 여부
const isPetData = [
    {num: 0, name: ">= 0"},//전체
    {num: 1, name: "= 1"},//반려동물가능.
    {num: 2, name: "= 0"},
]

function DateText(date, text){
    let month = String(date.getMonth()+1);
    let _date = String(date.getDate());

    if(month.length == 1){
        month = "0"+month;
    }

    if(_date.length == 1){
        _date = "0"+String(date.getDate());
    }

    return (`${date.getFullYear()}${text}${month}${text}${_date}`)
}

const retrunData = ( index, dataArr) => {
    for(let i = 0 ; i < dataArr.length ; i++){
        if(index == dataArr[i].num){
            return dataArr[i].name;
        }
    }
    return dataArr[0].name;
}

module.exports = {
    async getProductList(req){
        let {
            prdType, // 건물 타입
            prdSelType, // 거래 타입
            tradePriceMin, // 매매 최소
            tradePriceMax, // 매매 최대
            jeonsePriceMin, // 전세 최소
            jeonsePriceMax, // 전세 최대
            monthPriceMin, // 월세 최소
            monthPriceMax, // 월세 최대
            isToilet, // 화장실 유무
            supplySpaceMin, // 공급면적 최소 면적 최소~최대값.으로 판단 아파트면 suplyspace기준검색,나머지라면 전용면적 exclusive_area기준검색.
            supplySpaceMax, // 공급면적 최대
            floor, // 층수
            roomCount, // 방수
            bathCount, // 욕실수
            isParking, // 주차 가능 여부
            isManagement, // 관리비 여부

            managementPriceMin, // 관리비 최소
            managementPriceMax, // 관리비 최대

            acceptUseDate, // 사용승인일
            totalHousehold, // 총세대수 아파트단지
            prdUsage, // 용도 오피스텔
            roomStructure, // 방구조 오피스텔
            isDouble, // 복층 여부 
            isPet, // 반려동물 여부

            origin_x,
            origin_y,
            startx,
            starty,
            endx,
            endy,
            screen_width,
            screen_height,
            zido_level,
            prd_type,
            isexclusive,
            isprobroker,
            isblock,
            mem_id,
        }=req.body; 

        switch(prd_type){
            case 'apart':
                prd_type='아파트';
            break;

            case 'store':
                prd_type='상가';
            break;

            case 'officetel':
                prd_type='오피스텔';
            break;

            case 'office':
                prd_type='사무실';
            break;
        }

        //나온 중심 좌표x,y값을 기준으로 계산처리. 추상적으로 임의의 지점으로부터 중심으로 해서 직사각형 area영역 크기만큼(화면스크린사이즈px사이즈 가로,세로)와 지도레벨값에 따른 분기처리를 한다. 각 레벨에서 화면상에서 현재의 화면좌표일때 기준 차이px량 크기px량만큼 위도경도 크기 차이난다.x,y
        var level_array={
            '1' : 0.000003000 ,//레벨1일떄 단위1px당(화면상 보여지는 지도에서의 각 1px 단위크기당 일때의 위도,경도 차이값.지도상에서 가로,세로 크기1px의 차이일 경우마다 십억분에 7500차이나게형상화)
            /*'2' : 0.000015000 */'2' : 0.000007500 ,
            '3' : 0.000015000 ,
            '4' : 0.000025000 ,
            '5' : 0.000038000 ,
            '6' : 0.000075000 ,
            '7' : 0.000150000 ,
            '8' : 0.000300000 ,
            '9' : 0.000750000 ,
            '10' : 0.001250000 ,
            '11' : 0.002500000 ,
            '12' : 0.007500000 ,
            '13' : 0.050000000 ,
            '14' : 0.200000000  //14레벨일때는 화면상 지도 1px가로세로당 위도경도값 0.5만큼 차이 이동된다고 할수있다. 추상화.
        };
        var x_distance= level_array[zido_level] * parseInt(screen_width / 2);
        var y_distance = level_array[zido_level] * parseInt(screen_height / 2);

        var level_zido_startx= Number(origin_x) - Number(x_distance);
        var level_zido_endx= Number(origin_x) + Number(x_distance); 
        var level_zido_starty= Number(origin_y) - Number(y_distance);
        var level_zido_endy= Number(origin_y) + Number(y_distance);


        var queryWhere = "";
        var queryWhereMap = "";
        var queryWherePro = "";
        var queryWhereProMap = "";
        var queryWhereBlo = "";
        var queryWhereBloMap = "";
        

        if(isblock){
            //queryWhereBlo += `select * from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on  a.area_id=apt.area_id where c.y >= ${level_zido_starty} and c.y <= ${level_zido_endy} and c.x >= ${level_zido_startx} and c.x <= ${level_zido_endx} group by c.complex_id`;
            //queryWhereBloMap += `select c.x as x, c.y as y,c.approval_date as approval_date,c.complex_name as complex_name from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id  where c.y >= ${level_zido_starty} and c.y <= ${level_zido_endy} and c.x >= ${level_zido_startx} and c.x <= ${level_zido_endx} group by c.complex_id`;
            //queryWhereBloMap += `select x , y ,approval_date, complex_name from complex where y >= ${level_zido_starty} and y<=${level_zido_endy} and x>=${level_zido_startx} and x<=${level_zido_endx} limit 1000`;
            //queryWhereBlo += `select * from complex cpx join (select * from (select type,deposit,contract_ym,contract_dt,complex_id,floor,monthly_rent from actual_transaction_price where complex_id is not null order by contract_ym desc,contract_dt desc) atp1 group by atp1.complex_id) atp2 on cpx.complex_id=atp2.complex_id where cpx.y >=${level_zido_starty} and cpx.y<=${level_zido_endy} and cpx.x>=${level_zido_startx} and cpx.x<=${level_zido_endx} limit 20`;//20개 제한으로 보여주기.idle시마다 사이드바데이터.단지별 실거래가 있는(최근실거래정보를낀)complexid별 데이터 보여주고전체를 보여주고 끝부분에 그 나온 것에 대해서 조인하여 나온 그 결과물에 대해서 20개 제한해야한다.
           // queryWhereBloMap += `select cpx.complex_id as complex_id, cpx.x as x, cpx.y as y, atp2.type as type,atp2.deposit as deposit, atp2.contract_ym as contract_ym, atp2.contract_dt as contract_dt from korex_pref.complex cpx join ( select * from ( select type, deposit, contract_ym, contract_dt , complex_id, floor,monthly_rent from korex_pref.actual_transaction_price where complex_id is not null order by contract_ym desc, contract_dt desc) atp1 group by atp1.complex_id) atp2 on cpx.complex_id = atp2.complex_id where cpx.y >= ${level_zido_starty} and cpx.y<=${level_zido_endy} and cpx.x>=${level_zido_startx} and cpx.x<=${level_zido_endx} limit 1200`;//단지별실거래가 있는 내역ㄱ이 있는 단지내역들만 조인된(각complexid별 최근실거래내역있는,compelxid별 그룹그분)된 내역과 매칭되는 단지내역들리턴. 각row는 구분되는 지도위치조건 만족하면서+단지별실거래정보있는 각 단지별 최근 실거래내역정보.

            queryWhereBlo += `select * from complex cpx join (select * from (select type,deposit,contract_ym,contract_dt,complex_id,floor,monthly_rent from actual_transaction_price where complex_id is not null order by contract_ym desc,contract_dt desc limit 18446744073709551615) atp1 group by atp1.complex_id) atp2 on cpx.complex_id=atp2.complex_id where cpx.y >=${starty} and cpx.y<=${endy} and cpx.x>=${startx} and cpx.x<=${endx} limit 20`;//20개 제한으로 보여주기.idle시마다 사이드바데이터.단지별 실거래가 있는(최근실거래정보를낀)complexid별 데이터 보여주고전체를 보여주고 끝부분에 그 나온 것에 대해서 조인하여 나온 그 결과물에 대해서 20개 제한해야한다.
            queryWhereBloMap += `select cpx.complex_id as complex_id, cpx.x as x, cpx.y as y, atp2.type as type,atp2.deposit as deposit, atp2.contract_ym as contract_ym, atp2.contract_dt as contract_dt from korex_pref.complex cpx join ( select * from ( select type, deposit, contract_ym, contract_dt , complex_id, floor,monthly_rent from korex_pref.actual_transaction_price where complex_id is not null order by contract_ym desc, contract_dt desc limit 18446744073709551615) atp1 group by atp1.complex_id) atp2 on cpx.complex_id = atp2.complex_id where cpx.y >= ${starty} and cpx.y<=${endy} and cpx.x>=${startx} and cpx.x<=${endx} limit 1200`;//단지별실거래가 있는 내역ㄱ이 있는 단지내역들만 조인된(각complexid별 최근실거래내역있는,compelxid별 그룹그분)된 내역과 매칭되는 단지내역들리턴. 각row는 구분되는 지도위치조건 만족하면서+단지별실거래정보있는 각 단지별 최근 실거래내역정보.
        }else{
            queryWhereBlo = null;
            queryWhereBloMap = null;
        }


        if(isprobroker){
            //queryWherePro += `select * from company2 where y >= ${level_zido_starty} and y <= ${level_zido_endy} and x >= ${level_zido_startx} and x <= ${level_zido_endx} and type='중개사' limit 20`;
            //queryWhereProMap += `select x,y,company_id from company2 where y >= ${level_zido_starty} and y <= ${level_zido_endy} and x >= ${level_zido_startx} and x <= ${level_zido_endx} and type='중개사' limit 1000`;
            //queryWhereProMap += `select distinct c.company_id as company_id,c.x as x,c.y as y from company2 c join product p on c.company_id=p.company_id join transaction t on p.prd_identity_id=t.prd_identity_id where t.txn_status='거래개시' and c.type='중개사' and c.y >= ${level_zido_starty} and c.y <= ${level_zido_endy} and c.x >= ${level_zido_startx} and c.x <= ${level_zido_endx} group by p.prd_identity_id limit 1000`;//사이드바에 최종표현되는 전문중개사데이터는 지도에서의 위치조건과, 담당수임매물정보가(거래개시인)존재하는것들만 나타내기에 지도에도 그렇게 중개사이면서 거래개시로등록된 매물이 있는 위치조건만족 리스트를 해준다.나온결과자체는 임의 지도위ㅣ조건만족,거래개시등록한 전문중개사의 등록된 거래매물포함 조회리스트 이들중에서 distinct로 구분되는 companyid목록이 최종목적.

            queryWherePro += `select * from company2 where y >= ${starty} and y <= ${endy} and x >= ${startx} and x <= ${endx} and type='중개사' limit 20`;
            //queryWhereProMap += `select x,y,company_id from company2 where y >= ${level_zido_starty} and y <= ${level_zido_endy} and x >= ${level_zido_startx} and x <= ${level_zido_endx} and type='중개사' limit 1000`;
            //queryWherePro += `select distinct * from company2 c join product p on c.company_id=p.company_id join transaction t on p.prd_identity_id=t.prd_identity_id where t.txn_status='거래개시' and ((p.exclusive_start_date is null or p.exclusive_end_date is null) or (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))) and c.type='중개사' and c.y >= ${starty} and c.y <= ${endy} and c.x >= ${startx} and c.x <= ${endx} group by p.prd_identity_id limit 20`;
            queryWhereProMap += `select distinct c.company_id as company_id,c.x as x,c.y as y from company2 c join product p on c.company_id=p.company_id join transaction t on p.prd_identity_id=t.prd_identity_id where t.txn_status='거래개시' and ((p.exclusive_start_date is null or p.exclusive_end_date is null) or (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))) and c.type='중개사' and c.y >= ${starty} and c.y <= ${endy} and c.x >= ${startx} and c.x <= ${endx} group by p.prd_identity_id limit 1000`;//사이드바에 최종표현되는 전문중개사데이터는 지도에서의 위치조건과, 담당수임매물정보가(거래개시인)존재하는것들만 나타내기에 지도에도 그렇게 중개사이면서 거래개시로등록된 매물이 있는 위치조건만족 리스트를 해준다.나온결과자체는 임의 지도위ㅣ조건만족,거래개시등록한 전문중개사의 등록된 거래매물포함 조회리스트 이들중에서 distinct로 구분되는 companyid목록이 최종목적.
        }else{
            queryWherePro = null;
            queryWhereProMap = null;
        }


        if(isexclusive){
            // 매매 /전세 / 월세 각 타입별 분기 처리
            // 매매 / 전세금(보증금) / 월세 분기 처리 
            if(prdSelType){
                queryWhere += " where ("
                queryWhereMap += " where ("
                // 매매
                if(prdSelType[0]){
                    if(tradePriceMin && tradePriceMax){
                        queryWhere += `(p.prd_sel_type = "매매" and p.prd_price between ${tradePriceMin/10000} and ${tradePriceMax/10000})`
                        queryWhereMap += `(p.prd_sel_type = "매매" and p.prd_price between ${tradePriceMin/10000} and ${tradePriceMax/10000})`
                    }else if(tradePriceMin){
                        queryWhere += `(p.prd_sel_type = "매매" and p.prd_price >= ${tradePriceMin/10000})`
                        queryWhereMap += `(p.prd_sel_type = "매매" and p.prd_price >= ${tradePriceMin/10000})`
                    }else if(tradePriceMax){
                        queryWhere += ` (p.prd_sel_type = "매매" and p.prd_price <= ${tradePriceMax/10000})`
                        queryWhereMap += ` (p.prd_sel_type = "매매" and p.prd_price <= ${tradePriceMax/10000})`
                    }
                    if(!tradePriceMin && !tradePriceMax){
                        queryWhere += ` (p.prd_sel_type = "매매" )`
                        queryWhereMap += ` (p.prd_sel_type = "매매" )`
                    }
                }
                else{
                    queryWhere += " (false)"
                    queryWhereMap += " (false)"
                }

                // 전세
                if(prdSelType[1]){
                    queryWhere += " or ";
                    queryWhereMap += " or ";
                    if(jeonsePriceMin && jeonsePriceMax){
                        queryWhere += `(p.prd_sel_type = "전세" and p.prd_price between ${jeonsePriceMin/10000} and ${jeonsePriceMax/10000})`
                        queryWhereMap += `(p.prd_sel_type = "전세" and p.prd_price between ${jeonsePriceMin/10000} and ${jeonsePriceMax/10000})`
                    }else if(jeonsePriceMin){
                        queryWhere += `(p.prd_sel_type = "전세" and p.prd_price >= ${jeonsePriceMin/10000})`
                        queryWhereMap += `(p.prd_sel_type = "전세" and p.prd_price >= ${jeonsePriceMin/10000})`
                    }else if(jeonsePriceMax){
                        queryWhere += ` (p.prd_sel_type = "전세" and p.prd_price <= ${jeonsePriceMax/10000})`
                        queryWhereMap += ` (p.prd_sel_type = "전세" and p.prd_price <= ${jeonsePriceMax/10000})`
                    }
                    if(!jeonsePriceMin && !jeonsePriceMax){
                        queryWhere += ` (p.prd_sel_type = "전세")`
                        queryWhereMap += ` (p.prd_sel_type = "전세")`
                    }
                }else{
                    queryWhere += " or (false)"
                    queryWhereMap += " or (false)"
                }

                if(prdSelType[2]){
                    /*queryWhere += " or ( ";
                    queryWhereMap += " or ( ";

                    if(jeonsePriceMin && jeonsePriceMax){
                        queryWhere += `(prd_sel_type = "월세" and prd_price between ${jeonsePriceMin} and ${jeonsePriceMax})`
                        queryWhereMap += `(prd_sel_type = "월세" and prd_price between ${jeonsePriceMin} and ${jeonsePriceMax})`
                    }else if(jeonsePriceMin){
                        queryWhere += `(prd_sel_type = "월세" and prd_price >= ${jeonsePriceMin})`
                        queryWhereMap += `(prd_sel_type = "월세" and prd_price >= ${jeonsePriceMin})`
                    }else if(jeonsePriceMax){
                        queryWhere += `(prd_sel_type = "월세" and prd_price <= ${jeonsePriceMax})`
                        queryWhereMap += `(prd_sel_type = "월세" and prd_price <= ${jeonsePriceMax})`
                    }else{
                        queryWhere += `(false)`
                        queryWhereMap += `(false)`
                    }*/

                    queryWhere += " or (";
                    queryWhereMap += " or (";

                    if(monthPriceMin && monthPriceMax){
                        if(jeonsePriceMin && jeonsePriceMax){
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_month_price between ${monthPriceMin/10000} and ${monthPriceMax/10000} and p.prd_price between ${jeonsePriceMin/10000} and ${jeonsePriceMax/10000})`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_month_price between ${monthPriceMin/10000} and ${monthPriceMax/10000} and p.prd_price between ${jeonsePriceMin/10000} and ${jeonsePriceMax/10000})`
                        }else if(jeonsePriceMin){
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_month_price between ${monthPriceMin/10000} and ${monthPriceMax/10000} and p.prd_price >= ${jeonsePriceMin/10000} )`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_month_price between ${monthPriceMin/10000} and ${monthPriceMax/10000} and p.prd_price >= ${jeonsePriceMin/10000})`
                        }else if(jeonsePriceMax){
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_month_price between ${monthPriceMin/10000} and ${monthPriceMax/10000} and p.prd_price  <= ${jeonsePriceMax/10000} )`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_month_price between ${monthPriceMin/10000} and ${monthPriceMax/10000} and p.prd_price <= ${jeonsePriceMax/10000})`
                        }else{
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_month_price between ${monthPriceMin/10000} and ${monthPriceMax/10000})`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_month_price between ${monthPriceMin/10000} and ${monthPriceMax/10000})`
                        }
                        
                    }else if(monthPriceMin){
                        if(jeonsePriceMin && jeonsePriceMax){
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_month_price >= ${monthPriceMin/10000} and p.prd_price between ${jeonsePriceMin/10000} and ${jeonsePriceMax/10000})`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_month_price >= ${monthPriceMin/10000} and p.prd_price between ${jeonsePriceMin/10000} and ${jeonsePriceMax/10000})`
                        }else if(jeonsePriceMin){
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_month_price >= ${monthPriceMin/10000} and p.prd_price >= ${jeonsePriceMin/10000})`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_month_price >= ${monthPriceMin/10000} and p.prd_price >= ${jeonsePriceMin/10000})`
                        }else if(jeonsePriceMax){
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_month_price >= ${monthPriceMin/10000} and p.prd_price  <= ${jeonsePriceMax/10000})`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_month_price >= ${monthPriceMin/10000} and p.prd_price  <= ${jeonsePriceMax/10000})`
                        }else{
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_month_price >= ${monthPriceMin/10000})`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_month_price >= ${monthPriceMin/10000})`
                        }
                        
                    }else if(monthPriceMax){
                        if(jeonsePriceMin && jeonsePriceMax){
                            queryWhere += ` (p.prd_sel_type = "월세" and p.prd_month_price <= ${monthPriceMax/10000} and p.prd_price between ${jeonsePriceMin/10000} and ${jeonsePriceMax/10000})`
                            queryWhereMap += ` (p.prd_sel_type = "월세" and p.prd_month_price <= ${monthPriceMax/10000} and p.prd_price between ${jeonsePriceMin/10000} and ${jeonsePriceMax/10000})`
                        }else if(jeonsePriceMin){
                            queryWhere += ` (p.prd_sel_type = "월세" and p.prd_month_price <= ${monthPriceMax/10000} and p.prd_price >= ${jeonsePriceMin/10000})`
                            queryWhereMap += ` (p.prd_sel_type = "월세" and p.prd_month_price <= ${monthPriceMax/10000} and p.prd_price >= ${jeonsePriceMin/10000})`
                        }else if(jeonsePriceMax){
                            queryWhere += ` (p.prd_sel_type = "월세" and p.prd_month_price <= ${monthPriceMax/10000} and p.prd_price <= ${jeonsePriceMax/10000})`
                            queryWhereMap += ` (p.prd_sel_type = "월세" and p.prd_month_price <= ${monthPriceMax/10000} and p.prd_price <= ${jeonsePriceMax/10000})`
                        }else{
                            queryWhere += ` (p.prd_sel_type = "월세" and p.prd_month_price <= ${monthPriceMax/10000})`
                            queryWhereMap += ` (p.prd_sel_type = "월세" and p.prd_month_price <= ${monthPriceMax/10000})`
                        }
                        
                    }else{
                        if(jeonsePriceMin && jeonsePriceMax){
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_price between ${jeonsePriceMin/10000} and ${jeonsePriceMax/10000})`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_price between ${jeonsePriceMin/10000} and ${jeonsePriceMax/10000})`
                        }else if(jeonsePriceMin){
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_price >= ${jeonsePriceMin/10000})`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_price >= ${jeonsePriceMin/10000})`
                        }else if(jeonsePriceMax){
                            queryWhere += `(p.prd_sel_type = "월세" and p.prd_price <= ${jeonsePriceMax/10000})`
                            queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_price <= ${jeonsePriceMax/10000})`
                        }else{
                            queryWhere += ` (p.prd_sel_type = "월세")`
                            queryWhereMap += ` (p.prd_sel_type = "월세")`
                        }                      
                    }

                    queryWhere += " )";
                    queryWhereMap += " )";

                    /*if(!monthPriceMin && !monthPriceMax && !jeonsePriceMin && !jeonsePriceMax){
                        queryWhere += ` or (prd_sel_type = "월세")`
                        queryWhereMap += ` or (prd_sel_type = "월세")`
                    }*/
                }else{
                    queryWhere += ` or (false)`
                    queryWhereMap += ` or (false)`
                }
                queryWhere += `)`
                queryWhereMap += `)`
            }
            // 공급 면적 or 전용면적
            if(prd_type=='아파트'){
                if(supplySpaceMin && supplySpaceMax){
                    queryWhere +=`and p.supply_pyeong between ${supplySpaceMin} and ${supplySpaceMax}`;
                    queryWhereMap +=`and p.supply_pyeong between ${supplySpaceMin} and ${supplySpaceMax}`;
                }else if(supplySpaceMin){
                    queryWhere +=`and p.supply_pyeong >= ${supplySpaceMin}`;
                    queryWhereMap +=`and p.supply_pyeong >= ${supplySpaceMin}`;
                }else if(supplySpaceMax){
                    queryWhere +=`and p.supply_pyeong <= ${supplySpaceMax}`;
                    queryWhereMap +=`and p.supply_pyeong <= ${supplySpaceMax}`;
                }
            }else{
                if(supplySpaceMin && supplySpaceMax){
                    queryWhere +=`and p.exclusive_pyeong between ${supplySpaceMin} and ${supplySpaceMax}`;
                    queryWhereMap +=`and p.exclusive_pyeong between ${supplySpaceMin} and ${supplySpaceMax}`;
                }else if(supplySpaceMin){
                    queryWhere +=`and p.exclusive_pyeong >= ${supplySpaceMin}`;
                    queryWhereMap +=`and p.exclusive_pyeong >= ${supplySpaceMin}`;
                }else if(supplySpaceMax){
                    queryWhere +=`and p.exclusive_pyeong <= ${supplySpaceMax}`;
                    queryWhereMap +=`and p.exclusive_pyeong <= ${supplySpaceMax}`;
                }
            }
            
            // 관리비 있는 경우에만 있음 경우에만 관리비관련 범위 쿼리진행.
            if(isManagement == 1){
                if(managementPriceMin && managementPriceMax){
                    queryWhere +=` and p.managecost between ${managementPriceMin/10000} and ${managementPriceMax/10000}`;
                    queryWhereMap +=` and p.managecost between ${managementPriceMin/10000} and ${managementPriceMax/10000}`;
                }else if(managementPriceMin){
                    queryWhere +=` and p.managecost >= ${managementPriceMin/10000}`;
                    queryWhereMap +=` and p.managecost >= ${managementPriceMin/10000}`;
                }else if(managementPriceMax){
                    queryWhere +=` and p.managecost <= ${managementPriceMax/10000}`;
                    queryWhereMap +=` and p.managecost <= ${managementPriceMax/10000}`;
                }
            }

            const dataArr = [
                // query: 상단 쿼리 , searchTitle: 컬럼 이름, arr: 데이터
                {query: prdType, searchTitle: "p.prd_type", arr: prdTypeData}, // 건물 타입
                {query: floor, searchTitle: "p.floorint", arr: floorData}, // 층수 
                {query: roomCount, searchTitle: "p.room_count", arr: roomCountData}, // 방수 
                {query: bathCount, searchTitle: "p.bathroom_count", arr: bathCountData}, // 욕실수 
                {query: isParking, searchTitle: "p.is_parking", arr: isParkingData}, // 주차 가능 여부(오피스텔,상가,사무실)
                {query: isToilet, searchTitle: "p.is_toilet", arr: isToiletData}, // 전용 화장실 여부 (상가사무실)

                {query: isManagement, searchTitle: "p.is_managecost", arr: isManagementData}, // 관리비 여부
                {query: totalHousehold, searchTitle: "c.household_cnt", arr: totalHouseholdData}, // 총세대수
                {query: prdUsage, searchTitle: "p.prd_usage", arr: prdUsageData}, // 용도 오피스텔
                {query: isDouble, searchTitle: "p.is_duplex_floor", arr: isDoubleData}, // 복층여부
                {query: isPet, searchTitle: "p.is_pet", arr: isPetData}, // 반려동물 여부
            ]
            dataArr.map(item => {
                if(item.query !== null){
                    queryWhere += ` and ${item.searchTitle} ${retrunData(item.query, item.arr)}`
                    queryWhereMap += ` and ${item.searchTitle} ${retrunData(item.query, item.arr)}`
                }
            });
            // 방구조
            if(roomStructure){
                let text = roomStructure[0];
                for(let i = 1 ; i < roomStructure.length ; i++){
                    text += `|${roomStructure[i]}`
                }
                queryWhere +=` and p.room_structure REGEXP '${text}'`;
                queryWhereMap +=` and p.room_structure REGEXP '${text}'`;
            }
            // 사용승인일
            if(acceptUseDate && (prd_type =='오피스텔' || prd_type=='아파트')){
                const today = new Date();
                if(acceptUseDate == 2){
                    const date = DateText(new Date(today.setFullYear(today.getFullYear() - 5)), "-");
                    queryWhere +=` and c.approval_date>=date_format('${date}', '%Y%m%d')`;
                    queryWhereMap +=` and c.approval_date>=date_format('${date}', '%Y%m%d')`;
                }else if(acceptUseDate == 3){
                    const date = DateText(new Date(today.setFullYear(today.getFullYear() - 10)), "-");
                    queryWhere +=` and c.approval_date>=date_format('${date}', '%Y%m%d')`;
                    queryWhereMap +=` and c.approval_date>=date_format('${date}', '%Y%m%d')`;
                }else if(acceptUseDate == 4){
                    const date = DateText(new Date(today.setFullYear(today.getFullYear() - 20)), "-");
                    queryWhere +=` and c.approval_date>=date_format('${date}', '%Y%m%d')`;
                    queryWhereMap +=` and c.approval_date>=date_format('${date}', '%Y%m%d')`;
                }else if(acceptUseDate == 5){
                    const date = DateText(new Date(today.setFullYear(today.getFullYear() - 20)), "-");
                    queryWhere +=` and c.approval_date<=date_format('${date}', '%Y%m%d')`;
                    queryWhereMap +=` and c.approval_date<=date_format('${date}', '%Y%m%d')`;
                }
            }

            queryWhere += ` and p.prd_latitude >= ${starty} and p.prd_latitude <= ${endy} and p.prd_longitude >= ${startx} and p.prd_longitude <= ${endx} and (prd_status='거래개시' or prd_status='거래완료동의요청' or prd_status='거래완료동의요청거절') and (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))`; 
            queryWhereMap += ` and p.prd_latitude >= ${starty} and p.prd_latitude <= ${endy} and p.prd_longitude >= ${startx} and p.prd_longitude <= ${endx} and (prd_status='거래개시' or prd_status='거래완료동의요청' or prd_status='거래완료동의요청거절') and (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))`;
            queryWhere += " group by p.prd_id limit 10";
            queryWhereMap += " group by p.prd_id  limit 500";
        }else{
            queryWhere = null;
            queryWhereMap = null;
        }

        /*let exc = await mapFilterMapper.getProductList(queryWhere);
        let excMap = await mapFilterMapper.getProductMapList(queryWhereMap);
        let pro = await mapFilterMapper.getCompanyList(queryWherePro);
        let blo = await mapFilterMapper.getComplexList(queryWhereBlo);
        let excMap = await mapFilterMapper.getProductMapList(queryWhereMap);
        let proMap = await mapFilterMapper.getCompanyMapList(queryWhereProMap);
        let bloMap = await mapFilterMapper.getComplexMapList(queryWhereBloMap);
        */
        console.log('QUERYWHERESSS:',queryWhere);
        console.log('queryWhereblockss:',queryWhereBlo);
        let matchedlist_get = await mapFilterMapper.matchedlist(prd_type,queryWhere,queryWhereMap,queryWherePro,queryWhereProMap,queryWhereBlo,queryWhereBloMap,mem_id);
        let exc= matchedlist_get[0];
        let pro = matchedlist_get[1];
        let blo = matchedlist_get[2];
        let excMap = matchedlist_get[3];
        let proMap = matchedlist_get[4];
        let bloMap = matchedlist_get[5];
        
        //console.log('matched prosss:',exc,excMap);

        return [exc, pro, blo, excMap, proMap, bloMap];
    },
}