//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@mui/material/Button';

//img
import Filter from '../../../../../img/member/filter.png';
import Bell from '../../../../../img/member/bell.png';
import BellActive from '../../../../../img/member/bell_active.png';
import Location from '../../../../../img/member/loca.png';
import Set from '../../../../../img/member/setting.png';
import Item from '../../../../../img/main/item01.png';
import Noimg from '../../../../../img/main/main_icon3.png';
import Close from '../../../../../img/main/modal_close.png';
import Change from '../../../../../img/member/change.png';
import Marker from '../../../../../img/member/marker.png';
import ArrowDown from '../../../../../img/member/arrow_down.png';

//server process
import serverController from '../../../../../server/serverController';

import { temp_SelectComplexinfo } from '../../../../../store/actionCreators';
import { useSelector } from 'react-redux';


//필터 모달
export default function ModalDanjiSelect({ setModalDanji, setSelectInfo, select_complexid, modalDanji }) {
  console.log('넘어온 modaldaniselect요소에 넘어온값들:', setModalDanji, setSelectInfo, select_complexid);
  const [addrjibun, setAddrjibun] = useState('');
  const [addrRoad, setAddrRoad] = useState('');
  const [complexname, setComplexname] = useState('');



  const temp_selectcomplexinfor = useSelector(data => data.temp_selectComplexinfo);
  useEffect(async () => {
    console.log("여기 : " + modalDanji)
    //해당 넘어온 select_complexid에 대해서 정보 조회한다. 그 단지아디에 관련된 그 단지의 아디는 공용(그 단지관련된 건물들 하위 동 건물들)과 관련된것이ㅣ지 직접 그 bld_pk연계성은 없다. complexid에 해당하는 건물들 조회해야만하낟.
    let body_info = {
      complex_id: select_complexid
    };
    // let res_result= await serverController.connectFetchController('/api/matterial/complexdetail_search','POST',JSON.stringify(body_info));
    let res_result = await serverController.connectFetchController(`/api/complexes/${select_complexid}`,'GET');
    console.log('res_resultss::',res_result);
   
    if(res_result.data){
      // if(res_result.result.length > 0){
     
        setAddrjibun(res_result.data.addr_jibun);
        setAddrRoad(res_result.data.addr_road);
        setComplexname(res_result.data.complex_name);
  
        // temp_SelectComplexinfo.complexidchange({complexid: res_result.data.complex_id});
        // temp_SelectComplexinfo.bldpkchange({bldpk:res_result.data.bld_pk});
        // temp_SelectComplexinfo.complexnamechange({complexname:res_result.data.complex_name});
        // temp_SelectComplexinfo.dongcntchange({dongcnt:res_result.data.dong_cnt});
        // temp_SelectComplexinfo.addrjibunchange({addrjibun:res_result.data.addr_jibun});
        // temp_SelectComplexinfo.addrroadchange({addrroad:res_result.data.addr_road});
        // temp_SelectComplexinfo.developerchange({developer:res_result.data.developer});
        // temp_SelectComplexinfo.constructorchange({constructor:res_result.data.constructor});
        // temp_SelectComplexinfo.approvaldatechange({approvaldate:res_result.data.approval_date});
        // temp_SelectComplexinfo.totalparkingcntchange({totalparkcnt:res_result.data.total_parking_cnt});
        // temp_SelectComplexinfo.householdcntchange({householdcnt:res_result.data.household_cnt});
        // temp_SelectComplexinfo.xchange({x:res_result.data.x});
        // temp_SelectComplexinfo.ychange({y:res_result.data.y});
        // temp_SelectComplexinfo.heattypechange({heattype:res_result.data.heat_type});
        // temp_SelectComplexinfo.halltypechange({halltype:res_result.data.hall_type});
        // temp_SelectComplexinfo.bldtypechange({bldtype:res_result.data.bld_type});
      // }

    }

  }, []);//좀 다른 케이스로 실행되며, 상위요소가 랜더링시마다 요청하는것은 아니고, 상위요소에서 상위요소 변화없어도 이 요소를 모달창 불러오기로 누른경우도 있음.


  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <MUDialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MUDialogTitle>
    );
  };
  return (
    <Container>
      <MUDialog
        onClose={() => { setModalDanji(false) }}
        open={modalDanji}
        maxWidth={'lg'}
      // fullWidth={true}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { setModalDanji(false) }}>
          <Title>중개의뢰 가능한 단지 선택</Title>
        </BootstrapDialogTitle>

        <MUDialogContent>
          <Body>
            <SearchTitle>{complexname}</SearchTitle>
            <SearchResultAddress>
              {/*서울 서초구 반포동 20-43<br/>
                도로명) 서울시 서초구 신반포로 270*/}
                {addrjibun}<br />
                {addrRoad}
              </SearchResultAddress>
            </Body>
            <Question>선택하시겠습니까?</Question>
          </MUDialogContent>
          <DialogActions>
            <Buttons>
              <Button variant="contained" onClick={() => { setModalDanji(false) }}>취소</Button>
              <Button variant="contained" onClick={
                
                async () => {
                  console.log("여기 : " + modalDanji)
                  setModalDanji(false); setSelectInfo(true);
                 
                  let res_result = await serverController.connectFetchController(`/api/complexes/${select_complexid}`, 'GET');
                  console.log('res_resultss::', res_result);

                  if (res_result.data) {
                    // if(res_result.result.length > 0){

                    setAddrjibun(res_result.data.addr_jibun);
                    setAddrRoad(res_result.data.addr_road);
                    setComplexname(res_result.data.complex_name);

                    temp_SelectComplexinfo.complexidchange({ complexid: res_result.data.complex_id });
                    temp_SelectComplexinfo.bldpkchange({ bldpk: res_result.data.bld_pk });
                    temp_SelectComplexinfo.complexnamechange({ complexname: res_result.data.complex_name });
                    temp_SelectComplexinfo.dongcntchange({ dongcnt: res_result.data.dong_cnt });
                    temp_SelectComplexinfo.addrjibunchange({ addrjibun: res_result.data.addr_jibun });
                    temp_SelectComplexinfo.addrroadchange({ addrroad: res_result.data.addr_road });
                    temp_SelectComplexinfo.developerchange({ developer: res_result.data.developer });
                    temp_SelectComplexinfo.constructorchange({ constructor: res_result.data.constructor });
                    temp_SelectComplexinfo.approvaldatechange({ approvaldate: res_result.data.approval_date });
                    temp_SelectComplexinfo.totalparkingcntchange({ totalparkcnt: res_result.data.total_parking_cnt });
                    temp_SelectComplexinfo.householdcntchange({ householdcnt: res_result.data.household_cnt });
                    temp_SelectComplexinfo.xchange({ x: res_result.data.x });
                    temp_SelectComplexinfo.ychange({ y: res_result.data.y });
                    temp_SelectComplexinfo.heattypechange({ heattype: res_result.data.heat_type });
                    temp_SelectComplexinfo.halltypechange({ halltype: res_result.data.hall_type });
                    temp_SelectComplexinfo.bldtypechange({ bldtype: res_result.data.bld_type });

                  }

                }
              }>확인</Button>
            </Buttons>
          </DialogActions>
        </MUDialog>

      

          {/* <WrapModal>
            <ModalBg onClick={() => {setModalDanji(false)}}></ModalBg>
            <Modal>
              <FilterCloseBtn>
                <Link onClick={() => {setModalDanji(false)}}>
                  <FilterCloseImg src={Close}/>
                </Link>
              </FilterCloseBtn>
              <TopInfo>
                <Title>중개의뢰 가능한 단지 선택</Title>
              </TopInfo>
              <Body>
                <SearchTitle>{complexname}</SearchTitle>
                <SearchResultAddress>
                {addrjibun}<br/>
                도로명) {addrRoad}
                </SearchResultAddress>
              </Body>
              <Question>선택하시겠습니까?</Question>

              <Buttons>
              <Button variant="contained" onClick={() => { setModalDanji(false) }}>취소</Button>
              <Button variant="contained" onClick={() => {
                setModalDanji(false); setSelectInfo(true);

                console.log('선택 확인 정보:', temp_selectcomplexinfor);
              }}>확인</Button>
                
              </Buttons>

            </Modal>
          </WrapModal> */}



    </Container>
  );
}

const MUDialog = MUstyled(Dialog)`
 &.css-12xwtrv-MuiModal-root-MuiDialog-root {
   margin : 0 auto;
  }
  
`

const MUDialogTitle = styled(DialogTitle)``

const MUDialogContent = styled(DialogContent)`
  &.MuiDialogContent-root {
    height: auto;
    overflow-y:hidden;
    ${({ childrenIndex }) => {
    return childrenIndex ?
      `
      `
      :
      `
      padding: 0;
      `
  }}
  }
`


const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = styled.div`

`
const WrapModal = styled.div`
  width:100%;
  margin-bottom:40px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(40/428));
  }
`
const ModalBg = styled.div`
  width:100%;height:100%;
  position:fixed;left:0;top:0;
  background:rgba(0,0,0,0.2);
  display:block;content:'';
  z-index:3;
`
const Modal = styled.div`
  position:absolute;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:535px;border-radius:24px;
  border:1px solid #f2f2f2;
  background:#fff;
  padding:49px 50px 60px 50px;
  z-index:3;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(395/428));
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`
const FilterCloseBtn = styled.div`
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const FilterCloseImg = styled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(12/428));
  }
`
const TopInfo = styled.div`

`
const Title = styled.h3`
font-size:20px;font-weight:600;transform:skew(-0.1deg);
padding-bottom:22px;border-bottom:1px solid #a3a3a3;
`

const Body = styled.div`
  padding:44px 0;
  text-align:center;
  background:#fbfbfb;
  @media ${(props) => props.theme.modal} {
    padding:calc(100vw*(30/428)) 0;
  }
`
const SearchTitle = styled.p`
  font-size: 15px;
  line-height: 1.2;
  font-weight:500;
  font-family:'nbg',sans-serif;
  color: #4a4a4a;transform:skeW(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    line-height:1.33;
  }
`
const SearchResultAddress = styled(SearchTitle)`
`
const Question = styled(SearchTitle)`
  margin-top:30px;
  text-align:center;
  @media ${(props) => props.theme.modal} {
    margin-top:calc(100vw*(20/428));
  }
`
const Buttons = styled.div`
  width:100%;
  margin-top:55px;
  display:flex;justify-content:center;align-items:center;
`
const CancleBtn = styled.button`
  width:200px;height:66px;
  border: solid 3px #e4e4e4;
  background-color: #979797;
  text-align:center;
  color:#fff;font-size:20px;font-weight:800;
  transform:skew(-0.1deg);
  margin-right:8px;
  border-radius: 11px;
`
const MUCancleBtn = MUstyled(Button)`
  width:200px;height:66px;
  // border: solid 3px #e4e4e4;
  background-color: #979797;
  text-align:center;
  color:#fff;font-size:20px;font-weight:800;
  transform:skew(-0.1deg);
  margin-right:8px;
  // border-radius: 11px;
`


const MUConfirmBtn = MUstyled(MUCancleBtn)`
   border: solid 3px #04966d;
  background-color: #01684b;
  margin-right:0;
`


const ConfirmBtn = styled(CancleBtn)`
  border: solid 3px #04966d;
  background-color: #01684b;
  margin-right:0;
`