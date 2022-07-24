//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

//css
import styled from "styled-components"

import View from "../../../img/main/icon_view.png";
import OpenList from "../../../img/map/toggle_list.png";

//component
import { Mobile, PC } from "../../../MediaQuery";

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

  const productLength = () => {
    if (typeStatus == "전문중개사" || typeStatus == "아파트단지") {
      return (<OrangeColor>{length}</OrangeColor>);
    } else {
      return (<Green>{length}</Green>);
    }
  }

  const onClickEls = (e) => {
    //els특정 필터를 선택한 액션이며, typeStatus로 넘어온값을 통해서 전속매물리스트사이드바,전문중개사,단지별실거래 사이드바화면인지 구분가능합니다. 어떤 종류의 사이드바화면에서 제공되는 필터를 클릭했는지알수있으며, 각 상황별 다른 필터옵션들이 노출되며, 각 상황별로 매물관련된 사이드바화면에선 매물관련리덕스사이드바데이ㅓ 현재 있는것(서버통신없이)의 정렬상태를 처리할뿐이고, 전문중개사이면 전문문재가소관련리덕스 데이터 프론트엔드 정렬처리, 단지별실거래상황이면 단지별실거래관련 리덕스데이터정렬합니다.

    //e.target.dataset.num ( string ) -> e.target.value ( int )로 변경

    console.log(typeStatus + '처리 정렬 타입');
    console.log(productRedux);
    console.log(e.target.value);
    // if(typeStatus=='아파트단지'){
    if (typeStatus == '아파트단지') {
      // if(e.target.dataset.num == '0'){
      if (e.target.value == 0) {
        //최신계약일순  단지별최근거래일
        var prev_complex_list = [...productRedux.block];
        prev_complex_list.sort(data_descending_complex_date);
        MapProductEls.updateBlock({ block: prev_complex_list });
        setAnchorEl(null);
      } else if (e.target.value == 1) {
        // }else if(e.target.dataset.num == '1'){
        //과거계약일순  단지별최근거래일
        var prev_complex_list = [...productRedux.block];
        prev_complex_list.sort(data_ascending_complex_date);
        MapProductEls.updateBlock({ block: prev_complex_list });
        setAnchorEl(null);
      } else if (e.target.value == 2) {
        // }else if(e.target.dataset.num == '2'){
        //가나다순  단지이름
        change_condition = 'complex_name';
        var prev_complex_list = [...productRedux.block];
        prev_complex_list.sort(data_ascending);
        MapProductEls.updateBlock({ block: prev_complex_list });
        setAnchorEl(null);
      }
    } else if (typeStatus == '전문중개사') {
      switch (e.target.value) {
        // switch(e.target.dataset.num){
        case 0:
          //물건등록 최신순
          //물건등록정보가 있는(최근등록된정보까지)것들에 한해서만 진행.없는것 요소 전문중개사는 정렬에서 제외.
          change_condition = 'recent_asign_productinfo';
          var prev_probroker_list = [...productRedux.probroker];
          console.log('prevproborkeerss:', prev_probroker_list);
          prev_probroker_list.sort(data_descending);
          MapProductEls.updateProbroker({ probroker: prev_probroker_list });
          setAnchorEl(null);
          break;

        case 1:
          //전문성높은순
          setAnchorEl(null);
          break;

        case 2:
          //중개매너높은순
          setAnchorEl(null);
          break;

        case 3:
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
      console.log(e.target.value);
      // console.log(e.target.dataset.num);
      // switch(e.target.dataset.num){
      switch (e.target.value) {
        case 0:
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

        case 1:
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

        case 2:
          //낮은가격순  prdprice기준 정렬처리후 갱신(오름차순)
          change_condition = 'prd_price';//int형태 value 정렬
          var prev_exclusive_list = [...productRedux.exclusive];
          console.log('prev exclusive:', prev_exclusive_list);
          prev_exclusive_list.sort(data_ascending);
          console.log('정렬처리후 결과:', prev_exclusive_list);
          MapProductEls.updateExclusive({ exclusive: prev_exclusive_list });
          setAnchorEl(null);
          break;

        case 3:
          //넓은면적순  supply_area기준 공급면적기준 내리맍순
          change_condition = 'supply_area';//int형태 value 정렬
          var prev_exclusive_list = [...productRedux.exclusive];
          console.log('prev exclusive:', prev_exclusive_list);
          prev_exclusive_list.sort(data_descending);
          console.log('정렬처리후 결과:', prev_exclusive_list);
          MapProductEls.updateExclusive({ exclusive: prev_exclusive_list });
          setAnchorEl(null);
          break;
        case 4:
          //좁은면적순  supplys-space공급면적 오름차순
          change_condition = 'supply_area';//int형태 value 정렬
          var prev_exclusive_list = [...productRedux.exclusive];
          console.log('prev exclusive:', prev_exclusive_list);
          prev_exclusive_list.sort(data_ascending);
          console.log('정렬처리후 결과:', prev_exclusive_list);
          MapProductEls.updateExclusive({ exclusive: prev_exclusive_list });
          setAnchorEl(null);
          break;
        case 5:
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
      // <Div>
      //   <Link onClick={(e) => onClickEls(e)} data-num={index} className="data_link"></Link>
      //   <InDiv>{item}</InDiv>
      // </Div>
      <MenuItem key={item} value={index} onClick={(e) => onClickEls(e)}>
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
    <Container>
      <WrapNonTab>

        <Mobile>{/*모바일 open List Btn*/}
          <OpenListImg onClick={() => { setUpDown(!updown) }} />
        </Mobile>

        <NonTab onClick={() => { setActiveIndex(1); setHistoryInfo(e => { e.prevTab = false; return JSON.parse(JSON.stringify(e)); }); }}>{typeStatus} {productLength()}건</NonTab>

        <PC>

          <ViewBtn>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls="long-menu"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <Img src={View} />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}

            >
              {
                filterText.map((item, index) => {
                  return (
                    <>
                      {filterList(item, index)}
                    </>
                  )
                })
              }
            </Menu>
          </ViewBtn>
        </PC>
        {/* 퍼블리싱 -> 선택창이 안보입니다! */}
        <Mobile>
          <ViewBtn>
            <SelectMb onChange={e => onChangeFilterMb(e)}>
              {/* 모바일부분 아이콘이랑 글자겹치는거 수정해야합니다. */}
              {/* -- 수정코드입니다. */}
              <Option selected disabled></Option>
              {
                filterText.map((item, index) => {
                  return (<Option key={index}>{item}</Option>)
                })
              }

              {/* -- 원래 코드입니다. */}
              {/*
                    <Option selected disabled></Option>
                    <Option>최신등록순</Option>
                    <Option>높은가격순</Option>
                    <Option>낮은가격순</Option>
                    <Option>넓은면적순</Option>
                    <Option>좁은면적순</Option>
                    <Option>가나다순</Option>
                  */}
            </SelectMb>
          </ViewBtn>
        </Mobile>
      </WrapNonTab>
    </Container>
  );
}
const Container = styled.div`
  height:70px;
  display:flex;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(60/428));
  }
`
const WrapNonTab = styled.div`
  position:relative;
  width:100%;padding:0 25px;
  display:flex;justify-content:space-between;align-items:center;
  @media ${(props) => props.theme.mobile} {
    padding:0 calc(100vw*(15/428)) 0 calc(100vw*(45/428));
  }
`
const OpenListImg = styled.div`
  position:absolute;
  cursor:pointer;left:calc(100vw*(10/428));top:50%;transform:translateY(-50%);
  width:calc(100vw*(30/428));
  height:calc(100vw*(30/428));
  background:url(${OpenList}) no-repeat center center;background-size:calc(100vw*(12/428)) calc(100vw*(30/428));
`
const NonTab = styled.p`
font-size:18px;font-weight:800;
transform:skew(-0.1deg);
color:#4a4a4a;
`
const ViewBtn = styled.div`
  position:relative;
`
const Img = styled.img`
  display:inline-block;
  width:19px;
`
const InMenu = styled.ul`
  position:absolute;
  top:20px;left:-80px;
  width:112px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;
  z-index:3;
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(35/428));
    left:calc(100vw*(-30/428));
    width:calc(100vw*(100/428));
  }

`
const Div = styled.li`
  font-size:13px;
  transform:skew(-0.1deg);
  border-radius:8px;
  padding:4px 0 4px 17px;
  transition:all 0.3s;
  &:hover{background:#f8f7f7;}
  &:first-child{padding-top:8px;}
  &:last-child{padding-bottom:8px;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    padding:calc(100vw*(4/428)) 0 calc(100vw*(4/428)) calc(100vw*(12/428));
    &:first-child{padding-top:calc(100vw*(8/428));}
    &:last-child{padding-bottom:calc(100vw*(8/428));}
  }
`
const InDiv = styled.div`
  width:100%;height:100%;
`

const Green = styled.span`
 font-size:18px;font-weight:800;
 transform:skew(-0.1deg);
 color:#01684b;
`
const OrangeColor = styled(Green)`
  color:#FF7B01;
`
const SelectMb = styled.select`
  width:calc(100vw*(30/428));
  height:calc(100vw*(30/428));
  background:url(${View}) no-repeat center center; background-size:calc(100vw*(16/428));
  appearance:none;
`
const Option = styled.option`
`
