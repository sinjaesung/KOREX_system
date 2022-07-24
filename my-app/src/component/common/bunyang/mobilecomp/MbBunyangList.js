//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";


//style
import styled from "styled-components"

//theme
import { TtCon_Frame_By, TtCon_1col,  } from '../../../../theme';

//material-ui
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';

//img
import ItemImg from "../../../../img/main/item01.png";
import Heart from "../../../../img/main/heart.png";
import HeartCheck from "../../../../img/main/heart_check.png";
import IconSearch from "../../../../img/main/icon_search.png";
import IconRecent from "../../../../img/main/icon_view.png";

//component
import SearchInput_T1 from '../../searchFilter/SearchInput_T1';
import serverController from '../../../../server/serverController'
import BunyangItem from '../BunyangItem';


const BunyangListItem = [
  {
    bunyang_id: 0,
    src: ItemImg,
    path: "/MbBunyangDetail",
    number: "2D0000324",
    title: "충남내포신도시2차대방엘리움더센트럴",
    option: "충청남도 / 아파트 / 민간분양",
    address: "충청남도 홍성군 홍북읍 신경리",
    desc1: "831세대",
    desc2: "103㎡ ~ 114㎡",
    desc3: "77㎡ ~ 85㎡",
    desc4: "35,599 ~ 44,049 만원",
    LiveCheckded: true
  },
  {
    bunyang_id: 1,
    src: ItemImg,
    path: "/MbBunyangDetail",
    number: "2D0000325",
    title: "충남내포신도시2차",
    option: "충청남도 / 테스트 / 테스트",
    address: "충청남도 홍성군 홍북읍 신경리",
    desc1: "500세대",
    desc2: "103㎡ ~ 114㎡",
    desc3: "77㎡ ~ 85㎡",
    desc4: "35,599 ~ 44,049 만원",
    LiveCheckded: false
  }
]

export default function BunyangList({ loginUser, searchVal, setSearchVal, onClickSearch, byList, setByList, currentFilter, setCurrentFilter, updatePageIndex, updateModal }) {


  //-------------------------------------------------------

  const history = useHistory();
  const onClickList = (value) => {
    history.push(`/MbBunyangDetail/${value.bp_id}`);
  }

  return (
    <Wrapper>
      <Sect_Top>
        <SearchInput_T1 placeholder={"검색어 입력"} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} goAction={onClickSearch} />
        <Filter>
          <MUIcontButton onClick={() => { updateModal(); }}>
            <FilterListIcon />
          </MUIcontButton>
        </Filter>

      </Sect_Top>
      <Sect_Middle>
        <ListTop>총 {byList.length}건</ListTop>
        <WrapList>
          <ListUl>
            {
              byList.map((value, index) => {
                return <BunyangItem value={value} index={index} onClickList={() => { onClickList(value) }} loginUser={loginUser} />
              })
            }
          </ListUl>
        </WrapList>
      </Sect_Middle>
    </Wrapper>
  );
}

const MUIcontButton = styled(IconButton)``


const Wrapper = styled.div`
  ${TtCon_Frame_By}
  height:100%;
`

const Sect_Top = styled.div`
  display:flex;justify-content:flex-end;align-items:center;
  padding:0.725rem;
`
const Sect_Middle = styled.div`
  ${TtCon_1col}
  height:100%;
`

const Filter = styled.div`
`
const ListTop = styled.div`
`
const Green = styled.span`
  font-size:20px;color:#01684b;margin:0 5px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(20/1436));
    }
`
const WrapList = styled.div`
  /* height: 75%;
  overflow-y:scroll; */
`
const ListUl = styled.ul``