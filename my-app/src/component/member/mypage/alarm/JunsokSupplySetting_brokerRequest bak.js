//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//img

import Check from "../../../../img/map/radio.png";
import Checked from "../../../../img/map/radio_chk.png";
import Arrow from "../../../../img/member/arrow_right.png";

//component
import { Mobile, PC } from "../../../../MediaQuery"
import ModalAlarm from "./modal/ModalAlarm";

//server
import serverController from '../../../../server/serverController';

//redux
import {useSelector} from 'react-redux';

export default function ItemTabList({value,alramsetting,setalramsetting}) {
  console.log('alramsetting값 valuess:',alramsetting);
  const login_user=useSelector(data=>data.login_user);

  const [menu2,setMenu2] = useState(false);
  const showModal2 =()=>{
    setMenu2(!menu2);
  }
  const [item,setItem] = useState(false);
  
  const [brokerRequest_productlist,setBrokerRequest_productlist]= useState([]);
  useEffect( async () => {
    //어떤 요청의뢰자가 등록/의뢰 로 인해서 생성된 매물들인지 구한다. 현재 테이블 구조상 prd_id수정히스토리도 다루고있기에 request_mem_id에 대한 내역 여러개 있을수있고(같은 매물에 대해서) prd_idneity_id distinct필요해보임(그룹핑) 보낼것은 마이페이지 로그인mem_id일것임.
    /*let login_res=await serverController.connectFetchController('/api/auth/islogin','get');
   console.log('islogin request result myrequest>>>',login_res,login_res.login_session);
   */
   let body_info ={
      user_type : login_user.user_type,//개인회원이면 그 신청자 한명이 했었던 의뢰매물만 나오면되고, 기업회원이라면 그 회원의 소속companyid를 구하고, 그 comapnyid하 모든 memid들이 각rewqustememid인 내역들 구하낟.
   };
   console.log('>>>>post parameter list:',body_info);
   try{
     let res=await serverController.connectFetchController('/api/broker/user_brokerRequestlistview','post',JSON.stringify(body_info));
     console.log('res_result:',res);
     //alert(res);

     if(res){
       if(res.success){
         if(res.result_data){
          setBrokerRequest_productlist(res.result_data);

         }
       }

     }else{
     }

   }catch(e){

   }
 },[]);//상태변화시마다 실행은 아니고 로드시점 최초한번.

  const notiset_brokerprd_change=async(e) => {
    if(e.target.checked){
      let body_info = {
        change_value : 1,
        target:'notiset_brokerprd',
        mem_id:login_user.memid,
        user_type:login_user.user_type,
        company_id:login_user.company_id
      };
      let res=await serverController.connectFetchController('/api/alram/alramSetting_process','POST',JSON.stringify(body_info));
      if(res){
        if(res.success){
          console.log('res reuslstssss:',res);
          
          setalramsetting(res.result);
        }else{
          alert(res.message);
        }
      }
    }else{
      let body_info={
        change_value:0,
        target:'notiset_brokerprd',
        mem_id:login_user.memid,
        user_type:login_user.user_type,
        company_id:login_user.company_id
      };
      let res=await serverController.connectFetchController('/api/alram/alramSetting_process','POST',JSON.stringify(body_info));
      if(res){
        if(res.success){
          console.log('res resultsssss:',res);

          setalramsetting(res.result);
        }else{
          alert(res.message);
          
        }
      }
    }
  }

  const notiset_rsv_change = async(e) => {
    if(e.target.checked){
      let body_info = {
        change_value : 1,
        target : 'notiset_rsv',
        mem_id : login_user.memid,
        user_type:login_user.user_type,
        company_id:login_user.company_id
      };
      let res= await serverController.connectFetchController('/api/alram/alramSetting_process','POST',JSON.stringify(body_info));
      if(res){
        if(res.success){
          console.log('res resultsss:',res);

          setalramsetting(res.result);
        }else{
          alert(res.message);
        }
      }
    }else{
      let body_info={
        change_value : 0,
        target:'notiset_rsv',
        mem_id : login_user.memid,
        user_type:login_user.user_type,
        company_id:login_user.company_id
      };
      let res=await serverController.connectFetchController('/api/alram/alramSetting_process','POST',JSON.stringify(body_info));
      if(res){
        if(res.success){
          console.log('res reusltsss:',res);
          
          setalramsetting(res.result);
        }else{
          alert(res.message);
        }
      }
    }
  }
    return (
        <Container>
            <TabContent>
              <WrapCheckBox>
                <Checkbox>
                  <Input type="checkbox" id="check1" checked={alramsetting['notiset_rsv']==1?true:false} onChange={notiset_rsv_change}/>
                  <Label for="check1">
                    <Span/>
                    예약된 알림 요약
                  </Label>
                  <Desc>
                  모든 알림을 7:00 오후에 일일 요약 알림으로 받습니다.<br/>
                  전송 시간을 맞춤설정하려면 탭하세요.
                  </Desc>
                </Checkbox>
                <ItemSetting onClick={() =>{setItem(true)}}>
                  <Txt>내 중개의뢰 설정</Txt>
                  <Desc>
                    각 중개의뢰별 알림 설정 관리
                  </Desc>
                  <ArrowImg src={Arrow}/>
                </ItemSetting>
                <Checkbox>
                  <Input type="checkbox" id="check2" checked={alramsetting['notiset_brokerprd']==1?true:false} onChange={notiset_brokerprd_change}/>
                  <Label for="check2">
                    <Span/>
                    내 중개의뢰
                  </Label>
                  <Desc>
                    알림수신: 상태 변경시
                  </Desc>
                </Checkbox>
                
              
              </WrapCheckBox>
            </TabContent>
            {
              item ?
              <ModalAlarm item={item} setItem={setItem} brokerRequest_productlist={brokerRequest_productlist}/>
              :
              null
            }
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
    width:680px;
    margin:0 auto;
    @media ${(props) => props.theme.mobile} {
      width:100%;
      margin:calc(100vW*(80/428)) auto;
      }
`
const TabContent = styled.div`
  position:relative;
  width:100%;
  padding:30px 0;margin-top:17px;
  margin:0 auto 17px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding:0 calc(100vw*(27/428)) calc(100vw*(23/428));
    margin:calc(100vw*(23/428)) auto;
    }
`
const WrapCheckBox = styled.div`
  width:550px;
  padding-left:30px;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding-left:calc(100vw*(30/428));
    }
`
const Checkbox = styled.div`
  width:100%;
  margin-bottom:40px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    margin-bottom:calc(100vw*(50/428));
    }
`
const ItemSetting = styled(Checkbox)`
  cursor:pointer;
  position:relative;
`
const Txt = styled.p`
  font-size:15px;
  color:#4a4a4a;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    }
`
const ArrowImg = styled.img`
  display:inline-block;width:8px;
  position:absolute;right:0;
  top:50%;transform:translateY(-50%);
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(8/428));
    }
`

const Input = styled.input`
  display:none;
  &:checked+label span{ background:url(${Checked}) no-repeat; background-size:100% 100%;}
`
const Label = styled.label`
  display:inline-block;
  font-size:15px;color:#4a4a4a;
  font-weight:500;transform:skeW(-0.1deg);
  font-family:'nbg',sans-serif;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    }
`
const Span = styled.span`
  display:inline-block;
  width:20px;height:20px;
  background:url(${Check}) no-repeat; background-size:100% 100%;
  vertical-align:middle;
  margin-right:10px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    height:calc(100vW*(20/428));
    margin-right:calc(100vw*(10/428));
    }
`
const Desc = styled.div`
  padding-left:30px;
  font-size: 15px;
  margin-top:15px;transform:skew(-0.1deg);
  line-height: 1.33;
  text-align: left;
  color: #979797;
  @media ${(props) => props.theme.mobile} {
    padding-left:calc(100vw*(30/428));
    font-size:calc(100vW*(13/428));
    margin-top:calc(100vw*(15/428));
    }
`
