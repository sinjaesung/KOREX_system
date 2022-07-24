//react
import React, { useState, useEffect } from 'react';
import { Link , useHistory} from "react-router-dom";

//components
import PcSearchMain from "./PcSearchMain";
import MobileSearchMainSecond from "./MobileSearchMainSecond";
import MobileSearchMain from "./MobileSearchMain";

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


import { Mobile, PC, SM_larger, SM_smaller } from "../../MediaQuery"

//redux
import { mapHeader } from '../../store/actionCreators';

export default function MainBody({ }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeText, setActiveText] = useState("apart");

  const history = useHistory();

  const onClickTab = (e) => {
    const text = e.target.dataset.text;
    const num = e.target.dataset.num;
    console.log(text);
    console.log(num);
    setActiveIndex(num);
    setActiveText(text);
    mapHeader.updateprdtype({ prdtypes: text });
  }

  const [MUvalue, setMUValue] = useState(0);
  const [value, setValue] = useState(0);

  const MUhandleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChange = (event, newValue) => {

    switch (newValue) {
      case 0:
        setActiveIndex(newValue);
        setActiveText("apart");
        mapHeader.updateprdtype({ prdtypes: "apart" });
        break;
      case 1:
        setActiveIndex(newValue);
        setActiveText("officetel");
        mapHeader.updateprdtype({ prdtypes: "officetel" });
        break;
      case 2:
        setActiveIndex(newValue);
        setActiveText("store");
        mapHeader.updateprdtype({ prdtypes: "store" });
        break;
      case 3:
        setActiveIndex(newValue);
        setActiveText("office");
        mapHeader.updateprdtype({ prdtypes: "office" });
        break;

      default:
        break;
    }
    setValue(newValue)
  };


  return (
    <>
      <Wrapper>
        <MUTabs value={value} onChange={handleChange} TabIndicatorProps={{style: {display: "none"}}}>
          <MUTab icon={<ApartmentIcon />} label="아파트" />
          <MUTab icon={<HomeWorkIcon />} label="오피스텔" />
          <MUTab icon={<StoreIcon />} label="상가" />
          <MUTab icon={<BusinessIcon />} label="사무실" />
          <MUTab icon={<AccessibilityNewIcon />} label="전문중개사" disabled />
        </MUTabs>
        {/* PC 검색 */}
        <MainSearch>
        <SM_larger>
          <PcSearchMain activeText={activeText} />
        </SM_larger>
        {/*Mobile 검색*/}
        <SM_smaller>
          <MobileSearchMain activeIndex={activeText}/>
          {/* <MobileSearchMainSecond activeText={activeText} /> */}
        </SM_smaller>
        </mainSearch>
      </Wrapper>
    </>
  );
}

const MUTabs = styled(Tabs)`

& .MuiTabs-flexContainer {
  flex-wrap: wrap;
  justify-content: center;
}
`
const MUTab = styled(Tab)`
&.MuiButtonBase-root.MuiTab-root.Mui-selected, &.MuiButtonBase-root.MuiTab-root.Mui-disabled  {
  color:${(props)=>props.theme.palette.secondary.main};
  background-color: rgb(0,0,0,0.04);
}
`

const Wrapper = styled.div`
  margin:0 auto;
`
const MainSearch = styled.div`
   padding-top: 1rem;
`
