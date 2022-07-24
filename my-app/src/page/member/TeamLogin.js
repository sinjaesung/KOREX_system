//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import styled from "styled-components"

import crypto from 'crypto-js';

//component
import MainHeader from '../../component/common/MainHeader';
import SubTitle from '../../component/common/SubTitle';
import LoginTab from '../../component/member/login/TeamLoginTab';
import LoginInput from '../../component/member/login/TeamLoginInput';
import MainFooter from '../../component/common/MainFooter';
import TermService from '../../component/common/TermsOfService';
import TermPrivacy from '../../component/common/TermsOfPrivacy';
import TermLocation from '../../component/common/TermsOfLocation';
import Bunyang from '../../component/common/bunyang/Bunyang';
import ImgDetail from "../../component/common/bunyang/ImgDetail";
import LiveModal from "../../component/common/bunyang/LiveModal";
import ModalCalendar from "../../component/common/bunyang/ModalCalendar";

import CommonHeader from '../../component/common/commonHeader';
import CommonFooter from '../../component/common/commonFooter';

import ChannelServiceElement from '../../component/common/ChannelServiceElement';

//server process
import serverController from '../../server/serverController';

//redux
import { useSelector } from 'react-redux';

export default function Login({ match }) {
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

    const history = useHistory();
    console.log('teamLogin페이지 도달 :', match.params, match.params.authinfo);

    const login_user = useSelector(data => data.login_user);

    var authinfo = match.params.authinfo;
    console.log('authinfosss:', authinfo, typeof authinfo);

    let authinfo_querystring_array = authinfo && authinfo.split(' ');
    let make_original_encrypt = '';

    let teamjoin_transfer_querystring = '';

    for (let ss = 0; ss < authinfo_querystring_array.length; ss++) {
        let items = authinfo_querystring_array[ss];
        if (ss == authinfo_querystring_array.length - 1) {
            make_original_encrypt += items;
            teamjoin_transfer_querystring += items;
        } else {
            make_original_encrypt += (items + '/');
            teamjoin_transfer_querystring += (items + ' ');
        }
    }
    console.log('복구한 원본 문자열:', make_original_encrypt, decrypt(make_original_encrypt, "infoquerystring"));

    var authinfo_final = decrypt(make_original_encrypt, "infoquerystring");

    var invite_memid = authinfo_final.split(',')[0];
    invite_memid = invite_memid.split(":")[1];
    var invite_companyid = authinfo_final.split(',')[1];
    invite_companyid = invite_companyid.split(":")[1];
    var invite_mem_phone = authinfo_final.split(',')[2];
    invite_mem_phone = invite_mem_phone.split(":")[1];
    var invite_mem_usertype = authinfo_final.split(',')[3];
    invite_mem_usertype = invite_mem_usertype.split(":")[1];
    var receiver_phone = authinfo_final.split(',')[4];
    receiver_phone = receiver_phone.split(":")[1];

    console.log('invite_mem_usertype::', invite_mem_usertype);

    useEffect(async () => {
        //페이지 도달시점에 판단을 한다. 관련된 계정정보가 존재하면 그대로 냅두고, 존재하지않으면 가입페이지로 이동시킴(리다렉션);
        let body_info = {
            invite_memid_val: invite_memid, //초대한 사람 memid
            invite_companyid_val: invite_companyid, //초대한 사람 및 피초대자의 배정된 사업체id,
            invite_mem_usertype_val: invite_mem_usertype,//초대한 사람 및 피초대자의 유저타입(중개사,기업,분양사)
            receiver_phone_val: receiver_phone,
            register_type_val: 'team',//팀원으로 가입된 사람들 중 쿼리 조건조회
        };
        //팀원초대한 사람이 링크로 들어온 페이지로 초대시에 관련된memid유저 user정보가 없는경우(아예 초대된적 자체가 없던경우) 이런경우 comapny_member도 없을(팀원초대내역들)도 없을가능성있음.  1. users내역자체가 없다면 팀유저최초추가join으로 추가, users추가/companymember초대된것으로 해서 추가.
        //2. user내역이 있다면 login페이지에 머물면서(해당 곚벙users정보 자체는 있기에)에서 companymember에 바로 추가.

        let teamUser_exists_request = await serverController.connectFetchController('/api/auth/team/Teamuser_exists_request', 'POST', JSON.stringify(body_info));
        if (teamUser_exists_request) {
            console.log('teamuser_exists reuqestss:', teamUser_exists_request);
            let get_teamuser_memid = teamUser_exists_request.result;//이미 존재하고있던 그 user정보memid

            if (teamUser_exists_request.success) {
                console.log('리턴 결과값::', teamUser_exists_request.type);
                if (teamUser_exists_request.type == 'already_team_exists') {
                    //팀원 초대 수락한경우(이미 소속팀원정보로 존재하는 소속에 참여한 경우에는 관련한 가입,초대로의 이동 관련 기능 예방
                    alert('이미 해당 소속/초대자/휴대폰번호 정보로 가입된 정보가 존재합니다. 로그인페이지에서 로그인해주세요');
                    history.push('/MemberLogin');
                } else {
                    //팀원 초대 아직 수락안한경우
                    history.push('/TeamInvitefinal/' + get_teamuser_memid + '  ' + teamjoin_transfer_querystring);//가입성공한 memid를 보낸다. 참여누르는경우에 누르는경우에 한해서 특정 팀원으로써의 소속추가됨.
                }
            } else {
                //success;false아예 user정보자체가 없는 경우 팀원(유저user)추가 가입페이지로 이동
                //리다렉션
                history.push('/TeamJoin/' + teamjoin_transfer_querystring);
            }
        }
    }, []);
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
                <SubTitle title={"로그인"} rank={false} />
                <LoginTab usertype={invite_mem_usertype} />
                <LoginInput authinfo={authinfo_final} />
            </div>
            <CommonFooter />
            {/* <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/> */}
        </div>
    );
}