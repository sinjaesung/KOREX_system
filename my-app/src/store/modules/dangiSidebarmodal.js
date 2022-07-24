import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다. 전속매물(클러스터,마커)클릭시에 사이드바보다 위에 창을 띄울지 안띄울지 여부(열고,닫고 여부만)
const UPDATE_OPENSTATUS = 'dangiSidebarmodal/openstatus';
const UPDATEBLOCK= 'dangiSidebarmodal/updateblock';//클릭한 마커,클러스터 지역상에 관련된 매칭 리스트저장하는 리덕스.

// 액션 생성 함수를 만듭니다.
export const updateOpenstatus = createAction(UPDATE_OPENSTATUS);
export const updateBlock = createAction(UPDATEBLOCK);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
    openstatus  : 0, //단지 리스트 사이드바 열고닫힌상태여부 컨트롤(기본값 0:닫힘)
    block : []
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  [UPDATE_OPENSTATUS]: (state, action) => {
    console.log('UPDATE UPDATE_OPENSTATUS',action);
    return produce(state, draft => {
        draft.openstatus = action.payload.openstatus;
    });
  },
  [UPDATEBLOCK]: (state, action) => {
    console.log('UPDATE UPDATEBLOCK>>>:',action);
    return produce(state, draft => {
        draft.block = action.payload.block ? action.payload.block : draft.block;
    });
  },
}, initialState);