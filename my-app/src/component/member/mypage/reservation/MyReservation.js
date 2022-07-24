//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col, } from '../../../../theme';

//material-ui
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';

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

import { Mobile, PC } from "../../../../MediaQuery"

import ReserveListPage from "./ReserveList";

import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';

//redux
import { useSelector } from 'react-redux';
//server process
import serverController from '../../../../server/serverController';

/*data map*/
const ReserveListItem = [
  {
    reserve_id: 0,
    src: Item,
    path: "/",
    condition: "오늘",
    number: "1234567889",
    address: "충남내포신도시2차대방엘리움더센트럴",
    locaImg: Location,
    date: "2020.01.01 (월)",
    time: "오전1T (09:00-12:00)",
    type: "today"
  },
  {
    reserve_id: 1,
    src: Item,
    path: "/",
    condition: "2일후",
    number: "1234567889",
    address: "충남내포신도시2차대방엘리움더센트럴",
    locaImg: Location,
    date: "2020.01.01 (월)",
    time: "오전1T (09:00-12:00)",
    type: "days"
  },
  {
    reserve_id: 2,
    src: Item,
    path: "/",
    condition: "예약취소",
    number: "1234567889",
    address: "충남내포신도시2차대방엘리움더센트럴",
    locaImg: Location,
    date: "2020.01.01 (월)",
    time: "오전1T (09:00-12:00)",
    type: "cancel"
  }
]

export default function Reserve({ setMap, setFilter, setReserve, value, type, type2, updateModal, updateMapModal, updateReserveModal, listData, setListData, alramsetting_tiny, setalramsetting_tiny }) {

  const login_user = useSelector(data => data.login_user);

  //... 눌렀을때(메뉴)  
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  const topInfoContent = () => {
    return (
      <IconButton onClick={() => { setFilter(true); updateModal(); }}>
        <FilterListIcon />
      </IconButton>
    )
  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">내 물건투어 예약</p>
        {/* 수정코드입니다. */}
        <Sect_R2>
          <div className="par-spacing">
            <CommonTopInfo length={listData.length} leftComponent={topInfoContent()} />
          </div>
          {/* -- 원래 코드입니다. */}
          {/*
              <TopInfo>
                <All>총 <GreenColor>3</GreenColor> 건</All>
                <div className="cursor-p" onClick={() => { setFilter(true); updateModal(); }}>
                  <FilterImg src={Filter} alt="filter"/>
                </div>
              </TopInfo>
            */}

          <div className="par-spacing-after">
            <ul className="scroll-y">
              {
                listData.map((value) => {
                  let reserv_info = value.reserv_info;
                  // let match_tour_info=value.match_tour_info;
                  let match_product_info = value.match_product_info;
                  if (match_td_info) {
                    var match_td_info = value.match_td_info[0];
                  } else {
                    var match_td_info = null;
                  }

                  var tour_start_date = reserv_info.tour_reservDate;//각 신청내역이 어떤날자에(어떤요일에있던) 예약한건지
                  var nowdate = new window.Date();
                  var now_year = nowdate.getFullYear();
                  var now_month = nowdate.getMonth() + 1;
                  if (now_month < 10) now_month = '0' + now_month;
                  var now_date = nowdate.getDate();
                  if (now_date < 10) now_date = '0' + now_date;
                  var nowdate_string = now_year + '-' + now_month + '-' + now_date;//문자열 날짜 변경. 현재의 날짜 문자열


                  if (new window.Date(tour_start_date).getTime() > new window.Date(nowdate_string).getTime()) {
                    //신청투어일이 현재보다 미래의 시간인경우 오늘보다 미래인경우. 투어신청일이 오늘이라면 값은 true일것임. >인경우는 date기준에선 투어일이 오늘보다 +1일이상 큰 경우.
                    var time_distance = new window.Date(tour_start_date).getTime() - new window.Date(nowdate_string).getTime();//일기준이기에 +1,2,3,..정수일 이상 차이이다.차이값은 절대값 1,2,3 정수형태 +1,+2,+3,...처리한다.
                    time_distance = (time_distance / (60 * 60 * 24 * 1000));
                    var time_status = 'mirae';
                    var opacity = 1;
                    var cond = '';
                    var color = '#fe7a01'
                  } else if (new window.Date(tour_start_date).getTime() == new window.Date(nowdate_string).getTime()) {
                    //오늘이 투어신청일
                    var time_distance = 0;//오늘이기에 차이값 없음.
                    var time_status = 'today';
                    var opacity = 1;
                    var cond = '';
                    var color = '#fe7a01';
                  } else {
                    //투어신청일이 이미 지나간 경우.-1일 어제보다 이전에 한 내역이였다면.마감처리
                    var time_distance = new window.Date(tour_start_date).getTime() - new window.Date(nowdate_string).getTime();
                    time_distance = (time_distance / (60 * 60 * 24 * 1000));
                    var time_status = 'passed';
                    var opacity = 0.5;
                    var cond = '';
                    var color = '#01684b';
                  }

                  /*const type=()=>{
                    if(value.type == "today") {
                      return "#fe7a01"
                    }else if(value.type == "cancel") {
                      return "#707070"
                    } else if(value.type == "days") {
                      return "#01684b"
                    }
                  }
                  const type2=()=>{
                    if(value.type == "today") {
                      return 1
                    }else if(value.type == "cancel") {
                      return 0.5
                    } else if(value.type == "days") {
                      return 1
                    }
                  }*/
                  if (reserv_info.tr_status == 1) {
                    var cond = '예약해제';
                    var opacity = 0.5;
                    var color = '#707070';
                  } else if (reserv_info.tr_status == 2) {
                    var cond = '예약취소';
                    var opacity = 0.5;
                    var color = '#707070';
                  }
                  return (
                    <ReserveListPage setMap={setMap} setFilter={setFilter} updateMapModal={updateMapModal} updateReserveModal={updateReserveModal} setReserve={setReserve} value={reserv_info} match_td_info={match_td_info} match_product_info={match_product_info} time_distance={time_distance} time_status={time_status} color={color} opacity={opacity} cond={cond} alramsetting_tiny={alramsetting_tiny} setalramsetting_tiny={setalramsetting_tiny} setListData={setListData} />
                  )
                })
              }
            </ul>
          </div>
        </Sect_R2>
      </Wrapper>
    </>
  );
}


const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col}
`