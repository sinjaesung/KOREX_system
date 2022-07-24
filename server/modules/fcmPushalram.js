const request=require('request');

console.log('===>>fcmPushalram 모듈 실행>');

//푸시알람 전송 모듈.함수
const push_send= (memid,deviceToken,message,message_cat) => {

    let api_headers={'Authorization':'key=AAAAkJ-C2fs:APA91bFDjkAA-BgTp-q4srUdcrQEdLyd9mORlsb3PRPfWdH7Ll6vYdd0q3Bl62-SDtaoPMrBMonGnb6Ywl5ZoLL--uLukdtqrPJu34H0QX5btaJ3164lJJ5vfeG01Wy_7D_wt6oXh-yX','Content-Type':'application/json'};
    let api_url="https://fcm.googleapis.com/fcm/send";

    let fcm_options={
        uri : api_url,
        method: 'POST',
        headers : api_headers,
        body : {
            //to:"dWP3IHoSTI-j8NR8j3ltTB:APA91bFg3M_1vzUjBc4_pIBNoDr6c_FXYyWRm2g2UkE4i8UyNPunOA6nkkH7FWyHIwHm5TZOrciC_Mwgco-FZh-LnanAYCQGCWbVPWQAVn4hJ-2nXCBw75dE4zy1ecv9wX2Dx-0lrhW5",
            to :deviceToken,
            notification : {
                title : message_cat,
                body : message,
                content_available : true,
                priority : "high"
            }
        },
        json : true
    }
    //console.log('requeswt huhu what??;',request);
    request.post(fcm_options, function(err,httpResponse,body){
        //console.log('--->>>>responses:',httpResponse,body);
    });
}

module.exports = {
    push_send
}