//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components";

//theme
import { TtCon_1col, } from '../../../../theme';

//img
import View from '../../../../img/main/icon_view.png';
import Item from "../../../../img/map/map_item.png";
import ItemImg from "../../../../img/main/item01.png";
import Check from "../../../../img/main/heart.png";
import HeartCheck from "../../../../img/main/heart_check.png";

import { Mobile, PC } from "../../../../MediaQuery"

// Components
import CommonFilter from './commonFilter';
import BunyangTabItem from './BunyangTabItem';

import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';
import serverController from '../../../../server/serverController';
import { useSelector } from 'react-redux';


export default function BunyangTabList({ value, type }) {

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const [listData, setListData] = useState([]);
  const [filter, setFilter] = useState({
    order: "DESC",
    sort: "ALL",
    search: "",
    index: 0
  });
  const userInfo = useSelector(e => e.login_user);

  const showModal = () => { setMenu(!menu); }

  useEffect(() => { updateList(); }, [filter])

  async function updateList() {
    let result = await serverController.connectFetchController(
      ` /api/bunyang/like?mem_id=${userInfo.memid}&tr_type=${1}&order=${filter.order}&sort=${filter.sort}`
      , "GET"
      , null
    );
    if (result)
      setListData(result.data);
  }


  const onClickList = (menuitem) => {
    let sort = "ALL";
    // switch (e.target.innerText) {
    switch (menuitem) {
      case "최신등록순": sort = '1'; break;
      case "높은가격순": sort = '2'; break;
      case "낮은가격순": sort = '3'; break;
      case "넓은면적순": sort = '4'; break;
      case "좁은면적순": sort = '5'; break;
      case "가나다라순": sort = '6'; break;
    }
    setFilter(f => { f.sort = sort; return { ...f }; });
  }


  return (
    <>
      <div className="par-spacing">
        <CommonTopInfo length={listData && listData.length} leftComponent={<CommonFilter onClick={onClickList} />} />
      </div>
      <div className="par-spacing-after">
        <ListUl>
          {
            listData && listData.map((item) => { return <BunyangTabItem value={item} userInfo={userInfo} updateList={updateList} /> })
          }
        </ListUl>
      </div>
    </>
  );
}

const ListUl = styled.ul`
  width:100%;
  overflow-y:scroll;
`