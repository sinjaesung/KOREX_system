//미리보기 > 거절 모달

//react
import React ,{Component ,useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"


export default function rejectModal({rejectreason_change}) {
 
  const reject_reason_message_change = (e) => {
    console.log('거래승인 거절사유 입력 상태변화:',e.target.value,rejectreason_change);

    rejectreason_change(e.target.value);
  }
    return (
        <Container>
          <WrapReject>
             <TextArea type="textarea" placeholder="" onChange={reject_reason_message_change}/> 
          </WrapReject>
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
    width:100%;
`

const WrapReject = styled.div`
  width:100%;
  margin-bottom:15px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(15/428));
  }
`

const TextArea = styled.textarea`
  width:100%;
  height:230px;
  border-radius:5px;
  border:1px solid #e4e4e4;
  font-size:15px;
  padding:15px;
  resize:none;
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(230/428));
    font-size:calc(100vw*(15/428));
  }
`