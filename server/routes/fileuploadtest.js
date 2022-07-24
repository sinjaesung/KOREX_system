const fs=require('fs');
const aws =require('aws-sdk');
const multer=require('multer');
const multerS3=require('multer-s3');
 
console.log('nodejs fileupadlotest 실행.>>');

const ID='AKIAXTQZVABSR3E5XCWE';//AKIAXTQZVABSR3E5XCWE
const SECRET='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';
const BUCKET_NAME='korexdata';
const s3 = new aws.S3({
    accessKeyId : ID, 
    secretAccessKey:SECRET,
    region:'ap-northeast-2'
});

console.log('s3 informationsss:',s3);

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            console.log('req what mjulters s3 :',req.body,file,cb);
            console.log('req_body.folders::????',req.body.folder,`${req.body.folder?req.body.folder+'/':''}${Date.now()}_${file.originalname}`);
        cb(null, `${req.body.folder ? req.body.folder+'/' : ''}${Date.now()}_${file.originalname}`);
        },
    }),
});
const delObject= (req,res,next)=>{
    console.log('삭제 delObject요소 실행>>>:',req.body);
    const images=req.body.images.map(image => {
        if(req.body.folder){
            return { Key :`${req.body.folder}${image}`};
        }
        return {Key : `${image}`}
    });
    console.log('delte iamgess:',iamges);
    const params={
        Bucket: BUCKET_NAME,
        Delete : {
            Objects: images,
            Quiet : false
        }
    };
    s3.deleteObjects(params, (err,data) => {
        if(err){
            console.log('ERROR DATA:',err);
        }else{
            console.log('chekcding for dat:'+JSON.stringify(data));
        }
    });
    console.log('next whatss???:',next);
    next();
}

/*
s3.createBucket(params,function(err,data){
    if(err) console.log(err);
    else console.log('Bucket created succesfufly',data.Location);
});*/

console.log('fileuplado testwhattsss:',upload,delObject);

module.exports= { upload,delObject}