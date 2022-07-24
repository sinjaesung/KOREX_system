
const mysqls=require('mysql2/promise');
const pool= mysqls.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref'
});

module.exports = {
    async toggleLikes(param){
        const connection = await pool.getConnection(async conn => conn);

        let [rows] = await connection.query(`
            SELECT *
            FROM likes 
            where (
                (${param.prd_id} != 0 and prd_identity_id=${param.prd_id}) 
                or 
                (${param.bp_id} != 0 and bp_id=${param.bp_id})
            ) 
            and mem_id=${param.mem_id}
        `);
        console.log('===>>해당 관련 내역like내역::');
        console.log(`
        SELECT *
        FROM likes 
        where (
            (${param.prd_id} != 0 and prd_identity_id=${param.prd_id}) 
            or 
            (${param.bp_id} != 0 and bp_id=${param.bp_id})
        ) 
        and mem_id=${param.mem_id}
      `);
        if(rows.length == 0){
            console.log(`INSERT INTO likes (prd_identity_id,bp_id,mem_id,likes_type,modify_date,create_date)VALUES ('${param.prd_id}','${param.bp_id}','${param.mem_id}','${param.likes_type}',NOW(),NOW())`);
            let result = await connection.query(`
                INSERT INTO likes (prd_identity_id,bp_id,mem_id,likes_type,modify_date,create_date)
                VALUES ('${param.prd_id}','${param.bp_id}','${param.mem_id}','${param.likes_type}',NOW(),NOW())
            `);
        }
        else{
            let likes_id=rows[0].likes_id;
            console.log(`
            delete 
            from likes 
            where (
                (${param.prd_id} != 0 and likes_id=${likes_id}) 
                or 
                (${param.bp_id} != 0 and bp_id=${param.bp_id})
            ) 
            and mem_id=${param.mem_id}`);

            let result = await connection.query(`
            delete 
            from likes 
            where (
                (${param.prd_id} != 0 and likes_id=${likes_id}) 
                or 
                (${param.bp_id} != 0 and bp_id=${param.bp_id})
            ) 
            and mem_id=${param.mem_id}`);
        }

        var [after_rows] = await connection.query(`select (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${param.mem_id}') as isLike, p.* from product p where p.prd_identity_id=?`,[param.prd_id]);
        console.log('after rowsss likes after',`select (select count(*) from likes li where p.prd_identity_id = li.prd_identity_id and li.mem_id='${param.mem_id}') as isLike, p.* from product p where p.prd_identity_id=${param.prd_id}`);
        
        connection.release();
        return after_rows;
    },
}