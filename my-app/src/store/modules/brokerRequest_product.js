import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const DONGCHANGE = 'brokerRequest_productEdit/dongchange';
const HOSILCHANGE = 'brokerRequest_productEdit/hosilchange';
const FLOORCHANGE = 'brokerRequest_productEdit/floorchange';
const DANGICHANGE= 'brokerRequest_productEdit/dangichange';
const ADDRESSCHANGE= 'brokerRequest_productEdit/addresschange';
const PHONECHANGE= 'brokerRequest_productEdit/phonechange';
const NAMECHANGE= 'brokerRequest_productEdit/namechange';
const MAEMULTYPECHANGE= 'brokerRequest_productEdit/maemultypechange';

const MAEMULNAMECHANGE ='brokerRequest_productEdit/maemulnamechange';
const EXCULSIVEDIMENSIONCHANGE= 'brokerRequest_productEdit/exculsivedimensionchange';
const EXCULSIVEPYEONGCHANGE= 'brokerRequest_productEdit/exculsivepyeongchange';
const SUPPLYDIMENSIONCHANGE= 'brokerRequest_productEdit/supplydimensionchange';
const SUPPLYPYEONGCHANGE= 'brokerRequest_productEdit/supplypyeongchange';
const SELLTYPECHANGE= 'brokerRequest_productEdit/selltypechange';
const SELLPRICECHANGE= 'brokerRequest_productEdit/sellpricechange';
const MONTHSELLPRICECHANGE= 'brokerRequest_productEdit/monthsellpricechange';
const MANAGECOSTCHANGE= 'brokerRequest_productEdit/managecostchange';
const IBJUISINSTANTCHANGE= 'brokerRequest_productEdit/ibjuisinstantchange';
const IBJUSPECIFYDATECHANGE= 'brokerRequest_productEdit/ibjuspecifydatechange';
const EXCULSIVEPERIODSCHANGE= 'brokerRequest_productEdit/exculsiveperiodschange';
const COMPANYIDCHANGE= 'brokerRequest_productEdit/companyidchange';
const REQUESTMEMIDCHANGE= 'brokerRequest_productEdit/requestmemidchange';
const MANAGECOSTINCLUDESCHANGE= 'brokerRequest_productEdit/include_managecostchange';
const ISMANAGEMENTCOSTCHANGE='brokerRequest_productEdit/ismanagementcostchange';
const ISSTOREJOBCHANGE='brokerRequest_productEdit/is_current_biz_jobchange';
const STOREJOBCHANGE='brokerRequest_productEdit/current_biz_jobchange';
const OFFICETELUSETYPECHANGE = 'brokerRequest_productEdit/officetelusetypechange';
const ISRIGHTSPRICECHANGE= 'brokerRequest_productEdit/isrightspricechange';

const PRDIDENTITYIDCHANGE='brokerRequest_productEdit/prdidentityidchange';
const REQUESTMANNAMECHANGE='brokerRequest_productEdit/requestmannamechange';
const REQUESTMEMPHONECHANGE='brokerRequest_productEdit/requestmemphonechange';


//추가정보
const BATHROOMCOUNTCHANGE='brokerRequest_productEdit/bathroomcountchange';
const DIRECTIONCHANGE='brokerRequest_productEdit/directionchange';
const ENTRANCECHANGE='brokerRequest_productEdit/entrancechange';
const HEATFUELTYPECHANGE='brokerRequest_productEdit/heatfueltypechange';
const HEATMETHODTYPECHANGE='brokerRequest_productEdit/heatmethodtypechange';
const ISELEVATORCHANGE='brokerRequest_productEdit/iselevatorchange';
const ISPARKINGCHANGE='brokerRequest_productEdit/isparkingchange';
const ISCONTRACTRENEWALCHANGE='brokerRequest_productEdit/is_contract_renewalchange';
const ISDUPLEXFLOORCHANGE='brokerRequest_productEdit/is_duplex_floorchange';
const ISWITHPETCHANGE='brokerRequest_productEdit/is_petchange';
const LOANPRICECHANGE='brokerRequest_productEdit/loanpricechange';
const MAEMULDESCRIPTIONCHANGE='brokerRequest_productEdit/maemuldescriptionchange';
const MAEMULDESCRIPTIONDETAILCHANGE='brokerRequest_productEdit/maemuldescriptiondetailchange';
const MONTHBASEGUARANTEEPRICECHANGE='brokerRequest_productEdit/monthbaseguaranteepricechange';
const PARKINGOPTIONSCHANGE='brokerRequest_productEdit/parking_optionchange';
const ROOMCOUNTCHANGE='brokerRequest_productEdit/roomcountchange';
const ROOMTYPECHANGE='brokerRequest_productEdit/roomtypechange';
const SECURITYOPTIONCHANGE='brokerRequest_productEdit/security_optionchange';
const SPACEOPTIONCHANGE='brokerRequest_productEdit/space_optionchange';
const PRDIMGSCHANGE= 'brokerRequest_productEdit/prdimgschange';

const ISTOILETCHANGE= 'brokerRequest_productEdit/istoiletchange';
const ISINTERIORCHANGE= 'brokerRequest_productEdit/isinteriorchange';
const RECOMMEND_JOBSTORECHANGE='brokerRequest_productEdit/recommend_jobstorechange';
const OFI_ROOMSTRUCTURECHANGE='brokerRequest_productEdit/room_structurechange';
const STANDARDSPACEOPTIONCHANGE= 'brokerRequest_productEdit/standardspace_optionchange';
const OFFICETELSPACEOPTIONCHANGE='brokerRequest_productEdit/officetelspace_optionchange';
const OFFICETELOPTIONCHANGE='brokerRequest_productEdit/officeteloptionchange';
const STOREOFFICEOPTIONCHANGE='brokerRequest_productEdit/storeofficeoptionchange';


// 액션 생성 함수를 만듭니다.
export const dongchange = createAction(DONGCHANGE);
export const hosilchange = createAction(HOSILCHANGE);
export const floorchange = createAction(FLOORCHANGE);
export const dangichange = createAction(DANGICHANGE);
export const addresschange = createAction(ADDRESSCHANGE);
export const phonechange = createAction(PHONECHANGE);
export const namechange = createAction(NAMECHANGE);
export const maemultypechange = createAction(MAEMULTYPECHANGE);

export const maemulnamechange= createAction(MAEMULNAMECHANGE);
export const exculsivedimensionchange= createAction(EXCULSIVEDIMENSIONCHANGE);
export const exculsivepyeongchange= createAction(EXCULSIVEPYEONGCHANGE);
export const supplydimensionchange= createAction(SUPPLYDIMENSIONCHANGE);
export const supplypyeongchange= createAction(SUPPLYPYEONGCHANGE);
export const selltypechange =createAction(SELLTYPECHANGE);
export const monthsellpricechange= createAction(MONTHSELLPRICECHANGE);
export const sellpricechange= createAction(SELLPRICECHANGE);
export const managecostchange= createAction(MANAGECOSTCHANGE);
export const ibjuisinstantchange= createAction(IBJUISINSTANTCHANGE);
export const ibjuspecifydatechange = createAction(IBJUSPECIFYDATECHANGE);
export const exculsiveperiodschange= createAction(EXCULSIVEPERIODSCHANGE);
export const companyidchange = createAction(COMPANYIDCHANGE);
export const requestmemidchange = createAction(REQUESTMEMIDCHANGE);
export const include_managecostchange= createAction(MANAGECOSTINCLUDESCHANGE);
export const ismanagementcostchange = createAction(ISMANAGEMENTCOSTCHANGE);
export const is_current_biz_jobchange = createAction(ISSTOREJOBCHANGE);
export const current_biz_jobchange = createAction(STOREJOBCHANGE);
export const officetelusetypechange = createAction(OFFICETELUSETYPECHANGE);
export const isrightspricechange = createAction(ISRIGHTSPRICECHANGE);
export const prdidentityidchange = createAction(PRDIDENTITYIDCHANGE);
export const requestmannamechange= createAction(REQUESTMANNAMECHANGE);
export const requestmemphonechange = createAction(REQUESTMEMPHONECHANGE);

export const bathroomcountchange= createAction(BATHROOMCOUNTCHANGE);
export const directionchange= createAction(DIRECTIONCHANGE);
export const entrancechange= createAction(ENTRANCECHANGE);
export const heatfueltypechange= createAction(HEATFUELTYPECHANGE);
export const heatmethodtypechange= createAction(HEATMETHODTYPECHANGE);
export const iselevatorchange= createAction(ISELEVATORCHANGE);
export const isparkingchange= createAction(ISPARKINGCHANGE);
export const is_contract_renewalchange= createAction(ISCONTRACTRENEWALCHANGE);
export const is_duplex_floorchange= createAction(ISDUPLEXFLOORCHANGE);
export const is_petchange= createAction(ISWITHPETCHANGE);
export const loanpricechange= createAction(LOANPRICECHANGE);
export const maemuldescriptionchange= createAction(MAEMULDESCRIPTIONCHANGE);
export const maemuldescriptiondetailchange= createAction(MAEMULDESCRIPTIONDETAILCHANGE);
export const monthbaseguaranteepricechange= createAction(MONTHBASEGUARANTEEPRICECHANGE);
export const parking_optionchange= createAction(PARKINGOPTIONSCHANGE);
export const roomcountchange= createAction(ROOMCOUNTCHANGE);
export const roomtypechange= createAction(ROOMTYPECHANGE);
export const security_optionchange= createAction(SECURITYOPTIONCHANGE);
export const space_optionchange= createAction(SPACEOPTIONCHANGE);
export const prdimgschange = createAction(PRDIMGSCHANGE);

export const istoiletchange= createAction(ISTOILETCHANGE);
export const isinteriorchange= createAction(ISINTERIORCHANGE);
export const recommend_jobstorechange= createAction(RECOMMEND_JOBSTORECHANGE);
export const room_structurechange= createAction(OFI_ROOMSTRUCTURECHANGE);
export const standardspace_optionchange= createAction(STANDARDSPACEOPTIONCHANGE);
export const officetelspace_optionchange = createAction(OFFICETELSPACEOPTIONCHANGE);
export const officeteloptionchange= createAction(OFFICETELOPTIONCHANGE);
export const storeofficeoptionchange= createAction(STOREOFFICEOPTIONCHANGE);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
   dong : '',
   hosil: '',
   floor: '',
   dangi: '',
   address: '',
   name: '',
   phone: '',
   maemultype: '',

   maemulname: '',
   exculsivedimension: '',
   exculsivepyeong:'',
   supplydimension:'',
   supplypyeong:'',
   selltype:'',
   monthsellprice:'',
   sellprice:'',
   managecost:'',
   is_immediate_ibju:'',
   ibju_specifydate:'',
   exclusive_periods:'',
   companyid : '',
   requestmemid: '',
   include_managecost:'',
   ismanagementcost :'',
   is_current_biz_job:'',
   current_biz_job:'',
   officetelusetype:'',

   prdidentityid : '',
   requestmanname : '',
   requestmemphone: '',
   is_rightsprice:'',

   apartspace: '',
   bathroomcount:'',
   direction: '',
   entrance:'',
   heatfueltype:'',
   heatmethodtype:'',
   iselevator:'',
   isparking:'',
   is_contract_renewal:'',
   is_duplex_floor:'',
   is_pet:'',
   loanprice:'',
   maemuldescription:'',
   maemuldescriptiondetail:'',
   monthbaseguaranteeprice:'',
   parking_option:'',
   roomcount:'',
   roomtype:'',
   security_option:'',
   spaceaddonoption:'',
   space_option:'',
   prdimgs: '',

   istoilet:'',
   isinterior:'',
   recommend_jobstore:'',
   room_structure:'',
   standardspace_option:'',
   officetelspace_option:'',
   officeteloption:'',
   storeofficeoption:''
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
  [DANGICHANGE]: (state, action) => {
    console.log('dangichange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.dangi = action.payload.dangis;
   });
 },
 [ADDRESSCHANGE]: (state, action) => {
    console.log('dangiaddresschange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.address = action.payload.addresss;
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
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.maemulname = action.payload.maemulnames;
   });
 },
 [EXCULSIVEDIMENSIONCHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.exculsivedimension = action.payload.exculsivedimensions;
   });
 },
 [EXCULSIVEPYEONGCHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.exculsivepyeong = action.payload.exculsivepyeongs;
   });
 },
 [SUPPLYDIMENSIONCHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.supplydimension = action.payload.supplydimensions;
   });
 },
 [SUPPLYPYEONGCHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.supplypyeong = action.payload.supplypyeongs;
   });
 },
 [SELLTYPECHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.selltype = action.payload.selltypes;
   });
 },
 [SELLPRICECHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.sellprice = action.payload.sellprices;
   });
 },
 [MONTHSELLPRICECHANGE] : (state,action) => {
   console.log('monthsellpricechange함수호출::',state,action);
   return produce(state,draft => {
     draft.monthsellprice=action.payload.monthsellprice;
   });
 },
 [MANAGECOSTCHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.managecost = action.payload.managecosts;
   });
 },
 [ISMANAGEMENTCOSTCHANGE] : (state,action) => {
   console.log('ismangemnetcostchange함수호출:',state,action);
   return produce(state,draft => {
     draft.ismanagementcost = action.payload.ismanagementcost;
   })
 },
 [ISSTOREJOBCHANGE] : (state,action) => {
   console.log('is_current_biz_jobchange함수호출::',state,action);
   return produce(state,draft => {
     draft.is_current_biz_job = action.payload.is_current_biz_job;
   })
 },
 [STOREJOBCHANGE] : (state,action) => {
   console.log('current_biz_jobchange함수호출::',state,action);
   return produce(state,draft => {
     draft.current_biz_job = action.payload.current_biz_job;
   })
 },
 [ISRIGHTSPRICECHANGE] : (state,action) => {
   return produce(state,draft => {
     draft.is_rightsprice = action.payload.is_rightsprice;
   })
 },

 [IBJUISINSTANTCHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.is_immediate_ibju = action.payload.is_immediate_ibjus;
   });
 },
 [IBJUSPECIFYDATECHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.ibju_specifydate = action.payload.ibju_specifydates;
   });
 },
 [EXCULSIVEPERIODSCHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.exclusive_periods = action.payload.exclusive_periodss;
   });
 },
 [COMPANYIDCHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.companyid = action.payload.companyids;
   });
 },
 [REQUESTMEMIDCHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.requestmemid = action.payload.requestmemids;
   });
 },
 [PRDIDENTITYIDCHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.prdidentityid = action.payload.prd_identity_ids;
   });
 },
 [REQUESTMANNAMECHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.requestmanname = action.payload.requestmannames;
   });
 },
 [REQUESTMEMPHONECHANGE]: (state, action) => {
    console.log('maemultypechange 함수 호출 :',state,action);
   return produce(state, draft => {
     draft.requestmemphone = action.payload.requestmemphones;
   });
 },
 

[BATHROOMCOUNTCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.bathroomcount = action.payload.bathroomcounts;
 });
},
[DIRECTIONCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.direction = action.payload.directions;
 });
},
[ENTRANCECHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.entrance = action.payload.entrances;
 });
},
[HEATFUELTYPECHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.heatfueltype = action.payload.heatfueltypes;
 });
},
[HEATMETHODTYPECHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.heatmethodtype = action.payload.heatmethodtypes;
 });
},
[ISELEVATORCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.iselevator = action.payload.iselevators;
 });
},
[ISPARKINGCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.isparking = action.payload.isparkings;
 });
},
[ISCONTRACTRENEWALCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.is_contract_renewal = action.payload.is_contract_renewals;
 });
},
[ISDUPLEXFLOORCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.is_duplex_floor = action.payload.is_duplex_floors;
 });
},
[ISWITHPETCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.is_pet = action.payload.is_pets;
 });
},
[LOANPRICECHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.loanprice = action.payload.loanprices;
 });
},
[MAEMULDESCRIPTIONCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.maemuldescription = action.payload.maemuldescriptions;
 });
},
[MAEMULDESCRIPTIONDETAILCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.maemuldescriptiondetail = action.payload.maemuldescriptiondetails;
 });
},
[MONTHBASEGUARANTEEPRICECHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.monthbaseguaranteeprice = action.payload.monthbaseguranteeprices;
 });
},
[PARKINGOPTIONSCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.parking_option = action.payload.parking_option;
 });
},
[ROOMCOUNTCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.roomcount = action.payload.roomcounts;
 });
},
[ROOMTYPECHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.roomtype = action.payload.roomtypes;
 });
},
[SECURITYOPTIONCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.security_option = action.payload.security_options;
 });
},

[SPACEOPTIONCHANGE]: (state, action) => {
  console.log('maemultypechange 함수 호출 :',state,action);
 return produce(state, draft => {
   draft.space_option = action.payload.space_options;
 });
},
[MANAGECOSTINCLUDESCHANGE] : (state,action) => {
  console.log('manageclosntcinlduechange함수호출:',state,action);
  return produce(state,draft => {
    draft.include_managecost = action.payload.include_managecost;
  });
},
[PRDIMGSCHANGE] : (state,action) => {
  console.log('prdimgschange함수 호출::',state,action);
  return produce(state,draft => {
    draft.prdimgs = action.payload.prdimgs;
  });
},
[OFFICETELUSETYPECHANGE] : (state,action) => {
  console.log('OFFICETELUSETYPECHANGE::',state,action);
  return produce(state,draft => {
    draft.officetelusetype = action.payload.officetelusetype;
  });
},

[ISTOILETCHANGE] : (state,action) => {
  return produce(state,draft => {
    draft.istoilet = action.payload.istoilet;
  });
},
[ISINTERIORCHANGE] : (state,action) => {
  return produce(state,draft => {
    draft.isinterior = action.payload.isinterior;
  });
},
[RECOMMEND_JOBSTORECHANGE] : (state,action) => {
  return produce(state,draft => {
    draft.recommend_jobstore = action.payload.recommend_jobstore;
  });
},
[OFI_ROOMSTRUCTURECHANGE] : (state,action) => {
  return produce(state,draft => {
    draft.room_structure = action.payload.room_structure;
  });
},
[STANDARDSPACEOPTIONCHANGE] : (state,action) => {
  return produce(state,draft => {
    draft.standardspace_option = action.payload.standardspace_option;
  });
},
[OFFICETELSPACEOPTIONCHANGE] : (state,action) => {
  return produce(state,draft => {
    draft.officetelspace_option = action.payload.officetelspace_option;
  });
},
[OFFICETELOPTIONCHANGE] : (state,action) => {
  return produce(state,draft => {
    draft.officeteloption = action.payload.officeteloption;
  });
},
[STOREOFFICEOPTIONCHANGE] : (state,action) => {
  return produce(state,draft => {
    draft.storeofficeoption = action.payload.storeofficeoption;
  });
},

}, initialState);