
const mysqls=require('mysql2/promise');
const pool= mysqls.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref'
});

function DateText(date, text){
    let month = String(date.getMonth()+1);
    let _date = String(date.getDate());

    if(month.length == 1){
        month = "0"+month;
    }

    if(_date.length == 1){
        _date = "0"+String(date.getDate());
    }

    return (`${date.getFullYear()}${text}${month}${text}${_date}`)
}


module.exports = {
    async getBannerList(queryWhere){
        const connection = await pool.getConnection(async conn => conn);
        const today = new Date();
        
        /*let [rows] =  await connection.query(`
        SELECT * FROM banner2 WHERE ban_activated = 1  AND ban_end_date>=date_format('${DateText(today, "-")}', '%Y%m%d');
        ` + queryWhere);*/
        let [rows] = await connection.query(`
        select * from banner2 where ban_activated = 1 `+queryWhere + `order by ban_no asc`);
        console.log(`
        select * from banner2 where ban_activated = 1 `+queryWhere);
        connection.release();
        return rows;
    },
}