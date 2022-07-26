//react
import React ,{useState, useEffect,useRef} from 'react';
import {Link,useHistory} from "react-router-dom";

//css
import styled from "styled-components"
import IconSearch from '../../img/main/icon_search.png';
import closebtn from "../../img/main/close_btn.png";

//components
import MbSearch from './mobilecomp/MbSearchBody';

// Init
import initFilter from '../map/initFilter';

//material-ui
import TextField from '@material-ui/core/TextField';
import { styled as MUstyled } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';


// redux
import { MapFilterRedux, MapProductEls, mapHeader } from '../../store/actionCreators';
import { useSelector } from 'react-redux';

//server process
import serverController from '../../server/serverController';

export default function MobileSearch({ activeText, setOpen}) {

  const [searchShow,setSearchShow] = useState(false);
  const history=useHistory();
  
  const [currentTab, setCurrentTab] = useState(activeText);

  const mainsearchinput=useRef();

   //메인 start검색에 따라 갱신될수있는 state변수 값들(해당 변수state들 변화감지해야함)
   const [recentlysearch_show,setRecentlysearch_show] = useState(0);
   const [metro_list,setMetro_list] = useState([]);
   const [university_list,setUniversity_list] = useState([]);
   const [addrunits_list, setAddrunits_list] = useState([]);
   const [product_list,setProduct_list] = useState([]);
   const [complex_list,setComplex_list] = useState([]);

   const [searchkeyword,setSearchkeyword] = useState('');
   //로드시점때 로컬스토리지에 저장된 정보 조회.
  var load_prevsearchkeywordlist_pure=localStorage.getItem('searchkeyword_list_stringpure');
  console.log('====>>>로드시점 이전키워드검색리스트::',load_prevsearchkeywordlist_pure);
  if(load_prevsearchkeywordlist_pure){
    load_prevsearchkeywordlist_pure= load_prevsearchkeywordlist_pure.split('|');
  }

  //  const oonClickSearch = async (search_type,id, prd_identity_id, product_type) => {

  //   // 검색버튼 눌렀을 때 정보 가져와서 api 연동하기
  //   localStorage.setItem( "filterData", JSON.stringify(initFilter));
  //   //누른 id값에 해당하는 search_type,id 조회.
  //   // console.log('==>>검색결과리스트 중 임의 요소 클릭:',search_type,id, MapProductEls);

  //   console.log('검색키워드에 대한 리스트클릭시에 실행>검색어로 검색한것으로 간주:',searchkeyword);
  //   var now_time=new window.Date();
  //   var now_year=now_time.getFullYear();
  //   var now_month=now_time.getMonth()+1<10?('0'+(now_time.getMonth()+1)):now_time.getMonth()+1;
  //   var now_date=now_time.getDate()+1<10?('0'+(now_time.getDate()+1)):now_time.getDate()+1;
  //   var now_hour=now_time.getHours();
  //   var now_minutes=now_time.getMinutes();

  //   console.log('검색 시간:',now_year+'-'+now_month+'-'+now_date+' '+now_hour+":"+now_minutes);

  //   var prev_searchkeywordlist=localStorage.getItem('searchkeyword_list_string');
  //   console.log('기존 검색어리스트:::',prev_searchkeywordlist);
  //   if(prev_searchkeywordlist){
  //     prev_searchkeywordlist += ('|'+(searchkeyword+"  ["+now_year+'-'+now_month+'-'+now_date+' '+now_hour+":"+now_minutes+"]") );
  //     localStorage.setItem('searchkeyword_list_string',prev_searchkeywordlist);
  //   }else{
  //     localStorage.setItem("searchkeyword_list_string",(searchkeyword+"  ["+now_year+'-'+now_month+'-'+now_date+' '+now_hour+":"+now_minutes+"]"));
  //   }

  //   if(!id || id<0){
  //     alert('값이 유효하지 않음!');
  //     return;
  //   }
  //   var id_value=id;
  //   var product_search_type='';
  //   var activetext_val = activeText;

  //   if(search_type =='product'){
  //     if(prd_identity_id == -1){
  //       id_value = id;
  //       product_search_type = 'dummy';
  //     }else{
  //       id_value = prd_identity_id;
  //       product_search_type = 'standard';
  //     }
  //     switch(product_type){
  //       case '상가':
  //         activetext_val = 'store';
  //       break;
  //       case '아파트':
  //         activetext_val = 'apart';
  //       break;
  //       case '사무실':
  //         activetext_val = 'office';
  //       break;
  //       case '오피스텔':
  //         activetext_val = 'officetel';
  //       break;
  //     }
  //   }

  //   //임의 요소 클릭한 순간에 그냥 정보 저장 리덕스에 해버린다. 저장을 해버리고, 그 정보를 로컬에 저장해버린다.로컬에 정보가 있으면 그 정보의 위치로 표시한다. 마지막 로컬에 있던것으로 지도 위치 초기화한다. 그 검색하려는 지점에 대해서 중심으로 해서 그 주변 반경 화면px기준 계산하여 요청한 당시때의 화면 크기(브라우저화면크기 가로,세로)크기의 해당하는 크기만큼으로 처리한다.
  //   // console.log('===>>window.innerWIdth,height::',window.innerWidth,window.innerHeight);
  //   let body_info={
  //     search_type_val : search_type,
  //     id_val : id,
  //     product_search_type_val : product_search_type,//일반 표준매물,더미매물 여부 구분위함.
  //     screen_width : window.innerWidth,//px
  //     screen_height : window.innerHeight,
  //     level : 3 , 
  //     prdtype_val : activetext_val //물건타입을 보낸다 선택된 물건타입에 대해서만 나오게 한다.초기검색.
  //   };
  //   let searchdetail_originresult= await serverController.connectFetchController('/api/matterial/main_searchresult_clickDetail','POST',JSON.stringify(body_info));

  //   if(searchdetail_originresult){
  //     console.log('====>>>main searchdetail_originresult::',searchdetail_originresult);

  //     let searchdetail_origindata= searchdetail_originresult.result[0];
  //     localStorage.setItem('searchdetail_origin',JSON.stringify(searchdetail_origindata));
  //     //로컬스토리지에 그냥 저장만 리덕스 저장처리되는것은, map이동하고 mapheader변경을 처리하지 안흔ㄴ다. 여기선 어차피 페이지이동되며, router로 인한 이동시에도 가능함.
  //     if(searchdetail_originresult.outlineborder_result){
  //       localStorage.setItem('searchdetail_origin_matcharea',JSON.stringify(searchdetail_originresult.outlineborder_result));
  //     }else{
  //       localStorage.setItem('searchdetail_origin_matcharea',null);
  //     }
  //   }
  //    console.log(activetext_val);
  //   console.log('동작 진행?');
  //   history.push(`/Map/${activetext_val}`);//저기로 이동을 해버리면, 저기 페이지 요소가 실행되겠지.
  // }

  const oonClickSearch = async (search_type, id, prd_identity_id, product_type) => {
    // 검색버튼 눌렀을 때 정보 가져와서 api 연동하기
    MapFilterRedux.updateFilterRest(initFilter);
    localStorage.setItem("filterData", JSON.stringify(initFilter));
    //누른 id값에 해당하는 search_type,id 조회.
    // console.log('==>>검색결과리스트 중 임의 요소 클릭:',search_type,id, prd_identity_id, MapProductEls); //id:complexid,prd_id,prd_idneity_id(전속매물:더미매물이면-1값이고, 더미매물이면 매물검색시에 그 매물의 위치를 기준 검색시에 prdid기준 검색하고, 표준매물이면 prdidneitityid기준 검색.) , complex_id, id , id

    console.log('검색키워드에 대한 리스트클릭시에 실행>검색어로 검색한것으로 간주:', searchkeyword);
    var now_time = new window.Date();
    var now_year = now_time.getFullYear();
    var now_month = now_time.getMonth() + 1 < 10 ? ('0' + (now_time.getMonth() + 1)) : now_time.getMonth() + 1;
    var now_date = now_time.getDate() + 1 < 10 ? ('0' + (now_time.getDate() + 1)) : now_time.getDate() + 1;
    var now_hour = now_time.getHours();
    var now_minutes = now_time.getMinutes();

    console.log('검색 시간:', now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes);

    var prev_searchkeywordlist = localStorage.getItem('searchkeyword_list_string');
    console.log('기존 검색어리스트:::', prev_searchkeywordlist);
    if (prev_searchkeywordlist) {
      prev_searchkeywordlist += ('|' + (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
      localStorage.setItem('searchkeyword_list_string', prev_searchkeywordlist);
    } else {
      localStorage.setItem("searchkeyword_list_string", (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
    }

    if (!id || id < 0) {
      alert('값이 유효화지 않음!!');
      return;
    }
    //임의 요소 클릭한 순간에 그냥 정보 저장 리덕스에 해버린다. 저장을 해버리고, 그 정보를 로컬에 저장해버린다.로컬에 정보가 있으면 그 정보의 위치로 표시한다. 마지막 로컬에 있던것으로 지도 위치 초기화한다. 그 검색하려는 지점에 대해서 중심으로 해서 그 주변 반경 화면px기준 계산하여 요청한 당시때의 화면 크기(브라우저화면크기 가로,세로)크기의 해당하는 크기만큼으로 처리한다.
    var id_value = id;
    var product_search_type = '';
    var current_tab = currentTab;

    if (search_type == 'product') {
      if (prd_identity_id == -1) {
        id_value = id;//prdid지정.
        product_search_type = 'dummy';
      } else {
        //표준매물이면
        id_value = prd_identity_id;
        product_search_type = 'standard';
      }
      switch (product_type) {
        case '상가':
          current_tab = 'store';
          break;
        case '아파트':
          current_tab = 'apart';
          break;
        case '사무실':
          current_tab = 'office';
          break;
        case '오피스텔':
          current_tab = 'officetel';
          break;
      }
    }
    // console.log('===>>window.innerWIdth,height::',window.innerWidth,window.innerHeight);
    let body_info = {
      search_type_val: search_type,//product검색,compelx검색, addrunits,metro,univireryisty검색
      id_val: id_value,
      product_search_type_val: product_search_type,
      screen_width: window.innerWidth,//px
      screen_height: window.innerHeight,
      level: 5,
      prdtype_val: current_tab //물건타입을 보낸다 선택된 물건타입에 대해서만 나오게 한다.초기검색.매물검색시가 아니ㅏ라면 currentatb은 메인해더 셀렉트박스값(선택값)
    };
    let searchdetail_originresult = await serverController.connectFetchController('/api/matterial/main_searchresult_clickDetail', 'POST', JSON.stringify(body_info));

    if (searchdetail_originresult) {
      console.log('====>>>main searchdetail_originresult::', searchdetail_originresult);

      let searchdetail_orgindata = searchdetail_originresult.result[0];

      localStorage.setItem('searchdetail_origin', JSON.stringify(searchdetail_orgindata));
      //나온 단지들데이터들, 지도에 나타내는것 자체는 단지 자체이다. 그 단지에 관련된 단지별 실거래들도 불러옴 단지,단지별 실거래(단지자체의x,y기준 지도에 불러오기) 리덕스 저장이 나을듯??
      //관련 리덕스 데이터에 저장하는게 좋을것임. 그것을 지도에 마커랑, 클러스터화해서 보여줄필요가있음.  단지별,단지실거래 데이터들 저장 + 매물데이터들 저장하기, 전문중개사 데이터 저장 및 보여주기. product, company, compelx data(searchdeetail_origin은 검색하고자 하는 기준 중심점이며, 상황에 따라 다르나, 지하철,대학교,지역의 경우 x,y중심점만 제공해도 충분하고, 단지나 매물의 경우는 그 매물의 좌표값 마찬가지로 제공하여 참조하여 지도에 마커 highlight표시필요:그려주는부분)
      if (searchdetail_originresult.outlineborder_result) {
        localStorage.setItem('searchdetail_origin_matcharea', JSON.stringify(searchdetail_originresult.outlineborder_result));
      } else {
        localStorage.setItem('searchdetail_origin_matcharea', null);
      }

      mapHeader.updateprdtype({ prdtypes: current_tab });
      //complexid, prdid or prdIdentityid , id(지하철,대학교,지역) 고유id값. 일단 oriignid형태로 저장. 실제 쓰이는것은 complex,product

      if (searchdetail_orgindata && searchdetail_orgindata['prd_id'] && searchdetail_orgindata['prd_identity_id']) {
        var x_val = searchdetail_orgindata['prd_longitude'];
        var y_val = searchdetail_orgindata['prd_latitude'];
        mapHeader.updateorigin({ origins: { x: x_val, y: y_val } });

        if (searchdetail_orgindata['prd_identity_id'] == -1) {
          //더미매물
          var id_valss = searchdetail_orgindata['prd_id'];
          mapHeader.updateoriginid({ originid: { id_vals: id_valss, origintype: 'exclusive' } });
        } else {
          //표준매물
          var id_valss = searchdetail_orgindata['prd_identity_id'];
          mapHeader.updateoriginid({ originid: { id_vals: id_valss, origintype: 'exclusive' } });
        }
      } else if (searchdetail_orgindata && searchdetail_orgindata['complex_id']) {
        var x_val = searchdetail_orgindata['x'];
        var y_val = searchdetail_orgindata['y'];
        var id_valss = searchdetail_orgindata['complex_id'];

        mapHeader.updateoriginid({ originid: { id_vals: id_valss, origintype: 'complex' } });
        mapHeader.updateorigin({ origins: { x: x_val, y: y_val } });
      } else {
        //지역,지하철,대학교 기준 중심좌표로 이동 및 검색.

        var x_val = searchdetail_orgindata['x'] && searchdetail_orgindata['x'];
        var y_val = searchdetail_orgindata['y'] && searchdetail_orgindata['y'];
        var id_valss = searchdetail_orgindata['id'] && searchdetail_orgindata['id'];

        mapHeader.updateoriginid({ originid: { id_vals: id_valss } });
        mapHeader.updateorigin({ origins: { x: x_val, y: y_val } });
      }
    }

    history.push(`/Map/${current_tab}`);//저기로 이동을 해버리면, 저기 페이지 요소가 실행되겠지.
    setOpen(false);
  }





  

  const showModal =()=>{
    setSearchShow(!searchShow);
  }

  const search_map_main = async (e) => {
    console.log('검색어 입력 시작:',e.target.value);
    let search_keyword=e.target.value; //검색어 지역명,지하철명관련,대학교명관련, 물건명 관련 검색. 물건명의 경우 안나옴 일단은 현재는... 지역,지하철,대학교만 제공.
     //해당 string기반 검색을 한다. 지역명은 지역의 이름, 대학교는 대학교명 ,지하철명 물건명으로 검색.
    setSearchkeyword(search_keyword);
    if(search_keyword !=''){
      setRecentlysearch_show(0);
      let body_info = {
        search_keyword_val : search_keyword,
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
      setRecentlysearch_show(1);
      setMetro_list([]);
      setUniversity_list([]);
      setProduct_list([]);
      setComplex_list([]);
      setAddrunits_list([]);
    }
  };
  
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

  const searchSubmit = async (e) => {
    console.log('검색어 입력후 검색버튼 누른경우 명시적 누른경우 or Enter');
    console.log('검색버튼 누른후 관련 리스트중 가장 첫 요소들을 기준으로 순서대로 하여 지도위치이동.',addrunits_list,metro_list,university_list,product_list,complex_list);

    //각 종류별 지역, 대학교&지하철, 매물&단지 에 품목별 내역에서 첫번쨰 index 값별로 넘겨서 관련 처리.
    var activetext_val = activeText;
    var searchtype;

    console.log('검색키워드에 대한 리스트클릭시에 실행>검색어로 검색한것으로 간주:',searchkeyword);
    var now_time=new window.Date();
    var now_year=now_time.getFullYear();
    var now_month=now_time.getMonth()+1<10?('0'+(now_time.getMonth()+1)):now_time.getMonth()+1;
    var now_date=now_time.getDate()+1<10?('0'+(now_time.getDate()+1)):now_time.getDate()+1;
    var now_hour=now_time.getHours();
    var now_minutes=now_time.getMinutes();

    console.log('검색 시간:',now_year+'-'+now_month+'-'+now_date+' '+now_hour+":"+now_minutes);

    var prev_searchkeywordlist=localStorage.getItem('searchkeyword_list_string');
    var prev_searchkeywordlist_pure=localStorage.getItem('searchkeyword_list_stringpure');
    console.log('기존 검색어리스트:::',prev_searchkeywordlist);
    if(prev_searchkeywordlist){
      prev_searchkeywordlist += ('|'+(searchkeyword+"  ["+now_year+'-'+now_month+'-'+now_date+' '+now_hour+":"+now_minutes+"]") );
      prev_searchkeywordlist_pure += ('|'+searchkeyword);
      localStorage.setItem('searchkeyword_list_string',prev_searchkeywordlist);
      localStorage.setItem('searchkeyword_list_stringpure',prev_searchkeywordlist_pure);
    }else{
      localStorage.setItem("searchkeyword_list_string",(searchkeyword+"  ["+now_year+'-'+now_month+'-'+now_date+' '+now_hour+":"+now_minutes+"]"));
      localStorage.setItem('searchkeyword_list_stringpure',searchkeyword);
    }

    if(addrunits_list.length >=1){
      var addrunits_param=addrunits_list[0].id;
    }else{
      var addrunits_param=null;
    }
    if(metro_list.length >=1){
      var metrolist_param = metro_list[0].id;
    }else{
      var metrolist_param=null;
    }
    if(university_list.length>=1){
      var university_param=university_list[0].id;
    }else{
      var university_param=null;
    }
    if(product_list.length>=1){
      var productlist_param=product_list[0].prd_identity_id;
    }else{
      var productlist_param=null;
    }
    if(complex_list.length>=1){
      var complexlist_param = complex_list[0].complex_id;
    }else{
      var complexlist_param=null;
    }

    //우선순위 매물>단지>대학교>지하철>지역 중 어떤 가장 우선순위가 큰 항목에 대해서 검색하려는지 판별.
    if(productlist_param){
      searchtype='product';
    }
    if(complexlist_param){
      searchtype='complex';
    }
    if(university_param){
      searchtype='university';
    }
    if(metrolist_param){
      searchtype='metro';
    }
    if(addrunits_param){
      searchtype='addr_units';
    }

    if(!addrunits_param && !metrolist_param && !university_param && !productlist_param && !complexlist_param){
      alert('검색데이터가 없습니다!');
      return false;
    }

    let body_info = {
      screen_width: window.innerWidth,
      screen_height : window.innerHeight,
      level : 3,
      prdtype_val : activetext_val,//store,office,apart,officetel
      searchtype : searchtype,
      addrunits : addrunits_param,
      metrolist : metrolist_param,
      university: university_param,
      productlist: productlist_param,
      complexlist : complexlist_param
    };
    let searchdetail_originresult= await serverController.connectFetchController('/api/matterial/main_searchresult_clickDetail_enter','POST',JSON.stringify(body_info));

    if(searchdetail_originresult){
      console.log('==============>> main searchdetail_originresultsss:',searchdetail_originresult);

      let searchdetail_origindata = searchdetail_originresult.result[0];
      localStorage.setItem('searchdetail_origin',JSON.stringify(searchdetail_origindata));
      if(searchdetail_originresult.outlineborder_result){
        localStorage.setItem('searchdetail_origin_matcharea',JSON.stringify(searchdetail_originresult.outlineborder_result));
      }else{
        localStorage.setItem('searchdetail_origin_matcharea',null);
      }
    }
    history.push(`/Map/${activetext_val}`);//저기로 이동을 해버리면, 저기 페이지 요소가 실행되겠지.
  }
  const keypress_handle = async (event) => {
    console.log('윈도우 키 press이벤트 발생::',event.target,event.key);

    if(event.key == 'Enter'){
      console.log('검색어 입력후 검색버튼 누른경우 명시적 누른경우 or Enter');
      console.log('검색버튼 누른후 관련 리스트중 가장 첫 요소들을 기준으로 순서대로 하여 지도위치이동.',addrunits_list,metro_list,university_list,product_list,complex_list);

      //각 종류별 지역, 대학교&지하철, 매물&단지 에 품목별 내역에서 첫번쨰 index 값별로 넘겨서 관련 처리.
      var activetext_val = activeText;
      var searchtype;

      console.log('검색키워드에 대한 리스트클릭시에 실행>검색어로 검색한것으로 간주:',searchkeyword);
      var now_time=new window.Date();
      var now_year=now_time.getFullYear();
      var now_month=now_time.getMonth()+1<10?('0'+(now_time.getMonth()+1)):now_time.getMonth()+1;
      var now_date=now_time.getDate()+1<10?('0'+(now_time.getDate()+1)):now_time.getDate()+1;
      var now_hour=now_time.getHours();
      var now_minutes=now_time.getMinutes();

      console.log('검색 시간:',now_year+'-'+now_month+'-'+now_date+' '+now_hour+":"+now_minutes);

      var prev_searchkeywordlist=localStorage.getItem('searchkeyword_list_string');
      var prev_searchkeywordlist_pure=localStorage.getItem('searchkeyword_list_stringpure');
      console.log('기존 검색어리스트:::',prev_searchkeywordlist);
      if(prev_searchkeywordlist && prev_searchkeywordlist_pure){
        prev_searchkeywordlist += ('|'+(searchkeyword+"  ["+now_year+'-'+now_month+'-'+now_date+' '+now_hour+":"+now_minutes+"]") );
        prev_searchkeywordlist_pure += ('|'+searchkeyword);
        localStorage.setItem('searchkeyword_list_string',prev_searchkeywordlist);
        localStorage.setItem('searchkeyword_list_stringpure',prev_searchkeywordlist_pure);
      }else{
        localStorage.setItem("searchkeyword_list_string",(searchkeyword+"  ["+now_year+'-'+now_month+'-'+now_date+' '+now_hour+":"+now_minutes+"]"));
        localStorage.setItem('searchkeyword_list_stringpure',searchkeyword);
      }
      
      if(addrunits_list.length >=1){
        var addrunits_param=addrunits_list[0].id;
      }else{
        var addrunits_param=null;
      }
      if(metro_list.length >=1){
        var metrolist_param = metro_list[0].id;
      }else{
        var metrolist_param=null;
      }
      if(university_list.length>=1){
        var university_param=university_list[0].id;
      }else{
        var university_param=null;
      }
      if(product_list.length>=1){
        var productlist_param=product_list[0].prd_identity_id;
      }else{
        var productlist_param=null;
      }
      if(complex_list.length>=1){
        var complexlist_param = complex_list[0].complex_id;
      }else{
        var complexlist_param=null;
      }

      //우선순위 매물>단지>대학교>지하철>지역 중 어떤 가장 우선순위가 큰 항목에 대해서 검색하려는지 판별.
      if(productlist_param){
        searchtype='product';
      }
      if(complexlist_param){
        searchtype='complex';
      }
      if(university_param){
        searchtype='university';
      }
      if(metrolist_param){
        searchtype='metro';
      }
      if(addrunits_param){
        searchtype='addr_units';
      }

      if(!addrunits_param && !metrolist_param && !university_param && !productlist_param && !complexlist_param){
        alert('검색데이터가 없습니다!');
        return false;
      }else{
        let body_info = {
          screen_width: window.innerWidth,
          screen_height : window.innerHeight,
          level : 3,
          prdtype_val : activetext_val,//store,office,apart,officetel
          searchtype : searchtype,
          addrunits : addrunits_param,
          metrolist : metrolist_param,
          university: university_param,
          productlist: productlist_param,
          complexlist : complexlist_param
        };
        let searchdetail_originresult= await serverController.connectFetchController('/api/matterial/main_searchresult_clickDetail_enter','POST',JSON.stringify(body_info));
  
        if(searchdetail_originresult){
          console.log('==============>> main searchdetail_originresultsss:',searchdetail_originresult);
  
          let searchdetail_origindata = searchdetail_originresult.result[0];
          localStorage.setItem('searchdetail_origin',JSON.stringify(searchdetail_origindata));
          if(searchdetail_originresult.outlineborder_result){
            localStorage.setItem('searchdetail_origin_matcharea',JSON.stringify(searchdetail_originresult.outlineborder_result));
          }else{
            localStorage.setItem('searchdetail_origin_matcharea',null);
          }
          if(searchdetail_originresult.result && searchdetail_originresult.outlineborder_result){
            history.push(`/Map/${activetext_val}`);//저기로 이동을 해버리면, 저기 페이지 요소가 실행되겠지.
          }
        }      
      }  
    }
  }
  const recently_keyword_click = (keyword) => {
    console.log('최근 검색어 키워드 클릭!!!:',keyword);

    //const regex = /^[ㄱ-ㅎ|\\n|가-힣|a-z|A-Z|0-9|]*/g;
    //const match_arrays=[...keyword.matchAll(regex)];
    console.log('recne tkey wordstring matchss:',keyword);

    /*if(mainsearchinput){
      mainsearchinput.current.value=keyword;
    }*/
   
    recentkeyword_map_main(keyword);//최근키워드 기준으로 해서 검색한다.리스팅.
  }
  //최근검색기록 삭제..
  const recently_searchkeywordlist_remove = () => {
    localStorage.removeItem('searchkeyword_list_stringpure');//로컬스토리지 검색기록 삭제!
  }

  //window.addEventListener('keyPress',keypress_handle,false);
  //window.onkeydown = keypress_handle;
  useEffect( () => {
    console.log('metro_list,uni9viertyysit_list변화감지에 따라 요소 리랜더링:',metro_list,university_list);
  },[metro_list,university_list,product_list,complex_list,addrunits_list]);

  return (
    <Container>
        <WrapMainSearch>
          <MUSearchInput
            id="outlined-basic"
            label="검색어 하기"
            placeholder='지역,지하철,대학교,물건명 검색'
            variant="outlined"
          autoComplete='off'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon onClick={() => { searchSubmit() }}/>
                  {/* <SearchBtn type="submit" name="" /> */}
                </InputAdornment>
              ),
            }}
        onClick={() => { setSearchShow(true); setRecentlysearch_show(1)}} onChange={search_map_main}
          />
              {/* <SearchInput type="text" name="" placeholder="지역,지하철,대학교,물건명 검색" onClick={()=>{setSearchShow(true)}} onChange={search_map_main}/> */}
              {/* <Link to="/Map/:text"> */}
              {/* <Link to={`/Map/${activeText}`}>
                <SearchBtn type="submit" name=""/>
              </Link> */}
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
                      addrunits_list.map((value) => {
                        return(
                          <Listtxt>
                            <Link to='#' onClick={()=> oonClickSearch('addr_units',value.id)}>{value.name}</Link>
                          </Listtxt>
                        )
                      })
                    }
                  </SearchList>
                </SearchArea>
                <Line/>
                <SearchSubway>
                  <TopTxt>지하철,대학교</TopTxt>
                  {/* <NoneHistory>최근검색기록이 없습니다.</NoneHistory> */}
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
                      university_list.map((value) => {
                        return(
                          <Listtxt>
                            <Link to='#' onClick={() => oonClickSearch('university',value.id)}>{value.uvs_name}</Link>
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
                      product_list.map ( (value) => {
                        return(
                          <Listtxt>
                            <Link to='#'onClick={() => oonClickSearch('product',value.prd_id,value.prd_identity_id, value.prd_type)}>{value.prd_name}(매물:){value.prd_type}</Link>
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
                <WrapDeleteBtn>
                  <Link to="#">
                    {/* <DeleteMsg>최근검색기록 삭제</DeleteMsg> */}
                  </Link>
                </WrapDeleteBtn>
              </NoneHisto>
            {/*검색기록이 있을 때(한번이라도 검색했으면) 검색기록 문자열들 히스토리로컬스토리지정보.*/}
             {
               recentlysearch_show == 1 ?
               <HaveHisto style={{display:"block"}}>
                <History>
                 {
                    load_prevsearchkeywordlist_pure && 
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
            :
            null
          }
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
// const MainSearch = styled.div`
//   display:inline-flex;
//   justify-content:space-between;
//   align-items:center;
//   width:100%;
//   height:48px;
//   /* background:#f8f7f7; */
//   padding:13px 23.3px 14px 34px;
//   box-sizing:border-box;
//   border-radius:9px;

//   @media ${(props) => props.theme.mobile} {
//       height:calc(100vw*(43/428));
//       padding:calc(100vw*(11/428)) calc(100vw*(21/428)) calc(100vw*(13/428)) calc(100vw*(27/428));
//     }
// `
const TopTxt = styled.div`
  position:relative;
  width:100%;
  font-size:14px;
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

const Bg = styled.div`
  position:fixed;
  width:100%;height:100%;
  left:0;top:0;display:block;content:'';
  background:transparent;
`

const MUSearchInput = MUstyled(TextField)`
  width:100%;
  transform: skew(-0.1deg);
`
// const MUSearchInput = styled(TextField)`
//   width:400px;
//   background:#f8f7f7;
//   font-size:10px;
//   transform: skew(-0.1deg);
//   color:#707070;
//   font-weight:bold;
//   &::placeholder{color:#979797;}

//   @media ${(props) => props.theme.mobile} {
//       width:calc(100vw*(280/428));
//       font-size:calc(100vw*(14/428));
//     }
// `



// const SearchInput = styled.input`
//   width:375px;
//   background:none;
//   font-size:14px;
//   transform: skew(-0.1deg);
//   color:#707070;
//   font-weight:bold;
//   &::placeholder{color:#979797;}

//   @media ${(props) => props.theme.mobile} {
//       width:calc(100vw*(280/428));
//       font-size:calc(100vw*(14/428));
//     }
// `
// const SearchBtn = styled.button`
//   width:30px;
//   height:30px;
//   background:transparent url(${IconSearch}) no-repeat center center;
//   background-size:19px 18px;

//   @media ${(props) => props.theme.mobile} {
//       width:calc(100vw*(30/428));
//       height:calc(100vw*(30/428));
//       font-size:calc(100vw*(14/428));
//       background-size:calc(100vw*(16/428)) calc(100vw*(15/428));
//     }
// `

const SearchResult = styled.div`
  width:100%; position:relative;
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
  z-index:3; display:flex;flex-flow:row nowrap;
`
const DeleteMsg = styled.p`
  display:inline-block;
  font-size:calc(100vw*(14/428));
  font-weight:600;
  color:#898989;transform:skew(-0.1deg);
`
const Closebtn = styled.p`
  display:inline-block; cursor:pointer;
  font-size:calc(100vw*(14/428));
  font-weight:600; margin-left:20px;
  color:#898989;transform:skew(-0.1deg);
`

const Img = styled.img`
  display:block;width:20px;height:20px;margin-bottom:4px;cursor:pointer;
`;
const HaveHisto = styled.div`
  width:100%;  position:absolute; 
  padding:calc(100vw*(39/428)) calc(100vw*(36/428));
  top:0px;
  left:0;opacity:1;
  height:calc(100vw * (300 / 428)); overflow-y:auto;
  background:#fff;border-top:1px solid #e2e2e2;box-sizing:border-box;
  z-index:2;
`
const History = styled.ul`

`
const HistoryList = styled.li`
  font-size:14px;
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