//react
import { findAllByTestId } from '@testing-library/dom';
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

import Close from '../../../img/main/modal_close.png';
import ArrowDown from '../../../img/member/arrow_down.png';

// submit = {show:true , title:"확인" , event : ()=>{}}
// cancle = {show:true , title:"확인" , event : ()=>{}}
// content = {type:"text", component : </> , text:"test"}
// title = "title"
//필터 모달


//기존에 show,setShow,title,submit,cancle,confirm,content 이렇게 데이터를 전부 전달 받았는데 이걸 하나로 합쳐서 사용할게요
// modalOption = {show,setShow,title,submit,cancle,confirm,content} 이렇게요.
export default function ModalLiveSetting({modalOption}) {

   const body = document.querySelector('html');
  if(modalOption.show == true){
    body.style.overflow = 'hidden';
  }else{
    body.style.overflow = 'auto';
  }

  const closeModal = () =>{ modalOption.setShow(false); body.style.overflow = 'scroll'; }
  const bgnone=()=>{
    if(bgnone == false) {
      return "background:rgba(0,0,0,0)"
    }else{
      return "background:rgba(0,0,0,0.2)"
    }
  }

  if(modalOption.show == false)
    return null;
  //Filter 모달창
    return (
        <Container>
          <WrapFilterModal>
            <ModalFilterBg onClick={closeModal} bgnone={bgnone}/>
            <ModalFilter>
              <FilterCloseBtn>
                <div onClick={closeModal} className="cursor-p">
                  <FilterCloseImg src={Close}/>
                </div>
              </FilterCloseBtn>
              {
                modalOption.title ?
                <ModalFilterTitle>{modalOption.title}</ModalFilterTitle>
                :
                null
              }
              <WrapFilterSelect>
                {
                  modalOption.content ?
                  modalOption.content.type == "text" ?
                    <Text>{modalOption.content.text}</Text>
                    :
                    modalOption.content.component
                  :
                  null

                }
              </WrapFilterSelect>
              {/*버튼*/}
              <WrapFilterButtons>
              {
                modalOption.cancle && modalOption.cancle.show ?
                <ResetBtn type="button" name="" onClick={()=>{modalOption.cancle.event()}}>{modalOption.cancle.title}</ResetBtn>
                :
                null
              }
              {
                modalOption.submit && modalOption.submit.show ?
                <Link to={modalOption.submit.link}>
                  <SaveBtn type="button" name="" onClick={()=>{modalOption.submit.event()}}>{modalOption.submit.title}</SaveBtn>
                </Link>
                :
                null
              }
              {
                modalOption.submitnone && modalOption.submitnone.show ?
                  <SaveBtn type="button" name="" onClick={()=>{modalOption.submitnone.event()}}>{modalOption.submitnone.title}</SaveBtn>
                :
                null
              }
              {
                modalOption.confirm && modalOption.confirm.show ? 
                
                modalOption.confirm.active ?
                  <ConfirmBtnGreen type="button" name="" onClick={()=>{modalOption.confirm.event()}}>
                    {modalOption.confirm.title}
                    </ConfirmBtnGreen>
                  :
                  <ConfirmBtn type="button" name="" onClick={()=>{modalOption.confirm.event()}}>
                    {modalOption.confirm.title}
                    </ConfirmBtn>
                :
                null
              }
              {
                modalOption.confirmgreen && modalOption.confirmgreen.show ?
                <Wrap>
                  <Link to={modalOption.confirmgreen.link} className="data_link"/>
                  <ConfirmBtnGreen type="button" name="" onClick={()=>{modalOption.confirmgreen.event()}}>{modalOption.confirmgreen.title}</ConfirmBtnGreen>
                </Wrap>
              :
                null
              }
              {
                modalOption.confirmgreennone && modalOption.confirmgreennone.show ?
                  <ConfirmBtnGreen type="button" name="" onClick={()=>{modalOption.confirmgreennone.event()}}>{modalOption.confirmgreennone.title}</ConfirmBtnGreen>
              :
                null
              }

              </WrapFilterButtons>
            </ModalFilter>
          </WrapFilterModal>
        </Container>
  );
}

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
const WrapModalMap = styled.div`
  width:100%;
`
const ModalMapBg = styled.div`
  width:100%;height:100%;
  position:fixed;left:0;top:0;
  background:rgba(0,0,0,0.05);
  display:block;content:'';
  z-index:1002;
`
const ModalMap = styled.div`
  position:fixed;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:535px;border-radius:24px;
  border:1px solid #f2f2f2;
  background:#fff;
  padding:49px 50px 60px 50px;
  z-index:1003;box-shadow: 0 0 10px 1px rgb(0 0 0 / 10%);
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(395/428));
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`
const MapCloseBtn = styled.div`
  width:100%;text-align:right;
  margin-bottom:22px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(22/428));
  }
`
const MapCloseImg = styled.img`
  display:inline-block;width:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(12/428));
  }
`
const ModalMapTitle = styled.h3`
  font-size:20px;font-weight:800;color:#707070;
  transform:skew(-0.1deg);
  padding-bottom:20px;
  border-bottom:1px solid #707070;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    padding-bottom:calc(100vw*(15/428));
  }
`

const InMapBox = styled.div`
  width:100%;height:100%;
  background:#eee;
`
const WrapFilterModal = styled(WrapModalMap)`
`
const ModalFilterBg = styled(ModalMapBg)`
`
const ModalFilter = styled(ModalMap)`
`
const FilterCloseBtn = styled(MapCloseBtn)`
`
const FilterCloseImg = styled(MapCloseImg)`
`
const ModalFilterTitle = styled(ModalMapTitle)`
  margin-bottom:12px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(12/428));
  }
`
const Text = styled.p`
  line-height:1.5;
  font-size:15px;
  color:#4a4a4a;transform:skew(-0.1deg);
  padding:80px 0;text-align:center;white-space: pre-wrap;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    padding:calc(100vw*(70/428)) 0;
  }
`
const WrapFilterSelect = styled.div`
  width:100%;
`
const FilterBox = styled.div`
  position:relative;
  width:100%;
  margin-bottom:20px;
  &:last-child{margin-bottom:0;}
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(20/428));
  }
`
const FilterLabel = styled.label`
  display:inline-block;
  font-size:12px;color:#4a4a4a;
  transform:skew(-0.1deg);
  font-family:'nbg', sans-serif;
  margin-bottom:9px;
  padding-left:3px;
  @media ${(props) => props.theme.modal} {
    margin-bottom:calc(100vw*(9/428));
    font-size:calc(100vw*(12/428));
    padding-left:calc(100vw*(3/428));
  }
`
const FilterSelectSort = styled.div`
  width:100%;

`
const FilterSelectCondition = styled(FilterSelectSort)`
  z-index:99;
`
const FilterSelectSortList = styled.select`
  width:100%;
  height:43px;
  text-align-last:center;
  font-size:15px;color:#4a4a4a;transform:skew(-0.1deg);
  border-radius:4px;border:1px solid #a3a3a3;
  background:#fff;
  appearance:none;
  background:url(${ArrowDown}) no-repeat 400px center;background-size:11px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    height:calc(100vw*(43/428));
    background:url(${ArrowDown}) no-repeat 90% center;background-size:calc(100vw*(11/428));
  }
`
const Option = styled.option`
  font-family:'nbg',sans-serif;

`
const InOption = styled(Option)`
  padding:8px 0;
  background:#fff;
  &:hover{background:#f8f7f7;}
  @media ${(props) => props.theme.modal} {
    padding:calc(100vw*(8/428)) 0;
  }
`
const FilterSelectConditionList = styled(FilterSelectSortList)`
`
const WrapFilterButtons = styled.div`
  width:100%;
  display:flex;justify-content:space-between;align-items:center;
`
const Wrap = styled.div`
  width:100%;position:relative;
`
const ResetBtn = styled.button`
  width: 200px;
  height: 66px;
  border-radius: 11px;
  border: solid 3px #e4e4e4;
  background: #979797;
  line-height:60px;color:#fff;
  font-size:20px;font-weight:800;transform:skew(-0.1deg);
  text-align:center;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(180/428));
    height:calc(100vw*(60/428));
    line-height:calc(100vw*(54/428));
    font-size:calc(100vw*(15/428));
  }
`
const SaveBtn = styled(ResetBtn)`
  background:#01684b;
  border:3px solid #04966d;
  margin-left:8px;
  @media ${(props) => props.theme.modal} {
    margin-left:calc(100vw*(10/428));

  }
`
const ConfirmBtn = styled(ResetBtn)`
  width:100%;
`
const ConfirmBtnGreen = styled(SaveBtn)`
  width:100%;margin-left:0;
`
const ConfirmBtnGreenNoneLink = styled(ConfirmBtnGreen)`
`