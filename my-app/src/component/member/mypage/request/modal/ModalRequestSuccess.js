//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img

import Close from '../../../../../img/main/modal_close.png';

//필터 모달
export default function ModalDanjiSelect({success,setSuccess}) {
  if(success == false)
    return null;
    return (
        <Container>
          <WrapModal>
            <ModalBg onClick={() => {setSuccess(false)}}/>
            <Modal>
              <FilterCloseBtn>
                <Link to="/Request" onClick={() => {setSuccess(false)}}>
                  <FilterCloseImg src={Close}/>
                </Link>
              </FilterCloseBtn>
              <TopInfo>
                <Title>중개의뢰</Title>
              </TopInfo>
              <Body>
              중개의뢰신청이 접수되었습니다.<br/>
              전문중개사가 의뢰검토 후 결과 알려드립니다.
              </Body>
              <Buttons>
                <Link className="data_link" to="/Request"/>
                <ConfirmBtn type="button" onClick={()=>{setSuccess(false)}}>확인</ConfirmBtn>
              </Buttons>
            </Modal>
          </WrapModal>
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
`
const WrapModal = styled.div`
  width:100%;
`
const ModalBg = styled.div`
  width:100%;height:100%;
  position:fixed;left:0;top:0;
  background:rgba(0,0,0,0.2);
  display:block;content:'';
  z-index:3;
`
const Modal = styled.div`
  position:fixed;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:535px;border-radius:24px;
  border:1px solid #f2f2f2;
  background:#fff;
  padding:49px 50px 60px 50px;
  z-index:3;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(395/428));
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`
const FilterCloseBtn = styled.div`
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const FilterCloseImg = styled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(12/428));
  }
`
const TopInfo = styled.div`

`
const Title = styled.h3`
font-size:20px;font-weight:600;transform:skew(-0.1deg);
padding-bottom:22px;border-bottom:1px solid #a3a3a3;
`
const Body = styled.div`
  padding:44px 0;
  text-align:center;
  line-height:2;
  font-size:15px;font-weight:normal;
  transform:skew(-0.1deg);
  color:#4a4a4a;
`
const SearchTitle = styled.p`
  font-size: 15px;
  line-height: 1.2;
  font-weight:500;

  font-family:'nbg',sans-serif;
  color: #4a4a4a;transform:skeW(-0.1deg);
`
const SearchResultAddress = styled(SearchTitle)`
`
const Question = styled(SearchTitle)`
  margin-top:30px;
  text-align:center;
`
const Buttons = styled.div`
  position:relative;
  width:100%;
  margin-top:20px;
  display:flex;justify-content:center;align-items:center;
`

const ConfirmBtn = styled.button`
  width:100%;height:66px;
  border: solid 3px #04966d;
  background-color: #01684b;
  text-align:center;
  color:#fff;font-size:20px;font-weight:800;
  transform:skew(-0.1deg);
  margin-right:8px;
  border-radius: 11px;
`
