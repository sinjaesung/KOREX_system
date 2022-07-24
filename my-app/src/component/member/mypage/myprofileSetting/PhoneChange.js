//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

import PhoneChangeFirst from './PhoneChangeFirst';
import PhoneChangeSecond from './PhoneChangeSecond';

//server reuqest
import serverController from '../../../../server/serverController';

export default function EmailChange({prevphone,setprevphone,newphone,setnewphone,phoneModal,cerModal}) {

  const [cernum,setCernum] = useState('');
  const [verify_cernum,setVerify_cernum] = useState('');

//페이지 이동
const [pageIndex , setPageIndex] = useState(0);

const pageLoader = () =>{
  switch (pageIndex) {
    case 0: return <PhoneChangeFirst updatePageIndex={updatePageIndex} newphone={newphone} setnewphone={setnewphone} setprevphone={setprevphone} prevphone={prevphone} cerModal={cerModal}/>;
    case 1: return <PhoneChangeSecond updatePageIndex={updatePageIndex} prevphone={prevphone} newphone={newphone} cernum={cernum} setCernum={setCernum} verify_cernum={verify_cernum}phoneModal={phoneModal}/>;
    default :return <PhoneChangeFirst updatePageIndex={updatePageIndex}/>;
  }
}

const updatePageIndex = (index) =>{
  if(pageIndex + index < 0)
    setPageIndex(0);
  else if(pageIndex + index > 1)
    setPageIndex(1);
  else
    setPageIndex(index);
}

    return (
        <Container>
          <WrapProfile>
            <MypageTxt>휴대폰번호 변경</MypageTxt>
            {
              pageLoader()
            }
          </WrapProfile>
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
    padding:40px 0 250px;
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(370/428));
      padding:calc(100vw*(40/428)) 0 calc(100vw*(150/428));
      }
`
const WrapProfile = styled.div`
  width:408px;margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(380/428));
  }
`
const MypageTxt = styled.h2`
  font-size:20px;font-weight:600;transform:skew(-0.1deg);
  color:#707070;
  margin-bottom:35px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    margin-bottom:calc(100vw*(35/428));
  }

`