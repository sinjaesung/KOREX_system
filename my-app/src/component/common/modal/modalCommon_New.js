//react
import { findAllByTestId } from '@testing-library/dom';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import { styled as MUstyled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

//css
import styled from "styled-components"


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


export default function ModalCommon_New({ children, title, open, handleClose }) {

  return (
    <>
      <MUModal
        onClose={handleClose}
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </BootstrapDialogTitle>
        {children}
      </MUModal>
    </>
  );
}


const MUModal = styled(Dialog)`
& .MuiPaper-root.MuiDialog-paper{
  /* min-width: 300px; */
}
`


