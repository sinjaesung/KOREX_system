//react
import React, { useState, useEffect } from 'react';
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
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';

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

//server process
import serverController from '../../../../server/serverController';

//component
import PropertyList from "./PropertyList";
import ModalSearch from '../../../common/modal/ModalSearch'
import SearchInput_T1 from '../../../common/searchFilter/SearchInput_T1';
import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';

//redux
import { useSelector } from 'react-redux';

export default function Propertymanage({ setFilter, updateModal, search_keyword_filter, value, type, brokerRequest_productlist, setBrokerRequest_productlist, alramsetting_tiny, setalramsetting_tiny }) {
  console.log('===>>brokerRequest_productlist::',brokerRequest_productlist);
  
  const login_user = useSelector(data => data.login_user);

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);

  const showModal = () => {
    setMenu(!menu);
  }

  /*data map*/
  const PropertyListItem = [
    {
      prd_id: 0,
      prd_img: Item,
      exclusive_start_date: "21.00.00",
      exclusive_end_date: '21.00.08',
      prd_create_origin: "1",
      prd_status: "검토대기",
      number: "2D0000324",
      prd_name: "충남내포신도시2차대방엘리움더센트럴",
      prd_type: "아파트",
      prd_name: "충남내포신도시2차대방엘리움더센트럴",
      prd_sel_type: "매매",
      request_mem_name: "홍길동",
    },
    {
      prd_id: 1,
      prd_img: Item,
      exclusive_start_date: "2021.00.00",
      exclusive_end_date: "2021.00.00",
      prd_create_origin: "2",
      prd_status: "검토대기",
      number: "2D0000324",
      prd_name: "충남내포신도시2차대방엘리움더센트럴",
      prd_type: "아파트",
      prd_name: "충남내포신도시2차대방엘리움더센트럴",
      prd_sel_type: "매매",
      request_mem_name: "홍길동"
    }
  ]

  const topInfoContent = () => {
    return (
      <div className="flex-right-center">

        {/* <SearchBox> */}
        {/* <ModalSearch placeholder={"건물,의뢰인 검색"} onChange={search_keyword_filter}>
          <SearchIcon type="submit" name="" />
        </ModalSearch> */}


        {/* <TextField type="text" label="건물,의뢰인 검색" variant="outlined" placeholder="건물,의뢰인 검색" onChange={search_keyword_filter}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon type="submit" name="" />
                </InputAdornment>
              ),
            }}
             /> */}

        {/* 
          <InputSearch type="search" placeholder="건물,의뢰인 검색"onChange={search_keyword_filter}/>
          <SearchButton type="button"/> */}
        {/* </SearchBox> */}

        <SearchInput_T1 placeholder={"건물,의뢰인 검색"} onChange={search_keyword_filter} />
        <IconButton onClick={() => { setFilter(true); updateModal(); }}>
          <FilterListIcon />
        </IconButton>
      </div>
    )
  }

  console.log('리스트 데이터 확인',brokerRequest_productlist)
  console.log('리스트 데이터 확인555', value)

  return (
    <>
      <Wrapper>
        <h2 className="tit-a2">물건 관리</h2>
        <div className="par-spacing">
          <div className="flex-right-center">
            <MUButton variant="contained" disableElevation><Link to="/AddProperty" className="data_link" />추가</MUButton>
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          <div className="par-spacing">
            <CommonTopInfo length={brokerRequest_productlist.length} leftComponent={topInfoContent()} />
          </div>
          {/*
              <TopInfo>
                <All>총 <GreenColor>{brokerRequest_productlist.length}</GreenColor> 건</All>
                <FilterAndAdd>
                  <SearchBox>
                    <InputSearch type="search" placeholder="건물,의뢰인 검색"/>
                    <SearchButton type="button"/>
                  </SearchBox>
                  <FilterImg onClick={()=>{setFilter(true);updateModal();}} src={Filter} alt="filter"/>
                  <Link to="/AddProperty">
                    <AddBtn>추가</AddBtn>
                  </Link>
                </FilterAndAdd>
              </TopInfo>
            */}
          <div className="par-spacing-after">
            <ul className="scroll-y">
              {
                brokerRequest_productlist.map((value) => {

                  //let result_item=value['prd_id_history_child'][0];//가장 첫 요소값으로 항상 조회시에 물건수정 포함한 최종수정된 물건정보값을 얻을수있고, transactioin조회시 가장 최근의 상태값 조회가능.
                  //let match_transaction_item=value['match_transaction_row'][0];
                  //console.log('result_item:',value);

                  const type = () => {
                    if (value.prd_create_origin == '중개의뢰' || value.prd_create_origin == 1) {
                      return "#fe7a01"
                    } else if (value.prd_create_origin == '외부수임') {
                      return "#01684b"
                    }
                  }

                  return (
                    <PropertyList setFilter={setFilter} type={type} value={value} alramsetting_tiny={alramsetting_tiny} setalramsetting_tiny={setalramsetting_tiny} setBrokerRequest_productlist={setBrokerRequest_productlist}/>
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

const MUButton = styled(Button)``
//------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Sect_R2 = styled.div`
  ${TtCon_1col}
`

// const TopInfo = styled.div`
//   display:flex;justify-content:space-between;align-items:center;
//   padding:16px 40px;
//   margin-top:30px;
//   border-top:1px solid #f2f2f2;
//   border-bottom:1px solid #f2f2f2;
//   @media ${(props) => props.theme.mobile} {
//     margin-top:calc(100vw*(30/428));
//     padding:calc(100vw*(22/428)) calc(100vw*(10/428));
//     }
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
// `
// const SearchBox = styled.div`
//   display:flex;justify-content:flex-end;align-items:center;
//   width: 300px;
//   height: 43px;border-radius: 4px;
//   margin-right:17px;
//   border: solid 1px #e4e4e4;
//   background-color: #ffffff;
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(158/428));
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
//   width: 81px;
//   height: 30px;
//   border-radius: 4px;
//   border: solid 2px #f0a764;
//   background-color: #fe7a01;
//   line-height:26px;
//   font-size:13px;
//   font-weight:800;transform:skew(-0.1deg);
//   text-align:center;
//   margin-left:15px;
//   color:#fff;
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(80/428));
//     height:calc(100vw*(30/428));
//     line-height:calc(100vw*(26/428));
//     font-size:calc(100vw*(13/428));
//     margin-left:calc(100vw*(15/428));
//     }
// `

// const FilterImg = styled.img`
//   display:inline-block;
//   width:18px;cursor:pointer;
//   @media ${(props) => props.theme.mobile} {
//     width:calc(100vw*(18/428));
//   }
// `