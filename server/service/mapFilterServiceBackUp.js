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

// 방수
const roomCountData =[
    {num: 1, name:">= 0"},
    {num: 2, name:"= 1"},
    {num: 3, name:"= 2"},
    {num: 4, name:"= 3"},
    {num: 5, name:">= 4"},
]

// 욕실수
const bathCountData =[
    {num: 1, name:">= 0"},
    {num: 2, name:"= 1"},
    {num: 3, name:"= 2"},
    {num: 4, name:">= 3"},
]

// 주차 여부
const isParkingData = [
    {num: 0, name: "= 0"},
    {num: 1, name: "= 1"},
]

// 전용화장실 여부
const isToiletData = [
    {num: 0, name: "= 0"},
    {num: 1, name: "= 1"},
] 

// 관리비 여부
const isManagementData = [
    {num: 0, name: "= 0"},
    {num: 1, name: "= 1"},
]

// 사용승인일
const totalHouseholdData = [
    {num: 1, name: ">= 0"},
    {num: 2, name: ">= 200"},
    {num: 3, name: ">= 500"},
    {num: 4, name: ">= 1000"},
    {num: 5, name: ">= 2000"},
] 

const prdUsageData = [
    {num: 1, name: "= '전체'"},
    {num: 2, name: "= '주거용'"},
    {num: 3, name: "= '업무용'"},
]

// 복층 여부
const isDoubleData = [
    {num: 0, name: "= 0"},
    {num: 1, name: "= 1"},
]
// 반려동물 여부
const isPetData = [
    {num: 0, name: "= 0"},
    {num: 1, name: "= 1"},
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
        const {
            prdType, // 건물 타입
            prdSelType, // 거래 타입
            tradePriceMin, // 매매 최소
            tradePriceMax, // 매매 최대
            jeonsePriceMin, // 전세 최소
            jeonsePriceMax, // 전세 최대
            monthPriceMin, // 월세 최소
            monthPriceMax, // 월세 최대
            isToilet, // 화장실 유무
            supplySpaceMin, // 공급면적 최소
            supplySpaceMax, // 공급면적 최대
            floor, // 층수
            roomCount, // 방수
            bathCount, // 욕실수
            isParking, // 주차 가능 여부
            isManagement, // 관리비 여부
            managementPriceMin, // 관리비 최소
            managementPriceMax, // 관리비 최대
            acceptUseDate, // 사용승인일
            totalHousehold, // 총세대수
            prdUsage, // 용도
            roomStructure, // 방구조
            isDouble, // 복층 여부
            isPet, // 반려동물 여부

            
        }=req.body; 
        var queryWhere = "";

        // 매매 /전세 / 월세 각 타입별 분기 처리
        // 매매 / 전세금(보증금) / 월세 분기 처리 
        if(prdSelType){
            queryWhere += " where ("
            // 매매
            if(prdSelType.some(item => item == 1)){
                if(tradePriceMin && tradePriceMax){
                    queryWhere += `(prd_sel_type = "매매" and prd_price between ${tradePriceMin} and ${tradePriceMax})`
                }else if(tradePriceMin){
                    queryWhere += `(prd_sel_type = "매매" and prd_price >= ${tradePriceMin})`
                }else if(tradePriceMax){
                    queryWhere += ` (prd_sel_type = "매매" and prd_price <= ${tradePriceMax})`
                }
                if(!tradePriceMin && !tradePriceMax){
                    queryWhere += ` (prd_sel_type = "매매" )`
                }
            }
            else{
                queryWhere += " (false)"
            }

            // 전세
            if(prdSelType.some(item => item == 2)){
                queryWhere += " or ";
                if(jeonsePriceMin && jeonsePriceMax){
                    queryWhere += `(prd_sel_type = "전세" and prd_price between ${jeonsePriceMin} and ${jeonsePriceMax})`
                }else if(jeonsePriceMin){
                    queryWhere += `(prd_sel_type = "전세" and prd_price >= ${jeonsePriceMin})`
                }else if(jeonsePriceMax){
                    queryWhere += ` (prd_sel_type = "전세" and prd_price <= ${jeonsePriceMax})`
                }
                if(!jeonsePriceMin && !jeonsePriceMax){
                    queryWhere += ` (prd_sel_type = "전세")`
                }
            }else{
                queryWhere += " or (false)"
            }

            // 월세 (보증금)
            if(prdSelType.some(item => item == 3)){
                queryWhere += " or ";
                if(jeonsePriceMin && jeonsePriceMax){
                    queryWhere += `(prd_sel_type = "월세" and prd_price between ${jeonsePriceMin} and ${jeonsePriceMax})`
                }else if(jeonsePriceMin){
                    queryWhere += `(prd_sel_type = "월세" and prd_price >= ${jeonsePriceMin})`
                }else if(jeonsePriceMax){
                    queryWhere += ` (prd_sel_type = "월세" and prd_price <= ${jeonsePriceMax})`
                }
                if(!jeonsePriceMin && !jeonsePriceMax){
                    queryWhere += ` (prd_sel_type = "월세")`
                }
            }else{
                queryWhere += " or (false)"
            }

            // 월세
            if(prdSelType.some(item => item == 3)){
                queryWhere += " or ";
                if(monthPriceMin && monthPriceMax){
                    queryWhere += `(prd_sel_type = "월세" and prd_month_price between ${monthPriceMin} and ${monthPriceMax})`
                }else if(monthPriceMin){
                    queryWhere += `(prd_sel_type = "월세" and prd_month_price >= ${monthPriceMin})`
                }else if(monthPriceMax){
                    queryWhere += ` (prd_sel_type = "월세" and prd_month_price <= ${monthPriceMax})`
                }
                if(!monthPriceMin && !monthPriceMax){
                    queryWhere += ` (prd_sel_type = "월세")`
                }
            }else{
                queryWhere += ` or (false)`
            }
            queryWhere += `)`
        }

        // 공급 면적
        if(supplySpaceMin && supplySpaceMax){
            queryWhere +=`and supply_area between ${supplySpaceMin} and ${supplySpaceMax}`;
        }else if(supplySpaceMin){
            queryWhere +=`and supply_area >= ${supplySpaceMin}`;
        }else if(supplySpaceMax){
            queryWhere +=`and supply_area <= ${supplySpaceMax}`;
        }

        // 관리비
        if(managementPriceMin && managementPriceMax){
            queryWhere +=`and management_price between ${managementPriceMin} and ${managementPriceMax}`;
        }else if(managementPriceMin){
            queryWhere +=`and management_price >= ${managementPriceMin}`;
        }else if(managementPriceMax){
            queryWhere +=`and management_price <= ${managementPriceMax}`;
        }

        const dataArr = [
            // query: 상단 쿼리 , searchTitle: 컬럼 이름, arr: 데이터
            {query: prdType, searchTitle: "prd_type", arr: prdTypeData}, // 건물 타입
            {query: floor, searchTitle: "floor", arr: floorData}, // 층수
            {query: roomCount, searchTitle: "room_count", arr: roomCountData}, // 방수
            {query: bathCount, searchTitle: "bathroom_count", arr: bathCountData}, // 욕실수
            {query: isParking, searchTitle: "is_parking", arr: isParkingData}, // 주차 가능 여부
            {query: isToilet, searchTitle: "is_toilet", arr: isToiletData}, // 전용 화장실 여부

            {query: isManagement, searchTitle: "is_managecost", arr: isManagementData}, // 관리비 여부
            {query: totalHousehold, searchTitle: "total_household", arr: totalHouseholdData}, // 총세대수
            {query: prdUsage, searchTitle: "prd_usage", arr: prdUsageData}, // 용도
            {query: isDouble, searchTitle: "is_double", arr: isDoubleData}, // 복층여부
            {query: isPet, searchTitle: "is_pet", arr: isPetData}, // 반려동물 여부
        ]
        
        dataArr.map(item => {
            if(item.query !== null){
                queryWhere += ` and ${item.searchTitle} ${retrunData(item.query, item.arr)}`
            }
        });

        // 방구조
        if(roomStructure){
            let text = roomStructure[0];
            for(let i = 1 ; i < roomStructure.length ; i++){
                text += `|${roomStructure[i]}`
            }
            queryWhere +=` and room_structure REGEXP  '${text}'`;
        }
        
        // 사용승인일
        if(acceptUseDate){
            const today = new Date();
            if(acceptUseDate == 2){
                queryWhere +=` and accept_use_date>=date_format('${DateText(new Date(today.setFullYear(today.getFullYear() - 5)), "-")}', '%Y%m%d')`;
            }else if(acceptUseDate == 3){
                queryWhere +=` and accept_use_date>=date_format('${DateText(new Date(today.setFullYear(today.getFullYear() - 10)), "-")}', '%Y%m%d')`;
            }else if(acceptUseDate == 4){
                queryWhere +=` and accept_use_date>=date_format('${DateText(new Date(today.setFullYear(today.getFullYear() - 20)), "-")}', '%Y%m%d')`;
            }else if(acceptUseDate == 5){
                queryWhere +=` and accept_use_date>=date_format('${DateText(new Date(today.setFullYear(today.getFullYear() - 999)), "-")}', '%Y%m%d')`;
            }
        }

        // prd_identity_id 중복 제거
        queryWhere += " group by prd_identity_id";
        console.clear();
        console.log("-------------------")
        console.log(queryWhere);
        
        return await mapFilterMapper.getProductList(queryWhere);
    },
}