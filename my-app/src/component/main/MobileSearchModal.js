import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";

//materila-ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import ApartmentIcon from '@material-ui/icons/Apartment';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import StoreIcon from '@material-ui/icons/Store'
import BusinessIcon from '@material-ui/icons/Business';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import SearchIcon from '@material-ui/icons/Search';

//css
import styled from "styled-components"
import IconSearch from '../../img/main/icon_search.png';

//components
import MbSearch from './mobilecomp/MbSearchBody';
import SearchMainResultCont from './SearchMainResultCont';
import RecentSearchCont from './RecentSearchCont';

// redux
import { MapProductEls, MapFilterRedux} from '../../store/actionCreators';
import { useSelector } from 'react-redux';

// code
import serverController from '../../server/serverController'
import initFilter from '../map/initFilter';
import MobileSearchMainSecond from './MobileSearchMainSecond';
import { mapHeader } from '../../store/actionCreators';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function MobileSearchModal({ open, handleClose, selectedType}) {
    console.log('selectedType', selectedType);

    const [value, setValue] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeText, setActiveText] = useState(selectedType);

    // const handleChange = (event, newValue) => {

    //     switch (newValue) {
    //         case 0:
    //             setActiveIndex(newValue);
    //             setActiveText("apart");
    //             mapHeader.updateprdtype({ prdtypes: "apart" });
    //             break;
    //         case 1:
    //             setActiveIndex(newValue);
    //             setActiveText("officetel");
    //             mapHeader.updateprdtype({ prdtypes: "officetel" });
    //             break;
    //         case 2:
    //             setActiveIndex(newValue);
    //             setActiveText("store");
    //             mapHeader.updateprdtype({ prdtypes: "store" });
    //             break;
    //         case 3:
    //             setActiveIndex(newValue);
    //             setActiveText("office");
    //             mapHeader.updateprdtype({ prdtypes: "office" });
    //             break;

    //         default:
    //             break;
    //     }
    //     setValue(newValue)
    // };


    //$$$_검색바 관련-------------------------
    const mainsearchinput = useRef();

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

    const oonClickSearch = async (selectedList_label, search_type, id, prd_identity_id, product_type) => {
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
        var prev_searchkeywordlist_pure = localStorage.getItem('searchkeyword_list_stringpure');
        console.log('기존 검색어리스트:::', prev_searchkeywordlist,prev_searchkeywordlist_pure);
        if (prev_searchkeywordlist) {
            prev_searchkeywordlist += ('|' + (selectedList_label + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
            prev_searchkeywordlist_pure += ('|' + selectedList_label);
            localStorage.setItem('searchkeyword_list_string', prev_searchkeywordlist);
            localStorage.setItem('searchkeyword_list_stringpure',prev_searchkeywordlist_pure);
        } else {
            localStorage.setItem("searchkeyword_list_string", (selectedList_label + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
            localStorage.setItem("searchekyword_list_stringpure",selectedList_label);
        }

        if (!id || id < 0) {
            alert('값이 유효화지 않음!!');
            return;
        }
        //임의 요소 클릭한 순간에 그냥 정보 저장 리덕스에 해버린다. 저장을 해버리고, 그 정보를 로컬에 저장해버린다.로컬에 정보가 있으면 그 정보의 위치로 표시한다. 마지막 로컬에 있던것으로 지도 위치 초기화한다. 그 검색하려는 지점에 대해서 중심으로 해서 그 주변 반경 화면px기준 계산하여 요청한 당시때의 화면 크기(브라우저화면크기 가로,세로)크기의 해당하는 크기만큼으로 처리한다.
        var id_value = id;
        var product_search_type = '';
        var current_tab = selectedType;

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
        handleClose()
    }
   

    const search_map_main = async (e) => {
        console.log('검색어 입력 시작:', e.target.value);
        console.log('검색어 입력 시작:', e.target.value.length);
        setValue(e.target.value)
         if (e.target.value.length == 0){
            setRecentlysearch_show(1);
            setSearchShow(false);
        }else{
            setRecentlysearch_show(0);
            setSearchShow(true);

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

                    if (metro_list.length >= 1 || university_list.length >= 1 || product_list.length >= 1 || complex_list.length >= 1 || addrunits_list.length >= 1) {
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
        }
    };

    //@@-------------------------
    const recentkeyword_map_main = async (recent_keyword) => {
        console.log('검색어 입력 시작:', recent_keyword);
        //해당 string기반 검색을 한다. 지역명은 지역의 이름, 대학교는 대학교명 ,지하철명 물건명으로 검색.
        setSearchkeyword(recent_keyword);
        if (recent_keyword != '') {
            let body_info = {
                search_keyword_val: recent_keyword,
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

                //setMetro_list(metro_list);
                //setUniversity_list(university_list);
                //setProduct_list(product_list);
                //setComplex_list(complex_list);
                //setAddrunits_list(addrunits_list);
                //각 종류별 지역,대학교&지하철,매물&단지에 품목별 내역에서 첫번째 index값별로 넘겨서 관련 처리>
                var activetext_val = activeText;
                var searchtype;

                console.log('최근검색키워드에 대한 리스트 클릭시 해당 검색어로 검색 추가로 했었떤것 간주:',recent_keyword);

                var now_time=new window.Date();
                var now_year=now_time.getFullYear();
                var now_month =now_time.getMonth() +1 <10?('0'+(now_time.getMonth()+1)):now_time.getMonth()+1;
                var now_date = now_time.getDate() +1 < 10?('0'+(now_time.getDate()+1)):now_time.getDate()+1;
                var now_hour = now_time.getHours();
                var now_minutes = now_time.getMinutes();

                console.log('검색 시간:',now_year+'-'+now_month+'-'+now_date+'-'+now_hour+':'+now_minutes);

                var prev_searchkeywordlist = localStorage.getItem('searchkeyword_list_string');
                var prev_searchkeywordlist_pure = localStorage.getItem('searchkeyword_list_stringpure');
                console.log('기존 검색어리스트:::',prev_searchkeywordlist);
                if(prev_searchkeywordlist){
                    prev_searchkeywordlist += ('|'+(searchkeyword+" ["+now_year+'-'+now_month+'-'+now_date+' '+now_hour+':'+now_minutes+']'));
                    prev_searchkeywordlist_pure += ('|'+searchkeyword);
                    localStorage.setItem('searchkeyword_list_string',prev_searchkeywordlist);
                    localStorage.setItem('searchkeyword_list_stringpure',prev_searchkeywordlist_pure);
                }else{
                    localStorage.setItem("searchkeyword_list_string", (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
                    localStorage.setItem('searchkeyword_list_stringpure', searchkeyword);
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
                    screen_width :window.innerWidth,
                    screen_height : window.innerHeight,
                    level:3,
                    prdtype_val:activetext_val,
                    searchtype:searchtype,
                    addrunits:addrunits_param,
                    metrolist:metrolist_param,
                    university:university_param,
                    productlist:productlist_param,
                    complexlist:complexlist_param
                };
                let searchdetail_originresult = await serverController.connectFetchController('/api/matterial/main_searchresult_clickDetail_enter','POST',JSON.stringify(body_info));

                if(searchdetail_originresult){
                    console.log('=======================>> main searchedetail originresultsss:',searchdetail_originresult);

                    let searchdetail_origindata=searchdetail_originresult.result[0];
                    localStorage.setItem('searchdetail_origin',JSON.stringify(searchdetail_origindata));
                    if(searchdetail_originresult.outlineborder_result){
                        localStorage.setItem('searchdetail_origin_matcharea',JSON.stringify(searchdetail_originresult.outlineborder_result));
                    }else{
                        localStorage.setItem('searchdetail_origin_matcharea',null);
                    }

                    mapHeader.updateprdtype({prdtypes:activeText});

                    if(searchdetail_origindata && searchdetail_origindata['prd_id'] && searchdetail_origindata['prd_identity_id']){
                        console.log('매물 형태의 타입일떄:::');
                        var x_val = searchdetail_origindata['prd_longitude'];
                        var y_val = searchdetail_origindata['prd_latitude'];

                        mapHeader.updateorigin({origins:{x:x_val, y:y_val}});

                        if(searchdetail_origindata['prd_identity_id'] == -1){
                            var id_valss=searchdetail_origindata['prd_id'];
                            mapHeader.updateoriginid({originid:{id_vals:id_valss,origintype:'exclusive'}});
                        }else{
                            var id_valss=searchdetail_origindata['prd_identity_id'];
                            mapHeader.updateoriginid({originid: {id_vals:id_valss,origintype:'exclusive'}});
                        }
                    }else if(searchdetail_origindata && searchdetail_origindata['complex_id']){
                        console.log('complexi형태의 타입일떄:::');
                        var x_val =searchdetail_origindata['x'];
                        var y_val = searchdetail_origindata['y'];
                        var id_valss= searchdetail_origindata['complex_id'];

                        mapHeader.updateoriginid({originid: {id_vals:id_valss,origintype:'complex'}});
                        mapHeader.updateorigin({origins: {x:x_val, y:y_val}});
                    }else{
                        console.log('그외의 지역,지하철 등 타입일떄:::');
                        var x_val =searchdetail_origindata['x'] && searchdetail_origindata['x'];
                        var y_val =searchdetail_origindata['y'] && searchdetail_origindata['y'];
                        var id_valss= searchdetail_origindata['id'] && searchdetail_origindata['id'];

                        mapHeader.updateoriginid({originid:{id_vals:id_valss}});
                        mapHeader.updateorigin({origins: {x:x_val, y:y_val}});
                    }
                    history.push(`/Map/${activetext_val}`);
                    handleClose();
                }
            }
        } else {
            setMetro_list([]);
            setUniversity_list([]);
            setProduct_list([]);
            setComplex_list([]);
            setAddrunits_list([]);

            setSearchShow(false);
        }

        handleClose();
    };
    //-------------------------------@@

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
            var prev_searchkeywordlist_pure = localStorage.getItem('searchkeyword_list_stringpure');
            console.log('기존 검색어리스트:::', prev_searchkeywordlist);
            if (prev_searchkeywordlist) {
                prev_searchkeywordlist += ('|' + (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
                prev_searchkeywordlist_pure += ('|' + searchkeyword);
                localStorage.setItem('searchkeyword_list_string', prev_searchkeywordlist);
                localStorage.setItem('searchkeyword_list_stringpure', prev_searchkeywordlist_pure);
            } else {
                localStorage.setItem("searchkeyword_list_string", (searchkeyword + "  [" + now_year + '-' + now_month + '-' + now_date + ' ' + now_hour + ":" + now_minutes + "]"));
                localStorage.setItem('searchkeyword_list_stringpure', searchkeyword);
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

                mapHeader.updateprdtype({prdtypes:activetext_val});

                if(searchdetail_origindata && searchdetail_origindata['prd_id'] && searchdetail_origindata['prd_identity_id']){
                    var x_val =searchdetail_origindata['prd_longitude'];
                    var y_val =searchdetail_origindata['prd_latitude'];
                    mapHeader.updateorigin({origins: {x:x_val,y:y_val}});

                    if(searchdetail_origindata['prd_identity_id']==-1){
                        var id_valss=searchdetail_origindata['prd_id'];
                        mapHeader.updateoriginid({originid : {id_vals:id_valss, origintype:'exclusive'}});
                    }else{
                        var id_valss=searchdetail_origindata['prd_identity_id'];
                        mapHeader.updateoriginid({originid:{id_vals:id_valss, origintype:'exclusive'}});
                    }
                }else if(searchdetail_origindata && searchdetail_origindata['complex_id']){
                    var x_val =searchdetail_origindata['x'];
                    var y_val = searchdetail_origindata['y'];
                    var id_valss=searchdetail_origindata['complex_id'];

                    mapHeader.updateoriginid({originid:{id_vals:id_valss,origintype:'complex'}});
                    mapHeader.updateorigin({origins:{x:x_val,y:y_val}});
                }else{
                    var x_val =searchdetail_origindata['x'];
                    var y_val = searchdetail_origindata['y'];
                    var id_valss= searchdetail_origindata['id'];

                    mapHeader.updateoriginid({originid: {id_vals:id_valss}});
                    mapHeader.updateorigin({origins:{x:x_val,y:y_val}});
                }
                history.push(`/Map/${activetext_val}`);//저기로 이동을 해버리면, 저기 페이지 요소가 실행되겠지.
            }
            setSearchShow(false);
            handleClose();
        }
    }

    //@@---------------------
    const recently_keyword_click = (keyword) => {
        console.log('최근 검색어 키워드 클릭!!!:', keyword);

        //const regex = /^[ㄱ-ㅎ|\\n|가-힣|a-z|A-Z|0-9|]*/g;
        //const match_arrays=[...keyword.matchAll(regex)];
        console.log('recne tkey wordstring matchss:', keyword);

        mainsearchinput.current.value = keyword;

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
        setValue('')
        setRecentlysearch_show(1);
        setSearchShow(false);
    }, [])

    useEffect(() => {
        console.log('metro_list,uni9viertyysit_list변화감지에 따라 요소 리랜더링:', metro_list, university_list);
    }, [metro_list, university_list, product_list, complex_list, addrunits_list]);
    //------------------------@@
    //-------------------------$$$_검색바 관련


    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <TopBar className="flex-spabetween-center">
                <IconButton
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <MUTextField
                    size="small"
                    variant="standard"
                    autoComplete='off'
                    value={value}
                    // onClick={() => setRecentlysearch_show(1)}
                    onClick={() =>{if(value.length == 0){
                        setRecentlysearch_show(1)
                    }else{
                        setRecentlysearch_show(0)
                    }}}
                    // onInput={() => setSearchShow(true)}
                    onChange={(e) => { search_map_main(e)}}
                    inputRef={mainsearchinput}
                    label="지역,지하철,대학교,물건 검색"
                    //placeholder='지하철,대학교,지역명 등 입력'
                    onKeyPress={keypress_handle}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <span>{selectedType} :</span>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </TopBar>
            {/* <MUTabs value={value} onChange={handleChange} TabIndicatorProps={{ style: { display: "none" } }}>
                    <MUTab label="아파트" />
                    <MUTab label="오피스텔" />
                    <MUTab label="상가" />
                    <MUTab label="사무실" />
                    <MUTab label="전문중개사" disabled />
                </MUTabs> */}
            {recentlysearch_show ?
                <RecentSearchCont isModal={false} recently_searchkeywordlist_remove={recently_searchkeywordlist_remove} setRecentlysearch_show={setRecentlysearch_show} recently_keyword_click={recently_keyword_click} />
                :
                null
            }
            {searchShow ?
                <SearchMainResultCont isModal={false} setSearchShow={setSearchShow} oonClickSearch={oonClickSearch} metro_list={metro_list} university_list={university_list} product_list={product_list} complex_list={complex_list} addrunits_list={addrunits_list} />
                :
                null
            }

            {/* <MobileSearchMainSecond activeText={activeText} /> */}
        </Dialog>
    );
}

export default MobileSearchModal

const MUTabs = styled(Tabs)`

& .MuiTabs-flexContainer {
  flex-wrap: wrap;
  justify-content: center;
}
`
const MUTab = styled(Tab)`
&.MuiButtonBase-root.MuiTab-root.Mui-selected, &.MuiButtonBase-root.MuiTab-root.Mui-disabled  {
  color:${(props) => props.theme.palette.secondary.main};
  background-color: rgb(0,0,0,0.04);
}
`
const MUTextField = styled(TextField)`
&.MuiFormControl-root.MuiTextField-root {
    width:100%;
}
`
const TopBar = styled.div`
    height:60px;
`