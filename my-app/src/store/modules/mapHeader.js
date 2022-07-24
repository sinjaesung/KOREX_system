import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const UPDATE_PRDTYPE = 'mapHeader/prdtypechange';
const UPDATE_ROADADDRESS = 'mapHeader/roadaddresschange';
const UPDATE_ORIGIN = 'mapHeader/searchresult_originchange';
const UPDATE_ORIGINID = 'mapHeader/searchresult_originidchange';

// 액션 생성 함수를 만듭니다.
export const updateprdtype = createAction(UPDATE_PRDTYPE);
export const updateroadaddress = createAction(UPDATE_ROADADDRESS);
export const updateorigin = createAction(UPDATE_ORIGIN);
export const updateoriginid = createAction(UPDATE_ORIGINID);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
    prdtype : '',
    roadaddress: '',
    origin : {},
    originid : 1,   
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  [UPDATE_PRDTYPE]: (state, action) => {
      console.log('MAPHEADER UPDATE PRDTYPE');
    return produce(state, draft => {
        draft.prdtype = action.payload.prdtypes ? action.payload.prdtypes : draft.prdtype;
    });
  },
  [UPDATE_ROADADDRESS]: (state, action) => {
      console.log('MAPHEADER UPDATE ROADADDRESS');
    return produce(state, draft => {
        draft.roadaddress = action.payload.roadaddresss ? action.payload.roadaddresss : draft.roadaddress;
    });
  },
  [UPDATE_ORIGIN]: (state, action) => {
      console.log('MAPHEADER UPDATE ORIGIN');
    return produce(state, draft => {
        draft.origin = action.payload.origins ? action.payload.origins : draft.origin;
    });
  },
  [UPDATE_ORIGINID] : (state,action) => {
    console.log('MAPHEDAER UDPATE ORIGINID');
    return produce(state, draft => {
      draft.originid = action.payload.originid ? action.payload.originid : draft.originid;
    })
  }
  
}, initialState);