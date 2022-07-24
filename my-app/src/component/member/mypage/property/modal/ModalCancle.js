//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import Close from '../../../../../img/main/modal_close.png';
import ArrowDown from '../../../../../img/member/arrow_down.png';

//필터 모달
export default function Reserve({cancle,setCancle,setCancleMessage}) {

  //Cancle 모달창
    return (
        <Container>
            <WrapCancleSelect>
              <TextArea type="textarea" placeholder="의뢰 거절 사유를 입력하여주세요." onChange={(e)=>setCancleMessage(e.target.value)}/>
            </WrapCancleSelect>
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
const WrapCancleSelect = styled.div`
  width:100%;
  margin-bottom:40px;
  @media ${(props) => props.theme.modal} {
      margin-bottom:calc(100vw*(40/428));
    }
`
const TextArea = styled.textarea`
  width:100%;
  resize:none;
  height: 230px;
  padding:15px;
  border-radius: 4px;
  font-size:15px;color:#4a4a4a;
  transform:skew(-0.1deg);
  border: solid 1px #e4e4e4;
  background-color: #ffffff;
  &::placeholder{color:#979797}
  @media ${(props) => props.theme.modal} {
      height:calc(100vw*(210/428));
      font-size:calc(100vw*(15/428));
      padding:calc(100vw*(12/428));
    }
`
