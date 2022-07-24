//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import Sstyled from "styled-components"

//material-ui
import { styled } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

//img
import Item from '../../../../../img/main/item01.png';
import Check from '../../../../../img/map/radio.png';
import Checked from '../../../../../img/map/radio_chk.png';

//지도 모달

//server process
import serverController from '../../../../../server/serverController';

import {useSelector} from 'react-redux';

export default function ModalSelect({setTridchklist,setPrdidvalue,setReservationItemlist,select,setSelect,offModal}) {
  const login_userinfo = useSelector(data => data.login_user);
  const [propertylist,setPropertylist] = useState([]);

  const PropertyListItem =[
    {
      p_id : 0,
      img:Item,
      date:"21.00.00 - 21.00.00",
      conditiontype:"사용자 의뢰",
      condition:"거래 개시",
      startdate:"2021.00.00",
      enddate:"2021.00.00",
      number:"2D0000324",
      title:"충남내포신도시2차대방엘리움더센트럴",
      kinds:"아파트",
      itemname:"충남내포신도시2차대방엘리움더센트럴 7층 707호",
      trade:"매매",
      username:"홍길동",
      price:"1억 5,000",
      person:"3"
    },
    {
      p_id : 1,
      img:Item,
      date:"21.00.00 - 21.00.00",
      conditiontype:"외부 수임",
      condition:"거래 개시",
      startdate:"2021.00.00",
      enddate:"2021.00.00",
      number:"2D0000324",
      title:"충남내포신도시2차대방엘리움더센트럴",
      kinds:"아파트",
      itemname:"충남내포신도시2차대방엘리움더센트럴 7층 707호",
      trade:"매매",
      username:"홍길동",
      price:"1억 5,000",
      person:"3"
    }
  ]
  
  //로드 시점 한번만 실행, 어떤 변화state감지하지 않겠다. 변화에 반응하지 않겠다.
  useEffect(async () => {
    if(login_userinfo.is_login){
      let body_info={
        memid: login_userinfo.memid,
        company_id: login_userinfo.company_id,
        user_type:login_userinfo.user_type,
        isexculsive:login_userinfo.isexculsive
      };
      console.log('JSONBDOY INFO TEST:',JSON.stringify(body_info));

      let res=await serverController.connectFetchController('/api/broker/brokerproduct_list_view2','POST',JSON.stringify(body_info));

      if(res){
        console.log('-=>>>>>>res result:',res);
        
        setPropertylist(res.result_data);
      }
    }
  },[]);

    return (
        <Container>
          <WrapModalSelect>

          <MUFormGroup>
            <FormControlLabel control={<Checkbox defaultChecked onClick={() => { setSelect(false); }}/>} label="전체" />
          </MUFormGroup>




            {/* <WrapTop>
              <InputCheck type="radio" name="tour" id="allcheck" defaultChecked/>
              <CheckLabel for="allcheck" onClick={()=>{setSelect(false);}}>
                <Span/>
                전체
              </CheckLabel>
            </WrapTop> */}


            <WrapList>
            {
            propertylist.map((value) => {
              var broker_name;
              var product_info=value['info'][0];
              //console.log('productinfoi:',product_info,product_info['request_man_name']);

              broker_name= product_info['request_man_name'];

              const type=()=>{
                if(product_info.product_create_origin == "중개의뢰" || product_info['product_create_origin']==1) { //검토대기
                  
                  return "#fe7a01"
                }else if(product_info.product_create_origin == "외부수임" || product_info['product_create_origin']==2) {//거래준비
                  return "#01684b"
                }
              }

              return(
                <Li>
                <WrapRight>
                  
                  <CheckBox>
                    {/* <InputCheckEa type="radio" name="tour" value={product_info.prd_identity_id} id={"easelect"+product_info.prd_identity_id} onChange={ async (e)=>{ */}
                      <Checkbox type="radio" name="tour" value={product_info.prd_identity_id} id={"easelect"+product_info.prd_identity_id} onChange={ async (e)=>{
                      setSelect(true);//이것을 하면 state상태가 바뀌기기에 상위 콤퍼넌트의 state가 바뀌기에 랜더링한다.useEffect가 없어도 한다. 이건 기본적 시스템리액트상에서하는것이다.
                      //클릭한 매물의 id값을 여기서 서버에 요청해서 해당 아디에 해당하는 투어예약셋팅,투어예약셋팅에 관련된 예약신청리스트 state재갱신하여 useEffect처리.
                      console.log('클릭한 체크박스(라벨체크될때)::',e,e.target.value,e.target.checked);               
                      
                      if(e.target.checked){
                        let check_prd_identity_id=e.target.value;

                        let body_info={
                          prd_identity_id : check_prd_identity_id
                        };
                        console.log('JSON_BODY INFO::',JSON.stringify(body_info));

                        let res=await serverController.connectFetchController('/api/broker/brokerproduct_reservationList_perProduct','POST',JSON.stringify(body_info));

                        if(res){
                          console.log('-=>>>>>>res result:',res);
                          
                          //setPropertylist(res.result_data);
                          setReservationItemlist(res.result_data);
                          setPrdidvalue(check_prd_identity_id);//원래는 매물의 등록번호(prd_identity_id dislay대용) 갱신한다.
                        }
                      }
                    }}/>
                    {/* <CheckLabelEa for={"easelect"+product_info.prd_identity_id}/> */}
                  </CheckBox>


                </WrapRight>
                <WrapLeft>
                  <Top>
                    <TopLeft>
                      <TopCondition> {product_info.product_create_origin}  상태 :<Color color={type}>{product_info.prd_status}</Color></TopCondition>
                      <JunsokBox>
                        <Green>전속</Green>
                        <Date>{product_info.prd_exculsive_start_date} ~{product_info.prd_exculsive_end_date}</Date>
                      </JunsokBox>
                    </TopLeft>
                    <TopRight>
                      <Img src={Item}/>
                    </TopRight>
                  </Top>
                  <Bottom>
                    <BottomRight>
                      <Number>등록번호 : {product_info.prd_identity_id}</Number>
                      <Title>{product_info.prd_name}</Title>
                      <FlexBox>
                        <Left>물건종류</Left>
                        <Right>{product_info.prd_type}</Right>
                      </FlexBox>
                      <FlexBox>
                        <Left>건물명</Left>
                        <Right>{product_info.prd_name}</Right>
                      </FlexBox>
                      <FlexBox>
                        <Left>거래유형</Left>
                        <Right>{product_info.prd_sel_type}</Right>
                      </FlexBox>
                      <FlexBox>
                        <Left>거래금액</Left>
                        <Right>{product_info.prd_price}</Right>
                      </FlexBox>
                      <FlexBox>
                        <Left>물건투어 예약</Left>
                        <Right>{value['reservcnt_per_prd']}명</Right>
                      </FlexBox>
                      <FlexBox>
                        <Left>의뢰인명</Left>
                        <Right>{broker_name}</Right>
                      </FlexBox>
                    </BottomRight>
                  </Bottom>
                </WrapLeft>
              </Li>
              )
            })
          }
            </WrapList>
          </WrapModalSelect>
        </Container>
  );
}

const MUFormGroup = styled(FormGroup)`
  border-bottom:1px solid #e4e4e4;
`

const Pb = Sstyled.b`
  display:block;
  @media ${(props) => props.theme.modal} {
        display:inline;
    }
`
const Mb = Sstyled.b`
  display:inline;
  @media ${(props) => props.theme.modal} {
        display:block;
    }
`
const Container = Sstyled.div`
    width:100%;
`

const WrapModalSelect = Sstyled.div`
  width:100%;
`
const WrapTop = Sstyled.div`
  width:100%;
  padding-bottom:10px;
  border-bottom:1px solid #e4e4e4;
  @media ${(props) => props.theme.modal} {
      padding-bottom:calc(100vw*(10/428));
    }
`
const InputCheck = Sstyled.input`
  display:none;
  &:checked+label span{background:url(${Checked}) no-repeat;background-size:100% 100%}
`
const InputCheckEa = Sstyled(InputCheck)`
  &:checked+label{background:url(${Checked}) no-repeat;background-size:100% 100%}
`
const CheckLabel = Sstyled.label`
  display:inline-block;
  font-size:15px;color:#707070;transform:skew(-0.1deg);
  vertical-align:middle; font-weight:600;
  @media ${(props) => props.theme.modal} {
      font-size:calc(100vw*(15/428));
    }
`
const Span = Sstyled.span`
   display:inline-block;
   width:20px;height:20px;
   margin-right:15px;
   background:url(${Check}) no-repeat; background-size:100% 100%;
   vertical-align:middle; 
   @media ${(props) => props.theme.modal} {
      width:calc(100vw*(20/428));
      height:calc(100vw*(20/428));
      margin-right:calc(100vw*(15/428));
    }
`
const WrapList = Sstyled.ul`
  margin-top:10px;
  width:100%;
  height:320px;overflow-y:scroll;
  @media ${(props) => props.theme.modal} {
      height:calc(100vw*(310/428));
      margin-top:calc(100vw*(10/428));
    }
`
const Li = Sstyled.li`
  width:100%;padding:25px 0;
  display:flex;justify-content:space-between;align-items:center;
  border-bottom:1px solid #f2f2f2;
  &:last-child{border-bottom:none;}
  
`
const WrapRight = Sstyled.div`
  margin-right:20px;
  @media ${(props) => props.theme.modal} {
      margin-right:calc(100vw*(15/428));
    }
`
const CheckBox = Sstyled.div`
`
const CheckLabelEa = Sstyled.label`
  display:inline-block;
  width:20px;height:20px;
  background:url(${Check}) no-repeat;background-size:100% 100%;
  @media ${(props) => props.theme.modal} {
      width:calc(100vw*(20/428));
      height:calc(100vw*(20/428));
    }
`
const WrapLeft = Sstyled.div`
  width:360px;
  @media ${(props) => props.theme.modal} {
      width:calc(100vw*(320/428));
    }
`
const Top = Sstyled.div`
  width:100%;
  display:flex;justify-content:space-between;align-items:flex-start;
`
const TopLeft = Sstyled.div`

`
const TopCondition = Sstyled.h3`
  font-size:15px;color:#4a4a4a;transform:skew(-0.1deg);
  font-weight:800;
  @media ${(props) => props.theme.modal} {
      font-size:calc(100vw*(15/428));
    }
`
const Color = Sstyled.span`
  font-size:15px;
  vertical-align:middle;
  color:${({color}) => color};
  @media ${(props) => props.theme.modal} {
      font-size:calc(100vw*(15/428));
    }
`
const JunsokBox = Sstyled.div`
    width:200px;height:25px;
    border:1px solid #2b664d;
    text-align:center;margin-top:10px;
    display:flex;justify-content:center;align-items:center;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(190/428));
    height:calc(100vw*(25/428));
    margin-top:calc(100vw*(8/428));
  }
`
const Green = Sstyled.p`
  font-size:12px;color:#01684b;
  transform:skew(-0.1deg);
  margin-right:8px;font-weight:600;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(12/428));
    margin-right:calc(100vw*(8/428));
  }
`
const Date = Sstyled(Green)`
  color:#707070;margin-right:0;
`
const TopRight = Sstyled.div`
  width:80px;height:80px;
  border-radius:3px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(80/428));height:calc(100vw*(80/428));
  }
`
const Img = Sstyled.img`
  width:100%;height:100%;
  object-fit:cover;
`
const Bottom = Sstyled.div`
  width:100%;
`
const BottomRight = Sstyled.div`
`
const Number = Sstyled.p`
  font-size:12px; color:#707070;font-weight:600;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(12/428));
  }
`
const Title = Sstyled.h3`
  font-size:18px; color:#4a4a4a;font-weight:800;
  transform:skew(-0.1deg);
  margin:8px 0;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(18/428));
    margin:calc(100vw*(8/428)) 0 calc(100vw*(12/428));
  }
`
const FlexBox = Sstyled.div`
  display:flex;justify-content:space-between;align-items:flex-start;
  margin-bottom:6px;
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(6/428));
  }
`
const Left = Sstyled.p`
  font-size:15px; color:#4a4a4a;font-weight:600;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
  }
`
const Right = Sstyled(Left)`
  color:#979797;
  text-align:right;
  width:250px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(220/428));
  }
`