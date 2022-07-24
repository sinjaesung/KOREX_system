const { korexConn } = require('../database/connection');
const { getDongCodeByCoordinate } = require('../modules/kakao')
const actualTransactionService = require('../service/actualTransactionService');
const complexService = require('../service/complexService');
const productService = require('../service/productService');
const realtorService = require('../service/realtorService');
const mapMapper = require('../mapper/map');

const path=require('path');
const appdir = path.dirname(require.main.filename);
const SIGJSON = require(appdir+'/mapjson/TL_SCCO_SIG.json');
const EMDJSON = require(appdir+'/mapjson/TL_SCCO_EMD.json');

module.exports = {
    async getMapCluster(req) {
        return await korexConn(async (conn) => {
            req.query.is_map = '1';
            const filterData = req.query.filter ? JSON.parse(req.query.filter) : {};

            if (!!filterData.map) {
                const data = filterData.default || {};
                const atcomplexFilter = {
                    default: { bld_type: data.prd_type },
                    map: filterData.map
                };
                const realtorFilter = {
                    pro: { category: data.prd_type },
                    map: filterData.map
                };
                const atcomplexes = Number(req.query.is_complex) === 1 
                    ? await actualTransactionService.getActualTransactionComplexes({ query: { is_map: '1', filter: JSON.stringify(atcomplexFilter) } }, conn) 
                    : [];
                const products = Number(req.query.is_product) === 1 
                    ? await productService.getProducts(req, conn) 
                    : { rows: [] };
                const proRealtors = Number(req.query.is_pro_realtor) === 1 
                    ? await realtorService.getProRealtors({ query: { is_map: '1', filter: JSON.stringify(realtorFilter) } }, conn) 
                    : [];
    
                return {
                    atcomplexes_count: atcomplexes.length,
                    products_count: products.rows.length,
                    pro_realtors_count: proRealtors.length,
                    atcomplexes: atcomplexes,
                    products: products.rows,
                    pro_realtors: proRealtors
                };
            };
        });
    },
    async getMapSearch(req) {
        if (!!req.query.keyword) {
            return korexConn(async (conn) => {
                const bldType = req.query.bld_type;
                const keyword = `${conn.escape(`%${req.query.keyword.replace(/(\s*)/g, '')}%`)}`;
                const limitInt = Number(req.query.limit);
                const limit = !!limitInt && limitInt <= 30 ? limitInt : 20;
                const limitQuery = `limit ${limit}`;
                const column = req.params.searchType === 'address' ? 'dong.id' : 'id';
                let queryWhere = '';

                if (req.params.searchType !== 'all' && !!req.query.before_id) {
                    queryWhere = `and ${column} > ${req.query.before_id}`;
                };

                switch (req.params.searchType) {
                    case 'all':
                        const complexFilter = {
                            default: { bld_type: bldType },
                            contains: { complex_name: req.query.keyword },
                        };
                        const complexes = bldType === '아파트' || bldType === '오피스텔'
                            ? await complexService.getComplexes({ query: { auto_complete: '1', filter: JSON.stringify(complexFilter), limit: limit } }, conn)
                            : [];
                        
                        return {
                            complexes: complexes,
                            local: await mapMapper.getAddrUnitAllByKeyword(conn, keyword, queryWhere, limitQuery),
                            metro: await mapMapper.getMetroAllByKeyword(conn, keyword, queryWhere, limitQuery),
                            university: await mapMapper.getUniversityAllByKeyword(conn, keyword, queryWhere, limitQuery)
                        };
                    case 'local':
                        return await mapMapper.getAddrUnitAllByKeyword(conn, keyword, queryWhere, limitQuery);
                    case 'metro':
                        return await mapMapper.getMetroAllByKeyword(conn, keyword, queryWhere, limitQuery);
                    case 'university':
                        return await mapMapper.getUniversityAllByKeyword(conn, keyword, queryWhere, limitQuery);
                    default:
                        throw 'NOT_FOUND';
                };
            });
        };
        throw 'LACK_OF_PARAMETER';
    },
    async getMapPolygon(req) {
        if (!!req.query.map_level && !!req.query.center_x && !!req.query.center_y) {
            const mapLevel = Number(req.query.map_level);
            const dongCode = await getDongCodeByCoordinate(req.query.center_x, req.query.center_y);
            
            if (mapLevel <= 5) {
                const emds = EMDJSON.features;
                
                for (let e = 0; e < emds.length; e++) {
                    if (emds[e].properties.EMD_CD === dongCode.substring(0, 8)) {
                        return {
                            coordinates: emds[e].geometry.coordinates,
                            local_name: emds[e].properties.EMD_KOR_NM
                        };
                    };
                };
            };

            if (mapLevel === 6 || mapLevel === 7) {
                const sggs = SIGJSON.features;

                for (let s = 0; s < sggs.length; s++) {
                    if (sggs[s].properties.SIG_CD === dongCode.substring(0, 5)) {
                        return {
                            coordinates: sggs[s].geometry.coordinates,
                            local_name: sggs[s].properties.SIG_KOR_NM
                        };;
                    };
                };
            };

            return null;
        };
        throw 'LACK_OF_PARAMETER';
    }
};
