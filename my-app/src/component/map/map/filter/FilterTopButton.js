//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"


//img
import NavIcon from '../../../../img/main/nav_btn.png';
import Logo from '../../../../img/main/header_logo.png';
import PCLogo from '../../../../img/main/pc_header_logo.png';
import Mypage from '../../../../img/main/mypage_icon.png';
import FilterClose from '../../../../img/map/filter_close.png';
import FilterDown from '../../../../img/map/filter_down_arrow.png';

// components
import { Mobile, PC } from "../../../../MediaQuery";
export default function MapFilter({openBunyang, rank}) {
    return (
        <Container>
          <WrapFilterButton>
            <Box>
              <SubTitle>거래유형</SubTitle>
              <WrapButtons>
                <Button type="checkbox" id="trade1" defaultChecked className="changeBtn"/>
                <Label for="trade1">매매</Label>
                <Button type="checkbox" id="trade2" className="changeBtn"/>
                <Label for="trade2">전세</Label>
                <Button type="checkbox" id="trade3" className="changeBtn"/>
                <Label for="trade3">월세</Label>
              </WrapButtons>
            </Box>
          </WrapFilterButton>
        </Container>
  );
}

const Container = styled.div`
`
const WrapFilterButton = styled.div`
  width:100%;
  padding:22px 17px;
  border-top:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(22/428)) calc(100vw*(33/428));
  }
`
const Box = styled.div`
  width:100%;
`
const SubTitle = styled.h5`
  font-size:12px;
  color:#4a4a4a;transform:skew(-0.1deg);
  margin-bottom:13px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(13/428));
    font-weight:600;
  }
`
const WrapButtons = styled.div`
  width:100%;
  display:flex;justify-content:flex-start;align-items:center;
`
const Button = styled.input`
  display:none;
  &:last-child{margin-right:0;}
  &:checked+label{border:solid 2px #009053;background:#2b664d;color:#fff;font-weight:800;}
`
const Label = styled.label`
  display:inline-block;
  width: 106px;
  height: 35px;
  line-height:35px;
  text-align:center;
  border-radius: 3px;
  font-size:14px;font-weight:500;transform:skew(-0.1deg);
  margin-right:5px;
  border:solid 1px #e4e4e4;
  background:#f8f7f7;color:#4a4a4a;
  font-weight:500;
  cursor:pointer;transition:all 0.15s;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(106/428));
    height:calc(100vw*(35/428));
    line-height:calc(100vw*(35/428));
    font-size:calc(100vw*(14/428));
    margin-right:calc(100vW*(5/428));
  }
`
