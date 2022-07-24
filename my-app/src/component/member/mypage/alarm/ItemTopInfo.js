//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//img
import View from '../../../../img/main/icon_view.png';
import Item from "../../../../img/map/map_item.png";
import Check from "../../../../img/main/heart.png";
import HeartCheck from "../../../../img/main/heart_check.png";
import Set from '../../../../img/member/setting.png';

import { Mobile, PC } from "../../../../MediaQuery"

import CommonTopInfo from '../../../../component/member/mypage/commonList/commonTopInfo';

export default function ItemTabList({total_cnt}) {

  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const showModal =()=>{
    setMenu(!menu);
  }

  const topInfoContent = () => {
    return(
      <FilterAndAdd>
        <div onClick={showModal} className="cursor-p">
          <FilterImg src={View} alt="filter"/>
          {
            menu ?
            <InMenu>
              <Div>
                <InDiv className="cursor-p">최신알림순</InDiv>
              </Div>
              <Div>
                <InDiv className="cursor-p">과거알림순</InDiv>
              </Div>
            </InMenu>
            :
            null
          }
        </div>
      </FilterAndAdd>
    )
  }
    return (
        <Container>
          <CommonTopInfo length={total_cnt} leftComponent={topInfoContent()}/>
          {/*
            <TopInfo>
              <All>총 <GreenColor>4</GreenColor> 건</All>
              <FilterAndAdd>
                <div onClick={showModal} className="cursor-p">
                  <FilterImg src={View} alt="filter"/>
                  {
                    menu ?
                    <InMenu>
                      <Div>
                        <InDiv className="cursor-p">최신알림순</InDiv>
                      </Div>
                      <Div>
                        <InDiv className="cursor-p">과거알림순</InDiv>
                      </Div>
                    </InMenu>
                    :
                    null
                  }
                </div>
              </FilterAndAdd>
            </TopInfo>
          */}
        </Container>
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
    width:680px;
    margin:0 auto;
    @media ${(props) => props.theme.mobile} {
      width:100%;
      }
`

const All = styled.span`
  font-size:17px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    }
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
const Left = styled.p`
  font-size:15px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
`
const Right = styled(Left)`
  color:#979797;
`
const RightWd100 = styled(Right)`
  width:100%;
  margin-top:6px;
`
const RightMenu = styled.div`
  position:absolute;right:30px;top:30px;
`
const InMenu = styled.ul`
  position:absolute;
  width:112px;
  top:0;left:44px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;
  z-index:3;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(100/428));
    top:calc(100vw*(20/428));
    left:calc(100vw*(-78/428));
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
const Alarm = styled.div`
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:0;
    margin-right:calc(100vw*(5/428));
  }

`
const Menu = styled(Alarm)`
  margin-bottom:0;
  @media ${(props) => props.theme.mobile} {
    margin-right:0;
  }
`
const MenuIn = styled(Menu)`

`
const MenuIcon = styled.div`
  width:36px;height:36px;
  border-radius:5px;
  border:1px solid #e4e4e4;
  background:url(${Set}) no-repeat center center; background-size:20px 20px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(31/428));
    height:calc(100vw*(31/428));
    background:url(${Set}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428));
  }
`
