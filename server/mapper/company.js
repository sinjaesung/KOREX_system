module.exports = {
    async getCompanyFields(type) {
        const defaultFields = [
            'company_name', 'ceo_name', 'ceo_phone', 'addr_jibun', 'addr_road', 'x', 'y', 'chat_key',
            'company_no', 'realtor_reg_no', 'company_reg_path', 'realtor_reg_path'
        ];

        switch (type) {
            case 'find': return [ 'company_id', ...defaultFields, 'is_pro', 'chat_key', 'type' ];
            case 'create': return [ ...defaultFields, 'type', 'reg_user_id' ];
            case 'update': return [ ...defaultFields, 'profile_img', 'mod_user_id' ];
            default: return defaultFields;
        };
    },
    async getCompanyMemberFields(type) {
      switch (type) {
          case 'create': return [ 'cm_type', 'mem_id', 'register_mem_id', 'company_id', 'bp_id' ];
          case 'update': return [ 'cm_type' ];
          default: return [ '*' ];
      };
  },
    async getCompany(conn, fields, queryWhere) {
        const [[ row ]] = await conn.query(`
            select ${fields}, user_name, phone from company2 cp
            inner join (select mem_id, user_name, phone from user) u
            on cp.reg_user_id = u.mem_id
            ${queryWhere}
        `);

      return row;
    },
    async getCompanyAllByMemId(conn, fields, memId) {
        const [ rows ] = await conn.query(`
            select ${fields} from company2 cp
            inner join (
                select company_id as cp_id from company_member
                where mem_id = ${memId}
            ) cm on cp.company_id = cm.cp_id;
        `);

        return rows;
    },
    async insertCompany(conn, data) {
        const [ row ] = await conn.query(`
            insert into company2 (${data.column}) values (${data.value});
        `);

        return row.insertId;
    },
    async updateCompany(conn, setData, companyId) {
        return await conn.query(`
            update company2
            set ${setData}
            where company_id = ${companyId};
        `);
    },
    async insertCompanyMember(conn, data) {
        return await conn.query(`
            insert into company_member (${data.column}) values (${data.value});
        `);
    },
    async updateCompanyMember(conn, setData, companyId, cmId) {
        return await conn.query(`
            update company_member
            set ${setData}
            where company_id = ${companyId} and cmId = ${cmId};
        `);
    },
    async getCompanyAllMember(conn, queryWhere) {
        const [ rows ] = await conn.query(`
            select * from company_member cm
            inner join (
                select mem_id as user_id, user_name, phone from user
                where is_deleted = 0
            ) u
            on cm.mem_id = u.user_id
            ${queryWhere};
        `);

        return rows;
    },
    async deleteCompanyMember(conn, cmId) {
        const [ row ] = await conn.query(`
            delete from company_member
            where cm_id = ${cmId};
        `);

        return row;
    }
};
