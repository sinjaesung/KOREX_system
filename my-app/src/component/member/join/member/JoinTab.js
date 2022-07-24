//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components";

//material-ui
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function JoinTab() {

const [value, setValue] = useState(0);

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
          <Link to="/MemberJoin">
            <MUTab label="개인" className="muTab-rsp"/>
          </Link>
          <Link to="/CompanyJoin">
            <MUTab label="기업" className="muTab-rsp"/>
          </Link>
          <Link to="/BrokerJoin">
            <MUTab label="중개사" className="muTab-rsp"/>
          </Link>
          <Link to="/AgencyJoin">
            <MUTab label="분양대행사" className="muTab-rsp"/>
          </Link>
        </MUTabs>
        {/* <Tab>
              <Link to="/MemberLogin">
                <Active>개인<Part></Part></Active>
              </Link>
              <Link to="/CompanyLogin">
                <TabBtn>기업<Part></Part></TabBtn>
              </Link>
              <Link to="/BrokerLogin">
                <TabBtn>중개사<Part></Part></TabBtn>
              </Link>
              <Link to="/AgencyLogin">
                <TabBtn style={{'margin-right':0}}>분양대행사</TabBtn>
              </Link>
          </Tab> */}
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