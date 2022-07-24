const pool = require('./config');

const korexConn = async (callback) => {
    const conn = await pool.getConnection(async conn => conn);
    
    try {
        return callback(conn);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        conn.release();
    }
};

module.exports = { korexConn };
