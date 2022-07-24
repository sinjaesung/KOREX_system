//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled as MUstyled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

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

//server
import serverController from '../../../../../server/serverController';

import { temp_SelectComplexinfo } from '../../../../../store/actionCreators';
import {useSelector} from 'react-redux';

//필터 모달
export default function ModalDanjiSelect({modalDanji,setModalDanji,setSelectInfo,select_complexid, setActive}) {
    const [addrjibun,setAddrjibun] = useState('');
    const [addrRoad,setAddrRoad] = useState('');
    const [complexname,setComplexname] = useState('');
    
    const temp_selectcomplexinfo= useSelector(data => data.temp_selectComplexinfo);

    useEffect( async () => {
      //해당 넘어온 select_complexid에 대해서 정보 조회한다.

      let body_info={
        complex_id : select_complexid
      };
      let res_result= await serverController.connectFetchController('/api/matterial/complexdetail_search','POST',JSON.stringify(body_info));
      console.log('res_results:::',res_result);
      
      setAddrjibun(res_result.result[0].addr_jibun);
      setAddrRoad(res_result.result[0].addr_road);
      setComplexname(res_result.result[0].complex_name);
      

      temp_SelectComplexinfo.complexidchange({complexid: res_result.result[0].complex_id});
      temp_SelectComplexinfo.bldpkchange({bldpk:res_result.result[0].bld_pk});
      temp_SelectComplexinfo.complexnamechange({complexname:res_result.result[0].complex_name});//건물명 아파트,오피스텔명 / 상가사무실은 검색결과에서 단지건물명이 비어있는경우가 많이 있기에 그런경우에 따라 분기처리.
      temp_SelectComplexinfo.dongcntchange({dongcnt:res_result.result[0].dong_cnt});
      temp_SelectComplexinfo.addrjibunchange({addrjibun:res_result.result[0].addr_jibun});
      temp_SelectComplexinfo.addrroadchange({addrroad:res_result.result[0].addr_road});
      temp_SelectComplexinfo.developerchange({developer:res_result.result[0].developer});
      temp_SelectComplexinfo.constructorchange({constructor:res_result.result[0].constructor});
      temp_SelectComplexinfo.approvaldatechange({approvaldate:res_result.result[0].approval_date});
      temp_SelectComplexinfo.totalparkingcntchange({totalparkcnt:res_result.result[0].total_parking_cnt});
      temp_SelectComplexinfo.householdcntchange({householdcnt:res_result.result[0].household_cnt});
      temp_SelectComplexinfo.xchange({x:res_result.result[0].x});
      temp_SelectComplexinfo.ychange({y:res_result.result[0].y});
      temp_SelectComplexinfo.heattypechange({heattype:res_result.result[0].heat_type});
      temp_SelectComplexinfo.halltypechange({halltype:res_result.result[0].hall_type});
      temp_SelectComplexinfo.bldtypechange({bldtype:res_result.result[0].bld_type});
    },[]);

    

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
              <Button variant="contained" onClick={() => {
                setModalDanji(false); setSelectInfo(true);
                setActive(false);
                console.log('선택 확인 정보:', temp_selectcomplexinfo);
              }
              }>확인</Button>
            </Buttons>
          </DialogActions>


        </MUDialog>




          {/* <WrapModal>
            <ModalBg onClick={() => {setModalDanji(false)}}/>
            <Modal>
              <FilterCloseBtn onClick={() => {setModalDanji(false);}}>
                <FilterCloseImg src={Close}/>
              </FilterCloseBtn>
              <TopInfo>
                <Title>중개의뢰 가능한 단지 선택</Title>
              </TopInfo>
              <Body>
                <SearchTitle>{complexname}</SearchTitle>
                <SearchResultAddress>
 
                {addrjibun}<br/>
                {addrRoad}
                </SearchResultAddress>
              </Body>
              <Question>선택하시겠습니까?</Question>
              <Buttons>
                <CancelBtn type="button" onClick={() => {setModalDanji(false)}}>취소</CancelBtn>
                  <ConfirmBtn type="button" onClick={()=>{
                    setModalDanji(false);setSelectInfo(true);
                    setActive(false);
                    console.log('선택 확인 정보:',temp_selectcomplexinfo);
                  }
                  }>확인</ConfirmBtn>
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
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(395/428));
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`
const FilterCloseBtn = styled.div`
  cursor: pointer;
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const FilterCloseImg = styled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(12/428));
  }
`
const TopInfo = styled.div`

`
const Title = styled.h3`
font-size:20px;font-weight:600;transform:skew(-0.1deg);
padding-bottom:22px;
/* border-bottom:1px solid #a3a3a3; */
`
const Body = styled.div`
  padding:44px 0;
  text-align:center;
  background:#fbfbfb;
`
const SearchTitle = styled.p`
  font-size: 15px;
  line-height: 1.2;
  font-weight:500;
  font-family:'nbg',sans-serif;
  color: #4a4a4a;transform:skeW(-0.1deg);
`
const SearchResultAddress = styled(SearchTitle)`
`
const Question = styled(SearchTitle)`
  margin-top:30px;
  text-align:center;
`
const Buttons = styled.div`
  width:100%;
  margin-top:55px;
  display:flex;justify-content:center;align-items:center;
`
const CancelBtn = styled.button`
  width:200px;height:66px;
  border: solid 3px #e4e4e4;
  background-color: #979797;
  text-align:center;
  color:#fff;font-size:20px;font-weight:800;
  transform:skew(-0.1deg);
  margin-right:8px;
  border-radius: 11px;
`
const ConfirmBtn = styled(CancelBtn)`
  cursor: pointer;
  border: solid 3px #04966d;
  background-color: #01684b;
  margin-right:0;
`
