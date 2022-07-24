import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const COMPLEXIDCHANGE = 'temp_selectComplexinfo/complexidchange';
const BLDPKCHANGE = 'temp_selectComplexinfo/bldpkchange';
const COMPLEXNAMECHANGE = 'temp_selectComplexinfo/complexnamechange';
const DONGCNTCHANGE = 'temp_selectComplexinfo/dongcntchange';
const ADDRJIBUNCHANGE= 'temp_selectComplexinfo/addrjibunchange';
const ADDRROADCHANGE= 'temp_selectComplexinfo/addrroadchange';
const DEVELOPERCHANGE = 'temp_selectComplexinfo/developerchange';
const CONSTRUCTORCHANGE= 'temp_selectComplexinfo/constructorchange';
const APPROVALDATECHANGE= 'temp_selectComplexinfo/approvaldatechange';
const TOTALPARKINGCNTCHANGE= 'temp_selectComplexinfo/totalparkingcntchange';
const HOUSEHOLDCNTCHANGE= 'temp_selectComplexinfo/householdcntchange';
const XCHANGE='temp_selectComplexinfo/xchange';
const YCHANGE='temp_selectComplexinfo/ychange';
const HEATTYPECHANGE='temp_selectComplexinfo/heattypechange';
const HALLTYPECHANGE='temp_selectComplexinfo/halltypechange';
const BLDTYPECHANGE='temp_selectComplexinfo/bldtypechange';

// 액션 생성 함수를 만듭니다.
export const complexidchange = createAction(COMPLEXIDCHANGE);
export const bldpkchange = createAction(BLDPKCHANGE);
export const complexnamechange = createAction(COMPLEXNAMECHANGE);
export const dongcntchange = createAction(DONGCNTCHANGE);
export const addrjibunchange = createAction(ADDRJIBUNCHANGE);
export const addrroadchange = createAction(ADDRROADCHANGE);
export const developerchange = createAction(DEVELOPERCHANGE);
export const constructorchange = createAction(CONSTRUCTORCHANGE);

export const approvaldatechange= createAction(APPROVALDATECHANGE);
export const totalparkingcntchange= createAction(TOTALPARKINGCNTCHANGE);
export const householdcntchange= createAction(HOUSEHOLDCNTCHANGE);
export const xchange= createAction(XCHANGE);
export const ychange= createAction(YCHANGE);
export const heattypechange =createAction(HEATTYPECHANGE);
export const halltypechange= createAction(HALLTYPECHANGE);
export const bldtypechange= createAction(BLDTYPECHANGE);


// 모듈의 초기 상태를 정의합니다.
const initialState = {
   complexid:'',
   bldpk:'',
   complexname:'',
   dongcnt:'',
   addrjibun:'',
   addrroad:'',
   developer:'',
    constructor:'',
    approvaldate:'',
    totalparkingcnt:'',
    householdcnt:'',
    x:'',
    y:'',
    heattype:'',
    halltype:'',
    bldtype:''
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  
  [COMPLEXIDCHANGE]: (state, action) => {
    console.log('COMPLEXIDCHANGE함수 호출',state,action);
    return produce(state, draft => {
      draft.complexid = action.payload.complexid;
    });
  },
  // { } 를 따로 열지 않고 바로 리턴하면 이런 형식입니다.
  [BLDPKCHANGE]: (state, action) =>{
    console.log('bldpkchange 함수 호출:',state,action);
    return produce(state, draft => {
      draft.bldpk = action.payload.bldpk;
    });
  },
  [COMPLEXNAMECHANGE]: (state, action) => {
     console.log('compelxnmaechange 함수 호출 :',state,action);
    return produce(state, draft => {
      draft.complexname = action.payload.complexname;
    });
  },
  [DONGCNTCHANGE]: (state, action) => {
    console.log('dongcntchange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.dongcnt = action.payload.dongcnt;
   });
 },
 [ADDRJIBUNCHANGE]: (state, action) => {
    console.log('AADDRJUBINCUHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.addrjibun = action.payload.addrjibun;
   });
 },
 [ADDRROADCHANGE]: (state, action) => {
    console.log('addroadchange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.addrroad = action.payload.addrroad;
   });
 },
 [DEVELOPERCHANGE]: (state, action) => {
    console.log('delveoperchange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.developer = action.payload.developer;
   });
 },
 [CONSTRUCTORCHANGE]: (state, action) => {
    console.log('constdurchtorchange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.constructor = action.payload.constructor;
   });
 },

 [APPROVALDATECHANGE]: (state, action) => {
    console.log('APPROVALDATECHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.approvaldate = action.payload.approvaldate;
   });
 },
 [TOTALPARKINGCNTCHANGE]: (state, action) => {
    console.log('TOTALPARKGINCNTCHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.totalparkingcnt = action.payload.totalparkingcnt;
   });
 },
 [HOUSEHOLDCNTCHANGE]: (state, action) => {
    console.log('HOUSEHOLDCNTCHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.householdcnt = action.payload.householdcnt;
   });
 },
 [XCHANGE]: (state, action) => {
    console.log('XCHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.x = action.payload.x;
   });
 },
 [YCHANGE]: (state, action) => {
    console.log('YCHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.y = action.payload.y;
   });
 },
 [HEATTYPECHANGE]: (state, action) => {
    console.log('HEATTYPECHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.heattype = action.payload.heattype;
   });
 },
 [HALLTYPECHANGE]: (state, action) => {
    console.log('HALLTYPECHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.halltype = action.payload.halltype;
   });
 },
 [BLDTYPECHANGE]: (state, action) => {
    console.log('BLDTYPECHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.bldtype = action.payload.bldtype;
   });
 }
}, initialState);