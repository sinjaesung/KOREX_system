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
import SideSubTitle from "./subtitle/SideSubTitle";
import MaemulDetailContent from './maemulDetailContent';

// redux
import { useSelector } from 'react-redux';
import { MapProductEls } from '../../../store/actionCreators';

import ChannelServiceElement from '../../common/ChannelServiceElement';
//server process
import serverController from '../../../server/serverController';

export default function SideItemDetail({ openBunyang, rank, updatePageIndex, setHistoryInfo, historyInfo, report, setReport, reser, updateReserveModal, click_prdidentityid }) {

  const [deteilproducts, setdeteilproducts] = useState([])
  const [probrokerinfo, setProbrokerinfo] = useState([])
  const loginUser = useSelector(state => { return state.login_user });
  const mapProduct = useSelector(state => { return state.mapProductEls });

  useEffect(async () => {
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
          setProbrokerinfo(BrokerInfo.data)
          console.log('821120___BrokerInfo.data',BrokerInfo.data);
    
          // console.log('121_____________', BrokerInfo);
          console.log('121_____________', productsinfoitem.data);
          console.log('121_____________', productsinfoitem.data.prd_imgs);
          console.log('121_____________', !!productsinfoitem.data.prd_imgs);
          // console.log('121_____________', productsinfoitem.data.prd_imgs.split(','));
          // console.log('121_____________', maemul_detailresult);

  }, [])
  
  const history = useHistory();

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


  function data_ascending(a, b) {
    var left = new Date(a['date']).getTime();
    var right = new Date(b['date']).getTime();

    return left > right ? 1 : -1;//왼쪽요소가 더크면 true리턴, 왼쪽요소가 더클시에 왼쪽요소를 오른쪽으로 밀어내는듯.
  }
  // **api 아이디값을 서버에 보내서 정보를 받아와야 합니다.
  // 서버에서 받아온 데이터는 각 state의 title과 desc에 넣으면 됩니다.
  useEffect(async () => {

    console.log('===>>매물상세페이지 로드 시점 관련 정보 쿼리::', mapProduct.clickExc); // 선택 아이디 
    console.log('===>>매물상세페이지 로드 시점 관련 정보 쿼리::', mapProduct.exclusive[0].company_id); // 선택 아이디 
    //일단 클릭한 prd_idneityid(일반매물)에 대해서 처리, 더미매물(prd_id)에대한 정보 쿼리한다.

     let send_info = {
       click_id: mapProduct.clickExc.id,
       temp_type: mapProduct.clickExc.type,
       mem_id: loginUser.memid ? loginUser.memid : 0
     }
     var maemul_detailresult = await serverController.connectFetchController("/api/broker/brokerproduct_detailinfo_get", 'POST', JSON.stringify(send_info));

      if (maemul_detailresult) {

        if (maemul_detailresult.success) {
          console.log('maemul_detailresult::', maemul_detailresult);

          var maemul_data = maemul_detailresult.result_data;
          var probrokerinfo = maemul_data.probrokerinfo[0];//정보가 비어있을 소지가 있음.전문중개사 삭제시에.

          if (probrokerinfo) {
            var ongoing_walse_productscnt = 0;
            var ongoing_jeonse_productscnt = 0;
            var ongoing_maemae_productscnt = 0;//현재 사용가능한 활성화되어져있는 카운팅하는. 월세,전세,매매의 개수를 카운팅.

            var probroker_asign_products = maemul_data.probroker_asign_products;
            for (let p = 0; p < probroker_asign_products.length; p++) {
              let asign_item = probroker_asign_products[p];
              let txn_status = probroker_asign_products[p].txn_status;
              if (txn_status == '거래완료' || txn_status == '검토대기' || txn_status == '검토중' || txn_status == '거래준비' || txn_status == '거래개시요청' || txn_status == '거래개시' || txn_status == '거래개시승인 요청' || txn_status == '거래완료승인 요청' || txn_status == '거래승인 요청') {
                //현재 진행중(취소,의뢰거절,의뢰취소,의뢰철회,수임취소,위윔취소등의 상태값들은 제외)
                switch (asign_item.prd_sel_type) {
                  case '월세':
                    ongoing_walse_productscnt++;
                    break;
                  case '전세':
                    ongoing_jeonse_productscnt++;
                    break;
                  case '매매':
                    ongoing_maemae_productscnt++;
                    break;
                }
              }
            }
            console.log('매물상세>관련 수임전문중개사 수임매물들의 status상태값 조회:', ongoing_walse_productscnt, ongoing_jeonse_productscnt, ongoing_maemae_productscnt);
          }
          if (maemul_data) {
            var productinfo = maemul_data.productinfo[0];//매물정보
            console.log('[=====>매물상세정보::',productinfo);
            var prdtype = productinfo.prd_type;//매물타입
            if (prdtype == '아파트' || prdtype == '오피스텔') {
              var floor_value = maemul_data.floorvalue;
              if (maemul_data.buildinginfo) {
                var buildinginfo = maemul_data.buildinginfo[0];//연결된 단지동정보
                console.log('buildinginfoss:', buildinginfo);

                var total_floor_value = buildinginfo.grd_floor;
              }
              if (maemul_data.complexinfo) {
                var complexinfo = maemul_data.complexinfo[0];
              }
            } else {
              var floor_value = maemul_data.floorvalue;
              var total_floor_value = productinfo.storeoffice_building_totalfloor;//상가,사무실 총층값.
            }
            // 슬라이드 이미지
            setSlideImg(
              productinfo.prd_imgs ? productinfo.prd_imgs.split(',') : []
            )
            setIsSlide(true);
            console.log('여기를 확인',productinfo);
            console.log(productinfo);
            console.log(productinfo);
            console.log(productinfo);
            // 아파트 정보

            // setActive(productinfo.isLike == 1 ? 1 : 0)
            console.log('productinfosss:',productinfo.isLike);
            setProduct({
              prd_id: productinfo.prd_identity_id,
              isexculsive: productinfo.exclusive_status,
              startDate: productinfo.exclusive_status == 1 && productinfo.exclusive_start_date ? productinfo.exclusive_start_date : "20.00.00",
              endDate: productinfo.exclusive_status == 1 && productinfo.exclusive_end_date ? productinfo.exclusive_end_date : "20.00.00",
              kind: productinfo.prd_type,
              address:/*"자이 109동"*/`${productinfo.prd_name && productinfo.prd_name}${productinfo.dong_name ? productinfo.dong_name : ""}${productinfo.floorname ? productinfo.floorname : ""}`,
              type: productinfo.prd_sel_type,
              price: productinfo.prd_price,
              desc: productinfo.prd_description,
              is_tour_active: productinfo.is_tour_active,
              isLike: productinfo.isLike==1?1:0
            })
          }
        }
      }

        var productsinfoitem = await serverController.connectFetchController(`/api/products/${mapProduct.clickExc.id}`, 'GET');
        setdeteilproducts(productsinfoitem.data)
        console.log('produtsinfoitemss:',productsinfoitem);
        var BrokerInfo = await serverController.connectFetchController(`/api/realtors/${mapProduct.exclusive[0].company_id}/pro/info`, 'GET');

          //물건
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

          // 중개사 정보
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
            
            trade:BrokerInfo.data.product_count&& BrokerInfo.data.product_count.complete_count.trade_count,  //매매
            jeonse: BrokerInfo.data.product_count&& BrokerInfo.data.product_count.complete_count.deposit_count, //전세
            monthly: BrokerInfo.data.product_count&& BrokerInfo.data.product_count.complete_count.monthly_count, //월세
          });
        
    }, [])

  useEffect(()=>{
    console.log('broker요소 변경>>>',broker,broker.chat_key);

    if(ChannelServiceElement){
      console.log('매물상세 전문중개사 소개부분에 채팅상담버튼관련 :',broker.chat_key);
      ChannelServiceElement.boot({
        "pluginKey" : broker.chat_key,
        "customLauncherSelector" : "#chat-button",
        "hideChannelButtonOnBoot" : true
      });
    }
  },[broker]);

  useEffect(() => {
    console.log('여기를 확인===>>state product',product );
  }, [product])

  // 리스트 토글
  const onCLickBox = (index) => {
    let arr = slideUp;
    arr[index] = !arr[index];
    setSlideUp([...arr]);
  }


  //단지별실거래 정보 조회페이지이동.
  const complexdetail_show = (target, complexid) => {
    console.log('클릭한 실거래버튼 요소::', target, complexid);

    if(complexid){
      MapProductEls.updateClickBlo({ clickBlo: complexid });
      updatePageIndex(3);
      setHistoryInfo(e => { console.log('now e previndexsss:', e.prevIndex); e.prevIndex.push(1); return JSON.parse(JSON.stringify(e)); });
    }else{
      alert('관련 단지정보가 없습니다!');
      return;
    }
  };

  console.log('아이템2222_______', product);
  console.log('아이템2222_______', deteilproducts);


  return (
    <Wrapper>
      <SideSubTitle title={"물건 상세"} updatePageIndex={updatePageIndex} historyInfo={historyInfo} />{/*상단 타이틀은 subtitle폴더에 컴포넌트로 뺐습니다*/}
      <MaemulDetailContent updatePageIndex={updatePageIndex} setHistoryInfo={setHistoryInfo} setReport={setReport} click_prdidentityid={click_prdidentityid} Previewinfo={deteilproducts} previewprobrokerinfo={probrokerinfo}/>
    </Wrapper>
  );
}


const MUButton = styled(Button)``
const MUIconButton = styled(IconButton)``

//--------------------------------------------------------

const Wrapper = styled.div`
height:100%;
`