//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components";
//theme
import { TtCon_1col_input_2 } from '../../../../theme';

//img
import Check from "../../../../img/member/check.png";
import Checked from "../../../../img/member/checked.png";

export default function JoinTab() {

  const [phone,setPhone] = useState("");/*기본값*/
  const [cernum,setCernum] = useState("");/*기본값*/

  const [active,setActive] = useState(false);
  const [active2,setActive2] = useState(false);

  const phoneChange = (e) =>{ setPhone(e.target.value); }
  const cernumChange = (e) =>{ setCernum(e.target.value); }

  const checkVaildate = () =>{
    return phone.length > 9
   }

   const checkVaildate2 = () =>{
     return phone.length > 9 && cernum.length > 4
    }

   useEffect(()=>{
     if(checkVaildate())
             setActive(true);
     else
         setActive(false);

     if(checkVaildate2())
             setActive2(true);
     else
         setActive2(false);
   },)

   return (
    <>
     <Wrapper>
         <div className="par-spacing">
           <p>
           국가공간정보포털의 부동산중개업 정보에 등록된 <br/>
           대표공인중개사만 회원가입 가능합니다.<br/>
           소속공인중개사, 중개보조원은 팀원 추가되면 로그인할 수 있습니다.</p>
         </div>
     </Wrapper>
    </> 
);
}

const Wrapper = styled.div`
${TtCon_1col_input_2}
`
