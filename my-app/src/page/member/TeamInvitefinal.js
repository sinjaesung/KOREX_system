//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import styled from "styled-components"

import crypto from 'crypto-js';

//component
import Teaminvitefinal from '../../component/member/login/TeamInvitefinal';

import CommonHeader from '../../component/common/commonHeader';
import CommonFooter from '../../component/common/commonFooter';

import ChannelServiceElement from '../../component/common/ChannelServiceElement';

export default function Join({ match }) {
  ChannelServiceElement.shutdown();

  const encrypt = (data, key) => {
    return crypto.AES.encrypt(data, key).toString();
  };

  const decrypt = (text, key) => {
    try {
      const bytes = crypto.AES.decrypt(text, key);
      // return JSON.parse(bytes.toString(crypto.enc.Utf8));
      return bytes.toString(crypto.enc.Utf8);
    } catch (err) {
      console.log('errorsss:', err);
    }
    return;
  }

  console.log('Teaminvitefinal match parsmss:', match);

  var big_split = match.params.memid.split('  ');
  var request_mem_id = big_split[0];
  var authinfo = big_split[1];

  let authinfo_querystring_array = authinfo && authinfo.split(' ');
  let make_original_encrypt = '';

  for (let ss = 0; ss < authinfo_querystring_array.length; ss++) {
    let items = authinfo_querystring_array[ss];
    if (ss == authinfo_querystring_array.length - 1) {
      make_original_encrypt += items;
    } else {
      make_original_encrypt += (items + '/');
    }
  }
  console.log('복구한 원본 문자열::', make_original_encrypt, decrypt(make_original_encrypt, "infoquerystring"));

  var authinfo_final = decrypt(make_original_encrypt, "infoquerystring");

  /* var invite_memid= authinfo_final.split(',')[0];
   invite_memid = invite_memid.split(":")[1];
   var invite_companyid= authinfo_final.split(',')[1];
   invite_companyid = invite_companyid.split(":")[1];
   var invite_mem_phone= authinfo_final.split(',')[2];
   invite_mem_phone = invite_mem_phone.split(":")[1];
   var invite_mem_usertype= authinfo_final.split(',')[3];
   invite_mem_usertype = invite_mem_usertype.split(":")[1];
   var receiver_phone= authinfo_final.split(',')[4];
   receiver_phone = receiver_phone.split(":")[1];*/

  // //이용약관
  // const [termservice, setTermService] = useState(false);
  // const openTermService = (onOff) =>{ setTermService(onOff);}

  // //개인정보처리방침
  // const [termprivacy, setTermPrivacy] = useState(false);
  // const openTermPrivacy = (onOff) =>{ setTermPrivacy(onOff);}

  // //위치기반서비스 이용약관
  // const [termlocation, setTermLocation] = useState(false);
  // const openTermLocation = (onOff) =>{ setTermLocation(onOff);}

  // //분양 모달
  // const [bunyang, setBunyang] = useState(false);
  // const openBunyang = (onOff) =>{ setBunyang(onOff);}
  // //라이브 시청 모달
  // const [live, setLive] = useState(false);
  // //분양 상세이미지 모달
  // const [detailimg, setDetailImg] = useState(false);
  // const [cal, setCal] = useState(false);

  return (
    <div className="flex-col-spabetween minHgt-100vh">
      <div>
        {/* <ImgDetail detailimg={detailimg} setDetailImg={setDetailImg}/>
          <LiveModal live={live} setLive={setLive}/>
          <ModalCalendar cal={cal} setCal={setCal}/>
          <Bunyang bunyang={bunyang} openBunyang={openBunyang} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal}/>
          <MainHeader openBunyang={openBunyang}/> */}
        <CommonHeader />
        <Teaminvitefinal request_mem_id={request_mem_id} auth_info={authinfo_final} />
      </div>
      <CommonFooter />
      {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
    </div>
  );
}