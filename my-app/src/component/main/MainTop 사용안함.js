//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"
import MainTopImg from '../../img/main/main_top.png';

export default function MainBody() {
  return (
    <>
      <div className="tAlign-c">
        <Title>부동산 전속매물 플랫폼</Title>
      </div>
    </>
  );
}

const Title = styled.p`
    font-size:2.5rem;

    @media ${(props) => props.theme.breakpoints.md} {
      font-size:2.2rem;
    }
    @media ${(props) => props.theme.breakpoints.sm} {
      font-size:1.8rem;
    }
    color:${(props) => props.theme.palette.primary.main};   
`
