module.exports = {
    async getActualTransactionAllByAtcId(conn, queryData) {
        const { queryWhere, atcId, limit, offset } = queryData;
        const [ rows ] = await conn.query(`
            select atp_id, transaction_type, contract_date, price, month_price, floor
            from actual_transaction
            where atc_id = ${atcId} ${queryWhere}
            order by contract_date desc
            ${limit}
            ${offset};
        `);

        return rows;
    },
    async getActualTransactionByAtpId(conn, atpId) {
        const [[ row ]] = await conn.query(`
            select * from actual_transaction
            where atp_id = ${atpId};
        `);

        return row;
    },
    async getActualTransactionComplexAll(conn, queryData) {
        const { fields, queryWhere, join, order, limit, offset } = queryData
        const [ rows ] = await conn.query(`
            select ${fields} from (
              select * from actual_transaction_complexes
              ${queryWhere}
            ) atc
            ${join}
            ${order}
            ${limit}
            ${offset};
        `);

        return rows;
    },
    async getActualTransactionComplexByAtcId(conn, atcId) {
        const [[ row ]] = await conn.query(`
            select * from actual_transaction_complexes
            where atc_id = ${atcId} and x is not null;
        `);

        return row;
    },
    async getAreaByAtcId(conn, atcId) {
        const [ rows ] = await conn.query(`
            select exclusive_area from actual_transaction
            where atc_id = ${atcId}
            group by exclusive_area;
        `);

        return rows;
    }
};
