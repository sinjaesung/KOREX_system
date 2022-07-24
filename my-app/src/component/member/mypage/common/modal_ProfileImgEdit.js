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

//component
import BootstrapDialogTitle from "../../../common/modal/bootstrapDialogTitle";

function Modal_ProfileImgEdit({ open, handleOpen, setProfileImg }) {

    const [imgData, setImgData] = useState('');

    const profileImgChange = (e) => {
        const {
          target: { files }
        } = e;
        const theFile = files[0];
        console.log('fielshcnagerss the fiess:', theFile);
        console.log('fiess:[0]', theFile);
    
        setProfileImg(theFile);
    
        const reader = new FileReader();
        reader.readAsDataURL(theFile);
        reader.onloadend = (finishedEvent) => {
          const { currentTarget: { result } } = finishedEvent;
          setImgData(result);
        }
      }

    return (
        <>
            <MUDialog open={open}>
                <BootstrapDialogTitle onClose={() => handleOpen(false)}>
                    프로필사진 수정
                </BootstrapDialogTitle>
                <DialogContent>
                    <MenuList>
                        <input accept="image/*" style={{ display: 'none' }} id="profile-img-file" multiple type="file" onChange={profileImgChange} />
                        <label htmlFor="profile-img-file">
                            <MenuItem component="span" button onClick={() => console.log('ok')}>
                                <ListItemText>사진 업로드</ListItemText>
                            </MenuItem>
                        </label>
                        <MenuItem>
                            <ListItemText color="error">현재 사진 취소</ListItemText>
                        </MenuItem>
                    </MenuList>
                </DialogContent>
            </MUDialog>
        </>
    )

}

export { Modal_ProfileImgEdit }

const MUDialog = styled(Dialog)`
& .MuiPaper-root.MuiDialog-paper{
  min-width: 300px;
}
`