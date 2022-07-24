//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import Item from '../../../../../img/main/item01.png';
import Check from '../../../../../img/map/radio.png';
import Checked from '../../../../../img/map/radio_chk.png';

//지도 모달
export default function ModalSelect({select,setSelect,offModal}) {
  const PropertyListItem =[
    {
      p_id : 0,
      name:"홍길동",
      phone:"010-1234-5678"
    },
    {
      p_id : 1,
      name:"홍길순",
      phone:"010-1234-5656"

    }
]

    return (
        <Container>
            <WrapList>
              <Desc>예약접수시간을 변경하시겠습니까?</Desc>
            {
            PropertyListItem.map((value) => {
              return(
                <Div>
                  <H3>예약자 {value.name}({value.phone})</H3>
                </Div>
              )
            })
          }
               <DescBt>변경시, 예약자에게 알림이 전송됩니다.</DescBt>
            </WrapList>
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
const WrapList = styled.ul`
  width:100%;
  color:#4a4a4a;transform:skew(-0.1deg);
  padding:40px 0;text-align:center;white-space: pre-wrap;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    padding:calc(100vw*(40/428)) 0;
  }
`
const Desc = styled.div`
  font-size:15px;
  text-align:center;font-weight:600;transform:skew(-0.1deg);
  margin-bottom:15px;padding-bottom:15px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    padding-bottom:calc(100vw*(15/428));
  }
`
const DescBt = styled(Desc)`
  border-bottom:none;
  padding-bottom:0;
  padding-top:15px;
  @media ${(props) => props.theme.modal} {
    padding-top:calc(100vw*(10/428));
  }
`
const Div = styled(Desc)`
  margin-bottom:10px;
  border:none;padding:0;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(10/428));
  }

`
const H3 = styled(Desc)`
  margin-bottom:0;padding:0;
  border:none;
`