const productMapper = require('../mapper/product');
const mysqls=require('mysql2/promise');
const pool= mysqls.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref'
});


function data_ascending(a,b){
    var left = new Date(a['date']).getTime();
    var right = new Date(b['date']).getTime();

    return left > right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
}
function data_ascending_pure(a,b){
    var left=new Date(a).getTime();
    var right =new Date(b).getTime();

    return left > right ? 1 : -1;
}
function data_descending(a,b){
    var left = a['prd_id'];
    var right = b['prd_id'];

    return left < right ? 1 : -1;
}

module.exports = {
    
    async matchedlist(prd_type,queryWhere,queryWhereMap,queryWherePro,queryWhereProMap,queryWhereBlo,queryWhereBloMap,mem_id){

        const connection = await pool.getConnection(async conn => conn);
        const productFileds = await productMapper.getProductFields('public')
        var company_map_rows; 
        var complex_rows;
        var complex_map_rows;
        var company_rows;
        var rows_map_result;
        var rows_result;

        try{
            if(queryWhere == null){   
                rows_result=[];
            }else{
                //상가나 사무실의 경우 product,transacton조인쿼리까진 나오나 complexid,buildingsid는 비어있기에 조인에서 ㄴ안나옴., 결과값을 못찍어냄.
                if(prd_type =='오피스텔' || prd_type =='아파트'){
                    
                    /*var [rows] =  await connection.query(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike, p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id, p.prd_id as prd_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost,p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure,p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type, bd.dong_name as dong_name, bd.grd_floor as grd_floor,c.complex_name as complex_name,c.dong_cnt as dong_cnt,c.approval_date as approval_date,c.total_parking_cnt as total_parking_cnt, c.household_cnt as household_cnt FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id join buildings bd on p.bld_id=bd.bld_id join complex c on bd.complex_id=c.complex_id` + queryWhere);
                    console.log(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike, p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id, p.prd_id as prd_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost,p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure,p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type, bd.dong_name as dong_name, bd.grd_floor as grd_floor,c.complex_name as complex_name,c.dong_cnt as dong_cnt,c.approval_date as approval_date,c.total_parking_cnt as total_parking_cnt, c.household_cnt as household_cnt 
                    */
                    console.log(`select ${productFileds}, (select count(*) from likes li where p.prd_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike FROM product p 
                    join (
                        select bld_id as b_id, complex_id from buildings
                    ) bd on p.bld_id= b_id
                    join (
                        select complex_id as cpx_id from complex
                    ) c on bd.complex_id=c.cpx_id 
                    ${queryWhere}
                    `);
                    var [rows] =  await connection.query(`select ${productFileds}, (select count(*) from likes li where p.prd_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike FROM product p 
                    join (
                        select bld_id as b_id, complex_id from buildings
                    ) bd on p.bld_id= b_id
                    join (
                        select complex_id as cpx_id from complex
                    ) c on bd.complex_id=c.cpx_id 
                    ${queryWhere}
                    `);
                }else{
                    /*var [rows] =  await connection.query(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike,  p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id, p.prd_id as prd_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost, p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure, p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id` + queryWhere);
                    console.log(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike,  p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id,p.prd_id as prd_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost, p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure, p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id` + queryWhere);
                    */
                    console.log(`
                    select ${productFileds}, (select count(*) from likes li where p.prd_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike
                    FROM product p 
                    ${queryWhere}
                    `);
                    var [rows] =  await connection.query(`
                    select ${productFileds}, (select count(*) from likes li where p.prd_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike
                    FROM product p 
                    ${queryWhere}
                    `);
                }
                console.log(rows)
                rows_result = rows;
                //console.log('rows_reusltssss:',rows_result);
            }
            
    
            if(queryWhereMap == null){
                rows_map_result=[];
            }else{
                if(prd_type == '아파트' || prd_type =='오피스텔'){
                    var [rows] =  await connection.query(`SELECT p.prd_latitude, p.prd_longitude,prd_status as txn_status FROM product p join buildings bd on p.bld_id=bd.bld_id join complex c on bd.complex_id=c.complex_id` + queryWhereMap);
                }else{
                    var [rows] = await connection.query(`SELECT p.prd_latitude, p.prd_longitude, prd_status as txn_status FROM product p` + queryWhereMap);
                }
                
                rows_map_result = rows;
                //console.log('rows_mapo_resultsss:',rows_map_result);
            }

            if(queryWherePro == null){
                company_rows=[];
            }else{
                let [rows] =  await connection.query(queryWherePro);
                company_rows=[];
                //2.전문중개사 목록들 관련 위치기준의 만족 전문중개사리스트 전체를 뽑고, 각 companyid별 매칭되는 수임매물들정보 + 전문종목 관련 최신승인쿼리진행.
                //console.log('관련 전문중개사 리스트::',rows);//idle시마단 20개씩 가져오며, 지도map에 보여주는 전용데이터는 company2로만 가져옴. 추가로 안들고아도돼고, 사이드바 데이터의 경우는 idle시마다 20개 리밋씩 가져온다. 전속매물 관련 스크롤링시에 가져올때 +1개씩 가져올때도 마찬가지로.전문종목+수임매물현황상태(매매,전세,월세몇건여부)들고오기.
                for(let p=0; p<rows.length; p++){
                    let companyid_local = rows[p]['company_id'];//각 전문중개사.
                    let [probroker_permission_info] = await connection.query("select prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from pro_realtor_permission prp left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where company_id=? and permission_state='승인' order by prp_id desc",[companyid_local]);//전문중개사 전문종목 신청내역중 가장 최근 승인된것 가장 최근 승인된 정보 전문종목 정보.승인으로 처리시에 관리자에서 로직적으로 관련 comapny2는 프로상태로 하고, 미승인이나 취소처리시엔 ispro값을 해제한다.
                    let [probroker_asign_productinfo] = await connection.query("select distinct prd_id from product where company_id=?",[companyid_local]);//해당 comapnyid에 관련된 모든 매물리스트 가져온다. 구별된 prd_identity매물리스트 내역들.
                    //console.log('전문중개사companyid:',companyid_local);
                    //console.log('해당 관련 전문중개사 전문종목 최근승인정보:',probroker_permission_info);
                    //console.log('해당 전문중개사가 수임하고있는 관련 매물들prd_identitiy_id리스트:',probroker_asign_productinfo);

                    let matched_productinfo_array=[];//임의 전문중개사가 수임한 매물들 정보 저장 임시저장.
                    for(let pp=0; pp<probroker_asign_productinfo.length; pp++){
                        let prd_identity_id=probroker_asign_productinfo[pp]['prd_id'];//id값.
                        let [product_transaction_query] = await connection.query("select * from product p where p.prd_id=? and prd_status='거래개시' and ((p.exclusive_start_date is null or p.exclusive_end_date is null) or (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d')))",[prd_identity_id]);//관련 매물&거래정보 조인내역들중 가장 첫 row가 의미하는것은 각 매물별 origin 매물의 최근 수정등 자체근본 정보를 의미하며,매칭되어 나타나는 매 동일한 공통된 transaction값이 곧 매물의 최근 상태값이다.그걸 기준으로 각 매물별 상태값 측정.
                        if(product_transaction_query[0]){
                            matched_productinfo_array.push(product_transaction_query[0]);
                        }                      
                    }
                    //console.log('각 전문중개사별 수임 매물리스트정보transciton::',matched_productinfo_array); matchedproductinfoararya는 임의전문중개사수임매물리스트(거래개시인것들만)내역이며 이들에 각 prdieintidtiyid값이있고, 이 값들중 가장 큰값(가장 최근등록:중개의뢰등록된,외부수임등록된)된게 최근등록된물건임. matched_prouctinfo_array는 거래개시한품목매물리스트여부이며, 이게 없다는것은 거래개시된 상태의 매물이없는 상태의 전문중개사이며 노출안함.
                    if(matched_productinfo_array.length>=1){
                        company_rows[p]={};
                        company_rows[p]['company_id']=companyid_local;
                        if(probroker_permission_info[0]){
                            company_rows[p]['permission_info'] = probroker_permission_info[0];
                        }                    
                        company_rows[p]['probroker_info'] = rows[p];
                        company_rows[p]['asign_productinfo']= matched_productinfo_array;
                        let recent_register_productinfo;
                        
                        recent_register_productinfo=matched_productinfo_array.sort(data_descending);//최근등록된 순으로 productinfo가져옴.리스트.
                        company_rows[p]['recent_asign_productinfo']=recent_register_productinfo[0]['prd_id'];                       
                    }                                 
                }
            }

            //전문중개사 지도 관련 데이터는 전문중개사의 위치값 전문중개사리스트만 조회한다.
            if(queryWhereProMap == null){
                company_map_rows=[];
            }else{
                let [rows] =  await connection.query(queryWhereProMap);

                company_map_rows= rows;
            }
        
            if(queryWhereBlo == null){
                complex_rows=[];
            }else{
                //let [rows] =  await connection.query(queryWhereBlo);
                //console.log('sidebar datass???:',queryWhereBlo);
                let [rows] = await connection.query(queryWhereBlo);//단지별실거래가 있는 내역들만 조회됨.

                complex_rows= rows;
                /*for(let b=0; b<rows_groupby.length; b++){
                    let complexid_local = rows_groupby[b]['complex_id'];//각 단지별id값. complexidlocal
                    //let complex_detailrow = rows[b];//각 단지정보
                    //console.log("select max(concat(apt.contract_ym,if(apt.contract_dt < 10 , concat('0',apt.contract_dt) , apt.contract_dt) as contract_dt) as recent_date from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=");
                    let [recent_date_cond]=await connection.query("select max(concat(apt.contract_ym,if(apt.contract_dt < 10 , concat('0',apt.contract_dt) , apt.contract_dt)))as recent_date from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=?",[complexid_local]);//각 단지번호에 해당값중에서 가장 최근의높은값.
                    let recent_cond=recent_date_cond[0]['recent_date'];
                    //console.log('각 단지:',complexid_local,recent_cond);

                    let [recent_transaction_info ] = await connection.query("select * from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=? and concat(apt.contract_ym,if(apt.contract_dt<10 , concat('0',apt.contract_dt), apt.contract_dt))=?",[complexid_local,recent_cond]);
                    //console.log("각 단지별 최근 거래내역 정보값::",recent_transaction_info[0]);

                    complex_rows[b]= recent_transaction_info[0];//각 단지,면적,단지별실거래 정보중 가장 최근의거래내역에 해댕하는 단지정보(여러개의 실거래별 단지정보는 모두 같음.단지별실거래,면적 정보들만 다를뿐.)      
                }*/
            }
    
            if(queryWhereBloMap == null){
                complex_map_rows=[];
            }else{
                //console.log('queryhwereblomap ssss....:',queryWhereBloMap);
                let [rows] =  await connection.query(queryWhereBloMap);
                //console.log('rows gorup by ::',queryWhereBloMap+' limit 1000'); 지도에 표현 마커용 단지별실거래 데이터의경우 최근실거래내역들까지 같이 조인형태이든 배열형탣이든 들고올경우 서버측에서 엄청난 병목현상 발생하여 최적화 관련 쿼리부분에서 상당히 고도화 로직처리 부분이 필요하여 일단 지도표현부분은 complex 정보만 들고오는 기존형태대로 진행.
                //let [rows_groupby]= await connection.query(queryWhereBloMap+' limit 1000');
                complex_map_rows= rows;
                /*
                for(let b=0; b<rows_groupby.length; b++){
                    let complexid_local = rows_groupby[b]['complex_id'];

                    let [recent_date_cond] = await connection.query("select max(concat(apt.contract_ym,if(apt.contract_dt <10, concat('0',apt.contract_dt), apt.contract_dt)))as recent_date from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=?",[complexid_local]);//각 단지번호에 해당값중에서 조인쿼리실거래내역정보중에서 가장 높은 concat 계약(거래)일 최근값string형태리턴
                    let recent_cond =recent_date_cond[0]['recent_date'];
                    //console.log('각 단지:',complexid_local,recent_cond);

                    let [recent_transaction_info] = await connection.query("select * from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=? and concat(apt.contract_ym,if(apt.contract_dt<10,concat('0',apt.contract_dt),apt.contract_dt))=?",[complexid_local,recent_cond]);
                    //console.log('각 단지별 최근 거래내역 정보값:',recent_transaction_info);

                    complex_map_rows[b]=recent_transaction_info[0];
                }*/
            }
        }
        catch(e){
            console.log('erroqr발생::',e);
        }
        
        //console.log('rows_result:',rows_result);
        //console.log('complex_rows:',complex_rows);
        //console.log('company_rowss:',company_rows);
        //console.log('complex_map_rowss:',complex_map_rows);

        connection.release();

        return [rows_result,company_rows,complex_rows,rows_map_result,company_map_rows,complex_map_rows];
    }
    /*
    async getProductList(queryWhere){
        
        if(queryWhere == null){return [];}
        const connection = await pool.getConnection(async conn => conn);
        let [rows] =  await connection.query(`
            SELECT 
            p.*, 
            (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike  
            FROM product p
        ` + queryWhere);
        connection.release();
        console.log('products match resultss sidebar:',rows);
        return rows;
    },

    async getProductMapList(queryWhereMap){
        if(queryWhereMap == null){return [];}
        const connection = await pool.getConnection(async conn => conn);
        let [rows] =  await connection.query(`
            SELECT * FROM product 
        ` + queryWhereMap);
        connection.release();
        console.log('products match resultss all map:',rows);
        return rows;
    },

    async getCompanyList(queryWherePro){
        if(queryWherePro == null){return [];}
        const connection = await pool.getConnection(async conn => conn);
        let [rows] =  await connection.query(queryWherePro);
        connection.release();
        return rows;
    },

    async getCompanyMapList(queryWhereProMap){
        if(queryWhereProMap == null){return [];}
        const connection = await pool.getConnection(async conn => conn);
        let [rows] =  await connection.query(queryWhereProMap);
        connection.release();
        return rows;
    },

    async getComplexList(queryWhereBlo){
        if(queryWhereBlo == null){return [];}
        const connection = await pool.getConnection(async conn => conn);
        let [rows] =  await connection.query(queryWhereBlo);
        connection.release();
        return rows;
    },

    async getComplexMapList(queryWhereBloMap){
        if(queryWhereBloMap == null){return [];}
        const connection = await pool.getConnection(async conn => conn);
        let [rows] =  await connection.query(queryWhereBloMap);
        connection.release();
        return rows;
    },*/
}