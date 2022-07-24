//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
// import {Tabs, Tab} from 'react-bootstrap-tabs';

//css
import styled from "styled-components"

// //material-ui
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import { styled as MUstyled } from '@material-ui/core/styles';
//theme
import { TtCon_Frame_B, TtCon_Title, } from '../../../../theme';

//img
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Location from '../../../../img/member/loca.png';
import Set from '../../../../img/member/setting.png';
import Item from '../../../../img/main/item01.png';
import Noimg from '../../../../img/main/main_icon3.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';

import { Mobile, PC } from "../../../../MediaQuery";
import ItemTopInfo from "./ItemTopInfo";
import ItemTabList from "./ItemTabList";
import CommonList from "./CommonList";
import { useSelector } from 'react-redux';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const StyledBadge = MUstyled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -1,
    // top: -2,
    // border: `2px solid ${theme.palette.background.paper}`,
    // padding: '0 4px',
  },
}));



export default function Like({ setFilter, value, type, exculsive_supply_privacycompany_notilist, exculsive_supply_probroker_notilist, exculsive_demand_notilist, exculsive_supply_privacycompany_notilist_notseencnt, exculsive_supply_probroker_notilist_notseencnt, exculsive_demand_notilist_notseencnt, setexculsive_supply_privacycompany_notilist, setexculsive_supply_probroker_notilist, setexculsive_demand_notilist, setexculsive_supply_privacycompany_notilist_notseencnt, setexculsive_supply_probroker_notilist_notseencnt, setexculsive_demand_notilist_notseencnt,
  bunyangsuyo_notilist, setbunyangsuyo_notilist,
  bunyangsupply_notilist, setbunyangsupply_notilist,
  bunyangsuyo_notilist_notseencnt, setbunyangsuyo_notilist_notseencnt,
  bunyangsupply_notilist_notseencnt, setbunyangsupply_notilist_notseencnt
}) {


  const login_user = useSelector(data => data.login_user);
  console.log('mymalarma login_userss:', login_user, exculsive_supply_privacycompany_notilist, exculsive_supply_probroker_notilist, exculsive_demand_notilist);
  console.log('cnt data reusltsss:', exculsive_supply_privacycompany_notilist_notseencnt, exculsive_supply_probroker_notilist_notseencnt, exculsive_demand_notilist_notseencnt);

  //각 탭별 페이지네이션 관련 state정보 데이터
  const [exculsive_demandtab_pagination, setexculsive_demandtab_pagination] = useState(1);//현재 해당 탭은 몇페이지인지 정보.
  const [exculsive_supplyprobrokertab_pagination, setexculsive_supplyprobrokertab_pagination] = useState(1);//기본값 1페이지
  const [exculsive_supplyprivacycompanytab_pagination, setexculsive_supplyprivacycompanytab_pagination] = useState(1);
  const [bunyangsuyotab_pagination, setbunyangsuyotab_pagination] = useState(1);
  const [bunyangsupplytab_pagination, setbunyangsupplytab_pagination] = useState(1);

  useEffect(() => {
    if (login_user.user_type == '개인' || login_user.user_type == '기업') {
      settapsValue('전속매물공급(개인,기업)');
      console.log('유저 타입 : ', login_user.user_type);
  
    } else if (login_user.user_type == '분양대행사') {
      settapsValue('분양공급');
  
    } else if (login_user.user_type == '중개사' && login_user.ispro != 1) {
      settapsValue('분양수요');
  
    } else if (login_user.user_type == '중개사' && login_user.ispro == 1) {
      settapsValue("분양수요");

    }
  }, [])

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }
  const AlarmListItem = [
    {
      a_id: 0,
      condition: "미확인",
      date: "2020.01.01",
      title: "알림케이스 명",
      id: "자이 109동",
      content: "내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다."
    },
    {
      a_id: 1,
      condition: "미확인",
      date: "2020.01.01",
      title: "알림케이스 명",
      id: "자이 109동",
      content: "내용입니다.내용입니다.내용입니다.내용입니다.내용입니다.내용입니다."
    }
  ]
  var count1 = 0; var count2 = 0; var count3 = 0; var count4 = 0;

  if (login_user.user_type == '개인' || login_user.user_type == '기업') {
    count1 = exculsive_supply_privacycompany_notilist_notseencnt;
    count2 = exculsive_demand_notilist_notseencnt;
    count3 = 0;
    count4 = 0;
  } else if (login_user.user_type == '분양대행사') {
    count1 = bunyangsupply_notilist_notseencnt;
    count2 = 0;
    count3 = 0;
    count4 = 0;
  }
  if (login_user.user_type == '중개사' && login_user.ispro == 1) {
    count1 = bunyangsuyo_notilist_notseencnt;
    count2 = exculsive_demand_notilist_notseencnt;//exculsive_demand_notilist_notseencnt
    count3 = exculsive_supply_probroker_notilist_notseencnt
    count4 = 0;
    console.log('중개사 전속매물::', exculsive_supply_probroker_notilist_notseencnt, exculsive_demand_notilist_notseencnt);
  } else if (login_user.user_type == '중개사' && login_user.ispro != 1) {
    count1 = bunyangsuyo_notilist_notseencnt;
    count2 = exculsive_demand_notilist_notseencnt;
    count3 = 0;
    count4 = 0;
  }

  //페이지네이션 관련 생성 및 제어함수.
  const pagination_return = (total_length, tabtype) => {
    console.log('paginatiton return호출::', total_length, tabtype);
    let loop_count = Math.ceil(total_length / 10);//반복수. 36개이면 36/10 -> 4 4페이지..
    console.log('page lopps count:', loop_count);
    let page_array = [];
    for (let i = 1; i <= loop_count; i++) {
      page_array.push(pageReturn(i, tabtype));
    }
    return page_array;
  }
  const pageReturn = (page, tabtype) => {
    console.log('pagereturn호출::', page, tabtype);
    return (
      <Page onClick={() => {
        if (tabtype == 'exculsive_demandtab') {
          setexculsive_demandtab_pagination(page);
        } else if (tabtype == 'exculsive_supplyprobrokertab') {
          setexculsive_supplyprobrokertab_pagination(page);
        } else if (tabtype == 'exculsive_supplyprivacycompanytab') {
          setexculsive_supplyprivacycompanytab_pagination(page);
        } else if (tabtype == 'bunyangsupplytab') {
          setbunyangsupplytab_pagination(page);
        } else if (tabtype == 'bunyangsuyotab') {
          setbunyangsuyotab_pagination(page);
        }
      }}>{page}</Page>
    )
  };

  //유형별 카운팅을 서버에서 같이 갖고오도록한다.
  const exculsive_supply_tab_privacycompany = () => {
    console.log('전문중개사 전속매물공급:', exculsive_supply_privacycompany_notilist);
    return (
      <Tab label={<StyledBadge badgeContent={count1} color="primary">전속매물공급&nbsp;&nbsp;&nbsp;</StyledBadge>}
       value={"전속매물공급(개인,기업)"} />
    );
  }
  const exculsive_supply_tab_probroker = () => {
    return (
       <Tab label={<StyledBadge badgeContent={count3} color="primary">전속매물공급&nbsp;&nbsp;&nbsp;</StyledBadge>}
       value={"전속매물공급(중개사)"} />
    );
  }

  const exculsive_demand_tab = () => {
    return (
       <Tab label={<StyledBadge badgeContent={count2} color="primary">전속매물수요&nbsp;&nbsp;&nbsp;</StyledBadge>}
       value={"전속매물수요"} />
    );
  }

  const bunyang_supply_tab = () => {
    return (
      <Tab label={<StyledBadge badgeContent={count1} color="primary">분양공급&nbsp;&nbsp;&nbsp;</StyledBadge>}
       value={"분양공급"} />
    )
  }
  const bunyang_demand_tab = () => {
    return (
      <Tab label={<StyledBadge badgeContent={count1} color="primary">분양수요&nbsp;&nbsp;&nbsp;</StyledBadge>}
       value={"분양수요"} />
    )
  }
  const common_tab = () => {
    return (
      <Tab label="공통">
        {
          AlarmListItem.map((value) => {
            return (
              <ItemTabList value={value} />
            )
          }
          )
        }
      </Tab>
    )
  }

  const [tapsvalue, settapsValue] =useState(0);

  const handleChange = (event, newValue) => {
    settapsValue(newValue);
    console.log('value값 확인 : ', newValue);
  };

  const user_type_alramReturn = () => {
    if (login_user.user_type == '개인' || login_user.user_type == '기업') {

      var get_taps = [];
      get_taps.push(exculsive_supply_tab_privacycompany());
      get_taps.push(exculsive_demand_tab());
      console.log('get taps resultss:', get_taps);

      return get_taps;
    } else if (login_user.user_type == '분양대행사') {

      var get_taps = [];
      get_taps.push(bunyang_supply_tab());
      console.log('get taps reusltsss:', get_taps);

      return get_taps;
    } else if (login_user.user_type == '중개사' && login_user.ispro != 1) {

      var get_taps = [];
      get_taps.push(bunyang_demand_tab());
      get_taps.push(exculsive_demand_tab());
      console.log('get taps resultsss:', get_taps);

      return get_taps;
    } else if (login_user.user_type == '중개사' && login_user.ispro == 1) {

      var get_taps = [];
      get_taps.push(bunyang_demand_tab());
      get_taps.push(exculsive_demand_tab());
      get_taps.push(exculsive_supply_tab_probroker());
      console.log('get taps resultsss:', get_taps, exculsive_supply_probroker_notilist_notseencnt);

      return get_taps;
    }
  }


  const TypeTapslist = ()=>{
    if (login_user.user_type == '개인' || login_user.user_type == '기업') {
      return (
        <div>
          <TabPanel value={tapsvalue} index={'전속매물공급(개인,기업)'}>
          {
            exculsive_supply_privacycompany_notilist && exculsive_supply_privacycompany_notilist.length >= 1 &&
            exculsive_supply_privacycompany_notilist.map((value, index) => {
              if (value.noti_status == 2) {
                return;//반환하지 않습니다.
              }
              if (value.noti_type == 1 || value.noti_type == 3 || value.noti_type == 5 || value.noti_type == 13 || value.noti_type == 14 || value.noti_type == 16) {
                if (index >= 10 * (exculsive_supplyprivacycompanytab_pagination - 1) && index <= 10 * (exculsive_supplyprivacycompanytab_pagination) - 1) {
                  return (
                    <ItemTabList value={value} setexculsive_supply_privacycompany_notilist={setexculsive_supply_privacycompany_notilist} setexculsive_supply_probroker_notilist={setexculsive_supply_probroker_notilist} setexculsive_demand_notilist={setexculsive_demand_notilist} setexculsive_supply_privacycompany_notilist_notseencnt={setexculsive_supply_privacycompany_notilist_notseencnt} setexculsive_supply_probroker_notilist_notseencnt={setexculsive_supply_probroker_notilist_notseencnt} setexculsive_demand_notilist_notseencnt={setexculsive_demand_notilist_notseencnt}
                      setbunyangsuyo_notilist={setbunyangsuyo_notilist} setbunyangsupply_notilist={setbunyangsupply_notilist}
                      setbunyangsuyo_notilist_notseencnt={setbunyangsuyo_notilist_notseencnt} setbunyangsupply_notilist_notseencnt={setbunyangsupply_notilist_notseencnt}
                    />
                  )
                }
              }
            }
            )
          }
          <Pagelist>
            {
              pagination_return(exculsive_supply_privacycompany_notilist && exculsive_supply_privacycompany_notilist.length, 'exculsive_supplyprivacycompanytab')
            }
          </Pagelist>
          </TabPanel>
          <TabPanel value={tapsvalue} index={'전속매물수요'}>
            {
              exculsive_demand_notilist && exculsive_demand_notilist.length >= 1 &&
              exculsive_demand_notilist.map((value, index) => {
                if (value.noti_status == 2) {
                  return;//반환하지 않습니다.
                }
                if (value.noti_type == 10 || value.noti_type == 11) {
                  //10 or 11에해당하는 전체데이터중 특정 범위index의 만족 데이터만.리턴.
                  if (index >= 10 * (exculsive_demandtab_pagination - 1) && index <= 10 * (exculsive_demandtab_pagination) - 1) {
                    //1페이지 0~9 / 2페이지 10~19 /...전체 배열state은 유지하되 보여주는 것만 달리한다.매번 연산하는것은 아님.
                    return (
                      <ItemTabList value={value} setexculsive_supply_privacycompany_notilist={setexculsive_supply_privacycompany_notilist} setexculsive_supply_probroker_notilist={setexculsive_supply_probroker_notilist} setexculsive_demand_notilist={setexculsive_demand_notilist} setexculsive_supply_privacycompany_notilist_notseencnt={setexculsive_supply_privacycompany_notilist_notseencnt} setexculsive_supply_probroker_notilist_notseencnt={setexculsive_supply_probroker_notilist_notseencnt} setexculsive_demand_notilist_notseencnt={setexculsive_demand_notilist_notseencnt}
                        setbunyangsuyo_notilist={setbunyangsuyo_notilist} setbunyangsupply_notilist={setbunyangsupply_notilist}
                        setbunyangsuyo_notilist_notseencnt={setbunyangsuyo_notilist_notseencnt} setbunyangsupply_notilist_notseencnt={setbunyangsupply_notilist_notseencnt}
                      />
                    )
                  }

                }
              }
              )
            }
            <Pagelist>
              {
                pagination_return(exculsive_demand_notilist && exculsive_demand_notilist.length, 'exculsive_demandtab')
              }
            </Pagelist>
          </TabPanel>

        </div>
      )
    } else if (login_user.user_type == '분양대행사') {
      return (
        <div>
           <TabPanel value={tapsvalue} index={'분양공급'}>
          {
            bunyangsupply_notilist && bunyangsupply_notilist.length >= 1 &&
            bunyangsupply_notilist.map((value, index) => {
              if (value.noti_status == 2) {
                return;
              }
              if (value.noti_type == 'bunyang_visit_new_registed' || value.noti_type == 'bunyang_visit_reserv_modify' || value.noti_type == 'bunyang_visit_reserv_cancle' || value.noti_type == 'bunyang_live_new_registed' || value.noti_type == 'bunyang_live_reserv_cancle') {
                if (index >= 10 * (bunyangsupplytab_pagination - 1) && index <= 10 * (bunyangsupplytab_pagination) - 1) {
                  return (
                    <ItemTabList value={value} setexculsive_supply_privacycompany_notilist={setexculsive_supply_privacycompany_notilist} setexculsive_supply_probroker_notilist={setexculsive_supply_probroker_notilist} setexculsive_demand_notilist={setexculsive_demand_notilist} setexculsive_supply_privacycompany_notilist_notseencnt={setexculsive_supply_privacycompany_notilist_notseencnt} setexculsive_supply_probroker_notilist_notseencnt={setexculsive_supply_probroker_notilist_notseencnt} setexculsive_demand_notilist_notseencnt={setexculsive_demand_notilist_notseencnt}
                      setbunyangsuyo_notilist={setbunyangsuyo_notilist} setbunyangsupply_notilist={setbunyangsupply_notilist}
                      setbunyangsuyo_notilist_notseencnt={setbunyangsuyo_notilist_notseencnt} setbunyangsupply_notilist_notseencnt={setbunyangsupply_notilist_notseencnt}
                    />
                  )
                }
              }

            }
            )
          }
          <Pagelist>
            {
              pagination_return(bunyangsupply_notilist && bunyangsupply_notilist.length, 'bunyangsupplytab')
            }
          </Pagelist>
          </TabPanel>
        </div>
      )
    } else if (login_user.user_type == '중개사' && login_user.ispro != 1) {
      return (
        <div>
          <TabPanel value={tapsvalue} index={'분양수요'}>
            {
              bunyangsuyo_notilist && bunyangsuyo_notilist.length >= 1 &&
              bunyangsuyo_notilist.map((value, index) => {
                if (value.noti_status == 2) {
                  return;
                }
                if (value.noti_type == 'bunyang_live_newRegisted' || value.noti_type == 'bunyang_live_edited' || value.noti_type == 'bunyang_live_invite' || value.noti_type == 'bunyang_live_startday_reservealram' || value.noti_type == 'bunyang_visit_startday_reservealram' || value.noti_type == 'bunyang_visit_cancled_by_bunyang') {
                  if (index >= 10 * (bunyangsuyotab_pagination - 1) && index <= 10 * (bunyangsuyotab_pagination) - 1) {
                    return (
                      <ItemTabList value={value} value={value} setexculsive_supply_privacycompany_notilist={setexculsive_supply_privacycompany_notilist} setexculsive_supply_probroker_notilist={setexculsive_supply_probroker_notilist} setexculsive_demand_notilist={setexculsive_demand_notilist} setexculsive_supply_privacycompany_notilist_notseencnt={setexculsive_supply_privacycompany_notilist_notseencnt} setexculsive_supply_probroker_notilist_notseencnt={setexculsive_supply_probroker_notilist_notseencnt} setexculsive_demand_notilist_notseencnt={setexculsive_demand_notilist_notseencnt}
                        setbunyangsuyo_notilist={setbunyangsuyo_notilist} setbunyangsupply_notilist={setbunyangsupply_notilist}
                        setbunyangsuyo_notilist_notseencnt={setbunyangsuyo_notilist_notseencnt} setbunyangsupply_notilist_notseencnt={setbunyangsupply_notilist_notseencnt}
                      />
                    )
                  }

                }
              }
              )
            }
            <Pagelist>
              {
                pagination_return(bunyangsuyo_notilist && bunyangsuyo_notilist.length, 'bunyangsuyotab')
              }
            </Pagelist>
          </TabPanel>
          <TabPanel value={tapsvalue} index={'전속매물수요'}>
            {
              exculsive_demand_notilist && exculsive_demand_notilist.length >= 1 &&
              exculsive_demand_notilist.map((value, index) => {
                if (value.noti_status == 2) {
                  return;//반환하지 않습니다.
                }
                if (value.noti_type == 10 || value.noti_type == 11) {
                  //10 or 11에해당하는 전체데이터중 특정 범위index의 만족 데이터만.리턴.
                  if (index >= 10 * (exculsive_demandtab_pagination - 1) && index <= 10 * (exculsive_demandtab_pagination) - 1) {
                    //1페이지 0~9 / 2페이지 10~19 /...전체 배열state은 유지하되 보여주는 것만 달리한다.매번 연산하는것은 아님.
                    return (
                      <ItemTabList value={value} setexculsive_supply_privacycompany_notilist={setexculsive_supply_privacycompany_notilist} setexculsive_supply_probroker_notilist={setexculsive_supply_probroker_notilist} setexculsive_demand_notilist={setexculsive_demand_notilist} setexculsive_supply_privacycompany_notilist_notseencnt={setexculsive_supply_privacycompany_notilist_notseencnt} setexculsive_supply_probroker_notilist_notseencnt={setexculsive_supply_probroker_notilist_notseencnt} setexculsive_demand_notilist_notseencnt={setexculsive_demand_notilist_notseencnt}
                        setbunyangsuyo_notilist={setbunyangsuyo_notilist} setbunyangsupply_notilist={setbunyangsupply_notilist}
                        setbunyangsuyo_notilist_notseencnt={setbunyangsuyo_notilist_notseencnt} setbunyangsupply_notilist_notseencnt={setbunyangsupply_notilist_notseencnt}
                      />
                    )
                  }

                }
              }
              )
            }
            <Pagelist>
              {
                pagination_return(exculsive_demand_notilist && exculsive_demand_notilist.length, 'exculsive_demandtab')
              }
            </Pagelist>
          </TabPanel>
           
        </div>
      )
    } else if (login_user.user_type == '중개사' && login_user.ispro == 1) {
      return (
        <div>
          <TabPanel value={tapsvalue} index={'분양수요'}>
            {
              bunyangsuyo_notilist && bunyangsuyo_notilist.length >= 1 &&
              bunyangsuyo_notilist.map((value, index) => {
                if (value.noti_status == 2) {
                  return;
                }
                if (value.noti_type == 'bunyang_live_newRegisted' || value.noti_type == 'bunyang_live_edited' || value.noti_type == 'bunyang_live_invite' || value.noti_type == 'bunyang_live_startday_reservealram' || value.noti_type == 'bunyang_visit_startday_reservealram' || value.noti_type == 'bunyang_visit_cancled_by_bunyang') {
                  if (index >= 10 * (bunyangsuyotab_pagination - 1) && index <= 10 * (bunyangsuyotab_pagination) - 1) {
                    return (
                      <ItemTabList value={value} value={value} setexculsive_supply_privacycompany_notilist={setexculsive_supply_privacycompany_notilist} setexculsive_supply_probroker_notilist={setexculsive_supply_probroker_notilist} setexculsive_demand_notilist={setexculsive_demand_notilist} setexculsive_supply_privacycompany_notilist_notseencnt={setexculsive_supply_privacycompany_notilist_notseencnt} setexculsive_supply_probroker_notilist_notseencnt={setexculsive_supply_probroker_notilist_notseencnt} setexculsive_demand_notilist_notseencnt={setexculsive_demand_notilist_notseencnt}
                        setbunyangsuyo_notilist={setbunyangsuyo_notilist} setbunyangsupply_notilist={setbunyangsupply_notilist}
                        setbunyangsuyo_notilist_notseencnt={setbunyangsuyo_notilist_notseencnt} setbunyangsupply_notilist_notseencnt={setbunyangsupply_notilist_notseencnt}
                      />
                    )
                  }

                }
              }
              )
            }
            <Pagelist>
              {
                pagination_return(bunyangsuyo_notilist && bunyangsuyo_notilist.length, 'bunyangsuyotab')
              }
            </Pagelist>
          </TabPanel>
          <TabPanel value={tapsvalue} index={'전속매물수요'}>
            {
              exculsive_demand_notilist && exculsive_demand_notilist.length >= 1 &&
              exculsive_demand_notilist.map((value, index) => {
                if (value.noti_status == 2) {
                  return;//반환하지 않습니다.
                }
                if (value.noti_type == 10 || value.noti_type == 11) {
                  //10 or 11에해당하는 전체데이터중 특정 범위index의 만족 데이터만.리턴.
                  if (index >= 10 * (exculsive_demandtab_pagination - 1) && index <= 10 * (exculsive_demandtab_pagination) - 1) {
                    //1페이지 0~9 / 2페이지 10~19 /...전체 배열state은 유지하되 보여주는 것만 달리한다.매번 연산하는것은 아님.
                    return (
                      <ItemTabList value={value} setexculsive_supply_privacycompany_notilist={setexculsive_supply_privacycompany_notilist} setexculsive_supply_probroker_notilist={setexculsive_supply_probroker_notilist} setexculsive_demand_notilist={setexculsive_demand_notilist} setexculsive_supply_privacycompany_notilist_notseencnt={setexculsive_supply_privacycompany_notilist_notseencnt} setexculsive_supply_probroker_notilist_notseencnt={setexculsive_supply_probroker_notilist_notseencnt} setexculsive_demand_notilist_notseencnt={setexculsive_demand_notilist_notseencnt}
                        setbunyangsuyo_notilist={setbunyangsuyo_notilist} setbunyangsupply_notilist={setbunyangsupply_notilist}
                        setbunyangsuyo_notilist_notseencnt={setbunyangsuyo_notilist_notseencnt} setbunyangsupply_notilist_notseencnt={setbunyangsupply_notilist_notseencnt}
                      />
                    )
                  }

                }
              }
              )
            }
            <Pagelist>
              {
                pagination_return(exculsive_demand_notilist && exculsive_demand_notilist.length, 'exculsive_demandtab')
              }
            </Pagelist>
          </TabPanel>
          <TabPanel value={tapsvalue} index={'전속매물공급(중개사)'}>
          {
            exculsive_supply_probroker_notilist && exculsive_supply_probroker_notilist.length >= 1 &&
            exculsive_supply_probroker_notilist.map((value, index) => {
              if (value.noti_status == 2) {
                return;//반환하지 않습니다.
              }
              if (value.noti_type == 2 || value.noti_type == 4 || value.noti_type == 6 || value.noti_type == 9 || value.noti_type == 8 || value.noti_type == 15 || value.noti_type == 17) {

                if (index >= 10 * (exculsive_supplyprobrokertab_pagination - 1) && index <= 10 * (exculsive_supplyprobrokertab_pagination) - 1) {
                  return (
                    <ItemTabList value={value} setexculsive_supply_privacycompany_notilist={setexculsive_supply_privacycompany_notilist} setexculsive_supply_probroker_notilist={setexculsive_supply_probroker_notilist} setexculsive_demand_notilist={setexculsive_demand_notilist} setexculsive_supply_privacycompany_notilist_notseencnt={setexculsive_supply_privacycompany_notilist_notseencnt} setexculsive_supply_probroker_notilist_notseencnt={setexculsive_supply_probroker_notilist_notseencnt} setexculsive_demand_notilist_notseencnt={setexculsive_demand_notilist_notseencnt}
                      setbunyangsuyo_notilist={setbunyangsuyo_notilist} setbunyangsupply_notilist={setbunyangsupply_notilist}
                      setbunyangsuyo_notilist_notseencnt={setbunyangsuyo_notilist_notseencnt} setbunyangsupply_notilist_notseencnt={setbunyangsupply_notilist_notseencnt}
                    />
                  )
                }
              }
            }
            )
          }
          <Pagelist>
            {
              pagination_return(exculsive_supply_probroker_notilist && exculsive_supply_probroker_notilist.length, 'exculsive_supplyprobrokertab')
            }
          </Pagelist>
          </TabPanel>
        </div>
      )
    }
  }




  return (
    <Container>
      <Wrapper count1={count1} count2={count2} count3={count3} count4={count4}>
        <p className="tit-a2">내 알림</p>
        {
          console.log('count1', count1),
          console.log('count2', count2),
          console.log('count3', count3),
          console.log('count4', count4)
        }
        {/* <Tabs onSelect={(index, label) => console.log(label + ' selected')} className="like_tab alarm_tab pr"> */}
        {
          /*
            개인,기업: 전속매물공급,전속매물수요, 공통
            분양팀원: 분양공급,공통
            중개사: 분양수요,공통
            전문중개사:전속매물공급,분양수요,공통
          */
        }

        {/*<Tab label="알림내역">
              <ItemTopInfo alram_cnt={alramlist.length}/>
              {
                  alramlist.map((value) => {
                    return(
                      <ItemTabList value={value}/>
                    )
                  }
                )
              }
            
            */}
        {/*<ItemTopInfo total_cnt={exculsive_supply_privacycompany_notilist.length}/>*/}
        <div>
          <Tabs
            value={tapsvalue}
            onChange={handleChange}
          >
            {
              (user_type_alramReturn() && user_type_alramReturn().length >= 1) && user_type_alramReturn().map((value) => {
                return value;
              })
            }
          </Tabs>
        </div>
        {TypeTapslist()}

        {/* </Tabs> */}
      </Wrapper>
    </Container>
  );
}

const MUTab = MUstyled(Tab)`

`

const Pagelist = styled.ul`
   display:flex;flex-flow:row wrap; width:100%;height:auto; justify-content:center;align-items:center;
`;
const Page = styled.li`
  display:block;margin:10px;padding:10px;font-size:13px;line-height:20px; background-color:#202020;color:white;cursor:pointer;
 @media ${(props) => props.theme.mobile} { 
   margin:calc(100vw * (4 / 480));padding:calc(100vw * (4 / 480));font-size:calc(100vw * (12 / 480));line-height:calc(100vw * (20 / 480));
 }
`;
const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = styled.div`
    width:890px;
    margin:0 auto;
    padding:24px 0 250px;
    @media ${(props) => props.theme.mobile} {
      width:100%;
      padding:calc(100vw*(18/428)) 0 calc(100vw*(50/428));
      }
`
const Wrapper = styled.div`
  ${TtCon_Frame_B}

  position:relative;
  & > div > ul > li:nth-child(1) > a::before {
    content: '${({ count1 }) => count1}';
    position:absolute;
    top:50%;transform:translateY(-50%);
    right:0;
    width:auto;padding:0 3px;
    height:24px;
    line-height:24px;
    display:flex;
    background:#fe7a01;
    color:#fff;text-align:center;
    font-size:11px;border-radius:100%;
    flex-flow:row wrap;align-items:center;
    @media screen and (max-width:1024px){
      right:-5%;
      width: auto; padding:0 calc(100vw * (3 / 428));
      height: calc(100vw*(20/428));
      line-height: calc(100vw*(20/428));
      font-size: calc(100vw*(10/428));
    }
  }
  & > div > ul > li:nth-child(2) > a::before {
    content: '${({ count2 }) => count2}';
    position:absolute;
    top:50%;transform:translateY(-50%);
    right:0;
    width:auto;padding: 0 3px;
    height:24px;text-align:center;
    line-height:24px;
    display:flex;
    background:#fe7a01;
    color:#fff;text-align:center;
    font-size:11px;border-radius:100%;
    flex-flow:row wrap;align-items:center;
    @media screen and (max-width:1024px){
      right:-5%;
      width: auto; padding:0 calc(100vw * (3 / 428));
      height: calc(100vw*(20/428));
      line-height: calc(100vw*(20/428));
      font-size: calc(100vw*(10/428));
    }
  }
  & > div > ul > li:nth-child(3) > a::before {
    content: '${({ count3 }) => count3}';
    position:absolute;
    top:50%;transform:translateY(-50%);
    right:0;
    width:auto; padding: 0 3px;
    height:24px;text-align:center;
    line-height:24px;
    display:flex;
    background:#fe7a01;
    color:#fff;text-align:center;
    font-size:11px;border-radius:100%;
    @media screen and (max-width:1024px){
      right:-5%;
      width: auto; padding:0 calc(100vw * (10 / 428));
      height: calc(100vw*(20/428));
      line-height: calc(100vw*(20/428));
      font-size: calc(100vw*(10/428));
    }
  }
  & > div > ul > li:nth-child(4) > a::before {
    content: '${({ count4 }) => count4}';
    position:absolute;
    top:50%;transform:translateY(-50%);
    right:0;
    width:auto; padding: 0 3px;
    height:24px;text-align:center;
    line-height:24px;
    display:flex;
    background:#fe7a01;
    color:#fff;text-align:center;
    font-size:11px;border-radius:100%;
    @media screen and (max-width:1024px){
      right:-5%;
      width: auto; padding:0 calc(100vw * ( 10 / 428));
      height: calc(100vw*(20/428));
      line-height: calc(100vw*(20/428));
      font-size: calc(100vw*(10/428));
    }
  }
`

const Title = styled.h2`
    ${TtCon_Title} 
`

// const AlarmSpan = Sstyled.div`
//   display:inline-block;
//   width:15px;height:15px;
//   border-radius:100%;font-size:12px;font-weight:600;
//   transform:skew(-0.1deg);background:#fe7a01;
//   text-align:center;line-height:15px;
//   margin-left:5px;
// `