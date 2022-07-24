const queryValue = (conn, data, type, requiredFields, exceptionKeys) => {
    const fields = requiredFields || [];
    const exceptionList = exceptionKeys || [];
    const keys = Object.keys(data);
    const queryData = { column: [], value: [] };
    const setData = [];

    if (keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
            if (fields.indexOf(keys[i]) !== -1 || fields.length === 0) {
                const value = data[keys[i]];

                if (!!value || value === 0 || value === false || value === '') {
                    const qvalue = value === '' ? null : value;

                    switch (type) {
                        case 'create':
                            queryData.column.push(conn.escapeId(keys[i]));
                            queryData.value.push(conn.escape(qvalue));
                            break;
                        case 'update':
                            setData.push(`${conn.escapeId(keys[i])} = ${conn.escape(qvalue)}`);
                    };
                };
            } else {
                if (exceptionList.indexOf(keys[i]) === -1) { throw 'INVALID_KEY'; };
            };
        };

        if (queryData.column.length > 0 || setData.length > 0) { return setData.length > 0 ? setData : queryData; };
    };
    throw 'NO_DATA';
};

module.exports = { queryValue };
