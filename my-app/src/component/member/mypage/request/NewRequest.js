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
          <p style={{ color: "red" }}>
            {/* **.수정요청 => 중개사의 '외부수임'과 동일한 입력 페이지들은(cf.[중개의뢰 가능한 단지검색] 제외), 전부 컴포넌트 처리하여 일관성 맞추세요!!!! */}
          </p>
          {children}
        </Sect_R2>
      )}
    </div>
  );
}

export default function Request({ setFilter, value, type }) {

  const [Value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    console.log('탭메뉴변경..,,,,,>>',newValue);
    switch(newValue){
      case 0:
        setActiveIndex(0);
      break;
      case 1:
        setActiveIndex(1);
      break;
      case 2:
        setActiveIndex(2);
      break;
      case 3:
        setActiveIndex(3);
      break;
    }
    setValue(newValue);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [openApart, setOpenApart] = useState(true);
  const [openStore, setOpenStore] = useState(false);
  const [selectInfo, setSelectInfo] = useState(false);


  console.log('newRequest콤포넌트 요소 실행,상태변화?:', activeIndex, openApart, openStore, selectInfo);

  useEffect(()=>{
    console.log('activeIndex값 변경::',activeIndex);
  },[activeIndex]);
  return (
    <>
      <Wrapper>
        <p className="tit-a2">내 물건 주소</p>
        <div className="par-spacing">
          <Tabs value={Value} onChange={handleChange} >
            <Tab label="아파트" />
            <Tab label="오피스텔" />
            <Tab label="상가" />
            <Tab label="사무실" />
          </Tabs>
          <div className="divider-a1" />
        </div>


        <TabPanel value={Value} index={0}>
          <SearchApartOfficetel selectInfo={selectInfo} setSelectInfo={setSelectInfo} />
          {
            (openApart == true && selectInfo == true) ?
              <SearchApartOfficetelSelectInfo activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
              :
              null
          }
        </TabPanel>
        <TabPanel value={Value} index={1}>
          <SearchApartOfficetel selectInfo={selectInfo} setSelectInfo={setSelectInfo} />
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

        {/* <MainTab>
                <Tab>
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
                </Tab>
              </MainTab> */}


        {/*주석 중개의뢰 가능한 단지 선택 모달*/}
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
        {/* 주석 동, 호수 선택 컴포넌트 아파트,오피스텔*/}
        {/* {
                (openApart==true && selectInfo==true) ?
                <SearchApartOfficetelSelectInfo activeIndex={activeIndex} setActiveIndex={setActiveIndex}/>
                :
                null

              } */}


      </Wrapper>
    </>
  );
}


const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col_input}
`