//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//theme
import { TtCon_Frame_Portrait_A, TtCon_MainMapSidePanel_ArticlePos_NoFilterList } from '../../../theme';

//material-ui
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ErrorIcon from '@mui/icons-material/Error';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ReportIcon from '@mui/icons-material/Report';

//img
import Arrow from "../../../img/map/filter_next.png";
import Detail from "../../../img/map/detail_img.png";
import Trade from "../../../img/map/trade.png";
import Report from "../../../img/map/report.png";
import ChangeM from "../../../img/map/change_m.png";
import Change from "../../../img/member/change.png";
import Call from "../../../img/map/call.png";
import Chat from "../../../img/map/chat.png";
import Exit from "../../../img/main/exit.png";
import Checked from "../../../img/map/checked.png";
import Check from "../../../img/main/heart.png";
import Profile from "../../../img/map/profile_img.png";
import sideMapMarker from "../../../img/map/sideMapMarker.png";

// components
import { Landscape, Mobile, PC } from "../../../MediaQuery";
import ListEl from '../commonDetail/listEL';

import ListItemCont_Broker_T1 from '../../common/broker/listItemCont_Broker_T1';
import CommonContact from '../../common/contact/commonContact';
import ExcMaemulMark from '../../common/broker/excMaemulMark';
import LikeCheckBtn from '../../common/accessary/likeCheckBtn';

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';

//server process
import serverController from '../../../server/serverController';

// map
import KakaoMapSide from '../map/KakaoMapSide';

// redux
import { useSelector } from 'react-redux';
import { MapProductEls } from '../../../store/actionCreators';

import ChannelServiceElement from '../../common/ChannelServiceElement';

// import localStringData from '../../../../../const/localStringData';
import localStringData from '../../../const/localStringData';

SwiperCore.use([Navigation, Pagination]);

export default function SideItemDetail({ openBunyang, rank, updatePageIndex, setHistoryInfo, historyInfo, report, setReport, reser, updateReserveModal, click_prdidentityid, mode, Previewinfo, previewprobrokerinfo, prdid, test}) {
  const history = useHistory();

  console.log('이게 나온다', test);
  // console.log('sdieBarItemDetail요소 실행  클릭한 특정상품 prd_identity_id >>>:',updateReserveModal,click_prdidentityid);

  var week = ['일', '월', '화', '수', '목', '금', '토'];
  const [slideUp, setSlideUp] = useState([false, false, false, false, false, false]);

  //해당 매물 아이템에 대한 투어예약셋팅 정보로써 고유한 state로써 취급한다.
  const [except_datelist, setExcept_datelist] = useState([]);//표현에서 제외할 특정날짜리스트
  const [result_usedatalist, setResult_usedatalist] = useState([]);//사용할 표현할 최종데이터리스트 초기값 배열

  //매물 관련 정보 state값들.
  const [slideImg, setSlideImg] = useState([]);
  const [isSlide, setIsSlide] = useState(false);
  const [item, setItem] = useState([]);
  const [product, setProduct] = useState([]);
  const [deal, setDeal] = useState([]);
  const [option, setOption] = useState([]);
  const [danji, setDanji] = useState([]);
  const [desc, setDesc] = useState([[], []]);
  const [position, setPosition] = useState({});
  const [broker, setBroker] = useState({});
  const [contact, setContact] = useState({});

  const [isAddress, setIsAddress] = useState(true);
  const [active, setActive] = useState(false);

  const [deteilproducts, setdeteilproducts] = useState([])


  const [probrokerinfo, setprobrokerinfo] = useState([])

  const loginUser = useSelector(state => { return state.login_user });
  const mapProduct = useSelector(state => { return state.mapProductEls });
  function data_ascending(a, b) {
    var left = new Date(a['date']).getTime();
    var right = new Date(b['date']).getTime();

    return left > right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
  }
  // **api 아이디값을 서버에 보내서 정보를 받아와야 합니다.
  // 서버에서 받아온 데이터는 각 state의 title과 desc에 넣으면 됩니다.
  console.log('미리보기1', Previewinfo);
  console.log('미리보기2', previewprobrokerinfo);

  const datainsert = async () => {
    if (mode == "의뢰인동의뷰" || mode == "미리보기") {
      // let info_preview = await serverController.connectFetchController(`/api/products/${prdid}`, 'GET');

      // console.log('7777', info_preview);
      // console.log('미리보기852', previewprobrokerinfo);
      // console.log('미리보기852', Previewinfo);
      // console.log('미리보기852중개사', previewprobrokerinfo);
      //이미지 처리
      if (!!Previewinfo.prd_imgs) {
        setSlideImg(Previewinfo.prd_imgs.split(','));
        setIsSlide(true)
      } else {
        setSlideImg('');
        setIsSlide(false);
      }



      setBroker({
        pro_apt_id: !!previewprobrokerinfo.pro_category && previewprobrokerinfo.pro_category.pro_apt_id ? '아파트: ' + previewprobrokerinfo.pro_category.apt_name : '',
        // pro_apt_id: propreviewprobrokerinfoinfo && propreviewprobrokerinfoinfo.pro_apt_id ? '아파트' + propreviewprobrokerinfoinfo.apt_name : '',
        // pro_oft_id: propreviewprobrokerinfoinfo && propreviewprobrokerinfoinfo.pro_oft_id ? '오피스텔' + propreviewprobrokerinfoinfo.oft_name : '',
        pro_oft_id: !!previewprobrokerinfo.pro_category && previewprobrokerinfo.pro_category.pro_oft_id ? '오피스텔: ' + previewprobrokerinfo.pro_category.oft_name : '',
        // is_pro_store: propreviewprobrokerinfoinfo && propreviewprobrokerinfoinfo.is_pro_store == 1 ? "상가" : '',
        // is_pro_office: propreviewprobrokerinfoinfo && propreviewprobrokerinfoinfo.is_pro_office == 1 ? "사무실" : '',
        is_pro_store: !!previewprobrokerinfo.pro_category && previewprobrokerinfo.pro_category.is_pro_store == 1 ? "상가" : '',
        is_pro_office: !!previewprobrokerinfo.pro_category && previewprobrokerinfo.pro_category.is_pro_office == 1 ? "사무실" : '',

        company_id: previewprobrokerinfo.company ? previewprobrokerinfo.company.company_id : '',
        profile: previewprobrokerinfo.company ? previewprobrokerinfo.company.profile_img : '',
        chat_key: previewprobrokerinfo.company ? previewprobrokerinfo.company.chat_key : '',
        name: previewprobrokerinfo.company ? previewprobrokerinfo.company.company_name : '',
        address: previewprobrokerinfo.company ? previewprobrokerinfo.company.addr_road : '',
        // company_id: propreviewprobrokerinfoinfo ? propreviewprobrokerinfoinfo.company_id : '',
        // profile: propreviewprobrokerinfoinfo ? propreviewprobrokerinfoinfo.profile_img : '',
        // chat_key: propreviewprobrokerinfoinfo ? propreviewprobrokerinfoinfo.chat_key : '',
        // name: propreviewprobrokerinfoinfo ? propreviewprobrokerinfoinfo.company_name : '',
        // address: propreviewprobrokerinfoinfo ? propreviewprobrokerinfoinfo.addr_road : '',

        // trade: previewprobrokerinfo.product_count.complete_count.trade_count,  //매매
        // jeonse: previewprobrokerinfo.product_count.complete_count.deposit_count, //전세
        // monthly: previewprobrokerinfo.product_count.complete_count.monthly_count, //월세
        trade: previewprobrokerinfo.product_count ? previewprobrokerinfo.product_count.complete_count.trade_count : '',  //매매
        jeonse: previewprobrokerinfo.product_count ? previewprobrokerinfo.product_count.complete_count.deposit_count : '',  //매매
        monthly: previewprobrokerinfo.product_count ? previewprobrokerinfo.product_count.complete_count.monthly_count : '',  //매매
      });

      // 물건
      setItem([
        { title: "해당층/총층", desc: Previewinfo.floorint + '/' + Previewinfo.grd_floor },
        { title: "공급/전용면적", desc:/*"60/52.89m²"*/Previewinfo.supply_area + '/' + Previewinfo.exclusive_area, descM: Previewinfo.supply_pyeong + '/' + Previewinfo.exclusive_pyeong, ChangeM: ChangeM },
        { title: "방/욕실 수", desc: Previewinfo.room_count + '/' + Previewinfo.bathroom_count },
        { title: "방향", desc: Previewinfo.direction },
        { title: "현관구조", desc: Previewinfo.entrance },
        { title: "난방", desc: Previewinfo.heat_method_type + '/' + Previewinfo.heat_fuel_type },
      ])
      // 거래
      setDeal([
        { title: "관리비", desc: Previewinfo.managecost },
        { title: "관리비 포함", desc: Previewinfo.include_managecost },
        { title: "입주가능일", desc: Previewinfo.is_immediate_ibju != 0 ? Previewinfo.ibju_specifydate : '즉시가능' },
        { title: "계약갱신청구권행사여부 확인", desc: Previewinfo.isconractrenewal ? '확인' : '미확인' },
        { title: "융자금", desc: Previewinfo.loanprice + '만원' },
        { title: "기보증금/월세", desc: Previewinfo.month_base_guaranteeprice + '만원' },
      ])
      // 옵션
      setOption([
        { title: "공간", desc: Previewinfo.space_option },
        // { title: "공간", desc: Previewinfo.prd_type == '아파트' ? Previewinfo.apartspace_option : Previewinfo.space_option },
      ])
      // 단지/건물
      if (Previewinfo.prd_type == '아파트' || Previewinfo.prd_type == '오피스텔') {
        setDanji([
          { title: "사용승인일", desc: Previewinfo.approval_date },
          { title: "총세대수", desc: Previewinfo.household_cnt },
          { title: "총주차대수", desc: Previewinfo.total_parking_cnt },
          { title: '', id: Previewinfo.complex_id }//complexid단지id값.
        ])
      } else {
        //상가사무실에도 사용승인일이 있다고는 한다.complex테이블로 연결개념은 아니라고한다.
        setDanji([
          { title: "사용승인일", desc: '' },

        ])
      }

      // // 매물설명
      setDesc([
        [
          Previewinfo.prd_description
        ],
        [
          Previewinfo.prd_description_detail
        ]
      ])
      // 위치
      setPosition({
        address: Previewinfo.addr_jibun, // 주소
        roadAddress: Previewinfo.addr_road, // 도로명 주소
        lat: Previewinfo.prd_latitude,  // 마커, 중점좌표
        lng: Previewinfo.prd_longitude, // 마커, 중점좌표
      })



    } else {


      //지도 사이바
      console.log('99999::', mapProduct.clickExc); // 선택 아이디 
      console.log('99999::', mapProduct); // 선택 아이디 
      // console.log('===>>매물상세페이지 로드 시점 관련 정보 쿼리::', mapProduct.exclusive[0].company_id); // 선택 아이디 
      //일단 클릭한 prd_idneityid(일반매물)에 대해서 처리, 더미매물(prd_id)에대한 정보 쿼리한다.
      
      // let send_info = {
        //   click_id: mapProduct.clickExc.id,
        //   temp_type: mapProduct.clickExc.type,
        //   mem_id: loginUser.memid ? loginUser.memid : 0
        // }
        // var maemul_detailresult = await serverController.connectFetchController("/api/broker/brokerproduct_detailinfo_get", 'POST', JSON.stringify(send_info));
        
        var productsinfoitem = await serverController.connectFetchController(`/api/products/${mapProduct.clickExc.id}`, 'GET');
        setdeteilproducts(productsinfoitem.data)
      console.log('99999::', productsinfoitem.data); // 선택 아이디

      var BrokerInfo = await serverController.connectFetchController(`/api/realtors/${productsinfoitem.data.company_id}/pro/info`, 'GET');
      // setprobrokerinfo(BrokerInfo.data)

      // console.log('121_____________', BrokerInfo);
      console.log('121_____________', productsinfoitem.data);
      console.log('121_____________', productsinfoitem.data.prd_imgs);
      console.log('121_____________', !!productsinfoitem.data.prd_imgs);
      // console.log('121_____________', productsinfoitem.data.prd_imgs.split(','));
      // console.log('121_____________', maemul_detailresult);
      if (!!productsinfoitem.data.prd_imgs) {
        setSlideImg(productsinfoitem.data.prd_imgs.split(','));
        setIsSlide(true)
      } else {
        setSlideImg('');
        setIsSlide(false);
      }

      // if (maemul_detailresult) {

      //   if (maemul_detailresult.success) {
      //     console.log('maemul_detailresult::', maemul_detailresult);

      //     var maemul_data = maemul_detailresult.result_data;
      //     var probrokerinfo = maemul_data.probrokerinfo[0];//정보가 비어있을 소지가 있음.전문중개사 삭제시에.

      //     if (probrokerinfo) {
      //       var ongoing_walse_productscnt = 0;
      //       var ongoing_jeonse_productscnt = 0;
      //       var ongoing_maemae_productscnt = 0;//현재 사용가능한 활성화되어져있는 카운팅하는. 월세,전세,매매의 개수를 카운팅.

      //       var probroker_asign_products = maemul_data.probroker_asign_products;
      //       for (let p = 0; p < probroker_asign_products.length; p++) {
      //         let asign_item = probroker_asign_products[p];
      //         let txn_status = probroker_asign_products[p].txn_status;
      //         if (txn_status == '거래완료' || txn_status == '검토대기' || txn_status == '검토중' || txn_status == '거래준비' || txn_status == '거래개시요청' || txn_status == '거래개시' || txn_status == '거래개시승인 요청' || txn_status == '거래완료승인 요청' || txn_status == '거래승인 요청') {
      //           //현재 진행중(취소,의뢰거절,의뢰취소,의뢰철회,수임취소,위윔취소등의 상태값들은 제외)
      //           switch (asign_item.prd_sel_type) {
      //             case '월세':
      //               ongoing_walse_productscnt++;
      //               break;
      //             case '전세':
      //               ongoing_jeonse_productscnt++;
      //               break;
      //             case '매매':
      //               ongoing_maemae_productscnt++;
      //               break;
      //           }
      //         }
      //       }
      //       console.log('매물상세>관련 수임전문중개사 수임매물들의 status상태값 조회:', ongoing_walse_productscnt, ongoing_jeonse_productscnt, ongoing_maemae_productscnt);
      //     }
      //     if (maemul_data) {
      //       var productsinfoitem.data = maemul_data.productinfo[0];//매물정보
      //       var prdtype = productinfo.prd_type;//매물타입
      //       if (prdtype == '아파트' || prdtype == '오피스텔') {
      //         var floor_value = maemul_data.floorvalue;
      //         if (maemul_data.buildinginfo) {
      //           var buildinginfo = maemul_data.buildinginfo[0];//연결된 단지동정보
      //           console.log('buildinginfoss:', buildinginfo);

      //           var total_floor_value = buildinginfo.grd_floor;
      //         }
      //         if (maemul_data.complexinfo) {
      //           var complexinfo = maemul_data.complexinfo[0];
      //         }
      //       } else {
      //         var floor_value = maemul_data.floorvalue;
      //         var total_floor_value = productinfo.storeoffice_building_totalfloor;//상가,사무실 총층값.
      //       }
      //       // 슬라이드 이미지
      //       setSlideImg(
      //         productinfo.prd_imgs ? productinfo.prd_imgs.split(',') : []
      //       )
      //       setIsSlide(true);
      //       console.log('여기를 확인',productinfo);
      //       console.log(productinfo);
      //       // 아파트 정보

      //       // setActive(productinfo.isLike == 1 ? 1 : 0)
      //       setProduct({
      //         number: productinfo.prd_identity_id,
      //         isexculsive: productinfo.exclusive_status,
      //         startDate: productinfo.exclusive_status == 1 && productinfo.exclusive_start_date ? productinfo.exclusive_start_date : "20.00.00",
      //         endDate: productinfo.exclusive_status == 1 && productinfo.exclusive_end_date ? productinfo.exclusive_end_date : "20.00.00",
      //         kind: productinfo.prd_type,
      //         address:/*"자이 109동"*/`${productinfo.prd_name && productinfo.prd_name}${productinfo.dong_name ? productinfo.dong_name : ""}${productinfo.floorname ? productinfo.floorname : ""}`,
      //         type: productinfo.prd_sel_type,
      //         price: productinfo.prd_price,
      //         desc: productinfo.prd_description,
      //         is_tour_active: productinfo.is_tour_active,
      //         isLike: productinfo.isLike,
      //       })
      // 물건
      setItem([
        { title: "해당층/총층", desc: productsinfoitem.data.floorint + '/' + productsinfoitem.data.grd_floor },
        { title: "공급/전용면적", desc:/*"60/52.89m²"*/productsinfoitem.data.supply_area + '/' + productsinfoitem.data.exclusive_area, descM: productsinfoitem.data.supply_pyeong + '/' + productsinfoitem.data.exclusive_pyeong, ChangeM: ChangeM },
        { title: "방/욕실 수", desc: productsinfoitem.data.room_count + '/' + productsinfoitem.data.bathroom_count },
        { title: "방향", desc: productsinfoitem.data.direction },
        { title: "현관구조", desc: productsinfoitem.data.entrance },
        { title: "난방", desc: productsinfoitem.data.heat_method_type + '/' + productsinfoitem.data.heat_fuel_type },
      ])
      // 거래
      setDeal([
        { title: "관리비", desc: productsinfoitem.data.managecost },
        { title: "관리비 포함", desc: productsinfoitem.data.include_managecost },
        { title: "입주가능일", desc: productsinfoitem.data.is_immediate_ibju != 0 ? productsinfoitem.data.ibju_specifydate : '즉시가능' },
        { title: "계약갱신청구권행사여부 확인", desc: productsinfoitem.data.isconractrenewal ? '확인' : '미확인' },
        { title: "융자금", desc: productsinfoitem.data.loanprice + '만원' },
        { title: "기보증금/월세", desc: productsinfoitem.data.month_base_guaranteeprice + '만원' },
      ])
      // 옵션
      setOption([
        { title: "공간", desc: productsinfoitem.data.prd_type == '아파트' ? productsinfoitem.data.apartspace_option : productsinfoitem.data.space_option },
      ])
      // 단지/건물
      if (productsinfoitem.data.prd_type == '아파트' || productsinfoitem.data.prd_type == '오피스텔') {
        setDanji([
          { title: "사용승인일", desc: productsinfoitem.data.approval_date },
          { title: "총세대수", desc: productsinfoitem.data.household_cnt },
          { title: "총주차대수", desc: productsinfoitem.data.total_parking_cnt },
          { title: '', id: productsinfoitem.data.complex_id }//complexid단지id값.
        ])
      } else {
        //상가사무실에도 사용승인일이 있다고는 한다.complex테이블로 연결개념은 아니라고한다.
        setDanji([
          { title: "사용승인일", desc: '' },

        ])
      }

      // // 매물설명
      setDesc([
        [
          productsinfoitem.data.prd_description
        ],
        [
          productsinfoitem.data.prd_description_detail
        ]
      ])
      // 위치
      setPosition({
        address: productsinfoitem.data.addr_jibun, // 주소
        roadAddress: productsinfoitem.data.addr_road, // 도로명 주소
        lat: productsinfoitem.data.prd_latitude,  // 마커, 중점좌표
        lng: productsinfoitem.data.prd_longitude, // 마커, 중점좌표
      })

      console.log('8888', BrokerInfo);
      // console.log(BrokerInfo.data.company);
      // console.log(BrokerInfo.pro_category);
      // console.log(BrokerInfo.product_count.complete_count);

      const broker = BrokerInfo.data || {};

      //       // 중개사 정보
      setBroker({
        pro_apt_id: !!broker.pro_category && broker.pro_category.pro_apt_id ? '아파트: ' + broker.pro_category.apt_name : '',
        // pro_apt_id: probrokerinfo && probrokerinfo.pro_apt_id ? '아파트' + probrokerinfo.apt_name : '',
        // pro_oft_id: probrokerinfo && probrokerinfo.pro_oft_id ? '오피스텔' + probrokerinfo.oft_name : '',
        pro_oft_id: !!broker.pro_category && broker.pro_category.pro_oft_id ? '오피스텔: ' + broker.pro_category.oft_name : '',
        // is_pro_store: probrokerinfo && probrokerinfo.is_pro_store == 1 ? "상가" : '',
        // is_pro_office: probrokerinfo && probrokerinfo.is_pro_office == 1 ? "사무실" : '',
        is_pro_store: !!broker.pro_category && broker.pro_category.is_pro_store == 1 ? "상가" : '',
        is_pro_office: !!broker.pro_category && broker.pro_category.is_pro_office == 1 ? "사무실" : '',

        company_id: broker.company ? broker.company.company_id : '',
        profile: broker.company ? broker.company.profile_img : '',
        chat_key: broker.company ? broker.company.chat_key : '',
        name: broker.company ? broker.company.company_name : '',
        address: broker.company ? broker.company.addr_road : '',
        // company_id: probrokerinfo ? probrokerinfo.company_id : '',
        // profile: probrokerinfo ? probrokerinfo.profile_img : '',
        // chat_key: probrokerinfo ? probrokerinfo.chat_key : '',
        // name: probrokerinfo ? probrokerinfo.company_name : '',
        // address: probrokerinfo ? probrokerinfo.addr_road : '',

        trade: BrokerInfo.data.product_count.complete_count.trade_count,  //매매
        jeonse: BrokerInfo.data.product_count.complete_count.deposit_count, //전세
        monthly: BrokerInfo.data.product_count.complete_count.monthly_count, //월세
      });
      //     }
      //   }
      // }


      //매물>투어예약셋팅 날짜리스트 정보쿼리.
      // let body_info = {
      //   id: click_prdidentityid
      // }
      // let res = await serverController.connectFetchController('/api/broker/brokerProduct_toursetting_dates', 'POST', JSON.stringify(body_info));
      // if (res) {
      //   console.log('res result:', res);

      //   if (res.result_total_data && res.except_special_specifydate_tourRowlist) {
      //     var result_total_data = res.result_total_data;//특별추가내역(덮어씌워짐포함), 일반추가내역들 그 날짜들의 경우 같은tourid(월,수,금 등의 특정요일기반요소tourid)를 공유하는것도 있을것임. 덮어씌워진.tourid노출리스트의 경우 특별추가 tourid내역에대해서 참조할것이고, 안덮어씌워진것들은 고유의 tourid(특별추가)로 노출.


      //     /*for(let key in result_data[1]){
      //       console.log('>>>special tour added list:',key,result_data[1][key]);
      //       special_tourlist_array[special_count] = {};
      //       special_tourlist_array[special_count]['specifydate'] = result_data[1][key]['set_specifydate'];
      //       special_tourlist_array[special_count]['specifydatetimes'] = result_data[1][key]['set_specifydatetimes'];
      //       special_tourlist_array[special_count]['tour_id'] = result_data[1][key]['tour_id'];
      //       special_tourlist_array[special_count]['tour_specifyday_except'] = result_data[1][key]['tour_specifyday_except'];
      //       special_tourlist_array[special_count]['tour_type'] = result_data[1][key]['tour_type'];

      //       special_count++;
      //     }*/
      //     var except_special_specifydate_tourRowlist = res.except_special_specifydate_tourRowlist;
      //     var except_specifydatelist = [];

      //     for (let e = 0; e < except_special_specifydate_tourRowlist.length; e++) {
      //       except_specifydatelist[e] = except_special_specifydate_tourRowlist[e]['tour_set_specifydate'];
      //     }
      //     console.log('->>>>>server load 제외 날짜데이터들:', except_specifydatelist);

      //     var result_use_datalist = [];//서버에서 가져온 각 date날짜에 대한 정보값들을 클라이언트에서 사용하기 위한 자료구조.

      //     for (let r = 0; r < result_total_data.length; r++) {
      //       let loca_result_dateData = result_total_data[r];
      //       console.log('.>>>>>loca result dataeData:', loca_result_dateData);
      //       let loca_result_getyoil = week[new Date(loca_result_dateData['date']).getDay()];//요일반환
      //       let loca_result_getday = new Date(loca_result_dateData['date']).getDate();//일자반환
      //       let loca_result_tourid = loca_result_dateData['tour_id'];
      //       let loca_result_tourtype = loca_result_dateData['tour_type'];
      //       let is_tour_holiday_except = loca_result_dateData['is_tour_holiday_except'];

      //       result_use_datalist[r] = {};
      //       result_use_datalist[r]['date'] = loca_result_dateData['date'];
      //       result_use_datalist[r]['setTimes'] = loca_result_dateData['setTimes'];
      //       result_use_datalist[r]['date_yoil'] = loca_result_getyoil;
      //       result_use_datalist[r]['date_day'] = loca_result_getday;
      //       result_use_datalist[r]['tour_id'] = loca_result_tourid;
      //       result_use_datalist[r]['tour_type'] = loca_result_tourtype;
      //       result_use_datalist[r]['is_tour_holiday_except'] = is_tour_holiday_except;
      //     }
      //     console.log('+>>>>>final result_use_datalist:', result_use_datalist);

      //     result_use_datalist = result_use_datalist.sort(data_ascending);//클라이언트표현용 데이터 오름차순정렬..*/

      //     //제외할 항목들 제외.
      //     for (let s = 0; s < except_specifydatelist.length; s++) {
      //       let except_special_dates_item = except_specifydatelist[s];

      //       for (let h = 0; h < result_use_datalist.length; h++) {
      //         if (except_special_dates_item == result_use_datalist[h]['date']) {
      //           //제외할 항목에 해당되는 결과항목날짜의 경우는 프로퍼티 invisible추가하여 안보이게 처리 제외처리한다.
      //           result_use_datalist[h]['isexcepted'] = true;
      //         }
      //       }
      //     }

      //     setExcept_datelist(except_specifydatelist);
      //     setResult_usedatalist(result_use_datalist);
      //   } else {
      //     setExcept_datelist([]);
      //     setResult_usedatalist([]);
      //   }

      // }

      // else {

      // }
    }
  }


  useEffect(async () => {
    console.log('미리보기3', Previewinfo);

    datainsert()
  }, [Previewinfo])


  useEffect(() => {
    console.log('broker요소 변경>>>', broker, broker.chat_key);

    if (ChannelServiceElement) {
      console.log('매물상세 전문중개사 소개부분에 채팅상담버튼관련 :', broker.chat_key);
      ChannelServiceElement.boot({
        "pluginKey": broker.chat_key,
        "customLauncherSelector": "#chat-button",
        "hideChannelButtonOnBoot": true
      });
    }
  }, [broker]);

  // useEffect(() => {
  //   console.log('여기를 확인',product );
  // }, [product])

  // 리스트 토글
  const onCLickBox = (index) => {
    let arr = slideUp;
    arr[index] = !arr[index];
    setSlideUp([...arr]);
  }

  // 하트 버튼
  const onClickLike = (e) => {
    // true 활성화, false 비활성화
    // console.log(e.target.checked)
  }


  // const clickLikeEvent = () => {
  //   console.log('clicklikeEvent onchangess:');

  //   if (!loginUser.memid) {
  //     window.location.href = "/MemberLogin";
  //     return;
  //   }
  //   const data = {
  //     mem_id: loginUser.memid ? loginUser.memid : 0,
  //     prd_identity_id: product.number ? product.number : 0,
  //     bp_id: 0,
  //     likes_type: 0,
  //   }

  //   serverController.connectFetchController("/api/likes/item", 'POST', JSON.stringify(data), function (res) {
  //     setActive(e => !e);

  //     console.log('likes버튼 누른이후의 매물정보 관련 결과', res);
  //   });
  // }

  //단지별실거래 정보 조회페이지이동.
  const complexdetail_show = (target, complexid) => {
    console.log('클릭한 실거래버튼 요소::', target, complexid);

    if (complexid) {
      MapProductEls.updateClickBlo({ clickBlo: complexid });
      updatePageIndex(3);
      setHistoryInfo(e => { console.log('now e previndexsss:', e.prevIndex); e.prevIndex.push(1); return JSON.parse(JSON.stringify(e)); });
    } else {
      alert('관련 단지정보가 없습니다!');
      return;
    }
  };

  console.log('아이템2222_______', product);
  console.log('아이템2222_______', deteilproducts);

  return (
    <div className="hgt-100pct">
      <Sect_Article className="noneScrollbar">
        <Sect_Article_1>
          <div className="pd-0p75">
            <div className="par-spacing">
              <ListItemCont_Broker_T1 broker={broker} />
            </div>
            <div className="par-spacing tAlign-c">
              <WrapBtns_1>
                <CommonContact contact={contact} disable={mode === '미리보기'} />
                {/* <MUButton variant="contained" disableElevation startIcon={<DirectionsWalkIcon />}
                onClick={ async() => {
                  console.log('물건투어예약버튼 클릭::',product.is_tour_active,result_usedatalist);
                  if(product.is_tour_active==1 && result_usedatalist.length>=1){
                    
                    if((!loginUser.user_type || !loginUser.company_id) && loginUser.user_type!='개인'){
                      //소속이 비선택되어있는 팀원(기업,중개사,분양사) 비선택 저장되어있는 유저 company_id==''(현재선택된 소속id),user_type(현재선택된 소속id관련 회원타입)등이 비저장상태인경우에는 신청불가하게 막기!
                      alert('선택된 소속이 없습니다! 마이페이지 진입후 소속을 선택해주세요');
                      history.push('/');
                      return false;
                    }
                    updateReserveModal(except_datelist,result_usedatalist,broker.company_id);
                  }else{
                    alert('투어예약 비활성화된 매물입니다.');
                    return false;
                  }
                }}>
                  투어예약
                </MUButton> */}
              </WrapBtns_1>
            </div>
          </div>
          <div className="divider-a1" />
          {/* 아파트 정보 */}
          <div className="pd-0p75" >
            {mode == "의뢰인동의뷰" ? null :
              <div className="par-spacing-after">
                <div className="flex-spabetween-center">
                  <span className="capt-00">{product.number}</span>
                  <div className="flexGlow-1" />
                  <Tooltip title="허위매물 신고">
                    <MUIconButton disabled={mode == "미리보기"} size="middle" onClick={() => { setReport([true, click_prdidentityid, broker.company_id]) }}>
                      <ReportGmailerrorredIcon color="error" />
                    </MUIconButton>
                  </Tooltip>
                  <LikeCheckBtn user={loginUser} item={product} disable={mode == "미리보기"} />
                  {/* <div>
                  <CheckLabel for={"check" + product.number} Checks={active} />
                  <CheckBox type="checkbox" checked={product.isLike} onChange={clickLikeEvent} id={"check" + product.number} />
                </div> */}
                </div>
              </div>
            }
            <div className="par-spacing-after">
              {
                mode == "의뢰인동의뷰" || mode == "미리보기" ?
                  Previewinfo.prd_status === ("거래개시동의요청" || "거래준비") ?
                    <p className="fs-1p2 fw-b c-secondary">전속기간: {Previewinfo.exclusive_periods}개월</p>
                    :
                    <ExcMaemulMark status={deteilproducts.exclusive_status} startDate={deteilproducts.exclusive_start_date} endDate={deteilproducts.exclusive_end_date} />
                  // <ExcMaemulMark status={product.isexculsive} startDate={deteilproducts.exclusive_start_date} endDate={deteilproducts.exclusive_end_date} />
                  :
                  <ExcMaemulMark status={deteilproducts.exclusive_status} startDate={deteilproducts.exclusive_start_date} endDate={deteilproducts.exclusive_end_date} />
              }
            </div>
            {mode == "의뢰인동의뷰" || mode == "미리보기" ?
              <div className="par-spacing-after">
                {/* <p className="txt-sub">[{product.kind}] &nbsp;{product.address}</p> */}
                <p className="txt-sub">[{Previewinfo.prd_type}] &nbsp;{Previewinfo.addr_jibun}</p>
                <div className="flex-right-baseline">
                  {/* <span className="detail-subtit fw-b">{product.type}&nbsp;</span>
                <span className="detail-tit fw-b">{product.price} </span> */}
                  <span className="detail-subtit fw-b">{Previewinfo.prd_sel_type}&nbsp;</span>
                  <span className="detail-tit fw-b">{Previewinfo.prd_price} </span>
                </div>
              </div>
              :
              <div className="par-spacing-after">
                {/* <p className="txt-sub">[{product.kind}] &nbsp;{product.address}</p> */}
                <div>
                  <span className="list-tag vAlign-m">[{deteilproducts.prd_type ? deteilproducts.prd_type : ''}]</span>&nbsp;
                  <span className="list-tit vAlign-m">{deteilproducts.prd_name}</span>
                </div>
                <p className="capt-a1">{deteilproducts.addr_jibun}</p>
                <div className="tAlign-r">
                  <span className="detail-subtit fw-b vAlign-b">{deteilproducts.prd_sel_type}&nbsp;</span>
                  <span className="detail-tit fw-b vAlign-b">{deteilproducts.prd_price} </span>
                </div>
              </div>
            }

            {mode == "의뢰인동의뷰" ?
              null
              :
              <div className="par-spacing-after tAlign-r">
                <MUButton disabled={mode == "미리보기"} variant="outlined" disableElevation startIcon={<ShowChartIcon />} onClick={(event) => {
                  complexdetail_show(event.target, danji && danji[3] && danji[3]['id']);
                }}>
                  주변 실거래
                </MUButton>
              </div>

            }

            <div className="par-spacing-before">
              <p className="capt-a1">{desc[0]}</p>
            </div>
          </div>
          <div className="divider-a1" />
          {/* <SwiperBennerWrap className="detail_swiper"> */}
          {
            isSlide &&
            <>
              <Swiper
                slidesPerView={1}
                loop={false}
                autoplay={true}
                navigation={{ clickable: true }}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log('테스트테스트테스트___', swiper.height)}
              >
                {console.log()}
                {
                  slideImg.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <DetailImg>
                          <img src={localStringData.imagePath + item} />
                        </DetailImg>
                      </SwiperSlide>
                    )
                  })
                }
              </Swiper>
            </>
          }
          <div className="divider-a1" />

          {/* </SwiperBennerWrap> */}

          {/* 물건, 거레, 옵션, 매물설명, 단지&건물, 위치 */}
          <WrapAllInfos>
            {/*물건*/}
            <WrapItemInfo>
              <TitleBox onClick={() => onCLickBox(0)}>
                <Title>물건</Title>
                {slideUp[0] ? <ArrowImg src={Arrow} /> : <ArrowImgDown src={Arrow} />}
              </TitleBox>
              {
                slideUp[0] ?
                  <ItemInfoList>
                    {
                      item.map((item, index) => {
                        return (
                          <ListEl key={index} title={item.title} desc={item.desc} descM={item.descM && item.descM} ChangeM={item.ChangeM && item.ChangeM} />
                        )
                      })
                    }
                  </ItemInfoList>
                  :
                  null
              }
              {/*<ToggleOpenClose>
              <Text>접기</Text>
            </ToggleOpenClose>*/}
            </WrapItemInfo>

            {/*거래*/}
            <WrapTradeInfo>
              <TitleBox onClick={() => onCLickBox(1)}>
                <Title>거래</Title>
                {slideUp[1] ? <ArrowImg src={Arrow} /> : <ArrowImgDown src={Arrow} />}
              </TitleBox>
              {
                slideUp[1] ?
                  <ItemInfoList>
                    {
                      deal.map((item, index) => {
                        return (
                          <ListEl key={index} title={item.title} desc={item.desc} ChangeM={item.ChangeM && item.ChangeM} />
                        )
                      })
                    }
                  </ItemInfoList>
                  :
                  null
              }

              {/*<ToggleOpenClose>
              <Text>접기</Text>
            </ToggleOpenClose>*/}
            </WrapTradeInfo>

            {/*옵션*/}
            <WrapOptionInfo>
              <TitleBox onClick={() => onCLickBox(2)}>
                <Title>옵션</Title>
                {slideUp[2] ? <ArrowImg src={Arrow} /> : <ArrowImgDown src={Arrow} />}
              </TitleBox>
              {
                slideUp[2] ?
                  <ItemInfoList>
                    {
                      option.map((item, index) => {
                        return (
                          <ListEl key={index} title={item.title} desc={item.desc} ChangeM={item.ChangeM && item.ChangeM} />
                        )
                      })
                    }
                  </ItemInfoList>
                  :
                  null
              }
            </WrapOptionInfo>

            {/*매물설명*/}
            <WrapOptionInfo>
              <TitleBox onClick={() => onCLickBox(3)}>
                <Title>매물설명</Title>
                {slideUp[3] ? <ArrowImg src={Arrow} /> : <ArrowImgDown src={Arrow} />}
              </TitleBox>
              {
                slideUp[3] ?
                  <ItemInfoList>
                    <Li>
                      {/* <TextArea>
                        [ 위 치 / 교통 ]  <br /><br />
                        {
                          desc[0].map((item, index) => {
                            return (<>ㅇ{item}<br /><br /></>
                            )
                          })
                        }
                        [ 인테리어/특징 ]  <br /><br />
                        {
                          desc[1].map((item, index) => {
                            return (<>ㅇ{item}<br /><br /></>
                            )
                          })
                        }
                      </TextArea> */}
                      <TextArea>{desc[1]}</TextArea>

                    </Li>

                  </ItemInfoList>

                  :
                  null
              }
              {/*<ToggleOpenClose>
                <Text>접기</Text>
              </ToggleOpenClose>*/}
            </WrapOptionInfo>
            {/*단지&건물*/}
            <WrapTradeInfo>
              <TitleBox onClick={() => onCLickBox(4)}>
                <Title>단지/건물</Title>
                {slideUp[4] ? <ArrowImg src={Arrow} /> : <ArrowImgDown src={Arrow} />}
              </TitleBox>

              {
                slideUp[4] ?
                  <ItemInfoList>
                    {
                      danji.map((item, index) => {
                        if (item.title != '' && item.desc) {
                          return (
                            <ListEl key={index} title={item.title} desc={item.desc} ChangeM={item.ChangeM && item.ChangeM} />
                          )
                        }
                      })
                    }
                  </ItemInfoList>
                  :
                  null
              }
            </WrapTradeInfo>
            {/*위치*/}
            <WrapTradeInfo>
              <TitleBox onClick={() => onCLickBox(5)}>
                <Title>위치</Title>
                {slideUp[5] ? <ArrowImg src={Arrow} /> : <ArrowImgDown src={Arrow} />}
              </TitleBox>
              {
                slideUp[5] ?
                  <>
                    <ItemInfoList>
                      <Li>
                        <MapAddress>{isAddress ? position.address : position.roadAddress}</MapAddress>
                        <ChangeAddress onClick={() => setIsAddress(!isAddress)}>
                          <ChangeImg src={Change} />
                          <ChangeTxt>도로명</ChangeTxt>
                        </ChangeAddress>
                      </Li>
                    </ItemInfoList>
                    {
                      Object.keys(position).length === 0 ?
                        <></>
                        :
                        <MapArea>
                          <KakaoMapSide cutomImg={sideMapMarker} centerLat={position.lat} centerLng={position.lng} markerLat={position.lat} markerLng={position.lng} />
                        </MapArea>
                    }
                  </>
                  :
                  null
              }
            </WrapTradeInfo>
          </WrapAllInfos>
        </Sect_Article_1>
      </Sect_Article>
    </div>
  );
}

const MUButtonGroup = styled(ButtonGroup)``
const MUButton = styled(Button)``
const MUIconButton = styled(IconButton)``

//--------------------------------------------------------

const Wrapper = styled.div`
height:100%;
`
const Sect_Article = styled.div`
${TtCon_MainMapSidePanel_ArticlePos_NoFilterList}
overflow-y: auto;
`
const Sect_Article_1 = styled.div`
${TtCon_Frame_Portrait_A}
`
//---------------------------------------------------------

/* 현재 이미지 비율이 Horizontal Wide, Vertical Wide 동적구별 코딩이 없는 상태라서,
임시적으로 Horizontal Wide형이 안짤리도록 >img의 width:100%; 설정함. 
width:100% 대신 height:100%; 설정하면 Vertical Wide형이 안짤림 */
const DetailImg = styled.div`
  position:relative;
  overflow: hidden;
  width:100%;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  //object-fit:cover;

  &>img {
    position:absolute;
    width: 100%;
    top: 50%;left: 50%;
    transform: translate(-50%, -50%);
    //object-fit:contain;
  }
`
const CheckBox = styled.input`
  display:none;
  &:checked+label{background:url(${Checked}) no-repeat center center;background-size:26px 25px;}
  @media ${(props) => props.theme.mobile} {
    &:checked+label{background:url(${Checked}) no-repeat center center;background-size:calc(100vw*(22/428)) calc(100vw*(20/428));}
  }
`
const CheckLabel = styled.label`
  display:inline-block;
  width:40px;height:40px;
  border-radius: 3px;
  border: solid 1px #d0d0d0;
  ${(props) => props.Checks == 1 ?
    `
    background:url(${Checked}) no-repeat center center;background-size:26px 25px;
    `
    :
    `
    background:url(${Check}) no-repeat center center;background-size:26px 25px;
    `
  }
`

const Number = styled.p`
  align-self: flex-start;
`
const Green = styled.div`
  color:#2b664d;
`
const WrapDate = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  margin-left:8px;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(8/428));
  }
`
const StartDate = styled(Green)`
  color:#707070;
`
const Line = styled(StartDate)`
`
const EndDate = styled(StartDate)`
`
const Kinds = styled.p``
const Address = styled.p``
const Price = styled.p``

const Desc = styled.div`
    margin: 0;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.43;
    letter-spacing: 0.01071em;
    color: rgba(0, 0, 0, 0.6);
`

//--------------------------------------------------------
const WrapAllInfos = styled.div`
  width:100%;
  border-top:8px solid #e4e4e4;
  border-bottom:8px solid #e4e4e4;
`

const WrapItemInfo = styled.div`
  width:100%;
`
const TitleBox = styled.div`
  width:100%;
  padding:1rem;
  display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid #f2f2f2;border-bottom:1px solid #f2f2f2;
  cursor:pointer;
  /* @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(20/428)) calc(100vw*(30/428));
  } */
`
const Title = styled.p``

const ArrowImg = styled.img`
  width:0.625rem;
  transform:rotate(270deg);
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(10/428));
  } */
`
const ArrowImgDown = styled.img`
  width:0.625rem;
  transform:rotate(90deg);
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(10/428));
  } */
`
const ItemInfoList = styled.ul`
  width:100%;
  margin:0 auto;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(383/428));
  } */
`
const Li = styled.li`
  width:100%;display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;
  padding:15px 20px;
  border-bottom:1px solid #f2f2f2;
  &:last-child{border-bottom:none;}
  /* @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(15/428)) calc(100vw*(10/428));
  } */
`
// const SubTitle = styled.p`
//   font-size:15px; color:#898989;
//   font-weight:600;transform:skew(-0.1deg);
//   @media ${(props) => props.theme.mobile} {
//     font-size:calc(100vw*(15/428));
//   }
// `
const WrapTradeInfo = styled(WrapItemInfo)`
  border-top:none;
`
const WrapOptionInfo = styled(WrapItemInfo)`
  border-top:none;
`
const TextArea = styled.div`
  font-size:15px;font-weight:600;
  transform:skew(-0.1deg);color:#4a4a4a;
  line-height:1.33;
  /* @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  } */
`
const MapAddress = styled.div`
  font-size:15px;color:#4a4a4a;font-weight:600;
  transform:skew(-0.1deg);
  /* @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  } */
`
const ChangeAddress = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  cursor:pointer;
`
const ChangeImg = styled.img`
  display:inline-block;
  width:13px;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(13/428));
  } */
`
const ChangeTxt = styled.p`
  font-size:10px;font-weight:800;transform:skew(-0.1deg);
  color:#979797;margin-left:5px;
  /* @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(10/428));
    margin-left:calc(100vw*(5/428));
  } */
`

//  kakao map wrap
const MapArea = styled.div`
  width:100%;height:315px;
  background:#eee;
  /* @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(312/428));
  } */
`

const WrapBtns_1 = styled.div`
  &>button {
    margin-right:0.25rem;
  }
`