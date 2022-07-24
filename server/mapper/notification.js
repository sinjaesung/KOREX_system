module.exports = {
    async insertNotificationSetting(conn, data) {
        const [ row ] = await conn.query(`
            insert into notificationSetting (${data.column}) values (${data.value});
        `);

        return row;
    }
};