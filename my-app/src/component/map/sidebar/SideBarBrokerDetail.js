//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';
//theme
import { TtCon_Frame_Portrait_A, TtCon_MainMapSidePanel_ArticlePos_NoFilterList } from '../../../theme';

//img
import Profile from "../../../img/map/profile_img.png";


// components
import { Mobile, PC } from "../../../MediaQuery";
import SideSubTitle from "./subtitle/SideSubTitle";
import BrokerTabContent from "./tabcontent/BrokerTabContent";
// import SideBarBrokerDetailContent from "./SideBarBrokerDetailContent";
import BrokerSorting from "./BrokerSorting";
import ItemTabContent from "./tabcontent/ItemTabContent";

import ListItemCont_Broker_T1 from '../../common/broker/listItemCont_Broker_T1';
import CommonContact from '../../common/contact/commonContact';
import BrokerRating from '../../common/broker/brokerRating';

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';

// redux
import { MapProductEls } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

//server
import serverController from '../../../server/serverController';

import ChannelServiceElement from '../../common/ChannelServiceElement';


SwiperCore.use([Navigation, Pagination]);

const ItemListItem = [
  {
    isExc: true,
    item_id: 0,
    path: "/",
    startDate: "20.00.00",
    endDate: "20.00.00",
    kind: "아파트파트파트파트",
    detail: "자이 109동",
    type: "전세",
    price: "12억 5,000",
    floor: "층수",
    Area: "공급면적",
    expenses: "관리비",
    desc: "매물특징 칸입니다. 작은설명작은설명작은설명작은설명"
  },
  {
    isExc: false,
    item_id: 1,
    path: "/",
    startDate: "20.00.00",
    endDate: "20.00.00",
    kind: "아파트",
    detail: "자이 109동",
    type: "전세",
    price: "12억 5,000",
    floor: "층수",
    Area: "공급면적",
    expenses: "관리비",
    desc: "매물특징 칸입니다. 작은설명작은설명작은설명작은설명"
  },
  {
    isExc: false,
    item_id: 2,
    path: "/",
    startDate: "20.00.00",
    endDate: "20.00.00",
    kind: "아파트",
    detail: "자이 109동",
    type: "전세",
    price: "12억 5,000",
    floor: "층수",
    Area: "공급면적",
    expenses: "관리비",
    desc: "매물특징 칸입니다. 작은설명작은설명작은설명작은설명"
  },
]

export default function SideItemDetail({ historyInfo, updatePageIndex, setHistoryInfo }) {
  //서버통신하여 받아온 정보  
  //productRedux={} 안에 넣기
  const [brokerName, setBrokerName] = useState("");
  const [broker, setBroker] = useState({});
  const [contact, setContact] = useState({});

  const productRedux = useSelector(state => { return state.mapProductEls });
  const loginUser = useSelector(state => { return state.login_user });

  useEffect(() => {
    init();
  }, []);


  useEffect(() => {
    console.clear();
    console.log('-------------------------');
    console.log(broker);
    if (ChannelServiceElement) {
      ChannelServiceElement.boot({
        "pluginKey": broker.chatkey,
        "customLauncherSelector": '#chat-button',
        'hideChannelButtonOnBoot': true
      });
    }
  }, [broker]);

  const init = async () => {
    console.log('productREDUX CLICKPROSS:', productRedux.clickPro);
    console.log("🎈🎈🎈🎈🧨🧨🧨🧨🧨🎈🎈🎈🎈");

    let body_info = {
      company_id: productRedux.clickPro,
      mem_id: loginUser.memid
    }
    console.log('bodyinfo send servercontraoller:', body_info);
    let res = await serverController.connectFetchController('/api/matterial/probrokerinfo_detail', 'POST', JSON.stringify(body_info));

    if (res.success) {

      if (res.result) {
        var permission_info = res.result.permission_info[0];
        var probroker_info = res.result.probroker_info;
        var asign_productinfo = res.result.asign_productinfo;//맡고 있는 수임매물들.정보.
        console.log('proobrkerinnfo get전문중개사관련 정보 얻기:', res, probroker_info, asign_productinfo);
        if (asign_productinfo) {
          var ongoing_walse_productscnt = 0;
          var ongoing_jeonse_productscnt = 0;
          var ongoing_maemae_productscnt = 0;//현재 사용가능한 활성화되어져있는 카운팅하는. 월세,전세,매매의 개수를 카운팅.

          /*
          총등록건수: 코렉스시스템상 전체에서 각 업소별 등록건수(거래개시인건들)총합.거래개시인 product매물 전체항목
          업소별등록건수:밑의 쿼리에서 거래개시상태인항목들의 count값. 
          전문성지수 = 등록률(업소별 등록건수/총 등록건수)*등록가중치 + 성사율(업소별성사건수/업소별등록건수)*성사가중치
          if(총등록건수>100)등록가중치 = 0.5 , 등록가중치=0.3
          if(업소별등록건수>10) 성사가중치 0.5 , 성사가중치 0.3
          업소별등록건수,업소별성사건수,성사가중치 등은 프론트단에서 판단최종적으로 하고(데이터확인까지)
          총등록건수,등록가중치 등 정보는 서버에서 쿼리로 전달 알려줌
          */

          var all_regist_count = res.all_regist_count;//서버에서 가져온 총 등록건숴(거래개시)
          var probroker_per_regist_count = 0//업소별 등록건수
          var probroker_per_complete_count = 0;//업소별 성사건수
          var regist_weight;//등록가중치
          var complete_weight;//성사가중치

          for (let p = 0; p < asign_productinfo.length; p++) {
            let txn_status = asign_productinfo[p].txn_status;
            let productinfo = asign_productinfo[p];
            /*if(txn_status=='거래완료' || txn_status=='검토대기' || txn_status=='검토중' || txn_status=='거래준비' || txn_status=='거래개시요청' || txn_status=='거래개시' || txn_status=='거래개시승인 요청' || txn_status=='거래완료승인 요청' || txn_status=='거래승인 요청'){*/
            if (txn_status == '거래개시') {
              //현재 진행중(취소,의뢰거절,의뢰취소,의뢰철회,수임취소,위윔취소등의 상태값들은 제외)
              probroker_per_regist_count++;
            } else if (txn_status == '거래완료') {
              switch (productinfo.prd_sel_type) {
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
              probroker_per_complete_count++;
            }
          }
          MapProductEls.updateBrokerProduct({ brokerProduct: asign_productinfo });//수임매물들중 거래개시상태인것들만 뿌려야합니다.나중에.

          var professional_score;
          var professional_scorevalue = 0;
          if (all_regist_count > 100) {
            regist_weight = 0.5
          } else {
            regist_weight = 0.3;
          }
          if (probroker_per_regist_count > 10) {
            complete_weight = 0.5;
          } else {
            complete_weight = 0.3
          }
          professional_score = ((probroker_per_regist_count / all_regist_count) * regist_weight) + ((probroker_per_complete_count / probroker_per_regist_count) * complete_weight);
          console.log('professional socre valuess계산::', professional_score);
          if (professional_score) {
            if (professional_score >= 0 && professional_score < 0.1) {
              professional_scorevalue = 1;
            } else if (professional_score >= 0.1 && professional_score < 0.4) {
              professional_scorevalue = 2;
            } else if (professional_score >= 0.4 && professional_score < 0.6) {
              professional_scorevalue = 3;
            } else if (professional_score >= 0.6 && professional_score < 0.9) {
              professional_scorevalue = 4;
            } else if (professional_score >= 0.9) {
              professional_scorevalue = 5;
            }
          }
        }

      }
    }

    //중개매너 점수 환산(유저별로 각 유저별 최근점수매긴 값들의 합 각 유저별 임의중개사에 매긴 점수의 합계 평균치로 판단)
    let score_info = {
      company_id: productRedux.clickPro
    }
    let score_result = await serverController.connectFetchController('/api/broker/probroker_mannerscore_process', 'POST', JSON.stringify(score_info));
    let brokermannervalue;
    if (score_result) {
      if (score_result.success) {
        console.log('score_reusltsss:', score_result.result);
        let average = score_result.result.average;
        if (average >= 1 && average < 2) {
          brokermannervalue = 1;
        } else if (average >= 2 && average < 3) {
          brokermannervalue = 2;
        } else if (average >= 3 && average < 4) {
          brokermannervalue = 3;
        } else if (average >= 4 && average < 5) {
          brokermannervalue = 4;
        } else if (average >= 5) {
          brokermannervalue = 5;
        }
      }
    }
    console.log('professional_scorevalue::', professional_scorevalue);
    //전문중개사 전문종목 정보 + 수임매물status관련정보(전문성중개매너등의 정보) + 수임매물들 리스트 정보.
    setBrokerName(probroker_info.company_name);//전문중개사이름.
    setBroker({
      pro_apt_id: permission_info.pro_apt_id ? '아파트' + permission_info.apt_name : '',
      pro_oft_id: permission_info.pro_oft_id ? '오피스텔' + permission_info.oft_name : '',
      is_pro_store: permission_info.is_pro_store ? "상가" : '',
      is_pro_office: permission_info.is_pro_office ? "사무실" : '',
      name: probroker_info.ceo_name,
      address: probroker_info.addr_jibun,
      trade: ongoing_maemae_productscnt,
      jeonse: ongoing_jeonse_productscnt,
      monthly: ongoing_walse_productscnt,
      profile: probroker_info.profile_img ? probroker_info.profile_img : Profile,
      profession: professional_scorevalue,
      manner: brokermannervalue,
      chatkey: probroker_info.chat_key
    })
  };

  useEffect(() => {
    if (ChannelServiceElement) {
      ChannelServiceElement.boot({
        "pluginKey": broker.chatkey,
        "customLauncherSelector": '#chat-button',
        'hideChannelButtonOnBoot': true
      });
    }
  }, [broker])

  console.log('broker____', broker);
  return (
    <>
      <SideSubTitle title={brokerName} updatePageIndex={updatePageIndex} historyInfo={historyInfo} />
      <Sect_Article className="noneScrollbar">
        <Sect_Article_1>
          <div className="pd-0p625">
            {/* <SideBarBrokerDetailContent setHistoryInfo={setHistoryInfo} broker={broker} /> */}
            <>
              <div className="par-spacing-after">
                <ListItemCont_Broker_T1 broker={broker} />
              </div>
              <div className="par-spacing">
                <Sect_BulletinCont>
                  <BrokerRating title={"전문성"} score={broker.profession} />
                  <BrokerRating title={"중개매너"} score={broker.manner} />
                </Sect_BulletinCont>
              </div>
              <div className="par-spacing tAlign-c">
                <CommonContact contact={contact} />
              </div>
            </>
          </div>
          <div className="divider-a1" />
          <div className="par-spacing-before-2p5">
            <div className="pd-0p625 flex-spabetween-center">
              <BrokerSorting />
            </div>
          </div>
          <div className="par-spacing-before">
            <ItemTabContent updatePageIndex={updatePageIndex} setHistoryInfo={setHistoryInfo} productList={productRedux.brokerProduct} index={2} />
          </div>
        </Sect_Article_1>
      </Sect_Article>
    </>
  );
}

const Sect_Article = styled.div`
${TtCon_MainMapSidePanel_ArticlePos_NoFilterList}
overflow-y: auto;
`
const Sect_Article_1 = styled.div`
${TtCon_Frame_Portrait_A}
`

const WrapItemCont = styled.div`
  /* width:100%;
  @media ${(props) => props.theme.mobile} {
    padding:0 calc(100vw*(20/428));
  } */
`

const Wrap = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:0.625rem;
`

const Sect_BulletinCont = styled.div`
    width:70%;
    margin: 0 auto;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {}
    @media (max-width: 550px) {width:80%;}
`