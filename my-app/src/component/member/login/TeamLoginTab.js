//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

export default function JoinTab(usertype) {
    console.log('usertype::',usertype,usertype['usertype']);

    return (
        <Container>
            <Tab>
              <Link to="#">
                  {
                      usertype['usertype'] == '개인' ?
                      <Active>개인<Part></Part></Active>
                      :
                      <TabBtn>개인<Part></Part></TabBtn>
                  }
              </Link>
              <Link to="#">
                  { 
                     usertype['usertype'] == '기업' ?
                      <Active>기업<Part></Part></Active>
                      :
                      <TabBtn>기업<Part></Part></TabBtn>
                  }
              </Link>
              <Link to="#">
               { 
                    usertype['usertype'] == '중개사' ?
                    <Active>중개사<Part></Part></Active>
                    :
                    <TabBtn>중개사<Part></Part></TabBtn>
                }
              </Link>
              <Link to="#">
               { 
                    usertype['usertype'] == '분양대행사' ?
                    <Active>분양대행사<Part></Part></Active>
                    :
                    <TabBtn>분양대행사<Part></Part></TabBtn>
                }
              </Link>
          </Tab>
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
    width:400px;
    margin:0 auto;
    padding-top:47px;
    @media ${(props) => props.theme.mobile} {
        width:calc(100vw*(370/428));
        padding-top:calc(100vw*(39/428));
      }
`
const Tab = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  width:100%;
  margin-bottom:24px;
  @media ${(props) => props.theme.mobile} {
      margin-bottom:calc(100vw*(40/428));
    }
`

const TabBtn = styled.div`
  font-size:20px;
  margin-right:19px;
  color:#979797;
  transform:skew(-0.1deg);
  font-weight:600;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(14/428));
      margin-right:calc(100vw*(19/428));
    }
`
const Active = styled(TabBtn)`
  color:#4a4a4a;
  font-weight:800;
`
const Part = styled.span`
  display:inline-block;
  width:1px;
  height:21px;
  background:#979797;
  margin-left:14.5px;
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(1/428));
      height:calc(100vw*(16/428));
      margin-left:calc(100vw*(19/428));
    }
`
