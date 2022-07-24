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
import login_user from '../../../../store/modules/login_user';
import ModalAlarm from "./modal/ModalAlarm";

//redux
import {useSelector} from 'react-redux';

//servercontroller
import serverController from '../../../../server/serverController';

export default function ItemTabList({value,alramsetting,setalramsetting}) {

  const [menu2,setMenu2] = useState(false);
  const showModal2 =()=>{
    setMenu2(!menu2);
  }
  const [item,setItem] = useState(false);
   
  const login_user = useSelector(data=>data.login_user);

  const notiset_rsv_change = async(e) => {
    if(e.target.checked){
      let body_info = {
        change_value : 1,
        target : 'notiset_rsv',
        mem_id : login_user.memid,
        company_id : login_user.company_id,
        user_type:login_user.user_type
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
        company_id : login_user.company_id,
        user_type:login_user.user_type
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

  const notiset_bunyangsuyo_project_change = async(e) => {
    if(e.target.checked){
      let body_info={
        change_value : 1,
        target:'notiset_bunyangsuyo_project',//신규분양프로젝트 등록되었을시 관련 처리하는 부분(알림받을지말지)
        mem_id : login_user.memid,
        company_id : login_user.company_id,
        user_type:login_user.user_type
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
    }else{
      let body_info={
        change_value : 0,
        target:'notiset_bunyangsuyo_project',
        mem_id : login_user.memid,
        company_id : login_user.company_id,
        user_type:login_user.user_type
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
  const notiset_bunyangsuyo_newlive_change = async(e) => {
    if(e.target.checked){
      let body_info={
        change_value : 1,
        target:'notiset_bunyangsuyo_newlive',
        mem_id : login_user.memid,
        company_id : login_user.company_id,
        user_type:login_user.user_type
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
    }else{
      let body_info={
        change_value : 0,
        target:'notiset_bunyangsuyo_newlive',
        mem_id : login_user.memid,
        company_id : login_user.company_id,
        user_type:login_user.user_type
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
  const notiset_bunyangsuyo_mylive_change = async(e) => {
    if(e.target.checked){
      let body_info={
        change_value : 1,
        target:'notiset_bunyangsuyo_mylive',
        mem_id : login_user.memid,
        company_id : login_user.company_id,
        user_type:login_user.user_type
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
    }else{
      let body_info={
        change_value : 0,
        target:'notiset_bunyangsuyo_mylive',
        mem_id : login_user.memid,
        company_id : login_user.company_id,
        user_type:login_user.user_type
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
  const notiset_bunyangsuyo_myvisit_change = async(e) => {
    if(e.target.checked){
      let body_info={
        change_value : 1,
        target:'notiset_bunyangsuyo_myvisit',
        mem_id : login_user.memid,
        company_id : login_user.company_id,
        user_type:login_user.user_type
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
    }else{
      let body_info={
        change_value : 0,
        target:'notiset_bunyangsuyo_myvisit',
        mem_id : login_user.memid,
        company_id : login_user.company_id,
        user_type:login_user.user_type
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
                  <Input type="checkbox" id="check1" checked={alramsetting['notiset_rsv'] == 1?true:false} onChange={notiset_rsv_change}/>
                  <Label for="check1">
                    <Span/>
                    예약된 알림 요약
                  </Label>
                  <Desc>
                  모든 알림을 7:00 오후에 일일 요약 알림으로 받습니다.<br/>
                  전송 시간을 맞춤설정하려면 탭하세요.
                  </Desc>
                </Checkbox>
                <Checkbox>
                  <Input type="checkbox" id="check2" checked={alramsetting['notiset_bunyangsuyo_project'] == 1?true:false} onChange={notiset_bunyangsuyo_project_change}/>
                  <Label for="check2">
                    <Span/>
                    분양 중개건
                  </Label>
                  <Desc>
                    알림수신: 신규 분양프로젝트 등록시
                  </Desc>
                </Checkbox>
                <Checkbox>
                  <Input type="checkbox" id="check3" checked={alramsetting['notiset_bunyangsuyo_newlive'] == 1?true:false} onChange={notiset_bunyangsuyo_newlive_change}/>
                  <Label for="check3">
                    <Span/>
                    분양Live방송 예고
                  </Label>
                  <Desc>
                    알림수신: 신규 Live방송예고 등록시
                  </Desc>
                </Checkbox>
                <Checkbox>
                  <Input type="checkbox" id="check4" checked={alramsetting['notiset_bunyangsuyo_mylive']==1 ? true:false} onChange={notiset_bunyangsuyo_mylive_change}/>
                  <Label for="check4">
                    <Span/>
                    내 Live시청 예약
                  </Label>
                  <Desc>
                    알림수신: 초대장 발송시 / 방송일시수정된 경우 / 방송취소된 경우
                  </Desc>
                </Checkbox>
                <Checkbox>
                  <Input type="checkbox" id="check5" checked={alramsetting['notiset_bunyangsuyo_myvisit']==1 ? true:false} onChange={notiset_bunyangsuyo_myvisit_change}/>
                  <Label for="check5">
                    <Span/>
                    내 방문예약
                  </Label>
                  <Desc>
                    알림수신: 방문3일전,1일전 / 예약해제된 경우
                  </Desc>
                </Checkbox>
              </WrapCheckBox>
            </TabContent>
            {
              item ?
              <ModalAlarm item={item} setItem={setItem}/>
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
