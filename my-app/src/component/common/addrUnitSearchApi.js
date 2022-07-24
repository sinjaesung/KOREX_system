//react
import React ,{useState, useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";

//css
import styled from "styled-components"
import IconSearch from '../../img/main/icon_search.png';

//material-ui
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// Init
import initFilter from '../map/initFilter';

//server process
import serverController from '../../server/serverController';

// redux
import { useSelector } from 'react-redux';

export default function PcSearchMain({setProbrokerlist}) {
  const [searchShow,setSearchShow] = useState(false);
  const history=useHistory();
  
  //검색에 따라 갱신될수있는 state변수 값들(해당 변수state들 변화감지해야함)
  const [addrunits_list, setAddrunits_list] = useState([]);

  const oonClickSearch = async (name) => {
    if(!name || name<0){
      alert('값이 유효하지 않음!');
      return;
    }

    let body_info={
      id_val : name,
    };
    let match_probrokerList= await serverController.connectFetchController('/api/matterial/addrunits_match_probrokerlist','POST',JSON.stringify(body_info));

    if(match_probrokerList){
      console.log('====>>>addrunuits match probrokerlist::',match_probrokerList);
      if(match_probrokerList.success){
        setProbrokerlist(match_probrokerList.result);
      }else{

      }
    }
  }

  const showModal =()=>{
    setSearchShow(!searchShow);
  }

  const search_addrgo = async (e) => {
    console.log('검색어 입력 시작:',e.target.value);
    let search_keyword=e.target.value; //검색어 지역명,지하철명관련,대학교명관련, 물건명 관련 검색. 물건명의 경우 안나옴 일단은 현재는... 지역,지하철,대학교만 제공.
     //해당 string기반 검색을 한다. 지역명은 지역의 이름, 대학교는 대학교명 ,지하철명 물건명으로 검색.
    if(search_keyword !=''){
      let body_info = {
        search_keyword_val : search_keyword
      };
      console.log('검색 키워드 (지역명)::',body_info);
      let search_result= await serverController.connectFetchController('/api/matterial/addrUnit_search','POST',JSON.stringify(body_info));
  
      if(search_result){
        console.log('===>>probrokerlist search results:::',search_result);
  
        let addrunits_list = search_result.result;
  
        setAddrunits_list(addrunits_list);
      }
    }else{
      setAddrunits_list([]);
    }
  };
  
  useEffect( () => {
    console.log('metro_list,uni9viertyysit_list변화감지에 따라 요소 리랜더링:');
  },[addrunits_list]);

  console.log("addrunits_list", addrunits_list);

  return (
    <Container>

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={addrunits_list}
        getOptionLabel={(option) => option.name}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="지역 검색" onChange={search_addrgo}/>}

        renderOption={(props, option) => (
          <Box component="li" sx={{}} {...props} onClick={() => { oonClickSearch(option.name) }}>
            {/* <Link onClick={() => { setSelect_complexid(option.complex_id); setModalDanji(true); setActive(false); }} className='data_link' /> */}
            <Title>{option.name}
  
            </Title>
          </Box>
        )}
       
      />




        <WrapMainSearch>
            {/* <MainSearch>
              <SearchInput type="text" name="" placeholder="지역 검색" onClick={() =>{setSearchShow(true)}} onChange={search_addrgo}/>
                <SearchBtn type="submit" name=""/>
            </mainSearch> */}
        {/*검색 기록 관련_SearchResult... */}
        {
          searchShow ?
          <SearchResult>
            <Bg onClick={()=>{setSearchShow(false)}}/>
          {/* 검색 기록이 없을때.(최초검색박스 클릭시) */}
            <NoneHisto>
              <SearchArea>
                <TopTxt>지역</TopTxt>
              {/*검색어를 입력했을때*/}
                <SearchList style={{display:"block"}}>
                  {
                    addrunits_list.map((value , index) => {
                      return(
                        <Listtxt>
                          <Link to='#' onClick={()=> oonClickSearch(value.name)}>{value.name}</Link>
                        </Listtxt>
                      )
                    })
                  }
                </SearchList>
              </SearchArea>            
            </NoneHisto>
         
          </SearchResult>
          :
          null
        }

        </WrapMainSearch>
    </Container>
  );
}
const Container = styled.div`

`
const Title = styled.h5``
const Box = styled.div`
  width:100%;
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
  position:Absolute;
  width:100%;
  top:44px;
  @media ${(props) => props.theme.container} {
      width:100%;
      height:calc(100vw*(460/1436));
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
  left:50%;
  transform:translateX(-50%);
  top:4px;
  display:flex;justify-content:space-between;
  width:100%;
  height:460px;
  background:#fff;
  padding:26px 20px;
  border:1px solid #e2e2e2;
  z-index:2;
  @media ${(props) => props.theme.container} {
      width:100%;
      left:50%;
    }

`
const SearchArea = styled.div`
  width:301px;height:100%;overflow-y:auto;
  @media ${(props) => props.theme.container} {
      width:100%;
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

`
const SearchSubway = styled(SearchArea)`
`
const SearchUniv = styled(SearchArea)`
`
const Line = styled.div`
  width:1px; height:100%;background:#f2f2f2;
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
const HaveHisto = styled.div`
  position:absolute;
  width:100%;
  padding:33px 36px;
  top:4px;
  left:0;
  height:460px;
  background:#fff;border:1px solid #e2e2e2;box-sizing:border-box;
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
  padding:0 22px;
  width:100%;
  margin-top:17px;
`
const Listtxt = styled(HistoryList)`
`
