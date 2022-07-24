//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//img
import View from '../../../../img/main/icon_view.png';
import Item from "../../../../img/map/map_item.png";
import ItemImg from "../../../../img/main/item01.png";
import Check from "../../../../img/main/heart.png";
import HeartCheck from "../../../../img/main/heart_check.png";

import { Mobile, PC } from "../../../../MediaQuery"

// Components
import CommonFilter from './commonFilter';

import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';
import serverController from '../../../../server/serverController';
import localStringData from '../../../../const/localStringData';
import { useSelector } from 'react-redux';


export default function BunyangTabItem({value,userInfo,updateList,onClickItem}) {

  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const [active,setActive] = useState(true);

  const likeBtnEvent = (value) => {
    console.log('관련 토글링',value.bp_id);
    const data = {
      mem_id:userInfo.memid,
      prd_identity_id : value.prd_identity_id ? value.prd_identity_id : 0,
      bp_id : value.bp_id ? value.bp_id  : 0,
      likes_type : 0,
    }
    
    serverController.connectFetchController("/api/likes/item",'POST',JSON.stringify(data),function(res){
      updateList();
    });
  
  }


  // useEffect(() => {
  //   setListData([
  //     {
  //       item_id : 0,
  //       path:"/",
  //       title:"충남내포신도시2차대방엘리움더센트럴",
  //       number: "2D0000324",
  //       option1:"충청남도",
  //       option2:"아파트",
  //       option3:"민간분양",
  //       address:"충청남도 홍성군 홍북읍 신경리",
  //       danji:"831세대",
  //       width1:"103㎡",
  //       width2:"114㎡",
  //       width3:"77㎡",
  //       width4:"85㎡",
  //       price1:"35,599",
  //       price2:"44,049"
  //     },
  //     {
  //       item_id : 1,
  //       path:"/",
  //       title:"충남내포신도시2차대방엘리움더센트럴",
  //       number: "2D0000324",
  //       option1:"충청남도",
  //       option2:"아파트",
  //       option3:"민간분양",
  //       address:"충청남도 홍성군 홍북읍 신경리",
  //       danji:"500세대",
  //       width1:"103㎡",
  //       width2:"114㎡",
  //       width3:"77㎡",
  //       width4:"85㎡",
  //       price1:"35,599",
  //       price2:"44,049"
  //     },
  //     {
  //       item_id : 2,
  //       path:"/",
  //       title:"충남내포신도시2차대방엘리움더센트럴",
  //       number: "2D0000324",
  //       option1:"충청남도",
  //       option2:"아파트",
  //       option3:"민간분양",
  //       address:"충청남도 홍성군 홍북읍 신경리",
  //       danji:"300세대",
  //       width1:"103㎡",
  //       width2:"114㎡",
  //       width3:"77㎡",
  //       width4:"85㎡",
  //       price1:"35,599",
  //       price2:"44,049"
  //     }
  //   ])
  // }, [])

  // 클릭한 텍스트 불러오기
  // 클릭한 옵션을 기준으로 리스트를 다시 불러온다.
  
    return (
      <Li>
      <LiTop className="clearfix">
          <LiImg src={localStringData.imagePath + (value.image_list.split(',').length > 0 ? value.image_list.split(',')[0] : "" )}/>
          <LiDesc>
            <LiTitle>
              {value.bp_name}
              <Number>{value.number}</Number>
              <LiveView>Live 방송 예고</LiveView>
              </LiTitle>
            <Option>{value.bp_addr_road.split(' ')[0]} / {value.bp_type} / {value.option3}</Option>
            <Address>{value.bp_addr_jibun} {value.bp_id}</Address>
          </LiDesc>
        <LikeBtn>
          <Like type="checkbox" name="" id={"Like"+value.bp_id} checked={active} onChange={()=> { likeBtnEvent(value) }}/>
          <Label for={"Like"+value.bp_id} className="check_label"/>
        </LikeBtn>
      </LiTop>
      {/* <LiBottom>
        <Desc>
          <DescTitle>분양세대</DescTitle>
          <DescInfo>{value.danji}</DescInfo>
        </Desc>
        <Desc>
          <DescTitle>분양면적</DescTitle>
          <DescInfo>{value.width1} ~ {value.width2}</DescInfo>
        </Desc>
        <Desc>
          <DescTitle>전용면적</DescTitle>
          <DescInfo>{value.width3} ~ {value.width4}</DescInfo>
        </Desc>
        <Desc>
          <DescTitle>분양가격</DescTitle>
          <DescInfo>{value.price1} ~ {value.price2} 만원</DescInfo>
        </Desc>
      </LiBottom> */}
    </Li>
  );
}

const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = styled.div`
    width:890px;
    margin:0 auto;
    @media ${(props) => props.theme.mobile} {
      width:100%;
      }
`
const TopInfo = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:16px 40px;
  width:680px;
  margin:0 auto;
  border-bottom:1px solid #f8f7f7;
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
  position:relative;
  display:flex;justify-content:space-between;align-items:center;
  padding:25px 27px 0 27px;margin-top:17px;
  margin-bottom:17px;
  border-top:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding:0 calc(100vw*(16/428)) calc(100vw*(18/428)) calc(100vw*(26/428));
    margin-bottom:calc(100vw*(18/428));
    margin-top:calc(100vw*(18/428));
    }
`
const WrapList = styled.div`
  padding:20px 17.5px 20px 35px;
  height:395px;
  overflow-y:scroll;
  scrollbar:auto;
  @media ${(props) => props.theme.container} {
      height:calc(100vw*(395/1436));
    }
`
const ListUl = styled.ul`
  width:100%;
  height:450px;
  margin-top:20px;
  overflow-y:scroll;
  padding:0 8px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    height:calc(100vw*(450/428));
    padding: 0 calc(100vw*(18/428));
    }
`
const Li = styled.li`
  width:100%;
  padding-bottom:11px;
  border-bottom:1px solid #b9b9b9;
  margin-bottom:11px;
  &:last-child{border-bottom:none;margin-bottom:0;}
`
const LiTop = styled.div`
  width:100%;
  position:relative;
  cursor: pointer;
`
const LiImg = styled.img`
  float:left;
  display:inline-block;
  width:106px;height:106px;border-radius:4px;
  margin-right:38px;
  border:1px solid #e4e4e4;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(106/428));
    height:calc(100vw*(106/428));
    margin-right:calc(100vw*(13/428));
    }
`
const LiDesc = styled.div`
  float:left;
  padding-top:10px;
  @media ${(props) => props.theme.mobile} {
    padding-top:calc(100vw*(10/428));
    }
`
const LiTitle = styled.h2`
  font-size:18px;font-weight:800;
  transform:skew(-0.1deg);
  color:#4a4a4a;
  margin-bottom:10px;
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(20/1436));
      margin-bottom:calc(100vw*(10/1436));
    }
    @media ${(props) => props.theme.mobile} {
      position:relative;
      font-size:calc(100vw*(15/428));
      margin-bottom:calc(100vw*(7/428));
      padding-top:calc(100vw*(28/428));
      }
`
const Number = styled.span`
  font-size:14px;color:#979797;
  display:inline-block;margin-left:15px;margin-right:23px;
  vertical-align:baseline;transform:skew(-0.1deg);
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(14/1436));
      margin-left:0;
    }
    @media ${(props) => props.theme.mobile} {
      position:absolute;left:0;top:calc(100vw*(-3/428));
      font-size:calc(100vw*(14/428));
      }
`
const LiveView = styled.span`
  display:inline-block;
  width:82px;height:25px;border-radius:8px;
  line-height:25px;
  background:#fe7a01;
  text-align:center;
  font-size:10px;
  cursor:pointer;
  color:#fff;font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    position:absolute;left:calc(100vw*(90/428));top:calc(100vw*(-8/428));
    width:calc(100vw*(82/428));height:calc(100vw*(25/428));
    line-height:calc(100vw*(25/428));
    font-size:calc(100vw*(10/428));
    }
`
const Option = styled.div`
  font-size:15px;font-weight:800;
  transform:skew(-0.1deg);
  color:#4a4a4a;
  margin-bottom:3px;
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(16/1436));
    }
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    }
`
const Address = styled(Option)`
  color:#707070;
  margin-bottom:0;
`
const LikeBtn = styled.div`
  position:Absolute;
  right:0;
  top:10px;
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(0/428));
    }
`
const Like = styled.input`
  display:none;
  &:checked + .check_label{width:29px;height:29px;background:url(${HeartCheck}) no-repeat center center;background-size:17px 17px;}
  @media ${(props) => props.theme.mobile} {
    &:checked + .check_label{width:calc(100vw*(29/428));height:calc(100vw*(29/428));background:url(${HeartCheck}) no-repeat center center;background-size:calc(100vw*(15/428)) calc(100vw*(15/428));}

    }
`
const Label = styled.label`
  display:inline-block;
  width:29px;height:29px;
  border:1px solid #d0d0d0;border-radius:3px;
  background:url(${Check}) no-repeat center center;
  background-size:17px 17px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(29/428));height:calc(100vw*(29/428));
    background-size:calc(100vw*(15/428)) calc(100vw*(15/428));
    }
`
const LiBottom = styled.div`
  width:100%;
  background:#f8f7f7;
  padding: 29px 70px 34px 51px;
  margin-top:10px;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(21/428)) calc(100vw*(27/428));
    margin-top:calc(100vw*(14/428));
  }
`
const Desc = styled.div`
  display:flex;justify-content:space-between;
  align-items:center;
  margin-bottom:8px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(12/428));
  }
`
const DescTitle = styled.p`
  font-size:15px;color:#4a4a4a;
  text-align:left;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(16/1436));
    }
    @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(14/428));
    }
`
const DescInfo = styled(DescTitle)`
  text-align:right;
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
    top:calc(100vw*(35/428));
    left:calc(100vw*(-10/428));
    width:calc(100vw*(80/428));
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
