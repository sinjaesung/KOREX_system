//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

export default function MobileSearch() {
  return (
    <Container>
    {/*검색 기록 관련_SearchResult... */}
      <SearchResult>
      {/* 검색 기록이 없을때.(최초검색시) */}
        <NoneHisto>
          <NoneHistory>최근검색기록이 없습니다.</NoneHistory>
      {/*검색어를 입력했을때*/}
       {/*지역*/}
          <SearchArea style={{display:"block"}}>
            <SearchList>
              <Listtxt>
                <Link>지역이름</Link>
              </Listtxt>
              <Listtxt>
                <Link>지역이름</Link>
              </Listtxt>
              <Listtxt>
                <Link>지역이름</Link>
              </Listtxt>
            </SearchList>
          </SearchArea>
        {/*지하철*/}
          <SearchSubway style={{display:"block"}}>
          {/*검색어를 입력했을때*/}
            <SearchList>
              <Listtxt>
                <Link>지하철 내용</Link>
              </Listtxt>
              <Listtxt>
                <Link>지하철 내용</Link>
              </Listtxt>
              <Listtxt>
                <Link>지하철 내용</Link>
              </Listtxt>
            </SearchList>
          </SearchSubway>
        {/*대학교*/}
          <SearchUniv style={{display:"block"}}>
          {/*검색어를 입력했을때*/}
            <SearchList>
              <Listtxt>
                <Link>대학교 이름</Link>
              </Listtxt>
              <Listtxt>
                <Link>대학교 이름</Link>
              </Listtxt>
              <Listtxt>
                <Link>대학교 이름</Link>
              </Listtxt>
            </SearchList>
          </SearchUniv>
        </NoneHisto>
      {/*검색기록이 있을 때(한번이라도 검색했으면)*/}
        <HaveHisto style={{display:"none"}}>
          <History>
            <HistoryList>
              <Link>강남역</Link>
            </HistoryList>
            <HistoryList>
              <Link>강남역</Link>
            </HistoryList>
          </History>
          <WrapDeleteBtn>
            <Link to="#">
              <DeleteMsg>최근검색기록 삭제</DeleteMsg>
            </Link>
          </WrapDeleteBtn>
        </HaveHisto>
      </SearchResult>
    </Container>
  );
}
const Container = styled.div`
`
const SearchResult = styled.div`
  position:relative;
  width:100%;
  height:auto;
  margin-top:calc(100vw*(15/428));
  margin-bottom:calc(100vw*(50/428));
`
const NoneHisto = styled.div`
  display:block;
  width:100%;
  height:auto;
  background:#fff;
  padding:calc(100vw*(39/428)) calc(100vw*(36/428));
  border-top:1px solid #e2e2e2;
  z-index:2;
`
const SearchArea = styled.div`
  width:100%;
  margin-bottom:calc(100vw*(45/428));
`
const SearchSubway = styled(SearchArea)`
`
const SearchUniv = styled(SearchArea)`
margin-bottom:0;
`
const Line = styled.div`
  width:1px; height:100%;background:#f2f2f2;
`
const NoneHistory = styled.p`
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%) skew(-0.1deg);
  font-size:calc(100vw*(14/428));color:#979797;font-weight:600;
`
const WrapDeleteBtn = styled.div`
  position:absolute;
  right:calc(100vw*(16/428));
  bottom:0;
  z-index:3;
`
const DeleteMsg = styled.p`
  display:inline-block;
  font-size:calc(100vw*(14/428));
  font-weight:600;
  color:#898989;transform:skew(-0.1deg);
`
const HaveHisto = styled.div`
  width:100%;
  padding:calc(100vw*(39/428)) calc(100vw*(36/428));
  top:0px;
  left:0;
  height:auto;
  background:#fff;border-top:1px solid #e2e2e2;box-sizing:border-box;
  z-index:2;
`
const History = styled.ul`

`
const HistoryList = styled.li`
  font-size:16px;
  font-weight:600;
  transform:skew(-0.1deg);
  color:#4a4a4a;
  margin-bottom:10px;
`
const SearchList = styled.ul`
  width:100%;
`
const Listtxt = styled(HistoryList)`
`
