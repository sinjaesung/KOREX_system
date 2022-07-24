//react
import React ,{useState, useEffect} from 'react';
import {Link,useHistory} from "react-router-dom";


//css
import Sstyled from "styled-components"

//material-ui
import { styled } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

//img
import Filter from '../../../../img/member/filter.png';
import Bell from '../../../../img/member/bell.png';
import BellActive from '../../../../img/member/bell_active.png';
import Location from '../../../../img/member/loca.png';
import Set from '../../../../img/member/setting.png';
import Item from '../../../../img/main/item01.png';
import Noimg from '../../../../img/main/main_icon3.png';
import Close from '../../../../img/main/modal_close.png';
import Change from '../../../../img/member/change.png';
import Marker from '../../../../img/member/marker.png';
import ArrowDown from '../../../../img/member/arrow_down.png';

import { Mobile, PC } from "../../../../MediaQuery"

import localStringData from "../../../../const/localStringData";

//server process
import serverController from '../../../../server/serverController';

import {useSelector} from 'react-redux';

export default function Request({map,setMap,filter,setFilter,reserve,setReserve,value,match_td_info,match_product_info,time_distance,time_status,color,opacity,cond,updateMapModal,updateReserveModal,alramsetting_tiny,setalramsetting_tiny,setListData}) {

  //material-ui
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const login_user=useSelector(data => data.login_user);

  const history=useHistory();
  //... 눌렀을때(메뉴)
  const [menu,setMenu] = useState(false);
  const [alarm,setAlarm] = useState(value.tr_alarm == 0 ? true : false);

  const showModal =()=>{  
    console.log('showModal클릭 메뉴모달::내물건투어예약');
    setMenu(!menu);
  }

  // 수정 버튼
  const onClickModify = (tr_id,prd_identity_id,company_id) => {
    setReserve(true);
    if(prd_identity_id){
      updateReserveModal(tr_id,prd_identity_id,company_id);
    }
  }

  if(time_status=='mirae'){
    var message = '+'+time_distance+'일후';
  }else if(time_status =='today'){
    var message = '오늘';
  }else if(time_status =='passed'){
    var message='마감';
  }

  if(cond!='' && value.tr_status==1){
    var message='예약해제';
  }else if(cond!='' && value.tr_status==2){
    var message='예약취소';
  }

  const tourreserv_alramcheck_toggle_change= async(e) => {
    console.log('체크알림요소 prdidineitiytid값::',e.target.value);

    if(e.target.checked){
      let body_info = {
        mem_id : login_user.memid,
        action : 'insert',
        tr_id : e.target.value,
        company_id:login_user.company_id,
        user_type:login_user.user_type
      }
      let res= await serverController.connectFetchController('/api/alram/alramSetting_process_tourreserv','POST',JSON.stringify(body_info));
      if(res){
        if(res.success){
          console.log('res resultsss:',res.result);
          setalramsetting_tiny(res.result);
        }else{
          alert(res.message);
        }
      }
    }else{
      let body_info = {
        mem_id : login_user.memid,
        action : 'delete',
        tr_id : e.target.value,
        company_id:login_user.company_id,
        user_type:login_user.user_type
      }
      let res=await serverController.connectFetchController('/api/alram/alramSetting_process_tourreserv','POST',JSON.stringify(body_info));
      if(res){
        if(res.success){
          console.log('res resultsss:',res.result);
          setalramsetting_tiny(res.result);
        }else{
          alert(res.message);
        }
      }
    }
  }
  console.log('여기 확인  ', match_product_info);

  return (
    <Container>
      <Li opacity={opacity}>
        <Img>
          <ItemImg src={match_product_info&&match_product_info.prd_imgs?localStringData.imagePath+match_product_info.prd_imgs.split(',')[0]:Noimg} alt="img"/>
          {/*상품이미지가 없을경우*/}
          {/* <ItemImg src={Noimg} alt="img"/> */}
        </Img>

        <Infos>
          {/* <Condition>상태:{message}<Orange color={color}>({value.tour_reservDate})</Orange>tr_id:{value.tr_id}</Condition> */}
          <Condition>상태:{message}<Orange color={color}>({value.reserv_start_time&&value.reserv_start_time.substring(0, 16)})</Orange></Condition>
          <Number>등록번호 {value ? value.tr_id : ""} {value.tr_name} ({match_product_info?match_product_info.prd_identity_id:''})</Number>
          <Address>
            <div className="cursor-p" onClick={() => {updateMapModal(match_product_info);}}>
              <AddressTitle>{match_product_info ? match_product_info.addressroad : "" }</AddressTitle>
            </div>
          </Address>
          <DateTime>
            <Date></Date>
            <Time>{value.reserv_start_time&&value.reserv_start_time}~{value.reserv_end_time&&value.reserv_end_time}</Time>
          </DateTime>
        </Infos>
        <RightMenu>
          <Alarm>  
            <AlarmCheck type="checkbox" name="" value={value.tr_id} checked={alramsetting_tiny['notiset_rsv_prd_reserve_part']&&alramsetting_tiny['notiset_rsv_prd_reserve_part'].indexOf(value.tr_id)!=-1?true:false} id={'alram'+value.tr_id} onChange={tourreserv_alramcheck_toggle_change}/>
            <Label for={'alram'+value.tr_id}/>
          </Alarm>


          <IconButton
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {
              value.tr_status == 0 && (message != '마감' && message != '예약해제' && message != '예약취소') ?
              <div>
                <MenuItem onClick={async () => {
                  if (window.confirm('취소하시겠습니까??')) {
                    let body_info = {
                      tr_id_val: value.tr_id//취소처리할.
                    }
                    let res = await serverController.connectFetchController('/api/broker/mybrokerproduct_tourReservcancle', 'POST', JSON.stringify(body_info));
                    if (res) {
                      if (res.success) {
                        let noti_info = {
                          prd_identity_id: match_product_info && match_product_info.prd_identity_id,//취소처리할 관련매물관련 접수
                          //request_memid : value.mem_id,
                          message: value.tr_name + '(' + value.tr_phone + ')' + value.tr_email + ' 님이' + match_product_info.prd_identity_id + '매물에 대한 신청하신 물건투어예약접수 취소하였습니다.',
                          company_id: match_product_info.company_id,//그걸 수임담당하고있는 전문중개사 소소게에게 보낸다.
                          noti_type: 8
                        }
                        let noti_res = await serverController.connectFetchController('/api/alram/notification_process', 'POST', JSON.stringify(noti_info));
                        if (noti_res) {
                          if (noti_res.success) {
                            alert('예약 취소되었습니다.');
                            setAnchorEl(null);
                            history.push('/Mypage');
                          } else {
                            alert(noti_res.message);
                            setAnchorEl(null);
                          }
                        }
                      } else {
                        alert(res.message);
                        setAnchorEl(null);
                      }
                    }
                  }

                }}>삭제</MenuItem>
                  <MenuItem className="cursor-p" onClick={() => { onClickModify(value.tr_id, match_product_info ? match_product_info.prd_identity_id : null, match_product_info ? match_product_info.company_id : null) }}>수정</MenuItem>
                </div>
              :
              <div>
                  <MenuItem className="cursor-p" onClick={async () => {
                    if (window.confirm("삭제하시겠습니까??")) {
                      let delete_info = {
                        tr_id: value.tr_id//삭제할 trid값 그냥 삭제한다.
                      }
                      let delete_process = await serverController.connectFetchController('/api/broker/mybrokerProduct_tourRservdelete', 'POST', JSON.stringify(delete_info));

                      if (delete_process) {
                        console.log('삭제 결과:', delete_process);

                        if (delete_process.success) {
                          alert('삭제되었습니다.');
                          //history.push('/Mypage');
                          setAnchorEl(null);
                          //setListData
                          let body_infos = {
                            company_id: login_user.company_id,
                            mem_id: login_user.memid,
                            user_type: login_user.user_type
                          };
                          let ress = await serverController.connectFetchController('/api/broker/brokerproduct_myreservationList', 'POST', JSON.stringify(body_infos));
                          if (ress) {
                            console.log('res resultsss:', ress);
                            if (ress.success) {
                              let list_item = ress.result_data;

                              setListData(list_item);
                            } else {
                              alert(ress.message);
                              setAnchorEl(null);
                            }
                          }
                        } else {
                          alert(delete_process.message);
                          setAnchorEl(null);
                        }
                      }
                    }

                  }}>삭제</MenuItem>


              </div>             

            }
            
          </Menu>




          
          
          {/* <NoMenu>
            <div className="cursor-p" onClick={showModal}>
              <MenuIcon/>
                {
                  menu ?
                    value.tr_status==0 && (message!='마감' && message!='예약해제' && message!='예약취소')?
                    <InMenu>
                      <Div>
                        <InDiv className="cursor-p" onClick={ async() => {
                          if(window.confirm('취소하시겠습니까??')){
                            let body_info = {
                              tr_id_val : value.tr_id//취소처리할.
                            }
                            let res = await serverController.connectFetchController('/api/broker/mybrokerproduct_tourReservcancle','POST',JSON.stringify(body_info));
                            if(res){
                              if(res.success){
                                let noti_info = {
                                  prd_identity_id : match_product_info&&match_product_info.prd_identity_id,//취소처리할 관련매물관련 접수
                                  //request_memid : value.mem_id,
                                  message: value.tr_name+'('+value.tr_phone+')'+value.tr_email+' 님이'+match_product_info.prd_identity_id+'매물에 대한 신청하신 물건투어예약접수 취소하였습니다.',
                                  company_id: match_product_info.company_id,//그걸 수임담당하고있는 전문중개사 소소게에게 보낸다.
                                  noti_type : 8
                                }
                                let noti_res = await serverController.connectFetchController('/api/alram/notification_process','POST',JSON.stringify(noti_info));
                                if(noti_res){
                                  if(noti_res.success){
                                    alert('예약 취소되었습니다.');

                                    history.push('/Mypage');
                                  }else{
                                    alert(noti_res.message);
                                  }
                                }
                              }else{
                                alert(res.message);
                              }
                            }
                          }
                           
                        }}>예약취소</InDiv>
                      </Div>
                      <Div>
                        <InDiv className="cursor-p" onClick={()=>{onClickModify(value.tr_id,match_product_info?match_product_info.prd_identity_id:null,match_product_info?match_product_info.company_id:null)}}>수정</InDiv>
                      </Div>
                        
                    </InMenu>
                    :
                    <InMenu>
                      <Div>
                        <InDiv className="cursor-p" onClick={ async() => {
                          if(window.confirm("삭제하시겠습니까??")){
                            let delete_info={
                              tr_id:value.tr_id//삭제할 trid값 그냥 삭제한다.
                            }
                            let delete_process=await serverController.connectFetchController('/api/broker/mybrokerProduct_tourRservdelete','POST',JSON.stringify(delete_info));
 
                            if(delete_process){
                              console.log('삭제 결과:',delete_process);

                              if(delete_process.success){
                                alert('삭제되었습니다.');
                                //history.push('/Mypage');

                                //setListData
                                let body_infos={
                                  company_id : login_user.company_id,
                                  mem_id : login_user.memid,
                                  user_type : login_user.user_type
                                };
                                let ress=await serverController.connectFetchController('/api/broker/brokerproduct_myreservationList','POST',JSON.stringify(body_infos));
                                if(ress){
                                  console.log('res resultsss:',ress);
                                  if(ress.success){
                                    let list_item = ress.result_data;

                                    setListData(list_item);
                                  }else{
                                    alert(ress.message);
                                  }
                                }
                              }else{
                                alert(delete_process.message);
                              }
                            }
                          }
                           
                        }}>삭제
                       </InDiv>
                     </Div>
                    </InMenu>
                  :
                  null
                }
            </div>
          </NoMenu> */}




        </RightMenu>
      </Li>
    </Container>
  );
}

const Pb = Sstyled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = Sstyled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = Sstyled.div`

`
const Li = Sstyled.li`
  width:100%;
  position:relative;
  display:flex;justify-content:flex-start;align-items:center;
  padding:29px 24px 29px 20px;
  border-bottom:1px solid #f7f8f8;
  opacity:${({opacity}) => opacity};
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(29/428)) 0;
  }
`
const Img = Sstyled.div`
  width:106px;
  height:106px;
  margin-right:40px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(80/428));
    height:calc(100vw*(80/428));
    margin-right:calc(100vw*(18/428));
  }
`
const ItemImg = Sstyled.img`
  width:100%;
  height:100%;border-radius:3px;
  border:1px solid #e4e4e4;
`
const Infos = Sstyled.div`
`
const Condition = Sstyled.h4`
  font-size:15px;color:#707070;font-weight:800;
  transform:skew(-0.1deg);
  margin-bottom:5px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
  }
`
const Orange = Sstyled(Condition)`
  color:${({color}) => color};
  display:inline-block;
  margin-left:5px;
  margin-bottom:0;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(5/428));
  }
`
const Green = Sstyled(Orange)`
  color:#01684b;
`
const Gray = Sstyled(Orange)`
  color:#707070;
  opacity:0.5;
`
const Number = Sstyled.p`
  font-size:14px;color:#979797;
  transform:skew(-0.1deg);
  margin-bottom:8px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
    margin-bottom:calc(100vw*(6/428));
  }
`
const Address = Sstyled.div`
  width:100%;
`
const AddressTitle = Sstyled.div`
  display:inline-block;
  font-size:18px;margin-bottom:8px;
  font-weight:800;color:#4a4a4a;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(6/428));
  }
`
const LocaImg = Sstyled.img`
  display:inline-block;width:20px;margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    margin-left:calc(100vw*(3/428));
  }
`
const DateTime = Sstyled.div`
  width:100%;
`
const Date = Sstyled.div`
  display:inline-block;
  font-weight:800;color:#4a4a4a;
  transform:skew(-0.1deg);
`
const Time = Sstyled(Date)`
  margin-left:5px;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(5/428));
  }
`
const RightMenu = Sstyled.div`
    position:absolute;
    right:0;
    top:50%;transform:translateY(-50%);
    @media ${(props) => props.theme.mobile} {
      top:calc(100vw*(20/428));
      transform:none;
      display:flex;justify-content:flex-start;
    }
`
const Alarm = Sstyled.div`
  margin-bottom:6px;position:relative;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:0;
    margin-right:calc(100vw*(5/428));
  }

`
const AlarmCheck = Sstyled.input`
  display:none;
  &:checked + label{background:url(${BellActive}) no-repeat center center; background-size:20px 20px}
  @media ${(props) => props.theme.mobile} {
    &:checked + label{background:url(${BellActive}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428))}
  }
`
const Label = Sstyled.label`
  display:inline-block;
  width:36px;height:36px;
  border-radius:5px;
  border:1px solid #e4e4e4;
  background:url(${Bell}) no-repeat center center; background-size:20px 20px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(31/428));
    height:calc(100vw*(31/428));
    background:url(${Bell}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428));
  }
`
const NoMenu = Sstyled(Alarm)`
  margin-bottom:0;
  @media ${(props) => props.theme.mobile} {
    margin-right:0;
  }
`
const MenuIcon = Sstyled.div`
  width:36px;height:36px;
  border-radius:5px;
  border:1px solid #e4e4e4;
  background:url(${Set}) no-repeat center center; background-size:20px 20px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(31/428));
    height:calc(100vw*(31/428));
    background:url(${Set}) no-repeat center center; background-size:calc(100vw*(20/428)) calc(100vw*(20/428));
  }
`
const Bg = Sstyled.div`
  position:fixed;width:100%;height:100%;
  background:rgba(0,0,0,0.2);left:0;top:0;
`
const InMenu = Sstyled.ul`
  position:absolute;
  top:46px;left:44px;
  width:112px;
  border:1px solid #707070;
  border-radius:8px;
  background:#fff;
  @media ${(props) => props.theme.mobile} {
    top:calc(100vw*(35/428));
    left:calc(100vw*(-10/428));
    width:calc(100vw*(80/428));
  }

`
const Div = Sstyled.li`
  position:relative;
  font-size:13px;
  transform:skew(-0.1deg);
  border-radius:8px;
  padding:4px 0 4px 17px;
  transition:all 0.3s;
  &:hover{background:#f8f7f7;}
  &:first-child{padding-top:8px;}
  &:last-child{padding-bottom:8px;}
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
    padding:calc(100vw*(4/428)) 0 calc(100vw*(4/428)) calc(100vw*(12/428));
    &:first-child{padding-top:calc(100vw*(8/428));}
    &:last-child{padding-bottom:calc(100vw*(8/428));}
  }
`
const InDiv = Sstyled.div`
  width:100%;height:100%;
`
