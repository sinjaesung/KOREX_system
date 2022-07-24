//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//img
import Arrow from "../../img/map/filter_next.png";
import Detail from "../../img/map/detail_img.png";
import Trade from "../../img/map/trade.png";
import Report from "../../img/map/report.png";
import ChangeM from "../../img/map/change_m.png";
import Change from "../../img/member/change.png";
import Call from "../../img/map/call.png";
import Chat from "../../img/map/chat.png";
import Exit from "../../img/main/exit.png";
import Checked from "../../img/main/heart_check.png";
import Check from "../../img/main/heart.png";
import Profile from "../../img/map/profile_img.png";
import sideMapMarker from "../../img/map/sideMapMarker.png";

// components
import { Mobile, PC } from "../../MediaQuery";

import localStringData from '../../const/localStringData';

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';

import KakaoMapSide from '../map/map/KakaoMapSide';

SwiperCore.use([Navigation, Pagination]);

export default function PreviewPage({updateReserveModal,reportModal,rejectModal,confirmModal,maemulinfo,buildinginfo,complexinfo}) {
  const [slideUp, setSlideUp] = useState(false);
  const [slideUp2, setSlideUp2] = useState(false);
  const [slideUp3, setSlideUp3] = useState(false);
  const [slideUp4, setSlideUp4] = useState(false);
  const [slideUp5, setSlideUp5] = useState(false);
  const [slideUp6, setSlideUp6] = useState(false);
  const [imgs, setimgs] = useState([])


  useEffect(() => {
    setimgs(maemulinfo.prd_imgs ? maemulinfo.prd_imgs.split(',') : [])
    }, [])

  // console.log('이것 확인', maemulinfo.prd_imgs.split(','));

        return (
        <Container>
        <TopTitle>
            <TextBox>미리보기</TextBox>
        </TopTitle>
        <WrapDetail>
            <TopDetailImg>
                <SwiperBennerWrap className="detail_swiper">
                    {/* <Swiper
                        slidesPerView={1}
                        loop={false}
                        autoplay={false}
                        navigation={{ clickable: true }}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}
                    >
                    <SwiperSlide>
                        <DetailImg>
                        <Img src={Detail}/>
                        </DetailImg>
                    </SwiperSlide>
                    <SwiperSlide>
                        <DetailImg>
                        <Img src={Detail}/>
                        </DetailImg>
                    </SwiperSlide>
                    </Swiper> */}

                  {/* {maemulinfo.prd_imgs.split(',').map((value , index)=>{
                      console.log('654654',value);
                      return(
                        <SwiperSlide>
                          <DetailImg>
                            <Img src={localStringData.imagePath + value}/>
                          </DetailImg>
                        </SwiperSlide>
                      )
                    })} */}

                  <Swiper
                    slidesPerView={1}
                    loop={false}
                    autoplay={true}
                    navigation={{ clickable: true }}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log('테스트테스트테스트___', swiper)}
                  >
                    {
                      imgs.map((item, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <DetailImg>
                              <Img src={localStringData.imagePath + item} />
                            </DetailImg>
                          </SwiperSlide>
                        )
                      })
                    }
                  </Swiper>



                </SwiperBennerWrap>
            </TopDetailImg>
            {/*물건투어예약 , 실거래, 허위매물 신고 버튼*/}
            <TopButtons>
                <Button onClick={updateReserveModal}>
                <Link className="data_link"/>
                <IconImg src={Exit}/>
                <ButtonTitle>물건투어예약</ButtonTitle>
                </Button>
                <Button>
                <Link className="data_link"/>
                <IconImg src={Trade}/>
                <ButtonTitle>실거래</ButtonTitle>
                </Button>
                <Button>
                <Link onClick={()=>{reportModal();}} className="data_link"/>
                <IconImg src={Report}/>
                <ButtonTitle>허위매물신고</ButtonTitle>
                </Button>
            </TopButtons>

            <TopMainInfoBox>
                <LikeBox>
                <CheckBox type="checkbox" name="" id="Like"/>
                <CheckLabel for="Like"/>
                </LikeBox>
                <Number>등록번호 {maemulinfo.prd_id}</Number>

                {
                  maemulinfo.exclusive_status==1?
                  <ExclusiveBox>
                    <Green>전속</Green>
                    <WrapDate>
                        <StartDate>{maemulinfo.exclusive_start_date}</StartDate>
                        <Line>~</Line>
                        <EndDate>{maemulinfo.exclusive_end_date}</EndDate>
                    </WrapDate>
                  </ExclusiveBox>
                  :
                  null
                }
                
                <ItemInfo>
                  <Name>
                      <Kind>{maemulinfo.prd_type}</Kind>
                    <Address>{maemulinfo.prd_name}</Address>
                  </Name>
                    <Kind>{maemulinfo.addr_jibun}</Kind>
                    <Kind>{maemulinfo.addr_road}</Kind>
                  <Price>{maemulinfo.prd_sel_type} {maemulinfo.prd_price}{/*전세 12억 5,000*/}</Price>
                  <Desc>{maemulinfo.prd_description}</Desc>
                </ItemInfo>
            </TopMainInfoBox>
        <WrapAllInfos>
            {/*물건*/}
            <WrapItemInfo>
                <TitleBox onClick={()=>{setSlideUp(!slideUp)}}>
                <Title>물건</Title>
                <ArrowImg src={Arrow}/>
                </TitleBox>
                {
                slideUp ?
                <ItemInfoList>
                    <Li>
                    <SubTitle>해당층/총층</SubTitle>
                          <SubDesc>{maemulinfo.floorint}/{maemulinfo.grd_floor}</SubDesc>
                    </Li>
                    <Li>
                    <SubTitle>공급/전용면적</SubTitle>
                    <SubDesc>{/*60/52.89m²*/}{maemulinfo.supply_area}/{maemulinfo.exclusive_area}m²
                    <Link>
                        <ChangeMImg src={ChangeM}/>
                    </Link>
                    </SubDesc>
                    </Li>
                    <Li>
                    <SubTitle>방/욕실 수</SubTitle>
                    <SubDesc>{maemulinfo.room_count}/{maemulinfo.bathroom_count}</SubDesc>
                    </Li>
                    <Li>
                    <SubTitle>방향</SubTitle>
                    <SubDesc>{maemulinfo.direction}</SubDesc>
                    </Li>
                    <Li>
                    <SubTitle>현관구조</SubTitle>
                    <SubDesc>{maemulinfo.entrance}</SubDesc>
                    </Li>
                    <Li>
                    <SubTitle>{maemulinfo.heat_fuel_type}</SubTitle>
                    <SubDesc>{maemulinfo.heat_method_type}</SubDesc>
                    </Li>
                </ItemInfoList>
                :
                null
                }

                

                {/* <ToggleOpenClose onClick={()=>{setSlideUp(!slideUp)}}>
                    {
                     slideUp ?
                     <Text>접기</Text>  
                     :
                     <Text>더보기</Text>  
                    }
                    
                </ToggleOpenClose> */}
            </WrapItemInfo>
        {/*거래*/}
            <WrapTradeInfo>
                <TitleBox  onClick={()=>{setSlideUp2(!slideUp2)}}>
                <Title>거래</Title>
                <ArrowImg src={Arrow}/>
                </TitleBox>
                {
                    slideUp2?
                    <ItemInfoList>
                        <Li>
                            <SubTitle>관리비</SubTitle>
                            <SubDesc>{maemulinfo.managecost}</SubDesc>
                        </Li>
                        <Li>
                            <SubTitle>관리비 포함</SubTitle>
                            <SubDesc>{maemulinfo.include_managecost}</SubDesc>
                        </Li>
                        <Li>
                            <SubTitle>입주가능일</SubTitle>
                            <SubDesc>{maemulinfo.ibju_specifydate} </SubDesc>
                        </Li>
                        <Li>
                            <SubTitle>계약갱신청구권행사여부 확인</SubTitle>
                            <SubDesc>{maemulinfo.is_contract_renewal==1?'확인':'미확인'}</SubDesc>
                        </Li>
                        <Li>
                            <SubTitle>융자금</SubTitle>
                            <SubDesc>{maemulinfo.loanprice}</SubDesc>
                        </Li>
                        <Li>
                            <SubTitle>기보증금/월세</SubTitle>
                          <SubDesc>{maemulinfo.existed_deposit}/{maemulinfo.existed_month_price}</SubDesc>
                        </Li>
                    </ItemInfoList>
                    :
                    null

                }
                {/* {
                    slideUp2 ?
                    <ToggleOpenClose onClick={()=>{setSlideUp2(!slideUp2)}}>
                        <Text>접기</Text>
                    </ToggleOpenClose>
                    :
                    <ToggleOpenClose onClick={()=>{setSlideUp2(!slideUp2)}}>
                        <Text>더보기</Text>
                    </ToggleOpenClose>

                } */}
                
            </WrapTradeInfo>

            {/*옵션*/}
                <WrapOptionInfo>
                <TitleBox onClick={()=>{setSlideUp3(!slideUp3)}}>
                    <Title>옵션</Title>
                    <ArrowImg src={Arrow}/>
                </TitleBox>
                {
                    slideUp3?
                    <ItemInfoList>
                        <Li>
                        <SubTitle>공간</SubTitle>
                        <SubDesc>{maemulinfo.space_option}<br/>{maemulinfo.apartspace_option}</SubDesc>
                        </Li>
                    </ItemInfoList>
                    :
                    null
                }
                  {/* {
                    slideUp3 ?
                      <ToggleOpenClose onClick={() => { setSlideUp3(!slideUp3) }}>
                        <Text>접기</Text>
                      </ToggleOpenClose>
                      :
                      <ToggleOpenClose onClick={() => { setSlideUp3(!slideUp3) }}>
                        <Text>더보기</Text>
                      </ToggleOpenClose>
                  } */}
                
                </WrapOptionInfo>

            {/*매물설명*/}
                <WrapOptionInfo>
                <TitleBox onClick={()=>{setSlideUp4(!slideUp4);}}>
                    <Title>매물설명</Title>
                    <ArrowImg src={Arrow}/>
                </TitleBox>
                {
                    slideUp4 ?
                    <ItemInfoList>
                    <Li>
                    <TextArea>
                    {/*[ 위 치 / 교통 ]  <br/><br/>
                    ㅇ 논현동 서울세관 블럭에 위치한 신축 2룸입니다<br/><br/>
                    ㅇ 7호선 강남구청역 <br/><br/>
                    [ 인테리어/특징 ]  <br/><br/>
                    ㅇ 건물외관부터 내부관리상태 A급으로 유지중입니다^_^<br/><br/>
                    ㅇ 고급마감재사용 및 옵션으로 고풍스러운 실내분위기연출<br/><br/>
                    ㅇ 채광이 좋아 밝고 화사한 분위기로 아주 세련된 투룸입니다<br/><br/>
                    ㅇ 2룸구조에 침실과 드레스룸으로 꾸며져 있어 수납이 정말 좋습
                    니다<br/><br/>*/}
                    {maemulinfo.prd_description_detail}
                    </TextArea>
                    </Li>
                </ItemInfoList>
                :
                null
                }
                {/* {
                    slideUp4 ?
                    <ToggleOpenClose onClick={()=>{setSlideUp4(!slideUp4)}}>
                        <Text>접기</Text>
                    </ToggleOpenClose>
                    :
                    <ToggleOpenClose onClick={()=>{setSlideUp4(!slideUp4)}}>
                        <Text>더보기</Text>
                    </ToggleOpenClose>
                } */}
                
                </WrapOptionInfo>

            {/*단지&건물*/}
            {/* 사무실상가의 경우 도로명주소 입력받고 그에 그 지번주소,도로명주소에 해당하는 floor row list를 리턴하며, 각 floor가 의미하는것은 임의의특정건물의 하나의 층을 의미하고 여기서 선택한 층이 어떠한 건물정보를 어떤건물인지(정보가 필요할수있는데),각 클릭 floor가 어떤건물인지를 bld_pk,bld_id등으로 조회하려고했으나 상가사무실의 경우 bld_id가 비어있거나,bld_pk는 임의더미값으로 되어있는등 어떤건물인지 정보 확인불가. */}
                <WrapTradeInfo>
                 {
                 maemulinfo.prd_type == '아파트' || maemulinfo.prd_type == '오피스텔'?
                 <>
                 <TitleBox onClick={()=>{setSlideUp5(!slideUp5)}}>
                    <Title>단지/건물</Title>
                    <ArrowImg src={Arrow}/>
                 </TitleBox>
                  {
                      slideUp5 ?
                      <ItemInfoList>
                          <Li>
                          <SubTitle>사용승인일</SubTitle>
                          <SubDesc>{complexinfo.approval_date} </SubDesc>
                          </Li>
                          <Li>
                          <SubTitle>총세대수</SubTitle>
                          <SubDesc>{complexinfo.household_cnt}</SubDesc>
                          </Li>
                          <Li>
                          <SubTitle>총주차대수</SubTitle>
                          <SubDesc>{/*21대 /  세대당 0.55대 협의주차*/}{complexinfo.total_parking_cnt}</SubDesc>
                          </Li>
                      </ItemInfoList>
                      :
                      null
                  }
                  </>
                  :
                  null
                } 
                
                </WrapTradeInfo>
            {/*위치*/}
                <WrapTradeInfo>
                <TitleBox onClick={()=>{setSlideUp6(!slideUp6)}}>
                    <Title>위치</Title>
                    <ArrowImg src={Arrow}/>
                </TitleBox>
                {
                    slideUp6 ?
                    <Wrap>
                        <ItemInfoList>
                            <Li>
                            <MapAddress>{maemulinfo.addr_road}</MapAddress>
                            <ChangeAddress>
                                <ChangeImg src={Change}/>
                                <ChangeTxt>도로명</ChangeTxt>
                            </ChangeAddress>
                            </Li>
                        </ItemInfoList>
                        <MapArea>
                          <KakaoMapSide cutomImg={sideMapMarker} centerLat={maemulinfo.prd_latitude} centerLng={maemulinfo.prd_longitude} markerLat={maemulinfo.prd_latitude} markerLng={maemulinfo.prd_longitude}/>
                        </MapArea>
                    </Wrap>
                    :
                    null
                }
                
                </WrapTradeInfo>
            </WrapAllInfos>
      {/* //05.28 주석처리 전문중개사 정보  */}
            {/* <BrokerInfo>
                <TopBox>
                <Tag>아파트·현대아이리스</Tag>
                <Tag>상가</Tag>
                <Tag>사무실</Tag>
                </TopBox>
                <MiddleBox>
                <LeftContent>
                    <BrokerInfoDetail>
                    <BrokerName>럭키 공인중개사</BrokerName>
                    <BrokerAddress>강남구 논현동 104-5</BrokerAddress>
                    <SellList>
                        <List>매매 <ColorOrange>2</ColorOrange></List>
                        <Part/>
                        <List>전세 <ColorOrange>7</ColorOrange></List>
                        <Part/>
                        <List>월세 <ColorOrange>9</ColorOrange></List>
                    </SellList>
                    </BrokerInfoDetail>
                </LeftContent>
                <RightContent>
                    <ItemImg src={Profile}/>
                </RightContent>
                </MiddleBox>
                <BottomBox>
                <ToCall>
                    <Link className="data_link"/>
                    <BottomImg src={Call}/>
                    <BottomTxt>전화 상담</BottomTxt>
                </ToCall>
                <LongPart/>
                <ToChat>
                    <Link className="data_link"/>
                    <BottomImg src={Chat}/>
                    <BottomTxt>채팅 상담</BottomTxt>
                </ToChat>
                </BottomBox>
            </BrokerInfo> */}

            <BottomButtons>
              <ButtonGray type="button" onClick={()=>{
                rejectModal();
                
              }}>거절</ButtonGray>
              <ButtonGreen type="button" onClick={()=>{
                confirmModal();

              }}>거래 개시</ButtonGreen> 
            </BottomButtons>
            
          </WrapDetail>
        </Container>
  );
}

const Container = styled.div `
  width:100%;
`
const WrapDetail = styled.div`
    width:490px;margin:0 auto;
    padding-bottom:100px;
@media ${(props) => props.theme.mobile} {
    width:100%;
    padding-bottom:calc(100vw*(100/428));
  }
`
const TopDetailImg = styled.div`
  width:100%;
`
const TopTitle = styled.div`
    width:100%;
    background:#f8f7f7;
    height:68px;
    text-align:center;
    @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(60/428));
  }
`
const TextBox = styled.div`
    font-size: 20px;
    line-height: 68px;
    color: #4a4a4a;
    font-weight: 700;
    text-align:center;
    transform: skew(-0.1deg);
 @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(16/428));
    line-height:calc(100vw*(60/428));
  }
`
const Wrap = styled.div`
`
const SwiperBennerWrap = styled.div`
  width:100%;
`
const DetailImg = styled.div`
  width:100%;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(428/428));
    object-fit:cover;
  }
`
const Img = styled.img`
  width:100%;
  object-fit:cover;
`
const TopButtons = styled.div`
  width:100%;
  margin:18px auto;
  display:flex;justify-content:center;align-items:center;
  @media ${(props) => props.theme.mobile} {
    margin:calc(100vw*(16/428)) auto;
  }
`
const Button = styled.div`
  position:relative;
  display:flex;justify-content:center;align-items:center;
  border:1px solid #e4e4e4;
  text-align:center;
  padding:17.5px 12.5px;
  margin-right:5px;
  &:last-child{margin-right:0;}
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(17.5/428)) calc(100vw*(15/428));
    margin-right:calc(100vw*(5/428));
  }
`
const IconImg = styled.img`
  display:inline-block;
  width:20px;height:20px;
  margin-right:6px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));height: calc(100vw*(20/428));
    margin-right:calc(100vw*(5/428));
  }
`
const ButtonTitle = styled.p`
  font-size:13px;color:#707070;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
  }
`

const TopMainInfoBox = styled.div`
  position:relative;
  width:100%;
  margin:0 auto;
  border-top:1px solid #f2f2f2;
  padding:20px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(383/428));
    padding:calc(100vw*(20/428)) 0 calc(100vw*(20/428)) calc(100vw*(13/428));
  }
`
const LikeBox = styled.div`
  position:absolute;
  right:20px;top:15px;
  @media ${(props) => props.theme.mobile} {
    right:0;top:calc(100vw*(15/428));
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
  background:url(${Check}) no-repeat center center;background-size:26px 25px;
  @media ${(props) => props.theme.mobile} {
    background-size:calc(100vw*(22/428)) calc(100vw*(20/428));
    width:calc(100vw*(40/428));height:calc(100vw*(40/428));
  }

`
const Number = styled.p`
  font-size:12px;color:#707070;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
  }
`
const ExclusiveBox = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:175px;
  height:25px;
  padding: 6px 15px;
  border: solid 1px #2b664d;
  margin:8px 0 12px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(163/428));
    height:calc(100vw*(25/428));
    padding:calc(100vw*(6/428)) calc(100vw*(10/428));
  }
`
const Green = styled.div`
  font-size:12px;color:#2b664d;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(11/428));
  }
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
const ItemInfo = styled.div`

`
const Name = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  margin-bottom:10px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(7/428));
  }
`
const Kind = styled(StartDate)`
`
const Address = styled.div`
  font-size:21px;font-weight:800;
  transform:skew(-0.1deg);
  color:#2b664d;margin-left:8px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(21/428));
    margin-left:calc(100vw*(8/428));
  }

`
const Price = styled.div`
font-size:26px;font-weight:800;
transform:skew(-0.1deg);
color:#4a4a4a;
@media ${(props) => props.theme.mobile} {
  font-size:calc(100vw*(26/428));
}
`
const Desc = styled.div`
  border-top:1px solid #f2f2f2;
  margin-top:20px;
  padding-top:22px;
  font-size:15px;color:#707070;font-weight:600;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(25/428));
    padding-top:calc(100vw*(22/428));
    font-size:calc(100vw*(15/428));
  }
`
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
  padding:20px 30px;
  display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid #f2f2f2;border-bottom:1px solid #f2f2f2;
  cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(20/428)) calc(100vw*(30/428));
  }
`
const Title = styled.h3`
  font-size:20px;color:#4a4a4a;font-weight:800;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(20/428));
  }
`
const ArrowImg = styled.img`
  width:10px;
  transform:rotate(270deg);
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(10/428));
  }
`
const ItemInfoList = styled.ul`
  width:100%;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(383/428));
  }
`
const Li = styled.li`
  width:100%;display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;
  padding:15px 20px;
  border-bottom:1px solid #f2f2f2;
  &:last-child{border-bottom:none;}
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(15/428)) calc(100vw*(10/428));
  }
`
const SubTitle = styled.p`
  font-size:15px; color:#898989;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const SubDesc = styled(SubTitle)`
  color:#4a4a4a;
`
const ToggleOpenClose = styled.div`
  width:100%;
  padding:16px 0;
  background:#fbfbfb;
  text-align:center;
  cursor:pointer;
  border-top:1px solid #f2f2f2;
  border-bottom:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(16/428)) 0;
  }
`
const Text = styled.p`
  font-size:15px;color:#707070;
  font-weight:600;transform:skew(-0.1deg);

  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`

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
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const MapAddress = styled.div`
  font-size:15px;color:#4a4a4a;font-weight:600;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const ChangeAddress = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  cursor:pointer;
`
const ChangeImg = styled.img`
  display:inline-block;
  width:13px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(13/428));
  }
`
const ChangeMImg = styled.img`
  width:20px;margin-left:10px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    margin-left:calc(100vw*(10/428));
  }
`
const ChangeTxt = styled.p`
  font-size:10px;font-weight:800;transform:skew(-0.1deg);
  color:#979797;margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(10/428));
    margin-left:calc(100vw*(5/428));
  }
`

//  kakao map wrap
const MapArea = styled.div`
  width:100%;height:315px;
  background:#eee;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(312/428));
  }
`
const BrokerInfo = styled.div`
  width:100%;padding:0 16px;
  margin-top:43px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(40/428));
    padding:0 calc(100vw*(16/428));
  }
`
const TopBox = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  flex-wrap:wrap;
  width:100%;
  margin-bottom:14px;
  padding-left:30px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(14/428));
    padding-left:calc(100vw*(20/428));
  }
`
const Tag = styled.div`
  border-radius: 15px;
  border: solid 1px #e4e4e4;
  background-color: #f8f7f7;
  height:30px;
  padding:7px 16px;
  margin-right:5px;
  font-size:15px;color:#01684b;
  font-weight:600;transform:skew(-0.1deg);
  text-align:center;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(30/428));
    padding:calc(100vw*(6/428)) calc(100vw*(10/428));
    font-size:calc(100vw*(15/428));margin-right:calc(100vw*(5/428));
  }
`
const MiddleBox = styled.div`
  padding:0 30px;
  display:flex;justify-content:space-between;align-items:center;
  @media ${(props) => props.theme.mobile} {
    padding:0 calc(100vw*(20/428));
  }
`
const LeftContent = styled.div`
`
const BrokerInfoDetail = styled.div`
`
const BrokerName = styled.div`
  font-size:25px;font-weight:800;transform:skew(-0.1deg);
  color:#4a4a4a;
  margin-bottom:13px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(25/428));
    margin-bottom:calc(100vw*(13/428));
  }
`
const BrokerAddress = styled.div`
  display:inline-block;
  font-size:15px;color:#4a4a4a;
  font-weight:700;transform:skew(-0.1deg);
  margin-bottom:13px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(13/428));
  }
`

const ColorOrange = styled.span`
  display:inline-block;
  font-size:15px;color:#fe7a01;
  vertical-align:middle;
  margin-left:3px;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-left:calc(100vw*(3/428));
  }
`
const SellList = styled.div`
  width:100%;display:flex;
  justify-content:flex-start;align-items:center;
`
const List = styled(ColorOrange)`
  color:#4a4a4a;
  margin-right:7px;
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(7/428));
  }
`
const Part = styled.div`
  display:inline-block;
  width:1px;height:12px;
  background:#4a4a4a;
  margin-right:7px;
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(7/428));
    height:calc(100vw*(10/428));
  }
`

const RightContent = styled.div`
  position:relative;
  width:95px;height:95px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(95/428));
    height:calc(100vw*(95/428));;
  }
`
const ItemImg = styled.img`
  width:100%;height:100%;
  border-radius:100%;
`
const BottomBox = styled.div`
  display:flex;justify-content:center;align-items:center;
  width:100%;
  height: 84px;
  margin:60px 0 30px;
  border-radius: 20px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 3px #efefef;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(84/428));
    margin:calc(100vw*(60/428)) 0 calc(100vw*(30/428));
  }
`
const ToCall = styled.div`
  position:relative;
  display:flex;justify-content:flex-start;align-items:center;
`
const BottomImg = styled.img`
  width:20px;height:20px;
  display:inline-block;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    height:calc(100vw*(20/428));
  }
`
const BottomTxt = styled.p`
  font-size:18px;font-weight:600;
  transform:skew(-0.1deg);margin-left:10px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(18/428));
    margin-left:calc(100vw*(10/428));
  }
`
const ToChat = styled(ToCall)`
`
const LongPart = styled.p`
  width:1px;height:30px;background:#979797;
  margin:0 50px;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(30/428));
    margin:0 calc(100vw*(20/428));
  }
`
const BottomButtons = styled.div`
  width:100%;margin-top:45px;
  display:flex;justify-content:center;
  align-items:center;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(45/428));
  }
`
const ButtonGray = styled.button`
  width:200px;height:66px;
  line-height:60px;
  border:3px solid #e4e4e4;
  background:#979797;
  border-radius:11px;
  font-size: 20px;
  font-weight: 800;
  margin-right:8px;
  transform:skew(-0.1deg);
  text-align: center;
  color: #ffffff;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(200/428));
    height:calc(100vw*(60/428));
    font-size:calc(100vw*(18/428));
    line-height:calc(100vw*(54/428));
    margin-right:calc(100vw*(8/428));
  }
`
const ButtonGreen = styled(ButtonGray)`
  border:3px solid #04966d;
  background:#01684b;
  margin-right:0;

`