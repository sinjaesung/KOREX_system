//react
import { findAllByTestId } from '@testing-library/dom';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

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

//css
import styled from "styled-components"

import Close from '../../../img/main/modal_close.png';
import ArrowDown from '../../../img/member/arrow_down.png';
import { ButtonBase } from '@material-ui/core';

// submit = {show:true , title:"확인" , event : ()=>{}}
// cancle = {show:true , title:"확인" , event : ()=>{}}
// content = {type:"text", component : </> , text:"test"}
// title = "title"
//필터 모달


//기존에 show,setShow,title,submit,cancle,confirm,content 이렇게 데이터를 전부 전달 받았는데 이걸 하나로 합쳐서 사용할게요
// modalOption = {show,setShow,title,submit,cancle,confirm,content} 이렇게요.
export default function ModalCommon({ modalOption, value }) {

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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
      </DialogTitle>
    );
  };

  const body = document.querySelector('html');
  if (modalOption.show == true) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = 'auto';
  }

  const closeModal = () => { modalOption.setShow(false); body.style.overflow = 'scroll'; }
  const bgnone = () => {
    if (bgnone == false) {
      return "background:rgba(0,0,0,0)"
    } else {
      return "background:rgba(0,0,0,0.2)"
    }
  }


  function modalConfirm() {
    console.log(modalOption);
  }


  if (value) {
    console.log(value);
    console.log(value);
  }

  if (modalOption.show == false)
    return null;
  //Filter 모달창
  return (
    <>
      <MUModal
        onClose={closeModal}
        open={modalOption}
      >
        {/* 타이틀 */}
        <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
          {
            modalOption.title ?
              // <ModalFilterTitle>{modalOption.title}</ModalFilterTitle>
              modalOption.title
              :
              null
          }

        </BootstrapDialogTitle>

        {/* 컨탠츠 */}
        <MUDialogContent>
          <Typography >
            {
              modalOption.content ?
                modalOption.content.type == "text" ?
                  <Text>{modalOption.content.text}</Text>
                  :
                  modalOption.content.component
                :
                null

            }
          </Typography>
        </MUDialogContent>


        {/*  버튼 */}
        { modalOption.cancle ||
          modalOption.submit ||
          modalOption.submitnone ||
          modalOption.confirm ||
          modalOption.confirmgreen ||
          modalOption.confirmgreennone ?

          <DialogActions>
            {
              modalOption.cancle && modalOption.cancle.show ?
                <MUButton type="button" name="" onClick={() => { modalOption.cancle.event(value) }}>{modalOption.cancle.title}</MUButton>
                :
                null
            }
            {
              modalOption.submit && modalOption.submit.show ?

                <MUButton type="button" name="" onClick={() => { modalOption.submit.event(value) }}>
                  <Link to={modalOption.submit.link} className="data_link" />
                  {modalOption.submit.title}
                </MUButton>
                :
                null
            }
            {
              modalOption.submitnone && modalOption.submitnone.show ?
                <MUButton type="button" name="" onClick={() => { modalOption.submitnone.event(value) }}>{modalOption.submitnone.title}</MUButton>
                :
                null
            }
            {
              modalOption.confirm && modalOption.confirm.show ?

                modalOption.confirm.active ?
                  <MUConfirmBtnGreen name="" onClick={() => { modalOption.confirm.event(value); modalConfirm(value); }}>
                    {modalOption.confirm.title}
                  </MUConfirmBtnGreen>
                  :
                  <MUConfirmBtn name="" onClick={() => { modalOption.confirm.event(value); modalConfirm(value); }}>
                    {modalOption.confirm.title}
                  </MUConfirmBtn>
                // <ConfirmBtnGreen type="button" name="" onClick={() => { modalOption.confirm.event(value); modalConfirm(value); }}>
                //   {modalOption.confirm.title}
                // </ConfirmBtnGreen>
                // :
                // <ConfirmBtn type="button" name="" onClick={() => { modalOption.confirm.event(value); modalConfirm(value); }}>
                //   {modalOption.confirm.title}
                // </ConfirmBtn>
                :
                null
            }
            {
              modalOption.confirmgreen && modalOption.confirmgreen.show ?
                <Wrap>
                  <Link to={modalOption.confirmgreen.link} className="data_link" />
                  <ConfirmBtnGreen type="button" name="" onClick={() => { modalOption.confirmgreen.event(value) }}>{modalOption.confirmgreen.title}</ConfirmBtnGreen>
                </Wrap>
                :
                null
            }
            {
              modalOption.confirmgreennone && modalOption.confirmgreennone.show ?
                <ConfirmBtnGreen type="button" name="" onClick={() => { modalOption.confirmgreennone.event(value) }}>{modalOption.confirmgreennone.title}</ConfirmBtnGreen>
                :
                null
            }
          </DialogActions>
          :
          null
        }

      </MUModal>
    </>
  );
}

const MUConfirmBtnGreen = MUstyled(Button)`
  width:100%;margin-left:0;
`
const MUConfirmBtn = MUstyled(Button)`
  width:100%;
`

const MUModal = styled(Dialog)`
& .MuiPaper-root.MuiDialog-paper{
  min-width: 300px;
}
`

const MUDialogContent = styled(DialogContent)`
  //width: 100%;
  /* height: 65vh; */
`
const MUButton = styled(Button)``

//----------------------------------------------


const WrapModalMap = styled.div`
width: 100%;
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

const Text = styled.p`
  line-height:1.5;
  font-size:15px;
  color:#4a4a4a;transform:skew(-0.1deg);
  padding:2rem;text-align:center;white-space: pre-wrap;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(14/428));
    padding:calc(100vw*(70/428)) 0;
  }
`

const FilterSelectSort = styled.div`
  width:100%;

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
const SaveBtn = styled(Button)`
`
// const SaveBtn = Sstyled(ResetBtn)`
//   background:#01684b;
//   border:3px solid #04966d;
//   margin-left:8px;
//   @media ${(props) => props.theme.modal} {
//     margin-left:calc(100vw*(10/428));

//   }
// `
const ConfirmBtn = styled(ResetBtn)`
  width:100%;
`
const ConfirmBtnGreen = styled(SaveBtn)`
  width:100%;margin-left:0;
`