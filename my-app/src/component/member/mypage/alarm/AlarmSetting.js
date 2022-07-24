//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";
// import {Tabs, Tab} from 'react-bootstrap-tabs';
//css
import styled from "styled-components"

//material-ui
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import { styled as MUstyled } from '@material-ui/core/styles';

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
import JunsokDemandSetting from "./JunsokDemandSetting";
import BunyangDemandSetting from "./BunyangDemandSetting";
import JunsokSupplySetting from "./JunsokSupplySetting";
import JunsokSupplySetting_brokerRequest from "./JunsokSupplySetting_brokerRequest";
import BunyangSupplySetting from "./BunyangSupplySetting";
import CommonSetting from "./CommonSetting";

//server process
import serverController from '../../../../server/serverController';

import { TtCon_Frame_B, TtCon_1col, } from '../../../../theme';

//redux
import {useSelector} from 'react-redux';


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

export default function Like({setFilter,value,type,alramsetting,setalramsetting}) {
  const login_user=useSelector(data=>data.login_user);

  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const showModal =()=>{
    setMenu(!menu);
  }


  useEffect(() => {
    if (login_user.user_type == '개인' || login_user.user_type == '기업') {
      settapsValue('전속매물수요');
      console.log('유저 타입 : ', login_user.user_type);

    } else if (login_user.user_type == '분양대행사') {
      settapsValue('분양공급');

    } else if (login_user.user_type == '중개사' && login_user.ispro != 1) {
      settapsValue('분양수요');

    } else if (login_user.user_type == '중개사' && login_user.ispro == 1) {
      settapsValue("분양수요");

    }
  }, [])


  
  const exculsive_demand = () =>{
    return (
      <MUTab className="muTab-rsp" label="전속매물수요"
        value={"전속매물수요"} />


      // <Tab label="전속매물 수요">
      //   <JunsokDemandSetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
      // </Tab >
    );
  }
  const privacycompany_exculsive_supply = ()=>{
    return(
      <MUTab className="muTab-rsp" label="전속매물공급"
        value={"전속매물공급(개인,기업)"} />



      // <Tab label="전속매물공급(개인,기업)">
      //   <JunsokSupplySetting_brokerRequest alramsetting={alramsetting} setalramsetting={setalramsetting} />
      // </Tab>
    );
  }
  const probroker_exculsive_supply = () => {
    return(
      <MUTab className="muTab-rsp" label="전속매물공급"
        value={"전속매물공급(전문중개사)"} />


      // <Tab label="전속매물공급(전문중개사)">
      //   <JunsokSupplySetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
      // </Tab>
    );
  }
  const bunyang_demand =  () => {
    return(
      <MUTab className="muTab-rsp" label="분양수요"
        value={"분양수요"} />


    // <Tab label="분양 수요">
    //   <BunyangDemandSetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
    // </Tab> 
    );
  }
  const bunyang_supply = () => {
    return(
      <MUTab className="muTab-rsp" label="분양공급"
        value={"분양공급"} />


      // <Tab label="분양 공급">
      //   <BunyangSupplySetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
      // </Tab> 
    );
  }
  

  //패널

  const TypeTapslist =()=>{
  return(
    <>
      <TabPanel value={tapsvalue} index={'전속매물수요'}>
        <JunsokDemandSetting alramsetting={alramsetting} setalramsetting={setalramsetting} />
      </TabPanel>
      <TabPanel value={tapsvalue} index={'전속매물공급(개인,기업)'}>
        <JunsokSupplySetting_brokerRequest alramsetting={alramsetting} setalramsetting={setalramsetting} />
      </TabPanel>
      <TabPanel value={tapsvalue} index={'전속매물공급(전문중개사)'}>
        <JunsokSupplySetting alramsetting={alramsetting} setalramsetting={setalramsetting} />
      </TabPanel>
      <TabPanel value={tapsvalue} index={'분양수요'}>
        <BunyangDemandSetting alramsetting={alramsetting} setalramsetting={setalramsetting} />
      </TabPanel>
      <TabPanel value={tapsvalue} index={'분양공급'}>
        <BunyangSupplySetting alramsetting={alramsetting} setalramsetting={setalramsetting} />
      </TabPanel>
    </>
  )
}

  const user_type_alramReturn = () => {
    console.log('user_tpype alram return:',login_user.user_type);
    if(login_user.user_type=='개인' || login_user.user_type=='기업'){

      var get_taps=[];
      get_taps.push(exculsive_demand());
      get_taps.push(privacycompany_exculsive_supply()); 
      console.log('gettaps rreusltsss:',get_taps);

      return get_taps;
    }
    else if(login_user.user_type=='중개사' && login_user.ispro != 1){
      var get_taps=[];
      get_taps.push(bunyang_demand());
      get_taps.push(exculsive_demand());
      console.log('get tapss reusltsss:',get_taps);

      return get_taps;
    }else if(login_user.user_type=='중개사' && login_user.ispro ==1){
      var get_taps=[];
      get_taps.push(bunyang_demand());
      get_taps.push(exculsive_demand());
      get_taps.push(probroker_exculsive_supply());
      console.log('get tapss reusltsss:',get_taps);

      return get_taps;
    }else if(login_user.user_type=='분양대행사'){
      console.log('분양대행사인 케이스=============>>>>>>>');
      var get_taps=[];
      get_taps.push(bunyang_supply());
      console.log('get tapss reusltsss:',get_taps);

      return get_taps;
    }
  }
  const tab_return = () => {
    console.log('tab resutnr실행::');
    var return_data_array=[];
    if(login_user.user_type=='개인' || login_user.user_type=='기업'){
      
      /*return_data_array.push(
      <Tab label='전속매물 수요'>
        <JunsokDemandSetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
      </Tab>
      );
      return_data_array.push(
        <Tab label='전속매물공급(개인,기업)'>
          <JunsokSupplySetting_brokerRequest alramsetting={alramsetting} setalramsetting={setalramsetting}/>
        </Tab>
       );*/
      //return_data_array.push(exculsive_demand());
      //return_data_array.push(privacycompany_exculsive_supply());

    }else if(login_user.user_type=='중개사' && login_user.ispro != 1){
      /*
      return_data_array.push(
        <Tab label='분양 수요'>
          <BunyangDemandSetting/>
        </Tab>
      );
      return_data_array.push(
        <Tab label='전속매물 수요'>
          <JunsokDemandSetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
        </Tab>
      );*/
      //return_data_array.push(bunyang_demand());
     // return_data_array.push(exculsive_demand());

    }else if(login_user.user_type=='중개사' && login_user.ispro==1){
      /*
      return_data_array.push(
        <Tab label='전속매물공급(전문중개사)'>
          <JunsokSupplySetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
        </Tab>
      );
      return_data_array.push(
        <Tab label='전속매물 수요'>
           <JunsokDemandSetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
        </Tab>
      );
      return_data_array.push(
        <Tab label='분양 수요'>
          <BunyangDemandSetting/>
        </Tab>
      );
      */
     //return_data_array.push(probroker_exculsive_supply());
     //return_data_array.push(exculsive_demand());
     //return_data_array.push(bunyang_demand());

    }else if(login_user.user_type=='분양대행사'){
      /*
      return_data_array.push(
        <Tab label='분양 공급'>
          <BunyangSupplySetting/>
        </Tab>
      );*/
      //return_data_array.push(bunyang_supply());
    }
    console.log('return data arrayss:',return_data_array);
    return return_data_array;
  }

  const [tapsvalue, settapsValue] = useState(0);

  const handleChange = (event, newValue) => {
    settapsValue(newValue);
    console.log('value값 확인 : ', newValue);
  };



  
    return (
        <>
          <Wrapper>
          <p className="tit-a2">내 알림 설정</p>
{/*          
            <Tabs onSelect={(index, label) => console.log(label + ' selected')} className="like_tab alarm_tab pr">
           
        
          </Tabs> */}

          <div className="par-spacing">
            <MUTabs
              className="muTabs-rsp"
              value={tapsvalue}
              onChange={handleChange}
            >
              {
                (user_type_alramReturn() && user_type_alramReturn().length >= 1) && user_type_alramReturn().map((value) => {
                  console.log('values:::', value);
                  return value;
                })
              }
            </MUTabs>
            <div className="divider-a1" />
          </div>
          <div className="mt-1">
            {TypeTapslist()}
          </div>
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
const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Sect_R2 = styled.div`
  ${TtCon_1col}
`


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
const WrapRequest = styled.div`
  width:100%;
`
const TopTitle = styled.h2`
  width:680px;margin:0 auto;
  font-size:20px;color:#707070;
  margin-bottom:40px;
  text-align:left;padding-left:30px;
  font-weight:800;transform:skew(-0.1deg);

  @media ${(props) => props.theme.mobile} {
    width:100%;
    font-size:calc(100vw*(14/428));
    padding-left:calc(100vw*(36/428));
    margin-bottom:calc(100vw*(24/428));
    }
`
