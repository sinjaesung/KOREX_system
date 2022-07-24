//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
//css
import styled from "styled-components"

import View from "../../../img/main/icon_view.png";
import OpenList from "../../../img/map/toggle_list.png";

//component
import { Mobile, PC } from "../../../MediaQuery";
import CommonSort from '../../common/searchFilter/commonSort';

//redux
import { MapProductEls } from '../../../store/actionCreators';
export default function MainHeader({ productRedux, updatePageIndex, historyInfo, setHistoryInfo, setReport, updown, setUpDown, typeStatus, length, sidebarlength }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [select, setSelect] = useState(false);

  var change_condition = '';

  function data_ascending(a, b) {
    console.log('데이터 오름차순 정렬진행>>:', a, b);
    if (a[change_condition] && b[change_condition]) {
      var left = a[change_condition];
      var right = b[change_condition];
    }
    return left > right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
  }
  function data_descending(a, b) {
    console.log('데이터 내림차순 정렬진행>>:', a, b);
    if (a[change_condition] && b[change_condition]) {
      var left = a[change_condition];
      var right = b[change_condition];
    }

    return left < right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
  }
  function data_ascending_probroker(a, b) {
    var left = a['probroker_info'][change_condition];
    var right = b['probroker_info'][change_condition];

    return left > right ? 1 : -1;
  }
  function data_descending_probroker(a, b) {
    var left = a['probroker_info'][change_condition];
    var right = b['probroker_info'][change_condition];

    return left < right ? 1 : -1;
  }
  function data_descending_complex_date(a, b) {
    var a_contract_year = a['contract_ym'].substr(0, 4);
    var a_contract_month = a['contract_ym'].substr(4, 2);
    var a_contract_date = parseInt(a['contract_dt']);
    if (a_contract_date < 10) {
      a_contract_date = '0' + a_contract_date
    }
    var b_contract_year = b['contract_ym'].substr(0, 4);
    var b_contract_month = b['contract_ym'].substr(4, 2);
    var b_contract_date = parseInt(b['contract_dt']);
    if (b_contract_date < 10) {
      b_contract_date = '0' + b_contract_date
    }
    var left = new window.Date(a_contract_year + '-' + a_contract_month + '-' + a_contract_date).getTime();//날짜문자열 2020-04-5 2020-04-19 이런식으로 만든다.
    var right = new window.Date(b_contract_year + '-' + b_contract_month + '-' + b_contract_date).getTime();

    return left < right ? 1 : -1;
  }
  function data_ascending_complex_date(a, b) {
    var a_contract_year = a['contract_ym'].substr(0, 4);
    var a_contract_month = a['contract_ym'].substr(4, 2);
    var a_contract_date = parseInt(a['contract_dt']);
    if (a_contract_date < 10) {
      a_contract_date = '0' + a_contract_date
    }
    var b_contract_year = b['contract_ym'].substr(0, 4);
    var b_contract_month = b['contract_ym'].substr(4, 2);
    var b_contract_date = parseInt(b['contract_dt']);
    if (b_contract_date < 10) {
      b_contract_date = '0' + b_contract_date
    }
    var left = new window.Date(a_contract_year + '-' + a_contract_month + '-' + a_contract_date).getTime();//날짜문자열 2020-04-5 2020-04-19 이런식으로 만든다.
    var right = new window.Date(b_contract_year + '-' + b_contract_month + '-' + b_contract_date).getTime();

    return left > right ? 1 : -1;
  }

  var filterText;
  if (typeStatus == '아파트단지') {
    filterText = ["최신계약일순", "과거계약일순", "가나다순"];
  } else if (typeStatus == '전문중개사') {
    filterText = ["물건등록최신순", "전문성높은순", "중개매너높은순", "가나다순"];
  } else {
    //아파트,오피,상가,사무실등 매물
    filterText = ["최신등록순", "높은가격순", "낮은가격순", "넓은면적순", "좁은면적순", "가나다순"];
  }

  const showModal = () => {
    setSelect(!select);
  }

  // const productLength = () => {
  //   if (typeStatus == "전문중개사" || typeStatus == "아파트단지") {
  //     return (<OrangeColor>{length}</OrangeColor>);
  //   } else {
  //     return (<Green>{length}</Green>);
  //   }
  // }

  const onClickEls = (e) => {
    //els특정 필터를 선택한 액션이며, typeStatus로 넘어온값을 통해서 전속매물리스트사이드바,전문중개사,단지별실거래 사이드바화면인지 구분가능합니다. 어떤 종류의 사이드바화면에서 제공되는 필터를 클릭했는지알수있으며, 각 상황별 다른 필터옵션들이 노출되며, 각 상황별로 매물관련된 사이드바화면에선 매물관련리덕스사이드바데이ㅓ 현재 있는것(서버통신없이)의 정렬상태를 처리할뿐이고, 전문중개사이면 전문문재가소관련리덕스 데이터 프론트엔드 정렬처리, 단지별실거래상황이면 단지별실거래관련 리덕스데이터정렬합니다.

    //e.target.dataset.num ( string ) -> e.target.value ( int )로 변경

    console.log(typeStatus + '처리 정렬 타입');
    console.log(productRedux);
    console.log('211207____eeee', e);
    console.log('211207____iiii', e.target.id);


    // if(typeStatus=='아파트단지'){
    if (typeStatus == '아파트단지') {
      // if(e.target.dataset.num == '0'){
      if (e.target.id == "최신계약일순") {
        //최신계약일순  단지별최근거래일
        var prev_complex_list = [...productRedux.block];
        prev_complex_list.sort(data_descending_complex_date);
        MapProductEls.updateBlock({ block: prev_complex_list });
        setAnchorEl(null);
      } else if (e.target.id == "과거계약일순") {
        // }else if(e.target.dataset.num == '1'){
        //과거계약일순  단지별최근거래일
        var prev_complex_list = [...productRedux.block];
        prev_complex_list.sort(data_ascending_complex_date);
        MapProductEls.updateBlock({ block: prev_complex_list });
        setAnchorEl(null);
      } else if (e.target.id == "가나다순") {
        // }else if(e.target.dataset.num == '2'){
        //가나다순  단지이름
        change_condition = 'complex_name';
        var prev_complex_list = [...productRedux.block];
        prev_complex_list.sort(data_ascending);
        MapProductEls.updateBlock({ block: prev_complex_list });
        setAnchorEl(null);
      }
    } else if (typeStatus == '전문중개사') {
      switch (e.target.id) {
        // switch(e.target.dataset.num){
        case "최신등록순":
          //물건등록 최신순
          //물건등록정보가 있는(최근등록된정보까지)것들에 한해서만 진행.없는것 요소 전문중개사는 정렬에서 제외.
          change_condition = 'recent_asign_productinfo';
          var prev_probroker_list = [...productRedux.probroker];
          console.log('prevproborkeerss:', prev_probroker_list);
          prev_probroker_list.sort(data_descending);
          MapProductEls.updateProbroker({ probroker: prev_probroker_list });
          setAnchorEl(null);
          break;

        case "전문성높은순":
          //전문성높은순
          setAnchorEl(null);
          break;

        case "중개매너높은순":
          //중개매너높은순
          setAnchorEl(null);
          break;

        case "가나다순":
          //가나다순.
          change_condition = 'company_name';
          var prev_probroker_list = [...productRedux.probroker];
          prev_probroker_list.sort(data_ascending_probroker);
          MapProductEls.updateProbroker({ probroker: prev_probroker_list });
          setAnchorEl(null);
          break;
      }
    } else {
      //매물 정렬 처리. productRedux.exclusive 매물리덕스사이드바데이터 현재상태값 개수 요소들리스트 정렬할뿐임. 서버액션으로인해서 요소리스트가 변경되면 정렬처리된것은 잃을뿐이고, 정렬된상태에서 여러 서버액션(마커클릭,지도변경,클러스터클릭,스크롤링,지도이동등시에 그냥 변경될뿐임.)변경후에 그 리스트상에서 띄워지는 리스트상에서 정렬을 수행할뿐임.
      console.log('동작확인', e.target.id);
      // console.log(e.target.dataset.num);
      // switch(e.target.dataset.num){
      switch (e.target.id) {
        case "최신등록순":
          console.log('동작');
          //최신순 prd_ientity_id기준 정렬처리후 갱신.
          change_condition = 'prd_identity_id';//int형태 value 정렬
          var prev_exclusive_list = [...productRedux.exclusive];
          console.log('prev exclusive:', prev_exclusive_list);
          prev_exclusive_list.sort(data_descending);
          console.log('정렬처리후 결과:', prev_exclusive_list);
          MapProductEls.updateExclusive({ exclusive: prev_exclusive_list });
          setAnchorEl(null);
          break;

        case "높은가격순":
          console.log('동작1');
          //높은가격순 :: prd_price 기준 정렬처리후 갱신
          change_condition = 'prd_price';//int형태 value 정렬
          var prev_exclusive_list = [...productRedux.exclusive];
          console.log('prev exclusive:', prev_exclusive_list);
          prev_exclusive_list.sort(data_descending);
          console.log('정렬처리후 결과:', prev_exclusive_list);
          MapProductEls.updateExclusive({ exclusive: prev_exclusive_list });
          setAnchorEl(null);
          break;

        case "낮은가격순":
          //낮은가격순  prdprice기준 정렬처리후 갱신(오름차순)
          change_condition = 'prd_price';//int형태 value 정렬
          var prev_exclusive_list = [...productRedux.exclusive];
          console.log('prev exclusive:', prev_exclusive_list);
          prev_exclusive_list.sort(data_ascending);
          console.log('정렬처리후 결과:', prev_exclusive_list);
          MapProductEls.updateExclusive({ exclusive: prev_exclusive_list });
          setAnchorEl(null);
          break;

        case "넓은면적순":
          //넓은면적순  supply_area기준 공급면적기준 내리맍순
          change_condition = 'supply_area';//int형태 value 정렬
          var prev_exclusive_list = [...productRedux.exclusive];
          console.log('prev exclusive:', prev_exclusive_list);
          prev_exclusive_list.sort(data_descending);
          console.log('정렬처리후 결과:', prev_exclusive_list);
          MapProductEls.updateExclusive({ exclusive: prev_exclusive_list });
          setAnchorEl(null);
          break;
        case "좁은면적순":
          //좁은면적순  supplys-space공급면적 오름차순
          change_condition = 'supply_area';//int형태 value 정렬
          var prev_exclusive_list = [...productRedux.exclusive];
          console.log('prev exclusive:', prev_exclusive_list);
          prev_exclusive_list.sort(data_ascending);
          console.log('정렬처리후 결과:', prev_exclusive_list);
          MapProductEls.updateExclusive({ exclusive: prev_exclusive_list });
          setAnchorEl(null);
          break;
        case "가나다순":
          //가나다순  pr_name 기준 오름차순
          change_condition = 'prd_name';//int형태 value 정렬
          var prev_exclusive_list = [...productRedux.exclusive];
          console.log('prev exclusive:', prev_exclusive_list);
          prev_exclusive_list.sort(data_ascending);
          console.log('정렬처리후 결과:', prev_exclusive_list);
          MapProductEls.updateExclusive({ exclusive: prev_exclusive_list });
          setAnchorEl(null);
          break;
      }
    }
  }

  const filterList = (item, index) => {
    return (
      <MenuItem key={item} value={index} id={item} onClick={(e) => onClickEls(e)}>
        {item}
      </MenuItem>
    )
  }

  // 모바일 필터 선택
  const onChangeFilterMb = (e) => {
    console.log(e.target.value);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
        <CommonSort onClickEls={onClickEls} items={filterText} />
    </>
  );
}
