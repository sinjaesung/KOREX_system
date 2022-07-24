const aws =require('aws-sdk');
const multer=require('multer');
const multerS3=require('multer-s3');
 
console.log('nodejs fileupadlotest 실행.>>');

//민감정보 따로 파일로 빼서 저장해두기.
const ID='AKIAXTQZVABSR3E5XCWE';//AKIAXTQZVABSR3E5XCWE
const SECRET='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';
const BUCKET_NAME='korexdata';

const s3 = new aws.S3({
    accessKeyId : ID, 
    secretAccessKey:SECRET,
    region:'ap-northeast-2'
});

console.log('s3 informationsss:',s3);

//특정 폴더경로or파일에 target으로 파일업로드 진행 처리 모듈.
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            console.log('request multer s3 requetss:',req.body,file,cb);
            console.log('req_body body speicfy folder and files???',req.body.folder,`${req.body.folder?req.body.folder+'/':''}${Date.now()}_${file.originalname}`);
        cb(null, `${req.body.folder ? req.body.folder+'/' : ''}${Date.now()}_${file.originalname}`);
        },
    }),
});
//특정 폴더경로or파일 대상들 삭제진행.
const delObject= async (req,res,next)=>{
    console.log('삭제 특정 폴더의 특정파일 삭제액션 실행>>>:',req.body);

    try{
        const images=req.body.delete_images.map(image => {
            /*if(req.body.folder){
                return { Key :`${req.body.folder}/${image}`};//특정 지정폴더의 특정선택파일들에 해당하는걸로, folder가 없는 경우엔 key:이미지명 등으로 돌려 리턴.
            }*/
            console.log('삭제대상:',image);
            return {Key : `${image}`}
        });
        console.log('delete iamgess:',images);
        const params={
            Bucket: BUCKET_NAME,
            Key : images[0]['Key']
            /*Delete : {
                Objects: images[0],
                Quiet : false
            }*/
        };
        s3.deleteObject(params, (err,data) => {
            if(err){
                console.log('ERROR DATA:',err);
            }else{
                console.log('chekcding for dat:'+JSON.stringify(data));
            }
        });

        return true;
    }catch(e){
        console.log('삭제처리 과정중 오류바생::',e);
        return false;
    }
}
//특정 대상체들 삭제 진행.모듈.
const delObjects = async (deleteimgs) => {
    console.log('삭제 대상 특정/폴더 파일 대상체들::',deleteimgs);

    try{
        const images=deleteimgs.map(image => {  //deleteimgs는 특정 폴더/파일명 string문자열 path형태의 구조로하며, 각 넘어온 배열원소하나값.
            return {Key : `${image}`}
        });
        console.log('deltee imgsss:',images);
        const params={
            Bucket: BUCKET_NAME,
            Delete : {
                Objects : images,
                Quiet : false
            }
        };
        s3.deleteObjects(params, (err,data) => {
            if(err){
                console.log('ERROR DTAAS:',err);
            }else{
                console.log('CHEKCING FOR DATASS:',JSON.stringify(data));
            }
        });
        return true;
    }catch(err){
        console.log('삭제 처리과정중 오류발생::',err);
        return false;
    }
}

/*
s3.createBucket(params,function(err,data){
    if(err) console.log(err);
    else console.log('Bucket created succesfufly',data.Location);
});*/

console.log('fileupload process related moudles',upload,delObject);

module.exports= { upload,delObject,delObjects}