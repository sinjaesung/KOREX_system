
const http=require('http');
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const bcrypt=require('bcrypt');
const request_api=require('request-promise-native');

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
const {register} = require('../modules/uploadfile_register');

const router=express.Router(); 

router.post('/probroker_infoget',async function(request,response){
    console.log('===============>>requeset.body::proborkerinfoget:',request,response);

    var req_body=request.body;

    const connection = await pool.getConnection(async conn=>conn);

    try{
        var company_id = req_body.company_id;
        var [is_probroker] = await connection.query("select type from company2 where company_id=?",[company_id]);
        console.log('기업타입::',is_probroker['type'],is_probroker);
        var company_type=is_probroker['type'];

        if(company_type=='중개사'){
            var [match_probroker_permission] = await connection.query("SELECT cp.*, prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from company2 cp join pro_realtor_permission prp on cp.company_id=prp.company_id left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where prp.permission_state='승인' and cp.company_id=? order by prp_id desc",[company_id]);//해당 회사사업체id에 해당하는 관련 전문중개사신청내역 승인내역중 가장 최근 승인된 내역정보값을 조회한다. 가장 최근 승인된 정보가 곧 최종검토된 해당 중개사의 전문종목정보인것임.
            console.log('최종확인 검토된 해당 전문중개사의 전문종목허락값::',match_probroker_permission);

            connection.release();

            return response.json({success:true, message:'success',result:match_probroker_permission});
        }else{
            
            connection.release();

            return response.json({success:false, message:'not match',result:[]});
        }
        
    }catch(error){
        connection.release();

        return response.status(403).json({success:false, message:'server query full problem error!'});
    }
})
//히사프로필변경
router.post('/companyprofileEdit',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    //companyProfileEdit 회사프로필 수정 post요청 처리.
    try{
        
        //prd_id로 등록한다.
        var company_id= req_body.company_id;
        var companyname = req_body.companyname;
        var address_road=req_body.address_road;
        var address_jibun=req_body.address_jibun;
        var addr_detail = req_body.addr_detail;

        //해당 저장한 도로명주소에 해당하는 좌표값으로 처리한다. 중개사인경우에만 처리해주면 된다.
        var [company_query] = await connection.query("select * from company2 where company_id=?",[company_id]);//해당 회사id 관ㄹ견된 내ㅐ역조회.
        var company_type=company_query[0].type;//기업,중개사,분양대행사 여부
        if(company_type=='중개사'){
            try{
                const headers={'Authorization' : "KakaoAK "+"ac08f2d6adfd16a501ad517d7a2fab3f"};
                const url = "https://dapi.kakao.com/v2/local/search/address.json?&query=" + encodeURI(address_road);
                let api_response = await request_api.get({
                    uri:url,
                    headers: headers
                });
                console.log('++++>>>>response::',api_response);
                api_response = JSON.parse(api_response);
                console.log('resoonseodoicuemtns::',api_response.documents);
                api_response_final = api_response.documents[0];
                
                //return {x : api_response_final.x, y:api_response_final.y}
                var store_x= api_response_final.x;
                var store_y= api_response_final.y;
            }catch(err){
                console.log('road address주소검색 x,y좌표검색 실패::',err);
            }
        }else{
            var store_x=null;
            var store_y=null;
        }
        var phone=req_body.phone;
        var ceoname=req_body.ceoname;
        var ceophone=req_body.ceophone;

        //해당 companyid에 해당하는 기업을 수정한다.
        await connection.beginTransaction();
        var [update_rows]=await connection.query('update company2 set mod_dttm=?, company_name=?,ceo_name=?,ceo_phone=?,addr_road=?,addr_jibun=?,addr_detail=?,x=?,y=? where company_id=?',[new Date(),companyname,ceoname,ceophone,address_road,address_jibun,addr_detail,store_x,store_y,company_id]);

        await connection.commit();
        console.log('update company edit rows query',update_rows);
        connection.release();

        if(update_rows){
            connection.release();
            return response.json({success:true, message:'server query success!!'});
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
router.post('/companyprofileView',async function(request,response){
    console.log('=============>>>request.body:',request.body);

    var req_body=request.body;

    const connection=await pool.getConnection(async conn=> conn);

    //companyProfileEdit 회사프로필 수정 post요청 처리.
    try{
        
        //로그인되어있는 mem_id회원 유저의 소속된 사업체(분양사,기업,중개사) 정보 및 그 관리자정보를..관리자 권한을 갖고있는 팀원이 아니라, 말그대로 초기등록자 프로필이름.
        var company_id = req_body.company_id;

        //해당 companyid에 해당하는 기업을 조회한다.
        var [view_rows]=await connection.query('select * from company2 where company_id=?',[company_id]);
        console.log('select company rows query',view_rows);

        if(view_rows){

            var [origin_user_rows] = await connection.query("select * from user where company_id=? and register_type='korex' and is_deleted!=1",[company_id]);
            console.log('origin_user rows최초가입자:',origin_user_rows);

            if(origin_user_rows){
                connection.release();
                return response.json({success:true, message:'server query success!!', result_data:[view_rows,origin_user_rows]});
            }else{
                //최초가입자가 comapnyid가 있는데 없다는것은 모순이며 뭔가 오류상황이 분명하다.
                connection.release();
                return response.json({success:false, message:'server query error!!'});
            }
            
        }else{
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
router.post('/profilechange_request',awsS3.upload.array('userprofile_val'),async function(req,res){
    console.log('====>>priofile change request:',req.body);

    var req_body = req.body;

    const connection = await pool.getConnection(async conn => conn);

    try{

        if(req.files || req.body){
            //이미지를 새로 수정하는 경우 기존 이미지를 제거하는 로직이 필요하다. 이미지 하나씩 업로드가 되고, 기존것 하나 삭제처리한다.
            const images= await register(req.files,req.body);
            console.log('process iamgess:',images);
            const connection = await pool.getConnection(async conn=> conn);

            if(images && images.length >=1){
                var now_login_memidss=req.session.user_id;//세션userid값.로그인id값.
                var [prevuser_profile_query]= await connection.query("select * from user where mem_id=?",[now_login_memidss]);
                var delete_target_folderfile= prevuser_profile_query[0].mem_img;//삭제할 기존 대상 폴더파일개체.  userProfile/ssgsagasdgasdgasgsdg.jpg
                var delete_target_imgarray=delete_target_folderfile&&delete_target_folderfile.split(',');
                awsS3.delObjects(delete_target_imgarray);//기존 이미지 삭제!실제 s3 삭제

                var image_base_path = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';
                var target_folder=req.body.folder;
                var userprofile_img_array=[];

                for(let i=0; i<images.length; i++){
                    let image_actual_name = images[i];
                    userprofile_img_array.push(target_folder+'/'+image_actual_name);
                }
                console.log('uplaodeder ostored예정 userprofile auplod filess:',userprofile_img_array);

                //로그인되어있는 mem_id 그 유저가 memid sessionid구함.
                console.log('reqeust session:',req.session);
                var now_login_memid = req.session.user_id;
                var change_username= req_body.username_val;
 
                await connection.beginTransaction();
                var [userprofile_changequery] = await connection.query("update user set user_name=?,mem_img=? where mem_id=?",[change_username,userprofile_img_array[0],now_login_memid]);
                await connection.commit();
                console.log('userprofie change querysss:',userprofile_changequery);

                var [userprofile_update_info] = await connection.query("select * from user where mem_id=?",[now_login_memid]);
                connection.release();

                return res.json({success:true, message:'update query success', result:userprofile_update_info[0]});
            }else{
                 //로그인되어있는 mem_id 그 유저가 memid sessionid구함.
                 console.log('reqeust session:',req.session);
                 var now_login_memid = req.session.user_id;
                 var change_username= req_body.username_val;
  
                 await connection.beginTransaction();
                 var [userprofile_changequery] = await connection.query("update user set user_name=? where mem_id=?",[change_username,now_login_memid]);
                 await connection.commit();
                 console.log('userprofie change querysss:',userprofile_changequery);
                
                 var [userprofile_update_info] = await connection.query("select * from user where mem_id=?",[now_login_memid]);
                 connection.release();
 
                 return res.json({success:true, message:'update query success',result:userprofile_update_info[0]});
            }
        }       
    }catch(err){
        console.log('server error',err);
        connection.rollback();
        connection.release();

        return res.json({success:false, message:'server query error'});
    }
});
router.get('/userdelete_request',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    try{
        console.log('request sesssion:',request.session);
        var now_login_memid = request.session.user_id;
        
        await connection.beginTransaction();
        var [userdelete_changequery] = await connection.query("update user set is_deleted=1 where mem_id=?",[now_login_memid]);
        await connection.commit();
        console.log('userdelte change queryss:',userdelete_changequery);

        connection.release();

        request.logout();
        request.session.destroy(function(){
            return response.json({success:true, message:'delete query success and sessiondestory!'});
        })
    }catch(err){
        console.log('server error');
        connection.rollback();
        connection.release();

        return response.json({success:false, message:'server query error'})
    }
});
router.post('/emailchange_request',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    var req_body=request.body;

    try{
        console.log('request session::',request.session);
        var now_login_memid = request.session.user_id;

       // var prevemail = req_body.prevemail_val;
        var changeemail = req_body.changeemail_val;

        var [selectuser_query] = await connection.query("select * from user where mem_id=? and is_deleted!=1",[now_login_memid]);

        if(selectuser_query[0]){
            if(selectuser_query[0]['email']){
                //기존 이메일이 있던 유저에 한해서만 입력prevemail과 리얼prevemail비교한다.
               // var prev_email_real = selectuser_query[0].email;
            
                await connection.beginTransaction();
                var [email_update] =await connection.query("update user set email=? where mem_id=? and is_deleted!=1",[changeemail,now_login_memid]);
                await connection.commit();
                connection.release();

                console.log('===>>email update:',email_update);

                return response.json({success:true, message:'이메일 변경 성공!'});
            
            }else{
                // 기존이메일이 없던 유저는 기존이메읽유효성 여부 검사안하고 그냥 바로 changeemail한다.
                await connection.beginTransaction();
                var [email_update] =await connection.query("update user set email=? where mem_id=? and is_deleted!=1",[changeemail,now_login_memid]);
                await connection.commit();
                connection.release();

                console.log('===++>>email update:',email_update);

                return response.json({success:true, message:'이메일 변경 성공!'});
            }
        }else{
            connection.release();
            return response.json({success:false, message:'존재하지 않은 회원입니다!'});
        }
        
    }catch(err){
        console.log('server error');
        connection.rollback();
        connection.release();

        return response.json({success:false, message:'server error!'});
    }
});
//폰번호 변경
router.post('/phonechange_request',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    var req_body=request.body;

    try{
        console.log('request session::',request.session,req_body);
        var now_login_memid = request.session.user_id;

        var prevphone = req_body.prevphone_val;
        var newphone = req_body.newphone_val;

        var [selectuser_query] = await connection.query("select * from user where mem_id=? and is_deleted!=1",[now_login_memid]);

        if(selectuser_query[0]){
            var login_myself=selectuser_query[0].mem_id;
            var login_usertype=selectuser_query[0].user_type;

            if(selectuser_query[0]['phone']){
                //바꾸려는 newphone번호를 갖고있는 회원이존재하는지여부 검사
                var [is_another_exists_phone] = await connection.query("select * from user where user_type=? and mem_id!=? and phone=? and is_deleted!=1",[login_usertype,login_myself,newphone]);
                if(is_another_exists_phone.length >=1){
                    console.log('해당 바꾸려는 폰번호의고객이해당 usertype유저들중 이미 존재하고있습니다. 이미 존재하는');

                    connection.release();
                    return response.json({success:false, message:'바꾸려는 휴대폰번호의 회원이 이미 존재합니다.'});
                }
                //기존 폰이 있던 유저에 한해서만 입력prevphone 디비상 prevpohone비교
                var prev_phone_real = selectuser_query[0].phone;
                if(prev_phone_real === prevphone){
                    await connection.beginTransaction();
                    var [phone_update] =await connection.query("update user set phone=? where mem_id=? and is_deleted!=1",[newphone,now_login_memid]);
                    await connection.commit();
                    connection.release();

                    console.log('===>>phone_update update:',phone_update);

                    return response.json({success:true, message:'휴대폰번호 변경 성공!'});
                }else{
                    connection.release();
                    return response.json({success:false, message:'기존 휴대폰번호를 확인해주세요!'});
                } 
            }else{
                // 기존폰번호이 없던 유저(미등록or오류or개인회원)는 기존폰번호유효성 여부 검사안하고 그냥 바로 change폰한다.(소지휴대폰에 대한 인증번호유효성 통과는 했기에)
                //해당 타입의 회원들(개인,기업,중개사,분양사)중에서 휴대폰 번호는 유니크해야한다는 규칙이이 있고 그 바꾸려고하는 유저를 제외한 유저중에서 바꾸려는 번호에해당하는 유저가 이미 있다면 못바꾸게함.
                
                var [is_another_exists_phone] = await connection.query("select * from user where user_type=? and mem_id!=? and phone=? and is_deleted!=1",[login_usertype,login_myself, newphone]);//나 자신을 제외한 현재 로그인유저와 같은타입 회원들중에서 바꾸려는 휴대폰번호의 고객이존재하지는 여부, 존재한다면 바꾸련는 번호를 이미 다른 고객이 갖고있다는것으로 중복방지되야함.
                if(is_another_exists_phone.length >=1){
                    console.log('해당 바꾸려는 폰번호의 고객이 해당 usertype유저들중 이미 존재하고있습니다. 이미 존재하는');

                    connection.release();
                    return response.json({success:false, message:'바꾸려는 휴대폰번호의 회원이 이미 존재합니다.'});
                }
                await connection.beginTransaction();
                var [phone_update] =await connection.query("update user set phone=? where mem_id=? and is_deleted!=1",[newphone,now_login_memid]);
                await connection.commit();
                connection.release();

                console.log('===++>>phone update:',phone_update);

                return response.json({success:true, message:'휴대폰번호 변경 성공!'});
            }
        }else{
            connection.release();
            return response.json({success:false, message:'존재하지 않은 회원입니다!'});
        }
        
    }catch(err){
        console.log('server error');
        connection.rollback();
        connection.release();

        return response.json({success:false, message:'server error!'});
    }
});
router.post('/prevphone_match_request',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    var req_body=request.body;

    try{
        console.log('request session::',request.session,req_body);
        var now_login_memid = request.session.user_id;

        var prevphone = req_body.prevphone_val;

        var [login_user_query] = await connection.query("select * from user where mem_id=? and user_type='개인'",[now_login_memid]);//관련 개인 회원내역중에서 해당 번호의 회원존재여부판단. 해당 회원의 폰번호와 입력한 기존번호 일치여부.
        if(login_user_query.length >= 1){
            var prev_phone_real=login_user_query[0].phone;
            if(prev_phone_real == prevphone){
                
                console.log('기존번호와 일치!!');

                connection.release();

                return response.json({success:true, message:'기존번호가 적합합니다. 인증번호발송가능.'});
            }else{
                connection.release();

                return response.json({success:false, message:'기존 휴대폰번호를 확인해주세요!'});
            } 
        }
        
    }catch(err){
        console.log('server error');

        connection.release();

        return response.json({success:false, message:'server error!'});
    }
});
//암호 변경
router.post('/passwordchange_request',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    var req_body=request.body;

    try{
        console.log('passwordchange request session::',request.session,req_body);
        var now_login_memid = request.session.user_id;

        var prevpassword = req_body.prevpassword_val;
        var newpassword = req_body.newpassword_val;

        var [selectuser_query] = await connection.query("select * from user where mem_id=? and is_deleted!=1",[now_login_memid]);

        if(selectuser_query[0]){
            const compare_results=bcrypt.compareSync(prevpassword,selectuser_query[0].password);
            if(compare_results){
                //로그인유저의 올바른 암호로 입력한경우에는
                var hashed=bcrypt.hashSync(newpassword,10);
                console.log('bcrypt암호화 진행 복잡도 (salt blur):',hashed);

                await connection.beginTransaction();
                var [passwordchange_query] = await connection.query("update user set password=? where mem_id=?",[hashed,now_login_memid]);
                await connection.commit();
                connection.release();

                console.log('password change query results:',passwordchange_query);

                return response.json({success:true, message:'암호변경 성공!'});
            }else{
                connection.release();

                return response.json({success:false, message:'기존 암호가 올바르지 않습니다!'});
            }
        }else{
            connection.release();
            return response.json({success:false, message:'존재하지 않은 회원입니다!'});
        }
        
    }catch(err){
        console.log('server error');
        connection.rollback();
        connection.release();

        return response.json({success:false, message:'server error!'});
    }
});
//관리자권한 마이페이지 로그인유저 소속하위 팀원들조회(팀원관리리스트)
router.post('/sosok_teamonelist_request',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    var req_body=request.body;

    try{
        var company_id =req_body.company_id;
        console.log('sosok_teamonelist_request request session::',request.session,req_body);

       // var [selectuser_query] = await connection.query("select mem_id,company_id,user_username,phone,email,user_name,mem_img,user_type,register_type,mem_admin,create_date,modify_date from user where company_id=? and is_deleted!=1 and register_type=?",[company_id, 'team']);
        //var [selectuser_query] = await connection.query("select u.mem_id as mem_id,u.company_id as company_id,u.user_username as user_username,u.phone as phone,u.email as email,u.user_name as user_name,u.mem_img as mem_img,u.user_type as user_type,u.register_type as register_type,u.mem_admin as mem_admin,u.create_date as create_date,u.modify_date as modify_date, c.cm_type as cm_type,c.company_id as c_company_id from user u join company_member c on u.mem_id=c.mem_id where c.company_id=? and is_deleted!=1 and register_type='team'",[company_id]);
        var [selectuser_query] = await connection.query("select u.mem_id as mem_id,u.company_id as company_id,u.user_username as user_username,u.phone as phone,u.email as email,u.user_name as user_name,u.mem_img as mem_img,u.user_type as user_type,u.register_type as register_type,u.mem_admin as mem_admin,u.create_date as create_date,u.modify_date as modify_date, c.cm_type as cm_type,c.company_id as c_company_id from user u join company_member c on u.mem_id=c.mem_id where c.company_id=? and is_deleted!=1",[company_id]);
        if(selectuser_query){
            
            connection.release();
            console.log('sosok_teamonelist request query resultss::',selectuser_query);

            return response.json({success:true, message:'소속 하위 팀원리스트', result: selectuser_query});
               
        }else{
            connection.release();
            return response.json({success:false, message:'리스트가 존재하지 않습니다.'});
        }
        
    }catch(err){
        console.log('server error');
        connection.release();

        return response.json({success:false, message:'server error!'});
    }
});
//로그인이후 마이페이ㅏ지 진입시에 users 회원중에서 선택된companyid값이 null이거나,user_type이 비어있는 상태 또는 유효하지 않은 경우라면 소속선택페이지로 리다랙션. 소속선택페이지에서 선택한 소속companyid로의 관련된 user정보 변환(마지막 선택한 companyid소속, 유저타입:중개사,기업,분양사)
router.post('/sosok_change_process',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    var req_body=request.body;

    try{
        var mem_id = req_body.mem_id;
        var change_sosok_companyid = req_body.change_sosok_companyid;//선택한 companyid값.

        var [selectuser_query] = await connection.query("select * from user where mem_id=?",[mem_id]);
        if(selectuser_query.length>=1){
            
            var [company_query] = await connection.query("select * from company2 where company_id=?",[change_sosok_companyid]);
            var company_type=company_query[0].type;//기업,중개사,분양사

            await connection.beginTransaction();
            var [user_update] = await connection.query("update user set company_id=?, user_type=? where mem_id=?",[change_sosok_companyid,company_type,mem_id]);//유저 정보 변경처리진행.
            console.log('유저 정보 변경 진행 결과::',user_update);
            await connection.commit();

            var [user_query] =await connection.query("select * from user where mem_id=?",[mem_id]);

            connection.release();
            console.log('update user 선택소속 변경 쿼리후 해당 로그인유저저보 쿼리::',user_query);

            return response.json({success:true, message:'로그인 유저 정보.', result: user_query});
               
        }else{
            connection.release();
            return response.json({success:false, message:'회원정보가 존재하지 않습니다.'});
        }
        
    }catch(err){
        console.log('server error');
        connection.rollback();
        connection.release();

        return response.json({success:false, message:'server error!'});
    }
});
//관리자권한 마이페이지 로그인유저 소속하위 팀원 특정 팀원삭제처리.
router.post('/teamone_delete_process',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    var req_body=request.body;

    try{
        var mem_id =req_body.delete_target_memid;
        var company_id = req_body.company_id;
        console.log('sosok_teamonelist_request delte request:',request.session,req_body);

        await connection.beginTransaction();
        var [teamone_delete_query] = await connection.query("delete from company_member where mem_id=?",[mem_id]);//companymember만 아예 삭제 처리하고,users테이블 팀원삭제의 경우는 없애지 않는다.
        await connection.commit();

        if(teamone_delete_query){
            
            connection.release();
            console.log('sosok_teamonelist request deletequery resultss::',teamone_delete_query);

            //팀원제거시에 해당 팀원에 user내역을 비운다. 선택소속컬럼값 null값 update쿼리.
            await connection.beginTransaction();
            var [teamone_update_query] = await connection.query("update user set company_id=null, user_type=null where mem_id=?",[mem_id]);//삭제 대상id유저(팀원,회원)정보 user정보 마지막 선택소속정보,소속기업형태 등 정보 지운다.
            await connection.commit();
            
            var [selectuser_query] = await connection.query("select u.mem_id as mem_id,u.company_id as company_id,u.user_username as user_username,u.phone as phone,u.email as email,u.user_name as user_name,u.mem_img as mem_img,u.user_type as user_type,u.register_type as register_type,u.mem_admin as mem_admin,u.create_date as create_date,u.modify_date as modify_date, c.cm_type as cm_type,c.company_id as c_company_id from user u join company_member c on u.mem_id=c.mem_id where c.company_id=? and is_deleted!=1 and register_type='team'",[company_id]);

            if(selectuser_query){
                connection.release();
                console.log('sosok_temaonelist request query srulsstss:',selectuser_query);

                return response.json({success:true, message:'팀원제거 성공 및 하위 팀원리스트조회성공', result:selectuser_query});
            }else{
                connection.rollback();
                connection.release();
                console.log('팀원제거는 성공했으나 제거후 관련 팀원리스트 조회실패:');
                return response.json({success:false, message:'조회실패 조회쿼리에러'});
            }
               
        }else{
            connection.rollback();
            connection.release();
            return response.json({success:false, message:'팀원 제거 실패'});
        }
        
    }catch(err){
        connection.rollback();
        connection.release();
        console.log('server error');
        
        return response.json({success:false, message:'server error!'});
    }
});
//관리자권한 마이페이지 특별 팀원 정보 조회.
router.post('/teamone_view_process',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    var req_body=request.body;

    try{
        var mem_id =req_body.mem_id;

        console.log('sosok_teamonelist_request delte request:',request.session,req_body);

        var [teamone_view_query] = await connection.query("select u.mem_id as mem_id,u.company_id as company_id,u.user_username as user_username,u.phone as phone,u.email as email,u.user_name as user_name,u.mem_img as mem_img,u.user_type as user_type,u.register_type as register_type,u.mem_admin as mem_admin,u.create_date as create_date,u.modify_date as modify_date,c.cm_type as cm_type, c.company_id as c_company_id, c.bp_id as bp_id from user u join company_member c on u.mem_id=c.mem_id where u.is_deleted!=1 and u.mem_id=?",[mem_id]);

        if(teamone_view_query){
            
            connection.release();
            console.log('teamone info view queysss:',teamone_view_query);

            return response.json({success:true, message:'팀원 뷰 성공', result: teamone_view_query});
               
        }else{
            connection.release();
            return response.json({success:false, message:'팀원 뷰 실패'});
        }
        
    }catch(err){
        connection.release();
        console.log('server error');
        
        return response.json({success:false, message:'server error!'});
    }
});
//관리자권한 마이페이지 로그인유저 소속하위 팀원 특정 팀원수정.정보수정
router.post('/teamone_modify_process',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    var req_body=request.body;

    try{
        var mem_id =req_body.mem_id;
        var memadmin = req_body.memadmin; //회원권환 memadmin, companymmber에 cv)_id권한관련 칼럼 변경. 폰번호 변경은 일단 보류.

        console.log('sosok_teamonelist_request modify request:',request.session,req_body);

        await connection.beginTransaction();
        //var [teamone_modify_query] = await connection.query("update user set mem_admin=? , modify_date=? where mem_id=? and is_deleted!=1",[memadmin,new Date(),mem_id]);//company_member미삭제해도 user is-delete처리하면 로그인이 불가하기에 팀원이 접근여부는 없다.할수없다.
        await connection.commit();
        var [teamone_modify_query2] = await connection.query("update company_member set modify_date=?, cm_type=? where mem_id=?",[new Date(),memadmin,mem_id]);

        //팀원 관련 변경 쿼리 진행.
        if( teamone_modify_query2){
            
            connection.release();
            console.log('sosok_teamonelist request modify query resultss::',teamone_modify_query2);

            return response.json({success:true, message:'팀원 수정 성공', result: teamone_modify_query2});
               
        }else{
            connection.rollback();
            connection.release();
            return response.json({success:false, message:'팀원 수정 실패'});
        }
        
    }catch(err){
        connection.rollback();
        connection.release();
        console.log('server error',err);
        
        return response.json({success:false, message:'server error!'});
    }
});

//중개의뢰 프로세스 관련
//전체 전문중개사리스트 조회
router.post('/probroker_company2_allList',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    try{
    
        console.log('probroker all Listt request');

        var [probrokerlist] = await connection.query("select * from company2 where type='중개사'");
        connection.release();
        console.log('probrokerlist sresultss:',probrokerlist);

        return response.json({success:true, message:'전문중개사 전체리스트 조회', result: probrokerlist});
               
    }catch(err){
        connection.release();
        console.log('server error',err);
        
        return response.json({success:false, message:'server error!'});
    }
});
//중개의뢰 프로스세스관련 관련 아파트,오피 전문종목 리스트 조회
router.post('/probroker_company_apartopi',async function(request,response){
    const connection = await pool.getConnection(async conn => conn);

    try{
        
        var req_body=request.body;
        var maemultype = req_body.maemultype;
        var danginame = req_body.danginame;
        var complexid = req_body.complexid;//단지id에 해당하는 것을 전문종목으로하는 중개사리스트 띄우면서 or 해당치않지만 해당 apt_name or oft_name을 전문종목으로써하고있는 리스트도 띄운다.
        //var dangiroadaddress = req_body.dangiroadaddress;

        console.log('proborkekr all match list reuqest:',req_body);

        /*if(maemultype =='아파트'){
            console.log(`SELECT * FROM company2 cp join pro_apply_permission2 per on cp.company_id = per.company_id where per.permission_state='승인' and per.apt_name like '%`+danginame+`%' and per.apply_apt_addr like '%`+dangiroadaddress+`%' order by pa_id desc`);
            var [match_queryss ] = await connection.query(`SELECT * FROM company2 cp join pro_apply_permission2 per on cp.company_id = per.company_id where per.permission_state='승인' and per.apt_name like '%`+danginame+`%' and per.apply_apt_addr like '%`+dangiroadaddress+`%' order by pa_id desc`);
        }else if(maemultype=='오피스텔'){
            console.log(`SELECT * FROM company2 cp join pro_apply_permission2 per on cp.company_id = per.company_id where per.permission_state='승인' and per.apt_name like '%`+danginame+`%' and per.apply_apt_addr like '%`+dangiroadaddress+`%' order by pa_id desc`);
            var [match_queryss ] = await connection.query(`SELECT * FROM company2 cp join pro_apply_permission2 per on cp.company_id = per.company_id where per.permission_state='승인' and per.apt_name like '%`+danginame+`%' and per.apply_apt_addr like '%`+dangiroadaddress+`%' order by pa_id desc`);
        }
        console.log('관련 쿼리 결과가>>>:',match_queryss);*/

        var match_companyid_list=[];
        if(maemultype=='아파트'){
            var [permission_list] = await connection.query("select * from pro_realtor_permission where permission_state='승인' and pro_apt_id="+complexid+"");//해당 단지id값이면서 or 아파트이름을 가진것들.
            console.log('permssison list reusltss:',permission_list);

            connection.release();

            for(let p=0; p<permission_list.length; p++){
                let item=permission_list[p];
                match_companyid_list.push(item.company_id);
            }
        }else if(maemultype=='오피스텔'){
            var [permission_list] = await connection.query("select * from pro_realtor_permission where permission_state='승인' and pro_oft_id="+complexid+"");//해당 단지id값이면서or 오피스텔이름 포함하는것들..
            console.log('matcehded permsison list sreultsss:',permission_list);

            connection.release();

            for(let p=0; p<permission_list.length; p++){
                let item=permission_list[p];
                match_companyid_list.push(item.company_id);
            }
        }
        //그 나온 리스트에서 company_id들을 추출한다. 적어도 그 companyid들에 해당하는 전문종목퍼미션 내역들은 입력한 조건에 만족했던것들이기에, 다 뽑고난후에 그 전문중개사들중에서 현재 상태값이 ispro전문중개사값인 것들만 나오게한다. 승인->취소->승인->취소 라고한다면 조건에 부합했었더라고해도 현재 전문중개사는 아닌 상태이기에 그러한 존재들은 companyid나오면 안됨.
        var distinct_companyid=new Set(match_companyid_list);
        distinct_companyid = Array.from(distinct_companyid);
        console.log('관련 전문중개사리스트',distinct_companyid);
        //승인목록들이 포함되었었지만 현재는 취소로 다시 일반중개사상태인 것들도 있을수있기에.
        var distinct_company_joinarray=[];
        for(let ff=0; ff<distinct_companyid.length; ff++){
            //전문종목관련 쿼리조회
            let companyid=distinct_companyid[ff];
            var [probroker_join_query] = await connection.query("select cp.*, prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from company2 cp join pro_realtor_permission prp on cp.company_id=prp.company_id left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where cp.company_id=? and cp.is_pro=1 and prp.permission_state='승인' order by prp_id desc",[companyid]);//중개사별 승인된 내역 가장 최근에 승인이되어서, ispro=1상태인 전문중개사내역 최근승인된내역 1개씩 저장.및 조인뷰.
            let store_object={};

            store_object['probroker_permission']=probroker_join_query[0];//중개사별 퍼미션 내역저장.

            //중개매너관련 쿼리조회.
            var [manner_query] = await connection.query("select distinct mem_id from company_score where company_id=?",[companyid]);
            var cspoint_total=0;
            console.log('mmaner quewry reulstsss;',manner_query);
            var manner_querycnt=0;
            
            for(let s=0; s<manner_query.length; s++){
                let user=manner_query[s].mem_id;//각유저memid
                if(user && companyid){
                    var [user_per_recently_scorevalue] = await connection.query("select * from company_score where mem_id=? and company_id=? order by create_date desc",[user,companyid]);
                    console.log('각 유저별 중개매너매긴 점수최근값',user_per_recently_scorevalue);
                    let cs_point=user_per_recently_scorevalue[0]['cs_point'];

                    cspoint_total += cs_point;
                    manner_querycnt++;
                }
            }
            console.log('매긴 총 점 매너점수합계 및 평균:',cspoint_total,manner_querycnt,cspoint_total/manner_querycnt);
            store_object['probroker_mannerscore'] = cspoint_total / manner_querycnt;//각 중개사별 중개매너점수값.

            //해당 각각의 중개사이고, 각 중개사가 수임하고 있는 매물내역수임매룰리스트
            var prd_identity_id_array=[];
            var [product_row] = await connection.query("select distinct prd_identity_id from product where company_id=?",[companyid]);

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
                    store_match['transaction_status']=transaction_status;
                    store_match['match_product']=match_product_query_origin[0];
                    match_transaction_list.push(store_match);
                }
            }else{
                var match_transaction_list=[];
            }
            store_object['asign_transaction'] = match_transaction_list;

            //distinct_company_joinarray.push(probroker_join_query[0]);
            distinct_company_joinarray.push(store_object);
        }
        console.log('중개사별 현재 전문중개사승인상태이며, 가장 최근에 승인된 허락내역 중개사별 한개씩 저장한형태 리턴:',distinct_company_joinarray);

        connection.release();

        return response.json({success:true, message:'전문중개사 관련 전체리스트 조회', result:  distinct_company_joinarray});
    }catch(err){
        connection.release();
        console.log('server error',err);
    }   
        
});
//특정 전문중개사정보조회
router.post('/probroker_info_single',async function(request,response){
    
    const connection = await pool.getConnection(async conn => conn);

    var req_body=request.body;
    try{
        var company_id=req_body.company_id;
        console.log('probroker all Listt request');

        var [probroker_join_query] = await connection.query("select cp.*, prp.*, cpx1.complex_name as apt_name, cpx2.complex_name as oft_name, replace(cpx1.addr_jibun, substring_index(cpx1.addr_jibun, ' ', -1), '') as apt_jibun, replace(cpx2.addr_jibun, substring_index(cpx2.addr_jibun, ' ', -1), '') as apt_jibun from company2 cp join pro_realtor_permission prp on cp.company_id=prp.company_id left join complex cpx1 on prp.pro_apt_id = cpx1.complex_id left join complex cpx2 on prp.pro_oft_id = cpx2.complex_id where cp.company_id=? and cp.is_pro=1 and prp.permission_state='승인' order by prp_id desc",[company_id]);
        connection.release();
        console.log('probrokerlist sresultss:',probroker_join_query);

        return response.json({success:true, message:'전문중개사 특정하나 조회', result: probroker_join_query[0]});
               
    }catch(err){
        connection.release();
        console.log('server error',err);
        
        return response.json({success:false, message:'server error!'});
    }
});
//중개의뢰 단수적용 관련 알고리즘 체크
router.post('/brokerRequest_avail_process',async function(request,response){
    console.log('brokerReueqt avail proecss check ',request.body);

    const connection = await pool.getConnection(async conn=>conn);

    var req_body=request.body;

    try{
        var req_type= req_body.req_type;//상가사무실, 오피아파트 여부 인지 검사
        var jibun = req_body.dangijibunaddress;
        var road = req_body.dangiroadaddress;
        var floor = req_body.floor;
        var hosil = req_body.hosil;

        //더미매물이아닌것만 검색.
        if(req_type == 'storeoffice'){
            var [productlist_match] = await connection.query("select * from product where addr_jibun=? and addr_road=? and floor=? and prd_name!='더미매물'",[jibun,road,floor]);//해당 해당 주소값만족의 층건물에 해당하는 모든 수정히스토리포함 product내역들 검색한다.
            console.log('요청 floor,주소값에 해당하는 product전체리스트::',productlist_match);

            var prdid_distinct_list=[];
            for(var s=0; s<productlist_match.length; s++){
                prdid_distinct_list[s]=productlist_match[s].prd_identity_id;
            }
            prdid_distinct_list=Array.from(new Set(prdid_distinct_list));
            console.log('중복제거한 prdid_distinctlist:',prdid_distinct_list);

            if(prdid_distinct_list.length >=1){
                //매칭된 요청 주소,floor건물에 대핸 내역들에 관련된 transaciton들중에서 transaction은 요청요구한 매물하나하나의 거래내역(거래개시)들이며, 이 내역들중에서 만약 의뢰철회,의뢰거절,거래완료,위임취소,수임취소,기한만료 상태값이 아닌 상태값을 만족하는 요소가 하나라도 발견되면 요청한 floor에 대한 매물은 코렉스상에 이미 등록되어 검토대기or검토중,거래준비,거래개시,거래완료거절,거래완료동의요청등의 시스템에 등록되어있는 상태임(다중상태)
                var prd_status_cond=["\'검토대기\'",'\'검토중\'','\'거래준비\'','\'거래개시거절\'','\'거래개시동의요청\'','\'거래개시\'','\'거래완료거절\'','\'거래완료동의요청\''];
                var transaction_match_query="select * from transaction where prd_identity_id in ("+prdid_distinct_list.join(',')+") and txn_status in ("+prd_status_cond.join(',')+")";
                console.log('transaciton_match_query:',transaction_match_query);
                var [transaction_match_list] = await connection.query(transaction_match_query);

                console.log('요청 floor,주소값에 해당하는 관련된 transaction전체리스트::',transaction_match_list);
                if(transaction_match_list.length >=1){
                    console.log('해당 요ㅓㅇfloor,주소값에 해당하는 코렉스에 등록되어있는 상태로 등록불가!');
                    connection.release();

                    return response.json({success:false, message:'이미 의뢰된,등록되어있는 매물or층수입니다.'});
                }else{
                    console.log('해당 요청floor,주소값에 해당하는 코렉스에 등록되어있지 않은 상태로 등록가능!');

                    connection.release();

                    return response.json({success:true, message:'등록가능!'});
                }
            }else{
                console.log('해당 요청floor,주소값에 해당하는 코렉스에 등록되어있지 않은 상태로 등록가능');

                connection.release();

                return response.json({success:true, message:'등록가능!'});  
            }

        }else if(req_type =='apartofficetel'){
            var [productlist_match] = await connection.query("select * from product where addr_jibun=? and addr_road=? and ho_id=? and prd_name!='더미매물'",[jibun,road,hosil]);//해당 해당 주소값만족에 존재하는 단지의 특정동의 층의 호실값으로 등록된 전체 productlist조회.
            console.log('요청 hosil,주소값에 해당하는 product전체리스트::',productlist_match);

            var prdid_distinct_list=[];
            for(var s=0; s<productlist_match.length; s++){
                prdid_distinct_list[s]=productlist_match[s].prd_identity_id;
            }
            prdid_distinct_list=Array.from(new Set(prdid_distinct_list));
            console.log('중복제거한 prdid_distinctlist:',prdid_distinct_list);

            if(prdid_distinct_list.length >= 1){
                //매칭된 요청 주소,hosil매물에 대핸 내역들에 관련된 transaciton들중에서 transaction은 요청요구한 매물하나하나의 거래내역(거래개시)들이며, 이 내역들중에서 만약 의뢰철회,의뢰거절,거래완료,위임취소,수임취소,기한만료 상태값이 아닌 상태값을 만족하는 요소가 하나라도 발견되면 요청한 hosil에 대한 매물은 코렉스상에 이미 등록되어 검토대기or검토중,거래준비,거래개시,거래완료거절,거래완료동의요청등의 시스템에 등록되어있는 상태임(다중상태)
                var prd_status_cond=['\'검토대기\'','\'검토중\'','\'거래준비\'','\'거래개시거절\'','\'거래개시동의요청\'','\'거래개시\'','\'거래완료거절\'','\'거래완료동의요청\''];
                var transation_match_query="select * from transaction where prd_identity_id in ("+prdid_distinct_list.join(',')+") and txn_status in ("+prd_status_cond.join(',')+")";
                console.log('transaction_match_query:',transation_match_query);
                var [transaction_match_list] = await connection.query(transation_match_query);

                console.log('요청 hosil,주소값에 해당하는 관련된 transaction전체리스트::',transaction_match_list);
                if(transaction_match_list.length >=1){
                    console.log('해당 요ㅓㅇhosil,주소값에 해당하는 코렉스에 등록되어있는 상태로 등록불가!');
                    connection.release();

                    return response.json({success:false, message:'이미 의뢰된,등록되어있는 매물or층수입니다.'});
                }else{
                    console.log('해당 요청hosil,주소값에 해당하는 코렉스에 등록되어있지 않은 상태로 등록가능!');

                    connection.release();

                    return response.json({success:true, message:'등록가능!'});
                }
            }else{
                console.log('해당 요청hosil,주소값에 해당하는 코렉스에 등록되어있지 않은 상태로 등록가능');

                connection.release();

                return response.json({success:true, message:'등록가능!'});  
            }         
        }
    }catch(err){
        connection.release();
        console.log('server error',err);
        
        return response.json({success:false, message:'server error!'});
    }
});
module.exports=router;