const { korexConn } = require('../database/connection');
const { queryValue } = require('../modules/queryset');
const notificationMapper = require('../mapper/notification');

module.exports = {
    async setNotification(req) {
        return await korexConn(async (conn) => {
            const queryData = await queryValue(conn, req.body, 'create');
            return await notificationMapper.insertNotificationSetting(conn, queryData);
        });
    }
};