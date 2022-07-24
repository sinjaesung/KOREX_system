import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const NORMAL_SELECT_DAYSCHANGE = 'temp_tourReservNormalsetting/normal_select_dayschange';
const NORMAL_SELECT_TIMESCHANGE = 'temp_tourReservNormalsetting/normal_select_timeschange';
const NORMAL_SELECT_DAYCOUNTCHANGE = 'temp_tourReservNormalsetting/normal_select_daycountchange';
const NORMAL_ISHOLIDAYEXCEPTCHANGE = 'temp_tourReservNormalsetting/normal_isholidayexceptchange';
const SPECIAL_SPECIFYDATECHANGE= 'temp_tourReservspecialsetting/special_specifydatechange';
const SPECIAL_SPECIFYDATETIMESCHANGE= 'temp_tourReservspecialsetting/special_specifydatetimeschange';
const SPECIAL_ISEXCEPTSPECIFYDATECHANGE= 'temp_tourReservspecialsetting/special_isexceptspecifydatechange';

// 액션 생성 함수를 만듭니다.
export const normal_select_dayschange = createAction(NORMAL_SELECT_DAYSCHANGE);
export const normal_select_timeschange = createAction(NORMAL_SELECT_TIMESCHANGE);
export const normal_select_daycountchange = createAction(NORMAL_SELECT_DAYCOUNTCHANGE);
export const normal_isholidayexceptchange= createAction(NORMAL_ISHOLIDAYEXCEPTCHANGE);
export const special_specifydatechange= createAction(SPECIAL_SPECIFYDATECHANGE);
export const special_specifydatetimeschange = createAction(SPECIAL_SPECIFYDATETIMESCHANGE);
export const special_isexceptspecifydatechange = createAction(SPECIAL_ISEXCEPTSPECIFYDATECHANGE);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
   normal_select_days : '',
   normal_select_times: '',
   normal_select_daycount: '',
   normal_isholidayexcept: '',

   special_specifydate :'',
   special_specifydatetimes:'',
   special_isexceptspecifydate : ''
   
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  
  [NORMAL_SELECT_DAYSCHANGE]: (state, action) => {
    console.log('normal_select_daychange 함수 호출 이메일변경',state,action);
    return produce(state, draft => {
      draft.normal_select_days = action.payload.normal_select_dayss;
    });
  },
  // { } 를 따로 열지 않고 바로 리턴하면 이런 형식입니다.
  [NORMAL_SELECT_TIMESCHANGE]: (state, action) =>{
    console.log('normal_select_timechange 함수 호출 이름값 변경:',state,action);
    return produce(state, draft => {
      draft.normal_select_times = action.payload.normal_select_timess;
    });
  },
  [NORMAL_SELECT_DAYCOUNTCHANGE]: (state, action) => {
     console.log('normal_select_daycountchange 함수 호출 폰값 변경:',state,action);
    return produce(state, draft => {
      console.log('produce 에서의 state,draft,action은??:',state,draft,action);
      draft.normal_select_daycount = action.payload.normal_select_daycounts;
    });
  },
  [NORMAL_ISHOLIDAYEXCEPTCHANGE]: (state, action) => {
    console.log('normal_isholidayexcpetionchange 함수 호출 폰값 변경:',state,action);
    return produce(state, draft => {
      console.log('produce 에서의 state,draft,action은??:',state,draft,action);
      draft.normal_isholidayexcept = action.payload.normal_isholidayexcepts;
    });
  },
  [SPECIAL_SPECIFYDATECHANGE]: (state, action) => {
    console.log('special_specifydatechange 함수 호출 폰값 변경:',state,action);
    return produce(state, draft => {
      console.log('produce 에서의 state,draft,action은??:',state,draft,action);
      draft.special_specifydate = action.payload.specifydates;
    });
  },
  [SPECIAL_SPECIFYDATETIMESCHANGE]: (state, action) => {
    console.log('special_specfiydatetimeschange 함수 호출 폰값 변경:',state,action);
    return produce(state, draft => {
      console.log('produce 에서의 state,draft,action은??:',state,draft,action);
      draft.special_specifydatetimes = action.payload.specifydatetimess;
    });
  },
  [SPECIAL_ISEXCEPTSPECIFYDATECHANGE]: (state, action) => {
    console.log('special_isexceptspecifytdatechange 함수 호출 폰값 변경:',state,action);
    return produce(state, draft => {
      console.log('produce 에서의 state,draft,action은??:',state,draft,action);
      draft.special_isexceptspecifydate = action.payload.isexceptspecifydates;
    });
  },

 
}, initialState);