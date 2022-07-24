import React, { useState, useEffect } from "react";

//css
import styled from "styled-components"

//material-ui
import { styled as MUstyled } from '@mui/material/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';

//component
import BootstrapDialogTitle from "./bootstrapDialogTitle";

function Modal_AddressApi({ children, title, open, handleOpen, handleCheck }) {

    return (
        <>
            <Dialog
                className="muDlog-postApi"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={() => {handleOpen && handleOpen(false); handleCheck && handleCheck(false);}}>
                    {title}
                </BootstrapDialogTitle>
                <DialogContent className="muDlogCont-postApi">
                    <Typography>
                       {children}
                    </Typography>
                </DialogContent>
            </Dialog>
        </>
    )
}

export { Modal_AddressApi }

const MUDialog = styled(Dialog)`
& .MuiPaper-root.MuiDialog-paper{
  min-width: 300px;
}
`