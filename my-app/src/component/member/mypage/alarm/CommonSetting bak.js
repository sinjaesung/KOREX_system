//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//img

import Check from "../../../../img/map/radio.png";
import Checked from "../../../../img/map/radio_chk.png";

import { Mobile, PC } from "../../../../MediaQuery"

//redux
import {useSelector} from 'react-redux';

//server
import serverController from '../../../../server/serverController';

export default function ItemTabList({value,setalramsetting,alramsetting}) {
  console.log('alrmasetting whatss:',alramsetting);
  const login_user=useSelector(data=>data.login_user);
  console.log('lgoin_user sss:',login_user);
  const [menu2,setMenu2] = useState(false);
  const showModal2 =()=>{
    setMenu2(!menu2);
  }
  
  const notiset_mrk_change= async(e) =>{
    if(e.target.checked){
      let body_info={
        change_value:1,
        target:'notiset_mrk',
        mem_id:login_user.memid
      };
      let res=await serverController.connectFetchController('/api/alram/alramSetting_process','POST',JSON.stringify(body_info));
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
        change_value:0,
        target:'notiset_mrk',
        mem_id:login_user.memid
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
                  <Input type="checkbox" id="check1" checked={alramsetting['notiset_mrk']==1?true:false} onChange={notiset_mrk_change}/>
                  <Label for="check1">
                    <Span/>
                    마케팅 정보 수신에 대한 동의
                  </Label>
                  <Desc>
                  (2020.00.00)
                  </Desc>
                </Checkbox>
                <DescInfo>

                - KOREX가 제공하는 이벤트 및 혜택정보 등의 알림의 정보를 관계법령(「개인정보보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등)의 규정을 준수하여 모바일 앱푸시, 이메일, 문자를 통해 발송합니다.
  단, 광고성 정보 이외의 의무적으로 안내되어야 하는 정보는 수신동의 여부와 무관하게 제공됩니다.
                </DescInfo>
              </WrapCheckBox>
              
            </TabContent>
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
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    margin-bottom:calc(100vw*(20/428));
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
const DescInfo = styled.div`
  width:100%;
  font-size:14px;font-weight:500;transform:skew(-0.1deg);
  color:#707070;line-height:1.5;word-break:keep-all;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vW*(14/428));
    }
`