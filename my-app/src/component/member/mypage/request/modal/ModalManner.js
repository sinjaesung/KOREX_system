//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import Item from "../../../../../img/map/map_item.png";
import FilterDown from "../../../../../img/map/filter_down_arrow.png";
import FilterNext from "../../../../../img/map/filter_next.png";
import FilterClose from "../../../../../img/map/filter_close.png";
import Checked from "../../../../../img/map/radi_chk.png";
import Check from "../../../../../img/map/radi.png";
import Profile from "../../../../../img/map/profile_img.png";

//지도 모달
export default function Manner({mannerModal,broker_res,score,setscore,scorechange}) {
  console.log('관련 전문중개사 정보:',broker_res);
  var permission_info=broker_res.permission_info[0];//전문중개사 관련 정보.전문종목관련정보
  var probroker_info = broker_res.probroker_info;//전문중개사 정보.

    return (
        <Container>
          <TopBox>
                {
                  permission_info.pro_apt_id?
                  <Tag>아파트.{permission_info.apt_name}</Tag>
                  :
                  null
                }
                {
                  permission_info.pro_oft_id?
                  <Tag>오피스텔.{permission_info.oft_name}</Tag>
                  :
                  null
                }
                {
                  permission_info.is_pro_store==1?
                  <Tag>상가</Tag>
                  :
                  null
                }
                {
                  permission_info.is_pro_office==1?
                  <Tag>사무실</Tag>
                  :
                  null
                }               
              </TopBox>
              <BottomBox>
                <Box>
                  <ItemInfo>
                    <Name>{probroker_info['company_name']}</Name>
                    <Address>{probroker_info['ceo_name']}</Address>
                  </ItemInfo>
                  <RightContent>
                    <ItemImg src={probroker_info['profile_img']?probroker_info['profile_img']:Profile}/>
                  </RightContent>
                </Box>
              </BottomBox>
              <WrapRadio>
                <RadioBox>
                  <InputRadio type="radio" name="manner" id="manner1" value='5'defaultChecked onChange={scorechange}/>
                  <RadioLabel for="manner1">
                    <Span/>
                    최상
                  </RadioLabel>
                </RadioBox>
                <RadioBox>
                  <InputRadio type="radio" name="manner" id="manner2" value='4'onChange={scorechange}/>
                  <RadioLabel for="manner2">
                    <Span/>
                    상
                  </RadioLabel>
                </RadioBox>
                <RadioBox>
                  <InputRadio type="radio" name="manner" id="manner3" value='3'onChange={scorechange}/>
                  <RadioLabel for="manner3">
                    <Span/>
                    중
                  </RadioLabel>
                </RadioBox>
                <RadioBox>
                  <InputRadio type="radio" name="manner" id="manner4"value='2'onChange={scorechange}/>
                  <RadioLabel for="manner4">
                    <Span/>
                    하
                  </RadioLabel>
                </RadioBox>
                <RadioBox>
                  <InputRadio type="radio" name="manner" id="manner5"value='1'onChange={scorechange}/>
                  <RadioLabel for="manner5">
                    <Span/>
                    최하
                  </RadioLabel>
                </RadioBox>
              </WrapRadio>
        </Container>
  );
}

const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.modal} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.modal} {
        display:block;
    }
`
const Container = styled.div`
    width:100%;
`

const TopBox = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  flex-wrap:wrap;
  width:100%;
  margin-bottom:14px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(14/428));
  }
`
const Tag = styled.div`
  border-radius: 15px;
  border: solid 1px #e4e4e4;
  background-color: #f8f7f7;
  height:30px;
  padding:7px 16px;
  margin-right:5px;
  font-size:15px;color:#01684b;
  font-weight:600;transform:skew(-0.1deg);
  text-align:center;
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(30/428));
    padding: calc(100vw*(6/428)) calc(100vw*(10/428));
    font-size:calc(100vw*(14/428));
    margin-right:calc(100vw*(5/428));
  }
`
const BottomBox = styled.div`
  width:100%;
  padding-bottom:20px;border-bottom:1px solid #e4e4e4;

`
const Box = styled.div`
display:flex;justify-content:space-between;align-items:center;
`
const ItemInfo = styled.div`
`
const Name = styled.div`
  font-size:25px;font-weight:800;transform:skew(-0.1deg);
  color:#4a4a4a;
  margin-bottom:13px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(18/428));
    margin-bottom:calc(100vw*(10/428));
  }
`
const Address = styled.div`
  display:inline-block;
  font-size:15px;color:#4a4a4a;
  font-weight:700;transform:skew(-0.1deg);
  margin-bottom:13px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    margin-bottom:calc(100vw*(10/428));
  }
`

const ColorOrange = styled.span`
  display:inline-block;
  font-size:15px;color:#fe7a01;
  vertical-align:middle;
  margin-left:3px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    margin-left:calc(100vw*(3/428));
  }
`

const RightContent = styled.div`
  position:relative;
  width:95px;height:95px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(95/428));
    height:calc(100vw*(95/428));
  }
`
const ItemImg = styled.img`
  width:100%;height:100%;
  border-radius:100%;
`
const WrapRadio = styled.div`
  width:100%;
  padding:30px 0;
  @media ${(props) => props.theme.modal} {
    padding:calc(100vw*(30/428)) 0;
  }
`
const RadioBox = styled.div`
  width:65px;text-align:left;
  margin:0 auto;
  margin-bottom:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(65/428));
    margin-bottom:calc(100vw*(15/428));
  }
`
const InputRadio = styled.input`
  display:none;
  &:checked+label span{background:url(${Checked}) no-repeat;background-size:100% 100%;}
`
const RadioLabel = styled.label`
  display:inline-block;
  font-size:15px;transform:skew(-0.1deg);
  font-weight:normal;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
  }
`
const Span = styled.span`
  width:20px;height:20px;
  display:inline-block;margin-right:15px;vertical-align:middle;
  background:url(${Check}) no-repeat;background-size:100% 100%;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));
  }
`
