//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"

//img
import { Mobile, PC } from "../../../../MediaQuery"

//theme
import { TtCon_Frame_B, TtCon_1col, } from '../../../../theme';

export default function Condition({ setMap, setFilter, setVisit, setVCal, value, type, type2, alramDetailinfo }) {

  console.log('alramsdEAtail infosss:', alramDetailinfo);
  let content = alramDetailinfo[0] && alramDetailinfo[0]['noti_content'];

  let reg = /\n/g;
  var textarrays;
  if (content) {
    textarrays = content.split('\n');
    console.log('textaraarass:', textarrays);
    let content_final = content.replace(reg, '<br/>');
    console.log('contnetn filnal sss:', content_final);
  }


  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  console.log('211202_____aaa', textarrays);

  return (
    <>
      <Wrapper>
        <p className="tit-a2">내 알림</p>
        <div className="divider-a1" />
        <Sect_R2>
          <div className="par-spacing">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula sapien, rutrum sed vestibulum eget, rhoncus ac erat. Aliquam erat volutpat. Sed convallis scelerisque enim at fermentum. Aliquam consectetur, est ac auctor iaculis, odio mi bibendum leo, in congue neque velit vel enim. Nullam vitae justo at mauris sodales feugiat. Praesent pellentesque ipsum eget tellus imperdiet ultrices. Sed ultricies nisi nec diam sodales fringilla. Quisque adipiscing cursus porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam bibendum scelerisque elit, eu pharetra dui pulvinar eget. Nam mollis mauris id tellus ultricies at porttitor neque vulputate. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            </p>
          </div>
        </Sect_R2>
        {/* <ConditionList>
          <Li>
            {textarrays && textarrays.map((line) => {
              return (<span>{line}<br /></span>)
            })
            }
          </Li>
        </ConditionList> */}
      </Wrapper>
    </>
  );
}


const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Sect_R2 = styled.div`
  ${TtCon_1col}
`




const Li = styled.li`
  width:100%;
  position:relative;
  display:block;
  padding:40px 0;
  border-bottom:1px solid #f7f8f8;
  opacity:${({ opacity }) => opacity};
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(34/428)) calc(100vw*(10/428));
  }
`