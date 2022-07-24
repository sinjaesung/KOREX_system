//react
import React ,{useState, useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";

//css
import styled from "styled-components"
import IconSearch from '../../img/main/icon_search.png';

// Init
import initFilter from '../map/initFilter';

//server process
import serverController from '../../server/serverController';

// redux
import { MapProductEls } from '../../store/actionCreators';
import { useSelector } from 'react-redux';

export default function PcSearchMain({setSearchShow,oonClickSearch,metro_list,university_list,product_list,complex_list,addrunits_list, recentlysearch_show,recently_searchkeywordlist_remove,setRecentlysearch_show,recently_keyword_click}) {
  //const [searchShow,setSearchShow] = useState(false);
  const history=useHistory();
  
  var load_prevsearchkeywordlist_pure=localStorage.getItem('searchkeyword_list_stringpure');
  if(load_prevsearchkeywordlist_pure){
  load_prevsearchkeywordlist_pure= load_prevsearchkeywordlist_pure.split('|');
  }
  console.log('searchmain_mapdheadres purestringlist:',load_prevsearchkeywordlist_pure);

  return (
    <Container>
        <WrapMainSearch>
        {/*검색 기록 관련_SearchResult... */}
          <SearchResult>
            <Bg onClick={()=>{setSearchShow(false)}}/>
          {/* 검색 기록이 없을때.(최초검색박스 클릭시) */}
            <NoneHisto>
              <SearchArea>
                <TopTxt>지역</TopTxt>
              {/*검색어를 입력했을때*/}
                <SearchList style={{display:"block"}}>
                  {
                    addrunits_list.map( (value) => {
                      return(
                        <Listtxt>
                           <Link to='#' onClick={() => oonClickSearch('addr_units',value.id)}>{value.name}</Link>
                        </Listtxt>
                      )
                    })
                  }
                </SearchList>
              </SearchArea>
              <Line/>
              <SearchSubway>
                <TopTxt>지하철,대학교</TopTxt>
                {/*<NoneHistory>최근검색기록이 없습니다.</NoneHistory>*/}
              {/*검색어를 입력했을때*/}
                <SearchList style={{display:"block"}}>
                  {/*<Listtxt>
                    <Link to="#">지하철 내용</Link>
                  </Listtxt>
                  <Listtxt>
                    <Link to="#">지하철 내용</Link>
                  </Listtxt>
                  <Listtxt>
                    <Link to="#">지하철 내용</Link>
                  </Listtxt>*/}
                  {
                    metro_list.map( (value) => {
                      return(
                        <Listtxt>
                          <Link to='#' onClick={() => oonClickSearch('metro',value.id)}>{value.mtr_name}({value.mtr_line})</Link>
                        </Listtxt>
                      )
                    })
                  }
                  
                  {
                    university_list.map ( (value) => {
                      return(
                        <Listtxt>
                          <Link to='#'onClick={() => oonClickSearch('university',value.id)}>{value.uvs_name}</Link>
                        </Listtxt>
                      )
                    })
                  }
                </SearchList>
              </SearchSubway>
              <Line/>
              <SearchUniv>
                <TopTxt>건물명</TopTxt>
              {/*검색어를 입력했을때*/}
                <SearchList style={{display:"block"}}>
                  {/*<Listtxt>
                    <Link to="#">대학교 이름</Link>
                  </Listtxt>
                  <Listtxt>
                    <Link to="#">대학교 이름</Link>
                  </Listtxt>
                  <Listtxt>
                    <Link to="#">대학교 이름</Link>
                  </Listtxt>*/}
                  {
                    product_list.map( (value) => {
                      return(
                        <Listtxt>
                          <Link to ='#' onClick={() => oonClickSearch('product',value.prd_id,value.prd_identity_id,value.prd_type)}>{value.prd_name}(매물:){value.prd_type}</Link>
                        </Listtxt>
                      )
                    })
                  }
                  {
                    complex_list.map( (value) => {
                      return(
                        <Listtxt>
                          <Link to='#' onClick={() => oonClickSearch('complex',value.complex_id)}>{value.complex_name}(단지)</Link>
                        </Listtxt>
                      )
                    })
                  }
                  
                </SearchList>
              </SearchUniv>
            </NoneHisto>
            {/*검색기록이 있을 때(한번이라도 검색했으면) 검색기록 문자열들 히스토리로컬스토리지정보.*/}
           {
             recentlysearch_show == 1 ?
            <HaveHisto style={{display:"block"}}>
              <History>
                {
                  load_prevsearchkeywordlist_pure  && 
                  load_prevsearchkeywordlist_pure.map( (value) => {
                    return(
                      <HistoryList>
                        <Link onClick={()=>{recently_keyword_click(value)}}>{value}</Link>
                      </HistoryList>
                    )
                  })
                }

              </History>
              <WrapDeleteBtn>
                <Link to="#" onClick={recently_searchkeywordlist_remove}>
                  <DeleteMsg>최근검색기록 삭제</DeleteMsg>
                </Link>
                <Closebtn onClick={()=>{setRecentlysearch_show(0)}}>
                  닫기
                </Closebtn>
              </WrapDeleteBtn>
            </HaveHisto>
            :
            null
           }     
          </SearchResult>
        
        </WrapMainSearch>
    </Container>
  );
}
const Container = styled.div`
`
const WrapMainSearch = styled.div`
  position:relative;
  width:100%;
  height:auto;
  border-radius:9px;
  /*border:1px solid #D0D0D0;*/
`
const MainSearch = styled.div`
  display:inline-flex;
  justify-content:space-between;
  align-items:center;
  width:100%;
  height:48px;
  background:#f8f7f7;
  padding:13px 23.3px 14px 34px;
  box-sizing:border-box;
  border-radius:9px;
  position:relative;
  z-index:2;
`
const SearchInput = styled.input`
  width:375px;
  background:none;
  font-size:16px;
  transform: skew(-0.1deg);
  color:#707070;
  font-weight:bold;
  &::placeholder{color:#979797;}
`
const SearchBtn = styled.button`
  width:30px;
  height:30px;
  background:transparent url(${IconSearch}) no-repeat center center;
  background-size:19px 18px;
`

const SearchResult = styled.div`
  position:absolute;
  width:100%;
  top:0px;
  z-index:9;
  @media ${(props) => props.theme.container} {
      width:90%;
      height:calc(100vw*(460/1436));
    }
  @media ${(props) => props.theme.mobile} {
    width:90%;top:87px;
    height:calc(100vw*(460/428));
  }
`
const Bg = styled.div`
  position:fixed;
  width:100%;height:100%;
  left:0;top:0;display:block;content:'';
  background:transparent;
`
const NoneHisto = styled.div`
  position:absolute;
  left:0;
  top:4px;
  display:flex;justify-content:space-between;
  width:860px;
  height:360px;
  background:#fff;
  padding:26px 20px;
  border:1px solid #e2e2e2;
  z-index:201;
  @media ${(props) => props.theme.container} {
      width:1000px;
      left:0;
    }
    @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(428/428));
      left:calc(100vw*(-34/428));
      transform:none;
      display:block;
      padding:calc(100vw*(20/428));
      height:calc(100vw*(460/428));
      overflow-y:auto;
    }
`
const SearchArea = styled.div`
  width:301px;height:100%;overflow-y:auto;
  @media ${(props) => props.theme.container} {
      width:calc(100vw*(301/1436));
    }
    @media ${(props) => props.theme.mobile} {
      width:100%;
      height:auto;
      margin-bottom:calc(100vw*(20/428));
    }
`
const TopTxt = styled.div`
  position:relative;
  width:100%;
  font-size:16px;
  color:#4a4a4a;
  padding-bottom:15px;
  padding-left:20px;
  font-weight:600;
  transform:skew(-0.1deg);
  &:after{
    position:absolute;left:0;bottom:0px;content:'';display:block;
    width:100%;height:1px;
    border-bottom:1px solid #4a4a4a;}
    @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(16/428));
      padding-left:calc(100vw*(10/428));
      padding-bottom:calc(100vw*(15/428));
    }
`
const SearchSubway = styled(SearchArea)`
`
const SearchUniv = styled(SearchArea)`
`
const Line = styled.div`
  width:1px; height:100%;background:#f2f2f2;
  @media ${(props) => props.theme.mobile} {
      height:auto; 
    }
`
const NoneHistory = styled.p`
  position:absolute;
  left:50%;
  top:186px;
  transform:translateX(-50%) skew(-0.1deg);
  font-size:14px;color:#979797;font-weight:600;
`
const WrapDeleteBtn = styled.div`
  position:absolute;
  right:16px;
  bottom:10px;
  z-index:3;
`
const DeleteMsg = styled.p`
  display:inline-block;
  font-size:13px;
  margin-left:11px;
  height:18px;
  line-height:18px;
  font-weight:600;
  color:#898989;transform:skew(-0.1deg);
`
const Closebtn = styled.p`
  display:inline-block;cursor:pointer;
  font-size:13px;
  margin-left:11px;
  height:18px;
  line-height:18px;
  font-weight:600;
  color:#898989;transform:skew(-0.1deg);
`
const Img= styled.img`
   display:block;width:20px;height:20px;margin-bottom:6px; cursor:pointer;
`

const HaveHisto = styled.div`
  position:absolute;
  width:100%;
  padding:33px 36px;
  top:4px;
  left:0;
  height:460px;overflow:hidden;
  background:#fff;border:1px solid #e2e2e2;box-sizing:border-box;
  z-index:209;
`
const History = styled.ul
`
height:100%;overflow-y:auto;
`
const HistoryList = styled.li`
  font-size:16px;
  font-weight:600;
  transform:skew(-0.1deg);
  color:#4a4a4a;
  margin-bottom:10px;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(14/428));
      margin-bottom:calc(100vw*(10/428));
    }
`
const SearchList = styled.ul`
  padding:0 22px;
  width:100%;
  margin-top:17px;
  @media ${(props) => props.theme.mobile} {
      margin-top:calc(100vw*(15/428));
      padding:0 calc(100vw*(20/428));
    }
`
const Listtxt = styled(HistoryList)`
`