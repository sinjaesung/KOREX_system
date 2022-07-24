//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import Close from '../../../../../img/main/modal_close.png';
import Change from '../../../../../img/member/change.png';
import ArrowDown from '../../../../../img/member/arrow_down.png';
import LiveUser from '../../../../../img/member/live_user.png';

//지도 모달
export default function CancleModal({ cancle, setCancle }) {

  const [text,setText] = useState("");/*기본값*/
  const [active,setActive] = useState(false);

  const textChange = (e) =>{ setText(e.target.value); }

  const checkVaildate = () =>{
    return text.length > 0
   }

   useEffect(()=>{
     if(checkVaildate())
        setActive(true);
     else
         setActive(false);
   },)

  if(cancle == false)
    return null;
    return (
        <Container>
              <WrapDesc>
                예약을 해제하시겠습니까? <br/>
                해제 시, 예약자에게 알림이 전송됩니다.
              </WrapDesc>
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

const WrapModalAdd = styled.div`
  width:100%;
`
const ModalAddBg = styled.div`
  width:100%;height:100%;
  position:fixed;left:0;top:0;
  background:rgba(0,0,0,0.2);
  display:block;content:'';
  z-index:3;
`
const ModalAdd = styled.div`
  position:absolute;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:535px;border-radius:24px;
  border:1px solid #f2f2f2;
  background:#fff;
  padding:49px 50px 60px 50px;
  z-index:3;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(395/428));
    height:auto;
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`
const AddCloseBtn = styled.div`
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const AddCloseImg = styled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(12/428));
  }
`
const ModalAddTitle = styled.h3`
  font-size:20px;font-weight:800;color:#707070;
  transform:skew(-0.1deg);
  padding-bottom:20px;
  border-bottom:1px solid #707070;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    padding-bottom:calc(100vw*(15/428));
  }
`
const WrapDesc = styled.div`
  width:100%;
  text-align:center;
  font-size:15px;
  transform:skew(-0.1deg);color:#4a4a4a;
  line-height:2;
  padding:50px 0;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    height:auto;
    padding:calc(100vw*(50/428)) 0;
  }
`
const WrapFilterButtons = styled.div`
  width:100%;
  display:flex;justify-content:center;align-items:center;
`
const ResetBtn = styled.button`
  width: 200px;
  height: 66px;
  border-radius: 11px;
  border: solid 3px #e4e4e4;
  background: #979797;
  line-height:60px;color:#fff;
  font-size:20px;font-weight:800;transform:skew(-0.1deg);
  text-align:center;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(180/428));
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
  }
`
const SaveBtn = styled(ResetBtn)`
  background:#01684b;
  border:3px solid #04966d;
  margin-left:8px;
  @media ${(props) => props.theme.modal} {
    margin-left:calc(100vw*(10/428));

  }
`
const FlexBox = styled.div`
  display:flex;justify-content:space-between;align-items:center;
`
