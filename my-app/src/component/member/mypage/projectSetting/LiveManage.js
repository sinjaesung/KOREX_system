//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import ModalSearch from '../../../common/modal/ModalSearch';
import SearchInput_T1 from '../../../common/searchFilter/SearchInput_T1';
//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col, } from '../../../../theme';

//material-ui
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

//img
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Location from '../../../../img/member/loca.png';
import Set from '../../../../img/member/setting.png';
import Item from '../../../../img/main/item01.png';
import Noimg from '../../../../img/member/company_no.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import IconSearch from '../../../../img/main/icon_search.png';

import { Mobile, PC } from "../../../../MediaQuery"

//component
import LiveManageTop from "./LiveManageTop";
import LiveManageList from "./LiveManageList";

import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';


function checkZero(checkString) {
  return checkString.toString().length == 1 ? "0" + checkString : checkString;
}

function getDateType(date) {
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
  return temp;
}

function getDateTimeType(date) {
  var temp = `  ${date.getHours() > 12 ? "오후 " : "오전 "} ${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${checkZero(date.getMinutes())} `;
  return temp;
}

function calculateDiffTime(date) {
  var stDate = new Date();
  var endDate = date;

  var btMs = endDate.getTime() - stDate.getTime();
  var btDay = btMs / (1000 * 60 * 60 * 24);
  return Math.ceil(btDay) == 0 ? "오늘" : Math.ceil(btDay) + "일"
}

export default function LiveManage({ settingList, setFilter, reservationList, updateModal, setReservationList, updateReservationList }) {

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [isAllCheck, setIsAllCheck] = useState(false);

  const showModal = () => {
    setMenu(!menu);
  }

  const topInfoContent = () => {
    return (
      <div className="flex-right-center">
        <SearchInput_T1 placeholder={"예약자 검색"} value={search} onChange={(e) => { setSearch(e.target.value); setFilter((ob) => { ob.search = e.target.value; return ob; }) }} goAction={updateReservationList} />
        <IconButton onClick={() => { updateModal(); }}>
          <FilterListIcon />
        </IconButton>
      </div>
    )
  }

  // 개별 체크박스
  const onChangeCheckEl = (index) => {
    let newArr = reservationList;
    newArr[index].isChecked = !newArr[index].isChecked;
    setReservationList([...newArr]);

    let checkArr = [];
    for (let i = 0; i < newArr.length; i++) {
      checkArr.push(newArr[i].isChecked);
    }
    if (checkArr.some(i => i == false)) {
      setIsAllCheck(false);
    } else {
      setIsAllCheck(true);
    }
  }

  // 전체 체크박스
  const onChangeAllCk = (e) => {
    setIsAllCheck(!isAllCheck);
    let newArr = reservationList;
    for (let i = 0; i < newArr.length; i++) {
      if (newArr[i].tr_status == 0)
        newArr[i].isChecked = e.target.checked;
    }
    setReservationList([...newArr]);
  }

  return (
    <>
      <Wrapper>
        <p className="tit-a2">Live시청예약접수 관리</p>
        <div className="par-indent-left">
          <div className="capt-00 par-spacing">
            {/*!!@@ 211102_이형규>하자1.---ModalFilter.js의 방송selectbox 에 초기값이 있어야 함.*/}
            {/*!!@@ 211102_이형규>하자2.---ModalFilter.js의 방송selectbox 에 초기값 또는 선택값이 표시되어야 함.*/}
            <p>!!@@ ModalFilter.js 방송selectbox의 초기값 또는 선택값이 표시되어야 함.</p>
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          <div className="par-spacing">
            <CommonTopInfo length={reservationList.length} leftComponent={topInfoContent()} />
          </div>
          <div className="divider-a1" />
          <div className="par-spacing-before">
            <LiveManageTop reservationList={reservationList} isAllCheck={isAllCheck} onChangeAllCk={onChangeAllCk} />{/*방송 만료상태일때 LiveManageTop 사라져야함*/}
          </div>
          <div className="par-spacing-after">
            <ul className="scroll-y">
              {
                reservationList.map((value, index) => {
                  return (
                    <LiveManageList value={value} index={index} key={index} onChangeCheckEl={onChangeCheckEl} />
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