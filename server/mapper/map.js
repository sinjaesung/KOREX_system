module.exports = {
    async getAddrUnitAllByKeyword(conn, keyword, queryWhere, limit) {
        const [ rows ] = await conn.query(`
            select dong.id, concat(sido.name, ' ', sgg.name, ' ', dong.name) name, dong.x, dong.y 
            from (
                select * from addr_units
                where type = 4
            ) dong inner join (
                select * from addr_units
                where type = 2
            ) sgg  on dong.up_id = sgg.id
            inner join (
                select * from addr_units
                where type = 1
            ) sido on sgg.up_id = sido.id
            and concat(sido.name, sgg.name, dong.name) like ${keyword} ${queryWhere}
            order by dong.id asc
            ${limit};
        `);

        return rows;
    },
    async getUniversityAllByKeyword(conn, keyword, queryWhere, limit) {
        const [ rows ] = await conn.query(`
            select id, uvs_name, x, y from university
            where uvs_name like ${keyword} ${queryWhere}
            order by id asc
            ${limit};
        `);

        return rows;
    },
    async getMetroAllByKeyword(conn, keyword, queryWhere, limit) {
        const [ rows ] = await conn.query(`
            select id, mtr_name, mtr_line, x, y from metro
            where mtr_name like ${keyword} ${queryWhere}
            order by id asc
            ${limit};
        `);

        return rows;
    }
};