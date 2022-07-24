import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다. 전속매물(클러스터,마커)클릭시에 사이드바보다 위에 창을 띄울지 안띄울지 여부(열고,닫고 여부만)
const UPDATE_OPENSTATUS = 'dangiSidebarmodal/openstatus';
const UPDATE_SIDEBARTYPE = 'dangiSidebarmodal/sidebartype';//어떤 사이드바 타입을 마지막으로 택한건지, 매물,전문중개사,단지 클러스터 클릭시마다 띄워지는 모달은 달라지면 매번 갱신

// 액션 생성 함수를 만듭니다.
export const updateOpenstatus = createAction(UPDATE_OPENSTATUS);
export const updateSidebartype= createAction(UPDATE_SIDEBARTYPE);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
    openstatus  : 0, //단지,전속매물,전문중개사 사이드바창을 열고닫을수있게끔.. 각 창을 닫을수있게끔!!!각 창 dangisidebarmodal,exuclsivesidebarmodal,probkersidebarmodal창이 닫힐수있게끔..
    sidebartype : 0 //probroker,dangi,product
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  [UPDATE_OPENSTATUS]: (state, action) => {
    console.log('UPDATE UPDATE_OPENSTATUS',action);
    return produce(state, draft => {
        draft.openstatus = action.payload.openstatus;
    });
  },
  [UPDATE_SIDEBARTYPE] : (state,action) => {
    return produce(state,draft => {
        draft.sidebartype = action.payload.sidebartype;
    })
  }
}, initialState);