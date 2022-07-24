import { bindActionCreators } from 'redux';
import * as tempRegisterdataActions from './modules/temp_register_userdata';
import * as login_userActions from './modules/login_user';
import * as tempBrokerRequestactions from './modules/tempBrokerRequest';
import * as brokerRequest_productEditactions from './modules/brokerRequest_product';
import * as mapRight from './modules/mapRight';
import * as temp_tourReservsettingAction from './modules/temp_tourReservsetting';
import * as mapFilter from './modules/mapfilter';
import * as mapProductEls from './modules/mapProductEls';
import * as temp_selectComplexinfo from './modules/temp_selectComplexinfo';
import * as searchdetailorigin from './modules/searchdetailorigin';
import * as mapheader from './modules/mapHeader';
import * as bunyangteam from './modules/bunyangTeam';
import * as temp_probrokerRegister from './modules/temp_probrokerRegister';
import * as reportModal from './modules/reportModal';

import * as dangiSidebarmodal from './modules/dangiSidebarmodal';
import * as exculsiveSidebarmodal from './modules/exculsiveSidebarmodal';
import * as probrokerSidebarmodal from './modules/probrokerSidebarmodal';
import * as Sidebarmodal from './modules/Sidebarmodal';

import store from './index';

const { dispatch } = store;

export const tempRegisterUserdataActions = bindActionCreators(tempRegisterdataActions, dispatch);
export const Login_userActions= bindActionCreators(login_userActions, dispatch);
export const tempBrokerRequestActions = bindActionCreators(tempBrokerRequestactions,dispatch);
export const brokerRequest_productEditActions = bindActionCreators(brokerRequest_productEditactions,dispatch);
export const MapRight = bindActionCreators(mapRight, dispatch);
export const temp_tourReservsettingActions = bindActionCreators(temp_tourReservsettingAction,dispatch);
export const MapFilterRedux = bindActionCreators(mapFilter, dispatch);
export const MapProductEls = bindActionCreators(mapProductEls, dispatch);
export const temp_SelectComplexinfo = bindActionCreators(temp_selectComplexinfo,dispatch);
export const searchDetailorigin = bindActionCreators(searchdetailorigin,dispatch);
export const mapHeader = bindActionCreators(mapheader,dispatch);
export const BunyangTeam = bindActionCreators(bunyangteam,dispatch);
export const temp_ProbrokerRegister= bindActionCreators(temp_probrokerRegister,dispatch);
export const reportmodal= bindActionCreators(reportModal,dispatch);

export const dangisidebarmodal = bindActionCreators(dangiSidebarmodal,dispatch);
export const exculsivesidebarmodal = bindActionCreators(exculsiveSidebarmodal,dispatch);
export const probrokersidebarmodal = bindActionCreators(probrokerSidebarmodal,dispatch);
export const sidebarmodal = bindActionCreators(Sidebarmodal,dispatch);