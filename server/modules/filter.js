const { getMapLocation } = require('./map');

const defaultFilter = async (conn, data, isContains, andList) => {
    const filters = [ ...andList ];

    if (!!data && data.constructor === Object) {
        const keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (data[key]) {
                const orList = [];
                const dataList = Array.isArray(data[key]) ? data[key] : [data[key]];
                
                for (let j = 0; j < dataList.length; j++) {
                    const item = dataList[j];
                    const column = isContains ? `replace(${conn.escapeId(key)}, ' ', '')` : conn.escapeId(key);
                    const value = isContains ? `like ${conn.escape(`%${item.replace(/(\s*)/g, '')}%`)}` : `= ${conn.escape(item)}`;
                    orList.push(`${column} ${value}`);
                };
            
                filters.push(`(${orList.join(' or ')})`);
            };
        };
    };
   
    return filters;
};

const rangeFilter = async (conn, rangeData, andList) => {
    const filters = [ ...andList ];

    if (!!rangeData && rangeData.constructor === Object) {
        const keys = Object.keys(rangeData);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (rangeData[key]) {
                const column = conn.escapeId(key);
                const startValue = rangeData[key].start_value ? conn.escape(rangeData[key].start_value) : null;
                const endValue = rangeData[key].end_value ? conn.escape(rangeData[key].end_value) : null;

                if (!!startValue && !!endValue) { filters.push(`${column} >= ${startValue} and ${column} <= ${endValue}`) }
                else { 
                    if (!!startValue) { filters.push(`${column} > ${startValue}`) };
                    if (!!endValue) { filters.push(`${column} < ${endValue}`) }; 
                };
            };
        };
    };

    return filters;
};

const mapFilter = async (conn, map, longitudeKey, latitueKey, andList) => {
    const filters = [ ...andList ];

    if (!!map && map.constructor === Object) {
        const { start_x, start_y, end_x, end_y } = map;

        if (start_x && start_y && end_x && end_y) {
            const locationFilter = await rangeFilter(conn, {
                [ longitudeKey ]: { start_value: start_x, end_value: end_x },
                [ latitueKey ]: { start_value: start_y, end_value: end_y }
            }, []);
            
            filters.push(`(${locationFilter.join(' and ')})`);
        } else {
            throw 'LACK_OF_MAP_FILTER';
        };
    };
    
    return filters
};

module.exports = { defaultFilter, rangeFilter, mapFilter };
