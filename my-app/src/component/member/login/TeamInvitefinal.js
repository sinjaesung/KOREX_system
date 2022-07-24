//react
import React ,{useState, useEffect} from 'react';
import {Link,useHistory} from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

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
import Checked from "../../../img/main/heart_check.png";
import Check from "../../../img/main/heart.png";
import Profile from "../../../img/map/profile_img.png";
import sideMapMarker from "../../../img/map/sideMapMarker.png";

// components
import { Mobile, PC } from "../../../MediaQuery";

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';

//server
import serverController from '../../../server/serverController';

export default function PreviewPage({request_mem_id,auth_info}) {
    const history=useHistory();
    console.log('Teaminvitefinal match parsmss:',request_mem_id,auth_info);

    
  const [slideUp, setSlideUp] = useState(false);
  const [slideUp2, setSlideUp2] = useState(false);
  const [slideUp3, setSlideUp3] = useState(false);
  const [slideUp4, setSlideUp4] = useState(false);
  const [slideUp5, setSlideUp5] = useState(false);
  const [slideUp6, setSlideUp6] = useState(false);
  
  var invite_memid= auth_info.split(',')[0];
  invite_memid = invite_memid.split(":")[1];
  var invite_companyid= auth_info.split(',')[1];
  invite_companyid = invite_companyid.split(":")[1];
  var invite_mem_phone= auth_info.split(',')[2];
  invite_mem_phone = invite_mem_phone.split(":")[1];
  var invite_mem_usertype= auth_info.split(',')[3];
  invite_mem_usertype = invite_mem_usertype.split(":")[1];
  var receiver_phone= auth_info.split(',')[4];
  receiver_phone = receiver_phone.split(":")[1];

        return (
        <Container>
        <TopTitle>
            <TextBox>팀원초대</TextBox>
        </TopTitle>
        <WrapDetail>
            <TopDetailImg>
                <SwiperBennerWrap className="detail_swiper">
                    <Swiper
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
                    </Swiper>
                </SwiperBennerWrap>
            </TopDetailImg>
            
            <BottomButtons>
              <ButtonGray type="button" onClick={()=>{
                history.push('/');
              }}>참여거절</ButtonGray>
              <ButtonGreen type="button" onClick={async ()=>{
                  //참여수락시에 authinfo등과 의 같은 요청필요하다.
                  let body_info = {
                      phone : receiver_phone,//이건 필요없음.
                      company_id : invite_companyid,//초대자의 소속(피초대자가 소속되게될 )
                      invite_memid_val : invite_memid,//초대자의 memid
                      request_mem_id_val : request_mem_id,//피초대자 가입하려는 사람.memid
                  };
                  console.log('compammemer invite sttaus process body:',JSON.stringify(body_info));
                  let result = await serverController.connectFetchController('/api/auth/team/companymember_invite_statusProcess','POST',JSON.stringify(body_info));
                  if(result){
                      console.log('resultsss::',result);

                      if(result.success){
                          alert('팀원으로 추가되었습니다!');
                          history.push('/');
                      }else{

                      }
                  }
              }}>참여수락</ButtonGreen> 
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