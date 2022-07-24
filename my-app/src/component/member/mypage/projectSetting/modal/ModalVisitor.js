//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img

import Close from '../../../../../img/main/modal_close.png';
//지도 모달
export default function ModalVisitor({userList, visit, setVisit }) {


  function hidePhone(phone){
    return phone.slice(0,3) + "-"+ phone.slice(3,7)  + "-****"  ;
  }


  if(visit == false)
    return null;
    return (
        <Container>
              <VisitorList>
                {
                  userList.map((value)=>{
                    return (
                      <List>
                        <Name>{value.tm_name}</Name>
                        <Phone>{hidePhone(value.tm_phone)}</Phone>
                      </List>
                    )
                  })
                }
              </VisitorList>
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


const VisitorCloseBtn = styled.div`
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const VisitorCloseImg = styled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(12/428));
  }
`
const ModalVisitorTitle = styled.h3`
  font-size:20px;font-weight:800;color:#707070;
  transform:skew(-0.1deg);
  padding-bottom:20px;
  border-bottom:1px solid #707070;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    padding-bottom:calc(100vw*(15/428));
  }

`
const VisitorList = styled.div`
  width:100%;
  text-align:center;
  padding:50px 0;
  @media ${(props) => props.theme.modal} {
    padding:calc(100vw*(50/428)) 0;
  }
`
const List = styled.div`
  width:100%;
  display:flex;justify-content:center;
`
const Name = styled.p`
  font-size: 15px;
  transform:skew(-0.1deg);
  line-height:2;
  text-align: center;
  color: #4a4a4a;
  margin-right:25px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
  }
`
const Phone = styled(Name)`
  margin-right:0;
`
