import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const EMAILCHANGE = 'temp_regi_userdata/emailchange';
const NAMECHANGE = 'temp_regi_userdata/namechange';
const PHONECHANGE = 'temp_regi_userdata/phonechange';
const USERTYPECHANGE = 'temp_regi_userdata/usertypechange';
const AGREESTATUSCHANGE = 'temp_regi_userdata/agreestatuschange';
const PASSWORDCHANGE  = 'temp_regi_userdata/passwordchange';
const BUSINESSNUMBERCHANGE= 'temp_regi_userdata/businessnumberchange';
const BUSINESSNAMECHANGE = 'temp_regi_userdata/businessnamechange';

//clc realtors관련 데이터.
const MNGNOCHANGE= 'temp_regi_userdata/mngnochange';
const REGNOCHANGE='temp_regi_userdata/regnochange';
const ADDRRAWCHANGE='temp_regi_userdata/addrrawchange';
const ADDRJIBUNCHANGE='temp_regi_userdata/addrjibunchange';
const ADDRROADCHANGE='temp_regi_userdata/addrroadchcange';
const XCHANGE='temp_regi_userdata/xchange';
const YCHANGE='temp_regi_userdata/ychange';


// 액션 생성 함수를 만듭니다.
export const emailchange = createAction(EMAILCHANGE);
export const namechange = createAction(NAMECHANGE);
export const phonechange = createAction(PHONECHANGE);
export const usertypechange= createAction(USERTYPECHANGE);
export const agreestatuschange= createAction(AGREESTATUSCHANGE);
export const passwordchange = createAction(PASSWORDCHANGE);
export const businessnumberchange= createAction(BUSINESSNUMBERCHANGE);
export const businessnamechange= createAction(BUSINESSNAMECHANGE);

//clc relators관련
export const mngnochange= createAction(MNGNOCHANGE);
export const regnochange = createAction(REGNOCHANGE);
export const addrrawchange = createAction(ADDRRAWCHANGE);
export const addrjibunchange = createAction(ADDRJIBUNCHANGE);
export const addrroadchange = createAction(ADDRROADCHANGE);
export const xchange= createAction(XCHANGE);
export const ychange= createAction(YCHANGE);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
   email : '',
   name: '',
   phone: '',
   agree_status : '',
   password : '',
   usertype: '',
   businessnumber : '',//기업,중개사,분양사 사업자번호
   businessname: '', //기업,중개사,분양사 상호명

   mngno : '',//중개사 회원가입 한정, 가입하려는 대상자가 사전clc에 등록되어있다면 그 clc mng넘버정보(clc등록 중개사정보)를 참조,저장,
   regno:'',
   addrraw:'',
   addrjibun:'',
   addrroad:'',
   x:'',
   y:''
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  
  [EMAILCHANGE]: (state, action) => {
    console.log('emailchange함수 호출 이메일변경',state,action);
    return produce(state, draft => {
      draft.email = action.payload.emails;
    });
  },
  // { } 를 따로 열지 않고 바로 리턴하면 이런 형식입니다.
  [NAMECHANGE]: (state, action) =>{
    console.log('namechange 함수 호출 이름값 변경:',state,action);
    return produce(state, draft => {
      draft.name = action.payload.names;
    });
  },
  [PHONECHANGE]: (state, action) => {
     console.log('phonechange 함수 호출 폰값 변경:',state,action);
    return produce(state, draft => {
      console.log('produce 에서의 state,draft,action은??:',state,draft,action);
      draft.phone = action.payload.phones;
    });
  },
  [AGREESTATUSCHANGE]: (state, action) => {
    console.log('agreestatuschange 함수 호출 동의값 변경:',state,action);
   return produce(state, draft => {
     console.log('produce 에서의 state,draft,action은??:',state,draft,action);
     draft.agree_status = action.payload.agreeStatuss;
   });
 },
 [PASSWORDCHANGE]: (state, action) => {
    console.log('passwordchange 함수 호출 암호값 변경:',state,action);
   return produce(state, draft => {
     console.log('produce 에서의 state,draft,action은??:',state,draft,action);
     draft.password = action.payload.passwords;
   });
 },
  [USERTYPECHANGE]: (state, action) => {
    console.log('usertype change 함수 호출 암호값 변경:',state,action);
  return produce(state, draft => {
    console.log('produce 에서의 state,draft,action은??:',state,draft,action);
    draft.usertype = action.payload.usertypes;
  });
  },
  [BUSINESSNUMBERCHANGE] : (state,action) => {
    console.log('businessnumber change함수 호출 사업자번호값 변경:',state,action);
    return produce(state,draft => {
      console.log('produce에서의 state,draft,action은??:',state,draft,action);
      draft.businessnumber = action.payload.businessnumbers;
    });
  },
  [BUSINESSNAMECHANGE] : (state,action) => {
    console.log('businessname change함수 호출 사업체명값 변경:',state,action);
    return produce(state,draft => {
      console.log('produce에서의 state,draft,action은??:',state,draft,action);
      draft.businessname = action.payload.businessname;
    });
  },


  [MNGNOCHANGE] : (state,action) => {
    console.log('MNGNOCHANGE change함수 호출 clc사전등록 중개업소 mngno 값 변경:',state,action);
    return produce(state,draft => {
      console.log('produce에서의 state,draft,action은??:',state,draft,action);
      draft.mngno = action.payload.clcmngnos;
    });
  },
  [REGNOCHANGE] : (state,action) => {
    console.log('REGNOCHANGE change함수 호출 clc사전등록 중개업소 mngno 값 변경:',state,action);
    return produce(state,draft => {
      console.log('produce에서의 state,draft,action은??:',state,draft,action);
      draft.regno = action.payload.regno;
    });
  },
  [ADDRRAWCHANGE] : (state,action) => {
    console.log('ADDRRAWCHANGE change함수 호출 clc사전등록 중개업소 mngno 값 변경:',state,action);
    return produce(state,draft => {
      console.log('produce에서의 state,draft,action은??:',state,draft,action);
      draft.addrraw = action.payload.addrraw;
    });
  },
  [ADDRJIBUNCHANGE] : (state,action) => {
    console.log('ADDRJIBUNCHANGE change함수 호출 clc사전등록 중개업소 mngno 값 변경:',state,action);
    return produce(state,draft => {
      console.log('produce에서의 state,draft,action은??:',state,draft,action);
      draft.addrjibun = action.payload.addrjibun;
    });
  },
  [ADDRROADCHANGE] : (state,action) => {
    console.log('ADDRROADCHANGE change함수 호출 clc사전등록 중개업소 mngno 값 변경:',state,action);
    return produce(state,draft => {
      console.log('produce에서의 state,draft,action은??:',state,draft,action);
      draft.addrroad = action.payload.addrroad;
    });
  },
  [XCHANGE] : (state,action) => {
    console.log('XCHANGE change함수 호출 clc사전등록 중개업소 mngno 값 변경:',state,action);
    return produce(state,draft => {
      console.log('produce에서의 state,draft,action은??:',state,draft,action);
      draft.x = action.payload.x;
    });
  },
  [YCHANGE] : (state,action) => {
    console.log('YCHANGE change함수 호출 clc사전등록 중개업소 mngno 값 변경:',state,action);
    return produce(state,draft => {
      console.log('produce에서의 state,draft,action은??:',state,draft,action);
      draft.y = action.payload.y;
    });
  },
  
}, initialState);