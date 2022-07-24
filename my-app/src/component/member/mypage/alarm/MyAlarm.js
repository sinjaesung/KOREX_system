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
import { TtCon_Frame_B, TtCon_1col,} from '../../../../theme';

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
        <Sect_R2>
          {children}
        </Sect_R2>
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
      <MUTab className="muTab-rsp" label={<MUBadge badgeContent={count1} color="secondary" className="muBadge-rsp">전속매물공급&nbsp;&nbsp;&nbsp;</MUBadge>}
        value={"전속매물공급(개인,기업)"} />
    );
  }
  const exculsive_supply_tab_probroker = () => {
    return (
      <MUTab className="muTab-rsp" label={<MUBadge badgeContent={count3} color="secondary" className="muBadge-rsp">전속매물공급&nbsp;&nbsp;&nbsp;</MUBadge>}
        value={"전속매물공급(중개사)"} />
    );
  }

  const exculsive_demand_tab = () => {
    return (
      <MUTab className="muTab-rsp" label={<MUBadge badgeContent={count2} color="secondary" className="muBadge-rsp">전속매물수요&nbsp;&nbsp;&nbsp;</MUBadge>}
        value={"전속매물수요"} />
    );
  }

  const bunyang_supply_tab = () => {
    return (
      <MUTab className="muTab-rsp" label={<MUBadge badgeContent={count1} color="secondary" className="muBadge-rsp">분양공급&nbsp;&nbsp;&nbsp;</MUBadge>}
        value={"분양공급"} />
    )
  }
  const bunyang_demand_tab = () => {
    return (
      <MUTab className="muTab-rsp" label={<MUBadge badgeContent={count1} color="secondary" className="muBadge-rsp">분양수요&nbsp;&nbsp;&nbsp;</MUBadge>}
        value={"분양수요"} />
    )
  }
  const common_tab = () => {
    return (
      <MUTab className="muTab-rsp" label="공통">
        {
          AlarmListItem.map((value) => {
            return (
              <ItemTabList value={value} />
            )
          }
          )
        }
      </MUTab>
    )
  }

  const [tapsvalue, settapsValue] = useState(0);

  const handleChange = (event, newValue) => {
    settapsValue(newValue);
    console.log('value값 확인 : ', newValue);
  };

  const user_type_alramReturn = () => {
    if (login_user.user_type == '개인' || login_user.user_type == '기업') {

      var get_taps = [];
      get_taps.push(exculsive_demand_tab());
      get_taps.push(exculsive_supply_tab_privacycompany());
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


  const TypeTapslist = () => {
    if (login_user.user_type == '개인' || login_user.user_type == '기업') {
      return (
        <>
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
        </>
      )
    } else if (login_user.user_type == '분양대행사') {
      return (
        <>
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
        </>
      )
    } else if (login_user.user_type == '중개사' && login_user.ispro != 1) {
      return (
        <>
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
        </>
      )
    } else if (login_user.user_type == '중개사' && login_user.ispro == 1) {
      return (
        <>
          <TabPanel value={tapsvalue} index={'분양수요'} sx={{ backgroundColor: "red", }}>
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
        </>
      )
    }
  }




  return (
    <>
      <Wrapper count1={count1} count2={count2} count3={count3} count4={count4}>
        <p className="tit-a2">내 알림</p>
        {
          console.log('count1', count1),
          console.log('count2', count2),
          console.log('count3', count3),
          console.log('count4', count4)
        }
        <div className="par-spacing">
          <MUTabs
            className="muTabs-rsp"
            value={tapsvalue}
            onChange={handleChange}
          >
            {
              (user_type_alramReturn() && user_type_alramReturn().length >= 1) && user_type_alramReturn().map((value) => {
                return value;
              })
            }
          </MUTabs>
          <div className="divider-a1" />
        </div>
        <div className="mt-1">
          {TypeTapslist()}
        </div>

        {/* </Tabs> */}
      </Wrapper>
    </>
  );
}


const MUTabs = styled(Tabs)`
`
const MUTab = styled(Tab)`
`
const MUBadge = styled(Badge)`
&.MuiBadge-root .MuiBadge-badge {
    right: -1,
  }
`

// const StyledBadge = MUstyled(Badge)(({ theme }) => ({
//   '& .MuiBadge-badge': {
//     right: -1,
//     top: -2,
//     border: `2px solid ${theme.palette.background.paper}`,
//     padding: '0 4px',
//   },
// }));


const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Sect_R2 = styled.div`
  ${TtCon_1col}
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
