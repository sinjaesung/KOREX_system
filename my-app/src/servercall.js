const ip = "http://localhost:8088/api/";

const api = {
  connectFetchController : async (path,method,body,callBack,errorCallBack) =>{
    return fetch(`${ip}${path}`, {
        credentials:'include',
        method: method,
        body:body?body:null,
    }).then(function(res) {
        console.log('res=->>>>',res);
        return res.json();
    }).then(function(data) {
        if(callBack)
          callBack(data);
        return data;
    }).catch(function(e){
        if(errorCallBack)
          errorCallBack(e);
        });
    },
}

export default api;

//let res = await serverController.connectFetchController(`LinkInfo/delete_link?lio_id_array=${postIndex}`,"DELETE",null)
//serverController.connectFetchController("users/login","POST",formData,function(res){});