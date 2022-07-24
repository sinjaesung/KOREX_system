//react
import React, { useState, useEffect,useRef } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"
import IconSearch from '../../img/main/icon_search.png';

//material-ui
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText'

//img
import closebtn from "../../img/main/close_btn.png";

// Init
import initFilter from '../map/initFilter';

//server process
import serverController from '../../server/serverController';

// redux
import { MapProductEls } from '../../store/actionCreators';
import { useSelector } from 'react-redux';
import theme from '../../theme';

export default function PcSearchMain({ activeText }) {
  const mainsearchinput=useRef();

  const [searchShow, setSearchShow] = useState(false);
  const history = useHistory();

  const [recentlysearch_show, setRecentlysearch_show] = useState(0);
  //메인 start검색에 따라 갱신될수있는 state변수 값들(해당 변수state들 변화감지해야함)
  const [metro_list, setMetro_list] = useState([]);
  const [university_list, setUniversity_list] = useState([]);
  const [addrunits_list, setAddrunits_list] = useState([]);
  const [product_list, setProduct_list] = useState([]);
  const [complex_list, setComplex_list] = useState([]);

  const [searchkeyword, setSearchkeyword] = useState('');//검색한 검색어string키워드 에대해서 기억하고있다가 enter,submit,리스트중 클릭하여 넘어가는순간 해당 검색어에 대해서 검색한것으로 간주하고 로컬스토리지에 저장.(브라우저단위) 임의로 삭제하지 않는이상 계속 존재.(유저별,로그인비로그인 상관없이 작동.)

  //로드시점때 로컬스토리지에 저장된 정보 조회.
  var load_prevsearchkeywordlist = localStorage.getItem('searchkeyword_list_string');
  var load_prevsearchkeywordlist_pure = localStorage.getItem('searchkeyword_list_stringpure');
  
  console.log('====>>>로드시점 이전키워드검색리스트::', load_prevsearchkeywordlist);
  if (load_prevsearchkeywordlist && load_prevsearchkeywordlist_pure) {
    load_prevsearchkeywordlist = load_prevsearchkeywordlist.split('|');
    load_prevsearchkeywordlist_pure = load_prevsearchkeywordlist_pure.split('|');
  }
  console.log('load_prevsearchkeywordlist_pure',load_prevsearchkeywordlist_pure);


  
  const oonClickSearch = async (search_type, id, prd_identity_id, product_type) => {

    // 검색버튼 눌렀을 때 정보 가져와서 api 연동하기
    localStorage.setItem("filterData", JSON.stringify(initFilter));
    //누른 id값에 해당하는 search_type,id 조회.
    // console.log('==>>검색결과리스트 중 임의 요소 클릭:',search_type,id, MapProductEls);

    console.log('검색키워드에 대한 리스트클릭시에 실행>검색어로 검색한것으로 간주:', searchkeyword);
    var now_time = new window.Date();
    var now_year = now_time.getFullYear();
    var now_month = now_time.getMonth() + 1 < 10 ? ('0' + (now_time.getMonth() + 1)) : now_time.getMonth() + 1;
    var now_date = now_time.getDate() + 1 < 10 ? ('0' + (now_time.getDate() + 1)) : now_time.getDate() + 1;
    var now_hour = now_time.getHours();
    var now_minutes = now_time.getMinutes();

    console.log('검색 시간:', now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes);

    var prev_searchkeywordlist = localStorage.getItem('searchkeyword_list_string');
    var prev_searchkeywordlist_pure=localStorage.getItem('searchkeyword_list_stringpure');
    console.log('기존 검색어리스트:::', prev_searchkeywordlist);
    if (prev_searchkeywordlist) {
      prev_searchkeywordlist += ('|' + (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
      prev_searchkeywordlist_pure += ('|'+searchkeyword);
      localStorage.setItem('searchkeyword_list_string', prev_searchkeywordlist);
      localStorage.setItem('searchkeyword_list_stringpure',prev_searchkeywordlist_pure);
    } else {
      localStorage.setItem("searchkeyword_list_string", (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
      localStorage.setItem('searchkeyword_list_stringpure',searchkeyword);
    }

    if (!id || id < 0) {
      alert('값이 유효하지 않음!');
      return;
    }
    var id_value = id;
    var product_search_type = '';
    var activetext_val = activeText;

    if (search_type == 'product') {
      if (prd_identity_id == -1) {
        id_value = id;
        product_search_type = 'dummy';
      } else {
        id_value = prd_identity_id;
        product_search_type = 'standard';
      }
      switch (product_type) {
        case '상가':
          activetext_val = 'store';
          break;
        case '아파트':
          activetext_val = 'apart';
          break;
        case '사무실':
          activetext_val = 'office';
          break;
        case '오피스텔':
          activetext_val = 'officetel';
          break;
      }
    }

    //임의 요소 클릭한 순간에 그냥 정보 저장 리덕스에 해버린다. 저장을 해버리고, 그 정보를 로컬에 저장해버린다.로컬에 정보가 있으면 그 정보의 위치로 표시한다. 마지막 로컬에 있던것으로 지도 위치 초기화한다. 그 검색하려는 지점에 대해서 중심으로 해서 그 주변 반경 화면px기준 계산하여 요청한 당시때의 화면 크기(브라우저화면크기 가로,세로)크기의 해당하는 크기만큼으로 처리한다.
    // console.log('===>>window.innerWIdth,height::',window.innerWidth,window.innerHeight);
    let body_info = {
      search_type_val: search_type,
      id_val: id,
      product_search_type_val: product_search_type,//일반 표준매물,더미매물 여부 구분위함.
      screen_width: window.innerWidth,//px
      screen_height: window.innerHeight,
      level: 3,
      prdtype_val: activetext_val //물건타입을 보낸다 선택된 물건타입에 대해서만 나오게 한다.초기검색.
    };
    let searchdetail_originresult = await serverController.connectFetchController('/api/matterial/main_searchresult_clickDetail', 'POST', JSON.stringify(body_info));

    if (searchdetail_originresult) {
      console.log('====>>>main searchdetail_originresult::', searchdetail_originresult);

      let searchdetail_origindata = searchdetail_originresult.result[0];
      localStorage.setItem('searchdetail_origin', JSON.stringify(searchdetail_origindata));
      if (searchdetail_originresult.outlineborder_result) {
        localStorage.setItem('searchdetail_origin_matcharea', JSON.stringify(searchdetail_originresult.outlineborder_result));
      } else {
        localStorage.setItem('searchdetail_origin_matcharea', null);
      }

      //로컬스토리지에 그냥 저장만 리덕스 저장처리되는것은, map이동하고 mapheader변경을 처리하지 안흔ㄴ다. 여기선 어차피 페이지이동되며, router로 인한 이동시에도 가능함.
    }

    history.push(`/Map/${activetext_val}`);//저기로 이동을 해버리면, 저기 페이지 요소가 실행되겠지.
  }

  const search_map_main = async (e) => {
    console.log('검색어 입력 시작:', e.target.value);
    let search_keyword = e.target.value; //검색어 지역명,지하철명관련,대학교명관련, 물건명 관련 검색. 물건명의 경우 안나옴 일단은 현재는... 지역,지하철,대학교만 제공.
    //해당 string기반 검색을 한다. 지역명은 지역의 이름, 대학교는 대학교명 ,지하철명 물건명으로 검색.
    setSearchkeyword(search_keyword);
    if (search_keyword != '') {
      let body_info = {
        search_keyword_val: search_keyword,
        maemultype: activeText,//아파트,오피스텔,상가,사무실 각 활성화되어있는 매물에 대해서만 나오게한다.
      };
      console.log('검색 키워드 (지역명,지하철명or대학교명,건물명)::', body_info);
      let search_result = await serverController.connectFetchController('/api/matterial/main_searchStart', 'POST', JSON.stringify(body_info));

      if (search_result) {
        console.log('===>>main search results:::', search_result);

        let metro_list = search_result.result[0];
        let university_list = search_result.result[1];
        let product_list = search_result.result[2];
        let complex_list = search_result.result[3];
        let addrunits_list = search_result.result[4];

        setMetro_list(metro_list);
        setUniversity_list(university_list);
        setProduct_list(product_list);
        setComplex_list(complex_list);
        setAddrunits_list(addrunits_list);

        if(metro_list.length >=1 || university_list.length>=1 || product_list.length>=1 || complex_list.length>=1 || addrunits_list.length>=1){
          console.log('검색결과가 존재한다면 최근검색단어기록 지운다');
          setRecentlysearch_show(0);
        }
      }
    } else {
      setMetro_list([]);
      setUniversity_list([]);
      setProduct_list([]);
      setComplex_list([]);
      setAddrunits_list([]);
    }
  };

  //@@-------------------------
  const recentkeyword_map_main = async (recent_keyword) => {
    console.log('검색어 입력 시작:',recent_keyword);
     //해당 string기반 검색을 한다. 지역명은 지역의 이름, 대학교는 대학교명 ,지하철명 물건명으로 검색.
    setSearchkeyword(recent_keyword);
    if(recent_keyword !=''){
      let body_info = {
        search_keyword_val : recent_keyword,
        maemultype: activeText,//아파트,오피스텔,상가,사무실 각 활성화되어있는 매물에 대해서만 나오게한다.
      };
      console.log('검색 키워드 (지역명,지하철명or대학교명,건물명)::',body_info);
      let search_result= await serverController.connectFetchController('/api/matterial/main_searchStart','POST',JSON.stringify(body_info));
  
      if(search_result){
        console.log('===>>main search results:::',search_result);
  
        let metro_list= search_result.result[0];
        let university_list = search_result.result[1];
        let product_list = search_result.result[2];
        let complex_list = search_result.result[3];
        let addrunits_list = search_result.result[4];
  
        setMetro_list(metro_list);
        setUniversity_list(university_list);
        setProduct_list(product_list);
        setComplex_list(complex_list);
        setAddrunits_list(addrunits_list);
      }
    }else{
      setMetro_list([]);
      setUniversity_list([]);
      setProduct_list([]);
      setComplex_list([]);
      setAddrunits_list([]);
    }
  };
  //-------------------------------@@

  const searchSubmit = async (e) => {
    console.log('검색어 입력후 검색버튼 누른경우 명시적 누른경우 or Enter');
    console.log('검색버튼 누른후 관련 리스트중 가장 첫 요소들을 기준으로 순서대로 하여 지도위치이동.', addrunits_list, metro_list, university_list, product_list, complex_list);

    //각 종류별 지역, 대학교&지하철, 매물&단지 에 품목별 내역에서 첫번쨰 index 값별로 넘겨서 관련 처리.
    var activetext_val = activeText;
    var searchtype;

    console.log('검색키워드에 대한 리스트클릭시에 실행>검색어로 검색한것으로 간주:', searchkeyword);
    var now_time = new window.Date();
    var now_year = now_time.getFullYear();
    var now_month = now_time.getMonth() + 1 < 10 ? ('0' + (now_time.getMonth() + 1)) : now_time.getMonth() + 1;
    var now_date = now_time.getDate() + 1 < 10 ? ('0' + (now_time.getDate() + 1)) : now_time.getDate() + 1;
    var now_hour = now_time.getHours();
    var now_minutes = now_time.getMinutes();

    console.log('검색 시간:', now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes);

    var prev_searchkeywordlist = localStorage.getItem('searchkeyword_list_string');
    var prev_searchkeywordlist_pure=localStorage.getItem('searchkeyword_list_stringpure');
    console.log('기존 검색어리스트:::', prev_searchkeywordlist);
    if (prev_searchkeywordlist) {
      prev_searchkeywordlist += ('|' + (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
      prev_searchkeywordlist_pure += ('|'+searchkeyword);
      localStorage.setItem('searchkeyword_list_string', prev_searchkeywordlist);
      localStorage.setItem('searchkeyword_list_stringpure',prev_searchkeywordlist_pure);
    } else {
      localStorage.setItem("searchkeyword_list_string", (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
      localStorage.setItem('searchkeyword_list_stringpure',searchkeyword);
    }


    if (addrunits_list.length >= 1) {
      var addrunits_param = addrunits_list[0].id;
    } else {
      var addrunits_param = null;
    }
    if (metro_list.length >= 1) {
      var metrolist_param = metro_list[0].id;
    } else {
      var metrolist_param = null;
    }
    if (university_list.length >= 1) {
      var university_param = university_list[0].id;
    } else {
      var university_param = null;
    }
    if (product_list.length >= 1) {
      var productlist_param = product_list[0].prd_identity_id;
    } else {
      var productlist_param = null;
    }
    if (complex_list.length >= 1) {
      var complexlist_param = complex_list[0].complex_id;
    } else {
      var complexlist_param = null;
    }

    //우선순위 매물>단지>대학교>지하철>지역 중 어떤 가장 우선순위가 큰 항목에 대해서 검색하려는지 판별.
    if (productlist_param) {
      searchtype = 'product';
    }
    if (complexlist_param) {
      searchtype = 'complex';
    }
    if (university_param) {
      searchtype = 'university';
    }
    if (metrolist_param) {
      searchtype = 'metro';
    }
    if (addrunits_param) {
      searchtype = 'addr_units';
    }

    if (!addrunits_param && !metrolist_param && !university_param && !productlist_param && !complexlist_param) {
      alert('검색데이터가 없습니다!');
      return false;
    }

    let body_info = {
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      level: 3,
      prdtype_val: activetext_val,//store,office,apart,officetel
      searchtype: searchtype,
      addrunits: addrunits_param,
      metrolist: metrolist_param,
      university: university_param,
      productlist: productlist_param,
      complexlist: complexlist_param
    };
    let searchdetail_originresult = await serverController.connectFetchController('/api/matterial/main_searchresult_clickDetail_enter', 'POST', JSON.stringify(body_info));

    if (searchdetail_originresult) {
      console.log('==============>> main searchdetail_originresultsss:', searchdetail_originresult);

      let searchdetail_origindata = searchdetail_originresult.result[0];
      localStorage.setItem('searchdetail_origin', JSON.stringify(searchdetail_origindata));
      if (searchdetail_originresult.outlineborder_result) {
        localStorage.setItem('searchdetail_origin_matcharea', JSON.stringify(searchdetail_originresult.outlineborder_result));
      } else {
        localStorage.setItem('searchdetail_origin_matcharea', null);
      }
    }
    history.push(`/Map/${activetext_val}`);//저기로 이동을 해버리면, 저기 페이지 요소가 실행되겠지.
  }


  const keypress_handle = async (event) => {
    console.log('윈도우 키 press이벤트 발생::', event.target, event.key);

    if (event.key == 'Enter') {
      console.log('검색어 입력후 검색버튼 누른경우 명시적 누른경우 or Enter');
      console.log('검색버튼 누른후 관련 리스트중 가장 첫 요소들을 기준으로 순서대로 하여 지도위치이동.', addrunits_list, metro_list, university_list, product_list, complex_list);

      //각 종류별 지역, 대학교&지하철, 매물&단지 에 품목별 내역에서 첫번쨰 index 값별로 넘겨서 관련 처리.
      var activetext_val = activeText;
      var searchtype;

      console.log('검색키워드에 대한 리스트클릭시에 실행>검색어로 검색한것으로 간주:', searchkeyword);
      var now_time = new window.Date();
      var now_year = now_time.getFullYear();
      var now_month = now_time.getMonth() + 1 < 10 ? ('0' + (now_time.getMonth() + 1)) : now_time.getMonth() + 1;
      var now_date = now_time.getDate() + 1 < 10 ? ('0' + (now_time.getDate() + 1)) : now_time.getDate() + 1;
      var now_hour = now_time.getHours();
      var now_minutes = now_time.getMinutes();

      console.log('검색 시간:', now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes);

      var prev_searchkeywordlist = localStorage.getItem('searchkeyword_list_string');
      var prev_searchkeywordlist_pure=localStorage.getItem('searchkeyword_list_stringpure');
      console.log('기존 검색어리스트:::', prev_searchkeywordlist);
      if (prev_searchkeywordlist) {
        prev_searchkeywordlist += ('|' + (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
        prev_searchkeywordlist_pure += ('|'+searchkeyword);
        localStorage.setItem('searchkeyword_list_string', prev_searchkeywordlist);
        localStorage.setItem('searchkeyword_list_stringpure',prev_searchkeywordlist_pure);
      } else {
        localStorage.setItem("searchkeyword_list_string", (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
        localStorage.setItem('searchkeyword_list_stringpure',searchkeyword);
      }

      if (addrunits_list.length >= 1) {
        var addrunits_param = addrunits_list[0].id;
      } else {
        var addrunits_param = null;
      }
      if (metro_list.length >= 1) {
        var metrolist_param = metro_list[0].id;
      } else {
        var metrolist_param = null;
      }
      if (university_list.length >= 1) {
        var university_param = university_list[0].id;
      } else {
        var university_param = null;
      }
      if (product_list.length >= 1) {
        var productlist_param = product_list[0].prd_identity_id;
      } else {
        var productlist_param = null;
      }
      if (complex_list.length >= 1) {
        var complexlist_param = complex_list[0].complex_id;
      } else {
        var complexlist_param = null;
      }

      //우선순위 매물>단지>대학교>지하철>지역 중 어떤 가장 우선순위가 큰 항목에 대해서 검색하려는지 판별.
      if (productlist_param) {
        searchtype = 'product';
      }
      if (complexlist_param) {
        searchtype = 'complex';
      }
      if (university_param) {
        searchtype = 'university';
      }
      if (metrolist_param) {
        searchtype = 'metro';
      }
      if (addrunits_param) {
        searchtype = 'addr_units';
      }

      if (!addrunits_param && !metrolist_param && !university_param && !productlist_param && !complexlist_param) {
        alert('검색데이터가 없습니다!');
        return false;
      }

      let body_info = {
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        level: 3,
        prdtype_val: activetext_val,//store,office,apart,officetel
        searchtype: searchtype,
        addrunits: addrunits_param,
        metrolist: metrolist_param,
        university: university_param,
        productlist: productlist_param,
        complexlist: complexlist_param
      };
      let searchdetail_originresult = await serverController.connectFetchController('/api/matterial/main_searchresult_clickDetail_enter', 'POST', JSON.stringify(body_info));

      if (searchdetail_originresult) {
        console.log('==============>> main searchdetail_originresultsss:', searchdetail_originresult);

        let searchdetail_origindata = searchdetail_originresult.result[0];
        localStorage.setItem('searchdetail_origin', JSON.stringify(searchdetail_origindata));
        if (searchdetail_originresult.outlineborder_result) {
          localStorage.setItem('searchdetail_origin_matcharea', JSON.stringify(searchdetail_originresult.outlineborder_result));
        } else {
          localStorage.setItem('searchdetail_origin_matcharea', null);
        }

          history.push(`/Map/${activetext_val}`);//저기로 이동을 해버리면, 저기 페이지 요소가 실행되겠지.
        
        
      }
 
    }
  }
  
  //@@---------------------
  const recently_keyword_click = (keyword) => {
    console.log('최근 검색어 키워드 클릭!!!:',keyword);

    //const regex = /^[ㄱ-ㅎ|\\n|가-힣|a-z|A-Z|0-9|]*/g;
    //const match_arrays=[...keyword.matchAll(regex)];
    console.log('recne tkey wordstring matchss:',keyword);

    mainsearchinput.current.value=keyword;

    recentkeyword_map_main(keyword);//최근키워드 기준으로 해서 검색한다.리스팅.
    setRecentlysearch_show(0);
    
  }

  //최근검색기록 삭제..
  const recently_searchkeywordlist_remove = () => {
    localStorage.removeItem('searchkeyword_list_string');//로컬스토리지 검색기록 삭제!
    localStorage.removeItem('searchkeyword_list_stringpure');//로컬스토리지 검색기록 삭제!
  }
  //window.addEventListener('keyPress',keypress_handle,false);
  //window.onkeydown = keypress_handle;

  useEffect(() => {
    console.log('metro_list,uni9viertyysit_list변화감지에 따라 요소 리랜더링:', metro_list, university_list);
  }, [metro_list, university_list, product_list, complex_list, addrunits_list]);
  //------------------------@@



  return (
    <>
      <Wrapper>
        {/* <MainSearch>
          <SearchInput type="text" name="" placeholder="지역,지하철,대학교,물건명 검색" onClick={() => { setSearchShow(true); setRecentlysearch_show(1) }} onChange={search_map_main} /> */}
          {/* <Link to={`/Map/${activeText}`} > */}
          {/* <SearchBtn type="submit" name="" onClick={() => { searchSubmit() }} /> */}
          {/* </Link> */}
        {/* </mainSearch> */}
        {/* <MainSearch> */}
        <MUTextField
          id="outlined-basic"
          label="지역,지하철,대학교,물건 검색"
          variant="outlined"
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end' >
                <SearchBtn type="submit" name="" onClick={() => { searchSubmit() }}>
                  <SearchIcon />
                </SearchBtn>
                {/* <SearchBtn type="submit" name="" /> */}
              </InputAdornment>
            ),
          }}
          onClick={() => { setSearchShow(true); setRecentlysearch_show(1) }} onChange={search_map_main} onKeyPress={keypress_handle} ref={mainsearchinput}
        />
        {/* </mainSearch> */}
        
        {/*검색 기록 관련_SearchResult... */}
        {
          searchShow ?
            <SearchResult>
              <Bg onClick={() => { setSearchShow(false) }} />
              {/* 검색 기록이 없을때.(최초검색박스 클릭시) */}
              <NoneHisto>
                <SearchArea>
                  <TopTxt>지역</TopTxt>
                  {/*검색어를 입력했을때*/}
                  <SearchList>
                    {
                      addrunits_list.map((value) => {
                        return (
                          <MUListItem disablePadding onClick={() => oonClickSearch('addr_units', value.id)}>
                            <MUListItemButton disablePadding>
                            <Link to='#' className="data_link"/>
                              <MUListItemText primary={`${value.name}`} />
                            </MUListItemButton>
                          </MUListItem>
                          // <Listtxt>
                          //   <Link to='#' onClick={() => oonClickSearch('addr_units', value.id)}>{value.name}</Link>
                          // </Listtxt>

                        )
                      })
                    }
                  </SearchList>

{/* 
                  <SearchList style={{ display: "block" }}>
                    {
                      addrunits_list.map((value) => {
                        return (
                          <Listtxt>
                            <Link to='#' onClick={() => oonClickSearch('addr_units', value.id)}>{value.name}</Link>
                          </Listtxt>
                        )
                      })
                    }
                  </SearchList> */}
                </SearchArea>
                {/* <Line /> */}

                <SearchSubway>
                  <TopTxt>지하철,대학교</TopTxt>
                  {/* <NoneHistory>최근검색기록이 없습니다.</NoneHistory> */}
                  {/*검색어를 입력했을때*/}
                  <SearchList>
                    {
                      metro_list.map((value) => {
                        return (
                          <MUListItem disablePadding onClick={() => oonClickSearch('metro', value.id)}>
                            <MUListItemButton disablePadding>
                            <Link to='#' className="data_link"/>
                              <MUListItemText primary={`${value.mtr_name}(${value.mtr_line})`} />
                            </MUListItemButton>
                          </MUListItem>
                          // <Listtxt>
                          //   <Link to='#' onClick={() => oonClickSearch('metro', value.id)}>{value.mtr_name}({value.mtr_line})</Link>
                          // </Listtxt>
                        )
                      })
                    }
                    {
                      university_list.map((value) => {
                        return (
                          <MUListItem disablePadding onClick={() => oonClickSearch('university', value.id)}>
                            <MUListItemButton disablePadding>
                            <Link to='#' className="data_link"/>
                              <MUListItemText primary={`${value.uvs_name}`} />
                            </MUListItemButton>
                          </MUListItem>
                          // <Listtxt>
                          //   <Link to='#' onClick={() => oonClickSearch('university', value.id)}>{value.uvs_name}</Link>
                          // </Listtxt>

                        )
                      })
                    }
                  </SearchList>
{/* 
                  <SearchList style={{ display: "block" }}>
                    {
                      metro_list.map((value) => {
                        return (
                          <Listtxt>
                            <Link to='#' onClick={() => oonClickSearch('metro', value.id)}>{value.mtr_name}({value.mtr_line})</Link>
                          </Listtxt>
                        )
                      })
                    }
                    {
                      university_list.map((value) => {
                        return (
                          <Listtxt>
                            <Link to='#' onClick={() => oonClickSearch('university', value.id)}>{value.uvs_name}</Link>
                          </Listtxt>
                        )
                      })
                    }
                  </SearchList> */}

                </SearchSubway>
                {/* <Line /> */}

                <SearchUniv>
                  <TopTxt>건물명</TopTxt>
                  {/*검색어를 입력했을때*/}
                  {/* <SearchList style={{ display: "block" }}>
                    {
                      product_list.map((value) => {
                        return (
                          <Listtxt>
                            <Link to='#' onClick={() => oonClickSearch('product', value.prd_id, value.prd_identity_id, value.prd_type)}>{value.prd_name}(매물:){value.prd_type}</Link>
                          </Listtxt>
                        )
                      })
                    }
                    {
                      complex_list.map((value) => {
                        return (
                          <Listtxt>
                            <Link to='#' onClick={() => oonClickSearch('complex', value.complex_id)}>{value.complex_name}(단지)</Link>
                          </Listtxt>
                        )
                      })
                    }
                  </SearchList> */}
                  <SearchList>            
                    {
                      product_list.map((value) => {
                        return (
                          <MUListItem disablePadding onClick={() => oonClickSearch('product', value.prd_id, value.prd_identity_id, value.prd_type)}>
                            <MUListItemButton disablePadding>
                              <Link to='#' className="data_link"/>
                              <MUListItemText primary={`${value.prd_name}(매물:)${value.prd_type}`} />
                            </MUListItemButton>
                          </MUListItem>
                          // <Listtxt>
                          //   <Link to='#' onClick={() => oonClickSearch('product', value.prd_id, value.prd_identity_id, value.prd_type)}>{value.prd_name}(매물:){value.prd_type}</Link>
                          // </Listtxt>
                        )
                      })
                    }
                    {
                      complex_list.map((value) => {
                        return (
                          <MUListItem disablePadding onClick={() => oonClickSearch('complex', value.complex_id)}>
                            <MUListItemButton disablePadding>
                            <Link to='#' className="data_link"/>
                              <MUListItemText primary={`${value.complex_name}`} />
                            </MUListItemButton>
                          </MUListItem>
                          // <Listtxt>
                          //   <Link to='#' onClick={() => oonClickSearch('complex', value.complex_id)}>{value.complex_name}(단지)</Link>
                          // </Listtxt>

                        )
                      })
                    }
                  </SearchList>
                </SearchUniv>
                <WrapDeleteBtn>
                  <Link to="#">
                    {/* <DeleteMsg>최근검색기록 삭제</DeleteMsg> */}
                  </Link>
                </WrapDeleteBtn>
              </NoneHisto>
              {/*검색기록이 있을 때(한번이라도 검색했으면) 검색기록 문자열들 히스토리로컬스토리지정보.*/}
              {
                recentlysearch_show == 1 ?
                  <HaveHisto style={{ display: "block" }}>
                    <History>
                      {
                        load_prevsearchkeywordlist_pure &&
                        load_prevsearchkeywordlist_pure.map((value,index) => {
                          console.log('index whtassssss:',index,load_prevsearchkeywordlist_pure[index]);
                          return (
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
                      <Closebtn onClick={() => { setRecentlysearch_show(0) }}>
                        닫기
                      </Closebtn>
                    </WrapDeleteBtn>
                  </HaveHisto>
                  :
                  null
              }
            </SearchResult>
            :
            null
        }

      </Wrapper>
    </>
  );
}

const MUListItem = styled(ListItem)`
`
const MUListItemButton = styled(ListItemButton)`
&.MuiListItemButton-root.MuiListItemButton-gutters.MuiButtonBase-root {
  padding-top: 1px;
  padding-bottom: 1px;
}
`
const MUListItemText = styled(ListItemText)`
& .MuiTypography-root {
  font-size: 0.9375rem;
}
`
const MUTextField = styled(TextField)`
&.MuiFormControl-root.MuiTextField-root {
  width: 450px;
}
`
//---------------------------------------------------------------

const Wrapper = styled.div`
  box-sizing: border-box;
  text-align: center;
`

const SearchBtn = styled.div`
  cursor: pointer;
`
const SearchResult = styled.div`
  position:relative;
  width:100%;
  text-align: left;
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
  display: flex;
  width:1029px;
  height:460px;
  background:#fff;
  padding:26px 0px;
  border:1px solid ${props => props.theme.palette.line.main};
  z-index:2;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
`

const SearchArea = styled.div`
  width: 100%;
  flex-grow: 1;
  border-right: 1px solid #dadce0;;
  &:nth-child(3) {
    border-right: none;
  }
`
const SearchSubway = styled(SearchArea)``
const SearchUniv = styled(SearchArea)``

const TopTxt = styled.div`
  height: 32px;
  padding: 0px 0px 8px 40px;
  transform:skew(-0.1deg);
`
const SearchList = styled.ul`
  padding-left:10%;
  height: calc(100% - 2rem);
  overflow-y:auto;
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
const HaveHisto = styled.div`
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  width:30%;
  padding:33px 36px;
  height:460px;overflow:hidden;
  background:#fff;
  border:1px solid ${props => props.theme.palette.line.main};
  z-index:2;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
`
const History = styled.ul`
  height:100%; overflow-y:auto;
`
const HistoryList = styled.li`
  padding-left:10%;
  height: auto;
`