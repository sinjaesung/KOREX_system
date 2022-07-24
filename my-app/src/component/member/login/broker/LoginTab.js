//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B } from '../../../../theme';

export default function JoinTab() {

  const [value, setValue] = useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Wrapper>
        <MUTabs
          className="muTabs-rsp"
          value={value}
          onChange={handleChange}
        >
          <Link to="/MemberLogin" className="muTab-rsp">
            <Tab label="개인" />
          </Link>
          <Link to="/CompanyLogin" className="muTab-rsp">
            <Tab label="기업" />
          </Link>
          <Link to="/BrokerLogin" className="muTab-rsp">
            <Tab label="중개사" />
          </Link>
          <Link to="/AgencyLogin">
            <Tab label="분양대행사" className="muTab-rsp"/>
          </Link>
        </MUTabs>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div``

const MUTabs = styled(Tabs)`
 & .MuiTabs-flexContainer {
   justify-content: center;
 }
`
const MUTab = styled(Tab)``