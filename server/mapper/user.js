module.exports = {
    async getUserFields(type) {
        const defaultFields = [ 'user_name', 'phone', 'email', 'company_id', 'bp_id' ];

        switch (type) {
            case 'find': return [ 'mem_id', ...defaultFields, 'mem_img', 'user_type' ];
            case 'create': return [ ...defaultFields, 'password', 'user_type', 'register_type', 'mem_notification', 'user_username', 'is_required_terms' ];
            case 'update': return [ ...defaultFields, 'mem_img', 'password', 'fcmtocken', 'is_deleted' ];
            default:
                return defaultFields;
        };
    },
    async getUser(conn, fields, queryWhere) {
        const [[ row ]] = await conn.query(`
            select ${fields} from user
            ${queryWhere};
        `);

        return row
    },
    async insertUser(conn, data) {
        const [ row ] = await conn.query(`
            insert into user (${data.column}) values (${data.value});
        `);

        return row.insertId;
    },
    async updateUser(conn, setData, memId) {
      return await conn.query(`
          update user
          set ${setData}
          where mem_id = ${memId};
      `);
    }
};