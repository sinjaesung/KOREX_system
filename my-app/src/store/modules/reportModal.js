import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const REPORTTYPECHANGE = 'reportmodal/reporttypechange';
const REPORTNAMECHANGE = 'reportmodal/reportnamechange';
const REPORTPHONECHANGE = 'reportmodal/reportphonechange';

// 액션 생성 함수를 만듭니다.
export const reporttypechange = createAction(REPORTTYPECHANGE);
export const reportnamechange = createAction(REPORTNAMECHANGE);
export const reportphonechange = createAction(REPORTPHONECHANGE);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
  reporttype:'',
  reportname:'',
  reportphone:''
   
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  [REPORTTYPECHANGE]: (state, action) => {
    console.log('reporttype 호출',state,action);
    return produce(state, draft => {
      draft.reporttype = action.payload.reporttype;
    });
  },
  // { } 를 따로 열지 않고 바로 리턴하면 이런 형식입니다.
  [REPORTNAMECHANGE]: (state, action) =>{
    console.log('REPORTNAMECHANGE 함수 호출:',state,action);
    return produce(state, draft => {
      draft.reportname = action.payload.reportname;
    });
  },
  [REPORTPHONECHANGE]: (state, action) => {
     console.log('REPORTPHONECHANGE 함수 호출 :',state,action);
    return produce(state, draft => {
      draft.reportphone = action.payload.reportphone;
    });
  }
}, initialState);