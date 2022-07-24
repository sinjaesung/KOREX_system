//react
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';
//Theme
import { TtCon_MainMapSidePanel_FilterListPos } from '../../../theme';

//material-ui
import IconButton from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Sort';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//img
import Arrow from "../../../img/map/filter_next.png";
import ArrowDown from "../../../img/map/filter_down_arrow.png";
import Detail from "../../../img/map/detail_img.png";
import Trade from "../../../img/map/trade.png";
import Report from "../../../img/map/report.png";
import ChangeM from "../../../img/map/change_m.png";
import Change from "../../../img/member/change.png";
import Call from "../../../img/map/call.png";
import Chat from "../../../img/map/chat.png";
import Exit from "../../../img/main/exit.png";
import Checked from "../../../img/map/checked.png";
import Check from "../../../img/main/heart.png";
import Profile from "../../../img/map/profile_img.png";
import Like from '../../../img/member/like.png';
import Smile from '../../../img/member/smile.png';
import OrangeStar from '../../../img/member/star_orange.png';
import GreenStar from '../../../img/member/star_green.png';
import WhiteStar from '../../../img/member/star_white.png';
import View from '../../../img/main/icon_view.png';

// components
import { Mobile, PC } from "../../../MediaQuery";
import SideSubTitle from "./subtitle/SideSubTitle";
import BrokerTabContent from "./tabcontent/BrokerTabContent";
import BrokerSorting from "./BrokerSorting";
import ItemTabContent from "./tabcontent/ItemTabContent";

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { isCompositeComponent } from 'react-dom/test-utils';

//server
import serverController from '../../../server/serverController';

//redux
import { MapProductEls } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

SwiperCore.use([Navigation, Pagination]);

export default function BrokerSortingh() {
  const maemultype_ref = useRef();
  const seltype_ref = useRef();

  const [select, setSelect] = useState(false);
  const filterText = ["최신등록순", "높은가격순", "낮은가격순", "넓은면적순", "좁은면적순", "가나다순"];//전문중개사 수임거래개시 매물들 리스트 exculsive를 전속매물수임한것 리스트를 정렬 처리합니다.
  const productRedux = useSelector(state => { return state.mapProductEls });
  const loginUser = useSelector(state => { return state.login_user });

  var change_condition = '';
  function data_ascending(a, b) {
    console.log('데이터 오름차순 정렬진행>>:', a, b, change_condition);
    if (a[change_condition] && b[change_condition]) {
      var left = a[change_condition];
      var right = b[change_condition];
    }
    return left > right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
  }
  function data_descending(a, b) {
    console.log('데이터 내림차순 정렬진행>>:', a, b, change_condition);
    if (a[change_condition] && b[change_condition]) {
      var left = a[change_condition];
      var right = b[change_condition];
    }

    return left < right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
  }
  // 정렬오더 리스트 El
  const orderEl = (text, index) => {
    return (
      <Div onClick={() => onClickorderPc(index)}>
        <Link className="data_link"></Link>
        <InDiv>{text}</InDiv>
      </Div>
    )
  }

  // PC 정렬오더 선택
  const onClickorderPc = (index) => {
    console.log(index);

    switch (index) {
      case 0:
        //최신등록순 prdidneitityid
        change_condition = 'prd_identity_id';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_descending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });

        break;
      case 1:
        //높은가격순 prdprice
        change_condition = 'prd_price';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_descending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });
        break;
      case 2:
        //낮은가격순 prdprice
        change_condition = 'prd_price';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_ascending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });
        break;
      case 3:
        //넓은면적순 supply_area
        change_condition = 'supply_area';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_descending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });
        break;
      case 4:
        //좁은면적순 supplys-space
        change_condition = 'supply_area';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_ascending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });
        break;
      case 5:
        //가나다순 prd_name
        change_condition = 'prd_name';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_ascending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });
        break;
    }
  }

  // 모바일 정렬오더 선택
  const onChangeorderMb = (e) => {
    console.log(e.target.value);

    switch (e.target.value) {
      case '최신등록순':
        //최신등록순 prdidneitityid
        change_condition = 'prd_identity_id';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_descending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });

        break;
      case '높은가격순':
        //높은가격순 prdprice
        change_condition = 'prd_price';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_descending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });
        break;
      case '낮은가격순':
        //낮은가격순 prdprice
        change_condition = 'prd_price';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_ascending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });
        break;
      case '넓은면적순':
        //넓은면적순 supply_area
        change_condition = 'supply_area';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_descending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });
        break;
      case '좁은면적순':
        //좁은면적순 supplys-space
        change_condition = 'supply_area';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_ascending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });
        break;
      case '가나다순':
        //가나다순 prd_name
        change_condition = 'prd_name';
        var prev_brokerproduct_list = [...productRedux.brokerProduct];
        prev_brokerproduct_list.sort(data_ascending);
        MapProductEls.updateBrokerProduct({ brokerProduct: prev_brokerproduct_list });
        break;
    }
  }

  const showModal = () => {
    setSelect(!select);
  }

  // 물건 종류
  const onChangeSort = async (e) => {
    setValue(e.target.value);
    console.log(e.target.value);
    // console.log('물건종류 onchange 피러링검색 서버통신::', e.target.value, seltype_ref.current.value);
    console.log('물건종류 onchange 피러링검색 서버통신::', e.target.value, Value2);

    //어떤 클릭companyid값에서 요청하는건지 어떤 전문중개사관련 정보를 요청할것인지. 전문중개사정보와 ,그 수임매물정보(거래개시인것들만)불러오면된다.
    let body_info = {
      company_id: productRedux.clickPro,
      cond: e.target.value,//오피스텔,아파트,사무실,상가,전체(전체인경우where없앰)
      cond2: seltype_ref.current.value,
      mem_id : loginUser.memid
    }
    let res = await serverController.connectFetchController('/api/matterial/probrokerinfo_asigninfo_detail', 'POST', JSON.stringify(body_info));

    if (res.success) {
      var asign_productinfo = res.result.asign_productinfo;
      console.log('probrker전문중개사요청클릭 전문중개사 수임매물전체 리스트 및 부분리스트 조회(거래개시인) 매물타입', asign_productinfo);

      if (asign_productinfo) {
        MapProductEls.updateBrokerProduct({ brokerProduct: asign_productinfo });//거래개시상태 수임매물들 정보 구성한다.
      }
    }
  }

  // 거래유형
  const onChangeType = async (e) => {
    setValue2(e.target.value)
    // console.log('물건거래유형 onchange 필터링검색 서버통신;:', e.target.value, maemultype_ref.current.value);
    console.log('물건거래유형 onchange 필터링검색 서버통신;:', e.target.value, Value);

    //어떤 클릭companyid값에서 요청하는건지 어떤 전문중개사관련 정보 요청할건지, 전문중개사정보와 그 수임맴룰정보 거래개시인것들만 불러온다.거래타입요청addon
    let body_info = {
      company_id: productRedux.clickPro,
      cond: maemultype_ref.current.value,
      cond2: e.target.value,//매매,전세,월세, 전체
      mem_id : loginUser.memid
    }
    let res = await serverController.connectFetchController('/api/matterial/probrokerinfo_asigninfo_detail', 'POST', JSON.stringify(body_info));

    if (res.success) {
      var asign_productinfo = res.result.asign_productinfo;
      console.log('probroker전문중개사요청클릭 전문중개사 수임매물전체 리스트 및 부분리스트 조회(거래개시인) 거래타입', asign_productinfo);

      if (asign_productinfo) {
        MapProductEls.updateBrokerProduct({ brokerProduct: asign_productinfo });
      }
    }
  }

  const [Value, setValue] = useState('전체')
  const [Value2, setValue2] = useState('전체')

  return (
    <>
      <WrapSelect>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">물건종류</InputLabel>
          <Select
            value={Value}
            label="물건종류"
            onChange={e => onChangeSort(e)}
            ref={maemultype_ref}
            size="small"
          >
            <MenuItem value='전체' selected >전체</MenuItem>
            <MenuItem value='아파트'>아파트</MenuItem>
            <MenuItem value='오피스텔'>오피스텔</MenuItem>
            <MenuItem value='상가'>상가</MenuItem>
            <MenuItem value='사무실'>사무실</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">거래유형</InputLabel>
          <Select
            value={Value2}
            label="거래유형"
            onChange={e => onChangeType(e)}
            ref={seltype_ref}
            size="small"
          >
            <MenuItem value='전체' >전체</MenuItem>
            <MenuItem value='매매'>매매</MenuItem>
            <MenuItem value='전세'>전세</MenuItem>
            <MenuItem value='월세'>월세</MenuItem>
          </Select>
        </FormControl>
        {/* <Select onChange={e => onChangeSort(e)} ref={maemultype_ref}>
            <Option value='전체' selected >전체</Option>
            <Option value='아파트'>아파트</Option>
            <Option value='오피스텔'>오피스텔</Option>
            <Option value='상가'>상가</Option>
            <Option value='사무실'>사무실</Option>
          </Select>
          <Select onChange={e => onChangeType(e)} ref={seltype_ref}>
            <Option value='전체' selected >전체</Option>
            <Option value='매매'>매매</Option>
            <Option value='전세'>전세</Option>
            <Option value='월세'>월세</Option>
          </Select> */}
      </WrapSelect>
      <PC>
        <Sorting>
          <Link onClick={() => setSelect(!select)}>
            {/* <Img src={View}/> */}
            <Sect_FilterList className="clearfix">
              <MUIconButton_FilterList
                size="middle"
              >
                <SortIcon />
              </MUIconButton_FilterList>
            </Sect_FilterList>
            {
              select ?
                <InMenu>
                  {/* -- 수정코드입니다. */}
                  {
                    filterText.map((item, index) => {
                      return (
                        <>
                          {orderEl(item, index)}
                        </>
                      )
                    })
                  }
                  {/* -- 원래 코드입니다. */}
                  {/*
                        <Div>
                          <Link className="data_link"></Link>
                          <InDiv>최신등록순</InDiv>
                        </Div>
                        <Div>
                          <Link className="data_link"></Link>
                          <InDiv>높은가격순</InDiv>
                        </Div>
                        <Div>
                          <Link className="data_link"></Link>
                          <InDiv>낮은가격순</InDiv>
                        </Div>
                        <Div>
                          <Link className="data_link"></Link>
                          <InDiv>넓은면적순</InDiv>
                        </Div>
                        <Div>
                          <Link className="data_link"></Link>
                          <InDiv>좁은면적순</InDiv>
                        </Div>
                        <Div>
                          <Link className="data_link"></Link>
                          <InDiv>가나다순</InDiv>
                        </Div>
                      */}
                </InMenu>
                :
                null

            }

          </Link>
        </Sorting>
      </PC>
      <Mobile>
        {/*
              mobile일때는 select박스로 나올수 있도록 변경...
              -> 옵션 선택 시 배경과 선택한 텍스트가 겹치는 현상이 있습니다.
            */}
        <SortingMb>
          <SelectMb onChange={e => onChangeorderMb(e)}>
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
        </SortingMb>
      </Mobile>

    </>
  );
}


const MUIconButton = styled(IconButton)``

const Sect_FilterList = styled.div`
${TtCon_MainMapSidePanel_FilterListPos}
position:relative;
`
const MUIconButton_FilterList = styled(MUIconButton)`
  &.MuiButtonBase-root.MuiIconButton-root {
    position:absolute;
    right:0;
    top: 50%; transform: translateY(-50%);
  }
`



const WrapSelect = styled.div`
  display : flex;
  width : 80%;

`
// const Select = styled.select`
//   width:120px;
//   border:1px solid #979797;
//   border-radius:4px;
//   background:url(${ArrowDown}) no-repeat 100px center; background-size:10px;
//   appearance:none;
//   &:last-child{margin-right:0;}
//   @media ${(props) => props.theme.mobile} {
//     /* width:calc(100vw*(120/428));
//     height:calc(100vw*(27/428)); */
//     /* margin-right:calc(100vw*(15/428));
//     padding-left:calc(100vw*(5/428)); */
//     background:url(${ArrowDown}) no-repeat 90% center; background-size:calc(100vw*(10/428));
//   }
// `
const Option = styled.option`
`
const Sorting = styled.div`
  position:relative;z-index:9
`
const Img = styled.img`
  width:14px;cursor:pointer;
`
const Menu = styled.div`
  margin-bottom:0;
  @media ${(props) => props.theme.mobile} {
    margin-right:0;
  }
`
const MenuIcon = styled.div`
  width:36px;height:36px;
  border-radius:5px;
  border:1px solid #e4e4e4;
  background:url(${Set}) no-repeat center center; background-size:20px 20px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(31/428));
    height:calc(100vw*(31/428));
    background:url(${Set}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428));
  }
`
const Bg = styled.div`
  position:fixed;width:100%;height:100%;
  background:rgba(0,0,0,0.2);left:0;top:0;
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
const SortingMb = styled.div`
`
const SelectMb = styled.select`
  width:1rem;
  height:1rem;
  background:url(${View}) no-repeat center center; background-size:calc(100vw*(16/428));
  appearance:none;
`
