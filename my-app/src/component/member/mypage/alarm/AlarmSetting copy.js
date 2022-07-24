//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {Tabs, Tab} from 'react-bootstrap-tabs';
//css
import styled from "styled-components"

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

//redux
import {useSelector} from 'react-redux';

export default function Like({setFilter,value,type,alramsetting,setalramsetting}) {
  const login_user=useSelector(data=>data.login_user);

  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const showModal =()=>{
    setMenu(!menu);
  }
  
  const exculsive_demand = () =>{
    return (
      <Tab label="전속매물 수요">
        <JunsokDemandSetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
      </Tab >
    );
  }
  const privacycompany_exculsive_supply = ()=>{
    return(
      <Tab label="전속매물 공급(개인,기업)">
        <JunsokSupplySetting_brokerRequest alramsetting={alramsetting} setalramsetting={setalramsetting} />
      </Tab>
    );
  }
  const probroker_exculsive_supply = () => {
    return(
      <Tab label="전속매물 공급(전문중개사)">
        <JunsokSupplySetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
      </Tab>
    );
  }
  const bunyang_demand =  () => {
    return(
    <Tab label="분양 수요">
      <BunyangDemandSetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
    </Tab> 
    );
  }
  const bunyang_supply = () => {
    return(
      <Tab label="분양 공급">
        <BunyangSupplySetting alramsetting={alramsetting} setalramsetting={setalramsetting}/>
      </Tab> 
    );
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
        <Tab label='전속매물 공급(개인,기업)'>
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
        <Tab label='전속매물 공급(전문중개사)'>
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

    return (
        <Container>
          <WrapRequest>
            <TopTitle>내 알림 설정</TopTitle>
            <Tabs onSelect={(index, label) => console.log(label + ' selected')} className="like_tab alarm_tab pr">
            {
            /*
              ** 분기처리 **
              cf.전속매물 수요 관련 화면설계 : #86:1-a, #87:2-a
              개인 : 전속매물 수요 I 전속매물 공급 I 공통
              기업 : 전속매물 수요 I 전속매물 공급 I 공통
              중개사 : 전속매물 수요 I 분양 수요 I 공통
              전문중개사 : 전속매물 수요 I 분양 수요 I 전속매물 공급 I 공통
              분양프로젝트 팀원 : 분양 공급 I 공통
              */
            }
           
           {
             
             (user_type_alramReturn()&&user_type_alramReturn().length>=1)&&user_type_alramReturn().map((value)=>{
               console.log('values:::',value);
              return value;
            })
            

            /*(tab_return() && tab_return().length>=1)&&
            tab_return().map((value)=> {
              console.log('tab Data:',value);
              return value;
             })*/       
           }
             {/*<Tab label="tab1">tab1 contents</Tab>
             <Tab label="tab2">tab2 contents</Tab>*/}
        
          </Tabs>
      </WrapRequest>
  </Container>
  );
}

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
