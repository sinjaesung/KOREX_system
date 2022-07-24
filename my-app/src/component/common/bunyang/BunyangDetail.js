//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

//style
import styled from "styled-components"

//material-ui
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Card from '@mui/material/Card';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

//img
import ItemImg from "../../../img/main/item01.png";
import SwipImg from "../../../img/main/swip_img.png";
import Homepage from "../../../img/main/go_home.png";
import Exit from "../../../img/main/exit.png";
import Heart from "../../../img/main/heart.png";
import HeartCheck from "../../../img/main/heart_check.png";
import Call from "../../../img/main/call.png";
import Live from "../../../img/main/live.png";
import Chat from "../../../img/main/chat.png";
import BackBtn from '../../../img/notice/back_btn.png';

//채널상담 서비스관련 콤퍼넌트
import ChannelServiceElement from '../../common/ChannelServiceElement';

import localStringData from '../../../const/localStringData';
import serverController from '../../../server/serverController'
import { useSelector } from 'react-redux';
import CommonContact from '../contact/commonContact';
import BunyangDetailCont from './BunyangDetailCont';


function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }


SwiperCore.use([Navigation]);
export default function BunyangDetail({ bunyangDetail, updatePageIndex, setLive, setDetailImg, setCal, BunyangDate, clickId, setImgArr, imgArr }) {

  const [contact, setContact] = useState({});

  //ChannelServiceElement.shutdown();//분양상세모달 접근시마다 일단 초기화시키고,

  const [rightTopData, setRightTopData] = useState({title:"", number:"", option:[], address:""});
  const [rigthDetailData, setRigthDetailData] = useState([]);
  const [hashTagArr, setHashTagArr] = useState([]);
  // 처음부터 렌더하게되면 이미지 슬라이더가 먹지않아 이미지가 받아온 후 렌더되도록 하였습니다.
  const [firstRender, setFirstRender] = useState(false);

  const loginUser = useSelector(state => { return state.login_user });

  const [invitetour, setinvitetour] = useState(null);
  const [livetour, setlivetour] = useState(null);


  // 클릭한 아이디를 서버에 보내고 데이터를 받아와 적용시키면 됩니다.
  useEffect(() => {
    // console.log(clickId);

    // 우측 상단 데이터입니다.
    setRightTopData({
      title: "충남내포신도시2차대방엘리움더센트럴",
      number: "2D0000324",
      option: ["충청남도", "아파트", "민간분양"],
      address: "충청남도 홍성군 홍북읍 신경리 947번지",
      LikeChecked: false
    })

    // 우측 하단 데이터입니다.
    setRigthDetailData([
      { title: "분양세대", content: BunyangDate.desc1 },
      { title: "분양면적", content: BunyangDate.desc2 },
      { title: "전용면적", content: "77㎡ ~ 85㎡" },
      { title: "분양가격", content: "35,599 ~ 44,049 만원" },
      { title: "전용면적", content: "77㎡ ~ 85㎡" },
      { title: "모델하우스 주소", content: "서울특별시 강남구 서초동 길동아파트 103 103호" },
      { title: "중개보수", content: "-" },
      { title: "Live 방송일시", content: liveTime(new Date("2021-01-01 09:00")) },
    ])

    // HashTag 배열입니다.
    setHashTagArr([
      "#hashtag", "#hashtag", "#hashtag"
    ])

    // 이미지 배열입니다.
    setImgArr([
      SwipImg, SwipImg
    ])
    setFirstRender(true);
  }, [])

  useEffect(async()=>{
    console.log('분양 디테일접근시에 해당 분양프로젝트에 되어있는 채팅키값을 지정한다>>채팅상담이 가능하게>>다른 분양프로젝트 클릭시마다 클릭된 프로젝트의 채팅상담채널로 처리>>',bunyangDetail);
    
    /*if(bunyangDetail.chat_key && bunyangDetail.chat_key!=''){
      ChannelServiceElement.boot({
        "pluginKey" : bunyangDetail.chat_key,
        "customLauncherSelector" : "#chat-button",
        "hideChannelButtonOnBoot" : true
      });
    }*/
    
    if(!bunyangDetail.bp_id)
    return;

    serverController.connectFetchController(`/api/bunyang/reservation/setting?bp_id=${bunyangDetail.bp_id}&tour_type=4&is_active=1`, 'GET', null, function (res) {
      if (res.success == 1) {
        if (res.data[0]) {
          console.log('livetour:',res.data);
          let tourlist=res.data;
          let date_now=new Date();
          let date_year=date_now.getFullYear();
          let date_month=date_now.getMonth()+1;
          let date_date=date_now.getDate();

         // console.log('지금 현재의 날짜:',date_now,new Date(date_year+'-'+date_)Mon);
          //조건들중에서 필터링>>된것중에서 첫 요소.

          let filter_list = tourlist.filter((v) => { 
            console.log('tourFilter listss:v:',v,v.tour_start_date);
            if(new Date(date_year+'-'+date_month+'-'+date_date) <= new Date(v.tour_start_date)){
              console.log('현재 오늘날짜보다 더 높은값들만 필터링:',v);
              return v;
            }           
          });
          console.log('==>>>오늘 이후의 날짜들만 filter_list:',filter_list);
          filter_list= filter_list.sort(function(a,b){
            if( a > b) return 1;
            if( a==b) return 0;
            if( a < b) return -1;
          });
          console.log('오름차순정렬한 가장 첫 요소:',filter_list,filter_list[0]);
          setlivetour(filter_list[0]);
          //라이브예약 셋팅내역들 조회하는데, 이중에서 그.분양디테일시에만 해당 api호출한다>>> 현재보다 미래의 날짜중에서 가장 가까운값.
        } else {
          setlivetour(null);
        }
      }
    });

    serverController.connectFetchController(`/api/bunyang/reservation/setting?bp_id=${bunyangDetail.bp_id}&tour_type=3&is_active=1`, 'GET', null, function (res) {
      if (res.success == 1) {
        console.log('분양모달상세 디테일상세 셋팅 요일들:::', res);
        if (res.data[0]) {
           console.log('invitetour::',res.data[0]);
          setinvitetour(res.data[0]);
        } else {
          //아무런 데이터가 없다는것 한개도 없다는것
          setinvitetour(null);
        }
      }
    });
  }, [bunyangDetail]);

  // 날짜 넥스트 변환
  const liveTime = (date) => {
    return `${date.getFullYear()}.${addZero(date.getMonth() + 1)}.${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
  }

  // 날짜에 0 추가
  const addZero = (text) => {
    text = String(text);
    if (text.length == 1) {
      text = "0" + text;
    }
    return text;
  }

  // 옵션사이에 " / " 넣기
  const optionList = () => {
    let optionText = rightTopData.option[0];
    for (let i = 1; i < rightTopData.option.length; i++) {
      optionText += " / " + rightTopData.option[i];
    }
    return optionText;
  }

  // updatePageIndex값을 바꾸고 부모에게 클릭한 아이디값을 전달합니다.
  const onClickList = (value) => {
    // updatePageIndex(2);

    if (!invitetour) {
      alert("방문예약이 일시 중지되었습니다. 해당 분양사에 채팅 또는 전화 문의하시기 바랍니다.");
      return;
    }
    updatePageIndex(2);
  }

  return (
    <>
      <Sect_R2>
        <BunyangDetailCont loginUser={loginUser} bunyangDetail={bunyangDetail} onClickList={onClickList} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} livetour={livetour} optionList={optionList} numberWithCommas={numberWithCommas} contact={contact} livetour={livetour} invitetour={invitetour} />
      </Sect_R2>
    </>
  )
}

const Sect_R2 = styled.div`
  width: 95%;
  height:100%;
  padding:0.625rem 0 0.625rem;
  margin:0 auto;
`