import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const UPDATE_EXCLUSIVE = 'mapProductEls/exc';
const UPDATE_PROBROKER = 'mapProductEls/pro';
const UPDATE_BROKERPRODUCT = 'mapProductEls/broPro';
const UPDATE_BLOCK = 'mapProductEls/block';
const UPDATE_ORDER = 'mapProductEls/order';
const UPDATE_CLICKEXC = 'mapProductEls/clickExc';
const UPDATE_CLICKPRO = 'mapProductEls/clickPro';
const UPDATE_CLICKBLO = 'mapProductEls/clickBlo';

const UPDATE_CLICKMARKER = 'mapProductEls/clickMarker';
const UPDATE_CLICKCLUSTER= 'mapProductEls/clickCluster';
//const UPDATE_CLICKMARKER_MATCHDATA = 'mapProductEls/clickMarker_matchdata';
//const UPDATE_CLICKCLUSTER_MATCHDATA = 'mapProductEls/clickCluster_matchdata';

const UPDATE_EXCLUSIVE_ZIDO = 'mapProductEls/exczido';
const UPDATE_PROBROKER_ZIDO = 'mapProductEls/prozido';
const UPDATE_BLOCK_ZIDO = 'mapProductEls/blockzido';

// 액션 생성 함수를 만듭니다.
export const updateExclusive = createAction(UPDATE_EXCLUSIVE);
export const updateProbroker = createAction(UPDATE_PROBROKER);
export const updateBrokerProduct = createAction(UPDATE_BROKERPRODUCT);
export const updateBlock = createAction(UPDATE_BLOCK);
export const updateOrder = createAction(UPDATE_ORDER);
export const updateClickExc = createAction(UPDATE_CLICKEXC);
export const updateClickPro = createAction(UPDATE_CLICKPRO);
export const updateClickBlo = createAction(UPDATE_CLICKBLO);

export const updateClickMarker= createAction(UPDATE_CLICKMARKER);
export const updateClickCluster= createAction(UPDATE_CLICKCLUSTER);
//export const updateClickMarker_matchdata= createAction(UPDATE_CLICKMARKER_MATCHDATA);//클릭한 마커(전문중개사or전속매물or단지)에 대한 관련 요소들 불러오기.
//export const updateClickCluster_matchdata = createAction(UPDATE_CLICKCLUSTER_MATCHDATA);

export const updateExclusive_zido = createAction(UPDATE_EXCLUSIVE_ZIDO);
export const updateProbroker_zido = createAction(UPDATE_PROBROKER_ZIDO);
export const updateBlock_zido = createAction(UPDATE_BLOCK_ZIDO);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
    exclusive  : [], //전속매물 사이드바
    probroker: [], //전문중개사 사이드바
    brokerProduct: [], //전문중개사 담당(수임)매물 사이드바
    block: [], //단지 사이드바

    exclusive_zido : {cnt:0},//지도에 표현하는것은 다 표현!전체 데이터 한번에 표현
    probroker_zido : {cnt:0},//지도표현 전문중개사 전체데이터
    block_zido : {cnt:0},//지도표현 단지 전체데이터
    
    order:0,
    clickExc:{},
    clickPro:0,
    clickBlo:0,

    clickmarker:{
      isclick:false
    },//클릭한 마커의 타입(전속매물,전문중개사,단지)여부 구한다.
    clickcluster:{}//클릭한 클러스터관련 정보(전속매물,전문중개사,단지)여부 구한다.
    ,
    //clickmarker_matchdata:[],
    //clickcluster_matchdata: []
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  [UPDATE_EXCLUSIVE]: (state, action) => {
    // console.log('UPDATE EXCULSIVE>>>:',action);
    return produce(state, draft => {
        draft.exclusive = action.payload.exclusive ? action.payload.exclusive : draft.exclusive;
    });
  },
  [UPDATE_PROBROKER]: (state, action) => {
    // console.log('UPDATE PROBROKER>>>:',action);
    return produce(state, draft => {
        draft.probroker = action.payload.probroker ? action.payload.probroker : draft.probroker;
    });
  },
  [UPDATE_BROKERPRODUCT]: (state, action) => {
    // console.log('UPDATE BROKERPRODUCT>>>:',action);
    return produce(state, draft => {
        draft.brokerProduct = action.payload.brokerProduct ? action.payload.brokerProduct : draft.brokerProduct;
    });
  },
  [UPDATE_BLOCK]: (state, action) => {
    // console.log('UPDATE BLOCK>>>:',action);
    return produce(state, draft => {
        draft.block = action.payload.block ? action.payload.block : draft.block;
    });
  },
  [UPDATE_ORDER]: (state, action) => {
    return produce(state, draft => {
        draft.order = action.payload.order ? action.payload.order : draft.order;
    });
  },
  [UPDATE_CLICKEXC]: (state, action) => {
    return produce(state, draft => {
        draft.clickExc = action.payload.clickExc ? action.payload.clickExc : draft.clickExc;
    });
  },
  [UPDATE_CLICKPRO]: (state, action) => {
    return produce(state, draft => {
        draft.clickPro = action.payload.clickPro ? action.payload.clickPro : draft.clickPro;
    });
  },
  [UPDATE_CLICKBLO]: (state, action) => {
    return produce(state, draft => {
        draft.clickBlo = action.payload.clickBlo ? action.payload.clickBlo : draft.clickBlo;
    });
  },
  [UPDATE_CLICKMARKER] : (state, action) => {
    return produce(state, draft => {
        draft.clickmarker = action.payload.clickmarker ? action.payload.clickmarker : draft.clickmarker;
    });
  },
  [UPDATE_CLICKCLUSTER] : (state, action) => {
    return produce(state, draft => {
        draft.clickcluster = action.payload.clickcluster ? action.payload.clickcluster : draft.clickcluster;
    });
  },
  /*[UPDATE_CLICKMARKER_MATCHDATA] : (state, action) => {
    return produce(state, draft => {
        draft.clickmarker_matchdata = action.payload.clickmarker_matchdata ? action.payload.clickmarker_matchdata : draft.clickmarker_matchdata;
    });
  },
  [UPDATE_CLICKCLUSTER_MATCHDATA] : (state, action) => {
    return produce(state, draft => {
        draft.clickcluster_matchdata = action.payload.clickcluster_matchdata ? action.payload.clickcluster_matchdata : draft.clickcluster_matchdata;
    });
  },*/
  [UPDATE_EXCLUSIVE_ZIDO]: (state, action) => {
    // console.log('UPDATE EXCULSIVE>>>:',action);
    return produce(state, draft => {
        draft.exclusive_zido = action.payload.exclusive_zido ? action.payload.exclusive_zido : draft.exclusive_zido;
    });
  },
  [UPDATE_PROBROKER_ZIDO]: (state, action) => {
    // console.log('UPDATE PROBROKER>>>:',action);
    return produce(state, draft => {
        draft.probroker_zido = action.payload.probroker_zido ? action.payload.probroker_zido : draft.probroker_zido;
    });
  },
  [UPDATE_BLOCK_ZIDO]: (state, action) => {
    // console.log('UPDATE BLOCK>>>:',action);
    return produce(state, draft => {
        draft.block_zido = action.payload.block_zido ? action.payload.block_zido : draft.block_zido;
    });
  },
}, initialState);