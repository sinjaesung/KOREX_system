//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
// import {Tabs, Tab} from 'react-bootstrap-tabs';
import { useSelector } from 'react-redux';
//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col, } from '../../../../theme';

//material-ui
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

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
import ItemTabList from "./ItemTabList";
import BunyangTabList from "./BunyangTabList";

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
        // <Box sx={{ p: 3 }}>
        //   <Typography>{children}</Typography>
        // </Box>
        <Sect_R2>
          {children}
        </Sect_R2>
      )}
    </div>
  );
}


export default function MyLike({ setFilter, value, type, listData, setListData }) {
  
  const UserType = useSelector(data => data.login_user.user_type);
  const login_user = useSelector(data => data.login_user);
  
  const [Value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }
  return (
    <>
      <Wrapper>
        <p className="tit-a2">내 관심</p>
        {/* <MUTabs onSelect={(index, label) => console.log(label + ' selected')} className="like_tab">
              <MUTab label="전속매물">
                  <ItemTabList listData={listData} setListData={setListData}/>
              </MUTab>
              <MUTab label="분양">
                  <BunyangTabList/>
              </MUTab>
          </MUTabs> */}

        {UserType == '중개사' ?
          <div>
            <div className="par-spacing">
              <MUTabs value={Value} onChange={handleChange} aria-label="basic tabs example" className="muTabs-rsp">
                <MUTab label="전속매물" className="muTab-rsp"/>
                <MUTab label="분양" className="muTab-rsp"/>
              </MUTabs>
              <div className="divider-a1" />
            </div>
            <TabPanel value={Value} index={0}>
              <ItemTabList listData={listData} setListData={setListData} />
            </TabPanel>
            <TabPanel value={Value} index={1}>
              <BunyangTabList />
            </TabPanel>
          </div>
          :
          <div>
            <div className="par-spacing">
              <MUTabs value={Value} onChange={handleChange} aria-label="basic tabs example" className="muTabs-rsp">
                <MUTab label="전속매물" className="muTab-rsp"/>
                {/* <Tab label="분양" /> */}
              </MUTabs>
              <div className="divider-a1" />
            </div>
            <TabPanel value={Value} index={0}>
              <ItemTabList listData={listData} setListData={setListData} refer_action={"mypage_like"}/>
            </TabPanel>
            {/* <TabPanel value={Value} index={1}>
          <BunyangTabList />
        </TabPanel> */}
          </div>
        }
        {/* <div className="par-spacing">
          <MUTabs value={Value} onChange={handleChange} aria-label="basic tabs example">
            <MUTab label="전속매물" />
            <MUTab label="분양" />
          </MUTabs>
          <div className="divider-a1" />
        </div>
        <TabPanel value={Value} index={0}>
          <ItemTabList listData={listData} setListData={setListData} />
        </TabPanel>
        <TabPanel value={Value} index={1}>
          <BunyangTabList />
        </TabPanel> */}
      </Wrapper>
    </>
  );
}

const MUTabs = styled(Tabs)``
const MUTab = styled(Tab)``

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col}
`