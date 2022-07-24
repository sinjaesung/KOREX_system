const path=require('path');
var appdir=path.dirname(require.main.filename);


console.log('appdirssssss:',appdir);

try{
    var mapshaper=require('mapshaper');
    var ogr2ogr=require('ogr2ogr');
    var fs=require('fs');
    //D:\koreax\areaTable
    var geojson=ogr2ogr('D:\\koreax\\areaTable\\TL_SCCO_CTPRVN.shp').stream();
    console.log('geosjon data stream hahahaha:',geojson);
    console.log(mapshaper,ogr2ogr,fs);
}catch(error){
    console.log('error 발생:::',error);
}
