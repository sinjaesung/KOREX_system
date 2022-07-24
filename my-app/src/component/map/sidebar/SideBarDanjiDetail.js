
//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//theme
import { TtCon_Frame_Portrait_A, TtCon_MainMapSidePanel_ArticlePos_NoFilterList } from '../../../theme';

//material
import AutorenewIcon from '@mui/icons-material/Autorenew';

//img
import Arrow from "../../../img/map/filter_next.png";
import Detail from "../../../img/map/detail_img.png";
import Trade from "../../../img/map/trade.png";
import Report from "../../../img/map/report.png";
import Change from "../../../img/member/change.png";

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';


// components
import { Mobile, PC } from "../../../MediaQuery";
import SideSubTitle from "./subtitle/SideSubTitle";
import DanjiDetailTabContent from "./tabcontent/DanjiDetailTabContent";
import DanjiDetailView from "./tabcontent/DanjiDetailView";

// redux
import { MapProductEls } from '../../../store/actionCreators';
import { useSelector } from 'react-redux';

//server
import serverController from '../../../server/serverController';

SwiperCore.use([Navigation, Pagination]);

export default function SideItemDetail({ openBunyang, rank, pageIndex, updatePageIndex, historyInfo, map, setMap, setDangimap_data }) {

  const [topDesc, setTopDesc] = useState({
    title: "",
    acceptDate: "",
    danji: "",
    address: "",
  });
  const [isArea, setIsArea] = useState(false); // isArea가 없으면 슬라이더가 깨집니다.
  const [area, setArea] = useState([]); // 면적 단위 정보
  const [areaIndex, setAreaIndex] = useState(0); // 면적 단위 정보 클릭
  const [list, setList] = useState([]);  // 계약일, 거래유형, 거래금액, 층수 정보
  const [danjiDesc, setDanjiDesc] = useState([]); // 면적, 세대수
  const [typeIndex, setTypeIndex] = React.useState(0); // 전세, 매매, 월세
  const [isAddress, setIsAddress] = useState(true); // 삳단 주소 <-> 도로명주소
  const [areainfo_structure, setAreainfo_structure] = useState([]);
  const [isWidth, setIsWidth] = useState(true); // 면적 단위 평 <-> m²

  const productRedux = useSelector(state => { return state.mapProductEls });
  const dangiSidebarmodal = useSelector(state => state.dangiSidebarmodal)
  console.log(dangiSidebarmodal, "dangiSiderbarmodal");
  console.log(productRedux, "productRedux");

  // **api 클릭한 아이디를 통하여 서버에서 데이터를 가져와야 합니다.
  useEffect(async () => {
    console.log("단지별상세 모달 상세페이지 pageindex:", pageIndex);
    let body_info = {
      complex_id: productRedux.clickBlo
    };

    /*let body_info = {
      complex_id : dangiSidebarmodal.block[0].complex_id
    };*/
    console.log(body_info, "body_info");


    let res_result = await serverController.connectFetchController('/api/matterial/complexdetail_infoget', 'POST', JSON.stringify(body_info));

    if (res_result) {
      console.log('==>>>sidebardandetail페잊 ㅣ실행되며 로드시점 서버에 요청, 해당 단지관련 모드넞ㅇ보:', res_result);

      if (res_result.success) {
        if (res_result.result) {
          var complex_data = res_result.result[0][0];//어차피 하나이기에.
          var complex_total_sadecnt = res_result.result[1];//해당 단지에 대한 총 세대수
          var areainfo_info_structure = res_result.result[2];//해당 단지에 호실별로 있는 면적별로 있는 면적별세대수,면적별 계약정보등등 확인가능.          

          // 면적 단위 
          /*setArea(  
            areainfo_array    
          );*/
          // 계약일, 거래유형, 거래금액, 층수 정보 각 면적별 정보리스트저장. 
          setAreainfo_structure(areainfo_info_structure);
          setAreaIndex(0);
          // 상단 설명
          setTopDesc({
            x: complex_data.x,
            y: complex_data.y,
            title: complex_data.complex_name, // 제목
            acceptDate: complex_data.approval_date, // 날짜
            danji: complex_total_sadecnt, // 세대 수
            address: complex_data.addr_jibun, // 주소
            roadAddress: complex_data.addr_road // 도로명 주소
          })
          // 단지 내 면적별 정보 정보
          if (areainfo_info_structure[0]) {
            setDanjiDesc({
              area: parseFloat(areainfo_info_structure && areainfo_info_structure[0]['info']['supply_area']).toFixed(3) + '/' + parseFloat(areainfo_info_structure && areainfo_info_structure[0]['info']['exclusive_area']).toFixed(3), // 공급/전용면적
              //typeNum:areainfo_info_structure&&areainfo_info_structure[0]['sadecnt'], // 해당타입세대수
            });

            //단지 내 면적별 거래 정보 초기값 전세유형, 유형별로매번 바뀔수있음.
            //기본값은 전세거래타입 결과배열의 각 정보들 전세거래정보들 불러온다.
            var default_total_list = [];

            for (let d = 0; d < areainfo_info_structure[0]['totaltransaction'].length; d++) {
              default_total_list[d] = {};
              default_total_list[d]['contract_ym'] = areainfo_info_structure[0]['totaltransaction'][d]['contract_ym'];
              default_total_list[d]['contract_dt'] = areainfo_info_structure[0]['totaltransaction'][d]['contract_dt'];
              default_total_list[d]['type'] = areainfo_info_structure[0]['totaltransaction'][d]['type'];
              default_total_list[d]['deposit'] = areainfo_info_structure[0]['totaltransaction'][d]['deposit'];
              default_total_list[d]['floor'] = areainfo_info_structure[0]['totaltransaction'][d]['floor'];
            }
            setList(
              //계약일, 거래유형, 거래금액, 층수 정보
              //conract_ym, contract_dt, type, deposit, floor
              default_total_list
            );
          }

          setIsArea(true);
        }
      }
    }
  }, []);

  return (
    <>
      <SideSubTitle title={topDesc.title} updatePageIndex={updatePageIndex} historyInfo={historyInfo} />{/*상단 타이틀은 subtitle폴더에 컴포넌트로 뺐습니다*/}
      <Sect_Article className="noneScrollbar">
      <div className="tAlign-c par-spacing-2p5x0">
        <p>{topDesc.acceptDate}사용승인&nbsp;{topDesc.danji}세대</p>
        <div>
          <span className="aHref-a1 txt-sub" onClick={() => { setMap(true); setDangimap_data({ address: topDesc.address, roadaddress: topDesc.roadAddress, x: topDesc.x, y: topDesc.y }) }}>{isAddress ? topDesc.address : topDesc.roadAddress}
          </span>
          <span className="cursor-p" onClick={() => setIsAddress(!isAddress)}>
            <ChangeImg src={Change} />
            <Span>도로명</Span>
          </span>
        </div>
      </div>
      <div className="divider-a1" />
      <div>
        <div className="flex-spabetween-center">
          <h3 className="tit-a3">단지 내 면적별 정보</h3>
          <ChangeM2 onClick={() => setIsWidth(!isWidth)}>
            <ChangeImg src={Change} />
            <Span>평</Span>
          </ChangeM2>
        </div>
        <DanjiDetailTabContent setDanjiDesc={setDanjiDesc} setList={setList} areainfo_structure={areainfo_structure} isArea={isArea} areaIndex={areaIndex} setAreaIndex={setAreaIndex} setTypeIndex={setTypeIndex} isWidth={isWidth} />
        <div className="par-spacing-before">
          <DanjiDetailView topDesc={topDesc} list={list} areaIndex={areaIndex} setList={setList} danjiDesc={danjiDesc} areainfo_structure={areainfo_structure} typeIndex={typeIndex} setTypeIndex={setTypeIndex} />
        </div>
      </div>
      </Sect_Article>
    </>
  );
}

const Sect_Article = styled.div`
${TtCon_MainMapSidePanel_ArticlePos_NoFilterList}
overflow-y: auto;
`

const TopInfo = styled.div`
  width:100%;
  text-align:center;
  padding:21px 0 23px;
  border-bottom:8px solid #e4e4e4;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(20/428)) 0;
  }
`
const FirstLine = styled.div`
  display:flex;justify-content:center;align-items:center;
  margin-bottom:8px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(5/428));
  }
`
const FirstDate = styled.p`
  font-size:15px;color:#707070;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Danji = styled(FirstDate)`
`
const SecondLine = styled(FirstLine)`
  margin-bottom:0;
`
const Address = styled(FirstDate)`
  text-decoration:underline;
  cursor:pointer;
`
const ChangeAddress = styled.div`
  margin-left:10px;
  cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(10/428));
  }
`
const ChangeImg = styled.img`
  display:inline-block;width:13px;
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(13/428));
  }
`
const Span = styled.span`
  display:inline-block;
  margin-left:6px;
  font-size:10px;font-weight:800;transform:skew(-0.1deg);
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(10/428));
    margin-left:calc(100vw*(5/428));
  }
`
const DanjiInfo = styled.div`
  padding:28px 22px 0;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(23/428)) 0 0;
  }

`
const DanjiTitle = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
`
const Txt = styled.h2`
  padding-left:22px;
  font-size:20px;font-weight:800;
  transform:skew(-0.1deg);color:#4a4a4a;
  @media ${(props) => props.theme.mobile} {
    padding-left:calc(100vw*(36/428));
    font-size:calc(100vw*(20/428));
  }
`
const ChangeM2 = styled.div`
  margin-left:15px;
  cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(10/428));
  }
`
