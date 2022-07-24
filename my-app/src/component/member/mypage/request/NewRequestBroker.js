//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col_input, } from '../../../../theme';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
// import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

//img
import Profile from "../../../../img/map/profile_img.png";
import Like from '../../../../img/member/like.png';
import Smile from '../../../../img/member/smile.png';
import OrangeStar from '../../../../img/member/star_orange.png';
import GreenStar from '../../../../img/member/star_green.png';
import WhiteStar from '../../../../img/member/star_white.png';
import RadioImg from '../../../../img/map/radi.png';
import RadioChkImg from '../../../../img/map/radi_chk.png';
import SearchImg from '../../../../img/map/search.png';
import Close from '../../../../img/main/modal_close.png';

//component
import NewRequestTopInfosouter from './NewRequestTopInfosouter';
import SearchStoreOfficeApi from './SearchStoreOfficeApi';
import ListItemCont_Broker_T1 from '../../../common/broker/listItemCont_Broker_T1';

import SearchAddrUnitsApi from '../../../../component/common/addrUnitSearchApi';

//reudx addons asssets;
import { useSelector } from 'react-redux';
import { tempBrokerRequestActions } from '../../../../store/actionCreators';

import serverController from '../../../../server/serverController';

//import BrokerRating from '../../../common/broker/BrokerRating';
import BrokerRating from '../../../common/broker/brokerRating';

export default function Request({ setFilter, value, type, probrokerlist, setProbrokerlist, allregistcount }) {
  const [broker, setBroker] = useState({});
  const [radion, setRadion] = useState(false);
  const [active, setActive] = useState(false);

  const [select_brokerid,setSelect_brokerid] = useState('');//더미용 으로 뜨는 or 추천되는 전문중개사리스트에서 선택한 id값 구함.

  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  
  const login_user_redux= useSelector(data=> data.login_user);
  var tempBrokerRequest = useSelector(data => data.tempBrokerRequest);

  console.log('newRequestBroker전문중개사선임리스트:', tempBrokerRequest, probrokerlist);
  const border = () => {
    if (radion == true) {
      return "solid 3px #04966d"
    } else {
      return "solid 3px #e4e4e4"
    }
  }
  const bg = () => {
    if (radion == true) {
      return "#01684b"
    } else {
      return "#979797"
    }
  }
  const selectbg = () => {
    if (radion == true) {
      return "#e4e4e4"
    } else {
      return "#fff"
    }
  }

  const BrokerListItem = [
    {
      b_id: 0,
      src: Profile,
      path: "/",
      tag1: "아파트·현대아이리스",
      tag2: "상가",
      tag3: "사무실",
      com_name: "럭키공인중개사",
      name: "홍길동",
      address: "강남구 논현동 104-5",
      sell1: "2",
      sell2: "7",
      sell3: "9"
    },
    {
      b_id: 9,
      src: Profile,
      path: "/",
      tag1: "아파트·현대아이리스",
      tag2: "상가",
      tag3: "사무실",
      com_name: "중개사물산테스티",
      name: "홍길동",
      address: "강남구 논현동 104-5",
      sell1: "2",
      sell2: "7",
      sell3: "9"
    },
  ]
  

  const nextStep = (e) => {
    if (radion) {
      //리덕스 저장.
      tempBrokerRequestActions.companyidchange({ companyids: select_brokerid });
      tempBrokerRequestActions.requestmemidchange({ requestmemids: login_user_redux.memid });
    } else {
      e.preventDefault();
    }
  };

  //상가 사무실로 넘어왔을때 상단 검색 부분 추가관련함수
  const where_display_addressApi = () => {
    console.log('where display addressAPI:', tempBrokerRequest);
    if (tempBrokerRequest.maemultype == '상가' || tempBrokerRequest.maemultype == '사무실') {
      return (
        <SearchBox>
          {/*<Search type="search" placeholder="물건 소재지 주소 검색"/>
        <SearchBtn type="button"/>*/}
          <SearchAddrUnitsApi setProbrokerlist={setProbrokerlist} />
        </SearchBox>

      );
    }
  }

  //전문중개사 소재지 기준 검색관련(읍면동 자동검색완성 )
  const [search_address, setSearch_address] = useState({});//검색api에 의한 액션에 의해서만 처리되는것(사용자 직접 능동입력형태x)


            const star = (icon, title, length, isOrange) => {
              let arr = [];
              let whiteLength = 0;
              let isWhite = false;
              let whiteArr = [];
              for (let i = 0; i < length; i++) { arr.push(i); }
              if (5 - length !== 0) {
                whiteLength = 5 - length;
                isWhite = true;
                for (let i = 0; i < whiteLength; i++) { whiteArr.push(i); }
              }

              return (
                <FlexBox>
                  <Left>
                    <Icon src={icon} alt='icon' />
                    <SubTitle>{title}</SubTitle>
                  </Left>
                  <RightStar>
                    {
                      arr.map((item, index) => {
                        return (
                          <Star key={index} src={isOrange ? OrangeStar : GreenStar} />
                        )
                      })
                    }
                    {
                      isWhite &&
                      whiteArr.map((item, index) => {
                        return (
                          <Star key={index} src={WhiteStar} />
                        )
                      })
                    }
                  </RightStar>
                </FlexBox>
              )
            }
       
  return (
    <>
      <Wrapper>
        <p className="tit-a2">전문중개사 선임</p>
        <Sect_R1></Sect_R1>
        <Sect_R2>
          
          {/* <ListItemCont_Broker_T1 broker={broker} />
          <ListItemCont_Broker_T1 broker={broker} />
          <ListItemCont_Broker_T1 broker={broker} /> */}

          {/*05.24 상가,사무실로 넘어왔을때 상단 검색 부분 추가*/}
          {
            where_display_addressApi()
          }

          {
            probrokerlist.map((value) => {
              let probroker = value.probroker_permission;
              let asign_transaction = value.asign_transaction;
            
              console.log('probrokerlistss probrtokerss:',probroker);

              let txn_status_structure = {
                'jeonse': [],
                'walse': [],
                'maemae': []
              };
              if (asign_transaction) {
                /*
                총등록건수: 코렉스시스템상 전체에서 각 업소별 등록건수(거래개시인건들)총합.거래개시인 product매물 전체항목
                업소별등록건수:밑의 쿼리에서 거래개시상태인항목들의 count값. 
                전문성지수 = 등록률(업소별 등록건수/총 등록건수)*등록가중치 + 성사율(업소별성사건수/업소별등록건수)*성사가중치
                if(총등록건수>100)등록가중치 = 0.5 , 등록가중치=0.3
                if(업소별등록건수>10) 성사가중치 0.5 , 성사가중치 0.3
                업소별등록건수,업소별성사건수,성사가중치 등은 프론트단에서 판단최종적으로 하고(데이터확인까지)
                총등록건수,등록가중치 등 정보는 서버에서 쿼리로 전달 알려줌
                */
                var all_regist_count = allregistcount;
                var probroker_per_regist_count = 0;
                var probroker_per_complete_count = 0;

                var regist_weight;
                var complete_weight;
                var professional_score;

                for (let ss = 0; ss < asign_transaction.length; ss++) {
                  let txn_status = asign_transaction[ss].transaction_status;
                  let productinfo = asign_transaction[ss].match_product;
              
                  //각 업소별.등록건수 (업소별 수임매물들 중 거래완료,거래개시인내역들)
                  if (txn_status == '거래개시') {
                    probroker_per_regist_count++;
                  }
                  if (txn_status == '거래완료') {
                    probroker_per_complete_count++;

                    switch (productinfo.prd_sel_type) {
                      case '월세':
                        txn_status_structure['walse'].push(productinfo);
                        break;

                      case '전세':
                        txn_status_structure['jeonse'].push(productinfo);
                        break;

                      case '매매':
                        txn_status_structure['maemae'].push(productinfo);
                        break;
                    }
                  }
                }
                var professional_score;
                var professional_scorevalue;
                if (all_regist_count > 100) {
                  regist_weight = 0.5;
                } else {
                  regist_weight = 0.3;
                }

                if (probroker_per_regist_count > 10) {
                  complete_weight = 0.5;
                } else {
                  complete_weight = 0.3;
                }
                professional_score = ((probroker_per_regist_count / all_regist_count) * regist_weight) + ((probroker_per_complete_count / probroker_per_regist_count) * complete_weight);
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
              //중개매너평가점수평균
              var probroker_mannerscore;
              if (value.probroker_mannerscore >= 1 && value.probroker_mannerscore < 2) {
                probroker_mannerscore = 1;
              } else if (value.probroker_mannerscore >= 2 && value.probroker_mannerscore < 3) {
                probroker_mannerscore = 2;
              } else if (value.probroker_mannerscore >= 3 && value.probroker_mannerscore < 4) {
                probroker_mannerscore = 3;
              } else if (value.probroker_mannerscore >= 4 && value.probroker_mannerscore < 5) {
                probroker_mannerscore = 4;
              } else if (value.probroker_mannerscore >= 5) {
                probroker_mannerscore = 5;
              }

              let broker_temp_data={
                pro_apt_id : probroker.pro_apt_id?probroker.apt_name:'',
                pro_oft_id : probroker.pro_oft_id?probroker.oft_name:'',
                is_pro_store: probroker.is_pro_store?probroker.is_pro_store:'',
                is_pro_office: probroker.is_pro_office?probroker.is_pro_office:'',
                profile:probroker.profile_img?probroker.profile_img:null,
                name : probroker.company_name?probroker.company_name:'',
                address:probroker.addr_road?probroker.addr_road:'',
                trade: txn_status_structure['maemae'].length,
                jeonse:txn_status_structure['jeonse'].length,
                walse: txn_status_structure['walse'].length,
                ceo_name : probroker.ceo_name?probroker.ceo_name:'',
                
              }
              return(
                <>
                {/*<NewRequestTopInfosouter item={probroker}/>*/}

                {/* 이 부분이 전문중개사를 맵핑하여 적용시킴 */}
                <WrapFlexBox>
                    <Radio
                      // checked={selectedValue }
                      onClick={(e) => {
                        setSelectedValue(e.target.value);
                        setRadion(true);
                        console.log('각 라디오 전문중개사 요소 클릭:', e.target.value);
                        setSelect_brokerid(e.target.value);//클릭한 전문중개사b_id 어떤 전문중개업소 company_id?를 택한건지?
                      }}
                      value={probroker && probroker.company_id}
                      name="radio-buttons"
                      inputProps={{ 'aria-label': 'A' }}
                    />

                  {/* <Radiobox>
                    <Radio type="radio" name="broker" id={"radio"+probroker&&probroker.company_id} value={probroker&&probroker.company_id} onClick={(e) =>{
                      setRadion(true);
                      console.log('각 라디오 전문중개사 요소 클릭:',e.target.value);
                      setSelect_brokerid(e.target.value);//클릭한 전문중개사b_id 어떤 전문중개업소 company_id?를 택한건지?
                    }}/>
                    <RadioLabel for={"radio"+probroker&&probroker.company_id}/>
                  </Radiobox> */}

                  <TopContent>
                      <ListItemCont_Broker_T1 broker={broker_temp_data} />
                    {/* <ProfileDetail> 
                        <TopBox>
                          <Tag>{probroker && probroker.pro_apt_id && '아파트 ' + probroker && probroker.apt_name}</Tag>
                          <Tag>{probroker && probroker.pro_oft_id && '오피스텔 ' + probroker && probroker.oft_name}</Tag>
                          {
                            probroker && probroker.is_pro_store ?
                              <Tag>상가</Tag>
                              :
                              null
                          }
                          {
                            probroker && probroker.is_pro_office ?
                              <Tag>사무실</Tag>
                              :
                              null
                          }
                        </TopBox>
                        <BottomBox>
                          <LeftContent>
                            <ItemInfo>
                              <ComName>{probroker && probroker.company_name}</ComName>
                              <Name>{probroker && probroker.ceo_name}</Name>
                              <Address>{probroker && probroker.addr_jibun}</Address>
                              <SellList>
                                <List>매매<ColorOrange>{txn_status_structure.maemae.length}</ColorOrange></List>
                                <Part />
                                <List>전세 <ColorOrange>{txn_status_structure.jeonse.length}</ColorOrange></List>
                                <Part />
                                <List>월세 <ColorOrange>{txn_status_structure.walse.length}</ColorOrange></List>
                              </SellList>
                            </ItemInfo>
                          </LeftContent>
                          <RightContent>
                            <ItemImg src={Profile} />
                          </RightContent>
                        </BottomBox>
                      </ProfileDetail> */}
                      
                      {/* <InfoDetail> */}
                        {/*
                      <FlexBox>
                        <Left>
                          <Icon src={Like} alt="icon"/>
                          <SubTitle>전문성</SubTitle>
                        </Left>
                        <RightStar>
                          <Star src={OrangeStar}/>
                          <Star src={OrangeStar}/>
                          <Star src={OrangeStar}/>
                          <Star src={OrangeStar}/>
                          <Star src={OrangeStar}/>
                        </RightStar>
                      </FlexBox>
                      <FlexBox>
                        <Left>
                          <Icon src={Smile} alt="icon"/>
                          <SubTitle>중개매너</SubTitle>
                        </Left>
                        <RightStar>
                          <Star src={GreenStar}/>
                          <Star src={GreenStar}/>
                          <Star src={GreenStar}/>
                          <Star src={GreenStar}/>
                          <Star src={WhiteStar}/>
                        </RightStar>
                      </FlexBox>
                      */}
                      <BrokerRating title={"전문성"} score={professional_scorevalue ? professional_scorevalue : 0} />
                      <BrokerRating title={"중개매너"} score={probroker_mannerscore ? probroker_mannerscore : 0} />
                        {/* {
                          star(Like, "전문성", professional_scorevalue ? professional_scorevalue : 0, true)
                        }
                        {
                          star(Smile, "중개매너", probroker_mannerscore ? probroker_mannerscore : 0, false)
                        }
                      </InfoDetail> */}
                    </TopContent>
                  </WrapFlexBox>
                </>
              )
            }
            )
          }
          {/*라디오 박스 선택됐을때 다음 버튼 활성화*/}
          {/* <NextButton>
              <Link to="/AddRequestBrokerSecond" onClick={nextStep}>
                <Next type="button"border={border} bg={bg}>다음</Next>
              </Link>
            </NextButton> */}
          <Sect_EndButton>
            <MUButton_Validation variant="contained" type="button" name="" active={""} onClick={nextStep}><Link to="/AddRequestBrokerSecond" className="data_link" />다음</MUButton_Validation>
          </Sect_EndButton>
        </Sect_R2>
      </Wrapper>
    </>
  );
}


const MUButton = styled(Button)``

const MUTextField = styled(TextField)`
      &.MuiFormControl-root.MuiTextField-root {
        margin:0.3125rem 0; 
  }
`
const MUTextField_100 = styled(MUTextField)`
      &.MuiFormControl-root.MuiTextField-root {
        width:100%;    
  }
`
const MUFormControl = styled(FormControl)`
     &.MuiFormControl-root {
      margin:0.3125rem 0; 
     }
`

const MUInput = MUstyled(Input)`
&.MuiInputBase-root.MuiInput-root:after {
  border-bottom: 2px solid ${(props) => props.theme.palette.primary.main};
}
`
const ExpandMore = styled(IconButton)`
&.MuiButtonBase-root.MuiIconButton-root{
  /* position: absolute;
  top:50%;right:8px; */
  transform: /*translateY(-50%)*/ ${({ expand }) => !expand ? 'rotate(0deg)' : 'rotate(180deg)'};
  //margin-left: auto;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 3ms;
}
`
//-----------------------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2`
  ${TtCon_Title}  
`
const Sect_R1 = styled.div`
  /* border-bottom:1px solid ${(props) => props.theme.palette.line.main}; */
`
const Sect_R2 = styled.div`
  ${TtCon_1col_input}
`
const Sect_R2_1 = styled.div`
  margin-bottom: 3rem;
`
const Title_Sub = styled.div`
  display:flex;align-items:center;
  /* @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(40/428));
    } */
`
const Sect_R2_1_1 = styled.div`
  width:90%;
  margin-left: auto;
`


//---------------------------------------------------------
const WrapFlexBox = styled.div`
  width:100%;margin:0 auto;display:flex;justify-content:space-between;align-items:center;
   @media ${(props) => props.theme.mobile} {
    width:100%;
    }
`
const Radiobox = styled.div`
  margin-right:20px;
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100%*(10/428));
    }
`
// const Radio = styled.input`
//   display:none;
//   &:checked+label{background:url(${RadioChkImg}) no-repeat; background-size:100% 100%;}
// `
const RadioLabel = styled.label`
display:inline-block;width:20px;height:20px;
background:url(${RadioImg}) no-repeat; background-size:100% 100%;
margin-right:8px;
@media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));height:calc(100vw*(20/428));
    margin-right:calc(100vw*(8/428));
    }
`
const TopContent = styled.div`
  position:relative;
  width:100%;
  padding:25px 0;
  border-bottom: 1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding:calc(100vw*(25/428)) 0;
  }
`
const ProfileDetail = styled.div`
  position:relative;
  width:100%;
  padding:0 40px;
  margin-bottom:24px;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    padding:0 calc(100vw*(10/428));
    margin-bottom:calc(100vw*(20/428));
  }
`
const TopBox = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  flex-wrap:wrap;
  width:100%;
  margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(15/428));
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
  margin-bottom:5px;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(30/428));
    padding:calc(100vw*(6/428)) calc(100vw*(10/428));
    margin-right:calc(100vw*(5/428));
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(5/428));
  }
`
const BottomBox = styled.div`
  display:flex;justify-content:space-between;align-items:center;
`
const LeftContent = styled.div`
`
const ItemInfo = styled.div`
`
const ComName = styled.h2`
  font-size:25px;font-weight:800;transform:skew(-0.1deg);
  color:#4a4a4a;
  margin-bottom:6px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(20/428));
    margin-bottom:calc(100vw*(9/428));
  }
`
const Name = styled.div`
  font-size:20px;
  font-weight:800;transform:skew(-0.1deg);
  color:#4a4a4a;margin-bottom:13px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(17/428));
    margin-bottom:calc(100vw*(13/428));
  }
`
const Address = styled.div`
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

const InfoDetail = styled.div`
  width:100%;
  padding:22px 0;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(20/428)) 0;
  }
`
const Icon = styled.img`
  display:inline-block;
  width:20px;margin-right:12px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    margin-right:calc(100vw*(12/428));
    }
`
const SubTitle = styled.p`
  font-size:15px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    
    font-size:calc(100vw*(14/428));
    }
`
const RightContent = styled.div`
  position:relative;
  width:95px;height:95px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(93/428));
    height:calc(100vw*(93/428));
  }
`
const ItemImg = styled.img`
  width:100%;height:100%;
  border-radius:100%;
`

const FlexBox = styled.div`
  display:flex;width:100%;
  justify-content:center;align-items:center;
  margin-bottom:25px;
  &:nth-child(3){margin-top:60px;}
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(25/428));
    &:nth-child(3){margin-top:calc(100vw*(40/428));}
    }
`
const Left = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(100/428));
    }
`
const Star = styled.img`
  display:inline-block;
  width:16px;
  margin-right:9px;
  &:last-child{margin-right:0;}
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(16/428));
    margin-right:calc(100vw*(9/428));
    }
`

const RightStar = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:184px;
  margin-left:40px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(184/428));
    }
`
const CallBox = styled.div`
  display:flex;justify-content:center;align-items:center;
  width:465px;
  height: 84px;
  padding:0 16px;
  margin:16px auto 0;
  border-radius: 20px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 3px #efefef;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(398/428));
    height:calc(100vw*(84/428));
    padding:0;
    margin:calc(100vw*(14/428)) auto 0;
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
  font-size:18px;font-weight:800;
  transform:skew(-0.1deg);margin-left:10px;
  color:#4a4a4a;
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
    margin:0 calc(100vw*(40/428));
  }
`
const NextButton = styled.div`
  width:100%;text-align:center;
  margin-top:70px;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(70/428));
    }
`
const Next = styled.button`
  display:inline-block;
  width:408px;
  height: 66px;
  line-height: 60px;
  font-size:20px;font-weight:800;color:#fff;
  transform:skew(-0.1deg);text-align:center;
  border-radius: 11px;
  transition:all 0.3s;
  border:${({ border }) => border};
  background:${({ bg }) => bg};
  @media ${(props) => props.theme.mobile} {
    width:100%;
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));font-size:calc(100vw*(15/428));
    }
`
const SearchBox = styled.div`
  position:relative;
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  height:43px;
  margin:15px 0;
  border-radius: 4px;
  background-color: #ffffff;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(43/428));
    margin:calc(100vw*(15/428)) 0;
  }
`
const Search = styled.input`
  display:inline-block;
  width:100%;
  height:100%;
  text-align:center;
  font-size:15px;transform:skew(-0.1deg);
  font-weight:600;
  color:#4a4a4a;background:transparent;
  &::placeholder{color:#979797;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const SearchBtn = styled.button`
  position:absolute;right:0;top:50%;transform:translateY(-50%);
  width:43px;height:43px;
  background:url(${SearchImg}) no-repeat center center;
  background-size:19px 18px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(43/428));
    height:calc(100vw*(43/428));
    background-size:calc(100vw*(19/428)) calc(100vw*(18/428));
  }
`

const CloseImg = styled.img`
  position:Absolute;top:20px;right:10px;
  width:18px;
  cursor:pointer;
  @media ${(props) => props.theme.mobile} {
      top:calc(100vw*(20/428));
      right:calc(100vw*(10/428));
      width:calc(100vw*(18/428));
    }
`


const Sect_EndButton = styled.div`
  margin: 1.25rem 0 2.5rem;
`
const MUButton_Validation = MUstyled(MUButton)`
  &.MuiButtonBase-root.MuiButton-root{
    background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
    color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
    box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"}; 
    width:100%;
  }
`