//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//style
import styled from "styled-components"

//material-ui
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';

//img
import ItemImg from "../../../img/main/item01.png";
import Heart from "../../../img/main/heart.png";
import HeartCheck from "../../../img/main/heart_check.png";
import IconSearch from "../../../img/main/icon_search.png";
import IconRecent from "../../../img/main/icon_view.png";

//component
import ModalCommon from "../modal/ModalCommon";
import ModalFilter from './modal/ModalFilter';
import SearchInput_T1 from '../searchFilter/SearchInput_T1';

import serverController from "../../../server/serverController";
import localStringData from '../../../const/localStringData';

import BunyangItem from './BunyangItem'
import { useSelector } from 'react-redux';

import ModalSearch from '../modal/ModalSearch';

export default function BunyangList({ setBunyangDetail, updatePageIndex, setBunyangDate, setClickId }) {
  const [modalOption, setModalOption] = useState({ show: false, setShow: null, link: "", title: "", submit: {}, cancle: {}, confirm: {}, confirmgreen: {}, content: {} });

  const [searchVal, setSearchVal] = useState("");
  const [currentFilter, setCurrentFilter] = useState({
    sort: 0,
    view: 0,
  });

  const [byList, setByList] = useState([])

  const loginUser = useSelector(state => { return state.login_user });

  useEffect(() => {
    getBunyangList();
  }, [])

  //Like 버튼 클릭시 동작..... 
  // like 버튼 토글기능 추가로 구현하였습니다.
  const LikeButton = (value, index) => {
    let listData = byList;
    listData[index].LikeChecked = !value.LikeChecked;
    setByList([...listData])
  }

  //여기 두개가 핵심이에여
  //모달 끄는 식
  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  }

  const getBunyangList = async (searchKey) => {

    console.log('searchKey  ', searchKey );
    let result = await serverController.connectFetchController(`/api/bunyang?mem_id=${loginUser.memid?loginUser.memid:0}&sort=${currentFilter.sort}&live=${currentFilter.view}${searchKey ? `&search=${searchKey}` : ""}`,"get",null);
    setByList([...result.data]);
    console.log('result ', result);
  }

  const clearFilter = async () => {
    await setCurrentFilter({
      sort: 0,
      view: 0,
    })
    getBunyangList();
    offModal();
  }

  const modalAdjust = () => {
    getBunyangList();
    offModal();
  }

  // 필터 모달창 리스트 선택 시 값을 받아와 서버통신을 진행합니다.
  // 이를 기준으로 byList 를 업데이트 합니다.  setByList([])
  const onChangeSort = (e) => {
    setCurrentFilter(ob => { ob.sort = e.target.value; return ob; })
  }
  const onChangeCondi = (e) => {
    setCurrentFilter(ob => { ob.view = e.target.value; return ob; })
  }

  //만약에 필터 모달을 키고 싶으면 아래 함수 호출하시면됩니다.
  const updateModal = () => {
    //여기가 모달 키는 거에엽
    setModalOption({
      show: true,
      setShow: offModal,
      title: "필터",
      content: { type: "components", text: `Testsetsetsetsetestse`, component: <ModalFilter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} onChangeSort={onChangeSort} onChangeCondi={onChangeCondi} /> },
      submit: { show: true, title: "적용", event: () => { modalAdjust(); } },
      cancle: { show: true, title: "초기화", event: () => { clearFilter(); } },
      confirm: { show: false, title: "확인", event: () => { modalAdjust(); } }
    });
  }

  // 리스트 클릭 시 발생하는 함수입니다.
  // updatePageIndex값을 바꾸고 부모에게 클릭한 아이디값을 전달합니다.
  const onClickList = (value) => {
   
    setBunyangDate(value);
    updatePageIndex(1);
    setBunyangDetail(value);
  }

  // 검색버튼 눌렀을때 검색값을 서버에 보내 리스트 데이터를 얻어와야합니다.
  // 받아온 데이터는 BYDate안에 넣습니다.
  const onClickSearch = () => {
    getBunyangList(searchVal);
    console.log("dfdf_____________________", searchVal);
  }

  return (
    <>
        <Sect_Top>
          <SearchInput_T1 placeholder={"검색어 입력"} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} goAction={onClickSearch}/>
          <Filter>
            <MUIcontButton onClick={() => { updateModal(); }}>
              <FilterListIcon />
            </MUIcontButton>
          </Filter>

        </Sect_Top>
        <Sect_Middle>
          <ListTop>총 {byList.length}건</ListTop>
          <WrapList>
            <Ul>
              {
                byList.map((value, index) => {
                  return <BunyangItem user={loginUser} item={value} index={index} onClickList={() => { onClickList(value) }} />
                })
              }
            </Ul>
          </WrapList>
        </Sect_Middle>
        <ModalCommon modalOption={modalOption} />
    </>
  );
}


const MUIcontButton = styled(IconButton)``

const Sect_Top = styled.div`
  display:flex;justify-content:flex-end;align-items:center;
  background:#f8f7f7;
  padding:0.725rem;
`
const Sect_Middle = styled.div`
  height:100%;
  padding: 1rem 5%;
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
  height: 75%;
  overflow-y:scroll;
`
const Ul = styled.ul``