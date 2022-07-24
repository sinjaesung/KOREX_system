const http=require('http');
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const request_api=require('request-promise-native');

const path=require('path');
var appdir=path.dirname(require.main.filename);

const areaTablepath='D:\\koreax\\areaTable';
//const CTPRVNJSON =require(areaTablepath+'\\TL_SCCO_CTPRVN.json');
//const SIGJSON = require(areaTablepath +'\\TL_SCCO_SIG.json');
//const EMDJSON = require(areaTablepath+'\\TL_SCCO_EMD.json');

const CTPRVNJSON=require(appdir+'/mapjson/TL_SCCO_CTPRVN.json');
const SIGJSON=require(appdir+'/mapjson/TL_SCCO_SIG.json');
const EMDJSON=require(appdir+'/mapjson/TL_SCCO_EMD.json');

//const app=express();
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(cors());

const mysqls=require('mysql2/promise');

const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { isUndefined } = require('util');
const pool =mysqls.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    //host: 'localhost',
    //host : '13.209.251.38',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref',
    dateStrings : 'date'
});

console.log('==>>>>>matterialRouter default program excecute poolss::',pool);

const router=express.Router(); 

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
    var left = a['prd_identity_id'];
    var right = b['prd_identity_id'];

    return left < right ? 1 : -1;
}


//재귀탐사 재귀n차원 배열의 원소탐색
function loop_search(target){
    console.log('재귀탐사 시작:',target);

    if(target.constructor === Array){
        console.log('넘어온 인자 객체요소가 배열인경우 하위자식 탐사:',target);
        for(let ss=0; ss<target.length; ss++){
            let target_item=target[ss];
            loop_search(target_item);//자식요소 순회 이벤트큐 실행흐름.
        }
    }else{
        //배열이 아니라면 문자열값이라는것이고 이러한 값이면 바로조회해서 처리
        console.log('넘어온 인자개체요소가 배열이 아니고 value값인경우, 하위자식 비탐사:',target);
        searcharea_polygon.push(target);
    }
}

//단지명 검색.(중개의뢰,외부수임등록)
router.post('/complex_search_query',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        var dangi_name=req_body.dangi_name;
       
        //product에 가장 먼저 넣고, 추출해야할것은 prd_id(insertId이고) 이 insertid를 prd_identity_id대입한다.
        var complex_search_query="select * from complex where complex_name like '%"+dangi_name+"%' limit 100";

        var [complex_search_rows]=await connection.query(complex_search_query);//해당 검색 단지명에 해당하는것이 나오는지.

        console.log('complex search rtowss:',complex_search_rows);
        //connection.release();

        if(complex_search_rows){
            connection.release();
            return response.json({success:true, message:'complex searchrows server query success!!',result: complex_search_rows});
        }else{
            connection.release();
            return response.json({success:false, message: 'server query parts probilem error!!'});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});

//검색 단지리스트중 특정 클릭단지 정보 조회.
router.post('/complexdetail_search',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        var complex_id=req_body.complex_id;
       
        var [complex_search_rows]=await connection.query("select * from complex where complex_id=?",[complex_id]);//해당 검색 단지명에 해당하는것이 나오는지.

        console.log('complex search rtowss:',complex_search_rows);
        //connection.release();

        if(complex_search_rows){
            connection.release();
            return response.json({success:true, message:'complex searchrows server query success!!',result: complex_search_rows});
        }else{
            connection.release();
            return response.json({success:false, message: 'server query parts probilem error!!'});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//검색 단지명중 특정 클릭단지 상세wide정보.
router.post('/complexdetail_join_search',async function(request,response){
    console.log('=====>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=>conn);

    try{
        var complex_id = req_body.complexid;
        //query=select * from complex c join buildings bd on c.bld_pk=bd.bld_pk join floor f on bd.bld_id=f.bld_id join ho_info h on f.flr_id=h.flr_id where c.complex_id=3095

        var [match_building_rows] = await connection.query("select * from buildings where complex_id=?",[complex_id]);//건물과 해당 단지 연결된 정보 리턴. 해당 단지id에 해당하는 여러 건물들 동등 정보들 리턴한다. 나온 여러개의 bld_id에 in포함되는 조건의 floor flrid는 곧 해당 층들은 해당 bld_id건물들에 속한 floor들 의미한다.
        var match_bld_ids='';

        if(match_building_rows.length >= 1){
            for(var b=0; b<match_building_rows.length; b++){
                if(b==match_building_rows.length -1){
                    match_bld_ids += match_building_rows[b]['bld_id'];
                }else{
                    match_bld_ids += match_building_rows[b]['bld_id']+',';
                }
            }
            console.log('=====>>match_bulidng_rows::',match_building_rows);
            console.log('====>>>match_bld_idss:::',match_bld_ids);
        }
       
        var match_floor_query="SELECT * FROM floor where bld_id in ("+match_bld_ids+")";
        var [match_floor_rows] = await connection.query(match_floor_query);//해당 건물id들에 해당하는 모든 floor리스트 정보 조회한다.
        console.log('===>>>match_floor_rows:::',match_floor_rows);

        if(match_floor_rows.length > 1){
            var match_flr_ids='';
            for(var f=0; f<match_floor_rows.length; f++){
                if(f==match_floor_rows.length -1 ){
                    match_flr_ids += match_floor_rows[f]['flr_id'];
                }else{
                    match_flr_ids += match_floor_rows[f]['flr_id']+',';
                }
            }
            console.log('====>>match_flr_ids::::',match_flr_ids);
        }
        
        var match_hoinfo_query="SELECT * FROM ho_info where flr_id in ("+match_flr_ids+")";
        var [match_hoinfo_rows] = await connection.query(match_hoinfo_query);//해당 건물참조정보에 대한 연결 호정보들 정보 리턴.
        console.log('===>>match_hofinOrwos::',match_hoinfo_rows);

        connection.release();

        return response.json({success:true, message:'server querys sucess!',result:[match_building_rows,match_floor_rows,match_hoinfo_rows]});
    }catch(err){
        console.log('server query errorss:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full probml emerror',result:[[],[],[]]});
    }
});
//검색 단지명중 특정 클릭단지 소속 동들만조회.
router.post('/complexdetail_match_dongSearch',async function(request,response){
    console.log('=====>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=>conn);

    try{
        var complex_id = req_body.complexid;
        //query=select * from complex c join buildings bd on c.bld_pk=bd.bld_pk join floor f on bd.bld_id=f.bld_id join ho_info h on f.flr_id=h.flr_id where c.complex_id=3095

        var [match_building_rows] = await connection.query("select * from buildings where complex_id=?",[complex_id]);//건물과 해당 단지 연결된 정보 리턴. 해당 단지id에 해당하는 여러 건물들 동등 정보들 리턴한다. 나온 여러개의 bld_id에 in포함되는 조건의 floor flrid는 곧 해당 층들은 해당 bld_id건물들에 속한 floor들 의미한다.

        console.log('=====>>match_bulidng_rows::',match_building_rows);
        
        connection.release();

        return response.json({success:true, message:'server querys sucess!',result:match_building_rows});
    }catch(err){
        console.log('server query errorss:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full probml emerror'});
    }
});
//특정 동 소속 층들만조회.
router.post('/complexdetail_match_floorSearch',async function(request,response){
    console.log('=====>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=>conn);

    try{
        var bld_id = req_body.bld_id;
        //query=select * from complex c join buildings bd on c.bld_pk=bd.bld_pk join floor f on bd.bld_id=f.bld_id join ho_info h on f.flr_id=h.flr_id where c.complex_id=3095

        var [match_floorlist_rows] = await connection.query("select * from floor where bld_id=? order by floor asc",[bld_id]);//특정 동(아파트,오피다단지)의 소속된 층들만을 조회.

        console.log('=====>>match_floorlist_rows::',match_floorlist_rows);
        
        connection.release();

        return response.json({success:true, message:'server querys sucess!',result:match_floorlist_rows});
    }catch(err){
        console.log('server query errorss:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full probml emerror'});
    }
});
//특정 층 소속 호들만조회.
router.post('/complexdetail_match_hosilSearch',async function(request,response){
    console.log('=====>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=>conn);

    try{
        var flr_id = req_body.flr_id;
        //query=select * from complex c join buildings bd on c.bld_pk=bd.bld_pk join floor f on bd.bld_id=f.bld_id join ho_info h on f.flr_id=h.flr_id where c.complex_id=3095

        var [match_hosil_list] = await connection.query("select * from ho_info where flr_id=?",[flr_id]);//건물과 해당 단지 연결된 정보 리턴. 해당 단지id에 해당하는 여러 건물들 동등 정보들 리턴한다. 나온 여러개의 bld_id에 in포함되는 조건의 floor flrid는 곧 해당 층들은 해당 bld_id건물들에 속한 floor들 의미한다.

        console.log('=====>>match_hosil_list::',match_hosil_list);
        
        connection.release();

        return response.json({success:true, message:'server querys sucess!',result:match_hosil_list});
    }catch(err){
        console.log('server query errorss:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full probml emerror'});
    }
});
//특정 도로명주소로 검색 후 매칭결과가없으면 지번주소로검색(물건등록 상가사무실 도로명주소주소기반 검색>층검색)
router.post('/floorid_search_query',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        //지번주소의 경우 그 안에 여러개가 있어서, 동시에 도로명주소까지 만족되는 것이다. 매물별 도로명주소가 같을수있나?? 같을수있고 여러개 나올수있음. 충분히. 다만 해당 지번>도로명 모두 만족하는것 검색해야함. 그 지번안에도 여러 다른 도로명이 있을수있기에

        //현서님 요청주신대로 수정. 먼저 도로명주소 기준으로 만족되는 것 검색, 결과가 없으면 지번주소로 검색.
        var jibunaddress = req_body.jibunaddress;
        var roadaddress = req_body.roadaddress;
       
        var [floorid_search_rows]=await connection.query("select * from floor where addr_road like '%"+roadaddress+"%' order by floor asc");//해당 검색 도로명주소관련된 floor들 구한다.
        
        if(floorid_search_rows.length >= 1){
            connection.release();
            console.log('도로명주소로 검색된것들 flooridsearch rowsss:',floorid_search_rows);
            return response.json({success:true, message:'floorid_search_rows server query success!!',result: floorid_search_rows});    
        }else{
            var [floorid_search_rows_jibun] = await connection.query("select * from floor where addr_jibun like '%"+jibunaddress+"%' order by floor asc");//지번주소로 검색진행
            connection.release();
            console.log('지번주소로 검색된것들 flooridsearchr rowss도로명주소 매칭없어서 지번주소로 매칭된것 return:',floorid_search_rows_jibun);

            if(floorid_search_rows_jibun.length >=1){
                return response.json({success:true, message:'floorid search rows server query success:',result: floorid_search_rows_jibun})
            }else{
                connection.release();
                return response.json({success:true, message: '검색결과가없습니다', result: []});
            }
        } 
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!', result:[]});
    }
});

//지역관련 replace검색 관련
router.post('/addrunits_replace_search',async function(request,response){

    const connection = await pool.getConnection(async conn => conn);

    try{
        //해당 keyword에 대해서 대학교명, 지하철명, 지역명 등 검색 진행.하여 종류별 리턴 결과 세개 던져주기(현재는 두개, 지역 못받음)
        var sidoCode=request.body.sidoCode;//시도코드값 두자리.

        var [addrunits_row] = await connection.query("select * from addr_units where id=?",[sidoCode]);//시도 관련 쿼리진행.시도코드관련된 지역 name값 리턴.

        console.log('관련 시도addrunitss 검색 결과:::',addrunits_row);

        connection.release();

        if(addrunits_row){
            return response.json({success:true,result:addrunits_row[0]});
        }else{
            return response.json({success:true,result:null});
        }
        
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,result:null});
    }
});
//지도관련 검색 api시작>>>>
//메인페이지 메인검색 시작부분검색(지도페이지에서도 사용될 계획)
router.post('/main_searchStart',async function(request,response){
    console.log('=====+++++>>>request.body:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);

    try{
        //해당 keyword에 대해서 대학교명, 지하철명, 지역명 등 검색 진행.하여 종류별 리턴 결과 세개 던져주기(현재는 두개, 지역 못받음)
        var keyword=req_body.search_keyword_val;
        var maemultype=req_body.maemultype;//매물타입:아파트,오피,상가,사무실

        if(maemultype=='apart'){
            maemultype ='아파트';
        }else if(maemultype=='officetel'){
            maemultype ='오피스텔';
        }else if(maemultype=='store'){
            maemultype ='상가';
        }else if(maemultype=='office'){
            maemultype ='사무실';
        }

        var [metro_row_result] = await connection.query("select * from metro where mtr_name like '%"+keyword+"%' limit 100");
        var [product_row_result] = await connection.query("select * from product p  where (prd_status='거래개시' or prd_status='거래완료동의요청' or prd_status='거래완료동의요청거절') and p.prd_name like '%"+keyword+"%' and (p.prd_type='"+maemultype+"') and ( p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d') ) group by p.prd_identity_id limit 100");//거래개시상태값(txn)인 prdidinetitiy매물내역만 보인다. 전속기간범위에 해당하는 경우에만 노출시킴. 아예 값이 비어있는 테스ㅌ트용 데이터또는 값이 있는데 전소긱간에 해당하는 데이터조건인 것만 노출(검색어 매칭리스트중에서)
        var [complex_row_result] = await connection.query("select * from complex where complex_name like '%"+keyword+"%' limit 100");
        var [university_row_result] = await connection.query("select * from university where uvs_name like '%"+keyword+"%' limit 100");

        //var [addrunits_row_result] = await connection.query("select * from addr_units where name like '%"+keyword+"%' limit 100");        

        var addrunits_row_result=[];
        //var [match_sido_units] = await connection.query("select * from addr_units where name like '%"+keyword+"%' and type=1 limit 2");//100개 이하로 해서 시도레벨 내역들 검색결과 리턴.
        //시도 검색결과가 있다면 시도 검색결과에 해당하는 그 검색up_id속한 모든 시군구, 시군구하에 읍면동리스트 다 리스팅.
        var [match_sigungo_units]  = await connection.query("select * from addr_units where name like '%"+keyword+"%' and type=2 limit 4");//100개이하로 해서 시군구레벨내역들 매칭리스트 리턴.
        var [match_yeopmyeondong_units] = await connection.query("select * from addr_units where name like '%"+keyword+"%' and type=4 limit 20");//100개 이하로 해서 읍면동레베내역들 관련 매칭리스트 리턴.

        console.log('시도레벨, 시군구레벨,읍면동레벨 관련 검색어 매칭리스트:::',match_sigungo_units,match_yeopmyeondong_units);
        /*for(let sido=0; sido<match_sido_units.length; sido++){
            let store_object_sido={};
            store_object_sido['id'] = match_sido_units[sido]['id'];
            store_object_sido['up_id'] = match_sido_units[sido]['up_id'];
            store_object_sido['name'] = match_sido_units[sido]['name'];
            store_object_sido['type'] = match_sido_units[sido]['type'];
            store_object_sido['x'] = match_sido_units[sido]['x'];
            store_object_sido['y'] = match_sido_units[sido]['y'];
            addrunits_row_result.push(store_object_sido);

            let up_id_loca=match_sido_units[sido]['id'];//해당 시도에 속한 시군구 리스트
            let sido_name=match_sido_units[sido]['name'];//시도 레벨의 시도행정구역 이름값 계층적 저장.
            let [child_sigungo_list] = await connection.query("select * from addr_units where up_id=? and type=2",[up_id_loca]);//하위 시군구리스트.계층화
            for(let sigungo=0; sigungo<child_sigungo_list.length; sigungo++){
                let sigungo_item=child_sigungo_list[sigungo];//하위 시군구리스트.아이템 row
                let up_id_loca_sigungo=sigungo_item['id'];//시군구리스트의 참조id
                let sigungo_name=sigungo_item['name'];//시군구이름 행정구역명
                
                let store_object_sigungo={};
                store_object_sigungo['id'] = sigungo_item['id'];
                store_object_sigungo['up_id'] = sigungo_item['up_id'];
                store_object_sigungo['name'] = sido_name+' '+sigungo_item['name'];
                store_object_sigungo['type'] = sigungo_item['type'];
                store_object_sigungo['x'] = sigungo_item['x'];
                store_object_sigungo['y'] = sigungo_item['y'];

                addrunits_row_result.push(store_object_sigungo);
                let [child_yeop_list]=await connection.query("select * from addr_units where up_id=? and type=4",[up_id_loca_sigungo]);//하위 읍면동 리스트 해당 시군구id를 참조하고있는 하위계층들 읍면동리스트.
                for(let yeop=0; yeop<child_yeop_list.length; yeop++){
                    let yeop_item=child_yeop_list[yeop];
                    
                    let store_object_yeop={};
                    store_object_yeop['id']=yeop_item['id'];
                    store_object_yeop['up_id'] = yeop_item['up_id'];
                    store_object_yeop['name'] = sido_name+' '+sigungo_name+' '+yeop_item['name'];
                    store_object_yeop['type'] = yeop_item['type'];
                    store_object_yeop['x'] = yeop_item['x'];
                    store_object_yeop['y'] = yeop_item['y'];

                    addrunits_row_result.push(store_object_yeop);
                }
            }     
        }*/
        for(let sigungo=0; sigungo<match_sigungo_units.length; sigungo++){
            let store_object_sigungo={};

            //매칭 시군구리스트에 upid들 구해서 어떤 시도레벨에 속했던건지 구함.각 요소별
            let up_id_refer=match_sigungo_units[sigungo]['up_id'];
            console.log('시군구리스트::',match_sigungo_units[sigungo]);  console.log('up_id_refer:',up_id_refer);
            let mother_sido_query=await connection.query("select * from addr_units where id=? and type=1",[up_id_refer]);//상위 시도레벨 up_id참조하는 관련 정보
            console.log('mother sido queryss:',mother_sido_query[0]);
            let mother_sido_name=mother_sido_query[0][0]['name'];//시도네임 이름값.행정구역이름값.
            console.log('mother_sido_name::',mother_sido_query[0][0],mother_sido_query[0][0]['name']);

            store_object_sigungo['id']=match_sigungo_units[sigungo]['id'];
            store_object_sigungo['up_id']=match_sigungo_units[sigungo]['up_id'];
            store_object_sigungo['name']=mother_sido_name+' '+match_sigungo_units[sigungo]['name'];//시도네임+신군구이름.
            store_object_sigungo['type']=match_sigungo_units[sigungo]['type'];
            store_object_sigungo['x']=match_sigungo_units[sigungo]['x'];
            store_object_sigungo['y']=match_sigungo_units[sigungo]['y'];
            let my_sigungo_name=match_sigungo_units[sigungo]['name'];//시군구이름.

           
            addrunits_row_result.push(store_object_sigungo);//시군구리스트 추가.
            let up_id_loca=match_sigungo_units[sigungo]['id'];//해당 시군구레벨의 row를 upid로써 참조하고있는 자식 읍면동리스트.
            let [child_yeop_list] = await connection.query("select * from addr_units where up_id=? and type=4",[up_id_loca]);

            console.log(my_sigungo_name,mother_sido_name,child_yeop_list);
            for(let yeop=0; yeop<child_yeop_list.length; yeop++){
                let yeop_item= child_yeop_list[yeop];

                let store_object_yeop={};
                store_object_yeop['id']=yeop_item['id'];
                store_object_yeop['up_id']=yeop_item['up_id'];
                store_object_yeop['name'] = mother_sido_name +' '+my_sigungo_name+' '+yeop_item['name'];//외부포문 시도+시군구(각포문별)행정구역명 읍면동행정명
                store_object_yeop['type'] = yeop_item['type'];
                store_object_yeop['x'] = yeop_item['x'];
                store_object_yeop['y'] = yeop_item['y'];

                addrunits_row_result.push(store_object_yeop);
            }
        }

        for(let yeop=0; yeop<match_yeopmyeondong_units.length; yeop++){
            let store_object_yeop={};

            let item=match_yeopmyeondong_units[yeop];//읍면동 아이템의 추적추적하여 up-id등으로 추적하여 부무 (신구구) 또 부모 시도 구함.
            let up_id_sigungo=item['up_id'];
            let parent_sigungo_query=await connection.query("select * from addr_units where id=? and type=2",[up_id_sigungo]);
            let sigungo_name=parent_sigungo_query[0][0]['name'];
            let sigungo_upid=parent_sigungo_query[0][0]['up_id'];//시군구 row의 upid
            let parent_parent_sido_query=await connection.query("select * from addr_units where id=? and type=1",[sigungo_upid]);//시도레벨 참조 부모요소.지역
            let sido_name=parent_parent_sido_query[0][0]['name'];
            
            store_object_yeop['id']=item['id'];
            store_object_yeop['up_id']=item['up_id'];
            store_object_yeop['name'] = sido_name+' '+sigungo_name+' '+item['name'];
            store_object_yeop['type'] = item['type'];
            store_object_yeop['x'] = item['x'];
            store_object_yeop['y'] = item['y'];

            addrunits_row_result.push(store_object_yeop);
        }
        console.log('gettering addrunitss:',addrunits_row_result);
        //console.log('realted metro지하철,대학교,지역 관련 연관데이터들:',metro_row_result,university_row_result,product_row_result,complex_row_result);

       //각 지역,지하철,대학별 검색결과 list가 비어있는 널상태일수도있다.
       if(metro_row_result.length === 0){
           metro_row_result = [];
       }
       if(university_row_result.length === 0){
          university_row_result = [];
       }
       if(product_row_result.length == 0){
           product_row_result = [];
       }
       if(complex_row_result.length == 0){
           compelx_row_result = [];
       }
       if(addrunits_row_result.length == 0){
           addrunits_row_result = [];
       }
        connection.release();
        return response.json({success: true, message:'sauqewry success', result: [metro_row_result,university_row_result,product_row_result,complex_row_result, addrunits_row_result]});
        
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problem error!',result:[ [],[],[],[],[] ]});
    }
});
var searcharea_polygon=[];//더미 전역변수 데이터폴리곤꼭지점정보 배열.전체 x,y,x,y,x,y,x,y,x,y, 무집단화
var searcharea_polygon_x=[];
var searcharea_polygon_y=[];
//메인 검색페이지 검색리스트중 임의 클릭 지역or대학교or지하철 지점의 관련 정보 리턴
router.post('/main_searchresult_clickDetail',async function(request,response){
    console.log('=====>>>Main_searchresult_clickdetail request.body:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);
    //id_val, search_type_val
    try{
        var search_type=req_body.search_type_val;
        var id=req_body.id_val;
        //var screen_width= req_body.screen_width;
        //var screen_height= req_body.screen_height;
        //var zido_level =req_body.level;
        var prd_type= req_body.prdtype_val;
        var product_search_type_val = req_body.product_search_type_val;

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

        if(search_type == 'addr_units'){
            var search_sql="select * from "+search_type+" where id="+id;
            //addr_units검색을 해서 나온 결과값에 따른 결과 시도레벨에 대해선 미처리한다. 시군구, 읍면동에 대해서 나온 addrunits겨로가 typoe:2,tpye:4에 id값에 따른 분기.
        }else if(search_type == 'university'){
            var search_sql="select * from "+search_type+" where id="+id;//읍면동기준검색.
        }else if(search_type == 'metro'){
            var search_sql="select * from "+search_type+" where id="+id;//나온 지하철의 좌표위치값(한개값)에 어떤 읍면동json 지역별로 해서 범위에 속하는지 어떤 읍면동지역상에 포함되는지 여부.
        }else if(search_type == 'complex'){
            var search_sql="select * from "+search_type+" where complex_id="+id;//나온 단지의 좌표위치값(한개값)에 어떤 읍면동json지역별로해서 포함되는지여부. 그 검색된 중심좌표값 + 그 중심좌표값(검색대상체)에 포함하고있는 읍면동지역의 꼭지점좌표들..
        }else if(search_type == 'product'){
            /*if(product_search_type_val == 'dummy'){
                var search_sql="select * from "+search_type+" where prd_id="+id;
            }*/
           //매물또한 그 매물의 좌표위치값이 어떤읍면동json상에 포함되는지 여부구한다.
            var search_sql="select * from "+search_type+" where prd_identity_id="+id;//매물이 ㅡ경우 지역,대학교,지하철,단지와 달리 여러개매칭될수있기에 그 내역중 최초한개(orogin정보 x,y정보포함)조회. 2021-07-19이후부턴 product테이블에 정보들 product에 매물수정,상태변경처리시마다 히스토리징 하지 않기에 product테이블의 각 row는 각 하나의 매물정보를 의미한다.
            
        }
        
        console.log('search_sqls::',search_sql);
        var [searchdetail_result] = await connection.query(search_sql);
        console.log('검색타입 및 해당 테이블 검색결과(한개정보) 검색한 테이블 대상관련된 정보를 조회한다',search_type, searchdetail_result);//해당 검색타입별 (지역검색한경우엔 지역결가ㅗ하나, 매물검색케이스,단지케이스, 지하철,대학교 케이스) complex는 좀 애매하고, product의 경우 x,y값 그 x,y값을 클라단에서 표시해줄때 검색하고자했던 product x,y위치값을 위치로 첫 로드 이동시에 마커그리는 부분에서 x,y검색한 중심위치는 마커로 달리표시(다른색)

        var properties_array=[];//모든 features들별로 있는 globe형태의 프로퍼티객체정보 array정보배열 참조.
        
        if(search_type=='addr_units'){
            var addrunits_leveltype=searchdetail_result[0].type;//타입레벨값에 따른 분기. 레벨값에 따라서 다른..json조회해야하기에그러하다.
            var search_area_name=searchdetail_result[0].name;//지역이름(시도명,시군구명,읍면동명)을 기준으로 검색한다. 지역검색의 경우 지역의 이름을 식별자로 검색, 나머지의 경우 그 지역좌표위치를 기준으로 검색한다.
            var area_id=searchdetail_result[0].id;//지역코드id값.앞의 8자리까지만.
            
            var match_addr_area=null;

            if(addrunits_leveltype == 2){
                //시군구 검색 시군구형태의 검색.
                var outer_features=SIGJSON.features;//각 시군구레벨 지역들(2레벨)
                for(let j=0; j<outer_features.length; j++){
                    let item=outer_features[j];
                    properties_array.push(item.properties);
                }
                console.log('properties-arrayss:',properties_array);
                /*for(let outer=0; outer<outer_features.length; outer++){
                    let area_item = outer_features[outer];

                    let properties=area_item.properties;
                    let area_sig_code= properties.SIG_CD;//시군구 지역코드.
                    let area_sig_name= properties.SIG_KOR_NM;//시군구 지역이름

                    //지역별 gemmetory데이터.
                    let geometry= area_item.geometry;
                    let coordinates = geometry.coordinates;//[][]식 조회.
                    console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);
                    if(search_area_name == area_sig_name && area_id == area_sig_code){
                        match_addr_area=area_item;
                        break;
                    }
                }*/
                /*(match_addr_area = outer_features.filter(function(rowData){
                    console.log('filters조회::',rowData);
                    return ((rowData.properties.SIG_CD == area_id && rowData.properties.SIG_KOR_NM == search_area_name));
                });*/
                let target_index=0;
                target_index = properties_array.findIndex(find => (find.SIG_CD == area_id && find.SIG_KOR_NM == search_area_name));
                console.log('find indexxsss:',target_index);
                console.log('find 대상지역::',outer_features[target_index]);//찾아낸 지역.
                
                match_addr_area = outer_features[target_index];

            }else if(addrunits_leveltype == 4){
                
                //읍면동검색 읍면동형태의 검색
                area_id = area_id.substr(0,8);

                var outer_features2 = EMDJSON.features;//각 읍면동 레벨 지역들(사레벨)
                for(let j=0; j<outer_features2.length; j++){
                    let item=outer_features2[j];
                    properties_array.push(item.properties);
                }
                console.log('properitss_arraysss:',properties_array);
                /*for(let outer=0; outer<outer_features2.length; outer++){
                    let area_item = outer_features2[outer];
                    let properties=area_item.properties;
                    let area_emd_code= properties.EMD_CD;//시군구 지역코드. 디비엔 10자리문자열숫자이고, json에는 8자리로 db에선 00이 추가로 붙어있는구조. 00을 빼도 된다고한다.
                    let area_emd_name= properties.EMD_KOR_NM;//시군구 지역이름
                    
                    //지역별 gemmetory데이터.
                    if(area_item.geometry){
                        let geometry= area_item.geometry;
                        let coordinates = geometry.coordinates;//[][]식 조회.
                        console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_emd_code,area_emd_name,coordinates);
                        if(search_area_name == area_emd_name && area_id == area_emd_code){
                            match_addr_area=area_item;
                            break;
                        }
                    }       
                }*/

                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('fliter조회::',rowData);
                    return ((rowData.properties.EMD_CD == area_id && rowData.properties.EMD_KOR_NM == search_area_name));
                });생각보다 속도 느림 전체 배열을 조회하는형태로 내부적인형태인듯하다.*/
                let target_index=0;
                target_index = properties_array.findIndex(find => (find.EMD_CD == area_id && find.EMD_KOR_NM == search_area_name));
                console.log('find indesxxssss:',target_index);
                console.log('find대상지역::', outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];//찾아낸 읍면동지역 검색.
            }           
        }else if(search_type=='university'){
            //var searchtarget_pos_x=searchdetail_result[0].x;
            //var searchtarget_pos_y=searchdetail_result[0].y;//시군구 기준sig기준 검색. 읍면동 조회시에 너무 해비해짐.

            var searchtarget_addrjibun=searchdetail_result[0].addr_jibun;//시군구 추출 extract...
            var addrjibun_array=searchtarget_addrjibun.split(' ');
            console.log('검색하려는 대상의 지번주소형태 array:',addrjibun_array);//시도 시군구 읍면동 ...형태로 분할. 스페이스를 기준으로 분할.
            var si_area='';var gun_area='';var gu_area='';
            for(var aa=0; aa<addrjibun_array.length; aa++){
                let addr_item=addrjibun_array[aa];
                if(addr_item.substr(addr_item.length-1,1)=='시'){
                    si_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='군'){
                    gun_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='구'){
                    gu_area=addr_item;
                }
            }
            //시구, 시군, 조합은 있지만  군구,구군 등 조합은 없음.
            var final_areaaddr_name= si_area + gun_area+ gu_area;//시군 or 시구 
            var final_areaaddr_name2;
            if(gun_area){
                var pure_areaaddr_name= gun_area;
                final_areaaddr_name2 = si_area + ' '+gun_area;
            }
            if(gu_area){
                var pure_areaaddr_name = gu_area;
                final_areaaddr_name2 = si_area + ' '+gu_area;
            }
            console.log('검색 대상 대학교의 지역string:',final_areaaddr_name,final_areaaddr_name2);
            console.log('검색 대학교 좌표:',si_area,gun_area,gu_area);

            var outer_features2 = SIGJSON.features;//각 시군구레벨 지역들.
            var match_addr_area=null;//어디지역에 속하는지.(시군구)

            for(let i=0; i<outer_features2.length; i++){
                let item= outer_features2[i];
                properties_array.push(item.properties);
            }
            console.log('properties_array하하 속도 증가:',properties_array);

            if(gun_area!='' && !gu_area){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                //구는 비어있고, 군이 있는 경우 xxx군으로 온경우 xxxx시 xxx군 인경우.
                let target_index=0;
                target_index = properties_array.findIndex(find => (find.SIG_KOR_NM == final_areaaddr_name || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('find indexxssss:',target_index);
                console.log('찾아낸 대상지역::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];//찾아낸 읍면동지역 검색.

            }else if(!gun_area && gu_area!=''){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                let target_index=0;
                target_index = properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('find indexxssss:',target_index);
                console.log('찾아낸 대상지역::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];
            }
            
            //우선 features지역들중에서 properites만을 기준으로 해서 해당 검색 대상체(대학교,지하철,매물)에서 나온 관련된 시군구값과매칭되는 시군구지역을 지역기준 먼저 쿼리.          
            /*for(let outer=0; outer<outer_features2.length; outer++){
                let area_item=outer_features2[outer];
                let properties=area_item.properties;
                let area_sig_code=properties.SIG_CD;//시군구 지역코드
                let area_sig_name=properties.SIG_KOR_NM;//시군구 지역이름

                //지역별 geometry데이터 조회
                let geometry= area_item.geometry;
                let coordinates = geometry.coordinates;
                console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);
                if(gun_area!='' && !gu_area){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2 == area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }else if(!gun_area && gu_area!=''){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2 == area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }
                /*
                if(area_item.geometry){
                    console.log('각 outer지역>>>>>>>>>>>>>>>>>>>>>>>>start',area_sig_code,area_sig_name);
                    let geometry=area_item.geometry;
                    let coordinates= geometry.coordinates;//[][]식 조회.

                    loop_search(coordinates);//연쇄흐름실행흐름 형태로 큐콜스택이 계속 쌓여서 직렬형태.

                    console.log('재귀탐색이후에 searcharea polygon::',searcharea_polygon);

                    //각 지역별 폴리곤데이터를 재귀호출을 통해서 구하고, x,y가  2n개의 각 인접한게 하나의 꼭지점x,y좌표이고, 2n개의 내역들중에서 x,y별 집단그룹화가 필요하고 각 그룹내에서 가장 min,max한 x,y값 집단도출.
                    var outer_cnt=searcharea_polygon.length / 2;//2n / 2;
                    for(let l=0; l<outer_cnt;l++){
                        var x,y;
                        for(let s=0; s<=1; s++){
                            if(s==0){
                                x= searcharea_polygon[2*l + s];//0,2,4,.....
                                searcharea_polygon_x.push(x);
                            }else{
                                y= searcharea_polygon[2*l + s];//1,3,5,...
                                searcharea_polygon_y.push(y);
                            }
                        }
                        //console.log('각 외부꼭지점별 x,y값:',x,y);
                    }
                    //console.log('해당 지역 x,y각 집합들:',searcharea_polygon_x,searcharea_polygon_y);//각 x,y집단에서 가장 x의 가장min,max y의 min,max구함.
                    console.log('====================================outer endsss=====');
                    var largest_x = Math.max.apply(null,searcharea_polygon_x);
                    var smallest_x = Math.min.apply(null,searcharea_polygon_x);
                    var largest_y= Math.max.apply(null,searcharea_polygon_y);
                    var smallest_y= Math.min.apply(null,searcharea_polygon_y);
                    console.log('해당 지역의 x,y범위추정:',smallest_x,smallest_y+'~'+largest_x,largest_y);

                    if( (searchtarget_pos_x >= smallest_x && searchtarget_pos_x <=largest_x) && (searchtarget_pos_y >= smallest_y && searchtarget_pos_y <= largest_y)){
                        console.log('검색대상x,y가 속한 매칭포함지역인 경우!:',area_emd_code,area_emd_name);
                        console.log(searchtarget_pos_x,searchtarget_pos_y,  smallest_x,largest_x,smallest_y,largest_y);

                        match_addr_area = area_item;
                        break;
                    }
                }
                searcharea_polygon=[];
                searcharea_polygon_x=[];//각 지역별 관련된 폴리곤꼭지점위치들, x,y정보들 모두 초기화해준다.
                searcharea_polygon_y=[];

            }//각 지역 시군구 지역 forloop ends...*/
        }else if(search_type=='metro'){
            //var searchtarget_pos_x=searchdetail_result[0].x;
            //var searchtarget_pos_y=searchdetail_result[0].y;//시군구 기준sig기준 검색. 읍면동 조회시에 너무 해비해짐.

            var searchtarget_addrjibun=searchdetail_result[0].addr_jibun;//시군구 추출 extract...
            var addrjibun_array=searchtarget_addrjibun.split(' ');
            console.log('검색하려는 대상의 지번주소형태 array:',addrjibun_array);//시도 시군구 읍면동 ...형태로 분할. 스페이스를 기준으로 분할.
            var si_area='';var gun_area='';var gu_area='';
            for(var aa=0; aa<addrjibun_array.length; aa++){
                let addr_item=addrjibun_array[aa];
                if(addr_item.substr(addr_item.length-1,1)=='시'){
                    si_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='군'){
                    gun_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='구'){
                    gu_area=addr_item;
                }
            }
            //시구, 시군, 조합은 있지만  군구,구군 등 조합은 없음.
            var final_areaaddr_name= si_area + gun_area+ gu_area;//시군 or 시구 
            var final_areaaddr_name2;
            if(gun_area){
                var pure_areaaddr_name= gun_area;
                final_areaaddr_name2 = si_area +' '+gun_area;
            }
            if(gu_area){
                var pure_areaaddr_name = gu_area;
                final_areaaddr_name2 = si_area +' '+gu_area;
            }
            console.log('검색 대상 의 지역string:',final_areaaddr_name,final_areaaddr_name2);
            console.log('검색  좌표x,y:',si_area,gun_area,gu_area);

            var outer_features2 = SIGJSON.features;//각 시군구레벨 지역들.
            var match_addr_area=null;//어디지역에 속하는지.(시군구)

            for(let i=0; i<outer_features2.length; i++){
                let item=outer_features2[i];
                properties_array.push(item.properties);
            }
            console.log('p[roeprites arraysss:',properties_array);

            
            if(gun_area!='' && !gu_area){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                //구는 비어있고, 군이 있는경우 xxx군으로 온경우 xxx시 xxx군인경우
                let target_index =0;
                target_index= properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('target indexssss:',target_index);
                console.log('찾아낸 대상지역:::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];

            }else if(!gun_area && gu_area!=''){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                let target_index=0;
                target_index = properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('target indexssss:',target_index);
                console.log('찾아낸 대상지역ㄴ::::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];
            }

            //우선 features지역들중에서 properites만을 기준으로 해서 해당 검색 대상체(대학교,지하철,매물)에서 나온 관련된 시군구값과매칭되는 시군구지역을 지역기준 먼저 쿼리.          
            /*for(let outer=0; outer<outer_features2.length; outer++){
                let area_item=outer_features2[outer];
                let properties=area_item.properties;
                let area_sig_code=properties.SIG_CD;//시군구 지역코드
                let area_sig_name=properties.SIG_KOR_NM;//시군구 지역이름

                //지역별 geometry데이터 조회
                let geometry= area_item.geometry;
                let coordinates = geometry.coordinates;
                console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);
                if(gun_area!='' && !gu_area){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2 == area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }else if(!gun_area && gu_area!=''){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2 == area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }
            }//각 지역 시군구 지역 forloop ends...*/
        }else if(search_type=='complex'){
            //var searchtarget_pos_x=searchdetail_result[0].x;
           // var searchtarget_pos_y=searchdetail_result[0].y;//시군구 기준sig기준 검색. 읍면동 조회시에 너무 해비해짐.

            var searchtarget_addrjibun=searchdetail_result[0].addr_jibun;//시군구 추출 extract...
            var addrjibun_array=searchtarget_addrjibun.split(' ');
            console.log('검색하려는 대상의 지번주소형태 array:',addrjibun_array);//시도 시군구 읍면동 ...형태로 분할. 스페이스를 기준으로 분할.
            var si_area='';var gun_area='';var gu_area='';
            for(var aa=0; aa<addrjibun_array.length; aa++){
                let addr_item=addrjibun_array[aa];
                if(addr_item.substr(addr_item.length-1,1)=='시'){
                    si_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='군'){
                    gun_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='구'){
                    gu_area=addr_item;
                }
            }
            //시구, 시군, 조합은 있지만  군구,구군 등 조합은 없음.
            var final_areaaddr_name= si_area + gun_area+ gu_area;//시군 or 시구 
            var final_areaaddr_name2;
            if(gun_area){
                var pure_areaaddr_name= gun_area;
                final_areaaddr_name2 = si_area +' '+gun_area;
            }
            if(gu_area){
                var pure_areaaddr_name = gu_area;
                final_areaaddr_name2 = si_area+' '+gu_area;
            }
            console.log('검색 대상 의 지역string:',final_areaaddr_name,final_areaaddr_name2);
            console.log('검색 좌표x,y:',si_area,gun_area,gu_area);

            var outer_features2 = SIGJSON.features;//각 시군구레벨 지역들.
            var match_addr_area=null;//어디지역에 속하는지.(시군구)

            for(let i=0; i<outer_features2.length; i++){
                let item=outer_features2[i];
                properties_array.push(item.properties);
            }
            console.log('properties arraayss하하속도증가::',properties_array);

            if(gun_area!='' && !gu_area){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                let target_index=0;
                target_index = properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('find indexssss:',target_index);
                console.log('찾아낸 대상지역:::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];
            }else if(!gun_area && gu_area!=''){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                let target_index=0;
                target_index= properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('find indexsss:',target_index);
                console.log('찾아낸 대상지역:::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];
            }

            //우선 features지역들중에서 properites만을 기준으로 해서 해당 검색 대상체(대학교,지하철,매물)에서 나온 관련된 시군구값과매칭되는 시군구지역을 지역기준 먼저 쿼리.          
            /*for(let outer=0; outer<outer_features2.length; outer++){
                let area_item=outer_features2[outer];
                let properties=area_item.properties;
                let area_sig_code=properties.SIG_CD;//시군구 지역코드
                let area_sig_name=properties.SIG_KOR_NM;//시군구 지역이름

                //지역별 geometry데이터 조회
                let geometry= area_item.geometry;
                let coordinates = geometry.coordinates;
                //console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);
                if(gun_area!='' && !gu_area){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2 == area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }else if(!gun_area && gu_area!=''){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2== area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }
               
            }//각 지역 시군구 지역 forloop ends...*/
        }
        else if(search_type=='product'){
            //var searchtarget_pos_x=searchdetail_result[0].x;
            //var searchtarget_pos_y=searchdetail_result[0].y;//시군구 기준sig기준 검색. 읍면동 조회시에 너무 해비해짐.

            var searchtarget_addrjibun=searchdetail_result[0].addr_jibun;//시군구 추출 extract...
            if(searchtarget_addrjibun){
                var addrjibun_array=searchtarget_addrjibun.split(' ');
                console.log('검색하려는 대상의 지번주소형태 array:',addrjibun_array);//시도 시군구 읍면동 ...형태로 분할. 스페이스를 기준으로 분할.
                var si_area='';var gun_area='';var gu_area='';
                for(var aa=0; aa<addrjibun_array.length; aa++){
                    let addr_item=addrjibun_array[aa];
                    if(addr_item.substr(addr_item.length-1,1)=='시'){
                        si_area=addr_item;
                    }else if(addr_item.substr(addr_item.length-1,1)=='군'){
                        gun_area=addr_item;
                    }else if(addr_item.substr(addr_item.length-1,1)=='구'){
                        gu_area=addr_item;
                    }
                }
                //시구, 시군, 조합은 있지만  군구,구군 등 조합은 없음.
                var final_areaaddr_name= si_area + gun_area+ gu_area;//시군 or 시구 
                var final_areaaddr_name2;
                if(gun_area){
                    var pure_areaaddr_name= gun_area;
                    final_areaaddr_name2 = si_area + ' '+gun_area;
                }
                if(gu_area){
                    var pure_areaaddr_name = gu_area;
                    final_areaaddr_name2 = si_area +' '+gu_area;
                }

                console.log('검색 대상 의 지역string:',final_areaaddr_name,final_areaaddr_name2);
                console.log('검색 좌표x,y:',si_area,gun_area,gu_area);

                var outer_features2 = SIGJSON.features;//각 시군구레벨 지역들.
                var match_addr_area=null;//어디지역에 속하는지.(시군구)

                for(let i=0; i<outer_features2.length; i++){
                    let item=outer_features2[i];
                    properties_array.push(item.properties);
                }
                console.log('properites_arraysss하하속도 증가::',properties_array);

                if(gun_area!='' && !gu_area){
                    /*match_addr_area = outer_features2.filter(function(rowData){
                        console.log('filterss조회:::',rowData);
                        return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                    });*/
                    let target_index=0;
                    target_index=properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                    console.log('target indexsssss:',target_index);
                    console.log('찾아낸 대상지역:::',outer_features2[target_index]);

                    match_addr_area = outer_features2[target_index];
                }else if(!gun_area && gu_area!=''){
                    /*match_addr_area = outer_features2.filter(function(rowData){
                        console.log('filterss조회:::',rowData);
                        return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                    });*/
                    let target_index=0;
                    target_index= properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                    console.log('target indexssss:',target_index);
                    console.log('찾아낸 대상지역::',outer_features2[target_index]);

                    match_addr_area = outer_features2[target_index];
                }

                //우선 features지역들중에서 properites만을 기준으로 해서 해당 검색 대상체(대학교,지하철,매물)에서 나온 관련된 시군구값과매칭되는 시군구지역을 지역기준 먼저 쿼리.          
                /*for(let outer=0; outer<outer_features2.length; outer++){
                    let area_item=outer_features2[outer];
                    let properties=area_item.properties;
                    let area_sig_code=properties.SIG_CD;//시군구 지역코드
                    let area_sig_name=properties.SIG_KOR_NM;//시군구 지역이름

                    //지역별 geometry데이터 조회
                    let geometry= area_item.geometry;
                    let coordinates = geometry.coordinates;
                    console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);
                    if(gun_area!='' && !gu_area){
                        if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2== area_sig_name){
                            match_addr_area=area_item;
                            break;
                        }
                    }else if(!gun_area && gu_area!=''){
                        if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name|| final_areaaddr_name2== area_sig_name){
                            match_addr_area=area_item;
                            break;
                        }
                    }                  
                }//각 지역 시군구 지역 forloop ends...*/
            }
        }
        console.log('검색 매칭 지역:',match_addr_area);

        connection.release();
        if(match_addr_area){
            return response.json({success:true,message:'sucecess queryss',result: searchdetail_result, outlineborder_result:match_addr_area});
        }else{
            return response.json({success:true,message:'sucecess queryss',result: searchdetail_result, outlineborder_result:null});
        }
        
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[]});
    }
});
//메인 검색페이지 검색리스트 중 클릭말고 검색창 입력한것(ENTER또는 검색버튼 누를시에 관련 API처리)
router.post('/main_searchresult_clickDetail_enter',async function(request,response){
    console.log('=====>>>main_searchresult_clickDetail_enter request.body:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);
    //id_val, search_type_val
    try{
        //var search_type=req_body.search_type_val;
        //var screen_width= req_body.screen_width;
        //var screen_height= req_body.screen_height;
        //var zido_level =req_body.level;

        var prd_type= req_body.prdtype_val;
        var search_type= req_body.searchtype;
        var addrunits = req_body.addrunits;
        var metrolist = req_body.metrolist;
        var university = req_body.university;
        var productlist = req_body.productlist;
        var complexlist = req_body.complexlist;

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

        //검색타입 지역,지하철&대학교, 단지&매물 이렇게 특정하나에 대해서만 검색하는게 아닌 로직.그 인자로 받은 각 카테고리별 나온것들중 우선적으로 있는 결과에 대해서 검색.다섯카타고리중에 하나라도 있었던 경우만 api호출
        if(productlist){
            //id값이 넘어온다. 지역우선적으로 하여 처리.. 가장 우선순위가 낮은것부터 하여 그 대상체 하나를 기준으로 검색.
            var search_sql = "select * from product where prd_identity_id="+productlist;
        }
        if(complexlist){
            var search_sql = "select * from complex where complex_id="+complexlist;
        }
        if(university){
            var search_sql ="select * from university where id="+university;
        }
        if(metrolist){
            var search_sql="select * from metro where id="+metrolist;
        }
        if(addrunits){
            var search_sql="select * from addr_units where id="+addrunits;
        }
        //매물에 대한 결과가있다면 매물검색>단지가 있다면 단지로>대학>지하철>지역별로 넘어온데이터가있다면 가장 우선순위가 높은 검색데이터로 덮어씌워지는형태로 검색조회.

        console.log('search_sqls::',search_sql);
        var [searchdetail_result] = await connection.query(search_sql);
        console.log('검색타입 및 해당 테이블 검색결과(한개정보) 검색한 테이블 대상관련된 정보를 조회한다', searchdetail_result);//해당 검색타입별 (지역검색한경우엔 지역결가ㅗ하나, 매물검색케이스,단지케이스, 지하철,대학교 케이스) complex는 좀 애매하고, product의 경우 x,y값 그 x,y값을 클라단에서 표시해줄때 검색하고자했던 product x,y위치값을 위치로 첫 로드 이동시에 마커그리는 부분에서 x,y검색한 중심위치는 마커로 달리표시(다른색)

        var properties_array=[];//모든 features들별로 있는glboe형태.

        if(search_type == 'addr_units'){
            var addrunits_leveltype=searchdetail_result[0].type;//타입레벨값에 따른 분기. 레벨값에 따라서 다른..json조회해야하기에그러하다.
            var search_area_name=searchdetail_result[0].name;//지역이름(시도명,시군구명,읍면동명)을 기준으로 검색한다. 지역검색의 경우 지역의 이름을 식별자로 검색, 나머지의 경우 그 지역좌표위치를 기준으로 검색한다.
            var area_id=searchdetail_result[0].id;//지역코드id값.앞의 8자리까지만.
            
            var match_addr_area=null;

            if(addrunits_leveltype == 2){
                //시군구 검색 시군구형태의 검색.
                var outer_features=SIGJSON.features;//각 시군구레벨 지역들(2레벨)
                
                /*for(let outer=0; outer<outer_features.length; outer++){
                    let area_item = outer_features[outer];

                    let properties=area_item.properties;
                    let area_sig_code= properties.SIG_CD;//시군구 지역코드.
                    let area_sig_name= properties.SIG_KOR_NM;//시군구 지역이름

                    //지역별 gemmetory데이터.
                    let geometry= area_item.geometry;
                    let coordinates = geometry.coordinates;//[][]식 조회.
                    console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);
                    if(search_area_name == area_sig_name && area_id == area_sig_code){
                        match_addr_area=area_item;
                        break;
                    }
                }*/
                /*match_addr_area = outer_features.filter(function(rowData){
                    console.log('filters조회::',rowData);
                    return ((rowData.properties.SIG_CD == area_id && rowData.properties.SIG_KOR_NM == search_area_name));
                });*/
                for(let j=0; j<outer_features.length; j++){
                    let item=outer_features[j];
                    properties_array.push(item.properties);
                }
                console.log('properties arraysss:',properties_array);

                let target_index=0;
                target_index= properties_array.findIndex(find => (find.SIG_CD == area_id && find.SIG_KOR_NM == search_area_name));
                console.log('find indexssss:',target_index);
                console.log('find대상지역::',outer_features[target_index]);

                match_addr_area = outer_features[target_index];
            }else if(addrunits_leveltype == 4){
                
                //읍면동검색 읍면동형태의 검색
                area_id = area_id.substr(0,8);

                var outer_features2 = EMDJSON.features;//각 읍면동 레벨 지역들(사레벨)

                /*for(let outer=0; outer<outer_features2.length; outer++){
                    let area_item = outer_features2[outer];
                    let properties=area_item.properties;
                    let area_emd_code= properties.EMD_CD;//시군구 지역코드. 디비엔 10자리문자열숫자이고, json에는 8자리로 db에선 00이 추가로 붙어있는구조. 00을 빼도 된다고한다.
                    let area_emd_name= properties.EMD_KOR_NM;//시군구 지역이름
                    
                    //지역별 gemmetory데이터.
                    if(area_item.geometry){
                        let geometry= area_item.geometry;
                        let coordinates = geometry.coordinates;//[][]식 조회.
                        console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_emd_code,area_emd_name,coordinates);
                        if(search_area_name == area_emd_name && area_id == area_emd_code){
                            match_addr_area=area_item;
                            break;
                        }
                    }       
                }*/
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('fliter조회::',rowData);
                    return ((rowData.properties.EMD_CD == area_id && rowData.properties.EMD_KOR_NM == search_area_name));
                });*/
                for(let j=0; j<outer_features2.length; j++){
                    let item=outer_features2[j];
                    properties_array.push(item.properties);
                }
                console.log('properties arraysss:',properties_array);

                let target_index=0;
                target_index = properties_array.findIndex(find => (find.EMD_CD ==area_id && find.EMD_KOR_NM == search_area_name));
                console.log('find indesssss:',target_index);
                console.log('find대상지역:::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];
            }           
        }else if(search_type=='university'){
            //var searchtarget_pos_x=searchdetail_result[0].x;
            //var searchtarget_pos_y=searchdetail_result[0].y;//시군구 기준sig기준 검색. 읍면동 조회시에 너무 해비해짐.

            var searchtarget_addrjibun=searchdetail_result[0].addr_jibun;//시군구 추출 extract...
            var addrjibun_array=searchtarget_addrjibun.split(' ');
            console.log('검색하려는 대상의 지번주소형태 array:',addrjibun_array);//시도 시군구 읍면동 ...형태로 분할. 스페이스를 기준으로 분할.
            var si_area='';var gun_area='';var gu_area='';
            for(var aa=0; aa<addrjibun_array.length; aa++){
                let addr_item=addrjibun_array[aa];
                if(addr_item.substr(addr_item.length-1,1)=='시'){
                    si_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='군'){
                    gun_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='구'){
                    gu_area=addr_item;
                }
            }
            //시구, 시군, 조합은 있지만  군구,구군 등 조합은 없음.
            var final_areaaddr_name= si_area + gun_area+ gu_area;//시군 or 시구 
            var final_areaaddr_name2;
            if(gun_area){
                var pure_areaaddr_name= gun_area;
                final_areaaddr_name2 = si_area + ' '+gun_area;
            }
            if(gu_area){
                var pure_areaaddr_name = gu_area;
                final_areaaddr_name2 = si_area + ' '+gu_area;
            }
            console.log('검색 대상 대학교의 지역string:',final_areaaddr_name,final_areaaddr_name2);
            console.log('검색 대학교 좌표x,y:',si_area,gun_area,gu_area);

            var outer_features2 = SIGJSON.features;//각 시군구레벨 지역들.
            var match_addr_area=null;//어디지역에 속하는지.(시군구)

            for(let i=0; i<outer_features2.length; i++){
                let item=outer_features2[i];
                properties_array.push(item.properties);
            }
            console.log('properties arrays::',properties_array);

            if(gun_area!='' && !gu_area){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                let target_index=0;
                target_index = properties_array.findIndex(find => (find.SIG_KOR_NM == final_areaaddr_name || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('find indessss:',target_index);
                console.log('찾아낸 대상지역::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];

            }else if(!gun_area && gu_area!=''){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                let target_index=0;
                target_index = properties_array.findIndex(find => (find.SIG_KOR_NM == final_areaaddr_name || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('find indexsss:',target_index);
                console.log('찾아낸 대상지역::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];
            }
            
            //우선 features지역들중에서 properites만을 기준으로 해서 해당 검색 대상체(대학교,지하철,매물)에서 나온 관련된 시군구값과매칭되는 시군구지역을 지역기준 먼저 쿼리.          
            /*for(let outer=0; outer<outer_features2.length; outer++){
                let area_item=outer_features2[outer];
                let properties=area_item.properties;
                let area_sig_code=properties.SIG_CD;//시군구 지역코드
                let area_sig_name=properties.SIG_KOR_NM;//시군구 지역이름

                //지역별 geometry데이터 조회
                let geometry= area_item.geometry;
                let coordinates = geometry.coordinates;
                console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);
                if(gun_area!='' && !gu_area){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2 == area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }else if(!gun_area && gu_area!=''){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2 == area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }
                /*
                if(area_item.geometry){
                    console.log('각 outer지역>>>>>>>>>>>>>>>>>>>>>>>>start',area_sig_code,area_sig_name);
                    let geometry=area_item.geometry;
                    let coordinates= geometry.coordinates;//[][]식 조회.

                    loop_search(coordinates);//연쇄흐름실행흐름 형태로 큐콜스택이 계속 쌓여서 직렬형태.

                    console.log('재귀탐색이후에 searcharea polygon::',searcharea_polygon);

                    //각 지역별 폴리곤데이터를 재귀호출을 통해서 구하고, x,y가  2n개의 각 인접한게 하나의 꼭지점x,y좌표이고, 2n개의 내역들중에서 x,y별 집단그룹화가 필요하고 각 그룹내에서 가장 min,max한 x,y값 집단도출.
                    var outer_cnt=searcharea_polygon.length / 2;//2n / 2;
                    for(let l=0; l<outer_cnt;l++){
                        var x,y;
                        for(let s=0; s<=1; s++){
                            if(s==0){
                                x= searcharea_polygon[2*l + s];//0,2,4,.....
                                searcharea_polygon_x.push(x);
                            }else{
                                y= searcharea_polygon[2*l + s];//1,3,5,...
                                searcharea_polygon_y.push(y);
                            }
                        }
                        //console.log('각 외부꼭지점별 x,y값:',x,y);
                    }
                    //console.log('해당 지역 x,y각 집합들:',searcharea_polygon_x,searcharea_polygon_y);//각 x,y집단에서 가장 x의 가장min,max y의 min,max구함.
                    console.log('====================================outer endsss=====');
                    var largest_x = Math.max.apply(null,searcharea_polygon_x);
                    var smallest_x = Math.min.apply(null,searcharea_polygon_x);
                    var largest_y= Math.max.apply(null,searcharea_polygon_y);
                    var smallest_y= Math.min.apply(null,searcharea_polygon_y);
                    console.log('해당 지역의 x,y범위추정:',smallest_x,smallest_y+'~'+largest_x,largest_y);

                    if( (searchtarget_pos_x >= smallest_x && searchtarget_pos_x <=largest_x) && (searchtarget_pos_y >= smallest_y && searchtarget_pos_y <= largest_y)){
                        console.log('검색대상x,y가 속한 매칭포함지역인 경우!:',area_emd_code,area_emd_name);
                        console.log(searchtarget_pos_x,searchtarget_pos_y,  smallest_x,largest_x,smallest_y,largest_y);

                        match_addr_area = area_item;
                        break;
                    }
                }
                searcharea_polygon=[];
                searcharea_polygon_x=[];//각 지역별 관련된 폴리곤꼭지점위치들, x,y정보들 모두 초기화해준다.
                searcharea_polygon_y=[];

            }//각 지역 시군구 지역 forloop ends...*/
        }else if(search_type=='metro'){
            //var searchtarget_pos_x=searchdetail_result[0].x;
            //var searchtarget_pos_y=searchdetail_result[0].y;//시군구 기준sig기준 검색. 읍면동 조회시에 너무 해비해짐.

            var searchtarget_addrjibun=searchdetail_result[0].addr_jibun;//시군구 추출 extract...
            var addrjibun_array=searchtarget_addrjibun.split(' ');
            console.log('검색하려는 대상의 지번주소형태 array:',addrjibun_array);//시도 시군구 읍면동 ...형태로 분할. 스페이스를 기준으로 분할.
            var si_area='';var gun_area='';var gu_area='';
            for(var aa=0; aa<addrjibun_array.length; aa++){
                let addr_item=addrjibun_array[aa];
                if(addr_item.substr(addr_item.length-1,1)=='시'){
                    si_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='군'){
                    gun_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='구'){
                    gu_area=addr_item;
                }
            }
            //시구, 시군, 조합은 있지만  군구,구군 등 조합은 없음.
            var final_areaaddr_name= si_area + gun_area+ gu_area;//시군 or 시구 
            var final_areaaddr_name2;
            if(gun_area){
                var pure_areaaddr_name= gun_area;
                final_areaaddr_name2 = si_area +' '+gun_area;
            }
            if(gu_area){
                var pure_areaaddr_name = gu_area;
                final_areaaddr_name2 = si_area +' '+gu_area;
            }
            console.log('검색 대상 의 지역string:',final_areaaddr_name,final_areaaddr_name2);
            console.log('검색  좌표x,y:',si_area,gun_area,gu_area);

            var outer_features2 = SIGJSON.features;//각 시군구레벨 지역들.
            var match_addr_area=null;//어디지역에 속하는지.(시군구)

            for(let i=0; i<outer_features2.length; i++){
                let item=outer_features2[i];
                properties_array.push(item.properties);
            }
            console.log('properitess arraytsss:',properties_array);


            if(gun_area!='' && !gu_area){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                let target_index=0;
                target_index = properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('tarrget indexsss:',target_index);
                console.log('찾아낸 대상지역:::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];
            }else if(!gun_area && gu_area!=''){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                let target_index=0;
                target_index = properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('target indexsss:',target_index);
                console.log('찾아낸 대상지역:::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];
            }

            //우선 features지역들중에서 properites만을 기준으로 해서 해당 검색 대상체(대학교,지하철,매물)에서 나온 관련된 시군구값과매칭되는 시군구지역을 지역기준 먼저 쿼리.          
            /*for(let outer=0; outer<outer_features2.length; outer++){
                let area_item=outer_features2[outer];
                let properties=area_item.properties;
                let area_sig_code=properties.SIG_CD;//시군구 지역코드
                let area_sig_name=properties.SIG_KOR_NM;//시군구 지역이름

                //지역별 geometry데이터 조회
                let geometry= area_item.geometry;
                let coordinates = geometry.coordinates;
                console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);
                if(gun_area!='' && !gu_area){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2 == area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }else if(!gun_area && gu_area!=''){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2 == area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }
            }//각 지역 시군구 지역 forloop ends...*/
        }else if(search_type=='complex'){
            //var searchtarget_pos_x=searchdetail_result[0].x;
            //var searchtarget_pos_y=searchdetail_result[0].y;//시군구 기준sig기준 검색. 읍면동 조회시에 너무 해비해짐.

            var searchtarget_addrjibun=searchdetail_result[0].addr_jibun;//시군구 추출 extract...
            var addrjibun_array=searchtarget_addrjibun.split(' ');
            console.log('검색하려는 대상의 지번주소형태 array:',addrjibun_array);//시도 시군구 읍면동 ...형태로 분할. 스페이스를 기준으로 분할.
            var si_area='';var gun_area='';var gu_area='';
            for(var aa=0; aa<addrjibun_array.length; aa++){
                let addr_item=addrjibun_array[aa];
                if(addr_item.substr(addr_item.length-1,1)=='시'){
                    si_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='군'){
                    gun_area=addr_item;
                }else if(addr_item.substr(addr_item.length-1,1)=='구'){
                    gu_area=addr_item;
                }
            }
            //시구, 시군, 조합은 있지만  군구,구군 등 조합은 없음.
            var final_areaaddr_name= si_area + gun_area+ gu_area;//시군 or 시구 
            var final_areaaddr_name2;
            if(gun_area){
                var pure_areaaddr_name= gun_area;
                final_areaaddr_name2 = si_area +' '+gun_area;
            }
            if(gu_area){
                var pure_areaaddr_name = gu_area;
                final_areaaddr_name2 = si_area+' '+gu_area;
            }
            console.log('검색 대상 의 지역string:',final_areaaddr_name,final_areaaddr_name2);
            console.log('검색 좌표x,y:',si_area,gun_area,gu_area);

            var outer_features2 = SIGJSON.features;//각 시군구레벨 지역들.
            var match_addr_area=null;//어디지역에 속하는지.(시군구)

            for(let i=0; i<outer_features2.length; i++){
                let item=outer_features2[i];
                properties_array.push(item.properties);
            }
            console.log('properties arrayss ::',properties_array);

            if(gun_area!='' && !gu_area){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/
                let target_index=0;
                target_index= properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('find indexssss:',target_index);
                console.log('찾아낸 대상지역:::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];
            }else if(!gun_area && gu_area!=''){
                /*match_addr_area = outer_features2.filter(function(rowData){
                    console.log('filterss조회:::',rowData);
                    return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                });*/

                let target_index=0;
                target_index= properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                console.log('find indexsssss:',target_index);
                console.log('찾아낸 대상지역::',outer_features2[target_index]);

                match_addr_area = outer_features2[target_index];
            }

            //우선 features지역들중에서 properites만을 기준으로 해서 해당 검색 대상체(대학교,지하철,매물)에서 나온 관련된 시군구값과매칭되는 시군구지역을 지역기준 먼저 쿼리.          
            /*for(let outer=0; outer<outer_features2.length; outer++){
                let area_item=outer_features2[outer];
                let properties=area_item.properties;
                let area_sig_code=properties.SIG_CD;//시군구 지역코드
                let area_sig_name=properties.SIG_KOR_NM;//시군구 지역이름

                //지역별 geometry데이터 조회
                let geometry= area_item.geometry;
                let coordinates = geometry.coordinates;
                //console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);
                if(gun_area!='' && !gu_area){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2 == area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }else if(!gun_area && gu_area!=''){
                    if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2== area_sig_name){
                        match_addr_area=area_item;
                        break;
                    }
                }
               
            }//각 지역 시군구 지역 forloop ends...*/
        }
        else if(search_type=='product'){
            //var searchtarget_pos_x=searchdetail_result[0].x;
            //var searchtarget_pos_y=searchdetail_result[0].y;//시군구 기준sig기준 검색. 읍면동 조회시에 너무 해비해짐.

            var searchtarget_addrjibun=searchdetail_result[0].addr_jibun;//시군구 추출 extract...
            if(searchtarget_addrjibun){
                var addrjibun_array=searchtarget_addrjibun.split(' ');
                console.log('검색하려는 대상의 지번주소형태 array:',addrjibun_array);//시도 시군구 읍면동 ...형태로 분할. 스페이스를 기준으로 분할.
                var si_area='';var gun_area='';var gu_area='';
                for(var aa=0; aa<addrjibun_array.length; aa++){
                    let addr_item=addrjibun_array[aa];
                    if(addr_item.substr(addr_item.length-1,1)=='시'){
                        si_area=addr_item;
                    }else if(addr_item.substr(addr_item.length-1,1)=='군'){
                        gun_area=addr_item;
                    }else if(addr_item.substr(addr_item.length-1,1)=='구'){
                        gu_area=addr_item;
                    }
                }
                //시구, 시군, 조합은 있지만  군구,구군 등 조합은 없음.
                var final_areaaddr_name= si_area + gun_area+ gu_area;//시군 or 시구 
                var final_areaaddr_name2;
                if(gun_area){
                    var pure_areaaddr_name= gun_area;
                    final_areaaddr_name2 = si_area + ' '+gun_area;
                }
                if(gu_area){
                    var pure_areaaddr_name = gu_area;
                    final_areaaddr_name2 = si_area +' '+gu_area;
                }

                console.log('검색 대상 의 지역string:',final_areaaddr_name,final_areaaddr_name2);
                console.log('검색 좌표x,y:',si_area,gun_area,gu_area);

                var outer_features2 = SIGJSON.features;//각 시군구레벨 지역들.
                var match_addr_area=null;//어디지역에 속하는지.(시군구)

                for(let i=0; i<outer_features2.length; i++){
                    let item=outer_features2[i];
                    properties_array.push(item.properties);
                }
                console.log('properites arrayss:',properties_array);

                if(gun_area!='' && !gu_area){
                    /*match_addr_area = outer_features2.filter(function(rowData){
                        console.log('filterss조회:::',rowData);
                        return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                    });*/
                    let target_index=0;
                    target_index= properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                    console.log('target indexxssss:',target_index);
                    console.log('찾아낸 대상지역:::',outer_features2[target_index]);

                    match_addr_area= outer_features2[target_index];

                }else if(!gun_area && gu_area!=''){
                    /*match_addr_area = outer_features2.filter(function(rowData){
                        console.log('filterss조회:::',rowData);
                        return (final_areaaddr_name == rowData.properties.SIG_KOR_NM || pure_areaaddr_name == rowData.properties.SIG_KOR_NM || final_areaaddr_name2 == rowData.properties.SIG_KOR_NM);
                    });*/
                    let target_index=0;
                    target_index= properties_array.findIndex(find => (final_areaaddr_name == find.SIG_KOR_NM || pure_areaaddr_name == find.SIG_KOR_NM || final_areaaddr_name2 == find.SIG_KOR_NM));
                    console.log('target indexsss:',target_index);
                    console.log('찾아낸 대상지역::',outer_features2[target_index]);

                    match_addr_area = outer_features2[target_index];
                }

                //우선 features지역들중에서 properites만을 기준으로 해서 해당 검색 대상체(대학교,지하철,매물)에서 나온 관련된 시군구값과매칭되는 시군구지역을 지역기준 먼저 쿼리.          
                /*for(let outer=0; outer<outer_features2.length; outer++){
                    let area_item=outer_features2[outer];
                    let properties=area_item.properties;
                    let area_sig_code=properties.SIG_CD;//시군구 지역코드
                    let area_sig_name=properties.SIG_KOR_NM;//시군구 지역이름

                    //지역별 geometry데이터 조회
                    let geometry= area_item.geometry;
                    let coordinates = geometry.coordinates;
                    console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);
                    if(gun_area!='' && !gu_area){
                        if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name || final_areaaddr_name2== area_sig_name){
                            match_addr_area=area_item;
                            break;
                        }
                    }else if(!gun_area && gu_area!=''){
                        if(final_areaaddr_name == area_sig_name || pure_areaaddr_name == area_sig_name|| final_areaaddr_name2== area_sig_name){
                            match_addr_area=area_item;
                            break;
                        }
                    }                  
                }//각 지역 시군구 지역 forloop ends...*/
            }
        }
        console.log('검색 매칭 지역:',match_addr_area);

        connection.release();
        if(match_addr_area){
            return response.json({success:true,message:'sucecess queryss',result: searchdetail_result, outlineborder_result:match_addr_area});
        }else{
            return response.json({success:true,message:'sucecess queryss',result: searchdetail_result, outlineborder_result:null});
        }
        
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[]});
    }
});
//지역검색의 경우 클릭or엔터로 대상체인 지역중 읍면동or시군구 관련 폴리곤리턴, 나머지 (지하철,대학교,매물,단지)등은 무조건 시군구기준 검색(속도떄문이 아니라, 그것들로부터 읍면동의 정확한 데이터를 가져오는데 정확도에 문제가있음.)
//지도 검색페이지에서 지도중심좌표에대한 주소정보를(시군구or읍면동)에 포함하고있는 지역(시군구) 폴리곤데이터리턴.
router.post('/idlezido_areaoutlineborder',async function(request,response){
    console.log('=====>>>idlezido_areaoutlineborder request.body:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);
    //id_val, search_type_val
    try{
        var sig_value=req_body.sig_value;
        var emd_value=req_body.emd_value;
        var sigcode_value = req_body.sigcode_value;//시군구레벨까지의 다섯자리의 숫자값결과값.해당 코드를 만족하면서도. 지역명 만족하는 둘다로 해야ㅐ함. 지역명만으로는 다른 상위행정구역상에서도 쓰이는 이름일수도있는 이슈가있음. 행정코드명까지하면 지도의 중심좌표에 대한 고유주소위치에 대한 고유값임.
        var emdcode_value = req_body.emdcode_value;//읍면동코드값.
        var maplevel = req_body.maplevel;//맵 레벨값.

        //console.log('검색 대상 좌표의 주소 지역string:',sig_value,emd_value,sigcode_value,emdcode_value,maplevel);

        //var [addrunits_query] = await connection.query("select * from addr_units where name=?",[sig_value]);//시군구레벨상에서 검색한다. 창원시 의창구, 창원시 성산구,시구 같이 있는것들도 있음.이런것은 띄워져 시, 구가 띄워져있는형태 포맷임.해당 행정구역명에 해당하는 레코드결과에서 id 지역코드값 필요함.
        //var addr_code=addrunits_query[0].id;//시군구 코드는 5자리 / 읍면동 코드는 8자리

        var match_addr_area=null;//어디지역에 속하는지.(시군구 or 읍면동)

        var properties_array=[];

        if(maplevel >=1 && maplevel <=5){
            //읍면동 기준 검색되게
            var outer_features = EMDJSON.features;//각 읍면동레벨 지역들
            for(let i=0; i<outer_features.length; i++){
                let item=outer_features[i];
                properties_array.push(item.properties);
            }
            //console.log('properties arraysss:',properties_array);

            let target_index=0;
            target_index = properties_array.findIndex( find => (find.EMD_CD == emdcode_value && find.EMD_KOR_NM == emd_value));
            //console.log('find indexsssss(읍면동):',target_index);
            //console.log('find대상지역::',outer_features[target_index]);

            match_addr_area = outer_features[target_index];
            /*match_addr_area = outer_features.filter(function(rowData){
                console.log('fliters조회:',rowData);
                return((rowData.properteis.EMD_CD == emdcode_value && rowData.properties.EMD_KOR_NM == emd_value));
            });*/

            //console.log('match addr array resultss:',match_addr_area);

        }else if(maplevel >=6 && maplevel <=7){
            //시군구 기준 검색되게
            let one = sig_value.split(' ')[0];
            let two = sig_value.split(' ')[1];
            var outer_features2 = SIGJSON.features;//각 시군구레벨 지역들.

            /*match_addr_area= outer_features2.filter(function(rowData){
                console.log('filters조회:',rowData);
                return ((rowData.properties.SIG_CD == sigcode_value && rowData.properties.SIG_KOR_NM == sig_value) || ( rowData.properties.SIG_KOR_NM == one + two && rowData.properties.SIG_CD == sigcode_value)); 
            });*/
            for(let i=0; i<outer_features2.length; i++){
                let item=outer_features2[i];
                properties_array.push(item.properties);
            }
            //console.log('proerpites arraysss:',properties_array);

            let target_index=0;
            target_index = properties_array.findIndex( find => (find.SIG_CD == sigcode_value && find.SIG_KOR_NM == sig_value) || (find.SIG_KOR_NM == one + two && find.SIG_CD == sigcode_value));
            //console.log('find indexssss(시군구):',target_index);
            //console.log('find대상지역>>>:',outer_features2[target_index]);

            match_addr_area = outer_features2[target_index];

           // console.log('match addr array resultss:',match_addr_area);
        }
        
        //console.log('검색 매칭 지역:',match_addr_area);

        connection.release();

        return response.json({success:true,message:'sucecess queryss',outlineborder_result:match_addr_area});

    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[]});
    }
});
//지역검색만 진행>>>(범용)
router.post('/addrUnit_search',async function(request,response){
    console.log('=====+++++>>>request.body:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);

    try{
        //해당 keyword에 대해서 지역명 등 검색 진행
        var keyword=req_body.search_keyword_val;

        //var [addrunits_row_result] = await connection.query("select * from addr_units where name like '%"+keyword+"%' limit 100");  
        var addrunits_row_result=[];
        var [match_sigungo_units] = await connection.query("select * from addr_units where name like '%"+keyword+"%' and type=2 limit 4");//백개이하로 해서 시군구레벨내역들 매칭리스트 리턴
        var [match_yeopmyeondong_units] = await connection.query("select * from addr_units where name like '%"+keyword+"%' and type=4 limit 20");//백개이하로 해서 읍면동레벨내역들 관련 매칭리스트 리턴
        
        console.log('시도레벨,시군구레벨,읍면동레벨 관련 검색어 매칭리스트::',match_sigungo_units,match_yeopmyeondong_units);

        for(let sigungo=0; sigungo<match_sigungo_units.length; sigungo++){
            let store_object_sigungo={};

            //매칭 시군구리스트에 upid들 구해서 어떤 시도레벨에 속했던건지 구함.각 요소별
            let up_id_refer=match_sigungo_units[sigungo]['up_id'];
            console.log('시군구리스트::',match_sigungo_units[sigungo]);  console.log('up_id_refer:',up_id_refer);
            let mother_sido_query=await connection.query("select * from addr_units where id=? and type=1",[up_id_refer]);//상위 시도레벨 up_id참조하는 관련 정보
            console.log('mother sido queryss:',mother_sido_query[0]);
            let mother_sido_name=mother_sido_query[0][0]['name'];//시도네임 이름값.행정구역이름값.
            console.log('mother_sido_name::',mother_sido_query[0][0],mother_sido_query[0][0]['name']);

            store_object_sigungo['id']=match_sigungo_units[sigungo]['id'];
            store_object_sigungo['up_id']=match_sigungo_units[sigungo]['up_id'];
            store_object_sigungo['name']=mother_sido_name+' '+match_sigungo_units[sigungo]['name'];//시도네임+신군구이름.
            store_object_sigungo['type']=match_sigungo_units[sigungo]['type'];
            store_object_sigungo['x']=match_sigungo_units[sigungo]['x'];
            store_object_sigungo['y']=match_sigungo_units[sigungo]['y'];
            let my_sigungo_name=match_sigungo_units[sigungo]['name'];//시군구이름.

           
            addrunits_row_result.push(store_object_sigungo);//시군구리스트 추가.
            let up_id_loca=match_sigungo_units[sigungo]['id'];//해당 시군구레벨의 row를 upid로써 참조하고있는 자식 읍면동리스트.
            let [child_yeop_list] = await connection.query("select * from addr_units where up_id=? and type=4",[up_id_loca]);

            console.log(my_sigungo_name,mother_sido_name,child_yeop_list);
            for(let yeop=0; yeop<child_yeop_list.length; yeop++){
                let yeop_item= child_yeop_list[yeop];

                let store_object_yeop={};
                store_object_yeop['id']=yeop_item['id'];
                store_object_yeop['up_id']=yeop_item['up_id'];
                store_object_yeop['name'] = mother_sido_name +' '+my_sigungo_name+' '+yeop_item['name'];//외부포문 시도+시군구(각포문별)행정구역명 읍면동행정명
                store_object_yeop['type'] = yeop_item['type'];
                store_object_yeop['x'] = yeop_item['x'];
                store_object_yeop['y'] = yeop_item['y'];

                addrunits_row_result.push(store_object_yeop);
            }
        }

        for(let yeop=0; yeop<match_yeopmyeondong_units.length; yeop++){
            let store_object_yeop={};

            let item=match_yeopmyeondong_units[yeop];//읍면동 아이템의 추적추적하여 up-id등으로 추적하여 부무 (신구구) 또 부모 시도 구함.
            let up_id_sigungo=item['up_id'];
            let parent_sigungo_query=await connection.query("select * from addr_units where id=? and type=2",[up_id_sigungo]);
            let sigungo_name=parent_sigungo_query[0][0]['name'];
            let sigungo_upid=parent_sigungo_query[0][0]['up_id'];//시군구 row의 upid
            let parent_parent_sido_query=await connection.query("select * from addr_units where id=? and type=1",[sigungo_upid]);//시도레벨 참조 부모요소.지역
            let sido_name=parent_parent_sido_query[0][0]['name'];
            
            store_object_yeop['id']=item['id'];
            store_object_yeop['up_id']=item['up_id'];
            store_object_yeop['name'] = sido_name+' '+sigungo_name+' '+item['name'];
            store_object_yeop['type'] = item['type'];
            store_object_yeop['x'] = item['x'];
            store_object_yeop['y'] = item['y'];

            addrunits_row_result.push(store_object_yeop);
        }
        console.log('gettering addrunitss:',addrunits_row_result);
        //console.log('realted metro지하철,대학교,지역 관련 연관데이터들:',metro_row_result,university_row_result,product_row_result,complex_row_result);
      
       if(addrunits_row_result.length == 0){//관련 결과가 없는 경우
           addrunits_row_result = [];
       }
        connection.release();
        return response.json({success: true, message:'sauqewry success', result:addrunits_row_result});
        
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problem error!'});
    }
});
//검색 지역에 연관된 소재지에 해당하는 전문중개사(소재지: 시도>시군구>읍면동 단위까지 지원)포함하는 전문중개사리스트 조회.(중개의뢰페이지)
router.post('/addrunits_match_probrokerlist',async function(request,response){
    console.log('requst body addrunis match probkerlist:',request.body);

    var req_body=request.body;

    const connection = await pool.getConnection(async conn=> conn);

    try{
        var id_val =req_body.id_val;//검색 클릭 지역키워드값(시도,시군구,읍면동)에 해당하는 like포함하는 모든 리스트 조회

        console.log('연관전문중개사 쿼리::',"select * from company2 where addr_jibun like '%"+id_val+"%'");
        var [addrunits_match_probroker] = await connection.query("select * from company2 where addr_jibun like '%"+id_val+"%' and type='중개사'");
        console.log('>>>>>연관된 전문중개사리스트::',addrunits_match_probroker);

        var distinct_company_joinarray=[];
        for(let a=0; a<addrunits_match_probroker.length; a++){
            let company_id=addrunits_match_probroker[a]['company_id'];

            var [probroker_join_query] = await connection.query("select cp.*, prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from company2 cp join pro_realtor_permission prp on cp.company_id=prp.company_id left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where cp.company_id=? and cp.is_pro=1 and prp.permission_state='승인' order by prp_id desc",[company_id]);

            console.log('proborkeerinjoinqueryss:',probroker_join_query);

            //각 중개사별 중개사,전문종목 조인쿼리 결과문 진행.
            var store_object={};
            if(probroker_join_query.length>=1){
                //조인된쿼러내역이 이쓴것은 전문종목이 있는 최근승인된 전문중개사인 내역들만나오게하겠다는것.그렇지ㅏㄶ은것들 제외
                
                store_object['probroker_permission']=probroker_join_query[0];
                //distinct_company_joinarray.push(probroker_join_query[0]);

                //전문종목이 있는 중개사에 대해서 중개매너점수 관련 조회하기위함
                var [manner_query] = await connection.query("select distinct mem_id from company_score where company_id=?",[company_id]);
                var cspoint_total = 0;
                var manner_querycnt=0;
                
                for(let s=0; s<manner_query.length; s++){
                    let user=manner_query[s].mem_id;
                    if(user && company_id){
                        var [user_per_recently_scorevalue ] = await connection.query("select * from company_score where mem_id=? and company_id=? order by create_date desc",[user,company_id]);
                        let cs_point = user_per_recently_scorevalue[0]['cs_point'];

                        cspoint_total += cs_point;
                        manner_querycnt++;
                    }
                }
                console.log('매긴 총 매너점수합계 및 평균::',cspoint_total,manner_querycnt,cspoint_total/manner_querycnt);
                store_object['probroker_mannerscore'] = cspoint_total/manner_querycnt;
                
                //각 중개사 수임하고있는 매물내역 수임매물리스트조회
                var prd_identity_id_array=[];
                var [product_row] = await connection.query("select distinct prd_identity_id from product where company_id=?",[company_id]);

                for(var s=0; s<product_row.length; s++){
                    prd_identity_id_array.push(product_row[s].prd_identity_id);
                }
                if(prd_identity_id_array.length>=1){
                    var match_transaction_list=[];
                    for(var ss=0; ss<prd_identity_id_array.length; ss++){
                        var [match_transaction_query] = await connection.query("select * from transaction where prd_identity_id=?",[prd_identity_id_array[ss]]);
                        var [match_product_query_origin] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id_array[ss]]);

                        var transaction_status=match_transaction_query[0].txn_status;
                        let store_match={};
                        store_match['transaction_status'] = transaction_status;
                        store_match['match_product'] = match_product_query_origin[0];

                        match_transaction_list.push(store_match);
                    }
                }else{
                    var match_transaction_list=[];
                }
                store_object['asign_transaction'] = match_transaction_list;

                distinct_company_joinarray.push(store_object);
            }
        }
        console.log('중개사별 현재 전문중개사 승인상태이며, 가장 최근에 승인된 허락내역 중개사별 한개씩 저장한 형태 리턴::',distinct_company_joinarray);

        connection.release();
        return response.json({success:true, message:'query succecsss', result:distinct_company_joinarray});
    }catch(err){
        console.log('server error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problem error!'});
    }
});
//지도 페이지 일단 도록로명주소 기준 주변 지역 검색.로드개념.페이지 로드됨.(deprecated)
router.post('/main_searchresult_roadaddress',async function(request,response){
    console.log('=====>>>request.body:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);
    //id_val, search_type_val
    try{
        var screen_width= req_body.screen_width;
        var screen_height= req_body.screen_height;
        var zido_level =req_body.level;
        var prd_type= req_body.prdtype_val;
        var search_road_address = req_body.search_road_address
        var isexclusive= req_body.isexclusive_val;
        var isprobroker=req_body.isprobroker_val;
        var isblock= req_body.isblock_val;

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

        //해당 도로명 주소에 대해서 xy로 리턴하는 api구현, 해당 요청 도로명주소에 대한 경도위도 반환.
        const api_headers={'Authorization' : 'KakaoAK '+"ac08f2d6adfd16a501ad517d7a2fab3f"};
        const api_url="https://dapi.kakao.com/v2/local/search/address.json?&query=" + encodeURI(search_road_address);

        let api_response= await request_api.get({
            uri:api_url,
            headers:api_headers
        });
        console.log('--->>>>responses:',api_response);
        api_response= JSON.parse(api_response);
        console.log('responsedocumentsss::',api_response.documents);
        api_response_final = api_response.documents[0];//얻어낸 x,y경도위도값.

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
        var origin_x= parseFloat(api_response_final.x);
        var origin_y= parseFloat(api_response_final.y);

        var level_zido_startx= origin_x - x_distance;
        var level_zido_endx= origin_x + x_distance; 
        var level_zido_starty= origin_y - y_distance;
        var level_zido_endy= origin_y + y_distance;
        console.log('=======지도 중심origin x,y좌표 및 주변 직사각형 좌표 범위area:',zido_level,origin_x,origin_y,x_distance,y_distance);
        console.log('=======startx~endx, starty~endy',level_zido_startx,level_zido_endx,level_zido_starty,level_zido_endy);

        //해당 범위의 startx~endx,starty~endy 모두 만족하는 범위들 구한다. 만족하는 전문중개사들(company),단지별실거래(complex),매물(product:오피아파트이면 complexid에서 가져온 x,y값이고, 상가사무실이면 floor에서있던 x,y들 가져온것) x,y를 기준으로 만족 되는 범위의 것들 구한다.
        if(isblock){
            var [search_complex_result] = await connection.query("select * from complex where x >= ? and x <= ? and y >= ? and y <= ? limit 20",[level_zido_startx,level_zido_endx, level_zido_starty,level_zido_endy]);
            var [search_complex_result_zido] = await connection.query("select * from complex where x >= ? and x <= ? and y >= ? and y <= ?",[level_zido_startx,level_zido_endx, level_zido_starty,level_zido_endy]);
        }else{
            var search_complex_result = [];
            var search_complex_result_zido = [];
        }
        
        if(isexclusive){
            var [search_product_result] = await connection.query("select * from product where prd_type=? and prd_longitude >= ? and prd_longitude <= ? and prd_latitude >= ? and prd_latitude <= ? limit 20",[prd_type,level_zido_startx,level_zido_endx,level_zido_starty,level_zido_endy]);
            var [search_product_result_zido] = await connection.query("select * from product where prd_type=? and prd_longitude >= ? and prd_longitude <= ? and prd_latitude >= ? and prd_latitude <= ?",[prd_type,level_zido_startx,level_zido_endx,level_zido_starty,level_zido_endy]);
        }else{
            var search_product_result = [];
            var search_product_result_zido = [];
        }
        
        if(isprobroker){
            var [search_company_result] = await connection.query("select * from company where x >= ? and x <= ? and y >= ? and y <= ? limit 20",[level_zido_startx,level_zido_endx,level_zido_starty,level_zido_endy]);
            var [search_company_result_zido] = await connection.query("select * from company where x >= ? and x <= ? and y >= ? and y <= ?",[level_zido_startx,level_zido_endx,level_zido_starty,level_zido_endy]);
        }else{
            var search_company_result = [];
            var search_company_result_zido = [];
        }
        
        //var [search_product_result] = await connection.query("select * from product");
        //var [search_company_result] = await connection.query("select * from company");

        //console.log('===>>만족되는 데이터들::',search_complex_result,search_product_result,search_company_result);

        console.log('만족 complexss::======================',search_complex_result_zido.length);
        for(let c=0; c<search_complex_result_zido.length; c++){
            console.log('x,y:',search_complex_result_zido[c].x,search_complex_result_zido[c].y);
        }
        console.log('만족 products::======================',search_product_result_zido.length);
        for(let c=0; c<search_product_result_zido.length; c++){
            console.log('x,y,prdtype:',search_product_result_zido[c].prd_longitude,search_product_result_zido[c].prd_latitude,search_product_result_zido[c].prd_type);
        }
        console.log('만족 companys::======================',search_company_result_zido.length);
        for(let c=0; c<search_company_result_zido.length; c++){
            console.log('x,y:',search_company_result_zido[c].x,search_company_result_zido[c].y);
        }

        connection.release();

        return response.json({success:true,message:'sucecess queryss', result_origin:{x:origin_x, y:origin_y}, match_matterial : [search_product_result,search_company_result,search_complex_result, search_product_result_zido,search_company_result_zido,search_complex_result_zido]});

    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!', result_origin:{},match_matterial: [] });
    }
});

//단지별실거래 상세정보.(사이드바)
router.post('/complexdetail_infoget',async function(request,response){
    console.log('complexdetail info get테스트 요청:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);
    try{
        var complex_id= req_body.complex_id;
        var [complex_detailrow]= await connection.query("select * from complex where complex_id=?",[complex_id]);
        //var [complex_total_sadecnt]= await connection.query("select count(*) as cnt from complex c join buildings bd on c.complex_id=bd.complex_id join floor f on bd.bld_id=f.bld_id join ho_info h on f.flr_id=h.flr_id where c.complex_id=?",[complex_id]);//해당 단지의 총 세대수
        var complex_total_sadecnt=  complex_detailrow[0]['household_cnt'];//해당 단지정보의 세대수카운트.비어있는 0값인겨우도 있습니다.

        //select * from area_info a left join complex c on a.complex_id=c.complex_id left join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=5 면적볅 실거래정보가 있지않든있든 상관없는 단지의 전체 면적별 관련정보 
        //select * from area_info a left join complex c on a.complex_id=c.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=5 면적별 실거래정보가 있는 면적들만 조인
        
        var [areainfo_rows] = await connection.query("select * from area_info where complex_id=?",[complex_id]);//해당 단지에 관련된 있는 모든 면적들(평,m2)구한다.
        //var [areainfo_rows] = await connection.query("select * from area_info a left join complex c on a.complex_id=c.complex_id left join actual_transaction_price apt on a.area_id=apt.area_id where complex_id=?",[complex_id]);//해당 특정단지에 관련된 모든 면적 및 실거래내역들 가져온다.

        var areainfo_info_structure=[];//각 면적당 정보로하고 값은 각 면적당 정보를 담고있음.
        for(let a=0; a<areainfo_rows.length; a++){
            let area_id_loca= areainfo_rows[a].area_id;

            areainfo_info_structure[a] = {};
            areainfo_info_structure[a]['key'] = area_id_loca;
            areainfo_info_structure[a]['info'] = areainfo_rows[a];
            //let [sadecnt_perArea] = await connection.query("select count(*) cnt from ho_info where area_id=?",[area_id_loca]);//해당 면적id를 사용하고있는 임의의 모든 호실정보들..카운트는 각 면적을 사용하는 모든 세대수(호) 면적별 세대수
            //areainfo_info_structure[a]['sadecnt'] = sadecnt_perArea[0]['cnt'];

            let [match_transaction_total] = await connection.query("select * from actual_transaction_price where area_id=?",[area_id_loca]);
            let [match_transaction_mametype] = await connection.query("select * from actual_transaction_price where area_id=? and type='매매'",[area_id_loca]);
            let [match_transaction_jeonsewalsetype] = await connection.query("select * from actual_transaction_price where area_id=? and (type='월세' or type='전세')",[area_id_loca]);
            areainfo_info_structure[a]['mametransaction']= match_transaction_mametype;
            areainfo_info_structure[a]['jeonsewalsetransaction']=match_transaction_jeonsewalsetype;
            areainfo_info_structure[a]['totaltransaction']=match_transaction_total;

            console.log(match_transaction_mametype,match_transaction_jeonsewalsetype,match_transaction_total)
        }
       // var [actual_transaction_price_complex] = await connection.query("select * from area_info join actual_transaction_price on area_info.area_id=actual_transaction_price.area_id where complex_id=?",[complex_id]);//해당 complexid에 해당하는 정보를 구한다.
        
        console.log('compelx_detailrow,actua단지별실거래정보 관련 젇보들:',complex_detailrow,complex_total_sadecnt,areainfo_info_structure);

        connection.release();

        return response.json({success:true,message:'sucecess queryss', result:[complex_detailrow, complex_total_sadecnt, areainfo_info_structure]});

    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[] });
    }
});
//지도페이지 사이드바 전문중개사 상세 정보 조회.(지도 사이드바)
router.post('/probrokerinfo_detail',async function(request,response){
    console.log('probrokerinfo_detail 요청:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);
    try{
        var company_id= req_body.company_id;
        var mem_id = req_body.mem_id;

        var [allproduct_query] = await connection.query("select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where t.txn_status='거래개시' group by p.prd_identity_id");//거래개시인 모든 항목들 조회.
        var all_regist_count=allproduct_query.length;

        //전문중개사 관련 정보 리턴.
        var probroker_info_result={};

        var [probroker_data] = await connection.query("select * from company2 where is_pro=1 and company_id=?",[company_id]);
        if(probroker_data.length>=1){
            probroker_info_result['company_id'] = company_id;
            probroker_info_result['probroker_info'] = probroker_data[0];

            let [probroker_permission_info] = await connection.query("select prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from pro_realtor_permission prp left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where company_id=? and permission_state='승인' order by prp_id desc",[company_id]);//전문중개사 전문종목 신청내역중 가장 최근 승인된것 가장 최근 승인된 정보 전문종목 정보.승인으로 처리시에 관리자에서 로직적으로 관련 comapny2는 프로상태로 하고, 미승인이나 취소처리시엔 ispro값을 해제한다.
            let [probroker_asign_productinfo] = await connection.query("select distinct prd_identity_id from product where company_id=?",[company_id]);//해당 comapnyid에 관련된 모든 매물리스트 가져온다. 구별된 prd_identity매물리스트 내역들.
            console.log('전문중개사companyid:',company_id);
            console.log('해당 관련 전문중개사 전문종목 최근승인정보:',probroker_permission_info);
            console.log('해당 전문중개사가 수임하고있는 관련 매물들prd_identitiy_id리스트:',probroker_asign_productinfo);

            let matched_productinfo_array=[];//임의 전문중개사가 수임한 매물들 정보 저장 임시저장.
            for(let pp=0; pp<probroker_asign_productinfo.length; pp++){
                let prd_identity_id=probroker_asign_productinfo[pp]['prd_identity_id'];//id값.
                //((p.exclusive_start_date is null or p.exclusive_end_date is null) or (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d')) )

                let [product_transaction_query] = await connection.query("select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where p.prd_identity_id=? and (t.txn_status='거래개시' or t.txn_status='거래완료동의요청' or t.txn_status='거래완료동의요청거절') and (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))",[prd_identity_id]);//관련 매물&거래정보 조인내역들중 가장 첫 row가 의미하는것은 각 매물별 origin 매물의 최근 수정등 자체근본 정보를 의미하며,매칭되어 나타나는 매 동일한 공통된 transaction값이 곧 매물의 최근 상태값이다.그걸 기준으로 각 매물별 상태값 측정. 거래개시상태값이면서 범위에 해당하는 경우에처리.
                if(product_transaction_query&&product_transaction_query[0]){
                    matched_productinfo_array.push(product_transaction_query[0]);//거래개시 매물들만 노출.
                }
            }
            //console.log('전문중개사 수임 매물리스트정보transciton::',matched_productinfo_array);
           
            probroker_info_result['permission_info'] = probroker_permission_info;
            probroker_info_result['asign_productinfo'] = matched_productinfo_array;

            console.log('관련 전문중개사 정보 자료구조::',probroker_info_result);
            connection.release();
            return response.json({success:true, message:'server query successs',result:probroker_info_result, all_regist_count:all_regist_count })
        }else{

            connection.release();
            return response.json({success:false, message:'result no'})
        }
                 
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[] });
    }
});
//지도페이지 사이드바 전문중개사 상세 정보 조회(필터검색요청시에) 매물종류별/거래타입별 where조회시에.(지도사이드바 전문중개사 상세정보조회)
router.post('/probrokerinfo_asigninfo_detail',async function(request,response){
    console.log('probrokerinfo_asigninfo_detail 요청:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);
    var maemultype_where='';
    var seltype_where='';
    if(req_body.cond){
        if(req_body.cond=='전체'){
            maemultype_where='';
        }else{
            maemultype_where=` and p.prd_type='${req_body.cond}'`;//매물타입 해당조건 추가.
        }
    }
    if(req_body.cond2){
        if(req_body.cond2=='전체'){
            seltype_where ='';
        }else{
            seltype_where=` and p.prd_sel_type='${req_body.cond2}'`;//거래타입 해당조건 추가
        }
    }
    try{
        var company_id= req_body.company_id;
        var mem_id = req_body.mem_id;

        var probroker_info_result={};

        var [probroker_data] = await connection.query("select * from company2 where is_pro=1 and company_id=?",[company_id]);
        if(probroker_data.length>=1){
            probroker_info_result['company_id'] = company_id;
            probroker_info_result['probroker_info'] = probroker_data[0];

            let [probroker_asign_productinfo] = await connection.query("select distinct prd_identity_id from product where company_id=?",[company_id]);//해당 comapnyid에 관련된 모든 매물리스트 가져온다. 구별된 prd_identity매물리스트 내역들.
            console.log('전문중개사companyid:',company_id);
            console.log('해당 전문중개사가 수임하고있는 관련 매물들prd_identitiy_id리스트:',probroker_asign_productinfo);

            let matched_productinfo_array=[];//임의 전문중개사가 수임한 매물들 정보 저장 임시저장.
            for(let pp=0; pp<probroker_asign_productinfo.length; pp++){
                let prd_identity_id=probroker_asign_productinfo[pp]['prd_identity_id'];//id값.
                console.log("select (select count(*) from likes li where p.prd_identity_id= li.prd_identity_id and li.mem_id=?) as isLike, p.*,t.* from product p join transaction t on p.prd_identity_id=t.prd_identity_id where p.prd_identity_id=? and (t.txn_status='거래개시' or t.txn_status='거래완료승인요청' or t.txn_status='거래완료승인요청 거절')"+maemultype_where+seltype_where+" and ( p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))");//각 수임하고있는 row매물별 매물타입조건 + 거래타입조건 관련 쿼리진행. 매매타입,매물타입모두 만족되는것 쿼리.(전체인경우)는 추가 where절없음.
                let [product_transaction_query] = await connection.query("select (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id=?) as isLike,p.*,t.* from product p join transaction t on p.prd_identity_id=t.prd_identity_id where p.prd_identity_id=? and (t.txn_status='거래개시' or t.txn_status='거래완료승인요청' or t.txn_status='거래완료승인요청 거절')"+maemultype_where+seltype_where+" and ( p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))",[mem_id,prd_identity_id]);//관련 매물&거래정보 조인내역들중 가장 첫 row가 의미하는것은 각 매물별 origin 매물의 최근 수정등 자체근본 정보를 의미하며,매칭되어 나타나는 매 동일한 공통된 transaction값이 곧 매물의 최근 상태값이다.그걸 기준으로 각 매물별 상태값 측정.

                if(product_transaction_query&&product_transaction_query[0]){
                    matched_productinfo_array.push(product_transaction_query[0]);//거래개시 매물들만 노출.
                }              
            }
            //console.log('전문중개사 수임 매물리스트정보transciton::',matched_productinfo_array);
           
            probroker_info_result['asign_productinfo'] = matched_productinfo_array;

            console.log('관련 전문중개사 정보 자료구조::',probroker_info_result);
            connection.release();
            return response.json({success:true, message:'server query successs',result:probroker_info_result })
        }else{

            connection.release();
            return response.json({success:false, message:'result no'})
        }
                
        
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[] });
    }
});
//지도페이지 스크롤링에 따른 전문중개사요소리스트 스크롤end시마다 +1개씩 불러오는 fetch api(지도 사이드바 스크롤링전문중개사)
router.post('/nextProbroker_item_sidebar',async function(request,response){
    console.log('nextProbroker_item_sidebar 요청:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);
    try{
        var currentArr_val= req_body.currentArr_val;
        var zido_level = req_body.level;
        var origin_y = parseFloat(req_body.origin_y);
        var origin_x = parseFloat(req_body.origin_x);
        var screen_width = req_body.screen_width;
        var screen_height =req_body.screen_height;
        var starty = req_body.starty;
        var startx= req_body.startx;
        var endx=req_body.endx;
        var endy=req_body.endy;
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
         
        var level_zido_startx= origin_x - x_distance;
        var level_zido_endx= origin_x + x_distance; 
        var level_zido_starty= origin_y - y_distance;
        var level_zido_endy= origin_y + y_distance;
        console.log('=======지도 중심origin x,y좌표 및 주변 직사각형 좌표 범위area:',zido_level,origin_x,origin_y,x_distance,y_distance);
        console.log('=======startx~endx, starty~endy',level_zido_startx,level_zido_endx,level_zido_starty,level_zido_endy);

        //console.log('기존 사이드바 데이터:',currentArr_val,JSON.parse(currentArr_val));
        currentArr_val = JSON.parse(currentArr_val);
        for(let j=0; j<currentArr_val.length; j++){
            console.log('prev side bar datasss:',currentArr_val[j].company_id);
        }
        //해당 범위의 startx~endx,starty~endy 모두 만족하는 범위들 구한다. 해당 범위에 현재 화면상 지도화면상에 있는 관련 전문중개사리스트들을 모두 구한다.+거래개시인품목을 취급하고있는 
        //var [all_probroker_data] = await connection.query("select distinct c.company_id as company_id,c.x as x,c.y as y from company2 c join product p on c.company_id=p.company_id join transaction t on p.prd_identity_id=t.prd_identity_id where t.txn_status='거래개시' and c.type='중개사' and c.x>=? and c.x<=? and c.y>=? and c.y<=? group by p.prd_identity_id",[level_zido_startx,level_zido_endx,level_zido_starty,level_zido_endy]);//거래개시매물을 현재 담당하고 있는 위치조건을 만족하는 전문중개사리스트모두 구함.위ㅣ조건+거래개시매물담당하고있는 두 조건만족.에 해당하는 전문중개사id별 구분리스트.
        var [all_probroker_data] = await connection.query("select distinct c.company_id as company_id,c.x as x,c.y as y from company2 c join product p on c.company_id=p.company_id join transaction t on p.prd_identity_id=t.prd_identity_id where (t.txn_status='거래개시' or t.txn_status='거래완료동의요청' or t.txn_status='거래완료동의요청거절') and (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d')) and c.type='중개사' and c.x>=? and c.x<=? and c.y>=? and c.y<=? group by p.prd_identity_id",[startx,endx,starty,endy]);//거래개시매물을 현재 담당하고 있는 위치조건을 만족하는 전문중개사리스트모두 구함.위ㅣ조건+거래개시매물담당하고있는 두 조건만족.에 해당하는 전문중개사id별 구분리스트.
        console.log('all_proobborker data match:');
        let all_probroker_str='';
        for(let j=0; j<all_probroker_data.length; j++){
           all_probroker_str += (all_probroker_data[j].company_id)+',';
        }
        console.log(all_probroker_str);

        var inserted_single_item='';
        for(let s=0; s<all_probroker_data.length; s++){
            let company_id = all_probroker_data[s].company_id;
            let is_exists=false;//해당 넣으려는 값이 companyid값이 기존 사이드바 전문중개사데이터 상에 존재하고있던건거닞 여부
            for(let ii=0; ii<currentArr_val.length; ii++){
                let now_sidebar_probrokeritem = currentArr_val[ii]['company_id'];
                if(company_id == now_sidebar_probrokeritem){
                    //이미 ㅣ있는 항목에 대해선 insert하지 않고 건너뜀
                    is_exists=true;//발견되었으면 break처리
                    break;
                }
            }
            if(!is_exists){
                //currentArr_val.push(all_...)
                inserted_single_item = all_probroker_data[s];//삽입이 가능한 전문중개사 아이템 싱글요소

                break;
            }
        }
        if(inserted_single_item){
            console.log('사이드바에 +1 삽입이 가능한 요소::',inserted_single_item);//이 삽입이 가능한 요소는..이미 거래개시품목을 담당하고있늕조건+위치조건만족 하는 리스트중에서 기존에 존재치않던 삽입가능한 요소임.
            let companyid_local=inserted_single_item['company_id'];

            //그 +1 삽입이 가능한 요소를 그 삽입가능한 companyid에 해당하는 전문중개사 요소 관련된 조인정보들 하면 될뿐이다.리턴하면된다.
            let [probroker_permission_info] = await connection.query("select prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from pro_realtor_permission prp left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where company_id=? and permission_state='승인' order by prp_id desc",[companyid_local]);//해당 삽입가능 추가가능 전문중개사관련된 최근승인정보값.전문종목정보값.
            let [probroker_asign_productinfo] = await connection.query("select distinct prd_identity_id from product where company_id=?",[companyid_local]);
            let [probroker_info] = await connection.query("select * from company2 where company_id=?",[companyid_local]);
            console.log('해당 전문중개사 전문종목 최근승인정봄:',probroker_permission_info);
            console.log('해당 전문중개사가 숭미하고있는 관련매물들prd_idnetitiyid리스트:',probroker_asign_productinfo);

            let matched_productinfo_array=[];
            for(let pp=0; pp<probroker_asign_productinfo.length; pp++){
                let prd_identity_id = probroker_asign_productinfo[pp]['prd_identity_id'];
                let [product_transaction_query] = await connection.query("select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where p.prd_identity_id=? and (t.txn_status='거래개시' or t.txn_status='거래완료동의요청' or t.txn_status='거래완료동의요청거절') and (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))",[prd_identity_id]);//관련 매물거래정보 거래내역들 조인내역들 가자 엋ㅅrow정보.
                if(product_transaction_query&&product_transaction_query[0]){
                    matched_productinfo_array.push(product_transaction_query[0]);//거래개시 매물들만 노출.
                }
            }

            connection.release();

            //console.log('각 전문중개사별 수임 매물리스트 정보transaciton::',matched_productinfo_array);
            if(matched_productinfo_array.length>=1){
                var inserted_single_probrokerinfo={};
                inserted_single_probrokerinfo['company_id']=companyid_local;
                if(probroker_permission_info[0]){
                    inserted_single_probrokerinfo['permission_info']=probroker_permission_info[0];
                }
                
                inserted_single_probrokerinfo['probroker_info'] = probroker_info[0];
                inserted_single_probrokerinfo['asign_productinfo'] = matched_productinfo_array;
                let recent_register_productinfo;

                recent_register_productinfo = matched_productinfo_array.sort(data_descending);
                inserted_single_probrokerinfo['recent_asign_productinfo'] = recent_register_productinfo[0]['prd_identity_id'];
            }
            
            console.log('관련된 전ㄴ문중개사정보 자료구조:',inserted_single_probrokerinfo);
            if(inserted_single_probrokerinfo){
                return response.json({success: true, message:'success queytss:',result:inserted_single_probrokerinfo});
            }else{
                console.log('사이드바에 +1 삽입 더 이상 할것없음::');

                connection.release();
                return response.json({success:false, message:'one mjore add failed',result:[]});
            }
            
        }else{
            console.log('사이드바에 +1 삽입 더 이상 할것없음::');

            connection.release();
            return response.json({success:false, message:'one mjore add failed',result:[]});
        }
         
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[] });
    }
});
//지도페이지 스크롤링에 따른 단지리스트 스크롤end시마다 +1개씩 불러오는 fetch api(지도사이드바 스크롤링 단지별실거래)
router.post('/nextComplex_item_sidebar',async function(request,response){
    console.log('nextComplex_item_sidebar 요청:',request.body);

    var req_body= request.body;

    const connection = await pool.getConnection(async conn => conn);
    try{
        var currentArr_val= req_body.currentArr_val;
        var zido_level = req_body.level;
        var origin_y = parseFloat(req_body.lat);
        var origin_x = parseFloat(req_body.lng);
        var screen_width = req_body.screen_width;
        var screen_height =req_body.screen_height;
        var startx = req_body.startx;
        var starty = req_body.starty;
        var endx = req_body.endx;
        var endy = req_body.endy;

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
         
        var level_zido_startx= origin_x - x_distance;
        var level_zido_endx= origin_x + x_distance; 
        var level_zido_starty= origin_y - y_distance;
        var level_zido_endy= origin_y + y_distance;
        console.log('=======지도 중심origin x,y좌표 및 주변 직사각형 좌표 범위area:',zido_level,origin_x,origin_y,x_distance,y_distance);
        console.log('=======startx~endx, starty~endy',level_zido_startx,level_zido_endx,level_zido_starty,level_zido_endy);

        //console.log('기존 사이드 바데이터:',currentArr_val,JSON.parse(currentArr_val));
        currentArr_val = JSON.parse(currentArr_val);
        for(let j=0; j<currentArr_val.length; j++){
            console.log('prev side bar datassss:',currentArr_val[j].complex_id);
        }
    
        //해당 범위의 startx~endx,starty~endy 모두 만족하는 범위들 구한다. 해당 위치조건만족하면서 단지별실거래정보가 있는 단지들조건만 구한다.
        //var [all_complex_data] = await connection.query("select * from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.x>=? and c.x<=? and c.y>=? and c.y<=? group by c.complex_id",[level_zido_startx,level_zido_endx,level_zido_starty,level_zido_endy]);
        //var [all_complex_data] = await connection.query("select * from complex cpx join (select * from (select type,deposit,contract_ym,contract_dt,complex_id,floor,monthly_rent from actual_transaction_price where complex_id is not null order by contract_ym desc,contract_dt desc) atp1 group by atp1.complex_id) atp2 on cpx.complex_id=atp2.complex_id where cpx.y >=? and cpx.y<=? and cpx.x>=? and cpx.x<=?",[level_zido_starty,level_zido_endy,level_zido_startx,level_zido_endx]);
        var [all_complex_data] = await connection.query("select * from complex cpx join (select * from (select type,deposit,contract_ym,contract_dt,complex_id,floor,monthly_rent from actual_transaction_price where complex_id is not null order by contract_ym desc,contract_dt desc limit 18446744073709551615) atp1 group by atp1.complex_id) atp2 on cpx.complex_id=atp2.complex_id where cpx.y >=? and cpx.y<=? and cpx.x>=? and cpx.x<=?",[starty,endy,startx,endx]);

        console.log('all complex brokera data match:');
        let all_complex_str='';
        for(let j=0; j<all_complex_data.length; j++){
            all_complex_str += (all_complex_data[j].complex_id)+',';
        }
        console.log(all_complex_str);    

        var inserted_single_item='';
        for(let s=0; s<all_complex_data.length; s++){
            let complex_id = all_complex_data[s].complex_id;//위치조건+단지별실거래존재 하는 단지들id값만 확인조회.
            let is_exists=false;//해당 넣으려는 값이 기존사이드바 단지별id데이터에 있던건인지 없던건지 여부 조회.
            for(let ii=0; ii<currentArr_val.length; ii++){
                let now_sidebar_complexitem = currentArr_val[ii]['complex_id'];
                if(complex_id == now_sidebar_complexitem){
                    //이미 ㅣ있는 항목에 대해선 insert하지 않고 건너뜀
                    is_exists=true;//발견되었으면 break처리
                    break;
                }
            }
            if(!is_exists){
                //currentArr_val.push(all_...)
                //존재하지않는 삽입이 가능한 단지id정보값을 구했다. complelxid값은 여기서 존재하지않은 삽입가능한 단지id값.
                /*let [recent_date_cond]=await connection.query("select max(concat(apt.contract_ym,if(apt.contract_dt < 10 , concat('0',apt.contract_dt) , apt.contract_dt)))as recent_date from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=?",[complex_id]);//각 단지번호에 해당값중에서 가장 최근의높은값.
                    
                let recent_cond=recent_date_cond[0]['recent_date'];
                console.log('single insertoneitem 단지complexid값 및 최근거래날짜값:',complex_id,recent_date_cond);

                let [recent_transaction_info ] = await connection.query("select * from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=? and concat(apt.contract_ym,if(apt.contract_dt<10 , concat('0',apt.contract_dt), apt.contract_dt))=?",[complex_id,recent_cond]);
                console.log("단지 최근 거래내역 정보값::",recent_transaction_info[0]);
                */
                inserted_single_item = all_complex_data[s];//삽입이 가능한 단지별 아이템 싱글요소+조인정보(최근거래정보)
                break;
            }
        }

        connection.release();

        if(inserted_single_item){
            console.log('사이드바에 +1 삽입이 가능한 요소::',inserted_single_item.complex_id);

            return response.json({success: true, message:'success queytss:',result:inserted_single_item});
        }else{
            console.log('사이드바에 +1 삽입 더 이상 할것없음::');

            return response.json({success:false, message:'one mjore add failed',result:[]});
        }

    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[] });
    }
});
//지도페이지 스크롤링에 따른 전속매물요소리스트 스크롤end시마다 +1개씩 불러오는 fetch api(지도사이드바 전속매물스크롤링)
router.post('/nextExclusive_item_sidebar',async function(request,response){
    console.log('nextExclusive_item_sidebar 요청:',request.body);

    var req_body= request.body;

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

    var {
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
        totalHousehold, // 총세대수 아파트단지
        prdUsage, // 용도 오피스텔
        roomStructure, // 방구조 오피스텔
        isDouble, // 복층 여부 
        isPet, // 반려동물 여부

        origin_x,
        origin_y,
        screen_width,
        screen_height,
        zido_level,
        startx,
        endx,
        starty,
        endy,
        prd_type,
        mem_id
        
    }=req_body; 

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
        
        //if(isexclusive){
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
                queryWhere += `(p.prd_sel_type = "월세" and p.prd_price between ${monthPriceMin/10000} and ${monthPriceMax/10000})`
                queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_price between ${monthPriceMin/10000} and ${monthPriceMax/10000})`
            }else if(monthPriceMin){
                queryWhere += `(p.prd_sel_type = "월세" and p.prd_price >= ${monthPriceMin/10000})`
                queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_price >= ${monthPriceMin/10000})`
            }else if(monthPriceMax){
                queryWhere += ` (p.prd_sel_type = "월세" and p.prd_price <= ${monthPriceMax/10000})`
                queryWhereMap += ` (p.prd_sel_type = "월세" and p.prd_price <= ${monthPriceMax/10000})`
            }else{
                queryWhere += `(p.prd_sel_type = "월세")`
                queryWhereMap += `(p.prd_sel_type = "월세")`
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
    // 관리비
    /*if(isManagement == 1){*/
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
    //}

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
        queryWhere +=` and p.room_structure REGEXP  '${text}'`;
        queryWhereMap +=` and p.room_structure REGEXP  '${text}'`;
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

    queryWhere += ` and p.prd_latitude >= ${starty} and p.prd_latitude <= ${endy} and p.prd_longitude >= ${startx} and p.prd_longitude <= ${endx} and (t.txn_status='거래개시' or t.txn_status='거래완료동의요청' or t.txn_status='거래완료동의요청거절') and (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))`;
    queryWhere += " group by p.prd_identity_id";
    
    console.log('nextitem exuclsivesss QUERYWHERESSS:',queryWhere);
    //필터 조건 + 매물타입 조건 등 조건문분기처리. 해당 조건이면서도 ,해당 클릭한 그 조건에있던 매물의 좌표x,y값인 조건만족(사실상의 그 한대상) 매물정보리턴.ends

    const connection = await pool.getConnection(async conn => conn);

    try{
        var currentArr_val= req_body.currentArr_val;
        //console.log('===>>기존 currentArr 사이드바 매물데이터::',currentArr_val,JSON.parse(currentArr_val));
        
        currentArr_val = JSON.parse(currentArr_val);
        for(let s=0; s<currentArr_val.length; s++){
            //let item=currentArr_val[s].prd_identity_id;
            let item=currentArr_val[s].prd_id;
            console.log('rev id:'+item+',');
        }

        if(prd_type == '아파트' || prd_type=='오피스텔'){
           
            var [all_exclusive_data] = await connection.query(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}')
             as isLike, p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type,
              p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,
              date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status 
              as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id,p.prd_id as prd_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost,p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure,p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type, bd.dong_name as dong_name, bd.grd_floor as grd_floor,c.complex_name as complex_name,c.dong_cnt as dong_cnt,c.approval_date as approval_date,c.total_parking_cnt as total_parking_cnt, c.household_cnt as household_cnt FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id join buildings bd on p.bld_id=bd.bld_id join complex c on bd.complex_id=c.complex_id` + queryWhere);
            console.log(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike, p.company_id as company_id,
            p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.prd_month_price
             as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') 
             as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id,p.prd_id as prd_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost,p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure,p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type, bd.dong_name as dong_name, bd.grd_floor as grd_floor,c.complex_name as complex_name,c.dong_cnt as dong_cnt,c.approval_date as approval_date,c.total_parking_cnt as total_parking_cnt, c.household_cnt as household_cnt FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id join buildings bd on p.bld_id=bd.bld_id join complex c on bd.complex_id=c.complex_id` + queryWhere);

        }else{
            //상가나 사무실의 경우는 dongid,complexid등이 없기에 compelx,buidlings 조인쿼리까진 하지 않는다.
            
            var [all_exclusive_data] = await connection.query(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}')
             as isLike,  p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type,
              p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id,p.prd_id as prd_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost, p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure, p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id` + queryWhere);
            console.log(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike,  p.company_id as company_id,
            p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id,p.prd_id as prd_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost, p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure, p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id` + queryWhere);

        }//관련 만족 데이터들..해당 현재 화면상 + 핉어조건 등 보여지는 모든 데이터들을 가져온다.

        //console.log('현재 화면+필터조건 기준 관련 모든 데이터:',all_exclusive_data);
        console.log('현재 화면,필터 조건 기준 관련 모든데이터:');
        var all_data_str='';
        for(let ss=0; ss<all_exclusive_data.length; ss++){
            all_data_str += (all_exclusive_data[ss].prd_id)+',';
        }
        console.log('all data strss:',all_data_str);

        var inserted_single_item='';
        for(let s=0; s<all_exclusive_data.length; s++){
            let prd_identity_id=all_exclusive_data[s].prd_id;
            let is_exists=false;//해당 넣으려는 prdirieintiyi값이 기존 사이드바 매물데이터상에 존재하고있던건지 여부.
            for(let ii=0; ii<currentArr_val.length; ii++){
                let now_sidebar_productitem=currentArr_val[ii]['prd_id'];
                if(prd_identity_id == now_sidebar_productitem){
                    //이미 있는 항목에 대해선 insert하지 않고 건너뜀
                    is_exists=true;//발견되었으면 break처리.
                    break;
                }
            }
            if(!is_exists){
               // currentArr_val.push(all_exclusive_data[s]);//넣는것이 가능한 요소는 넣는다.
               inserted_single_item= all_exclusive_data[s];
               break;//넣는것이 가능한 요소가 나왔다면 외부반복도 멈춤
            }
        }

        connection.release();

        if(inserted_single_item!=''){
            console.log('사이드바에 +1 삽입이 가능한 요소 :',inserted_single_item.prd_id);

            return response.json({success:true,message:'sucecess queryss', result: inserted_single_item });
        }else{
            console.log('사이드바에 +1 삽입 더이상ㅎ할것없음::');

            return response.json({success:false, message:'one more add failed',result:[]})
        }
        
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[] });
    }
});
router.get('/getXY',async function(request,response){
    console.log('getxy테스트:::');

    var query=request.body.query;
    console.log('검색 도로명주소::',query);
    var jibun='서울특별시 강남구 개포동 1238-1번지';
    var road=' 서울특별시 강남구 개포로 204';

    console.log('ENCODECURL::',encodeURI(road),request_api);
    try{
        const headers={'Authorization' : "KakaoAK "+"ac08f2d6adfd16a501ad517d7a2fab3f"};
        const url = "https://dapi.kakao.com/v2/local/search/address.json?&query=" + encodeURI(road);
        let api_response = await request_api.get({
            uri:url,
            headers: headers
        });
        console.log('++++>>>>response::',api_response);
        api_response = JSON.parse(api_response);
        console.log('resoonseodoicuemtns::',api_response.documents);
        api_response_final = api_response.documents[0];
        
        return {x : api_response_final.x, y:api_response_final.y}
    }catch(err){
        console.log('errrrrr::',err);
    }
});
router.post('/getFloor_xy',async function(request,response){
    console.log('get floor xy>>>:');

    var floorid=request.body.floorid_val;

    const connection = await pool.getConnection(async conn => conn);

    try{       
        var [floorsearch_result] = await connection.query("select addr_road, addr_jibun from floor where flr_id=?",[floorid]);
        console.log('검색타입 및 해당 테이블 검색결과',floorsearch_result);

        var addr_road=floorsearch_result[0]['addr_road'];
        connection.release();
        //해당 도로명 주소에 대해서 xy로 리턴하는 api구현. 핻해당 클릭한 임의 건물의 flrid층에 대한 그 물질에 대해서 도로명주소공유되는것 도로명주소에 대한 경도위도 반환.
        const api_headers={'Authorization' : 'KakaoAK '+"ac08f2d6adfd16a501ad517d7a2fab3f"};
        const api_url="https://dapi.kakao.com/v2/local/search/address.json?&query=" + encodeURI(addr_road);

        let api_response = await request_api.get({
            uri:api_url,
            headers: api_headers
        });
        console.log('++++>>>>response::',api_response);
        api_response = JSON.parse(api_response);
        console.log('resoonseodoicuemtns::',api_response.documents);
        api_response_final = api_response.documents[0];

        return response.json({success:true,message:'sucecess queryss',result: {x: api_response_final.x, y:api_response_final.y} });

    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[], match_matterial: [] });
    }
});
//지도상에 마커 한개 클릭시에(지도의 레벨이 높지 않아 한 화면상 표현되는 지도의 랜더링마커수 120개이하인경우에 핸들링등록된 클릭마커좌표에 해당하는 매물정보 리턴)
router.post('/clickMarker_match_infoget',async function(request,response){
    console.log('get clickMarker_match_infoget >>>:',request.body);

    //필터관련 정보 처리.
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

    var queryWhere = "";
    var queryWhereMap = "";
    var req_body=request.body;  
    var {
        prdType,//건물타입
        prdSelType,//거래타입
        tradePriceMin,//매매최소
        tradePriceMax,//매매최대
        jeonsePriceMin,//전세최소
        jeonsePriceMax,//전세최대
        monthPriceMin,//월세최소
        monthPriceMax,//월세최대
        isToilet,//화장실유무
        supplySpaceMin,//공급면적최소
        supplySpaceMax,//공급면적최대
        floor,//층수?floorint
        roomCount,//방수
        bathCount,//욕실수
        isParking,//주차 가능여부
        isManagement,//관리비여부

        managementPriceMin,//관리비최소
        managementPriceMax,//관리비최대

        acceptUseDate,//사용승인일
        totalHousehold,//총세대수 아파트단지
        prdUsage,//용도 오피스텔
        roomStructure,//방구조 오피스텔
        isDouble,//복층여부
        isPet,//반려동물여부

        origin_x,//쓰이지않음
        origin_y,//쓰이지않음
        screen_width,//화면크기
        screen_height,//화면크기
        zido_level,
        prd_type,
        isexclusive,
        isprobroker,
        isblock,
        mem_id
    }=req_body;

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
                    queryWhere += `(p.prd_sel_type = "월세" and p.prd_price between ${monthPriceMin/10000} and ${monthPriceMax/10000})`
                    queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_price between ${monthPriceMin/10000} and ${monthPriceMax/10000})`
                }else if(monthPriceMin){
                    queryWhere += `(p.prd_sel_type = "월세" and p.prd_price >= ${monthPriceMin/10000})`
                    queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_price >= ${monthPriceMin/10000})`
                }else if(monthPriceMax){
                    queryWhere += ` (p.prd_sel_type = "월세" and p.prd_price <= ${monthPriceMax/10000})`
                    queryWhereMap += ` (p.prd_sel_type = "월세" and p.prd_price <= ${monthPriceMax/10000})`
                }else{
                    queryWhere += `(p.prd_sel_type = "월세")`
                    queryWhereMap += `(p.prd_sel_type = "월세")`
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

        // 관리비
        /*if(isManagement == 1){*/
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
        //}

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
            queryWhere +=` and p.room_structure REGEXP  '${text}'`;
            queryWhereMap +=` and p.room_structure REGEXP  '${text}'`;
        }
        // 사용승인일
        if(acceptUseDate && (prdType =='오피스텔' || prdType=='아파트')){
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

    }else{
        queryWhere = null;
        queryWhereMap = null;
    }

    
    //필터 조건 + 매물타입 조건 등 조건문분기처리. 해당 조건이면서도 ,해당 클릭한 그 조건에있던 매물의 좌표x,y값인 조건만족(사실상의 그 한대상) 매물정보리턴.ends
    const connection = await pool.getConnection(async conn => conn);

    try{   
        //전문중개사,단지별실거래는 queryWhere null조건 붙습니다.    
        var lat= req_body.lat.toFixed(12);//소수점 12자리까지.
        var lng= req_body.lng.toFixed(12);
        var click_type =req_body.click_type;//클릭한 마커의 타입(전문중개사마커?,전속매물마커?,단지별실거래마커?)
        //var id=req_body.id;//company_id,prd_id or prdidnentityid , compellx_id추가검색
        console.log('필터 조건쿼리,매물타입(매물):',queryWhere);//사이드바 관련 매칭 매물데이터 불러온다.
        console.log('request_pos::',lat,lng);

        var match_element_list=[];var match_cnt=0;

        if(click_type == 'probroker'){
            var [all_probroker_data] = await connection.query("select * from company2 where is_pro=1");
            for(let a=0; a<all_probroker_data.length; a++){
                let data_item_x=parseFloat(all_probroker_data[a].x);//나온 소수점의 정밀도 12으로 한다.이리할시 딱 한개가 아니라 그 연관된 자리수의 여러개n개 나올가능성도 있음.
                let data_item_y=parseFloat(all_probroker_data[a].y);//해당 전문중개사company2 조건에 맞는 위치조건에 맞는 것조회.
                data_item_x= data_item_x.toFixed(12);
                data_item_y= data_item_y.toFixed(12);
                if(data_item_x == lng && data_item_y == lat){
                    //해당 각도좌표축 소수점 12자리로 확장(범위키움)이면서 동시에 해당 comapnyid에 해당하는 전문중개사 구하기.
                    console.log('match_data:',all_probroker_data[a]);
                    
                    let companyid_local=all_probroker_data[a].company_id;
                   

                    let [probroker_permission_info] = await connection.query("select prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from pro_realtor_permission prp left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where company_id=? and permission_state='승인' order by prp_id desc",[companyid_local]);//전문중개사 전문종목 신청내역중 가장 최근 승인된것 가장 최근 승인된 정보 전문종목 정보.승인으로 처리시에 관리자에서 로직적으로 관련 comapny2는 프로상태로 하고, 미승인이나 취소처리시엔 ispro값을 해제한다.
                    let [probroker_asign_productinfo] = await connection.query("select distinct prd_id from product where company_id=?",[companyid_local]);//해당 comapnyid에 관련된 모든 매물리스트 가져온다. 구별된 prd_identity매물리스트 내역들.
                    console.log('전문중개사companyid:',companyid_local);
                    console.log('해당 관련 전문중개사 전문종목 최근승인정보:',probroker_permission_info);
                    console.log('해당 전문중개사가 수임하고있는 관련 매물들prd_identitiy_id리스트:',probroker_asign_productinfo);

                    let matched_productinfo_array=[];//임의 전문중개사가 수임한 매물들 정보 저장 임시저장.
                    for(let pp=0; pp<probroker_asign_productinfo.length; pp++){
                        let prd_identity_id=probroker_asign_productinfo[pp]['prd_id'];//id값.
                        let [product_transaction_query] = await connection.query("select * from product p where p.prd_id=? and  prd_status='거래개시' or prd_status='거래완료동의요청' or prd_status='거래완료동의요청거절') and (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))",[prd_identity_id]);//관련 매물&거래정보 조인내역들중 가장 첫 row가 의미하는것은 각 매물별 origin 매물의 최근 수정등 자체근본 정보를 의미하며,매칭되어 나타나는 매 동일한 공통된 transaction값이 곧 매물의 최근 상태값이다.그걸 기준으로 각 매물별 상태값 측정.
                        if(product_transaction_query&&product_transaction_query[0]){
                            matched_productinfo_array.push(product_transaction_query[0]);//거래개시 매물들만 노출.
                        }
                    }
                    if(matched_productinfo_array.length>=1){
                        match_element_list[match_cnt] ={};
                        match_element_list[match_cnt]['company_id'] = companyid_local;
                        match_element_list[match_cnt]['probroker_info'] = all_probroker_data[a];

                        //console.log('각 전문중개사별 수임 매물리스트정보transciton::',matched_productinfo_array);
                        if(probroker_permission_info[0]){
                            match_element_list[match_cnt]['permission_info'] = probroker_permission_info[0];
                        }                   
                        match_element_list[match_cnt]['asign_productinfo'] = matched_productinfo_array;
                        
                        let recent_register_productinfo;

                        recent_register_productinfo = matched_productinfo_array.sort(data_descending);
                        match_element_list[match_cnt]['recent_asign_productinfo'] = recent_register_productinfo[0]['prd_id'];
                        match_cnt++;
                    }
                  
                }
            }
           // var [match_element_list] = await connection.query("select * from company where y=? and x=? and ",[lat, lng]);//해당 지점의 전문중개사들 구한다.
           //console.log('match_probroker_elementlist:',match_element_list);//해당 범위or값에 해당하는 전문중개사 n개구함.그 해당 값좌표축과 동일했던.녀석들 모두 나올것임. 동일하지 않아도 근사값으로 같았던 녀석들도 나올 가능성 있음. 정확도 증가하는 알고리즘 적용 추후필요.
        }else if(click_type == 'block'){
            var [all_complex_data] = await connection.query("select * from complex cpx join (select * from (select type,deposit,contract_ym,contract_dt,complex_id,floor,monthly_rent from actual_transaction_price where complex_id is not null order by contract_ym desc,contract_dt desc limit 18446744073709551615) atp1 group by atp1.complex_id) atp2 on cpx.complex_id=atp2.complex_id");//단지별 실거래가 있는 전체 데이터 전체중에서 일단불러온다.(최근거래내역)
           
            for(let a=0; a<all_complex_data.length; a++){
                let data_item_x=parseFloat(all_complex_data[a].x);//나온 소수점의 정밀도 12으로 한다.이리할시 딱 한개가 아니라 그 연관된 자리수의 여러개n개 나올가능성도 있음.
                let data_item_y=parseFloat(all_complex_data[a].y);
                data_item_x= data_item_x.toFixed(12);
                data_item_y= data_item_y.toFixed(12);

                if(data_item_x == lng && data_item_y == lat){
                    //해당 각도좌표축 소수점 12자리로 확장(범위키움)이면서 동시에 해당 complex단지 구하기.
                    console.log('match_data:',all_complex_data[a]);
                    /*let complexid_local=all_complex_data[a]['complex_id'];

                    let [recent_date_cond]=await connection.query("select max(concat(apt.contract_ym,if(apt.contract_dt < 10 , concat('0',apt.contract_dt) , apt.contract_dt)))as recent_date from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=?",[complexid_local]);//각 단지번호에 해당값중에서 가장 최근의높은값.
                    
                    let recent_cond=recent_date_cond[0]['recent_date'];
                    console.log('클릭마커 매칭 단지complexid값 및 최근거래날짜값:',complexid_local,recent_date_cond);

                    let [recent_transaction_info ] = await connection.query("select * from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=? and concat(apt.contract_ym,if(apt.contract_dt<10 , concat('0',apt.contract_dt), apt.contract_dt))=?",[complexid_local,recent_cond]);
                    console.log("단지별 최근 거래내역 정보값::",recent_transaction_info[0]);
                    */
                    match_element_list[match_cnt] = all_complex_data[a];
                
                    match_cnt++;                                     
                }
            }

           // var [match_element_list] = await connection.query("select * from complex where y=? and x=?",[lat, lng]);//해당 지점의 단지들 구한다.
          // console.log('match_complex_elementlist:',match_element_list);//해당 범위or값에 해당하는 전문중개사 n개구함.그 해당 값좌표축과 동일했던.녀석들 모두 나올것임.

        }else if(click_type == 'exclusive'){

            queryWhere += ` and (prd_status='거래개시' or prd_status='거래완료동의요청' or prd_status='거래완료동의요청거절') and ( p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))`;
            queryWhere += " group by p.prd_id";
            
            console.log('nextitem exuclsivesss QUERYWHERESSS:',queryWhere);
            
            if(prd_type == '아파트' || prd_type=='오피스텔'){

               
                var [all_exclusive_data] = await connection.query(`SELECT (select count(*) from likes li where p.prd_id = li.prd_identity_id and li.mem_id='${mem_id}')
                 as isLike, p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type,
                  p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,
                  date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost,p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure,p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, prd_status as txn_status, bd.dong_name as dong_name, bd.grd_floor as grd_floor,c.complex_name as complex_name,c.dong_cnt as dong_cnt,c.approval_date as approval_date,c.total_parking_cnt as total_parking_cnt, c.household_cnt as household_cnt FROM product p join buildings bd on p.bld_id=bd.bld_id join complex c on bd.complex_id=c.complex_id` + queryWhere);

                console.log(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike, p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as 
                prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.
                    exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost,p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure,p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, prd_status as txn_status, bd.dong_name as dong_name, bd.grd_floor as grd_floor,c.complex_name as complex_name,c.dong_cnt as dong_cnt,c.approval_date as approval_date,c.total_parking_cnt as total_parking_cnt, c.household_cnt as household_cnt FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id join buildings bd on p.bld_id=bd.bld_id join complex c on bd.complex_id=c.complex_id` + queryWhere);

            }else{
                //상가나 사무실의 경우는 dongid,complexid등이 없기에 compelx,buidlings 조인쿼리까진 하지 않는다.
               
                var [all_exclusive_data] = await connection.query(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}
                ') as isLike,  p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost, p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure, p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, prd_status as txn_status FROM product p` + queryWhere);
                console.log(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike,  p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.
                prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost, p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure, p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id` + queryWhere)
            }
            
            for(let a=0; a<all_exclusive_data.length; a++){
                let data_item_x=parseFloat(all_exclusive_data[a].prd_longitude);//나온 소수점의 정밀도 12으로 한다.이리할시 딱 한개가 아니라 그 연관된 자리수의 여러개n개 나올가능성도 있음.
                let data_item_y=parseFloat(all_exclusive_data[a].prd_latitude);
                data_item_x= data_item_x.toFixed(12);
                data_item_y= data_item_y.toFixed(12);//나온 전체 관련 매물리스트(현재 지도위치,필터조건위치에 따른 관련 모든 매물리스중 클릭마커,클러스터 좌표위치에 해당하는것들 조건만 가져옴.)

                console.log('request_pos::',lng,lat);
                console.log('dataitemx,y:',data_item_x,data_item_y,typeof(data_item_x),typeof(data_item_y),all_exclusive_data[a].prd_identity_id);
                if(data_item_x == lng && data_item_y == lat){
                    //해당 각도좌표축 소수점 12자리로 확장(범위키움)이면서 동시에 해당 x,y위치값에 해당하는 매물들(필터,매물타입 조건 만족하는 전체리스트groupid oriogin리스트들만)중에서 해당 클릭위치에 해당하는 x,y조건을 만족하는 매물요소(들)리턴한다.
                    console.log('match_data:',all_exclusive_data[a].prd_identity_id,data_item_x,data_item_y);
                    match_element_list[match_cnt] = all_exclusive_data[a];
                   
                    match_cnt++;
                   
                }
            }

           // var [match_element_list] = await connection.query("select * from product where y=? and x=?",[lat, lng]);//해당 지점의 단지들 구한다.
           //console.log('match_exclusive_elementlist:',match_element_list);//해당 범위or값에 해당하는 전문중개사 n개구함.그 해당 값좌표축과 동일했던.녀석들 모두 나올것임.
        }

        console.log('검색타입 및 해당 테이블 검색결과',click_type, match_element_list);
        connection.release();

        return response.json({success:true,message:'sucecess queryss',result: match_element_list });

    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[] });
    }
});
//클릭한 클러스터(전속매물,전문중개사,단지별실거래 클러스터)에 해당하는 소속된 마커그룹집단들별 각 x,y좌표에 해당하는 요소들 불러온다.전속매물클러스터의 경우 조건부가 추가되야한다. 해당 필터조건에 나와있던 마커클러스터집단 n이 있고, 그 n을 클릭했기에 그 필터조건,매물조건이 그대로 유지되면서 그 조건이면서 + 해당 클릭한 n집단의 좌표들에 모두 매칭되는 교집합조건처리. 필터,매물조건 빠지고 n집단의 좌표들의 위치x,y정보들만으로 쿼리시에 매물유형별, 또는 그 위치에 있던 다른필터조건의 대상들도 나올수있기에 문제에 소지가있음.데이터 표현 오류 발생가능성.
router.post('/clickCluster_match_infoget',async function(request,response){
    console.log('get clickCluster_match_infoget >>>:',request.body);

    //필터관련 정보 처리.
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

    var queryWhere = "";
    var queryWhereMap = "";

    var req_body=request.body;  
    var {
        prdType,//건물타입
        prdSelType,//거래타입
        tradePriceMin,//매매최소
        tradePriceMax,//매매최대
        jeonsePriceMin,//전세최소
        jeonsePriceMax,//전세최대
        monthPriceMin,//월세최소
        monthPriceMax,//월세최대
        isToilet,//화장실유무
        supplySpaceMin,//공급면적최소
        supplySpaceMax,//공급면적최대
        floor,//층수?floorint
        roomCount,//방수
        bathCount,//욕실수
        isParking,//주차 가능여부
        isManagement,//관리비여부

        managementPriceMin,//관리비최소
        managementPriceMax,//관리비최대

        acceptUseDate,//사용승인일
        totalHousehold,//총세대수 아파트단지
        prdUsage,//용도 오피스텔
        roomStructure,//방구조 오피스텔
        isDouble,//복층여부
        isPet,//반려동물여부

        origin_x,//쓰이지않음
        origin_y,//쓰이지않음
        screen_width,//화면크기
        screen_height,//화면크기
        zido_level,
        prd_type,
        isexclusive,
        isprobroker,
        isblock,
        mem_id
    }=req_body;

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
                    queryWhere += `(p.prd_sel_type = "월세" and p.prd_price between ${monthPriceMin/10000} and ${monthPriceMax/10000})`
                    queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_price between ${monthPriceMin/10000} and ${monthPriceMax/10000})`
                }else if(monthPriceMin){
                    queryWhere += `(p.prd_sel_type = "월세" and p.prd_price >= ${monthPriceMin/10000})`
                    queryWhereMap += `(p.prd_sel_type = "월세" and p.prd_price >= ${monthPriceMin/10000})`
                }else if(monthPriceMax){
                    queryWhere += ` (p.prd_sel_type = "월세" and p.prd_price <= ${monthPriceMax/10000})`
                    queryWhereMap += ` (p.prd_sel_type = "월세" and p.prd_price <= ${monthPriceMax/10000})`
                }else{
                    queryWhere += `(p.prd_sel_type = "월세")`
                    queryWhereMap += `(p.prd_sel_type = "월세")`
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
        // 관리비
        /*if(isManagement == 1){*/
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
        //}

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
            queryWhere +=` and p.room_structure REGEXP  '${text}'`;
            queryWhereMap +=` and p.room_structure REGEXP  '${text}'`;
        }
        // 사용승인일
        if(acceptUseDate && (prdType =='오피스텔' || prdType=='아파트')){
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

    }else{
        queryWhere = null;
        queryWhereMap = null;
    }
    //필터 조건 + 매물타입 조건 등 조건문분기처리. 해당 조건이면서도 ,해당 클릭한 그 조건에있던 매물의 좌표x,y값인 조건만족(사실상의 그 한대상) 매물정보리턴.ends

    const connection = await pool.getConnection(async conn => conn);

    var markerlist_latlng = request.body.markerlist_latlng;
    var click_type= request.body.click_type;
    console.log('markerlist_latlng get:',markerlist_latlng);

    try{       
        
        //var id=req_body.id;//company_id,prd_id or prdidnentityid , compellx_id추가검색

        var match_element_list=[];var match_cnt=0;
        var match_product_idlist=[];//더미매물이라면 prd_id를 넣고,표준매물이면 prd-idnenitityid를 넣는다. 특정좌표에 대해서 매칭된 매물prdid에대해서저장.그 특정좌표들끼리 서로 다르다면 매치오디는 prdid들도 다 다를것이나, 그 좌표들끼리자체가 같은 상황이라면 중복데이터 발생.이런경우 id값 저장해둠으로써 이미 저장된것여부 검사하여 중복방지.

        if(click_type == 'probroker'){

            var [all_probroker_data] = await connection.query("select * from company2 where is_pro=1");

            for(let outer=0; outer<markerlist_latlng.length; outer++){
                let marker_lat= markerlist_latlng[outer]['Ma'].toFixed(12);//소수점 12자리까지.
                var marker_lng= markerlist_latlng[outer]['La'].toFixed(12);

                for(let a=0; a<all_probroker_data.length; a++){
                    let data_item_x=parseFloat(all_probroker_data[a].x);//나온 소수점의 정밀도 12으로 한다.이리할시 딱 한개가 아니라 그 연관된 자리수의 여러개n개 나올가능성도 있음.
                    let data_item_y=parseFloat(all_probroker_data[a].y);
                    data_item_x= data_item_x.toFixed(12);
                    data_item_y= data_item_y.toFixed(12);

                    if(data_item_x == marker_lng && data_item_y == marker_lat){
                        //해당 각도좌표축 소수점 12자리로 확장(범위키움)
                        console.log('match_data:',all_probroker_data[a]);
                        
                        let companyid_local= all_probroker_data[a].company_id;//관련 매칭된 전문중개사companyid값.
                        
                        let [probroker_permission_info] = await connection.query("select prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from pro_realtor_permission prp left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where company_id=? and permission_state='승인' order by prp_id desc",[companyid_local]);//전문중개사 전문종목 신청내역중 가장 최근 승인된것 가장 최근 승인된 정보 전문종목 정보.승인으로 처리시에 관리자에서 로직적으로 관련 comapny2는 프로상태로 하고, 미승인이나 취소처리시엔 ispro값을 해제한다.
                        let [probroker_asign_productinfo] = await connection.query("select distinct prd_identity_id from product where company_id=?",[companyid_local]);//해당 comapnyid에 관련된 모든 매물리스트 가져온다. 구별된 prd_identity매물리스트 내역들.
                        console.log('전문중개사companyid:',companyid_local);
                        console.log('해당 관련 전문중개사 전문종목 최근승인정보:',probroker_permission_info);
                        console.log('해당 전문중개사가 수임하고있는 관련 매물들prd_identitiy_id리스트:',probroker_asign_productinfo);

                        let matched_productinfo_array=[];//임의 전문중개사가 수임한 매물들 정보 저장 임시저장.
                        for(let pp=0; pp<probroker_asign_productinfo.length; pp++){
                            let prd_identity_id=probroker_asign_productinfo[pp]['prd_identity_id'];//id값.
                            let [product_transaction_query] = await connection.query("select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where p.prd_identity_id=? and (t.txn_status='거래개시' or t.txn_status='거래완료동의요청' or t.txn_status='거래완료동의요청거절') and ( p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))",[prd_identity_id]);//관련 매물&거래정보 조인내역들중 가장 첫 row가 의미하는것은 각 매물별 origin 매물의 최근 수정등 자체근본 정보를 의미하며,매칭되어 나타나는 매 동일한 공통된 transaction값이 곧 매물의 최근 상태값이다.그걸 기준으로 각 매물별 상태값 측정.
                            if(product_transaction_query&&product_transaction_query[0]){
                                matched_productinfo_array.push(product_transaction_query[0]);//거래개시 매물들만 노출.
                            }
                        }
                        if(matched_productinfo_array.length>=1){
                            match_element_list[match_cnt] = {};
                            match_element_list[match_cnt]['company_id'] = companyid_local;
                            match_element_list[match_cnt]['probroker_info'] = all_probroker_data[a];

                             //console.log('각 전문중개사별 수임 매물리스트정보transciton::',matched_productinfo_array);
                            if(probroker_permission_info[0]){
                                match_element_list[match_cnt]['permission_info'] = probroker_permission_info[0];
                            }
                        
                            match_element_list[match_cnt]['asign_productinfo'] = matched_productinfo_array;
                            let recent_register_productinfo;

                            recent_register_productinfo = matched_productinfo_array.sort(data_descending);
                            match_element_list[match_cnt]['recent_asign_productinfo'] = recent_register_productinfo[0]['prd_identity_id'];
                            match_cnt++;
                        }
                       
                    }
                }
            }
        }
        
        else if(click_type == 'block'){

            var [all_complex_data] = await connection.query("select * from complex cpx join (select * from (select type,deposit,contract_ym,contract_dt,complex_id,floor,monthly_rent from actual_transaction_price where complex_id is not null order by contract_ym desc,contract_dt desc limit 18446744073709551615) atp1 group by atp1.complex_id) atp2 on cpx.complex_id=atp2.complex_id");

            for(let outer=0; outer<markerlist_latlng.length; outer++){
                let marker_lat= markerlist_latlng[outer]['Ma'].toFixed(12);
                let marker_lng= markerlist_latlng[outer]['La'].toFixed(12);

                for(let a=0; a<all_complex_data.length; a++){
                    let data_item_x=parseFloat(all_complex_data[a].x);//나온 소수점의 정밀도 12으로 한다.이리할시 딱 한개가 아니라 그 연관된 자리수의 여러개n개 나올가능성도 있음.
                    let data_item_y=parseFloat(all_complex_data[a].y);
                    data_item_x= data_item_x.toFixed(12);
                    data_item_y= data_item_y.toFixed(12);
    
                    if(data_item_x == marker_lng && data_item_y == marker_lat){
                        //해당 각도좌표축 소수점 12자리로 확장(범위키움)이면서 동시에 해당 comapnyid에 해당하는 전문중개사 구하기.
                        console.log('match_data:',all_complex_data[a]);

                        //해당 매칭된 단지정보값별마다의 정보 저장.최근실거래정보랑 해서 같이 해서 저장 하여 리덕스 사이드바데이터에 저장처리 표현.
                        /*let complexid_local = all_complex_data[a]['complex_id'];

                        let [recent_date_cond]=await connection.query("select max(concat(apt.contract_ym,if(apt.contract_dt < 10 , concat('0',apt.contract_dt) , apt.contract_dt)))as recent_date from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=?",[complexid_local]);//각 단지번호에 해당값중에서 가장 최근의높은값.                    
                        let recent_cond=recent_date_cond[0]['recent_date'];
                        console.log('클릭클러스터의 매칭되는 단지별 complexid값 및 최근거래날짜값:',complexid_local,recent_date_cond);
    
                        let [recent_transaction_info ] = await connection.query("select * from complex c join area_info a on c.complex_id=a.complex_id join actual_transaction_price apt on a.area_id=apt.area_id where c.complex_id=? and concat(apt.contract_ym,if(apt.contract_dt<10 , concat('0',apt.contract_dt), apt.contract_dt))=?",[complexid_local,recent_cond]);
                        console.log("단지별 최근 거래내역 정보값::",recent_transaction_info[0]);

                        if(recent_transaction_info[0]){
                            match_element_list[match_cnt] = recent_transaction_info[0];
                       
                            match_cnt++;
                        }*/
                        match_element_list[match_cnt] = all_complex_data[a];
                        match_cnt++;
                    }
                }
            }            
        }
        
        else if(click_type == 'exclusive'){
            queryWhere += ` and (t.txn_status='거래개시' or t.txn_status='거래완료동의요청' or t.txn_status='거래완료동의요청거절') and ( p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d'))`;
            queryWhere += " group by p.prd_identity_id";

            var prdtype = request.body.prd_type;
            switch(prdtype){
                case 'apart':
                    prdtype = '아파트';
                break;
                case 'office':
                    prdtype = '사무실';
                break;
                case 'officetel':
                    prdtype = '오피스텔';
                break;
                case 'store':
                    prdtype = '상가';
                break;
            }
            //해당 매물타입이면서 필터 조건 만족되는 매물리스트 전체 구한다.

            if(prdtype == '아파트' || prdtype=='오피스텔'){
               
                var [all_exclusive_data] = await connection.query(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and 
                li.mem_id='${mem_id}') as isLike, p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.
                prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as 
                exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id,p.prd_id as prd_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost,p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure,p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type, bd.dong_name as dong_name, bd.grd_floor as grd_floor,c.complex_name as complex_name,c.dong_cnt as dong_cnt,c.approval_date as approval_date,c.total_parking_cnt as total_parking_cnt, c.household_cnt as household_cnt FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id join buildings bd on p.bld_id=bd.bld_id join complex c on bd.complex_id=c.complex_id` + queryWhere);
                console.log(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike, p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.
                prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,
                    '%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id, p.prd_id as prd_id,p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost,p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure,p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type, bd.dong_name as dong_name, bd.grd_floor as grd_floor,c.complex_name as complex_name,c.dong_cnt as dong_cnt,c.approval_date as approval_date,c.total_parking_cnt as total_parking_cnt, c.household_cnt as household_cnt FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id join buildings bd on p.bld_id=bd.bld_id join complex c on bd.complex_id=c.complex_id` + queryWhere);
            }else{
                //상가나 사무실의 경우는 dongid,complexid등이 없기에 compelx,buidlings 조인쿼리까진 하지 않는다.
                
                var [all_exclusive_data] = await connection.query(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}
                ') as isLike,  p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as 
                prd_sel_type, p.prd_price as prd_price,p.prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id, p.prd_id as prd_id,p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost, p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure, p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id` + queryWhere);
                console.log(`SELECT (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike,  p.company_id as company_id,p.mem_id as mem_id,p.prd_name as prd_name,p.prd_imgs as prd_imgs, p.prd_type as prd_type,p.prd_sel_type as prd_sel_type, p.prd_price as prd_price,p.
                prd_month_price as prd_month_price,p.prd_status prd_status,p.prd_latitude as prd_latitude,p.prd_longitude as prd_longitude,date_format(p.exclusive_start_date,'%Y-%m-%d') as exclusive_start_date, date_format(p.exclusive_end_date,'%Y-%m-%d') as exclusive_end_date,p.exclusive_status as exclusive_status,p.addr_detail as addr_detail,p.supply_area as supply_area, p.exclusive_area as exclusive_area,p.floor as floor,p.direction as direction,p.bathroom_count as bathroom_count,p.room_count as room_count,p.heat_method_type as heat_method_type,p.heat_fuel_type as heat_fuel_type,p.is_parking as is_parking,p.is_toilet as is_toilet, p.is_elevator as is_elevator,p.modify_date as modify_date,p.create_date as create_date, p.request_mem_id as request_mem_id, p.prd_create_origin as prd_create_origin, p.prd_identity_id as prd_identity_id,p.prd_id as prd_id, p.request_mem_name as request_mem_name, p.request_mem_phone as request_mem_phone, p.managecost as managecost, p.is_managecost as is_managecost, p.is_immediate_ibju as is_immediate_ibju,p.is_duplex_floor as is_duplex_floor,p.parking_option as parking_option,p.is_pet as is_pet,p.entrance as entrance,p.space_option as space_option,p.security_option as security_option, p.ibju_specifydate as ibju_specifydate, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice,p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.exclusive_pyeong as exclusive_pyeong,p.supply_pyeong as supply_pyeong,p.exclusive_periods as exclusive_periods, p.include_managecost as include_managecost, p.prd_usage as prd_usage, p.is_rightprice as is_rightprice, p.recommend_jobstore as recommend_jobstore, p.room_structure as room_structure, p.prd_option as prd_option, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as addr_jibun, p.addr_road as addr_road,p.is_current_biz_job as is_current_biz_job,p.current_biz_job as current_biz_job, p.storeoffice_building_totalfloor as storeoffice_building_totalfloor, p.dong_name as dong_name,p.floorname as floorname,p.ho_name as ho_name,p.floorint as floorint, t.txn_id as txn_id, t.txn_status as txn_status, t.txn_order_type as txn_order_type FROM product p join transaction t on p.prd_identity_id = t.prd_identity_id` + queryWhere);
            }
            //해당 필터,매물조건 전체리스트중에서 추가로 클릭하여 넘어왔던 그 위치조건들에 해당하는 매칭 매물리스트 조회.
            for(let outer=0; outer<markerlist_latlng.length; outer++){
                let marker_lat = markerlist_latlng[outer]['Ma'].toFixed(12);
                let marker_lng = markerlist_latlng[outer]['La'].toFixed(12);

                console.log('클릭클러스터 마커별 좌표값sart:',marker_lng,marker_lat);
                for(let a=0; a<all_exclusive_data.length; a++){
                    let data_item_x=parseFloat(all_exclusive_data[a].prd_longitude);//나온 소수점의 정밀도 12으로 한다.이리할시 딱 한개가 아니라 그 연관된 자리수의 여러개n개 나올가능성도 있음.
                    let data_item_y=parseFloat(all_exclusive_data[a].prd_latitude);
                    data_item_x= data_item_x.toFixed(12);
                    data_item_y= data_item_y.toFixed(12);
                    
                    console.log('클릭클러스터의 마커별 좌표값:');
                    console.log(marker_lng,marker_lat);
                    console.log('dataitemx,y:',data_item_x,data_item_y,typeof(data_item_x),typeof(data_item_y), all_exclusive_data[a].prd_identity_id);
                    if(data_item_x == marker_lng && data_item_y == marker_lat){
                        //해당 각도좌표축 소수점 12자리로 확장(범위키움)이면서 동시에 해당 comapnyid에 해당하는 전문중개사 구하기.
                        
                        let match_data= all_exclusive_data[a];
                        
                        /*if(match_data['prd_identity_id']==-1 && match_data['prd_name']=='더미매물'){
                            let match_data_prdid= match_data['prd_id'];
                            if(match_product_idlist.indexOf(match_data_prdid)>=0){
                                //해당 idlist의 prdid값이 배열내에서 존재하고있는지 여부. 이미 존재하고있다면 넣지 않음.
                            }else if(match_product_idlist.indexOf(match_data_prdid)<0){
                                //존재하고있지 않은 경우에만 id를 넣음. 데이터를 넣음.
                                match_product_idlist[match_cnt] = match_data_prdid;
                                match_element_list[match_cnt] = match_data;

                                console.log('match_data:',match_data,match_data_prdid);
                            }
                        }*/
                        
                        let match_data_prdid= match_data['prd_identity_id'];
                        if(match_product_idlist.indexOf(match_data_prdid)>=0){

                        }else if(match_product_idlist.indexOf(match_data_prdid)<0){
                            match_product_idlist[match_cnt]=match_data_prdid;
                            match_element_list[match_cnt] = match_data;

                            console.log('match_data:',match_data_prdid,data_item_x,data_item_y);

                            match_cnt++;
                        }
                    }
                    
                }
                console.log('====================================>>>>');
            }
        }

        //console.log('검색타입 및 해당 테이블 검색결과',click_type, match_product_idlist);
        connection.release();

        return response.json({success:true,message:'sucecess queryss',result: match_element_list });

    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[] });
    }
});

router.get('/dummy_insert_test',async function(request,response){
    console.log('insert store dummyinsert test::');

    const connection = await pool.getConnection(async conn => conn);

    try{
        for(let s=0; s<100; s++){
            let random_x= 127 + 2*Math.random();
            let random_y= 36 + 2*Math.random();
            console.log(random_x,random_y);
            var [insert_query_res] = await connection.query("insert into company2(company_name,x,y) values('더미중개사',?,?)",[random_x,random_y]);
            
            console.log('insert_query_res::',insert_query_res);
        }
        connection.release();
        return response.status(403).json({success:false, message:'success!!',result:[]});
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[]});
    }
});
router.get('/dummy_insert_testproduct',async function(request,response){
    console.log('insert store dummyinsert test::>>>');

    const connection = await pool.getConnection(async conn => conn);

    try{
        for(let s=0; s<100; s++){
            let random_x = 127 + 2*Math.random();
            let random_y = 36 + 2*Math.random();
            console.log(random_x,random_y);
            var [insert_query_rows] = await connection.query("insert into product(prd_identity_id,prd_name,prd_longitude,prd_latitude) values(?,?,?,?)",[-1,'더미매물',random_x,random_y]);

            console.log('insert_query_rows::',insert_query_rows);
        }
        connection.release();
        return response.json({success:false, message:'success!!',result:[]});
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[]});
    }
});
/*router.get('/dummy_update_prdtype_randomly',async function(request,response){
    console.log('===>>dummy update prdtype randomly:::');

    const connection = await pool.getConnection(async conn => conn);

    var [dummy_rows_product] = await connection.query("select * from product where prd_name='더미매물' and prd_identity_id=-1");
    var prd_type_array=['아파트','오피스텔','상가','사무실'];//0,1,2,3  math.floor(random()*4) 0,....3.9999 0,3

    try{
        for(let d=0; d<dummy_rows_product.length; d++){
            var random_prdtype= Math.floor(4*Math.random());
            random_prdtype = prd_type_array[random_prdtype];
            var prd_id= dummy_rows_product[d]['prd_id'];
            var [random_query]=await connection.query("update product set prd_type=? where prd_id=?",[random_prdtype, prd_id]);
    
            console.log('update randomqueryss::',random_query);
        }
        connection.release();
        return response.json({success:false, message:'success!!',result:[]});
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query problme error!',result:[]});
    }    
});
*/
//지역 행정구역별 꼭지점 VERTICES관련 조회코드.
router.get('/addrunits_shapejson_list',async function(request,response){
    console.log('===>>addrunits_shapejson_list');

    //const connection = await pool.getConnection(async conn => conn);

    //var [dummy_rows_product] = await connection.query("select * from product where prd_name='더미매물' and prd_identity_id=-1");
    //var prd_type_array=['아파트','오피스텔','상가','사무실'];//0,1,2,3  math.floor(random()*4) 0,....3.9999 0,3

   // console.log('시도,시군구,읍면동 json데이터조회 각 행정구역별 폴리곤꼭지점 area영역데이터 :',EMDJSON);

    //var outer_features=SIGJSON.features;//각 시군구레벨 지역들(2레벨)
    /*for(let outer=0; outer<outer_features.length; outer++){
        let area_item = outer_features[outer];

        let properties=area_item.properties;
        let area_sig_code= properties.SIG_CD;//시군구 지역코드.
        let area_sig_name= properties.SIG_KOR_NM;//시군구 지역이름

        //지역별 gemmetory데이터.
        let geometry= area_item.geometry;
        let coordinates = geometry.coordinates;//[][]식 조회.
        console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_sig_code,area_sig_name,coordinates);

        if(area_sig_code == '44800' && area_sig_name == '홍성군'){
            console.log('홍성군 ,대상 특정 지역 매칭 지역>>:',area_item);
        }
    }*/
    /*var return_array= outer_features.filter(function(rowData){
        console.log('filters조회:',rowData);
        return rowData.properties.SIG_CD == '44800' && rowData.properties.SIG_KOR_NM=='홍성군';
    });
    console.log('return array hahaha??:',return_array);
*/
    var outer_features2 = EMDJSON.features;//각 읍면동 레벨 지역들(사레벨)
    /*
    for(let outer=0; outer<outer_features2.length; outer++){
        let area_item = outer_features2[outer];
        console.log(area_item);
        let properties=area_item.properties;
        let area_emd_code= properties.EMD_CD;//시군구 지역코드.
        let area_emd_name= properties.EMD_KOR_NM;//시군구 지역이름

        //지역별 gemmetory데이터.
        if(area_item.geometry){
            let geometry= area_item.geometry;
            let coordinates = geometry.coordinates;//[][]식 조회.
            console.log('지역별 폴리곤 꼭지점 outlinearea조회:',area_emd_code,area_emd_name,coordinates);
        }       
    }*/
    /*var return_array= outer_features2.filter(function(rowData){
        console.log('filtersss조회::',rowData);
        return rowData.properties.EMD_CD == '42130117' && rowData.properties.EMD_KOR_NM == '반곡동';
    });
    console.log('return arraysss:',return_array); 조회시간 2351ms 2.3초 평균값.
*/
    let properties_array=[]; 
    for(let i=0; i<outer_features2.length; i++){
        let item=outer_features2[i];//피처index값을 기억해둔다.
        /*if(item.properties.EMD_CD=='36110340' && item.properties.EMD_KOR_NM=='금남면'){
            console.log('찾아낸 타깃인댁스:',i);
        }*/
        properties_array.push(item.properties);
    }
    console.log('properites_arrays::',properties_array);//20.534ms밖에 안걸림 엄청난 속도. 0.02초 map,filter에 비해 비약적속도.

    let target_index=0;
    target_index = properties_array.findIndex(find=> (find.EMD_CD=='36110340' && find.EMD_KOR_NM=='금남면'));//객체배열prorperties에서의 인댁스위치를 찾는다.대상 지역의 proeprties위치 인댁스를 찾는다.    
    console.log('find indexssss:',target_index);
    console.log('find 대상지역!!!:',outer_features2[target_index]);
    return response.json({success:true, message:'resultsssss hahah'});
});

module.exports=router;