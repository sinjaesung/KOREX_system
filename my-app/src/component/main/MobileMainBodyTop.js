//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//components
import PcSearchMain from "./PcSearchMain";
import MobileSearchMainSecond from "./MobileSearchMainSecond";

//material-ui
import ApartmentIcon from '@material-ui/icons/Apartment';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import StoreIcon from '@material-ui/icons/Store'
import BusinessIcon from '@material-ui/icons/Business';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

//css
import styled from "styled-components"
//redux
import { mapHeader } from '../../store/actionCreators';

import { Mobile, PC, SM_larger, SM_smaller} from "../../MediaQuery"

export default function MainBody({}) {
    const [activeIndex,setActiveIndex] = useState(0);
    const [activeText, setActiveText] = useState("apart");
    const [currentTab, setCurrentTab] = useState("apart");
  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);

    const onClickTab = (e) => {
      const text = e.target.dataset.text;
      const num = e.target.dataset.num;
      setActiveIndex(num);
      setActiveText(text);
      setCurrentTab(text);
    }

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        setActiveIndex(newValue);
        setActiveText("apart");
         setCurrentTab(newValue);
        mapHeader.updateprdtype({ prdtypes: "apart" });
        break;
      case 1:
        setActiveIndex(newValue);
        setActiveText("officetel");
         setCurrentTab(newValue);
        mapHeader.updateprdtype({ prdtypes: "officetel" });
        break;
      case 2:
        setActiveIndex(newValue);
        setActiveText("store");
         setCurrentTab(newValue);
        mapHeader.updateprdtype({ prdtypes: "store" });
        break;
      case 3:
        setActiveIndex(newValue);
        setActiveText("office");
         setCurrentTab(newValue);
        mapHeader.updateprdtype({ prdtypes: "office" });
        break;

      default:
        break;
    }
    setValue(newValue)
  };

    return (
        <Container>
          <MainSearch>

          {/* <MUTabs value={value} onChange={handleChange} TabIndicatorProps={{ style: { display: "none" }, }}>
            <MUTab icon={<ApartmentIcon />} label="아파트" />
            <MUTab icon={<HomeWorkIcon />} label="오피스텔" />
            <MUTab icon={<StoreIcon />} label="상가" />
            <MUTab icon={<BusinessIcon />} label="사무실" />
            <MUTab icon={<AccessibilityNewIcon />} label="전문중개사" disabled />
          </MUTabs> */}
        <Div>
          <MUTabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            
            // 아래 부분 스크롤 
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
          >
            <MUTab label="아파트" />
            <MUTab label="오피스텔" />
            <MUTab label="상가" />
            <MUTab label="사무실" />
            <MUTab label="전문중개사" disabled/>
          </MUTabs>
            {/* <MUTabs
              value={value2}
              onChange={handleChange}
            >
              <MUTab label="전문중개사" />
            </MUTabs> */}
        </Div>


            {/* <MainTab>
              <Tab>
                <TabBtn active={activeIndex == 0} data-num="0" data-text="apart"  onClick={(e)=>{ onClickTab(e) }}>아파트<Part></Part></TabBtn>
              </Tab>
              <Tab>
                <TabBtn active={activeIndex == 1} data-num="1" data-text="officetel" onClick={(e)=>{ onClickTab(e) }}>오피스텔<Part></Part></TabBtn>
              </Tab>
              <Tab>
                <TabBtn active={activeIndex == 2} data-num="2" data-text="store" onClick={(e)=>{ onClickTab(e) }} >상가<Part></Part></TabBtn>
              </Tab>
              <Tab>
                <TabBtn active={activeIndex == 3} data-num="3" data-text="office" onClick={(e)=>{ onClickTab(e) }}>사무실<Part></Part></TabBtn>
              </Tab>
              <Tab>
                <TabBtnOn>전문중개사</TabBtnOn>
              </Tab>
            </MainTab> */}
        {/* PC 검색 */}
          {/* <PC>
            <PcSearchMain activeText={activeText}/>
          </PC> */}
        {/*Mobile 검색*/}
          {/* <Mobile> */}
            <SM_smaller>
            {/* sm smailer */}
            {/* <MobileSearchMain/> */}
            <MobileSearchMainSecond currentTab={currentTab} activeText={activeText}/>
          {/* </Mobile> */}
          </SM_smaller>
          </MainSearch>
        </Container>
  );
}

const Div = styled.div`
display : flex;

`

const MUTabs = styled(Tabs)`

& .MuiTabs-flexContainer {
  /* flex-wrap: wrap;
  justify-content: center; */
}
`
const MUTab = styled(Tab)`
&.MuiButtonBase-root.MuiTab-root.Mui-selected, &.MuiButtonBase-root.MuiTab-root.Mui-disabled  {
  color:${(props) => props.theme.palette.secondary.main};
  background-color: rgb(0,0,0,0.04);
}
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
    width:510px;
    margin:80px auto 0;

    @media ${(props) => props.theme.mobile} {
          width:calc(100vw*(360/428));
          margin:calc(100vw*(36/428)) auto 0;
      }
`
const MainSearch = styled.div`
  width:100%;

`
const MainTab = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  width:100%;
  margin-bottom:24px;
  @media ${(props) => props.theme.mobile} {
      margin-bottom:calc(100vw*(24/428));
    }
`
// const Tab = styled.div`
//   margin-right:19px;
//   &:last-child{
//     margin-right:0;
//   }
//   @media ${(props) => props.theme.mobile} {
//       margin-right:calc(100vw*(10/428));
//       &:last-child{
//         margin-right:0;
//       }
//     }
// `

const TabBtn = styled.div`
  font-size:20px;
  color:${({active}) => active ? "#FE7A01" : "#979797"};
  font-weight:${({active}) => active ? "800" : "normal"};
  transform:skew(-0.1deg);

  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(16/428));
    }
`
const TabBtnOn = styled.div`
  font-size:20px;
  color:#FE7A01;
  font-weight:800;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(16/428));
    }
  `
const Part = styled.span`
  display:inline-block;
  width:1px;
  height:21px;
  background:#979797;
  margin-left:14.5px;
  vertical-align:middle;

  @media ${(props) => props.theme.mobile} {
      height:calc(100vw*(19/428));
      margin-left:calc(100vw*(12/428));
      vertical-align:bottom;
    }
`
