//react
import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText'

// components
import { Mobile, PC, SM_larger, SM_smaller } from "../../MediaQuery";

// Init
import initFilter from '../map/initFilter';

//server process
import serverController from '../../server/serverController';

// redux
import { MapProductEls } from '../../store/actionCreators';
import { useSelector } from 'react-redux';
import theme from '../../theme';

export default function SearchMainResultCont({ fromModal, setSearchShow, oonClickSearch, metro_list, university_list, product_list, complex_list, addrunits_list, recentlysearch_show, recently_searchkeywordlist_remove, setRecentlysearch_show, recently_keyword_click, value }) {

  //로드시점때 로컬스토리지에 저장된 정보 조회.
  // var load_prevsearchkeywordlist = localStorage.getItem('searchkeyword_list_string');
  // var load_prevsearchkeywordlist_pure = localStorage.getItem('searchkeyword_list_stringpure');
  // console.log('====>>>로드시점 이전키워드검색리스트::', load_prevsearchkeywordlist);
  // if (load_prevsearchkeywordlist && load_prevsearchkeywordlist_pure) {
  //   load_prevsearchkeywordlist = load_prevsearchkeywordlist.split('|');
  //   load_prevsearchkeywordlist_pure = load_prevsearchkeywordlist_pure.split('|');
  // }
  // console.log('load_prevsearchkeywordlist_pure', load_prevsearchkeywordlist_pure);

  return (
    <>
    { !fromModal ? 
      <Bg onClick={() => setSearchShow(false)} /> 
      :
      null
    } 
      <SearchResult>
        {/* 검색 기록이 없을때.(최초검색박스 클릭시) */}

        <NoneHisto>
          <SearchArea>
            <TopTxt>지역</TopTxt>
            {/*검색어를 입력했을때*/}
            <SearchList>
              {
                addrunits_list.map((value) => {
                  return (
                    <MUListItem disablePadding onClick={() => oonClickSearch('addr_units', value.id)}>
                      <MUListItemButton disablePadding>
                        <Link to='#' className="data_link" />
                        <MUListItemText primary={`${value.name}`} />
                      </MUListItemButton>
                    </MUListItem>
                  )
                })
              }
            </SearchList>
          </SearchArea>
          <SearchSubway>
            <TopTxt>지하철,대학교</TopTxt>
            {/* <NoneHistory>최근검색기록이 없습니다.</NoneHistory> */}
            {/*검색어를 입력했을때*/}
            <SearchList>
              {
                metro_list.map((value) => {
                  return (
                    <MUListItem disablePadding onClick={() => oonClickSearch('metro', value.id)}>
                      <MUListItemButton disablePadding>
                        <Link to='#' className="data_link" />
                        <MUListItemText primary={`${value.mtr_name}(${value.mtr_line})`} />
                      </MUListItemButton>
                    </MUListItem>
                  )
                })
              }
              {
                university_list.map((value) => {
                  return (
                    <MUListItem disablePadding onClick={() => oonClickSearch('university', value.id)}>
                      <MUListItemButton disablePadding>
                        <Link to='#' className="data_link" />
                        <MUListItemText primary={`${value.uvs_name}`} />
                      </MUListItemButton>
                    </MUListItem>
                  )
                })
              }
            </SearchList>
          </SearchSubway>
          <SearchUniv>
            <TopTxt>건물명</TopTxt>
            <SearchList>
              {
                product_list.map((value) => {
                  return (
                    <MUListItem disablePadding onClick={() => oonClickSearch('product', value.prd_id, value.prd_identity_id, value.prd_type)}>
                      <MUListItemButton disablePadding>
                        <Link to='#' className="data_link" />
                        <MUListItemText primary={`${value.prd_name}(매물:)${value.prd_type}`} />
                      </MUListItemButton>
                    </MUListItem>
                  )
                })
              }
              {
                complex_list.map((value) => {
                  return (
                    <MUListItem disablePadding onClick={() => oonClickSearch('complex', value.complex_id)}>
                      <MUListItemButton disablePadding>
                        <Link to='#' className="data_link" />
                        <MUListItemText primary={`${value.complex_name}`} />
                      </MUListItemButton>
                    </MUListItem>
                  )
                })
              }
            </SearchList>
          </SearchUniv>
        </NoneHisto>

        {/*검색기록이 있을 때(한번이라도 검색했으면) 검색기록 문자열들 히스토리로컬스토리지정보.*/}
        {/* {
          recentlysearch_show == 1 ?
            <HaveHisto style={{ display: "block" }}>
              <History>
                {



                  load_prevsearchkeywordlist_pure &&
                  load_prevsearchkeywordlist_pure.map((value, index) => {
                    console.log('index whtassssss:', index, load_prevsearchkeywordlist_pure[index]);
                    return (
                      <HistoryList>
                        <Link onClick={() => { recently_keyword_click(value) }}>{value}</Link>
                      </HistoryList>
                    )
                  })
                }
              </History>
              <WrapDeleteBtn>
                <Link to="#" onClick={recently_searchkeywordlist_remove}>
                  <DeleteMsg>최근검색기록 삭제</DeleteMsg>
                </Link>
                <Closebtn onClick={() => { setRecentlysearch_show(0) }}>
                  닫기
                </Closebtn>
              </WrapDeleteBtn>
            </HaveHisto>
            :
            null
        } */}
      </SearchResult>
    </>
  );
}

const MUListItem = styled(ListItem)`
`
const MUListItemButton = styled(ListItemButton)`
&.MuiListItemButton-root.MuiListItemButton-gutters.MuiButtonBase-root {
  padding-top: 1px;
  padding-bottom: 1px;
}
`
const MUListItemText = styled(ListItemText)`
& .MuiTypography-root {
  font-size: 0.9375rem;
}
`
//---------------------------------------------------------------
const Bg = styled.div`
  position:fixed;
  width:100%;
  height:100%;
  left:0;top:0;display:block;content:'';
  background:transparent;
`

const SearchResult = styled.div`
  box-sizing: border-box;
  position:relative;
  text-align: left;
`

const NoneHisto = styled.div`
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  display: flex;
  width:100%;
  height:500px;
  background:#fff;
  padding:1.5rem 0px;
  border:1px solid ${props => props.theme.palette.line.main};
  z-index:2;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);

    @media ${(props) => props.theme.breakpoints.sm} {
      flex-wrap: wrap;
      box-shadow: none;
      border: none;
    }
`

const SearchArea = styled.div`
  width: 100%;
  flex-grow: 1;
  border-right: ${({ fromModal }) => !fromModal ? "1px solid #dadce0" : "none"};
  &:nth-child(3) {
    border-right: none;
  }
`
const SearchSubway = styled(SearchArea)``
const SearchUniv = styled(SearchArea)``

const TopTxt = styled.div`
  /* height: 32px; */
  padding: 0px 0px 0.5rem 2.5rem;
`
const SearchList = styled.ul`
  padding-left:10%;
  height: calc(100% - 2rem);
  overflow-y:auto;
  @media ${(props) => props.theme.breakpoints.sm} {
    overflow:hidden;
    }

`

//-------------------------------------
const HaveHisto = styled.div`
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  width:30%;
  padding:1.5rem 0;
  /* height:460px; */
  overflow:hidden;
  background:#fff;
  border:1px solid ${props => props.theme.palette.line.main};
  z-index:2;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
`
const History = styled.ul`
  height:100%; overflow-y:auto;
`
const HistoryList = styled.li`
  padding-left:10%;
  height: auto;
`

const WrapDeleteBtn = styled.div`
  position:absolute;
  right:16px;
  bottom:10px;
  z-index:3;
`
const DeleteMsg = styled.p`
  display:inline-block;
  font-size:0.875rem;
  /* margin-left:11px;
  height:18px;
  line-height:18px;
  font-weight:600;
  color:#898989;*/
`
const Closebtn = styled(DeleteMsg)`
  cursor:pointer;
`