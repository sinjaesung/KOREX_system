import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션 타입을 정의해줍니다.
const UPDATEBUNYANGTEAM = 'bunyangTeam/UPDATEBUNYANGTEAM';
const UPDATEBUNYANGTEAMCOUNT = 'bunyangTeam/UPDATEBUNYANGTEAMCOUNT';

// 액션 생성 함수를 만듭니다.
export const updateBunyangTeam = createAction(UPDATEBUNYANGTEAM);
export const updateBunyangTeamCount = createAction(UPDATEBUNYANGTEAMCOUNT);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
   bunyangTeam : {},
   liveCount : 0,
   visitCount : 0,
};

// immer 를 사용하여 값을 수정하는 리듀서입니다.
export default handleActions({
  [UPDATEBUNYANGTEAM]: (state, action) => {
    return produce(state, draft => {
      draft.bunyangTeam = action.payload.bunyangTeam;
    });
  },
  [UPDATEBUNYANGTEAMCOUNT]: (state, action) => {
    return produce(state, draft => {
      draft.liveCount = action.payload.liveCount;
      draft.visitCount = action.payload.visitCount;
    });
  }
}, initialState);