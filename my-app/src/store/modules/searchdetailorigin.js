import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const XCHANGE = 'searchdetailorigin/xchange';
const YCHANGE= 'searchdetailorigin/ychange';

// 액션 생성 함수를 만듭니다.
export const xchange = createAction(XCHANGE);
export const ychange = createAction(YCHANGE)


// 모듈의 초기 상태를 정의합니다.
const initialState = {
   x : '',
   y : '',
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  
  [XCHANGE]: (state, action) => {
    console.log('searchdetalorign xchange 호출',state,action);
    return produce(state, draft => {
      draft.x = action.payload.x;
    });
  },
  [YCHANGE] : (state,action) => {
    console.log('searchdetalorign ychange 호출',state,action);
    return produce(state, draft =>{
      draft.y = action.payload.y;
    });
  },
}, initialState);