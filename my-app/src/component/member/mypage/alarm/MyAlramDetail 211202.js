//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img

import { Mobile, PC } from "../../../../MediaQuery"


export default function Condition({setMap,setFilter,setVisit,setVCal,value, type, type2,alramDetailinfo}) {

    console.log('alramsdEAtail infosss:',alramDetailinfo);
    let content=alramDetailinfo[0] && alramDetailinfo[0]['noti_content'];

    let reg=/\n/g;
    var textarrays;
    if(content){
        textarrays=content.split('\n');
        console.log('textaraarass:',textarrays);
        let content_final=content.replace(reg,'<br/>');
        console.log('contnetn filnal sss:',content_final);
    }
    
   
  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const showModal =()=>{
    setMenu(!menu);
  }


    return (
        <Container>
            <WrapCondition>
                <TopTitle>알림상세</TopTitle>
                <ConditionList>
                <Li>
                {textarrays&& textarrays.map((line) => {
                    return (<span>{line}<br/></span>)
                })
                } 
                </Li>        
                </ConditionList>
            </WrapCondition>
        </Container>
  );
}

const Li = styled.li`
  width:100%;
  position:relative;
  display:block;
  padding:40px 0;
  border-bottom:1px solid #f7f8f8;
  opacity:${({opacity}) => opacity};
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(34/428)) calc(100vw*(10/428));
  }
`

const Infos = styled.div`
`

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
    padding:24px 0 250px;
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(380/428));
      padding:calc(100vw*(30/428)) 0 calc(100vw*(150/428));
      }
`
const WrapCondition = styled.div`
  width:100%;
`
const TopTitle = styled.h2`
  font-size:20px;color:#707070;
  text-align:left;padding-left:30px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    padding-left:calc(100vw*(16/428));
    }
`
const TopInfo = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:16px 40px;
  margin-top:40px;
  border-top:1px solid #f2f2f2;
  border-bottom:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(30/428));
    padding:calc(100vw*(22/428)) calc(100vw*(18/428));
    }
`
const All = styled.span`
  font-size:17px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(14/428));
    }
`
const GreenColor = styled(All)`
  color:#01684b;
`
const FilterImg = styled.img`
  display:inline-block;
  width:18px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
  }
`
const ConditionList = styled.ul`
  width:100%;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    }
`
