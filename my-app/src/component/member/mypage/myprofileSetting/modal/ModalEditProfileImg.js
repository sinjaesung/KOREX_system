//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"

//material-ui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled as MUstyled } from '@material-ui/core/styles';
//material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import EditIcon from '@mui/icons-material/Edit';

export default function XXX({ offModal, userprofile, setUserprofile, username, setUsername, edit, editButtonBox, editOffButtonBox, profileeditCheck}) {

  const [imgData, setImgData] = useState('');

  const handleListItemClick = (value) => {
    offModal(value); };

  const userprofileChange = (e) => {
    const {
      target: { files }
    } = e;
    const theFile = files[0];
    console.log('fielshcnagerss the fiess:', theFile);
    console.log('fiess:[0]', theFile);

    setUserprofile(theFile);

    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent;
      setImgData(result);
    }
  }

  //수정버튼 클릭시 저장버튼 변경
  const editCheck = () => {
    return editButtonBox;
  }
  // 저장버튼 클릭시 수정버튼으로 변경
  const editOffCheck = () => {
    return editOffButtonBox;
  }

  //수정버튼
  const btnlist = () => {
    switch (edit) {
      case 1: //상태가 조회인상태일때.(연필수정하기노출)
        return (
          <Link onClick={editCheck()}>
            {/* <EditImg src={EditBtn} /> */}
            <EditIcon/>
          </Link>
        );
        case 2: //상태가 수정버튼눌러서 저장중상태일때. (저장버튼노출)
        return (
          <Link onClick={editOffCheck()}>
            {/* <SaveImg src={SaveBtn} /> */}
            <SaveAltIcon/>
          </Link>
        );
      default: return null;
    }
  }

  const Input = MUstyled('input')({
    display: 'none',
  });

  return (
    <>
      {/* <Dialog onClose={handleClose} open={open}>
      <DialogTitle>프로필 사진 바꾸기</DialogTitle> */}

      <label htmlFor="contained-button-file">
        <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={userprofileChange}/>
        <Button variant="contained" component="span">
          Upload
        </Button>
      </label>
      {btnlist()}
      {/* <label htmlFor="file222">
        <MUButton variant="contained" component="span">테스트</MUButton>
      </label> */}
      {/* <Button variant="contained" component="label">Upload File<input type="file" hidden /></Button> */}
      {/* </Dialog> */}
    </>
  );
}
