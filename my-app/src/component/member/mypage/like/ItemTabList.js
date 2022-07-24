//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//img
import View from '../../../../img/main/icon_view.png';
import Item from "../../../../img/map/map_item.png";
import Check from "../../../../img/main/heart.png";
import HeartCheck from "../../../../img/main/heart_check.png";

import { Mobile, PC } from "../../../../MediaQuery"

// Components
import CommonFilter from './commonFilter';
import CommonSort from '../../../common/searchFilter/commonSort';
import ListItemCont_Maemul_T1 from '../../../common/broker/listItemCont_Maemul_T1';

import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';
import serverController from '../../../../server/serverController';
import localStringData from '../../../../const/localStringData';
import { useSelector } from 'react-redux';

export default function ItemTabList({ listData, setListData, refer_action}) {

  console.log('itemtabllist likes listdata:', listData, setListData , refer_action);

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  //const [listData, setListData] = useState([]);
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
      `/api/product/like?mem_id=${userInfo.memid}&tr_type=${1}&order=${filter.order}&sort=${filter.sort}`
      , "GET"
      , null
    );
    if (result.success == 1)
      setListData(result.data);
    console.log(result);
  }

  const sortItems = ["최신등록순","높은가격순","낮은가격순","넓은면적순","낮은면적순","가나다순"];
  const onClickList = (e) => {
    let sort = "ALL";
    console.log(e);
    // switch (e.target.innerText) {
    switch (e.target.id) {
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
        <CommonTopInfo length={listData && listData.length} 
        leftComponent={<CommonSort onClickEls={onClickList} items={sortItems} />
        } />
      </div>
      
      <div className="par-spacing-after">
        <ul className="scroll-y">
          {
            listData && listData.length >= 1 && listData.map((value) => {
              console.log('벨류______', value);
              let prd_exculsive_start_date = new Date(value.prd_exculsive_start_date);
              let prd_exculsive_end_date = new Date(value.prd_exculsive_end_date);
              prd_exculsive_start_date = prd_exculsive_start_date.getFullYear() + '-' + (prd_exculsive_start_date.getMonth() < 10 ? '0' + prd_exculsive_start_date.getMonth() : prd_exculsive_start_date.getMonth()) + '-' + (prd_exculsive_start_date.getDate() < 10 ? '0' + prd_exculsive_start_date.getDate() : prd_exculsive_start_date.getDate())
              prd_exculsive_end_date = prd_exculsive_end_date.getFullYear() + '-' + (prd_exculsive_end_date.getMonth() < 10 ? '0' + prd_exculsive_end_date.getMonth() : prd_exculsive_end_date.getMonth()) + '-' + (prd_exculsive_end_date.getDate() < 10 ? '0' + prd_exculsive_end_date.getDate() : prd_exculsive_end_date.getDate())

              //각 매물의 값을 조회.기한만료여부의 경우 현재 날짜값 timestamp이 기한만료일(prd_exculsive_end_date)보다 더 큰경우로 판단.
              var now_date = new window.Date();
              var prd_exculsive_end_dates = value.prd_exculsive_end_date;
              var prd_exculsive_timestamp = new window.Date(prd_exculsive_end_dates).getTime();
              var exculsive_is_expired = false;

              if (now_date.getTime() > prd_exculsive_timestamp) {
                exculsive_is_expired = true;
              } else {
                exculsive_is_expired = false;
              }
              return (
                <TabContent isexpired={exculsive_is_expired}>
                  {/* <Link className="data_link"></Link> */}
                  <ListItemCont_Maemul_T1 mode_likeCheckBtn={'ItemTabList'} user={userInfo} item={value} setListData={setListData} refer_action={refer_action}/>
                </TabContent>
              )
            })
          }
        </ul>
      </div>
    </>
  );
}


//---------------------------------------------------------

const TabContent = styled.div`
  /* cursor: pointer;
  position:relative;
  display:flex;justify-content:space-between;align-items:center;
  padding:0 27px 25px 27px;margin-top:17px;
  margin-bottom:17px;
  border-bottom:1px solid #f2f2f2; */
  opacity: ${(props) => props.isexpired == true ? `0.5` : `1.0`};
  /* @media ${(props) => props.theme.mobile} {
    width:100%;
    padding:0 calc(100vw*(16/428)) calc(100vw*(18/428)) calc(100vw*(26/428));
    margin-bottom:calc(100vw*(18/428));
    margin-top:calc(100vw*(18/428));
    } */
`