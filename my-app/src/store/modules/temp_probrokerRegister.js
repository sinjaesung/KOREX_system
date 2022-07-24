import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const ISAPART = 'temp_probrokerRegister/isapartchange';
const APARTADDRESSROAD= 'temp_probrokerRegister/apartaddr_roadchange';
const APARTNAME = 'temp_probrokerRegister/apartnamechange';
const ISOFFICETEL = 'temp_probrokerRegister/isofficetelchange';
const OFFICETELADDRESSROAD= 'temp_probrokerRegister/officeteladdr_roadchange';
const OFFICETELNAME = 'temp_probrokerRegister/officetelnamechange';
const ISSTORE = 'temp_probrokerRegister/isstorechange';
const ISOFFICE = 'temp_probrokerRegister/isofficechange';
const REALTORFILE= 'temp_probrokerRegister/realtorfilechange';
const COMPANYREGFILE= 'temp_probrokerRegister/companyregfilechange';

// 액션 생성 함수를 만듭니다.
export const isapartchange = createAction(ISAPART);
export const apartaddr_roadchange = createAction(APARTADDRESSROAD);
export const apartnamechange = createAction(APARTNAME);
export const isofficetelchange = createAction(ISOFFICETEL);
export const officeteladdr_roadchange= createAction(OFFICETELADDRESSROAD);
export const officetelnamechange = createAction(OFFICETELNAME);
export const isstorechange = createAction(ISSTORE);
export const isofficechange = createAction(ISOFFICE);
export const realtorfilechange = createAction(REALTORFILE);
export const companyregfilechange = createAction(COMPANYREGFILE);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
   isapart : '',
   apartaddr_road :'',
   apartname :'',
   isofficetel:'',
   officeteladdr_road : '',
   officetelname:'',
   isstore :'',
   isoffice:'',
   realtorfile :'',
   companyregfile:''
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  
  [ISAPART]: (state, action) => {
    console.log('isapart change  호출',state,action);
    return produce(state, draft => {
      draft.isapart = action.payload.isapart;
    });
  },
  [APARTADDRESSROAD]: (state, action) => {
    console.log('APARTADDRESSROAD change  호출',state,action);
    return produce(state, draft => {
      draft.apartaddr_road = action.payload.apartaddr_road;
    });
  },
  [APARTNAME]: (state, action) => {
    console.log('APARTNAME change  호출',state,action);
    return produce(state, draft => {
      draft.apartname = action.payload.apartname;
    });
  },
  [ISOFFICETEL]: (state, action) => {
    console.log('ISOFFICETEL change  호출',state,action);
    return produce(state, draft => {
      draft.isofficetel = action.payload.isofficetel;
    });
  },
  [OFFICETELADDRESSROAD]: (state, action) => {
    console.log('OFFICETELADDRESSROAD change  호출',state,action);
    return produce(state, draft => {
      draft.officeteladdr_road = action.payload.officeteladdr_road;
    });
  },
  [OFFICETELNAME]: (state, action) => {
    console.log('OFFICETELNAME change  호출',state,action);
    return produce(state, draft => {
      draft.officetelname = action.payload.officetelname;
    });
  },
  [ISSTORE]: (state, action) => {
    console.log('ISSTORE change  호출',state,action);
    return produce(state, draft => {
      draft.isstore = action.payload.isstore;
    });
  },
  [ISOFFICE]: (state, action) => {
    console.log('ISOFFICE change  호출',state,action);
    return produce(state, draft => {
      draft.isoffice = action.payload.isoffice;
    });
  },
  [REALTORFILE]: (state, action) => {
    console.log('REALTORFILE change  호출',state,action);
    return produce(state, draft => {
      draft.realtorfile = action.payload.realtorfile;
    });
  },
  [COMPANYREGFILE]: (state, action) => {
    console.log('comapanyregfile change  호출',state,action);
    return produce(state, draft => {
      draft.companyregfile = action.payload.companyregfile;
    });
  },
 
}, initialState);