const router = require('express').Router();
const aws=require('aws-sdk');
const multer=require('multer');
const multerS3=require('multer-s3');

//민감정보 따로 파일로 빼서 저장해두기.
const ID='AKIAXTQZVABSR3E5XCWE';//AKIAXTQZVABSR3E5XCWE
const SECRET='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';
const BUCKET_NAME='korexdata';

const s3 = new aws.S3({
    accessKeyId : ID, 
    secretAccessKey:SECRET,
    region:'ap-northeast-2'
});

//특정 대상ㄷ폴더대상의 관련 파일들 삭제짆행>>>
router.post('/specify_foldertarget_deleteprocess',async function(req,res){
    console.log('특정 대상 삭제 대상들::',req.body);

    const delete_images=req.body.delete_images.map(image=>{
        if(req.body.folder){
            return { Key :`${req.body.folder}/${image}`};
        }
        return {Key : `${image}`}
    });
    console.log('delete imagess:',delete_images);
    const params={
        Bucket: BUCKET_NAME,
        Delete : {
            Objects : delete_images,
            Quiet : false
        }
    };
    s3.deleteObjects(params,(err,data) => {
        if(err){
            console.log('ERROR DATASS:',err);
        }else{
            console.log('chekding for data:',JSON.stringify(data));
        }
    });

    return res.json('ㄴㅇㅎㄴㅇㅎㄴㅇㅎ');
});

module.exports = router;