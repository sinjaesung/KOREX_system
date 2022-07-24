const mysqls=require('mysql2/promise');
const { UnorderedCollection } = require('http-errors');
const pool= mysqls.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    //host: 'localhost',
    //host : '13.209.251.38',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref'
});

const router = require('express').Router();
const awsS3  = require('../modules/fileuploadModule');

const { register } = require('../modules/uploadfile_register');

console.log('===>>awsS3,register:',awsS3,register);
console.log('saws detilass:',awsS3.upload,awsS3.delObject);


//라우터 기업회사프로필 사진 업데이트 관련 쿼리router처리.
router.post('/companyprofile_insertupdate', awsS3.upload.array('company_image'), async (req, res) => {
  
  console.log('companyprofile imagess request 이미지 업로드 요청처리::',req.files,req.body);  
  try {
    if(req.files && req.body){
      const images = await register(req.files, req.body);
      console.log('>>process images',images);
      var company_id = req.body.company_id;//post로 같이 넘긴뎅티ㅓ 어떤소속체회사를 수정하려는지.
      console.log('===>>수정하려는 comapnyid값::',company_id);

      var image_base_path='https://korexdata.s3.ap-northeast-2.amazonaws.com/';
      var target_folder = req.body.folder;//특정 관련 txnid관련 폴더.
      var company_profile_path_arrays=[];//패스가 여러개 다중이라면 이미지업로드가 여러개라는것이고, 그 여러개 참조 슬라이더형태로 가능함.

      if(images && images.length >=1){
        for(let i=0; i<images.length; i++){
          //순수 서버에 방금 업로드되어 올라간 이미지의 파일명들만 추출된값.
          let image_actual_name=images[i];
          company_profile_path_arrays.push(image_base_path+target_folder+'/'+image_actual_name);
        }
        console.log('uploaded or stored 예정 comapny profile path arrayss:',company_profile_path_arrays, company_profile_path_arrays.join(','));
  
        const connection = await pool.getConnection(async conn => conn);
      
        var [company_update_query] = await connection.query("update company2 set profile_img=? where company_id=?",[company_profile_path_arrays.join(','),company_id]);
        
        console.log('>>>>>>>>>>>>comapny_updatequeryss:',company_update_query);

        if(company_update_query){
          return res.json({success:true, message:'file upload change sucess!!', result:company_profile_path_arrays});//처리된 이미지들(이미지의 순수이름name값)들 리턴한다.
        }
        
      }else{
        return res.status(400).json({success:false, message:'file upload change process part error!'});
      }
      
    }else{
      console.log('필수인자들이 비어있습니다..');
      return res.status(400).json({success:false, message:'file upload change process part error!'});
    }
    
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({success:false, message:'file upload change error!!'});
  }
});

module.exports = router;