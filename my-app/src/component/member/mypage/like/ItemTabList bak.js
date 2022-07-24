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

import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';
import serverController from '../../../../server/serverController';
import localStringData from '../../../../const/localStringData';
import { useSelector } from 'react-redux';

export default function ItemTabList({ listData, setListData }) {

  console.log('itemtabllist likes listdata:', listData, setListData);

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

  const likeBtnEvent = (v) => {

    console.log('좋아요 동작');
    const data = {
      mem_id: userInfo.memid,
      prd_identity_id: v.prd_identity_id ? v.prd_identity_id : 0,
      bp_id: v.bp_id ? v.bp_id : 0,
      likes_type: 0,
    }

    serverController.connectFetchController("/api/likes/item", 'POST', JSON.stringify(data), function (res) {
      updateList();
    });

  }


  const onClickList = (menuitem) => {
    let sort = "ALL";
    console.log(menuitem);
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
          listData && listData.length >= 1 && listData.map((value) => {
            console.log(value);
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
                <LeftContent>
                  {/*전속매물에 속한 아파트 일때 TopBox가 나와야함*/}
                  {
                    value.prd_exculsive_status == 1 ?
                      <TopBox>
                        <ColorGreen>전속매물</ColorGreen>
                        <WrapDate>
                          <StartDate>{prd_exculsive_start_date}</StartDate>
                          <Line>~</Line>
                          <EndDate>{prd_exculsive_end_date}</EndDate>
                        </WrapDate>
                      </TopBox>
                      :
                      <TopBox>
                        <ColorGreen>전속매물</ColorGreen>
                        <WrapDate>
                          <StartDate></StartDate>
                          <Line>~</Line>
                          <EndDate></EndDate>
                        </WrapDate>
                      </TopBox>
                  }
                  <ItemInfo>
                    <Name>
                      <Kind>{value.prd_type}</Kind>
                      <ColorOrange>·</ColorOrange>
                      <Detail>{value.prd_name} ({value.prd_identity_id})</Detail>
                    </Name>
                    <Price>{value.prd_sel_type} {value.prd_price}만</Price>
                    <Option>
                      <Floor>{value.floorname}층</Floor>
                      <Area>{value.prd_type == '아파트' ? value.supply_space : value.exculsive_space}m<sup>2</sup></Area>
                      <Expenses>{value.managecost}만</Expenses>
                    </Option>
                    <Desc>{value.maemul_description}</Desc>
                  </ItemInfo>
                </LeftContent>
                <RightContent>
                  {
                    value.prd_img ?
                      <ItemImg src={value.prd_img ? localStringData.imagePath + value.prd_img : Item} />
                      :
                      <ItemImg src={value.prd_imgs ? localStringData.imagePath + value.prd_imgs.split(',')[0] : Item} />
                  }
                  <Input type="checkbox" name="" id={"check" + value.prd_identity_id} checked={true} onChange={() => { likeBtnEvent(value) }} />
                  <CheckLabel for={"check" + value.prd_identity_id} />
                </RightContent>
              </TabContent>
            )
          })
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
//---------------------------------------------------------
const TopTitle = styled.h2`
  font-size:20px;color:#707070;
  text-align:left;padding-left:30px;
  font-weight:800;transform:skew(-0.1deg);
  margin-bottom:40px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding-left:calc(100vw*(16/428));
    }
`
const TopInfo = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:16px 40px;
  border-bottom:1px solid #f2f2f2;
margin-top:calc(100vw*(18/428));
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(40/428));
    padding:0 calc(100vw*(34/428)) calc(100vw*(22/428));
    }
`
const All = styled.span`
  font-size:17px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    }
`
const GreenColor = styled(All)`
  color:#01684b;
`
const FilterImg = styled.img`
  display:inline-block;
  width:18px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
  }
`

const FilterAndAdd = styled.div`
  position:relative;
  display:flex;justify-content:flex-start; align-items:center;
`

const TabContent = styled.div`
  cursor: pointer;
  position:relative;
  display:flex;justify-content:space-between;align-items:center;
  padding:0 27px 25px 27px;margin-top:17px;
  margin-bottom:17px;
  border-bottom:1px solid #f2f2f2;
  opacity: ${(props) => props.isexpired == true ? `0.5` : `1.0`};
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding:0 calc(100vw*(16/428)) calc(100vw*(18/428)) calc(100vw*(26/428));
    margin-bottom:calc(100vw*(18/428));
    margin-top:calc(100vw*(18/428));
    }
`
const LeftContent = styled.div`
  margin-right:31px;
  @media ${(props) => props.theme.mobile} {
    margin-right:0;
    }
`
const TopBox = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  width:233px;height:26px;border:1px solid #2b664d;
  line-height:24px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(190/428));
    height:calc(100vw*(26/428));
    line-height:calc(100vw*(24/428));
    }
`
const ColorGreen = styled.span`
  font-size:11px;
  font-weight:600;transform:skew(-0.1deg);
  color:#01684b;
  display:inline-block;margin-right:3px;
  text-align: center;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(11/428));
    margin-right:calc(100vw*(3/428));
    }
`
const WrapDate = styled.div`
  display:flex;
  justify-content:flex-start;
  align-items:center;
`
const StartDate = styled.p`
  font-size:11px;
  font-weight:600;transform:skew(-0.1deg);
  color:#707070;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(11/428));
    }
`
const Line = styled(StartDate)`
`
const EndDate = styled(StartDate)`
`
const ItemInfo = styled.div`
  margin-top:8px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(10/428));
    }
`
const Name = styled.div`
  margin-bottom:3px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(3/428));
    }
`
const Kind = styled.p`
  display:inline-block;
  font-size:15px;color:#707070;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    }
`
const ColorOrange = styled.span`
  display:inline-block;
  font-size:15px;color:#fe7a01;
  vertical-align:middle;
  margin:0 3px;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin: 0 calc(100vw*(5/428));
    }
`
const Detail = styled(Kind)`
`
const Price = styled.h3`
  font-size:20px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(20/428));
    }
`
const Option = styled.div`
  margin:6.5px 0;
  display:flex;justify-content:flex-start;align-items:center;
  @media ${(props) => props.theme.mobile} {
    margin:calc(100vw*(6/428)) 0;
    }
`
const Floor = styled.p`
  font-size:15px;color:#707070;
  font-weight:600;transform:skew(-0.1deg);
  margin-right:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-right:calc(100vw*(5/428));
    }
`
const Area = styled(Floor)`
`
const Expenses = styled(Floor)`
  margin-right:0;
`
const Desc = styled(Expenses)`
  width:196px;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(176/428));
    }
`
const RightContent = styled.div`
  position:relative;
  width:158px;height:158px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(158/428));
    height:calc(100vw*(158/428));
    }
`
const ItemImg = styled.img`
  width:100%;height:100%;
`
const LikeBox = styled.div`
  position:absolute;
  width:100%;height:100%;
  left:0;top:0;
`
const Input = styled.input`
  display:none;
  &:checked + label{
    background:#fff url(${HeartCheck}); background-repeat:no-repeat;
    background-position:center center; background-size:17px 17px;}
    @media ${(props) => props.theme.mobile} {
      &:checked + label{
        background-position:center center; background-size:calc(100vw*(15/428)) calc(100vw*(15/428));}
      }
`
const CheckLabel = styled.label`
  position:absolute;
  top:8px;right:8px;
  z-index:2;
  display:inline-block;
  width:29px;height:29px;
  border:1px solid #d0d0d0;
  border-radius:3px;
  background:#fff url(${Check});background-repeat:no-repeat;
  background-position:center center; background-size:17px 17px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(29/428));height:calc(100vw*(29/428));
    top:calc(100vw*(8/428));right:calc(100vw*(8/428));
    background-position:center center;
    background-size:calc(100vw*(15/428)) calc(100vw*(15/428));}
`

const InMenu = styled.ul`
  position:absolute;
  top:20px;left:0;
  width:112px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;
  z-index:3;
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(20/428));
    left:calc(100vw*(-50/428));
    width:calc(100vw*(100/428));
  }

`
const Div = styled.li`
  position:relative;
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
