const coolsms=require('../modules/coolsms');

const http=require('http');
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

//const app=express();
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(cors());

const mysqls=require('mysql2/promise');
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

const awsS3= require('../modules/fileuploadModule');
const {register_} = require('../modules/uploadfile_register_');
const {register} = require('../modules/uploadfile_register');

console.log('==>>>>>brokerRouter default program excecute poolss::',pool);

const router=express.Router(); 

//기존 특정 매물의 기존매물이미지들 불러오기(새로 변경하려는 사진들로 요청 업로드 처리된 이후에 그 기존의 업로드 파일들을 선점해서 삭제하기위한코드) aws s3버킷에서 특정 경로url 유니크한 값들 선택하여 삭제하기위함
router.post('/brokerProduct_prev_prdimgs',async function(req,res){
    console.log('>>>brokerproduct prev pridimgss:',req.body);

    var req_body=req.body;
    var prd_identity_id=req_body.prd_identity_id;

    const connection =await pool.getConnection(async conn=>conn);

    try{
        var [related_match_products] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);
        if(related_match_products.length >= 1){
            connection.release();

            console.log('related match priodutss:',related_match_products);//삭제할 특정폴더의 특정 기존에 저장되어있었던 모두 저장되어있었던 폴더명/파일명의 대상들 모두 제거.
            
            return res.json({success:true, message:'select matched query success',result:related_match_products[0]});
        }else{
            connection.release();
            return res.status(403).json({success:false,message:'쿼리에 문제'});
        }
    }catch(err){
        console.log('뭔 에러인가??:',err);

        connection.rollback();
        connection.release();
        return res.status(403).json({success:false,message:'쿼리에 문제'});
    }
});

//중개사회원 외부수임물건등록시에 등록된 isnerted막 추가된 매물에 절대적으로 등록해야하는 매물이미지리스트 등록
router.post('/brokerProduct_prdimgs_process',awsS3.upload.array('productimgs'),async function(req,res){
    console.log('>>>>requeswt bodyss:',req.body);

    var req_body=req.body;
    var prd_identity_id=req_body.prd_identity_id;//관련 매물id identityid값에 대한 처리.

    const connection = await pool.getConnection(async conn => conn);

    try{
        if(req.files && req.body){
            console.log('upladoed processed realted req.filess:',req.files);
            const images= await register(req.files,req.body);
            console.log('process imagesss:',images);
            
            var image_base_path = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
            var target_folder=req.body.folder;
            var product_uploadimg_array=[];

            if(images && images.length >= 1){
                for(let i=0; i<images.length; i++){
                    let image_actual_name = images[i];
                    product_uploadimg_array.push(target_folder+'/'+image_actual_name);
                }
                console.log('uploadeder stored예정 product img sarraytss:',product_uploadimg_array);
            }

            try{
                await connection.beginTransaction();

                var [related_match_products] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);//관련 매물id관련 내역들.
                if(related_match_products.length >= 1){
                    var target_change_prdid=related_match_products[0].prd_id;//그 관련된 내역중 origin첫 product prdid대상만 수정한다.매물정보.
                    console.log('관련 대상id값들>>:',related_match_products,target_change_prdid);
                    var [update_product_query] = await connection.query("update product set prd_imgs=? where prd_id=?",[product_uploadimg_array.join(','),target_change_prdid]);

                    await connection.commit();
                    console.log('update product querysss:',update_product_query);

                    connection.release();
                    if(update_product_query){

                        var [updatenext_related_match_products] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);//관련 매물id관련 내역들.
                        connection.release();
                        return res.json({success:true, message:'product매물 정보 정보 이미지 수정처리완료',update_result:updatenext_related_match_products[0]});
                    }else{
                        var [updatenext_related_match_products] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);//관련 매물id관련 내역들.
                        connection.rollback();
                        connection.release();

                        return res.json({success:false, message:'매물 정보 이미지 수정처리 문제발생',update_result:updatenext_related_match_products[0]});
                    }
                }
                
            }catch(err){
                console.log('뭔 에러인가??:',err);

                connection.rollback();
                connection.release();
                return res.status(403).json({success:false,message:'쿼리에 문제'});
            }
        }
    }catch(err){
        console.log('뭔 에러인가??:',err);

        connection.rollback();
        connection.release();
        return res.status(403).json({success:false,message:'쿼리에 문제'});
    }
});
//중개사회원 매물수정시에 매물수정시에 올린 이미지들 업로드 관련 처리 및 최근업로드한 순서대로 frront mergeefd 형태의 디비 inserteed연산진행.
router.post('/brokerRequest_prdimgs_process_modify',awsS3.upload.array('productimgs'),async function(req,res){
    console.log('>>>>requeswt bodyss:',req.body);

    var req_body=req.body;
    var prd_identity_id=req_body.prd_identity_id;//관련 매물id identityid값에 대한 처리.

    const connection = await pool.getConnection(async conn => conn);

    try{
        if(req.files && req.body){
            console.log('upladoed processed realted req.filess:',req.files);
            const images= await register(req.files,req.body);
            console.log('process imagesss:',images);
            
            var image_base_path = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
            var target_folder=req.body.folder;
            var product_uploadimg_array=[];

            if(images && images.length >= 1){
                for(let i=0; i<images.length; i++){
                    let image_actual_name = images[i];
                    product_uploadimg_array.push(target_folder+'/'+image_actual_name);
                }
                console.log('uploadeder stored예정 product img sarraytss:',product_uploadimg_array);
            }

            try{
                await connection.beginTransaction();

                var [related_match_products] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);//관련 매물id관련 내역들.
                if(related_match_products.length >= 1){
                    var target_change_prdid=related_match_products[0].prd_id;//그 관련된 내역중 origin첫 product prdid대상만 수정한다.매물정보.
                    console.log('관련 대상id값들>>:',related_match_products,target_change_prdid);
                    var prev_prd_img_strings=related_match_products[0].prd_imgs;//기존이미지들 문자열형태....앞에 ftont mreaged...
                    var front_merged_strings=product_uploadimg_array.join(',');
                    console.log('기존 이미지배열상태,',prev_prd_img_strings);
                    console.log('신규이미지배열형태,',front_merged_strings);
                    console.log('front mereged!!!,',front_merged_strings+','+prev_prd_img_strings);
                    var adapt_prd_img_strings= front_merged_strings+','+prev_prd_img_strings;
                    
                    var [update_product_query] = await connection.query("update product set prd_imgs=? where prd_id=?",[adapt_prd_img_strings,target_change_prdid]);

                    await connection.commit();
                    console.log('update product querysss:',update_product_query);

                    connection.release();
                    if(update_product_query){

                        var [updatenext_related_match_products] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);//관련 매물id관련 내역들.
                        connection.release();
                        return res.json({success:true, message:'product매물 정보 정보 이미지 수정처리완료',update_result:updatenext_related_match_products[0]});
                    }else{
                        var [updatenext_related_match_products] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);//관련 매물id관련 내역들.
                        connection.rollback();
                        connection.release();

                        return res.json({success:false, message:'매물 정보 이미지 수정처리 문제발생',update_result:updatenext_related_match_products[0]});
                    }
                }
                
            }catch(err){
                console.log('뭔 에러인가??:',err);

                connection.rollback();
                connection.release();
                return res.status(403).json({success:false,message:'쿼리에 문제'});
            }
        }
    }catch(err){
        console.log('뭔 에러인가??:',err);

        connection.rollback();
        connection.release();
        return res.status(403).json({success:false,message:'쿼리에 문제'});
    }
});
//회사정보 조회.
router.post('/companyinfo_get',async function(request,response){
    console.log('>>>>>request bodyss:',request.body);

    var req_body=request.body;

    const connection = await pool.getConnection(async conn=> conn);

    try{
        var company_id = req_body.company_id;
        var [company_info_row] = await connection.query("select * from company2 where company_id=?",[company_id]);
        connection.release();

        console.log('comapny info rowsss:',company_info_row[0]);
        
        return response.json({success:true, message:'query ssuccess',result:company_info_row[0]});
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
})
//전문중개사 신청시에 로그인 중개사회원company 에 대해서 등록되어있는지 여부
router.post('/brokerVerify_fileupload_exists',async function(request,response){
    console.log('>>>>request bodyss:',request.body);

    var req_body=request.body;

    const connection = await pool.getConnection(async conn => conn);

    try{
        var company_id = req_body.company_id;
        var [company_info_row] = await connection.query("select * from company2 where company_id=?",[company_id]);
        connection.release();

        console.log('comapny info rowsss:',company_info_row[0]);
        if(company_info_row[0].company_reg_path  && company_info_row[0].realtor_reg_path){
            return response.json({success:true, message:'중개등록증,사업자등록증 정보가 존재합니다.',type: 'exists'});
        }else{
            return response.json({success:true, message:'중개등록증,사업자등록증 정보가 없습니다.',type:'notexists'});
        }

    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개사회원 >>전문중개사 신청진행>>
// router.post('/probroker_register',awsS3.upload.fields([{name:'companyregfile'},{name: 'realtorfile'}]),async function(req,res){
//     console.log('proborker requst bodyss:',req.body);

//     var req_body=req.body;

//     const connection = await pool.getConnection(async conn => conn);

//     try{
//         if(req.files && req.body){
//             const probrokerauth_uploadfiles_array = await register_(req.files,req.body);
//             console.log('process iamgesss:', probrokerauth_uploadfiles_array);
//             const connection = await pool.getConnection(async conn => conn);

//             // var image_base_path ='https://korexdata.s3.ap-northeast-2.amazonaws.com/';
//             // var target_folder= req.body.folder;
//             // var probrokerauth_uploadfiles_array=[];

//             // if(images && images.length >=1){
//             //     for(let i=0; i<images.length; i++){
//             //         let image_actual_name = images[i];
//             //         probrokerauth_uploadfiles_array.push(target_folder+'/'+image_actual_name);
//             //     }
//             //     console.log('uplaodeddor stodred예정 probroker auth uplofielsarrayss:',probrokerauth_uploadfiles_array, probrokerauth_uploadfiles_array.join(','));
//             // }
//             try{
//                 var apartaddr_road= req_body.apartaddr_road;//아파트주소
//                 var apartname= req_body.apartname;//아파트이름
//                 var isapart=req_body.isapart;//아파트 체크여부
//                 var isoffice=req_body.isoffice;//사무실 체크여부 isapplyoffice
//                 var isofficetel=req_body.isofficetel;//오피스텔체크여부
//                 var isstore=req_body.isstore;//상가체크여부 isapplystore
//                 var officeteladdr_road=req_body.officeteladdr_road;//오피스텔도로명주소
//                 var officetelname = req_body.officetelname;//오피스텔이름
//                 var memid=req_body.memid;//신청유저
//                 var company_id=req_body.company_id;//신청 중개사
                
//                 //해당 중개사의 신청내역중 가장 최근이전 신청내역 하나를 가져오고 그 내역을 insert하려는 내역에 병합해서 하는형태로요구.최근이면서 승인된 내역의 것을 병합해야한다.
//                 var [last_prev_proapplypermission] = await connection.query("select * from pro_apply_permission2 where company_id=? and permission_state='승인' order by apply_dttm desc",[company_id]);//가장 최근 전문중개사신청내역:: 가장 최근 companyid의 전문중개사신청내역 한개 조회.
//                 var lastestapply_pro_apt_id=last_prev_proapplypermission[0].pro_apt_id;
//                 var lastestapply_pro_oft_id=last_prev_proapplypermission[0].pro_oft_id;
//                 var lastestapply_is_pro_office=last_prev_proapplypermission[0].is_pro_office;
//                 var lastestapply_is_pro_store=last_prev_proapplypermission[0].is_pro_store;
//                 var lastestapply_chatkey=last_prev_proapplypermission[0].chat_key;//가장 최근에 신청했었던 아파트,오피스텔id,상가사무실전문종목승인여부,채팅키 등 값도 같이 병합해서 하여 관리자에서 해당 신청에 대해서 기존 pro값들과 신청했던 아파트,오피스텔 단지가 기존과 같은것이라면 그대로 냅두고,새로운것으로 신청한것이라면 pao_apt,op_id등 바꿉니다. 사무실상가전문승인여부또한 상가사무실체크여부에 따라 비교하여 update, 변화없으면 그대로유지.관리자에서 관련 코드 판단작성.
//                 await connection.beginTransaction();

//                 var [proapplypermission] = await connection.query("insert into pro_apply_permission2(apply_dttm,apply_state,as_mod_dttm,is_apply_office,is_apply_store,apply_apt_addr,apply_op_addr,apt_name,oft_name,company_reg_path,realtor_reg_path,permission_state,user_id,company_id, pro_apt_id,pro_oft_id,is_pro_office,is_pro_store,chat_key) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[new Date(),'접수',new Date(),isoffice,isstore,apartaddr_road,officeteladdr_road,apartname,officetelname,probrokerauth_uploadfiles_array[0], probrokerauth_uploadfiles_array[1],'미승인',memid, company_id,lastestapply_pro_apt_id,lastestapply_pro_oft_id,lastestapply_is_pro_office,lastestapply_is_pro_store,lastestapply_chatkey]);
//                 //사무실신청여부, 상가신청여부,신청한 아파트주소,신청한 오피스텔주소, 신청아파트이름,신청오피스텔이름,신청시 올린 사업자,중개등록증이미지(첨부하지못하는경우도있음.),기본값 미승인, 신청자id,소속id
//                 await connection.commit();
//                 console.log('proapplypermissi insert rowss:',proapplypermission);

//                 connection.release();
//                 if(proapplypermission && proapplypermission.insertId){
//                     return res.json({success:true, message:'전문중개사 신청 성공하였습니다.'});
//                 }else{
//                     connection.rollback();
//                     connection.release();
//                     return res.status(403).json({success:false,message:'쿼리에 문제'});
//                 }
                
//             }catch(err){
//                 console.log('뭔 에러인가??:',err);

//                 await connection.rollback();
//                 connection.release();

//                 console.log('server or insert query error!!');
                
//                 return res.status(403).json({success:false, message:'서버오류.'});
//             }
//         }
//     }catch(err){
//         console.log('뭔 에러인가??:',err);

//         await connection.rollback();
//         connection.release();

//         console.log('server or insert query error!!');
        
//         return res.status(403).json({success:false, message:'서버오류.'});
//     }
// });
//개인기업회원 중개의로목록 물건들 상태 (거래완료,중개의뢰건들)리스트 조회.
router.post('/brokerRequest_product_staticview',async function(request,response){
    console.log('=>>>>>>>requeste.body::',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn => conn);

    //try catch문 mysql 구문 실행구조.
    try{
        var user_type=req_body.user_type;
        var company_id =req_body.company_id;

        if(user_type=='개인'){
            var [product_row]=await connection.query('select distinct prd_identity_id from product where request_mem_id=?',[request.session.user_id]);
            var prd_identity_id_array=[];
            for(var s=0; s<product_row.length; s++){
                prd_identity_id_array.push(product_row[s].prd_identity_id);//idnetiityid값만을 저장한다.
            }
        }else{

            //var [login_userinfo] = await connection.query("select * from user where mem_id=?",[request.session.user_id]);
           // var company_id_get=login_userinfo[0].company_id;//로그인 되어있는 그 유저의 소속되어있는 companyid를 구하고,현재 소속되어있는 중요한게 현재 소속되어있는 companyid조회이다.그 현재 코레이즈로 되어있는 소속된 companyid하의 회원들 구한다.그 하의 회원들이면서 그 회원들의 신청했던 내역들이면서 현재 소속에 해당하는  현재 로그인된 유저의 소속으로 되어있는것과 같은 소속로부터 신청한 중개의뢰내역조회.
            var [sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id]);
            console.log('sosok_user listsss:',sosok_userlist);
            var prd_identity_id_array=[];
            for(var u=0; u<sosok_userlist.length; u++){
                let loca_memid=sosok_userlist[u].mem_id;//각 소속유저들memid값.
                var [product_row]=await connection.query("select distinct prd_identity_id from product where request_mem_id=? and request_company_id=?",[loca_memid,company_id]);
                console.log('===>>>memid별 중개의뢰내역들::',loca_memid,product_row);//해당 소속companyid속속 회의들의 해당 소속인상태에서 신청한 의뢰건들만 가져와야함 mem-id로만 가져오면 그 해당 소속이 아녔던것도 가져온다.

                for(var s=0; s<product_row.length; s++){
                    prd_identity_id_array.push(product_row[s].prd_identity_id);
                }
            }
        }
        
        console.log('select query rows results 임의 기업or개인이 의뢰했던 모든 중개의뢰prdiienittiyid 구별 매물내역들.',prd_identity_id_array);
        //connection.release();

        if(prd_identity_id_array.length>=1){
            var match_transaction_list=[];
            for(var ss=0; ss<prd_identity_id_array.length; ss++){
                
                var [match_transaction_query] = await connection.query("select * from transaction where prd_identity_id=?",[prd_identity_id_array[ss]]);
                var [match_product_query_origin] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id_array[ss]]);

                var transaction_status=match_transaction_query[0].txn_status;//각 거래 매물별 최근상태값을 구한다.
                var store_object={};
                store_object['transaction_status'] = transaction_status;
                store_object['match_product'] = match_product_query_origin[0];
                match_transaction_list.push(store_object);
                //console.log('part product idneitiy distinct query rueslttss:',part_product_query_row);
                //임의의 기업or개인이 중개릐뢰의뢰했던 거래들(매물prdiidientitiyid들 하나가 transaciton일대일매칭)을 모두 리턴한다.
            }
            console.log('respronse reuslt data:',match_transaction_list);
            connection.release();
            return response.json({success:true, message:'product server query success!!', result_data: match_transaction_list});
        }else{
            connection.release();
            return response.json({success:true, message:'product server query susccess!', result_data: []});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개사회원 수임 매물리스트 관련 view현황판.
router.post('/brokerProduct_commit_liststatic',async function(request,response){

    var req_body=request.body;

    const connection=await pool.getConnection(async conn => conn);

    console.log('brokerProduct_commit_liststatic >>> request ',req_body);
    //try catch문 mysql 구문 실행구조.
    try{
        var user_type=req_body.user_type;
        var company_id=req_body.company_id;
        if(user_type=='중개사'){
            
            /*
            총등록건수: 코렉스시스템상 전체에서 각 업소별 등록건수(거래개시인건들)총합.거래개시인 product매물 전체항목
            업소별등록건수:밑의 쿼리에서 거래개시상태인항목들의 count값. 
            전문성지수 = 등록률(업소별 등록건수/총 등록건수)*등록가중치 + 성사율(업소별성사건수/업소별등록건수)*성사가중치
            if(총등록건수>100)등록가중치 = 0.5 , 등록가중치=0.3
            if(업소별등록건수>10) 성사가중치 0.5 , 성사가중치 0.3
            업소별등록건수,업소별성사건수,성사가중치 등은 프론트단에서 판단최종적으로 하고(데이터확인까지)
            총등록건수,등록가중치 등 정보는 서버에서 쿼리로 전달 알려줌
            */
            var [allproduct_query] = await connection.query("select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where t.txn_status='거래개시' group by p.prd_identity_id");//거래개시인항목들 전체쿼리.전체총등록건수 및 등록가중치 판단.
            var all_regist_count=allproduct_query.length;

            /*특정 대상 companyid중개사 수임관려 매물들 총 몇건인지 쿼리(전체내역: 이중에서 거래개시인항목들만의 수가 해당업소등록건수)*/
            var prd_identity_id_array=[];
            var [product_row]=await connection.query("select distinct prd_identity_id from product where company_id=?",[company_id]);

            for(var s=0; s<product_row.length; s++){
                prd_identity_id_array.push(product_row[s].prd_identity_id);
            }
            //connection.release();

            console.log('prdidneiitiy araryss reusltss:',prd_identity_id_array);

            if(prd_identity_id_array.length>=1){
                var match_transaction_list=[];
                for(var ss=0; ss<prd_identity_id_array.length; ss++){
                    
                    var [match_transaction_query] = await connection.query("select * from transaction where prd_identity_id=?",[prd_identity_id_array[ss]]);
                    var [match_product_query_origin] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id_array[ss]]);
    
                    var transaction_status=match_transaction_query[0].txn_status;//각 거래 매물별 최근상태값을 구한다.
                    var store_object={};
                    store_object['transaction_status'] = transaction_status;
                    store_object['match_product'] = match_product_query_origin[0];
                    match_transaction_list.push(store_object);
                    //console.log('part product idneitiy distinct query rueslttss:',part_product_query_row);
                    //임의의 기업or개인이 중개릐뢰의뢰했던 거래들(매물prdiidientitiyid들 하나가 transaciton일대일매칭)을 모두 리턴한다.
                }
                connection.release();
                return response.json({success:true, message:'product server query success!!', result_data: match_transaction_list, all_regist_count:all_regist_count});
            }else{
                connection.release();
                return response.json({success:true, message:'product server query susccess!', result_data: []});
            }
        }else{
            connection.release();
            return response.status(403).json({success:false, message:'server  full problem error!'});     
        }
        
    }catch(err){
        connection.release();
        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개의뢰 물건 등록.
router.post('/user_brokerRequest',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        /*dong,hosil,floor,dangi,dangiaddress,name,phone,maemultype,maeulname,jeongyongdimension,jeonyongpyeong,supplydimension,supplypyeong, 
        selltype,sellprice,mangecost,is_immediate_ibju,ibju_speciftydate, exculsive_peridos,companyid,requestmemdi
        아파트,오피의 경우 단지명,단지주소,동 층 호실의 조합으로 구분한다.사실상 이 조합이 유일하게 임의 등록하려는 전속매물끼릴를 구분할수있는 것이기에. 기존 products,transaction등에서 이러한 조합으로
        구분하여 존재하고있는것이면 등록안되게끔 하는게 단수알고리즘.
        임의 전문중개사가 전용담당하고있는걸로 하면 안되고, 그 중개사id로 등록된 상품들중에서 해당 요청ho_id(아파트,오피스텔의 경우 등록하려는 아파트오피의 특정층의 특정호실에 대한 그 매물로 등록한 product가 있다면 그건 이미 코렉스시스템에 등록된 매물인것임,) 사무실상가의 경우는 product에서 임의 전문중개사companyid로 등록된 rpdocdut내역중에서 그 해당 flr_id층id값 어떤 상가,사무실건물의 특정 건물그 자체의 n층에 해당하는 (층단위)flr_id로의 등록이 이미 되었는지로 판단.(오피,아파트보다 좀더 신청가능한 범위가 좁음.)
        */
        //prd_id로 등록한다.
        var dong=req_body.dong;//동건물id값
        var hosil=req_body.hosil;//호실id값
        var floor=req_body.floor;//층id값
        var dangi=req_body.dangi;//단지명
        var dangijibunaddress=req_body.dangijibunaddress;//지번주소값
        var dangiroadaddress=req_body.dangiroadaddress;//도로명주소
        var dong_name=req_body.dong_name;//동이름
        var floorname=req_body.floorname;//층이름
        var ho_name=req_body.ho_name;//호실이름
        var floorint = req_body.floorint;//층 int값
        var x=req_body.x;
        var y=req_body.y;
        var isrightprice= req_body.isrightprice;

        var name=req_body.name;
        var phone=req_body.phone;
        var maemultype=req_body.maemultype;//매물타입
        var maemulname=req_body.maemulname;//매물이름
        if(dangi && dangi!=''){
            maemulname = maemulname + '('+dangi+')';
        }
        
        var exclusive_periods=req_body.exclusive_periods;
        var usertype = req_body.usertype;//사용타입
        var job = req_body.job;//상가 업종여부
        if(job){
            job=1;
        }else{
            job=0;
        }
        var jobtype= req_body.jobtype;//상가 업종사용.
        
        var jeonyongdimension=req_body.jeonyongdimension;//전용면적
        var jeonyongpyeong=req_body.jeonyongpyeong;//전용면적평
        var supplydimension=req_body.supplydimension;//공급면적
        var supplypyeong=req_body.supplypyeong;//공급명적평
        var selltype=req_body.selltype;//판매타입
        var sellprice=req_body.sellprice;//판매가격 월세가전세가매매가
        //var deposit=req_body.deposit;//월세가
        var monthly=req_body.monthly;//월세가
        var managecost=req_body.managecost;//관리비
        var manageincludes=req_body.manageincludes;//관리비포함항목
        var ismanagementcost = req_body.ismanagementcost;//관리비여부
        var is_immediate_ibju=req_body.is_immediate_ibju;//입주즉시여부
        var ibju_specifydate=req_body.ibju_specifydate;//입주예정일
        var request_message=req_body.request_message;//요청사항
        var storeofficebuildingfloor = req_body.storeofficebuildingfloor;//사무실상가 유형의 경우 검색된 선정한 건물의 최고층값.

        var companyid=req_body.companyid;
        var requestmemid=req_body.requestmemid;
        var requestuser_selectsosok=req_body.requestuser_selectsosok;//선택한 소속id값으로 어떤 소속상태였을때의 회원이 중개의로신청한건지.

        var prdstatus_generator=req_body.prdstatus_generator;
        var prdstatus_change_reason=req_body.prdstatus_change_reason;

        if(maemultype == '아파트' || maemultype=='오피스텔'){
            var addr_detail=dong_name+' '+floorname+'층'+ho_name;
        }else{
            var addr_detail=floorname+'층';
            if(ho_name){
                addr_detail += ho_name+'호';//호를 입력한경우에만 n층 y호 이렇게.
            }
        }
        

        //product에 가장 먼저 넣고, 추출해야할것은 prd_id(insertId이고) 이 insertid를 prd_identity_id대입한다.
        await connection.beginTransaction();
        var [products_insert_rows]=await connection.query('insert into product(company_id,prd_name,prd_type,prd_sel_type,prd_price,prd_month_price,prd_status,prd_latitude,prd_longitude,exclusive_status,addr_detail,supply_area,exclusive_area,floor,modify_date,create_date,request_mem_id,prd_create_origin,request_mem_name,request_mem_phone,managecost,is_immediate_ibju,ibju_specifydate,exclusive_pyeong,supply_pyeong,exclusive_periods,include_managecost,bld_id,ho_id,addr_jibun,addr_road , ho_name,dong_name,floorname, floorint, storeoffice_building_totalfloor,request_message,is_current_biz_job,current_biz_job,prd_usage,is_managecost,request_company_id,is_rightprice) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[companyid,maemulname,maemultype,selltype,sellprice,monthly,'검토대기',y,x, 0,addr_detail,supplydimension,jeonyongdimension,floor,new Date(),new Date(),requestmemid,'중개의뢰',name,phone,managecost,is_immediate_ibju,ibju_specifydate,jeonyongpyeong,supplypyeong,exclusive_periods,manageincludes,dong,hosil,dangijibunaddress,dangiroadaddress,ho_name,dong_name,floorname,floorint,storeofficebuildingfloor,request_message,job,jobtype,usertype,ismanagementcost,requestuser_selectsosok,isrightprice]);//어떤 소속의 회원로부터(그떄마다 다 다름.)해당 임의 기업개인하의 companymmeber의 소속 회원리스트가 중개의뢰한 내역들(request_mem_id)이면서,그 중개의뢰한 회원이 어떤 소속상태에서 신청한건지 여부로 로그인한 기업회원의 companyid소속에 해당하는 즉 현재 로그인companyid와 동일한 소속인 상태에서 중개의뢰한 내역들만 나오게 처리.
        await connection.commit();
        console.log('produts insert query rtowss:',products_insert_rows);
        //connection.release();

        var prd_identity_id=products_insert_rows.insertId;

        //방금막 추가한 isnertid에 해당하는 prd_id의 idnenity_id지정.update지정 update prd_idneity_id ->product
        await connection.beginTransaction();
        var [products_update_rows] = await connection.query('update product set prd_identity_id=? where prd_id=?',[prd_identity_id,prd_identity_id]);
        await connection.commit();
        console.log('products update query rows:',products_update_rows);

        //trasnaction에 지정한다->> prd_identtiy_id로 지정
        await connection.beginTransaction();
        var [transaction_insert_rows] = await connection.query('insert into transaction(company_id,txn_type,txn_status,txn_order_type,create_date,modify_date,prd_identity_id) values(?,?,?,?,?,?,?)',[companyid,1,'검토대기',selltype,new Date(),new Date(),prd_identity_id]);
        await connection.commit();
        console.log('products transaction insert query rows:',transaction_insert_rows);

        var extract_txn_id=transaction_insert_rows.insertId;

        //transaction_history에 지정한다 -> prd_identity_id로 지정
        await connection.beginTransaction();
        var [product_modfiyhistory_insertrows] = await connection.query('insert into product_modify_history2(prd_identity_id,company_id,prd_name,prd_type,prd_sel_type,prd_price,prd_month_price,prd_status,prd_latitutde,prd_longitude,exclusive_status,addr_detail,supply_area,exclusive_area,floor,modify_date,create_date,request_mem_id,prd_create_origin,request_mem_name,request_mem_phone,managecost,is_immediate_ibju,ibju_specifydate,exclusive_pyeong,supply_pyeong,exclusive_periods,mangaecostincludes,bld_id,ho_id,addr_jibun,addr_road , ho_name,dong_name,floorname, floorint, storeoffice_building_totalfloor,request_message,is_current_biz_job,current_biz_job,prd_usage,history_type,prdstatus_generator,prdstatus_change_reason,is_rightprice) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[prd_identity_id,companyid,maemulname,maemultype,selltype,sellprice,monthly,'검토대기',y,x, 0,addr_detail,supplydimension,jeonyongdimension,floor,new Date(),new Date(),requestmemid,'중개의뢰',name,phone,managecost,is_immediate_ibju,ibju_specifydate,jeonyongpyeong,supplypyeong,exclusive_periods,manageincludes,dong,hosil,dangijibunaddress,dangiroadaddress,ho_name,dong_name,floorname,floorint,storeofficebuildingfloor,request_message,job,jobtype,usertype,'상태변경',prdstatus_generator,prdstatus_change_reason,isrightprice]);
        await connection.commit();
        console.log('product_modfiyhistory_insertrows insert query rows:',product_modfiyhistory_insertrows);

        if(products_update_rows && products_insert_rows && transaction_insert_rows && product_modfiyhistory_insertrows){
            connection.release();
            return response.json({success:true, message:'product,transaction등 server query success!!',result:prd_identity_id});//성공한 transacitonid 의뢰id(중개매물의뢰id)를 리턴한다.
        }else{
            connection.rollback();
            connection.release();
            return response.json({success:false, message: 'server query parts probilem error!!'});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개의뢰매물 요청 삭제(관련 매물요소 삭제)
router.post('/brokerRequest_product_deleteProcess',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    try{
        var prd_identity_id = req_body.delete_target_id;

        await connection.beginTransaction();
        var [related_product_delete]=await connection.query('delete from product where prd_identity_id=?',[prd_identity_id]);
        await connection.commit();
        console.log('produts delete query rtowss:',related_product_delete);
        //connection.release();

        await connection.beginTransaction();
        var [transaction_delete_rows] = await connection.query('delete from transaction where prd_identity_id=?',[prd_identity_id]);
        await connection.commit();
        console.log('transaction delte query rowss:',transaction_delete_rows);

        await connection.beginTransaction();
        var [productmodify_history_delete_rows] = await connection.query('delete from product_modify_history2 where prd_identity_id=?',[prd_identity_id]);
        await connection.commit();
        console.log('productmodify_history_delete_rows delete query rows:',productmodify_history_delete_rows);

        if(related_product_delete && transaction_delete_rows && productmodify_history_delete_rows){
            connection.release();
            return response.json({success:true, message:'product,transaction,history 삭제 등 server query success!!'});
        }else{
            connection.rollback();
            connection.release();
            return response.json({success:false, message: 'server query parts probilem error!!'});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//외부수임 직접 등록(중개사)
router.post('/user_brokerOuterRequest',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    console.log('여길 확인해야 한다. 전용면적 =============================================', req_body);

    const connection=await pool.getConnection(async conn=> conn);

    //단수 알고리즘 해야함. 기존 쿼리에서 해당 매물이 다른 전문중개사에 등록된건지 여부를 검사. 일단은 insert먼저 하고 단수알고리즘은 나중에
    try{
        /*dong,hosil,floor,dangi,dangiaddress,name,phone,maemultype,maeulname,jeongyongdimension,jeonyongpyeong,supplydimension,supplypyeong, 
        selltype,sellprice,mangecost,is_immediate_ibju,ibju_speciftydate, exculsive_peridos,companyid,requestmemdi
        아파트,오피의 경우 단지명,단지주소,동 층 호실의 조합으로 구분한다.사실상 이 조합이 유일하게 임의 등록하려는 전속매물끼릴를 구분할수있는 것이기에. 기존 products,transaction등에서 이러한 조합으로
        구분하여 존재하고있는것이면 등록안되게끔 하는게 단수알고리즘.
        */
        //prd_id로 등록한다.
        var dangi = req_body.dangi; //단지orfloor건물명 엄밀히는 단지명 complexname
        var dangijibunaddress = req_body.dangijibunaddress;
        var dangiroadaddress = req_body.dangiroadaddress;
        var companyid = req_body.companyid;//등록하려는 중개사회원
        var exculsivedimension=req_body.exculsivedimension;
        var exculsivepyeong = req_body.exculsivepyeong;
        var is_immediate_ibju = req_body.is_immediate_ibju;//입주즉시여부
        var ibju_specifydate = req_body.ibju_specifydate;//입주예정일
        is_immediate_ibju= (is_immediate_ibju != '' || is_immediate_ibju != null ) ? is_immediate_ibju : 0;
        ibju_specifydate = (ibju_specifydate != '' || ibju_specifydate != null ) ? ibju_specifydate : '0000-00-00';

        var maemulname = req_body.maemulname;
        if(dangi && dangi!=''){
            maemulname += '('+dangi+')';
        }
        var maemultype = req_body.maemultype;//maemultype
        var managecost = req_body.managecost;//관리비
        var ismanagementcost = req_body.ismanagementcost;//관리비여부.
        if(ismanagementcost){
            ismanagementcost=1;
        }else{
            ismanagementcost=0;
        }

        var requestmanname = req_body.requestmanname;
        var requestmemphone = req_body.requestmemphone;
        var sellprice = req_body.sellprice;//매매가,전세가,월세가
        var monthsellprice=req_body.monthsellprice;//월세액
        var selltype= req_body.selltype;//판매타입.
        var supplydimension = req_body.supplydimension;//공급면적
        var supplypyeong = req_body.supplypyeong;//공급면적평

        var x= req_body.x;
        var y= req_body.y;
        var is_current_biz_job = req_body.is_current_biz_job;//상가업종여부
        var current_biz_job = req_body.current_biz_job;//상가업종
        var usetype= req_body.usetype;//오피스텔이용형태
        var is_rightprice = req_body.is_rightprice;//권리금 유무

        var dong = req_body.dong;//선택 동(빌딩bld_id)
        var hosil = req_body.hosil;//선택 호실.ho_id
        var floor= req_body.floor;//상가사무실케이스 선택 flr_id 선택건물층.층id값.
        var dong_name = req_body.dong_name;//동이름
        var ho_name = req_body.ho_name;//호실이름
        var floorname = req_body.floorname;//층이름
        var floorint = req_body.floorint;//선택 층 int값.

        var exclusive_periods= req_body.exclusive_periods;
        var include_managecost = req_body.include_managecost;
        var storeofficebuildingfloor = req_body.storeofficebuildingfloor;//상가사무실케이스일때 나온 관련 층건물의 총층 지상최고층값.value

        var roomcount = req_body.roomcount_val;//방수 
        var bathroomcount = req_body.bathroomcount_val;
        var is_duplex_floor = req_body.is_duplex_floor_val;//복층여부
        var isparking = req_body.isparking_val;//주차가능여부
        isparking = (isparking !='' || isparking != null) ? isparking : 0;
        is_duplex_floor= (is_duplex_floor != '' || is_duplex_floor != null) ? is_duplex_floor : 0;
        var parking_option = req_body.parking_option_val;

        var iselevator= req_body.iselevator_val;//엘베여부 엘베존재여부    
        var is_pet = req_body.is_pet_val;//반려동물가능여부   
        iselevator = (iselevator !='' || iselevator != null) ? iselevator : 0;
        is_pet = (is_pet !='' || is_pet != null)? is_pet : 0;

        var direction = req_body.direction_val; 
        var istoilet = req_body.istoilet_val;
        var isinteriror = req_body.isinteriror_val;
        var recommend_jobstore = req_body.recommend_jobstore_val;
        var room_structure = req_body.room_structure_val;

        var entrance = req_body.entrance_val;
        var heatfuel = req_body.heatfuel_val;//난방형태
        var heatmethod = req_body.heatmethod_val;    
        
        var standardspace_option = req_body.standardspace_option_val;//space_option공간옵션   표준용
        var officetelspace_option = req_body.officetelspace_option_val;//space_option공간옵션   오피스텔용
        if(maemultype!='오피스텔'){
            var space_option= standardspace_option;
        }else{
            var space_option= officetelspace_option;
        }
        var security_option = req_body.security_option_val;//보안옵션

        var officeteloption = req_body.officeteloption_val;//오피스텔옵션  매물옵션
        var storeofficeoption = req_body.storeofficeoption_val;//사무실상가옵션 매물옵션

        if(maemultype=='오피스텔'){
            var prd_option=officeteloption;
        }else if(maemultype=='사무실' || maemultype=='상가'){
            var prd_option=storeofficeoption;
        }
       
        var is_contract_renewal = req_body.is_contract_renewal_val;//계약갱신청구권 여부.
        var loanprice = req_body.loanprice_val;//융자금
        var guaranteeprice = req_body.guaranteeprice_val;//기보증금월세
        var prd_description = req_body.mameul_description_val;
        var prd_description_detail_val = req_body.prd_description_detail_val;
         
        if(maemultype == '아파트' || maemultype =='오피스텔'){
            var addr_detail = dong_name + '동 '+floorname+' 층'+ho_name+'호';
        }else{
            var addr_detail = floorname+'층';
            if(ho_name){
                addr_detail += ho_name+'호';
            }
        }
        
        var prdstatus_generator=req_body.prdstatus_generator;
        var prdstatus_change_reason=req_body.prdstatus_change_reason;

        //product에 가장 먼저 넣고, 추출해야할것은 prd_id(insertId이고) 이 insertid를 prd_identity_id대입한다.
        await connection.beginTransaction();
        var [products_insert_rows]=await connection.query('insert into product(addr_jibun,addr_road,prd_latitude,prd_longitude,bld_id,ho_id,bathroom_count,company_id,direction,entrance,addr_detail,exclusive_periods,exclusive_area,exclusive_pyeong,prd_status,floor,month_base_guaranteeprice,heat_fuel_type,heat_method_type,is_immediate_ibju, ibju_specifydate, is_contract_renewal, is_duplex_floor,is_elevator,is_parking,is_pet,loanprice,prd_description,prd_description_detail,prd_name,prd_type,is_managecost,managecost,include_managecost,parking_option,request_mem_name,request_mem_phone,room_count,security_option,prd_price,prd_month_price,prd_sel_type,supply_area,supply_pyeong,prd_create_origin,create_date,modify_date, floorname,dong_name,ho_name,storeoffice_building_totalfloor,floorint,prd_usage,is_current_biz_job,current_biz_job,is_toilet,is_interior,recommend_jobstore,room_structure,space_option,prd_option,is_rightprice) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[dangijibunaddress,dangiroadaddress,y,x,dong,hosil,bathroomcount,companyid,direction,entrance,addr_detail,exclusive_periods,exculsivedimension,exculsivepyeong,'거래준비',floor,guaranteeprice,heatfuel,heatmethod,is_immediate_ibju,ibju_specifydate,is_contract_renewal,is_duplex_floor,iselevator,isparking,is_pet,loanprice,prd_description,prd_description_detail_val,maemulname,maemultype,ismanagementcost,managecost,include_managecost,parking_option,requestmanname,requestmemphone,roomcount,security_option,sellprice,monthsellprice,selltype,supplydimension,supplypyeong,'외부수임',new Date(),new Date(),floorname,dong_name,ho_name,storeofficebuildingfloor,floorint,usetype,is_current_biz_job,current_biz_job,istoilet,isinteriror,recommend_jobstore,room_structure,space_option,prd_option,is_rightprice]);
        await connection.commit();
        console.log('produts insert query rtowss:',products_insert_rows);
        //connection.release();

        var prd_identity_id=products_insert_rows.insertId;

        //방금막 추가한 isnertid에 해당하는 prd_id의 idnenity_id지정.update지정 update prd_idneity_id ->product
        await connection.beginTransaction();
        var [products_update_rows] = await connection.query('update product set prd_identity_id=? where prd_id=?',[prd_identity_id,prd_identity_id]);
        await connection.commit();
        console.log('products update query rows:',products_update_rows);

        //trasnaction에 지정한다->> prd_identtiy_id로 지정
        await connection.beginTransaction();
        var [transaction_insert_rows] = await connection.query('insert into transaction(company_id,txn_type,txn_status,txn_order_type,create_date,modify_date,prd_identity_id) values(?,?,?,?,?,?,?)',[companyid,1,'거래준비',selltype,new Date(),new Date(),prd_identity_id]);
        await connection.commit();
        console.log('products transaction insert query rows:',transaction_insert_rows);

        var extract_txn_id=transaction_insert_rows.insertId;

        //transaction_history에 지정한다 -> prd_identity_id로 지정
        await connection.beginTransaction();
        var [product_modfiyhistory_insertrows] = await connection.query('insert into product_modify_history2(prd_identity_id,company_id,prd_name,prd_type,prd_sel_type,prd_price,prd_month_price,month_base_guranteeprice,prd_status,prd_latitutde,prd_longitude,exclusive_status,addr_detail,supply_area,exclusive_area,floor,modify_date,create_date,request_mem_id,prd_create_origin,request_mem_name,request_mem_phone,managecost,is_immediate_ibju,ibju_specifydate,exclusive_pyeong,supply_pyeong,exclusive_periods,mangaecostincludes,is_managecost,bld_id,ho_id,addr_jibun,addr_road , ho_name,dong_name,floorname, floorint, storeoffice_building_totalfloor,request_message,is_current_biz_job,current_biz_job,prd_usage,is_duplex_floor,parking_option,is_pet,entrance,security_option,is_contract_renewal,loanprice,prd_description,prd_description_detail,history_type,prdstatus_generator,prdstatus_change_reason,is_toilet,is_interior,is_elevator,recommend_jobstore,room_structure,space_option,prd_option,is_rightprice) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[prd_identity_id,companyid,maemulname,maemultype,selltype,sellprice,monthsellprice,guaranteeprice,'거래준비',y,x, 0,addr_detail,supplydimension,exculsivedimension,floor,new Date(),new Date(),-1,'외부수임',requestmanname,requestmemphone,managecost,is_immediate_ibju,ibju_specifydate,exculsivepyeong,supplypyeong,exclusive_periods,include_managecost,ismanagementcost,dong,hosil,dangijibunaddress,dangiroadaddress,ho_name,dong_name,floorname,floorint,storeofficebuildingfloor,'',is_current_biz_job,current_biz_job,usetype,is_duplex_floor,parking_option,is_pet,entrance,security_option,is_contract_renewal,loanprice,prd_description,prd_description_detail_val,'상태변경',prdstatus_generator,prdstatus_change_reason,istoilet,isinteriror,iselevator,recommend_jobstore,room_structure,space_option,prd_option,is_rightprice]);
        await connection.commit();
        console.log('product_modfiyhistory_insertrows insert query rows:',product_modfiyhistory_insertrows);

        if(products_update_rows && products_insert_rows && transaction_insert_rows && product_modfiyhistory_insertrows){
            connection.release();
            return response.json({success:true, message:'product,transaction등 server query success!!',insert_result:prd_identity_id});
        }else{
            connection.rollback();
            connection.release();
            return response.json({success:false, message: 'server query parts probilem error!!'});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});


//개인,기업회원 내 중개의뢰 리스트.
router.post('/user_brokerRequestlistview',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    console.log('/user_brokerRequestListview request session store:::>>>>',request.session);

    //try catch문 mysql 구문 실행구조.
    try{
        var user_type=req_body.user_type;
        if(user_type=='개인'){
            var [product_row]=await connection.query('select distinct prd_identity_id from product where request_mem_id=? order by create_date desc',[request.session.user_id]);
            var prd_identity_id_array=[];
            for(var s=0; s<product_row.length; s++){
                //해당 개인이 신청한 reqestmmeid내역들 조회.개인의 경우 신청한사람memid기준으로 한다.
                prd_identity_id_array.push(product_row[s].prd_identity_id);//idnetiityid값만을 저장한다.
            }
        }else{

            var [login_userinfo] = await connection.query("select * from user where mem_id=?",[request.session.user_id]);
            var company_id_get=login_userinfo[0].company_id;
            var [first_creater_query] = await connection.query("select * from user where company_id=? and register_type='korex'",[company_id_get]);
            var [sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id_get]);
            console.log('sosok_user listsss:',sosok_userlist);//companymember소속 유저리스트..
            var prd_identity_id_array=[];

            var first_id=first_creater_query[0].mem_id;
            var [firstuser_product_row] = await connection.query("select distinct prd_identity_id from product where request_mem_id=? and request_company_id=? order by create_date desc",[first_id,company_id_get]);

            for(var t=0; t<firstuser_product_row.length; t++){
                prd_identity_id_array.push(firstuser_product_row[t].prd_identity_id);
            }
            
            for(var u=0; u<sosok_userlist.length; u++){
                let loca_memid=sosok_userlist[u].mem_id;//각 소속유저들memid값.
                //요청유저가 자기의 소속이면서도 동시에 자신을 가리키고있는 자신의companyid소속에 해당하는 상태로 신청한 내역들만!조회.
                var [product_row]=await connection.query("select distinct prd_identity_id from product where request_mem_id=? and request_company_id=? order by create_date desc",[loca_memid,company_id_get]);
                console.log('===>>>memid별 중개의뢰내역들(자신을 소속mother로한채로 신청한 내역들만 조회)::',loca_memid,product_row);

                for(var s=0; s<product_row.length; s++){
                    prd_identity_id_array.push(product_row[s].prd_identity_id);
                }
            }
        }
        
        console.log('select query rows results 임의 기업or개인이 의뢰했던 모든 중개의뢰prdiienittiyid 구별 매물내역들.',prd_identity_id_array);
        //connection.release();

        if(prd_identity_id_array.length>=1){
            var product_distinct_groupArray=[];

            for(var ss=0; ss<prd_identity_id_array.length; ss++){
                product_distinct_groupArray[ss]={};
                product_distinct_groupArray[ss]['prd_identity_id']=prd_identity_id_array[ss];
                product_distinct_groupArray[ss]['prd_id_history_child']=[];
                var [part_product_query_row]=await connection.query("select * from product where prd_identity_id=? group by prd_identity_id",[prd_identity_id_array[ss]]);

                console.log('part product identity distinct quqery results:',part_product_query_row);//가장 prd_identiytyid별 그룹별아이디 최근origin값
                for(let inner=0; inner<part_product_query_row.length; inner++){
                    product_distinct_groupArray[ss]['prd_id_history_child'][inner] = part_product_query_row[inner];
                }
                var [match_transaction_query_row ] = await connection.query("select * from transaction where prd_identity_id=?",[prd_identity_id_array[ss]]);
                
                console.log('match transactiuonssss:',match_transaction_query_row);//한개의 대응내역.
                product_distinct_groupArray[ss]['match_transaction_row']=match_transaction_query_row;

                //console.log('part product idneitiy distinct query rueslttss:',part_product_query_row);

            }
            console.log('respronse reuslt data:',product_distinct_groupArray);
            connection.release();
            return response.json({success:true, message:'product server query success!!', result_data: product_distinct_groupArray});
        }else{
            connection.release();
            return response.json({success:true, message:'product server query susccess!', result_data: []});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//개인,기업회원 내 중개의뢰 리스트.+필터 조건 검색where절조건검색.
router.post('/user_brokerRequestlistview_filter',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    console.log('/user_brokerRequestListview request session store:::>>>>',request.session);

    //try catch문 mysql 구문 실행구조.
    try{
        var user_type=req_body.user_type;

        var maemultype=req_body.maemultype;
        var price=req_body.price;
        var selltype=req_body.seltype;
        var pyeong=req_body.pyeong;

        var maemultypewhere='';
        var pricewhere='';
        var selltypewhere='';
        var pyeongwhere='';

        switch(maemultype){
            case '전체':
                maemultypewhere='';
            break;
            case '아파트':
                maemultypewhere=" and prd_type='아파트'";
            break;
            case '오피스텔':
                maemultypewhere=" and prd_type='오피스텔'";
            break;
            case '상가':
                maemultypewhere=" and prd_type='상가'";
            break;
            case '사무실':
                maemultypewhere=" and prd_type='사무실'";
            break;
        }
        
        switch(price){
            case '전체':
                pricewhere='';
            break;
            case '100만이하':
                pricewhere=selltype=='월세'?' and prd_price < 100':' and prd_price < 100';
            break;
            case '100만~500만':
                pricewhere=selltype=='월세'?' and prd_price >=100 and prd_price <500':' and prd_price >=100 and prd_price <500';
            break;
            case '500만~1000만':
                pricewhere=selltype=='월세'?' and prd_price >=500 and prd_price <1000':' and prd_price >=500 and prd_price <1000';
            break;
            case '1000만~4000만':
                pricewhere=selltype=='월세'?' and prd_price >=1000 and prd_price <4000':' and prd_price >=1000 and prd_price < 4000';
            break;
            case '4000만~1억':
                pricewhere=selltype=='월세'?' and prd_price >=4000 and prd_price <10000':' and prd_price >=4000 and prd_price < 10000';
            break;
            case '1억~3억':
                pricewhere=selltype=='월세'?' and prd_price >=10000 and prd_price <30000':' and prd_price >=10000 and prd_price < 30000';
            break;
            case '3억이상':
                pricewhere=selltype=='월세'?' and prd_price >=30000':' and prd_price >=30000';
            break;
        }
        switch(selltype){
            case '전체':
                selltypewhere='';
            break;
            case '매매':
                selltypewhere=' and prd_sel_type="매매"';
            break;
            case '전세':
                selltypewhere=' and prd_sel_type="전세"';
            break;
            case '월세':
                selltypewhere=' and prd_sel_type="월세"';
            break;
        }
        switch(pyeong){
            case '전체':
                pyeongwhere='';
            break;
            case '10평이하':
                pyeongwhere=" and supply_pyeong < 10";
            break;
            case '10평이상20평이하':
                pyeongwhere=" and supply_pyeong >=10 and supply_pyeong <20";
            break;
            case '20평이상30평이하':
                pyeongwhere=" and supply_pyeong>=20 and supply_pyeong < 30";
            break;
            case '30평이상40평이하':
                pyeongwhere=" and supply_pyeong>=30 and supply_pyeong < 40";
            break;
            case "40평이상":
                pyeongwhere=" and supply_pyeong>=40";
            break;
        }
        if(user_type=='개인'){
            console.log('product filter queryss:','select * from product where request_mem_id='+request.session.user_id+maemultypewhere+pricewhere+selltypewhere+pyeongwhere+ ' group by prd_identity_id');
            var [product_row]=await connection.query('select * from product where request_mem_id='+request.session.user_id+maemultypewhere+pricewhere+selltypewhere+pyeongwhere+ ' group by prd_identity_id',[request.session.user_id]);
            var prd_identity_id_array=[];//임의 회원이 요청한 중개의뢰매물목록들 가져오는데 상태변화에 따라서 여러개 매칭되어가져와질수있는데 groupby로 최초등록된 의뢰내역별prdridientityid별로 가져온다.여기에 조건부 수식을 넣음.
            for(var s=0; s<product_row.length; s++){
                prd_identity_id_array.push(product_row[s].prd_identity_id);//idnetiityid값만을 저장한다.
            }
        }else{

            var [login_userinfo] = await connection.query("select * from user where mem_id=?",[request.session.user_id]);
            var company_id_get=login_userinfo[0].company_id;
            var [first_creater_query] = await connection.query("select * from user where company_id=? and register_type='korex'",[company_id_get]);
            var [sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id_get]);
            console.log('sosok_user listsss:',sosok_userlist);
            var prd_identity_id_array=[];

            var first_id=first_creater_query[0].mem_id;
            var [firstuser_product_row] = await connection.query("select * from product where request_mem_id="+first_id+maemultypewhere+pricewhere+selltypewhere+pyeongwhere+" and request_company_id="+company_id_get+" group by prd_identity_id");

            for(var t=0; t<firstuser_product_row.length; t++){
                prd_identity_id_array.push(firstuser_product_row[t].prd_identity_id);
            }

            for(var u=0; u<sosok_userlist.length; u++){
                let loca_memid=sosok_userlist[u].mem_id;//각 소속유저들memid값.
                console.log('product filter queryss:','select * from product where request_mem_id='+loca_memid+maemultypewhere+pricewhere+selltypewhere+pyeongwhere+ ' and request_company_id= group by prd_identity_id');
                var [product_row]=await connection.query("select * from product where request_mem_id="+loca_memid+maemultypewhere+pricewhere+selltypewhere+pyeongwhere+" and request_company_id="+company_id_get+" group by prd_identity_id",[loca_memid]);
                console.log('===>>>memid별 중개의뢰내역들::',loca_memid,product_row);//해당 각 요청id별로 소속된 회원에 요청한 중개매물별 where조건 붙인것.(매물종류,가격상태,거래타입,평수범위)

                for(var s=0; s<product_row.length; s++){
                    prd_identity_id_array.push(product_row[s].prd_identity_id);
                }
            }
        }
        
        console.log('select query rows results 임의 기업or개인이 의뢰했던 모든 중개의뢰prdiienittiyid 구별 매물내역들.',prd_identity_id_array);//매물유형,가격,판매유형,평범위 조건 만족되는 prdidinetitiy그룹id정보리스트.오리진정보 기준 where절 검색.
        //connection.release();

        if(prd_identity_id_array.length>=1){
            var product_distinct_groupArray=[];

            for(var ss=0; ss<prd_identity_id_array.length; ss++){
                product_distinct_groupArray[ss]={};
                product_distinct_groupArray[ss]['prd_identity_id']=prd_identity_id_array[ss];
                product_distinct_groupArray[ss]['prd_id_history_child']=[];
                var [part_product_query_row]=await connection.query("select * from product where prd_identity_id=? group by prd_identity_id",[prd_identity_id_array[ss]]);

                console.log('part product identity distinct quqery results:',part_product_query_row);//가장 prd_identiytyid별 그룹별아이디 최근origin값
                for(let inner=0; inner<part_product_query_row.length; inner++){
                    product_distinct_groupArray[ss]['prd_id_history_child'][inner] = part_product_query_row[inner];
                }
                var [match_transaction_query_row ] = await connection.query("select * from transaction where prd_identity_id=?",[prd_identity_id_array[ss]]);
                
                console.log('match transactiuonssss:',match_transaction_query_row);//한개의 대응내역.
                product_distinct_groupArray[ss]['match_transaction_row']=match_transaction_query_row;

                //console.log('part product idneitiy distinct query rueslttss:',part_product_query_row);

            }
            console.log('respronse reuslt data:',product_distinct_groupArray);
            connection.release();
            return response.json({success:true, message:'product server query success!!', result_data: product_distinct_groupArray});
        }else{
            connection.release();
            return response.json({success:true, message:'product server query susccess!', result_data: []});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//개인,기업회원 내 중개의뢰 리스트.+필터 조건 검색where절조건검색2
router.post('/user_brokerRequestlistview_filter2',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    console.log('/user_brokerRequestListview2 request session store:::>>>>',request.session);

    //try catch문 mysql 구문 실행구조.
    try{
        var user_type=req_body.user_type;

       var orderby=req_body.orderby;
       var prdstatus=req_body.prdstatus;
       var maemultype=req_body.maemultype;

       var maemultypewhere='';
       var orderbywhere='';
       var prdstatuswhere='';
        switch(maemultype){
            case '전체':
                maemultypewhere='';
            break;
            case '아파트':
                maemultypewhere=" and p.prd_type='아파트'";
            break;
            case '오피스텔':
                maemultypewhere=" and p.prd_type='오피스텔'";
            break;
            case '상가':
                maemultypewhere=" and p.prd_type='상가'";
            break;
            case '사무실':
                maemultypewhere=" and p.prd_type='사무실'";
            break;
        }
        
        switch(prdstatus){
            case '0':
                prdstatuswhere='';
            break;
            case '1':
                prdstatuswhere=' and t.txn_status="검토대기"';
            break;
            case '2':
                prdstatuswhere=' and t.txn_status="검토중"';
            break;
            case '3':
                prdstatuswhere=' and t.txn_status="의뢰철회"';
            break;
            case '4':
                prdstatuswhere=' and t.txn_status="거래준비"';
            break;
            case '5':
                prdstatuswhere=' and t.txn_status="의뢰거절"';
            break;
            case '6':
                prdstatuswhere=' and t.txn_status="거래개시동의요청"'; 
            break;
            case '7':dangi
                prdstatuswhere=' and t.txn_status="거래개시"';
            break;
            case '8':
                prdstatuswhere=' and t.txn_status="거래개시거절"';
            break;
            case '9':
                prdstatuswhere=' and t.txn_status="위임취소"';
            break;
            case '10':
                prdstatuswhere=' and t.txn_status="수임취소"';
            break;
            case '11':
                prdstatuswhere=' and t.txn_status="거래완료동의요청"';
            break;
            case '12':
                prdstatuswhere=' and t.txn_status="거래완료"';
            break;
            case '13':
                prdstatuswhere=' and t.txn_status="거래완료거절"';
            break;
            case '14':
                prdstatuswhere=' and t.txn_status="기한만료"';
            break;
            
        }
        switch(orderby){
            case '상태변경 최신순':
                orderbywhere=' order by t.modify_date desc';
            break;
            case '최신등록순':
                orderbywhere=' order by p.prd_id desc';
            break;
            case '과거등록순':
                orderbywhere=' order by p.prd_id asc';
            break;
            
        }
        
        if(user_type=='개인'){
            console.log('product filter queryss:','select * from product p join transaction t on p.prd_identity_id = t.prd_identity_id where p.request_mem_id='+request.session.user_id+prdstatuswhere+maemultypewhere+ ' group by p.prd_identity_id'+orderbywhere);
            var [product_row]=await connection.query('select * from product p join transaction t on p.prd_identity_id = t.prd_identity_id where p.request_mem_id='+request.session.user_id+prdstatuswhere+maemultypewhere+ ' group by p.prd_identity_id'+orderbywhere,[request.session.user_id]);
            var prd_identity_id_array=[];//임의 회원이 요청한 중개의뢰매물목록들 가져오는데 상태변화에 따라서 여러개 매칭되어가져와질수있는데 groupby로 최초등록된 의뢰내역별prdridientityid별로 가져온다.여기에 조건부 수식을 넣음.
            for(var s=0; s<product_row.length; s++){
                prd_identity_id_array.push(product_row[s].prd_identity_id);//idnetiityid값만을 저장한다.
            }
        }else{

            var [login_userinfo] = await connection.query("select * from user where mem_id=?",[request.session.user_id]);
            var company_id_get=login_userinfo[0].company_id;
            var [first_creater_query] = await connection.query("select * from user where company_id=? and register_type='korex'",[company_id_get]);
            var [sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id_get]);
            console.log('sosok_user listsss:',sosok_userlist);
            var prd_identity_id_array=[];

            var first_id=first_creater_query[0].mem_id;
            var [firstuser_product_row] = await connection.query("select * from product p join transaction t on p.prd_identity_id = t.prd_identity_id where p.request_mem_id="+first_id+prdstatuswhere+maemultypewhere+" and request_company_id="+company_id_get+" group by p.prd_identity_id"+orderbywhere);

            for(var t=0; t<firstuser_product_row.length; t++){
                prd_identity_id_array.push(firstuser_product_row[t].prd_identity_id);
            }

            for(var u=0; u<sosok_userlist.length; u++){
                let loca_memid=sosok_userlist[u].mem_id;//각 소속유저들memid값.
                console.log('product filter queryss:','select * from product p join transaction t on p.prd_identity_id = t.prd_identity_id where p.request_mem_id='+loca_memid+prdstatuswhere+maemultypewhere+ ' group by p.prd_identity_id'+orderbywhere);
                var [product_row]=await connection.query("select * from product p join transaction t on p.prd_identity_id = t.prd_identity_id where p.request_mem_id="+loca_memid+prdstatuswhere+maemultypewhere+" and request_company_id="+company_id_get+" group by p.prd_identity_id"+orderbywhere);
                console.log('===>>>memid별 중개의뢰내역들::',loca_memid,product_row);//해당 각 요청id별로 소속된 회원에 요청한 중개매물별 where조건 붙인것.(매물종류,가격상태,거래타입,평수범위)

                for(var s=0; s<product_row.length; s++){
                    prd_identity_id_array.push(product_row[s].prd_identity_id);
                }
            }
        }
        
        //console.log('select query rows results 임의 기업or개인이 의뢰했던 모든 중개의뢰prdiienittiyid 구별 매물내역들.',prd_identity_id_array);//정렬조건기준, 매물상태값,물건종류에 따른 피러링 관련된 groupid prdiidititiy내역들 기준 정보조회.
        //connection.release();

        if(prd_identity_id_array.length>=1){
            var product_distinct_groupArray=[];

            for(var ss=0; ss<prd_identity_id_array.length; ss++){
                product_distinct_groupArray[ss]={};
                product_distinct_groupArray[ss]['prd_identity_id']=prd_identity_id_array[ss];
                product_distinct_groupArray[ss]['prd_id_history_child']=[];
                var [part_product_query_row]=await connection.query("select * from product where prd_identity_id=? group by prd_identity_id",[prd_identity_id_array[ss]]);

                //console.log('part product identity distinct quqery results:',part_product_query_row);//가장 prd_identiytyid별 그룹별아이디 최근origin값
                for(let inner=0; inner<part_product_query_row.length; inner++){
                    product_distinct_groupArray[ss]['prd_id_history_child'][inner] = part_product_query_row[inner];
                }
                var [match_transaction_query_row ] = await connection.query("select * from transaction where prd_identity_id=?",[prd_identity_id_array[ss]]);
                
                //console.log('match transactiuonssss:',match_transaction_query_row);//한개의 대응내역.
                product_distinct_groupArray[ss]['match_transaction_row']=match_transaction_query_row;

                //console.log('part product idneitiy distinct query rueslttss:',part_product_query_row);

            }
            //console.log('respronse reuslt data:',product_distinct_groupArray);
            connection.release();
            return response.json({success:true, message:'product server query success!!', result_data: product_distinct_groupArray});
        }else{
            connection.release();
            return response.json({success:true, message:'product server query susccess!', result_data: []});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개사회원(전문) 자신에게 의뢰온or 외부수임하여 맡게된 매물리스트 조회(물건과리리스트)
router.post('/BrokerRequest_productlist',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    console.log('/BrokerRequest_productlist request session store:::>>>>',request.session);

    //try catch문 mysql 구문 실행구조.
    try{
        //로그인유저 memid 에 해당하는 (중개사)회원 companyid 고유회사아이디 구한다. 어떤 중개사(companyid)인지 여부 그리고 그를 선임하여 요청한 의뢰상품목록들(products)
        //var [company_id_row] = await connection.query("select * from company2 where reg_user_id=?",[request.session.user_id]);
        var company_id= req_body.company_id;
        console.log('company_id_get:',company_id);

        var [product_row]=await connection.query('select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id group by p.prd_identity_id order by p.prd_id desc');//트랜잭션,프로덕트 조인쿼리 전체 리스트 조회한다. 최근순조회
        //console.log('select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where p.company_id=? group by p.prd_identity_id',[company_id]);
        console.log('speicfy login broker company or(selected brokercompanyid) registered or assgigned productlists:',product_row);
        //connection.release();
        var product_distinct_groupArray=[];
        if(product_row.length>=1){
            for(var ss=0; ss<product_row.length; ss++){
                let company_id_loca = product_row[ss]['company_id'];//요청companyid에 해당하는 매물&트랜잭션 조인리스트 진행. 임의companyid수임매물들 의미.
                if(company_id == company_id_loca){
                    product_distinct_groupArray.push(product_row[ss]);
                }
                
                /*var [part_product_query_row]=await connection.query("select * from product where prd_identity_id=? order by prd_id asc",[product_row[ss].prd_identity_id]);
                for(let inner=0; inner<part_product_query_row.length; inner++){
                    product_distinct_groupArray[ss]['prd_id_history_child'][inner] = part_product_query_row[inner];
                }
                var [match_transaction_query_row] = await connection.query("select * from transaction where prd_identity_id=?",[product_row[ss].prd_identity_id]);
                var matchs_transaction=[];
                for(let ss=0; ss<match_transaction_query_row.length; ss++){
                    matchs_transaction[ss] = match_transaction_query_row[ss]['txn_id'];
                }
                console.log('matchs transacitonsss:',matchs_transaction);
                //var match_transaction_str=matchs_transaction.join(',');
                //var [match_transaction_query_fin] = await connection.query("select * from transaction where txn_id in (?)",[match_transaction_str]);
                //console.log('prdidiednititiy에 해당하는 transaction(최근 상태값여부update최신본):',match_transaction_query_fin);
                //product_distinct_groupArray[ss]['match_transaction_row']=matchs_transaction[0];*/
            }
            console.log('respronse reuslt data:',product_distinct_groupArray);
            connection.release();
            return response.json({success:true, message:'product server query success!!', result_data: product_distinct_groupArray});
        }else{
            connection.release();
            return response.json({success:false, message:'server query parts probilem error!!'});
        }
        /*if(product_row.length>=1){
            return response.json({success:true, message:'product server quer ysucess!',result_data:product_row});
        }else{
            return response.json({success:true, message:'proudct sserver query success',result_data:[]});
        }*/
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개사회원(전문) 자신에게 의뢰온or 외부수임하여 맡게된 매물리스트 조회(물건과리리스트) 필터링.
router.post('/BrokerRequest_productlist_filter',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    console.log('/BrokerRequest_productlist request session store:::>>>>',request.session);

    //try catch문 mysql 구문 실행구조.
    try{
        //로그인유저 memid 에 해당하는 (중개사)회원 companyid 고유회사아이디 구한다. 어떤 중개사(companyid)인지 여부 그리고 그를 선임하여 요청한 의뢰상품목록들(products)
        //var [company_id_row] = await connection.query("select * from company2 where reg_user_id=?",[request.session.user_id]);
        var company_id= req_body.company_id;

        var orderby= req_body.orderby;
        var prdstatus=req_body.txnstatus;
        var prdtype=req_body.prdtype;
        var createorigin=req_body.createorigin;

        var orderbywhere='';
        var prdstatuswhere='';
        var prdtypewhere='';
        var createoriginwhere='';

        switch(orderby){
            case '0':
                orderbywhere=' order by t.modify_date desc';
            break;
            case '1':
                orderbywhere=' order by p.prd_id desc';
            break;
            case '2':
                orderbywhere=' order by p.prd_id asc';
            break;    
        }
        switch(prdstatus){
            case 0:
                prdstatuswhere='';
            break;
            case '1':
                prdstatuswhere='  t.txn_status="검토대기"';
            break;
            case '2':
                prdstatuswhere='  t.txn_status="검토중"';
            break;
            case '3':
                prdstatuswhere='  t.txn_status="의뢰철회"';
            break;
            case '4':
                prdstatuswhere='  t.txn_status="거래준비"';
            break;
            case '5':
                prdstatuswhere='  t.txn_status="의뢰거절"';
            break;
            case '6':
                prdstatuswhere='  t.txn_status="거래개시동의요청"'; 
            break;
            case '7':
                prdstatuswhere='  t.txn_status="거래개시"';
            break;
            case '8':
                prdstatuswhere='  t.txn_status="거래개시거절"';
            break;
            case '9':
                prdstatuswhere='  t.txn_status="위임취소"';
            break;
            case '10':
                prdstatuswhere='  t.txn_status="수임취소"';
            break;
            case '11':
                prdstatuswhere='  t.txn_status="거래완료동의요청"';
            break;
            case '12':
                prdstatuswhere='  t.txn_status="거래완료"';
            break;
            case '13':
                prdstatuswhere='  t.txn_status="거래완료거절"';
            break;
            case '14':
                prdstatuswhere='  t.txn_status="기한만료"';
            break;          
        }
        switch(prdtype){
            case 0:
                prdtypewhere='';
            break;
            case '1':
                prdtypewhere="  p.prd_type='아파트'";
            break;
            case '2':
                prdtypewhere="  p.prd_type='오피스텔'";
            break;
            case '3':
                prdtypewhere="  p.prd_type='상가'";
            break;
            case '4':
                prdtypewhere="  p.prd_type='사무실'";
            break;
        }
        switch(createorigin){
            case 0:
                createoriginwhere = "";
            break;
            case '1':
                createoriginwhere = "  p.prd_create_origin='중개의뢰'";
            break;
            case '2':
                createoriginwhere = "  p.prd_create_origin='외부수임'";
            break;
        }
        console.log('company_id_get:',company_id);

        if(prdtypewhere=='' && createoriginwhere=='' && prdstatuswhere==''){
            console.log('select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id'+prdtypewhere+prdstatuswhere+createoriginwhere+' group by p.prd_identity_id'+orderbywhere);
            var [product_row]=await connection.query('select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id'+prdtypewhere+prdstatuswhere+createoriginwhere+' group by p.prd_identity_id'+orderbywhere);//트랜잭션,프로덕트 조인쿼리 전체 리스트 조회한다.+필터조건. 필터조건을 만족하면서도(정렬처리,txnstatus상태값,매물종류,생성요인)만족하면서도+companyid조건 만족하는것.정렬순서 나열된 전체 순서그대로. 루프돌면서 companyid매칭되어져 나타나는 그 순서는 동일할것임.    
        }else{
            console.log('select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where'+(prdtypewhere?prdtypewhere:'')+(prdtypewhere&&prdstatuswhere?' and'+prdstatuswhere:prdstatuswhere)+( (prdtypewhere || prdstatuswhere) && createoriginwhere?' and'+createoriginwhere:createoriginwhere)+' group by p.prd_identity_id'+orderbywhere);
            var [product_row]=await connection.query('select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where'+(prdtypewhere?prdtypewhere:'')+(prdtypewhere&&prdstatuswhere?' and'+prdstatuswhere:prdstatuswhere)+( (prdtypewhere || prdstatuswhere) && createoriginwhere?' and'+createoriginwhere:createoriginwhere)+' group by p.prd_identity_id'+orderbywhere);//트랜잭션,프로덕트 조인쿼리 전체 리스트 조회한다.+필터조건. 필터조건을 만족하면서도(정렬처리,txnstatus상태값,매물종류,생성요인)만족하면서도+companyid조건 만족하는것.정렬순서 나열된 전체 순서그대로. 루프돌면서 companyid매칭되어져 나타나는 그 순서는 동일할것임.       
        }
        
        //console.log('select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where p.company_id=? group by p.prd_identity_id',[company_id]);
        //console.log('speicfy login broker company or(selected brokercompanyid) registered or assgigned productlists:',product_row);
        //connection.release();
        var product_distinct_groupArray=[];
        console.log('product rowsss::',product_row);
        if(product_row.length>=1){
            for(var ss=0; ss<product_row.length; ss++){
                let company_id_loca = product_row[ss]['company_id'];//요청companyid에 해당하는 매물&트랜잭션 조인리스트 진행. 임의companyid수임매물들 의미.
                if(company_id == company_id_loca){
                    product_distinct_groupArray.push(product_row[ss]);
                }
                
                /*var [part_product_query_row]=await connection.query("select * from product where prd_identity_id=? order by prd_id asc",[product_row[ss].prd_identity_id]);
                for(let inner=0; inner<part_product_query_row.length; inner++){
                    product_distinct_groupArray[ss]['prd_id_history_child'][inner] = part_product_query_row[inner];
                }
                var [match_transaction_query_row] = await connection.query("select * from transaction where prd_identity_id=?",[product_row[ss].prd_identity_id]);
                var matchs_transaction=[];
                for(let ss=0; ss<match_transaction_query_row.length; ss++){
                    matchs_transaction[ss] = match_transaction_query_row[ss]['txn_id'];
                }
                console.log('matchs transacitonsss:',matchs_transaction);
                //var match_transaction_str=matchs_transaction.join(',');
                //var [match_transaction_query_fin] = await connection.query("select * from transaction where txn_id in (?)",[match_transaction_str]);
                //console.log('prdidiednititiy에 해당하는 transaction(최근 상태값여부update최신본):',match_transaction_query_fin);
                //product_distinct_groupArray[ss]['match_transaction_row']=matchs_transaction[0];*/
            }
            //console.log('respronse reuslt data:',product_distinct_groupArray);
            connection.release();
            return response.json({success:true, message:'product server query success!!', result_data: product_distinct_groupArray});
        }else{
            connection.release();
            return response.json({success:true, message:'product result empty set!!!', result_data:product_distinct_groupArray});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개사회원(전문) 자신에게 의뢰온or 외부수임하여 맡게된 매물리스트 조회(물건과리리스트) 검색한 건물명or의뢰인명 관련된 리스트조회.
router.post('/BrokerRequest_productlist_filter2',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    console.log('/BrokerRequest_productlist request session store:::>>>>',request.session);

    //try catch문 mysql 구문 실행구조.
    try{
        //로그인유저 memid 에 해당하는 (중개사)회원 companyid 고유회사아이디 구한다. 어떤 중개사(companyid)인지 여부 그리고 그를 선임하여 요청한 의뢰상품목록들(products)
        //var [company_id_row] = await connection.query("select * from company2 where reg_user_id=?",[request.session.user_id]);
        var company_id= req_body.company_id;
        console.log('company_id_get:',company_id);

        var search_keyword_val = req_body.search_keyword_val;//검색어에 따른.
        console.log("select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where (prd_name like '%"+search_keyword_val+"%' or request_mem_name like '%"+search_keyword_val+"%') group by p.prd_identity_id");
        var [product_row]=await connection.query("select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where (prd_name like '%"+search_keyword_val+"%' or request_mem_name like '%"+search_keyword_val+"%') group by p.prd_identity_id");//트랜잭션,프로덕트 조인쿼리 전체 리스트 조회한다.관련된 상품,트랜잭션 조인 리스트 (검색조건에 맞는)prdname or requestmananme 조건에 해당하는 조건들 관련 리스트 전체.이중에 companyid조건들.
        //console.log('select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where p.company_id=? group by p.prd_identity_id',[company_id]);
        //console.log('speicfy login broker company or(selected brokercompanyid) registered or assgigned productlists:',product_row);
        //connection.release();
        
        var product_distinct_groupArray=[];
        console.log('productd rosssswsss::',product_row);
        if(product_row.length>=1){
            for(var ss=0; ss<product_row.length; ss++){
                let company_id_loca = product_row[ss]['company_id'];//요청companyid에 해당하는 매물&트랜잭션 조인리스트 진행. 임의companyid수임매물들 의미.
                if(company_id == company_id_loca){
                    product_distinct_groupArray.push(product_row[ss]);
                }
                
                /*var [part_product_query_row]=await connection.query("select * from product where prd_identity_id=? order by prd_id asc",[product_row[ss].prd_identity_id]);
                for(let inner=0; inner<part_product_query_row.length; inner++){
                    product_distinct_groupArray[ss]['prd_id_history_child'][inner] = part_product_query_row[inner];
                }
                var [match_transaction_query_row] = await connection.query("select * from transaction where prd_identity_id=?",[product_row[ss].prd_identity_id]);
                var matchs_transaction=[];
                for(let ss=0; ss<match_transaction_query_row.length; ss++){
                    matchs_transaction[ss] = match_transaction_query_row[ss]['txn_id'];
                }
                console.log('matchs transacitonsss:',matchs_transaction);
                //var match_transaction_str=matchs_transaction.join(',');
                //var [match_transaction_query_fin] = await connection.query("select * from transaction where txn_id in (?)",[match_transaction_str]);
                //console.log('prdidiednititiy에 해당하는 transaction(최근 상태값여부update최신본):',match_transaction_query_fin);
                //product_distinct_groupArray[ss]['match_transaction_row']=matchs_transaction[0];*/
            }
            //console.log('respronse reuslt data:',product_distinct_groupArray);
            connection.release();
            return response.json({success:true, message:'product server query success!!', result_data: product_distinct_groupArray});
        }else{
            connection.release();
            return response.json({success:true, message:'product server query success!! but results is empty', result_data: product_distinct_groupArray});
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});

//해당 prd_identity_id에 해당하는 특정요청 의뢰매물에 대한 뷰확인.
router.post('/brokerRequest_productview',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    //try catch문 mysql 구문 실행구조.
    try{

        var [brokerRequest_product_query_row]=await connection.query("select * from product where prd_identity_id=? order by prd_id asc",[req_body.prd_identity_idval]);

        console.log('brokerReuqest speicfy target query row:',brokerRequest_product_query_row);
        var get_company_id= brokerRequest_product_query_row[0].company_id;//해당 관련된 모든 내역들 모두 같은 정보들을 갖고있고(같은 신청 선임전문중개사참조)
        var prdtype_val = brokerRequest_product_query_row[0].prd_type;//매물타입 아파트,오피,상가,사무실 (아파트,오피인경우에만 bldid,floor,hosil모두 존재)
        if(prdtype_val =='아파트' || prdtype_val =='오피스텔'){
            var dong_buildings_val = brokerRequest_product_query_row[0].bld_id;//건물id 동건물id를 구한다.bldid >>해당 동건물의 소속 단지를 구한다.
            var [buildings_info_query] = await connection.query("select * from buildings where bld_id=?",[dong_buildings_val]);
            var complex_id_val = buildings_info_query[0].complex_id;
            var [complex_info_query] = await connection.query("select * from complex where complex_id=?",[complex_id_val]);//단지 및 동정보 리턴??몇동이며,건물id번호값,지상총층,지하총층,소속단지id등 , 단지정보.
        }
        var [probroker_info_query] = await connection.query("select cp.*, prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from company2 cp join pro_realtor_permission prp on cp.company_id=prp.company_id left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where cp.company_id=? and cp.is_pro=1 and prp.permission_state='승인' order by prp_id desc",[get_company_id]);
        
        //await connection.beginTransaction();
        //var [products_update_rows] = await connection.query('update product set where prd_identitiy')
        connection.release();

        if(prdtype_val == '아파트' || prdtype_val =='오피스텔'){
            return response.json({success:true, message:'product server query success!!', result_data: brokerRequest_product_query_row, probroker_match:probroker_info_query, building_dong_info: buildings_info_query, complex_info : complex_info_query});  
        }else{
            return response.json({success:true, message:'product server query success!!', result_data: brokerRequest_product_query_row, probroker_match:probroker_info_query});  
        }
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//해당 prd_identity_id에 특정매물수정.내중개의뢰매물수정.
router.post('/user_brokerRequest_modifyProcess',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    //try catch문 mysql 구문 실행구조.
    try{
        var prd_identity_id = req_body.prd_identity_id;//해당prdidneitityid값에 대한 조회 결과내역중에서 가장 최근에 수정insert된 내역에 대한 정보조회.
        var [lastest_prdhistory_info]=await connection.query("select * from product_modify_history2 where prd_identity_id=? order by pmh_id desc",[prd_identity_id]);//가장 최근 매물수정정보 inserted
        if(lastest_prdhistory_info.length>=1){
            var company_id=lastest_prdhistory_info[0].company_id;
            var prd_img=lastest_prdhistory_info[0].prd_img;
            var prd_name=lastest_prdhistory_info[0].prd_name;
            var prd_imgs=lastest_prdhistory_info[0].prd_imgs;
            var prd_type=lastest_prdhistory_info[0].prd_type;
            var prd_sel_type=lastest_prdhistory_info[0].prd_sel_type;
            var prd_price=lastest_prdhistory_info[0].prd_price;
            var prd_month_price=lastest_prdhistory_info[0].prd_month_price;
            var prd_status=lastest_prdhistory_info[0].prd_status;
            var prd_latitude=lastest_prdhistory_info[0].prd_latitude;
            var prd_longitude=lastest_prdhistory_info[0].prd_longitude;
            var exclusive_status=lastest_prdhistory_info[0].exclusive_status;
            var exclusive_start_date=lastest_prdhistory_info[0].exclusive_start_date;
            var exclusive_end_date=lastest_prdhistory_info[0].exclusive_end_date;
            var addr_detail=lastest_prdhistory_info[0].addr_detail;
            var supply_area=lastest_prdhistory_info[0].supply_area;
            var exclusive_area=lastest_prdhistory_info[0].exclusive_area;
            var floor = lastest_prdhistory_info[0].floor;
            var direction=lastest_prdhistory_info[0].direction;
            var bathroom_count=lastest_prdhistory_info[0].bathroom_count;
            var room_count=lastest_prdhistory_info[0].room_count;
            var room_type=lastest_prdhistory_info[0].room_type;
            var heat_method_type=lastest_prdhistory_info[0].heat_method_type;
            var heat_fuel_type=lastest_prdhistory_info[0].heat_fuel_type;
            var is_parking=lastest_prdhistory_info[0].is_parking;
            var is_toilet=lastest_prdhistory_info[0].is_toilet;
            var is_interior=lastest_prdhistory_info[0].is_interior;
            var is_elevator=lastest_prdhistory_info[0].is_elevator;
            var request_mem_id=lastest_prdhistory_info[0].request_mem_id;
            var prd_create_origin=lastest_prdhistory_info[0].prd_create_origin;
            var request_mem_name=lastest_prdhistory_info[0].request_mem_name;
            var request_mem_phone=lastest_prdhistory_info[0].request_mem_phone;
            var managecost=lastest_prdhistory_info[0].managecost;
            var is_immediate_ibju=lastest_prdhistory_info[0].is_immediate_ibju;
            var ibju_specifydate=lastest_prdhistory_info[0].ibju_specifydate;
            var is_duplex_floor=lastest_prdhistory_info[0].is_duplex_floor;
            var parking_option=lastest_prdhistory_info[0].parking_option;
            var is_pet=lastest_prdhistory_info[0].is_pet;
            var entrance=lastest_prdhistory_info[0].entrance;
            var ismanagement = lastest_prdhistory_info[0].ismanagement;

            var space_option=lastest_prdhistory_info[0].space_option;
            var prd_option=lastest_prdhistory_info[0].prd_option;

            var security_option=lastest_prdhistory_info[0].security_option;
            var is_contract_renewal=lastest_prdhistory_info[0].is_contract_renewal;
            var loanprice=lastest_prdhistory_info[0].loanprice;
            var month_base_guaranteeprice=lastest_prdhistory_info[0].month_base_guranteeprice;
            var prd_description=lastest_prdhistory_info[0].prd_description;
            var prd_description_detail=lastest_prdhistory_info[0].prd_description_detail;
            var exclusive_pyeong=lastest_prdhistory_info[0].exclusive_pyeong;
            var supply_pyeong=lastest_prdhistory_info[0].supply_pyeong;
            var exclusive_periods=lastest_prdhistory_info[0].exclusive_periods;
            var include_managecost=lastest_prdhistory_info[0].mangaecostincludes;
            var bld_id=lastest_prdhistory_info[0].bld_id;
            var ho_id=lastest_prdhistory_info[0].ho_id;
            var addr_jibun=lastest_prdhistory_info[0].addr_jibun;
            var addr_road=lastest_prdhistory_info[0].addr_road;
            var request_message=lastest_prdhistory_info[0].request_message;
            var prdstatus_generator=lastest_prdhistory_info[0].prdstatus_generator;
            var prdstatus_change_reason=lastest_prdhistory_info[0].prdstatus_change_reason;
            var room_structure=lastest_prdhistory_info[0].room_structure;
            var is_double=lastest_prdhistory_info[0].is_double;
            var is_current_biz_job=lastest_prdhistory_info[0].is_current_biz_job;
            var current_biz_job=lastest_prdhistory_info[0].current_biz_job;
            var storeoffice_building_totalfloor=lastest_prdhistory_info[0].storeoffice_building_totalfloor;
            var dong_name=lastest_prdhistory_info[0].dong_name;
            var floorname=lastest_prdhistory_info[0].floorname;
            var ho_name=lastest_prdhistory_info[0].ho_name;
            var floorint=lastest_prdhistory_info[0].floorint;

            var is_rightprice=lastest_prdhistory_info[0].is_rightprice;
            
        }else{
            //modfiy수정내여 정보가 없는 처음 수정의 경우or데이터가 없던 경우엔 product테이블에서의 정보 가져온다.[0]정보 가져옴.
            var [lastest_prd_info]=await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);
            var company_id=lastest_prd_info[0].company_id;
            var prd_img=lastest_prd_info[0].prd_img;
            var prd_name=lastest_prd_info[0].prd_name;
            var prd_imgs=lastest_prd_info[0].prd_imgs;
            var prd_type=lastest_prd_info[0].prd_type;
            var prd_sel_type=lastest_prd_info[0].prd_sel_type;
            var prd_price=lastest_prd_info[0].prd_price;
            var prd_month_price=lastest_prd_info[0].prd_month_price;
            var prd_status=lastest_prd_info[0].prd_status;
            var prd_latitude=lastest_prd_info[0].prd_latitude;
            var prd_longitude=lastest_prd_info[0].prd_longitude;
            var exclusive_status=lastest_prd_info[0].exclusive_status;
            var exclusive_start_date=lastest_prd_info[0].exclusive_start_date;
            var exclusive_end_date=lastest_prd_info[0].exclusive_end_date;
            var addr_detail=lastest_prd_info[0].addr_detail;
            var supply_area=lastest_prd_info[0].supply_area;
            var exclusive_area=lastest_prd_info[0].exclusive_area;
            var floor = lastest_prd_info[0].floor;
            var direction=lastest_prd_info[0].direction;
            var bathroom_count=lastest_prd_info[0].bathroom_count;
            var room_count=lastest_prd_info[0].room_count;
            var room_type=lastest_prd_info[0].room_type;
            var heat_method_type=lastest_prd_info[0].heat_method_type;
            var heat_fuel_type=lastest_prd_info[0].heat_fuel_type;
            var is_parking=lastest_prd_info[0].is_parking;
            var is_toilet=lastest_prd_info[0].is_toilet;
            var is_interior=lastest_prd_info[0].is_interior;
            var is_elevator=lastest_prd_info[0].is_elevator;
            var request_mem_id=lastest_prd_info[0].request_mem_id;
            var prd_create_origin=lastest_prd_info[0].prd_create_origin;
            var request_mem_name=lastest_prd_info[0].request_mem_name;
            var request_mem_phone=lastest_prd_info[0].request_mem_phone;
            var managecost=lastest_prd_info[0].managecost;
            var is_immediate_ibju=lastest_prd_info[0].is_immediate_ibju;
            var ibju_specifydate=lastest_prd_info[0].ibju_specifydate;
            var is_duplex_floor=lastest_prd_info[0].is_duplex_floor;
            var parking_option=lastest_prd_info[0].parking_option;
            var is_pet=lastest_prd_info[0].is_pet;
            var entrance=lastest_prd_info[0].entrance;

            var ismanagement=lastest_prd_info[0].is_managecost;

            var prd_option=lastest_prd_info[0].prd_option;
            var space_option=lastest_prd_info[0].space_option;
            var is_rightprice=lastest_prd_info[0].is_rightprice;

            var security_option=lastest_prd_info[0].security_option;
            var is_contract_renewal=lastest_prd_info[0].is_contract_renewal;
            var loanprice=lastest_prd_info[0].loanprice;
            var month_base_guaranteeprice=lastest_prd_info[0].month_base_guaranteeprice;
            var prd_description=lastest_prd_info[0].prd_description;
            var prd_description_detail=lastest_prd_info[0].prd_description_detail;
            var exclusive_pyeong=lastest_prd_info[0].exclusive_pyeong;
            var supply_pyeong=lastest_prd_info[0].supply_pyeong;
            var exclusive_periods=lastest_prd_info[0].exclusive_periods;
            var include_managecost=lastest_prd_info[0].include_managecost;
            var bld_id=lastest_prd_info[0].bld_id;
            var ho_id=lastest_prd_info[0].ho_id;
            var addr_jibun=lastest_prd_info[0].addr_jibun;
            var addr_road=lastest_prd_info[0].addr_road;
            var request_message=lastest_prd_info[0].request_message;
            var prdstatus_generator=lastest_prd_info[0].prdstatus_generator;
            var prdstatus_change_reason=lastest_prd_info[0].prdstatus_change_reason;
            var room_structure=lastest_prd_info[0].room_structure;
            var is_double=lastest_prd_info[0].is_double;
            var is_current_biz_job=lastest_prd_info[0].is_current_biz_job;
            var current_biz_job=lastest_prd_info[0].current_biz_job;
            var storeoffice_building_totalfloor=lastest_prd_info[0].storeoffice_building_totalfloor;
            var dong_name=lastest_prd_info[0].dong_name;
            var floorname=lastest_prd_info[0].floorname;
            var ho_name=lastest_prd_info[0].ho_name;
            var floorint=lastest_prd_info[0].floorint;
        }
        //갱신되는 정보값들에 대해서만 바뀔것이고, 그렇지 않은값은 기존값 그대로 update insert
        prd_name = req_body.maemulname;//매물명
        exclusive_periods= req_body.exclusive_periods;//전속기간
        var usetype = req_body.usetype;//사용타입.
        is_current_biz_job=req_body.job;//상가 업종여부
        current_biz_job=req_body.jobtype;//상가 업종
        exclusive_area = req_body.jeonyongdimension;//전용면적
        exclusive_pyeong=req_body.jeonyongpyeong;//전용면적평
        supply_area=req_body.supplydimension;//공급면적
        supply_pyeong=req_body.supplypyeong;//공급면적평
        prd_sel_type=req_body.selltype;//판매타입
        prd_price=req_body.sellprice;//판매가격(매매가,전월세보증급값.)
        month_base_guaranteeprice=0;//기보증금월세
        prd_month_price=req_body.monthly;//월세가격

        managecost=req_body.managecost;//관리비
        include_managecost=req_body.manageincludes;//관리비포함항목
        is_immediate_ibju=req_body.is_immediate_ibju;//입주즉시여부
        ibju_specifydate=req_body.ibju_specifydate;//입주일
        request_message=req_body.request_message;//요청메시지
        is_rightprice= req_body.isrightprice;
        ismanagement= req_body.ismangement;

        if(prd_sel_type!='월세'){
            month_base_guaranteeprice = 0;
            prd_month_price=0;
        }

        //target productssss..
        var [target_product_query] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);
        var target_prdid=target_product_query[0].prd_id;
        console.log('관련 수정 대상 product들 :',target_prdid);//해다아 가장 첫origin의 product녀석 수정.

        var now_year=new Date().getFullYear();
        var now_month=new Date().getMonth()+1;
        var now_date=new Date().getDate();
        if(now_month < 10){
            now_month = '0'+now_month;
        }
        if(now_date < 10){
            now_date = '0'+now_date;
        }
        var now_date_val=now_year+'-'+now_month+'-'+now_date;
       
        console.log('month-base_guratnteeprices:',month_base_guaranteeprice);

        //product테이블 변경수정.update
        await connection.beginTransaction();
        var update_match_product_query="update product set prd_name='"+prd_name+"',exclusive_periods="+exclusive_periods+",exclusive_area="+exclusive_area+",exclusive_pyeong="+exclusive_pyeong+",supply_area="+supply_area+",supply_pyeong="+supply_pyeong+",prd_sel_type='"+prd_sel_type+"',prd_price="+prd_price+",prd_month_price="+prd_month_price+",month_base_guaranteeprice="+month_base_guaranteeprice+",managecost="+managecost+",include_managecost='"+include_managecost+"',is_immediate_ibju="+is_immediate_ibju+",ibju_specifydate='"+ibju_specifydate+"',request_message='"+request_message+"',modify_date='"+now_date_val+"',is_current_biz_job='"+is_current_biz_job+"',current_biz_job='"+current_biz_job+"',prd_usage='"+usetype+"', is_rightprice='"+is_rightprice+"',is_managecost='"+ismanagement+"' where prd_id="+target_prdid;
        console.log('update match product query:',update_match_product_query);
        var [update_match_product_query]=await connection.query(update_match_product_query);
        await connection.commit();
        
        //target transacitonsss
        var target_transactions=[];
        var [target_transaction_query] = await connection.query("select * from transaction where prd_identity_id=?",[prd_identity_id]);//그냥 그 한개이다.
        for(let ss=0; ss<target_transaction_query.length; ss++){
            target_transactions[ss]=target_transaction_query[ss].txn_id;//해당 transaction내역 한개 txn_id에 해당하는 id값.
        }
        var target_transaction_ids=target_transactions.join(',');
        console.log('관련수정대상 transciton:',target_transaction_ids);

        //상태변화에 따라 product테이블은수정만 되고, 테이블 prdidientity공통으로 해서 내역 insert된다. 그 내역들에 해당되었던것들(상태변경에 따른 히스토리내역들)의 타입을 관련 수정한다. 판매타입변경.수정 일괄수정.
        await connection.beginTransaction();
        var [transaction_match_updatequery] = await connection.query('update transaction set modify_date=?,txn_order_type=? where txn_id in (?)',[new Date(),prd_sel_type, target_transaction_ids]);//물건수정시엔 주로 바뀌는게 판매타입(월세,전세,매매)드이 바뀐다.
        console.log('update transacton match product query:',transaction_match_updatequery);
        await connection.commit();

         //product modfiy history insert querysss..
        await connection.beginTransaction();
        var [productmodifyhistory_insertquery] = await connection.query("insert into product_modify_history2(prd_identity_id,company_id,prd_name,prd_img,prd_imgs,prd_type,prd_sel_type,prd_price,prd_month_price,prd_status,prd_latitutde,prd_longitude,exclusive_status,exclusive_start_date,exclusive_end_date,addr_detail,supply_area,exclusive_area,floor,direction,bathromm_count,room_count,room_type,heat_method_type,heat_fuel_type,is_parking,is_toilet,is_interior,is_elevator,request_mem_id,prd_create_origin,request_mem_name,request_mem_phone,managecost,is_immediate_ibju,ibju_specifydate,is_duplex_floor,parking_option,is_pet,entrance,space_option,security_option,is_contract_renewal,loanprice,prd_description,prd_description_detail,exclusive_pyeong,supply_pyeong,exclusive_periods,mangaecostincludes,bld_id,ho_id,addr_jibun,addr_road,request_message,prdstatus_generator,prdstatus_change_reason,room_structure,is_double,is_current_biz_job,current_biz_job,storeoffice_building_totalfloor,dong_name,floorname,ho_name,floorint,prd_usage,create_date,modify_date,history_type,is_rightprice,is_managecost) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[prd_identity_id,company_id,prd_name,prd_img,prd_imgs,prd_type,prd_sel_type,prd_price,prd_month_price,prd_status,prd_latitude,prd_longitude,exclusive_status,exclusive_start_date,exclusive_end_date,addr_detail,supply_area,exclusive_area,floor,direction,bathroom_count,room_count,room_type,heat_method_type,heat_fuel_type,is_parking,is_toilet,is_interior,is_elevator,request_mem_id,prd_create_origin,request_mem_name,request_mem_phone,managecost,is_immediate_ibju,ibju_specifydate,is_duplex_floor,parking_option,is_pet,entrance,space_option,security_option,is_contract_renewal,loanprice,prd_description,prd_description_detail,exclusive_pyeong,supply_pyeong,exclusive_periods,include_managecost,bld_id,ho_id,addr_jibun,addr_road,request_message,prdstatus_generator,prdstatus_change_reason,room_structure,is_double,is_current_biz_job,current_biz_job,storeoffice_building_totalfloor,dong_name,floorname,ho_name,floorint,usetype,new Date(),new Date(),'매물수정',is_rightprice,ismanagement]);
        console.log('update tranasctionhistory match product query::',productmodifyhistory_insertquery);
        await connection.commit();

        connection.release();

        return response.json({success:true, message:'product ,transicon,tarnacthistoy modify server query success!!'});      
        
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//지도페이지 매물리스트->매물상세 조회시에.
router.post('/brokerproduct_detailinfo_get',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    //try catch문 mysql 구문 실행구조.
    try{
        var id = req_body.click_id;
        var type = req_body.temp_type;
        var mem_id  =  req_body.mem_id;
        if(type == 'dummy'){
            //그 특정 더미매물 하나에 대한 정보를 보여준다.
            var [brokerRequest_product_query_row]=await connection.query("select * from product where prd_id=? and prd_name='더미매물'",[id]);

        }else if(type == 'standard'){
            /*var [brokerRequest_product_query_row]=await connection.query("select p.company_id as p_company_id,p.prd_name as p_prd_name, p.prd_img as p_prd_img, p.prd_imgs as p_prd_imgs , p.prd_type as p_prd_type, p.prd_sel_type as p_prd_sel_type, p.prd_price p_prd_price , p.prd_month_price as p_prd_month_price,p.prd_latitude as p_prd_latitude,p.prd_longitude as p_prd_longitude, p.exclusive_start_date as exculsive_start_date, p.exclusive_end_date as exculsive_end_date, p.addr_detail as p_addr_detail, p.supply_area as p_supply_area, p.exclusive_area as p_exclusive_area, p.direction as p_direction, p.bathroom_count as bathroom_count, p.room_count as room_count, p.heat_method_type as heat_method_type, p.heat_fuel_type as heat_fuel_type, p.managecost as managecost, p.is_immediate_ibju as is_immediate_ibju, p.ibju_specifydate as ibju_specifydate, p.entrance as entrance,p.apartspace_option as apartspace_option,p.space_option as space_option, p.is_contract_renewal as is_contract_renewal, p.loanprice as loanprice, p.month_base_guaranteeprice as month_base_guaranteeprice, p.prd_description as prd_description, p.prd_description_detail as prd_description_detail,p.include_managecost as include_managecost, p.bld_id as bld_id, p.ho_id as ho_id, p.addr_jibun as p_addr_jibun, p.addr_road as p_addr_road , bd.bld_id as bd_bld_id, bd.dong_name as bld_dong_name, bd.grd_floor as grd_floor, bd.udgrd_floor as udgrd_floor, c.complex_name as complex_name, c.dong_cnt as dong_cnt, c.addr_jibun as c_addr_jibun, c.addr_road as c_addr_road, c.approval_date as approval_date, c.total_parking_cnt as total_parking_cnt,c.household_cnt as household_cnt, cp.company_name as company_name, cp.addr_jibun as cp_addr_jibun, cp.addr_road as cp_addr_road, cp.x as cp_x, cp.y as cp_y from product p join buildings bd on p.bld_id=bd.bld_id join complex c on bd.complex_id=c.complex_id join company2 cp on p.company_id=cp.company_id where prd_identity_id=? order by prd_id desc",[id]);//해당 그룹prdid에 대해 서 수정된 내역중가장 최근것 보여줘야한다.(가장 최근 매물수정된 내역)*/
            
            var [broker_productquery] = await connection.query(`select  (select count(*) from likes li where p.prd_id = li.prd_identity_id and li.mem_id='${mem_id}') as isLike, p.* from product p where p.prd_id=?`,[id]);
            var broker_product_companyid= broker_productquery[0].company_id;//그 특정매물을 맡고있는 수임사업체 중개사회사id값.
            var [probroker_infoquery] = await connection.query("select cp.*, prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from company2 cp join pro_realtor_permission prp on cp.company_id=prp.company_id left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where cp.company_id=? and cp.is_pro=1 and prp.permission_state='승인' order by prp_id desc",broker_product_companyid);//임의의 중개사companyid회사의 전문중개사 승인된 내역들중 가장 최근에 승인된상태값인 전문중개사값 조회.가장 최근에 승인되어있는 전문중개사의 전문종목등의 쿼리정보값.
            var [probroker_asign_products] = await connection.query("select distinct prd_id from product where company_id=?",[broker_product_companyid]);
            console.log('관련 수임중개사의 수임다른 매물들정보들::',probroker_asign_products);
            var prd_identity_id_array=[];
            for(var s=0; s<probroker_asign_products.length; s++){
                prd_identity_id_array.push(probroker_asign_products[s].prd_id);
            }
            console.log('select query orwsss reusltss 모든 숭임매물내역들::',prd_identity_id_array);

            if(prd_identity_id_array.length >=1){
                var match_transaction_list=[];
                for(var ss=0;ss<prd_identity_id_array.length; ss++){
                    var [match_transaction_query] = await connection.query("select * from product p join transaction t on p.prd_id=t.prd_identity_id where p.prd_id=? and t.txn_status='거래개시' and ((p.exclusive_start_date is null or p.exclusive_end_date is null) or (p.exclusive_start_date <= date_format(now(),'%Y-%m-%d') and p.exclusive_end_date >= date_format(now(),'%Y-%m-%d')) )",[prd_identity_id_array[ss]]);//각 수임매물id별 매칭되는 transaciton정보 거래개시상태값에 해당하는 각 prdieintityi값 정보.
                    //var [match_product_query_origin] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id_array[ss]]);

                    //var transaction_status=match_transaction_query[0].txn_status;
                    //var store_object={};
                    //store_object['transaction_status'] = transaction_status;
                    //store_object['match_product'] = match_product_query_origin[0];
                    if(match_transaction_query&&match_transaction_query[0]){
                        match_transaction_list.push(match_transaction_query[0]);//매칭되는 거래개시정보값이 있는경우.
                    }         
                }
                console.log('해당 매물을 맡고있는 전문중개사으 ㅣ수임매물들 전체 리스트 자료구조:',match_transaction_list);
            }else{
                var match_transaction_list=[];//수임매물내역자체가 없는 ? 전문중개사이거나, 그 수임매물들에 대한 정보가 없는경우.
            }

            //prdtype 아파트,오피스텔이라면 complex, budilings,floor정보 모두존재,hosil정보랑. 
            var prdtype=broker_productquery[0].prd_type;
            if(prdtype =='아파트' || prdtype=='오피스텔'){
                
                var bld_id= broker_productquery[0].bld_id;//선택한 동건물에 대한 저보.
                var [building_info] = await connection.query("select * from buildings where bld_id=?",[bld_id]);
                
                var complex_id = building_info[0].complex_id;
                
                var [complex_info] = await connection.query("select * from complex where complex_id=?",[complex_id]);
                
                var flr_id = broker_productquery[0].floor;
                
                var [floor_info]=await connection.query("select * from floor where flr_id=?",[flr_id]);
                var floor_value = floor_info[0] && floor_info[0].flr_type +' '+ floor_info[0] && floor_info[0].floor;
                
            }else{
                /*var pro_addr_jibun=broker_productquery[0].addr_jibun;
                var pro_addr_road=broker_productquery[0].addr_road;
                //매물로 등록한 상가,사무실의 도로명주소, 지번주소 검색 도로명 먼저 검색..

                var [match_floor_query] = await connection.query("select * from floor where addr_road=?",[pro_addr_road]);
                var matching_floors=[];
                for(let s=0; s<match_floor_query.length; s++){
                    let floor_item=match_floor_query[s];
                    if(floor_item.addr_jibun == pro_addr_jibun && floor_item.flr_type=='지상'){
                        matching_floors.push(floor_item['floor']);//내역들중에서 매칭 지번주소인 내역들중에서 지상인 층들만 내역들만 구하고 그중 가장큰 floor값이 곧 최고층을 최고지상층을 의미하고 그게 그 floors를 이루는 건물의 총층이라고한다.
                    }
                }
                var max_floor = Math.max.apply(null,matching_floors);*/
                var flr_id = broker_productquery[0].floor;
                
                var [floor_info]=await connection.query("select * from floor where flr_id=?",[flr_id]);
                var floor_value = floor_info[0] && floor_info[0].flr_type +' '+ floor_info[0] && floor_info[0].floor;                          
            }           
        }
        
        connection.release();

        console.log('brokerReuqest speicfy target query row:',broker_productquery,probroker_infoquery,prdtype, building_info,complex_info,floor_info,floor_value);

        return response.json({success:true, message:'product server query success!!', result_data: { productinfo:broker_productquery, probrokerinfo:probroker_infoquery, prdtype:prdtype, buildinginfo : building_info, complexinfo:complex_info, floorinfo:floor_info, floorvalue:floor_value, probroker_asign_products:match_transaction_list} });  
                
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});

//중개사가 중개의뢰온 매물상품에 대해서 확인하고 수정할시에 실행.중개사회원>물건수정
router.post('/brokerRequest_productconfirmupdate',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    //try catch문 mysql 구문 실행구조.
    try{

        //var [brokerRequest_product_query_row]=await connection.query("select * from product where prd_identity_id=? and company_id=? order by prd_id desc",[req_body.prdidentityid,req_body.companyid]);

       //console.log('brokerReuqest speicfy target query row:',brokerRequest_product_query_row);
         
       await connection.beginTransaction();
       //address,companyi,dexculsivedimension,exculsivepyong,ibju_isinstatnt,ibju_specifydate,maemulname,maemultype,mangaecost,name,phone,predidnetiyid,requestmnname,requetmemid,requestmemphone,sellprcie,selltype,supplydiemnsion,supplypyong,roomcount,bathroomcount,isdupelxfloor,isparkgin,parkginoptons,iselveator,is_pet,direction,entrance,heatmehtod,heatfuel,apartspaceoiption,space_option,securtyooption,spacaddontiopo,iscontractnrenval,iloadprice,guaranteeprice,maemul_dscert,maemul_dsecrptidetal

       //var [products_update_rows] = await connection.query('update product set prd_type=?,prd_sel_type=?, prd_price=?, prd_address=?, supply_area=?, exclusive_area=?, direction=?, bathroom_count=?, room_count=?, heat_method_type=?,heat_fuel_type=?, is_parking=?, is_elevator=?, modify_date=? , managecost=?, is_immediate_ibju=?, ibju_specifydate=?, isduplexlfoor=?, parking_option=?, is_pet=?, entrance=?, apartspace_option=?, space_option=?, security_option=?, spaceaddonoption=?, is_contract_renewal=?, loanprice=? where prd_identity_id=? and company_id=?',[req_body.maemultype, req_body.selltype, req_body.sellprice, req_body.address,req_body.supplydimension,req_body.exculsivedimension,req_body.direction_val,req_body.bathroomcount_val,req_body.roomcount_val, req_body.heatmethod_val,req_body.heatfuel_val, req_body.isparking_val,req_body.iselevator_val,req_body.is_pet_val,req_body.entrance_val,req_body.apartspace_option_val,req_body.space_option_val,req_body.security_option_val,req_body.spaceaddonoption_val,req_body.is_contract_renewal_val,req_body.loanprice_val, req_body.prdidentityid,req_body.companyid]);
        var prd_identity_id=req_body.prdidentityid;
        //2.product_modify_history insert update queryss
        var [lastest_prdhistory_info] = await connection.query("select * from product_modify_history2 where prd_identity_id=? order by pmh_id desc",[prd_identity_id]);//관련 prdidneitiy관련된 최근 추가된 내역 조회한다.
        if(lastest_prdhistory_info.length>=1){
            var company_id=lastest_prdhistory_info[0].company_id;
            var prd_img=lastest_prdhistory_info[0].prd_img;
            var prd_name=lastest_prdhistory_info[0].prd_name;
            var prd_imgs=lastest_prdhistory_info[0].prd_imgs;
            var prd_type=lastest_prdhistory_info[0].prd_type;
            var prd_sel_type=lastest_prdhistory_info[0].prd_sel_type;
            var prd_price=lastest_prdhistory_info[0].prd_price;
            var prd_month_price=lastest_prdhistory_info[0].prd_month_price;
            var prd_status=lastest_prdhistory_info[0].prd_status;
            var prd_latitude=lastest_prdhistory_info[0].prd_latitude;
            var prd_longitude=lastest_prdhistory_info[0].prd_longitude;
            var exclusive_status=lastest_prdhistory_info[0].exclusive_status;
            var exclusive_start_date=lastest_prdhistory_info[0].exclusive_start_date;
            var exclusive_end_date=lastest_prdhistory_info[0].exclusive_end_date;

            var addr_detail=lastest_prdhistory_info[0].addr_detail;
            var supply_area=lastest_prdhistory_info[0].supply_area;
            var exclusive_area=lastest_prdhistory_info[0].exclusive_area;
            var floor = lastest_prdhistory_info[0].floor;
            var direction=lastest_prdhistory_info[0].direction;
            var bathroom_count=lastest_prdhistory_info[0].bathroom_count;
            var room_count=lastest_prdhistory_info[0].room_count;
            var room_type=lastest_prdhistory_info[0].room_type;
            var heat_method_type=lastest_prdhistory_info[0].heat_method_type;
            var heat_fuel_type=lastest_prdhistory_info[0].heat_fuel_type;

            var is_parking=lastest_prdhistory_info[0].is_parking;
            var is_toilet=lastest_prdhistory_info[0].is_toilet;
            var is_interior=lastest_prdhistory_info[0].is_interior;
            var is_elevator=lastest_prdhistory_info[0].is_elevator;
            var request_mem_id=lastest_prdhistory_info[0].request_mem_id;
            var prd_create_origin=lastest_prdhistory_info[0].prd_create_origin;
            var request_mem_name=lastest_prdhistory_info[0].request_mem_name;
            var request_mem_phone=lastest_prdhistory_info[0].request_mem_phone;
            var is_rights_price =lastest_prdhistory_info[0].is_rightprice;

            var managecost=lastest_prdhistory_info[0].managecost;
            var is_immediate_ibju=lastest_prdhistory_info[0].is_immediate_ibju;
            var ibju_specifydate=lastest_prdhistory_info[0].ibju_specifydate;
            var is_duplex_floor=lastest_prdhistory_info[0].is_duplex_floor;
            var parking_option=lastest_prdhistory_info[0].parking_option;
            var is_pet=lastest_prdhistory_info[0].is_pet;
            var entrance=lastest_prdhistory_info[0].entrance;

            var apartspace_option=lastest_prdhistory_info[0].apartspace_option;
            var space_option=lastest_prdhistory_info[0].space_option;
            var security_option=lastest_prdhistory_info[0].security_option;
            var spaceaddonoption=lastest_prdhistory_info[0].spaceaddonoption;
            var is_contract_renewal=lastest_prdhistory_info[0].is_contract_renewal;
            var loanprice=lastest_prdhistory_info[0].loanprice;
            var month_base_guaranteeprice=lastest_prdhistory_info[0].month_base_guranteeprice;
            var prd_description=lastest_prdhistory_info[0].prd_description;
            var prd_description_detail=lastest_prdhistory_info[0].prd_description_detail;
            var exclusive_pyeong=lastest_prdhistory_info[0].exclusive_pyeong;
            var supply_pyeong=lastest_prdhistory_info[0].supply_pyeong;
            var exclusive_periods=lastest_prdhistory_info[0].exclusive_periods;
            var include_managecost=lastest_prdhistory_info[0].mangaecostincludes;
            var bld_id=lastest_prdhistory_info[0].bld_id;
            var ho_id=lastest_prdhistory_info[0].ho_id;
            var addr_jibun=lastest_prdhistory_info[0].addr_jibun;
            var addr_road=lastest_prdhistory_info[0].addr_road;
            var request_message=lastest_prdhistory_info[0].request_message;
            var prdstatus_generator=lastest_prdhistory_info[0].prdstatus_generator;
            var prdstatus_change_reason=lastest_prdhistory_info[0].prdstatus_change_reason;
            var room_structure=lastest_prdhistory_info[0].room_structure;
            var is_double=lastest_prdhistory_info[0].is_double;
            var is_current_biz_job=lastest_prdhistory_info[0].is_current_biz_job;
            var current_biz_job=lastest_prdhistory_info[0].current_biz_job;
            var storeoffice_building_totalfloor=lastest_prdhistory_info[0].storeoffice_building_totalfloor;
            var dong_name=lastest_prdhistory_info[0].dong_name;
            var floorname=lastest_prdhistory_info[0].floorname;
            var ho_name=lastest_prdhistory_info[0].ho_name;
            var floorint=lastest_prdhistory_info[0].floorint;

            var space_option =lastest_prdhistory_info[0].space_option;
            var prd_option = lastest_prdhistory_info[0].prd_option;
            var is_toilet=lastest_prdhistory_info[0].is_toilet;
            var recommend_jobstore = lastest_prdhistory_info[0].recommend_jobstore;
            var room_structure = lastest_prdhistory_info[0].room_structure;

        }else{
            //modfiy수정내여 정보가 없는 처음 수정의 경우or데이터가 없던 경우엔 product테이블에서의 정보 가져온다.[0]정보 가져옴.
            var [lastest_prd_info]=await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);
            var company_id=lastest_prd_info[0].company_id;
            var prd_img=lastest_prd_info[0].prd_img;
            var prd_name=lastest_prd_info[0].prd_name;
            var prd_imgs=lastest_prd_info[0].prd_imgs;
            var prd_type=lastest_prd_info[0].prd_type;
            var prd_sel_type=lastest_prd_info[0].prd_sel_type;
            var prd_price=lastest_prd_info[0].prd_price;
            var prd_month_price=lastest_prd_info[0].prd_month_price;
            var prd_status=lastest_prd_info[0].prd_status;
            var prd_latitude=lastest_prd_info[0].prd_latitude;
            var prd_longitude=lastest_prd_info[0].prd_longitude;
            var exclusive_status=lastest_prd_info[0].exclusive_status;
            var exclusive_start_date=lastest_prd_info[0].exclusive_start_date;
            var exclusive_end_date=lastest_prd_info[0].exclusive_end_date;
            var addr_detail=lastest_prd_info[0].addr_detail;
            var supply_area=lastest_prd_info[0].supply_area;
            var exclusive_area=lastest_prd_info[0].exclusive_area;
            var floor = lastest_prd_info[0].floor;
            var direction=lastest_prd_info[0].direction;
            var bathroom_count=lastest_prd_info[0].bathroom_count;
            var room_count=lastest_prd_info[0].room_count;
            var room_type=lastest_prd_info[0].room_type;
            var heat_method_type=lastest_prd_info[0].heat_method_type;
            var heat_fuel_type=lastest_prd_info[0].heat_fuel_type;
            var is_parking=lastest_prd_info[0].is_parking;
            var is_toilet=lastest_prd_info[0].is_toilet;
            var is_interior=lastest_prd_info[0].is_interior;
            var is_elevator=lastest_prd_info[0].is_elevator;
            var request_mem_id=lastest_prd_info[0].request_mem_id;
            var prd_create_origin=lastest_prd_info[0].prd_create_origin;
            var request_mem_name=lastest_prd_info[0].request_mem_name;
            var request_mem_phone=lastest_prd_info[0].request_mem_phone;
            var managecost=lastest_prd_info[0].managecost;
            var is_immediate_ibju=lastest_prd_info[0].is_immediate_ibju;
            var ibju_specifydate=lastest_prd_info[0].ibju_specifydate;
            var is_duplex_floor=lastest_prd_info[0].is_duplex_floor;
            var parking_option=lastest_prd_info[0].parking_option;
            var is_pet=lastest_prd_info[0].is_pet;
            var entrance=lastest_prd_info[0].entrance;
            var apartspace_option=lastest_prd_info[0].apartspace_option;
            var space_option=lastest_prd_info[0].space_option;
            var security_option=lastest_prd_info[0].security_option;
            var spaceaddonoption=lastest_prd_info[0].spaceaddonoption;
            var is_contract_renewal=lastest_prd_info[0].is_contract_renewal;
            var loanprice=lastest_prd_info[0].loanprice;
            var month_base_guaranteeprice=lastest_prd_info[0].month_base_guaranteeprice;
            var prd_description=lastest_prd_info[0].prd_description;
            var prd_description_detail=lastest_prd_info[0].prd_description_detail;
            var exclusive_pyeong=lastest_prd_info[0].exclusive_pyeong;
            var supply_pyeong=lastest_prd_info[0].supply_pyeong;
            var exclusive_periods=lastest_prd_info[0].exclusive_periods;
            var include_managecost=lastest_prd_info[0].include_managecost;
            var bld_id=lastest_prd_info[0].bld_id;
            var ho_id=lastest_prd_info[0].ho_id;
            var addr_jibun=lastest_prd_info[0].addr_jibun;
            var addr_road=lastest_prd_info[0].addr_road;
            var request_message=lastest_prd_info[0].request_message;
            var prdstatus_generator=lastest_prd_info[0].prdstatus_generator;
            var prdstatus_change_reason=lastest_prd_info[0].prdstatus_change_reason;
            var room_structure=lastest_prd_info[0].room_structure;
            var is_double=lastest_prd_info[0].is_double;
            var is_current_biz_job=lastest_prd_info[0].is_current_biz_job;
            var current_biz_job=lastest_prd_info[0].current_biz_job;
            var storeoffice_building_totalfloor=lastest_prd_info[0].storeoffice_building_totalfloor;
            var dong_name=lastest_prd_info[0].dong_name;
            var floorname=lastest_prd_info[0].floorname;
            var ho_name=lastest_prd_info[0].ho_name;
            var floorint=lastest_prd_info[0].floorint;

            var is_rightprice=lastest_prd_info[0].is_rightprice;
            var space_option =lastest_prd_info[0].space_option;
            var prd_option = lastest_prd_info[0].prd_option;
            var is_toilet=lastest_prd_info[0].is_toilet;
            var recommend_jobstore = lastest_prd_info[0].recommend_jobstore;
            var room_structure = lastest_prd_info[0].room_structure;
            
        }
        //추가로 넘어온 정보는 그것으로 갱신하고, 안넘어온것은 그대로 저장처리.
        //var maemultype= req_body.maemultype != null? req_body.maemultype : '';
        prd_sel_type=req_body.selltype != null? req_body.selltype : -1; //판매타입
        prd_price=req_body.sellprice != null? req_body.sellprice : -1; //판매가격(매매가,전세가,월세가격)
        prd_month_price = req_body.monthsellprice != null?req_body.monthsellprice : -1;
       //var address=req_body.address != null? req_body.address : '';
        supply_area= req_body.supplydimension != null? req_body.supplydimension : 0;//공급면적
        exclusive_area= req_body.exculsivedimension != null? req_body.exculsivedimension : 0;//전용면적
        supply_pyeong=req_body.supplypyeong != null ? req_body.supplypyeong : 0;//공급면적 pyeong
        exclusive_pyeong = req_body.exculsivepyeong != null ? req_body.exculsivepyeong : 0;//전용면적 평
        direction = req_body.direction_val != null? req_body.direction_val : '';//방향
        bathroom_count= req_body.bathroomcount_val != null? req_body.bathroomcount_val : 0;//욕실수
        room_count = req_body.roomcount_val != null?req_body.roomcount_val : 0;//방수
        heat_method_type = req_body.heatmethod_val != null?req_body.heatmethod_val : '';//난방타입
        heat_fuel_type = req_body.heatfuel_val != null?req_body.heatfuel_val : '';//난방형태
        is_parking=req_body.isparking_val != null ? req_body.isparking_val : 0;
        is_elevator =req_body.iselevator_val != null?req_body.iselevator_val : 0;
        managecost = req_body.managecost != null ? req_body.managecost : 0;//관리비
        is_immediate_ibju =req_body.is_immediate_ibju != null?req_body.is_immediate_ibju : 0;
        ibju_specifydate = req_body.ibju_specifydate != null?req_body.ibju_specifydate : '1999-09-09 00:00:00';
        include_managecost = req_body.include_managecost;

        var ismanagementcost = req_body.ismanagementcost;
        is_current_biz_job = req_body.is_current_biz_job;
        current_biz_job = req_body.current_biz_job;
        var usetype= req_body.usetype;
        
        var is_rightprice= req_body.is_rightsprice;
        var is_interior = req_body.isinterior;
        var is_toilet= req_body.istoilet;
        var recommend_jobstore= req_body.recommend_jobstore;
        var room_structure = req_body.room_structure;
        
        var standardspace_option =req_body.standardspace_option_val;
        var officetelspace_option =req_body.officetelspace_option_val;
        var officeteloption = req_body.officeteloption_val;
        var storeofficeoption = req_body.storeofficeoption_val;

        month_base_guaranteeprice= req_body.guaranteeprice_val;//기보증급
        is_contract_renewal = req_body.is_contract_renewal_val;//계약갱신권청구
         is_duplex_floor=req_body.is_duplex_floor_val;//복층여부
         is_pet = req_body.is_pet_val;//반려동물동반여부
         loanprice = req_body.loanprice_val;//융자금
         prd_description = req_body.prd_description_val;
         prd_description_detail = req_body.prd_description_detail_val;
         prd_name= req_body.maemulname;
         parking_option=req_body.parking_option_val;//주차가능시 관련옵션주차옵션.
         //var prd_identity_id = req_body.prdidentityid;//매물identityid
         security_option= req_body.security_option_val;//보안옵션

         if(prd_type=='오피스텔'){
             space_option = officetelspace_option;
         }else{
             space_option = standardspace_option;
         }

         if(prd_type=='오피스텔'){
             prd_option= officeteloption;
         }else{
             prd_option = storeofficeoption;
         }
         
        //prd_identity_id에 해당하는 모든 product요소들..매물정보 수정 상태값 변경이 아님. 매물정보 수정.매물 정보 수정 수정..>>>
        var [match_product_list] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);//prdidneitiyid에 대한 매물정보 최근것 origin매물종류별 한개 정보 조회.
        
        var prd_id_loca=match_product_list[0]['prd_id'];
        //매물정보수정시에 ..관련 매물prdiidntieiy내역 수정한다.
        var sql_query="update product set prd_sel_type='"+prd_sel_type+"', prd_price='"+prd_price+"', prd_month_price='"+prd_month_price+"', supply_area='"+supply_area+"', exclusive_area='"+exclusive_area+"', direction='"+direction+"', bathroom_count='"+bathroom_count+"', room_count='"+room_count+"', heat_method_type='"+heat_method_type+"', heat_fuel_type='"+heat_fuel_type+"', is_parking='"+is_parking+"', is_elevator='"+is_elevator+"', managecost='"+managecost+"', is_managecost="+ismanagementcost+",is_current_biz_job="+is_current_biz_job+",current_biz_job='"+current_biz_job+"', is_immediate_ibju='"+is_immediate_ibju+"',ibju_specifydate='"+ibju_specifydate+"', is_duplex_floor='"+is_duplex_floor+"',include_managecost='"+include_managecost+"', parking_option='"+parking_option+"', is_pet='"+is_pet+"', entrance='"+req_body.entrance_val+"', space_option='"+space_option+"',prd_name='"+prd_name+"', security_option='"+security_option+"', is_contract_renewal='"+is_contract_renewal+"', loanprice='"+loanprice+"',month_base_guaranteeprice='"+month_base_guaranteeprice+"', prd_description='"+prd_description+"', prd_description_detail='"+prd_description_detail+"',exclusive_pyeong='"+exclusive_pyeong+"',supply_pyeong='"+supply_pyeong+"' ,modify_date='"+new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+"', prd_usage='"+usetype+"' , is_rightprice='"+is_rightprice+"', is_interior='"+is_interior+"',is_toilet='"+is_toilet+"',recommend_jobstore='"+recommend_jobstore+"',room_structure='"+room_structure+"',prd_option='"+prd_option+"' where prd_id='"+prd_id_loca+"'";

        console.log('server sql query statment:',sql_query);
        var [products_update_rows] = await connection.query(sql_query);//대상 row들 하나하나 다 바꾼다.
        console.log('===>>produts single update rosss ::',products_update_rows);

        //2.producdtmodifyhistor insert queyss
        await connection.beginTransaction();
        var [productmodifyhistory_insertquery] = await connection.query("insert into product_modify_history2(prd_identity_id,company_id,prd_name,prd_img,prd_imgs,prd_type,prd_sel_type,prd_price,prd_month_price,prd_status,prd_latitutde,prd_longitude,exclusive_status,exclusive_start_date,exclusive_end_date,addr_detail,supply_area,exclusive_area,floor,direction,bathromm_count,room_count,room_type,heat_method_type,heat_fuel_type,is_parking,is_toilet,is_interior,is_elevator,request_mem_id,prd_create_origin,request_mem_name,request_mem_phone,managecost,is_immediate_ibju,ibju_specifydate,is_duplex_floor,parking_option,is_pet,entrance,space_option,security_option,is_contract_renewal,loanprice,month_base_guranteeprice,prd_description,prd_description_detail,exclusive_pyeong,supply_pyeong,exclusive_periods,mangaecostincludes,bld_id,ho_id,addr_jibun,addr_road,request_message,prdstatus_generator,prdstatus_change_reason,room_structure,is_double,is_current_biz_job,current_biz_job,storeoffice_building_totalfloor,dong_name,floorname,ho_name,floorint,prd_usage,create_date,modify_date,history_type,is_rightprice,recommend_jobstore,room_structure,prd_option) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[prd_identity_id,company_id,prd_name,prd_img,prd_imgs,prd_type,prd_sel_type,prd_price,prd_month_price,prd_status,prd_latitude,prd_longitude,exclusive_status,exclusive_start_date,exclusive_end_date,addr_detail,supply_area,exclusive_area,floor,direction,bathroom_count,room_count,room_type,heat_method_type,heat_fuel_type,is_parking,is_toilet,is_interior,is_elevator,request_mem_id,prd_create_origin,request_mem_name,request_mem_phone,managecost,is_immediate_ibju,ibju_specifydate,is_duplex_floor,parking_option,is_pet,entrance,space_option,security_option,is_contract_renewal,loanprice,month_base_guaranteeprice,prd_description,prd_description_detail,exclusive_pyeong,supply_pyeong,exclusive_periods,include_managecost,bld_id,ho_id,addr_jibun,addr_road,request_message,prdstatus_generator,prdstatus_change_reason,room_structure,is_double,is_current_biz_job,current_biz_job,storeoffice_building_totalfloor,dong_name,floorname,ho_name,floorint,usetype,new Date(),new Date(),'매물수정',is_rightprice,recommend_jobstore,room_structure,prd_option]);
        console.log('update tranasctionhistory match product query::',productmodifyhistory_insertquery);
        await connection.commit();

        connection.commit();
        connection.release();

        return response.json({success:true, message:'product server query success!!'});      
        
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//의뢰온 매물or특정 물건과리 매물에 대한 상태변화 관련된 일괄 모든 액션처리(특정액션발발) 상태변경insert값.
router.post('/brokerRequest_productstatus_updateinsert',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    //try catch문 mysql 구문 실행구조.
    try{
        //최초 insert정보에 있던것들(x,y좌표까지)해서 모두 불러와서(가장 오리진정보)최초 변경이후로 계속 생성시마다. 그 매물정보값+상태변경값 처리한다.가장 최근의 정보로 수정.
       var company_id=req_body.company_id;
       var prd_identity_id=req_body.prd_identity_id;
       var process_prdstatus=req_body.prd_status_val;
       //var generator_memid =req_body.generator_memid;
       //var change_reason =req_body.change_reason;

       //관련된 product테이블의 prd_status상태값 변경한다.
       var [prd_list_query] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);
       var target_prd_id=prd_list_query[0].prd_id;//관련 prd_identity_id 매물id값 구한다. prd_id 수정한다.

       await connection.beginTransaction();
        var [prd_update_query] = await connection.query("update product set prd_status=?,modify_date=? where prd_id=?",[process_prdstatus,new Date(),target_prd_id]);
        await connection.commit();

        //match_transaction_find upate!! trnsaciton은 update를 해야한다! 상태변경시마다 transaction테이블 일단 같이 변경.product테이블변경.
        var match_transaction_array=[];
        var [find_match_transaction] = await connection.query("select * from transaction where prd_identity_id=?",[prd_identity_id]);
        for(let s=0; s<find_match_transaction.length; s++){
            match_transaction_array[s]=find_match_transaction[s]['txn_id'];//해당 매칭되는 하나의 transaciton txnid찾는다.
        }
        var find_match_transaction_id=match_transaction_array.join(',');
        var extract_txn_id=match_transaction_array[0];

        await connection.beginTransaction();
        var [transaction_update_query] = await connection.query("update transaction set txn_status=? , modify_date=? where txn_id in (?)",[process_prdstatus,new Date(),find_match_transaction_id]);
        await connection.commit();
        console.log('transacito udpate quewry::',transaction_update_query);

        var [lastest_prdhistory_info] = await connection.query("select * from product_modify_history2 where prd_identity_id=? order by pmh_id desc",[prd_identity_id]);//관련 매물prd-Idneitiy내역관련된 수정내역(상태변경,매물수정)을 조회한다.
        if(lastest_prdhistory_info.length>=1){
            var company_id=lastest_prdhistory_info[0].company_id;
            var prd_img=lastest_prdhistory_info[0].prd_img;
            var prd_name=lastest_prdhistory_info[0].prd_name;
            var prd_imgs=lastest_prdhistory_info[0].prd_imgs;
            var prd_type=lastest_prdhistory_info[0].prd_type;
            var prd_sel_type=lastest_prdhistory_info[0].prd_sel_type;
            var prd_price=lastest_prdhistory_info[0].prd_price;
            var prd_month_price=lastest_prdhistory_info[0].prd_month_price;
            var prd_status=lastest_prdhistory_info[0].prd_status;
            var prd_latitude=lastest_prdhistory_info[0].prd_latitude;
            var prd_longitude=lastest_prdhistory_info[0].prd_longitude;
            var exclusive_status=lastest_prdhistory_info[0].exclusive_status;
            var exclusive_start_date=lastest_prdhistory_info[0].exclusive_start_date;
            var exclusive_end_date=lastest_prdhistory_info[0].exclusive_end_date;
            var addr_detail=lastest_prdhistory_info[0].addr_detail;
            var supply_area=lastest_prdhistory_info[0].supply_area;
            var exclusive_area=lastest_prdhistory_info[0].exclusive_area;
            var floor = lastest_prdhistory_info[0].floor;
            var direction=lastest_prdhistory_info[0].direction;
            var bathroom_count=lastest_prdhistory_info[0].bathroom_count;
            var room_count=lastest_prdhistory_info[0].room_count;
            var room_type=lastest_prdhistory_info[0].room_type;
            var heat_method_type=lastest_prdhistory_info[0].heat_method_type;
            var heat_fuel_type=lastest_prdhistory_info[0].heat_fuel_type;
            var is_parking=lastest_prdhistory_info[0].is_parking;
            var is_toilet=lastest_prdhistory_info[0].is_toilet;
            var is_interior=lastest_prdhistory_info[0].is_interior;
            var is_elevator=lastest_prdhistory_info[0].is_elevator;
            var request_mem_id=lastest_prdhistory_info[0].request_mem_id;
            var prd_create_origin=lastest_prdhistory_info[0].prd_create_origin;
            var request_mem_name=lastest_prdhistory_info[0].request_mem_name;
            var request_mem_phone=lastest_prdhistory_info[0].request_mem_phone;
            var managecost=lastest_prdhistory_info[0].managecost;
            var is_immediate_ibju=lastest_prdhistory_info[0].is_immediate_ibju;
            var ibju_specifydate=lastest_prdhistory_info[0].ibju_specifydate;
            var is_duplex_floor=lastest_prdhistory_info[0].is_duplex_floor;
            var parking_option=lastest_prdhistory_info[0].parking_option;
            var is_pet=lastest_prdhistory_info[0].is_pet;
            var entrance=lastest_prdhistory_info[0].entrance;
            var apartspace_option=lastest_prdhistory_info[0].apartspace_option;
            var space_option=lastest_prdhistory_info[0].space_option;
            var security_option=lastest_prdhistory_info[0].security_option;
            var spaceaddonoption=lastest_prdhistory_info[0].spaceaddonoption;
            var is_contract_renewal=lastest_prdhistory_info[0].is_contract_renewal;
            var loanprice=lastest_prdhistory_info[0].loanprice;
            var month_base_guaranteeprice=lastest_prdhistory_info[0].month_base_guranteeprice;
            var prd_description=lastest_prdhistory_info[0].prd_description;
            var prd_description_detail=lastest_prdhistory_info[0].prd_description_detail;
            var exclusive_pyeong=lastest_prdhistory_info[0].exclusive_pyeong;
            var supply_pyeong=lastest_prdhistory_info[0].supply_pyeong;
            var exclusive_periods=lastest_prdhistory_info[0].exclusive_periods;
            var include_managecost=lastest_prdhistory_info[0].mangaecostincludes;
            var bld_id=lastest_prdhistory_info[0].bld_id;
            var ho_id=lastest_prdhistory_info[0].ho_id;
            var addr_jibun=lastest_prdhistory_info[0].addr_jibun;
            var addr_road=lastest_prdhistory_info[0].addr_road;
            var request_message=lastest_prdhistory_info[0].request_message;
            var prdstatus_generator=lastest_prdhistory_info[0].prdstatus_generator;
            var prdstatus_change_reason=lastest_prdhistory_info[0].prdstatus_change_reason;
            var room_structure=lastest_prdhistory_info[0].room_structure;
            var is_double=lastest_prdhistory_info[0].is_double;
            var is_current_biz_job=lastest_prdhistory_info[0].is_current_biz_job;
            var current_biz_job=lastest_prdhistory_info[0].current_biz_job;
            var storeoffice_building_totalfloor=lastest_prdhistory_info[0].storeoffice_building_totalfloor;
            var dong_name=lastest_prdhistory_info[0].dong_name;
            var floorname=lastest_prdhistory_info[0].floorname;
            var ho_name=lastest_prdhistory_info[0].ho_name;
            var floorint=lastest_prdhistory_info[0].floorint;
            var prd_usage=lastest_prdhistory_info[0].prd_usage;
        }else{
            //modfiy수정내여 정보가 없는 처음 수정의 경우or데이터가 없던 경우엔 product테이블에서의 정보 가져온다.[0]정보 가져옴.
            var [lastest_prd_info]=await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);
            var company_id=lastest_prd_info[0].company_id;
            var prd_img=lastest_prd_info[0].prd_img;
            var prd_name=lastest_prd_info[0].prd_name;
            var prd_imgs=lastest_prd_info[0].prd_imgs;
            var prd_type=lastest_prd_info[0].prd_type;
            var prd_sel_type=lastest_prd_info[0].prd_sel_type;
            var prd_price=lastest_prd_info[0].prd_price;
            var prd_month_price=lastest_prd_info[0].prd_month_price;
            var prd_status=lastest_prd_info[0].prd_status;
            var prd_latitude=lastest_prd_info[0].prd_latitude;
            var prd_longitude=lastest_prd_info[0].prd_longitude;
            var exclusive_status=lastest_prd_info[0].exclusive_status;
            var exclusive_start_date=lastest_prd_info[0].exclusive_start_date;
            var exclusive_end_date=lastest_prd_info[0].exclusive_end_date;
            var addr_detail=lastest_prd_info[0].addr_detail;
            var supply_area=lastest_prd_info[0].supply_area;
            var exclusive_area=lastest_prd_info[0].exclusive_area;
            var floor = lastest_prd_info[0].floor;
            var direction=lastest_prd_info[0].direction;
            var bathroom_count=lastest_prd_info[0].bathroom_count;
            var room_count=lastest_prd_info[0].room_count;
            var room_type=lastest_prd_info[0].room_type;
            var heat_method_type=lastest_prd_info[0].heat_method_type;
            var heat_fuel_type=lastest_prd_info[0].heat_fuel_type;
            var is_parking=lastest_prd_info[0].is_parking;
            var is_toilet=lastest_prd_info[0].is_toilet;
            var is_interior=lastest_prd_info[0].is_interior;
            var is_elevator=lastest_prd_info[0].is_elevator;
            var request_mem_id=lastest_prd_info[0].request_mem_id;
            var prd_create_origin=lastest_prd_info[0].prd_create_origin;
            var request_mem_name=lastest_prd_info[0].request_mem_name;
            var request_mem_phone=lastest_prd_info[0].request_mem_phone;
            var managecost=lastest_prd_info[0].managecost;
            var is_immediate_ibju=lastest_prd_info[0].is_immediate_ibju;
            var ibju_specifydate=lastest_prd_info[0].ibju_specifydate;
            var is_duplex_floor=lastest_prd_info[0].is_duplex_floor;
            var parking_option=lastest_prd_info[0].parking_option;
            var is_pet=lastest_prd_info[0].is_pet;
            var entrance=lastest_prd_info[0].entrance;
            var apartspace_option=lastest_prd_info[0].apartspace_option;
            var space_option=lastest_prd_info[0].space_option;
            var security_option=lastest_prd_info[0].security_option;
            var spaceaddonoption=lastest_prd_info[0].spaceaddonoption;
            var is_contract_renewal=lastest_prd_info[0].is_contract_renewal;
            var loanprice=lastest_prd_info[0].loanprice;
            var month_base_guaranteeprice=lastest_prd_info[0].month_base_guaranteeprice;
            var prd_description=lastest_prd_info[0].prd_description;
            var prd_description_detail=lastest_prd_info[0].prd_description_detail;
            var exclusive_pyeong=lastest_prd_info[0].exclusive_pyeong;
            var supply_pyeong=lastest_prd_info[0].supply_pyeong;
            var exclusive_periods=lastest_prd_info[0].exclusive_periods;
            var include_managecost=lastest_prd_info[0].include_managecost;
            var bld_id=lastest_prd_info[0].bld_id;
            var ho_id=lastest_prd_info[0].ho_id;
            var addr_jibun=lastest_prd_info[0].addr_jibun;
            var addr_road=lastest_prd_info[0].addr_road;
            var request_message=lastest_prd_info[0].request_message;
            var prdstatus_generator=lastest_prd_info[0].prdstatus_generator;
            var prdstatus_change_reason=lastest_prd_info[0].prdstatus_change_reason;
            var room_structure=lastest_prd_info[0].room_structure;
            var is_double=lastest_prd_info[0].is_double;
            var is_current_biz_job=lastest_prd_info[0].is_current_biz_job;
            var current_biz_job=lastest_prd_info[0].current_biz_job;
            var storeoffice_building_totalfloor=lastest_prd_info[0].storeoffice_building_totalfloor;
            var dong_name=lastest_prd_info[0].dong_name;
            var floorname=lastest_prd_info[0].floorname;
            var ho_name=lastest_prd_info[0].ho_name;
            var floorint=lastest_prd_info[0].floorint;
            var prd_usage=lastest_prd_info[0].prd_usage;
        }

        prdstatus_generator =req_body.generator_memid;
        prdstatus_change_reason =req_body.change_reason;

        await connection.beginTransaction();
        var [productmodifyhistory_updateinsert_query] = await connection.query("insert into product_modify_history2(prd_identity_id,company_id,prd_name,prd_img,prd_imgs,prd_type,prd_sel_type,prd_price,prd_month_price,prd_status,prd_latitutde,prd_longitude,exclusive_status,exclusive_start_date,exclusive_end_date,addr_detail,supply_area,exclusive_area,floor,direction,bathromm_count,room_count,room_type,heat_method_type,heat_fuel_type,is_parking,is_toilet,is_interior,is_elevator,request_mem_id,prd_create_origin,request_mem_name,request_mem_phone,managecost,is_immediate_ibju,ibju_specifydate,is_duplex_floor,parking_option,is_pet,entrance,space_option,security_option,is_contract_renewal,loanprice,month_base_guranteeprice,prd_description,prd_description_detail,exclusive_pyeong,supply_pyeong,exclusive_periods,mangaecostincludes,bld_id,ho_id,addr_jibun,addr_road,request_message,prdstatus_generator,prdstatus_change_reason,room_structure,is_double,is_current_biz_job,current_biz_job,storeoffice_building_totalfloor,dong_name,floorname,ho_name,floorint,prd_usage,create_date,modify_date,history_type) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[prd_identity_id,company_id,prd_name,prd_img,prd_imgs,prd_type,prd_sel_type,prd_price,prd_month_price,process_prdstatus,prd_latitude,prd_longitude,exclusive_status,exclusive_start_date,exclusive_end_date,addr_detail,supply_area,exclusive_area,floor,direction,bathroom_count,room_count,room_type,heat_method_type,heat_fuel_type,is_parking,is_toilet,is_interior,is_elevator,request_mem_id,prd_create_origin,request_mem_name,request_mem_phone,managecost,is_immediate_ibju,ibju_specifydate,is_duplex_floor,parking_option,is_pet,entrance,space_option,security_option,is_contract_renewal,loanprice,month_base_guaranteeprice,prd_description,prd_description_detail,exclusive_pyeong,supply_pyeong,exclusive_periods,include_managecost,bld_id,ho_id,addr_jibun,addr_road,request_message,prdstatus_generator,prdstatus_change_reason,room_structure,is_double,is_current_biz_job,current_biz_job,storeoffice_building_totalfloor,dong_name,floorname,ho_name,floorint,prd_usage,new Date(),new Date(),'상태변경']);
        await connection.commit();
        console.log('productmodifyhistory_updateinsert_query udpate quewry::',productmodifyhistory_updateinsert_query);
        connection.release();

        if(productmodifyhistory_updateinsert_query && transaction_update_query && prd_update_query){
            connection.release();

            return response.json({success:true, message:'server query success!!'});     
        }else{
            connection.rollback();
            connection.release();
            return response.status(403).json({success:false, message:'server query full problem error!'});   
        }
                
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//특정 매물에 대해서 전속기간 수임인 기시일 update쿼리.전속기간 개시.거래개시동의한 날짜부터 전속기간만큼 기간지정.
router.post('/brokerRequest_product_exculsivestart',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    //try catch문 mysql 구문 실행구조.
    try{

       var prd_identity_id=req_body.prd_identity_id;
       var company_id=req_body.company_id;
      
        var [target_productquery] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);//관련 prdidentitiyid관련 매물정보조회. 그 조회된 매물정보리스트중 가장 첫 origin정보 prdid대상값 조회.그 대상체 update쿼리.
        //console.log('관련 produdcts들 리스트:',target_productquery);
        var target_prdid=target_productquery[0].prd_id;
        var exclusive_periods=target_productquery[0].exclusive_periods;//int값.
        
        if(exclusive_periods>0 && !isNaN(exclusive_periods)){
            var now_date=new Date();//현재 날짜값.
            var adapt_start_date=now_date;
            var now_date2=new Date();
            now_date2.setMonth(now_date2.getMonth()+exclusive_periods);//n달후..
            var adapt_expire_date=now_date2;
            console.log('적용할 전속시작,종료일::',target_prdid,exclusive_periods,adapt_start_date,now_date2,adapt_expire_date);

            await connection.beginTransaction();
            var [prd_update_query]= await connection.query("update product set exclusive_start_date=?, exclusive_end_date=?,exclusive_status=1 where prd_id=?",[adapt_start_date,adapt_expire_date,target_prdid]);
            await connection.commit();

            if(prd_update_query){
                connection.release();
                //거래개시된 상태 이후부터 임의매물에 전속기한이 생성되어 그 결과값 리턴하여 관련 알림(전속기한만료,만료삼일전 예약알림 noti가한다. 일단 저장해두고 문자알림이나 푸시알림은 그 시점때에 즉시 알림되는 형태여야함.)
                var [target_productquery_results] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);
                //console.log('관련 products들 리스트::',target_productquery_results);

                return response.json({success:true, message:'server query success!!', result:target_productquery_results[0]});//거래개시동의완료한 그 매물의 정보(전속기한설정되어나온 레코드정보)리턴한다.그 기한일(기한종료일)기준으로 관련 알림 두개 가해질수있게. 기한만료일예정알람,만료삼일전 알림 예약알림이기에 내알림설정(매물상태변경변화감지)에 덜 민감하게 처리한다.    
            }else{
                connection.rollback();
                connection.release();
                return response.status(403).json({success:false, message:'server query full problem error!'}); 
            }
        }else{
            //전속기간 int값이 숫자가 아니라면 처리불가오류 발생.
            connection.rollback();
            connection.release();
            return response.status(403).json({success:false, message:'server query full problem error!'}); 
        }
                
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//임의 매물에 대한 상태변화내역 모두 조회(상태변경,수정내역 모두 포함한.)
router.post('/product_conditionchange_history',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    //try catch문 mysql 구문 실행구조.
    try{

        var prd_identity_id = req_body.prd_identity_id_val;
  
        var [product_conditionchange_query] = await connection.query("select * from product_modify_history2 where prd_identity_id=? and history_type='상태변경'",[prd_identity_id]);//보통은 항상 검토대기,거래준비(외부수임)부터 시작을 하게된다.매물수정히스토리내역 조회한다.매물 정보변경(상태변경히스토리)만 조회.
        console.log('===>>produts product_conditionchange_query  rosss ::',product_conditionchange_query);
        var prd_conditionchange_list=[];
        for(var s=0; s<product_conditionchange_query.length; s++){
            prd_conditionchange_list[s]= {};
            let item_info = product_conditionchange_query[s];
            let generator_memid = item_info.prdstatus_generator;
            
            if(generator_memid){
                var [user_info_query] = await connection.query("select * from user where mem_id=?",[generator_memid]);
               var get_username=user_info_query[0].user_name;
            }else{
                var get_username='';
            }
            
            prd_conditionchange_list[s]['item_info'] = item_info;
            prd_conditionchange_list[s]['generator_who'] = get_username+'('+generator_memid+')';
        }
        console.log('result infoisss:',prd_conditionchange_list);

        connection.release();

        return response.json({success:true, message:'product server query success!!',result:prd_conditionchange_list});      
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개사가 등록한 매물에 대해서 투어예약셋팅설정 tour,tourdetail등 테이블처리.수정처리.
router.post('/productToursettingupdate',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    //try catch문 mysql 구문 실행구조. tour,tourDetail테이블 정보 insert
    try{
       
       var tour_type = req_body.tour_type; //투어타입 :일반,특별 추가여부
       var company_id=req_body.company_id;  //해당매물을 등록한 중개사id
       var prd_identity_ids=req_body.prd_identity_ids; //특정매물.
       var key_value =req_body.key_value;//어떤 tourid groupid에 대해서 관련된 tourid들을 수정한다. 

       var normal_isholidayexcept=req_body.normal_isholidayexcept !='' && req_body.normal_isholidayexcept ? req_body.normal_isholidayexcept : 0;  //공휴일제외여부.다 같은값.
       var normal_select_daycount=req_body.normal_select_daycount !='' && req_body.normal_select_daycount ? req_body.normal_select_daycount : 0;  //슬라이더 노출개수 표현개수.

       var normal_select_days=req_body.normal_select_days != '' && req_body.normal_select_days ? req_body.normal_select_days : ''; //선택요일들 개수. 
       var normal_select_times=req_body.normal_select_times !='' && req_body.normal_select_times ? req_body.normal_select_times : ''; //선택시간들.

       if(normal_select_days && normal_select_days!=''){
          var normal_select_days_array = normal_select_days.split(','); //선택요일들. 월수금 했으면 월수금만 tourId에 추가.
       }
       if(normal_select_times && normal_select_times !=''){
           var normal_select_times_array = normal_select_times.split(',');//선택시간대들. 값으로 지정 tourdetail수정지정.
       }
       
       var special_specifydate = req_body.special_specifydate !='' && req_body.special_specifydate ? req_body.special_specifydate : '0000-00-00';
       var special_specifydatetimes= req_body.special_specifydatetimes !='' && req_body.special_specifydatetimes ? req_body.special_specifydatetimes : '';
       var special_isexceptspecifydate= req_body.special_isexceptspecifydate != '' && req_body.special_isexceptspecifydate ? req_body.special_isexceptspecifydate : 0;
         

       //일반타입인경우 일반 tour_set_days항목 문자열형태 split중에서 기존항목중에서 새로추가하려는 항목중 하나가 존재 하나라도 하면 막는다.
        if(tour_type == 1){
            //일반유형 추가시 요일중복여부 판단성 코드 startss========================================================================
            //요청한 keyvalue groupid에 해당하는 내역을 제외한 요일목록들(일반추가목록들중)요일기반 을 조회한다.그 요일들 + 추가변경하려는 groupid에 들어온 normal_select_days값들을 더한 결과물을 저장한다.
            var [all_prev_tournormalsetting_tours] = await connection.query("select * from tour where prd_identity_id=? and is_tour_tempdelete=0 and tour_set_days!=''",[prd_identity_ids]);
            var changetarget_notself_tournormalsetting_tours=[];
            for(let p=0; p<all_prev_tournormalsetting_tours.length; p++){
                console.log('key-value,tourgorupid',key_value,all_prev_tournormalsetting_tours[p].tour_group_id);
                if(all_prev_tournormalsetting_tours[p].tour_group_id != key_value){
                    changetarget_notself_tournormalsetting_tours.push(all_prev_tournormalsetting_tours[p]['tour_set_days']);//수정하려는 대상체에 있던 요일들은 제외한 나머지 groupid에서의 요일들 구하여 저장.
                }
            }
            console.log('=<<<해당 prdidientity매물에 등록되어있던 일반 요일추가목록들(수정하려는 groupid대상체 제외):',changetarget_notself_tournormalsetting_tours);
            for(let y=0; y<normal_select_days_array.length; y++){
                changetarget_notself_tournormalsetting_tours.push(normal_select_days_array[y]);
            }
            console.log('==>>>해당 prdidientiy매물에등록되어있던 일반요일추가목록들+수정하라녀느grupid대상체의 추가변경요일들 merged한 결과체::',changetarget_notself_tournormalsetting_tours);
            var prev_yoilper_existscnt={};
            for(let sss=0; sss<changetarget_notself_tournormalsetting_tours.length; sss++){
                let item=changetarget_notself_tournormalsetting_tours[sss];//sat,mon,....
                if(prev_yoilper_existscnt[item]){
                    prev_yoilper_existscnt[item].push(item); //sat : [sat]->>[sat,sat]
                }else{
                    prev_yoilper_existscnt[item] = [];
                    prev_yoilper_existscnt[item].push(item);// sat : [sat]
                }
            }
            console.log('==>>>prev_yoilper_existscntss sturcutreu::',prev_yoilper_existscnt);
            var yoil_overwraped=false;
            for(let key in prev_yoilper_existscnt){
                if(prev_yoilper_existscnt[key].length >=2){
                    //요일별 카운팅 수에서 한 항목이라도 2개인게 발견(요일중복) 발견된다면 
                    yoil_overwraped=true;
                    break;
                }
            }
            if(yoil_overwraped){
                console.log('====>>요일중복 발생!!! 중복되는 요일 발생!!');
                return response.status(403).json({success:false, message:'수정시에 중복되는 요일이 발생합니다.\n 요일끼리의 중복이 발생하면 안됩니다.'});
            }
            //일반유형 추가시에 요일중복여부 판단성 코드 endss==+=========================================================================

            var [match_tournormalSetting_tours] = await connection.query("select * from tour where tour_group_id=? and tour_type=1",[key_value]);//해당 투으셋팅그룹아디에 관련된 리스트 조회한다.
            for(var s=0; s<match_tournormalSetting_tours.length; s++){
                let loca_tourid= match_tournormalSetting_tours[s]['tour_id'];

                console.log('now normal_selectdayss:',normal_select_days_array);
                if(normal_select_days_array.length>=1){
                    let get_tour_day= normal_select_days_array.splice(0,1);//가져온 배열의 가장 첫 요소.를 매번 삭제하면서 전달해서 해당 요소로 갱신한다.

                    await connection.beginTransaction();
                    var [update_touritem_query] = await connection.query("update tour set is_tour_holiday_except=?, tour_set_times=?, day_select_count=?,tour_set_days=? ,modify_date=?, is_tour_tempdelete=0 where tour_id=?",[normal_isholidayexcept, normal_select_times,normal_select_daycount,get_tour_day,new Date(),loca_tourid]);
                    console.log('update tour item queryss:',update_touritem_query);
                    await connection.commit();
                }else{
                    await connection.beginTransaction();
                    var [update_touritem_query] = await connection.query("update tour set is_tour_holiday_except='', tour_set_times='', day_select_count='',tour_set_days='', is_tour_tempdelete=1 , modify_date=? where tour_id=?",[new Date(),loca_tourid]);
                    console.log('update tour itmte queyss:',update_touritem_query);
                    await connection.commit();
                }
               
            }
            console.log('leave normal selectdayss>>;',normal_select_days_array);
            if(normal_select_days_array.length >=1){
                for(let leave=0; leave<normal_select_days_array.length; leave++){
                    let get_tour_day=normal_select_days_array[leave];//나머지 삭제되지않고 추가되징못한..것들..추가해준다.

                    await connection.beginTransaction();
                    var [insert_touritem_query] = await connection.query("insert into tour (prd_identity_id,company_id,tour_set_days,create_date,modify_date,tour_type,is_tour_holiday_except,day_select_count,tour_set_times,tour_group_id) values(?,?,?,?,?,?,?,?,?,?)",[prd_identity_ids,company_id,get_tour_day,new Date(),new Date(),1,normal_isholidayexcept,normal_select_daycount,normal_select_times,key_value]);
                    console.log('insert leave tour items querysss;',insert_touritem_query);
                    await connection.commit();
                }
            }

            //방금 수정이 되었었던 touridgroupid에 해다앟는 tour들 tour_id를 구하고,그 tourid에 해당하는 tourdetail들을 모두 가각에 tourid에 해당했던. tour_set_times로 udpat           
            for(let f=0; f<match_tournormalSetting_tours.length; f++){
                let loca_tour_id=match_tournormalSetting_tours[f]['tour_id'];//각 투어아이디를 구한다.

                var [related_tourdetail_rows] = await connection.query("select * from tourdetail where tour_id=?",[loca_tour_id]);
                for(let inner=0; inner<related_tourdetail_rows.length; inner++){
                    //각 tdid들 수정하낟.
                    let tdid=related_tourdetail_rows[inner]['td_id'];//tdid

                    await connection.beginTransaction();
                    var [tourdetail_deltee_rows] = await connection.query("delete from tourdetail where td_id=?",[tdid]);
                    console.log('>>>>>>>tourdetail_delete_rows rows>>>:',tourdetail_deltee_rows);//값 초기화 기존 상태는 유지하되 빈상태로 두는것.
                    await connection.commit();
                }
            }//다 비우고 새로 insert하는 형태로 
            var [match_tournormalSetting_tours_new] = await connection.query("select * from tour where tour_group_id=? and tour_type=1",[key_value]);//해당 투으셋팅그룹아디에 관련된 리스트 조회한다.갱신된 기존보다 추가되었을수도 관련된 tourid리스트구한다.
            for(let f=0; f<match_tournormalSetting_tours_new.length; f++){
                let loca_tour_id=match_tournormalSetting_tours_new[f]['tour_id'];//각 투어아이디를 구한다.

                for(let inn=0; inn<normal_select_times_array.length; inn++){
                    let select_time_val=normal_select_times_array[inn];
                    let td_starttime_val;
                    let td_endtime_val;
                    switch(select_time_val){
                        case '오전1T':
                            td_starttime_val = '9:00am';
                            td_endtime_val = '12:00pm';
                        break;
                        case '오후1T':
                            td_starttime_val = '12:00pm';
                            td_endtime_val = '15:00pm';
                        break;
                        case '오후2T':
                            td_starttime_val = '15:00pm';
                            td_endtime_val = '18:00pm';
                        break;
                    }
                    await connection.beginTransaction();
                    var [tourdetail_insert_rows] = await connection.query("insert into tourdetail(tour_id,td_text,td_starttime,td_endtime,create_date,modify_date) values(?,?,?,?,?,?)",[loca_tour_id,select_time_val,td_starttime_val,td_endtime_val,new Date(),new Date()]);
                    console.log('======>>tourdetail insert rowss::',tourdetail_insert_rows);
                    await connection.commit();
                }    
            }

            connection.release();

            return response.json({success:true, message:'tour and tourdetail server query success!!'});    
        }else if(tour_type == 2){

            //추가 가능한 제외또는 등록 특정날짜라면
            var tour_start_date=special_specifydate;
            var tour_end_date=special_specifydate;//특정 설정한 날짜값 하루에 시작~종료라는 저장 표현.

            //수정하려는 tourid의 특별 추가내역에 대해서 수정진행.
            await connection.beginTransaction();
            var [tour_update_query] = await connection.query("update tour set modify_date=?, tour_set_specifydate=?,tour_set_specifydate_times=?,tour_specifyday_except=? where tour_id=?",[new Date(),special_specifydate,special_specifydatetimes,special_isexceptspecifydate,key_value]);
            await connection.commit();
            console.log('tour_update_query :',tour_update_query);

            var [match_tourspecialSetting_row] = await connection.query("select * from tour where tour_id=?",[key_value]);

             //방금 수정이 되었었던 keyval 에 해다앟는 tour들 tour_id를 구하고,그 tourid에 해당하는 tourdetail들을 모두 가각에 tourid에 해당했던. tour_set_times로 udpat           
             for(let f=0; f<match_tourspecialSetting_row.length; f++){
                let loca_tour_id=match_tourspecialSetting_row[f]['tour_id'];//각 투어아이디를 구한다.

                var [related_tourdetail_rows] = await connection.query("select * from tourdetail where tour_id=?",[loca_tour_id]);
                for(let inner=0; inner<related_tourdetail_rows.length; inner++){
                    //각 tdid들 수정하낟.
                    let tdid=related_tourdetail_rows[inner]['td_id'];//tdid

                    await connection.beginTransaction();
                    var [tourdetail_deltee_rows] = await connection.query("delete from tourdetail where td_id=?",[tdid]);
                    console.log('>>>>>>>tourdetail_delete_rows rows>>>:',tourdetail_deltee_rows);//값 초기화 기존 상태는 유지하되 빈상태로 두는것.
                    await connection.commit();
                }
            }//다 비우고 새로 insert하는 형태로 

            for(let dinn=0; dinn<special_specifydatetimes.split(',').length; dinn++){
                var loca_setTimes=special_specifydatetimes.split(',')[dinn];//오전1t,오후1t,..등 여부 저장. 어떤 특정 date에 대한 tourid정보 하나 추가되고,tourstart~enddate추가되었고 그tourid에 대해서 설정한 시간대들만큼 detail적으로 하여 어떤 항목별 start~endtime지정, td_text는 해당 special add tourid에 대하ㅐ 지정된 시간대들 하나하나 방(시간표)
                var tour_starttime_val;
                var tour_endtime_val;
                switch(loca_setTimes){
                    case '오전1T':
                        tour_starttime_val = '9:00am';
                        tour_endtime_val = '12:00pm';
                    break;
                    case '오후1T':
                        tour_starttime_val = '12:00pm';
                        tour_endtime_val = '15:00pm';
                    break;
                    case '오후2T':
                        tour_starttime_val = '15:00pm';
                        tour_endtime_val = '18:00pm';
                    break;
                }
                await connection.beginTransaction();
                var [tourdetail_insert_rows] = await connection.query("insert into tourdetail(tour_id,td_text,td_starttime,td_endtime,create_date,modify_date) values(?,?,?,?,?,?)",[key_value,loca_setTimes,tour_starttime_val,tour_endtime_val,new Date(),new Date()]);
                console.log('>>>tourdetail insert rows>>>:',tourdetail_insert_rows);
                await connection.commit();
            }
            connection.release();

            return response.json({success:true, message:'tour and tourdetail server query success!!'}); 
                                
        }

    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개사등록한 매물 투어예약셋팅내역 특정 요소 삭제.관려된 삭제
router.post('/productToursetting_delete',async function(request,response){
    console.log('=======>>>request.body ::',request.body);

    var req_body= request.body;
    const connection = await pool.getConnection(async conn => conn);

    try{
        var tour_type = req_body.tour_type_val;
        var key_value = req_body.key_value;

        if(tour_type == 1){
            var [match_tourlist] = await connection.query("select * from tour where tour_group_id=?",[key_value]);//해당 tour_groupid 에관련된 리스트 tourid들 조회.
            for(let s=0; s<match_tourlist.length; s++){
                let loca_tourid=match_tourlist[s]['tour_id'];

                await connection.beginTransaction();
                var [delete_query] = await connection.query("delete from tour where tour_id=?",[loca_tourid]);
                console.log('detle quer yssss:',delete_query);
                await connection.commit(); //관련된 투어row들 모두 삭제한다.

                var [match_tourdetail_rows] = await connection.query("select * from tourdetail where tour_id=?",loca_tourid);
                for(let inner=0; inner<match_tourdetail_rows.length; inner++){
                    let loca_tdid= match_tourdetail_rows[inner]['td_id'];
                    await connection.beginTransaction();
                    let [delete_querys] = await connection.query("delete from tourdetail where td_id=?",[loca_tdid]);
                    console.log('delte tourdetail querytss:',delete_querys);
                    await connection.commit();//그 목록 삭제한다관련 목록 삭제.
                }
            }
        }else{
            var [match_tourlist] = await connection.query("select * from tour where tour_id=?",[key_value]);//삭제하려넌 특별추가목록 그 특정한개.

            for(let s=0; s<match_tourlist.length; s++){
                let loca_tourid=match_tourlist[s]['tour_id'];

                await connection.beginTransaction();
                var [delete_query] = await connection.query("delete from tour where tour_id=?",[loca_tourid]);
                console.log('detle quer yssss:',delete_query);
                await connection.commit(); //관련된 투어row들 모두 삭제한다.

                var [match_tourdetail_rows] = await connection.query("select * from tourdetail where tour_id=?",loca_tourid);
                for(let inner=0; inner<match_tourdetail_rows.length; inner++){
                    let loca_tdid= match_tourdetail_rows[inner]['td_id'];
                    await connection.beginTransaction();
                    let [delete_querys] = await connection.query("delete from tourdetail where td_id=?",[loca_tdid]);
                    console.log('delte tourdetail querytss:',delete_querys);
                    await connection.commit();//그 목록 삭제한다관련 목록 삭제.
                }
            }
        }

        connection.rollback();
        connection.release();

        return response.json({success:true, message:'delete query success!'});
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개사가 등록한 매물에 대해서 투어예약셋팅설정 tour,tourdetail등 테이블처리.
router.post('/productToursettingRegister',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);
    
    //try catch문 mysql 구문 실행구조. tour,tourDetail테이블 정보 insert
    try{
       
       var tour_type = req_body.tour_type; //투어타입 :일반,특별 추가여부
       var company_id=req_body.company_id;  //해당매물을 등록한 중개사id
       var mem_id=req_body.mem_id; //해당 중개사id 로그인 관련 유저(중개사회원 최초등록자)
       var prd_identity_ids=req_body.prd_identity_ids; //특정매물.

       var normal_isholidayexcept=req_body.normal_isholidayexcept !='' && req_body.normal_isholidayexcept ? req_body.normal_isholidayexcept : 0;  //공휴일제외여부.
       var normal_select_daycount=req_body.normal_select_daycount !='' && req_body.normal_select_daycount ? req_body.normal_select_daycount : 0;  //슬라이더 노출개수
       var normal_select_days=req_body.normal_select_days != '' && req_body.normal_select_days ? req_body.normal_select_days : ''; //선택요일들 개수.
       var normal_select_times=req_body.normal_select_times !='' && req_body.normal_select_times ? req_body.normal_select_times : ''; //선택시간들.

       if(normal_select_days && normal_select_days!=''){
          var normal_select_days_array = normal_select_days.split(','); //선택요일들. 월수금 했으면 월수금만 tourId에 추가.
       }
       
       var special_specifydate = req_body.special_specifydate !='' && req_body.special_specifydate ? req_body.special_specifydate : '0000-00-00';
       var special_specifydatetimes= req_body.special_specifydatetimes !='' && req_body.special_specifydatetimes ? req_body.special_specifydatetimes : '';
       var special_isexceptspecifydate= req_body.special_isexceptspecifydate != '' && req_body.special_isexceptspecifydate ? req_body.special_isexceptspecifydate : 0;
         

       //일반타입인경우 일반 tour_set_days항목 문자열형태 split중에서 기존항목중에서 새로추가하려는 항목중 하나가 존재 하나라도 하면 막는다.
        if(tour_type == 1){
            var prev_normal_toursetdays=[];
            var [prev_toursetList]=await connection.query("select tour_set_days from tour where prd_identity_id=? and tour_type=1 ",[prd_identity_ids]);
            console.log('prd_dioentity_id요청 매물에 대한 투어예약셋팅 일반 등록 리스트(date하나하나가 셋팅등록내역)',prev_toursetList);
            
            var count=0;
            for(let s=0; s<prev_toursetList.length; s++){
                let tour_set_days_split=prev_toursetList[s]['tour_set_days'].split(',');
                console.log('tour_sert_days_split result:',tour_set_days_split);
                for(let i=0; i<tour_set_days_split.length; i++){
                    prev_normal_toursetdays[count]=tour_set_days_split[i];

                    count++;
                }
            }
            connection.release();
            console.log('일반추가 요청 request요청처리 기존 prd_identity_id 관련 tour예약셋팅리스트 선택요일들 취합(중복포함):',prev_normal_toursetdays);
            prev_normal_toursetdays = Array.from(new Set(prev_normal_toursetdays));//set개체로 변환(중복없이)후에 그 set개체를 array로 반환받음
            console.log('일반추가 요청 request요청처리귀준 선택요일들 중복제거:',prev_normal_toursetdays);

            //해당 중복제거 선택된 요일리스트에서 새로 추가하려는것이 하나라도 발견될시에 추가연산 막는다.
            var is_overwraped_days=false;//일반 집합요일리스트 중에서, 기존에 선택된 요일들중 하나라도 추가하려고 하는경우에 중복여부
            for(let ss=0; ss<normal_select_days_array.length; ss++){
                for(let ii=0; ii<prev_normal_toursetdays.length; ii++){
                    if(normal_select_days_array[ss] == prev_normal_toursetdays[ii]){
                        is_overwraped_days=true;
                    }
                }
            }
            console.log('>>일반추가 요일중복여부::',is_overwraped_days);

            if(is_overwraped_days){

                return response.json({success:false, message:'이미 추가됀 요일집합입니다!', error:'already_day_exists'});
            }else{
                //추가 가능한 요일들 이라면.(일반)
                await connection.beginTransaction();

                //월수금/월수금/월수금/월 이렇게 추가했다면-> 10개가 총 tour추가되고,tourDetail은 10*3각 date별 설정한 시간대만큼 생성되게한다.
               // var outer_insert_loop= Math.ceil( normal_select_daycount / normal_select_days_array.length);//10/3->4 3/3/3/3 중에서 생성된것중에서 노출은 보여줄 항목수만큼만 하기에 안보여줄 tour_id에 대한 요청이 올 일은 없다.
               //로직수정::20210607 월수금 추가했으면 월수금 이렇게만 생성되게(tour테이블)
                //console.log('>>>>outer_insert_loop:',outer_insert_loop);

                //tour_group_id로써 쓰일 timestamp난수값 일반/특별 추가하려고했던 그 시간대 밀리초값 으로설정하여 추가된다.
                /*var tourgroupid_timestamp = new Date().getTime();
                console.log('>>>tourgroupid_timestamp:',tourgroupid_timestamp);
                for(let outer=0; outer < outer_insert_loop; outer++){
                    //3*4 월수금월수금월수금월수금 이렇게 생성한다. 뒤의 나머지 오버flow항목 tour_id는 클라이언트 미노출처리한다.
                    
                    for(let inner=0; inner < normal_select_days_array.length; inner++){
                        //4 * 3요일의 종류수만큼 (월수금 월수금) 내부 포문 돈다. 
                        //내부 포문은 각 요일이다. sun,sat,fri등 요일이다. 각 요일date별 tour_set_days지정한다. 각 date별 어떤 설정요일인지 지정일뿐.tour_set_times는 그 일반추가에서 했던것들 공통추가.
                        let inner_day_value=normal_select_days_array[inner];
                        var [tour_insert_rows] = await connection.query("insert into tour(tour_type,tour_group_id,prd_identity_id,company_id,mem_id,tour_set_days,tour_set_times,create_date,modify_date,is_tour_holiday_except,day_select_count,tour_set_specifydate,tour_set_specifydate_times,tour_specifyday_except) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[tour_type,tourgroupid_timestamp,prd_identity_ids,company_id,mem_id,inner_day_value,normal_select_times,new Date(),new Date(),normal_isholidayexcept,normal_select_daycount, special_specifydate,special_specifydatetimes,special_isexceptspecifydate]);
                        //date만큼 tourid 요소 테이블 요소 생성 overflow하게 생성, 보여질 개수 timestamp tourgroupid에 해당하는에 존재하는 day-select_count(선택항목표현수)만큼만 노출한다.
                        console.log('++>>>>>tour insert rows>>>>:',tour_insert_rows);
                    }
                }*/
                var tourgroupid_timestamp = new Date().getTime();//그 추가한 월,수,금 모두 같은값.
                console.log('>>>>tourgroupid_timestamp:',tourgroupid_timestamp);
                for(let l=0; l<normal_select_days_array.length; l++){
                    //각 요일들 월,수,금(mon,wed,fri) 이렇게 추가된다. 각 요일별 tour_set_days지정한다. tour_set_tes느 일반추가에서 했던것들 공통추가.
                    let day_value_local = normal_select_days_array[l];
                    var [tour_insert_rows] = await connection.query("insert into tour(tour_type,tour_group_id,prd_identity_id,company_id,mem_id,tour_set_days,tour_set_times,create_date,modify_date,is_tour_holiday_except,day_select_count,tour_set_specifydate,tour_set_specifydate_times,tour_specifyday_except) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[tour_type,tourgroupid_timestamp,prd_identity_ids,company_id,mem_id,day_value_local,normal_select_times,new Date(),new Date(),normal_isholidayexcept, normal_select_daycount, special_specifydate,special_specifydatetimes,special_isexceptspecifydate]);
                    console.log('>>>tour isnert rows::',tour_insert_rows);
                }

                connection.commit();

                // 유저단에서 대신 사용(시기별 유동적 수치) 그 시점당시의 origin fixed수치가 아님
                var [inserted_tourlist_rows] = await connection.query("select * from tour where tour_group_id=?",[tourgroupid_timestamp]);//고유한 투어그룹아디timestamp 로 같게 생성된 방금 생성된 tourid들 구한다.
                console.log('=>>>>>inserted tourlist rows>>:',inserted_tourlist_rows);


                //tourdetail inserteed query start
                await connection.beginTransaction();

                for(let h=0; h< inserted_tourlist_rows.length; h++){
                    let extracted_tourid= inserted_tourlist_rows[h].tour_id;//외부 포문이 위의 일반추가에서 추가된 요일들 월수금 반복문이고, 그 3개항목에 대해서 각각에 대해서 설정한 시간대들 x,y,z 등 내부 포문으로 각각 생성한다.

                    for(let inn=0; inn<normal_select_times.split(',').length; inn++){
                        //시간대 x,y,z각각 지정한다.
                        var select_times_val=normal_select_times.split(',')[inn];
                        console.log('normal-selectTimes split arrays:',select_times_val);
                        var td_starttime_val;
                        var td_endtime_val;
                        switch(select_times_val){
                            case '오전1T':
                                td_starttime_val = '9:00am';
                                td_endtime_val = '12:00pm';
                            break;
                            case '오후1T':
                                td_starttime_val = '12:00pm';
                                td_endtime_val = '15:00pm';
                            break;
                            case '오후2T':
                                td_starttime_val = '15:00pm';
                                td_endtime_val = '18:00pm';
                            break;
                        }
                        var [tourdetail_insert_rows] = await connection.query("insert into tourdetail(tour_id,td_text,td_starttime,td_endtime,create_date,modify_date) values(?,?,?,?,?,?)",[extracted_tourid,select_times_val,td_starttime_val,td_endtime_val,new Date(),new Date()]);
                        console.log('>>>>>>>tourdetail_insert_rows>>>:',tourdetail_insert_rows);
                    }
                }
      
                connection.commit();
                connection.release();

                return response.json({success:true, message:'tour and tourdetail server query success!!', result_data: [tour_insert_rows,tourdetail_insert_rows]});    
            }
            
        }else if(tour_type == 2){

            //var prev_special_setspecifydates=[];//추가한 날짜들 리스트 구한다.
            //var prev_special_except_specifydates=[];//제외한 날짜들 리스트 구한다.
            var prev_special_specifydates=[];//특정 추가or제외한 날짜리스트들 집합구한다. 두개를 공통적 날짜리스트로 해야한다. 

            //특정날짜를 제외or추가한 합집합 요청인 경우에는 기존 제외or추가 하려는 날짜들 리스트를 모두 뽑아서 저장(중복제거)한다.해서 그 리스트중에서 추가하려는 특정제외or추가날짜여부가 있는지 중복여부
            var [prev_tour_specifydate_rows] = await connection.query("select tour_set_specifydate from tour where tour_type=2 and prd_identity_id=?",[prd_identity_ids]);

            console.log('기존 제외 또는 추가되어있는 특정날짜리스트들:',prev_tour_specifydate_rows);

            for(let s=0; s<prev_tour_specifydate_rows.length; s++){
                prev_special_specifydates[s]=prev_tour_specifydate_rows[s]['tour_set_specifydate'];
            }
            prev_special_specifydates = Array.from(new Set(prev_special_specifydates));//특정 제외날짜리스트들 중복제거 array반환
            console.log('중복제거 제외 특정날짜리스트들:',prev_special_specifydates);

            var is_overwraped_specifydates=false;//특정제외or추가날짜 중복여부

            for(let se=0; se<prev_special_specifydates.length; se++){
                if(special_specifydate == prev_special_specifydates[se]){
                    //제외or추가하려는 특정날짜가 기존 리스트중에서 발견되었다면
                    is_overwraped_specifydates=true;
                }
            }
            console.log('>>특별날짜 제외or추가 요일중복여부:',is_overwraped_specifydates);

            if(is_overwraped_specifydates){
                return response.json({success:false , message: '이미 추가or제외 등록한 특정날짜입니다.',error:'already_specifydate_exists'});
            }else{
                //추가 가능한 제외또는 등록 특정날짜라면
                var tour_start_date=special_specifydate;
                var tour_end_date=special_specifydate;//특정 설정한 날짜값 하루에 시작~종료라는 저장 표현.

                var [tour_insert_rows] = await connection.query("insert into tour(tour_type,prd_identity_id,company_id,mem_id,tour_start_date,tour_end_date,tour_set_days,tour_set_times,create_date,modify_date,is_tour_holiday_except,day_select_count,tour_set_specifydate,tour_set_specifydate_times,tour_specifyday_except) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[tour_type,prd_identity_ids,company_id,mem_id,tour_start_date,tour_end_date,normal_select_days,normal_select_times,new Date(),new Date(),normal_isholidayexcept,normal_select_daycount,special_specifydate,special_specifydatetimes,special_isexceptspecifydate]);
                connection.commit();
                console.log('tour_insert_rows :',tour_insert_rows,tour_insert_rows.insertId);
                //connection.release();
                var extract_insertTourid=tour_insert_rows.insertId;

                await connection.beginTransaction();

                for(let dinn=0; dinn<special_specifydatetimes.split(',').length; dinn++){
                    var loca_setTimes=special_specifydatetimes.split(',')[dinn];//오전1t,오후1t,..등 여부 저장. 어떤 특정 date에 대한 tourid정보 하나 추가되고,tourstart~enddate추가되었고 그tourid에 대해서 설정한 시간대들만큼 detail적으로 하여 어떤 항목별 start~endtime지정, td_text는 해당 special add tourid에 대하ㅐ 지정된 시간대들 하나하나 방(시간표)
                    var tour_starttime_val;
                    var tour_endtime_val;
                    switch(loca_setTimes){
                        case '오전1T':
                            tour_starttime_val = '9:00am';
                            tour_endtime_val = '12:00pm';
                        break;
                        case '오후1T':
                            tour_starttime_val = '12:00pm';
                            tour_endtime_val = '15:00pm';
                        break;
                        case '오후2T':
                            tour_starttime_val = '15:00pm';
                            tour_endtime_val = '18:00pm';
                        break;
                    }
                    var [tourdetail_insert_rows] = await connection.query("insert into tourdetail(tour_id,td_text,td_starttime,td_endtime,create_date,modify_date) values(?,?,?,?,?,?)",[extract_insertTourid,loca_setTimes,tour_starttime_val,tour_endtime_val,new Date(),new Date()]);
                    console.log('>>>tourdetail insert rows>>>:',tourdetail_insert_rows);
                }

                connection.commit();

                connection.release();

                return response.json({success:true, message:'tour and tourdetail server query success!!', result_data: [tour_insert_rows,tourdetail_insert_rows]}); 
            }                    
        }

    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//투어예약셋팅 비활성화 활성화 토글링
router.post('/productTourSetting_activeToggle',async function(request,response){
    console.log('=====+======>>request.body::',request.body);

    var req_body = request.body;
    console.log('req_bodyss::',req_body);
    const connection = await pool.getConnection(async conn => conn);

    console.log('/proudcdtToursettling activetotlge reuqest:');

    try{
        var company_id = req_body.company_id;
        var prd_identity_id = req_body.prd_identity_id;
        var active_val = req_body.active_val;

        var [select_product] = await connection.query("select * from product where prd_identity_id=? group by prd_identity_id",[prd_identity_id]);//해당 prdieintityid값 관련 내역 중 관려 낸역 오리진 정보 조회.그 오리진정보의 is_tour_active기준 조회.해당prd_id
        var target_prdid=select_product[0].prd_id;
       
        var [product_update_query] = await connection.query("update product set is_tour_active=? where prd_id=?",[active_val,target_prdid]);
        console.log('product_update_query query::',product_update_query);
        await connection.commit();
        
        connection.release();

        return response.json({success:true,message:'server query success'});
    }catch(err){
        console.log('server query error',err);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//중개사가 등록한 매물별 물건투어예약셋팅 설정 리스트(일반,특별추가리스트) tour,tourDetail등..
router.post('/productToursettinglist',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;
    console.log('req_body :',req_body);
    const connection=await pool.getConnection(async conn=> conn);
    

    //try catch문 mysql 구문 실행구조.
    try{
        var company_id=req_body.company_id;
        var prd_identity_id=req_body.prd_identity_ids;

        var [productquery] = await connection.query("select * from product where prd_identity_id=? group by prd_identity_id",[prd_identity_id]);
        var is_tour_active= productquery[0]['is_tour_active'];//1 or 0,null등의값.

        //마이페이지 propertyToursetting/17 특정 매물에 대한 예약 물건투어셋팅리스트 tourgroupid구분 그룹지어서.
        var [productToursettinglist_row_groupOuter] = await connection.query("select distinct tour_group_id from tour where company_id=? and prd_identity_id=? and tour_type=1",[company_id,prd_identity_id]);
        console.log('productToursettinglist_row_groupOuter row:',productToursettinglist_row_groupOuter);

        var normal_touridgroup_info={};//tour_groupid별 키값을 가지고있고, 그 각 그룹아디별 리스트 취합한 요일 집합리스트월수금월수금등), 설정시간대들 그들끼리는 모두 같기의 임의하나아무거나선정 등의 정보 묶어서 표현하는 저장.
        
        for(let outer=0; outer<productToursettinglist_row_groupOuter.length; outer++){
            let tour_group_id_cond=productToursettinglist_row_groupOuter[outer]['tour_group_id'];

            var local_yoil_values_overwraped = [];//그룹투어아디에 해당하는 월수금 월수금 월수금 리스트 중복포함 요일들.
            var local_set_times_overwraped = [];
            var [group_tourlist_rows] = await connection.query("select * from tour where company_id=? and prd_identity_id=? and tour_group_id=? and is_tour_tempdelete=0",[company_id,prd_identity_id,tour_group_id_cond]);//미삭제되어있고 존재하는 유효한 요일들만 보인다.
            console.log('group_tourlist_rows::',group_tourlist_rows);
            for(let inner=0; inner<group_tourlist_rows.length; inner++){
                //해당 그룹id에 해당하는 세부 관련 tourlist요소들>>>>
                local_yoil_values_overwraped.push( group_tourlist_rows[inner]['tour_set_days'] );//1덩어리:월수금월수금/ 2덩어리:화목화목화목/ 3덩어리: 일토일토일토 형태로 한다. 중복포함한 요일들을 저장한다.
                local_set_times_overwraped.push(group_tourlist_rows[inner]['tour_set_times'] );
            }
            var local_yoil_values_settle = Array.from(new Set(local_yoil_values_overwraped));//그룹투어리스트 rows 투어리스트 특정 매물id,그룹투어아디,회사,memid에 해당하는 투어리스트요소에 있는 요일집합리스트 중복제거.
            var local_set_times_settle = Array.from(new Set(local_set_times_overwraped));

            console.log('========>>>중복제거한 요일집합리스트:',local_yoil_values_settle , local_set_times_settle);
            normal_touridgroup_info[tour_group_id_cond] = {};
            normal_touridgroup_info[tour_group_id_cond]['yoil_set_days'] = local_yoil_values_settle;
            normal_touridgroup_info[tour_group_id_cond]['set_times'] = local_set_times_settle;//중복제거한 다 같은 요소들일것이고,tour set times시간대들 값 지정한다.
            normal_touridgroup_info[tour_group_id_cond]['tour_type'] = 1;//일반 타입 덩어리 추가.
        }

        //특별 추가 리스트 리턴.
        var special_tourgroup_info={};//tour_id별(어차피 특별은 하나하나가 한 예약셋팅이기에) 각 특별추가의 tour_id로 구분,키로 한다.
        var [productToursettinglist_row_special] = await connection.query("select * from tour where company_id=? and prd_identity_id=? and tour_type=2 and is_tour_tempdelete=0",[company_id,prd_identity_id]);//해당 중개사가 해당매물에 대해서 등록한 특별추가리스트 제외,추가리스트 모두 구한다.

        for(let loo=0; loo<productToursettinglist_row_special.length; loo++){
            let special_tourrow_item=productToursettinglist_row_special[loo];
            console.log('added special tourlist rows:',special_tourrow_item);
            special_tourgroup_info[special_tourrow_item['tour_id']]={};
            special_tourgroup_info[special_tourrow_item['tour_id']]['set_specifydate']=special_tourrow_item['tour_set_specifydate'];
            special_tourgroup_info[special_tourrow_item['tour_id']]['set_specifydatetimes'] = special_tourrow_item['tour_set_specifydate_times'];
            special_tourgroup_info[special_tourrow_item['tour_id']]['tour_type'] = 2;//특별 타입.
            special_tourgroup_info[special_tourrow_item['tour_id']]['tour_specifyday_except'] = special_tourrow_item['tour_specifyday_except'];//특별 추가/제외여부 타입
        }
        
        connection.release();

        console.log('==>>>>normal_touridgroup_info and specailtrougroupinfo >>>>> :',normal_touridgroup_info, special_tourgroup_info);

        return response.json({success:true, message:'proudctTOursettinglist server query success!!', result_data: [normal_touridgroup_info,special_tourgroup_info], is_tour_active : is_tour_active});
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//물건투어예약셋팅내역(일반) 한개 정보 열람조회. 일반수정.
router.post('/productTournormalsetting_singleitemview',async function(request,response){
    console.log('==========>>request.body::',request.body);

    var req_body=request.body;
    console.log('req_BODYSSS:',req_body);
    const connection = await pool.getConnection(async conn=>conn);
    
    try{
        var key_val = req_body.key_value;//tourgroupid 

        var [productnormalSetting_groupid_rows] = await connection.query("select * from tour where tour_group_id=? and tour_type=1 and is_tour_tempdelete=0",[key_val]);
        connection.release();
        var tour_set_days=[];
        var tour_set_times='';
        var day_select_count;
        var is_tour_holiday_except;
        for(var ss=0; ss<productnormalSetting_groupid_rows.length; ss++){
            var item=productnormalSetting_groupid_rows[ss];
            tour_set_days[ss] = item['tour_set_days'];//각 요일들 추가한다.
            tour_set_times = item['tour_set_times'];//각 row별 (그룹id별 모두 같다.) 설정 시간대값들.
            day_select_count = item['day_select_count'];
            is_tour_holiday_except= item['is_tour_holiday_except'];
        }
        console.log('tour_set_dayssss:',tour_set_days);
        console.log('tour_settimes,day,selectcount,istourholdaexcept:',tour_set_times,day_select_count,is_tour_holiday_except);
       
        return response.json({success:true, message:'success', tour_set_days_result:tour_set_days, tour_set_times_result:tour_set_times, day_select_count_result: day_select_count, is_tour_holiday_except_result: is_tour_holiday_except});

    }catch(err){
        console.log('server quewry erorr;:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query error ful probmlem error'});
    }
});
//물건투어예약셋팅내역(특별) 한개 정보 열람조회  특별수정.
router.post('/productTourspecialsetting_singleitemview',async function(request,response){
    console.log('===========>>request.body::',request.body);

    var req_body= request.body;
    console.log('req bodysss:',req_body);
    const connection = await pool.getConnection(async conn=>conn);

    try{
        var key_val =req_body.key_value;

        var [productspecialSetting_rows] = await connection.query("select * from tour where tour_id=? and tour_type=2",[key_val]);//특정 tourid특별 추가된 내역에 대한특별셋팅정보 조회
        console.log('productspecialSetting_rows:::',productspecialSetting_rows);
        connection.release();
        var tour_set_specifydate = productspecialSetting_rows[0]['tour_set_specifydate'];
        var tour_set_specifydate_times= productspecialSetting_rows[0]['tour_set_specifydate_times'];
        var tour_specifyday_except = productspecialSetting_rows[0]['tour_specifyday_except'];
        console.log('tour set sepeicfyadte,times,except여부:',tour_set_specifydate,tour_set_specifydate_times,tour_specifyday_except);

        return response.json({success:true, message:'success',tour_set_specifydate_result:tour_set_specifydate, tour_set_specifydate_times_result:tour_set_specifydate_times, tour_specifyday_except_result: tour_specifyday_except});

    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'serverquery error full problme error'});
    }
});
//특정 등록된 매물에 셋팅된 투어예약셋팅 정보 리스트 조회한다.
router.post('/brokerProduct_toursetting_dates',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;
    console.log('req_body :',req_body);
    const connection=await pool.getConnection(async conn=> conn);
    console.log('>>>>pool connection Test:',pool);

    //try catch문 mysql 구문 실행구조.
    try{
        var prd_identity_id=req_body.id;

        var [product_query] = await connection.query('select * from product where prd_identity_id=? group by prd_identity_id',[prd_identity_id]);//해당 매물id그룹값내역중 그룹바이 오리진내역 정보 조회.
        var is_tour_active=product_query[0]['is_tour_active'];
        console.log('해당 매물 투어예약셋팅 활성화 여부:',is_tour_active);
        if(is_tour_active!=1){
            //null이나 빈값이나 1이 아닌 값이라면 멈춤!

            console.log('비활성화 상태으 ㅣ매물임! 내역을 보이지 않음!!! 처리하지 않음!');
            connection.release();
    
            return response.status(403).json({success:false, message:'inactive status'});
        }

        //일반추가 요일목록들(일반요일들 집합끼리는 요일중복 발생하지 않게 처리되어있기에, 각 일반row별로는 요일들이 서로 다르다는 전제하임.) 일반 추가 항목들 일반 origin에 의해서 추가된 일반 예약셋팅 각날짜별 date목록들 각 date당 하나가 일반투어하나항목이다. 특별 투어추가항목과 겹치는것 포함하여 그냥 다 내보낸다.
        var [producutnormalSetting_groupid_rows] = await connection.query("select distinct tour_group_id from tour where prd_identity_id=? and tour_type=1",[prd_identity_id]);
        
        //특정 추가일자들 결과물 반환.
        var [product_special_specifydate_tourRow] = await connection.query("select * from tour where prd_identity_id=? and tour_type=2 and tour_specifyday_except!=1",[prd_identity_id]);

        //특정 제외일자들 결과물 반환.
        var [product_special_exceptdate_tourRow] = await connection.query("select * from tour where prd_identity_id=? and tour_type=2 and tour_specifyday_except=1",[prd_identity_id]);
        
        //우선 1. 일반 추가 요일목록들(각 일반추가목록row끼리는 요일중복 없는 형태일것이고, 중복이 없기에 선택한 요일들에 해당하는 ) 노출 개수에 따른 반복이 우선 필요.
        
        var yoil_dateArray={};
        var total_display_count=0;//각 row별 표현할 요일개수들의 합으로 최종적 합계를 지정한다.
        var all_data_structure={};//각 그룹id별 월수금 5 월수금월수금->xxxx,  화목토7 화목토화목토화목토->xxx  의 형대로 각 그룹id별 배열을 저장하고있고 이를 concat한 자료구조로형태로한다.
        for(let row_outer=0; row_outer < producutnormalSetting_groupid_rows.length; row_outer++){
            //월수금(일반추가내역)groupid덩어리 loop s
            console.log('======normal added row count loop start===========================================>>>');

            var tour_group_id_val = producutnormalSetting_groupid_rows[row_outer]['tour_group_id'];//투어그룹아디
            all_data_structure[tour_group_id_val]={};
            var [normalSetting_child_rows] = await connection.query("select * from tour where prd_identity_id=? and tour_type=1 and tour_group_id=? and is_tour_tempdelete=0",[prd_identity_id, tour_group_id_val]);
            var normalSetting_childcnt=0;
            var is_tour_holiday_except=normalSetting_child_rows[0]['is_tour_holiday_except'];
            //tour_group_id에 해당하는 내역수. 요일의 지정수를 의미 월수금
            for(let inner=0; inner<normalSetting_child_rows.length; inner++){
                normalSetting_childcnt++;
            }

            var normal_outer_loopcount= Math.ceil( normalSetting_child_rows[0]['day_select_count'] / (normalSetting_childcnt));//올림처리한것 반복회수   11/3=>3.xxx=4    6/2=3 나눠떨어지는경우, 떨어지지 않는경우 올림처리 원래 표현수보다 더 많은 datelist저장.
            console.log('normal_outer_loopcouint 요일별 반복주기회수:',normal_outer_loopcount);
            
           total_display_count += normalSetting_child_rows[0]['day_select_count'];//최종적 표현개수합계 날짜표현갯수
            var day_select_count_outer=normalSetting_child_rows[0]['day_select_count'];
            //var normal_lastloop_innercount= product_normal_setting_tourRow[0]['day_select_count'] % (product_normal_setting_tourRow[0]['tour_set_days'].split(',').length);//5%3=2 6%2=0 나머지 여부에 따라 마지막 반복문에서 어떻게 처리되는지 여부 정해짐.                
            //선택항목날짜 표현수 / 요일종류수 다 딱 나눠떨어지는경우에는 모든outer 반복주기회수 = 각 요일별 반복주기회수 모두 동일할당.  6%2 ==0 , 3회반복. 각 반복회수만큼 요일종류별로 저장한다. 각 요일의 반복주기횟수 

            //각 row별 (normal) 설정한 시간대값 tour_set_times mon,fri 안에서 그 두 조합은 공통 시간대설정값 지정한다. 모두 일관된 같은 시간대설정값 지정한다.
            var normal_tour_setTimes= normalSetting_child_rows[0]['tour_set_times'];//오전,오후1t,2t 이런식 문자열 
            
            var [normalSetting_child_rows2] = await connection.query("select * from tour where prd_identity_id=? and tour_type=1 and tour_group_id=? and is_tour_tempdelete=0",[prd_identity_id, tour_group_id_val]);
            var yoilgroup_per_datestore=[]; var yoilgroup_per_cnt=0;


            for(let ss=0; ss<normalSetting_child_rows2.length; ss++){
                //groupid덩어리 loop에있었던 세부적 요일별 tourid(투어아이디하나가 각 요일을 의미하게된다.)요일기반.
                let middle=0;
                let nowtime=new Date();//현재의 날짜를 구한다.
                let yoil_match_dates=[];//각 요일별 현재날짜로부터기준해서 오름차순으로 있는 날짜값들 저장한다. 각 날짜에 대한 정보를 의미한다.
                let secure_count=0;
                let yoil_value = normalSetting_child_rows2[ss]['tour_set_days'];//월수금토일 각 요일값 toursetday

                var tour_id = normalSetting_child_rows2[ss]['tour_id'];//일반/특별 물건투어예약row별 추가한 tour_id값 각 추가한 normal,special 리스트에 대한 날짜들값이 최종적 하나하나가 어떤 tour_id(노말 또는 특별추가:특별 우선순위로 덮어씌워짐) 에 해당하는 예약방셋팅인지 알필요가 있음. 한 매물에 대해 여러 예약방셋팅을 해놓고 그 방에 예약을 받는것과도 같다. 월 수 금 각 tourid (한 tourid가 한 요일에 대한 정보를 담음.)
                var tour_type= normalSetting_child_rows2[ss]['tour_type']; //일반/특별 추가 투어항목여부 일반방?특별방??

                while(middle<normal_outer_loopcount){
                    console.log('=>>>>>>>>>>>>>inner loop start.....');
                    //월->6/2    수=> 6/2 각 요일별 세번씩 주기반복. 0,1,2 요일별 반복주기회수
                    //해당 요일에 대해서 반복문 회수만큼 검사한다. normal_outer_llopcount회수만큼 각 요일종류별 주기회수 저장된다.  각 요일별로  10 / 월수금개수 -> 4 주기회수반복. 월수금월수금월수금월수금 네번씩저장하게된다. 각 요일별 네번씩 n번씩 반복저장.
                    let local_day_int=nowtime.getDay();
                    let local_day_string; 
                    switch(local_day_int){
                        case 0:
                            //console.log('일요일');
                            local_day_string = 'sun';
                        break;
                        case 1:
                            //console.log('월요일');
                            local_day_string = 'mon';
                        break;
                        case 2:
                            //console.log('화요일');
                            local_day_string = 'tue';
                        break;
                        case 3:
                            //console.log('수요일');
                            local_day_string = 'wed';
                        break;
                        case 4:
                            //console.log('목요일');
                            local_day_string = 'thr';
                        break;
                        case 5:
                            //console.log('금요일');
                            local_day_string = 'fri';
                        break;
                        case 6:
                            //console.log('토요일');
                            local_day_string = 'sat';
                        break;
                    }
                    console.log(nowtime.getFullYear()+'-'+(nowtime.getMonth()+1)+'-'+nowtime.getDate()+'::'+local_day_string);//반복문 나열되는 매 요일별 오늘이후의 무수한 날짜들중에서 선형적으로 오름차순으로 각 요일에 대응되는 날짜들을 요일별 매칭날짜수만큼 매칭될시에 반복문 멈춘다.

                    if(yoil_value == local_day_string){
                        //외부 반복문 요일종류값 == 내부 순환 date값 요일 일치하는것
                        yoil_match_dates[middle] = {};

                        if(nowtime.getMonth()+1 < 10){
                            nowtime_getmonth= '0'+ ( parseInt(nowtime.getMonth())+1); //01,02,03,04,.....09
                        }else{
                            nowtime_getmonth = parseInt(nowtime.getMonth())+1;//10,11,12
                        }

                        if(nowtime.getDate() < 10){
                            nowtime_getDate = '0'+ parseInt(nowtime.getDate());//01,02,03,......09
                        }else{
                            nowtime_getDate = nowtime.getDate();//10,11,12,...29,30,31
                        }

                        yoil_match_dates[middle]['date'] = nowtime.getFullYear()+'-'+nowtime_getmonth+'-'+nowtime_getDate;//각 날짜값 문자열 형태로 매치되는것 저장. 요일별
                        //매치가 된 date값들을 찾을때마다 카운트변수 증가시킨다.
                        yoil_match_dates[middle]['setTimes'] = normal_tour_setTimes;//모두 일관된 값을..
                        yoil_match_dates[middle]['tour_id'] = tour_id;
                        yoil_match_dates[middle]['tour_type'] = tour_type;
                        yoil_match_dates[middle]['is_tour_holiday_except']=is_tour_holiday_except;
                        middle++;

                        console.log('yoil_match_dates:',yoil_match_dates);

                        yoilgroup_per_datestore[yoilgroup_per_cnt] = {};
                        yoilgroup_per_datestore[yoilgroup_per_cnt]['date'] = nowtime.getFullYear()+'-'+nowtime_getmonth+'-'+nowtime_getDate;//각 날짜값 문자열 형태로 매치되는것 저장. 요일별
                        //매치가 된 date값들을 찾을때마다 카운트변수 증가시킨다.
                        yoilgroup_per_datestore[yoilgroup_per_cnt]['setTimes'] = normal_tour_setTimes;//모두 일관된 값을..
                        yoilgroup_per_datestore[yoilgroup_per_cnt]['tour_id'] = tour_id;
                        yoilgroup_per_datestore[yoilgroup_per_cnt]['tour_type'] = tour_type;
                        yoilgroup_per_datestore[yoilgroup_per_cnt]['is_tour_holiday_except'] = is_tour_holiday_except;

                        yoilgroup_per_cnt++;
                    }
                                        
                    nowtime = new Date(nowtime.setDate(nowtime.getDate() + 1));

                    if(secure_count >=200){
                        break;
                    }
                    console.log('=====>>>>inner loop end..===========');
                }
                yoil_dateArray[yoil_value] = yoil_match_dates;

                console.log('===============outer loopp end..ssssssss================================');
            }
            console.log('======normal added row count loop ends===========================================>>>');  
            console.log('outer group display slides couns:',day_select_count_outer,yoilgroup_per_datestore);
            var yoilgroup_per_datestore_ascend= yoilgroup_per_datestore.sort(data_ascending);
            let temp_store=[];
            for(let ss=0; ss<yoilgroup_per_datestore_ascend.length; ss++){
                if(ss < day_select_count_outer){
                    temp_store[ss]=yoilgroup_per_datestore_ascend[ss];
                }
            } 
            console.log('각 groupid별 dayselect count수만큼만 저장처리:',temp_store);
            yoilgroup_per_datestore_ascend = temp_store.slice();//배열을 잘라내어 원소들 배열로써 리턴. 참조리퍼렌서가 아니라 값할당.
            console.log("make_groupi per yoil_date_store::",yoilgroup_per_datestore_ascend);

            all_data_structure[tour_group_id_val]=yoilgroup_per_datestore_ascend;
            //console.log('alldata structure::',all_data_structure);
        }

        //normal row loops date processing 처리이후 normal datelist자료 취합
        console.log('all yoil date info:',yoil_dateArray);
        console.log('alldata structure::',all_data_structure);
        console.log('일반추가 데이터 전체 요일별 키/값 데이터 조회=========================');

        var simple_all_dateList=[];//전체 일반 결과row별 요일들 집합들 합은 총 7개 최대 7개 넘을수없음(중복없음) x<=7
        var all_datelist_index=0;

        /*for(key in yoil_dateArray){
            console.log('yoil_dateArray:',yoil_dateArray[key]);

            //각 요일별 배열요소 순회하여 모든 날짜들 all저장.
            let local_datelist=yoil_dateArray[key];//각 키값에 대한 값은 배열이다 키:요일/값:요일에 대한 반복주기날짜값들.
            for(let s=0; s<local_datelist.length; s++){
                simple_all_dateList[all_datelist_index]=local_datelist[s];

                all_datelist_index++;
            }
        };
        */
        for(key in all_data_structure){
            console.log('data sturcute arrayss:',all_data_structure[key]);
            let local_datelist=all_data_structure[key];//array 

            for(let s=0; s<local_datelist.length; s++){
                simple_all_dateList[all_datelist_index] = local_datelist[s];

                all_datelist_index++;
            }
        }
        console.log('총 저장 날짜리스트(오름차순 정렬전):',simple_all_dateList);

        //총 저장 날짜들 오름차순 정렬진행.=>>>>(일반 추가날짜들)
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
            var left = new Date(a['date']).getTime();
            var right = new Date(b['date']).getTime();

            return left < right ? 1 : -1;
        }
        var ascend_all_normaldateList=simple_all_dateList.sort(data_ascending);
        console.log('오름차순 정렬 총 저장 날짜리스트:',ascend_all_normaldateList);
        console.log('+=>>>>normal datelist총 표현개수:',total_display_count);

        //2단계. normallist + speical addList dateMerged
        var merged_dateList = [];
        for(let m=0; m<ascend_all_normaldateList.length; m++){
           
            merged_dateList[m] = ascend_all_normaldateList[m];
                     
        }
        console.log('>>>>>mereged_dateList 초기상태 , 각 normalRow별 보여줄 선택항목요일수합계만큼만 display저장',merged_dateList);
    
        console.log('=>>>>>>product_special_specifydate_tourRow list:',product_special_specifydate_tourRow);

        if(merged_dateList.length == 0){
            //이런경우는 사실상 ascend_all_normaldateList 가 비어있는경우 일반추가로 인한 목록이 없던 경우로써 합병할피요가없고 그냥 해당 배열에 바로 특별추가목록들을 추가한다.
            console.log('일반추가리스트 dateList가 없던 경우로 바로 특별추가날짜들 추가한다.');
            for(let row_outer=0; row_outer < product_special_specifydate_tourRow.length; row_outer++){
                let added_special_specifydate = product_special_specifydate_tourRow[row_outer];
                merged_dateList.push({date : added_special_specifydate['tour_set_specifydate'], setTimes: added_special_specifydate['tour_set_specifydate_times'], tour_id : added_special_specifydate['tour_id'], tour_type: added_special_specifydate['tour_type']});
            }
        }else{
            for(let row_outer=0; row_outer < product_special_specifydate_tourRow.length; row_outer++){
                let added_special_specifydate= product_special_specifydate_tourRow[row_outer];//특정 추가하련는 특정날짜값.
                let is_already_exists_date=false;//추가하려는 특정날짜값이 기존 노말dateList에 존재하는지 여부 존재하지않으면 내부for문에서 발견되지 않을것이고, 새로이 mereged에 뒤에 push한다.
                for(let in_cond=0; in_cond < merged_dateList.length; in_cond++){
                    if(added_special_specifydate['tour_set_specifydate'] == merged_dateList[in_cond]['date']){
                        console.log('추가하려는 특정add날짜 기존normalist날짜와 겹침:',added_special_specifydate['tour_set_specifydate']);
                        merged_dateList[in_cond]['tour_id'] = added_special_specifydate['tour_id'];
                        merged_dateList[in_cond]['tour_type'] = added_special_specifydate['tour_type'];
                        merged_dateList[in_cond]['setTimes'] = added_special_specifydate['tour_set_specifydate_times'];
                        //추가하려는 특정날짜값에 해당하는 기존요소가 발견되면 그 기존요소에 값에 특정날짜의 시간대값을 덮어씌운다(udpate) 투어예약추가유형과,고유아디를 특별에 있던걸로 갱신합니다. 
                        is_already_exists_date=true;
                    }
                }//inner for loop search end.
    
                if(is_already_exists_date == false){
                    //존재하지 않은 날짜라면 새로이 push추가한다.
                    merged_dateList.push({date : added_special_specifydate['tour_set_specifydate'], setTimes: added_special_specifydate['tour_set_specifydate_times'], tour_id : added_special_specifydate['tour_id'], tour_type : added_special_specifydate['tour_type']});
                }
            }
        }
        
        console.log('=>>>>>mereged_dateList 합병상태, normalDATElIST + SPECIALaddDateList 중복제외한 mereged상태:',merged_dateList);
        var ascend_all_mergedDateList = merged_dateList.sort(data_ascending);
        console.log('=>>>>>mereged ascend오름차순정렬 배열:',ascend_all_mergedDateList);

        connection.release();

        console.log('->>>>product_special_exceptdate_tourRow list:',product_special_exceptdate_tourRow);

        //서버에선 특별추가한 요소  + 일반추가한 요소 (덮어씌워지는 교집합연산) 합집합 연산까지 지원해준다. 제외연산은 클라이언트(프론트)단에서 처리한다.
        return response.json({success:true, message:'proudctTOursettinglist server query success!!', result_total_data: ascend_all_mergedDateList, except_special_specifydate_tourRowlist : product_special_exceptdate_tourRow});
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});

//해당 클릭 tourid(날짜)에 대한 관련 상세시간대(td_id)리스트 
router.post('/brokerProduct_tourid_tourdetailList',async function(request,response){
    console.log('=->>>>>>>>>>>>request.body:',request.body);

    var req_body=request.body;
    var tour_id=req_body.tour_id_val;
    const connection = await pool.getConnection(async conn => conn);
    console.log('>>>>pool connection Test:',pool);

    try{
        var [product_tourdetaillist_rows] = await connection.query("select * from tourdetail where tour_id=?",[tour_id]);//해당 아디에 대한 디테일투어 설정 td_id리스트 구한다. 그 td_id에대ㅐ허 선택할시에 예약이 몰리는 개념이다.
        console.log('>>>>>====product_tourdetaillist_rows:',product_tourdetaillist_rows);
        connection.release();

        return response.json({success:true, result_data : product_tourdetaillist_rows});
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
//사용자 투어예약셋팅매물에 대한 투어예약접수(신청)
router.post('/brokerProduct_tourReservation_register',async function(request,response){
    console.log('=>>>>>>>request.body:',request.body);

    var req_body=request.body;
    var prd_identity_id=req_body.prd_identity_id;//어떤 매물id값에 대해서 있던 tourid셋팅내역에 대한건지,해당 tourid예약세팅내역 삭제되면 없어지면 안되기에 prd_identityid어떤매물에 대해서 등록이 되어있었던 셋팅에 대해서 접수했던건지 내역은 계속 남아있어야하고 투어예약셋팅이 근데 삭제되면 기존것이 아니라 현재 매물에 등록되어있는 셋팅내역 날짜리스트 기준으로 뜰것임.(접수내역조회시에.수정,일괄수정 등시에)
    var tour_id=req_body.slectTourid;//어떤 tourid(투어요일)에 대해 요청하는건지
    var td_id=req_body.selectTdid;//어떤 tdid(투어요일>디테일시간대 : 오전1t,오후1,2t)에 대해 요청하는건지
    var tour_type=req_body.selectTourtype;//어떤 투어타입 일반,특별에 대해 요청하는건지 예약
    var tour_selectDate= req_body.selectdate;//선택한 투어예약날짜값.
    var reserv_start_time = req_body.reserv_start_time;
    var reserv_end_time = req_body.reserv_end_time;//예약시작시간대 종료시간대(몇일 몇시몇분)여부 저장.처음에 신청시에는 몇시부터 몇시까지형태로 만 저자오디는 형태이다가 중개사가 확정조율 시간대 지정시 startr,end time값 같은 시간대값 몇미몇분으로 저장.
    var request_user_selectsosokid=req_body.request_user_selectsosokid;//어떤 소속상태에 회원이 신청했던건지 

    console.log('request_sessionid:',request.session.user_id,request.session);

    //이걸 요청하는 로그인된 유저가 요청하는것으로 저장.
    var mem_id=request.session.user_id !='' ? request.session.user_id : -1;
    var phone=req_body.phone !=''? req_body.phone : '';
    var email=req_body.email !=''? req_body.email : '';
    var user_name=req_body.user_name !='' ? req_body.user_name :'';
    var user_type=req_body.user_type !='' ? req_body.user_type :'';

    const connection=await pool.getConnection(async conn => conn);
    console.log('>>>>pool connection Test:',pool);

    try{
        var [brokerproduct_tourReservation_insert] = await connection.query("insert into tourReservation(td_id,tour_id,prd_identity_id,mem_id,create_date,modify_date,tr_name,tr_email,tr_phone,tr_type,tr_status,tr_user_reservtime,tour_reservDate,reserv_start_time,reserv_end_time,request_user_selectsosokid) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[td_id,tour_id,prd_identity_id,mem_id,new Date(),new Date(),user_name,email,phone,0,0,new Date(),tour_selectDate,reserv_start_time,reserv_end_time,request_user_selectsosokid]);

        console.log('=>>>>>>brokerproduct_tourReservationInsert:',brokerproduct_tourReservation_insert,brokerproduct_tourReservation_insert.insertId);
        connection.release();

        return response.json({success:true, result_data : {'insertid':brokerproduct_tourReservation_insert.insertId,'reservdate':tour_selectDate}});
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//사용자 내투어예약접수에 대한 수정진행.
router.post('/mybrokerProduct_tourReservation_modify',async function(request,response){
    console.log('=>>>>>>>request.body:',request.body);

    var req_body=request.body;
    
    var tr_id=req_body.tr_id; //어떤 tr_id 어떤 예약접수내역에 대해 수정
    var selectDay=req_body.selectdate; //어떤 선택날짜 선택한날짜.
    var selectTourid=req_body.selectTourid;//어떤 tourid
    var selectTourtype=req_body.selectTourtype; //어떤 투어타입
    var selectTdid=req_body.selectTdid; //어떤 요일의 시간대.
    var reserv_start_time=req_body.reserv_start_time;//어떤 시간대값(개인기업 사용자) 몇시몇분으로 시작,종료시간 수정했는지 ㅕ부 어떤tdid에 해당하는 시작종료시간값 몇시몇분 형 태 저장.
    var reserv_end_time = req_body.reserv_end_time;

    const connection=await pool.getConnection(async conn => conn);
    console.log('>>>>pool connection Test:',pool);

    try{
        //var tourReservation_editquery= "update tourReservation set td_id="+selectTdid+",tour_id="+selectTourid+",reserv_start_time="+starttime+",tour_reservDate="+selectDay+",reserv_end_time="+endtime+",tou"
        var [tourReservation_editquery] = await connection.query("update tourReservation set td_id=?, tour_id=?,tour_reservDate=?, modify_date=?,reserv_start_time=?,reserv_end_time=? where tr_id=?",[selectTdid,selectTourid,selectDay,new Date(),reserv_start_time,reserv_end_time,tr_id]);//어떤 tourid(어떤매물에있는 어떤요일내역대),시간대(td_id)에대해 수정할것인지.

        console.log('=>>>>>>touyrReservation_editquery:',tourReservation_editquery);
        connection.release();

        return response.json({success:true, result_data : tourReservation_editquery});
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//사용자 내투어예약접수에 대한 삭제진행.
router.post('/mybrokerProduct_tourRservdelete',async function(request,response){
    console.log('=>>>>>>>request.body:',request.body);

    var req_body=request.body;
    
    var tr_id=req_body.tr_id; //어떤 tr_id 어떤 예약접수내역에 대해 삭제
   
    const connection=await pool.getConnection(async conn => conn);
    console.log('>>>>pool connection Test:',pool);

    try{
        //var tourReservation_editquery= "update tourReservation set td_id="+selectTdid+",tour_id="+selectTourid+",reserv_start_time="+starttime+",tour_reservDate="+selectDay+",reserv_end_time="+endtime+",tou"
        var [tourReservation_deletequery] = await connection.query("delete from tourReservation where tr_id=?",[tr_id]);//어떤 삭제할건지.
        console.log('=>>>>>>tourReservation_deletequery:',tourReservation_deletequery);
        connection.release();

        var [delete_after_data] = await connection.query("select * from tourReservation ")
        return response.json({success:true, result_data : tourReservation_deletequery});
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//사용자 내투어예약접수에 대한 취소진행.
router.post('/mybrokerproduct_tourReservcancle',async function(request, response){

    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;

    var tr_id=req_body.tr_id_val;

    const connection=await pool.getConnection(async conn => conn);

    try{
        var [tourReservation_update_query] = await connection.query("update tourReservation set tr_status=2 where tr_id=?",[tr_id]);

        console.log('tourReservation_update query result:',tourReservation_update_query);

        connection.release();

        return response.json({success:true, message:'query success'});
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//사용자 투어예약접수에 대한 수정진행.(시간대 조율 조정)
router.post('/brokerProduct_tourRerservation_modify',async function(request,response){
    console.log('=>>>>>>>request.body:',request.body);

    var req_body=request.body;
    var tr_id=req_body.tr_id; //어떤 tr_id 어떤 예약접수내역에 대해 수정
    var selectDay=req_body.selectdate; //어떤 선택날짜 선택한날짜.
    var selectTourid=req_body.selectTourid;//어떤 tourid
    var selectTourtype=req_body.selectTourtype; //어떤 투어타입
    var selectTdid=req_body.selectTdid; //어떤 요일의 시간대.
    var starttime=req_body.starttime;  //시작종료시간대.
    var endtime=req_body.endtime;//해당 tr_id에 대해서 수정 처리 진행. 개별 수정 진행한다.

    const connection=await pool.getConnection(async conn => conn);
    console.log('>>>>pool connection Test:',pool);

    try{
        //var tourReservation_editquery= "update tourReservation set td_id="+selectTdid+",tour_id="+selectTourid+",reserv_start_time="+starttime+",tour_reservDate="+selectDay+",reserv_end_time="+endtime+",tou"
        var [tourReservation_editquery] = await connection.query("update tourReservation set td_id=?, tour_id=?, reserv_start_time=?,tour_reservDate=?,reserv_end_time=? ,modify_date=?,is_time_decide=1 where tr_id=?",[selectTdid,selectTourid,starttime,selectDay,endtime,new Date(),tr_id]);//어떤 tourid(어떤매물에있는 어떤요일내역대),시간대(td_id)에대해 시간조율 시작~종료시간대로의 변경 처리 개별수정(중개사가 개별수정한 이후에는 특정접수내역 수정한 이후에는 시간결정된것으로 간주하여 더이상 수정못하게)

        console.log('=>>>>>>touyrReservation_editquery:',tourReservation_editquery);
        connection.release();

        return response.json({success:true, result_data : tourReservation_editquery});
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//사용자 투어예약접수내역 하나에 대한 조회
router.post('/brokerProduct_reservationRegisterview',async function(request,response){
    console.log('=>>>>>>>request.body:',request.body);
    
    var req_body=request.body;
    var tr_id=req_body.tr_id_val;//어떤 tourid(투어날짜)에 대해 요청하는건지
   
    const connection=await pool.getConnection(async conn => conn);
    console.log('>>>>pool connection Test:',pool);

    try{
        //특정trid요청내역에 대한 조회를 한다.tourReservation별 조회를 하며 각 tourid,tdid값 tourid값이 비어있는지 업는내역인지 여부.없다면 tourid가 없다면 해당셋팅은 삭제된것임.
        var [brokerproduct_tourReservationregi_view] = await connection.query("select * from tourReservation where tr_id=?",[tr_id]);

        console.log('result sets:',brokerproduct_tourReservationregi_view);
        tourReservation_view=[];
        for(let j=0; j<brokerproduct_tourReservationregi_view.length; j++){
            let tr_id=brokerproduct_tourReservationregi_view[j]['tr_id'];
            let tour_id=brokerproduct_tourReservationregi_view[j]['tour_id'];
            let td_id=brokerproduct_tourReservationregi_view[j]['td_id'];
            let [tour_query] = await connection.query("select * from tour where tour_id=?",[tour_id]);
            var [td_query] = await connection.query("select * from tourdetail where td_id=?",[td_id]);

            tourReservation_view[j]={};
            tourReservation_view[j]['tr_id']=tr_id;
            tourReservation_view[j]['tour_id']=tour_id;
            tourReservation_view[j]['td_id']=td_id;
            tourReservation_view[j]['tr_info']=brokerproduct_tourReservationregi_view[j];

            if(tour_query.length>=1){
                tourReservation_view[j]['tour_info']=tour_query;
                tourReservation_view[j]['td_info']=td_query;               
            }else{
                tourReservation_view[j]['tour_info']=null;
                tourReservation_view[j]['td_info']=null;
            }//관련 tourid셋팅정보가 삭제된경우...
            
        }

        connection.release();

        return response.json({success:true, result_data : tourReservation_view});
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//사용자 특정한개 매물별 투어예약접수리스트들(선택)에 대한 일괄수정진행.(시간대 조율 조정)
router.post('/brokerProduct_tourRerservation_multimodify',async function(request,response){
    console.log('=>>>>>>>request.body:',request.body);

    var req_body=request.body;
    var tridchklist=req_body.tridchklist;//체크선택한 trid들 집합구한다.
    tridchklist = tridchklist.split(',');
    var selectdate=req_body.selectdate;//일괄적용 날짜(selectDate)
    var selectTourid=req_body.selectTourid;//일괄적용 투어아이디값 선택요일
    var selectTourtype=req_body.selectTourtype;//일괄적용 투어타입값(모두 동일한 tour_id,tourtype,tourtid->>tdlist selectvalue) 
    var selectTdid=req_body.selectTdid;//일괄적용 selctTdid디테일시간값. 특정요일의 시간대.
    var starttime=req_body.starttime;//일괄적용 시간조율시작~종료 지정값.
    var endtime=req_body.endtime;//해당 tr_id에 대해서 수정 처리 진행. 개별 수정 진행한다.

    const connection=await pool.getConnection(async conn => conn);
    console.log('>>>>pool connection Test:',pool);

    
    for(var s=0; s<tridchklist.length; s++){
        let tr_id_local=tridchklist[s];//각각의 trid선택값.

        try{
            var [tourReservation_editquery] = await connection.query("update tourReservation set td_id=?, tour_id=?,reserv_start_time=?,tour_reservDate=?, reserv_end_time=?, modify_date=? where tr_id=?",[selectTdid,selectTourid,starttime,selectdate,endtime,new Date(),tr_id_local]);

            console.log('===>>>tourReservation_editquery::',tourReservation_editquery);
            //connection.release();

            //return response.json({success:true, result_data: tourReservation_editquery});
        }catch(err){
            console.log('server query error:',err);
            connection.release();

            return response.status(403).json({success:false,message:'server query full problme error!'});
        }
    }
    connection.release();
    return response.json({success:true, message:'query all success!!!'});
});
//사용자 투어예약접수리스트조회(중개사회원)
router.post('/brokerproduct_reservationList',async function(request, response){
    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;

    var mem_id=req_body.memid;
    var company_id=req_body.company_id;
    var user_type=req_body.user_type;
    var isexculsive=req_body.isexculsive;

    const connection=await pool.getConnection(async conn => conn);

    try{
        var [prd_id_rows] = await connection.query("select prd_identity_id from product where company_id=?",[company_id]);
        var prd_id_strings='';
        for(var p=0; p<prd_id_rows.length; p++){
            if(p == prd_id_rows.length-1){
                prd_id_strings += prd_id_rows[p]['prd_identity_id'];
            }else{
                prd_id_strings += prd_id_rows[p]['prd_identity_id']+',';
            }          
        }
        console.log('====>>>prd_id_strings::::',prd_id_strings);

        //var tour_id_strings='';
        //var tour_id_rows_query="select tour_id from tour where prd_identity_id in ("+prd_id_strings+")";

        //var [tour_id_rows] = await connection.query("select tour_id from tour where prd_identity_id in (?)",[prd_id_strings]);
        //var [tour_id_rows] = await connection.query(tour_id_rows_query);
        //console.log('==>>>tour_id_rows 임의 company_id가 다루고있는 모든 상품들별에 따른 tour_id셋팅예약방리스트(일반,추가)내역리스트,이중에서 사용자들이 요청을 한 내역들에 해당하는것만 보여주면 된다.',tour_id_rows);

        /*for(var t=0; t<tour_id_rows.length; t++){
            if(t == tour_id_rows.length - 1){
                tour_id_strings += tour_id_rows[t]['tour_id'];
            }else{
                tour_id_strings += tour_id_rows[t]['tour_id']+',';
            }
        }
        console.log('=======>>>>tour_id_strings::::',tour_id_strings);*/

        //var [tour_reservation_rows] = await connection.query("select * from tourReservation where tour_id in (?)",[tour_id_strings]);
        var tour_reservation_rows_query= "select * from tourReservation where prd_identity_id in ("+prd_id_strings+") order by create_date desc";//임의 신청이 어떤 매물에 대한(매물단위: 그 매물에 속한 tourid단위가 아닌)내역인지 구함.(매물삭제가 되었으면 안뜨겠고 관련된 신청내역은 안 뜨겠고, 투어예약세싱이 삭제되어도 뜬다.)

        var [tour_reservation_rows] = await connection.query(tour_reservation_rows_query);
        console.log('===>>>tour_reservation_rows::::',tour_reservation_rows);
        //각각 신청한 내역 하나일뿐이며 해당 회사에서 다루는 매물들에 대한 모든 신청내역들 하나하나이며, 각 신청내역별 어떤 tourid의 어떤시간대값을 누가 언제 신청한건지 알수있다.각 신청한 tourid를 통해서 그 tourid에 관련된 등록매물에 대한 정보product, 그 tourid에 대한 정보등 같이.객체로써 배열저장.
        var tour_reservation_list=[];
        for(var t=0; t<tour_reservation_rows.length; t++){
            let reserv_item = tour_reservation_rows[t];
            tour_reservation_list[t]={};
            tour_reservation_list[t]['id'] = reserv_item['tr_id'];
            tour_reservation_list[t]['reserv_info']=reserv_item;
            let tour_id_loca=reserv_item['tour_id'];
            let prdidentityid_loca=reserv_item.prd_identity_id;//그 tourid신청한 요일값이 어떤 매물에 있던 투어예약셋팅요일내역인지구한다.
            let [product_info] = await connection.query("select * from product where prd_identity_id=?",[prdidentityid_loca]);//그 나온 내역중 가장 첫 origin내역에 매물정보(x,y)정보등 근간정보 최근정보 다 있음.

            console.log('reserv_item 별 정보들',reserv_item,tour_id_loca, product_info[0]);

            tour_reservation_list[t]['match_productinfo'] = product_info;
        }
        connection.release();

        return response.json({success:true, result_data : tour_reservation_list})
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//사용자 투어예약접수리스트조회(중개사회원) 필터조회api
router.post('/brokerproduct_reservationList_filter',async function(request, response){
    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;

    var mem_id=req_body.memid;
    var company_id=req_body.company_id;
    var user_type=req_body.user_type;
    var isexculsive=req_body.isexculsive;

    var orderby = req_body.orderby;
    var prdtype = req_body.prdtype;
    var trstatus= req_body.trstatus;
    var createorigin = req_body.createorigin;

    var orderbywhere;
    var prdtypewhere;var trstatuswhere;var createoriginwhere;
    switch(orderby){
        case '최신등록순':
            orderbywhere=' order by create_date desc';
        break;
        case '과거등록순':
            orderbywhere=' order by create_date asc';
        break;
        case '가나다순':
            orderbywhere= 'order by tr_name asc';
        break;
    }
    switch(trstatus){
        case '전체':
            trstatuswhere='';
        break;
        case '오늘':
            trstatuswhere=" and date(tour_reservDate) = date_format(now(),'%Y%m%d')";
        break;
        case '내일':
            trstatuswhere=" and date(tour_reservDate) = date_format(now() + INTERVAL 1 DAY,'%Y%m%d')";
        break;
        case '만료':
            trstatuswhere=" and date(tour_reservDate) < date_format(now(),'%Y%m%d')";
        break;
        case '예약 취소':
            trstatuswhere=" and tr_status=2";
        break;
    }
    switch(prdtype){
        case '전체':
            prdtypewhere="";
        break;
        case '아파트':
            prdtypewhere=" and prd_type='아파트'";
        break;
        case '오피스텔':
            prdtypewhere=" and prd_type='오피스텔'";
        break;
        case '상가':
            prdtypewhere=" and prd_type='상가'";
        break;
        case '사무실':
            prdtypewhere=" and prd_type='사무실'";
        break;
    }
    switch(createorigin){
        case '전체':
            createoriginwhere="";
        break;
        case '사용자의뢰':
            createoriginwhere=" and prd_create_origin='중개의뢰'";
        break;
        case '외부수임':
            createoriginwhere=" and prd_create_origin='외부수임'";
        break;
    }
    const connection=await pool.getConnection(async conn => conn);

    try{
        var [prd_id_rows] = await connection.query("select prd_identity_id from product where company_id=?",[company_id]);
        var prd_id_strings='';
        for(var p=0; p<prd_id_rows.length; p++){
            if(p == prd_id_rows.length-1){
                prd_id_strings += prd_id_rows[p]['prd_identity_id'];
            }else{
                prd_id_strings += prd_id_rows[p]['prd_identity_id']+',';
            }          
        }
        console.log('====>>>prd_id_strings::::',prd_id_strings);//로그인 소속 중개사의 수임매물리스트 조회한다.

        //var tour_id_strings='';
        //var tour_id_rows_query="select tour_id from tour where prd_identity_id in ("+prd_id_strings+")";

        //var [tour_id_rows] = await connection.query("select tour_id from tour where prd_identity_id in (?)",[prd_id_strings]);
        //var [tour_id_rows] = await connection.query(tour_id_rows_query);
        //console.log('==>>>tour_id_rows 임의 company_id가 다루고있는 모든 상품들별에 따른 tour_id셋팅예약방리스트(일반,추가)내역리스트,이중에서 사용자들이 요청을 한 내역들에 해당하는것만 보여주면 된다.',tour_id_rows);

        /*for(var t=0; t<tour_id_rows.length; t++){
            if(t == tour_id_rows.length - 1){
                tour_id_strings += tour_id_rows[t]['tour_id'];
            }else{
                tour_id_strings += tour_id_rows[t]['tour_id']+',';
            }
        }
        console.log('=======>>>>tour_id_strings::::',tour_id_strings);*/

        //var [tour_reservation_rows] = await connection.query("select * from tourReservation where tour_id in (?)",[tour_id_strings]);
        var tour_reservation_rows_query= "select * from tourReservation where prd_identity_id in ("+prd_id_strings+")"+trstatuswhere+orderbywhere;//임의 신청이 어떤 매물에 대한(매물단위: 그 매물에 속한 tourid단위가 아닌)내역인지 구함.(매물삭제가 되었으면 안뜨겠고 관련된 신청내역은 안 뜨겠고, 투어예약세싱이 삭제되어도 뜬다.) 접수내역 시간대값조건, 정렬처리 순서대로 정렬되어 나타나짐.필터col종류가 달라서 하나는 접수내역에 대한 필터처리를 우선되고, 그 나온 결과에서 나온 매물매칭정보를 통해서 매물조건충족되는것 여부 노출.

        var [tour_reservation_rows] = await connection.query(tour_reservation_rows_query);
        console.log('===>>>tour_reservation_rows::::',tour_reservation_rows);
        //각각 신청한 내역 하나일뿐이며 해당 회사에서 다루는 매물들에 대한 모든 신청내역들 하나하나이며, 각 신청내역별 어떤 tourid의 어떤시간대값을 누가 언제 신청한건지 알수있다.각 신청한 tourid를 통해서 그 tourid에 관련된 등록매물에 대한 정보product, 그 tourid에 대한 정보등 같이.객체로써 배열저장.
        var tour_reservation_list=[];var match_cnt=0;
        for(var t=0; t<tour_reservation_rows.length; t++){
            let reserv_item = tour_reservation_rows[t];
            let tour_id_loca=reserv_item['tour_id'];

            let prdidentityid_loca=reserv_item.prd_identity_id;//그 tourid신청한 요일값이 어떤 매물에 있던 투어예약셋팅요일내역인지구한다.
            let [product_info] = await connection.query("select * from product where prd_identity_id=?"+prdtypewhere+createoriginwhere,[prdidentityid_loca]);//그 나온 내역중 가장 첫 origin내역에 매물정보(x,y)정보등 근간정보 최근정보 다 있음. 해당 접수내역에 했었던 매물에 대한정보를 구하는데, 해당 매물인데 매물의 조건이 각 trinfo별. 주어진 조건 매물종류/수임방식 등을 기준으로 조건검사를 하여 결과가 있나없나 여부로 판단.결과가 있는 경우에만. insert해서 보여줌.
            if(product_info.length >=1){
                tour_reservation_list[match_cnt]={};
                tour_reservation_list[match_cnt]['id'] = reserv_item['tr_id'];
                tour_reservation_list[match_cnt]['reserv_info']=reserv_item;
                         
                tour_reservation_list[match_cnt]['match_productinfo'] = product_info;

                match_cnt++;
            }
            console.log('reserv_item 별 정보들',reserv_item,tour_id_loca, product_info[0]);
            
        }
        connection.release();

        return response.json({success:true, result_data : tour_reservation_list})
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//사용자 투어예약접수리스트조회(중개사회원) 검색필터.(건물명,의뢰인명)
router.post('/brokerproduct_reservationList_filter2',async function(request, response){
    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;

    var mem_id=req_body.memid;
    var company_id=req_body.company_id;
    var user_type=req_body.user_type;
    var isexculsive=req_body.isexculsive;

    var searchkeyword = req_body.search_keyword_val;

    var searchkeywordwhere;
    searchkeywordwhere=" and (request_mem_name like '%"+searchkeyword+"%' or prd_name like '%"+searchkeyword+"%')";
    
    const connection=await pool.getConnection(async conn => conn);

    try{
        var [prd_id_rows] = await connection.query("select prd_identity_id from product where company_id=?",[company_id]);
        var prd_id_strings='';
        for(var p=0; p<prd_id_rows.length; p++){
            if(p == prd_id_rows.length-1){
                prd_id_strings += prd_id_rows[p]['prd_identity_id'];
            }else{
                prd_id_strings += prd_id_rows[p]['prd_identity_id']+',';
            }          
        }
        console.log('====>>>prd_id_strings::::',prd_id_strings);//로그인 소속 중개사의 수임매물리스트 조회한다.

        //var tour_id_strings='';
        //var tour_id_rows_query="select tour_id from tour where prd_identity_id in ("+prd_id_strings+")";

        //var [tour_id_rows] = await connection.query("select tour_id from tour where prd_identity_id in (?)",[prd_id_strings]);
        //var [tour_id_rows] = await connection.query(tour_id_rows_query);
        //console.log('==>>>tour_id_rows 임의 company_id가 다루고있는 모든 상품들별에 따른 tour_id셋팅예약방리스트(일반,추가)내역리스트,이중에서 사용자들이 요청을 한 내역들에 해당하는것만 보여주면 된다.',tour_id_rows);

        /*for(var t=0; t<tour_id_rows.length; t++){
            if(t == tour_id_rows.length - 1){
                tour_id_strings += tour_id_rows[t]['tour_id'];
            }else{
                tour_id_strings += tour_id_rows[t]['tour_id']+',';
            }
        }
        console.log('=======>>>>tour_id_strings::::',tour_id_strings);*/

        //var [tour_reservation_rows] = await connection.query("select * from tourReservation where tour_id in (?)",[tour_id_strings]);
        var tour_reservation_rows_query= "select * from tourReservation where prd_identity_id in ("+prd_id_strings+")";//임의 신청이 어떤 매물에 대한(매물단위: 그 매물에 속한 tourid단위가 아닌)내역인지 구함.(매물삭제가 되었으면 안뜨겠고 관련된 신청내역은 안 뜨겠고, 투어예약세싱이 삭제되어도 뜬다.) 

        var [tour_reservation_rows] = await connection.query(tour_reservation_rows_query);
        //console.log('===>>>tour_reservation_rows::::',tour_reservation_rows);
        //각각 신청한 내역 하나일뿐이며 해당 회사에서 다루는 매물들에 대한 모든 신청내역들 하나하나이며, 각 신청내역별 어떤 tourid의 어떤시간대값을 누가 언제 신청한건지 알수있다.각 신청한 tourid를 통해서 그 tourid에 관련된 등록매물에 대한 정보product, 그 tourid에 대한 정보등 같이.객체로써 배열저장.
        var tour_reservation_list=[];var match_cnt=0;
        for(var t=0; t<tour_reservation_rows.length; t++){
            let reserv_item = tour_reservation_rows[t];
            let tour_id_loca=reserv_item['tour_id'];

            let prdidentityid_loca=reserv_item.prd_identity_id;//그 tourid신청한 요일값이 어떤 매물에 있던 투어예약셋팅요일내역인지구한다.
            console.log("select * from product where prd_identity_id="+prdidentityid_loca+searchkeywordwhere);
            let [product_info] = await connection.query("select * from product where prd_identity_id="+prdidentityid_loca+searchkeywordwhere);//그 나온 내역중 가장 첫 origin내역에 매물정보(x,y)정보등 근간정보 최근정보 다 있음. 해당 접수내역에 했었던 매물에 대한정보를 구하는데, 해당 매물인데 매물의 조건이 각 trinfo별. 주어진 조건에 만족하는 경우에만 insert리스트 추가.이렇다면 검색조건에 만조갛는 리스트만 나타나게 될것임(product,trinfo)
            if(product_info.length >=1){
                tour_reservation_list[match_cnt]={};
                tour_reservation_list[match_cnt]['id'] = reserv_item['tr_id'];
                tour_reservation_list[match_cnt]['reserv_info']=reserv_item;
                         
                tour_reservation_list[match_cnt]['match_productinfo'] = product_info;

                match_cnt++;
            }
            //console.log('reserv_item 별 정보들',reserv_item,tour_id_loca, product_info[0]);
            
        }
        connection.release();

        return response.json({success:true, result_data : tour_reservation_list})
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//임의 매물에 대한 사용자 투어예약접수리스트
router.post('/brokerproduct_reservationList_perProduct',async function(request, response){
    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;
    
    var prd_identity_id=req_body.prd_identity_id;

    const connection=await pool.getConnection(async conn => conn);

    try{
        
        /*var [tour_id_rows] = await connection.query("select tour_id from tour where prd_identity_id=?",[prd_identity_id]);
        console.log('==>>>임의 매물 한개에 대한 tour_id셋팅예약방리스트(일반,추가)내역리스트,이중에서 사용자들이 요청을 한 내역들에 해당하는것만 보여주면 된다.',tour_id_rows);
        var tour_id_strings='';
        for(var t=0; t<tour_id_rows.length; t++){
            if(t == tour_id_rows.length - 1){
                tour_id_strings += tour_id_rows[t]['tour_id'];
            }else{
                tour_id_strings += tour_id_rows[t]['tour_id']+',';
            }
        }
        console.log('=======>>>>tour_id_strings::::',tour_id_strings);*/

        //var [tour_reservation_rows] = await connection.query("select * from tourReservation where tour_id in (?)",[tour_id_strings]);
        var tour_reservation_rows_query= "select * from tourReservation where prd_identity_id="+prd_identity_id;
        var [tour_reservation_rows] = await connection.query(tour_reservation_rows_query);
        console.log('===>>>tour_reservation_rows::::',tour_reservation_rows);

        //특정 선택 매물에 있는 투어아이디에 대하ㅣㄴ 신청정보가 있는경우 매물에 신청한 내역들정보를 저장한다.
        var tour_reservation_list=[];
        for(var t=0; t<tour_reservation_rows.length; t++){
            let reserv_item = tour_reservation_rows[t];
            tour_reservation_list[t]={};
            tour_reservation_list[t]['id'] = reserv_item['tr_id'];
            tour_reservation_list[t]['reserv_info']=reserv_item;
            let tour_id_loca=reserv_item['tour_id'];
            //let [match_tour_info] = await connection.query("select * from tour where tour_id=?",tour_id_loca);
            let prdidentityid_loca=reserv_item.prd_identity_id;//그 tourid신청한 요일값이 어떤 매물에 있던 투어예약셋팅요일내역인지구한다.
            let [product_info] = await connection.query("select * from product where prd_identity_id=?",prdidentityid_loca);//그 나온 내역중 가장 첫 origin내역에 매물정보(x,y)정보등 근간정보 최근정보 다 있음.

            console.log('reserv_item 별 정보들',reserv_item,tour_id_loca, product_info[0]);

            tour_reservation_list[t]['match_productinfo'] = product_info;
        }

        connection.release();

        return response.json({success:true, result_data : tour_reservation_list})
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//사용자 투어예약접수리스트 특정 선택한 부분내역 조회.부분 tourrservation리스트
router.post('/brokerProduct_tourReservation_partlist',async function(request, response){
    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;
    var tridchklist = req_body.tridchklist;

    const connection=await pool.getConnection(async conn => conn);

    try{
        console.log('select * from tourReservation where tr_id in ('+tridchklist+')');
        var [tourReservlist] = await connection.query("select * from tourReservation where tr_id in ("+tridchklist+')');
       
        console.log('====>>>tourReservlist::::',tourReservlist);

        connection.release();

        return response.json({success:true, result_data : tourReservlist})
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//내 물건투어예약접수리스트(임의 개인or중개사or기업회원)companyid 에 따른 소속팀원들의 접수리스트구한다.
router.post('/brokerproduct_myreservationList',async function(request, response){
    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;
    
    var company_id = req_body.company_id;
    var mem_id = req_body.mem_id;
    var user_type = req_body.user_type;

    
    const connection=await pool.getConnection(async conn => conn);

    var [user_regi_type] = await connection.query("select * from user where mem_id=?",[mem_id]);
    var register_type=user_regi_type[0].register_type;//기업이며 관리자 권한의 생성자 최초가입자인 경우와 팀원인경우
    try{
        var tour_reservation_list_final=[];
        if(user_type == '개인'){
            var [tour_reservation_list] = await connection.query("select * from tourReservation where mem_id=? order by create_date desc",[mem_id]);
            //해당 개인이 벌인 투어예약접수내역리스트 조회한다. 그 리스트 내림차순 최신순 기본값 정리

            for(var f=0; f<tour_reservation_list.length; f++){
                let item_loca=tour_reservation_list[f];//각 신청내역
                let tour_id_loca=tour_reservation_list[f].tour_id;//각 신청한 내역이 어떤 투어아이디(특정셋팅일,요일)인지 구하며 그 tourid가 어떤 매물에 등록된 셋팅내역인지
                let td_id_loca=tour_reservation_list[f].td_id;//어떤 요일의 어떤시간대tdid를 택한건지
              
                let [tour_info_query] = await connection.query("select * from tour where tour_id=?",[tour_id_loca]);
                let [td_info_query] = await connection.query("select * from tourdetail where td_id=?",[td_id_loca]);

                let prd_identity_id = item_loca.prd_identity_id;//그 어떤 매물에 대한 접수내역 요청인지(내물건투어예약)
                console.log('prdidinetitiyid:',prd_identity_id);
                let [product_info_query] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);
                let store_object={};
                store_object['reserv_id']=item_loca.tr_id;
                store_object['reserv_info']=item_loca;
                store_object['match_product_info']=product_info_query[0];

                if(tour_info_query.length>=1 && td_info_query.length>=1){
                    //console.log('tourinfoquery ,tdinfoquery:',tour_info_query,td_info_query);
        
                    store_object['match_td_info'] = td_info_query;

                }else{
                    store_object['match_td_info'] = null;
                }
                tour_reservation_list_final.push(store_object);                           
            }
        }else{
        
            var [sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id]);//해당 회사id에 해당하는 유저내역들 현재 로그인되어있는 그 하나만 나온다.그 회사id에 모든 회원들 신청내역.
            for(var s=0; s<sosok_userlist.length; s++){
                let loca_memid= sosok_userlist[s].mem_id;//소속사업체의 소속의 회원들별 예약접수내역리스트 모두 모은다. 그 사업체에서 발생한 즉 모든 팀원들에의해 발생한 접수내역리스트 조회가능.(어떤 팀원으로접속하든)
                var [tour_reservation_list_local] = await connection.query("select* from tourReservation where mem_id=? order by create_date desc",[loca_memid]);

                for(let t=0; t<tour_reservation_list_local.length; t++){
                    let item_loca=tour_reservation_list_local[t];//각 신청내역
                    let tour_id_loca=item_loca.tour_id;
                    let td_id_loca = item_loca.td_id;

                    let [tour_info_query]= await connection.query("select * from tour where tour_id=?",[tour_id_loca]);
                    let [td_info_query] = await connection.query("select * from tourdetail where td_id=?",[td_id_loca]); 

                    let prd_identity_id = item_loca.prd_identity_id;
                    let [product_info_query] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);

                    let store_object={};
                            
                    store_object['reserv_id']=item_loca.tr_id;
                    store_object['reserv_info']=item_loca;
                    store_object['match_product_info']=product_info_query[0];

                    if(tour_id_loca && td_id_loca){
                        //console.log('tourinfoquery ,tdinfoquery:',tour_info_query,td_info_query);

                        if(tour_info_query.length>=1 && td_info_query.length>=1){
                            store_object['match_td_info'] = td_info_query;
                        }else{
                            store_object['match_td_info'] = null;
                        }
                      
                    }
                    tour_reservation_list_final.push(store_object);                  
                }
            }
        }
        console.log('tour resrevation list total:::',tour_reservation_list_final);

        connection.release();

        return response.json({success:true, result_data : tour_reservation_list_final})
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//내 물건투어예약접수리스트(임의 개인or중개사or기업회원)companyid 에 따른 소속팀원들의 접수리스트구한다. + 필터링,정렬처리.
router.post('/brokerproduct_myreservationList_filter',async function(request, response){
    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;
    
    var company_id = req_body.company_id;
    var mem_id = req_body.mem_id;
    var user_type = req_body.user_type;
    var orderby = req_body.orderby;//최신순,과거순,가나다순  0,1,2
    var wherecond = req_body.wherecond;//전체,오늘,내일,예약취소,만료  0,1,2,3,4

    var wherequery;var orderquery;
    const connection=await pool.getConnection(async conn => conn);

    switch(wherecond){
        case '0':
            wherequery='';
        break;
        case '1':
            wherequery=" and date(tour_reservDate) = date_format(now(),'%Y%m%d')";
        break;

        case '2':
            wherequery=" and date(tour_reservDate) = date_format(now() + INTERVAL 1 DAY,'%Y%m%d')";
        break;
        case '4':
            wherequery=" and date(tour_reservDate) < date_format(now(),'%Y%m%d')";
        break;

        case '3':
            wherequery=" and tr_status=2";//예약취소상태인것들만 조회.
        break;
    }
    switch(orderby){
        case '0':
            orderquery=" order by create_date desc";
        break;
        case '1':
            orderquery=" order by create_date asc";
        break;
        case '2':
            orderquery=" order by tr_name asc";//일단 신청자(투어예약신청자)이름순 가나다순 정렬.
        break;
    }
    try{
        var tour_reservation_list_final=[];
        if(user_type == '개인'){
            var [tour_reservation_list] = await connection.query("select * from tourReservation where mem_id=?"+wherequery+orderquery,[mem_id]);
            //해당 개인이 벌인 투어예약접수내역리스트 조회한다.

            for(var f=0; f<tour_reservation_list.length; f++){
                let item_loca=tour_reservation_list[f];//각 신청내역
                let tour_id_loca=tour_reservation_list[f].tour_id;//각 신청한 내역이 어떤 투어아이디(특정셋팅일,요일)인지 구하며 그 tourid가 어떤 매물에 등록된 셋팅내역인지
                let td_id_loca=tour_reservation_list[f].td_id;//어떤 요일의 어떤시간대tdid를 택한건지

                //console.log(tour_reservation_list[f],tour_id_loca,td_id_loca);
                let [tour_info_query] = await connection.query("select * from tour where tour_id=?",[tour_id_loca]);
                let [td_info_query] = await connection.query("select * from tourdetail where td_id=?",[td_id_loca]);

                let prd_identity_id = item_loca.prd_identity_id;//그 어떤 매물에 대한 신처인건지
                console.log('prdidinetitiyid:',prd_identity_id);
                let [product_info_query] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);

                let store_object={};
                    
                store_object['reserv_id']=item_loca.tr_id;
                store_object['reserv_info']=item_loca;

                store_object['match_product_info']=product_info_query[0];

                if(tour_id_loca && td_id_loca){        
                    if(tour_info_query.length>=1 && td_info_query.length>=1){
                        //console.log('tourinfoquery ,tdinfoquery:',tour_info_query,td_info_query);
                        
                        store_object['match_td_info'] = td_info_query;
                    
                    }else{
                        store_object['match_td_info'] = null;
                    }        
                }   
                tour_reservation_list_final.push(store_object);               
            }
        }else{
            
            var [sosok_userlist] = await connection.query("select * from company_member where company_id=?",[company_id]);
            for(var s=0; s<sosok_userlist.length; s++){
                let loca_memid= sosok_userlist[s].mem_id;//소속사업체의 소속의 회원들별 예약접수내역리스트 모두 모은다. 그 사업체에서 발생한 즉 모든 팀원들에의해 발생한 접수내역리스트 조회가능.(어떤 팀원으로접속하든)
                var [tour_reservation_list_local] = await connection.query("select* from tourReservation where mem_id=?"+wherequery+orderquery,[loca_memid]);
                for(let t=0; t<tour_reservation_list_local.length; t++){
                    let item_loca=tour_reservation_list_local[t];//각 신청내역
                    let tour_id_loca=item_loca.tour_id;
                    let td_id_loca = item_loca.td_id;

                    let [tour_info_query]= await connection.query("select * from tour where tour_id=?",[tour_id_loca]);
                    let [td_info_query] = await connection.query("select * from tourdetail where td_id=?",[td_id_loca]);   

                    let prd_identity_id = item_loca.prd_identity_id;
                    let [product_info_query] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id]);

                    let store_object={};
                    
                    store_object['reserv_id']=item_loca.tr_id;
                    store_object['reserv_info']=item_loca;

                    store_object['match_product_info']=product_info_query[0];

                    if(tour_id_loca && td_id_loca){
                        //console.log('tourinfoquery ,tdinfoquery:',tour_info_query,td_info_query);
                       
                        if(tour_info_query.length>=1 && td_info_query.length>=1){
                            
                            store_object['match_td_info'] = td_info_query;
                            
                        }else{
                            store_object['match_td_info'] = null;
                        }
                    }
                    tour_reservation_list_final.push(store_object);
                }
            }
        }
        console.log('tour resrevation list total:::',tour_reservation_list_final);

        connection.release();

        return response.json({success:true, result_data : tour_reservation_list_final})
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//투어예약접수내역 예약해제 액션.
router.post('/brokerproduct_reservation_release',async function(request, response){

    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;

    var tr_id=req_body.tr_id_val;

    const connection=await pool.getConnection(async conn => conn);

    try{
        var [tourReservation_update_query] = await connection.query("update tourReservation set tr_status=1 where tr_id=?",[tr_id]);

        console.log('tourReservation_update query result:',tourReservation_update_query);

        connection.release();

        return response.json({success:true, message:'query success'});
    }catch(err){
        console.log('server query error:',e);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//담당 매물별 정보(+각 매물별 접수신청한 투어예약인원수까지)
router.post('/brokerproduct_list_view2',async function(request, response){
    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;

    var mem_id=req_body.memid;
    var company_id=req_body.company_id;
    var user_type=req_body.user_type;
    var isexculsive=req_body.isexculsive;

    const connection=await pool.getConnection(async conn => conn);

    try{
        var [prd_id_rows] = await connection.query("select distinct prd_identity_id from product where company_id=?",[company_id]);
        /*var prd_id_strings='';
        for(var p=0; p<prd_id_rows.length; p++){
            if(p == prd_id_rows.length-1){
                prd_id_strings += prd_id_rows[p]['prd_identity_id'];
            }else{
                prd_id_strings += prd_id_rows[p]['prd_identity_id']+',';
            }          
        }
        console.log('====>>>prd_id_strings::::',prd_id_strings);*/

        console.log('prd_id_rows::::',prd_id_rows);
        //각 담당 매물, 매물별 관련 정보 저장할 개체 저장.
        var prd_identity_info_array=[];//매물별 정보 저장할 배열 객체

        for(var r=0,match=0; r<prd_id_rows.length; r++){   
            //각 담당 매물들리스트가 나오고, 그 매물별 tour_id리스트 구한다.
            let prd_identity_id_loca=prd_id_rows[r]['prd_identity_id'];
            let [prdinfo_store] = await connection.query("select * from product where prd_identity_id=?",[prd_identity_id_loca]);

            console.log('prd_identity_id별 루프:',prd_identity_id_loca);

            //let [tour_id_rows_local] = await connection.query("select tour_id from tour where prd_identity_id=?",[prd_identity_id_loca]);//해당 매물에 해당하는 셋팅해뒀던 tour_id리스트를 반환하고, 그 tour_id_rows string그룹한것 저장한다.

            //if(tour_id_rows_local.length > 0){
            //해당 매물에 대한 투어에약셋팅리스트가 있는 경우에만 처리한다.셋팅자체를 등록해놓지 않았다면 가능 투어일시자체에 뜨지 않을것이고, 투어예약신청 못할것임.투어셋팅 내역이 있는것들만 저장.그중에서도 또 카운트가 있는것만.(사람들이 예약신청 요청한것이 있는것만)
            /*let tour_id_strings='';
            for(let i=0; i<tour_id_rows_local.length; i++){
                if(i == tour_id_rows_local.length - 1){
                    tour_id_strings += tour_id_rows_local[i]['tour_id'];
                }else{
                    tour_id_strings += tour_id_rows_local[i]['tour_id']+',';
                }
            }
            console.log('===>>>>>tour_id_strings:::',tour_id_strings);*/

            var tour_reservation_rows_query="select * from tourReservation where prd_identity_id="+prd_identity_id_loca;//해당 매물에 대해서 신청한 접수내역들 리스트 구한다.
            var [tour_reservation_rows] = await connection.query(tour_reservation_rows_query);
            console.log('tour_reservation_ROWS.length:',tour_reservation_rows.length);

            if(tour_reservation_rows.length > 0){
                //예약건이 있는 매물>투어id에 대해서 매물에 대해서만 저장한다.
                prd_identity_info_array[match]={};
                prd_identity_info_array[match]['prd_identity_id'] = prd_identity_id_loca;
                
                prd_identity_info_array[match]['info'] = prdinfo_store;//각 prd_identity_id인포 저장한다.
                prd_identity_info_array[match]['reservcnt_per_prd']=tour_reservation_rows.length;//매물별 신청한 투어예약인원수 저장한다.

                match++;
            }                    
        }
        console.log('=>>>>prd_identity_info_arrayss:',prd_identity_info_array);
        connection.release();

        return response.json({success:true, result_data : prd_identity_info_array})
    }catch(err){
        console.log('server query error:',err);
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});

//특정 매물에 대해 허위매물신고
router.post('/brokerproduct_reportProcess',async function(request, response){

    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;

    var reporttype=req_body.reporttype;
    var reportname=req_body.reportname;
    var reportphone=req_body.reportphone;
    var prd_identity_id=req_body.prd_identity_id;
    var company_id=req_body.company_id;
    var mem_id=req_body.mem_id;

    const connection=await pool.getConnection(async conn => conn);

    try{
        //매물에 대한 신고가 들어올때마다 쌓일뿐이다. 누가 어떤 수임회사의 수임매물에 대해서 언제 어떤이름,번호의 제보자가 신고한건지.
        await connection.beginTransaction();
        var [report_insert_query] = await connection.query("insert into report(prd_identity_id,company_id,mem_id,report_type,report_name,report_phone,create_date,modify_date) values(?,?,?,?,?,?,?,?)",[prd_identity_id,company_id,mem_id,reporttype,reportname,reportphone,new Date(),new Date()]);
        await connection.commit();

        console.log('reort insert query sult:',report_insert_query);

        connection.release();

        return response.json({success:true, message:'query success'});
    }catch(err){
        console.log('server query error:',e);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//그 특정중개사에 대해서 중개매너평가시에. (중개매너,전문성) 점수평가진행.1~5점부여.
router.post('/probroker_score_eval',async function(request, response){

    console.log('===========>>>request.body::',request.body);

    var req_body=request.body;

    var memid=req_body.mem_id;
    var company_id=req_body.company_id;
    var cs_type=req_body.cs_type;
    var cs_point=req_body.cs_point;

    const connection=await pool.getConnection(async conn => conn);

    try{
        //중개사 평가시마다 쌓인다. 누가 어떤중개사에 어떻게 평가했는지 몇점줬는지
        await connection.beginTransaction();
        var [report_insert_query] = await connection.query("insert into company_score(mem_id,company_id,cs_type,cs_point,create_date,modify_date) values(?,?,?,?,?,?)",[memid,company_id,cs_type,cs_point,new Date(),new Date()]);
        await connection.commit();

        console.log('reort insert query sult:',report_insert_query);

        connection.release();

        return response.json({success:true, message:'query success'});
    }catch(err){
        console.log('server query error:',e);
        connection.rollback();
        connection.release();

        return response.status(403).json({success:false,message:'server query full problme error!'});
    }
});
//유저들이 특정 중개사별 매긴 점수평균값.
router.post('/probroker_mannerscore_process',async function(request,response){
    console.log('====>>request bodyss:',request.body);

    var req_body=request.body;

    var company_id = req_body.company_id;

    const connection = await pool.getConnection(async conn => conn);

    try{
        var [manner_query] = await connection.query("select distinct mem_id from company_score where company_id=?",[company_id]);//임의중개사에대해서 점수매긴 유저별..유저들
        var cspoint_total=0;//각 유저별 최근에 매겼었던 점수들의 합총합계 / 유저들수가 유저들이 그 중개사에데 ㅐ해서 매긴 점수의평균치)
        console.log('manner_quewt rulstss???...:',manner_query);
        var manner_querycnt= 0;
        connection.release();
        for(let s=0; s<manner_query.length; s++){
            let user=manner_query[s].mem_id;//각 유저memid
            if(user && company_id){
                var [user_per_recently_scorevalue] = await connection.query("select * from company_score where mem_id=? and company_id=? order by create_date desc",[user,company_id]);//각 유저별 해당 중개사에 매긴 점수들 중 가장 최근값.
                console.log('각 유저별 중개매너매긴 점수최근값::',user_per_recently_scorevalue);
                let cs_point=user_per_recently_scorevalue[0]['cs_point'];//최근에 매긴 점수값(덮어씌워지는 replace개념)

                cspoint_total += cs_point;
                manner_querycnt++;
            }   
        }
        console.log('매긴 총 매너점수합계 및 평균',cspoint_total,manner_querycnt,cspoint_total/manner_querycnt);//1~5범위 의 평균값(유리수포함) 나올것으로 추정.

        return response.json({success:true, message:'query ssucess',result:{sum : cspoint_total, average:cspoint_total/manner_querycnt , evaluate_cnt:manner_querycnt}});
    }catch(err){
        console.log('server query errors:',err);
        connection.release();

        return response.json({success:false,message:'server query error problem error!'});
    }
});
//서버에 현재 모든 중개사업체의 등록건수합계
router.post('/all_regist_productProcess',async function(request,response){
    console.log('=====>>request bodyss:',request.body);

    const connection = await pool.getConnection(async conn=>conn);

    try{
        var [allproduct_query] = await connection.query("select * from product p join transaction t on p.prd_identity_id=t.prd_identity_id where t.txn_status='거래개시' group by p.prd_identity_id");//거래개시인항목들 전체쿼리.전체총등록건수 및 등록가중치 판단.
        var all_regist_count=allproduct_query.length;

        console.log('전체 거래개시된 것들 내역 전체 거래개시매물들 합계::',all_regist_count);

        connection.release();

        return response.json({success:true, message:'query success',all_regist_count:all_regist_count});
    }catch(err){
        console.log('server query errosss:',err);
        connection.release();

        return response.json({success:false, message:'server query error problemn error!'});
    }
});

//특정매물에 대한 tourid셋팅리스트
/*
router.post('/brokerProduct_toursetting_dates',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;
    console.log('req_body :',req_body);
    const connection=await pool.getConnection(async conn=> conn);
    
    console.log('/brokerProduct_toursetting_dates request session store:::>>>>',request.session);

    //try catch문 mysql 구문 실행구조.
    try{
        var prd_identity_id=req_body.id;

        //지도 클릭한 특정매물에 대한 투어셋팅예약정보 리스트 조회한다.
        var [productToursettinglist_row_groupOuter] = await connection.query("select distinct tour_group_id from tour where prd_identity_id=? and tour_type=1",[prd_identity_id]);
        console.log('productToursettinglist_row_groupOuter row:',productToursettinglist_row_groupOuter);

        var normal_touridgroup_info={};//tour_groupid별 키값을 가지고있고, 그 각 그룹아디별 리스트 취합한 요일 집합리스트월수금월수금등), 설정시간대들 그들끼리는 모두 같기의 임의하나아무거나선정 등의 정보 묶어서 표현하는 저장. 일반 그룹아디별 있는 요일집합들 월수금
        
        for(let outer=0; outer<productToursettinglist_row_groupOuter.length; outer++){
            let tour_group_id_cond=productToursettinglist_row_groupOuter[outer]['tour_group_id'];

            var local_yoil_values_overwraped = [];//그룹투어아디에 해당하는 월수금 요소리스트.중복은 이론적 있을수없음. 
            var local_set_times_overwraped = [];
            var local_match_dates= [];//그룹투어아디에 해당하는 각 요일별 실제 매칭되는 date날짜값들 배열형태로 저장키 위함.
            let local_dayselectcount=0;//각 추가한 일반 목록별 요일집합기간리스트에서 보여줄 리스트의 총 개수만큼만 보여줘야함(오름차순 그 날짜리스트들을 전체 오름차순 하면 될뿐이고 그 것들중에서 daycount만큼만 보여주면됌)
            var [group_tourlist_rows] = await connection.query("select * from tour where prd_identity_id=? and tour_group_id=?",[prd_identity_id,tour_group_id_cond]);
            console.log('group_tourlist_rows::',group_tourlist_rows);

            for(let inner=0; inner<group_tourlist_rows.length; inner++){
                //해당 그룹id에 해당하는 세부 관련 tourlist요소들>>>>
                local_yoil_values_overwraped.push( group_tourlist_rows[inner]['tour_set_days'] );//1덩어리:월수금/ 2덩어리:화목/ 3덩어리: 일토 형태로 한다. 중복포함한 요일들을 저장한다.
                local_set_times_overwraped.push(group_tourlist_rows[inner]['tour_set_times'] );
                local_match_dates.push( { tour_date : group_tourlist_rows[inner]['tour_start_date'], tour_id: group_tourlist_rows[inner]['tour_id'], setting_times: group_tourlist_rows[inner]['tour_set_times']});//일단 시작,종료일 같음 그날시작 그날끝.하루기준 날짜. 실제 투어예약시행일.
                local_dayselectcount = group_tourlist_rows[inner]['day_select_count'];
            }
            var local_yoil_values_settle = Array.from(new Set(local_yoil_values_overwraped));//그룹투어리스트 rows 투어리스트 특정 매물id,그룹투어아디,회사,memid에 해당하는 투어리스트요소에 있는 요일집합리스트 중복제거.
            var local_set_times_settle = Array.from(new Set(local_set_times_overwraped));

            console.log('========>>>중복제거한 요일집합리스트 및 투어그룹일반추가별 매칭날짜들:',local_yoil_values_settle , local_set_times_settle , local_match_dates);
            normal_touridgroup_info[tour_group_id_cond] = {};
            normal_touridgroup_info[tour_group_id_cond]['yoil_set_days'] = local_yoil_values_settle;
            normal_touridgroup_info[tour_group_id_cond]['set_times'] = local_set_times_settle;//중복제거한 다 같은 요소들일것이고,tour set times시간대들 값 지정한다.
            normal_touridgroup_info[tour_group_id_cond]['tour_type'] = 1;//일반 타입 덩어리 추가.
            normal_touridgroup_info[tour_group_id_cond]['match_dates'] = local_match_dates;
            normal_touridgroup_info[tour_group_id_cond]['day_select_count'] = local_dayselectcount;
        }

        function data_ascending(a,b){
            var left = new Date(a['tour_date']).getTime();
            var right = new Date(b['tour_date']).getTime();

            return left > right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
        }

        for(let key in normal_touridgroup_info){
            console.log('>>>>server normaltouridgroup_info::',key, normal_touridgroup_info[key]);
            let day_select_count_loca=normal_touridgroup_info[key]['day_select_count'];//표현할 항목수
            let match_dates_loca= normal_touridgroup_info[key]['match_dates'];//각 일반타입 추가별 매칭 날짜리스트들 이들 오름차순 정렬필요함.
            let order_settle_match_dates_loca = match_dates_loca.sort(data_ascending);//노말 매치데이터들 정렬한것 새로 리턴.
            console.log('=>>>>>>>key 그룹투어아디의 있던 match_dates_loca 정렬전:',match_dates_loca);
            console.log('====>>>>>>그룹투어아디에 있던 match_dates_loca 오름차순정렬후:',order_settle_match_dates_loca);
            
            normal_touridgroup_info[key]['match_dates'] = order_settle_match_dates_loca;//새로 relace한것 오름차순 정렬처리한걸로 교체
        }
        
        //특별 추가 리스트 리턴.
        var special_tourgroup_info={};//tour_id별(어차피 특별은 하나하나가 한 예약셋팅이기에) 각 특별추가의 tour_id로 구분,키로 한다.
        var [productToursettinglist_row_special] = await connection.query("select * from tour where prd_identity_id=? and tour_type=2",[prd_identity_id]);//해당 중개사가 해당매물에 대해서 등록한 특별추가리스트 제외,추가리스트 모두 구한다.

        for(let loo=0; loo<productToursettinglist_row_special.length; loo++){
            let special_tourrow_item=productToursettinglist_row_special[loo];
            console.log('added special tourlist rows:',special_tourrow_item);
            special_tourgroup_info[special_tourrow_item['tour_id']]={};
            special_tourgroup_info[special_tourrow_item['tour_id']]['set_specifydate']=special_tourrow_item['tour_set_specifydate'];
            special_tourgroup_info[special_tourrow_item['tour_id']]['set_specifydatetimes'] = special_tourrow_item['tour_set_specifydate_times'];
            special_tourgroup_info[special_tourrow_item['tour_id']]['tour_type'] = 2;//특별 타입.
            special_tourgroup_info[special_tourrow_item['tour_id']]['tour_specifyday_except'] = special_tourrow_item['tour_specifyday_except'];//특별 추가/제외여부 타입
            special_tourgroup_info[special_tourrow_item['tour_id']]['tour_id'] = special_tourrow_item['tour_id'];//고유 추가한 투어아이디
        }
        
        connection.release();

        console.log('==>>>>normal_touridgroup_info and specailtrougroupinfo >>>>> :',normal_touridgroup_info, special_tourgroup_info);

        return response.json({success:true, message:'brokerProduct_toursetting_dates server query success!!', result_data: [normal_touridgroup_info,special_tourgroup_info]});
        
    }catch(err){
        console.log('server query error',err);
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
});
*/
module.exports=router;