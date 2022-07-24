//react
import React ,{useState, useEffect} from 'react';
import {Link,useHistory} from "react-router-dom";

//css
import styled from "styled-components";

//img

import Set from '../../../../img/member/setting.png';

import { Mobile, PC } from "../../../../MediaQuery"

//serverController
import serverController from '../../../../server/serverController';

export default function Tour({value,istouractive,modifyBasic,modifySpecial}) {
  //console.log('propertyoutSettinglist:: toursettinglist',istouractive);
  const history=useHistory();
  
  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const showModal =()=>{
    setMenu(!menu);
  }
  
  // console.log('========tour리스트 물건투어예약세팅요소:======',value);
  
  if(value.tour_type == 1){
    var tour_type=1;
    var tour_yoilsetdays= value.yoil_set_days.length>0 && value.yoil_set_days ? value.yoil_set_days.join(',') : '';//문자열 병합
    var tour_settimes= value.set_times.length >0 && value.set_times ? value.set_times.join(',') : '';
    var key = value.key !='' ? value.key : '';
  }else{
    var tour_type=2;
    var tour_set_specifydate= value.set_specifydate !='' && value.set_specifydate ? value.set_specifydate : '';
    var tour_set_specifydate_times = value.set_specifydatetimes !='' ? value.set_specifydatetimes : '';
    var tour_specifyday_except = value.tour_specifyday_except != '' ? value.tour_specifyday_except : '';
    var key = value.key !='' ? value.key : '';
  }
  
    return (
        <Container>
          {
            istouractive ?
            <TourList>
              <TourInfo>
                <Title>{ tour_type == 1 ? '일반' : '특별'}</Title>
                
                { tour_type == 1 ?
                <WrapDateTime>                
                    {
                     tour_yoilsetdays != null && tour_yoilsetdays !='' && tour_type==1 ?
                      <Date> 
                      {
                    tour_yoilsetdays.split(',').map((n,index) => {
                      // console.log('tour set days index:',n);
                      switch(n){
                        case 'sun':
                          n='일';
                        break;

                        case 'mon':
                          n='월';
                        break;

                        case 'tue':
                          n='화';
                        break;

                        case 'wed':
                          n='수';
                        break;
                        case 'thr':
                          n='목';
                          break;
                        case 'fri':
                          n='금';
                          break;
                        case 'sat':
                          n='토';
                          break;
                      }
                      return (<DateEa>{n}</DateEa>)
                      })
                    }
                    </Date>
                    :
                      null
                    }                
                  <Part/>
                  {  tour_settimes != null && tour_settimes !='' && tour_type ==1?
                  <Time>
                    {
                      tour_settimes.split(',').map((n,index) => {
                        // console.log('tour set times index:',n);

                        return (<TimeEa>{n}</TimeEa>)
                      })
                    }
                  </Time>
                  :
                  null
                  }
                  </WrapDateTime>
                  :
                  null
                }
                
              {tour_type == 2 ?
                <WrapDateTime>
                  {
                    tour_set_specifydate != null && tour_set_specifydate !='' && tour_type ==2 ?
                    <Date>
                      <DateEa>{tour_set_specifydate}</DateEa>  
                    </Date>
                    :
                    null
                  }
                  <Part/>
                  {tour_set_specifydate_times != null && tour_set_specifydate_times !='' && tour_type ==2 && tour_specifyday_except==0 ?
                  <Time>
                    {
                      tour_set_specifydate_times.split(',').map((n,index) => {
                        // console.log('tour set times index:',n);

                        return (<TimeEa>{n}</TimeEa>)
                      })
                    }
                  </Time>
                  :
                  null
                  }
                  {
                    tour_set_specifydate_times != null && tour_set_specifydate_times !='' && tour_type ==2 && tour_specifyday_except==1 ?
                  <Time>                
                        <TimeEa>제외</TimeEa>          
                  </Time>
                  :
                  null
                  }
                </WrapDateTime>  
                :
                null
                }
              </TourInfo>
              <TourSetting onClick={()=> {setMenu(!menu)}}>
                  <Setting src={Set} alt="setting"/>
                  {
                    menu ?
                    <InMenu>
                      <Div onClick={() => {
                        //alert(key);
                        if(tour_type==1){
                          modifyBasic(key);
                        }else{
                          modifySpecial(key);
                        }
                      }}>
                        <Link className="data_link"></Link>
                        <InDiv>수정</InDiv>
                      </Div>
                      <Div onClick={ async () => {
                         //alert(key);
                         if(window.confirm('삭제하시겠습니까??')){
                          if(tour_type==1){
                            //해당 선택한 일반 추가셋팅목록에 대해서 groupid 모두 삭제되게.
                            let body_info = {
                              tour_type_val : tour_type,
                              key_value : key//해당 키에 대해서(groupid관련된것 삭제)
                            }
                            let toursetting_delete= await serverController.connectFetchController('/api/broker/productToursetting_delete','POST',JSON.stringify(body_info));

                            if(toursetting_delete){
                              console.log('toursetting deltesss:',toursetting_delete);

                              if(toursetting_delete.success){
                                alert('삭제되었습니다.');
                                history.push('/PropertyManagement');
                              }else{
                                alert(toursetting_delete.message);
                              }
                            }
                          }else{
                            //해당 선택한 삭제tourid요소에 대한 tour,tourdetail등 삭제되게
                            let body_info = {
                              tour_type_val : tour_type,
                              key_value : key//해당 tourid
                            }
                            let toursetting_delete = await serverController.connectFetchController('/api/broker/productToursetting_delete','POST',JSON.stringify(body_info));

                            if(toursetting_delete){
                              console.log('toursetting deletesss:',toursetting_delete);

                              if(toursetting_delete.success){
                                alert('삭제되었습니다.');
                                history.push('/PropertyManagement');
                              }else{
                                alert(toursetting_delete.message);
                              }
                            }
                          }
                         }                        
                      }}>
                        <Link className="data_link"></Link>
                        <InDiv>삭제</InDiv>
                      </Div>
                    </InMenu>
                    :
                    null
                  }
              </TourSetting>
            </TourList>
            :
            <TourList style={{opacity:0.5}}>
              <TourInfo>
                <Title>{ tour_type == 1 ? '일반' : '특별'}</Title>
                
                { tour_type == 1 ?
                <WrapDateTime>                
                    {
                     tour_yoilsetdays != null && tour_yoilsetdays !='' && tour_type==1 ?
                      <Date> 
                      {
                    tour_yoilsetdays.split(',').map((n,index) => {
                      // console.log('tour set days index:',n);
                      switch(n){
                        case 'sun':
                          n='일';
                        break;

                        case 'mon':
                          n='월';
                        break;

                        case 'tue':
                          n='화';
                        break;

                        case 'wed':
                          n='수';
                        break;
                        case 'thr':
                          n='목';
                          break;
                        case 'fri':
                          n='금';
                          break;
                        case 'sat':
                          n='토';
                          break;
                      }
                      return (<DateEa>{n}</DateEa>)
                      })
                    }
                    </Date>
                    :
                      null
                    }                
                  <Part/>
                  {  tour_settimes != null && tour_settimes !='' && tour_type ==1?
                  <Time>
                    {
                      tour_settimes.split(',').map((n,index) => {
                        // console.log('tour set times index:',n);

                        return (<TimeEa>{n}</TimeEa>)
                      })
                    }
                  </Time>
                  :
                  null
                  }
                  </WrapDateTime>
                  :
                  null
                }
                
              {tour_type == 2 ?
                <WrapDateTime>
                  {
                    tour_set_specifydate != null && tour_set_specifydate !='' && tour_type ==2 ?
                    <Date>
                      <DateEa>{tour_set_specifydate}</DateEa>  
                    </Date>
                    :
                    null
                  }
                  <Part/>
                  {tour_set_specifydate_times != null && tour_set_specifydate_times !='' && tour_type ==2 && tour_specifyday_except==0 ?
                  <Time>
                    {
                      tour_set_specifydate_times.split(',').map((n,index) => {
                        // console.log('tour set times index:',n);

                        return (<TimeEa>{n}</TimeEa>)
                      })
                    }
                  </Time>
                  :
                  null
                  }
                  {
                    tour_set_specifydate_times != null && tour_set_specifydate_times !='' && tour_type ==2 && tour_specifyday_except==1 ?
                  <Time>                
                        <TimeEa>제외</TimeEa>          
                  </Time>
                  :
                  null
                  }
                </WrapDateTime>  
                :
                null
                }
              </TourInfo>
              <TourSetting onClick={()=> {setMenu(!menu)}}>
                  <Setting src={Set} alt="setting"/>
                  {
                    menu ?
                    <InMenu>
                      <Div>
                        <Link className="data_link"></Link>
                        <InDiv>수정</InDiv>
                      </Div>
                      <Div>
                        <Link className="data_link"></Link>
                        <InDiv>삭제</InDiv>
                      </Div>
                    </InMenu>
                    :
                    null
                  }
              </TourSetting>
            </TourList>
          }
            
  </Container>
  );
}
const Container = styled.div`
`
const TourList = styled.div`
  width:100%;position:relative;
  display:flex;justify-content:flex-start;align-items:center;
  padding:38px 57px;
  border-bottom:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(20/428)) 0 calc(100vw*(34/428)) calc(100vw*(30/428));
  }
`

const TourInfo = styled.div`
`
const Title = styled.h2`
  font-size:18px;
  font-weight:800;transform:skew(-0.1deg);
  width:100%;margin-bottom:20px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(18/428));
    margin-bottom:calc(100vw*(25/428));
  }
`
const WrapDateTime = styled.div`
  width:100%;
  display:flex;justify-content:flex-start;align-items:center;
`
const Date = styled.div`
    display:flex;justify-content:flex-start;align-items:center;
`
const DateEa = styled.p`
  font-size:15px;font-weight:600;transform:skew(-0.1deg);
  margin-right:10px;
  &:last-child{margin-right:0;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-right:calc(100vw*(10/428));
  }
`
const Part = styled.div`
  width:1px;height:15px;margin:0 25px;background:#707070;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(15/428));
    margin:0 calc(100vw*(25/428));
  }
`
const Time = styled(Date)`
`
const TimeEa = styled(DateEa)`
`

const Grade = styled.p`
  font-size:15px; color:#979797;
  font-weight:600;transform:skew(-0.1deg);
  margin-bottom:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(5/428));
  }
`
const TourSetting = styled.div`
  position:absolute;
  display:flex;align-items:center;justify-content:center;
  width:36px;height:36px;right:57px;
  top:38px;text-align:center;border:1px solid #979797;
  border-radius:5px;cursor:pointer;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(31/428));
    height:calc(100vw*(31/428));
    top:calc(100vw*(22/428));
    right:calc(100vw*(22/428));
  }
`
const Setting = styled.img`
  display:inline-block;width:20px;height:20px;
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(18/428));
    height:calc(100vw*(18/428));
  }
`

const InMenu = styled.ul`
  position:absolute;
  top:0;left:44px;
  width:60px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(35/428));
    left:calc(100vw*(0/428));
    width:calc(100vw*(60/428));
  }

`
const Div = styled.li`
  position:relative;
  font-size:13px;
  transform:skew(-0.1deg);
  border-radius:8px;
  padding:4px 0 4px 0px;
  transition:all 0.3s;
  &:hover{background:#f8f7f7;}
  &:first-child{padding-top:8px;}
  &:last-child{padding-bottom:8px;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    padding:calc(100vw*(4/428)) 0 calc(100vw*(4/428)) calc(100vw*(0/428));
    &:first-child{padding-top:calc(100vw*(8/428));}
    &:last-child{padding-bottom:calc(100vw*(8/428));}
  }
`
const InDiv = styled.div`
  width:100%;height:100%;
`
