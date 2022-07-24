import { combineReducers } from 'redux';
import temp_register_userdata from './temp_register_userdata';
import login_user from './login_user';
import tempBrokerRequest from './tempBrokerRequest';
import brokerRequest_product from './brokerRequest_product';
import mapRight from './mapRight';
import temp_tourReservsetting from './temp_tourReservsetting';
import mapFilter from './mapfilter';
import mapProductEls from './mapProductEls';
import temp_selectComplexinfo from './temp_selectComplexinfo';
import searchdetailorigin from './searchdetailorigin';
import mapHeader from './mapHeader';
import bunyangTeam from './bunyangTeam';
import temp_probrokerRegister from './temp_probrokerRegister';
import reportmodal from './reportModal';

import dangiSidebarmodal from './dangiSidebarmodal';
import exculsiveSidebarmodal from './exculsiveSidebarmodal';
import probrokerSidebarmodal from './probrokerSidebarmodal';
import Sidebarmodal from './Sidebarmodal';

export default combineReducers({
  
  temp_register_userdata,
  login_user,
  tempBrokerRequest,
  brokerRequest_product,
  mapRight,
  temp_tourReservsetting,
  mapFilter,
  mapProductEls,
  temp_selectComplexinfo,
  searchdetailorigin,
  mapHeader,
  bunyangTeam,
  temp_probrokerRegister,
  reportmodal,

  dangiSidebarmodal,
  exculsiveSidebarmodal,
  probrokerSidebarmodal,
  Sidebarmodal
});