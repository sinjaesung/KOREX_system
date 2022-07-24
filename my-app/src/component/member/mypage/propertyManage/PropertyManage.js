//react
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';

//img
import Filter from '../../../../img/member/filter.png';

import Item from '../../../../img/main/item01.png';
import Noimg from '../../../../img/member/company_no.png';
import IconSearch from '../../../../img/main/icon_search.png';
import ArrowDown from '../../../../img/member/arrow_down.png';
import Check from '../../../../img/map/radio.png';
import Checked from '../../../../img/map/radio_chk.png';

import { Mobile, PC } from "../../../../MediaQuery"
//component
import ManageList from "./ManageList";
import ModalSearch from '../../../common/modal/ModalSearch';
import SearchInput_T1 from '../../../common/searchFilter/SearchInput_T1';

//server process
import serverController from '../../../../server/serverController';


import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';
import Bunyang from '../../../common/bunyang/Bunyang';


export default function Manage({ setTridchklist, tridchklist_function, prdidvalue, reservationItemlist, search_keyword_filter, cancleModal, mapModal, updateModal, confirmModal, selectModal, select, setSelect, editModal, editAllModal, editResultModal, value, type }) {
  //console.log('===>>>>propertyMnagaew요소 실행::',reservationItemlist,prdidvalue);
  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const [ischk, setIschk] = useState(false);
  const listRef = useRef();
  const showModal = () => {
    setMenu(!menu);
  }

  const allchk_local = (e) => {
    let listEls = listRef.current.children;
    let newArr = []
    for (let i = 0; i < listEls.length; i++) {
      let inputEl = listEls[i].children[0].children[0].children[0].children[0].children[0].children[0];
      inputEl.checked = e.target.checked;
      newArr.push(inputEl.value);
    }
    if (e.target.checked) {
      setTridchklist([...newArr])
    } else {
      setTridchklist([])
    }
    // setIschk(!ischk);
  }
  /*data map*/
  const ManageListItem = [
    {
      Manage_id: 0,
      img: Item,
      condition: "오늘",
      number: "2D0000324",
      name: "홍길동",
      phone: "01012345678",
      address: "충남내포신도시2차 아파트",
      kinds: "아파트",
      trade: "매매",
      price: "1억 5,000",
      type: "today"
    },
    {
      Manage_id: 1,
      img: Item,
      condition: "2일 후",
      number: "2D0000324",
      name: "홍길동",
      phone: "01012345678",
      address: "충남내포신도시2차대방엘리움더센트럴 7층 707호",
      kinds: "아파트",
      trade: "매매",
      price: "1억 5,000",
      type: "days"
    },
    {
      Manage_id: 2,
      img: Noimg,
      condition: "예약 해제",
      number: "2D0000324",
      name: "홍길동",
      phone: "01012345678",
      address: "충남내포신도시2차대방엘리움더센트럴 7층 707호",
      kinds: "아파트",
      trade: "매매",
      price: "1억 5,000",
      type: "cancle"
    },
    {
      Manage_id: 3,
      img: Noimg,
      condition: "만료",
      number: "2D0000324",
      name: "홍길동",
      phone: "01012345678",
      address: "충남내포신도시2차대방엘리움더센트럴 7층 707호",
      kinds: "아파트",
      trade: "매매",
      price: "1억 5,000",
      type: "end"
    },
  ]

  useEffect(() => {
    //console.clear();
    // console.log("---------------------------");
    console.log(reservationItemlist);
  }, [reservationItemlist])

  return (
    <>
      <Wrapper>
        <p className="tit-a2">물건투어예약접수 관리</p>

        <div className="par-indent-left">
          <div className="par-spacing">
            {/* <AddBtn onClick={() => { selectModal(); }}>{prdidvalue != '' && prdidvalue != null ? prdidvalue : '전체'}</AddBtn> */}
            <MUButton variant="outlined" endIcon={<KeyboardArrowDownIcon />} onClick={() => { selectModal(); }}>
              {prdidvalue != '' && prdidvalue != null ? prdidvalue : '전체'}
            </MUButton>
          </div>
        </div>
        <div className="divider-a1" />

        {/* justify-content 가 달라 적용하지 않았습니다. */}
        {/* <CommonTopInfo length={reservationItemlist.length} leftComponent={topInfoContent()}/> */}
        <Sect_R2>
          <div className="par-spacing">
            <div className="flex-spabetween-center">
              <span>총 {reservationItemlist.length} 건</span>
              <div className="flex-right-center">
                {/* <SearchBox> */}

                  {/* <ModalSearch placeholder={"중개의뢰 가능한 단지 검색"} onChange={search_keyword_filter}>
                  <SearchIcon type="submit" name="" />
                    </ModalSearch> */}
                  <SearchInput_T1 placeholder={"건물,의뢰인 검색"} onChange={search_keyword_filter} />



                  {/* <TextField type="text" label="중개의뢰 가능한 단지 검색" variant="outlined" placeholder="건물,의뢰인 검색" onChange={search_keyword_filter}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <SearchIcon type="submit" name="" />
                      </InputAdornment>
                    ),
                  }} /> */}




                  {/* 
                    <InputSearch type="search" placeholder="건물,의뢰인 검색" onChange={search_keyword_filter}/>
                    <SearchButton type="button"/>
                   */}


                {/* </SearchBox> */}

                <IconButton onClick={() => { updateModal(); }} className="cursor-p">
                  <FilterListIcon />
                </IconButton>
              </div>
            </div>
          </div>

          {/* 이 부분은 AddBtn의 select모달에서 하위요소가 선택됐을때 노출됩니다. */}
          {
            select ?
              <AfterSelectView>

                {/* <FormGroup>
                  <FormControlLabel control={<Checkbox id="all" onClick={e => allchk_local(e)} />} label="전체선택" />
                </FormGroup> */}

                {/* <CheckBox>
                    <InputCheck type="checkbox" id="all" onClick={e => allchk_local(e)}/>
                    <CheckLabel for="all">
                      <Span/>
                      전체선택
                    </CheckLabel>
                  </CheckBox> */}

                <FormGroup>
                  <FormControlLabel control={<Checkbox onClick={e => allchk_local(e)} />} label="전체선택" />
                </FormGroup>


                {/* <EditBtn type="button" onClick={()=>{editAllModal(prdidvalue);}}>일괄 수정</EditBtn> */}
                <MUButton variant="contained" onClick={() => { editAllModal(prdidvalue); }}>일괄 수정</MUButton>
              </AfterSelectView>
              :
              null
          }
          <div className="par-spacing-after">
            <ul ref={listRef} className="scroll-y">
              {
                reservationItemlist.map((value) => {
                  var reserv_info = value.reserv_info;
                  //var match_tourinfo=value.match_tourinfo[0];
                  var match_productinfo = value.match_productinfo[0];
                  /*const type=()=>{
                    if(value.type == "today") { //오늘
                      return 1
                    }else if(value.type == "days") {//2일후
                      return 1
                    } else if(value.type == "cancle") { // 예약 해제
                      return 0.5
                    } else if(value.type == "end") { // 만료
                      return 0.5
                    }
                  }*/
                  //console.log('==>>>>managlist items::',value);
                  var tour_start_date = reserv_info.tour_reservDate;//임의 신청한 내역의 tour_id(투어예약셋팅날짜) 어떤 날짜에 예약셋팅에 예약한건지.
                  var nowdate = new Date();
                  var now_year = nowdate.getFullYear();
                  var now_month = nowdate.getMonth() + 1;
                  if (now_month < 10) now_month = '0' + now_month;
                  var now_date = nowdate.getDate();
                  if (now_date < 10) now_date = '0' + now_date;
                  var nowdate_string = now_year + '-' + now_month + '-' + now_date;//문자열 날짜 변경. 현재의 날짜 문자열

                  //console.log('nowdate_string::',nowdate_string);

                  if (new Date(tour_start_date).getTime() > new Date(nowdate_string).getTime()) {
                    //신청투어일이 현재보다 미래의 시간인경우 오늘보다 미래인경우. 투어신청일이 오늘이라면 값은 true일것임. >인경우는 date기준에선 투어일이 오늘보다 +1일이상 큰 경우.
                    var time_distance = new Date(tour_start_date).getTime() - new Date(nowdate_string).getTime();//일기준이기에 +1,2,3,..정수일 이상 차이이다.차이값은 절대값 1,2,3 정수형태 +1,+2,+3,...처리한다.
                    time_distance = (time_distance / (60 * 60 * 24 * 1000));
                    var time_status = 'mirae';
                    var opacity = 1;
                    var cond = '';
                  } else if (new Date(tour_start_date).getTime() == new Date(nowdate_string).getTime()) {
                    //오늘이 투어신청일
                    var time_distance = 0;//오늘이기에 차이값 없음.
                    var time_status = 'today';
                    var opacity = 1;
                    var cond = '';
                  } else {
                    //투어신청일이 이미 지나간 경우.-1일 어제보다 이전에 한 내역이였다면.마감처리
                    var time_distance = new Date(tour_start_date).getTime() - new Date(nowdate_string).getTime();
                    time_distance = (time_distance / (60 * 60 * 24 * 1000));
                    var time_status = 'passed';
                    var opacity = 0.5;
                    var cond = '';

                  }
                  //console.log('nowdatestring,tourstatdate:',new Date(nowdate_string).getTime(),new Date(tour_start_date).getTime());
                  //console.log('time_distance:::',time_distance);

                  if (reserv_info.tr_status == 1) {
                    var cond = '예약해제';
                    var opacity = 0.5;
                  } else if (reserv_info.tr_status == 2) {
                    var cond = '예약취소';
                    var opacity = 0.5;
                  }
                  return (
                    <ManageList tridchklist_function={tridchklist_function} cancleModal={cancleModal} confirmModal={confirmModal} editModal={editModal} editResultModal={editResultModal}
                      mapModal={mapModal} value={reserv_info} match_productinfo={match_productinfo} cond={cond} time_status={time_status} opacity={opacity} time_distance={time_distance} select={select} setSelect={setSelect} />
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


const MUButton = styled(Button)`

`

const SearchIcon = styled.div`
    width:43px;height:43px;
    margin-right:10px;
    background:url(${IconSearch}) no-repeat center center; background-size:19px;
    @media ${(props) => props.theme.mobile} {
        width:calc(100vw*(43/428));
        height:calc(100vw*(43/428));
        margin-right:calc(100vw*(10/428));
        background-size:calc(100vw*(18/428));
    }
`
const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col}
`


// const TopSortingBtn = styled.div`
//   width:100%;margin-top:30px;
//   @media ${(props) => props.theme.mobile} {
//     margin-top:calc(100vw*(20/428));
//     }
// `
// const TopInfo = styled.div`
// display:flex;justify-content:space-between;align-items:center;
// `

// const All = styled.span`
//   font-size:17px;color:#4a4a4a;
//   font-weight:800;transform:skew(-0.1deg);
//   @media ${(props) => props.theme.mobile} {
//     font-size:calc(100vw*(14/428));
//     }
// `
// const FilterAndAdd = styled.div`
//   display:flex;justify-content:flex-end; align-items:center;
//   margin-left:130px;
//   @media ${(props) => props.theme.mobile} {
//     margin-left:calc(100vw*(60/428));
//   }
// `
// const SearchBox = styled.div`
//   display:flex;justify-content:flex-end;align-items:center;
//   width: 300px;
//   height: 43px;border-radius: 4px;
//   margin-right:17px;
//   border: solid 1px #e4e4e4;
//   background-color: #ffffff;
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(200/428));
//     height:calc(100vw*(43/428));
//     margin-right:calc(100vw*(13/428));
//   }
// `
// const InputSearch = styled.input`
//   width:87%;
//   height:100%;
//   background:transparent;
//   font-size: 15px;transform:skew(-0.1deg);
//   font-weight: 600;
//   text-align: center;
//   color: #707070;
//   &::placeholder{color:#979797;font-weight:normal;}
//   @media ${(props) => props.theme.mobile} {
//     font-size:calc(100vw*(15/428));
//   }
// `
// const SearchButton = styled.button`
//   width:43px;height:43px;
//   background:url(${IconSearch}) no-repeat center center;background-size:17px;
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(43/428));
//     height:calc(100vw*(43/428));
//     background:url(${IconSearch}) no-repeat center center;background-size:calc(100vw*(17/428));
//   }
// `
// const AddBtn = styled.div`
//   width:100px;cursor:pointer;
//   height: 30px;
//   border-radius: 4px;
//   border: solid 1px #a3a3a3;
//   line-height:26px;
//   padding:0 15px;
//   font-size:13px;
//   font-weight:800;transform:skew(-0.1deg);
//   text-align:center;
//   color:#707070;
//   background:url(${ArrowDown}) no-repeat 92% center; background-size:11px;
// `

// const GreenColor = styled(All)`
//   color:#01684b;
// `
// const FilterImg = styled.img`
//   display:inline-block;
//   width:18px;
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(18/428));
//     margin-left:calc(100vw*(15/428));
//   }
// `
// const WrapManageList = styled.ul`

// `
const AfterSelectView = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:16px 40px;border-bottom:1px solid #f2f2f2;

  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(10/428)) calc(100vw*(10/428));
    }
`
// const CheckBox = styled.div`
// `
// const InputCheck = styled.input`
//   display:none;
//   &:checked+label span{background:url(${Checked}) no-repeat;background-size:100% 100%}
// `
// const CheckLabel = styled.label`
//   display:inline-block;
//   font-size:15px;color:#707070;transform:skew(-0.1deg);
//   vertical-align:middle; font-weight:600;
//   @media ${(props) => props.theme.mobile} {
//       font-size:calc(100vw*(15/428));
//     }
// `
// const Span = styled.span`
//    display:inline-block;
//    width:20px;height:20px;
//    margin-right:15px;
//    background:url(${Check}) no-repeat; background-size:100% 100%;
//    vertical-align:middle; 
//    @media ${(props) => props.theme.mobile} {
//       width:calc(100vw*(20/428));
//       height:calc(100vw*(20/428));
//       margin-right:calc(100vw*(15/428));
//     }
// `
// const EditBtn = styled.button`
//   display:inline-block;
//   width:80px;height:32px;
//   line-height:30px;
//   border-radius: 4px;
//   border: solid 2px #429370;
//   background-color: #01684b;
//   font-size:13px;color:#fff;transform:skew(-0.1deg);
//   font-weight:600;text-align:center;
//   @media ${(props) => props.theme.mobile} {
//       width:calc(100vw*(80/428));
//       height:calc(100vw*(32/428));
//       line-height:calc(100vw*(30/428));
//       font-size:calc(100vw*(13/428));
//     }

// `