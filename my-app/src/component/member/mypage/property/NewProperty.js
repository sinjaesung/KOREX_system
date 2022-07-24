//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col_input, } from '../../../../theme';


//material-ui
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import { Mobile, PC } from "../../../../MediaQuery"

//component
import SearchApartOfficetel from "./SearchApartOfficetel";
import SearchStoreOffice from "./SearchStoreOffice";
import SearchApartOfficetelSelectInfo from "./SearchApartOfficetelSelectInfo";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Sect_R2>
          {children}
        </Sect_R2>
      )}
    </div>
  );
}


export default function Property({ setFilter, value, type }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openApart, setOpenApart] = useState(true);
  const [openStore, setOpenStore] = useState(false);
  const [selectInfo, setSelectInfo] = useState(false);
  //const tabName = ["아파트", "오피스텔", "상가", "사무실"];

  const [overdos, setoverdos] = useState(false)

  const [Value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  console.log('newProperty물건외부수임추가 요소 실행,상태변화:', activeIndex, openApart, openStore, selectInfo);

  return (
    <>
      <Wrapper>
        <p className="tit-a2">전속여부 확인</p>
        <div className="par-spacing">
          <MUTabs className="muTab-rsp" value={Value} onChange={handleChange} >
            <MUTab className="muTab-rsp" label="아파트" onClick={() => { setActiveIndex(0); setOpenApart(true); setOpenStore(false); }} />
            <MUTab className="muTab-rsp" label="오피스텔" onClick={() => { setActiveIndex(1); setOpenApart(true); setOpenStore(false); }} />
            <MUTab className="muTab-rsp" label="상가" onClick={() => { setActiveIndex(2); setOpenApart(false); setOpenStore(true); }} />
            <MUTab className="muTab-rsp" label="사무실" onClick={() => { setActiveIndex(3); setOpenApart(false); setOpenStore(true); }} />
          </MUTabs>
          <div className="divider-a1" />
        </div>
        <div className="mt-3">
          <TabPanel value={Value} index={0}>
            <SearchApartOfficetel selectInfo={selectInfo} setSelectInfo={setSelectInfo} activeIndex={activeIndex} overdos={overdos}/>
            {
            (openApart == true && selectInfo == true) ?
                <SearchApartOfficetelSelectInfo activeIndex={activeIndex} setActiveIndex={setActiveIndex} setSelectInfo={setSelectInfo} setoverdos={setoverdos}/>
                :
                null
            }
          </TabPanel>
          <TabPanel value={Value} index={1}>
            <SearchApartOfficetel selectInfo={selectInfo} setSelectInfo={setSelectInfo} activeIndex={activeIndex}/>
            {
              (openApart == true && selectInfo == true) ?
                <SearchApartOfficetelSelectInfo activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                :
                null
            }
          </TabPanel>
          <TabPanel value={Value} index={2}>
            <SearchStoreOffice activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel value={Value} index={3}>
            <SearchStoreOffice activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
        </div>


        {/* <TopInfo> */}
        {/* <MainTab> */}
        {/*
                    tabName.map((item, index) => {
                      return(
                        <Tab>
                          <TabBtn active={activeIndex == index} onClick={()=>{setActiveIndex(index);setOpenApart(true);setOpenStore(false)}} key={index}>{item}{index!==3&&<Part/>}</TabBtn>
                        </Tab>
                      )
                    })
                    */
        }
        {/* <Tab>
                  <TabBtn active={activeIndex == 0} onClick={()=>{setActiveIndex(0);setOpenApart(true);setOpenStore(false)}}>아파트<Part/></TabBtn>
                </Tab>
                <Tab>
                  <TabBtn active={activeIndex == 1} onClick={()=>{setActiveIndex(1);setOpenApart(true);setOpenStore(false)}}>오피스텔<Part/></TabBtn>
                </Tab>
                <Tab>
                  <TabBtn active={activeIndex == 2} onClick={()=>{setActiveIndex(2);setOpenStore(true);setOpenApart(false)}} >상가<Part/></TabBtn>
                </Tab>
                <Tab>
                  <TabBtn active={activeIndex == 3} onClick={()=>{setActiveIndex(3);setOpenStore(true);setOpenApart(false)}}>사무실</TabBtn>
                </Tab> */}
        {/* </MainTab> */}
        {/* </TopInfo> */}
        {/*중개의뢰 가능한 단지 선택 모달*/}


        {/* {
                openApart ?
                <SearchApartOfficetel selectInfo={selectInfo} setSelectInfo={setSelectInfo}/>
                :
                null
              }
              {
                openStore ?
                <SearchStoreOffice activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>
                :
                null
              } */}
        {/*동, 호수 선택 컴포넌트*/}
        {/* {
                (openApart ==true && selectInfo==true) ?
                <SearchApartOfficetelSelectInfo activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>
                :
                null
              } */}

      </Wrapper>
    </>
  );
}

const MUTabs = styled(Tabs)`
`
const MUTab = styled(Tab)`
`

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col_input}
`