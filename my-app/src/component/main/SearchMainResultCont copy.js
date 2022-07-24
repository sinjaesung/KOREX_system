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

export default function SearchMainResultCont({ isModal, setSearchShow, oonClickSearch, metro_list, university_list, product_list, complex_list, addrunits_list,}) {

  return (
    <>
      { isModal ? 
       <Bg onClick={() => { setSearchShow(false) }} /> 
       :
       null
      }
      <Wrapper>
        <Box>
          <Sect isModal={isModal}>
            <TitleCont>지역</TitleCont>
            {/*검색어를 입력했을때*/}
            <Ul>
              {
                addrunits_list.map((value) => {
                  return (
                    <MUListItem disablePadding onClick={() => oonClickSearch(`${value.name}`,'addr_units', value.id)}>
                      <MUListItemButton disablePadding>
                        <Link to='#' className="data_link" />
                        <MUListItemText primary={`${value.name}`} />
                      </MUListItemButton>
                    </MUListItem>
                  )
                })
              }
            </Ul>
          </Sect>
          <Sect isModal={isModal}>
            <TitleCont>지하철,대학교</TitleCont>
            {/* <NoneHistory>최근검색기록이 없습니다.</NoneHistory> */}
            {/*검색어를 입력했을때*/}
            <Ul>
              {
                metro_list.map((value) => {
                  return (
                    <MUListItem disablePadding onClick={() => oonClickSearch(`${value.mtr_name}(${value.mtr_line})`,'metro', value.id)}>
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
                    <MUListItem disablePadding onClick={() => oonClickSearch(`${value.uvs_name}`,'university', value.id)}>
                      <MUListItemButton disablePadding>
                        <Link to='#' className="data_link" />
                        <MUListItemText primary={`${value.uvs_name}`} />
                      </MUListItemButton>
                    </MUListItem>
                  )
                })
              }
            </Ul>
          </Sect>
          <Sect isModal={isModal}>
            <TitleCont>건물명</TitleCont>
            <Ul>
              {
                product_list.map((value) => {
                  return (
                    <MUListItem disablePadding onClick={() => oonClickSearch(`${value.prd_name}(매물:)${value.prd_type}`,'product', value.prd_id, value.prd_identity_id, value.prd_type)}>
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
                    <MUListItem disablePadding onClick={() => oonClickSearch(`${value.complex_name}`,'complex', value.complex_id)}>
                      <MUListItemButton disablePadding>
                        <Link to='#' className="data_link" />
                        <MUListItemText primary={`${value.complex_name}`} />
                      </MUListItemButton>
                    </MUListItem>
                  )
                })
              }
            </Ul>
          </Sect>
        </Box>
      </Wrapper>
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

const Wrapper = styled.div`
  box-sizing: border-box;
  position:relative;
  text-align: left;
`

const Box = styled.div`
  display: flex;
  position:absolute;  
  width:100%;
  max-height:500px;
  padding:1.5rem 0px;
  border:1px solid ${props => props.theme.palette.line.main};
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
  background:#fff;
  z-index:2;

    @media ${(props) => props.theme.breakpoints.sm} {
      flex-wrap:wrap;
      max-height:none;
      box-shadow:none;
      border:none;
      z-index:none;
    }
`
const Sect = styled.div`
  width: 100%;
  flex-grow: 1;
  border-right:1px solid #dadce0;
  &:nth-child(3) {
    border-right: none;
  }
  @media ${(props) => props.theme.breakpoints.sm} {
    border-right:none;
    }
`
const TitleCont = styled.div`
  /* height: 32px; */
  padding: 0px 0px 0.5rem 2.5rem;
`
const Ul = styled.ul`
  padding-left:10%;
  height: calc(100% - 2rem);
  overflow-y:auto;
  @media ${(props) => props.theme.breakpoints.sm} {
    overflow:hidden;
    }
`
