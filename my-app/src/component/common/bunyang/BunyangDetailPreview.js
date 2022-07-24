//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Button from '@mui/material/Button';
//style
import styled from "styled-components"

//img
import ItemImg from "../../../img/main/item01.png";
import SwipImg from "../../../img/main/swip_img.png";
import Homepage from "../../../img/main/go_home.png";
import Exit from "../../../img/main/exit.png";
import Heart from "../../../img/main/heart.png";
import HeartCheck from "../../../img/main/heart_check.png";
import Call from "../../../img/main/call.png";
import Live from "../../../img/main/live.png";
import Chat from "../../../img/main/chat.png";
import BackBtn from '../../../img/notice/back_btn.png';

//material-ui
import BrokerContact from '../contact/commonContact'
import localStringData from '../../../const/localStringData';
import serverController from '../../../server/serverController'
import { useSelector } from 'react-redux';
import BunyangDetail from './BunyangDetail';

function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}


SwiperCore.use([Navigation]);
export default function BunyangDetailPreview({bunyangDetail,setLive,setDetailImg,setCal, BunyangDate }){


  const [brokerContact, setbrokerContact] = useState({});

  const [rightTopData, setRightTopData] = useState({title:"", number:"", option:[], address:""});
  const [rigthDetailData, setRigthDetailData] = useState([]);
  const [hashTagArr, setHashTagArr] = useState([]);
  // 처음부터 렌더하게되면 이미지 슬라이더가 먹지않아 이미지가 받아온 후 렌더되도록 하였습니다.
  const [firstRender, setFirstRender] = useState(false);

  const [active,setActive] = useState(bunyangDetail.isLike);
  const loginUser = useSelector(state => {return state.login_user});

  const [livetour,setlivetour] = useState(null);

  console.log('bunyangDetail previewsss:',bunyangDetail);
  // 클릭한 아이디를 서버에 보내고 데이터를 받아와 적용시키면 됩니다.
  useEffect(() => {
    // console.log(clickId);

    // 우측 상단 데이터입니다.
    setRightTopData({
      title:"충남내포신도시2차대방엘리움더센트럴",
      number:"2D0000324",
      option:["충청남도", "아파트", "민간분양"],
      address:"충청남도 홍성군 홍북읍 신경리 947번지",
      LikeChecked : false 
    })

    // 우측 하단 데이터입니다.
    setRigthDetailData([
      {title: "분양세대", content: BunyangDate.desc1},
      {title: "분양면적", content: BunyangDate.desc2},
      {title: "전용면적", content: "77㎡ ~ 85㎡"},
      {title: "분양가격", content: "35,599 ~ 44,049 만원"},
      {title: "전용면적", content: "77㎡ ~ 85㎡"},
      {title: "모델하우스 주소", content: "서울특별시 강남구 서초동 길동아파트 103 103호"},
      {title: "중개보수", content: "-"},
      {title: "Live 방송일시", content: liveTime( new Date("2021-01-01 09:00") ) },
    ])
    
    // HashTag 배열입니다.
    setHashTagArr([
      "#hashtag","#hashtag","#hashtag"
    ])
    
   
    setFirstRender(true);

  }, [])

  
  useEffect(async()=>{
    if(!bunyangDetail.bp_id)
    return;

    serverController.connectFetchController(`/api/bunyang/reservation/setting?bp_id=${bunyangDetail.bp_id}&tour_type=4`,'GET',null,function(res){
      if(res.success == 1){
        if(res.data[0]){
          setlivetour(res.data[0]);
        }else{
          setlivetour(null);
        }      
      }
    });

  },[bunyangDetail]);

  // 날짜 넥스트 변환
  const liveTime = (date) => {
    return `${date.getFullYear()}.${addZero(date.getMonth()+1)}.${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
  }

  // 날짜에 0 추가
  const addZero = (text) => {
    text = String(text);
    if(text.length == 1){
      text = "0" + text;
    }
    return text;
  }

  // 옵션사이에 " / " 넣기
  const optionList = () => {
    let optionText = rightTopData.option[0];
    for(let i = 1 ; i < rightTopData.option.length ; i++){
      optionText += " / " + rightTopData.option[i];
    }
    return optionText;
  }
  console.log('분양세대  ',bunyangDetail.household_cng);
    return (
      // <Container>
      // {/*bunyangtop*/}
      //   <ModalTop>
      //     <Back onClick={() => { }}>
      //       <ImgBack src={BackBtn}/>
      //     </Back>
      //     <Title>분양상세</Title>
      //   </ModalTop>
      //   <WrapDetail>
      //     <LeftDetail>

      //       <SwiperBennerWrap className="bunyang_swiper">
      //           {
      //             bunyangDetail.image_list  ?
      //             <Swiper
      //               spaceBetween={5}
      //               slidesPerView={1}
      //               loop={true}
      //               autoplay={false}
      //               navigation={{ clickable: true }}
      //               onSlideChange={() => console.log('slide change')}
      //               onSwiper={(swiper) => console.log(swiper)}
      //             >
      //             {
      //                bunyangDetail.image_list.split(',').map((value, index) => {
      //                 return(
      //                   <SwiperSlide ket={index}>
      //                     <Link onClick={() => {setDetailImg(true)}}>
      //                       <Img src={localStringData.imagePath + (value)} alt="img"/>
      //                     </Link>
      //                   </SwiperSlide>
      //                 )
      //               })
      //             }
      //             </Swiper>
      //             :
      //             <></>
      //           }
      //           {/* <SwiperSlide>
      //             <Link onClick={() => {setDetailImg(true)}}>
      //               <Img src={SwipImg} alt="img"/>
      //             </Link>
      //           </SwiperSlide>
      //           <SwiperSlide>
      //             <Link onClick={() => {setDetailImg(true)}}>
      //               <Img src={SwipImg} alt="img"/>
      //             </Link>
      //           </SwiperSlide> */}
              
      //       </SwiperBennerWrap>
      //       {/*hastags
      //       <HashTag>
      //         {
      //           hashTagArr.map((item, index) => {
      //             return(
      //               <Tag key={index}>{item}</Tag>
      //             )
      //           })
      //         }
      //       </HashTag>*/}

      //       {/*홈페이지,예약등*/}
      //       <LeftButtons>
      //         <Button>
      //           <Link className="data_link" href={bunyangDetail.modelhouse_url}></Link>
      //           <IconImg src={Homepage}/>
      //           <Txt>홈페이지</Txt>
      //         </Button>
      //         <Button>
      //           <Link onClick={() => {setCal(true)}} className="data_link"></Link>
      //           <IconImg src={Exit}/>
      //           <Txt>방문예약</Txt>
      //         </Button>
      //         {
      //           bunyangDetail.liveChecked ? 
      //           <ButtonOrange>
      //             <Link onClick={() => {setLive(true)}} className="data_link"></Link>
      //             <IconImg src={Live}/>
      //             <TxtOrange>Live 시청예약</TxtOrange>
      //           </ButtonOrange>
      //           :
      //           null
      //         }
      //       </LeftButtons>
      //     </LeftDetail>
      //     {/*RightDetail*/}
      //       <RightDetail>
      //         <RightTop>
      //           <TopTitle>{bunyangDetail.bp_name}<Number>{bunyangDetail.bp_type}</Number></TopTitle>
      //           <Option>{optionList()}</Option>
      //           <Address>{bunyangDetail.bp_addr_road + " " + bunyangDetail.bp_addr_detail}</Address>
      //           {/*
      //             <TopTitle>충남내포신도시2차대방엘리움더센트럴<Number>2D0000324</Number></TopTitle>
      //             <Option>충청남도 / 아파트 / 민간분양</Option>
      //             <Address>충청남도 홍성군 홍북읍 신경리 947번지</Address>
      //           */}
      //           <LikeBtn>
      //             <Like type="checkbox" id="like" checked={active} onClick={LikeBtnEvent}></Like>{/*checked={BunyangDate.LikeChecked}*/}
      //             <Label for="like" className="check_label"></Label>
      //           </LikeBtn>
      //         </RightTop>
      //         <RightBottom>
       
      //             <Desc>
      //               <DTitle>분양세대</DTitle>
      //               <DescInfo>{bunyangDetail.household_cng}세대</DescInfo>
      //             </Desc>
      //             <Desc>
      //               <DTitle>분양면적</DTitle>
      //               <DescInfo>{bunyangDetail.min_exclusive_area}㎡ ~ {bunyangDetail.max_exclusive_area}㎡</DescInfo>
      //             </Desc>
      //             <Desc>
      //               <DTitle>전용면적</DTitle>
      //               <DescInfo>{bunyangDetail.min_supply_area}㎡ ~ {bunyangDetail.max_supply_area}㎡</DescInfo>
      //             </Desc>
      //             <Desc>
      //               <DTitle>분양가격</DTitle>
      //               <DescInfo>{bunyangDetail.min_price ? numberWithCommas(bunyangDetail.min_price) : 0} ~ {bunyangDetail.max_price ? numberWithCommas(bunyangDetail.max_price) : 0} 만원</DescInfo>
      //             </Desc>
      //             <Desc>
      //               <DTitle>모델하우스 주소</DTitle>
      //               <DescInfo>{bunyangDetail.md_addr_road + " "+ bunyangDetail.md_addr_detail}</DescInfo>
      //             </Desc>
      //             <Desc>
      //               <DTitle>중개보수</DTitle>
      //               <DescInfo>-</DescInfo>
      //             </Desc>
      //             <Desc>
      //               <DTitle>Live 방송일시</DTitle>
      //               <DescInfo>{bunyangDetail.liveDate ? bunyangDetail.liveDate.replace(/-/gi,'/').slice(0,-3) : ""}</DescInfo>
      //             </Desc>


      //         </RightBottom>
      //       </RightDetail>
      //     </WrapDetail>
      //   {/*전화상담 ,채팅상담*/}
      //       <Wrap>
      //         <BottomButton>
      //           <Link className="data_link"></Link>
      //           <BottomImg src={Call}/>
      //           <BottomTxt>전화상담</BottomTxt>
      //         </BottomButton>
      //         <Line/>
      //         <BottomButton>
      //           <Link className="data_link"></Link>
      //           <BottomImg src={Chat}/>
      //           <BottomTxt>채팅상담</BottomTxt>
      //         </BottomButton>
      //       </Wrap>
      // </Container>

      <>
        <Wrapper>
          <Sect_R2>
            <Wrap_Content>
              <Sect_C1>
                <SwiperBennerWrap className="bunyang_swiper">
                  {
                    bunyangDetail.image_list ?
                      <Swiper
                        spaceBetween={5}
                        slidesPerView={1}
                        loop={true}
                        autoplay={false}
                        navigation={{ clickable: true }}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}
                      >
                        {
                          bunyangDetail.image_list.split(',').map((value, index) => {
                            return (
                              <SwiperSlide key={index}>
                                <Img onClick={() => { setDetailImg(true) }} src={localStringData.imagePath + (value)} alt="img" />
                              </SwiperSlide>
                            )
                          })
                        }
                      </Swiper>
                      :
                      <></>
                  }
                  {/* <SwiperSlide>
                  <Link onClick={() => {setDetailImg(true)}}>
                    <Img src={SwipImg} alt="img"/>
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link onClick={() => {setDetailImg(true)}}>
                    <Img src={SwipImg} alt="img"/>
                  </Link>
                </SwiperSlide> */}

                </SwiperBennerWrap>
                {/*hastags
            <HashTag>
              {
                hashTagArr.map((item, index) => {
                  return(
                    <Tag key={index}>{item}</Tag>
                  )
                })
              }
            </HashTag>*/}
              
                {/*홈페이지,예약등*/}
              </Sect_C1>
              {/*RightDetail*/}
              <Sect_C2>
                {/* {
                  bunyangDetail.liveChecked ? */}
                    <div className="par-spacing-after">
                      <EmBox>
                        <h3>LIVE 방송일시 : {bunyangDetail.liveDate ? bunyangDetail.liveDate.replace(/-/gi, '/').slice(0, -3) : ""}</h3>
                        <div className="flex-right-center">
                          <MUButton variant="contained" disableElevation color="secondary" onClick={() => { setLive(true) }} startIcon={<LiveTvIcon />}>시청 예약</MUButton>
                        </div>
                      </EmBox>
                    </div>
                    {/* :
                    null
                } */}

                <div className="par-spacing">
                  <div><TopTitle>{bunyangDetail.bp_name}</TopTitle><Number>{bunyangDetail.bp_type}</Number></div>
                  <Option>{optionList()}</Option>
                  <Address>{bunyangDetail.bp_addr_road + " " + bunyangDetail.bp_addr_detail}</Address>
                </div>
                <div className="divider-a1" />
                <div className="par-spacing">
                  <Desc>
                    <DTitle>분양세대</DTitle>
                    <DescInfo>{bunyangDetail.household_cnt}세대</DescInfo>
                  </Desc>
                  <Desc>
                    <DTitle>분양면적</DTitle>
                    <DescInfo>{bunyangDetail.min_exclusive_area}㎡ ~ {bunyangDetail.max_exclusive_area}㎡</DescInfo>
                  </Desc>
                  <Desc>
                    <DTitle>전용면적</DTitle>
                    <DescInfo>{bunyangDetail.min_supply_area}㎡ ~ {bunyangDetail.max_supply_area}㎡</DescInfo>
                  </Desc>
                  <Desc>
                    <DTitle>분양가격</DTitle>
                    <DescInfo>{bunyangDetail.min_price ? numberWithCommas(bunyangDetail.min_price) : 0} ~ {bunyangDetail.max_price ? numberWithCommas(bunyangDetail.max_price) : 0} 만원</DescInfo>
                  </Desc>
                  <Desc>
                    <DTitle>모델하우스 주소</DTitle>
                    <DescInfo>{bunyangDetail.md_addr_road + " " + bunyangDetail.md_addr_detail}</DescInfo>
                  </Desc>
                </div>
                <div className="divider-a1" />
                <div className="par-spacing">
                  <TopTitle>중개보수</TopTitle>
                  <p>금액금액금액금액 설명설명설명설명설명</p>
                </div>
            <div className="flex-right-center">
              <BrokerContact brockerContact={brokerContact} />
              {/* {
                invitetour ? */}
                  <MUButton variant="contained" disableElevation onClick={() => { setCal(true) }} startIcon={<DirectionsWalkIcon />}>
                    <Link className="data_link" />
                    방문 예약
                  </MUButton>
                  {/* :
                  null
              } */}
            </div>
              </Sect_C2>
            </Wrap_Content>
          </Sect_R2>
        </Wrapper>
      </>




    );
}

const Wrapper = styled.div`
  height:100%;
`

const Sect_R2 = styled.div`
  width: 95%;
  height:100%;
  padding:0.625rem 0 0.625rem;
  margin:0 auto;
  position: relative;
`

const Wrap_Content = styled.div`
  display: flex;
`

const Sect_C1 = styled.div`
  width:50%;
  padding: 0 1rem;
`

const Sect_C2 = styled.div`
  width:50%;
  padding: 0 1rem;
`

const MUButton = styled(Button)``


const EmBox = styled.div`
  background-color: ${(props) => props.theme.palette.mono.main};
  border: 1px solid ${(props) => props.theme.palette.line.main};
  padding:1rem;
`


const Container = styled.div`
  width:100%;

`
const ModalTop = styled.div`
  position:relative;
  width:100%;
  margin-bottom:22px;
  @media ${(props) => props.theme.container} {
      margin-bottom:calc(100vw*(22/1436));
    }
`
const Title = styled.h2`
  font-size:20px;color:#707070;
  padding-left:38.5px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(20/1436));
    }
`
const Back = styled.div`
  position:absolute;
  left:11px;
  top:62%;transform:translateY(-50%);
  z-index:2;
  cursor:pointer;
`
const ImgBack = styled.img`
  width:9px;
`
const WrapDetail = styled.div`
  width:100%;
  display:flex;justify-content:flex-start;
  border-top:1px solid #a3a3a3;
  padding-top:10px;

`
const LeftDetail = styled.div`
  width:470px;
  @media ${(props) => props.theme.container} {
      width:45%;
    }

`
const SwiperBennerWrap = styled.div`
  width:100%;
`
const Img = styled.img`
  width:100%;
`
const HashTag = styled.div`
  width:100%;
  margin-top:15px;
  display:flex;justify-content:center;
  align-items:center;

`
const Tag = styled.div`
  padding: 3px 16px;
  height:30px;
  line-height:22px;
  margin-right:10px;
  font-size:15px;color:#707070;font-weight:800;
  transform:skew(-0.1deg);
  border:1px solid #e4e4e4;border-radius:15px;
  background:#f8f7f7;
  &:last-child{margin-right:0;}
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(15/1436));
    }

`
const LeftButtons = styled(HashTag)`
  margin-top:35px;

`
// const Button = styled.div`
//   position:relative;
//   text-align:center;
//   padding:12px 0 10px;
//   width:70px;
//   height:65px;
//   border:1px solid #e4e4e4;
//   margin-right:15px;
//   &:last-child{margin-right:0;}

// `
const ButtonOrange = styled(Button)`
  border:1px solid #fe7a01;
`
const IconImg = styled.img`
  display:block;
  width:20px;height:20px;
  margin:0 auto;
  @media ${(props) => props.theme.container} {
      width:calc(100vw*(20/1436));
      height:calc(100vw*(20/1436));
    }

`
const Txt = styled.p`
  font-size:11px;
  font-weight:normal;
  width:100%;
  margin-top:6px;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.container} {
      margin-top:calc(100vw*(6/1436));
    }
`
const TxtOrange = styled(Txt)`
  color:#fe7a01;
`
const RightDetail = styled.div`
  position:relative;
  width:525px;
  margin-left:10px;
  height:416px;
  background:#f8f7f7;
  padding:29px;
  @media ${(props) => props.theme.container} {
      width:55%;
      height:calc(100vw*(420/1436));
    }

`
const RightTop = styled.div`
  width:100%;
  padding-bottom:20px;
  border-bottom:1px solid #d0d0d0;
  @media ${(props) => props.theme.container} {
      width:100%;
      padding-bottom:calc(100vw*(20/1436));
    }

`
const TopTitle = styled.h2`
  font-size:18px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  margin-bottom:5px;
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(18/1436));
    }

`
const Number = styled.span`
  font-size:14px;color:#979797;
  font-weight:800;transform:skew(-0.1deg);
  display:inline-block;
  margin-left:10px;
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(14/1436));
    }
`
const Option = styled.p`
  font-size:14px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  margin-bottom:5px;
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(14/1436));
    }

`
const Address = styled(Option)`
  color:#707070;
  margin-bottom:0;
`
const LikeBtn = styled.div`
  position:Absolute;
  right:20px;top:20px;

`
const Like = styled.input`
  display:none;
  &:checked + .check_label{width:29px;height:29px;background:url(${HeartCheck}) no-repeat center center;background-size:17px 17px;}
`

const Label = styled.label`
  display:inline-block;
  width:29px;height:29px;
  border:1px solid #d0d0d0;border-radius:3px;
  background:#fff url(${Heart}) no-repeat center center;
  background-size:17px 17px;

`
const RightBottom = styled.div`
  width:100%;
  padding-top:20px;

`
const Desc = styled.div`
  display:flex;justify-content:space-between;
  margin-bottom:12px;

`
const DTitle = styled.p`
  width:170px;
  font-size:15px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  ${({active}) => {
    return active?
    `color:#fe7a01;` 
    :
    ``
  }}
  @media ${(props) => props.theme.container} {
      width:calc(100vw*(170/1436));
      font-size:calc(100vw*(15/1436));
    }

`
const DescInfo = styled(DTitle)`
  width:auto;
  color:#707070;
  text-align:right;
  word-break:keep-all;
  ${({active}) => {
    return active?
    `color:#fe7a01;` 
    :
    ``
  }}
`

const Wrap = styled.div`
  display:flex;justify-content:center;align-items:center;
  width:365px;
  height:60px;
  margin:34px auto 0;
  border-radius:34px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  @media ${(props) => props.theme.container} {
      width:calc(100vw*(365/1436));
      height:calc(100vw*(60/1436));
      margin:calc(100vw*(20/1436)) auto 0;
    }

`
const BottomButton = styled.div`
  position:relative;
  display:flex;justify-content:center;align-items:center;
`
const BottomImg = styled.img`
  display:inline-block;
  width:17px;
  margin-right:5px;

`
const BottomTxt = styled.p`
  display:inline-block;
  font-size:15px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(14/1436));
    }

`
const Line = styled.div`
  width:1px;
  height:35px;background:#e4e4e4;
  margin:0 35px;

`
const WrapModal = styled.div`
  position:fixed;
  width:100%;height:100%;
  z-index:2;left:0;top:0;
`
const ModalBg = styled.div`
  position:fixed;
  width:100%;height:100%;left:0;top:0;
  display:block;content:'';background:rgba(0,0,0,0.05);
  z-index:2;
`
const Wraplive = styled.div`
  position:absolute;z-index:3;
  width:535px;height:520px;
  background:#fff;
  border-radius:24px;
  border:1px solid #f2f2f2;
  left:50%;top:50%;transform:translate(-50%,-50%);
  padding:49px 49px 77px 63px;
  @media ${(props) => props.theme.container} {
        width:calc(100vw*(535/1436));
        height:calc(100vw*(520/1436));
    }

  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(395/428));
      height:auto;
      padding:calc(100vw*(24/428)) calc(100vw*(20/428)) calc(100vw*(50/428));
    }
`
const ModalClose = styled.div`
  width:100%;
  text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.container} {
        margin-bottom:calc(100vw*(22/1436));
    }

  @media ${(props) => props.theme.mobile} {
      margin-bottom:calc(100vw*(25/428));
    }
`
const CloseImg = styled.img`
  display:inline-block;
  width:15px;height:16px;
  @media ${(props) => props.theme.container} {
        width:calc(100vw*(15/1436));
        height:calc(100vw*(16/1436));
    }

  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(12/428));
      height:calc(100vw*(13/428));
    }
`
const LiveModalTop = styled.div`
  width:100%;padding-bottom:20px;
  border-bottom:1px solid #a3a3a3;
  @media ${(props) => props.theme.container} {
      padding-bottom:calc(100vw*(20/1436));
    }

  @media ${(props) => props.theme.mobile} {
      padding-bottom:calc(100vw*(15/428));
    }
`
const LiveTitle = styled.div`
  font-size:20px;
  font-weight:800;
  color:#707070;
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(20/1436));
    }

  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }
`
const ModalBody = styled.div`
  width:100%;
  padding-top:11px;
  @media ${(props) => props.theme.container} {
      padding-top:calc(100vw*(11/1436));
    }

  @media ${(props) => props.theme.mobile} {
      padding-top:calc(100vw*(14/428));
    }
`
const Box = styled.div`
  width:100%;
  margin-bottom:14px;
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.container} {
      margin-bottom:calc(100vw*(14/1436));
    }

  @media ${(props) => props.theme.mobile} {
      margin-bottom:calc(100vw*(15/428));
    }
`
const BoxTitle = styled.p`
  font-size:12px;color:#4a4a4a;
  margin-bottom:9px;
  padding-left:7px;
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(12/1436));
      margin-bottom:calc(100vw*(9/1436));
      padding-left:calc(100vw*(7/1436));
    }

  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(12/428));
      margin-bottom:calc(100vw*(9/428));
      padding-left:calc(100vw*(7/428));
    }
`
const InputText = styled.input`
  font-size:15px;color:#979797;
  transform:skew(-0.1deg);
  text-align:center;
  width:100%;
  height:43px;
  line-height:43px;
  border:1px solid #e4e4e4;
  &::placeholder{font-size:15px;color:#979797;}
  @media ${(props) => props.theme.container} {
      font-size:calc(100vw*(15/1436));
      height:calc(100vw*(43/1436));
      line-height:calc(100vw*(43/1436));
      &::placeholder{font-size:calc(100vw*(15/1436));}
    }

  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(14/428));
      height:calc(100vw*(43/428));
      line-height:calc(100vw*(43/428));
      &::placeholder{font-size:calc(100vw*(14/428));}
    }
`
const Checkbox = styled.div`
  margin:30px 0;
  text-align:center;
  @media ${(props) => props.theme.container} {
      margin:calc(100vw*(30/1436)) 0;
    }
  @media ${(props) => props.theme.mobile} {
      margin:calc(100vw*(25/428)) 0;
    }

`

