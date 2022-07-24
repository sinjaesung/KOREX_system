//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';

//style
import styled from "styled-components";

//theme
import { TtCon_Frame_By } from '../../../../theme'; 

//material-ui
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Card from '@mui/material/Card';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';


//img
import SwipImg from "../../../../img/main/swip_img.png";
import Homepage from "../../../../img/main/go_home.png";
import Exit from "../../../../img/main/exit.png";
import Call from "../../../../img/main/call.png";
import Live from "../../../../img/main/live.png";
import Chat from "../../../../img/main/chat.png";
import Heart from "../../../../img/main/heart.png";
import HeartCheck from "../../../../img/main/heart_check.png";
import BackBtn from '../../../../img/notice/back_btn.png';


//component
import localStringData from '../../../../const/localStringData'
import serverController from '../../../../server/serverController'
import { useSelector } from 'react-redux';
import CommonContact from '../../contact/commonContact';
import BunyangDetailCont from '../BunyangDetailCont';


function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
SwiperCore.use([]);

export default function BunyangDetail({ bunyangDetail, setLive, setDetailImg, setCal, status }) {

  //@@
  const [contact, setContact] = useState({});

  const [data, setData] = useState({
    hashtag: [],
    number: "",
    title: "",
    option: [],
    address: "",
    desc: [{ title: "", content: "" },],
  });


  const [active, setActive] = useState(bunyangDetail.isLike);
  const loginUser = useSelector(state => { return state.login_user });

  //@@
  const [invitetour, setinvitetour] = useState(null);
  const [livetour, setlivetour] = useState(null);


  const LikeBtnEvent = (e) => {
    console.log('동작');
    if (!loginUser.memid) {
      window.location.href = "/MemberLogin";
      return;
    }
    const data = {
      mem_id: loginUser.memid ? loginUser.memid : 0,
      prd_identity_id: bunyangDetail.prd_identity_id ? bunyangDetail.prd_identity_id : 0,
      bp_id: bunyangDetail.bp_id ? bunyangDetail.bp_id : 0,
      likes_type: 0,
    }

    serverController.connectFetchController("/api/likes/item", 'POST', JSON.stringify(data), function (res) {
      setActive(e => !e);
    });

  }

  // **api status 를 서버에 보내 정보들을 받아온다.
  useEffect(() => {
    // status -> 클릭한 아이디
    // console.log(status);
    setData({
      // 해시태그
      hashtag: ["hashtag", "hashtag", "hashtag"],
      // 상단 데이터
      number: "2D0000324",
      title: "충남내포신도시2차대방엘리움더센트럴우리집",
      option: ["충청남도", "아파트", "민간분양"],
      address: "충청남도 홍성군 홍북읍 신경리 947번지",
      // 하단 데이터 
      desc: [
        { title: "분양세대", content: "831세대" },
        { title: "분양면적", content: "103㎡ ~ 114㎡" },
        { title: "전용면적", content: "77㎡ ~ 85㎡" },
        { title: "분양가격", content: "35,599 ~ 44,049 만원" },
        { title: "전용면적", content: "77㎡ ~ 85㎡" },
        { title: "모델하우스 주소", content: "서울특별시 강남구 서초동 길동아파트 103동 103호" },
        { title: "중개보수", content: "-" },
        // new Date("2021-01-01 09:00") 대신 서버에서 가져온 날짜를 넣으면 됩니다.
        { title: "Live 방송일시", content: liveTime(new Date("2021-01-01 09:00")) },
      ],
    })
  }, [])

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
    let optionText = data.option[0];
    for (let i = 1; i < data.option.length; i++) {
      optionText += " / " + data.option[i];
    }
    return optionText;
  }

  // 하트 버튼 클릭
  const onClickLike = (e) => {
    // true 활성화, false 비활성화
    // console.log(e.target.checked);
  }


  return (
    <>
      <Wrapper>
        <BunyangDetailCont bunyangDetail={bunyangDetail} setLive={setLive} setDetailImg={setDetailImg} setCal={setCal} livetour={livetour} optionList={optionList} numberWithCommas={numberWithCommas} contact={contact} invitetour={invitetour} LikeBtnEvent={LikeBtnEvent} />
      </Wrapper>
    </>
  );
}


const Wrapper = styled.div`
  ${TtCon_Frame_By}
  height:100%;
  /* padding:0.625rem 0 0.625rem; */
  margin:0 auto;
`

