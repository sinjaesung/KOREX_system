import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const DONGCHANGE = 'temp_brokerRequest/dongchange';
const HOSILCHANGE = 'temp_brokerRequest/hosilchange';
const FLOORCHANGE = 'temp_brokerRequest/floorchange';
const DONGNAMECHANGE = 'temp_brokerRequest/dong_namechange';
const HOSILNAMECHANGE= 'temp_brokerRequest/ho_namechange';
const FLOORNAMECHANGE= 'temp_brokerRequest/floornamechange';
const STOREOFFICEBUILDINGFLOORCHANGE ='temp_brokerRequest/storeofficebuildingfloorchange';

const DANGICHANGE= 'temp_brokerRequest/dangichange';
const DANGIJIBUNADDRESSCHANGE= 'temp_brokerRequest/dangijibunaddresschange';
const DANGIROADADDRESSCHANGE= 'temp_brokerRequest/dangiroadaddresschange';
const JIBUNSIMPLECHANGE = 'temp_brokerRequest/jibunsimplechange';

const XCHANGE= 'temp_brokerRequest/xchange';//특정한 선택 단지(단지에 속한 모든 매물들 동(bld_id),층(flr_id),호(ho_id)들은 모두 같은 단지의 경도,위도값 공유한다.
const YCHANGE= 'temp_brokerRequest/ychange';

const PHONECHANGE= 'temp_brokerRequest/phonechange';
const NAMECHANGE= 'temp_brokerRequest/namechange';
const MAEMULTYPECHANGE= 'temp_brokerRequest/maemultypechange';

const MAEMULNAMECHANGE ='temp_brokerRequest/maemulnamechange';
const JEONYONGDIMENSIONCHANGE= 'temp_brokerRequest/jeonyongdimensionchange';
const JEONYONGPYEONGCHANGE= 'temp_brokerRequest/jeonyongpyeongchange';
const SUPPLYDIMENSIONCHANGE= 'temp_brokerRequest/supplydimensionchange';
const SUPPLYPYEONGCHANGE= 'temp_brokerRequest/supplypyeongchange';
const SELLTYPECHANGE= 'temp_brokerRequest/selltypechange';
const SELLPRICECHANGE= 'temp_brokerRequest/sellpricechange';
const MONTHSELLPRICECHANGE='temp_brokerRequest/monthsellpricechange';

const MANAGECOSTCHANGE= 'temp_brokerRequest/managecostchange';
const IBJUISINSTANTCHANGE= 'temp_brokerRequest/ibjuisinstantchange';
const IBJUSPECIFYDATECHANGE= 'temp_brokerRequest/ibjuspecifydatechange';
const EXCLUSIVEPERIODSCHANGE= 'temp_brokerRequest/exclusiveperiodschange';
const COMPANYIDCHANGE= 'temp_brokerRequest/companyidchange';
const REQUESTMEMIDCHANGE= 'temp_brokerRequest/requestmemidchange';
const MANAGECOSTINCLUDESCHANGE= 'temp_brokerRequest/include_managecostchange';

const ISSTOREJOBCHANGE= 'temp_brokerRequest/is_current_biz_jobchange';
const STOREJOBCHANGE= 'temp_brokerRequest/current_biz_jobchange';
const ISRIGHTPRICECHANGE= 'temp_brokerRequest/isrightpricechange';
const ISMANAGEMENTCOSTCHANGE ='temp_brokerRequest/ismanagementcostchange';
const OFFICETELUSETYPECHANGE= 'temp_brokerRequest/officetelusetypechange';


const REQUESTTYPECHANGE = 'temp_brokerRequest/requesttypechange';

// 액션 생성 함수를 만듭니다.
export const dongchange = createAction(DONGCHANGE);
export const hosilchange = createAction(HOSILCHANGE);
export const floorchange = createAction(FLOORCHANGE);
export const dong_namechange= createAction(DONGNAMECHANGE);
export const ho_namechange= createAction(HOSILNAMECHANGE);
export const floornamechange= createAction(FLOORNAMECHANGE);
export const storeofficebuildingfloorchange = createAction(STOREOFFICEBUILDINGFLOORCHANGE);

export const dangichange = createAction(DANGICHANGE);
export const dangijibunaddresschange = createAction(DANGIJIBUNADDRESSCHANGE);
export const dangiroadaddresschange = createAction(DANGIROADADDRESSCHANGE);
export const jibunsimplechange = createAction(JIBUNSIMPLECHANGE);

export const xchange= createAction(XCHANGE);
export const ychange= createAction(YCHANGE);
export const phonechange = createAction(PHONECHANGE);
export const namechange = createAction(NAMECHANGE);
export const maemultypechange = createAction(MAEMULTYPECHANGE);

export const maemulnamechange= createAction(MAEMULNAMECHANGE);
export const jeonyongdimensionchange= createAction(JEONYONGDIMENSIONCHANGE);
export const jeonyongpyeongchange= createAction(JEONYONGPYEONGCHANGE);
export const supplydimensionchange= createAction(SUPPLYDIMENSIONCHANGE);
export const supplypyeongchange= createAction(SUPPLYPYEONGCHANGE);
export const selltypechange =createAction(SELLTYPECHANGE);
export const sellpricechange= createAction(SELLPRICECHANGE);
export const monthsellpricechange= createAction(MONTHSELLPRICECHANGE);

export const managecostchange= createAction(MANAGECOSTCHANGE);
export const ibjuisinstantchange= createAction(IBJUISINSTANTCHANGE);
export const ibjuspecifydatechange = createAction(IBJUSPECIFYDATECHANGE);
export const exclusiveperiodschange= createAction(EXCLUSIVEPERIODSCHANGE);
export const companyidchange = createAction(COMPANYIDCHANGE);
export const requestmemidchange = createAction(REQUESTMEMIDCHANGE);
export const include_managecostchange= createAction(MANAGECOSTINCLUDESCHANGE);

export const is_current_biz_jobchange= createAction(ISSTOREJOBCHANGE);
export const current_biz_jobchange = createAction(STOREJOBCHANGE);
export const ismanagementcostchange = createAction(ISMANAGEMENTCOSTCHANGE);
export const officetelusetypechange = createAction(OFFICETELUSETYPECHANGE);

export const isrightpricechange = createAction(ISRIGHTPRICECHANGE);



export const requesttypechange = createAction(REQUESTTYPECHANGE);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
   dong : '',
   hosil: '',
   floor: '',
   dong_name:'',
   ho_name:'',
   floorname:'',
   storeofficebuildingfloor:'',

   dangi: '',
   dangijibunaddress: '',
   dangiroadaddress:'',
   jibunsimple : '',
   x:'',
   y:'',
   name: '',
   phone: '',
   maemultype: '',
  
   maemulname: '',
   jeonyongdimension: '',
   jeonyongpyeong:'',
   supplydimension:'',
   supplypyeong:'',
   selltype:'',
   sellprice:'',
   monthsellprice:'',
   managecost:'',
   is_immediate_ibju:'',
   ibju_specifydate:'',
   exclusive_periods:'',
   companyid : '',
   requestmemid: '',
   include_managecost : '',

   is_current_biz_job:'',
   current_biz_job:'',
   ismanagementcost:'',
   officetelusetype:'',
   isrightprice:'',

   request_tpye : '',
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  
  [DONGCHANGE]: (state, action) => {
    console.log('dongchange함수 호출',state,action);
    return produce(state, draft => {
      draft.dong = action.payload.dongs;
    });
  },
  // { } 를 따로 열지 않고 바로 리턴하면 이런 형식입니다.
  [HOSILCHANGE]: (state, action) =>{
    console.log('hosilchange 함수 호출:',state,action);
    return produce(state, draft => {
      draft.hosil = action.payload.hosils;
    });
  },
  [FLOORCHANGE]: (state, action) => {
     console.log('floorchange 함수 호출 :',state,action);
    return produce(state, draft => {
      draft.floor = action.payload.floors;
    });
  },
  [DONGNAMECHANGE]: (state, action) => {
    console.log('DONGNAMECHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.dong_name = action.payload.dong_names;
   });
 },
 [HOSILNAMECHANGE]: (state, action) => {
  console.log('HOSILNAMECHANGE 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.ho_name = action.payload.ho_names;
 });
},
[FLOORNAMECHANGE]: (state, action) => {
  console.log('FLOORNAMECHANGE 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.floorname = action.payload.floornames;
 });
},
[STOREOFFICEBUILDINGFLOORCHANGE] : (state,action) => {
  console.log('storeofficebuildingflorochange 함수호출::',state,action);
  return produce(state, draft => {
    draft.storeofficebuildingfloor = action.payload.storeofficebuildingfloor;
  });
},
  [DANGICHANGE]: (state, action) => {
    console.log('dangichange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.dangi = action.payload.dangis;
   });
 },
 [DANGIJIBUNADDRESSCHANGE]: (state, action) => {
    console.log('DANGIJIBUNADDRESSCHANGE 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.dangijibunaddress = action.payload.dangijibunaddress;
   });
 },
 [DANGIROADADDRESSCHANGE]: (state, action) => {
  console.log('dangiaddress & address change 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.dangiroadaddress = action.payload.dangiroadaddress;
 });
},
[JIBUNSIMPLECHANGE] : (state,action) => {
  console.log('jibunsimep; change함수호출::',state,action);
  return produce(state, draft => {
    draft.jibunsimple = action.payload.jibunsimple;
  });
},
 [XCHANGE] : (state,action) => {
   console.log('dangi x pos change함수호출:',state,action);
   return produce(state,draft => {
     draft.x= action.payload.x_pos;
   });
 },
 [YCHANGE] : (state,action) => {
   console.log('dangi y pos change함수 호출:',state,action);
   return produce(state,draft => {
     draft.y= action.payload.y_pos;
   });
 },
 [PHONECHANGE]: (state, action) => {
    console.log('phonechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.phone = action.payload.phones;
   });
 },
 [NAMECHANGE]: (state, action) => {
    console.log('namechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.name = action.payload.names;
   });
 },
 [MAEMULTYPECHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.maemultype = action.payload.maemultypes;
   });
 },

 [MAEMULNAMECHANGE]: (state, action) => {
    console.log('maemulnamechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.maemulname = action.payload.maemulnames;
   });
 },
 [JEONYONGDIMENSIONCHANGE]: (state, action) => {
    console.log('jeonyongdimensioncahnge 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.jeonyongdimension = action.payload.jeonyongdimensions;
   });
 },
 [JEONYONGPYEONGCHANGE]: (state, action) => {
    console.log('jeonyongpyeongchange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.jeonyongpyeong = action.payload.jeonyongpyeongs;
   });
 },
 [SUPPLYDIMENSIONCHANGE]: (state, action) => {
    console.log('supplydimesnionchange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.supplydimension = action.payload.supplydimensions;
   });
 },
 [SUPPLYPYEONGCHANGE]: (state, action) => {
    console.log('suppylpyeongchange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.supplypyeong = action.payload.supplypyeongs;
   });
 },
 [SELLTYPECHANGE]: (state, action) => {
    console.log('selltypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.selltype = action.payload.selltypes;
   });
 },
 [SELLPRICECHANGE]: (state, action) => {
    console.log('sellrpciehcnage 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.sellprice = action.payload.sellprices;
   });
 },
 [MONTHSELLPRICECHANGE] : (state,action) => {
   console.log('monthsellprciechange 함수호출::',state,action);
   return produce(state,draft => {
     draft.monthsellprice= action.payload.monthsellprice;
   });
 },
 [MANAGECOSTCHANGE]: (state, action) => {
    console.log('managecostchange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.managecost = action.payload.managecosts;
   });
 },
 [IBJUISINSTANTCHANGE]: (state, action) => {
    console.log('ibjuisinstatnchange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.is_immediate_ibju = action.payload.is_immediate_ibjus;
   });
 },
 [IBJUSPECIFYDATECHANGE]: (state, action) => {
    console.log('ibjuspecifydatechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.ibju_specifydate = action.payload.ibju_specifydates;
   });
 },
 [EXCLUSIVEPERIODSCHANGE]: (state, action) => {
    console.log('exculsiveperidoschange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.exclusive_periods = action.payload.exclusive_periodss;
   });
 },
 [COMPANYIDCHANGE]: (state, action) => {
    console.log('companyidchange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.companyid = action.payload.companyids;
   });
 },
 [REQUESTMEMIDCHANGE]: (state, action) => {
    console.log('requestmemdichange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.requestmemid = action.payload.requestmemids;
   });
 },
 [MANAGECOSTINCLUDESCHANGE]: (state, action) => {
  console.log('managecostincluedschange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.include_managecost = action.payload.include_managecosts;
 });
},
[ISSTOREJOBCHANGE] :(state,action) => {
  console.log('is_current_biz_job hcange함수 호출::',state,action);
  return produce(state,draft => {
    draft.is_current_biz_job = action.payload.is_current_biz_job;
  });
},
[STOREJOBCHANGE] : (state,action) => {
  console.log('current_biz_job change함수호출::',state,action);
  return produce(state,draft => {
    draft.current_biz_job = action.payload.current_biz_job;
  });
},
[ISMANAGEMENTCOSTCHANGE] : (state,action) => {
  console.log('ismangementcost change 함숳호ㅓ출:',state,action);
  return produce(state,draft => {
    draft.ismanagementcost = action.payload.ismanagementcost;
  });
},
[ISRIGHTPRICECHANGE] : (state,action) => {
  return produce(state,draft => {
    draft.isrightprice = action.payload.isrightprice;
  });
},
[OFFICETELUSETYPECHANGE] : (state,action) => {
  console.log('officelteuse type chagne함수호출::',state,action);
  return produce(state,draft => {
    draft.officetelusetype = action.payload.officetelusetype;
  });
},
  [REQUESTTYPECHANGE]: (state, action) => {
    return produce(state, draft => {
      draft.request_type = action.payload.request_type;
  });
}
}, initialState);

