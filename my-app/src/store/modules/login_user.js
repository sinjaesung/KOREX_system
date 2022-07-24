import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const MEMIDCHANGE = 'login_user/memidchange';
const COMPANYIDCHANGE= 'login_user/companyidchange';
const USER_USERNAMECHANGE = 'login_user/user_usernamechange';
const PHONECHANGE = 'login_user/phonechange';
const EMAILCHANGE = 'login_user/emailchange';
const USERNAMECHANGE = 'login_user/usernamechange';
const MEMIMGCHANGE= 'login_user/memimgchange';
const USERTYPECHANGE= 'login_user/usertypechange';
const REGISTERTYPECHANGE  = 'login_user/registertypechange';
const MEMADMINCHANGE= 'login_user/memadminchange';
const ISLOGINCHANGE= 'login_user/isloginchange';
const ISPROCHANGE= 'login_user/isprochange';
const MEMNOTIFICATIONCHANGE = 'login_user/memnotificationchange';
const COMPANYNAMECHANGE ='login_user/companynamechange';
const MEMPROFILECHANGE= 'login_user/memprofilechange';

// 액션 생성 함수를 만듭니다.
export const memidchange = createAction(MEMIDCHANGE);
export const companyidchange = createAction(COMPANYIDCHANGE)
export const user_usernamechange = createAction(USER_USERNAMECHANGE);
export const phonechange = createAction(PHONECHANGE);
export const emailchange= createAction(EMAILCHANGE);
export const usernamechange = createAction(USERNAMECHANGE);
export const memimgchange = createAction(MEMIMGCHANGE);
export const usertypechange = createAction(USERTYPECHANGE);
export const registertypechange= createAction(REGISTERTYPECHANGE);
export const memadminchange= createAction(MEMADMINCHANGE);
export const isloginchange= createAction(ISLOGINCHANGE);
export const isprochange = createAction(ISPROCHANGE);
export const memnotificationchange = createAction(MEMNOTIFICATIONCHANGE);
export const companynamechange = createAction(COMPANYNAMECHANGE);
export const memprofilechange= createAction(MEMPROFILECHANGE);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
   memid : '',
   company_id : '',
   user_username : '',
   phone: '',
   email : '',
   user_name : '',
   mem_img : '',
   user_type : '',
   register_type : '',
   mem_admin : '',
   mem_notification : '',
   is_login : '',
   ispro: '',
   company_name : '',
   memprofile :''
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  
  [MEMIDCHANGE]: (state, action) => {
    //console.log('login memidchange 호출 이메일변경',state,action);
    return produce(state, draft => {
      draft.memid = action.payload.memids;
    });
  },
  [COMPANYIDCHANGE] : (state,action) => {
    //console.log('login companyid change호출 회사아이디값조회지정:',state,action);
    return produce(state, draft =>{
      draft.company_id = action.payload.companyids;
    });
  },
  // { } 를 따로 열지 않고 바로 리턴하면 이런 형식입니다.
  [USER_USERNAMECHANGE]: (state, action) =>{
    //console.log('login user_username change 함수 호출 이름값 변경:',state,action);
    return produce(state, draft => {
      draft.user_username = action.payload.user_usernames;
    });
  },
  [PHONECHANGE]: (state, action) => {
    // console.log('login phonechange 함수 호출 폰값 변경:',state,action);
    return produce(state, draft => {
      console.log('produce 에서의 state,draft,action은??:',state,draft,action);
      draft.phone = action.payload.phones;
    });
  },
  [EMAILCHANGE]: (state, action) => {
    //console.log('login emailchange 함수 호출 동의값 변경:',state,action);
   return produce(state, draft => {
     console.log('produce 에서의 state,draft,action은??:',state,draft,action);
     draft.email = action.payload.emails;
   });
 },
 [USERNAMECHANGE]: (state, action) => {
   // console.log('login usernamechange 함수 호출 암호값 변경:',state,action);
   return produce(state, draft => {
     console.log('produce 에서의 state,draft,action은??:',state,draft,action);
     draft.user_name = action.payload.usernames;
   });
 },
 [MEMIMGCHANGE] : (state,action) => {
  // console.log('login memimgchange함수 호출 프로필이미지값변경:',state,action);
   return produce(state, draft => {
     console.log('produce 에서의 state,draft,action은?:',state,draft,action);
     draft.mem_img = action.payload.memimgs;
   })
 },
 [USERTYPECHANGE] : (state,action) => {
  // console.log('login usertypechange함수 호출 유저타입변경:',state,action);
   return produce(state, draft => {
     console.log('produce에서의 state,draft,action은?:',state,draft,action);
     draft.user_type = action.payload.usertypes;
   });
 },
  [REGISTERTYPECHANGE]: (state, action) => {
   // console.log('login registertypechange 함수 호출 암호값 변경:',state,action);
  return produce(state, draft => {
    console.log('produce 에서의 state,draft,action은??:',state,draft,action);
    draft.register_type = action.payload.registertypes;
  });
  },
  [MEMADMINCHANGE] : (state,action) => {
   // console.log('login memadimin change함수 호출 사업자번호값 변경:',state,action);
    return produce(state,draft => {
      console.log('produce에서의 state,draft,action은??:',state,draft,action);
      draft.mem_admin = action.payload.memadmins;
    });
  },
  [ISLOGINCHANGE] : (state,action) => {
    //console.log('login islogin로그인여부chnage함수 호출 변경:',state,action);
    return produce(state, draft => {
      console.log('produce에서의 state,dracft,action::',state,draft,action);
      draft.is_login = action.payload.islogins;
    })
  },
  [ISPROCHANGE] : (state,action) => {
    //console.log('login isprochnage함수 호출 변경:',state,action);
    return produce(state, draft => {
      console.log('produce에서의 state,dracft,action::',state,draft,action);
      draft.ispro = action.payload.ispros;
    })
  },
  [MEMNOTIFICATIONCHANGE] : (state,action) => {
   // console.log('login notificaton chagne함수 호출변경:',state,action);
    return produce(state, draft => {
      console.log('producde에서의 state,draft,action::',state,draft,action);
      draft.mem_notification = action.payload.mem_notification;
    })
  },
  [COMPANYNAMECHANGE] : (state,action) => {
    //console.log('companyname change 함수 호출변경:',state,action);
    return produce(state,draft => {
      console.log('procude에서의 state,drfaft,action::',state,draft,action);
      draft.company_name  = action.payload.company_name;
    })
  },
  [MEMPROFILECHANGE] : (state,action) => {
   // console.log('MEMPROFILECHANGE change 함수 호출변경:',state,action);
    return produce(state,draft => {
      console.log('procude에서의 state,drfaft,action::',state,draft,action);
      draft.memprofile  = action.payload.memprofile;
    })
  },
}, initialState);