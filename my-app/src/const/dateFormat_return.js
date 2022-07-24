function date_format(stringdata){
    console.log('date_format exeuctess:',stringdata);
    let year_original=new Date(stringdata).getFullYear();
    let month_original=new Date(stringdata).getMonth()+1;
    let date_original=new Date(stringdata).getDate();

    month_original = month_original < 10 ? '0'+month_original:month_original;
    date_original = date_original < 10 ? '0'+date_original : date_original;

    let hour_original=new Date(stringdata).getHours()<10?'0'+new Date(stringdata).getHours():new Date(stringdata).getHours();
    let minute_original=new Date(stringdata).getMinutes()<10?'0'+new Date(stringdata).getMinutes():new Date(stringdata).getMinutes();

    return year_original+'-'+month_original+'-'+date_original+' '+hour_original+':'+minute_original;
}
export default date_format;