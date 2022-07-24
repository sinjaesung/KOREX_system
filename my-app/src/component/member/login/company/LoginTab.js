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


  const [value, setValue] = useState(1);

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
          <Link to="/MemberLogin">
            <MUTab label="개인" className="muTab-rsp"/>
          </Link>
          <Link to="/CompanyLogin">
            <MUTab label="기업" className="muTab-rsp"/>
          </Link>
          <Link to="/BrokerLogin">
            <MUTab label="중개사" className="muTab-rsp"/>
          </Link>
          <Link to="/AgencyLogin">
            <MUTab label="분양대행사" className="muTab-rsp"/>
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
