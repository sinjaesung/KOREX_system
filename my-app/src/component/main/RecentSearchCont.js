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
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';


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

export default function RecentSearchCont({ isModal, recently_searchkeywordlist_remove, setRecentlysearch_show, recently_keyword_click, }) {

  //로드시점때 로컬스토리지에 저장된 정보 조회.
  var load_prevsearchkeywordlist = localStorage.getItem('searchkeyword_list_string');
  var load_prevsearchkeywordlist_pure = localStorage.getItem('searchkeyword_list_stringpure');
  console.log('====>>>로드시점 이전키워드검색리스트::', load_prevsearchkeywordlist);
  if (load_prevsearchkeywordlist && load_prevsearchkeywordlist_pure) {
    load_prevsearchkeywordlist = load_prevsearchkeywordlist.split('|');
    load_prevsearchkeywordlist_pure = load_prevsearchkeywordlist_pure.split('|');
  }
  console.log('load_prevsearchkeywordlist_pure', load_prevsearchkeywordlist_pure);

  return (
    <>
      { isModal ? 
       <Bg onClick={() => setRecentlysearch_show(0)} />
       :
       null
      }
      <Wrapper>
        <Box>
          <Sect>
            <Sect_2>
              <Ul>
                {
                  load_prevsearchkeywordlist_pure &&
                  load_prevsearchkeywordlist_pure.map((value, index) => {
                    //console.log('index whtassssss:', index, load_prevsearchkeywordlist_pure[index]);
                    return (
                      <MUListItem disablePadding onClick={() => { recently_keyword_click(value) }}>
                        <MUListItemButton disablePadding>
                          <Link to='#' className="data_link" />
                          <MUListItemText primary={value} />
                        </MUListItemButton>
                      </MUListItem>
                    )
                  })
                }
              </Ul>
              <div className="tAlign-r">
                <MUButton onClick={recently_searchkeywordlist_remove}>최근검색기록 삭제</MUButton>
              </div>
            </Sect_2>
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
const MUButton = styled(Button)``

//---------------------------------------------------------------
const Bg = styled.div`
  position:fixed;
  width:100%;
  height:100%;
  left:0;top:0;display:block;content:'';
  background:transparent;
`

const Wrapper = styled.div`
  position:relative;
`

const Box = styled.div`
  display: flex; //absolute가 자식에 영향을 미치므로, 본인 높이 기준으로 자식의 scroll적용을 위해 flex설정함.
  position:absolute;  
  width:100%;
  max-height:300px;
  padding:0.5rem 0;
  border:1px solid ${props => props.theme.palette.line.main};
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
  border-radius: 0 0 10px 10px;
  background:#fff;
  z-index:3;

  @media ${(props) => props.theme.breakpoints.sm} {
      flex-wrap:wrap;
      max-height:none;
      box-shadow:none;
      border:none;
      z-index:none;
    }
`
const Sect = styled.div`
  width:100%; 
  //부모 absolute인 경우 부모 높이 기준으로 본인 스크롤 적용하려면,부모에 flex해줘야함.
  //width 100%: 부모 flex인 경우 기본속성 해제됨. 대체수단:flex-grow:1
  //height:100%; 부모가 flex인 경우 height의 비율은 적용안됨. 고정값은 가능함.
  /*부모 높이 무시하고, height 고정값으로 하면 자식에서 스크롤 적용은 되나, 부모 높이를 참조하면서,
  스크롤 걸려면, flex영향권에서 벗어난 손자에서 설정해야 함*/
  //overflow-y:auto; 
`
const Sect_2 = styled.div`
 height: 100%;
 overflow-y:auto;
`
const Ul = styled.ul``