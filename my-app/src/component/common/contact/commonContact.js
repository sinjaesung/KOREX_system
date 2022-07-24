// react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

// css
import styled from "styled-components";

//mateiral-ui
import Button from '@mui/material/Button';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';

const CommonContact = ({ contact, disable }) => {
  
  return (
    <>
        <MUButton disabled={disable} variant="outlined" disableElevation startIcon={<ChatIcon />}>
          <Link className="data_link" id='chat-button'/>
          채팅 상담
        </MUButton>
        <MUButton disabled={disable} variant="outlined" disableElevation startIcon={<PhoneIcon />}>
          <Link className="data_link" />
          전화 상담
        </MUButton>
    </>
  )
};

export default CommonContact;

const MUButton = styled(Button)``